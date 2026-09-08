import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { Link } from '@/i18n/routing';
import { NavIcon } from '@/components/icons';
import { requireRole, displayName } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import { formatDateRange } from '@/lib/dates';
import { TOTAL_WEEKS } from '@/lib/logbook';
import type { Locale } from '@/i18n/routing';

export default async function PlacementPage({
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
    .select('*, pharmacy_details!inner(pharmacy_name_en, pharmacy_name_ar, address)')
    .eq('student_id', session.userId)
    .order('created_at', { ascending: false })
    .maybeSingle();

  if (!placement) {
    return (
      <>
        <PageHeader eyebrow={t('nav.placement')} title={t('nav.placement')} />
        <PageBody>
          <div className="card mx-auto max-w-xl p-6 text-center">
            <p className="text-[13px] leading-relaxed text-ink-faint">
              {t('logbook.noPlacement')}
            </p>
            <Link href="/browse" className="btn-primary mt-4 inline-block">
              {t('nav.browse')}
            </Link>
          </div>
        </PageBody>
      </>
    );
  }

  const { data: certificate } = await supabase
    .from('placement_certificates')
    .select('*')
    .eq('placement_id', placement.id)
    .maybeSingle();

  const pharmacyName =
    (locale === 'ar'
      ? placement.pharmacy_details?.pharmacy_name_ar
      : placement.pharmacy_details?.pharmacy_name_en) ??
    placement.pharmacy_details?.pharmacy_name_en ??
    '';

  const unlocked = certificate?.unlocked ?? false;

  return (
    <>
      <PageHeader eyebrow={t('nav.placement')} title={pharmacyName} />

      <PageBody>
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="card p-4">
            <p className="flex items-center gap-2 text-[13px] text-ink-soft">
              <NavIcon name="clock" className="h-4 w-4 text-ink-faint" />
              {formatDateRange(
                new Date(placement.starts_on),
                new Date(placement.ends_on),
                locale as Locale,
              )}
            </p>
            {placement.pharmacy_details?.address && (
              <p className="mt-2 flex items-center gap-2 text-[13px] text-ink-soft">
                <NavIcon name="pin" className="h-4 w-4 text-ink-faint" />
                {placement.pharmacy_details.address}
              </p>
            )}
            <p className="mt-3 text-[12.5px] text-ink-faint">
              {t('certificate.weeksApproved', { count: certificate?.weeks_approved ?? 0 })} /{' '}
              {TOTAL_WEEKS}
            </p>
          </div>

          <Link href="/logbook" className="btn-primary block">
            {t('logbook.title')}
          </Link>

          {unlocked ? (
            <Link href="/certificate" className="btn-secondary block">
              {t('certificate.title')}
            </Link>
          ) : (
            /* The gate is stated plainly rather than shown as a dead button:
               the student should know exactly what is left. */
            <div className="flex items-start gap-2.5 rounded-card border border-line bg-mist p-4">
              <NavIcon name="lock" className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
              <p className="text-[12.5px] leading-relaxed text-ink-soft">
                {t('certificate.locked')}
              </p>
            </div>
          )}

          {/* Said here as well as on the certificate itself, because it is the
              thing a student is most likely to misunderstand about us. */}
          <p className="text-[11.5px] leading-relaxed text-ink-faint">
            {t('certificate.limitNote')}
          </p>
        </div>
      </PageBody>
    </>
  );
}
