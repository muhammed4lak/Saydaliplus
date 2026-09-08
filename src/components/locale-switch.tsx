'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { routing } from '@/i18n/routing';

/**
 * Switches the app's language. Note what it does not switch: a pharmacist's CV
 * has its own language toggle, because the two are genuinely independent — you
 * may well browse in Arabic while writing an English CV for a Gulf employer.
 */
export function LocaleSwitch({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('common');

  return (
    <div className={`flex items-center gap-1 text-[12.5px] font-medium ${className}`}>
      {routing.locales.map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          onClick={() => router.replace(pathname, { locale: option })}
          aria-current={option === locale ? 'true' : undefined}
          className={`rounded-full px-2.5 py-1 transition ${
            option === locale ? 'bg-white/20 text-current' : 'opacity-70 hover:opacity-100'
          }`}
        >
          {option === 'ar' ? t('arabic') : t('english')}
        </button>
      ))}
    </div>
  );
}
