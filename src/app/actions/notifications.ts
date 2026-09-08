'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/session';
import type { ActionResult } from './marketplace';

export async function markAllNotificationsRead(): Promise<ActionResult> {
  const session = await requireSession();
  const supabase = await createClient();

  // RLS already restricts this to the caller's own rows; the explicit user_id
  // filter is here so the statement is correct on its own terms rather than
  // relying on the policy to narrow it.
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', session.userId)
    .is('read_at', null);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/notifications');
  return { ok: true };
}
