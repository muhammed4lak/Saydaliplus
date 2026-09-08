'use client';

import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';
import { saveLogWeek, submitLogWeek } from '@/app/actions/logbook';
import { MIN_LOG_CHARACTERS, WORKING_DAYS } from '@/lib/logbook';
import { NavIcon } from '@/components/icons';
import type { LogWeekStatus } from '@/lib/supabase/database.types';
import type { Locale } from '@/i18n/routing';

interface Week {
  id: string;
  weekNo: number;
  daysPresent: boolean[];
  text: string;
  status: LogWeekStatus;
}

/**
 * One week of the logbook.
 *
 * Only the open week is editable. A locked week is shown rather than hidden, so
 * the student can see the shape of the programme, but it cannot be written to —
 * that is the forward-fill rule, and it is the reason the finished logbook means
 * anything at all.
 */
export function LogWeekEditor({
  week,
  dateRange,
  lang,
  statusClass,
}: {
  week: Week;
  dateRange: string;
  lang: Locale;
  statusClass: string;
}) {
  const t = useTranslations('logbook');
  const [open, setOpen] = useState(week.status === 'draft');
  const [text, setText] = useState(week.text);
  const [days, setDays] = useState(week.daysPresent);
  const [state, formAction, pending] = useActionState(submitLogWeek, { ok: false });
  const [saveState, saveAction, saving] = useActionState(saveLogWeek, { ok: false });

  const editable = week.status === 'draft';
  const attended = days.filter(Boolean).length;
  const remaining = Math.max(0, MIN_LOG_CHARACTERS - text.trim().length);
  const canSubmit = attended > 0 && remaining === 0;

  return (
    <div className={`card overflow-hidden ${week.status === 'locked' ? 'opacity-60' : ''}`}>
      <button
        type="button"
        onClick={() => week.status !== 'locked' && setOpen(!open)}
        disabled={week.status === 'locked'}
        className="flex w-full items-center justify-between gap-3 p-4 text-start disabled:cursor-default"
      >
        <div>
          <p className="text-[13.5px] font-semibold">{t('week', { n: week.weekNo })}</p>
          <p className="mt-0.5 text-[12px] text-ink-faint">{dateRange}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {week.status !== 'locked' && (
            <span className="figure text-[12px] text-ink-faint">
              {week.daysPresent.filter(Boolean).length}/5
            </span>
          )}
          <span className={statusClass}>{t(`statuses.${week.status}`)}</span>
          {week.status === 'locked' && <NavIcon name="lock" className="h-3.5 w-3.5 text-ink-faint" />}
        </div>
      </button>

      {open && week.status !== 'locked' && (
        <form action={formAction} className="border-t border-line p-4">
          <input type="hidden" name="weekId" value={week.id} />
          <input type="hidden" name="lang" value={lang} />

          <p className="field-label">{t('attendance')}</p>
          <div className="mb-4 flex gap-1.5">
            {WORKING_DAYS.map((day, index) => (
              <label
                key={day}
                className={`flex-1 cursor-pointer rounded-[10px] border py-2 text-center text-[11.5px] font-medium transition ${
                  days[index]
                    ? 'border-palm bg-palm-tint text-palm'
                    : 'border-line bg-card text-ink-faint'
                } ${editable ? '' : 'pointer-events-none'}`}
              >
                <input
                  type="checkbox"
                  name={`day-${index}`}
                  checked={days[index] ?? false}
                  disabled={!editable}
                  onChange={(event) =>
                    setDays(days.map((value, i) => (i === index ? event.target.checked : value)))
                  }
                  className="sr-only"
                />
                {t(`days.${day}`)}
              </label>
            ))}
          </div>

          <label className="field-label" htmlFor={`text-${week.id}`}>
            {t('whatYouLearned')}
          </label>
          <textarea
            id={`text-${week.id}`}
            name="text"
            rows={5}
            value={text}
            disabled={!editable}
            onChange={(event) => setText(event.target.value)}
            placeholder={t('placeholder')}
            className="field-input resize-none disabled:bg-mist"
          />

          {editable && (
            <>
              <p
                className={`mt-1.5 text-[11.5px] ${remaining > 0 ? 'text-ink-faint' : 'text-palm'}`}
              >
                {remaining > 0 ? t('charactersRemaining', { count: remaining }) : '✓'}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  type="submit"
                  formAction={saveAction}
                  disabled={saving}
                  className="flex-1 rounded-[11px] border border-line py-2.5 text-[13px] font-semibold text-ink-soft"
                >
                  {saving ? t('saving') : saveState.ok ? t('saved') : t('save')}
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || pending}
                  className="flex-1 rounded-[11px] bg-indigo py-2.5 text-[13px] font-semibold text-white disabled:opacity-40"
                >
                  {pending ? '…' : t('submit')}
                </button>
              </div>

              {/* Says which rule is unmet rather than just disabling the button. */}
              {!canSubmit && (
                <p className="mt-2 text-center text-[11.5px] text-ink-faint">
                  {attended === 0 ? t('needsAttendance') : t('needsText')}
                </p>
              )}
            </>
          )}

          {state.error && (
            <p role="alert" className="mt-2 text-center text-[12px] font-medium text-amber">
              {t(state.error.replace('logbook.', ''))}
            </p>
          )}
        </form>
      )}

      {open && week.status === 'locked' && (
        <p className="border-t border-line p-4 text-[12px] leading-relaxed text-ink-faint">
          {t('lockedNote')}
        </p>
      )}
    </div>
  );
}
