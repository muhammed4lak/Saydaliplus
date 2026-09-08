/**
 * The payments boundary.
 *
 * Two things shape this interface.
 *
 * First, money must flow pharmacy -> platform merchant account -> pharmacist.
 * The pharmacist-side 3% is only collectable if we are the ones disbursing; if
 * the two parties settle peer-to-peer we cannot collect it and the revenue model
 * does not work. So a "payout" here is always a disbursement we initiate.
 *
 * Second, we are a merchant, not a bank. Nothing in this interface opens an
 * account, holds a balance, or moves money between users. Acting as a payment
 * intermediary in Iraq likely requires operating under a licensed provider's
 * arrangement, and we do not have one — so if a future method here starts to
 * look like custody of customer funds, that is the signal to stop and get legal
 * advice rather than to implement it.
 *
 * The mock implementation lets the whole marketplace be built and tested before
 * the ZainCash and Qi Card merchant agreements exist.
 */

export type PaymentMethod = 'zaincash' | 'qicard';

export interface DisbursementRequest {
  /** Our own payout id, used for idempotency. */
  payoutId: string;
  amountIQD: number;
  method: PaymentMethod;
  /** The pharmacist's wallet or card identifier with the provider. */
  destination: string;
  reference: string;
}

export interface DisbursementResult {
  status: 'accepted' | 'settled' | 'failed';
  /** The provider's own id, stored so a support query can be traced. */
  providerRef: string | null;
  /** What the processor took, in IQD. Comes out of our commission. */
  processorFeeIQD: number;
  failureReason?: string;
}

export interface ChargeRequest {
  bookingId: string;
  /** The rate plus the pharmacy's 7% — what the pharmacy actually pays. */
  amountIQD: number;
  method: PaymentMethod;
  payerReference: string;
}

export interface ChargeResult {
  status: 'accepted' | 'settled' | 'failed';
  providerRef: string | null;
  failureReason?: string;
}

export interface PaymentsProvider {
  readonly name: string;
  /** Take the pharmacy's payment into the platform merchant account. */
  charge(request: ChargeRequest): Promise<ChargeResult>;
  /** Pay the pharmacist out of it. */
  disburse(request: DisbursementRequest): Promise<DisbursementResult>;
  /** Poll, for providers that settle asynchronously. */
  getStatus(providerRef: string): Promise<'pending' | 'settled' | 'failed'>;
}
