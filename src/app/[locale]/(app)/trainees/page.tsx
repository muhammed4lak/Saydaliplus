import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { MonthReview } from '@/components/month-review';
import { requireRole } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import { TOTAL_MONTHS, monthOfWeek } from '@/lib/logbook';
import { formatDateRange, formatDayMonth } from '@/lib/dates';
import type { Locale } from '@/i18n/routing';

export default async function TraineesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireRole('pharmacy');
  const t = await getTranslations();
  const supabase = await createClient();

  const { data: placements } = await supabase
    .from('placements')
    .select('*')
    .eq('pharmacy_id', session.userId)
    .order('created_at', { ascending: false });

  // The trainee's name comes through placement_people, not an embed: `profiles`
  // is private to its owner, so embedding it here would return nothing.
  const { data: people } = await supabase.from('placement_people').select('*');

  if (!placements || placements.length === 0) {
    return (
      <>
        <PageHeader eyebrow={t('nav.trainees')} title={t('nav.trainees')} />
        <PageBody>
          <p className="card mx-auto max-w-xl p-6 text-center text-[13px] text-ink-faint">
            {t('trainees.none')}
          </p>
        </PageBody>
      </>
    );
  }

  const { data: allWeeks } = await supabase
    .from('log_weeks')
    .select('*')
    .in(
      'placement_id',
      placements.map((p) => p.id),
    )
    .order('week_no', { ascending: true });

  const { data: allApprovals } = await supabase
    .from('month_approvals')
    .select('*')
    .in(
      'placement_id',
      placements.map((p) => p.id),
    );

  return (
    <>
      <PageHeader eyebrow={t('nav.trainees')} title={t('nav.trainees')} />

      <PageBody>
        <div className="mx-auto max-w-3xl space-y-8">
          {placements.map((placement) => {
            const weeks = (allWeeks ?? []).filter((w) => w.placement_id === placement.id);
            const person = (people ?? []).find((row) => row.placement_id === placement.id);
            const name =
              (locale === 'ar' ? person?.student_name_ar : person?.student_name_en) ??
              person?.student_name_en ??
              '';

            return (
              <section key={placement.id}>
                <div className="mb-3">
                  <h2 className="font-display text-[15.5px] font-semibold">{name}</h2>
                  <p className="mt-0.5 text-[12.5px] text-ink-faint">
                    {formatDateRange(
                      new Date(placement.starts_on),
                      new Date(placement.ends_on),
                      locale as Locale,
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  {Array.from({ length: TOTAL_MONTHS }, (_, index) => index + 1).map((monthNo) => {
                    const monthWeeks = weeks.filter((w) => monthOfWeek(w.week_no) === monthNo);
                    const approval = (allApprovals ?? []).find(
                      (a) => a.placement_id === placement.id && a.month_no === monthNo,
                    );

                    const approved =
                      monthWeeks.length > 0 && monthWeeks.every((w) => w.status === 'approved');
                    const ready =
                      !approved &&
                      monthWeeks.length > 0 &&
                      monthWeeks.every((w) => w.status === 'submitted' || w.status === 'approved');

                    const attended = monthWeeks
                      .filter((w) => w.status !== 'locked' && w.status !== 'draft')
                      .reduce((total, w) => total + w.days_present.filter(Boolean).length, 0);
                    const possible =
                      monthWeeks.filter((w) => w.status !== 'locked' && w.status !== 'draft')
                        .length * 5;

                    return (
                      <MonthReview
                        key={monthNo}
                        placementId={placement.id}
                        monthNo={monthNo}
                        approved={approved}
                        ready={ready}
                        returnedNote={approval?.returned_note ?? null}
                        attendance={{ attended, possible }}
                        weeks={monthWeeks.map((w) => ({
                          weekNo: w.week_no,
                          status: w.status,
                          dateRange: `${formatDayMonth(new Date(w.week_start), locale as Locale)} – ${formatDayMonth(new Date(w.week_end), locale as Locale)}`,
                          daysPresent: w.days_present,
                          // The pharmacy reads whichever language the student
                          // actually wrote in, not the one the pharmacy browses in.
                          text: w.text_ar ?? w.text_en ?? '',
                        }))}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </PageBody>
    </>
  );
}
