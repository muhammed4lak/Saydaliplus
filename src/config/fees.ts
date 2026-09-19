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

/* ==========================================================================
   PLANS (W14)

   A plan replaces the PHARMACY's 7%, never the pharmacist's 3%. The pharmacist
   pays 3% whether or not their pharmacy subscribes, which keeps the one rule
   the supply side can hold in their head and keeps per-shift revenue growing
   with volume even on a flat fee.

   Each plan includes a SHIFT ALLOWANCE, and ordinary commission applies beyond
   it. Without the allowance, unlimited posting on the cheaper plan is a hole:
   at twenty shifts a month a subscribed pharmacy would cost us ~47,000 IQD
   against commission, and at forty, ~103,000 — a chain would find that in a
   week. With it, a forty-shift pharmacy still saves and we still earn.

   Break-even against commission, at a 40,000 IQD shift: 3.2 shifts on Basic,
   6.8 on Premium. Basic is therefore cheaper than commission at the expected
   four shifts a month and needs no argument made to a pharmacy. Premium is
   sold on what it includes, never on price.
   ========================================================================== */

export type PlanId = 'commission' | 'basic' | 'premium';

export interface Plan {
  id: PlanId;
  /** Monthly fee in IQD. Zero for pay-as-you-go. */
  monthlyFeeIQD: number;
  /** Shifts covered by the fee each month; commission applies beyond it. */
  includedShifts: number;
}

export const PLANS: Record<PlanId, Plan> = {
  commission: { id: 'commission', monthlyFeeIQD: 0,      includedShifts: 0 },
  basic:      { id: 'basic',      monthlyFeeIQD: 9_000,  includedShifts: 5 },
  premium:    { id: 'premium',    monthlyFeeIQD: 19_000, includedShifts: 12 },
};

/** IQD is transacted in whole dinars; no subunit is in practical circulation. */
const roundIQD = (amount: number): number => Math.round(amount);

export interface FeeInput {
  /** The pharmacist's agreed rate for the shift, in IQD. */
  grossAmount: number;
  /** Is the *pharmacy* still inside its own 30-day trial? */
  pharmacyInTrial: boolean;
  /** Is the *pharmacist* still inside their own 30-day trial? */
  pharmacistInTrial: boolean;
  /** The pharmacy's plan. Absent means pay-as-you-go. */
  plan?: PlanId;
  /**
   * Shifts this pharmacy has already had filled in the current billing month,
   * NOT counting this one. Only read when a plan carries an allowance — the
   * caller owns the month boundary, because the fee engine has no clock.
   *
   * For a chain this is the count across the WHOLE GROUP, because the allowance
   * is pooled. See `subscriptionCharge`.
   */
  shiftsFilledThisMonth?: number;
  /**
   * How many branches the plan is bought for (W7). One for an independent
   * pharmacy, which is the default. The allowance scales with it, so a
   * four-branch chain on Basic gets twenty shifts to spend wherever it likes
   * rather than five per branch.
   */
  branches?: number;
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
  /**
   * Set when a plan's allowance covered this shift, so a charge row can say
   * WHY the pharmacy fee was zero. A zero with no reason is indistinguishable
   * from a bug six months later.
   */
  coveredByPlan: PlanId | null;
}

/**
 * The two trials are independent, because they run from two different signup
 * dates. A pharmacy in its first week can post a shift that a long-established
 * pharmacist takes: the pharmacy pays no fee, the pharmacist still pays their 3%.
 *
 * The floor is computed on the full commission and then the trial side is zeroed,
 * rather than loading one side with the other's waived share — a pharmacist should
 * never pay more because the pharmacy happens to be new.
 *
 * The floor's excess falls entirely on the pharmacy. The pharmacist's fee is
 * always exactly 3% of the shift value — the floor never touches it. Splitting
 * the floor 70/30 like an ordinary commission would have cost the pharmacist 750
 * on a 20,000 IQD shift instead of 600: the same 150 dinars is 0.7% of what the
 * pharmacy is charged and 25% of what the pharmacist is deducted, so the side
 * that barely notices it should carry it. It is also the pharmacy that creates
 * the cost the floor exists to cover, by posting a shift too small to pay for
 * its own processing.
 *
 * The rule this buys is one sentence — the pharmacist pays 3%, always — which is
 * worth more to a market we are asking to trust us than the 150 dinars is.
 */
