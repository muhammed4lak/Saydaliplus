import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { LogWeekEditor } from '@/components/log-week-editor';
import { NavIcon } from '@/components/icons';
import { requireRole } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import { TOTAL_MONTHS, WEEKS_PER_MONTH, monthOfWeek } from '@/lib/logbook';
import { formatDayMonth } from '@/lib/dates';
import type { Locale } from '@/i18n/routing';
import type { LogWeekStatus } from '@/lib/supabase/database.types';

const STATUS_STYLE: Record<LogWeekStatus, string> = {
  approved: 'badge-verified',
  submitted: 'badge bg-indigo-tint text-indigo-dark',
  draft: 'badge-pending',
  locked: 'badge bg-mist text-ink-faint',
};

export default async function LogbookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireRole('student');
  const t = await getTranslations();
  const supabase = await createClient();

  const { data: placement } = await supabase
    .from('placements')
    .select('*')
    .eq('student_id', session.userId)
    .eq('status', 'active')
    .maybeSingle();

  if (!placement) {
    return (
      <>
        <PageHeader eyebrow={t('logbook.title')} title={t('logbook.title')} />
        <PageBody>
          <p className="card mx-auto max-w-xl p-6 text-center text-[13px] leading-relaxed text-ink-faint">
            {t('logbook.noPlacement')}
          </p>
        </PageBody>
      </>
    );
  }

  const { data: weeks } = await supabase
    .from('log_weeks')
    .select('*')
    .eq('placement_id', placement.id)
    .order('week_no', { ascending: true });

  const { data: months } = await supabase
    .from('month_approvals')
    .select('*')
    .eq('placement_id', placement.id)
    .order('month_no', { ascending: true });

  const all = weeks ?? [];
  const done = all.filter((w) => w.status === 'submitted' || w.status === 'approved').length;

  return (
    <>
      <PageHeader
        eyebrow={t('logbook.progress', { done, total: all.length })}
        title={t('logbook.title')}
      />

      <PageBody>
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="h-2 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-indigo transition-[width]"
              style={{ width: `${all.length ? (done / all.length) * 100 : 0}%` }}
            />
          </div>

          {Array.from({ length: TOTAL_MONTHS }, (_, index) => index + 1).map((monthNo) => {
            const monthWeeks = all.filter((week) => monthOfWeek(week.week_no) === monthNo);
            const approval = months?.find((m) => m.month_no === monthNo);
            const approved = monthWeeks.every((w) => w.status === 'approved');
            const ready =
              !approved && monthWeeks.every((w) => w.status === 'submitted' || w.status === 'approved');

            return (
              <section key={monthNo}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="font-display text-[15px] font-semibold">
                    {t('logbook.month', { n: monthNo })}
                  </h2>
                  <span
                    className={
                      approved
                        ? 'badge-verified'
                        : ready
                          ? 'badge bg-indigo-tint text-indigo-dark'
                          : 'badge bg-mist text-ink-faint'
                    }
                  >
                    {t(
                      `logbook.monthStatuses.${
                        approved ? 'approved' : ready ? 'ready' : monthWeeks.some((w) => w.status !== 'locked') ? 'active' : 'upcoming'
                      }`,
                    )}
                  </span>
                </div>

                {/* A returned month tells the student exactly what to fix. */}
                {approval?.returned_at && !approved && (
                  <div className="mb-3 flex items-start gap-2.5 rounded-card border border-amber-tint bg-amber-tint/60 p-3">
                    <NavIcon name="hourglass" className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                    <p className="text-[12.5px] leading-relaxed text-[#8a5610]">
                      {t('logbook.returnedNote', { note: approval.returned_note ?? '' })}
                    </p>
                  </div>
                )}

                <div className="space-y-2.5">
                  {monthWeeks.map((week) => {
                    const weekStart = new Date(week.week_start);
                    const weekEnd = new Date(week.week_end);

                    return (
                      <LogWeekEditor
                        key={week.id}
                        week={{
                          id: week.id,
                          weekNo: week.week_no,
                          daysPresent: week.days_present,
                          text: (locale === 'ar' ? week.text_ar : week.text_en) ?? '',
                          status: week.status,
                        }}
                        dateRange={`${formatDayMonth(weekStart, locale as Locale)} – ${formatDayMonth(weekEnd, locale as Locale)}`}
                        lang={locale as Locale}
                        statusClass={STATUS_STYLE[week.status]}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}

          <p className="text-center text-[11.5px] leading-relaxed text-ink-faint">
            {t('logbook.forwardFillNote', { weeks: WEEKS_PER_MONTH })}
          </p>
        </div>
      </PageBody>
    </>
  );
}
