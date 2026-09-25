import { describe, expect, it } from 'vitest';
import {
  MINIMUM_COMMISSION_IQD,
  PLANS,
  TRIAL_DAYS,
  calculateFees,
  isInTrial,
  subscriptionCharge,
  trialDaysRemaining,
} from '@/config/fees';

const noTrial = { pharmacyInTrial: false, pharmacistInTrial: false };

describe('calculateFees', () => {
  it('matches the worked example from the spec', () => {
    // 40,000 IQD shift: pharmacy charged 42,800, pharmacist receives 38,800,
    // platform revenue 4,000.
    const fees = calculateFees({ grossAmount: 40_000, ...noTrial });

    expect(fees.pharmacyCharge).toBe(42_800);
    expect(fees.pharmacistNet).toBe(38_800);
    expect(fees.platformGross).toBe(4_000);
    expect(fees.pharmacyFee).toBe(2_800);
    expect(fees.pharmacistFee).toBe(1_200);
  });

  it('splits the commission 70/30 between the two sides', () => {
    const fees = calculateFees({ grossAmount: 60_000, ...noTrial });
    expect(fees.pharmacyFee).toBe(4_200); // 7%
    expect(fees.pharmacistFee).toBe(1_800); // 3%
    expect(fees.pharmacyFee + fees.pharmacistFee).toBe(6_000); // 10% total
  });

  it('always reconciles: the two fees sum to the commission exactly', () => {
    // Amounts chosen to force rounding in the 70/30 split.
    for (const grossAmount of [33_333, 41_111, 27_777, 55_555, 12_345]) {
      const fees = calculateFees({ grossAmount, ...noTrial });
      expect(fees.pharmacyFee + fees.pharmacistFee).toBe(fees.platformGross);
      expect(fees.pharmacyCharge - fees.pharmacistNet).toBe(fees.platformGross);
    }
  });

  describe('minimum fee floor', () => {
    it('raises the commission on a short shift', () => {
      // 20,000 shift: 10% is 2,000, below the 2,500 floor.
      const fees = calculateFees({ grossAmount: 20_000, ...noTrial });

      expect(fees.floorApplied).toBe(true);
      expect(fees.platformGross).toBe(MINIMUM_COMMISSION_IQD);
      // The whole 500 IQD top-up lands on the pharmacy: 1,400 + 500.
      expect(fees.pharmacyFee).toBe(1_900);
      expect(fees.pharmacistFee).toBe(600);
    });

    it('never charges the pharmacist more than 3%, floored or not', () => {
      // The rule the floor must not break, at every shift value either side of
      // it. Stated as one sentence to a pharmacist: you pay 3%, always.
      for (const gross of [5_000, 12_500, 20_000, 24_999, 25_000, 40_000, 90_000]) {
        const fees = calculateFees({ grossAmount: gross, ...noTrial });
        expect(fees.pharmacistFee).toBe(Math.round(gross * 0.03));
      }
    });

    it('leaves the pharmacist untouched when only the pharmacy is in trial', () => {
      // A floored shift where the pharmacy pays nothing collects only the
      // pharmacist's 3% — the floor is a pharmacy-side charge, so a pharmacy
      // inside its trial does not pay it and it is not moved across.
      const fees = calculateFees({
        grossAmount: 20_000,
        pharmacyInTrial: true,
        pharmacistInTrial: false,
      });
      expect(fees.pharmacyFee).toBe(0);
      expect(fees.pharmacistFee).toBe(600);
    });

    it('still reaches the floor when only the pharmacist is in trial', () => {
      const fees = calculateFees({
        grossAmount: 20_000,
        pharmacyInTrial: false,
        pharmacistInTrial: true,
      });
      expect(fees.pharmacistFee).toBe(0);
      expect(fees.pharmacyFee).toBe(1_900);
    });

    it('does not apply once the percentage clears the floor', () => {
      const fees = calculateFees({ grossAmount: 25_000, ...noTrial });
      expect(fees.floorApplied).toBe(false);
      expect(fees.platformGross).toBe(2_500);
    });

    it('applies to a typical 24,000 IQD short shift', () => {
      const fees = calculateFees({ grossAmount: 24_000, ...noTrial });
      expect(fees.floorApplied).toBe(true);
      expect(fees.platformGross).toBe(2_500); // not 2,400
    });
  });

  describe('free trial', () => {
    it('charges nothing to either side when both are in trial', () => {
      const fees = calculateFees({
        grossAmount: 40_000,
        pharmacyInTrial: true,
        pharmacistInTrial: true,
      });

      expect(fees.pharmacyCharge).toBe(40_000);
      expect(fees.pharmacistNet).toBe(40_000);
      expect(fees.platformGross).toBe(0);
    });

    it('waives only the trialling side, since the trials run independently', () => {
      // A new pharmacy posting a shift an established pharmacist takes.
      const fees = calculateFees({
        grossAmount: 40_000,
        pharmacyInTrial: true,
        pharmacistInTrial: false,
      });

      expect(fees.pharmacyFee).toBe(0);
      expect(fees.pharmacistFee).toBe(1_200); // still pays their 3%
      expect(fees.pharmacistNet).toBe(38_800);
    });

    it('does not load one side with the other side\'s waived share', () => {
      const bothPaying = calculateFees({ grossAmount: 40_000, ...noTrial });
      const pharmacistOnly = calculateFees({
        grossAmount: 40_000,
        pharmacyInTrial: true,
        pharmacistInTrial: false,
      });

      expect(pharmacistOnly.pharmacistFee).toBe(bothPaying.pharmacistFee);
    });
  });

  describe('processor fee', () => {
    it('comes out of our commission, not the pharmacist payout', () => {
      const fees = calculateFees({ grossAmount: 40_000, ...noTrial });

      expect(fees.pharmacistNet).toBe(38_800); // unchanged by the processor
      expect(fees.processorFee).toBe(776); // 2% of the disbursement
      expect(fees.platformNet).toBe(fees.platformGross - fees.processorFee);
      expect(fees.platformNet).toBeLessThan(fees.platformGross);
    });
  });

  it('rejects a negative amount', () => {
    expect(() => calculateFees({ grossAmount: -1, ...noTrial })).toThrow();
  });

  it('handles a zero-value listing without inventing a floor charge', () => {
    // Internships have no rate.
    const fees = calculateFees({ grossAmount: 0, ...noTrial });
    expect(fees.platformGross).toBe(0);
    expect(fees.floorApplied).toBe(false);
  });
});

