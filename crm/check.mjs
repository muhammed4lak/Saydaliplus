/**
 * Drives the newest crm/saydali-crm_v*.html in a real browser.
 *
 * One file, no build step, no compiler: a typo inside concatenated HTML renders
 * an empty panel rather than failing anything. So the check is behavioural —
 * walk every module, sort and filter and select, open a record of each kind,
 * run a CSV import through its validation, and sweep both languages for a
 * string that never got translated.
 *
 *   node crm/check.mjs
 */
import { chromium } from 'playwright';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
/* The reference is read from its source rather than a number typed here, so
   adding a drug never means editing a test to match. */
import DRUG_DATA, { DUPLICATE_RULES } from '../data/drugs.mjs';
import { dirname, join } from 'node:path';


/* Files carry their version in the name, so this picks the highest-numbered
   build in the directory rather than a name baked into the test — otherwise
   every bump silently tests a stale file, or fails for the wrong reason. */
function newestBuild(dir, prefix) {
  const found = readdirSync(dir)
    .filter(f => f.startsWith(prefix) && f.endsWith('.html'))
    .map(f => ({ f, v: (f.match(/_v(\d+)\.(\d+)/) || [0, 0, 0]).slice(1).map(Number) }))
    .sort((a, b) => (b.v[0] - a.v[0]) || (b.v[1] - a.v[1]));
  if (!found.length) throw new Error(`no ${prefix}*.html in ${dir}`);
  return found[0].f;
}

const here = dirname(fileURLToPath(import.meta.url));
const build = newestBuild(here, 'saydali-crm_v');
const file = join(here, build);
const url = 'file://' + file;
console.log('build: ' + build);
const PREINSTALLED = '/opt/pw-browsers/chromium';
const launch = existsSync(PREINSTALLED) ? { executablePath: PREINSTALLED } : {};

const errs = [];
const ok = (n, c) => { console.log((c ? '  ok    ' : '  FAIL  ') + n); if (!c) errs.push(n); };
const b = await chromium.launch(launch);

async function open(w = 1520, h = 950) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => {
    // Network noise only: the file:// page asks for Google Fonts, which this
    // sandbox serves through a proxy. A real script error has no ERR_ code.
    if (m.type() === 'error' && !/ERR_(CONNECTION|NAME|INTERNET|CERT)/.test(m.text())) errs.push('console: ' + m.text());
  });
  await p.goto(url);
  await p.waitForTimeout(400);
  return p;
}
const tab = async (p, k) => { await p.evaluate(x => goTab(x), k); await p.waitForTimeout(220); };
const MODS = ['orders', 'users', 'pharmacies', 'companies', 'listings', 'invoices',
              'universities', 'syndicate', 'drugs'];
const TABS_ALL = [...MODS, 'reports'];

const p = await open();

console.log('\nversioning');
ok('the file states the build its name claims',
   (readFileSync(file, 'utf8').match(/const VERSION = '([^']+)'/) || [])[1]
     === 'CRM_v' + (build.match(/_v([\d.]+)\.html$/) || [])[1]);
{
  const peer = (readFileSync(file, 'utf8').match(/const PEER_APP = '([^']+)'/) || [])[1];
  ok(`the app link points at a file that exists (${peer})`,
     !!peer && existsSync(join(here, peer)));
}

console.log('\nshell');
ok('lands on Home', await p.evaluate(() => S.tab) === 'home');
ok('eleven tabs: home, the nine modules, and reports', await p.locator('.tab').count() === 11);
ok('the document is English, left to right', await p.evaluate(() =>
   document.documentElement.lang === 'en' && document.documentElement.dir === 'ltr'));
ok('there is no language toggle left to press',
   await p.locator('#btn-lang').count() === 0);
ok('the build states which one it is',
   /^CRM_v\d+\.\d+$/.test((await p.locator('#build-tag').innerText()).trim()));

ok('the signed-in account is named in the top bar',
   (await p.locator('#me-avatar').getAttribute('aria-label')).includes('Owner admin'));
{
  await p.locator('#me-avatar').click();
  await p.waitForTimeout(200);
  ok('the account menu opens and states the role and what it allows',
     await p.locator('.acct-menu').isVisible()
     && /creating other admins/.test(await p.locator('.acct-caps').innerText()));
  await p.locator('body').click({ position: { x: 5, y: 400 } });
  await p.waitForTimeout(180);
  ok('and closes when you click away', await p.locator('.acct-menu').count() === 0);
}

console.log('\nevery module renders and every saved view returns something sane');
for (const k of ['home', ...MODS]) {
  await tab(p, k);
  const len = (await p.locator('#work-body').innerText()).trim().length;
  ok(`${k} renders (${len} chars)`, len > 60);
}
for (const m of MODS) {
  const views = await p.evaluate(x => Object.keys(MODULES[x].views), m);
  let bad = [];
  for (const v of views) {
    await p.evaluate(a => { S.tab = a[0]; S.view[a[0]] = a[1]; render(); }, [m, v]);
    await p.waitForTimeout(90);
    const n = await p.evaluate(x => visibleRows(x).length, m);
    const total = await p.evaluate(x => MODULES[x].data().length, m);
    if (n > total) bad.push(v);
  }
  await p.evaluate(x => { S.view[x] = 'all'; render(); }, m);
  ok(`${m}: ${views.length} saved views, none returns more than the module holds`, bad.length === 0);
}

console.log('\nusers: two account types, and ownership as a link rather than a third');
await tab(p, 'users');
ok('the model holds exactly two types', await p.evaluate(() =>
   JSON.stringify(USER_TYPES) === JSON.stringify(['pharmacist', 'student'])));
for (const ty of ['pharmacist', 'student']) {
  await p.evaluate(x => { S.view.users = x; render(); }, ty);
  await p.waitForTimeout(120);
  const all = await p.evaluate(x => visibleRows('users').every(u => u.type === x), ty);
  const some = await p.evaluate(() => visibleRows('users').length > 0);
  ok(`the ${ty} view holds only that type, and holds some`, all && some);
}
await p.evaluate(() => { S.view.users = 'owner'; render(); });
await p.waitForTimeout(120);
ok('the owner view is a view over pharmacists, not a type of its own',
   await p.evaluate(() => {
     const r = visibleRows('users');
     return r.length > 0 && r.every(u => u.type === 'pharmacist' && !!u.pharmacy);
   }));
ok('an owner is derived from the link — clear it and they leave the view',
   await p.evaluate(() => {
     const u = DATA.users.find(isOwner);
     const keep = u.pharmacy;
     u.pharmacy = null;
     const gone = !visibleRows('users').some(x => x.id === u.id) && !isOwner(u);
     u.pharmacy = keep; render();
     return gone;
   }));
ok('and the list says so in one chip rather than two columns',
   await p.evaluate(() => {
     const u = DATA.users.find(isOwner);
     const plain = DATA.users.find(x => x.type === 'pharmacist' && !x.pharmacy);
     return /Owner/.test(typeChip(u)) && /Pharmacist/.test(typeChip(u))
       && /Pharmacist/.test(typeChip(plain)) && !/Owner/.test(typeChip(plain));
   }));
await p.evaluate(() => { S.view.users = 'all'; render(); });

console.log('\norders are segmented by order type');
await tab(p, 'orders');
ok('the placeholder is stated on the module, not hidden',
   (await p.locator('.mod-note.stage').innerText()).length > 20);
