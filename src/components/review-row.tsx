'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { decideVerification } from '@/app/actions/admin';
import type { Profile } from '@/lib/supabase/database.types';
import type { Locale } from '@/i18n/routing';

type PendingProfile = Profile & {
  pharmacist_details: {
    syndicate_reg_no: string;
    graduation_year: number;
    card_document_url: string | null;
  } | null;
  pharmacy_details: {
    pharmacy_name_en: string | null;
    licence_no: string;
    licence_document_url: string | null;
  } | null;
  student_details: { university: string; university_email: string } | null;
};

export function ReviewRow({
  profile,
  locale,
}: {
  profile: PendingProfile;
  locale: Locale;
}) {
  const t = useTranslations('admin');
  const [pending, startTransition] = useTransition();
  const [decided, setDecided] = useState<'verified' | 'rejected' | null>(null);
  const [reason, setReason] = useState('');

  const name =
    (locale === 'ar' ? profile.full_name_ar : profile.full_name_en) ?? profile.full_name_en ?? '';

  const documentUrl =
    profile.pharmacist_details?.card_document_url ??
    profile.pharmacy_details?.licence_document_url ??
    null;

  // The reviewer is comparing a number on a photograph against Syndicate
  // records, so the number is shown in full and in mono. This is the one place
  // it is not masked — masking it here would make the job impossible.
  const registration =
    profile.pharmacist_details?.syndicate_reg_no ??
    profile.pharmacy_details?.licence_no ??
    profile.student_details?.university_email ??
    '';

  const decide = (decision: 'verified' | 'rejected') => {
    startTransition(async () => {
      const result = await decideVerification(profile.id, decision, reason || undefined);
      if (result.ok) setDecided(decision);
    });
  };

  if (decided) {
    return (
      <div className="card p-4 opacity-60">
        <p className="text-[13px]">
          {name} — {t(decided === 'verified' ? 'approve' : 'reject')}
        </p>
      </div>
    );
  }

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[14.5px] font-semibold">{name}</p>
          <p className="mt-0.5 text-[12px] text-ink-faint">
            {profile.role} · {profile.district}
          </p>
        </div>
        <span className="figure text-[12.5px] text-ink-soft" dir="ltr">
          {registration}
        </span>
      </div>

      {documentUrl ? (
        <a
          href={documentUrl}
          target="_blank"
          rel="noreferrer"
          className="mb-3 inline-block text-[12.5px] font-medium text-indigo underline underline-offset-2"
        >
          {t('document')}
        </a>
      ) : (
        <p className="mb-3 text-[12.5px] text-amber">{t('document')} — —</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={t('rejectReason')}
          className="field-input flex-1 !py-2 text-[13px]"
        />
        <button
          type="button"
          onClick={() => decide('rejected')}
          disabled={pending}
          className="rounded-[9px] border border-line px-3 py-2 text-[12.5px] font-semibold text-ink-soft"
        >
          {t('reject')}
        </button>
        <button
          type="button"
          onClick={() => decide('verified')}
          disabled={pending}
          className="btn-small !bg-palm"
        >
          {t('approve')}
        </button>
      </div>
    </div>
  );
}
