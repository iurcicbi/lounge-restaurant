'use client';

import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { Maximize2, X } from 'lucide-react';
import { useState } from 'react';
import { galleryImages } from '@/lib/content';
import { cn } from '@/lib/utils';

export function GalleryLightbox() {
  const [selected, setSelected] = useState<number | null>(null);
  const current = selected === null ? null : galleryImages[selected];

  return (
    <Dialog.Root open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
      <div className="grid gap-4 md:grid-cols-12">
        {galleryImages.map((image, index) => (
          <Dialog.Trigger asChild key={image.src}>
            <button
              type="button"
              onClick={() => setSelected(index)}
              className={cn(
                'group relative min-h-64 overflow-hidden border border-gold/15 bg-noir-card text-left transition duration-500 hover:border-gold/50',
                index === 0 || index === 3 ? 'md:col-span-8' : 'md:col-span-4',
                index < 2 ? 'aspect-[16/10]' : 'aspect-[4/3]'
              )}
              aria-label={`Deschide ${image.title}`}
            >
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 66vw" className="object-cover transition duration-700 group-hover:scale-105" />
              <div className="image-vignette absolute inset-0" />
              <span className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-left text-sm font-medium text-white"><span>{image.title}</span><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold-soft"><Maximize2 size={14} strokeWidth={1.5} /></span></span>
            </button>
          </Dialog.Trigger>
        ))}
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(94vw,75rem)] -translate-x-1/2 -translate-y-1/2 outline-none">
          <Dialog.Title className="sr-only">Galeria Noir Lounge</Dialog.Title>
          <Dialog.Description className="sr-only">Vizualizează imaginea selectată pe tot ecranul.</Dialog.Description>
          {current ? <div className="relative aspect-[16/10] overflow-hidden border border-gold/30 bg-noir-card shadow-panel"><Image src={current.src} alt={current.alt} fill sizes="94vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" /><p className="absolute bottom-5 left-5 font-display text-2xl text-white">{current.title}</p></div> : null}
          <Dialog.Close asChild><button type="button" aria-label="Închide imaginea" className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-noir-deep text-gold-soft shadow-gold transition hover:bg-gold/10 hover:text-white"><X size={18} strokeWidth={1.5} /></button></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
