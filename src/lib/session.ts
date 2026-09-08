import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile, UserRole } from '@/lib/supabase/database.types';

export interface Session {
  userId: string;
  email: string;
  profile: Profile;
  isVerified: boolean;
  isAdmin: boolean;
}

/**
 * The signed-in user and their profile, or null.
 *
 * `cache` keeps this to one round trip per request even when several Server
 * Components ask for it.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) return null;

  const { count } = await supabase
    .from('platform_admins')
    .select('profile_id', { count: 'exact', head: true })
    .eq('profile_id', user.id);

  return {
    userId: user.id,
    email: user.email ?? '',
    profile,
    isVerified: profile.verification_status === 'verified',
    isAdmin: (count ?? 0) > 0,
  };
});

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect('/sign-in');
  return session;
}

/**
 * Guard a route to one role. Note this is convenience, not security: RLS is what
 * actually stops a pharmacist reading a pharmacy's data. This just avoids
 * rendering a page that would come back empty.
 */
export async function requireRole(role: UserRole): Promise<Session> {
  const session = await requireSession();
  if (session.profile.role !== role) redirect('/');
  return session;
}

/** The display name in the reader's language, falling back to whichever exists. */
export function displayName(
  profile: Pick<Profile, 'full_name_ar' | 'full_name_en'>,
  locale: 'ar' | 'en',
): string {
  const preferred = locale === 'ar' ? profile.full_name_ar : profile.full_name_en;
  return preferred ?? profile.full_name_en ?? profile.full_name_ar ?? '';
}
