'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import * as Tabs from '@radix-ui/react-tabs';
import { ArrowUpRight, Wine, Cloud, Utensils } from 'lucide-react';
import { menuItems as fallbackMenu, type MenuItem } from '@/lib/content';
import { cn, formatPrice } from '@/lib/utils';

type MenuSource = 'static' | 'database' | 'fallback';

const tabs = [
  { value: 'cucina', label: 'Cucina', icon: Utensils },
  { value: 'cocktails', label: 'Mixology', icon: Wine },
  { value: 'shisha', label: 'Narghilè', icon: Cloud }
];

export function MenuBrowser() {
  const [category, setCategory] = useState('cucina');
  const [items, setItems] = useState<MenuItem[]>(fallbackMenu);
  const [source, setSource] = useState<MenuSource>('static');

  useEffect(() => {
    let active = true;
    void fetch('/api/menu')
      .then((response) => {
        if (!response.ok) throw new Error('Menu non disponibile');
        return response.json() as Promise<{ items?: MenuItem[]; source?: MenuSource }>;
      })
      .then((payload) => {
        if (!active || !payload.items?.length) return;
        setItems(payload.items);
        setSource(payload.source || 'fallback');
      })
      .catch(() => {
        if (active) setSource('fallback');
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => items.filter((item) => item.category === category && item.available !== false), [category, items]);

  return (
    <Tabs.Root value={category} onValueChange={setCategory} className="space-y-8">
      <Tabs.List aria-label="Categorie del menu" className="flex w-full gap-2 overflow-x-auto border-b border-gold/15 pb-3">
        {tabs.map(({ value, label, icon: Icon }) => (
          <Tabs.Trigger key={value} value={value} className={cn('inline-flex shrink-0 items-center gap-2 rounded-full border border-gold/15 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-smoke transition hover:border-gold/50 hover:text-white', category === value && 'border-gold/65 bg-gold/10 text-gold-soft shadow-gold')}>
            <Icon size={15} strokeWidth={1.5} />{label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map(({ value, label }) => (
        <Tabs.Content key={value} value={value} className="outline-none">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const image = item.image || fallbackMenu.find((fallbackItem) => fallbackItem.category === item.category)?.image || fallbackMenu[0].image;
              return (
              <article key={`${item.name}-${item.pairing || ''}`} className="group flex gap-4 border border-gold/15 bg-noir-deep p-4 transition hover:border-gold/45 hover:bg-noir-card sm:p-5">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden border border-gold/10 bg-noir-card sm:h-32 sm:w-32"><Image src={image} alt={item.name} fill sizes="128px" className="object-cover transition duration-700 group-hover:scale-105" /><div className="image-vignette absolute inset-0" /></div>
                <div className="flex min-w-0 flex-1 flex-col"><div className="flex items-start justify-between gap-3"><h3 className="font-display text-xl leading-tight text-white transition group-hover:text-gold-soft">{item.name}</h3><span className="shrink-0 text-sm font-semibold text-gold-soft">{formatPrice(item.price)}</span></div><p className="mt-2 text-xs leading-5 text-smoke">{item.description}</p><div className="mt-auto flex items-center justify-between gap-2 pt-3 text-[9px] uppercase tracking-[0.12em] text-smoke/70"><span>{item.tags.join(' · ')}</span><ArrowUpRight size={14} className="text-gold" strokeWidth={1.5} /></div></div>
              </article>
              );
            })}
          </div>
          <p className="mt-6 text-center text-xs text-smoke/60">Menu soggetto a disponibilità. Chiedi il pairing al concierge per la tua serata.</p>
          <span className="sr-only">{label}</span>
        </Tabs.Content>
      ))}
      <p className="sr-only" aria-live="polite">Menu {source === 'database' ? 'aggiornato dal database' : 'in modalità di cortesia'}.</p>
    </Tabs.Root>
  );
}
