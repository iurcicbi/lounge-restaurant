import Link from 'next/link';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';

export const metadata = {
  title: 'Privacy',
  description: 'Informativa privacy di Noir Lounge Milano.'
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro eyebrow="Informativa" title="La tua privacy, prima di tutto." description="Trattiamo i dati con discrezione, trasparenza e solo per offrirti un’esperienza coerente con la nostra attività." />
      <section className="section-shell pb-24">
        <div className="mx-auto max-w-3xl border border-gold/15 bg-noir-deep p-6 sm:p-10">
          <div className="flex items-center gap-3 border-b border-gold/10 pb-6"><LockKeyhole size={20} className="text-gold" strokeWidth={1.5} /><p className="text-[10px] uppercase tracking-[0.18em] text-gold-soft">Noir Lounge Milano</p></div>
          <div className="prose-invert mt-8 space-y-7 text-sm leading-7 text-smoke">
            <section><h2 className="font-display text-2xl text-white">Dati raccolti</h2><p>Quando invii una richiesta di prenotazione raccogliamo nome, email, telefono, data, ora, numero di ospiti e le eventuali note che scegli di condividere. Quando ti iscrivi alla newsletter raccogliamo il tuo indirizzo email e la data del consenso.</p></section>
            <section><h2 className="font-display text-2xl text-white">Finalità e base</h2><p>Usiamo i dati per gestire richieste di prenotazione, rispondere alle tue domande e, solo con il tuo consenso, inviarti comunicazioni e inviti riservati. I dati vengono conservati solo per il tempo necessario alla finalità richiesta e alle obbligazioni di legge.</p></section>
            <section><h2 className="font-display text-2xl text-white">Fornitori e sicurezza</h2><p>Per erogare il servizio possiamo avvalerci di fornitori tecnici per hosting, database e invio email. Non vendiamo i tuoi dati. L’accesso ai sistemi è limitato al personale e ai fornitori autorizzati.</p></section>
            <section><h2 className="font-display text-2xl text-white">I tuoi diritti</h2><p>Puoi chiedere accesso, rettifica, cancellazione o limitazione dei tuoi dati, e revocare il consenso in qualsiasi momento. Scrivi a <a href="mailto:vip@noirlounge.it" className="text-gold-soft underline underline-offset-2">vip@noirlounge.it</a> indicando la richiesta.</p></section>
          </div>
          <Link href="/" className="btn-quiet mt-8"><ArrowLeft size={15} /> Torna alla home</Link>
        </div>
      </section>
    </>
  );
}
