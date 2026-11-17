import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: string): string {
  return value;
}

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    slots: 'Automaty',
    live: 'Live Casino',
    crypto: 'Krypto',
    sports: 'Zakłady sportowe',
    all: 'Wszystkie',
  };
  return map[category] || category;
}

export function generateId(): string {
  return crypto.randomUUID();
}