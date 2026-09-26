import { NextResponse } from 'next/server';
import { getTrustedSiteOrigin } from '@/lib/env';

export const MAX_JSON_BODY_BYTES = 16 * 1024;

function normalizeHost(value: string | null | undefined) {
  if (!value) return null;
  const first = value.split(',')[0]?.trim();
  if (!first) return null;
  try {
    return new URL(`https://${first}`).host.toLowerCase();
  } catch {
    return null;
  }
}

function collectAllowedHosts(request: Request) {
  const hosts = new Set<string>();
  for (const candidate of [
    request.headers.get('host'),
    request.headers.get('x-forwarded-host'),
    getTrustedSiteOrigin()
  ]) {
    const host = normalizeHost(candidate);
    if (host) hosts.add(host);
  }
  return hosts;
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get('origin')?.trim();
  if (!origin || origin.toLowerCase() === 'null') return true;
  let originHost: string;
  try {
    originHost = new URL(origin).host.toLowerCase();
  } catch {
    return false;
  }
  const hosts = collectAllowedHosts(request);
  if (hosts.size === 0) return false;
  return hosts.has(originHost);
}

export function rejectCrossOriginRequest(request: Request) {
  if (isSameOriginRequest(request)) return null;
  return NextResponse.json({ error: 'Cerere nepermisă.' }, { status: 403 });
}

export type JsonBodyResult =
  | { ok: true; data: unknown }
  | { ok: false; status: number; error: string };

export async function readJsonBody(request: Request, maxBytes = MAX_JSON_BODY_BYTES): Promise<JsonBodyResult> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return { ok: false, status: 415, error: 'Content-Type nesuportat.' };
  }

  const declaredLength = Number.parseInt(request.headers.get('content-length') ?? '', 10);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return { ok: false, status: 413, error: 'Cerere prea mare.' };
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return { ok: false, status: 400, error: 'Cerere nevalidă.' };
  }

  if (new TextEncoder().encode(raw).byteLength > maxBytes) {
    return { ok: false, status: 413, error: 'Cerere prea mare.' };
  }

  try {
    return { ok: true, data: JSON.parse(raw) as unknown };
  } catch {
    return { ok: false, status: 400, error: 'Cerere nevalidă.' };
  }
}

export function noStoreJson(data: unknown, init: ResponseInit = {}) {
  const response = NextResponse.json(data, init);
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  return response;
}
