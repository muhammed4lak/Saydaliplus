'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/session';
import type { ActionResult } from './marketplace';

/**
 * Approve or reject an account.
 *
 * Runs as the reviewer's own session, not the service role: membership of
 * platform_admins is what authorises this, and RLS already understands that. A
 * reviewer whose admin rights are removed loses this immediately, with no code
 * change — which would not be true of a service-key path.
 */
export async function decideVerification(
  profileId: string,
  decision: 'verified' | 'rejected',
  reason?: string,
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session.isAdmin) return { ok: false, error: 'common.somethingWentWrong' };

  const supabase = await createClient();

  // verified_at is stamped by a trigger, so it can never disagree with the
  // status — there is no path that sets one without the other.
  const { error } = await supabase
    .from('profiles')
    .update({
      verification_status: decision,
      rejection_reason: decision === 'rejected' ? (reason ?? null) : null,
    })
    .eq('id', profileId);

  if (error) return { ok: false, error: error.message };

  await supabase.from('notifications').insert({
    user_id: profileId,
    type: 'verification',
    title_key:
      decision === 'verified' ? 'verification.statuses.verified' : 'verification.statuses.rejected',
    payload: reason ? { reason } : {},
  });

  revalidatePath('/admin/queue');
  return { ok: true };
}
