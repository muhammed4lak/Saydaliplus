'use client';

import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';
import { submitRating } from '@/app/actions/marketplace';
import { NavIcon } from '@/components/icons';

/**
 * Rating the other party after a completed booking.
 *
 * Both sides rate, and only after the two-party handoff has completed the
 * booking — the database refuses anything else. A comment is optional: forcing
 * one produces filler, and the star is what feeds the derived average anyway.
 */
export function RateBooking({
  bookingId,
  existingStars,
}: {
  bookingId: string;
  existingStars: number | null;
}) {
  const t = useTranslations('bookings');
  const [stars, setStars] = useState(existingStars ?? 0);
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(submitRating, { ok: false });

  if (existingStars !== null || state.ok) {
    return (
      <span className="flex items-center gap-1 text-[12.5px] font-medium text-ink-soft">
        <NavIcon name="star" className="h-[13px] w-[13px] text-amber" />
        {existingStars ?? stars}
      </span>
    );
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-small">
        {t('rate')}
      </button>
    );
  }

  return (
    <form action={formAction} className="w-full space-y-2">
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="stars" value={stars} />

      <div className="flex items-center justify-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setStars(value)}
            aria-label={`${value}`}
            className="p-1"
          >
            <NavIcon
              name="star"
              className={`h-6 w-6 transition ${value <= stars ? 'text-amber' : 'text-line'}`}
            />
          </button>
        ))}
      </div>

      <textarea
        name="comment"
        rows={2}
        className="field-input resize-none text-[13px]"
        placeholder={t('ratePlaceholder')}
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 rounded-[9px] border border-line py-2 text-[12.5px] font-semibold text-ink-soft"
        >
          {t('cancelRating')}
        </button>
        <button type="submit" disabled={stars === 0 || pending} className="btn-small flex-1">
          {t('rate')}
        </button>
      </div>

      {state.error && (
        <p role="alert" className="text-center text-[12px] font-medium text-amber">
          {state.error}
        </p>
      )}
    </form>
  );
}
