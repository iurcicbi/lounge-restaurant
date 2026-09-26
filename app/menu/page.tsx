import { ArrowUpRight, Check, Clock3, MapPin, Sparkles } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { Reveal } from '@/components/reveal';
import { MenuBrowser } from '@/components/menu-browser';
import { signatureDishes } from '@/lib/content';
import { ImageFrame } from '@/components/image-frame';
import Link from 'next/link';

export const metadata = {
  title: 'Menu',
  description: 'La carta di Noir Lounge: cucina notturna, mixology d’autore e rituali narghilè.'
};

export default function MenuPage() {
  return (
    <>
      <PageIntro eyebrow="La carta del lounge" title="Sapori che raccontano la notte." description="Una selezione essenziale, stagionale e senza tempo. Ogni piatto è pensato per aprire il passo al ritmo della conversazione.">
        <Link href="/prenotazioni" className="btn-gold">Prenota la tua serata <ArrowUpRight size={16} /></Link>
      </PageIntro>
      <section id="content" className="section-shell py-20 lg:py-28">
        <Reveal className="mb-10 grid gap-4 sm:grid-cols-3">
          {[{ icon: Sparkles, text: 'Ingredienti selezionati ogni settimana' }, { icon: Clock3, text: 'Cucina attiva fino alle 02:30' }, { icon: Check, text: 'Pairing e note disponibili al tavolo' }].map(({ icon: Icon, text }) => <div key={text} className="flex items-center gap-3 border border-gold/15 bg-noir-deep p-4 text-xs leading-5 text-smoke"><Icon size={17} className="shrink-0 text-gold" strokeWidth={1.5} />{text}</div>)}
        </Reveal>
        <MenuBrowser />
      </section>
      <section className="border-y border-gold/10 bg-noir-deep/50 py-20 lg:py-28">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal><ImageFrame src={signatureDishes[0].image} alt="Wagyu A5 con oro edibile" className="aspect-[4/3] rounded-[1.5rem]" /></Reveal>
          <Reveal delay={0.1}><span className="eyebrow">Dal banco alla tavola</span><h2 className="mt-4 font-display text-4xl text-white">Il gusto è un linguaggio segreto.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-smoke">Il nostro team lavora con prodotti di stagione, tecniche precise e aromi che non sovrastano mai il piacere della compagnia. Raccontaci il tuo desiderio: il concierge costruirà il resto.</p><div className="mt-7 flex flex-wrap gap-2">{['Cucina d’autore', 'Mixology', 'Narghilè', 'Degustazioni'].map((item) => <span key={item} className="rounded-full border border-gold/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-smoke">{item}</span>)}</div><Link href="/contatti" className="btn-quiet mt-8">Parla con il concierge <MapPin size={15} className="text-gold" strokeWidth={1.5} /></Link></Reveal>
        </div>
      </section>
    </>
  );
}
