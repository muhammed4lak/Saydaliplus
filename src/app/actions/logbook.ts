'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/session';
import { MIN_LOG_CHARACTERS } from '@/lib/logbook';
import type { ActionResult } from './marketplace';

const saveSchema = z.object({
  weekId: z.string().uuid(),
  daysPresent: z.array(z.boolean()).length(5),
  text: z.string().max(4000),
  lang: z.enum(['ar', 'en']),
});

/**
 * Save a week in progress.
 *
 * Saving is deliberately unvalidated beyond its shape: a student writing on a
 * phone between customers should be able to put down half a sentence and come
 * back to it. The 80-character and attendance rules apply at *submission*, which
 * is the point the week becomes part of the record.
 *
 * The database refuses this on any week that is not the open one, so a saved
 * draft cannot be slipped into a locked or already-submitted week.
 */
export async function saveLogWeek(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();

  const parsed = saveSchema.safeParse({
    weekId: formData.get('weekId'),
    daysPresent: [0, 1, 2, 3, 4].map((day) => formData.get(`day-${day}`) === 'on'),
    text: formData.get('text') ?? '',
    lang: formData.get('lang') ?? 'ar',
  });
  if (!parsed.success) return { ok: false, error: 'common.somethingWentWrong' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('log_weeks')
    .update({
      days_present: parsed.data.daysPresent,
      ...(parsed.data.lang === 'ar'
        ? { text_ar: parsed.data.text }
        : { text_en: parsed.data.text }),
    })
    .eq('id', parsed.data.weekId);

  if (error) return { ok: false, error: 'logbook.lockedNote' };

  revalidatePath('/logbook');
  return { ok: true };
}

/**
 * Submit a week, which unlocks the next one.
 *
 * Saves first so nothing typed is lost, then calls the RPC. The RPC re-checks
 * attendance and length: this is the forward-fill rule, and it has to hold even
 * if the form is bypassed entirely.
 */
export async function submitLogWeek(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const saved = await saveLogWeek({ ok: false }, formData);
  if (!saved.ok) return saved;

  const weekId = formData.get('weekId');
  if (typeof weekId !== 'string') return { ok: false, error: 'common.somethingWentWrong' };

  const text = String(formData.get('text') ?? '').trim();
  const anyDay = [0, 1, 2, 3, 4].some((day) => formData.get(`day-${day}`) === 'on');

  // Checked here too so the student gets the specific reason rather than a
  // generic database error.
  if (!anyDay) return { ok: false, error: 'logbook.needsAttendance' };
  if (text.length < MIN_LOG_CHARACTERS) return { ok: false, error: 'logbook.needsText' };

  const supabase = await createClient();
  const { error } = await supabase.rpc('submit_log_week', { week_id: weekId });

  if (error) return { ok: false, error: 'common.somethingWentWrong' };

  revalidatePath('/logbook');
  revalidatePath('/trainees');
  return { ok: true };
}

export async function approveMonth(placementId: string, monthNo: number): Promise<ActionResult> {
  await requireSession();
  const supabase = await createClient();

  const { error } = await supabase.rpc('approve_month', {
    placement_id: placementId,
    month_no: monthNo,
  });
  if (error) return { ok: false, error: 'logbook.approveGate' };

  revalidatePath('/trainees');
  revalidatePath('/logbook');
  return { ok: true };
}

/**
 * Return a month for rewriting. The note is required: "returned" with no reason
 * tells a student nothing and makes the second attempt a guess.
 */
export async function returnMonth(
  placementId: string,
  monthNo: number,
  note: string,
): Promise<ActionResult> {
  await requireSession();

  if (note.trim().length < 10) return { ok: false, error: 'logbook.returnNeedsNote' };

  const supabase = await createClient();
  const { error } = await supabase.rpc('return_month', {
    placement_id: placementId,
    month_no: monthNo,
    note: note.trim(),
  });
  if (error) return { ok: false, error: 'common.somethingWentWrong' };

  revalidatePath('/trainees');
  revalidatePath('/logbook');
  return { ok: true };
}
