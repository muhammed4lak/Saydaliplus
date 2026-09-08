import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { Link } from '@/i18n/routing';
import { RateBooking } from '@/components/rate-booking';
import { CancelBooking } from '@/components/cancel-booking';
import { NavIcon } from '@/components/icons';
import { requireRole } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import { formatIQD } from '@/lib/money';
import { formatDate, formatTimeRange } from '@/lib/dates';
import { classifyCancellation } from '@/lib/reliability';
import type { Locale } from '@/i18n/routing';

export default async function MyShiftsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireRole('pharmacist');
  const t = await getTranslations();
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from('bookings')
    .select(
      `*,
       listings!inner(starts_at, ends_at, district, includes_controlled,
                      pharmacy_details!inner(pharmacy_name_en, pharmacy_name_ar)),
       handoffs(confirmed_by_pharmacist_at, confirmed_by_pharmacy_at)`,
    )
    .eq('pharmacist_id', session.userId)
    .order('created_at', { ascending: false });

  // Which of these has this pharmacist already rated. Loaded once rather than
  // per row so a long history is still a single query.
  const { data: myRatings } = await supabase
    .from('ratings')
    .select('booking_id, stars')
    .eq('rater_id', session.userId);

  const ratedStars = new Map((myRatings ?? []).map((r) => [r.booking_id, r.stars]));

  const upcoming = (bookings ?? []).filter((b) => b.status === 'upcoming');
  const past = (bookings ?? []).filter((b) => b.status !== 'upcoming');

  const pharmacyName = (booking: (typeof upcoming)[number]) =>
    (locale === 'ar'
      ? booking.listings.pharmacy_details?.pharmacy_name_ar
      : booking.listings.pharmacy_details?.pharmacy_name_en) ??
    booking.listings.pharmacy_details?.pharmacy_name_en ??
    booking.listings.district;

  return (
    <>
      <PageHeader eyebrow={t('nav.myShifts')} title={t('nav.myShifts')} />

      <PageBody>
        <div className="mx-auto max-w-3xl space-y-6">
          <section>
            <h2 className="eyebrow mb-3">{t('bookings.upcoming')}</h2>
            {upcoming.length === 0 ? (
              <p className="card p-6 text-center text-[13px] text-ink-faint">
                {t('bookings.none')}
              </p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((booking) => {
                  const startsAt = new Date(booking.listings.starts_at);
                  const endsAt = new Date(booking.listings.ends_at);
                  const daysAway = Math.max(
                    0,
                    Math.ceil((startsAt.getTime() - Date.now()) / 86_400_000),
                  );
                  // The same classification the database will apply, so the
                  // warning shown before cancelling matches what happens.
                  const outcome = classifyCancellation(startsAt, new Date());
                  // One handoff per booking, so this embed is an object rather
                  // than an array.
                  const handoff = booking.handoffs;

                  return (
                    <div key={booking.id} className="card p-4">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-[14.5px] font-semibold">
                            {pharmacyName(booking)}
                          </p>
                          <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[12.5px] text-ink-soft">
                            <NavIcon name="clock" className="h-[13px] w-[13px] text-ink-faint" />
                            {formatDate(startsAt, locale as Locale)} ·{' '}
                            {formatTimeRange(startsAt, endsAt, locale as Locale)}
                          </p>
                        </div>
                        <span className="badge-pending shrink-0">
                          {t('bookings.startsIn', { days: daysAway })}
                        </span>
                      </div>

                      <p className="figure mb-3 text-[13.5px] font-semibold text-indigo">
                        {formatIQD(booking.net_payout, locale as Locale)}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/shifts/${booking.id}/handoff`}
                          className="btn-secondary flex-1 !w-auto"
                        >
                          {handoff?.confirmed_by_pharmacist_at
                            ? t('handoff.confirmedByYou')
                            : t('bookings.viewHandoff')}
                        </Link>
                        <CancelBooking bookingId={booking.id} outcome={outcome} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h2 className="eyebrow mb-3">{t('bookings.completed')}</h2>
            {past.length === 0 ? (
              <p className="card p-6 text-center text-[13px] text-ink-faint">
                {t('bookings.none')}
              </p>
            ) : (
              <ul className="card divide-y divide-line">
                {past.map((booking) => (
                  <li key={booking.id} className="flex flex-wrap items-center gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-medium">{pharmacyName(booking)}</p>
                      <p className="mt-0.5 text-[12px] text-ink-faint">
                        {formatDate(new Date(booking.listings.starts_at), locale as Locale)} ·{' '}
                        {t(`bookings.statuses.${booking.status}`)}
                      </p>
                    </div>

                    <span className="figure shrink-0 text-[13px] font-semibold">
                      {formatIQD(booking.net_payout, locale as Locale)}
                    </span>

                    {/* Rating is offered only on a completed booking, because
                        that is the only thing the database will accept. */}
                    {booking.status === 'completed' && (
                      <div className="w-full sm:w-auto">
                        <RateBooking
                          bookingId={booking.id}
                          existingStars={ratedStars.get(booking.id) ?? null}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </PageBody>
    </>
  );
}
