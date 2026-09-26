import type { ReactNode } from 'react';
import { Reveal } from '@/components/reveal';

export function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <Reveal className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl">{title}</h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </Reveal>
  );
}
