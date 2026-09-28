/**
 * Exports the drug reference for reading outside the app — in a spreadsheet,
 * or by another system.
 *
 *   node scripts/export-drugs.mjs          (npm run drugs:export)
 *
 * Writes, into data/export/:
 *   medications.json   every molecule in full, with the banks it draws on
 *                      (categories, interaction classes, class rules) and,
 *                      per molecule, the trade names the Ministry of Health
 *                      register lists for it and its Essential Drugs List codes
 *   medications.csv    one row per molecule, both languages side by side
 *   interactions.csv   one row per interaction: the ones written on a drug,
 *                      and the class rules that hold between two classes
 *
 * The CSV files start with a byte-order mark so that Excel reads the Arabic
 * as Arabic. Lists inside a cell are separated by " | ".
 *
 * Re-running is safe: the files are rewritten from data/drugs.mjs,
 * data/register-products.json and data/edl.json, and hold nothing else.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import DRUGS, { CATEGORIES, TAGS, RULES, OUTSIDE, TAKE } from '../data/drugs.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'data', 'export');
mkdirSync(out, { recursive: true });

const REG = JSON.parse(readFileSync(join(root, 'data', 'register-products.json'), 'utf8'));
const EDL = JSON.parse(readFileSync(join(root, 'data', 'edl.json'), 'utf8'));
const CONTROLLED = JSON.parse(readFileSync(join(root, 'data', 'controlled.json'), 'utf8'));

/* The register's trade names per molecule, suspended registrations marked. */
const ti = REG.fields.indexOf('trade'), mi = REG.fields.indexOf('molecules'), si = REG.fields.indexOf('status');
const registered = new Map();
for (const r of REG.rows) for (const sci of r[mi]) {
  if (!registered.has(sci)) registered.set(sci, new Set());
  registered.get(sci).add(r[ti] + (r[si] === 'suspended' ? ' (suspended)' : ''));
}
const regNames = sci => [...(registered.get(sci) || [])].sort((a, b) => a.localeCompare(b));
const edlCodes = sci => EDL.byDrug[sci] || [];
const control = sci => CONTROLLED.substances.find(c => c.name === sci) || null;
const group = d => d.cat.split('.')[0];
const partner = w => w.startsWith('#') ? TAGS[w.slice(1)].en + ' (class)' : w;

/* ---------- JSON ---------- */
const json = {
  title: 'Saydali+ drug reference — the Iraqi market',
  generated: new Date().toISOString().slice(0, 10),
  note: 'Placeholder clinical content until the clinical curator has reviewed it. A reference, not a prescriber: ' +
        'interactions are the ones worth stopping for, not the complete list.',
  sources: {
    register: 'Iraqi Ministry of Health register of registered medicines (data/sources/moh-register.csv)',
    edl: EDL.source,
    controlled: CONTROLLED.source
  },
  counts: {
    molecules: DRUGS.length,
    groups: Object.keys(CATEGORIES).filter(k => !k.includes('.')).length,
    classes: Object.keys(CATEGORIES).filter(k => k.includes('.')).length,
    interactions: DRUGS.reduce((n, d) => n + (d.interactions || []).length, 0),
    classRules: RULES.length,
    registeredProductsLinked: REG.rows.filter(r => r[mi].length).length,
    registeredProducts: REG.rows.length
  },
  categories: CATEGORIES,
  interactionClasses: TAGS,
  classRules: RULES.map(([a, b, severity, en, ar]) => ({ a, b, severity, note:{ ar, en } })),
  outsidePartners: OUTSIDE,
  take: TAKE,
  medications: DRUGS.map(d => ({
    ...d,
    group: group(d),
    registeredInIraq: regNames(d.sci),
    edl: edlCodes(d.sci),
    control: control(d.sci)
  }))
};
writeFileSync(join(out, 'medications.json'), JSON.stringify(json, null, 1) + '\n');

/* ---------- CSV ---------- */
const cell = v => {
  const s = v == null ? '' : String(v);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};
const csv = rows => '﻿' + rows.map(r => r.map(cell).join(',')).join('\r\n') + '\r\n';
const list = xs => (xs || []).join(' | ');

const medRows = [[
  'group', 'group_ar', 'class', 'class_ar', 'scientific_name', 'arabic_name', 'atc', 'main_form', 'strengths',
  'international_brands', 'also_known_as', 'registered_in_iraq', 'registered_count', 'edl_codes', 'controlled',
  'how_to_take', 'how_to_take_ar', 'counselling', 'counselling_ar', 'contraindications', 'contraindications_ar',
  'ask_the_patient', 'ask_the_patient_ar', 'interaction_classes', 'interactions_listed', 'worst_listed_interaction'
]];
const rank = { warning:1, serious:2, critical:3 };
for (const d of [...DRUGS].sort((a, b) => a.cat.localeCompare(b.cat) || a.sci.localeCompare(b.sci))) {
  const c = control(d.sci);
  const worst = (d.interactions || []).reduce((w, i) => (rank[i.severity] > (rank[w] || 0) ? i.severity : w), '');
  medRows.push([
    CATEGORIES[group(d)].en, CATEGORIES[group(d)].ar, CATEGORIES[d.cat].en, CATEGORIES[d.cat].ar,
    d.sci, d.ar, d.atc, d.form, list(d.doses), list(d.brand), list(d.aka), list(regNames(d.sci)), regNames(d.sci).length,
    list(edlCodes(d.sci)), c ? `${c.convention}${c.schedule ? ' ' + c.schedule : ''}${c.precursor ? ' (precursor)' : ''}` : (d.controlled ? 'yes' : ''),
    list((d.take || []).map(k => TAKE[k].en)), list((d.take || []).map(k => TAKE[k].ar)),
    d.notes.en, d.notes.ar,
    list((d.contraindications || []).map(x => x.en)), list((d.contraindications || []).map(x => x.ar)),
    list(d.ask.map(x => x.en)), list(d.ask.map(x => x.ar)),
    list((d.tags || []).map(t => TAGS[t].en)), (d.interactions || []).length, worst
  ]);
}
writeFileSync(join(out, 'medications.csv'), csv(medRows));

const ixRows = [['kind', 'drug', 'drug_ar', 'with', 'with_type', 'severity', 'note', 'note_ar']];
for (const d of DRUGS) for (const i of d.interactions || []) {
  const type = i.with.startsWith('#') ? 'class' : OUTSIDE.includes(i.with) ? 'outside' : 'drug';
  ixRows.push(['drug', d.sci, d.ar, partner(i.with), type, i.severity, i.note.en, i.note.ar]);
}
for (const [a, b, severity, en, ar] of RULES) {
  const members = t => DRUGS.filter(d => (d.tags || []).includes(t)).length;
  ixRows.push(['class rule', `${TAGS[a].en} (class, ${members(a)} drugs)`, TAGS[a].ar,
    `${TAGS[b].en} (class, ${members(b)} drugs)`, 'class', severity, en, ar]);
}
writeFileSync(join(out, 'interactions.csv'), csv(ixRows));

console.log(`data/export: ${DRUGS.length} molecules (medications.json, medications.csv), ` +
  `${ixRows.length - 1} interactions and class rules (interactions.csv)`);
