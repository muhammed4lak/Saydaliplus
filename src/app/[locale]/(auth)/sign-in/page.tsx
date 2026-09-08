import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { getSession } from '@/lib/session';
import { SignInForm } from './sign-in-form';
import { LocaleSwitch } from '@/components/locale-switch';

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (await getSession()) redirect('/');

  const t = await getTranslations('auth');
  const tBrand = await getTranslations('brand');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="mb-4">
        <LocaleSwitch className="text-ink-soft" />
      </div>

      <div className="w-full max-w-[520px] rounded-[22px] border border-line bg-card p-8 shadow-[0_20px_50px_-24px_rgba(25,23,53,0.28)]">
        <p className="text-center font-display text-[27px] font-bold text-indigo">Saydali+</p>
        <p className="mt-0.5 text-center text-[15px] text-ink-faint" dir="rtl" lang="ar">
          صيدلي+
        </p>
        <p className="mx-auto mt-3 max-w-sm text-center text-[13.5px] leading-relaxed text-ink-soft">
          {tBrand('tagline')}
        </p>

        <div className="my-6 h-px bg-line" />

        <h1 className="font-display text-[19px] font-bold">{t('signIn')}</h1>
        <p className="mb-5 mt-1 text-[13px] text-ink-faint">{t('welcomeBack')}</p>

        <SignInForm />

        <p className="mt-4 text-center text-[13px] text-ink-soft">
          {t('newHere')}{' '}
          <Link href="/sign-up" className="font-medium text-indigo underline underline-offset-2">
            {t('createAccount')}
          </Link>
        </p>
      </div>
    </div>
  );
}
