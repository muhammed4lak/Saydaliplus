import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { NavIcon } from '@/components/icons';
import { LocaleSwitch } from '@/components/locale-switch';
import { SignOutButton } from '@/components/sign-out-button';
import { requireSession, displayName } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/dates';
import type { Locale } from '@/i18n/routing';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireSession();
  const t = await getTranslations();
  const supabase = await createClient();

  // The pharmacist's own verified record — the same numbers a pharmacy sees on
  // their applicant card, and the same ones that will fill the top half of the
  // CV. Read from the view, so there is no version of them that can be edited.
  const { data: stats } =
    session.profile.role === 'pharmacist'
      ? await supabase
          .from('pharmacist_stats')
          .select('*')
          .eq('pharmacist_id', session.userId)
          .maybeSingle()
      : { data: null };

  return (
    <>
      <PageHeader eyebrow={t('nav.profile')} title={displayName(session.profile, locale as Locale)} />

      <PageBody>
        <div className="mx-auto max-w-2xl space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {session.isVerified ? (
              <span className="badge-verified">
                <NavIcon name="badge" className="h-3 w-3" />
                {t('verification.statuses.verified')}
              </span>
            ) : (
              <span className="badge-pending">
                <NavIcon name="hourglass" className="h-3 w-3" />
                {t('verification.statuses.pending')}
              </span>
            )}
            {session.profile.district && (
              <span className="rounded-full border border-line bg-mist px-2.5 py-1 text-[12px] text-ink-soft">
                {session.profile.district}
              </span>
            )}
          </div>

          {stats && (
            <div>
              <h2 className="eyebrow mb-2">{t('cv.verifiedSection')}</h2>
              <div className="grid grid-cols-3 gap-2.5">
                <Stat value={stats.shifts_completed} label={t('cv.shiftsCompleted')} />
                <Stat
                  value={stats.reliability_percent ?? '—'}
                  label={t('cv.reliability')}
                  suffix={stats.reliability_percent === null ? '' : '%'}
                />
                <Stat value={stats.average_rating ?? '—'} label={t('cv.averageRating')} />
              </div>
              <p className="mt-2 text-[11.5px] leading-relaxed text-ink-faint">
                {t('cv.verifiedNote')}
              </p>
            </div>
          )}

          <div className="card divide-y divide-line">
            <Row label={t('auth.email')} value={session.email} mono />
            {session.profile.phone && (
              <Row label={t('auth.fields.phone')} value={session.profile.phone} mono />
            )}
            <Row
              label={t('cv.memberSince')}
              value={formatDate(new Date(session.profile.created_at), locale as Locale)}
            />
          </div>

          <div className="card flex items-center justify-between p-4">
            <span className="text-[13.5px] font-medium">{t('common.language')}</span>
            <LocaleSwitch className="text-ink-soft" />
          </div>

          <SignOutButton />
        </div>
      </PageBody>
    </>
  );
}

function Stat({
  value,
  label,
  suffix = '',
}: {
  value: number | string;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="card p-3 text-center">
      <span className="figure block text-[17px] font-semibold text-indigo">
        {value}
        {suffix}
      </span>
      <span className="mt-0.5 block text-[10.5px] leading-tight text-ink-faint">{label}</span>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 p-4">
      <span className="text-[12.5px] text-ink-faint">{label}</span>
      <span className={`text-[13px] ${mono ? 'figure' : ''}`} dir={mono ? 'ltr' : undefined}>
        {value}
      </span>
    </div>
  );
}
