import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { PageBody, PageHeader } from '@/components/app-shell';
import { ReviewRow } from '@/components/review-row';
import { requireSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/i18n/routing';

/**
 * The verification queue.
 *
 * This exists because Iraq has no digital pharmacist registry and the
 * Syndicate's processes are paper-based: there is no number to look up and no
 * API to call. A person on our side opens the uploaded card or licence, compares
 * it against Syndicate records by whatever means they have, and decides. Every
 * "verified" badge in this product is the output of that human judgement, and it
 * is worth designing the queue as though the reviewer is tired and in a hurry,
 * because eventually they will be.
 */
export default async function VerificationQueuePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireSession();
  if (!session.isAdmin) redirect('/');

  const t = await getTranslations('admin');
  const supabase = await createClient();

  const { data: pending } = await supabase
    .from('profiles')
    .select(
      `*,
       pharmacist_details(syndicate_reg_no, graduation_year, card_document_url),
       pharmacy_details(pharmacy_name_en, licence_no, licence_document_url),
       student_details(university, university_email)`,
    )
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: true });

  return (
    <>
      <PageHeader eyebrow={t('pending')} title={t('queue')} />

      <PageBody>
        <div className="mx-auto max-w-3xl space-y-3">
          <p className="rounded-card bg-amber-tint p-4 text-[12.5px] leading-relaxed text-[#8a5610]">
            {t('reviewNote')}
          </p>

          {!pending || pending.length === 0 ? (
            <p className="card p-6 text-center text-[13px] text-ink-faint">{t('empty')}</p>
          ) : (
            pending.map((profile) => (
              <ReviewRow key={profile.id} profile={profile} locale={locale as Locale} />
            ))
          )}
        </div>
      </PageBody>
    </>
  );
}
