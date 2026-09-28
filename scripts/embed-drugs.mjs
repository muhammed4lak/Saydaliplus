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
import DRUGS, { FORM_KEYS, DUPLICATE_RULES, TAKE } from '../data/drugs.mjs';
import PRODUCTS, { MAPPING_STATES } from '../data/products.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/* v0.0013.2 — the Ministry sources, read by scripts/read-sources.py. Both
   builds get what is small and per-item: each reference drug's entries on the
   Essential Drugs List, and each catalogue product's registration. Only the
   CRM gets the whole register — 5,214 rows is an operator's reference, not
   something a phone should carry. */
const EDL = JSON.parse(readFileSync(join(root, 'data', 'edl.json'), 'utf8'));
const PRODUCT_REG = JSON.parse(readFileSync(join(root, 'data', 'product-registrations.json'), 'utf8'));
const REGISTER = JSON.parse(readFileSync(join(root, 'data', 'register.json'), 'utf8'));
/* v0.0015.1 — the whole register as the app's catalogue of products with no
   barcode yet, the Essential Drugs List's generics the reference does not
   have, and the controlled list (the UN conventions until Iraq's own). Only a
   build with the markers gets them: the app. */
const REG_PRODUCTS = JSON.parse(readFileSync(join(root, 'data', 'register-products.json'), 'utf8'));
const EDL_GENERICS = JSON.parse(readFileSync(join(root, 'data', 'edl-generics.json'), 'utf8'));
const CONTROLLED = JSON.parse(readFileSync(join(root, 'data', 'controlled.json'), 'utf8'));
const C_BEGIN = '/* CATALOGUE:BEGIN */', C_END = '/* CATALOGUE:END */';
/* v0.0016 — the rules ledger (W19): rules defined only there, every state a
   rule has been through with who and when, and the CRM's override counts.
   Both builds: the app fires what is approved, the CRM governs it. */
const RULES = JSON.parse(readFileSync(join(root, 'data', 'rules.json'), 'utf8'));
const G_BEGIN = '/* RULES:BEGIN */', G_END = '/* RULES:END */';
const S_BEGIN = '/* SOURCES:BEGIN */', S_END = '/* SOURCES:END */';
const R_BEGIN = '/* REGISTER:BEGIN */', R_END = '/* REGISTER:END */';
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
  for (const k of d.take || []) if (!TAKE[k]) problems.push(`${d.sci}: unknown take "${k}"`);
  if ('controlled' in d && d.controlled !== true) problems.push(`${d.sci}: controlled must be true or absent`);
}
for (const [k, v] of Object.entries(TAKE)) if (!v.ar || !v.en) problems.push(`take ${k}: needs both languages`);
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
  'const TAKE = ' + JSON.stringify(TAKE) + ';\n' +
  'const DUPLICATE_RULES = [\n' +
  DUPLICATE_RULES.map(r => '  ' + JSON.stringify(r)).join(',\n') +
  '\n];\n' +
  'const DRUGS = [\n' +
  DRUGS.map(d => '  ' + JSON.stringify(d)).join(',\n') +
  '\n];\n' + END;

const edlItems = Object.fromEntries(EDL.items.map(i => [i.code, i]));
const edlByDrug = Object.fromEntries(Object.entries(EDL.byDrug).map(([sci, codes]) =>
  [sci, codes.map(c => ({ code:c, item:edlItems[c].item, cls:edlItems[c].class }))]));
for (const sci of Object.keys(edlByDrug)) if (!DRUGS.some(d => d.sci === sci)) problems.push(`EDL names a drug not in the reference: ${sci}`);
for (const b of Object.keys(PRODUCT_REG)) if (!PRODUCTS.some(p => p.barcode === b)) problems.push(`a registration links an unknown barcode: ${b}`);
const sourcesBlock = S_BEGIN + '\n' +
  'const EDL_SOURCE = ' + JSON.stringify(EDL.source) + ';\n' +
  'const EDL_BY_DRUG = {\n' + Object.entries(edlByDrug).map(([k, v]) => '  ' + JSON.stringify(k) + ':' + JSON.stringify(v)).join(',\n') + '\n};\n' +
  'const PRODUCT_REG = {\n' + Object.entries(PRODUCT_REG).map(([k, v]) => '  ' + JSON.stringify(k) + ':' + JSON.stringify(v)).join(',\n') + '\n};\n' + S_END;
