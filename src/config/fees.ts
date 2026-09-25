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
   against commission, and at forty, ~103,000 — an owner of several would find it in a
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
   * For an owner of several pharmacies this is the count across ALL of them,
   * because the allowance is shared. See `subscriptionCharge`.
   */
  shiftsFilledThisMonth?: number;
  /**
   * How many pharmacies the owner's plan covers (W7). One is the default and
   * the ordinary case. The allowance scales with it, so an owner of four on
   * Basic gets twenty shifts to spend wherever they like rather than five each.
   */
  pharmacies?: number;
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
  pharmacies = 1,
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
  // pharmacy pays ordinary commission, which is what stops an owner subscribing
  // to the cheapest plan and posting forty shifts against it.
  const chosen = PLANS[plan] ?? PLANS.commission;
  // The trial wins over the allowance. A pharmacy in its first 30 days pays
  // nothing whatever plan it holds, and the allowance is NOT spent on a shift
  // the trial already covered — otherwise a pharmacy that subscribed on day one
  // would reach its second month with the allowance quietly eaten.
  const withinAllowance = !pharmacyInTrial
    && chosen.monthlyFeeIQD > 0
    && shiftsFilledThisMonth < chosen.includedShifts * billablePharmacies(pharmacies);
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
   OWNERS WITH MORE THAN ONE PHARMACY (W7, revised 25 Sep 2026)

   Iraq has no pharmacy chains, but some pharmacists own several pharmacies.
   Each pharmacy keeps its own licence and its own responsible pharmacist; what
   several have in common is their OWNER, who pays one bill for all of them.

   Two decisions are baked in below, and both are load-bearing:

   1. **Priced per pharmacy.** The cost driver is pharmacies, not owners: four
      pharmacies post four pharmacies' worth of shifts and take four
      pharmacies' worth of support. A flat per-owner price is the same hole the
      shift allowance closed in W14, one level up.

   2. **The allowance is shared.** The shifts an owner is owed are the sum of
      their pharmacies', spendable at any of them. This costs nothing against
      separate allowances — the total is identical — and it is the reason an
      owner of several buys: pharmacies are uneven, and an allowance stranded at
      a quiet one while a busy one pays commission is a bill argued about monthly.

   Volume discounts are deliberately NOT here. A rate card belongs in code; a
   discount negotiated with a particular owner belongs in the CRM as data.
   ========================================================================== */

/** At least one. An owner with no pharmacies is a data error, not a free plan. */
const billablePharmacies = (pharmacies: number): number =>
  Number.isFinite(pharmacies) && pharmacies > 1 ? Math.floor(pharmacies) : 1;

export interface SubscriptionCharge {
  plan: PlanId;
  /** Pharmacies actually charged for. */
  pharmacies: number;
  /** Fee per pharmacy per month. */
  perPharmacyIQD: number;
  /** What the owner is invoiced monthly — one invoice, not one per pharmacy. */
  monthlyFeeIQD: number;
  /** Shifts the fee covers across all the owner's pharmacies, spendable at any. */
  includedShifts: number;
}

/**
 * What an owner is charged monthly, and what that buys.
 *
 * Called with no count for the ordinary case — one pharmacy — and returns
 * exactly the plan's own numbers.
 */
export function subscriptionCharge(
  plan: PlanId = 'commission',
  pharmacies = 1,
): SubscriptionCharge {
  const chosen = PLANS[plan] ?? PLANS.commission;
  const n = billablePharmacies(pharmacies);
  return {
    plan: chosen.id,
    pharmacies: n,
    perPharmacyIQD: chosen.monthlyFeeIQD,
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
