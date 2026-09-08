import { type NextRequest, NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isUniversityEmail } from '@/lib/university-email';

/**
 * The student email-confirmation callback — the one place student verification
 * actually completes.
 *
 * Clicking the link proves the address is theirs; the domain rule was already
 * checked at signup. Together that is the whole of student verification, which
 * is why it is instant and why pharmacists and pharmacies still wait for a human.
 *
 * The domain is re-checked here rather than trusted from signup: this runs with
 * the service role, and a check worth doing at the front door is worth repeating
 * at the only door that can grant the badge.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  if (!tokenHash || !type) {
    return NextResponse.redirect(`${origin}/sign-in?error=invalid_link`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/sign-in?error=invalid_link`);
  }

  const email = data.user.email ?? '';

  const admin = createAdminClient();
  const { data: student } = await admin
    .from('student_details')
    .select('profile_id, university_email')
    .eq('profile_id', data.user.id)
    .maybeSingle();

  // Only students verify this way. A pharmacist confirming their email address
  // has proved nothing about their Syndicate registration, and must not be
  // promoted here.
  if (!student || !isUniversityEmail(student.university_email) || !isUniversityEmail(email)) {
    return NextResponse.redirect(`${origin}/`);
  }

  await admin
    .from('student_details')
    .update({ email_verified_at: new Date().toISOString() })
    .eq('profile_id', data.user.id);

  // verified_at is stamped by the trigger.
  await admin
    .from('profiles')
    .update({ verification_status: 'verified' })
    .eq('id', data.user.id)
    .eq('role', 'student');

  return NextResponse.redirect(`${origin}/`);
}
