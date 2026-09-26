'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, CalendarDays, Menu, X } from 'lucide-react';
import { navigation } from '@/lib/content';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gold/10 bg-black/75 backdrop-blur-xl">
      <div className="section-shell flex h-[4.5rem] items-center justify-between gap-5 lg:h-20">
        <Logo compact />
        <nav aria-label="Navigație principală" className="hidden items-center gap-1 rounded-full border border-gold/10 bg-noir-deep/80 p-1 lg:flex">
          {navigation.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors',
                  active ? 'bg-gold/10 text-gold-soft' : 'text-smoke hover:text-white'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/prenotazioni" className="btn-gold hidden min-h-10 px-4 text-[10px] sm:inline-flex">
            <CalendarDays size={15} strokeWidth={1.5} />
            Rezervă un loc
          </Link>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Deschide meniul de navigație"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 text-gold-soft transition hover:border-gold/60 hover:bg-gold/10 lg:hidden"
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(88vw,25rem)] flex-col border-l border-gold/20 bg-noir-deep px-6 py-8 shadow-panel outline-none">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-display text-xl text-white">Noir Lounge</Dialog.Title>
                  <Dialog.Close asChild>
                    <button type="button" aria-label="Închide meniul" className="rounded-full p-2 text-smoke hover:text-gold-soft">
                      <X size={20} strokeWidth={1.5} />
                    </button>
                  </Dialog.Close>
                </div>
                <Dialog.Description className="mt-3 text-sm leading-6 text-smoke">
                  Un refugiu de gust, lumină și liniște în inima Milanolor.
                </Dialog.Description>
                <nav aria-label="Navigație mobilă" className="mt-12 flex flex-col gap-2">
                  {navigation.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center justify-between border-b border-gold/10 py-4 text-sm font-semibold uppercase tracking-[0.16em] transition-colors',
                          active ? 'text-gold-soft' : 'text-smoke hover:text-white'
                        )}
                      >
                        {item.label}
                        <ArrowUpRight size={16} strokeWidth={1.5} />
                      </Link>
                    );
                  })}
                </nav>
                <div className="mt-auto border-t border-gold/10 pt-6 text-xs leading-6 text-smoke">
                  <p>Via Monte Napoleone 14</p>
                  <p>20121 Milano · Italia</p>
                  <Link href="/prenotazioni" onClick={() => setOpen(false)} className="btn-gold mt-6 w-full">
                    Rezervă un loc
                  </Link>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
