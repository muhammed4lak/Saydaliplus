import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { MarkAllRead } from '@/components/mark-all-read';
import { NavIcon, type IconName } from '@/components/icons';
import { requireSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/dates';
import type { Locale } from '@/i18n/routing';

const ICONS: Record<string, IconName> = {
  application: 'users',
  booking: 'calendar',
  logbook: 'book',
  placement: 'cap',
  incident: 'hourglass',
  verification: 'badge',
};

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  await requireSession();
  const t = await getTranslations();
  const supabase = await createClient();

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  const unread = (notifications ?? []).filter((n) => n.read_at === null).length;

  return (
    <>
      <PageHeader eyebrow={t('common.notifications')} title={t('common.notifications')} />

      <PageBody>
        <div className="mx-auto max-w-2xl space-y-3">
          {unread > 0 && <MarkAllRead />}

          {(notifications ?? []).length === 0 ? (
            <p className="card p-6 text-center text-[13px] text-ink-faint">
              {t('common.noNotifications')}
            </p>
          ) : (
            <ul className="card divide-y divide-line">
              {notifications?.map((notification) => (
                <li
                  key={notification.id}
                  className={`flex items-start gap-3 p-4 ${
                    notification.read_at === null ? 'bg-indigo-tint/30' : ''
                  }`}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-indigo-tint">
                    <NavIcon
                      name={ICONS[notification.type] ?? 'bell'}
                      className="h-4 w-4 text-indigo-dark"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    {/* Rendered from a message key, so the backlog follows the
                        reader's current language rather than the one they were
                        using when it arrived. */}
                    <p className="text-[13.5px] font-medium">{t(notification.title_key)}</p>
                    <p className="mt-0.5 text-[12px] text-ink-faint">
                      {formatDate(new Date(notification.created_at), locale as Locale)}
                    </p>
                  </div>
                  {notification.read_at === null && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </PageBody>
    </>
  );
}
