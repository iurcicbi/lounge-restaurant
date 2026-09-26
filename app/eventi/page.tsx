import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Disc3, Music2 } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { Reveal } from '@/components/reveal';
import { events } from '@/lib/content';

export const metadata = {
  title: 'Notti & musica',
  description: 'Il calendario e le selezioni musicali di Noir Lounge.'
};

export default function EventiPage() {
  return (
    <>
      <PageIntro eyebrow="Notti Noir" title="Il calendario ha un nuovo ritmo." description="Jazz, deep house e rituali musicali costruiti per la notte. Ogni appuntamento è limitato e pensato per chi sceglie la qualità del tempo.">
        <Link href="/prenotazioni" className="btn-gold">Prenota un tavolo <ArrowUpRight size={16} /></Link>
      </PageIntro>
      <section id="content" className="section-shell py-20 lg:py-28">
        <div className="grid gap-5 lg:grid-cols-3">{events.map((event, index) => <Reveal key={event.title} delay={index * 0.08}><article className="group flex h-full flex-col justify-between border border-gold/15 bg-noir-deep p-6 transition hover:-translate-y-1 hover:border-gold/45 hover:bg-noir-card"><div><div className="flex items-start justify-between gap-4"><div className="border border-gold/20 px-3 py-2 text-center"><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-soft">{event.month}</p><p className="font-display text-3xl leading-none text-white">{event.day}</p></div><span className="rounded-full border border-gold/25 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-gold-soft">{event.tag}</span></div><h2 className="mt-8 font-display text-2xl text-white transition group-hover:text-gold-soft">{event.title}</h2><p className="mt-3 text-sm leading-7 text-smoke">{event.description}</p></div><div className="mt-8 flex items-center justify-between border-t border-gold/10 pt-5 text-xs text-smoke"><span className="flex items-center gap-2"><CalendarDays size={15} className="text-gold" strokeWidth={1.5} />{event.time}</span><Link href="/prenotazioni" className="text-gold-soft transition hover:text-white">RSVP <ArrowUpRight size={14} className="inline" /></Link></div></article></Reveal>)}</div>
      </section>
      <section className="border-y border-gold/10 bg-noir-deep/50 py-20 lg:py-28"><div className="section-shell grid gap-10 lg:grid-cols-2 lg:items-center"><Reveal><span className="eyebrow">Dietro il microfono</span><h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">La musica entra piano.</h2><p className="mt-5 text-sm leading-7 text-smoke">Non vogliamo sottrarti la conversazione. Ogni selezione costruisce un atmosfera precisa e lascia sempre spazio a chi è al tavolo.</p></Reveal><div className="grid gap-4 sm:grid-cols-2">{[{ icon: Music2, title: 'Live session', text: 'Quartetti, sassofoni e voci che si muovono tra i tavoli.' }, { icon: Disc3, title: 'Resident sound', text: 'Selezioni deep e atmosferiche fino all’ultima pista.' }].map(({ icon: Icon, title, text }) => <Reveal key={title} className="border border-gold/15 bg-noir-deep p-6"><Icon size={20} className="text-gold" strokeWidth={1.5} /><h3 className="mt-5 font-display text-2xl text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-smoke">{text}</p></Reveal>)}</div></div></section>
    </>
  );
}
