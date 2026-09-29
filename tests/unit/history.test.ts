import { describe, expect, it } from 'vitest';
// The attendance history both prototypes embed (v0.0017): the app's Reports
// and the figures an owner shares with the CRM are computed from it, so it has
// to be the same history whoever asks, and consistent with itself.
import { HISTORY_AUTO, HISTORY_DAYS, HISTORY_TEAMS, REPORTS_SHARED, SHIFT_GRACE_MIN, historyFor } from '../../data/history.mjs';

const NOW = new Date('2026-09-29T10:00:00').getTime();
const h = historyFor(HISTORY_TEAMS, HISTORY_AUTO, HISTORY_DAYS, NOW);

describe('the attendance history', () => {
  it('is the same history for the same days, whatever range is asked for', () => {
    const short = historyFor(HISTORY_TEAMS, HISTORY_AUTO, 5, NOW);
    const recent = h.shifts.filter((s) => short.shifts.some((x) => x.id === s.id));
    expect(recent).toEqual(short.shifts);
    expect(h.sales.filter((s) => recent.some((x) => x.id === s.shift))).toEqual(short.sales);
  });

  it('runs to yesterday and no further: nothing today, nothing in the future', () => {
    const today = new Date(NOW); today.setHours(0, 0, 0, 0);
    expect(h.shifts.every((s) => new Date(s.in) < today)).toBe(true);
  });

  it('puts every sale inside its shift, by the person on it, at that pharmacy', () => {
    const byId = new Map(h.shifts.map((s) => [s.id, s]));
    for (const sale of h.sales) {
      const sh = byId.get(sale.shift)!;
      expect(sale.by).toBe(sh.email);
      expect(sale.pharmacy).toBe(sh.pharmacy);
      expect(sale.at >= sh.in && sale.at <= (sh.autoAt ?? sh.out)).toBe(true);
      expect(sale.total % 250).toBe(0);
    }
  });

  it('has a shift only on a day the person is scheduled', () => {
    for (const s of h.shifts) {
      const person = (HISTORY_TEAMS[s.pharmacy] ?? []).find((p) => p.email === s.email)!;
      const sched = new Date(s.in); sched.setHours(Number(person.start.slice(0, 2)), Number(person.start.slice(3)), 0, 0);
      expect(person.days).toContain(sched.getDay());
    }
  });

  it('closes a forgotten shift at the scheduled end, and not before the grace period is over', () => {
    const auto = h.shifts.filter((s) => s.state === 'auto');
    expect(auto).toHaveLength(HISTORY_AUTO.length);
    for (const s of auto) {
      const end = new Date(s.out);
      expect(`${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`).toBe(s.sched.end);
      expect(new Date(s.autoAt!).getTime() - end.getTime()).toBe(SHIFT_GRACE_MIN * 60000);
    }
  });

  it('keeps the claim and the approval as two facts, the claim first', () => {
    const approved = h.shifts.filter((s) => s.approval);
    expect(approved.length).toBeGreaterThan(0);
    for (const s of approved) {
      expect(s.claim).not.toBeNull();
      expect(s.approval!.at > s.claim!.at).toBe(true);
      expect(s.approval!.verdict).toBe(s.approval!.out === s.claim!.out ? 'accepted' : 'amended');
    }
    expect(h.shifts.some((s) => s.state === 'auto' && s.claim && !s.approval)).toBe(true);
  });

  it('shares on unless the owner turned it off (decided 28 Sep 2026)', () => {
    expect(REPORTS_SHARED).toEqual({ P9: false });
  });
});
