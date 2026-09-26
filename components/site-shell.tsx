'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { MobileNav } from '@/components/mobile-nav';

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <main className="min-h-screen bg-noir-black">{children}</main>;
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-noir-black pb-20 lg:pb-0">{children}</main>
      <SiteFooter />
      <MobileNav />
    </>
  );
}
