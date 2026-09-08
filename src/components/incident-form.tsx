'use client';

import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';
import { reportIncident } from '@/app/actions/incidents';

const MIN_DESCRIPTION = 50;

export function IncidentForm({
  bookingId,
  categories,
}: {
  bookingId: string;
  categories: string[];
}) {
  const t = useTranslations('incidents');
  const [description, setDescription] = useState('');
  const [state, formAction, pending] = useActionState(reportIncident, { ok: false });

  if (state.ok) {
    return (
      <div className="card p-6 text-center">
        <p className="text-[13.5px] font-semibold text-palm">{t('filed')}</p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">{t('filedNote')}</p>
      </div>
    );
  }

  const remaining = Math.max(0, MIN_DESCRIPTION - description.trim().length);

  return (
    <form action={formAction} className="card space-y-4 p-4">
      <input type="hidden" name="bookingId" value={bookingId} />

      <div>
        <label className="field-label" htmlFor="category">
          {t('category')}
        </label>
        <select id="category" name="category" required defaultValue="" className="field-input">
          <option value="" disabled />
          {categories.map((category) => (
            <option key={category} value={category}>
              {t(`categories.${category}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="description">
          {t('description')}
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={t('descriptionHint')}
          className="field-input resize-none"
        />
        <p className={`mt-1.5 text-[11.5px] ${remaining > 0 ? 'text-ink-faint' : 'text-palm'}`}>
          {remaining > 0 ? t('charactersToGo', { count: remaining }) : '✓'}
        </p>
      </div>

      <button type="submit" disabled={pending || remaining > 0} className="btn-primary">
        {pending ? '…' : t('submit')}
      </button>

      {state.error && (
        <p role="alert" className="text-center text-[12.5px] font-medium text-amber">
          {t(state.error.replace('incidents.', ''))}
        </p>
      )}
    </form>
  );
}
