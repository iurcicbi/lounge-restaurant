import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center justify-center px-5 py-32 text-center">
      <div className="max-w-lg">
        <Sparkles size={22} className="mx-auto text-gold" strokeWidth={1.5} />
        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-soft">404 · fuori orario</p>
        <h1 className="mt-4 font-display text-5xl text-white">Questa stanza non esiste.</h1>
        <p className="mt-5 text-sm leading-7 text-smoke">La porta che cerchi è stata spinta altrove. Torna nel cuore del Noir Lounge.</p>
        <Link href="/" className="btn-gold mt-8"><ArrowLeft size={16} /> Torna alla home</Link>
      </div>
    </section>
  );
}
