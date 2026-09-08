import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { Link } from '@/i18n/routing';
import { requireRole } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import { formatIQD } from '@/lib/money';
import { formatDate, formatTimeRange } from '@/lib/dates';
import type { Locale } from '@/i18n/routing';

export default async function MyShiftsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireRole('pharmacist');
  const t = await getTranslations('bookings');
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, listings!inner(starts_at, ends_at, district), handoffs(confirmed_by_pharmacist_at, confirmed_by_pharmacy_at)')
    .eq('pharmacist_id', session.userId)
    .order('created_at', { ascending: false });

  const upcoming = (bookings ?? []).filter((booking) => booking.status === 'upcoming');
  const completed = (bookings ?? []).filter((booking) => booking.status === 'completed');

  return (
    <>
      <PageHeader eyebrow={t('upcoming')} title={t('upcoming')} />

      <PageBody>
        <div className="mx-auto max-w-3xl space-y-6">
          <section>
            <h2 className="eyebrow mb-3">{t('upcoming')}</h2>
            {upcoming.length === 0 ? (
              <p className="card p-6 text-center text-[13px] text-ink-faint">{t('none')}</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((booking) => {
                  const startsAt = new Date(booking.listings.starts_at);
                  const endsAt = new Date(booking.listings.ends_at);
                  return (
                    <div key={booking.id} className="card p-4">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-[14.5px] font-semibold">
                            {booking.listings.district}
                          </p>
                          <p className="mt-0.5 text-[12.5px] text-ink-soft">
                            {formatDate(startsAt, locale as Locale)} ·{' '}
                            {formatTimeRange(startsAt, endsAt, locale as Locale)}
                          </p>
                        </div>
                        <span className="figure text-[13.5px] font-semibold text-indigo">
                          {formatIQD(booking.net_payout, locale as Locale)}
                        </span>
                      </div>

                      <Link
                        href={`/shifts/${booking.id}/handoff`}
                        className="btn-secondary mt-2 inline-block"
                      >
                        {t('viewHandoff')}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h2 className="eyebrow mb-3">{t('completed')}</h2>
            {completed.length === 0 ? (
              <p className="card p-6 text-center text-[13px] text-ink-faint">{t('none')}</p>
            ) : (
              <ul className="card divide-y divide-line">
                {completed.map((booking) => (
                  <li key={booking.id} className="flex items-center justify-between gap-3 p-4">
                    <span className="text-[13.5px]">{booking.listings.district}</span>
                    <span className="figure text-[13px] font-semibold">
                      {formatIQD(booking.net_payout, locale as Locale)}
                    </span>
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
