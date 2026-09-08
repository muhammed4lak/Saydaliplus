import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PageBody, PageHeader } from '@/components/app-shell';
import { IncidentForm } from '@/components/incident-form';
import { NavIcon } from '@/components/icons';
import { requireSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

/** Categories a pharmacist reports against a pharmacy, and vice versa. */
const AGAINST_PHARMACIST = [
  'no_show',
  'controlled_substance_discrepancy',
  'till_discrepancy',
  'conduct',
  'other',
] as const;

const AGAINST_PHARMACY = [
  'non_payment',
  'unsafe_conditions',
  'pressure_to_dispense_improperly',
  'conduct',
  'other',
] as const;

export default async function ReportPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await requireSession();
  const t = await getTranslations('incidents');
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, pharmacist_id, pharmacy_id, status, handoffs(confirmed_by_pharmacist_at, confirmed_by_pharmacy_at)')
    .eq('id', id)
    .maybeSingle();

  if (!booking) notFound();

  const handoff = booking.handoffs;
  const hasEvidence =
    handoff?.confirmed_by_pharmacist_at != null && handoff?.confirmed_by_pharmacy_at != null;

  // Which way round this report goes decides the category list. A pharmacist
  // reporting non-payment and a pharmacy reporting a discrepancy are the same
  // channel, deliberately — a route that only runs one way is a route
  // pharmacists would be right not to trust.
  const reportingPharmacy = booking.pharmacist_id === session.userId;
  const categories = reportingPharmacy ? AGAINST_PHARMACY : AGAINST_PHARMACIST;

  return (
    <>
      <PageHeader eyebrow={t('report')} title={t('report')} />

      <PageBody>
        <div className="mx-auto max-w-xl space-y-4">
          {/* The gate stated up front, not discovered on submit. */}
          <div
            className={`flex items-start gap-2.5 rounded-card p-4 ${
              hasEvidence
                ? 'border border-indigo-tint bg-indigo-tint/40'
                : 'border border-amber-tint bg-amber-tint/60'
            }`}
          >
            <NavIcon
              name={hasEvidence ? 'clipboard' : 'lock'}
              className={`mt-0.5 h-4 w-4 shrink-0 ${hasEvidence ? 'text-indigo' : 'text-amber'}`}
            />
            <p
              className={`text-[12.5px] leading-relaxed ${
                hasEvidence ? 'text-indigo-dark' : 'text-[#8a5610]'
              }`}
            >
              {t('evidenceGate')}
            </p>
          </div>

          {hasEvidence ? (
            <>
              <IncidentForm bookingId={booking.id} categories={[...categories]} />
              <p className="text-[11.5px] leading-relaxed text-ink-faint">{t('tier1Note')}</p>
            </>
          ) : (
            <p className="card p-6 text-center text-[13px] leading-relaxed text-ink-faint">
              {t('noEvidenceYet')}
            </p>
          )}
        </div>
      </PageBody>
    </>
  );
}
