import Link from 'next/link';
import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { Reveal } from '@/components/reveal';
import { NewsletterForm } from '@/components/newsletter-form';

export const metadata = {
  title: 'Contacte',
  description: 'Contacte, program și informații pentru a ajunge la Noir Lounge în Milano.'
};

export default function ContattiPage() {
  return (
    <>
      <PageIntro eyebrow="Lumea noastră" title="Te așteptăm în întuneric." description="O adresă în inima Milanolor, un concierge atent și o seară care începe chiar când sună telefonul." />
      <section id="content" className="section-shell grid gap-8 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:py-28">
        <Reveal className="space-y-4">
          <div className="border border-gold/20 bg-noir-deep p-6 sm:p-8"><span className="eyebrow">Unde suntem</span><h2 className="mt-5 font-display text-3xl text-white">Via Monte Napoleone 14</h2><p className="mt-3 text-sm leading-7 text-smoke">20121 Milano, Italia<br />Intrare rezervată · Curte interioară</p><div className="mt-8 h-56 overflow-hidden border border-gold/15 bg-[radial-gradient(circle_at_30%_20%,rgba(204,147,32,0.2),transparent_28%),linear-gradient(135deg,#0a0a0a,#161616)] p-5"><div className="flex h-full flex-col justify-between"><div className="flex items-center gap-2 text-gold"><MapPin size={17} strokeWidth={1.5} /><span className="text-[10px] font-semibold uppercase tracking-[0.16em]">Noir Sanctuary</span></div><div className="h-px w-full bg-gold/20" /><p className="max-w-[12rem] text-xs leading-5 text-smoke">Ușa se deschide când este momentul potrivit.</p></div></div></div>
          <div className="grid gap-4 sm:grid-cols-2"><a href="tel:+390289457712" className="group border border-gold/15 bg-noir-deep p-5 transition hover:border-gold/45"><Phone size={18} className="text-gold" strokeWidth={1.5} /><p className="mt-4 text-[9px] uppercase tracking-[0.16em] text-smoke/70">Telefon</p><p className="mt-1 text-sm text-white group-hover:text-gold-soft">+39 02 8945 7712</p></a><a href="mailto:vip@noirlounge.it" className="group border border-gold/15 bg-noir-deep p-5 transition hover:border-gold/45"><Mail size={18} className="text-gold" strokeWidth={1.5} /><p className="mt-4 text-[9px] uppercase tracking-[0.16em] text-smoke/70">Email</p><p className="mt-1 text-sm text-white group-hover:text-gold-soft">vip@noirlounge.it</p></a></div>
        </Reveal>
        <Reveal delay={0.12} className="space-y-4">
          <div className="border border-gold/20 bg-noir-deep p-6 sm:p-8"><span className="eyebrow">Concierge</span><h2 className="mt-5 font-display text-3xl text-white">Hai să vorbim despre seara ta.</h2><p className="mt-3 text-sm leading-7 text-smoke">Pentru rezervări, evenimente private, asocieri și informații, scrie-ne direct. Răspundem cu aceeași discreție cu care primim.</p><a href="https://wa.me/390289457712" target="_blank" rel="noreferrer" className="btn-gold mt-7"><MessageCircle size={16} strokeWidth={1.5} /> WhatsApp concierge <ArrowUpRight size={15} /></a></div>
          <div className="border border-gold/15 bg-noir-deep p-6 sm:p-8"><div className="flex items-center gap-3"><Clock3 size={18} className="text-gold" strokeWidth={1.5} /><h2 className="text-sm font-semibold text-white">Program</h2></div><div className="mt-6 space-y-3 text-sm text-smoke"><div className="flex justify-between gap-4"><span>Marți – Joi</span><span className="text-gold-soft">19:00 – 02:00</span></div><div className="flex justify-between gap-4"><span>Vineri – Sâmbătă</span><span className="text-gold-soft">19:00 – 03:30</span></div><div className="flex justify-between gap-4"><span>Duminică</span><span className="text-gold-soft">18:30 – 01:30</span></div><div className="flex justify-between gap-4 border-t border-gold/10 pt-3"><span>Luni</span><span>Închis</span></div></div></div>
          <div className="border border-gold/15 bg-noir-deep p-6 sm:p-8"><h2 className="text-sm font-semibold text-white">Invitații private</h2><p className="mt-3 text-sm leading-6 text-smoke">Primești selecții și invitații rezervate pentru seratile Noir.</p><div className="mt-5"><NewsletterForm /></div></div>
        </Reveal>
      </section>
      <section className="section-shell pb-20 lg:pb-28"><Reveal className="flex flex-col items-start justify-between gap-6 border border-gold/15 bg-noir-deep/50 p-7 sm:flex-row sm:items-center sm:p-9"><div className="flex gap-3"><ShieldCheck size={20} className="mt-1 shrink-0 text-gold" strokeWidth={1.5} /><div><h2 className="text-sm font-semibold text-white">Dress code discret</h2><p className="mt-1 text-xs leading-6 text-smoke">Eleganța naturală, respectul și bunele maniere fac ca fiecare seară să fie specială.</p></div></div><Link href="/menu" className="btn-quiet shrink-0">Descoperă meniul <ArrowUpRight size={15} /></Link></Reveal></section>
    </>
  );
}
