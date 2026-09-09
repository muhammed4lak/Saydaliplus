'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { savePayoutDestination } from '@/app/actions/payouts';

/**
 * Where the money goes.
 *
 * Asked for explicitly rather than assumed from the account phone: a ZainCash
 * wallet is often registered to a different number, and a transfer to the wrong
 * one cannot be pulled back. The hint says so, because somebody typing quickly
 * needs to know this is the field where a typo costs them a shift's pay.
 */
export function PayoutDestination({ current }: { current: string | null }) {
  const t = useTranslations('earnings');
  const [state, formAction, pending] = useActionState(savePayoutDestination, { ok: false });

  return (
    <form action={formAction} className="card p-4">
      <label className="field-label" htmlFor="destination">
        {t('destination')}
      </label>

      <div className="flex gap-2">
        <input
          id="destination"
          name="destination"
          defaultValue={current ?? ''}
          dir="ltr"
          inputMode="tel"
          placeholder="07XX XXX XXXX"
          className="field-input figure flex-1"
        />
        <button type="submit" disabled={pending} className="btn-small">
          {pending ? '…' : state.ok ? '✓' : t('save')}
        </button>
      </div>

      <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-faint">{t('destinationHint')}</p>

      {state.ok && (
        <p className="mt-1.5 text-[12px] font-medium text-palm">{t('destinationSaved')}</p>
      )}
      {state.error && (
        <p role="alert" className="mt-1.5 text-[12px] font-medium text-amber">
          {t('destinationInvalid')}
        </p>
      )}
    </form>
  );
}
