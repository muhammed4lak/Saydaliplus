import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { IncidentReply } from '@/components/incident-reply';
import { NavIcon } from '@/components/icons';
import { requireSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/dates';
import type { Locale } from '@/i18n/routing';

export default async function IncidentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireSession();
  const t = await getTranslations();
  const supabase = await createClient();

  // RLS shows exactly two things: reports you filed, and reports about you. An
  // unresolved report is not a signal broadcast to anyone else.
  const { data: incidents } = await supabase
    .from('incidents')
    .select('*')
    .order('created_at', { ascending: false });

  const aboutMe = (incidents ?? []).filter((i) => i.subject_id === session.userId);
  const filedByMe = (incidents ?? []).filter((i) => i.reporter_id === session.userId);

  return (
    <>
      <PageHeader eyebrow={t('incidents.report')} title={t('incidents.title')} />

      <PageBody>
        <div className="mx-auto max-w-2xl space-y-6">
          {aboutMe.length > 0 && (
            <section>
              <h2 className="eyebrow mb-3">{t('incidents.aboutYou')}</h2>
              <div className="space-y-3">
                {aboutMe.map((incident) => (
                  <div key={incident.id} className="card p-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <p className="text-[13.5px] font-semibold">
                        {t(`incidents.categories.${incident.category}`)}
                      </p>
                      <span
                        className={
                          incident.tier === 'tier_1' ? 'badge-pending' : 'badge-controlled'
                        }
                      >
                        {t(`incidents.tiers.${incident.tier}`)}
                      </span>
                    </div>

                    <p className="mb-3 whitespace-pre-line text-[12.5px] leading-relaxed text-ink-soft">
                      {incident.description}
                    </p>

                    <p className="mb-3 text-[11.5px] text-ink-faint">
                      {formatDate(new Date(incident.created_at), locale as Locale)}
                    </p>

                    {/* The right of reply, offered rather than buried. */}
                    {incident.subject_replied_at ? (
                      <div className="rounded-[11px] bg-mist p-3">
                        <p className="mb-1 text-[11px] uppercase tracking-wide text-ink-faint">
                          {t('incidents.yourReply')}
                        </p>
                        <p className="whitespace-pre-line text-[12.5px] leading-relaxed">
                          {incident.subject_reply}
                        </p>
                      </div>
                    ) : (
                      <IncidentReply incidentId={incident.id} />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {filedByMe.length > 0 && (
            <section>
              <h2 className="eyebrow mb-3">{t('incidents.filedByYou')}</h2>
              <ul className="card divide-y divide-line">
                {filedByMe.map((incident) => (
                  <li key={incident.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[13.5px] font-medium">
                        {t(`incidents.categories.${incident.category}`)}
                      </p>
                      <span className="badge bg-mist text-ink-faint">
                        {t(`incidents.statuses.${incident.status}`)}
                      </span>
                    </div>
                    <p className="mt-1 text-[11.5px] text-ink-faint">
                      {formatDate(new Date(incident.created_at), locale as Locale)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {aboutMe.length === 0 && filedByMe.length === 0 && (
            <p className="card p-6 text-center text-[13px] text-ink-faint">
              {t('incidents.none')}
            </p>
          )}

          <div className="flex items-start gap-2.5 rounded-card border border-indigo-tint bg-indigo-tint/40 p-4">
            <NavIcon name="badge" className="mt-0.5 h-4 w-4 shrink-0 text-indigo" />
            <p className="text-[12px] leading-relaxed text-indigo-dark">
              {t('incidents.tier1Note')}
            </p>
          </div>
        </div>
      </PageBody>
    </>
  );
}
