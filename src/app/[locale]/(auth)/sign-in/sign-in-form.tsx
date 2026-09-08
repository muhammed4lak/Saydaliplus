'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { signIn } from '@/app/actions/auth';

export function SignInForm() {
  const t = useTranslations();
  const [state, formAction, pending] = useActionState(signIn, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="field-label" htmlFor="email">
          {t('auth.email')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          dir="ltr"
          className="field-input"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="password">
          {t('auth.password')}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="field-input"
        />
      </div>

      {state.error !== null && (
        <p role="alert" className="text-[12.5px] font-medium text-amber">
          {t(state.error)}
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? t('common.loading') : t('auth.signIn')}
      </button>
    </form>
  );
}
