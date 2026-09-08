'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/session';
import { incidentSchema } from '@/lib/validation';
import type { ActionResult } from './marketplace';

/**
 * File a report.
 *
 * The evidence gate — a completed two-party handoff — is enforced by a database
 * trigger, not here, and every report opens at tier 1 whatever the form says.
 * This action's job is to name the subject correctly and pass the text through.
 */
export async function reportIncident(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = incidentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: 'incidents.descriptionHint' };
  }

  const supabase = await createClient();

  const { data: booking } = await supabase
    .from('bookings')
    .select('pharmacist_id, pharmacy_id')
    .eq('id', parsed.data.bookingId)
    .maybeSingle();

  if (!booking) return { ok: false, error: 'common.somethingWentWrong' };

  // The other party to this booking, whichever side the reporter is on. The
  // database checks this again — a report can only name your counterparty.
  const subjectId =
    booking.pharmacist_id === session.userId ? booking.pharmacy_id : booking.pharmacist_id;

  const { error } = await supabase.from('incidents').insert({
    booking_id: parsed.data.bookingId,
    reporter_id: session.userId,
    subject_id: subjectId,
    category: parsed.data.category,
    description: parsed.data.description,
  });

  if (error) {
    // The likeliest cause by far is the evidence gate: no completed handoff.
    return { ok: false, error: 'incidents.evidenceGate' };
  }

  revalidatePath('/incidents');
  revalidatePath('/shifts');
  return { ok: true };
}

const replySchema = z.object({
  incidentId: z.string().uuid(),
  reply: z.string().trim().min(20).max(4000),
});

/**
 * The subject's answer.
 *
 * This is the right of reply, and it is the thing that keeps the whole channel
 * defensible: nothing escalates past tier 1 until the subject has been notified
 * and either replied or let the window lapse.
 */
export async function replyToIncident(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = replySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: 'incidents.replyTooShort' };

  const supabase = await createClient();

  const { error } = await supabase
    .from('incidents')
    .update({
      subject_reply: parsed.data.reply,
      subject_replied_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.incidentId)
    .eq('subject_id', session.userId);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/incidents');
  return { ok: true };
}
