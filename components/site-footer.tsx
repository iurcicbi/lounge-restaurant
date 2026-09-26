import Link from 'next/link';
import { ArrowUpRight, Clock3, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Logo } from '@/components/logo';
import { NewsletterForm } from '@/components/newsletter-form';

export function SiteFooter() {
  return (
    <footer className="border-t border-gold/10 bg-noir-black">
      <div className="section-shell py-16 lg:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-xs text-sm leading-6 text-smoke">Alta cucina notturna, mixology d’autore ed esclusiva selezione di shisha in un ambiente raffinato e discreto.</p>
            <div className="flex items-center gap-2">
              <Link href="/contatti" aria-label="Instagram Noir Lounge" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 text-gold-soft transition hover:border-gold/60 hover:bg-gold/10">
                <Instagram size={16} strokeWidth={1.5} />
              </Link>
              <Link href="/contatti" aria-label="Contatta il concierge" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 text-gold-soft transition hover:border-gold/60 hover:bg-gold/10">
                <MessageCircle size={16} strokeWidth={1.5} />
              </Link>
              <Link href="mailto:vip@noirlounge.it" aria-label="Email Noir Lounge" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 text-gold-soft transition hover:border-gold/60 hover:bg-gold/10">
                <Mail size={16} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
          <div className="space-y-5">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-soft">Dove siamo</h2>
            <div className="space-y-3 text-sm text-smoke">
              <p className="flex gap-2 text-white"><MapPin size={16} className="mt-0.5 shrink-0 text-gold" strokeWidth={1.5} />Via Monte Napoleone 14</p>
              <p className="pl-6">20121 Milano, Italia</p>
              <a href="tel:+390289457712" className="flex items-center gap-2 transition hover:text-white"><Phone size={15} strokeWidth={1.5} className="text-gold" />+39 02 8945 7712</a>
              <a href="mailto:vip@noirlounge.it" className="flex items-center gap-2 transition hover:text-white"><Mail size={15} strokeWidth={1.5} className="text-gold" />vip@noirlounge.it</a>
            </div>
          </div>
          <div className="space-y-5">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-soft">Orari</h2>
            <div className="space-y-3 text-sm text-smoke">
              <div className="flex justify-between gap-4"><span>Mar – Gio</span><span className="text-gold-soft">19:00 – 02:00</span></div>
              <div className="flex justify-between gap-4"><span>Ven – Sab</span><span className="text-gold-soft">19:00 – 03:30</span></div>
              <div className="flex justify-between gap-4"><span>Domenica</span><span className="text-gold-soft">18:30 – 01:30</span></div>
              <div className="flex justify-between gap-4 border-t border-gold/10 pt-3"><span>Lunedì</span><span>Chiuso</span></div>
            </div>
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-gold-soft"><span className="gold-dot animate-pulse" />Shisha Sommelier in sala</p>
          </div>
          <div className="space-y-5">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-soft">Club privé</h2>
            <p className="text-sm leading-6 text-smoke">Ricevi inviti riservati per degustazioni, masterclass e selezioni musicali.</p>
            <NewsletterForm />
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-5 border-t border-gold/10 pt-6 text-[10px] uppercase tracking-[0.14em] text-smoke/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Noir Lounge Milano</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="transition hover:text-gold-soft">Privacy</Link>
            <Link href="/contatti" className="transition hover:text-gold-soft">Dress code</Link>
            <Link href="/contatti" className="transition hover:text-gold-soft">Contatti</Link>
            <Link href="/admin/login" className="transition hover:text-gold-soft">Staff access <ArrowUpRight size={12} className="inline" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
