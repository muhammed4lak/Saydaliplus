'use client';

import { useTranslations } from 'next-intl';
import { signOut } from '@/app/actions/auth';

export function SignOutButton() {
  const t = useTranslations('auth');

  return (
    <form action={signOut}>
      <button type="submit" className="btn-secondary">
        {t('signOut')}
      </button>
    </form>
  );
}
