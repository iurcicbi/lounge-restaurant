import type { ReactNode } from 'react';
import { ArrowDown } from 'lucide-react';
import { Reveal } from '@/components/reveal';

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageIntro({ eyebrow, title, description, children }: PageIntroProps) {
  return (
    <section className="relative overflow-hidden border-b border-gold/10 bg-noir-deep px-4 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-48">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <div className="section-shell relative text-center">
        <Reveal>
          <span className="eyebrow justify-center before:hidden">{eyebrow}</span>
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl leading-tight text-white sm:text-6xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-smoke sm:text-base">{description}</p>
          {children ? <div className="mt-8">{children}</div> : null}
        </Reveal>
        <a href="#content" aria-label="Scorri alla pagina" className="mx-auto mt-12 hidden h-10 w-10 items-center justify-center rounded-full border border-gold/25 text-gold-soft transition hover:bg-gold/10 lg:flex"><ArrowDown size={16} /></a>
      </div>
    </section>
  );
}
