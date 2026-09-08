import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

/**
 * The browser client. Only the anon key ever reaches here; RLS is what decides
 * what it can see.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
