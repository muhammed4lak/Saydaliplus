import { describe, expect, it } from 'vitest';
import { classifyCancellation, isNoShow, reliabilityPercent } from '@/lib/reliability';

const shiftStart = new Date('2026-07-10T08:00:00Z');
const hoursBefore = (hours: number) =>
  new Date(shiftStart.getTime() - hours * 3_600_000);

describe('classifyCancellation', () => {
  it('is free with a week of notice', () => {
    expect(classifyCancellation(shiftStart, hoursBefore(168))).toBe('free');
  });

  it('is free at exactly the 48-hour boundary', () => {
    expect(classifyCancellation(shiftStart, hoursBefore(48))).toBe('free');
  });

  it('is late just inside 48 hours', () => {
    expect(classifyCancellation(shiftStart, hoursBefore(47))).toBe('late');
  });

  it('is late down to the 2-hour boundary', () => {
    expect(classifyCancellation(shiftStart, hoursBefore(2))).toBe('late');
  });

  it('counts as a no-show inside 2 hours', () => {
    expect(classifyCancellation(shiftStart, hoursBefore(1))).toBe('no-show');
  });

  it('counts as a no-show after the shift has already started', () => {
    expect(classifyCancellation(shiftStart, hoursBefore(-1))).toBe('no-show');
  });
});

describe('isNoShow', () => {
  it('is false while inside the grace period', () => {
    const thirtyMinutesLate = new Date(shiftStart.getTime() + 30 * 60_000);
    expect(isNoShow(shiftStart, null, thirtyMinutesLate)).toBe(false);
  });

  it('is true once the grace period lapses with no handoff', () => {
    const ninetyMinutesLate = new Date(shiftStart.getTime() + 90 * 60_000);
    expect(isNoShow(shiftStart, null, ninetyMinutesLate)).toBe(true);
  });

  it('is false once the handoff has been started, however late', () => {
    const arrived = new Date(shiftStart.getTime() + 45 * 60_000);
    const muchLater = new Date(shiftStart.getTime() + 6 * 3_600_000);
    expect(isNoShow(shiftStart, arrived, muchLater)).toBe(false);
  });
});

describe('reliabilityPercent', () => {
  it('is completed over accepted', () => {
    expect(reliabilityPercent({ accepted: 20, completed: 19, freeCancellations: 0 })).toBe(95);
  });

  it('excludes cancellations made with proper notice from both sides', () => {
    // 20 accepted, 2 cancelled with a week's notice, 18 worked: that is 100%,
    // not 90% — cancelling early is not a failure.
    expect(reliabilityPercent({ accepted: 20, completed: 18, freeCancellations: 2 })).toBe(100);
  });

  it('penalises a late cancellation, which is not counted as free', () => {
    expect(reliabilityPercent({ accepted: 20, completed: 19, freeCancellations: 0 })).toBe(95);
  });

  it('reports no record rather than a perfect score for a new pharmacist', () => {
    // A pharmacy choosing between an unproven account and a 96% one must be able
    // to tell them apart.
    expect(reliabilityPercent({ accepted: 0, completed: 0, freeCancellations: 0 })).toBeNull();
  });

  it('reports no record when every booking was cancelled with notice', () => {
    expect(reliabilityPercent({ accepted: 3, completed: 0, freeCancellations: 3 })).toBeNull();
  });

  it('rounds to a whole percent', () => {
    expect(reliabilityPercent({ accepted: 3, completed: 2, freeCancellations: 0 })).toBe(67);
  });
});
