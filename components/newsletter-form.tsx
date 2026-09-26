'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Check, LoaderCircle } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, website })
      });
      const payload = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(payload.error || 'Nu a fost posibil să finalizezi cererea.');
      setStatus('success');
      setMessage(payload.message || 'Ești pe lista Noir.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Nu a fost posibil să finalizezi cererea.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2" noValidate>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="newsletter-website">Site web</label>
        <input id="newsletter-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
      </div>
      <div className="flex items-center gap-2 border-b border-gold/30 pb-2 focus-within:border-gold">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Adresa ta de e-mail"
          aria-label="Adresa ta de e-mail"
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-smoke/50"
        />
        <button type="submit" aria-label="Abonează-te la newsletter" disabled={status === 'loading'} className="text-gold-soft transition hover:text-white disabled:opacity-50">
          {status === 'loading' ? <LoaderCircle size={18} className="animate-spin" /> : status === 'success' ? <Check size={18} /> : <ArrowUpRight size={18} strokeWidth={1.5} />}
        </button>
      </div>
      {message ? <p className={`text-xs ${status === 'error' ? 'text-red-300' : 'text-gold-soft'}`}>{message}</p> : null}
      {!message ? <p className="text-[10px] leading-5 text-smoke/55">Invitații rezervate, fără zgomot. Discreție garantată.</p> : null}
      <label className="flex items-start gap-2 pt-1 text-[10px] leading-4 text-smoke/65"><input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 accent-gold" />Accept prelucrarea datelor pentru a primi invitații. <Link href="/privacy" className="underline underline-offset-2 hover:text-gold-soft">Privacy</Link></label>
    </form>
  );
}
