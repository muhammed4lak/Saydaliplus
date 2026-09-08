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
  const session = await requireSession();

  const parsed = payoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: 'common.somethingWentWrong' };

  const supabase = await createClient();

  const { data: payout, error } = await supabase.rpc('request_payout', {
    method: parsed.data.method,
  });

  if (error || !payout) {
    return { ok: false, error: 'earnings.nothingPayable' };
  }

  const provider = getPaymentsProvider();
  const result = await provider.disburse({
    payoutId: payout.id,
    amountIQD: payout.amount,
    method: parsed.data.method,
    // The pharmacist's wallet identifier with the provider. Their phone number
    // is the ZainCash handle; a real integration will collect and verify this
    // separately rather than assuming the account phone.
    destination: session.profile.phone ?? '',
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
