import { describe, expect, it } from 'vitest';
import {
  type LogWeek,
  allMonthsApproved,
  approveMonth,
  canApproveMonth,
  canSubmitWeek,
  initialWeeks,
  monthStatus,
  returnMonth,
  submitWeek,
  totalAttendance,
} from '@/lib/logbook';

const GOOD_TEXT =
  'Spent the week on the OTC counter learning the common brand names patients ask ' +
  'for by name, and practised asking who the medicine is actually for.';

/** Fill a week in as if the student had written it properly. */
function written(week: LogWeek, days = [true, true, true, true, true]): LogWeek {
  return { ...week, daysPresent: days, text: GOOD_TEXT };
}

/** Submit weeks 1..n in order, the way a student actually would. */
function submitThrough(weeks: LogWeek[], upTo: number): LogWeek[] {
  let current = weeks;
  for (let weekNo = 1; weekNo <= upTo; weekNo += 1) {
    current = current.map((week) => (week.weekNo === weekNo ? written(week) : week));
    current = submitWeek(current, weekNo);
  }
  return current;
}

describe('initial state', () => {
  it('opens week 1 and locks the rest', () => {
    const weeks = initialWeeks();

    expect(weeks).toHaveLength(12);
    expect(weeks[0]?.status).toBe('draft');
    expect(weeks.slice(1).every((week) => week.status === 'locked')).toBe(true);
  });
});

describe('canSubmitWeek', () => {
  it('requires at least one day of attendance', () => {
    const week = written(initialWeeks()[0]!, [false, false, false, false, false]);
    expect(canSubmitWeek(week)).toEqual({ ok: false, reason: 'no-attendance' });
  });

  it('requires a written account of at least 80 characters', () => {
    const week = { ...initialWeeks()[0]!, daysPresent: [true, true, false, false, false], text: 'Was there.' };
    expect(canSubmitWeek(week)).toEqual({ ok: false, reason: 'too-short' });
  });

  it('accepts one attended day with a real write-up', () => {
    const week = written(initialWeeks()[0]!, [true, false, false, false, false]);
    expect(canSubmitWeek(week).ok).toBe(true);
  });

  it('refuses to re-submit a locked or approved week', () => {
    const locked = written(initialWeeks()[1]!);
    expect(canSubmitWeek(locked)).toEqual({ ok: false, reason: 'not-editable' });

    const approved = { ...written(initialWeeks()[0]!), status: 'approved' as const };
    expect(canSubmitWeek(approved)).toEqual({ ok: false, reason: 'not-editable' });
  });
});

describe('forward fill', () => {
  it('unlocks the next week on submission', () => {
    const weeks = submitThrough(initialWeeks(), 1);

    expect(weeks[0]?.status).toBe('submitted');
    expect(weeks[1]?.status).toBe('draft');
    expect(weeks[2]?.status).toBe('locked');
  });

  it('cannot be back-filled all at once at the end', () => {
    const weeks = initialWeeks().map((week) => written(week));
    // Week 6 is still locked no matter how complete its content looks.
    expect(() => submitWeek(weeks, 6)).toThrow();
  });

  it('walks the whole programme forward one week at a time', () => {
    const weeks = submitThrough(initialWeeks(), 12);
    expect(weeks.every((week) => week.status === 'submitted')).toBe(true);
  });
});

describe('month approval gating', () => {
  it('cannot approve a month until all four weeks are submitted', () => {
    const weeks = submitThrough(initialWeeks(), 3);

    expect(monthStatus(weeks, 1)).toBe('active');
    expect(canApproveMonth(weeks, 1)).toBe(false);
    expect(() => approveMonth(weeks, 1)).toThrow();
  });

  it('becomes ready once the fourth week is in', () => {
    const weeks = submitThrough(initialWeeks(), 4);

    expect(monthStatus(weeks, 1)).toBe('ready');
    expect(canApproveMonth(weeks, 1)).toBe(true);
  });

  it('approves all four weeks together', () => {
    const weeks = approveMonth(submitThrough(initialWeeks(), 4), 1);

    expect(monthStatus(weeks, 1)).toBe('approved');
    expect(weeks.slice(0, 4).every((week) => week.status === 'approved')).toBe(true);
    // Month 2 is untouched and still in progress.
    expect(weeks[4]?.status).toBe('draft');
  });

  it('reports an untouched month as upcoming', () => {
    expect(monthStatus(initialWeeks(), 3)).toBe('upcoming');
  });
});

describe('returning a month', () => {
  it('sets its weeks back to draft for rewriting', () => {
    const weeks = returnMonth(submitThrough(initialWeeks(), 4), 1);

    expect(weeks.slice(0, 4).every((week) => week.status === 'draft')).toBe(true);
    expect(monthStatus(weeks, 1)).toBe('active');
  });

  it('can reopen a month that was already approved', () => {
    const approved = approveMonth(submitThrough(initialWeeks(), 4), 1);
    const returned = returnMonth(approved, 1);

    expect(monthStatus(returned, 1)).toBe('active');
  });

  it('refuses to return a month that was never submitted', () => {
    expect(() => returnMonth(initialWeeks(), 2)).toThrow();
  });
});

describe('certificate gate', () => {
  it('stays locked until all three months are approved', () => {
    let weeks = submitThrough(initialWeeks(), 12);
    expect(allMonthsApproved(weeks)).toBe(false);

    weeks = approveMonth(weeks, 1);
    weeks = approveMonth(weeks, 2);
    expect(allMonthsApproved(weeks)).toBe(false);

    weeks = approveMonth(weeks, 3);
    expect(allMonthsApproved(weeks)).toBe(true);
  });
});

describe('totalAttendance', () => {
  it('counts only weeks that have actually been submitted', () => {
    const weeks = submitThrough(initialWeeks(), 4);
    const attendance = totalAttendance(weeks);

    expect(attendance.daysPossible).toBe(20); // 4 weeks × 5 working days
    expect(attendance.daysAttended).toBe(20);
    expect(attendance.percent).toBe(100);
  });

  it('reflects missed days', () => {
    let weeks = initialWeeks();
    weeks = weeks.map((week) =>
      week.weekNo === 1 ? written(week, [true, true, true, false, false]) : week,
    );
    weeks = submitWeek(weeks, 1);

    expect(totalAttendance(weeks)).toEqual({
      daysAttended: 3,
      daysPossible: 5,
      percent: 60,
    });
  });

  it('reports zero rather than dividing by zero on an empty logbook', () => {
    expect(totalAttendance(initialWeeks()).percent).toBe(0);
  });
});
