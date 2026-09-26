import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { SiteShell } from '@/components/site-shell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: {
    default: 'Noir Lounge — Bucătărie de autor, mixologie & shisha',
    template: '%s — Noir Lounge'
  },
  description: 'Noir Lounge, sanctuariu exclusiv de haute gastronomie, mixologie de autor și narghilă ceremonială la Milano.',
  keywords: ['Noir Lounge', 'restaurant Milano', 'shisha lounge', 'mixologie', 'bucătărie de autor'],
  openGraph: {
    title: 'Noir Lounge',
    description: 'Arta plăcerului nocturn, unde misterul întâlnește luxul.',
    type: 'website',
    locale: 'ro_RO'
  }
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className="dark">
      <body className={`${inter.variable} ${playfair.variable} bg-noir-black text-ink antialiased`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
