import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { NavIcon, type IconName } from '@/components/icons';
import { SignUpForm } from '@/components/sign-up-form';

const ROLES = [
  { key: 'pharmacist', icon: 'user' },
  { key: 'pharmacy', icon: 'home' },
  { key: 'student', icon: 'cap' },
] as const satisfies readonly { key: string; icon: IconName }[];

export default async function SignUpPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const { locale } = await params;
  const { role } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('auth');
  const chosen = ROLES.find((option) => option.key === role);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[520px] rounded-[22px] border border-line bg-card p-8 shadow-[0_20px_50px_-24px_rgba(25,23,53,0.28)]">
        {!chosen ? (
          <>
            <h1 className="font-display text-[19px] font-bold">{t('signUp')}</h1>
            <p className="mb-5 mt-1 text-[13px] text-ink-faint">{t('chooseRole')}</p>

            <div className="flex flex-col gap-2.5">
              {ROLES.map((option) => (
                <Link
                  key={option.key}
                  href={{ pathname: '/sign-up', query: { role: option.key } }}
                  className="flex items-center gap-3.5 rounded-[14px] border-[1.6px] border-line
                             bg-card p-4 text-start transition hover:border-indigo hover:bg-indigo-tint/40"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-tint">
                    <NavIcon name={option.icon} className="h-5 w-5 text-indigo-dark" />
                  </span>
                  <span>
                    <span className="block text-[14px] font-semibold">
                      {t(`roles.${option.key}`)}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] leading-relaxed text-ink-faint">
                      {t(`roles.${option.key}Sub`)}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <SignUpForm role={chosen.key} />
        )}

        <p className="mt-5 text-center text-[13px] text-ink-soft">
          {t('alreadyRegistered')}{' '}
          <Link href="/sign-in" className="font-medium text-indigo underline underline-offset-2">
            {t('signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
}
