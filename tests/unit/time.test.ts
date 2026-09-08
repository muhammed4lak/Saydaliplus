import { describe, expect, it } from 'vitest';
import { hoursBetween, resolveShiftWindow, shiftHours } from '@/lib/time';

describe('shiftHours', () => {
  it('handles an ordinary daytime shift', () => {
    expect(shiftHours('08:00', '16:00')).toBe(8);
  });

  it('handles a shift crossing midnight', () => {
    // The case the spec calls out: 8 hours, not -16.
    expect(shiftHours('22:00', '06:00')).toBe(8);
  });

  it('handles a late evening shift ending after midnight', () => {
    expect(shiftHours('18:00', '01:30')).toBe(7.5);
  });

  it('treats identical start and end as a full 24 hours', () => {
    expect(shiftHours('08:00', '08:00')).toBe(24);
  });

  it('handles half hours', () => {
    expect(shiftHours('09:15', '17:45')).toBe(8.5);
  });

  it('rejects malformed times', () => {
    expect(() => shiftHours('25:00', '10:00')).toThrow();
    expect(() => shiftHours('8am', '4pm')).toThrow();
    expect(() => shiftHours('08:70', '10:00')).toThrow();
  });
});

describe('resolveShiftWindow', () => {
  it('rolls the end date forward when the shift crosses midnight', () => {
    const { startsAt, endsAt } = resolveShiftWindow('2026-07-10', '22:00', '06:00');

    expect(hoursBetween(startsAt, endsAt)).toBe(8);
    expect(endsAt.getDate()).toBe(11);
  });

  it('keeps a daytime shift on one date', () => {
    const { startsAt, endsAt } = resolveShiftWindow('2026-07-10', '08:00', '16:00');

    expect(hoursBetween(startsAt, endsAt)).toBe(8);
    expect(endsAt.getDate()).toBe(10);
  });
});

describe('hoursBetween', () => {
  it('rejects an end that precedes the start', () => {
    expect(() =>
      hoursBetween(new Date('2026-07-10T16:00:00'), new Date('2026-07-10T08:00:00')),
    ).toThrow();
  });
});
