import { PROCESSOR_FEE_RATE } from '@/config/fees';
import type {
  ChargeRequest,
  ChargeResult,
  DisbursementRequest,
  DisbursementResult,
  PaymentsProvider,
} from './provider';

/**
 * An in-memory provider, so the marketplace can be built and tested before the
 * merchant accounts exist.
 *
 * It fails on request rather than only succeeding: a payments integration that
 * has only ever been exercised on the happy path is one that will first meet a
 * declined disbursement in production, in front of a pharmacist who is owed
 * money. Any destination containing "fail" is rejected.
 */
export class MockPaymentsProvider implements PaymentsProvider {
  readonly name = 'mock';

  private readonly transfers = new Map<string, 'pending' | 'settled' | 'failed'>();

  async charge(request: ChargeRequest): Promise<ChargeResult> {
    if (request.payerReference.includes('fail')) {
      return { status: 'failed', providerRef: null, failureReason: 'Card declined (mock)' };
    }

    const providerRef = `mock-charge-${request.bookingId}`;
    this.transfers.set(providerRef, 'settled');
    return { status: 'settled', providerRef };
  }

  async disburse(request: DisbursementRequest): Promise<DisbursementResult> {
    if (request.destination.includes('fail')) {
      return {
        status: 'failed',
        providerRef: null,
        processorFeeIQD: 0,
        failureReason: 'Wallet not found (mock)',
      };
    }

    // Idempotent on our payout id, the way a real provider is on a client
    // reference: a retried request must not pay a pharmacist twice.
    const providerRef = `mock-payout-${request.payoutId}`;
    if (this.transfers.has(providerRef)) {
      return {
        status: 'settled',
        providerRef,
        processorFeeIQD: Math.round(request.amountIQD * PROCESSOR_FEE_RATE),
      };
    }

    this.transfers.set(providerRef, 'settled');
    return {
      status: 'settled',
      providerRef,
      processorFeeIQD: Math.round(request.amountIQD * PROCESSOR_FEE_RATE),
    };
  }

  async getStatus(providerRef: string): Promise<'pending' | 'settled' | 'failed'> {
    return this.transfers.get(providerRef) ?? 'failed';
  }
}
