import { ArrowUpRight, Check, Clock3, MapPin, Sparkles } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';
import { Reveal } from '@/components/reveal';
import { MenuBrowser } from '@/components/menu-browser';
import { signatureDishes } from '@/lib/content';
import { ImageFrame } from '@/components/image-frame';
import Link from 'next/link';

export const metadata = {
  title: 'Menu',
  description: 'Meniul Noir Lounge: bucătărie nocturnă, mixologie de autor și ritualuri de narghilă.'
};

export default function MenuPage() {
  return (
    <>
      <PageIntro eyebrow="Cartea lounge-ului" title="Savoruri care spun povestea nopții." description="O selecție esențială, de sezon și atemporală. Fiecare preparat este gândit să deschidă ritmul conversației.">
        <Link href="/prenotazioni" className="btn-gold">Rezervă seara <ArrowUpRight size={16} /></Link>
      </PageIntro>
      <section id="content" className="section-shell py-20 lg:py-28">
        <Reveal className="mb-10 grid gap-4 sm:grid-cols-3">
          {[{ icon: Sparkles, text: 'Ingrediente selectate în fiecare săptămână' }, { icon: Clock3, text: 'Bucătărie activă până la 02:30' }, { icon: Check, text: 'Asocieri și note disponibile la masă' }].map(({ icon: Icon, text }) => <div key={text} className="flex items-center gap-3 border border-gold/15 bg-noir-deep p-4 text-xs leading-5 text-smoke"><Icon size={17} className="shrink-0 text-gold" strokeWidth={1.5} />{text}</div>)}
        </Reveal>
        <MenuBrowser />
      </section>
      <section className="border-y border-gold/10 bg-noir-deep/50 py-20 lg:py-28">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal><ImageFrame src={signatureDishes[0].image} alt="Wagyu A5 cu aur comestibil" className="aspect-[4/3] rounded-[1.5rem]" /></Reveal>
          <Reveal delay={0.1}><span className="eyebrow">De la tejghea la masă</span><h2 className="mt-4 font-display text-4xl text-white">Gustul este o limbă secretă.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-smoke">Echipa noastră lucrează cu produse de sezon, tehnici precise și arome care nu acoperă niciodată plăcerea companiei. Spune-ne dorința ta: concierge-ul construiește restul.</p><div className="mt-7 flex flex-wrap gap-2">{['Bucătărie de autor', 'Mixologie', 'Narghilă', 'Degustări'].map((item) => <span key={item} className="rounded-full border border-gold/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-smoke">{item}</span>)}</div><Link href="/contatti" className="btn-quiet mt-8">Vorbește cu concierge-ul <MapPin size={15} className="text-gold" strokeWidth={1.5} /></Link></Reveal>
        </div>
      </section>
    </>
  );
}
