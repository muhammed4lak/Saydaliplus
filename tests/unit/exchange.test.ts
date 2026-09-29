import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
// The near-expiry exchange's shared data (v0.0018): what "nearby" means, and
// the listings both prototypes start from.
import { EXCHANGE_KM, EXCHANGE_SEED, PHARMACY_LOC, distanceKm } from '../../data/exchange.mjs';
import PRODUCTS from '../../data/products.mjs';

const controlled = (JSON.parse(readFileSync(join(__dirname, '..', '..', 'data', 'controlled.json'), 'utf8')) as {
  substances: { name: string }[];
}).substances.map((c) => c.name.toLowerCase());
const loc = (id: string): [number, number] => PHARMACY_LOC[id] ?? [0, 0];

describe('nearby', () => {
  it('is a distance, measured the same both ways, and zero to itself', () => {
    expect(distanceKm(loc('P1'), loc('P1'))).toBe(0);
    expect(distanceKm(loc('P1'), loc('P7'))).toBeCloseTo(distanceKm(loc('P7'), loc('P1')), 9);
  });

  it('puts Jadriya and Zayouna within reach of Karrada, and Mansour outside it', () => {
    expect(distanceKm(loc('P1'), loc('P7'))).toBeLessThan(EXCHANGE_KM);
    expect(distanceKm(loc('P1'), loc('P8'))).toBeLessThan(EXCHANGE_KM);
    expect(distanceKm(loc('P1'), loc('P9'))).toBeGreaterThan(EXCHANGE_KM);
  });
});

describe('the seeded listings', () => {
  it('are products that exist, at pharmacies with a place, never more than the batch holds', () => {
    for (const x of EXCHANGE_SEED) {
      expect(PRODUCTS.some((p) => p.barcode === x.code)).toBe(true);
      expect(PHARMACY_LOC[x.pharmacy]).toBeDefined();
      expect(x.qty).toBeGreaterThan(0);
      expect(x.qty).toBeLessThanOrEqual(x.stock);
    }
  });

  it('never list a controlled substance or a precursor', () => {
    for (const x of EXCHANGE_SEED) {
      const p = PRODUCTS.find((q) => q.barcode === x.code);
      expect(p?.molecules.some((m) => controlled.includes(m.sci.toLowerCase()))).toBe(false);
    }
  });
});
