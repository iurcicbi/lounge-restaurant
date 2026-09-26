import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getReservationTimeSlots,
  isValidReservationSlot,
  menuItemSchema,
  newsletterSchema,
  parseVenueDateTime,
  reservationSchema
} from '../lib/validations';

const validReservation = {
  name: 'Giulia Bianchi',
  email: 'giulia@example.it',
  phone: '+39 333 000 0000',
  date: '2026-09-29',
  time: '20:00',
  guests: 2,
  occasion: '',
  notes: ''
};

test('accetta una prenotazione valida', () => {
  const result = reservationSchema.safeParse(validReservation);
  assert.equal(result.success, true);
});

test('rifiuta il lunedì (giorno di chiusura)', () => {
  const result = reservationSchema.safeParse({ ...validReservation, date: '2026-09-28' });
  assert.equal(result.success, false);
  assert.deepEqual(getReservationTimeSlots('2026-09-28'), []);
});

test('rifiuta orari fuori dal servizio', () => {
  assert.equal(isValidReservationSlot('2026-09-29', '20:00'), true);
  assert.equal(isValidReservationSlot('2026-09-29', '12:00'), false);
  const result = reservationSchema.safeParse({ ...validReservation, time: '12:00' });
  assert.equal(result.success, false);
});

test('il honeypot website supera la validazione ma resta scartabile dal server', () => {
  const spam = reservationSchema.safeParse({ ...validReservation, website: 'https://spam.example' });
  assert.equal(spam.success, true);
  if (spam.success) assert.equal(spam.data.website, 'https://spam.example');
  assert.equal(reservationSchema.safeParse({ ...validReservation, website: '' }).success, true);
  assert.equal(reservationSchema.safeParse(validReservation).success, true);
  assert.equal(reservationSchema.safeParse({ ...validReservation, website: 'x'.repeat(500) }).success, false);
});

test('rifiuta numeri di ospiti fuori dal limite consentito', () => {
  assert.equal(reservationSchema.safeParse({ ...validReservation, guests: 0 }).success, false);
  assert.equal(reservationSchema.safeParse({ ...validReservation, guests: 21 }).success, false);
  assert.equal(reservationSchema.safeParse({ ...validReservation, guests: 2.5 }).success, false);
});

test('ignora chiavi sconosciute e campi pericolosi', () => {
  const polluted: Record<string, unknown> = { ...validReservation, status: 'confirmed', $where: 'this' };
  Object.defineProperty(polluted, '__proto__', { value: { admin: true }, enumerable: true });
  const result = reservationSchema.safeParse(polluted);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal('status' in result.data, false);
    assert.equal('$where' in result.data, false);
    assert.equal(Object.getPrototypeOf(result.data), Object.prototype);
  }
});

test('la newsletter richiede il consenso e tollera il honeypot', () => {
  assert.equal(newsletterSchema.safeParse({ email: 'a@b.it', consent: false }).success, false);
  assert.equal(newsletterSchema.safeParse({ email: 'a@b.it', consent: true }).success, true);
  const spam = newsletterSchema.safeParse({ email: 'a@b.it', consent: true, website: 'spam' });
  assert.equal(spam.success, true);
  if (spam.success) assert.equal(spam.data.website, 'spam');
});

test('il menu accetta solo immagini HTTPS Googleusercontent', () => {
  const base = { name: 'Negroni', description: 'Gin, Campari, vermouth rosso', price: 14, category: 'cocktails' };
  assert.equal(menuItemSchema.safeParse({ ...base, image: 'https://lh3.googleusercontent.com/a' }).success, true);
  assert.equal(menuItemSchema.safeParse({ ...base, image: 'http://lh3.googleusercontent.com/a' }).success, false);
  assert.equal(menuItemSchema.safeParse({ ...base, image: 'https://evil.example/a.png' }).success, false);
  assert.equal(menuItemSchema.safeParse({ ...base, image: 'javascript:alert(1)' }).success, false);
  assert.equal(menuItemSchema.safeParse({ ...base, category: 'unknown' }).success, false);
});

test('normalizza le email per evitare duplicati', () => {
  const result = reservationSchema.safeParse({ ...validReservation, email: '  Giulia@Example.IT ' });
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.email, 'giulia@example.it');

  const newsletter = newsletterSchema.safeParse({ email: '  Ospite@Example.IT ', consent: true });
  assert.equal(newsletter.success, true);
  if (newsletter.success) assert.equal(newsletter.data.email, 'ospite@example.it');
});

test('parseVenueDateTime gestisce ora legale italiana', () => {
  const winter = parseVenueDateTime('2026-01-15', '20:00');
  const summer = parseVenueDateTime('2026-07-15', '20:00');
  assert.ok(winter);
  assert.ok(summer);
  assert.equal(winter!.toISOString(), '2026-01-15T19:00:00.000Z');
  assert.equal(summer!.toISOString(), '2026-07-15T18:00:00.000Z');
  assert.equal(parseVenueDateTime('2026-02-30', '20:00'), null);
  assert.equal(parseVenueDateTime('2026-01-15', '25:00'), null);
});
