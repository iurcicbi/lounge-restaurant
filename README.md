# Noir Lounge

Sito del lounge: home, menu, prenotazioni, eventi, newsletter e pannello di controllo per lo staff.
Next.js 16 (App Router) · NextAuth v4 (Credentials) · MongoDB/Mongoose · Resend · Tailwind.

## Prerequisiti

- Node.js >= 20.9
- Un cluster MongoDB (Atlas o self-hosted)
- Un account Resend con dominio mittente verificato

## Setup locale

```bash
npm ci
cp .env.example .env.local
```

Genera i segreti:

```bash
openssl rand -base64 48          # -> NEXTAUTH_SECRET
npm run db:hash                  # -> SEED_ADMIN_PASSWORD_HASH (richiede lunghezza >= 12)
openssl rand -base64 32          # -> HEALTHCHECK_TOKEN
```

Compila `.env.local` (vedi `/.env.example` per l'elenco completo), poi:

```bash
npm run db:seed                  # crea l'account staff e il menu iniziale
npm run dev
```

`npm run db:seed` non accetta password in chiaro e non sovrascrive un account staff esistente:
per cambiare la password usa `npm run db:seed -- --force` con un nuovo `SEED_ADMIN_PASSWORD_HASH`.
Lasciando vuote `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD_HASH` il seed esegue solo il menu.

Attenzione alla precedenza: se `ADMIN_EMAIL` e `ADMIN_PASSWORD_HASH` sono valorizzate, il login usa
l'account definito in variabile d'ambiente e **ignora** l'account MongoDB con la stessa email
(il seed avvisa). Usa un canale solo: per ruoli e revoca è consigliato MongoDB.

## Variabili d'ambiente

| Variabile | Obbligatoria | Descrizione |
| --- | --- | --- |
| `MONGODB_URI` | sì | Stringa di connessione MongoDB |
| `NEXTAUTH_URL` | sì in produzione | URL HTTPS del sito, usato per i redirect e la protezione CSRF |
| `NEXTAUTH_SECRET` | sì in produzione | Minimo 32 caratteri, non un placeholder: firma le sessioni |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` | facoltative | Account staff definito in variabile d'ambiente (durata 1 h, nessuna revoca fine-grained) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD_HASH` | per il seed | Credenziali usate solo da `npm run db:seed` per creare l'account su MongoDB |
| `RESEND_API_KEY`, `EMAIL_FROM`, `RESERVATION_TO` | per le email | Invio delle email di prenotazione |
| `NEXT_PUBLIC_SITE_URL` | sì in produzione | URL canonico: va impostata **prima della build** (è inline nelle variabili `NEXT_PUBLIC_*`) |
| `HEALTHCHECK_TOKEN` | consigliata | Consente il probe di readiness `/api/health?deep=1` |
| `TRUSTED_PROXY_HOPS` | raccomandata | Numero di proxy fidati che riscrivono `x-forwarded-for` (1 = nginx/Cloudflare/Vercel, 0 = disattivo) |
| `TRUST_PLATFORM_HEADERS` | facoltativa | `1` per fidarsi di `cf-connecting-ip`/`x-vercel-forwarded-for` invece di `x-forwarded-for` |
| `RESERVATION_SLOT_CAPACITY` | no | Posti massimi per fascia oraria (default 40, max 200) |

In produzione l'avvio fallisce immediatamente (hook `instrumentation.ts`) se `NEXTAUTH_SECRET` è
assente, troppo corto, contiene un placeholder, oppure se `NEXTAUTH_URL` non è HTTPS. In sviluppo la
stessa verifica emette solo un avviso. Senza `TRUSTED_PROXY_HOPS`/`TRUST_PLATFORM_HEADERS` il server
segnala che tutti i client condividono lo stesso bucket di rate limit.

## Comandi

| Comando | Descrizione |
| --- | --- |
| `npm run dev` | Server di sviluppo |
| `npm run build` / `npm start` | Build e avvio in produzione |
| `npm run lint` | ESLint (config flat in `eslint.config.mjs`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Test `node:test` su validazioni, rate limit, request security e permessi |
| `npm run check` | lint + typecheck + test |
| `npm run audit:prod` | `npm audit` sulle sole dipendenze di produzione |
| `npm run db:seed` | Seed menu + account staff (operazione distruttiva sulle password) |
| `npm run db:hash` | Genera un hash bcrypt senza scrivere nulla su file |

## Modello di sicurezza

- **Accesso staff**: solo `Credentials` con password in hash bcrypt, ruoli `admin` e `concierge`.
  Le API verificano sempre il ruolo lato server; il `proxy.ts` (middleware) aggiunge solo un primo filtro.
- **Permessi**: `admin` gestisce menu e prenotazioni; `concierge` legge e aggiorna lo stato delle
  prenotazioni e consulta il menu, ma non crea/modifica/elimina piatti e non elimina prenotazioni.
- **Sessioni**: JWT `httpOnly`, `SameSite=Lax`, `Secure` in produzione, durata 1 ora. Al massimo una volta
  ogni 5 minuti per account il token viene rivalidato su MongoDB: se l'account viene eliminato o cambiano
  ruolo o password, la sessione perde i permessi entro 5 minuti. Se MongoDB è irraggiungibile la sessione
  viene conservata (il login e le API staff falliscono comunque) e la verifica riparte al recovery.
- **Forza bruta**: 5 tentativi falliti per IP+email ogni 15 minuti bloccano il login; ogni accesso riuscito
  azzera il contatore e le risposte sono identiche per email inesistente e password errata. Il rate
  limiter è in-process: per ambienti multi-istanza sostituiscilo con Redis/Upstash (punto di estensione:
  `lib/rate-limit.ts`).
- **IP del client**: si ricava da `x-forwarded-for` solo con `TRUSTED_PROXY_HOPS` valorizzato; gli header
  di piattaforma (`cf-connecting-ip`, `x-vercel-forwarded-for`) sono usati solo con
  `TRUST_PLATFORM_HEADERS=1`. Altrimenti tutti i client cadono nel bucket `anonymous`. Dietro un reverse
  proxy, configura il valore in base alla tua infrastruttura.
- **CSRF**: le API di scritture verificano che `Origin` corrisponda a `Host`/`X-Forwarded-Host`/sito
  canonico e richiedono `Content-Type: application/json` con body limitato a 16 KB.
- **Abuso sui form pubblici**: rate limit per IP su prenotazioni e newsletter, controllo capacità per
  fascia oraria, blocco delle richieste duplicate e honeypot `website` (non sostituisce un CAPTCHA).
- **Response con dati personali**: `Cache-Control: private, no-store`.
- **Header**: CSP, HSTS (produzione), `X-Content-Type-Options`, `X-Frame-Options: DENY`,
  `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`,
  `X-Powered-By` disabilitato. `/admin` e `/api` sono `noindex`.
- **Errori**: le API rispondono con messaggi generici e registrano i dettagli solo su stderr.

## Deploy

1. `npm ci && npm run check && npm run build`
2. Configura tutte le variabili d'ambiente dell'elenco sopra sulla piattaforma (mai nel repository).
3. `NEXTAUTH_URL` e `NEXT_PUBLIC_SITE_URL` devono essere HTTPS e coincidere con il dominio pubblico.
4. All'avvio: `npm run db:seed` (una volta) per creare staff e menu.
5. Smoke test: `GET /api/health` risponde `{"status":"ok"}`;
   `GET /api/health?deep=1` con header `x-health-token` verifica anche MongoDB.

## Runbook

- **Rotazione `NEXTAUTH_SECRET`**: genera un nuovo valore e riavvia. Tutte le sessioni staff vengono
  invalidate immediatamente (ricomando per sospetti di compromissione).
- **Cambio password staff**: `npm run db:hash` → `npm run db:seed -- --force`. Le sessioni aperte perdono
  i permessi entro 5 minuti grazie alla rivalidazione. Per l'account in variabile d'ambiente basta
  sostituire `ADMIN_PASSWORD_HASH` e riavviare: la sessione aperta perde i permessi entro 5 minuti.
- **Account sospetto**: elimina il documento `Admin` da MongoDB; la sessione si svuota entro 5 minuti.
- **Dati**: prenotazioni e newsletter contengono dati personali. MongoDB va cifrato, con backup
  cifrati e accesso limitato. Le richieste di cancellazione vanno gestite manualmente (esportazione e
  rimozione dei documenti da `Reservation` e `NewsletterSubscriber`) finché non viene implementata
  l'automazione di retention descritta in `/privacy`.
- **Monitoraggio**: collega `/api/health?deep=1` al probe del tuo provider con l'header
  `x-health-token`.

## Limiti noti

- Il rate limiter è in-process: su serverless multi-istanza ogni istanza ha il proprio budget.
- Il controllo di capacità per fascia oraria non è atomico: due richieste simultanee sullo stesso slot
  possono superare `RESERVATION_SLOT_CAPACITY`. Le prenotazioni partono comunque da `pending` e
  richiedono conferma dello staff; per un blocco stretto servono transazioni Mongo o un contatore
  atomico per slot.
- Le email di prenotazione/ newsletter non sono verificate: chiunque può far inviare un messaggio dal
  dominio `EMAIL_FROM` a un destinatario arbitrario entro i limiti di rate limit e honeypot.
- `next-auth` v4 è in manutenzione: pianifica la migrazione ad Auth.js v5.
- La newsletter non invia ancora email: manca il flusso di invio e quindi il link di disiscrizione
  (`unsubscribedAt`) va aggiunto a `models/NewsletterSubscriber.ts` quando l'invio verrà implementato.
- Gli indici del modello `Reservation` vengono creati automaticamente da Mongoose all'avvio; su
  ambienti con molti dati valuta `syncIndexes()` in una migrazione controllata.
- La CSP è deliberatamente restrittiva (`connect-src 'self'`): analytics o script esterni richiedono
  una modifica esplicita in `next.config.mjs`.
