/**
 * Embeds data/drugs.mjs — and, since v0.0009, data/products.mjs — into both
 * single-file builds.
 *
 * The app and the CRM are each one openable file with no build step, which is
 * what makes them useful and also what makes a hundred-drug list a hazard: two
 * copies of the same reference drift, and the one that drifts is the one a
 * pharmacist is reading at a counter. So the list lives in one file, and this
 * writes it into both between markers.
 *
 *   node scripts/embed-drugs.mjs [file ...]     (default: both builds)
 *
 * Re-running is safe and idempotent. A target with no markers is an error
 * rather than a silent skip — a build that quietly kept an old list is exactly
 * the failure this exists to prevent.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import DRUGS, { FORM_KEYS, DUPLICATE_RULES } from '../data/drugs.mjs';
import PRODUCTS, { MAPPING_STATES } from '../data/products.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BEGIN = '/* DRUGS:BEGIN */';
const END = '/* DRUGS:END */';
const P_BEGIN = '/* PRODUCTS:BEGIN */';
const P_END = '/* PRODUCTS:END */';

/* Validation runs before anything is written. A malformed severity or a
   duplicate scientific name is a data error, and the place to catch it is here
   rather than in a screen that renders a blank chip. */
const problems = [];
const seen = new Set();
for (const d of DRUGS) {
  if (seen.has(d.sci)) problems.push(`duplicate scientific name: ${d.sci}`);
  seen.add(d.sci);
  for (const k of ['sci', 'ar', 'atc', 'form']) if (!d[k]) problems.push(`${d.sci}: missing ${k}`);
  if (!FORM_KEYS.includes(d.form)) problems.push(`${d.sci}: unknown form "${d.form}"`);
  if (!Array.isArray(d.doses) || !d.doses.length) problems.push(`${d.sci}: no doses`);
  if (!d.notes || !d.notes.ar || !d.notes.en) problems.push(`${d.sci}: notes need both languages`);
  for (const i of d.interactions || []) {
    if (!['warning', 'serious', 'critical'].includes(i.severity)) problems.push(`${d.sci}: bad severity "${i.severity}"`);
    if (!i.with || !i.note || !i.note.ar || !i.note.en) problems.push(`${d.sci}: incomplete interaction`);
  }
  for (const c of d.contraindications || []) {
    if (!c.ar || !c.en) problems.push(`${d.sci}: contraindication needs both languages`);
  }
}
for (const r of DUPLICATE_RULES) {
  if (!r.id || !r.codes || !r.codes.length) problems.push(`duplicate rule ${r.id}: no codes`);
  if (!['warning', 'serious', 'critical'].includes(r.severity)) problems.push(`duplicate rule ${r.id}: bad severity`);
  if (!r.label || !r.label.ar || !r.label.en) problems.push(`duplicate rule ${r.id}: label needs both languages`);
  if (!r.note || !r.note.ar || !r.note.en) problems.push(`duplicate rule ${r.id}: note needs both languages`);
  // A rule no drug can satisfy is dead weight that reads as coverage.
  if (DRUGS.filter(d => r.codes.some(c => d.atc.startsWith(c))).length < 2)
    problems.push(`duplicate rule ${r.id}: fewer than two drugs can ever match it`);
}

/* The catalogue (W17). The same rules tests/unit/catalogue.test.ts holds it to,
   repeated here so a bad row cannot be embedded even when nobody ran the tests.
   The check digit uses the same arithmetic as src/lib/barcode.ts. */
const ean13ok = c => /^\d{13}$/.test(c) &&
  (10 - [...c.slice(0, 12)].reduce((n, d, i) => n + Number(d) * (i % 2 ? 3 : 1), 0) % 10) % 10 === Number(c[12]);
const molecules = new Set(DRUGS.map(d => d.sci));
const barcodes = new Set();
for (const p of PRODUCTS) {
  const who = p.name && p.name.en || p.barcode;
  if (!ean13ok(p.barcode)) problems.push(`${who}: barcode ${p.barcode} fails its check digit`);
  if (barcodes.has(p.barcode)) problems.push(`duplicate barcode ${p.barcode}`);
  barcodes.add(p.barcode);
  if (!p.name || !p.name.ar || !p.name.en) problems.push(`${who}: name needs both languages`);
  if (!MAPPING_STATES.includes(p.mapping)) problems.push(`${who}: unknown mapping "${p.mapping}"`);
  const knows = p.mapping === 'verified' || p.mapping === 'auto';
  if (knows !== p.molecules.length > 0) problems.push(`${who}: ${p.mapping} with ${p.molecules.length} molecules`);
  for (const m of p.molecules) {
    if (m.ref === false ? molecules.has(m.sci) : !molecules.has(m.sci))
      problems.push(`${who}: "${m.sci}" ${m.ref === false ? 'is in the reference but marked outside it' : 'is not in the reference'}`);
  }
}

if (problems.length) {
  console.error('data/drugs.mjs or data/products.mjs did not validate:\n  ' + problems.join('\n  '));
  process.exit(1);
}

/* One drug per line. The files are read by people as well as browsers, and a
   single 60 KB line is not readable by either. */
const block = BEGIN + '\n' +
  'const DRUG_FORMS = ' + JSON.stringify(FORM_KEYS) + ';\n' +
  'const DUPLICATE_RULES = [\n' +
  DUPLICATE_RULES.map(r => '  ' + JSON.stringify(r)).join(',\n') +
  '\n];\n' +
  'const DRUGS = [\n' +
  DRUGS.map(d => '  ' + JSON.stringify(d)).join(',\n') +
  '\n];\n' + END;

/* One product per line, for the same reason. */
const productBlock = P_BEGIN + '\n' +
  'const MAPPING_STATES = ' + JSON.stringify(MAPPING_STATES) + ';\n' +
  'const PRODUCTS = [\n' +
  PRODUCTS.map(p => '  ' + JSON.stringify(p)).join(',\n') +
  '\n];\n' + P_END;

function newest(dir, prefix) {
  const found = readdirSync(join(root, dir))
    .filter(f => f.startsWith(prefix) && f.endsWith('.html'))
    .map(f => ({ f, v: (f.match(/_v(\d+)\.(\d+)/) || [0, 0, 0]).slice(1).map(Number) }))
    .sort((a, b) => (b.v[0] - a.v[0]) || (b.v[1] - a.v[1]));
  if (!found.length) throw new Error(`no ${prefix}*.html in ${dir}`);
  return join(dir, found[0].f);
}

const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [newest('demo', 'saydali-plus_v'), newest('crm', 'saydali-crm_v')];

for (const rel of targets) {
  const path = join(root, rel);
  const src = readFileSync(path, 'utf8');
  const a = src.indexOf(BEGIN);
  const b = src.indexOf(END);
  if (a < 0 || b < 0) {
    console.error(`${rel}: no ${BEGIN} … ${END} markers — nothing written`);
    process.exit(1);
  }
  let out = src.slice(0, a) + block + src.slice(b + END.length);
  const pa = out.indexOf(P_BEGIN);
  const pb = out.indexOf(P_END);
  if (pa < 0 || pb < 0) {
    console.error(`${rel}: no ${P_BEGIN} … ${P_END} markers — nothing written`);
    process.exit(1);
  }
  out = out.slice(0, pa) + productBlock + out.slice(pb + P_END.length);
  writeFileSync(path, out);
  console.log(`${rel}: ${DRUGS.length} drugs and ${PRODUCTS.length} products embedded`);
}
