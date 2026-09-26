import assert from 'node:assert/strict';
import test from 'node:test';
import { isSameOriginRequest, readJsonBody } from '../lib/request-security';

const post = (body: string, headers: Record<string, string> = { 'content-type': 'application/json' }) =>
  new Request('https://noirlounge.it/api/newsletter', { method: 'POST', headers, body });

test('accetta le richieste same-origin', () => {
  const request = new Request('https://noirlounge.it/api/menu', {
    method: 'POST',
    headers: { host: 'noirlounge.it', origin: 'https://noirlounge.it' }
  });
  assert.equal(isSameOriginRequest(request), true);
});

test('rifiuta le richieste cross-origin', () => {
  const request = new Request('https://noirlounge.it/api/menu', {
    method: 'POST',
    headers: { host: 'noirlounge.it', origin: 'https://evil.example' }
  });
  assert.equal(isSameOriginRequest(request), false);
});

test('rifiuta origini malformate', () => {
  const request = new Request('https://noirlounge.it/api/menu', {
    method: 'POST',
    headers: { host: 'noirlounge.it', origin: 'not-a-url' }
  });
  assert.equal(isSameOriginRequest(request), false);
});

test('le richieste senza Origin (server-to-server) restano ammesse', () => {
  assert.equal(isSameOriginRequest(post('{}')), true);
  const nullOrigin = post('{}', { 'content-type': 'application/json', origin: 'null' });
  assert.equal(isSameOriginRequest(nullOrigin), true);
});

test('considera x-forwarded-host del proxy', () => {
  const request = new Request('https://noirlounge.it/api/menu', {
    method: 'POST',
    headers: { host: 'internal.local', 'x-forwarded-host': 'noirlounge.it', origin: 'https://noirlounge.it' }
  });
  assert.equal(isSameOriginRequest(request), true);
});

test('readJsonBody valida il content-type', async () => {
  const result = await readJsonBody(post('{"a":1}', { 'content-type': 'text/plain' }));
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.status, 415);
});

test('readJsonBody rifiuta i JSON malformati', async () => {
  const result = await readJsonBody(post('{not json'));
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.status, 400);
});

test('readJsonBody rifiuta i body troppo grandi', async () => {
  const oversized = JSON.stringify({ notes: 'x'.repeat(20_000) });
  const result = await readJsonBody(post(oversized), );
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.status, 413);

  const declared = await readJsonBody(post('{}', { 'content-type': 'application/json', 'content-length': '999999' }));
  assert.equal(declared.ok, false);
  if (!declared.ok) assert.equal(declared.status, 413);
});

test('readJsonBody restituisce i dati validi', async () => {
  const result = await readJsonBody(post('{"email":"a@b.it"}'));
  assert.equal(result.ok, true);
  if (result.ok) assert.deepEqual(result.data, { email: 'a@b.it' });
});
