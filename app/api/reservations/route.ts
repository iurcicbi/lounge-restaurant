import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { authOptions, hasCapability, isStaffSession } from '@/lib/auth';
import { checkRateLimit, requestKey } from '@/lib/rate-limit';
import { noStoreJson, readJsonBody, rejectCrossOriginRequest } from '@/lib/request-security';
import { checkSlotAvailability } from '@/lib/reservations';
import { isValidReservationSlot, parseVenueDateTime, reservationSchema } from '@/lib/validations';
import { sendReservationEmails } from '@/lib/email';
import Reservation from '@/models/Reservation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!isStaffSession(session)) {
    return noStoreJson({ error: 'Autenticazione richiesta.' }, { status: 401 });
  }
  if (!hasCapability(session, 'reservations:read')) {
    return noStoreJson({ error: 'Permessi insufficienti.' }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const query = status && ['pending', 'confirmed', 'seated', 'cancelled'].includes(status) ? { status } : {};
    const reservations = await Reservation.find(query).sort({ date: 1, createdAt: -1 }).limit(250).lean();
    return noStoreJson({ reservations });
  } catch {
    return noStoreJson({ error: 'Database non disponibile.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const crossOrigin = rejectCrossOriginRequest(request);
  if (crossOrigin) return crossOrigin;

  const rate = checkRateLimit(`reservation:${requestKey(request)}`, 5, 10 * 60_000);
  if (!rate.allowed) {
    return noStoreJson({ error: 'Troppe richieste. Riprova tra qualche minuto.' }, { status: 429 });
  }

  const body = await readJsonBody(request);
  if (!body.ok) {
    return noStoreJson({ error: body.error }, { status: body.status });
  }

  const parsed = reservationSchema.safeParse(body.data);
  if (!parsed.success) {
    return noStoreJson(
      { error: 'Controlla i dati inseriti.', fields: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const input = parsed.data;
  if (input.website) {
    return noStoreJson(
      {
        message: 'Richiesta ricevuta. Il concierge ti contatterà a breve.',
        emailSent: false,
        reservation: { id: null, status: 'pending' }
      },
      { status: 201 }
    );
  }

  const requestedAt = parseVenueDateTime(input.date, input.time);
  if (!requestedAt || !isValidReservationSlot(input.date, input.time) || requestedAt.getTime() <= Date.now()) {
    return noStoreJson({ error: 'Scegli una data e un orario disponibili.' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const availability = await checkSlotAvailability({
      email: input.email,
      date: requestedAt,
      time: input.time,
      guests: input.guests
    });
    if (!availability.available) {
      const message =
        availability.reason === 'duplicate'
          ? 'Hai già inviato una richiesta per questo orario. Ti contatteremo a breve.'
          : 'Questo orario è al completo. Scegli un altro orario disponibile.';
      return noStoreJson({ error: message }, { status: 409 });
    }

    const reservation = await Reservation.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      date: requestedAt,
      time: input.time,
      guests: input.guests,
      occasion: input.occasion || '',
      notes: input.notes || '',
      source: 'website'
    });

    let emailSent = false;
    try {
      const emailResult = await sendReservationEmails({
        name: reservation.name,
        email: reservation.email,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        occasion: reservation.occasion,
        notes: reservation.notes
      });
      emailSent = emailResult.sent;
    } catch (error) {
      process.stderr.write(
        `Noir Lounge: email non inviata. ${error instanceof Error ? error.message : 'errore sconosciuto'}\n`
      );
    }

    return noStoreJson(
      {
        message: emailSent
          ? 'Richiesta ricevuta. Il concierge ti contatterà a breve.'
          : 'Richiesta salvata. Il concierge ti contatterà a breve.',
        emailSent,
        reservation: { id: reservation._id, status: reservation.status }
      },
      { status: 201 }
    );
  } catch {
    return noStoreJson({ error: 'Non è stato possibile salvare la prenotazione.' }, { status: 503 });
  }
}
