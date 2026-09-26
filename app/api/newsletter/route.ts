import { connectToDatabase } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { noStoreJson, readJsonBody, rejectCrossOriginRequest } from '@/lib/request-security';
import { newsletterSchema } from '@/lib/validations';
import NewsletterSubscriber from '@/models/NewsletterSubscriber';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const crossOrigin = rejectCrossOriginRequest(request);
  if (crossOrigin) return crossOrigin;

  const rate = checkRateLimit(`newsletter:${getClientIp(request.headers)}`, 3, 60 * 60_000);
  if (!rate.allowed) {
    return noStoreJson({ error: 'Ai făcut deja mai multe cereri. Încearcă mai târziu.' }, { status: 429 });
  }

  const body = await readJsonBody(request, 4 * 1024);
  if (!body.ok) {
    return noStoreJson({ error: body.error }, { status: body.status });
  }

  const parsed = newsletterSchema.safeParse(body.data);
  if (!parsed.success) {
    return noStoreJson({ error: 'Introdu o adresă de e-mail validă.' }, { status: 400 });
  }

  if (parsed.data.website) {
    return noStoreJson({ message: 'Ești pe lista Noir.' }, { status: 201 });
  }

  try {
    await connectToDatabase();
    await NewsletterSubscriber.findOneAndUpdate(
      { email: parsed.data.email },
      { $setOnInsert: { email: parsed.data.email, consentAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return noStoreJson({ message: 'Ești pe lista Noir.' }, { status: 201 });
  } catch (error: unknown) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 11000) {
      return noStoreJson({ message: 'Ești pe lista Noir.' }, { status: 201 });
    }
    return noStoreJson({ error: 'Abonarea nu este disponibilă în acest moment.' }, { status: 503 });
  }
}
