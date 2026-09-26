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
  return new Intl.DateTimeFormat('ro-RO', {
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
  const occasion = reservation.occasion || 'Fără ocazie specială';
  const notes = reservation.notes || 'Fără note suplimentare';
  const clientText = `Bună, ${reservation.name},\n\nCererea ta pentru Noir Lounge a fost primită.\n\nData: ${dateLabel}\nOra: ${reservation.time}\nOaspeți: ${reservation.guests}\nOcazie: ${occasion}\nNote: ${notes}\n\nConcierge-ul nostru te va contacta pentru a confirma masa. Te așteptăm,\nNoir Lounge`;
  const teamText = `Cerere nouă de pe site-ul Noir Lounge\n\nOaspete: ${reservation.name}\nEmail: ${reservation.email}\nData: ${dateLabel}\nOra: ${reservation.time}\nOaspeți: ${reservation.guests}\nOcazie: ${occasion}\nNote: ${notes}`;

  const clientResult = await resend.emails.send({
    from,
    to: reservation.email,
    subject: 'Cererea ta a fost primită — Noir Lounge',
    text: clientText
  });
  if (clientResult.error) throw new Error(clientResult.error.message);

  const teamResult = await resend.emails.send({
    from,
    to: reservationTo,
    subject: `Rezervare nouă — ${reservation.name}`,
    text: teamText
  });
  if (teamResult.error) throw new Error(teamResult.error.message);

  return { sent: true, skipped: false };
}