export function calculateFees({
  grossAmount,
  pharmacyInTrial,
  pharmacistInTrial,
  plan = 'commission',
  shiftsFilledThisMonth = 0,
  branches = 1,
}: FeeInput): FeeBreakdown {
  if (!Number.isFinite(grossAmount) || grossAmount < 0) {
    throw new Error(`Invalid gross amount: ${grossAmount}`);
  }

  const percentageCommission = grossAmount * TOTAL_COMMISSION_RATE;
  const floorApplied = grossAmount > 0 && percentageCommission < MINIMUM_COMMISSION_IQD;
  const chargeableCommission = grossAmount === 0
    ? 0
    : Math.max(percentageCommission, MINIMUM_COMMISSION_IQD);

  // The pharmacist's share is taken off the *percentage*, never off the floored
  // commission, so a floored shift costs them exactly what an unfloored one
  // would. On a shift above the floor the two are identical and this is an
  // ordinary 70/30 split.
  const fullPharmacistFee = roundIQD(
    grossAmount * TOTAL_COMMISSION_RATE * PHARMACIST_SHARE_OF_COMMISSION,
  );
  // Derived by subtraction so the two sides always reconcile to the commission
  // exactly — rounding each independently can lose or invent a dinar. The floor's
  // whole excess lands here, on the pharmacy.
  const fullPharmacyFee = roundIQD(chargeableCommission) - fullPharmacistFee;

  // A plan covers this shift only while the allowance lasts. Beyond it the
  // pharmacy pays ordinary commission, which is what stops a chain subscribing
  // to the cheapest plan and posting forty shifts against it.
  const chosen = PLANS[plan] ?? PLANS.commission;
  // The trial wins over the allowance. A pharmacy in its first 30 days pays
  // nothing whatever plan it holds, and the allowance is NOT spent on a shift
  // the trial already covered — otherwise a pharmacy that subscribed on day one
  // would reach its second month with the allowance quietly eaten.
  const withinAllowance = !pharmacyInTrial
    && chosen.monthlyFeeIQD > 0
    && shiftsFilledThisMonth < chosen.includedShifts * billableBranches(branches);
  const coveredByPlan = withinAllowance ? chosen.id : null;

  const pharmacyFee = (pharmacyInTrial || withinAllowance) ? 0 : fullPharmacyFee;
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
    coveredByPlan,
  };
}

/* ==========================================================================
   CHAINS (W7)

   A chain is not a bigger pharmacy, it is several pharmacies. Each branch holds
   its own licence and its own responsible pharmacist — that is Iraqi law and it
   is why the one-pharmacist-one-pharmacy link from W1 is untouched here. What a
   chain adds is a GROUP over branches and one bill instead of nine.

   Two decisions are baked in below, and both are load-bearing:

   1. **Price per branch.** The cost driver is branches, not companies: nine
      branches post nine branches' worth of shifts and take nine branches' worth
      of support. A flat chain price is the same hole the shift allowance closed
      in W14, one level up — one Basic subscription covering twelve branches
      would cost us roughly 100,000 IQD a month against commission.

   2. **Pool the allowance.** The shifts a chain is owed are the sum of its
      branches', spendable anywhere. This costs nothing against per-branch
      allowances — the total is identical — and it is the whole reason a chain
      buys: branches are uneven, and an allowance stranded at a quiet branch
      while a busy one pays commission is a bill they will argue about monthly.

   Volume discounts are deliberately NOT here. A rate card belongs in code; a
   negotiated discount for a particular chain belongs in the CRM as data on that
   chain, where an operator can see who was given what and why.
   ========================================================================== */

/** At least one. A group with no branches is a data error, not a free plan. */
const billableBranches = (branches: number): number =>
  Number.isFinite(branches) && branches > 1 ? Math.floor(branches) : 1;

export interface SubscriptionCharge {
  plan: PlanId;
  /** Branches actually charged for. */
  branches: number;
  /** Fee per branch per month. */
  perBranchIQD: number;
  /** What the chain is invoiced monthly — one invoice, not one per branch. */
  monthlyFeeIQD: number;
  /** Shifts the fee covers across the whole group, spendable at any branch. */
  includedShifts: number;
}

/**
 * What a pharmacy or a chain is charged monthly, and what that buys.
 *
 * Called with no `branches` for an independent pharmacy, which is the ordinary
 * case and returns exactly the plan's own numbers.
 */
export function subscriptionCharge(
  plan: PlanId = 'commission',
  branches = 1,
): SubscriptionCharge {
  const chosen = PLANS[plan] ?? PLANS.commission;
  const n = billableBranches(branches);
  return {
    plan: chosen.id,
    branches: n,
    perBranchIQD: chosen.monthlyFeeIQD,
    monthlyFeeIQD: chosen.monthlyFeeIQD * n,
    includedShifts: chosen.includedShifts * n,
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
