import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { ApplicantCardView } from '@/components/applicant-card';
import { requireRole } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/i18n/routing';

export default async function ApplicantsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  await requireRole('pharmacy');
  const t = await getTranslations('applicants');
  const supabase = await createClient();

  // applicant_cards is a narrow projection: name, district, masked Syndicate
  // number and the derived statistics. The applicant's profile row — their
  // phone number, their home address — never crosses. It also filters out
  // applicants who are still being verified, which is the queued-application
  // rule; there is nothing to do here to implement it.
  const { data: applicants } = await supabase
    .from('applicant_cards')
    .select('*')
    .eq('application_status', 'applied')
    .order('applied_at', { ascending: true });

  return (
    <>
      <PageHeader eyebrow={t('title')} title={t('title')} />

      <PageBody>
        {!applicants || applicants.length === 0 ? (
          <p className="card p-6 text-center text-[13px] text-ink-faint">{t('none')}</p>
        ) : (
          <div className="mx-auto max-w-3xl space-y-3">
            <p className="text-[12px] leading-relaxed text-ink-faint">
              {t('acceptClosesListing')}
            </p>
            {applicants.map((applicant) => (
              <ApplicantCardView
                key={applicant.application_id}
                applicant={applicant}
                locale={locale as Locale}
              />
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
