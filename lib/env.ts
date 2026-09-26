const MIN_SECRET_LENGTH = 32;
const PLACEHOLDER_PATTERN = /(replace|example|changeme|placeholder|cambia|genera|casuale|todo|qui|your[-_ ]?(secret|key|token|password)|xxxxx*)/i;

export const isProduction = process.env.NODE_ENV === 'production';

let trustWarningIssued = false;

export function getTrustedProxyHops() {
  const hops = Number.parseInt(process.env.TRUSTED_PROXY_HOPS ?? '0', 10);
  return Number.isFinite(hops) && hops > 0 ? Math.min(hops, 5) : 0;
}

export function trustsPlatformHeaders() {
  return process.env.TRUST_PLATFORM_HEADERS === '1';
}

export function logClientIpTrustWarning() {
  if (trustWarningIssued) return;
  if (getTrustedProxyHops() > 0 || trustsPlatformHeaders()) return;
  trustWarningIssued = true;
  const message =
    'Nessuna sorgente IP fidata configurata: tutti i client condividono lo stesso bucket di rate limit. ' +
    'Imposta TRUSTED_PROXY_HOPS (proxy che riscrive x-forwarded-for) oppure TRUST_PLATFORM_HEADERS=1 ' +
    'su Vercel/Cloudflare.';
  if (isProduction) {
    console.error(`Noir Lounge: ${message}`);
  }
}

type Check = { ok: true; value: string } | { ok: false; reason: string };

function checkSecret(): Check {
  const value = process.env.NEXTAUTH_SECRET?.trim() ?? '';
  if (!value) return { ok: false, reason: 'NEXTAUTH_SECRET non configurata.' };
  if (value.length < MIN_SECRET_LENGTH) {
    return { ok: false, reason: `NEXTAUTH_SECRET deve avere almeno ${MIN_SECRET_LENGTH} caratteri.` };
  }
  if (PLACEHOLDER_PATTERN.test(value)) {
    return { ok: false, reason: 'NEXTAUTH_SECRET sembra un placeholder: genera un valore casuale (openssl rand -base64 48).' };
  }
  return { ok: true, value };
}

function checkAuthUrl(): Check {
  const value = process.env.NEXTAUTH_URL?.trim() ?? '';
  if (!value) return { ok: false, reason: 'NEXTAUTH_URL non configurata.' };
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return { ok: false, reason: 'NEXTAUTH_URL non valida.' };
  }
  if (isProduction && url.protocol !== 'https:') {
    return { ok: false, reason: 'NEXTAUTH_URL deve usare https in produzione.' };
  }
  return { ok: true, value: url.origin };
}

let warned = false;

export function getAuthConfigurationProblems(): string[] {
  const problems: string[] = [];
  const secret = checkSecret();
  if (!secret.ok) problems.push(secret.reason);
  const url = checkAuthUrl();
  if (!url.ok) problems.push(url.reason);
  return problems;
}

export function assertAuthConfiguration() {
  const problems = getAuthConfigurationProblems();
  if (problems.length === 0) return;
  if (isProduction) {
    throw new Error(`Configurazione di autenticazione non sicura: ${problems.join(' ')}`);
  }
  if (!warned) {
    warned = true;
    console.error(
      `Noir Lounge: ${problems.join(' ')} Lo sviluppo locale continua, la produzione sarà bloccata.`
    );
  }
}

export function getAuthSecret(): string | undefined {
  const secret = checkSecret();
  return secret.ok ? secret.value : undefined;
}

export function getTrustedSiteOrigin(): string | null {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return null;
  }
}

export function safeCompare(a: string | undefined | null, b: string | undefined | null) {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}
