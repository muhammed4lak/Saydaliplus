'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { cancelBooking } from '@/app/actions/marketplace';
import type { CancellationOutcome } from '@/lib/reliability';

/**
 * Cancelling an upcoming shift.
 *
 * The confirmation says plainly what it will cost, because the two cases are
 * genuinely different: withdrawing two days out is a normal thing a person does
 * and costs nothing, while withdrawing three hours out leaves a pharmacy shut.
 * Hiding that distinction would be the easy way to look friendly and the fast
 * way to lose a pharmacy's trust.
 */
export function CancelBooking({
  bookingId,
  outcome,
}: {
  bookingId: string;
  outcome: CancellationOutcome;
}) {
  const t = useTranslations('bookings');
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-[13px] border border-line px-4 py-[11.5px] text-sm font-semibold text-ink-soft transition hover:border-amber hover:text-amber"
      >
        {t('cancel')}
      </button>
    );
  }

  return (
    <div className="w-full space-y-2 rounded-card border border-amber-tint bg-amber-tint/50 p-3">
      <p className="text-[12.5px] leading-relaxed text-[#8a5610]">
        {outcome === 'free' ? t('cancelFree') : t('cancelLate')}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="flex-1 rounded-[9px] border border-line bg-white py-2 text-[12.5px] font-semibold text-ink-soft"
        >
          {t('keepShift')}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(async () => void (await cancelBooking(bookingId)))}
          className="flex-1 rounded-[9px] bg-amber py-2 text-[12.5px] font-semibold text-white"
        >
          {t('cancelConfirm')}
        </button>
      </div>
    </div>
  );
}
