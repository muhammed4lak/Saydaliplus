/* Types for data/exchange.mjs — the parts read outside the single-file builds. */
export interface ExchangeSeed {
  id: string; pharmacy: string; by: string; code: string; months: number; qty: number; stock: number;
  price: number | null; note: { en: string; ar: string }; daysAgo: number;
}
export const EXCHANGE_KM: number;
export const EXCHANGE_WINDOW_DAYS: number;
export const PHARMACY_LOC: Record<string, [number, number]>;
export const EXCHANGE_SEED: ExchangeSeed[];
export function distanceKm(a: [number, number], b: [number, number]): number;
