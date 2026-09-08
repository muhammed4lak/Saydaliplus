import { setRequestLocale } from 'next-intl/server';
import { AppShell } from '@/components/app-shell';
import { VerificationBanner } from '@/components/verification-banner';
import { requireSession } from '@/lib/session';

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireSession();

  return (
    <AppShell role={session.profile.role} isAdmin={session.isAdmin}>
      {/* Persistent while verification is pending, on every page. A pharmacy
          that discovers it cannot post only at the moment it tries to post has
          been let down by the interface. */}
      {!session.isVerified && <VerificationBanner role={session.profile.role} />}
      {children}
    </AppShell>
  );
}