/* The register as arrays, one row per line — a third of the size of objects.
   Order: id, national code, scientific name, trade name, pack, maker, country,
   authorisation holder, registration, notes, shelf life. */
const REG_FIELDS = ['id', 'code', 'sci', 'trade', 'pack', 'maker', 'country', 'mah', 'reg', 'notes', 'shelfLife'];
const registerBlock = R_BEGIN + '\n' +
  'const REGISTER_FIELDS = ' + JSON.stringify(REG_FIELDS) + ';\n' +
  'const REGISTER_ROWS = [\n' + REGISTER.map(r => '  ' + JSON.stringify(REG_FIELDS.map(k =>
    k === 'reg' ? (r.reg || r.regOld || null) : k === 'notes' && r.notes ? r.notes.slice(0, 240) : k === 'pack' && r.pack ? r.pack.slice(0, 120) : r[k]))).join(',\n') +
  '\n];\n' + R_END;
{
  const mi = REG_PRODUCTS.fields.indexOf('molecules'), ci = REG_PRODUCTS.fields.indexOf('control');
  const ctl = new Set(CONTROLLED.substances.map(c => c.name));
  for (const r of REG_PRODUCTS.rows) {
    for (const m of r[mi]) if (!DRUGS.some(d => d.sci === m)) problems.push(`register product ${r[0]} names a drug not in the reference: ${m}`);
    for (const c of r[ci]) if (!ctl.has(c)) problems.push(`register product ${r[0]} names an unknown controlled substance: ${c}`);
  }
  for (const g of EDL_GENERICS) if (DRUGS.some(d => d.sci.toLowerCase() === g.sci.toLowerCase())) problems.push(`EDL generic already in the reference: ${g.sci}`);
}
/* The rules ledger validates against the reference it governs. */
{
  const known = new Set(DRUGS.map(d => d.sci));
  const pairId = (a, b) => 'IX:' + [a, b].sort().join('|');
  const built = new Set(DUPLICATE_RULES.map(r => 'DUP:' + r.id));
  DRUGS.forEach(d => (d.interactions || []).forEach(i => { if (known.has(i.with)) built.add(pairId(d.sci, i.with)); }));
  const ledger = new Set();
  for (const r of RULES.rules) {
    if (r.kind !== 'interaction') problems.push(`rule ${r.id}: only interaction rules can be defined in the ledger`);
    if (!known.has(r.a) || !known.has(r.b)) problems.push(`rule ${r.id}: both drugs must be in the reference`);
    if (r.id !== pairId(r.a, r.b)) problems.push(`rule ${r.id}: id must be ${pairId(r.a, r.b)}`);
    if (built.has(r.id)) problems.push(`rule ${r.id}: already in the reference`);
    if (!['warning', 'serious', 'critical'].includes(r.severity)) problems.push(`rule ${r.id}: bad severity`);
    if (!r.note || !r.note.en || !r.note.ar) problems.push(`rule ${r.id}: note needs both languages`);
    ledger.add(r.id);
  }
  let last = RULES.baseline.at;
  for (const e of RULES.events) {
    if (!built.has(e.rule) && !ledger.has(e.rule)) problems.push(`event for unknown rule ${e.rule}`);
    if (!['proposed', 'review', 'approved', 'retired'].includes(e.state)) problems.push(`event ${e.rule}: bad state ${e.state}`);
    if (e.state === 'approved' && !['note', 'warn', 'stop'].includes(e.tier)) problems.push(`event ${e.rule}: approval needs a tier`);
    if (e.at < last) problems.push(`event ${e.rule}: events must be in date order`);
    last = e.at;
  }
  for (const id of Object.keys(RULES.overrides30d)) if (!built.has(id) && !ledger.has(id)) problems.push(`override count for unknown rule ${id}`);
}
const rulesBlock = G_BEGIN + '\n' +
  'const RULE_CURATOR = ' + JSON.stringify(RULES.curator) + ';\n' +
  'const RULE_BASELINE = ' + JSON.stringify(RULES.baseline) + ';\n' +
  'const LEDGER_RULES = [\n' + RULES.rules.map(r => '  ' + JSON.stringify(r)).join(',\n') + '\n];\n' +
  'const RULE_EVENTS = [\n' + RULES.events.map(e => '  ' + JSON.stringify(e)).join(',\n') + '\n];\n' +
  'const RULE_OVERRIDES_30D = ' + JSON.stringify(RULES.overrides30d) + ';\n' + G_END;
