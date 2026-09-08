import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';
import { updateSupabaseSession } from '@/lib/supabase/middleware';

const handleI18n = createMiddleware(routing);

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Refresh the auth cookie first, then let next-intl decide the locale, so a
  // redirect to the localised path carries the refreshed session with it.
  const { response: authResponse } = await updateSupabaseSession(request);
  const response = handleI18n(request);

  for (const cookie of authResponse.cookies.getAll()) {
    response.cookies.set(cookie);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
