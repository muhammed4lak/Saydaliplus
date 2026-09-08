'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/session';
import type { ActionResult } from './marketplace';

/** `<user id>/<filename>` — the shape the bucket policy enforces. */
const documentPathSchema = z
  .string()
  .trim()
  .min(1)
  .max(400)
  .regex(/^[0-9a-f-]{36}\/[A-Za-z0-9._-]+$/, 'Unexpected document path');

/**
 * Attach an uploaded document to the account awaiting review.
 *
 * The path is re-checked against the caller's own id here as well as by the
 * bucket policy. A client that uploaded correctly could still submit a path
 * pointing at somebody else's folder, and a reviewer looking at the wrong
 * person's Syndicate card would approve the wrong person.
 */
export async function attachVerificationDocument(path: string): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = documentPathSchema.safeParse(path);
  if (!parsed.success) return { ok: false, error: 'common.somethingWentWrong' };
  if (!parsed.data.startsWith(`${session.userId}/`)) {
    return { ok: false, error: 'common.somethingWentWrong' };
  }

  const supabase = await createClient();

  const { error } =
    session.profile.role === 'pharmacy'
      ? await supabase
          .from('pharmacy_details')
          .update({ licence_document_url: parsed.data })
          .eq('profile_id', session.userId)
      : await supabase
          .from('pharmacist_details')
          .update({ card_document_url: parsed.data })
          .eq('profile_id', session.userId);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/verification-pending');
  revalidatePath('/admin/queue');
  return { ok: true };
}

/**
 * A short-lived signed URL for a private document.
 *
 * The bucket is private, so a reviewer cannot simply be handed a public link.
 * Ten minutes is enough to look at a card and decide, and short enough that a
 * URL pasted into a chat is stale by the time anyone else opens it.
 */
export async function getDocumentUrl(path: string): Promise<string | null> {
  const session = await requireSession();
  if (!session.isAdmin && !path.startsWith(`${session.userId}/`)) return null;

  const supabase = await createClient();
  const { data } = await supabase.storage
    .from('verification-documents')
    .createSignedUrl(path, 600);

  return data?.signedUrl ?? null;
}
