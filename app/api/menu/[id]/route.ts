import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { authOptions, hasCapability, isStaffSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { readJsonBody, rejectCrossOriginRequest } from '@/lib/request-security';
import { menuItemSchema } from '@/lib/validations';
import MenuItem from '@/models/MenuItem';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!isStaffSession(session)) {
    return NextResponse.json({ error: 'Autentificare necesară.' }, { status: 401 });
  }
  if (!hasCapability(session, 'menu:write')) {
    return NextResponse.json({ error: 'Permisiuni insuficiente.' }, { status: 403 });
  }
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Identificator nevalid.' }, { status: 400 });
  }

  const crossOrigin = rejectCrossOriginRequest(request);
  if (crossOrigin) return crossOrigin;

  const body = await readJsonBody(request);
  if (!body.ok) {
    return NextResponse.json({ error: body.error }, { status: body.status });
  }

  const parsed = menuItemSchema.partial().safeParse(body.data);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datele preparatului nu sunt valide.' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const item = await MenuItem.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
    if (!item) {
      return NextResponse.json({ error: 'Preparat negăsit.' }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: 'Nu a fost posibil să actualizăm preparatul.' }, { status: 503 });
  }
}

export async function DELETE(request: Request, { params }: Context) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!isStaffSession(session)) {
    return NextResponse.json({ error: 'Autentificare necesară.' }, { status: 401 });
  }
  if (!hasCapability(session, 'menu:write')) {
    return NextResponse.json({ error: 'Permisiuni insuficiente.' }, { status: 403 });
  }
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Identificator nevalid.' }, { status: 400 });
  }

  const crossOrigin = rejectCrossOriginRequest(request);
  if (crossOrigin) return crossOrigin;

  try {
    await connectToDatabase();
    const deleted = await MenuItem.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ error: 'Preparat negăsit.' }, { status: 404 });
    }
    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json({ error: 'Nu a fost posibil să ștergem preparatul.' }, { status: 503 });
  }
}
