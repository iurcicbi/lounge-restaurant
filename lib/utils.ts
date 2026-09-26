import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat('ro-RO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Rome'
  }).format(new Date(value));
}
