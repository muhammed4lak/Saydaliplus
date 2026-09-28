/* The source files write a drug briefly — an interaction as a four-item
   array, a contraindication or question as a bank key — and this turns each
   one into the shape every reader expects. An unknown key is a data error,
   and it fails here, loudly, naming the drug: a question that silently
   rendered as "undefined" would reach a patient. */
import { QUESTIONS, CONTRA } from './banks.mjs';

export function expandDrug(e) {
  const fromBank = (bank, what) => x => {
    if (typeof x !== 'string') return { ar:x.ar, en:x.en };
    if (!bank[x]) throw new Error(`${e.sci}: unknown ${what} "${x}"`);
    return { ar:bank[x].ar, en:bank[x].en };
  };
  const d = { sci:e.sci, ar:e.ar, atc:e.atc, cat:e.cat, form:e.form, doses:e.doses };
  if (e.brand && e.brand.length) d.brand = e.brand;
  if (e.aka && e.aka.length) d.aka = e.aka;
  if (e.tags && e.tags.length) d.tags = e.tags;
  if (e.take) d.take = e.take;
  if (e.controlled) d.controlled = true;
  d.notes = { ar:e.notes.ar, en:e.notes.en };
  d.interactions = (e.ix || []).map(([w, severity, en, ar]) => ({ with:w, severity, note:{ ar, en } }));
  d.contraindications = (e.ci || []).map(fromBank(CONTRA, 'contraindication'));
  d.ask = (e.ask || []).map(fromBank(QUESTIONS, 'question'));
  return d;
}
