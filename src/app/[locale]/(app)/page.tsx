import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { requireSession } from '@/lib/session';
import type { UserRole } from '@/lib/supabase/database.types';

/** Each role's home is a different page; there is no shared dashboard. */
const HOME: Record<UserRole, string> = {
  pharmacist: '/browse',
  pharmacy: '/dashboard',
  student: '/browse',
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireSession();
  redirect(HOME[session.profile.role]);
}
