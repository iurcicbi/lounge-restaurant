'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Cloud, Home, MapPin, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { label: 'Acasă', href: '/', icon: Home },
  { label: 'Menu', href: '/menu', icon: Utensils },
  { label: 'Rezervă', href: '/prenotazioni', icon: CalendarDays },
  { label: 'Narghilă', href: '/narghile', icon: Cloud },
  { label: 'Contacte', href: '/contatti', icon: MapPin }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigație mobilă rapidă" className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-gold/15 bg-black/90 backdrop-blur-xl lg:hidden">
      <div className="grid h-16 grid-cols-5 px-1">
        {items.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex min-h-11 flex-col items-center justify-center gap-1 text-[9px] font-semibold uppercase tracking-[0.13em] transition-colors',
                active ? 'text-gold-soft' : 'text-smoke'
              )}
            >
              <Icon size={19} strokeWidth={1.5} />
              <span>{label}</span>
              {active ? <span className="absolute bottom-0 h-px w-5 bg-gold" /> : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
