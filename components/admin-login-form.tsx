'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LoaderCircle, LockKeyhole } from 'lucide-react';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/admin' });
    setLoading(false);
    if (result?.error) {
      setError('Credenziali non valide o servizio non configurato.');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
      <div><label htmlFor="admin-email" className="field-label">Email</label><input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="field-input" placeholder="admin@noirlounge.it" /></div>
      <div><label htmlFor="admin-password" className="field-label">Password</label><input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="field-input" placeholder="••••••••" /></div>
      {error ? <p role="alert" className="border border-red-300/30 bg-red-950/20 p-3 text-sm text-red-200">{error}</p> : null}
      <button type="submit" disabled={loading} className="btn-gold w-full">{loading ? <><LoaderCircle size={16} className="animate-spin" /> Verifica accesso</> : <>Accedi al pannello <ArrowRight size={16} /></>}</button>
      <p className="flex items-center justify-center gap-2 text-center text-[10px] uppercase tracking-[0.12em] text-smoke/60"><LockKeyhole size={13} strokeWidth={1.5} />Area riservata al team Noir</p>
    </form>
  );
}
