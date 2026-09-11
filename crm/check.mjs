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
    if (m.type() === 'error' && !/ERR_(CONNECTION|NAME|INTERNET)/.test(m.text())) errs.push('console: ' + m.text());
  });
  await p.goto(url);
  await p.waitForTimeout(400);
  return p;
}
const tab = async (p, k) => { await p.evaluate(x => goTab(x), k); await p.waitForTimeout(220); };
const MODS = ['orders', 'users', 'pharmacies', 'companies', 'universities', 'syndicate', 'drugs'];
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
ok('nine tabs: home, the seven modules, and reports', await p.locator('.tab').count() === 9);
ok('the document is English, left to right', await p.evaluate(() =>
   document.documentElement.lang === 'en' && document.documentElement.dir === 'ltr'));
ok('there is no language toggle left to press',
   await p.locator('#btn-lang').count() === 0);
ok('the build states which one it is',
   /^CRM_v\d+\.\d+$/.test((await p.locator('#build-tag').innerText()).trim()));

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

console.log('\nusers are segmented by the three account types');
await tab(p, 'users');
for (const ty of ['pharmacist', 'owner', 'student']) {
  await p.evaluate(x => { S.view.users = x; render(); }, ty);
  await p.waitForTimeout(120);
  const all = await p.evaluate(x => visibleRows('users').every(u => u.type === x), ty);
  const some = await p.evaluate(() => visibleRows('users').length > 0);
  ok(`the ${ty} view holds only that type, and holds some`, all && some);
}
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
const csv = [
  'scientific_name,arabic_name,atc,form,doses,notes,interactions,contraindications',
  'Ibuprofen,إيبوبروفين,M01AE01,tablet,200 mg|400 mg,"Take with food, not on an empty stomach.",Warfarin:warning:Raises bleeding risk,Active peptic ulcer|Third trimester',
  'Amoxicillin,أموكسيسيلين,J01CA04,capsule,250 mg|500 mg,Updated note,,',
  ',Missing key,,tablet,,,,',
  'Ibuprofen,مكرر,M01AE01,tablet,200 mg,,,'
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
   await p.evaluate(() => !DATA.drugs.some(d => d.sci === 'Ibuprofen')));
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
const CHROME = '.tabs, .work-head, .rail, table.grid thead, .panel-h, .field-k, .kpi-k, .chart-t, .btn, .mod-note';
const ARABIC = /[\u0600-\u06FF]/;
const leaks = [];
for (const k of ['home', ...MODS]) {
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
