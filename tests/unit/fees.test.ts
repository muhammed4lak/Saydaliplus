import { describe, expect, it } from 'vitest';
import {
  MINIMUM_COMMISSION_IQD,
  TRIAL_DAYS,
  calculateFees,
  isInTrial,
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
