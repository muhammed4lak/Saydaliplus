'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { acceptApplicant } from '@/app/actions/marketplace';
import { NavIcon } from '@/components/icons';
import type { ApplicantCard } from '@/lib/supabase/database.types';
import type { Locale } from '@/i18n/routing';

export function ApplicantCardView({
  applicant,
  locale,
}: {
  applicant: ApplicantCard;
  locale: Locale;
}) {
  const t = useTranslations('applicants');
  const [pending, startTransition] = useTransition();
  const [accepted, setAccepted] = useState(false);

  const name =
    (locale === 'ar' ? applicant.full_name_ar : applicant.full_name_en) ??
    applicant.full_name_en ??
    '';

  const shifts = applicant.shifts_completed ?? 0;
  const reliability = applicant.reliability_percent;

  const accept = () => {
    startTransition(async () => {
      const result = await acceptApplicant(applicant.application_id);
      if (result.ok) setAccepted(true);
    });
  };

  return (
    <div className="card p-4">
      <div className="mb-2.5 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[14.5px] font-semibold">{name}</p>
          <p className="mt-0.5 text-[12px] text-ink-faint">
            {applicant.district}
            {applicant.university && ` · ${applicant.university}`}
          </p>
        </div>

        {applicant.average_rating !== null && (
          <span className="flex items-center gap-1 text-[12.5px] font-medium text-ink-soft">
            <NavIcon name="star" className="h-[13px] w-[13px] text-amber" />
            {applicant.average_rating}
          </span>
        )}
      </div>

      {/* The verified record. An account with no history reads as "no record
          yet" rather than 100% — a pharmacy weighing a stranger against a
          proven pharmacist has to be able to tell those apart. */}
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-ink-soft">
        {shifts > 0 || reliability !== null ? (
          <>
            <span>{t('shiftsCompleted', { count: shifts })}</span>
            {reliability !== null && <span>{t('reliability', { percent: reliability })}</span>}
          </>
        ) : (
          <span title={t('noRecordHint')} className="text-ink-faint">
            {t('noRecord')}
          </span>
        )}
      </div>

      {applicant.syndicate_reg_masked && (
        <p className="mb-3 text-[12px] text-ink-faint">
          {t('syndicateId')}:{' '}
          <span className="figure" dir="ltr">
            {applicant.syndicate_reg_masked}
          </span>
        </p>
      )}

      <div className="flex justify-end">
        {accepted ? (
          <span className="badge-verified">{t('accepted')}</span>
        ) : (
          <button type="button" onClick={accept} disabled={pending} className="btn-small">
            {t('accept')}
          </button>
        )}
      </div>
    </div>
  );
}
