import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { NavIcon } from '@/components/icons';
import { DocumentUpload } from '@/components/document-upload';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

/**
 * The waiting screen, and the only place a verification document is uploaded.
 *
 * It requires a session because the Storage path is the user's own id — there is
 * nowhere to put a file until the account exists. Splitting it off from the
 * sign-up form also means a failed photo upload never costs somebody a completed
 * registration.
 */
export default async function VerificationPendingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  if (!session) redirect('/sign-in');
  if (session.isVerified) redirect('/');

  const t = await getTranslations('verification');
  const supabase = await createClient();

  const isPharmacy = session.profile.role === 'pharmacy';

  const { data: details } = isPharmacy
    ? await supabase
        .from('pharmacy_details')
        .select('licence_document_url')
        .eq('profile_id', session.userId)
        .maybeSingle()
    : await supabase
        .from('pharmacist_details')
        .select('card_document_url')
        .eq('profile_id', session.userId)
        .maybeSingle();

  const existingPath = details
    ? 'licence_document_url' in details
      ? details.licence_document_url
      : details.card_document_url
    : null;

  const steps = [
    { key: 'created', state: 'done' as const },
    { key: 'review', state: 'current' as const },
    { key: 'active', state: 'upcoming' as const },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[520px] rounded-[22px] border border-line bg-card p-8 shadow-[0_20px_50px_-24px_rgba(25,23,53,0.28)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-tint">
          <NavIcon name="hourglass" className="h-6 w-6 text-amber" />
        </div>

        <h1 className="text-center font-display text-[19px] font-bold">{t('pendingTitle')}</h1>
        <p className="mx-auto mt-2 text-center text-[13px] leading-relaxed text-ink-soft">
          {t('pendingBody')}
        </p>

        {/* The document is what the reviewer actually looks at, so it is the
            primary action on this screen rather than a footnote. */}
        <div className="my-6">
          <p className="eyebrow mb-2">{t('documentTitle')}</p>
          <DocumentUpload
            userId={session.userId}
            kind={isPharmacy ? 'licence' : 'card'}
            existingPath={existingPath}
          />
          {!existingPath && (
            <p className="mt-2 text-[12px] leading-relaxed text-amber">
              {t('documentRequired')}
            </p>
          )}
        </div>

        <ol className="mb-6 space-y-3">
          {steps.map((step) => (
            <li key={step.key} className="flex items-start gap-3">
              <span
                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                  step.state === 'done'
                    ? 'bg-palm'
                    : step.state === 'current'
                      ? 'bg-amber'
                      : 'bg-line'
                }`}
              />
              <span>
                <span className="block text-[13.5px] font-semibold">{t(`steps.${step.key}`)}</span>
                <span className="mt-0.5 block text-[12px] text-ink-faint">
                  {t(`steps.${step.key}Sub`)}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <p className="mb-5 rounded-[11px] bg-mist p-3 text-[12px] leading-relaxed text-ink-soft">
          {t('manualNote')}
        </p>

        {/* Limited access is the point: browsing and applying keep the account
            alive through a week of waiting. */}
        <Link href="/" className="btn-primary block">
          {t('continueLimited')}
        </Link>
      </div>
    </div>
  );
}