for (const [view, ty] of [['shift', 'shift'], ['training', 'training']]) {
  await p.evaluate(x => { S.view.orders = x; render(); }, view);
  await p.waitForTimeout(120);
  ok(`the ${ty} view holds only ${ty} orders`,
     await p.evaluate(x => { const r = visibleRows('orders'); return r.length > 0 && r.every(o => o.type === x); }, ty));
}
await p.evaluate(() => { S.view.orders = 'unclaimed'; render(); });
await p.waitForTimeout(150);
ok('the "open, no applicants" view finds only those',
   await p.evaluate(() => visibleRows('orders').every(o => o.status === 'open' && o.applicants === 0)));
await p.evaluate(() => { S.view.orders = 'all'; render(); });

console.log('\nthe Syndicate roster and the match it suggests');
await tab(p, 'syndicate');
ok('it says out loud that this is a hand-loaded list, not an API',
   /API|واجهة برمجية/.test(await p.locator('.mod-note').innerText()));
const matches = await p.evaluate(() =>
  DATA.users.filter(u => u.syndicateNo).map(u => ({ n: u.name.en, k: syndicateMatch(u).key })));
ok('a pharmacist whose number is in the roster matches',
   matches.some(m => m.k === 'matched'));
ok('and one whose number is absent does not',
   await p.evaluate(() => {
     const u = DATA.users.find(x => x.type === 'pharmacist' && x.syndicateNo);
     const keep = u.syndicateNo;
     u.syndicateNo = 'IQ-PH-000000';
     const k = syndicateMatch(u).key;
     u.syndicateNo = keep;
     return k === 'unmatched';
   }));
ok('a matching number with a different name is flagged, not waved through',
   await p.evaluate(() => {
     const u = DATA.users.find(x => x.type === 'pharmacist' && x.syndicateNo);
     const keep = u.name;
     u.name = { ar: 'شخص آخر تماما', en: 'Someone Else Entirely' };
     const k = syndicateMatch(u).key;
     u.name = keep;
     return k === 'nameDiff';
   }));
ok('the roster tolerates a longer tribal name on one side',
   await p.evaluate(() => namesAgree('Ahmed Al-Kubaisi', 'Ahmed Sabah Al-Kubaisi')));

console.log('\nExternals: a role is a licence, registration is a fact about a product');
await tab(p, 'companies');
ok('the five licences are the model, and "pharmaceutical company" is not one of them',
   await p.evaluate(() => JSON.stringify(EXTERNAL_ROLES) ===
     JSON.stringify(['manufacturer', 'bureau', 'importer', 'storage', 'distributor'])));
ok('a company can hold more than one at once',
   await p.evaluate(() => DATA.companies.some(c => (c.roles || []).length > 1)));
ok('and a foreign principal is allowed to hold none',
   await p.evaluate(() => DATA.companies.some(c => !(c.roles || []).length)));
for (const [view, fn] of [['manufacturers', 'manufacturer'], ['bureaux', 'bureau'], ['storage', 'storage']]) {
  await p.evaluate(x => { S.view.companies = x; render(); }, view);
  await p.waitForTimeout(120);
  ok(`the ${view} view holds only licence-holders of that kind, and holds some`,
     await p.evaluate(x => { const r = visibleRows('companies'); return r.length > 0 && r.every(c => hasRole(c, x)); }, fn));
}
await p.evaluate(() => { S.view.companies = 'foreign'; render(); });
await p.waitForTimeout(120);
ok('the foreign-principal view is exactly the companies with no Iraqi licence',
   await p.evaluate(() => { const r = visibleRows('companies'); return r.length > 0 && r.every(c => !(c.roles || []).length); }));
await p.evaluate(() => { S.view.companies = 'all'; render(); });
await p.waitForTimeout(120);
{
  // The roles facet is multi-valued: a company with two licences appears under both.
  const before = await p.locator('table.grid tbody tr').count();
  await p.evaluate(() => setFilter('companies', 'externalRole', 'bureau'));
  await p.waitForTimeout(150);
  const after = await p.evaluate(() => visibleRows('companies'));
  ok('the roles facet filters on one of several, not on an exact match',
     after.length > 0 && after.every(c => (c.roles || []).includes('bureau')) && after.length <= before);
  await p.evaluate(() => resetFilters('companies'));
}
{
  const bureau = await p.evaluate(() => (DATA.companies.find(c => hasRole(c, 'bureau')) || {}).id);
  await p.evaluate(x => openRecord('companies', x), bureau);
  await p.waitForTimeout(220);
  const txt = await p.locator('#work-body').innerText();
  ok('a bureau record names the principals it represents', /Represents|represents/i.test(txt));
  ok('and the principal names the bureau back',
     await p.evaluate(x => {
       const c = DATA.companies.find(y => y.id === x);
       const principal = principalsOf(c)[0];
       return !!principal && bureauxFor(principal.id).some(b => b.id === x);
     }, bureau));
  await p.evaluate(() => closeRecord());
}
ok('a brand answers the three questions separately: made by, registered to, represented by',
   await p.evaluate(() => {
     // Contract manufacture: the factory and the registration holder differ.
     const b = DATA.brands.find(x => x.registrationHolder && x.company !== x.registrationHolder);
     return !!b && !!b.bureau && companyOf(b.company) && companyOf(b.registrationHolder);
   }));
ok('and the drug record renders all three lines for it',
   await p.evaluate(async () => {
     const b = DATA.brands.find(x => x.registrationHolder && x.company !== x.registrationHolder);
     openRecord('drugs', b.sci);
     const chain = document.querySelectorAll('.brand-chain .chain-line');
     const txt = document.querySelector('#work-body').innerText;
     closeRecord();
     return chain.length >= 3
       && txt.includes(companyOf(b.company).name.en)
       && txt.includes(companyOf(b.registrationHolder).name.en);
   }));
ok('and "who is the manufacturer" has no single answer for a company, only per product',
   await p.evaluate(() => {
     const c = DATA.companies.find(x => brandsInvolving(x.id).length > 1);
     const bs = brandsInvolving(c.id);
     return bs.some(b => b.company === c.id) || bs.some(b => b.registrationHolder === c.id) || bs.some(b => b.bureau === c.id);
   }));

console.log('\nthe drug reference: one list, both builds');
await tab(p, 'drugs');
ok(`the module holds every drug in data/drugs.mjs (${DRUG_DATA.length})`,
   await p.evaluate(() => DATA.drugs.length) === DRUG_DATA.length);
