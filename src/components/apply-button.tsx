'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { applyToListing } from '@/app/actions/marketplace';

export function ApplyButton({
  listingId,
  isInternship,
  alreadyApplied,
  isVerified,
}: {
  listingId: string;
  isInternship: boolean;
  alreadyApplied: boolean;
  isVerified: boolean;
}) {
  const t = useTranslations();
  const [pending, startTransition] = useTransition();
  const [applied, setApplied] = useState(alreadyApplied);
  const [error, setError] = useState<string | null>(null);

  const apply = () => {
    setError(null);
    startTransition(async () => {
      const result = await applyToListing(listingId);
      if (result.ok) setApplied(true);
      else setError(result.error ?? t('common.somethingWentWrong'));
    });
  };

  if (applied) {
    return (
      <div className="space-y-2">
        <p className="rounded-card bg-palm-tint px-4 py-3 text-center text-[13px] font-medium text-palm">
          {t('listings.applied')}
        </p>
        {/* An unverified pharmacist's application is real but held back, and
            saying so is the whole point of letting them apply early. */}
        {!isVerified && (
          <p className="text-center text-[12px] leading-relaxed text-ink-faint">
            {t('verification.queuedApplication')}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={apply} disabled={pending} className="btn-primary">
        {pending
          ? t('common.loading')
          : t(isInternship ? 'listings.applyForPlacement' : 'listings.applyForShift')}
      </button>

      {!isVerified && (
        <p className="text-center text-[12px] leading-relaxed text-ink-faint">
          {t('verification.queuedApplication')}
        </p>
      )}

      {error !== null && (
        <p role="alert" className="text-center text-[12.5px] font-medium text-amber">
          {error}
        </p>
      )}
    </div>
  );
}
