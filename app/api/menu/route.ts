import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, hasCapability, isStaffSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { readJsonBody, rejectCrossOriginRequest } from '@/lib/request-security';
import { menuItemSchema } from '@/lib/validations';
import MenuItem from '@/models/MenuItem';
import { menuItems as fallbackMenu } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CATEGORIES = ['cucina', 'cocktails', 'shisha'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const includeUnavailable = searchParams.get('includeUnavailable') === 'true';
  if (includeUnavailable) {
    const session = await getServerSession(authOptions);
    if (!isStaffSession(session)) {
      return NextResponse.json({ error: 'Autentificare necesară.' }, { status: 401 });
    }
    if (!hasCapability(session, 'menu:read')) {
      return NextResponse.json({ error: 'Permisiuni insuficiente.' }, { status: 403 });
    }
  }

  const validCategory = category && CATEGORIES.includes(category) ? category : null;
  const publicFallback = () => {
    const scoped = validCategory ? fallbackMenu.filter((item) => item.category === validCategory) : fallbackMenu;
    return includeUnavailable ? scoped : scoped.filter((item) => item.available !== false);
  };

  try {
    await connectToDatabase();
    const query = {
      ...(validCategory ? { category: validCategory } : {}),
      ...(includeUnavailable ? {} : { available: true })
    };
    const items = await MenuItem.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
    const response = NextResponse.json({
      items: items.length ? items : publicFallback(),
      source: items.length ? 'database' : 'fallback'
    });
    if (includeUnavailable) {
      response.headers.set('Cache-Control', 'private, no-store, max-age=0');
    }
    return response;
  } catch {
    return NextResponse.json({ items: publicFallback(), source: 'fallback' });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!isStaffSession(session)) {
    return NextResponse.json({ error: 'Autentificare necesară.' }, { status: 401 });
  }
  if (!hasCapability(session, 'menu:write')) {
    return NextResponse.json({ error: 'Permisiuni insuficiente.' }, { status: 403 });
  }

  const crossOrigin = rejectCrossOriginRequest(request);
  if (crossOrigin) return crossOrigin;

  const body = await readJsonBody(request);
  if (!body.ok) {
    return NextResponse.json({ error: body.error }, { status: body.status });
  }

  const parsed = menuItemSchema.safeParse(body.data);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Verifică datele preparatului.' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const item = await MenuItem.create(parsed.data);
    return NextResponse.json({ item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Nu a fost posibil să salvăm preparatul.' }, { status: 503 });
  }
}