describe('trial window', () => {
  const signup = new Date('2026-01-01T00:00:00Z');

  it('is active on the signup day', () => {
    expect(isInTrial(signup, new Date('2026-01-01T10:00:00Z'))).toBe(true);
    expect(trialDaysRemaining(signup, new Date('2026-01-01T10:00:00Z'))).toBe(TRIAL_DAYS);
  });

  it('is still active on the last day', () => {
    expect(isInTrial(signup, new Date('2026-01-30T23:00:00Z'))).toBe(true);
  });

  it('has expired 30 days later', () => {
    expect(isInTrial(signup, new Date('2026-01-31T00:00:00Z'))).toBe(false);
    expect(trialDaysRemaining(signup, new Date('2026-01-31T00:00:00Z'))).toBe(0);
  });

  it('counts from each account\'s own signup date, not a launch date', () => {
    const laterSignup = new Date('2026-06-01T00:00:00Z');
    const now = new Date('2026-06-10T00:00:00Z');

    expect(isInTrial(signup, now)).toBe(false);
    expect(isInTrial(laterSignup, now)).toBe(true);
  });
});

/* ==========================================================================
   PLANS AND THE SHIFT ALLOWANCE (W14)
   ========================================================================== */

describe('plans', () => {
  const shift = { grossAmount: 40_000, pharmacyInTrial: false, pharmacistInTrial: false };

  it('leaves the pharmacist paying 3% on every plan', () => {
    for (const plan of ['commission', 'basic', 'premium'] as const) {
      const fees = calculateFees({ ...shift, plan, shiftsFilledThisMonth: 0 });
      expect(fees.pharmacistFee).toBe(1_200);
    }
  });

  it('covers the pharmacy fee while the allowance lasts', () => {
    const fees = calculateFees({ ...shift, plan: 'basic', shiftsFilledThisMonth: 4 });
    expect(fees.pharmacyFee).toBe(0);
    expect(fees.coveredByPlan).toBe('basic');
  });

  it('charges ordinary commission once the allowance is spent', () => {
    // Basic includes 5. The sixth shift (index 5) is chargeable.
    const fees = calculateFees({ ...shift, plan: 'basic', shiftsFilledThisMonth: 5 });
    expect(fees.pharmacyFee).toBe(2_800);
    expect(fees.coveredByPlan).toBeNull();
  });

  it('gives premium the larger allowance', () => {
    expect(calculateFees({ ...shift, plan: 'premium', shiftsFilledThisMonth: 11 }).pharmacyFee).toBe(0);
    expect(calculateFees({ ...shift, plan: 'premium', shiftsFilledThisMonth: 12 }).pharmacyFee).toBe(2_800);
  });

  it('records why a fee was zero, so a charge row can say so', () => {
    // Two different reasons for the same zero — a charge row has to tell them apart.
    const byPlan = calculateFees({ ...shift, plan: 'basic', shiftsFilledThisMonth: 0 });
    const byTrial = calculateFees({ ...shift, pharmacyInTrial: true });
    expect(byPlan.pharmacyFee).toBe(0);
    expect(byTrial.pharmacyFee).toBe(0);
    expect(byPlan.coveredByPlan).toBe('basic');
    expect(byTrial.coveredByPlan).toBeNull();
  });

  it('does not spend the allowance on a shift the trial already covered', () => {
    const fees = calculateFees({ ...shift, pharmacyInTrial: true, plan: 'basic', shiftsFilledThisMonth: 0 });
    expect(fees.pharmacyFee).toBe(0);
    expect(fees.coveredByPlan).toBeNull();
  });

  it('defaults to pay-as-you-go when no plan is named', () => {
    expect(calculateFees(shift).pharmacyFee).toBe(2_800);
    expect(calculateFees(shift).coveredByPlan).toBeNull();
  });

  /* The arithmetic the price was chosen on. If these move, the pricing
     conversation in BACKLOG W14 has to happen again. */
  it('breaks even against commission where the backlog says it does', () => {
    const perShift = calculateFees(shift).pharmacyFee;   // 2,800
    expect(Math.round((PLANS.basic.monthlyFeeIQD / perShift) * 10) / 10).toBe(3.2);
    expect(Math.round((PLANS.premium.monthlyFeeIQD / perShift) * 10) / 10).toBe(6.8);
  });

  it('closes the unlimited-posting hole', () => {
    // Forty shifts on Basic: five covered, thirty-five at ordinary commission.
    let pharmacy = PLANS.basic.monthlyFeeIQD;
    for (let i = 0; i < 40; i++) {
      pharmacy += calculateFees({ ...shift, plan: 'basic', shiftsFilledThisMonth: i }).pharmacyFee;
    }
    const onCommission = 40 * 2_800;
    expect(pharmacy).toBe(107_000);
    // The pharmacy still saves, and we are not giving the shifts away.
    expect(pharmacy).toBeLessThan(onCommission);
    expect(pharmacy).toBeGreaterThan(onCommission * 0.9);
  });
});

