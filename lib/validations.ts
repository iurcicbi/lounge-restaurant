import { z } from 'zod';

export const VENUE_TIME_ZONE = 'Europe/Rome';

function parseCalendarDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (candidate.getUTCFullYear() !== year || candidate.getUTCMonth() !== month - 1 || candidate.getUTCDate() !== day) return null;
  return { year, month, day };
}

function parseClockTime(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

function getTimeZoneOffset(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: VENUE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date);
  const values = new Map(parts.map((part) => [part.type, part.value]));
  const year = Number(values.get('year'));
  const month = Number(values.get('month'));
  const day = Number(values.get('day'));
  const hour = Number(values.get('hour'));
  const minute = Number(values.get('minute'));
  const second = Number(values.get('second'));
  return Date.UTC(year, month - 1, day, hour, minute, second) - date.getTime();
}

export function isValidCalendarDate(value: string) {
  return Boolean(parseCalendarDate(value));
}

export function isValidClockTime(value: string) {
  return Boolean(parseClockTime(value));
}

export function parseVenueDateTime(dateValue: string, timeValue: string) {
  const date = parseCalendarDate(dateValue);
  const time = parseClockTime(timeValue);
  if (!date || !time) return null;
  const localTimestamp = Date.UTC(date.year, date.month - 1, date.day, time.hour, time.minute);
  const initialOffset = getTimeZoneOffset(new Date(localTimestamp));
  let result = new Date(localTimestamp - initialOffset);
  const correctedOffset = getTimeZoneOffset(result);
  if (correctedOffset !== initialOffset) result = new Date(localTimestamp - correctedOffset);
  return result;
}

export function getVenueDateString(value = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: VENUE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(value);
  const values = new Map(parts.map((part) => [part.type, part.value]));
  return `${values.get('year')}-${values.get('month')}-${values.get('day')}`;
}

function formatSlot(minutes: number) {
  const normalized = minutes % (24 * 60);
  const hour = Math.floor(normalized / 60).toString().padStart(2, '0');
  const minute = (normalized % 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

export function getReservationTimeSlots(dateValue: string) {
  const date = parseCalendarDate(dateValue);
  if (!date) return [];
  const weekday = new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
  if (weekday === 1) return [];
  const start = weekday === 0 ? 18 * 60 + 30 : 19 * 60;
  const closing = weekday === 0 ? 60 + 30 : weekday === 5 || weekday === 6 ? 3 * 60 + 30 : 2 * 60;
  const end = closing < start ? closing + 24 * 60 : closing;
  const lastStart = end - 30;
  const slots: string[] = [];
  for (let minutes = start; minutes <= lastStart; minutes += 30) slots.push(formatSlot(minutes));
  return slots;
}

export function isValidReservationSlot(dateValue: string, timeValue: string) {
  return getReservationTimeSlots(dateValue).includes(timeValue);
}

export const reservationSchema = z.object({
  name: z.string().trim().min(2, 'Introdu numele tău.').max(80, 'Numele este prea lung.'),
  email: z.string().trim().toLowerCase().email('Introdu o adresă de e-mail validă.'),
  phone: z.string().trim().min(7, 'Introdu un număr de telefon valid.').max(30, 'Numărul este prea lung.'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Alege o dată validă.').refine(isValidCalendarDate, 'Alege o dată validă.'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Alege o oră validă.').refine(isValidClockTime, 'Alege o oră validă.'),
  guests: z.number({ invalid_type_error: 'Alege numărul de oaspeți.' }).int().min(1).max(20),
  occasion: z.string().trim().max(80, 'Ocazia este prea lungă.').optional().or(z.literal('')),
  notes: z.string().trim().max(600, 'Notele nu pot depăși 600 de caractere.').optional().or(z.literal('')),
  website: z.string().max(200).optional().or(z.literal(''))
}).superRefine((value, context) => {
  if (!isValidReservationSlot(value.date, value.time)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['time'], message: 'Alege o oră disponibilă pentru această dată.' });
  }
});

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email('Introdu o adresă de e-mail validă.'),
  consent: z.boolean().refine((value) => value, 'Acceptă prelucrarea datelor pentru a primi invitații.'),
  website: z.string().max(200).optional().or(z.literal(''))
});

const approvedImageUrl = z.string().trim().max(2000).refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'lh3.googleusercontent.com';
  } catch {
    return false;
  }
}, 'Folosește o imagine HTTPS de Googleusercontent.');

export const menuItemSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(5).max(500),
  price: z.number().positive().max(10000),
  category: z.enum(['cucina', 'cocktails', 'shisha']),
  image: approvedImageUrl.optional().or(z.literal('')),
  tags: z.array(z.string().trim().min(1).max(40)).max(6).default([]),
  pairing: z.string().trim().max(120).optional().or(z.literal('')),
  available: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(10000).optional()
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type MenuItemInput = z.infer<typeof menuItemSchema>;
