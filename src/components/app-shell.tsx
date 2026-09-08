import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import type { UserRole } from '@/lib/supabase/database.types';
import { NavIcon, type IconName } from '@/components/icons';
import { LocaleSwitch } from '@/components/locale-switch';
import { createClient } from '@/lib/supabase/server';

/**
 * Two genuinely different layouts, as in the prototype: a phone shell with
 * bottom navigation, and a desktop shell with a sidebar and wider content. Not
 * one layout stretched — the phone is where a pharmacist accepts a shift
 * standing in a pharmacy, and the desktop is where an owner does their week.
 */

interface NavItem {
  href: string;
  labelKey: string;
  icon: IconName;
}

const NAV: Record<UserRole, NavItem[]> = {
  pharmacist: [
    { href: '/browse', labelKey: 'browse', icon: 'home' },
    { href: '/shifts', labelKey: 'myShifts', icon: 'calendar' },
    { href: '/earnings', labelKey: 'earnings', icon: 'wallet' },
    { href: '/cv', labelKey: 'cv', icon: 'clipboard' },
    { href: '/profile', labelKey: 'profile', icon: 'user' },
  ],
  pharmacy: [
    { href: '/dashboard', labelKey: 'dashboard', icon: 'home' },
    { href: '/post', labelKey: 'post', icon: 'plus' },
    { href: '/applicants', labelKey: 'applicants', icon: 'users' },
    { href: '/trainees', labelKey: 'trainees', icon: 'clipboard' },
    { href: '/profile', labelKey: 'profile', icon: 'user' },
  ],
  student: [
    { href: '/browse', labelKey: 'browse', icon: 'home' },
    { href: '/placement', labelKey: 'placement', icon: 'calendar' },
    { href: '/logbook', labelKey: 'logbook', icon: 'book' },
    { href: '/profile', labelKey: 'profile', icon: 'user' },
  ],
};

export async function AppShell({
  role,
  isAdmin,
  children,
}: {
  role: UserRole;
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  const t = await getTranslations('nav');
  const tBrand = await getTranslations('brand');

  const items = [...NAV[role]];
  if (isAdmin) {
    items.push({ href: '/admin/queue', labelKey: 'review', icon: 'badge' });
  }

  return (
    <div className="min-h-screen md:flex">
      {/* Desktop sidebar. */}
      <aside className="no-print header-pattern relative hidden w-[232px] shrink-0 flex-col p-6 text-white md:flex">
        <div className="relative z-10 flex flex-1 flex-col">
          <Link href="/" className="mb-6 font-display text-[19px] font-bold">
            {tBrand('name')}
          </Link>

          <nav className="flex flex-1 flex-col gap-0.5">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13.5px]
                           font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                <NavIcon name={item.icon} className="h-[17px] w-[17px] shrink-0" />
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="mt-3 border-t border-white/15 pt-4">
            <LocaleSwitch className="text-white/70" />
            <p className="mt-3 text-[11px] leading-relaxed text-white/50">
              {tBrand('positioning')}
            </p>
          </div>
        </div>
      </aside>

      <main className="flex min-h-screen flex-1 flex-col pb-[76px] md:pb-0">{children}</main>

      {/* Phone bottom navigation. */}
      <nav
        className="no-print fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-white
                   pb-[env(safe-area-inset-bottom,0px)] md:hidden"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-1 flex-col items-center gap-[3px] py-2.5 text-ink-faint transition
                       hover:text-indigo"
          >
            <NavIcon name={item.icon} className="h-[21px] w-[21px]" />
            <span className="text-[10.5px] font-medium">{t(item.labelKey)}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

/**
 * The page header, carrying the star-tile pattern in both layouts.
 *
 * The bell is a real link with a real count, not decoration — an unread badge
 * that never changes teaches people to stop looking at it.
 */
export async function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  const t = await getTranslations('common');
  const supabase = await createClient();

  const { count } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .is('read_at', null);

  const unread = count ?? 0;

  return (
    <header className="header-pattern relative overflow-hidden px-5 py-5 text-white md:px-8 md:py-7">
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 font-mono text-[11.5px] uppercase tracking-[0.06em] text-white/70">
            {eyebrow}
          </p>
          <h1 className="font-display text-[22px] font-bold leading-tight md:text-[23px]">
            {title}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {action}
          <Link
            href="/notifications"
            aria-label={t('notifications')}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 transition hover:bg-white/25"
          >
            <NavIcon name="bell" className="h-[18px] w-[18px]" />
            {unread > 0 && (
              <span className="absolute -end-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-amber px-1 font-mono text-[10px] font-semibold text-white">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export function PageBody({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 px-5 py-5 md:px-8 md:py-7">{children}</div>;
}
