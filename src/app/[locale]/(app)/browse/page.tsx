import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { ListingCard } from '@/components/listing-card';
import { DistrictFilter } from '@/components/district-filter';
import { requireSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/i18n/routing';

export default async function BrowsePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ district?: string }>;
}) {
  const { locale } = await params;
  const { district } = await searchParams;
  setRequestLocale(locale);

  const session = await requireSession();
  const t = await getTranslations('listings');
  const supabase = await createClient();

  // Students see internships; pharmacists see paid shifts. RLS does not make
  // this distinction — it lets any signed-in account read open listings — so
  // the filter is here, and the application guard in the database is what stops
  // a student actually applying to a shift.
  const listingType = session.profile.role === 'student' ? 'internship' : 'shift';

  let query = supabase
    .from('listings')
    .select('*, pharmacy_details!inner(pharmacy_name_en, pharmacy_name_ar)')
    .eq('type', listingType)
    .eq('status', 'open')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true });

  if (district && district !== 'all') {
    query = query.eq('district', district);
  }

  const { data: listings } = await query;

  // Which of these has this user already applied to — so the card can say so
  // rather than offering to apply twice.
  const { data: applications } = await supabase
    .from('applications')
    .select('listing_id')
    .eq('applicant_id', session.userId);

  const appliedTo = new Set((applications ?? []).map((row) => row.listing_id));
  const count = listings?.length ?? 0;

  return (
    <>
      <PageHeader
        eyebrow={t(listingType === 'internship' ? 'certificateProvided' : 'openShifts', { count })}
        title={t(listingType === 'internship' ? 'post.internship' : 'post.paidShift')}
      />

      <PageBody>
        <DistrictFilter selected={district ?? 'all'} />

        <p className="eyebrow my-4">
          {listingType === 'internship'
            ? t('openPlacements', { count })
            : t('openShifts', { count })}
        </p>

        {count === 0 ? (
          <p className="card p-6 text-center text-[13px] text-ink-faint">{t('noneOpen')}</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {listings?.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                locale={locale as Locale}
                applied={appliedTo.has(listing.id)}
              />
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
