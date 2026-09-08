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

  // Browser negotiation is off deliberately.
  //
  // With next-intl's default (`localeDetection: true`), an Accept-Language
  // header of en-US serves English from the unprefixed path — so "Arabic is the
  // default" quietly becomes "whatever the handset is set to". In Iraq a great
  // many phones are set to an English UI by people who read and work in Arabic,
  // and Android's default out of the box is English. Negotiating on that header
  // would show most of our users an English product.
  //
  // Arabic is what everyone gets. English is a choice, made with the switch and
  // carried in the URL.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const localeDirection: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
};

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
