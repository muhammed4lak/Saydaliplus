/**
 * Embeds data/drugs.mjs into both single-file builds.
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

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BEGIN = '/* DRUGS:BEGIN */';
const END = '/* DRUGS:END */';

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

if (problems.length) {
  console.error('data/drugs.mjs did not validate:\n  ' + problems.join('\n  '));
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
  const out = src.slice(0, a) + block + src.slice(b + END.length);
  writeFileSync(path, out);
  console.log(`${rel}: ${DRUGS.length} drugs embedded`);
}
