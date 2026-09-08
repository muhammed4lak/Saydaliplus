/**
 * Training-logbook rules.
 *
 * The logbook is the student module's whole point: it has to be a contemporaneous
 * record, not something assembled the night before the certificate is needed. That
 * is why the weeks unlock forward one at a time and cannot be back-filled.
 */

export type WeekStatus = 'locked' | 'draft' | 'submitted' | 'approved';
export type MonthStatus = 'upcoming' | 'active' | 'ready' | 'approved';

export const TOTAL_WEEKS = 12;
export const WEEKS_PER_MONTH = 4;
export const TOTAL_MONTHS = TOTAL_WEEKS / WEEKS_PER_MONTH;

/** Sunday–Thursday. The Iraqi working week; Friday and Saturday are the weekend. */
export const WORKING_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'] as const;
export const DAYS_PER_WEEK = WORKING_DAYS.length;

/** A week needs real substance before it can be submitted, not a one-line placeholder. */
export const MIN_LOG_CHARACTERS = 80;

export interface LogWeek {
  weekNo: number;
  daysPresent: boolean[];
  text: string;
  status: WeekStatus;
}

export const monthOfWeek = (weekNo: number): number => Math.ceil(weekNo / WEEKS_PER_MONTH);

export const weeksInMonth = (weeks: readonly LogWeek[], monthNo: number): LogWeek[] =>
  weeks.filter((week) => monthOfWeek(week.weekNo) === monthNo);

export const daysAttended = (week: LogWeek): number =>
  week.daysPresent.filter(Boolean).length;

export interface SubmitCheck {
  ok: boolean;
  /** Machine-readable so the UI can pick the right translated message. */
  reason?: 'not-editable' | 'no-attendance' | 'too-short';
}

/**
 * A week is submittable only from `draft` (so an approved week cannot be quietly
 * rewritten), with at least one day of attendance and a real written account.
 */
export function canSubmitWeek(week: LogWeek): SubmitCheck {
  if (week.status !== 'draft') return { ok: false, reason: 'not-editable' };
  if (daysAttended(week) === 0) return { ok: false, reason: 'no-attendance' };
  if (week.text.trim().length < MIN_LOG_CHARACTERS) return { ok: false, reason: 'too-short' };
  return { ok: true };
}

/**
 * Submitting a week unlocks the next one. This is the forward-fill rule: week 5
 * does not exist as far as the student is concerned until week 4 is in.
 */
export function submitWeek(weeks: readonly LogWeek[], weekNo: number): LogWeek[] {
  const target = weeks.find((week) => week.weekNo === weekNo);
  if (!target) throw new Error(`No such week: ${weekNo}`);

  const check = canSubmitWeek(target);
  if (!check.ok) throw new Error(`Week ${weekNo} cannot be submitted: ${check.reason}`);

  return weeks.map((week) => {
    if (week.weekNo === weekNo) return { ...week, status: 'submitted' };
    if (week.weekNo === weekNo + 1 && week.status === 'locked') {
      return { ...week, status: 'draft' };
    }
    return week;
  });
}

export function monthStatus(weeks: readonly LogWeek[], monthNo: number): MonthStatus {
  const monthWeeks = weeksInMonth(weeks, monthNo);
  if (monthWeeks.length === 0) return 'upcoming';
  if (monthWeeks.every((week) => week.status === 'approved')) return 'approved';
  if (monthWeeks.every((week) => week.status === 'approved' || week.status === 'submitted')) {
    return 'ready';
  }
  if (monthWeeks.some((week) => week.status !== 'locked')) return 'active';
  return 'upcoming';
}

/** A month can only be approved once all four of its weeks are in. */
export function canApproveMonth(weeks: readonly LogWeek[], monthNo: number): boolean {
  return monthStatus(weeks, monthNo) === 'ready';
}

export function approveMonth(weeks: readonly LogWeek[], monthNo: number): LogWeek[] {
  if (!canApproveMonth(weeks, monthNo)) {
    throw new Error(`Month ${monthNo} is not ready for approval`);
  }
  return weeks.map((week) =>
    monthOfWeek(week.weekNo) === monthNo ? { ...week, status: 'approved' } : week,
  );
}

/**
 * Returning a month sends its weeks back to draft for rewriting. Approved weeks
 * from an earlier round are included: if the pharmacy is sending the month back,
 * the whole month is open again.
 */
export function returnMonth(weeks: readonly LogWeek[], monthNo: number): LogWeek[] {
  const status = monthStatus(weeks, monthNo);
  if (status !== 'ready' && status !== 'approved') {
    throw new Error(`Month ${monthNo} has nothing to return`);
  }
  return weeks.map((week) =>
    monthOfWeek(week.weekNo) === monthNo ? { ...week, status: 'draft' } : week,
  );
}

/** The certificate unlocks only when all three months are approved. */
export function allMonthsApproved(weeks: readonly LogWeek[]): boolean {
  return Array.from({ length: TOTAL_MONTHS }, (_, index) => index + 1).every(
    (monthNo) => monthStatus(weeks, monthNo) === 'approved',
  );
}

export function totalAttendance(weeks: readonly LogWeek[]): {
  daysAttended: number;
  daysPossible: number;
  percent: number;
} {
  const counted = weeks.filter((week) => week.status === 'submitted' || week.status === 'approved');
  const attended = counted.reduce((total, week) => total + daysAttended(week), 0);
  const possible = counted.length * DAYS_PER_WEEK;
  return {
    daysAttended: attended,
    daysPossible: possible,
    percent: possible === 0 ? 0 : Math.round((attended / possible) * 100),
  };
}

/** Weeks 1..12, with week 1 open and the rest locked behind it. */
export function initialWeeks(): LogWeek[] {
  return Array.from({ length: TOTAL_WEEKS }, (_, index) => ({
    weekNo: index + 1,
    daysPresent: Array<boolean>(DAYS_PER_WEEK).fill(false),
    text: '',
    status: index === 0 ? ('draft' as const) : ('locked' as const),
  }));
}
