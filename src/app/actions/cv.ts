'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/session';
import { CvAssistantError, runCvAssist, type AssistResult } from '@/lib/ai/cv-assistant';
import type { ActionResult } from './marketplace';

const cvSchema = z.object({
  lang: z.enum(['ar', 'en']),
  summary: z.string().max(2000),
  experience: z
    .array(
      z.object({
        role: z.string().max(200),
        organisation: z.string().max(200),
        from: z.string().max(40),
        to: z.string().max(40).nullable(),
        details: z.string().max(2000),
      }),
    )
    .max(20),
  education: z
    .array(
      z.object({
        qualification: z.string().max(200),
        institution: z.string().max(200),
        year: z.string().max(40),
      }),
    )
    .max(20),
  certifications: z
    .array(
      z.object({ name: z.string().max(200), issuer: z.string().max(200), year: z.string().max(40) }),
    )
    .max(20),
  skills: z.array(z.string().max(80)).max(40),
  languages: z
    .array(
      z.object({
        language: z.string().max(60),
        proficiency: z.enum(['native', 'fluent', 'professional', 'basic']),
      }),
    )
    .max(20),
});

export async function saveCv(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await requireSession();

  const raw = formData.get('payload');
  if (typeof raw !== 'string') return { ok: false, error: 'common.somethingWentWrong' };

  let parsed;
  try {
    parsed = cvSchema.safeParse(JSON.parse(raw));
  } catch {
    return { ok: false, error: 'common.somethingWentWrong' };
  }
  if (!parsed.success) return { ok: false, error: 'common.somethingWentWrong' };

  const supabase = await createClient();

  // One row per (pharmacist, language) — the CV genuinely exists twice, so this
  // writes only the language being edited and leaves the other alone.
  const { error } = await supabase.from('cv').upsert(
    {
      pharmacist_id: session.userId,
      lang: parsed.data.lang,
      summary: parsed.data.summary,
      experience: parsed.data.experience,
      education: parsed.data.education,
      certifications: parsed.data.certifications,
      skills: parsed.data.skills,
      languages: parsed.data.languages,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'pharmacist_id,lang' },
  );

  if (error) return { ok: false, error: error.message };

  revalidatePath('/cv');
  return { ok: true };
}

/**
 * A crude per-user rate limit.
 *
 * In-memory, so it is per server instance — on several instances a determined
 * user gets a multiple of this. That is a known limit, not an oversight: it
 * stops the accidental case (a stuck button, someone hammering Polish) which is
 * what actually runs up a bill, and the real fix is a shared counter, which is
 * worth adding when there is more than one instance to share it between.
 */
const RATE_LIMIT = { max: 12, windowMs: 60 * 60 * 1000 };
const recentCalls = new Map<string, number[]>();

function withinRateLimit(userId: string): boolean {
  const now = Date.now();

  // Drop everyone whose window has passed, not just this caller's. Pruning only
  // the current user would leave an entry per user who never comes back, which
  // on a long-running server is a slow leak.
  for (const [key, times] of recentCalls) {
    if (times.every((at) => now - at >= RATE_LIMIT.windowMs)) recentCalls.delete(key);
  }

  const calls = (recentCalls.get(userId) ?? []).filter(
    (at) => now - at < RATE_LIMIT.windowMs,
  );

  if (calls.length >= RATE_LIMIT.max) {
    recentCalls.set(userId, calls);
    return false;
  }

  calls.push(now);
  recentCalls.set(userId, calls);
  return true;
}

export interface AssistActionResult {
  ok: boolean;
  error?: string;
  result?: AssistResult;
}

/**
 * Run the assistant and hand the result back for review.
 *
 * Note what this does not do: write anything. The caller shows a before/after
 * and the user chooses. Nothing reaches the CV without a person having read it,
 * which is the only real defence against a subtly wrong rewrite.
 */
export async function assistCv(input: {
  action: 'polish' | 'shorten' | 'tailor' | 'translate';
  lang: 'ar' | 'en';
  targetLang?: 'ar' | 'en';
  jobAdvert?: string;
}): Promise<AssistActionResult> {
  const session = await requireSession();

  if (!withinRateLimit(session.userId)) {
    return { ok: false, error: 'cv.ai.rateLimited' };
  }

  const supabase = await createClient();
  const { data: cv } = await supabase
    .from('cv')
    .select('*')
    .eq('pharmacist_id', session.userId)
    .eq('lang', input.lang)
    .maybeSingle();

  if (!cv) return { ok: false, error: 'cv.ai.nothingToWorkOn' };

  try {
    const result = await runCvAssist({
      action: input.action,
      summary: cv.summary ?? '',
      experience: cv.experience ?? [],
      sourceLang: input.lang,
      targetLang: input.targetLang,
      jobAdvert: input.jobAdvert,
    });
    return { ok: true, result };
  } catch (error) {
    // Fail loudly and leave the CV alone, as the brief requires. The user is
    // told plainly rather than being shown a spinner that quietly gives up.
    return {
      ok: false,
      error: error instanceof CvAssistantError ? 'cv.ai.failed' : 'cv.ai.failed',
    };
  }
}
