import { getTrustedProxyHops, trustsPlatformHeaders } from '@/lib/env';

type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitStore = Map<string, Bucket>;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

const MAX_BUCKETS = 10_000;
const SWEEP_INTERVAL_MS = 30_000;
const AUTH_FAILURE_LIMIT = 5;
const AUTH_FAILURE_WINDOW_MS = 15 * 60_000;
const IP_PATTERN = /^[0-9a-f:.]{3,45}$/i;

const globalStore = globalThis as typeof globalThis & { noirRateLimit?: RateLimitStore };
const store: RateLimitStore = globalStore.noirRateLimit ?? new Map();

if (!globalStore.noirRateLimit) {
  globalStore.noirRateLimit = store;
}

let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  store.forEach((bucket, key) => {
    if (bucket.resetAt <= now) store.delete(key);
  });
}

function evictOverflow() {
  if (store.size <= MAX_BUCKETS) return;
  const excess = store.size - MAX_BUCKETS;
  let removed = 0;
  store.forEach((_bucket, key) => {
    if (removed >= excess) return;
    store.delete(key);
    removed += 1;
  });
}

export function checkRateLimit(key: string, limit = 8, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  sweep(now);
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    evictOverflow();
    return { allowed: true, remaining: Math.max(limit - 1, 0), resetAt };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  return { allowed: true, remaining: Math.max(limit - current.count, 0), resetAt: current.resetAt };
}

export function peekRateLimit(key: string, limit = 8, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    return { allowed: true, remaining: limit, resetAt: now + windowMs };
  }
  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }
  return { allowed: true, remaining: limit - current.count, resetAt: current.resetAt };
}

function headerValue(
  headers: Headers | Record<string, string | string[] | undefined> | null | undefined,
  name: string
) {
  if (!headers) return null;
  if (typeof (headers as Headers).get === 'function') return (headers as Headers).get(name);
  const record = headers as Record<string, string | string[] | undefined>;
  const value = record[name] ?? record[name.toLowerCase()];
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function firstValidIp(value: string | null | undefined) {
  if (!value) return null;
  for (const part of value.split(',')) {
    const candidate = part.trim().toLowerCase();
    if (IP_PATTERN.test(candidate)) return candidate;
  }
  return null;
}

export function getClientIp(
  headers: Headers | Record<string, string | string[] | undefined> | null | undefined
): string {
  const hops = getTrustedProxyHops();
  const platformOnly = hops === 0 && trustsPlatformHeaders();

  if (platformOnly) {
    const platformIp =
      firstValidIp(headerValue(headers, 'cf-connecting-ip')) ??
      firstValidIp(headerValue(headers, 'x-vercel-forwarded-for'));
    return platformIp ?? 'anonymous';
  }

  const forwarded = headerValue(headers, 'x-forwarded-for');
  if (hops > 0) {
    if (forwarded) {
      const parts = forwarded.split(',').map((part) => part.trim().toLowerCase());
      const index = parts.length - hops;
      const candidate = index >= 0 ? parts[index] : undefined;
      if (candidate && IP_PATTERN.test(candidate)) return candidate;
      return 'untrusted-forwarded';
    }
    const realIp = firstValidIp(headerValue(headers, 'x-real-ip'));
    if (realIp) return realIp;
  }

  return 'anonymous';
}

export function requestKey(request: Request) {
  return getClientIp(request.headers);
}

export function authThrottleKey(ip: string, email: string) {
  return `${ip}|${email}`;
}

export function isAuthBlocked(key: string, limit = AUTH_FAILURE_LIMIT, windowMs = AUTH_FAILURE_WINDOW_MS) {
  return peekRateLimit(`auth-fail:${key}`, limit, windowMs);
}

export function registerAuthFailure(key: string, limit = AUTH_FAILURE_LIMIT, windowMs = AUTH_FAILURE_WINDOW_MS) {
  return checkRateLimit(`auth-fail:${key}`, limit, windowMs);
}

export function clearAuthFailures(key: string) {
  store.delete(`auth-fail:${key}`);
}
