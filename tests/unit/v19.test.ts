import { describe, expect, it } from 'vitest';
// v0.0019: the late and absent days the history carries on purpose, what
// share of sales carried an antibiotic, and the incidents — of which the CRM
// holds only how many.
import { HISTORY_ABSENT, HISTORY_AUTO, HISTORY_DAYS, HISTORY_LATE, HISTORY_TEAMS, historyFor } from '../../data/history.mjs';
import { INCIDENT_KINDS, INCIDENT_SEED, incidentCounts } from '../../data/incidents.mjs';

const extra = { late: HISTORY_LATE, absent: HISTORY_ABSENT, abx: 0.14, ctl: 0.03 };
const scheduled = (ph: string, mail: string, nowMs: number) => {
  const p = HISTORY_TEAMS[ph]!.find((x) => x.email === mail)!;
  const today = new Date(nowMs); today.setHours(0, 0, 0, 0);
  const out: string[] = [];
  for (let j = 1; j <= HISTORY_DAYS; j++) {
    const d = new Date(today); d.setDate(d.getDate() - j);
    if (p.days.includes(d.getDay())) out.push(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'));
  }
  return out;                                                // most recent first
};
const dayOf = (iso: string) => { const d = new Date(iso); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };

describe('late and absent days (v0.0019)', () => {
  // Every day of the week, so a seeded day never lands on a day off.
  const week: number[] = [0, 1, 2, 3, 4, 5, 6].map((k) => new Date(2026, 8, 27 + k, 10).getTime());

  it('an absence is a scheduled day with no shift, and never leave, whatever today is', () => {
    for (const now of week) {
      const h = historyFor(HISTORY_TEAMS, HISTORY_AUTO, HISTORY_DAYS, now, extra);
      for (const a of HISTORY_ABSENT) {
        const day = scheduled(a.pharmacy, a.email, now)[a.shiftsAgo - 1];
        expect(h.shifts.some((s) => s.pharmacy === a.pharmacy && s.email === a.email && dayOf(s.in) === day)).toBe(false);
        expect(h.off.some((o) => o.pharmacy === a.pharmacy && o.email === a.email && o.day === day)).toBe(false);
      }
    }
  });

  it('a late day checks in exactly that many minutes after the start, whatever today is', () => {
    for (const now of week) {
      const h = historyFor(HISTORY_TEAMS, HISTORY_AUTO, HISTORY_DAYS, now, extra);
      for (const a of HISTORY_LATE) {
        const day = scheduled(a.pharmacy, a.email, now)[a.shiftsAgo - 1];
        const sh = h.shifts.find((s) => s.pharmacy === a.pharmacy && s.email === a.email && dayOf(s.in) === day)!;
        const [hh = 0, mm = 0] = sh.sched.start.split(':').map(Number);
        const start = new Date(sh.in); start.setHours(hh, mm, 0, 0);
        expect(Math.round((new Date(sh.in).getTime() - start.getTime()) / 6e4)).toBe(a.minutes);
      }
    }
  });

  it('marks which sales carried an antibiotic without moving any other figure', () => {
    const now = week[2]!;
    const plain = historyFor(HISTORY_TEAMS, HISTORY_AUTO, HISTORY_DAYS, now);
    const withExtra = historyFor(HISTORY_TEAMS, HISTORY_AUTO, HISTORY_DAYS, now, { abx: 0.5 });
    expect(withExtra.sales.map((s) => [s.id, s.total, s.at])).toEqual(plain.sales.map((s) => [s.id, s.total, s.at]));
    const share = withExtra.sales.filter((s) => s.abx).length / withExtra.sales.length;
    expect(share).toBeGreaterThan(0.2);
  });
});

describe('incidents (v0.0019)', () => {
  it('are never about the person reporting, always of a known kind, in both languages', () => {
    for (const x of INCIDENT_SEED) {
      expect(x.about).not.toBe(x.by);
      expect(INCIDENT_KINDS).toContain(x.kind);
      expect(x.text.en && x.text.ar).toBeTruthy();
    }
  });

  it('reach the CRM only as a number per pharmacy', () => {
    const c = incidentCounts(INCIDENT_SEED);
    expect(c).toEqual({ P1: 2, P8: 1 });
    expect(Object.values(c).every((n) => typeof n === 'number')).toBe(true);
  });
});
