'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/session';
import type { HandoffItems } from '@/lib/supabase/database.types';
import type { ActionResult } from './marketplace';

export const HANDOFF_ITEM_KEYS = [
  'controlled_register_counted',
  'till_float_agreed',
  'fridge_log_checked',
  'keys_alarm_safe_handed_over',
  'owner_emergency_contact_confirmed',
] as const satisfies readonly (keyof HandoffItems)[];

export async function toggleHandoffItem(
  bookingId: string,
  item: keyof HandoffItems,
  done: boolean,
): Promise<ActionResult> {
  await requireSession();
  const supabase = await createClient();

  const { data: handoff } = await supabase
    .from('handoffs')
    .select('items')
    .eq('booking_id', bookingId)
    .maybeSingle();

  if (!handoff) return { ok: false, error: 'common.somethingWentWrong' };

  const { error } = await supabase
    .from('handoffs')
    .update({ items: { ...handoff.items, [item]: done } })
    .eq('booking_id', bookingId);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/shifts/${bookingId}/handoff`);
  return { ok: true };
}

/**
 * Record this party's confirmation.
 *
 * Both sides must confirm, and the second confirmation is what completes the
 * booking — a database trigger does that, not this action, so the booking cannot
 * be completed by any other route. The same trigger rejects a confirmation while
 * any of the five items is outstanding, and refuses to let one be withdrawn.
 */
export async function confirmHandoff(bookingId: string): Promise<ActionResult> {
  const session = await requireSession();
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from('bookings')
    .select('pharmacist_id, pharmacy_id')
    .eq('id', bookingId)
    .maybeSingle();

  if (!booking) return { ok: false, error: 'common.somethingWentWrong' };

  const now = new Date().toISOString();
  const confirmation =
    booking.pharmacist_id === session.userId
      ? { confirmed_by_pharmacist_at: now }
      : { confirmed_by_pharmacy_at: now };

  const { error } = await supabase
    .from('handoffs')
    .update(confirmation)
    .eq('booking_id', bookingId);

  if (error) return { ok: false, error: 'handoff.allItemsRequired' };

  revalidatePath(`/shifts/${bookingId}/handoff`);
  revalidatePath('/shifts');
  return { ok: true };
}
