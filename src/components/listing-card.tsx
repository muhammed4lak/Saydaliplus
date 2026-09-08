import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { NavIcon } from '@/components/icons';
import { formatAmount, formatRateBasis } from '@/lib/money';
import { formatDateRange, formatDayMonth, formatTimeRange } from '@/lib/dates';
import { hoursBetween } from '@/lib/time';
import type { Listing } from '@/lib/supabase/database.types';
import type { Locale } from '@/i18n/routing';

type ListingWithPharmacy = Listing & {
  pharmacy_details: {
    pharmacy_name_en: string | null;
    pharmacy_name_ar: string | null;
  } | null;
};

export function ListingCard({
  listing,
  locale,
  applied,
}: {
  listing: ListingWithPharmacy;
  locale: Locale;
  applied: boolean;
}) {
  const t = useTranslations('listings');

  const startsAt = new Date(listing.starts_at);
  const endsAt = new Date(listing.ends_at);
  const hours = hoursBetween(startsAt, endsAt);

  // Never render an Arabic name twice — a translated label plus a separate
  // Arabic line reads as a mistake to someone who can read both. Show the name
  // in the reader's own language and stop.
  const name =
    (locale === 'ar'
      ? listing.pharmacy_details?.pharmacy_name_ar
      : listing.pharmacy_details?.pharmacy_name_en) ??
    listing.pharmacy_details?.pharmacy_name_en ??
    listing.pharmacy_details?.pharmacy_name_ar ??
    '';

  const isInternship = listing.type === 'internship';

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="card block p-4 transition hover:border-indigo/40 hover:shadow-[0_6px_16px_-8px_rgba(20,30,28,0.18)]"
    >
      <div className="mb-2.5 flex items-start justify-between gap-3">
        <p className="font-display text-[15.5px] font-semibold">{name}</p>

        {!isInternship && listing.total_amount !== null && (
          <div className="text-end">
            <p className="figure whitespace-nowrap text-[14.5px] font-semibold text-indigo">
              {formatAmount(listing.total_amount)}
            </p>
            <p className="text-[11.5px] text-ink-faint">
              {formatRateBasis(
                listing.rate_type ?? 'flat',
                listing.rate_amount ?? 0,
                hours,
                locale,
              )}
            </p>
          </div>
        )}
      </div>

      <p className="mb-2.5 flex flex-wrap items-center gap-1.5 text-[12.5px] text-ink-soft">
        <NavIcon name="pin" className="h-[13px] w-[13px] text-ink-faint" />
        {listing.district}
        <span className="text-ink-faint">·</span>
        <NavIcon name="clock" className="h-[13px] w-[13px] text-ink-faint" />
        {isInternship
          ? formatDateRange(startsAt, endsAt, locale)
          : `${formatDayMonth(startsAt, locale)}, ${formatTimeRange(startsAt, endsAt, locale)}`}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        {isInternship ? (
          <span className="badge bg-amber-tint text-[#8a5610]">{t('certificateProvided')}</span>
        ) : listing.includes_controlled ? (
          <span className="badge-controlled">{t('controlled')}</span>
        ) : (
          <span className="badge-otc">{t('otcOnly')}</span>
        )}

        {applied && <span className="badge-verified">{t('applied')}</span>}
      </div>
    </Link>
  );
}
