import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, hasCapability } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { safeCompare } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store, max-age=0', 'X-Robots-Tag': 'noindex, nofollow' };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('deep') !== '1') {
    return NextResponse.json({ status: 'ok' }, { headers: NO_STORE });
  }
  return readinessResponse(request);
}

export async function HEAD(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('deep') !== '1') {
    return new NextResponse(null, { status: 200, headers: NO_STORE });
  }
  const response = await readinessResponse(request);
  return new NextResponse(null, { status: response.status, headers: NO_STORE });
}

async function readinessResponse(request: Request) {
  const session = await getServerSession(authOptions);
  const token = request.headers.get('x-health-token');
  const authorized =
    hasCapability(session, 'reservations:read') || safeCompare(token, process.env.HEALTHCHECK_TOKEN);
  if (!authorized) {
    return NextResponse.json({ status: 'unauthorized' }, { status: 401, headers: NO_STORE });
  }

  try {
    await connectToDatabase();
    return NextResponse.json({ status: 'ok', database: 'connected' }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ status: 'degraded', database: 'unavailable' }, { status: 503, headers: NO_STORE });
  }
}