/* ==========================================================================
   OWNERS OF SEVERAL PHARMACIES (W7)

   Two rules, and both exist because of a hole. Price per pharmacy, or one
   Basic covers twelve pharmacies. Share the allowance, or an owner argues
   every month about the five shifts stranded at their quiet pharmacy.
   ========================================================================== */
describe('subscriptionCharge', () => {
  it('charges the ordinary one-pharmacy owner exactly the plan', () => {
    const c = subscriptionCharge('basic');
    expect(c.monthlyFeeIQD).toBe(9_000);
    expect(c.includedShifts).toBe(5);
    expect(c.pharmacies).toBe(1);
  });

  it('charges an owner of several per pharmacy, on one invoice', () => {
    const c = subscriptionCharge('basic', 4);
    expect(c.perPharmacyIQD).toBe(9_000);
    expect(c.monthlyFeeIQD).toBe(36_000);
    expect(c.includedShifts).toBe(20);
  });

  it('never bills less than one pharmacy', () => {
    for (const n of [0, -3, Number.NaN, 0.4]) {
      expect(subscriptionCharge('premium', n).pharmacies).toBe(1);
    }
  });

  it('pays-as-you-go for free, however many pharmacies', () => {
    expect(subscriptionCharge('commission', 9).monthlyFeeIQD).toBe(0);
    expect(subscriptionCharge('commission', 9).includedShifts).toBe(0);
  });
});

describe('an owner’s shared allowance', () => {
  const shift = { grossAmount: 40_000, pharmacyInTrial: false, pharmacistInTrial: false };

  it('spends the whole allowance at one busy pharmacy', () => {
    // Four pharmacies on Basic: twenty covered shifts, wherever they happen.
    const nineteenth = calculateFees({ ...shift, plan: 'basic', pharmacies: 4, shiftsFilledThisMonth: 19 });
    const twentyfirst = calculateFees({ ...shift, plan: 'basic', pharmacies: 4, shiftsFilledThisMonth: 20 });
    expect(nineteenth.coveredByPlan).toBe('basic');
    expect(nineteenth.pharmacyFee).toBe(0);
    expect(twentyfirst.coveredByPlan).toBeNull();
    expect(twentyfirst.pharmacyFee).toBe(2_800);
  });

  it('costs us the same as separate allowances would', () => {
    let shared = subscriptionCharge('basic', 4).monthlyFeeIQD;
    for (let i = 0; i < 20; i++) {
      shared += calculateFees({ ...shift, plan: 'basic', pharmacies: 4, shiftsFilledThisMonth: i }).pharmacyFee;
    }
    expect(shared).toBe(36_000);
  });

  it('closes the hole one flat per-owner price would open', () => {
    const pharmacies = 12;
    let charged = subscriptionCharge('basic', pharmacies).monthlyFeeIQD;
    for (let i = 0; i < 60; i++) {
      charged += calculateFees({ ...shift, plan: 'basic', pharmacies, shiftsFilledThisMonth: i }).pharmacyFee;
    }
    expect(charged).toBe(108_000);
    expect(charged).toBeLessThan(60 * 2_800);       // the owner still saves
    expect(charged).toBeGreaterThan(9_000 + 2_800); // and we are not giving it away
  });

  it('still lets the trial win, at every pharmacy', () => {
    const fees = calculateFees({ ...shift, pharmacyInTrial: true, plan: 'basic', pharmacies: 6, shiftsFilledThisMonth: 0 });
    expect(fees.pharmacyFee).toBe(0);
    expect(fees.coveredByPlan).toBeNull();
  });
});
