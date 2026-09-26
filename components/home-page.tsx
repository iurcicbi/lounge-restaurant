'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Cloud,
  Flame,
  Gem,
  LockKeyhole,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Utensils,
  Volume2,
  Wine
} from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/reveal';
import { GalleryLightbox } from '@/components/gallery-lightbox';
import { ImageFrame } from '@/components/image-frame';
import { events, heroImage, menuItems, signatureDishes, storyImage } from '@/lib/content';
import { formatPrice } from '@/lib/utils';
import type { MenuItem } from '@/lib/content';

const storyFeatures = [
  { title: 'Bucătărie nocturnă', text: 'Serviciu complet până la 02:30, cu o carte care urmează ritmul nopții.' },
  { title: 'Cărbuni de cocos', text: 'Igienă, temperatură constantă și arome care nu acoperă conversația.' },
  { title: 'Sound design', text: '55 dB pentru conversații discrete, cu note care rămân sub piele.' }
];

const ritualFeatures = [
  { icon: Sparkles, title: 'Pahare artizanale', text: 'Sticlă suflată în Franța și oțel medical pentru o tirajă catifelată.' },
  { icon: Cloud, title: 'Blend-uri rare', text: 'Tutunuri selectate manual, cu intensitate reglabilă pentru ritualul tău.' },
  { icon: Flame, title: 'Sommelier la masă', text: 'Gestionarea jarului și rotația aromelor, fără griji.' }
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-gold/25 pl-3 first:border-l-0 first:pl-0">
      <p className="font-display text-2xl text-gold-soft sm:text-3xl">{value}</p>
      <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-smoke/75">{label}</p>
    </div>
  );
}

function DishCard({ item }: { item: MenuItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden border border-gold/15 bg-noir-deep transition duration-500 hover:-translate-y-1 hover:border-gold/45 hover:shadow-gold">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
        <div className="image-vignette absolute inset-0" />
        <span className="absolute right-4 top-4 border border-gold/25 bg-black/75 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-soft backdrop-blur-sm">{item.tags[0]}</span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-xl text-white transition group-hover:text-gold-soft">{item.name}</h3>
          <span className="shrink-0 text-sm font-semibold text-gold-soft">{formatPrice(item.price)}</span>
        </div>
        <p className="mt-3 flex-1 text-sm leading-6 text-smoke">{item.description}</p>
        <div className="mt-5 flex items-center justify-between border-t border-gold/10 pt-4 text-[10px] uppercase tracking-[0.12em] text-smoke/75">
          <span>{item.pairing}</span>
          <ArrowUpRight size={15} className="text-gold transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
        </div>
      </div>
    </article>
  );
}

