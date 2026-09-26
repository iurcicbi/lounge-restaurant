import { Resend } from 'resend';
import { VENUE_TIME_ZONE } from '@/lib/validations';

type ReservationEmail = {
  name: string;
  email: string;
  date: Date | string;
  time: string;
  guests: number;
  occasion?: string;
  notes?: string;
};

type EmailResult = {
  sent: boolean;
  skipped: boolean;
};

function formatEmailDate(value: Date | string) {
  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'full',
    timeZone: VENUE_TIME_ZONE
  }).format(new Date(value));
}

export async function sendReservationEmails(reservation: ReservationEmail): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const reservationTo = process.env.RESERVATION_TO;
  if (!apiKey || !from || !reservationTo) {
    return { sent: false, skipped: true };
  }

  const resend = new Resend(apiKey);
  const dateLabel = formatEmailDate(reservation.date);
  const occasion = reservation.occasion || 'Nessuna occasione speciale';
  const notes = reservation.notes || 'Nessuna nota aggiuntiva';
  const clientText = `Ciao ${reservation.name},\n\nLa tua richiesta per Noir Lounge è stata ricevuta.\n\nData: ${dateLabel}\nOra: ${reservation.time}\nOspiti: ${reservation.guests}\nOccasione: ${occasion}\nNote: ${notes}\n\nIl nostro concierge ti contatterà per confermare il tavolo. A presto,\nNoir Lounge`;
  const teamText = `Nuova richiesta dal sito Noir Lounge\n\nOspite: ${reservation.name}\nEmail: ${reservation.email}\nData: ${dateLabel}\nOra: ${reservation.time}\nOspiti: ${reservation.guests}\nOccasione: ${occasion}\nNote: ${notes}`;

  const clientResult = await resend.emails.send({
    from,
    to: reservation.email,
    subject: 'La tua richiesta è stata ricevuta — Noir Lounge',
    text: clientText
  });
  if (clientResult.error) throw new Error(clientResult.error.message);

  const teamResult = await resend.emails.send({
    from,
    to: reservationTo,
    subject: `Nuova prenotazione — ${reservation.name}`,
    text: teamText
  });
  if (teamResult.error) throw new Error(teamResult.error.message);

  return { sent: true, skipped: false };
}
