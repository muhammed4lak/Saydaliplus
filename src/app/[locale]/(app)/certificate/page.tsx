import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { PageBody, PageHeader } from '@/components/app-shell';
import { PdfExport } from '@/components/pdf-export';
import { NavIcon } from '@/components/icons';
import { requireRole, displayName } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import { formatDate, formatDateRange } from '@/lib/dates';
import type { Locale } from '@/i18n/routing';

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireRole('student');
  const t = await getTranslations();
  const supabase = await createClient();

  const { data: certificate } = await supabase
    .from('placement_certificates')
    .select('*')
    .eq('student_id', session.userId)
    .maybeSingle();

  // The gate is the database's, not this page's — a student who guesses the URL
  // before all three months are approved gets sent back.
  if (!certificate?.unlocked) redirect('/placement');

  const { data: pharmacy } = await supabase
    .from('pharmacy_details')
    .select('pharmacy_name_en, pharmacy_name_ar')
    .eq('profile_id', certificate.pharmacy_id)
    .maybeSingle();

  const pharmacyName =
    (locale === 'ar' ? pharmacy?.pharmacy_name_ar : pharmacy?.pharmacy_name_en) ??
    pharmacy?.pharmacy_name_en ??
    '';

  const student = displayName(session.profile, locale as Locale);
  const percent =
    certificate.days_possible === 0
      ? 0
      : Math.round((certificate.days_attended / certificate.days_possible) * 100);

  return (
    <>
      <PageHeader eyebrow={t('nav.placement')} title={t('certificate.title')} />

      <PageBody>
        <div className="mx-auto max-w-2xl space-y-4">
          <PdfExport
            targetId="certificate-document"
            fileName={`saydali-certificate-${student.replace(/\s+/g, '-')}`}
            documentLocale={locale as Locale}
          />

          <article
            id="certificate-document"
            className="print-document rounded-card border border-line bg-white p-8"
          >
            <header className="mb-6 border-b border-line pb-5 text-center">
              <p className="font-display text-[22px] font-bold text-indigo" dir="ltr">
                Saydali+
              </p>
              <h1 className="mt-2 font-display text-[17px] font-semibold">
                {t('certificate.title')}
              </h1>
            </header>

            <dl className="space-y-3">
              <Row label={t('certificate.student')} value={student} />
              <Row label={t('certificate.university')} value={certificate.university} />
              <Row label={t('certificate.pharmacy')} value={pharmacyName} />
              <Row
                label={t('certificate.period')}
                value={formatDateRange(
                  new Date(certificate.starts_on),
                  new Date(certificate.ends_on),
                  locale as Locale,
                )}
              />
              <Row
                label={t('certificate.attendance')}
                value={`${certificate.days_attended}/${certificate.days_possible} · ${percent}%`}
                mono
              />
            </dl>

            <p className="mt-6 flex items-center justify-center gap-2 rounded-card bg-palm-tint px-4 py-3 text-center text-[13px] font-medium text-palm">
              <NavIcon name="badge" className="h-4 w-4" />
              {t('certificate.weeksApproved', { count: certificate.weeks_approved })}
            </p>

            {/* The limit, stated on the document itself rather than only in the
                UI around it. We are not a credentialing authority, and a
                certificate that lets a student believe otherwise would be the
                single most damaging thing this module could do. */}
            <p className="mt-6 border-t border-line pt-4 text-[11px] leading-relaxed text-ink-faint">
              {t('certificate.limitNote')}
            </p>

            <p className="mt-3 text-center font-mono text-[10px] text-ink-faint">
              {formatDate(new Date(), locale as Locale)} · {certificate.placement_id}
            </p>
          </article>
        </div>
      </PageBody>
    </>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2 last:border-b-0">
      <dt className="text-[12px] text-ink-faint">{label}</dt>
      <dd className={`text-end text-[13.5px] font-medium ${mono ? 'figure' : ''}`}>{value}</dd>
    </div>
  );
}
