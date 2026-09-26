/**
 * When and how to take a medicine — the `take` field of the drug reference
 * (v0.0012.1). What the till prints under a medicine by default, so the rules
 * that make it safe to print are held here as well as in the embed script.
 */
import { describe, expect, it } from 'vitest';
import DRUGS, { TAKE } from '../../data/drugs.mjs';

const bySci = (sci: string) => DRUGS.find((d) => d.sci === sci);

describe('the instruction vocabulary', () => {
  it('exists in both languages, every entry', () => {
    for (const [k, v] of Object.entries(TAKE)) {
      expect(v.ar, k).toBeTruthy();
      expect(v.en, k).toBeTruthy();
    }
  });

  it('is the only thing a drug may name', () => {
    for (const d of DRUGS) for (const k of d.take ?? []) expect(TAKE[k], `${d.sci}: ${k}`).toBeDefined();
  });

  it('never says something generic, and never a dose', () => {
    for (const v of Object.values(TAKE)) {
      expect(v.en).not.toMatch(/swallow|shake|as directed/i);
      expect(v.en).not.toMatch(/\d+\s*(mg|mcg|tablet|capsule|ml)/i);
    }
  });

  it('carries no repeats within a drug', () => {
    for (const d of DRUGS) if (d.take) expect(new Set(d.take).size, d.sci).toBe(d.take.length);
  });
});

describe('the defaults that matter most', () => {
  it('levothyroxine: empty stomach, before breakfast', () => {
    expect(bySci('Levothyroxine')?.take).toEqual(expect.arrayContaining(['emptyStomach', 'beforeBreakfast']));
  });

  it('methotrexate: once a week only', () => {
    expect(bySci('Methotrexate')?.take).toContain('weekly');
  });

  it('proton-pump inhibitors: before breakfast', () => {
    for (const s of ['Omeprazole', 'Esomeprazole', 'Pantoprazole']) expect(bySci(s)?.take, s).toContain('beforeBreakfast');
  });

  it('a drug with nothing worth saying has no default at all', () => {
    expect(bySci('Paracetamol')?.take).toBeUndefined();
  });
});
