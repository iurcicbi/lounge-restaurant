import Link from 'next/link';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { PageIntro } from '@/components/page-intro';

export const metadata = {
  title: 'Privacy',
  description: 'Notificare de confidențialitate a Noir Lounge Milano.'
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro eyebrow="Notificare" title="Confidențialitatea ta, înainte de toate." description="Tratăm datele cu discreție, transparență și doar pentru a-ți oferi o experiență coerentă cu activitatea noastră." />
      <section className="section-shell pb-24">
        <div className="mx-auto max-w-3xl border border-gold/15 bg-noir-deep p-6 sm:p-10">
          <div className="flex items-center gap-3 border-b border-gold/10 pb-6"><LockKeyhole size={20} className="text-gold" strokeWidth={1.5} /><p className="text-[10px] uppercase tracking-[0.18em] text-gold-soft">Noir Lounge Milano</p></div>
          <div className="prose-invert mt-8 space-y-7 text-sm leading-7 text-smoke">
            <section><h2 className="font-display text-2xl text-white">Datele colectate</h2><p>Când trimiți o cerere de rezervare colectăm numele, e-mailul, telefonul, data, ora, numărul de oaspeți și eventualele notițe pe care alegi să le împărtășești. Când te abonezi la newsletter colectăm adresa ta de e-mail și data consimțământului.</p></section>
            <section><h2 className="font-display text-2xl text-white">Scopuri și temei</h2><p>Utilizăm datele pentru a gestiona cererile de rezervare, a răspunde întrebărilor tale și, doar cu consimțământul tău, pentru a-ți trimite comunicări și invitații rezervate. Datele sunt păstrate doar cât timp este necesar scopului solicitat și obligațiilor legale.</p></section>
            <section><h2 className="font-display text-2xl text-white">Furnizori și securitate</h2><p>Pentru a furniza serviciul putem folosi furnizori tehnici pentru găzduire, baza de date și trimiterea e-mailurilor. Nu vindem datele tale. Accesul la sisteme este limitat la personal și furnizorii autorizați.</p></section>
            <section><h2 className="font-display text-2xl text-white">Drepturile tale</h2><p>Poți cere accesul, rectificarea, ștergerea sau limitarea datelor tale și poți retrage consimțământul în orice moment. Scrie la <a href="mailto:vip@noirlounge.it" className="text-gold-soft underline underline-offset-2">vip@noirlounge.it</a> indicând cererea.</p></section>
          </div>
          <Link href="/" className="btn-quiet mt-8"><ArrowLeft size={15} /> Înapoi la acasă</Link>
        </div>
      </section>
    </>
  );
}
