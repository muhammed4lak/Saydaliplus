'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { replyToIncident } from '@/app/actions/incidents';

export function IncidentReply({ incidentId }: { incidentId: string }) {
  const t = useTranslations('incidents');
  const [state, formAction, pending] = useActionState(replyToIncident, { ok: false });

  if (state.ok) {
    return <p className="text-[12.5px] font-medium text-palm">{t('replySaved')}</p>;
  }

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="incidentId" value={incidentId} />
      <p className="text-[12px] font-medium text-indigo">{t('rightOfReply')}</p>
      <textarea
        name="reply"
        rows={3}
        required
        placeholder={t('replyPlaceholder')}
        className="field-input resize-none text-[13px]"
      />
      <button type="submit" disabled={pending} className="btn-small">
        {pending ? '…' : t('sendReply')}
      </button>
      {state.error && (
        <p role="alert" className="text-[12px] font-medium text-amber">
          {t('replyTooShort')}
        </p>
      )}
    </form>
  );
}
