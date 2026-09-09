import { getTranslations, setRequestLocale } from 'next-intl/server';
import { NavIcon } from '@/components/icons';

/**
 * What the service worker serves when the network is gone.
 *
 * Deliberately a notice rather than a cached copy of the app: showing somebody
 * a stale listing they cannot act on is worse than telling them plainly that
 * they are offline.
 */
export default async function OfflinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('offline');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-tint">
        <NavIcon name="hourglass" className="h-6 w-6 text-indigo" />
      </div>

      <h1 className="font-display text-[18px] font-bold">{t('title')}</h1>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-ink-soft">
        {t('body')}
      </p>
    </div>
  );
}
