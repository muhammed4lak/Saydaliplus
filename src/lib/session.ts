import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Pharmacy, PharmacyStaff, Profile, UserRole } from '@/lib/supabase/database.types';
import { viewRole, type ViewRole } from '@/lib/permissions';

export interface Session {
  userId: string;
  email: string;
  profile: Profile;
  isVerified: boolean;
  isAdmin: boolean;
  /** A Syndicate-verified pharmacist: the only kind of account that can own or work (0015). */
  hasBadge: boolean;
  /** The pharmacies this pharmacist owns. Owning is a link, not a type. */
  owned: Pharmacy[];
  /** Their places on teams they are active on, at pharmacies they do not own. */
  workplaces: PharmacyStaff[];
  /** What the interface shows — derived from the links, never stored. */
  view: ViewRole;
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

  /* RLS returns only what this person may see: pharmacies they own or work
     at, and their own places on teams. */
  const [{ data: pharmacies }, { data: places }] = await Promise.all([
    supabase.from('pharmacies').select('*').eq('owner_id', user.id),
    supabase.from('pharmacy_staff').select('*').eq('pharmacist_id', user.id).eq('state', 'active'),
  ]);
  const owned = pharmacies ?? [];
  const isVerified = profile.verification_status === 'verified';

  return {
    userId: user.id,
    email: user.email ?? '',
    profile,
    isVerified,
    isAdmin: (count ?? 0) > 0,
    hasBadge: isVerified && profile.role === 'pharmacist',
    owned,
    workplaces: (places ?? []).filter((p) => !owned.some((o) => o.id === p.pharmacy_id)),
    view: viewRole(profile.role, owned.length),
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
