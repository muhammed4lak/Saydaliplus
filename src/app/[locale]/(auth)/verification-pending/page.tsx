import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { NavIcon } from '@/components/icons';

export default async function VerificationPendingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('verification');

  const steps = [
    { key: 'created', state: 'done' as const },
    { key: 'review', state: 'current' as const },
    { key: 'active', state: 'upcoming' as const },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[520px] rounded-[22px] border border-line bg-card p-8 text-center shadow-[0_20px_50px_-24px_rgba(25,23,53,0.28)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-tint">
          <NavIcon name="hourglass" className="h-6 w-6 text-amber" />
        </div>

        <h1 className="font-display text-[19px] font-bold">{t('pendingTitle')}</h1>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-ink-soft">
          {t('pendingBody')}
        </p>

        <ol className="my-6 space-y-3 text-start">
          {steps.map((step) => (
            <li key={step.key} className="flex items-start gap-3">
              <span
                className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                  step.state === 'done'
                    ? 'bg-palm'
                    : step.state === 'current'
                      ? 'bg-amber'
                      : 'bg-line'
                }`}
              />
              <span>
                <span className="block text-[13.5px] font-semibold">{t(`steps.${step.key}`)}</span>
                <span className="mt-0.5 block text-[12px] text-ink-faint">
                  {t(`steps.${step.key}Sub`)}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <p className="mb-5 rounded-[11px] bg-mist p-3 text-[12px] leading-relaxed text-ink-soft">
          {t('manualNote')}
        </p>

        {/* Limited access is the point: browsing and applying keep the account
            alive through a week of waiting, and RLS is what holds the
            applications back. */}
        <Link href="/" className="btn-primary inline-block">
          {t('banner')}
        </Link>
      </div>
    </div>
  );
}
