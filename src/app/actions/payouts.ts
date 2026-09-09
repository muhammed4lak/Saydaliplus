'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/session';
import { payoutSchema } from '@/lib/validation';
import { getPaymentsProvider } from '@/lib/payments';
import type { ActionResult } from './marketplace';

/**
 * Request a payout of everything currently owed.
 *
 * The amount is not sent by the client. `request_payout()` sums the completed,
 * unpaid bookings and claims them in the same transaction, so two taps on a slow
 * connection cannot be paid twice for one shift.
 *
 * The disbursement itself then goes through the payments provider — the mock
 * until the ZainCash and Qi Card merchant agreements exist. A provider failure
 * leaves the payout row in place marked `failed`, rather than silently
 * disappearing: a pharmacist who is owed money must be able to see that we tried
 * and what went wrong.
 */
export async function requestPayout(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();

  const parsed = payoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: 'common.somethingWentWrong' };

  const supabase = await createClient();

  const { data: payout, error } = await supabase.rpc('request_payout', {
    method: parsed.data.method,
  });

  if (error || !payout) {
    // request_payout() refuses for two reasons worth telling apart: nothing is
    // owed, or there is no wallet number to pay into.
    return {
      ok: false,
      error: error?.message?.includes('wallet')
        ? 'earnings.needsDestination'
        : 'earnings.nothingPayable',
    };
  }

  const { data: details } = await supabase
    .from('pharmacist_details')
    .select('payout_destination')
    .maybeSingle();

  const provider = getPaymentsProvider();
  const result = await provider.disburse({
    payoutId: payout.id,
    amountIQD: payout.amount,
    method: parsed.data.method,
    // The wallet the pharmacist gave us, not their account phone: a ZainCash
    // wallet is often registered to a different number, and paying the wrong
    // one is unrecoverable. request_payout() has already refused if it is unset.
    destination: details?.payout_destination ?? '',
    reference: `saydali-${payout.id}`,
  });

  await supabase
    .from('payouts')
    .update(
      result.status === 'failed'
        ? { status: 'failed', failure_reason: result.failureReason ?? null }
        : {
            status: result.status === 'settled' ? 'settled' : 'processing',
            provider_ref: result.providerRef,
            settled_at: result.status === 'settled' ? new Date().toISOString() : null,
          },
    )
    .eq('id', payout.id);

  revalidatePath('/earnings');
  return result.status === 'failed'
    ? { ok: false, error: 'earnings.payoutFailed' }
    : { ok: true };
}

/**
 * Save the wallet the pharmacist wants to be paid into.
 *
 * Kept separate from the account phone on purpose: a ZainCash wallet is often
 * registered to a different number, and a payout sent to the wrong one is not
 * recoverable. Asking once, explicitly, is cheaper than assuming.
 */
export async function savePayoutDestination(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();

  const destination = String(formData.get('destination') ?? '').trim();
  if (destination.length < 6 || destination.length > 40) {
    return { ok: false, error: 'earnings.destinationInvalid' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('pharmacist_details')
    .update({ payout_destination: destination })
    .eq('profile_id', session.userId);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/earnings');
  return { ok: true };
}
