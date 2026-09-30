/* Types for data/history.mjs — the parts read outside the single-file builds. */
export interface HistoryPerson { email: string; owner?: boolean; days: number[]; start: string; end: string; abx?: number }
export interface HistoryDay { pharmacy: string; email: string; shiftsAgo: number; minutes?: number }
export interface HistoryAuto { pharmacy: string; email: string; daysAgo: number; claim?: string; approval?: { by: string; out: string } }
export interface HistoryShift {
  id: string; pharmacy: string; email: string; in: string; out: string; state: 'closed' | 'auto'; how: string;
  sched: { start: string; end: string }; autoAt?: string; past: true;
  claim: { out: string; at: string; by: string } | null;
  approval: { out: string; at: string; by: string; verdict: 'accepted' | 'amended' } | null;
}
export interface HistorySale { id: string; pharmacy: string; by: string; at: string; shift: string; total: number; items: number; past: true; abx: boolean; ctl: boolean }
export const SHIFT_GRACE_MIN: number;
export const HISTORY_DAYS: number;
export const HISTORY_TEAMS: Record<string, HistoryPerson[]>;
export const HISTORY_AUTO: HistoryAuto[];
export const REPORTS_SHARED: Record<string, boolean>;
export const HISTORY_LATE: HistoryDay[];
export const HISTORY_ABSENT: HistoryDay[];
export const HISTORY_ABX: number;
export const HISTORY_CTL: number;
export function historyFor(teams: Record<string, HistoryPerson[]>, autos: HistoryAuto[], days: number, nowMs: number,
  extra?: { late?: HistoryDay[]; absent?: HistoryDay[]; abx?: number; ctl?: number }): { shifts: HistoryShift[]; sales: HistorySale[]; off: { pharmacy: string; email: string; day: string }[] };
