import assert from 'node:assert/strict';
import test from 'node:test';
import type { Session } from 'next-auth';
import { hasCapability, isStaffSession, isStaffRole } from '../lib/auth';

const sessionFor = (role?: string) =>
  ({ user: { role }, expires: '2099-01-01' } as unknown as Session);

test('riconosce i ruoli staff', () => {
  assert.equal(isStaffRole('admin'), true);
  assert.equal(isStaffRole('concierge'), true);
  assert.equal(isStaffRole('user'), false);
  assert.equal(isStaffRole(undefined), false);
  assert.equal(isStaffSession(sessionFor('admin')), true);
  assert.equal(isStaffSession(sessionFor('concierge')), true);
  assert.equal(isStaffSession(sessionFor('user')), false);
  assert.equal(isStaffSession(null), false);
});

test('admin ha tutti i permessi', () => {
  const session = sessionFor('admin');
  for (const capability of [
    'reservations:read',
    'reservations:write',
    'reservations:delete',
    'menu:read',
    'menu:write'
  ] as const) {
    assert.equal(hasCapability(session, capability), true, capability);
  }
});

test('concierge non gestisce il menu né le cancellazioni', () => {
  const session = sessionFor('concierge');
  assert.equal(hasCapability(session, 'reservations:read'), true);
  assert.equal(hasCapability(session, 'reservations:write'), true);
  assert.equal(hasCapability(session, 'menu:read'), true);
  assert.equal(hasCapability(session, 'menu:write'), false);
  assert.equal(hasCapability(session, 'reservations:delete'), false);
});

test('nessun permesso senza ruolo valido', () => {
  for (const role of [undefined, 'user', 'admin ', '']) {
    const session = sessionFor(role);
    assert.equal(hasCapability(session, 'reservations:read'), false);
    assert.equal(hasCapability(session, 'menu:write'), false);
  }
  assert.equal(hasCapability(null, 'reservations:read'), false);
});
