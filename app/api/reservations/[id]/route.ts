import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { authOptions, hasCapability, isStaffSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { noStoreJson, readJsonBody, rejectCrossOriginRequest } from '@/lib/request-security';
import { checkSlotAvailability } from '@/lib/reservations';
import Reservation from '@/models/Reservation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_STATUSES = ['pending', 'confirmed', 'seated', 'cancelled'];
const OCCUPYING_STATUSES = ['confirmed', 'seated'];

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!isStaffSession(session)) {
    return noStoreJson({ error: 'Autenticazione richiesta.' }, { status: 401 });
  }
  if (!hasCapability(session, 'reservations:write')) {
    return noStoreJson({ error: 'Permessi insufficienti.' }, { status: 403 });
  }

  if (!Types.ObjectId.isValid(id)) {
    return noStoreJson({ error: 'Identificativo non valido.' }, { status: 400 });
  }

  const crossOrigin = rejectCrossOriginRequest(request);
  if (crossOrigin) return crossOrigin;

  const body = await readJsonBody(request);
  if (!body.ok) {
    return noStoreJson({ error: body.error }, { status: body.status });
  }

  const status = (body.data as { status?: unknown } | null)?.status;
  if (typeof status !== 'string' || !ALLOWED_STATUSES.includes(status)) {
    return noStoreJson({ error: 'Stato non valido.' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    if (OCCUPYING_STATUSES.includes(status)) {
      const current = await Reservation.findById(id).select({ email: 1, date: 1, time: 1, guests: 1 }).lean<{
        email?: string;
        date?: Date;
        time?: string;
        guests?: number;
      }>();
      if (!current) {
        return noStoreJson({ error: 'Prenotazione non trovata.' }, { status: 404 });
      }
      const availability = await checkSlotAvailability({
        email: current.email ?? '',
        date: current.date as Date,
        time: current.time ?? '',
        guests: current.guests ?? 1,
        excludeId: id
      });
      if (!availability.available) {
        return noStoreJson({ error: 'Slot al completo, prenotazione non confermata.' }, { status: 409 });
      }
    }

    const reservation = await Reservation.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!reservation) {
      return noStoreJson({ error: 'Prenotazione non trovata.' }, { status: 404 });
    }
    return noStoreJson({ reservation });
  } catch {
    return noStoreJson({ error: 'Database non disponibile.' }, { status: 503 });
  }
}

export async function DELETE(request: Request, { params }: Context) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!isStaffSession(session)) {
    return noStoreJson({ error: 'Autenticazione richiesta.' }, { status: 401 });
  }
  if (!hasCapability(session, 'reservations:delete')) {
    return noStoreJson({ error: 'Permessi insufficienti.' }, { status: 403 });
  }

  if (!Types.ObjectId.isValid(id)) {
    return noStoreJson({ error: 'Identificativo non valido.' }, { status: 400 });
  }

  const crossOrigin = rejectCrossOriginRequest(request);
  if (crossOrigin) return crossOrigin;

  try {
    await connectToDatabase();
    const reservation = await Reservation.findByIdAndDelete(id).lean();
    if (!reservation) {
      return noStoreJson({ error: 'Prenotazione non trovata.' }, { status: 404 });
    }
    return noStoreJson({ deleted: true });
  } catch {
    return noStoreJson({ error: 'Database non disponibile.' }, { status: 503 });
  }
}
