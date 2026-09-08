/**
 * Shift-duration arithmetic.
 *
 * The one rule that matters: a shift may cross midnight. 22:00–06:00 is eight
 * hours, not minus sixteen. Every pharmacy posting an evening slot hits this.
 */

const MINUTES_PER_DAY = 24 * 60;

function toMinutes(time: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) throw new Error(`Invalid time: ${time}`);
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) throw new Error(`Invalid time: ${time}`);
  return hours * 60 + minutes;
}

/**
 * Hours between two `HH:MM` times, wrapping past midnight.
 *
 * Equal start and end is treated as a full 24 hours rather than zero: a shift
 * posted 08:00–08:00 is someone covering a whole day, and zero would silently
 * price it at nothing.
 */
export function shiftHours(startTime: string, endTime: string): number {
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  let minutes = end - start;
  if (minutes <= 0) minutes += MINUTES_PER_DAY;
  return Math.round((minutes / 60) * 100) / 100;
}

/** Same calculation against real timestamps, used once a listing has real dates. */
export function hoursBetween(startsAt: Date, endsAt: Date): number {
  const minutes = (endsAt.getTime() - startsAt.getTime()) / 60_000;
  if (minutes <= 0) throw new Error('Shift must end after it starts');
  return Math.round((minutes / 60) * 100) / 100;
}

/**
 * Turn a date and two clock times into real timestamps, rolling the end date
 * forward a day when the shift crosses midnight.
 */
export function resolveShiftWindow(
  date: string,
  startTime: string,
  endTime: string,
): { startsAt: Date; endsAt: Date } {
  const startsAt = new Date(`${date}T${startTime}:00`);
  if (Number.isNaN(startsAt.getTime())) throw new Error(`Invalid date: ${date}`);
  const endsAt = new Date(startsAt.getTime() + shiftHours(startTime, endTime) * 3_600_000);
  return { startsAt, endsAt };
}
