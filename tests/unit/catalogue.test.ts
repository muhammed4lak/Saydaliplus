import { describe, expect, it } from 'vitest';
import { ean13CheckDigit, isValidEan13, normaliseScan } from '@/lib/barcode';
// The catalogue and the reference are plain data modules shared with the two
// single-file builds; the unit tests hold them to the same rules the embed step
// does, so a bad row fails here before it can reach a till.
import PRODUCTS, { MAPPING_STATES } from '../../data/products.mjs';
import DRUGS, { FORM_KEYS } from '../../data/drugs.mjs';

describe('EAN-13', () => {
  it('computes the check digit of a known code', () => {
    // 4006381333931 is the worked example GS1 publishes.
    expect(ean13CheckDigit('400638133393')).toBe(1);
    expect(isValidEan13('4006381333931')).toBe(true);
  });

  it('rejects a single misread digit', () => {
    expect(isValidEan13('4006381333932')).toBe(false);
    expect(isValidEan13('4006381343931')).toBe(false);
  });

  it('rejects anything that is not thirteen digits', () => {
    for (const bad of ['', '400638133393', '40063813339311', '400638133393X', ' 4006381333931']) {
      expect(isValidEan13(bad)).toBe(false);
    }
  });

  it('cleans what a scanner sends without guessing at it', () => {
    expect(normaliseScan(' 4006381-333931\n')).toBe('4006381333931');
    expect(isValidEan13(normaliseScan('4006 3813 3393 1'))).toBe(true);
    expect(normaliseScan('40063813A')).toBe('40063813A');
  });
});

describe('the product catalogue', () => {
  const inReference = new Set(DRUGS.map(d => d.sci));

  it('holds only valid, unique barcodes', () => {
    const seen = new Set<string>();
    for (const p of PRODUCTS) {
      expect(isValidEan13(p.barcode), p.barcode).toBe(true);
      expect(seen.has(p.barcode), `duplicate ${p.barcode}`).toBe(false);
      seen.add(p.barcode);
    }
  });

  it('names every product in both languages and prices it', () => {
    for (const p of PRODUCTS) {
      expect(p.name.ar && p.name.en, p.barcode).toBeTruthy();
      expect(p.pack.ar && p.pack.en, p.barcode).toBeTruthy();
      expect(Number.isInteger(p.price) && p.price > 0, p.barcode).toBe(true);
    }
  });

  it('puts every product in exactly one known mapping state', () => {
    for (const p of PRODUCTS) expect(MAPPING_STATES).toContain(p.mapping);
  });

  /* The rule that makes "every product either maps or says it does not" true. */
  it('links ingredients exactly when the state says it knows them', () => {
    for (const p of PRODUCTS) {
      const linked = p.molecules.length > 0;
      const knows = p.mapping === 'verified' || p.mapping === 'auto';
      expect(linked, `${p.name.en} is ${p.mapping} with ${p.molecules.length} molecules`).toBe(knows);
    }
  });

  it('gives a medicine a form and a non-medicine none', () => {
    for (const p of PRODUCTS) {
      if (p.mapping === 'nondrug') expect(p.form, p.name.en).toBeNull();
      else expect(FORM_KEYS, p.name.en).toContain(p.form);
    }
  });

  /* A typo in a molecule name would silently drop an ingredient out of every
     check. So an ingredient either names a molecule in the reference, or says
     out loud that it is outside it. */
  it('refuses an ingredient that is neither in the reference nor marked outside it', () => {
    for (const p of PRODUCTS) {
      for (const m of p.molecules) {
        if (m.ref === false) expect(inReference.has(m.sci), `${m.sci} is in the reference`).toBe(false);
        else expect(inReference.has(m.sci), `${p.name.en}: unknown molecule ${m.sci}`).toBe(true);
      }
    }
  });

  it('keeps honest examples of every state the Helper has to explain', () => {
    const count = (f: (p: (typeof PRODUCTS)[number]) => boolean) => PRODUCTS.filter(f).length;
    expect(count(p => p.mapping === 'unmapped')).toBeGreaterThan(0);
    expect(count(p => p.mapping === 'nondrug')).toBeGreaterThan(0);
    expect(count(p => p.mapping === 'auto')).toBeGreaterThan(0);
    // Mapped, but part of it lies outside what the Helper can check.
    expect(count(p => p.molecules.some(m => m.ref === false) && p.molecules.some(m => m.ref !== false))).toBeGreaterThan(0);
    // Mapped, and none of it can be checked.
    expect(count(p => p.molecules.length > 0 && p.molecules.every(m => m.ref === false))).toBeGreaterThan(0);
  });
});
