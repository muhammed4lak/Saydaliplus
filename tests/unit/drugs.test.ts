import { describe, expect, it } from 'vitest';
// The drug reference is a plain data module shared with the two single-file
// builds; these tests hold it to the rules the embed step does, and to the
// ones a pharmacist relies on without knowing they are rules.
import DRUGS, { CATEGORIES, TAGS, RULES, OUTSIDE, QUESTIONS, CONTRA, FORM_KEYS, TAKE } from '../../data/drugs.mjs';

const SEVERITIES = ['warning', 'serious', 'critical'];
const bySci = new Map(DRUGS.map(d => [d.sci, d]));
const arabic = /[؀-ۿ]/;

describe('the drug reference', () => {
  it('holds the Iraqi market: over a thousand molecules, each named once', () => {
    expect(DRUGS.length).toBeGreaterThan(1000);
    expect(bySci.size).toBe(DRUGS.length);
  });

  it('names every drug in both scripts, with a plain Latin scientific name', () => {
    for (const d of DRUGS) {
      expect(/^[\x20-\x7E]+$/.test(d.sci), d.sci).toBe(true);
      expect(arabic.test(d.ar), d.sci).toBe(true);
      expect(d.notes.en && arabic.test(d.notes.ar), d.sci).toBeTruthy();
    }
  });

  it('files every drug under a class of a group', () => {
    for (const d of DRUGS) {
      const group = d.cat.split('.')[0] ?? '';
      expect(d.cat.includes('.') && !!CATEGORIES[d.cat] && !!CATEGORIES[group], `${d.sci}: ${d.cat}`).toBe(true);
    }
  });

  it('gives every drug a WHO ATC code, a known main form and its strengths', () => {
    for (const d of DRUGS) {
      expect(/^[A-Z]\d\d[A-Z]{0,2}\d{0,2}$/.test(d.atc), `${d.sci}: ${d.atc}`).toBe(true);
      expect(FORM_KEYS, d.sci).toContain(d.form);
      expect(d.doses.length, d.sci).toBeGreaterThan(0);
      for (const k of d.take || []) expect(TAKE[k], `${d.sci}: take ${k}`).toBeTruthy();
    }
  });

  /* The cap is the point: a fourth question is the one nobody asks. */
  it('asks one to three questions of every drug, in both languages', () => {
    for (const d of DRUGS) {
      expect(d.ask.length >= 1 && d.ask.length <= 3, `${d.sci}: ${d.ask.length} questions`).toBe(true);
      for (const q of d.ask) expect(q.en && arabic.test(q.ar), d.sci).toBeTruthy();
      expect(new Set(d.ask.map(q => q.en)).size, `${d.sci}: a question twice`).toBe(d.ask.length);
    }
  });

  it('writes every contraindication in both languages', () => {
    for (const d of DRUGS) for (const c of d.contraindications || []) expect(c.en && arabic.test(c.ar), d.sci).toBeTruthy();
  });

  /* A partner that is none of these is a typo, and a typo never matches a
     basket: the interaction would silently never fire. */
  it('names as a partner only a drug of the reference, a class, or a known outside partner', () => {
    for (const d of DRUGS) {
      for (const i of d.interactions || []) {
        expect(SEVERITIES, `${d.sci}: ${i.severity}`).toContain(i.severity);
        expect(i.note.en && arabic.test(i.note.ar), `${d.sci} + ${i.with}`).toBeTruthy();
        expect(i.with, `${d.sci} interacts with itself`).not.toBe(d.sci);
        const ok = i.with.startsWith('#') ? !!TAGS[i.with.slice(1)] : bySci.has(i.with) || OUTSIDE.includes(i.with);
        expect(ok, `${d.sci}: unknown partner "${i.with}"`).toBe(true);
      }
    }
  });

  it('puts drugs only in classes it defines, and every class rule on classes that have members', () => {
    const used = new Set(DRUGS.flatMap(d => d.tags || []));
    for (const d of DRUGS) for (const t of d.tags || []) expect(TAGS[t], `${d.sci}: ${t}`).toBeTruthy();
    for (const [a, b, severity, en, ar] of RULES) {
      expect(TAGS[a] && TAGS[b], `${a} + ${b}`).toBeTruthy();
      expect(SEVERITIES).toContain(severity);
      expect(en && arabic.test(ar), `${a} + ${b}`).toBeTruthy();
      expect(used.has(a) && used.has(b), `the rule ${a} + ${b} can never fire`).toBe(true);
    }
  });

  /* A cream is not its tablet: the skin and eye forms of a molecule that also
     comes as tablets are entries of their own, and each needs the molecule it
     is a form of. */
  it('has a plain entry beside every "(topical)" and "(eye)" form', () => {
    for (const d of DRUGS) {
      const base = d.sci.match(/^(.*) \((topical|eye)\)$/)?.[1];
      if (base) expect(bySci.has(base), `${d.sci} without ${base}`).toBe(true);
    }
  });

  it('keeps its banks in both languages', () => {
    for (const bank of [CATEGORIES, TAGS, QUESTIONS, CONTRA])
      for (const [k, v] of Object.entries(bank)) expect(v.en && arabic.test(v.ar), k).toBeTruthy();
  });

  it('keeps the interactions a pharmacist most relies on', () => {
    const has = (a: string, b: string) => (bySci.get(a)?.interactions || []).some(i => i.with === b);
    expect(has('Amiodarone', 'Warfarin')).toBe(true);
    expect(has('Metronidazole', 'Alcohol')).toBe(true);
    expect(has('Metformin', '#contrast')).toBe(true);
    expect(RULES.some(([a, b, s]) => [a, b].includes('opioid') && [a, b].includes('benzo') && s === 'critical')).toBe(true);
    expect(RULES.some(([a, b, s]) => [a, b].includes('nitrate') && [a, b].includes('pde5') && s === 'critical')).toBe(true);
  });
});
