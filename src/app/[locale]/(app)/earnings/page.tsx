import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { PayoutRequest } from '@/components/payout-request';
import { PayoutDestination } from '@/components/payout-destination';
import { NavIcon } from '@/components/icons';
import { requireRole } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import { isInTrial, trialDaysRemaining } from '@/config/fees';
import { formatAmount, formatIQD } from '@/lib/money';
import { formatDate } from '@/lib/dates';
import type { Locale } from '@/i18n/routing';

export default async function EarningsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireRole('pharmacist');
  const t = await getTranslations();
  const supabase = await createClient();

  // What is owed, straight from the view: completed bookings not yet attached to
  // a payout. No balance is stored anywhere — we are a merchant, not a wallet.
  const { data: payable } = await supabase.from('payable_bookings').select('*');

  const { data: stats } = await supabase
    .from('pharmacist_stats')
    .select('*')
    .eq('pharmacist_id', session.userId)
    .maybeSingle();

  const { data: details } = await supabase
    .from('pharmacist_details')
    .select('payout_destination')
    .maybeSingle();

  const { data: payouts } = await supabase
    .from('payouts')
    .select('*')
    .order('requested_at', { ascending: false })
    .limit(20);

  const { data: completed } = await supabase
    .from('bookings')
    .select('id, gross_amount, pharmacist_fee, net_payout, completed_at')
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(20);

  const owed = (payable ?? []).reduce((total, row) => total + Number(row.net_payout), 0);
  const lifetime = (completed ?? []).reduce((total, row) => total + Number(row.net_payout), 0);
  const signupDate = new Date(session.profile.created_at);

  return (
    <>
      <PageHeader eyebrow={t('earnings.title')} title={t('earnings.title')} />

      <PageBody>
        <div className="mx-auto max-w-3xl space-y-5">
          {isInTrial(signupDate) && (
            <div className="flex items-start gap-2.5 rounded-card border border-[#cfe0c9] bg-palm-tint p-4">
              <NavIcon name="badge" className="mt-0.5 h-[18px] w-[18px] shrink-0 text-palm" />
              <p className="text-[12.5px] leading-relaxed text-ink-soft">
                {t('fees.trialDaysLeft', { days: trialDaysRemaining(signupDate) })}
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2.5">
            <Stat value={formatAmount(lifetime)} label={t('earnings.earned')} />
            <Stat value={stats?.shifts_completed ?? 0} label={t('earnings.shiftsDone')} />
            <Stat value={stats?.average_rating ?? '—'} label={t('earnings.avgRating')} />
          </div>

          <div>
            <h2 className="eyebrow mb-3">{t('earnings.payout')}</h2>
            <div className="space-y-3">
              <PayoutDestination current={details?.payout_destination ?? null} />
              <PayoutRequest
                owed={owed}
                locale={locale as Locale}
                canRequest={
                  session.isVerified && owed > 0 && !!details?.payout_destination
                }
                isVerified={session.isVerified}
                hasDestination={!!details?.payout_destination}
              />
            </div>
          </div>

          {(payouts ?? []).length > 0 && (
            <div>
              <h2 className="eyebrow mb-3">{t('earnings.payout')}</h2>
              <ul className="card divide-y divide-line">
                {payouts?.map((payout) => (
                  <li key={payout.id} className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="text-[13.5px] font-medium">
                        {t(`earnings.methods.${payout.method}`)}
                      </p>
                      <p className="mt-0.5 text-[12px] text-ink-faint">
                        {formatDate(new Date(payout.requested_at), locale as Locale)} ·{' '}
                        {t(`earnings.statuses.${payout.status}`)}
                        {payout.failure_reason && ` — ${payout.failure_reason}`}
                      </p>
                    </div>
                    <span className="figure text-[13px] font-semibold">
                      {formatIQD(payout.amount, locale as Locale)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="eyebrow mb-3">{t('earnings.transactions')}</h2>
            {(completed ?? []).length === 0 ? (
              <p className="card p-6 text-center text-[13px] text-ink-faint">
                {t('bookings.none')}
              </p>
            ) : (
              <ul className="card divide-y divide-line">
                {completed?.map((booking) => (
                  <li key={booking.id} className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="text-[13.5px]">
                        {booking.completed_at
                          ? formatDate(new Date(booking.completed_at), locale as Locale)
                          : ''}
                      </p>
                      {/* The fee is shown per booking, not just in aggregate. A
                          pharmacist should be able to reconcile any single
                          payout against the shift it came from. */}
                      <p className="mt-0.5 text-[12px] text-ink-faint">
                        <span className="figure">{formatAmount(booking.gross_amount)}</span>
                        {Number(booking.pharmacist_fee) === 0 ? (
                          <span className="text-palm"> · {t('fees.trialActive')}</span>
                        ) : (
                          <>
                            {' − '}
                            <span className="figure">{formatAmount(booking.pharmacist_fee)}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <span className="figure text-[13px] font-semibold">
                      {formatAmount(booking.net_payout)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </PageBody>
    </>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="card p-3 text-center">
      <span className="figure block text-[17px] font-semibold text-indigo">{value}</span>
      <span className="mt-0.5 block text-[10.5px] leading-tight text-ink-faint">{label}</span>
    </div>
  );
}
