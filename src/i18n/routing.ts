import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

/**
 * Arabic is the default and carries no URL prefix; English is the alternative.
 *
 * This is not a formality. The people using this app work in Arabic, and an
 * English-first product that offers Arabic as a translation reads as something
 * built elsewhere and shipped in — which is the opposite of the positioning.
 */
export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];

export const localeDirection: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
};

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
