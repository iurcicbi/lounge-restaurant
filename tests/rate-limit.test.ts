import assert from 'node:assert/strict';
import test from 'node:test';
import {
  authThrottleKey,
  checkRateLimit,
  clearAuthFailures,
  getClientIp,
  isAuthBlocked,
  registerAuthFailure,
  requestKey
} from '../lib/rate-limit';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test('blocca oltre il limite e si sblocca alla scadenza', async () => {
  const key = `test:${Date.now()}:limit`;
  assert.equal(checkRateLimit(key, 2, 60_000).allowed, true);
  assert.equal(checkRateLimit(key, 2, 60_000).allowed, true);
  const blocked = checkRateLimit(key, 2, 60_000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);
  assert.ok(blocked.resetAt > Date.now());

  const shortKey = `test:${Date.now()}:window`;
  assert.equal(checkRateLimit(shortKey, 1, 20).allowed, true);
  assert.equal(checkRateLimit(shortKey, 1, 20).allowed, false);
  await sleep(40);
  assert.equal(checkRateLimit(shortKey, 1, 20).allowed, true);
});

test('le chiavi sono indipendenti', () => {
  const stamp = Date.now();
  assert.equal(checkRateLimit(`a:${stamp}`, 1, 60_000).allowed, true);
  assert.equal(checkRateLimit(`b:${stamp}`, 1, 60_000).allowed, true);
  assert.equal(checkRateLimit(`a:${stamp}`, 1, 60_000).allowed, false);
});

test('throttle sui tentativi di accesso', () => {
  const key = authThrottleKey('203.0.113.10', 'admin@noirlounge.it');
  clearAuthFailures(key);
  assert.equal(isAuthBlocked(key).allowed, true);
  for (let attempt = 0; attempt < 5; attempt += 1) registerAuthFailure(key);
  const blocked = isAuthBlocked(key);
  assert.equal(blocked.allowed, false);
  clearAuthFailures(key);
  assert.equal(isAuthBlocked(key).allowed, true);
});

test('il throttle è legato sia a IP che a email', () => {
  const stamp = Date.now();
  const first = authThrottleKey('198.51.100.5', `uno${stamp}@noirlounge.it`);
  const second = authThrottleKey('198.51.100.6', `due${stamp}@noirlounge.it`);
  for (let attempt = 0; attempt < 5; attempt += 1) registerAuthFailure(first);
  assert.equal(isAuthBlocked(first).allowed, false);
  assert.equal(isAuthBlocked(second).allowed, true);
});

test('non si fida di header IP spoofabili senza configurazione esplicita', () => {
  const previousHops = process.env.TRUSTED_PROXY_HOPS;
  const previousPlatform = process.env.TRUST_PLATFORM_HEADERS;
  process.env.TRUSTED_PROXY_HOPS = '0';
  delete process.env.TRUST_PLATFORM_HEADERS;

  assert.equal(getClientIp({ 'x-forwarded-for': '1.1.1.1, 2.2.2.2' }), 'anonymous');
  assert.equal(getClientIp({ 'cf-connecting-ip': '203.0.113.7' }), 'anonymous');
  assert.equal(getClientIp({ 'x-vercel-forwarded-for': '203.0.113.8' }), 'anonymous');
  assert.equal(getClientIp({ 'x-real-ip': '203.0.113.9' }), 'anonymous');

  process.env.TRUST_PLATFORM_HEADERS = '1';
  assert.equal(getClientIp({ 'cf-connecting-ip': '203.0.113.7' }), '203.0.113.7');
  assert.equal(getClientIp({ 'x-vercel-forwarded-for': '203.0.113.8' }), '203.0.113.8');

  if (previousHops === undefined) delete process.env.TRUSTED_PROXY_HOPS;
  else process.env.TRUSTED_PROXY_HOPS = previousHops;
  if (previousPlatform === undefined) delete process.env.TRUST_PLATFORM_HEADERS;
  else process.env.TRUST_PLATFORM_HEADERS = previousPlatform;
});

test('con un hop fidato usa l\'ultimo indirizzo utile', () => {
  const previous = process.env.TRUSTED_PROXY_HOPS;
  process.env.TRUSTED_PROXY_HOPS = '1';
  assert.equal(getClientIp({ 'x-forwarded-for': '9.9.9.9, 203.0.113.20' }), '203.0.113.20');
  assert.equal(getClientIp({ 'x-forwarded-for': '203.0.113.21' }), '203.0.113.21');
  process.env.TRUSTED_PROXY_HOPS = '2';
  assert.equal(getClientIp({ 'x-forwarded-for': '9.9.9.9, 8.8.8.8, 203.0.113.21' }), '8.8.8.8');
  if (previous === undefined) delete process.env.TRUSTED_PROXY_HOPS;
  else process.env.TRUSTED_PROXY_HOPS = previous;
});

test('ignora header malformati', () => {
  const previous = process.env.TRUSTED_PROXY_HOPS;
  process.env.TRUSTED_PROXY_HOPS = '1';
  assert.equal(getClientIp({ 'x-forwarded-for': 'not-an-ip' }), 'untrusted-forwarded');
  process.env.TRUSTED_PROXY_HOPS = '0';
  delete process.env.TRUST_PLATFORM_HEADERS;
  assert.equal(getClientIp({ 'x-forwarded-for': 'not-an-ip' }), 'anonymous');
  assert.equal(getClientIp(null), 'anonymous');
  if (previous === undefined) delete process.env.TRUSTED_PROXY_HOPS;
  else process.env.TRUSTED_PROXY_HOPS = previous;
});

test('requestKey legge gli header della richiesta', () => {
  const previous = process.env.TRUSTED_PROXY_HOPS;
  const previousPlatform = process.env.TRUST_PLATFORM_HEADERS;
  process.env.TRUSTED_PROXY_HOPS = '0';
  process.env.TRUST_PLATFORM_HEADERS = '1';
  const request = new Request('https://noirlounge.it/api/newsletter', {
    method: 'POST',
    headers: { 'cf-connecting-ip': '198.51.100.30' }
  });
  assert.equal(requestKey(request), '198.51.100.30');
  if (previous === undefined) delete process.env.TRUSTED_PROXY_HOPS;
  else process.env.TRUSTED_PROXY_HOPS = previous;
  if (previousPlatform === undefined) delete process.env.TRUST_PLATFORM_HEADERS;
  else process.env.TRUST_PLATFORM_HEADERS = previousPlatform;
});
