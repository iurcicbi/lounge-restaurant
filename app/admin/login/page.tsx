import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { AdminLoginForm } from '@/components/admin-login-form';

export const metadata = {
  title: 'Acces staff',
  description: 'Acces rezervat la panoul Noir Lounge.',
  robots: { index: false, follow: false, nocache: true }
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-noir-black px-5 py-16">
      <div className="pointer-events-none fixed left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/10 blur-[130px]" />
      <div className="relative w-full max-w-md border border-gold/20 bg-noir-deep p-7 shadow-panel sm:p-10">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-smoke transition hover:text-gold-soft"><ArrowLeft size={14} /> Înapoi pe site</Link>
        <div className="mt-12 flex items-center gap-3 text-gold-soft"><Sparkles size={19} strokeWidth={1.5} /><span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Noir concierge</span></div>
        <h1 className="mt-4 font-display text-4xl text-white">Bine ai venit înăuntru.</h1>
        <p className="mt-3 text-sm leading-6 text-smoke">Gestionează rezervări, meniu și invitații rezervate dintr-o singură sală de control.</p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
