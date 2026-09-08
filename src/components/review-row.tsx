'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { decideVerification } from '@/app/actions/admin';
import { getDocumentUrl } from '@/app/actions/documents';
import { NavIcon } from '@/components/icons';
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

export function ReviewRow({ profile, locale }: { profile: PendingProfile; locale: Locale }) {
  const t = useTranslations('admin');
  const [pending, startTransition] = useTransition();
  const [decided, setDecided] = useState<'verified' | 'rejected' | null>(null);
  const [reason, setReason] = useState('');
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [loadingDoc, setLoadingDoc] = useState(false);

  const name =
    (locale === 'ar' ? profile.full_name_ar : profile.full_name_en) ?? profile.full_name_en ?? '';

  const documentPath =
    profile.pharmacist_details?.card_document_url ??
    profile.pharmacy_details?.licence_document_url ??
    null;

  // Shown in full here, and only here. Everywhere else the registration number
  // is masked; the reviewer's entire job is comparing it against the document.
  const registration =
    profile.pharmacist_details?.syndicate_reg_no ??
    profile.pharmacy_details?.licence_no ??
    profile.student_details?.university_email ??
    '';

  const openDocument = () => {
    if (!documentPath) return;
    setLoadingDoc(true);
    startTransition(async () => {
      // The bucket is private, so the reviewer gets a short-lived signed URL
      // rather than a link that would still work if it were forwarded.
      const url = await getDocumentUrl(documentPath);
      setLoadingDoc(false);
      if (url) {
        setDocumentUrl(url);
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  };

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

      {documentPath ? (
        <button
          type="button"
          onClick={openDocument}
          disabled={loadingDoc}
          className="mb-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-indigo underline underline-offset-2"
        >
          <NavIcon name="clipboard" className="h-3.5 w-3.5" />
          {loadingDoc ? '…' : documentUrl ? t('documentReopen') : t('document')}
        </button>
      ) : (
        /* No document means there is nothing to verify against. Saying so plainly
           stops a reviewer approving an account on the strength of a typed-in
           number alone, which would make the verified badge worthless. */
        <p className="mb-3 flex items-center gap-1.5 text-[12.5px] font-medium text-amber">
          <NavIcon name="hourglass" className="h-3.5 w-3.5" />
          {t('noDocument')}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={t('rejectReason')}
          className="field-input !py-2 flex-1 text-[13px]"
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
          disabled={pending || !documentPath}
          title={documentPath ? undefined : t('noDocument')}
          className="btn-small !bg-palm disabled:opacity-40"
        >
          {t('approve')}
        </button>
      </div>
    </div>
  );
}
