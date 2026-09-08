'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { approveMonth, returnMonth } from '@/app/actions/logbook';
import { WORKING_DAYS } from '@/lib/logbook';
import type { LogWeekStatus } from '@/lib/supabase/database.types';

interface WeekSummary {
  weekNo: number;
  status: LogWeekStatus;
  dateRange: string;
  daysPresent: boolean[];
  text: string;
}

/**
 * One month of a trainee's logbook, as the host pharmacy sees it.
 *
 * The pharmacy is attesting to something here, so it gets the whole month at
 * once — every weekly entry, the attendance total and the percentage — rather
 * than a summary and an Approve button. Approving four weeks you have not read
 * is how a logbook becomes a formality.
 */
export function MonthReview({
  placementId,
  monthNo,
  approved,
  ready,
  returnedNote,
  attendance,
  weeks,
}: {
  placementId: string;
  monthNo: number;
  approved: boolean;
  ready: boolean;
  returnedNote: string | null;
  attendance: { attended: number; possible: number };
  weeks: WeekSummary[];
}) {
  const t = useTranslations('logbook');
  const [open, setOpen] = useState(ready);
  const [returning, setReturning] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const percent =
    attendance.possible === 0
      ? 0
      : Math.round((attendance.attended / attendance.possible) * 100);

  const status = approved ? 'approved' : ready ? 'ready' : weeks.some((w) => w.status !== 'locked') ? 'active' : 'upcoming';

  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 p-4 text-start"
      >
        <div>
          <p className="text-[13.5px] font-semibold">{t('month', { n: monthNo })}</p>
          {attendance.possible > 0 && (
            <p className="figure mt-0.5 text-[12px] text-ink-faint">
              {attendance.attended}/{attendance.possible} · {percent}%
            </p>
          )}
        </div>
        <span
          className={
            approved
              ? 'badge-verified'
              : ready
                ? 'badge bg-indigo-tint text-indigo-dark'
                : 'badge bg-mist text-ink-faint'
          }
        >
          {t(`monthStatuses.${status}`)}
        </span>
      </button>

      {open && (
        <div className="border-t border-line">
          {weeks.map((week) => (
            <div key={week.weekNo} className="border-b border-line p-4 last:border-b-0">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-[13px] font-medium">{t('week', { n: week.weekNo })}</p>
                <span className="text-[11.5px] text-ink-faint">{week.dateRange}</span>
              </div>

              <div className="mb-2 flex gap-1">
                {WORKING_DAYS.map((day, index) => (
                  <span
                    key={day}
                    title={t(`days.${day}`)}
                    className={`h-1.5 flex-1 rounded-full ${
                      week.daysPresent[index] ? 'bg-palm' : 'bg-line'
                    }`}
                  />
                ))}
              </div>

              {week.text ? (
                <p className="whitespace-pre-line text-[12.5px] leading-relaxed text-ink-soft">
                  {week.text}
                </p>
              ) : (
                <p className="text-[12.5px] italic text-ink-faint">{t(`statuses.${week.status}`)}</p>
              )}
            </div>
          ))}

          {returnedNote && !approved && (
            <p className="border-b border-line bg-amber-tint/40 p-3 text-[12px] leading-relaxed text-[#8a5610]">
              {t('returnedNote', { note: returnedNote })}
            </p>
          )}

          <div className="p-4">
            {approved ? (
              <p className="text-center text-[12.5px] font-medium text-palm">
                {t('monthStatuses.approved')}
              </p>
            ) : !ready ? (
              /* Four submitted weeks or nothing — the database enforces it, and
                 saying so beats a button that fails. */
              <p className="text-center text-[12px] leading-relaxed text-ink-faint">
                {t('approveGate')}
              </p>
            ) : returning ? (
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder={t('returnNote')}
                  className="field-input resize-none text-[13px]"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReturning(false)}
                    className="flex-1 rounded-[9px] border border-line py-2 text-[12.5px] font-semibold text-ink-soft"
                  >
                    {t('cancelReturn')}
                  </button>
                  <button
                    type="button"
                    disabled={pending || note.trim().length < 10}
                    onClick={() =>
                      startTransition(async () => {
                        const result = await returnMonth(placementId, monthNo, note);
                        if (!result.ok) setError(result.error ?? null);
                      })
                    }
                    className="flex-1 rounded-[9px] bg-amber py-2 text-[12.5px] font-semibold text-white disabled:opacity-40"
                  >
                    {t('return')}
                  </button>
                </div>
                {note.trim().length < 10 && (
                  <p className="text-center text-[11.5px] text-ink-faint">
                    {t('returnNeedsNote')}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReturning(true)}
                  className="flex-1 rounded-[11px] border border-line py-2.5 text-[13px] font-semibold text-ink-soft"
                >
                  {t('return')}
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      const result = await approveMonth(placementId, monthNo);
                      if (!result.ok) setError(result.error ?? null);
                    })
                  }
                  className="flex-1 rounded-[11px] bg-palm py-2.5 text-[13px] font-semibold text-white"
                >
                  {t('approve')}
                </button>
              </div>
            )}

            {error && (
              <p role="alert" className="mt-2 text-center text-[12px] font-medium text-amber">
                {t(error.replace('logbook.', ''))}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
