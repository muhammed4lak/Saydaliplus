'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/session';
import { postListingSchema, ratingSchema } from '@/lib/validation';
import { resolveShiftWindow } from '@/lib/time';

export interface ActionResult {
  ok: boolean;
  error?: string;
}

/**
 * Apply to a listing.
 *
 * Note there is no verification check here. An unverified pharmacist may apply,
 * and their application stays invisible to the pharmacy until the Syndicate
 * review clears — that is an RLS predicate on `applications`, not a rule this
 * action enforces. What the database does reject is applying to a filled
 * listing, to your own listing, or with the wrong role for the listing type.
 */
export async function applyToListing(listingId: string): Promise<ActionResult> {
  const session = await requireSession();
  const supabase = await createClient();

  const { error } = await supabase
    .from('applications')
    .insert({ listing_id: listingId, applicant_id: session.userId });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath('/browse');
  revalidatePath(`/listings/${listingId}`);
  return { ok: true };
}

export async function withdrawApplication(applicationId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('applications')
    .update({ status: 'withdrawn' })
    .eq('id', applicationId);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/browse');
  return { ok: true };
}

/**
 * Post a shift or an internship.
 *
 * The total is deliberately not sent: a trigger derives it from the rate and the
 * shift window, because the total is what every fee is calculated from. All this
 * has to get right is turning a date and two clock times into real timestamps —
 * including rolling the end date forward when the shift crosses midnight.
 */
export async function postListing(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();

  const raw = Object.fromEntries(formData);
  const parsed = postListingSchema.safeParse({
    ...raw,
    includesControlled: raw.includesControlled === 'on',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'common.somethingWentWrong' };
  }

  const session = await requireSession();
  const supabase = await createClient();

  // The two shapes are inserted separately rather than as a union, because an
  // internship must carry no rate at all — a check constraint enforces that, and
  // keeping the branches apart means the compiler agrees with the database
  // instead of nullable columns papering over the difference.
  const { error } = await (parsed.data.type === 'shift'
    ? (() => {
        const { startsAt, endsAt } = resolveShiftWindow(
          parsed.data.date,
          parsed.data.startTime,
          parsed.data.endTime,
        );
        return supabase.from('listings').insert({
          pharmacy_id: session.userId,
          type: 'shift',
          district: parsed.data.district,
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
          rate_type: parsed.data.rateType,
          rate_amount: parsed.data.rateAmount,
          includes_controlled: parsed.data.includesControlled,
          notes: parsed.data.notes ?? null,
        });
      })()
    : supabase.from('listings').insert({
        pharmacy_id: session.userId,
        type: 'internship',
        district: parsed.data.district,
        starts_at: new Date(parsed.data.startDate).toISOString(),
        ends_at: new Date(parsed.data.endDate).toISOString(),
        notes: parsed.data.notes ?? null,
      }));

  // The likeliest cause is an unverified pharmacy: RLS refuses the insert.
  if (error) return { ok: false, error: 'verification.bannerPharmacy' };

  revalidatePath('/dashboard');
  return { ok: true };
}

/**
 * Accept an applicant. One database call: the RPC creates the booking on the
 * platform's own fee terms, closes the listing and turns down the others, all in
 * one transaction.
 */
export async function acceptApplicant(applicationId: string): Promise<ActionResult> {
  await requireSession();
  const supabase = await createClient();

  const { error } = await supabase.rpc('accept_application', {
    application_id: applicationId,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath('/applicants');
  revalidatePath('/dashboard');
  return { ok: true };
}

export async function cancelBooking(bookingId: string): Promise<ActionResult> {
  await requireSession();
  const supabase = await createClient();

  const { error } = await supabase.rpc('cancel_booking', { booking_id: bookingId });
  if (error) return { ok: false, error: error.message };

  revalidatePath('/shifts');
  return { ok: true };
}

export async function submitRating(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = ratingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: 'common.somethingWentWrong' };

  const supabase = await createClient();

  const { data: booking } = await supabase
    .from('bookings')
    .select('pharmacist_id, pharmacy_id')
    .eq('id', parsed.data.bookingId)
    .single();

  if (!booking) return { ok: false, error: 'common.somethingWentWrong' };

  const rateeId =
    booking.pharmacist_id === session.userId ? booking.pharmacy_id : booking.pharmacist_id;

  const { error } = await supabase.from('ratings').insert({
    booking_id: parsed.data.bookingId,
    rater_id: session.userId,
    ratee_id: rateeId,
    stars: parsed.data.stars,
    comment: parsed.data.comment ?? null,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath('/shifts');
  return { ok: true };
}
