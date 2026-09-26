import Link from 'next/link';
import { ArrowUpRight, Clock3, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { ReservationForm } from '@/components/reservation-form';
import { Reveal } from '@/components/reveal';

export const metadata = {
  title: 'Rezervări',
  description: 'Rezervă o masă, o alcove sau o experiență privată la Noir Lounge Milano.'
};

export default function PrenotazioniPage() {
  return (
    <>
      <PageIntro eyebrow="Seara ta, rezervată" title="Lasă restul în grijele noastre." description="Spune-ne când vrei să descoperi Noir. Concierge-ul verifică disponibilitatea și te va reapela pentru a confirma fiecare detaliu." />
      <section id="content" className="section-shell grid gap-8 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
        <Reveal><ReservationForm /></Reveal>
        <Reveal delay={0.12} className="space-y-4">
          <div className="border border-gold/20 bg-noir-deep p-6"><Sparkles size={20} className="text-gold" strokeWidth={1.5} /><h2 className="mt-5 font-display text-2xl text-white">Experiență pe măsura ta</h2><p className="mt-3 text-sm leading-7 text-smoke">Pentru grupuri private, ocazii speciale și amenajări personalizate, scrie-ne direct concierge-ului.</p><a href="https://wa.me/390289457712" target="_blank" rel="noreferrer" className="btn-quiet mt-6 w-full"><MessageCircle size={16} className="text-gold" strokeWidth={1.5} /> WhatsApp concierge</a></div>
          <div className="border border-gold/15 bg-noir-deep p-6"><h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-soft">Informații utile</h2><div className="mt-5 space-y-4 text-sm text-smoke"><p className="flex gap-3"><MapPin size={17} className="shrink-0 text-gold" strokeWidth={1.5} /><span>Via Monte Napoleone 14<br />20121 Milano, Italia</span></p><p className="flex gap-3"><Clock3 size={17} className="shrink-0 text-gold" strokeWidth={1.5} /><span>Mar – Joi 19:00 – 02:00<br />Vin – Sâm 19:00 – 03:30<br />Duminică 18:30 – 01:30</span></p><a href="tel:+390289457712" className="flex gap-3 transition hover:text-white"><Phone size={17} className="shrink-0 text-gold" strokeWidth={1.5} />+39 02 8945 7712</a></div></div>
          <div className="flex gap-3 border border-gold/15 bg-noir-deep p-5 text-xs leading-6 text-smoke"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-gold" strokeWidth={1.5} /><p>Rezervarea este subiectă de confirmare. Pentru mese de 8+ persoane sau alcove private, te reapelăm în câteva ore.</p></div>
          <Link href="/eventi" className="group flex items-center justify-between border border-gold/15 p-5 text-sm text-white transition hover:border-gold/45"><span>Vrei să combini cina cu un eveniment?</span><ArrowUpRight size={17} className="text-gold transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} /></Link>
        </Reveal>
      </section>
    </>
  );
}
