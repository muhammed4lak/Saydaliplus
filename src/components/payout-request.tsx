'use client';

import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';
import { requestPayout } from '@/app/actions/payouts';
import { formatIQD } from '@/lib/money';
import type { Locale } from '@/i18n/routing';
import type { PayoutMethod } from '@/lib/supabase/database.types';

const METHODS: PayoutMethod[] = ['zaincash', 'qicard'];

export function PayoutRequest({
  owed,
  locale,
  canRequest,
  isVerified,
}: {
  owed: number;
  locale: Locale;
  canRequest: boolean;
  isVerified: boolean;
}) {
  const t = useTranslations();
  const [method, setMethod] = useState<PayoutMethod>('zaincash');
  const [state, formAction, pending] = useActionState(requestPayout, { ok: false });

  return (
    <form action={formAction} className="card p-4">
      <input type="hidden" name="method" value={method} />

      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[12px] text-ink-faint">{t('earnings.availableBalance')}</p>
          <p className="figure mt-0.5 text-[19px] font-semibold">{formatIQD(owed, locale)}</p>
        </div>

        <div className="flex rounded-[10px] bg-indigo-tint p-[3px]">
          {METHODS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMethod(option)}
              className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold text-indigo-dark transition ${
                method === option ? 'bg-white shadow-sm' : ''
              }`}
            >
              {t(`earnings.methods.${option}`)}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={!canRequest || pending}>
        {pending ? t('common.loading') : t('earnings.requestPayout')}
      </button>

      {owed <= 0 && (
        <p className="mt-2 text-center text-[12px] text-ink-faint">
          {t('earnings.nothingPayable')}
        </p>
      )}

      {!isVerified && (
        <p className="mt-2 text-center text-[12px] leading-relaxed text-ink-faint">
          {t('verification.banner')}
        </p>
      )}

      {state.ok && (
        <p className="mt-3 rounded-card bg-palm-tint px-4 py-3 text-center text-[13px] font-medium text-palm">
          {t('earnings.requested')} — {t('earnings.payoutNote')}
        </p>
      )}

      {state.error && (
        <p role="alert" className="mt-2 text-center text-[12.5px] font-medium text-amber">
          {t(state.error)}
        </p>
      )}
    </form>
  );
}
