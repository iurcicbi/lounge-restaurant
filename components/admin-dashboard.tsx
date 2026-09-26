'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { CalendarDays, Check, ChefHat, CircleAlert, LayoutDashboard, LogOut, Plus, RefreshCw, Utensils, X } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';
import { heroImage } from '@/lib/content';

type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'cancelled';
type Reservation = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  occasion?: string;
  notes?: string;
  status: ReservationStatus;
  createdAt?: string;
};
type MenuRecord = {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: 'cucina' | 'cocktails' | 'shisha';
  image?: string;
  tags?: string[];
  available?: boolean;
};
type NewMenuItem = Omit<MenuRecord, '_id'>;

const initialItem: NewMenuItem = { name: '', description: '', price: 26, category: 'cocktails', image: '', tags: [], available: true };
const statuses: Array<{ value: ReservationStatus; label: string }> = [
  { value: 'pending', label: 'Da confermare' },
  { value: 'confirmed', label: 'Confermata' },
  { value: 'seated', label: 'A tavolo' },
  { value: 'cancelled', label: 'Cancellata' }
];

function statusClass(status: ReservationStatus) {
  if (status === 'confirmed') return 'border-gold/50 text-gold-soft bg-gold/10';
  if (status === 'seated') return 'border-emerald-400/30 text-emerald-300 bg-emerald-400/10';
  if (status === 'cancelled') return 'border-red-300/30 text-red-300 bg-red-300/10';
  return 'border-white/15 text-smoke bg-white/5';
}

