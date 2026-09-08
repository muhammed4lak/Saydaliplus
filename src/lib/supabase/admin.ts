import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/**
 * The service-role client. This bypasses RLS completely.
 *
 * There is exactly one legitimate use in this codebase: the student
 * email-confirmation callback, which has to flip a profile to verified before
 * anyone is signed in as that student. Everything else — including the admin
 * verification queue — goes through the reviewer's own session, because
 * platform_admins membership is what authorises them and RLS already understands
 * it. If you are reaching for this to make a policy problem go away, fix the
 * policy instead.
 *
 * Never import this from a Client Component; the key must not reach a browser.
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
