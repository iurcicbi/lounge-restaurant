import Link from 'next/link';
import { ArrowUpRight, Cloud, Flame, Gem, ShieldCheck, Sparkles } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { Reveal } from '@/components/reveal';
import { ImageFrame } from '@/components/image-frame';
import { menuItems } from '@/lib/content';
import { formatPrice } from '@/lib/utils';

export const metadata = {
  title: 'Narghilè Lounge',
  description: 'Il cerimoniale narghilè di Noir Lounge: blend rari, glassware artigianale e sommelier dedicato.'
};

const features = [
  { icon: Gem, title: 'Glasswear curatorato', text: 'Pipe in vetro soffiato francese e componenti in acciaio medicale, scelti per un’estrazione lenta e pulita.' },
  { icon: Sparkles, title: 'Blend selezionati', text: 'Tabacchi organici, infusioni di spezie e liquori invecchiati. Nessuna scorciatoia, nessun aroma standard.' },
  { icon: Flame, title: 'Servizio al tavolo', text: 'Lo Shisha Sommelier gestisce brace, ritmo e rotazione aromatica per tutta la serata.' }
];

export default function NarghilePage() {
  return (
    <>
      <PageIntro eyebrow="Cerimoniale esclusivo" title="Il respiro lento di Noir." description="Non è una semplice shisha. È un rituale curato nei minimi dettagli, dove il fumo incontra il cristallo, il tempo e il piacere di condividere un momento.">
        <Link href="/prenotazioni" className="btn-gold">Prenota un tavolo <ArrowUpRight size={16} /></Link>
      </PageIntro>
      <section id="content" className="section-shell py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <Reveal className="relative"><ImageFrame src={menuItems[5].image} alt="Narghilè artigianale con fumo aromatico" className="aspect-square rounded-[1.75rem]" priority /><div className="absolute bottom-5 left-5 border border-gold/25 bg-black/75 p-4 backdrop-blur-md"><p className="text-[9px] uppercase tracking-[0.16em] text-gold-soft">Dark Russian Blend</p><div className="mt-2 flex gap-1.5">{[1, 2, 3, 4, 5].map((dot) => <span key={dot} className={`h-2 w-2 rounded-full ${dot < 5 ? 'bg-gold' : 'bg-gold/20'}`} />)}</div></div></Reveal>
          <Reveal delay={0.12} className="space-y-4">{features.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4 border border-gold/15 bg-noir-deep p-5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/25 text-gold-soft"><Icon size={18} strokeWidth={1.5} /></div><div><h2 className="text-sm font-semibold text-white">{title}</h2><p className="mt-2 text-sm leading-6 text-smoke">{text}</p></div></div>)}<div className="flex items-center gap-3 pt-4 text-xs text-smoke"><ShieldCheck size={17} className="text-gold" strokeWidth={1.5} />Ogni tavolo viene allestito con cura dal nostro team.</div></Reveal>
        </div>
      </section>
      <section className="border-y border-gold/10 bg-noir-deep/50 py-20 lg:py-28">
        <div className="section-shell"><Reveal className="text-center"><span className="eyebrow justify-center before:hidden">Le miscele</span><h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">Scegli il tuo carattere.</h2></Reveal><div className="mt-10 grid gap-4 md:grid-cols-2">{menuItems.filter((item) => item.category === 'shisha').map((item) => <Reveal key={item.name}><div className="flex h-full items-start justify-between gap-5 border border-gold/15 bg-noir-deep p-5 transition hover:border-gold/45"><div><p className="text-[10px] uppercase tracking-[0.14em] text-gold-soft">{item.tags.join(' · ')}</p><h3 className="mt-3 font-display text-2xl text-white">{item.name}</h3><p className="mt-3 max-w-lg text-sm leading-6 text-smoke">{item.description}</p><p className="mt-4 text-xs text-smoke/70">Abbinamento suggerito: {item.pairing}</p></div><span className="shrink-0 font-semibold text-gold-soft">{formatPrice(item.price)}</span></div></Reveal>)}</div><div className="mt-10 text-center"><Link href="/prenotazioni" className="btn-gold">Trova il tuo rituale <Cloud size={16} /></Link></div></div>
      </section>
    </>
  );
}