const catalogueBlock = C_BEGIN + '\n' +
  'const CONTROL_SOURCE = ' + JSON.stringify(CONTROLLED.source) + ';\n' +
  'const CONTROL_LIST = [\n' + CONTROLLED.substances.map(c => '  ' + JSON.stringify(c)).join(',\n') + '\n];\n' +
  'const REG_PRODUCT_FIELDS = ' + JSON.stringify(REG_PRODUCTS.fields) + ';\n' +
  'const REG_PRODUCT_ROWS = [\n' + REG_PRODUCTS.rows.map(r => '  ' + JSON.stringify(r)).join(',\n') + '\n];\n' +
  'const EDL_GENERICS = [\n' + EDL_GENERICS.map(g => '  ' + JSON.stringify(g)).join(',\n') + '\n];\n' + C_END;
if (problems.length) {
  console.error('the Ministry sources did not validate:\n  ' + problems.join('\n  '));
  process.exit(1);
}

/* One product per line, for the same reason. */
const productBlock = P_BEGIN + '\n' +
  'const MAPPING_STATES = ' + JSON.stringify(MAPPING_STATES) + ';\n' +
  'const PRODUCTS = [\n' +
  PRODUCTS.map(p => '  ' + JSON.stringify(p)).join(',\n') +
  '\n];\n' + P_END;

function newest(dir, prefix) {
  const found = readdirSync(join(root, dir))
    .filter(f => f.startsWith(prefix) && f.endsWith('.html'))
    /* v0.0012.1 — an amendment carries a third number, and outranks the
       version it amends. */
    .map(f => ({ f, v: (f.match(/_v(\d+)\.(\d+)(?:\.(\d+))?\.html$/) || [0, 0, 0, 0]).slice(1).map(x => Number(x || 0)) }))
    .sort((a, b) => (b.v[0] - a.v[0]) || (b.v[1] - a.v[1]) || (b.v[2] - a.v[2]));
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
  const sa = out.indexOf(S_BEGIN), sb = out.indexOf(S_END);
  if (sa < 0 || sb < 0) { console.error(`${rel}: no ${S_BEGIN} … ${S_END} markers — nothing written`); process.exit(1); }
  out = out.slice(0, sa) + sourcesBlock + out.slice(sb + S_END.length);
  /* Only a build that asks for the register gets it. */
  const ra = out.indexOf(R_BEGIN), rb = out.indexOf(R_END);
  if (ra >= 0 && rb >= 0) out = out.slice(0, ra) + registerBlock + out.slice(rb + R_END.length);
  const ca = out.indexOf(C_BEGIN), cb = out.indexOf(C_END);
  if (ca >= 0 && cb >= 0) out = out.slice(0, ca) + catalogueBlock + out.slice(cb + C_END.length);
  const ga = out.indexOf(G_BEGIN), gb = out.indexOf(G_END);
  if (ga < 0 || gb < 0) { console.error(`${rel}: no ${G_BEGIN} … ${G_END} markers — nothing written`); process.exit(1); }
  out = out.slice(0, ga) + rulesBlock + out.slice(gb + G_END.length);
  writeFileSync(path, out);
  console.log(`${rel}: ${DRUGS.length} drugs and ${PRODUCTS.length} products embedded` + (ra >= 0 ? `, and the register (${REGISTER.length} rows)` : '') +
    (ca >= 0 ? `, and the catalogue (${REG_PRODUCTS.rows.length} registered products, ${EDL_GENERICS.length} EDL generics)` : '') +
    `, and the rules ledger (${RULES.rules.length} ledger rules, ${RULES.events.length} events)`);
}