export function AdminDashboard({ email, canManageMenu }: { email: string; canManageMenu: boolean }) {
  const [activeTab, setActiveTab] = useState<'reservations' | 'menu'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menu, setMenu] = useState<MenuRecord[]>([]);
  const [newItem, setNewItem] = useState<NewMenuItem>(initialItem);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [reservationResponse, menuResponse] = await Promise.all([fetch('/api/reservations'), fetch('/api/menu?includeUnavailable=true')]);
      if (reservationResponse.status === 401) {
        setError('Sessione scaduta. Accedi nuovamente.');
        return;
      }
      if (!reservationResponse.ok) throw new Error('Impossibile caricare le prenotazioni.');
      if (!menuResponse.ok) throw new Error('Impossibile caricare il menu.');
      const reservationPayload = (await reservationResponse.json()) as { reservations?: Reservation[] };
      const menuPayload = (await menuResponse.json()) as { items?: MenuRecord[] };
      setReservations(reservationPayload.reservations || []);
      setMenu(menuPayload.items || []);
    } catch {
      setError('Impossibile caricare i dati. Verifica MongoDB.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  async function updateStatus(id: string, status: ReservationStatus) {
    setUpdating(id);
    setNotice('');
    try {
      const response = await fetch(`/api/reservations/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      const payload = (await response.json()) as { reservation?: Reservation; error?: string };
      if (!response.ok) throw new Error(payload.error || 'Aggiornamento non riuscito.');
      if (payload.reservation) setReservations((items) => items.map((item) => item._id === id ? payload.reservation as Reservation : item));
      setNotice('Stato prenotazione aggiornato.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Aggiornamento non riuscito.');
    } finally {
      setUpdating(null);
    }
  }

  async function createMenuItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('');
    setError('');
    try {
      const response = await fetch('/api/menu', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newItem, price: Number(newItem.price), image: newItem.image || heroImage }) });
      const payload = (await response.json()) as { item?: MenuRecord; error?: string };
      if (!response.ok || !payload.item) throw new Error(payload.error || 'Impossibile creare il piatto.');
      setMenu((items) => [payload.item as MenuRecord, ...items]);
      setNewItem(initialItem);
      setNotice('Piatto aggiunto al menu.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Impossibile creare il piatto.');
    }
  }

  const pendingCount = reservations.filter((item) => item.status === 'pending').length;
  const confirmedCount = reservations.filter((item) => item.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-noir-black">
      <header className="border-b border-gold/10 bg-noir-deep/80"><div className="section-shell flex min-h-20 flex-wrap items-center justify-between gap-4 py-4"><div><p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold-soft">Noir control room</p><h1 className="mt-1 font-display text-2xl text-white">Buonasera, {email}</h1></div><div className="flex items-center gap-2"><button type="button" onClick={() => void loadData()} className="btn-quiet min-h-10 px-3 text-[9px]"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} />Aggiorna</button><button type="button" onClick={() => void signOut({ callbackUrl: '/admin/login' })} className="btn-quiet min-h-10 px-3 text-[9px]"><LogOut size={14} />Esci</button></div></div></header>
      <main className="section-shell py-8 sm:py-12">
        <div className="grid gap-4 sm:grid-cols-3"><div className="border border-gold/20 bg-noir-deep p-5"><CalendarDays size={18} className="text-gold" strokeWidth={1.5} /><p className="mt-5 font-display text-3xl text-white">{reservations.length}</p><p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-smoke">Prenotazioni totali</p></div><div className="border border-gold/20 bg-noir-deep p-5"><CircleAlert size={18} className="text-gold" strokeWidth={1.5} /><p className="mt-5 font-display text-3xl text-gold-soft">{pendingCount}</p><p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-smoke">Da confermare</p></div><div className="border border-gold/20 bg-noir-deep p-5"><Check size={18} className="text-gold" strokeWidth={1.5} /><p className="mt-5 font-display text-3xl text-white">{confirmedCount}</p><p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-smoke">Confermate</p></div></div>
        <div className="mt-10 flex gap-2 border-b border-gold/15"><button type="button" onClick={() => setActiveTab('reservations')} className={`flex items-center gap-2 border-b-2 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] ${activeTab === 'reservations' ? 'border-gold text-gold-soft' : 'border-transparent text-smoke'}`}><LayoutDashboard size={15} />Prenotazioni</button><button type="button" onClick={() => setActiveTab('menu')} className={`flex items-center gap-2 border-b-2 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] ${activeTab === 'menu' ? 'border-gold text-gold-soft' : 'border-transparent text-smoke'}`}><Utensils size={15} />Menu</button></div>
        {notice ? <p className="mt-5 border border-gold/25 bg-gold/5 p-3 text-sm text-gold-soft">{notice}</p> : null}{error ? <p className="mt-5 border border-red-300/30 bg-red-950/20 p-3 text-sm text-red-200">{error}</p> : null}
        {activeTab === 'reservations' ? <section className="mt-6 space-y-4">{loading ? <p className="text-sm text-smoke">Caricamento prenotazioni…</p> : reservations.length === 0 ? <div className="border border-dashed border-gold/20 p-10 text-center text-sm text-smoke">Nessuna prenotazione registrata.</div> : reservations.map((reservation) => <article key={reservation._id} className="border border-gold/15 bg-noir-deep p-5 sm:p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div className="flex gap-4"><div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center border border-gold/25"><span className="text-[8px] uppercase text-gold-soft">{new Date(reservation.date).toLocaleDateString('it-IT', { month: 'short' })}</span><span className="font-display text-xl leading-none text-white">{new Date(reservation.date).getDate()}</span></div><div><h2 className="font-display text-2xl text-white">{reservation.name}</h2><p className="mt-1 text-xs text-smoke">{reservation.email} · {reservation.phone}</p><p className="mt-2 text-xs text-smoke/75">{reservation.guests} ospiti · {reservation.time}{reservation.occasion ? ` · ${reservation.occasion}` : ''}</p></div></div><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><span className={`w-fit rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${statusClass(reservation.status)}`}>{statuses.find((item) => item.value === reservation.status)?.label}</span><select aria-label={`Cambia stato di ${reservation.name}`} value={reservation.status} disabled={updating === reservation._id} onChange={(event) => void updateStatus(reservation._id, event.target.value as ReservationStatus)} className="field-input min-h-10 w-full py-2 text-xs sm:w-44">{statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gold/10 pt-4 text-[10px] uppercase tracking-[0.12em] text-smoke/65"><span>Richiesta {reservation.createdAt ? formatDate(reservation.createdAt) : '—'}</span>{reservation.notes ? <span className="max-w-xl normal-case tracking-normal text-smoke">Note: {reservation.notes}</span> : null}</div></article>)}</section> : <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]"><div className="space-y-3"><h2 className="font-display text-2xl text-white">Carta attuale</h2>{menu.map((item) => <article key={item._id || item.name} className="flex gap-4 border border-gold/15 bg-noir-deep p-4"><div className="relative h-20 w-20 shrink-0 overflow-hidden border border-gold/10"><Image src={item.image || heroImage} alt={item.name} fill sizes="80px" className="object-cover" /></div><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><h3 className="font-display text-xl text-white">{item.name}</h3><span className="text-sm text-gold-soft">{formatPrice(item.price)}</span></div><p className="mt-1 text-xs leading-5 text-smoke">{item.description}</p><p className="mt-2 text-[9px] uppercase tracking-[0.12em] text-gold-soft">{item.category}</p></div></article>)}</div>{canManageMenu ? <form onSubmit={createMenuItem} className="h-fit border border-gold/20 bg-noir-deep p-5 sm:p-6"><div className="flex items-center gap-2"><ChefHat size={18} className="text-gold" strokeWidth={1.5} /><h2 className="font-display text-2xl text-white">Aggiungi piatto</h2></div><div className="mt-6 space-y-4"><div><label htmlFor="new-name" className="field-label">Nome</label><input id="new-name" required value={newItem.name} onChange={(event) => setNewItem({ ...newItem, name: event.target.value })} className="field-input" /></div><div><label htmlFor="new-description" className="field-label">Descrizione</label><textarea id="new-description" required rows={3} value={newItem.description} onChange={(event) => setNewItem({ ...newItem, description: event.target.value })} className="field-input resize-y" /></div><div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="new-category" className="field-label">Categoria</label><select id="new-category" value={newItem.category} onChange={(event) => setNewItem({ ...newItem, category: event.target.value as NewMenuItem['category'] })} className="field-input"><option value="cucina">Cucina</option><option value="cocktails">Mixology</option><option value="shisha">Narghilè</option></select></div><div><label htmlFor="new-price" className="field-label">Prezzo</label><input id="new-price" type="number" min="1" required value={newItem.price} onChange={(event) => setNewItem({ ...newItem, price: Number(event.target.value) })} className="field-input" /></div></div><div><label htmlFor="new-image" className="field-label">URL immagine <span className="text-smoke/50">facoltativo</span></label><input id="new-image" type="url" value={newItem.image} onChange={(event) => setNewItem({ ...newItem, image: event.target.value })} className="field-input" placeholder="https://…" /></div><button type="submit" className="btn-gold w-full"><Plus size={16} />Aggiungi al menu</button></div></form> : null}</section>}
      </main>
    </div>
  );
}
