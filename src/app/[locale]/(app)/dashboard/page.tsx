import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { Link } from '@/i18n/routing';
import { NavIcon } from '@/components/icons';
import { requireRole } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import { isInTrial, trialDaysRemaining } from '@/config/fees';
import { formatAmount } from '@/lib/money';
import { formatDate, formatDateRange, formatTimeRange } from '@/lib/dates';
import type { Locale } from '@/i18n/routing';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireRole('pharmacy');
  const t = await getTranslations();
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('pharmacy_id', session.userId)
    .order('created_at', { ascending: false });

  // Applications this pharmacy is actually allowed to see. Anything from an
  // applicant still under Syndicate review is filtered out by RLS, so this
  // count never promises the owner an applicant they cannot act on.
  const { data: applicants } = await supabase
    .from('applicant_cards')
    .select('listing_id')
    .eq('application_status', 'applied');

  const applicantsByListing = new Map<string, number>();
  for (const row of applicants ?? []) {
    applicantsByListing.set(row.listing_id, (applicantsByListing.get(row.listing_id) ?? 0) + 1);
  }

  const open = (listings ?? []).filter((listing) => listing.status === 'open');
  const filled = (listings ?? []).filter((listing) => listing.status === 'filled');
  const signupDate = new Date(session.profile.created_at);

  return (
    <>
      <PageHeader eyebrow={t('nav.dashboard')} title={t('nav.dashboard')} />

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
            <Stat value={open.length} label={t('listings.post.paidShift')} />
            <Stat value={filled.length} label={t('listings.filled')} />
            <Stat value={applicants?.length ?? 0} label={t('applicants.title')} />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="eyebrow">{t('nav.dashboard')}</h2>
              <Link href="/post" className="btn-small">
                {t('listings.post.title')}
              </Link>
            </div>

            {(listings ?? []).length === 0 ? (
              <p className="card p-6 text-center text-[13px] text-ink-faint">
                {t('listings.noneOpen')}
              </p>
            ) : (
              <div className="space-y-3">
                {listings?.map((listing) => {
                  const startsAt = new Date(listing.starts_at);
                  const endsAt = new Date(listing.ends_at);
                  const waiting = applicantsByListing.get(listing.id) ?? 0;

                  return (
                    <div key={listing.id} className="card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span
                            className={
                              listing.type === 'internship'
                                ? 'badge bg-amber-tint text-[#8a5610]'
                                : 'badge-otc'
                            }
                          >
                            {t(
                              listing.type === 'internship'
                                ? 'listings.post.internship'
                                : 'listings.post.paidShift',
                            )}
                          </span>

                          <p className="mt-1.5 text-[13px] text-ink-soft">
                            {listing.type === 'internship'
                              ? formatDateRange(startsAt, endsAt, locale as Locale)
                              : `${formatDate(startsAt, locale as Locale)} · ${formatTimeRange(startsAt, endsAt, locale as Locale)}`}
                            {listing.total_amount !== null && (
                              <>
                                {' · '}
                                <span className="figure">
                                  {formatAmount(listing.total_amount)} {t('common.iqd')}
                                </span>
                              </>
                            )}
                          </p>
                        </div>

                        {listing.status === 'filled' ? (
                          <span className="badge-verified">{t('listings.filled')}</span>
                        ) : waiting > 0 ? (
                          <Link href="/applicants" className="badge-pending">
                            {waiting}
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </PageBody>
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="card p-3 text-center">
      <span className="figure block text-[17px] font-semibold text-indigo">{value}</span>
      <span className="mt-0.5 block text-[10.5px] leading-tight text-ink-faint">{label}</span>
    </div>
  );
}
