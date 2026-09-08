/**
 * The single source of truth for platform economics.
 *
 * Nothing else in the codebase may contain a literal 0.07, 0.03 or 2500 — if you
 * find yourself typing one, add it here instead. The numbers move (the trial gets
 * extended, the floor gets raised once we see real short-shift volume) and they
 * have to move in one place.
 */

/** Total commission, as a fraction of the shift value. */
export const TOTAL_COMMISSION_RATE = 0.1;

/**
 * How the commission splits. The asymmetry is deliberate and load-bearing: the
 * labour side is oversupplied, so we take the larger share from the pharmacy,
 * added on top, rather than depressing pharmacist earnings further.
 */
export const PHARMACY_SHARE_OF_COMMISSION = 0.7; // 7% of shift value, added ON TOP
export const PHARMACIST_SHARE_OF_COMMISSION = 0.3; // 3% of shift value, deducted FROM payout

/**
 * Minimum commission on a filled shift, in IQD.
 *
 * At 4,000–6,000 IQD/hour a typical shift yields ~4,000 IQD of commission — about
 * US$3. A short shift priced at 15,000 IQD would yield 1,500, which does not cover
 * the processor cut and the support cost of the booking. The floor stops us
 * processing those at a loss.
 */
export const MINIMUM_COMMISSION_IQD = 2_500;

/** Free-trial length, counted from each account's own signup date — not a launch promotion. */
export const TRIAL_DAYS = 30;

/**
 * What the payment processor takes on a disbursement (ZainCash / Qi Card).
 * Placeholder until the merchant agreements are signed — expect 1–2.5%. This
 * comes out of *our* commission, not out of the pharmacist's payout, so our real
 * net sits below 10% and admin reporting has to show it.
 */
export const PROCESSOR_FEE_RATE = 0.02;

/** IQD is transacted in whole dinars; no subunit is in practical circulation. */
const roundIQD = (amount: number): number => Math.round(amount);

export interface FeeInput {
  /** The pharmacist's agreed rate for the shift, in IQD. */
  grossAmount: number;
  /** Is the *pharmacy* still inside its own 30-day trial? */
  pharmacyInTrial: boolean;
  /** Is the *pharmacist* still inside their own 30-day trial? */
  pharmacistInTrial: boolean;
}

export interface FeeBreakdown {
  /** The pharmacist's agreed rate — the number both sides negotiated. */
  grossAmount: number;
  /** Added on top; what the pharmacy is actually charged beyond the rate. */
  pharmacyFee: number;
  /** Deducted from the payout. */
  pharmacistFee: number;
  /** Total the pharmacy pays. */
  pharmacyCharge: number;
  /** What lands in the pharmacist's wallet. */
  pharmacistNet: number;
  /** Our commission before the processor takes its cut. */
  platformGross: number;
  /** What the processor takes on the disbursement. */
  processorFee: number;
  /** What we actually keep. */
  platformNet: number;
  /** True when the floor raised the commission above the percentage. */
  floorApplied: boolean;
}

/**
 * The two trials are independent, because they run from two different signup
 * dates. A pharmacy in its first week can post a shift that a long-established
 * pharmacist takes: the pharmacy pays no fee, the pharmacist still pays their 3%.
 *
 * The floor is computed on the full commission and then the trial side is zeroed,
 * rather than loading one side with the other's waived share — a pharmacist should
 * never pay more because the pharmacy happens to be new.
 */
export function calculateFees({
  grossAmount,
  pharmacyInTrial,
  pharmacistInTrial,
}: FeeInput): FeeBreakdown {
  if (!Number.isFinite(grossAmount) || grossAmount < 0) {
    throw new Error(`Invalid gross amount: ${grossAmount}`);
  }

  const percentageCommission = grossAmount * TOTAL_COMMISSION_RATE;
  const floorApplied = grossAmount > 0 && percentageCommission < MINIMUM_COMMISSION_IQD;
  const chargeableCommission = grossAmount === 0
    ? 0
    : Math.max(percentageCommission, MINIMUM_COMMISSION_IQD);

  const fullPharmacyFee = roundIQD(chargeableCommission * PHARMACY_SHARE_OF_COMMISSION);
  // Derived by subtraction so the two sides always reconcile to the commission
  // exactly — rounding each independently can lose or invent a dinar.
  const fullPharmacistFee = roundIQD(chargeableCommission) - fullPharmacyFee;

  const pharmacyFee = pharmacyInTrial ? 0 : fullPharmacyFee;
  const pharmacistFee = pharmacistInTrial ? 0 : fullPharmacistFee;

  const platformGross = pharmacyFee + pharmacistFee;
  const pharmacistNet = grossAmount - pharmacistFee;
  const processorFee = roundIQD(pharmacistNet * PROCESSOR_FEE_RATE);

  return {
    grossAmount,
    pharmacyFee,
    pharmacistFee,
    pharmacyCharge: grossAmount + pharmacyFee,
    pharmacistNet,
    platformGross,
    processorFee,
    platformNet: platformGross - processorFee,
    floorApplied: floorApplied && !(pharmacyInTrial && pharmacistInTrial),
  };
}

/** Whether an account signed up on `signupDate` is still inside its free trial. */
export function isInTrial(signupDate: Date, now: Date = new Date()): boolean {
  return trialDaysRemaining(signupDate, now) > 0;
}

/** Whole days of trial left; 0 once expired. Drives the countdown banner. */
export function trialDaysRemaining(signupDate: Date, now: Date = new Date()): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const elapsedDays = Math.floor((now.getTime() - signupDate.getTime()) / msPerDay);
  return Math.max(0, TRIAL_DAYS - elapsedDays);
}
