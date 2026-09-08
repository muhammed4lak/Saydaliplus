import { MockPaymentsProvider } from './mock';
import type { PaymentsProvider } from './provider';

export * from './provider';

let provider: PaymentsProvider | null = null;

/**
 * The mock is the default because the ZainCash and Qi Card merchant agreements
 * do not exist yet. When they do, the real implementations register here — the
 * rest of the app talks only to the interface and does not change.
 */
export function getPaymentsProvider(): PaymentsProvider {
  if (provider) return provider;

  switch (process.env.PAYMENTS_PROVIDER) {
    case 'zaincash':
    case 'qicard':
      throw new Error(
        `The ${process.env.PAYMENTS_PROVIDER} provider is not implemented yet. ` +
          'It needs a signed merchant agreement first — see src/lib/payments/provider.ts.',
      );
    default:
      provider = new MockPaymentsProvider();
      return provider;
  }
}
