/**
 * Reliability, cancellations and no-shows.
 *
 * A pharmacist who does not turn up leaves a pharmacy shut for the day, with the
 * owner's licence attached to the closure. It is the single most damaging failure
 * mode in the product, so it gets an explicit definition rather than a vague
 * "reliability" number — the prototype showed a static 96% and that was a lie the
 * pharmacy could not check.
 *
 * The counterpart rule matters just as much: a pharmacist who cancels with real
 * notice has done nothing wrong, and penalising that would push people to accept
 * shifts they cannot work. Only *late* withdrawal counts against them.
 */

/** Cancel with at least this much notice and it costs the pharmacist nothing. */
export const FREE_CANCELLATION_HOURS = 48;

/**
 * Inside this window, a cancellation is treated as a no-show: too late for the
 * pharmacy to find cover, so the practical outcome is a closed pharmacy either way.
 */
export const NO_SHOW_WINDOW_HOURS = 2;

/**
 * How long after the start time we wait before calling it a no-show. Baghdad
 * traffic is real; a pharmacist twenty minutes late who then works the shift has
 * not failed the pharmacy.
 */
export const NO_SHOW_GRACE_MINUTES = 60;

export type CancellationOutcome = 'free' | 'late' | 'no-show';

export interface BookingCounts {
  /** Bookings the pharmacist accepted — the denominator. */
  accepted: number;
  /** Bookings that reached a completed two-party handoff — the numerator. */
  completed: number;
  /** Cancelled with adequate notice; removed from both sides of the ratio. */
  freeCancellations: number;
}

/**
 * Classify a withdrawal by how much notice it gives the pharmacy.
 */
export function classifyCancellation(shiftStartsAt: Date, cancelledAt: Date): CancellationOutcome {
  const hoursOfNotice = (shiftStartsAt.getTime() - cancelledAt.getTime()) / 3_600_000;
  if (hoursOfNotice >= FREE_CANCELLATION_HOURS) return 'free';
  if (hoursOfNotice >= NO_SHOW_WINDOW_HOURS) return 'late';
  return 'no-show';
}

/**
 * Has an upcoming booking tipped into no-show territory?
 *
 * The test is the *handoff*, not a self-reported arrival: the pharmacist has to
 * have started the two-party checklist. That keeps one evidentiary record behind
 * both completion and the incident flow.
 */
export function isNoShow(
  shiftStartsAt: Date,
  handoffStartedAt: Date | null,
  now: Date = new Date(),
): boolean {
  if (handoffStartedAt !== null) return false;
  const deadline = new Date(shiftStartsAt.getTime() + NO_SHOW_GRACE_MINUTES * 60_000);
  return now > deadline;
}

/**
 * completed ÷ accepted, with free cancellations excluded from both sides.
 *
 * Returns null rather than 100% for a pharmacist with no history — an unproven
 * account should read as "no record yet", not as a perfect one. A pharmacy
 * deciding whether to hand over their keys needs those to look different.
 */
export function reliabilityPercent(counts: BookingCounts): number | null {
  const denominator = counts.accepted - counts.freeCancellations;
  if (denominator <= 0) return null;
  return Math.round((counts.completed / denominator) * 100);
}
