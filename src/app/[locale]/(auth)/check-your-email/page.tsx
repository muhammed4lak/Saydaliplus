import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { NavIcon } from '@/components/icons';

export default async function CheckYourEmailPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[480px] rounded-[22px] border border-line bg-card p-8 text-center shadow-[0_20px_50px_-24px_rgba(25,23,53,0.28)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-tint">
          <NavIcon name="badge" className="h-6 w-6 text-indigo" />
        </div>

        <h1 className="font-display text-[19px] font-bold">
          {t('auth.fields.universityEmail')}
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-ink-soft">
          {t('auth.fields.universityEmailHint')}
        </p>

        <Link href="/sign-in" className="btn-secondary mt-6 inline-block">
          {t('auth.signIn')}
        </Link>
      </div>
    </div>
  );
}
