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
    default: 'Noir Lounge — Alta cucina, mixology & shisha',
    template: '%s — Noir Lounge'
  },
  description: 'Noir Lounge, santuario esclusivo di alta gastronomia, mixology d’autore e narghilè cerimoniale a Milano.',
  keywords: ['Noir Lounge', 'ristorante Milano', 'shisha lounge', 'mixology', 'alta cucina'],
  openGraph: {
    title: 'Noir Lounge',
    description: 'L’arte del piacere notturno, dove il mistero incontra il lusso.',
    type: 'website',
    locale: 'it_IT'
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
    <html lang="it" className="dark">
      <body className={`${inter.variable} ${playfair.variable} bg-noir-black text-ink antialiased`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
