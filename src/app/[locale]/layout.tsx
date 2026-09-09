import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { IBM_Plex_Mono, IBM_Plex_Sans, Noto_Kufi_Arabic, Space_Grotesk } from 'next/font/google';
import { type Locale, localeDirection, routing } from '@/i18n/routing';
import { ServiceWorker } from '@/components/service-worker';
import '../globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['500', '700'],
  variable: '--font-noto-kufi',
  display: 'swap',
});

const isSupportedLocale = (value: string): value is Locale =>
  (routing.locales as readonly string[]).includes(value);

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#2D2A6E',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'brand' });

  return {
    title: t('name'),
    description: t('tagline'),
    manifest: '/manifest.webmanifest',
    appleWebApp: { capable: true, title: t('name'), statusBarStyle: 'default' },
    icons: {
      icon: [{ url: '/favicon-32.png', sizes: '32x32', type: 'image/png' }],
      apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);

  // next-intl 3.x does not pass messages to client components implicitly, so
  // without this every `useTranslations` in a Client Component throws
  // MISSING_MESSAGE — the language switch, the apply button, the handoff
  // checklist. The pages still render server-side, which is exactly what makes
  // the omission easy to miss.
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={localeDirection[locale]}
      className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} ${notoKufi.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        <ServiceWorker />
      </body>
    </html>
  );
}
