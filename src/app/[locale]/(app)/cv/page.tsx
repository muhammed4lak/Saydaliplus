import { setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { CvBuilder } from '@/components/cv-builder';
import { requireRole, displayName } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import type { CvLang, CvRow } from '@/lib/supabase/database.types';

const EMPTY = {
  summary: '',
  experience: [],
  education: [],
  certifications: [],
  skills: [],
  languages: [],
};

export default async function CvPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { locale } = await params;
  const { lang } = await searchParams;
  setRequestLocale(locale);

  const session = await requireRole('pharmacist');
  const t = await getTranslations();
  const supabase = await createClient();

  // The CV's language is its own axis, defaulting to the UI language only on
  // first visit. A pharmacist may well browse in Arabic and write in English
  // for a Gulf employer, so this is a separate control, not a mirror.
  const cvLang: CvLang = lang === 'en' || lang === 'ar' ? lang : (locale as CvLang);

  const { data: rows } = await supabase.from('cv').select('*');
  const current = (rows ?? []).find((row: CvRow) => row.lang === cvLang);
  const otherLangHasContent = (rows ?? []).some(
    (row: CvRow) => row.lang !== cvLang && (row.summary || row.experience.length > 0),
  );

  // The verified half. Read from the view, so there is no version of these
  // numbers anywhere that a person could edit.
  const { data: stats } = await supabase
    .from('pharmacist_stats')
    .select('*')
    .eq('pharmacist_id', session.userId)
    .maybeSingle();

  return (
    <>
      <PageHeader eyebrow={t('cv.title')} title={displayName(session.profile, locale as Locale)} />

      <PageBody>
        <CvBuilder
          cvLang={cvLang}
          uiLocale={locale as Locale}
          name={displayName(session.profile, cvLang)}
          initial={
            current
              ? {
                  summary: current.summary ?? '',
                  experience: current.experience ?? [],
                  education: current.education ?? [],
                  certifications: current.certifications ?? [],
                  skills: current.skills ?? [],
                  languages: current.languages ?? [],
                }
              : EMPTY
          }
          otherLangHasContent={otherLangHasContent}
          stats={
            stats
              ? {
                  shiftsCompleted: stats.shifts_completed,
                  hoursWorked: stats.hours_worked,
                  pharmaciesWorkedWith: stats.pharmacies_worked_with,
                  averageRating: stats.average_rating,
                  reliabilityPercent: stats.reliability_percent,
                  memberSince: stats.member_since,
                }
              : null
          }
        />
      </PageBody>
    </>
  );
}