function EventCard({ event }: { event: (typeof events)[number] }) {
  return (
    <article className="group flex h-full flex-col justify-between border border-gold/15 bg-noir-deep p-5 transition duration-500 hover:border-gold/45 hover:bg-noir-card sm:p-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-gold/25 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-soft">{event.tag}</span>
          <span className="text-xs text-smoke">{event.time}</span>
        </div>
        <h3 className="mt-6 font-display text-2xl text-white transition group-hover:text-gold-soft">{event.title}</h3>
        <p className="mt-3 text-sm leading-6 text-smoke">{event.description}</p>
      </div>
      <div className="mt-8 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-gold-soft">{event.month}</p>
          <p className="font-display text-4xl leading-none text-white">{event.day}</p>
        </div>
        <Link href="/prenotazioni" className="btn-quiet min-h-10 px-4 text-[9px]">RSVP <ArrowRight size={14} /></Link>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="relative isolate flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden pt-28 lg:min-h-[48rem] lg:pt-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(204,147,32,0.14),transparent_70%)]" />
        <div className="pointer-events-none absolute -right-40 top-24 h-[30rem] w-[30rem] rounded-full bg-gold/10 blur-[130px]" />
        <div className="pointer-events-none absolute -left-48 bottom-0 h-[26rem] w-[26rem] rounded-full bg-gold-muted/10 blur-[120px]" />
        <div className="section-shell relative grid items-center gap-14 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 lg:py-24">
          <Reveal>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-noir-deep/80 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-smoke shadow-gold">
              <span className="gold-dot animate-pulse" />
              Milano · selecție privată
            </div>
            <h1 className="max-w-4xl font-display text-[clamp(3.2rem,8vw,6.6rem)] leading-[0.96] tracking-[-0.045em] text-white">
              Arta plăcerului <em className="text-gold-soft">nocturn</em>.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-smoke sm:text-lg">Un sanctuariu exclusiv de haute gastronomie, mixologie de autor și narghilă ceremonială. Lumini difuze, intimitate și ritualuri senzoriale fără timp.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/prenotazioni" className="btn-gold min-h-14 px-7">Rezervă un loc <ArrowUpRight size={16} strokeWidth={1.5} /></Link>
              <Link href="/menu" className="btn-quiet min-h-14 px-7">Descoperă meniul <Utensils size={16} strokeWidth={1.5} /></Link>
            </div>
            <div className="mt-12 grid max-w-md grid-cols-3 gap-4">
              <Stat value="12" label="Alcove private" />
              <Stat value="40+" label="Botanice rare" />
              <Stat value="100%" label="Discreție" />
            </div>
          </Reveal>
          <Reveal delay={0.15} className="relative mx-auto w-full max-w-[31rem]">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gold/10 blur-3xl" />
            <div className="relative aspect-[4/5] overflow-hidden border border-gold/25 bg-noir-card shadow-panel">
              <Image src={heroImage} alt="Interiorul întunecat și luminos al Noir Lounge" fill priority sizes="(max-width: 1024px) 90vw, 38vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 border border-gold/20 bg-black/70 p-4 backdrop-blur-md">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-soft">Experiență semnătură</p>
                  <p className="mt-1 font-display text-xl text-white">The Golden Smoke</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold-soft"><Wine size={18} strokeWidth={1.5} /></div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 border border-gold/20 bg-noir-deep/95 px-4 py-3 shadow-panel sm:flex">
              <Volume2 size={17} className="text-gold" strokeWidth={1.5} />
              <div><p className="text-[9px] uppercase tracking-[0.15em] text-gold-soft">Sound design</p><p className="text-xs text-smoke">55 dB · conversații discrete</p></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-gold/10 bg-noir-deep/45 py-20 lg:py-32" id="storia">
        <div className="section-shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <ImageFrame src={storyImage} alt="Alcovă privată cu catifea neagră și lumină ambrată" className="aspect-[4/3] rounded-[1.75rem]" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute -bottom-5 right-4 hidden max-w-[15rem] border border-gold/20 bg-noir-deep/95 p-4 shadow-panel sm:block">
              <div className="flex items-center gap-2 text-gold-soft"><ShieldCheck size={16} strokeWidth={1.5} /><span className="text-[9px] font-semibold uppercase tracking-[0.16em]">Precizie acustică</span></div>
              <p className="mt-2 text-xs leading-5 text-smoke">Sunet calculat pentru a lăsa spațiu cuvintelor.</p>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <span className="eyebrow">Manifest exclusiv</span>
            <h2 className="mt-5 font-display text-4xl leading-tight text-white sm:text-5xl">Esența lui Noir: un spațiu retras din timp.</h2>
            <div className="mt-7 space-y-5 text-sm leading-7 text-smoke sm:text-base">
              <p><span className="float-left mr-2 mt-1 font-display text-6xl leading-[0.75] text-gold-soft">Î</span>n umbră se află adevărata intimitate. Noir Lounge se naște din dorința de a crea un refugiu ascuns privirii publice, unde fiecare detaliu răspunde unui canon de excelență sartorială.</p>
              <p>Alcovele private cu catifea oferă maximă discreție. Bucătăria, barul de mixologie și Shisha Sommelier lucrează împreună pentru a orchestra acorduri aromatice imposibil de replicat în altă parte.</p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {storyFeatures.map((feature) => <div key={feature.title} className="border border-gold/15 bg-noir-card/60 p-4"><p className="text-xs font-semibold text-white">{feature.title}</p><p className="mt-2 text-xs leading-5 text-smoke">{feature.text}</p></div>)}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-32" id="menu-preview">
        <div className="section-shell">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div><span className="eyebrow">Selecție gastronomică</span><h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">Creații de autor</h2></div>
            <Link href="/menu" className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-soft transition hover:text-white">Explorează meniul complet <ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link>
          </Reveal>
          <Stagger className="mt-10 grid gap-5 md:grid-cols-3">
            {signatureDishes.map((item) => <StaggerItem key={item.name}><DishCard item={item} /></StaggerItem>)}
          </Stagger>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-gold/10 bg-noir-deep/60 py-20 lg:py-32" id="narghile">
        <div className="pointer-events-none absolute right-0 top-0 h-[30rem] w-[30rem] rounded-full bg-gold/10 blur-[130px]" />
        <div className="section-shell relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <span className="eyebrow">Ceremonial exclusiv</span>
            <h2 className="mt-5 max-w-xl font-display text-4xl leading-tight text-white sm:text-5xl">Măestria narghilei de înaltă clasă.</h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-smoke sm:text-base">Nu o simplă șisă, ci un ritual îngrijit până în cele mai mici detalii. Pipe-uri artizanale, tutunuri organice și arome selectate pentru a însoți fiecare înghițitură.</p>
            <div className="mt-8 space-y-3">
              {ritualFeatures.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4 border border-gold/15 bg-noir-card/60 p-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/25 text-gold-soft"><Icon size={17} strokeWidth={1.5} /></div><div><h3 className="text-sm font-semibold text-white">{title}</h3><p className="mt-1 text-xs leading-5 text-smoke">{text}</p></div></div>)}
            </div>
            <Link href="/narghile" className="btn-gold mt-8">Descoperă amestecurile <ArrowRight size={16} /></Link>
          </Reveal>
          <Reveal delay={0.12} className="relative">
            <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border border-gold/20 bg-noir-card shadow-panel">
              <Image src={menuItems[5].image} alt="Narghilă artizanală cu fum aromat" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              <div className="image-vignette absolute inset-0" />
              <div className="absolute left-5 top-5 border border-gold/20 bg-black/75 p-4 backdrop-blur-md"><p className="text-[9px] uppercase tracking-[0.16em] text-smoke">Profil blend</p><div className="mt-3 flex gap-1.5">{[1, 2, 3, 4, 5].map((dot) => <span key={dot} className={`h-2.5 w-2.5 rounded-full ${dot < 5 ? 'bg-gold shadow-[0_0_10px_rgba(204,147,32,0.75)]' : 'bg-gold/20'}`} />)}</div><p className="mt-2 text-xs text-white">Ridicată · catifelată</p></div>
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border border-gold/20 bg-black/70 p-4 backdrop-blur-md"><div><p className="text-[9px] uppercase tracking-[0.16em] text-gold-soft">Shisha sommelier</p><p className="mt-1 font-display text-lg text-white">Respirația nopții</p></div><Cloud size={22} className="text-gold-soft" strokeWidth={1.5} /></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-32" id="eventi">
        <div className="section-shell">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><span className="eyebrow">Calendar nocturn</span><h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">Nopți & selecții muzicale</h2></div><Link href="/eventi" className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-soft hover:text-white">Toate evenimentele <ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link></Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">{events.map((event) => <Reveal key={event.title}><EventCard event={event} /></Reveal>)}</div>
        </div>
      </section>

      <section className="border-y border-gold/10 bg-noir-deep/45 py-20 lg:py-32" id="galleria">
        <div className="section-shell">
          <Reveal className="mx-auto max-w-2xl text-center"><span className="eyebrow justify-center before:hidden">Momente privilegiate</span><h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">Ochiul nopții</h2><p className="mt-4 text-sm leading-7 text-smoke">O privire în interiorul spațiilor intime, creațiile de mixologie și seratele cele mai alese.</p></Reveal>
          <div className="mt-10"><GalleryLightbox /></div>
        </div>
      </section>

      <section className="py-20 lg:py-32" id="vip">
        <div className="section-shell">
          <Reveal className="relative overflow-hidden border border-gold/20 bg-noir-deep p-7 shadow-panel sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/10 blur-[90px]" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div><span className="eyebrow">Experiență pe măsura ta</span><h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight text-white sm:text-4xl">Dorești o alcove exclusivă pentru seara ta?</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-smoke">Prioritate de acces, serviciu dedicat și amenajare personalizată pentru grupuri private. Concierge-ul desenează fiecare detaliu în jurul visului tău.</p></div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col"><Link href="/prenotazioni" className="btn-gold whitespace-nowrap">Rezervă lounge VIP <ArrowUpRight size={16} /></Link><a href="https://wa.me/390289457712" target="_blank" rel="noreferrer" className="btn-quiet whitespace-nowrap"><MessageCircle size={16} className="text-gold" strokeWidth={1.5} /> WhatsApp concierge</a></div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="pointer-events-none fixed bottom-24 right-4 z-30 hidden sm:block lg:bottom-7 lg:right-7">
        <a href="https://wa.me/390289457712" target="_blank" rel="noreferrer" className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-gold/60 bg-noir-deep/90 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-soft shadow-gold backdrop-blur transition hover:bg-gold/10 hover:text-white"><MessageCircle size={16} strokeWidth={1.5} /> Concierge</a>
      </div>
    </div>
  );
}
