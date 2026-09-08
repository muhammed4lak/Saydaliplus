import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PageBody, PageHeader } from '@/components/app-shell';
import { FeeBreakdown } from '@/components/fee-breakdown';
import { ApplyButton } from '@/components/apply-button';
import { NavIcon } from '@/components/icons';
import { requireSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import { isInTrial } from '@/config/fees';
import { formatRateBasis } from '@/lib/money';
import { formatDate, formatDateRange, formatTimeRange } from '@/lib/dates';
import { hoursBetween } from '@/lib/time';
import type { Locale } from '@/i18n/routing';

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await requireSession();
  const t = await getTranslations('listings');
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from('listings')
    .select('*, pharmacy_details!inner(pharmacy_name_en, pharmacy_name_ar, address)')
    .eq('id', id)
    .maybeSingle();

  if (!listing) notFound();

  const { data: application } = await supabase
    .from('applications')
    .select('id, status')
    .eq('listing_id', id)
    .eq('applicant_id', session.userId)
    .maybeSingle();

  // The pharmacy's own trial state is not ours to read — RLS keeps their profile
  // private, and rightly so. For the pharmacist's view of the fee that does not
  // matter: their 3% depends only on their own trial. So the breakdown is shown
  // from this user's side, which is the only side they can act on.
  const viewerInTrial = isInTrial(new Date(session.profile.created_at));

  const startsAt = new Date(listing.starts_at);
  const endsAt = new Date(listing.ends_at);
  const hours = hoursBetween(startsAt, endsAt);
  const isInternship = listing.type === 'internship';

  const name =
    (locale === 'ar'
      ? listing.pharmacy_details?.pharmacy_name_ar
      : listing.pharmacy_details?.pharmacy_name_en) ??
    listing.pharmacy_details?.pharmacy_name_en ??
    '';

  return (
    <>
      <PageHeader eyebrow={listing.district} title={name} />

      <PageBody>
        <div className="mx-auto max-w-2xl space-y-4">
          <dl className="card divide-y divide-line p-4 text-sm">
            <Row icon="pin" label={t('location')}>
              {listing.district}
              {listing.pharmacy_details?.address && ` · ${listing.pharmacy_details.address}`}
            </Row>

            <Row icon="clock" label={t('when')}>
              {isInternship
                ? formatDateRange(startsAt, endsAt, locale as Locale)
                : `${formatDate(startsAt, locale as Locale)} · ${formatTimeRange(startsAt, endsAt, locale as Locale)}`}
            </Row>

            {!isInternship && listing.rate_type && (
              <Row icon="clock" label={t('rateBasis')}>
                <span className="figure">
                  {formatRateBasis(
                    listing.rate_type,
                    listing.rate_amount ?? 0,
                    hours,
                    locale as Locale,
                  )}
                </span>
              </Row>
            )}

            <Row icon="badge" label={t('scope')}>
              {isInternship
                ? t('certificateProvided')
                : listing.includes_controlled
                  ? t('controlled')
                  : t('otcOnly')}
            </Row>
          </dl>

          {listing.notes && (
            <div className="rounded-card bg-mist p-4 text-[13px] leading-relaxed text-ink-soft">
              {listing.notes}
            </div>
          )}

          {!isInternship && listing.total_amount !== null && (
            <FeeBreakdown
              grossAmount={listing.total_amount}
              side={session.profile.role === 'pharmacy' ? 'pharmacy' : 'pharmacist'}
              inTrial={viewerInTrial}
              otherSideInTrial={false}
              locale={locale as Locale}
            />
          )}

          <ApplyButton
            listingId={listing.id}
            isInternship={isInternship}
            alreadyApplied={application !== null}
            isVerified={session.isVerified}
          />
        </div>
      </PageBody>
    </>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: 'pin' | 'clock' | 'badge';
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 py-2.5 first:pt-0 last:pb-0">
      <NavIcon name={icon} className="mt-0.5 h-4 w-4 shrink-0 text-indigo" />
      <div>
        <dt className="text-[11.5px] text-ink-faint">{label}</dt>
        <dd className="mt-0.5 text-[13.5px] font-medium">{children}</dd>
      </div>
    </div>
  );
}
