/* Types for data/incidents.mjs. */
export interface IncidentSeed {
  id: string; pharmacy: string; by: string; about: string | null; kind: string; daysAgo: number; sale: string | null;
  state: 'open' | 'acknowledged' | 'closed'; text: { en: string; ar: string }; reply?: { en: string; ar: string };
}
export const INCIDENT_KINDS: string[];
export const INCIDENT_SEED: IncidentSeed[];
export function incidentCounts(seed: IncidentSeed[]): Record<string, number>;
