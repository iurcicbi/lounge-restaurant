'use client';

import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronDown, LoaderCircle, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { getReservationTimeSlots, getVenueDateString, reservationSchema, type ReservationInput } from '@/lib/validations';
import { cn } from '@/lib/utils';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-300">{message}</p>;
}

export function ReservationForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const minDate = useMemo(() => getVenueDateString(), []);
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', phone: '', date: '', time: '', guests: 2, occasion: '', notes: '', website: '' }
  });
  const selectedDate = useWatch({ control, name: 'date' });
  const timeSlots = getReservationTimeSlots(selectedDate || minDate);

  async function onSubmit(values: ReservationInput) {
    setStatus('idle');
    setMessage('');
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const payload = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(payload.error || 'Non è stato possibile inviare la richiesta.');
      setStatus('success');
      setMessage(payload.message || 'Richiesta ricevuta. A presto.');
      reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Non è stato possibile inviare la richiesta.');
    }
  }

  if (status === 'success') {
    return <div className="flex min-h-[28rem] flex-col items-center justify-center border border-gold/25 bg-noir-deep p-8 text-center"><div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold-soft shadow-gold"><Check size={25} strokeWidth={1.5} /></div><h2 className="mt-6 font-display text-3xl text-white">La serata è quasi tua.</h2><p className="mt-3 max-w-md text-sm leading-7 text-smoke">{message}</p><button type="button" onClick={() => { setStatus('idle'); setMessage(''); }} className="btn-quiet mt-8">Invia un’altra richiesta</button></div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border border-gold/20 bg-noir-deep p-5 shadow-panel sm:p-8" noValidate>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label htmlFor="reservation-website">Sito web</label><input id="reservation-website" tabIndex={-1} autoComplete="off" {...register('website')} /></div>
      <div className="mb-8 flex items-start justify-between gap-5 border-b border-gold/10 pb-6"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-soft">La tua richiesta</p><h2 className="mt-2 font-display text-3xl text-white">Prenota un tavolo</h2></div><Sparkles size={21} className="mt-1 text-gold" strokeWidth={1.5} /></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2"><label htmlFor="name" className="field-label">Nome e cognome <span>*</span></label><input id="name" {...register('name')} aria-invalid={Boolean(errors.name)} className={cn('field-input', errors.name && 'border-red-300/60')} placeholder="Come possiamo chiamarti?" /> <FieldError message={errors.name?.message} /></div>
        <div><label htmlFor="email" className="field-label">Email <span>*</span></label><input id="email" type="email" {...register('email')} aria-invalid={Boolean(errors.email)} className={cn('field-input', errors.email && 'border-red-300/60')} placeholder="tu@email.it" /><FieldError message={errors.email?.message} /></div>
        <div><label htmlFor="phone" className="field-label">Telefono <span>*</span></label><input id="phone" type="tel" {...register('phone')} aria-invalid={Boolean(errors.phone)} className={cn('field-input', errors.phone && 'border-red-300/60')} placeholder="+39 333 000 0000" /><FieldError message={errors.phone?.message} /></div>
        <div><label htmlFor="date" className="field-label">Data <span>*</span></label><input id="date" type="date" min={minDate} {...register('date')} aria-invalid={Boolean(errors.date)} className={cn('field-input', errors.date && 'border-red-300/60')} /><FieldError message={errors.date?.message} /></div>
        <div><label htmlFor="time" className="field-label">Orario <span>*</span></label><div className="relative"><select id="time" {...register('time')} disabled={!timeSlots.length} aria-invalid={Boolean(errors.time)} className={cn('field-input appearance-none pr-10', errors.time && 'border-red-300/60')} defaultValue=""><option value="" disabled>Seleziona</option>{timeSlots.length ? timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>) : <option value="">Chiuso</option>}</select><ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold" strokeWidth={1.5} /></div><FieldError message={errors.time?.message} /></div>
        <div><label htmlFor="guests" className="field-label">Ospiti <span>*</span></label><div className="relative"><select id="guests" {...register('guests', { valueAsNumber: true })} aria-invalid={Boolean(errors.guests)} className={cn('field-input appearance-none pr-10', errors.guests && 'border-red-300/60')}>{Array.from({ length: 12 }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count} {count === 1 ? 'ospite' : 'ospiti'}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold" strokeWidth={1.5} /></div><FieldError message={errors.guests?.message} /></div>
        <div><label htmlFor="occasion" className="field-label">Occasione <span className="text-smoke/50">facoltativa</span></label><input id="occasion" {...register('occasion')} className="field-input" placeholder="Cena, anniversario, incontro..." /></div>
        <div className="sm:col-span-2"><label htmlFor="notes" className="field-label">Note per il concierge <span className="text-smoke/50">facoltative</span></label><textarea id="notes" rows={4} {...register('notes')} className="field-input resize-y" placeholder="Allergie, preferenze o un dettaglio che desideriamo sapere..." /></div>
      </div>
      {status === 'error' ? <p role="alert" className="mt-5 border border-red-300/30 bg-red-950/20 p-3 text-sm text-red-200">{message}</p> : null}
      <div className="mt-7 flex flex-col gap-4 border-t border-gold/10 pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2 text-xs leading-5 text-smoke/70"><ShieldCheck size={15} className="shrink-0 text-gold" strokeWidth={1.5} />I dati restano riservati al nostro concierge.</p><button type="submit" disabled={isSubmitting} className="btn-gold min-h-13 w-full sm:w-auto">{isSubmitting ? <><LoaderCircle size={16} className="animate-spin" /> Invio in corso</> : <>Invia richiesta <Send size={15} strokeWidth={1.5} /></>}</button></div>
    </form>
  );
}