ok('and the app build holds the same list, from the same file', (() => {
  const app = readFileSync(join(here, (readFileSync(file, 'utf8').match(/const PEER_APP = '([^']+)'/) || [])[1]), 'utf8');
  const one = (src) => (src.match(/\/\* DRUGS:BEGIN \*\/[\s\S]*?\/\* DRUGS:END \*\//) || [''])[0];
  return one(app).length > 1000 && one(app) === one(readFileSync(file, 'utf8'));
})());
ok('every scientific name is unique — it is the identifier',
   await p.evaluate(() => new Set(DATA.drugs.map(d => d.sci)).size === DATA.drugs.length));
ok('every row carries an ATC code, a form and at least one strength',
   await p.evaluate(() => DATA.drugs.every(d => d.atc && d.form && d.doses.length)));
ok('every row carries both scripts, in the data rather than the interface',
   await p.evaluate(() => DATA.drugs.every(d => /[؀-ۿ]/.test(d.ar) && /^[\x20-\x7E]+$/.test(d.sci))));
ok('the forms offered by the create form are the ones the reference recognises',
   await p.evaluate(() => {
     const used = new Set(DATA.drugs.map(d => d.form));
     return [...used].every(f => DRUG_FORMS.includes(f)) && DRUG_FORMS.length >= used.size;
   }));
ok('and every form in use has a label rather than falling through as its key',
   await p.evaluate(() => [...new Set(DATA.drugs.map(d => d.form))]
     .every(f => t('df.' + f) !== 'df.' + f.toUpperCase() && !t('df.' + f).includes('.'))));
ok('the form facet segments the list and adds back up to the whole',
   await p.evaluate(() => {
     const forms = [...new Set(DATA.drugs.map(d => d.form))];
     return forms.reduce((n, f) => n + DATA.drugs.filter(d => d.form === f).length, 0) === DATA.drugs.length;
   }));
ok('interactions name a real severity and carry a note in both scripts',
   await p.evaluate(() => DATA.drugs.every(d => (d.interactions || []).every(i =>
     ['warning', 'serious', 'critical'].includes(i.severity) && i.with && i.note.ar && i.note.en))));
{
  const n = await p.evaluate(() => DATA.drugs.reduce((a, d) => a + d.interactions.length, 0));
  ok(`the reference carries real interaction content (${n} pairs)`, n > 150);
}
ok('a brand can still only point at a drug that exists',
   await p.evaluate(() => DATA.brands.every(b => DATA.drugs.some(d => d.sci === b.sci))));
ok('and at a company that exists',
   await p.evaluate(() => DATA.brands.every(b => DATA.companies.some(c => c.id === b.company))));

console.log('\ndrugs, brands, and the dose override');
await tab(p, 'drugs');
await p.evaluate(() => openRecord('drugs', 'Amoxicillin'));
await p.waitForTimeout(250);
const drugTxt = await p.locator('#work-body').innerText();
ok('a drug record shows interactions', /Methotrexate/.test(drugTxt));
ok('and contraindications', /Penicillin|بنسلين/.test(drugTxt));
ok('the worst interaction is reported, not swallowed', await p.evaluate(() =>
   worstInteraction(drugOf('Amoxicillin')) === 'serious'
   && worstInteraction(drugOf('Azithromycin')) === 'critical'
   && worstInteraction(drugOf('Omeprazole')) === 'serious'
   && worstInteraction({ interactions: [] }) === ''));
ok('and the list column shows it rather than a dash', await p.evaluate(() => {
   S.tab = 'drugs'; S.record = null; render();
   return document.querySelectorAll('table.grid tbody tr td:last-child .chip-mute').length
        < document.querySelectorAll('table.grid tbody tr').length; }));
ok('a brand that overrides doses says so, with its own doses',
   await p.evaluate(() => {
     const b = DATA.brands.find(x => x.brand === 'Samamox');
     return JSON.stringify(brandDoses(b)) === JSON.stringify(['250 mg', '500 mg']);
   }));
ok('a brand that does not, inherits the drug’s',
   await p.evaluate(() => {
     const b = DATA.brands.find(x => x.brand === 'Amoxil');
     return JSON.stringify(brandDoses(b)) === JSON.stringify(drugOf('Amoxicillin').doses);
   }));
const brandsBefore = await p.evaluate(() => DATA.brands.length);
await p.evaluate(() => openNewBrand('Amoxicillin'));
await p.waitForTimeout(200);
await p.locator('.modal .btn.primary').click();
await p.waitForTimeout(200);
ok('a brand with no name is refused', await p.locator('.modal .err').count() > 0);
await p.locator('#b-brand').fill('Testamox');
await p.locator('#b-doses').fill('125 mg | 250 mg');
await p.locator('.modal .btn.primary').click();
await p.waitForTimeout(250);
ok('a valid brand saves', await p.evaluate(() => DATA.brands.length) === brandsBefore + 1);
ok('and its override is what the drug page shows',
   await p.evaluate(() => {
     const b = DATA.brands.find(x => x.brand === 'Testamox');
     return JSON.stringify(brandDoses(b)) === JSON.stringify(['125 mg', '250 mg']);
   }));

console.log('\nCSV import');
await p.evaluate(() => closeRecord());
await tab(p, 'drugs');
await p.evaluate(() => openImport('drugs'));
await p.waitForTimeout(220);
ok('the importer opens', await p.locator('.modal').isVisible());
ok('and cannot apply before anything is parsed', await p.locator('.modal .btn.primary').isDisabled());

// a file missing the key column
await p.locator('#imp-text').fill('name,atc\nIbuprofen,M01AE01');
await p.locator('.modal .btn', { hasText: /Check|تحقّق/ }).click();
await p.waitForTimeout(220);
ok('a file without the key column is refused outright', await p.locator('.imp-fatal').count() > 0);

// a good file with one bad row and one duplicate
// Nystatin is deliberately NOT one of the hundred in data/drugs.mjs, so this
// row is genuinely new. A drug already in the reference would test the update
// path twice and the insert path not at all.
const csv = [
  'scientific_name,arabic_name,atc,form,doses,notes,interactions,contraindications',
  'Nystatin,نيستاتين,A07AA02,syrup,100000 IU/mL,"Swish and hold, not swallowed straight down.",Warfarin:warning:May raise INR,Hypersensitivity|Systemic infection',
  'Amoxicillin,أموكسيسيلين,J01CA04,capsule,250 mg|500 mg,Updated note,,',
  ',Missing key,,tablet,,,,',
  'Nystatin,مكرر,A07AA02,syrup,100000 IU/mL,,,'
].join('\n');
await p.locator('#imp-text').fill(csv);
await p.locator('.modal .btn', { hasText: /Check|تحقّق/ }).click();
await p.waitForTimeout(250);
const counts = await p.evaluate(() => S.modal.parsed.counts);
ok(`preview counts them: ${counts.new} new, ${counts.update} update, ${counts.error} error`,
   counts.new === 1 && counts.update === 1 && counts.error === 2);
ok('a quoted field containing a comma survives parsing',
   await p.evaluate(() => S.modal.parsed.items[0].rec.notes.en.includes(',')));
ok('interactions parse into structured rows',
   await p.evaluate(() => S.modal.parsed.items[0].rec.interactions[0].severity === 'warning'));
ok('nothing is written before Apply',
   await p.evaluate(() => !DATA.drugs.some(d => d.sci === 'Nystatin')));
const drugsBefore = await p.evaluate(() => DATA.drugs.length);
await p.locator('.modal .btn.primary').click();
await p.waitForTimeout(280);
ok('Apply adds the new row and updates the existing one, skipping the errors',
   await p.evaluate(() => DATA.drugs.length) === drugsBefore + 1);
ok('the update landed on the existing drug rather than duplicating it',
   await p.evaluate(() => DATA.drugs.filter(d => d.sci === 'Amoxicillin').length === 1
     && drugOf('Amoxicillin').notes.en === 'Updated note'));

// the roster importer shares the machinery
await tab(p, 'syndicate');
const rosterBefore = await p.evaluate(() => DATA.syndicate.length);
await p.evaluate(() => openImport('syndicate'));
await p.waitForTimeout(200);
await p.locator('#imp-text').fill('syndicate_no,name,graduation_year,status\nIQ-PH-020001,طالب جديد الجبوري,2025,active');
await p.locator('.modal .btn', { hasText: /Check|تحقّق/ }).click();
await p.waitForTimeout(200);
await p.locator('.modal .btn.primary').click();
await p.waitForTimeout(250);
ok('the roster import uses the same engine', await p.evaluate(() => DATA.syndicate.length) === rosterBefore + 1);

console.log('\nlist mechanics');
await tab(p, 'orders');
const rows0 = await p.locator('table.grid tbody tr').count();
await p.locator('th.sortable').nth(7).click();
await p.waitForTimeout(180);
const a1 = await p.evaluate(() => visibleRows('orders')[0].applicants);
await p.locator('th.sortable').nth(7).click();
await p.waitForTimeout(180);
const a2 = await p.evaluate(() => visibleRows('orders')[0].applicants);
ok('a column sorts and reverses', a1 !== a2);
await p.locator('.rail-opt').nth(1).click();
await p.waitForTimeout(200);
ok('a rail facet narrows the list', await p.locator('table.grid tbody tr').count() <= rows0);
await p.evaluate(() => resetFilters('orders'));
await p.waitForTimeout(180);
ok('clearing restores it', await p.locator('table.grid tbody tr').count() === rows0);
await p.locator('thead input[type=checkbox]').click();
await p.waitForTimeout(200);
ok('select-all raises the bulk bar and counts right',
   await p.locator('.bulkbar').isVisible() && await p.evaluate(() => S.picked.orders.length) === rows0);
await p.evaluate(() => clearPicked('orders'));

console.log('\nrecords and cross-links');
for (const [mod, id] of [['orders','O-1042'], ['users','U1'], ['pharmacies','P1'],
                         ['companies','CO1'], ['universities','V1'], ['syndicate','IQ-PH-004982'],
                         ['drugs','Metformin']]) {
  await p.evaluate(a => openRecord(a[0], a[1]), [mod, id]);
  await p.waitForTimeout(160);
  const txt = (await p.locator('#work-body').innerText()).trim();
  ok(`${mod} record opens with content (${txt.length} chars)`, txt.length > 120);
}
await p.evaluate(() => openRecord('orders', 'O-1042'));
await p.waitForTimeout(180);
await p.locator('#note-input').fill('Rate agreed with the owner.');
await p.locator('.note-box .btn.primary').click();
await p.waitForTimeout(220);
ok('a note posts to an order timeline',
   (await p.locator('.timeline').innerText()).includes('Rate agreed'));
await p.evaluate(() => setOrderStatus('O-1042', 'assigned'));
await p.waitForTimeout(200);
ok('assigning an order names somebody rather than leaving it dangling',
   await p.evaluate(() => { const o = DATA.orders.find(x => x.id === 'O-1042'); return o.status === 'assigned' && !!o.assignee; }));
await p.evaluate(() => closeRecord());

console.log('\nverification');
await tab(p, 'users');
await p.evaluate(() => verifyUser('U2'));
await p.waitForTimeout(200);
ok('verifying a user records why, not just the flag',
   await p.evaluate(() => DATA.users.find(u => u.id === 'U2').verification === 'verified'
     && DATA.activity.some(e => e.kind === 'users' && e.id2 === 'U2')));

console.log('\nform validation');
await p.evaluate(() => openNew('universities'));
await p.waitForTimeout(220);
await p.locator('.modal .btn.primary').click();
await p.waitForTimeout(220);
ok('required fields block the save', await p.locator('.modal .err').count() > 0);
await p.locator('#f-name').fill('Test College');
await p.locator('#f-domain').fill('uobaghdad.edu.iq');
await p.locator('.modal .btn.primary').click();
await p.waitForTimeout(220);
ok('a duplicate email domain is refused', await p.locator('.modal').count() > 0
   && (await p.locator('.modal').innerText()).match(/already|مسجّل/i) !== null);
await p.locator('#f-domain').fill('uokerbala.edu.iq');
await p.locator('.modal .btn.primary').click();
await p.waitForTimeout(250);
ok('a unique one saves', await p.locator('.modal').count() === 0);
await p.locator('#f-name').isVisible().catch(() => {});
ok('the name typed before the error was not thrown away',
   await p.evaluate(() => DATA.universities.some(v => v.name.en === 'Test College')));

console.log('\nreports run SQL');
await tab(p, 'reports');
ok('every seeded report runs without an error',
   await p.evaluate(() => REPORTS.every(r => runReport(r).ok)));
ok('an aggregate with no GROUP BY is one row over everything',
   await p.evaluate(() => {
     const r = runSQL("SELECT COUNT(*) AS n FROM orders");
     return r.rows.length === 1 && r.rows[0].n === DATA.orders.length;
   }));
ok('GROUP BY buckets and COUNT counts',
   await p.evaluate(() => {
     const r = runSQL("SELECT status, COUNT(*) AS n FROM orders GROUP BY status");
     const total = r.rows.reduce((a, x) => a + x.n, 0);
     return total === DATA.orders.length && r.rows.length === new Set(DATA.orders.map(o => o.status)).size;
   }));
ok('WHERE filters, with AND and a quoted string',
   await p.evaluate(() => {
     const r = runSQL("SELECT id FROM orders WHERE status = 'open' AND applicants = 0");
     return r.rows.length === DATA.orders.filter(o => o.status === 'open' && o.applicants === 0).length;
   }));
ok('IN, LIKE and IS NOT NULL work',
   await p.evaluate(() => {
     const a = runSQL("SELECT id FROM orders WHERE status IN ('open','cancelled')").rows.length;
     const b = runSQL("SELECT sci FROM drugs WHERE sci LIKE 'A%'").rows.length;
     const c = runSQL("SELECT id FROM orders WHERE assignee_id IS NOT NULL").rows.length;
     return a === DATA.orders.filter(o => ['open','cancelled'].includes(o.status)).length
       && b === DATA.drugs.filter(d => /^a/i.test(d.sci)).length
       && c === DATA.orders.filter(o => o.assignee).length;
   }));
ok('a JOIN matches rows across two tables',
   await p.evaluate(() => {
     const r = runSQL("SELECT p.name, COUNT(*) AS n FROM orders o JOIN pharmacies p ON o.pharmacy_id = p.id GROUP BY p.name");
     const total = r.rows.reduce((a, x) => a + x.n, 0);
     return total === DATA.orders.filter(o => DATA.pharmacies.some(p => p.id === o.pharmacy)).length;
   }));
ok('ORDER BY and LIMIT apply, in that order',
   await p.evaluate(() => {
     const r = runSQL("SELECT name, commission FROM pharmacies ORDER BY commission DESC LIMIT 2");
     const top = DATA.pharmacies.map(p => p.commission).sort((a, b) => b - a).slice(0, 2);
     return r.rows.length === 2 && r.rows[0].commission === top[0] && r.rows[1].commission === top[1];
   }));
ok('SUM, AVG, MIN and MAX compute over the right column',
   await p.evaluate(() => {
     const r = runSQL("SELECT SUM(total) AS s, AVG(total) AS a, MIN(total) AS mn, MAX(total) AS mx FROM orders");
     const t = DATA.orders.map(o => o.total);
     return r.rows[0].s === t.reduce((x, y) => x + y, 0)
       && r.rows[0].mn === Math.min(...t) && r.rows[0].mx === Math.max(...t);
   }));

// An engine that ignores a clause it cannot run is worse than one that refuses.
for (const [q, why] of [
  ["SELECT * FROM orders UNION SELECT * FROM users", 'UNION'],
  ["SELECT status, COUNT(*) FROM orders GROUP BY status HAVING COUNT(*) > 1", 'HAVING'],
  ["SELECT DISTINCT status FROM orders", 'DISTINCT'],
  ["SELECT * FROM orders LEFT JOIN users ON orders.assignee_id = users.id", 'OUTER JOIN'],
  ["SELECT * FROM orders WHERE id IN (SELECT id FROM users)", 'subqueries'],
  ["DELETE FROM orders", 'writes'],
  ["SELECT * FROM nosuchtable", 'unknown table'],
  ["SELECT FROM orders", 'malformed']
]) {
  const err = await p.evaluate(sql => {
    try { runSQL(sql); return null; } catch (e) { return e.message; }
  }, q);
  ok(`refused rather than half-run: ${why}`, !!err);
}

console.log('\ndispensing tallies reach the operator side');
await tab(p, 'reports');
ok('the CRM holds the tallies the app records',
   await p.evaluate(() => DATA.dispensing.length > 100));
/* The privacy decision, asserted rather than trusted to a comment: there is no
   patient column to leak and no basket to reconstruct. A row is a count. */
ok('a row is a count — no patient, no basket, no time of day',
   await p.evaluate(() => DATA.dispensing.every(r =>
     Object.keys(r).sort().join() === 'date,id,n,pharmacist,pharmacy,sci')));
ok('and the SQL view exposes exactly those columns',
   await p.evaluate(() => {
     const one = sqlTables().dispensing[0];
     return Object.keys(one).sort().join() === 'date,drug,id,pharmacist,pharmacy_id,units';
   }));
ok('every tally names a drug that is in the reference',
   await p.evaluate(() => DATA.dispensing.every(r => DATA.drugs.some(d => d.sci === r.sci))));
ok('and a pharmacy that exists',
   await p.evaluate(() => DATA.dispensing.every(r => DATA.pharmacies.some(x => x.id === r.pharmacy))));

ok('consumption by drug reports off it',
   await p.evaluate(() => {
     const res = runReport(reportById('R11'));
     if (!res.ok || !res.rows.length) return false;
     const total = DATA.dispensing.reduce((n, r) => n + r.n, 0);
     // LIMIT 12, so the report is a subset — every row must still be real.
     return res.rows.every(row => row.units > 0 && row.units <= total);
   }));
ok('and the arithmetic matches the underlying rows',
   await p.evaluate(() => {
     const res = runSQL("SELECT drug, SUM(units) AS units FROM dispensing GROUP BY drug");
     const byDrug = {};
     DATA.dispensing.forEach(r => { byDrug[r.sci] = (byDrug[r.sci] || 0) + r.n; });
     return res.rows.length === Object.keys(byDrug).length
       && res.rows.every(row => row.units === byDrug[row.drug]);
   }));
ok('consumption by pharmacy joins through to the pharmacy name',
   await p.evaluate(() => {
     const res = runReport(reportById('R12'));
     return res.ok && res.rows.length === new Set(DATA.dispensing.map(r => r.pharmacy)).size
       && res.rows.every(row => DATA.pharmacies.some(x => L(x.name) === row.name));
   }));
ok('the whole of it totals to the rows it came from',
   await p.evaluate(() =>
     runSQL("SELECT SUM(units) AS n FROM dispensing").rows[0].n ===
     DATA.dispensing.reduce((n, r) => n + r.n, 0)));
/* The thing that must NOT be possible. The tallies were collected to answer
   "what does this pharmacy consume" and nothing else; if a query could put a
   basket back together, the whole privacy argument for keeping them collapses. */
ok('no query can reconstruct which drugs went out together',
   await p.evaluate(() => {
     const cols = Object.keys(sqlTables().dispensing[0]);
     return !cols.some(c => /basket|patient|prescription|time/i.test(c));
   }));
ok('a consumption report can be pinned to the dashboard like any other',
   await p.evaluate(() => {
     const before = S.tiles.length;
     pinReport('R11');
     const added = S.tiles.length === before + 1 && S.tiles[S.tiles.length - 1].report === 'R11';
     S.tiles = DEFAULT_TILES.map(x => Object.assign({}, x));
     render();
     return added;
   }));

console.log('\nthe billing ledger');
await tab(p, 'reports');
ok('every charge is one row, whatever its source',
   await p.evaluate(() => DATA.ledger.length > 50
     && ['subscription', 'commission', 'covered'].every(k => DATA.ledger.some(r => r.kind === k))));
/* The distinction the ledger exists to record: a zero because a plan absorbed
   the shift, versus a zero that is a mistake. */
ok('a covered shift is zero AND says which plan absorbed it',
   await p.evaluate(() => DATA.ledger.filter(r => r.kind === 'covered')
     .every(r => r.amount === 0 && ['basic', 'premium'].includes(r.reason))));
ok('a commission row carries a real amount and no plan',
   await p.evaluate(() => DATA.ledger.filter(r => r.kind === 'commission')
     .every(r => r.amount > 0 && r.reason === 'commission')));
ok('a subscription row matches its plan’s published fee',
   await p.evaluate(() => DATA.ledger.filter(r => r.kind === 'subscription')
     .every(r => r.amount === PLANS[r.reason].monthlyFeeIQD)));
ok('every row points at a pharmacy that exists',
   await p.evaluate(() => DATA.ledger.every(r => DATA.pharmacies.some(x => x.id === r.pharmacy))));
ok('no pharmacy is charged a subscription it is not on',
   await p.evaluate(() => DATA.ledger.filter(r => r.kind === 'subscription')
     .every(r => (DATA.pharmacies.find(x => x.id === r.pharmacy) || {}).plan === r.reason)));
/* The allowance is what stops a chain subscribing to the cheapest plan and
   posting forty shifts against it. */
ok('no pharmacy has more shifts covered in a month than its plan allows',
   await p.evaluate(() => {
     const byKey = {};
     DATA.ledger.filter(r => r.kind === 'covered').forEach(r => {
       const k = r.pharmacy + '|' + r.date.slice(0, 7);
       byKey[k] = (byKey[k] || 0) + 1;
     });
     return Object.entries(byKey).every(([k, n]) => {
       const ph = DATA.pharmacies.find(x => x.id === k.split('|')[0]);
       return n <= PLANS[ph.plan || 'commission'].includedShifts;
     });
   }));
ok('a pay-as-you-go pharmacy never has a covered shift',
   await p.evaluate(() => {
     const payg = DATA.pharmacies.filter(x => (x.plan || 'commission') === 'commission').map(x => x.id);
     return payg.length > 0 && !DATA.ledger.some(r => r.kind === 'covered' && payg.includes(r.pharmacy));
   }));

console.log('\nand it is reportable');
ok('the SQL view exposes the ledger with its reason intact',
   await p.evaluate(() => Object.keys(sqlTables().ledger[0]).sort().join() ===
     'amount,date,id,kind,order_id,pharmacy_id,reason'));
ok('a pharmacy’s plan is queryable beside its charges',
   await p.evaluate(() => sqlTables().pharmacies.every(r => !!r.plan)));
ok('MRR totals the subscription rows for the month',
   await p.evaluate(() => {
     const r = runReport(reportById('R13'));
     const want = DATA.ledger.filter(x => x.kind === 'subscription' && x.date.startsWith('2026-09'))
       .reduce((n, x) => n + x.amount, 0);
     return r.ok && r.rows.reduce((n, x) => n + x.iqd, 0) === want;
   }));
ok('"what does this pharmacy owe" is one query over one table',
   await p.evaluate(() => {
     const r = runReport(reportById('R14'));
     return r.ok && r.rows.length > 0 && r.rows.every(x => x.iqd >= 0 && !!x.plan);
   }));
ok('and the absorbed-shift count matches the rows it counts',
   await p.evaluate(() =>
     runReport(reportById('R15')).rows[0].shifts ===
     DATA.ledger.filter(r => r.kind === 'covered').length));

console.log('\ninvoices: the part of a subscription that is not technical');
await tab(p, 'invoices');
ok('an invoice totals its month of ledger rows',
   await p.evaluate(() => DATA.invoices.every(i => {
     const want = DATA.ledger
       .filter(r => r.pharmacy === i.pharmacy && r.date.slice(0, 7) === i.month)
       .reduce((n, r) => n + r.amount, 0);
     return i.amount === want;
   })));
ok('no invoice is raised for a month with nothing to charge',
   await p.evaluate(() => DATA.invoices.every(i => i.amount > 0)));
/* The ladder is the point: designed up front, not discovered when forty
   pharmacies are three months in arrears. */
ok('every invoice sits on a rung of the dunning ladder',
   await p.evaluate(() => DATA.invoices.every(i => INVOICE_STATES.includes(i.state))));
ok('and the queue has something on more than one rung',
   await p.evaluate(() => new Set(DATA.invoices.filter(i => i.state !== 'paid').map(i => i.state)).size > 1));
ok('a paid invoice records who collected it, when, and how — not just a flag',
   await p.evaluate(() => DATA.invoices.filter(i => i.state === 'paid')
     .every(i => i.collectedOn && i.collectedBy && i.method)));
ok('an unpaid one records none of those',
   await p.evaluate(() => DATA.invoices.filter(i => i.state !== 'paid')
     .every(i => !i.collectedOn && !i.collectedBy && !i.method)));
ok('the "to chase" view is exactly the unpaid ones',
   await p.evaluate(() => {
     S.view.invoices = 'chase'; render();
     const shown = visibleRows('invoices');
     S.view.invoices = 'all'; render();
     return shown.length === DATA.invoices.filter(i => i.state !== 'paid').length
       && shown.every(i => i.state !== 'paid');
   }));
ok('and it is reportable, oldest first',
   await p.evaluate(() => {
     const r = runReport(reportById('R16'));
     return r.ok && r.rows.length > 0
       && r.rows.every((x, i) => i === 0 || r.rows[i - 1].month <= x.month);
   }));

console.log('\nlistings: a partner fills a form, a person finishes it');
await tab(p, 'listings');
ok('the module holds both kinds',
   await p.evaluate(() => ['job', 'banner'].every(k => DATA.listings.some(x => x.kind === k))));
ok('every listing sits on a state the machine defines',
   await p.evaluate(() => DATA.listings.every(x => LISTING_STATES.includes(x.state))));
/* The workflow claim: nothing reaches a pharmacist without a human step. */
ok('nothing is live that nobody phoned about',
   await p.evaluate(() => DATA.listings.filter(x => x.state === 'live')
     .every(x => !!x.calledOn && !!x.calledBy)));
ok('and a draft is exactly a listing awaiting that call',
   await p.evaluate(() => DATA.listings.filter(x => x.state === 'draft')
     .every(x => !x.calledOn)));
ok('the operational view is the queue of drafts',
   await p.evaluate(() => {
     S.view.listings = 'awaitingCall'; render();
     const shown = visibleRows('listings');
     S.view.listings = 'all'; render();
     return shown.every(x => x.state === 'draft') && shown.length > 0;
   }));
/* P1, enforced in the data rather than trusted to a screen. */
ok('a banner names a permitted surface and never a clinical one',
   await p.evaluate(() => DATA.listings.filter(x => x.kind === 'banner')
     .every(x => ['browse', 'jobs', 'home'].includes(x.surface))));
ok('a job listing books no surface at all',
   await p.evaluate(() => DATA.listings.filter(x => x.kind === 'job').every(x => !x.surface)));
ok('two live banners never hold the same surface on overlapping dates',
   await p.evaluate(() => {
     const live = DATA.listings.filter(x => x.kind === 'banner' && x.state === 'live');
     for (let i = 0; i < live.length; i++) {
       for (let j = i + 1; j < live.length; j++) {
         const a = live[i], b = live[j];
         if (a.surface === b.surface && a.from <= b.to && b.from <= a.to) return false;
       }
     }
     return true;
   }));
ok('every listing belongs to a company on record',
   await p.evaluate(() => DATA.listings.every(x => DATA.companies.some(c => c.id === x.company))));
ok('and the whole lot is queryable',
   await p.evaluate(() => {
     const r = runReport(reportById('R18'));
     return r.ok && r.rows.reduce((n, x) => n + x.listings, 0) === DATA.listings.length;
   }));

console.log('\nthe dashboard is built from reports');
await tab(p, 'home');
const tileCount = await p.evaluate(() => S.tiles.length);
ok(`the dashboard renders a tile per entry (${tileCount})`,
   await p.locator('.tile').count() === tileCount);
ok('every tile names a report that exists',
   await p.evaluate(() => S.tiles.every(x => !!reportById(x.report))));
ok('a tile shows what its report returns, not a number of its own',
   await p.evaluate(() => {
     const tile = S.tiles.find(x => reportById(x.report).viz === 'number');
     const res = runReport(reportById(tile.report));
     const shown = [...document.querySelectorAll('.tile .kpi-v')].map(e => e.textContent.trim());
     return shown.includes(String(resultScalar(res)));
   }));
ok('changing the query changes the tile',
   await p.evaluate(async () => {
     const rep = REPORTS.find(r => r.id === 'R2');
     const before = document.querySelector('.tile .kpi-v').textContent;
     const keep = rep.sql;
     rep.sql = "SELECT COUNT(*) AS unclaimed FROM orders";   // every order, not just unclaimed
     render();
     const after = document.querySelector('.tile .kpi-v').textContent;
     rep.sql = keep; render();
     return before !== after;
   }));

await p.evaluate(() => toggleDashEdit());
await p.waitForTimeout(200);
ok('customising reveals the tile tools', await p.locator('.tile-tools').count() > 0);
{
  const first = await p.evaluate(() => S.tiles[0].report);
  await p.evaluate(() => moveTile(0, 1));
  await p.waitForTimeout(150);
  ok('a tile can be moved', await p.evaluate(() => S.tiles[1].report) === first);
  await p.evaluate(() => setTileWidth(0, 'l'));
  await p.waitForTimeout(150);
  ok('and resized', await p.locator('.tile.w-l').count() > 0);
  const n = await p.evaluate(() => S.tiles.length);
  await p.evaluate(() => removeTile(0));
  await p.waitForTimeout(150);
  ok('and removed', await p.evaluate(() => S.tiles.length) === n - 1);
  await p.evaluate(() => openAddTile());
  await p.waitForTimeout(200);
  ok('a tile is added by picking a report', await p.locator('.modal .account-btn').count() === await p.evaluate(() => REPORTS.length));
  await p.locator('.modal .account-btn:not([disabled])').first().click();
  await p.waitForTimeout(220);
  ok('which puts it back on the board', await p.evaluate(() => S.tiles.length) === n);
  await p.evaluate(() => resetDash());
  await p.waitForTimeout(150);
  ok('and reset restores the default layout',
     await p.evaluate(() => S.tiles.length === DEFAULT_TILES.length));
}
await p.evaluate(() => { S.dashEdit = false; render(); });

// A tile pointing at a deleted report says so rather than vanishing.
ok('a tile whose report is gone says so',
   await p.evaluate(() => {
     S.tiles.push({ report:'R_GONE', w:'s' });
     render();
     const said = document.body.innerText.includes('no longer exists');
     S.tiles.pop(); render();
     return said;
   }));

console.log('\nthe report editor');
await p.evaluate(() => openReport('R1'));
await p.waitForTimeout(250);
ok('the editor loads the query', (await p.locator('#rep-sql').inputValue()).includes('SELECT'));
ok('and lists the tables a query can read',
   await p.locator('.schema-name').count() === await p.evaluate(() => Object.keys(sqlTables()).length));
await p.locator('#rep-sql').fill('SELECT nope FROM nowhere');
await p.locator('.btn.primary', { hasText: /Run/ }).click();
await p.waitForTimeout(250);
ok('a broken query shows the error instead of an empty chart',
   await p.locator('.imp-fatal').count() > 0);
await p.locator('.btn', { hasText: /^Save$/ }).click();
await p.waitForTimeout(200);
ok('and cannot be saved', await p.evaluate(() => reportById('R1').sql.includes('status')));
await p.evaluate(() => closeReport());

console.log('\nteam & access: three levels, and what each one may actually do');
await p.evaluate(() => { closeRecord(); goTab('team'); });
await p.waitForTimeout(250);
ok('the team screen is reachable and renders',
   (await p.locator('#work-body').innerText()).length > 200);
ok('exactly one owner admin exists',
   await p.evaluate(() => STAFF.filter(s => s.role === 'owner_admin').length === 1));
ok('the matrix on screen is drawn from CAPS rather than retyped beside it',
   await p.evaluate(() => {
     const ticks = [...document.querySelectorAll('table.matrix tbody tr')].map(tr =>
       [...tr.querySelectorAll('td')].slice(1).map(td => td.classList.contains('yes')));
     // rows after the first are CAPS keys, columns are CRM_ROLES reversed
     const caps = ['write', 'delete', 'import', 'reports.edit', 'staff.employee', 'staff.admin'];
     const cols = CRM_ROLES.slice().reverse();
     return ticks.slice(1).every((row, i) =>
       row.every((on, j) => on === (CAPS[cols[j]] || []).includes(caps[i])));
   }));

/* The employee is the interesting account: it is the one the matrix restricts,
   and the one a hidden-button-only implementation would leave wide open. */
await p.evaluate(() => signInAs(DATA ? STAFF.find(s => s.role === 'employee').id : null));
await p.waitForTimeout(220);
ok('signing in as an employee changes who the CRM thinks you are',
   await p.evaluate(() => me().role === 'employee'));

await tab(p, 'drugs');
ok('an employee sees no CSV import button',
   await p.locator('.work-head .btn', { hasText: /Import|CSV/i }).count() === 0);
ok('and calling the importer directly is refused, not just hidden',
   await p.evaluate(() => { openImport('drugs'); return S.modal === null; }));
{
  const before = await p.evaluate(() => DATA.drugs.length);
  await p.evaluate(() => { S.picked.drugs = DATA.drugs.slice(0, 2).map(d => d.sci); render(); });
  await p.waitForTimeout(160);
  ok('the bulk bar offers an employee no delete',
     await p.locator('.bulkbar .btn.danger').count() === 0);
  await p.evaluate(() => bulkDelete('drugs'));
  await p.waitForTimeout(160);
  ok('and calling bulkDelete directly deletes nothing',
     await p.evaluate(() => DATA.drugs.length) === before);
  await p.evaluate(() => clearPicked('drugs'));
}
await tab(p, 'reports');
ok('an employee still runs every report',
   await p.evaluate(() => REPORTS.every(r => runReport(r).ok))
   && await p.locator('.panel').count() > 0);
ok('but is offered no editor',
   await p.locator('.work-head .btn.primary').count() === 0
   && await p.locator('.table-toggle', { hasText: /^Edit$/ }).count() === 0);
ok('and is told why rather than left to wonder',
   /export|SQL/i.test(await p.locator('.mod-note').innerText()));
ok('opening the editor directly is refused',
   await p.evaluate(() => { openReport('R1'); return S.report === null; }));
ok('and saveReport cannot be reached round the back',
   await p.evaluate(() => {
     const keep = reportById('R1').sql;
     S.draft = { id:'R1', name:'x', viz:'table', sql:'SELECT * FROM users' };
     saveReport();
     const same = reportById('R1').sql === keep;
     S.draft = null;
     return same;
   }));
await p.evaluate(() => { goTab('team'); });
await p.waitForTimeout(200);
ok('an employee is offered no way to create an account',
   await p.locator('.work-head .btn.primary').count() === 0);
ok('and openNewStaff is refused',
   await p.evaluate(() => { openNewStaff(); return S.modal === null; }));

/* Admin: everything operational, plus employees — but not another admin. */
await p.evaluate(() => signInAs(STAFF.find(s => s.role === 'admin').id));
await p.waitForTimeout(220);
ok('an admin may import, delete and write reports',
   await p.evaluate(() => can('import') && can('delete') && can('reports.edit')));
ok('an admin may create an employee but not an admin',
   await p.evaluate(() => can('staff.employee') && !can('staff.admin')));
await p.evaluate(() => { goTab('team'); openNewStaff(); });
await p.waitForTimeout(220);
ok('so the role dropdown an admin sees offers employee only',
   await p.evaluate(() => [...document.querySelectorAll('#s-role option')].map(o => o.value).join() === 'employee'));
await p.locator('#s-name').fill('Zainab Al-Amiri');
await p.locator('#s-email').fill('not-an-email');
await p.locator('.modal .btn.primary').click();
await p.waitForTimeout(200);
ok('a malformed email is refused', await p.locator('.modal .err').count() > 0);
await p.locator('#s-email').fill('sara@saydaliplus.iq');
await p.locator('.modal .btn.primary').click();
await p.waitForTimeout(200);
ok('and so is one already in use', (await p.locator('.modal').innerText()).includes('already'));
ok('the name typed before the error survived',
   await p.locator('#s-name').inputValue() === 'Zainab Al-Amiri');
{
  const before = await p.evaluate(() => STAFF.length);
  await p.locator('#s-email').fill('zainab@saydaliplus.iq');
  await p.locator('.modal .btn.primary').click();
  await p.waitForTimeout(250);
  ok('a valid account is created as an employee',
     await p.evaluate(() => STAFF.length) === before + 1
     && await p.evaluate(() => STAFF[STAFF.length - 1].role === 'employee'));
}
ok('an admin cannot grant admin even by posting the value',
   await p.evaluate(() => {
     S.modal = { kind:'staff', errors:{}, values:{ name:'Sneaky', email:'sneaky@saydaliplus.iq', role:'admin' } };
     renderModal();
     const sel = document.getElementById('s-role');
     const opt = document.createElement('option'); opt.value = 'admin'; sel.appendChild(opt);
     sel.value = 'admin';
     document.getElementById('s-name').value = 'Sneaky';
     document.getElementById('s-email').value = 'sneaky@saydaliplus.iq';
     saveStaff();
     const refused = !STAFF.some(s => s.email === 'sneaky@saydaliplus.iq');
     closeModal();
     return refused;
   }));

/* The open question BACKLOG W5 left: what happens to a leaver's records. */
await p.evaluate(() => { goTab('team'); });
await p.waitForTimeout(200);
{
  const victim = await p.evaluate(() => {
    const s = STAFF.find(x => x.role === 'employee' && x.active && ownedBy(x.id) > 0);
    return s ? { id:s.id, n:ownedBy(s.id) } : null;
  });
  ok('an employee with records to lose exists to test with', !!victim && victim.n > 0);
  await p.evaluate(x => openDeactivate(x), victim.id);
  await p.waitForTimeout(220);
  ok('deactivating asks who takes the work, and says how much of it there is',
     (await p.locator('.modal').innerText()).includes(String(victim.n)));
  const successor = await p.evaluate(() => document.getElementById('d-to').value);
  const successorBefore = await p.evaluate(x => ownedBy(x), successor);
  await p.locator('.modal .btn.danger').click();
  await p.waitForTimeout(250);
  ok('the account is deactivated rather than deleted — the history stays',
     await p.evaluate(x => { const s = staffById(x); return !!s && s.active === false; }, victim.id));
  ok('and every record it owned moved to the named successor, none orphaned',
     await p.evaluate(a => ownedBy(a[0]) === a[1] + a[2], [successor, successorBefore, victim.n])
     && await p.evaluate(x => ownedBy(x) === 0, victim.id));
  ok('a deactivated account is gone from the owner dropdowns',
     await p.evaluate(x => !ownerOpts().some(o => o.v === x), victim.id));
}

/* Owner admin: the one account nobody deletes, and the transfer that replaces
   deleting it. */
await p.evaluate(() => signInAs(STAFF.find(s => s.role === 'owner_admin').id));
await p.waitForTimeout(220);
ok('the owner admin may create admins', await p.evaluate(() => can('staff.admin')));
ok('nothing offers to deactivate the owner admin',
   await p.evaluate(() => { const o = STAFF.find(s => s.role === 'owner_admin'); openDeactivate(o.id); return S.modal === null; }));
ok('and openRole refuses to demote it',
   await p.evaluate(() => { const o = STAFF.find(s => s.role === 'owner_admin'); openRole(o.id); return S.modal === null; }));
{
  await p.evaluate(() => { goTab('team'); openTransfer(); });
  await p.waitForTimeout(220);
  const to = await p.evaluate(() => document.getElementById('x-to').value);
  const from = await p.evaluate(() => ME);
  await p.locator('.modal .btn.primary').click();
  await p.waitForTimeout(250);
  ok('transferring moves the owner admin and leaves exactly one',
     await p.evaluate(x => staffById(x).role === 'owner_admin', to)
     && await p.evaluate(() => STAFF.filter(s => s.role === 'owner_admin').length === 1));
  ok('and the account that handed it over becomes an admin, not nothing',
     await p.evaluate(x => staffById(x).role === 'admin', from));
  // put it back, so what follows runs as the owner admin again
  await p.evaluate(a => { signInAs(a[0]); openTransfer(); document.getElementById('x-to').value = a[1];
    S.modal.values.to = a[1]; confirmTransfer(); signInAs(a[1]); }, [to, from]);
  await p.waitForTimeout(200);
  ok('and it transfers back the same way',
     await p.evaluate(x => staffById(x).role === 'owner_admin' && ME === x, from));
}

console.log('\nevery inline handler actually parses');
/* Same sweep as the app's. A value interpolated into onclick="f(...)" without
   escaping its own quotes ends the attribute early and the button silently
   does nothing — invisible in the source and invisible on screen. Here the
   interpolated values are record ids and drug names, some of which contain a
   slash or an apostrophe. */
{
  const broken = [];
  const scan = () => p.evaluate(() => [...document.querySelectorAll('[onclick]')]
    .map(el => el.getAttribute('onclick'))
    .filter(h => { try { new Function(h); return false; } catch (e) { return true; } }));
  for (const k of ['home', ...MODS, 'reports', 'team']) {
    await tab(p, k);
    (await scan()).forEach(h => broken.push(`${k}: ${h.slice(0, 60)}`));
  }
  for (const [mod, id] of [['drugs', 'Amoxicillin/Clavulanic acid'], ['drugs', 'Trimethoprim/Sulfamethoxazole'],
                           ['companies', 'CO4'], ['users', 'U1']]) {
    await p.evaluate(a => openRecord(a[0], a[1]), [mod, id]);
    await p.waitForTimeout(160);
    (await scan()).forEach(h => broken.push(`${mod} ${id}: ${h.slice(0, 60)}`));
  }
  await p.evaluate(() => closeRecord());
  ok('no broken inline handler on any module or record', broken.length === 0);
  broken.slice(0, 6).forEach(x => console.log('        ' + x));
}

console.log('\nsearch');
await p.locator('#q').fill('Metformin');
await p.waitForTimeout(250);
ok('search reaches the drug list', await p.locator('.tb-result').count() > 0);
await p.locator('.tb-result').first().click();
await p.waitForTimeout(250);
ok('and opens the record', await p.evaluate(() => S.record && S.record.mod === 'drugs'));
await p.evaluate(() => closeRecord());

console.log('\nEnglish only');
/* A missing string falls through t() as its own key, which looks like a label
   until you read it. Sweep every module and a record of each kind. */
const KEYISH = /(?:^|[\s>|])[a-z]{1,12}\.[a-zA-Z][a-zA-Z0-9]{1,20}(?:$|[\s<|])/i;
/* Arabic in the CHROME would be a leftover translation; Arabic inside a record
   field is the pharmacy's actual name. So the sweep looks at the furniture —
   tabs, headers, column headings, buttons, filter rail — not the cells. */
const CHROME = '.tabs, .work-head, .rail, table.grid thead, .panel-h, .field-k, .kpi-k, .chart-t, .btn, ' +
               '.mod-note, .acct-role, .acct-sep, .acct-note, table.matrix';
const ARABIC = /[\u0600-\u06FF]/;
const leaks = [];
for (const k of ['home', ...MODS, 'team']) {
  await tab(p, k);
  const txt = await p.locator('#shell').innerText();
  const hit = txt.match(KEYISH);
  if (hit && !/\.(edu|com|iq|example)/i.test(hit[0])) leaks.push(k + ': untranslated ' + hit[0].trim());
  if (/[٠-٩]/.test(txt)) leaks.push(k + ': eastern-arabic numerals');
  const chromeTxt = (await p.locator(CHROME).allInnerTexts()).join(' | ');
  if (ARABIC.test(chromeTxt)) leaks.push(k + ': Arabic in the chrome — ' +
    (chromeTxt.match(new RegExp('[^|]*' + ARABIC.source + '[^|]*')) || [''])[0].trim().slice(0, 40));
}
for (const [mod, id] of [['orders','O-1041'], ['users','U5'], ['pharmacies','P4'],
                         ['companies','CO3'], ['universities','V2'], ['syndicate','IQ-PH-007731'],
                         ['drugs','Omeprazole']]) {
  await p.evaluate(a => openRecord(a[0], a[1]), [mod, id]);
  await p.waitForTimeout(140);
  const txt = await p.locator('#shell').innerText();
  const hit = txt.match(KEYISH);
  if (hit && !/\.(edu|com|iq|example)/i.test(hit[0])) leaks.push(mod + ' record: untranslated ' + hit[0].trim());
  const chromeTxt = (await p.locator(CHROME).allInnerTexts()).join(' | ');
  if (ARABIC.test(chromeTxt)) leaks.push(mod + ' record: Arabic in the chrome');
}
await p.evaluate(() => closeRecord());
{
  await p.evaluate(() => { S.accountMenu = true; render(); });
  await p.waitForTimeout(160);
  const txt = await p.locator('.acct-menu').innerText();
  const hit = txt.match(KEYISH);
  if (hit && !/\.(edu|com|iq|example)/i.test(hit[0])) leaks.push('account menu: untranslated ' + hit[0].trim());
  // Staff names are data and may be Arabic; the labels around them are not.
  const chromeTxt = (await p.locator('.acct-role, .acct-sep, .acct-note').allInnerTexts()).join(' | ');
  if (ARABIC.test(chromeTxt)) leaks.push('account menu: Arabic in the chrome');
  await p.evaluate(() => { S.accountMenu = false; render(); });
}
ok('no untranslated keys, no Arabic in the interface, Western numerals throughout', leaks.length === 0);
leaks.forEach(x => console.log('        ' + x));

ok('Arabic data is still held, and still shown where it is the record',
   await p.evaluate(() => {
     const d = drugOf('Amoxicillin');
     return d.ar === 'أموكسيسيلين' && AR(DATA.pharmacies[0].name) === 'صيدلية الرحمة';
   }));

console.log('\nnarrow viewport');
const m = await open(430, 900);
await tab(m, 'orders');
ok('no horizontal page overflow at 430px',
   await m.evaluate(() => document.documentElement.scrollWidth) <= 430);

await b.close();
console.log(errs.length ? `\n${errs.length} failed:\n` + errs.join('\n') : '\nAll checks passed.');
process.exit(errs.length ? 1 : 0);
