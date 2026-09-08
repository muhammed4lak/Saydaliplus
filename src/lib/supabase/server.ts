import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './database.types';

/**
 * The client for Server Components, Server Actions and Route Handlers.
 *
 * Everything goes through the user's own session so that RLS applies. There is
 * deliberately no convenience wrapper here that reaches for the service key —
 * see admin.ts for the one place that does, and why.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    requiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component, where cookies are read-only. The
            // middleware refreshes the session, so this is safe to ignore.
          }
        },
      },
    },
  );
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Copy .env.example to .env.local and fill in your Supabase project details.`,
    );
  }
  return value;
}
