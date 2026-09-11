/**
 * Drives crm/saydali-crm.html in a real browser.
 *
 * Same reasoning as demo/check.mjs: one file, no build step, no compiler, so a
 * typo inside concatenated HTML renders an empty panel rather than failing
 * anything. The check is behavioural — walk every module, sort and filter and
 * select, open records, drag a deal across the pipeline, convert a lead, and
 * submit an invalid form.
 *
 *   node crm/check.mjs
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const file = join(dirname(fileURLToPath(import.meta.url)), 'saydali-crm.html');
const url = 'file://' + file;
const PREINSTALLED = '/opt/pw-browsers/chromium';
const launch = existsSync(PREINSTALLED) ? { executablePath: PREINSTALLED } : {};

const errs = [];
const ok = (n, c) => { console.log((c ? '  ok    ' : '  FAIL  ') + n); if (!c) errs.push(n); };
const b = await chromium.launch(launch);

async function open(w = 1440, h = 900) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_(CONNECTION|NAME|INTERNET)/.test(m.text())) errs.push('console: ' + m.text()); });
  await p.goto(url);
  await p.waitForTimeout(400);
  return p;
}
const tab = async (p, k) => { await p.evaluate(x => goTab(x), k); await p.waitForTimeout(220); };

const p = await open();

console.log('\nshell');
ok('lands on Home', await p.evaluate(() => S.tab) === 'home');
ok('Arabic is the default', await p.evaluate(() => document.documentElement.dir) === 'rtl');
ok('all seven module tabs are present', await p.locator('.tab').count() === 7);

console.log('\nevery module renders');
for (const k of ['home','leads','accounts','contacts','deals','activities','reports']) {
  await tab(p, k);
  const len = (await p.locator('#work-body').innerText()).trim().length;
  ok(`${k} renders (${len} chars)`, len > 60);
}

console.log('\ncharts');
await tab(p, 'home');
ok('six KPI tiles', await p.locator('.kpi').count() === 6);
ok('the funnel has a row per stage', await p.locator('.funnel-row').count() >= 5);
ok('the trend line is drawn', await p.locator('.chart-svg path[stroke]').count() > 0);
await p.locator('.funnel-bar').first().hover();
await p.waitForTimeout(200);
ok('hovering a bar shows its tooltip', await p.locator('.tip.on').isVisible());
const beforeTable = await p.locator('.funnel-row').count();
await p.locator('.table-toggle').first().click();
await p.waitForTimeout(220);
ok('every chart has a table twin', await p.locator('table.mini').count() > 0
   && await p.locator('.funnel-row').count() < beforeTable);
await p.locator('.table-toggle').first().click();
await p.waitForTimeout(200);

console.log('\nlist view: sort, filter, select');
await tab(p, 'accounts');
const rows0 = await p.locator('table.grid tbody tr').count();
ok(`pharmacies list has rows (${rows0})`, rows0 > 0);
await p.locator('th.sortable').nth(5).click();
await p.waitForTimeout(200);
const firstAsc = await p.evaluate(() => visibleRows('accounts')[0].shifts);
await p.locator('th.sortable').nth(5).click();
await p.waitForTimeout(200);
const firstDesc = await p.evaluate(() => visibleRows('accounts')[0].shifts);
ok('sorting a column reverses on the second click', firstAsc !== firstDesc);

await p.evaluate(() => pickView('accounts', 'dormant'));
await p.waitForTimeout(220);
const dormant = await p.evaluate(() => visibleRows('accounts'));
ok('the "verified, never posted" view finds the dormant pharmacy',
   dormant.length > 0 && dormant.every(a => a.shifts === 0));
await p.evaluate(() => pickView('accounts', 'all'));
await p.waitForTimeout(200);

await p.locator('.rail-opt').nth(2).click();
await p.waitForTimeout(220);
ok('a rail facet narrows the list', await p.locator('table.grid tbody tr').count() <= rows0);
await p.evaluate(() => resetFilters('accounts'));
await p.waitForTimeout(200);
ok('clearing filters restores it', await p.locator('table.grid tbody tr').count() === rows0);

await p.locator('thead input[type=checkbox]').click();
await p.waitForTimeout(220);
ok('select-all raises the bulk bar', await p.locator('.bulkbar').isVisible());
ok('and counts what is selected', await p.evaluate(() => S.picked.accounts.length) === rows0);
await p.evaluate(() => clearPicked('accounts'));
await p.waitForTimeout(200);

console.log('\nrecord page');
await p.locator('.cell-link').first().click();
await p.waitForTimeout(250);
ok('a row opens its record', await p.evaluate(() => !!S.record));
const rec = await p.locator('#work-body').innerText();
ok('a pharmacy record shows its platform state', /Saydali\+|صيدلي\+/.test(rec));
ok('and a link out to the app', await p.locator('button', { hasText: /Open in Saydali|افتح في صيدلي/ }).count() > 0);
await p.locator('#note-input').fill('Owner wants Thursday nights covered.');
await p.locator('.note-box .btn.primary').click();
await p.waitForTimeout(250);
ok('a note posts to the timeline',
   (await p.locator('.timeline').innerText()).includes('Thursday nights'));
await p.evaluate(() => closeRecord());
await p.waitForTimeout(200);

console.log('\npipeline board');
await tab(p, 'deals');
ok('the board opens with a column per stage', await p.locator('.kcol').count() === 5);
const movedFrom = await p.evaluate(() => DATA.deals.find(d => d.stage === 'new').id);
await p.evaluate(id => moveDeal(id, 'trial'), movedFrom);
await p.waitForTimeout(220);
ok('a deal can be moved between stages',
   await p.evaluate(id => DATA.deals.find(d => d.id === id).stage, movedFrom) === 'trial');
await p.evaluate(() => setDealsMode('list'));
await p.waitForTimeout(220);
ok('the board has a list twin', await p.locator('table.grid').count() > 0);
await p.evaluate(() => setDealsMode('board'));

console.log('\nlead conversion carries the history');
await tab(p, 'leads');
const leadId = await p.evaluate(() => DATA.leads[0].id);
const before = await p.evaluate(id => ({
  accounts: DATA.accounts.length,
  contacts: DATA.contacts.length,
  activity: DATA.activity.filter(e => e.kind === 'leads' && e.id2 === id).length
}), leadId);
await p.evaluate(id => convertLead(id), leadId);
await p.waitForTimeout(300);
const after = await p.evaluate(() => ({ accounts: DATA.accounts.length, contacts: DATA.contacts.length }));
ok('converting creates the pharmacy', after.accounts === before.accounts + 1);
ok('and its first contact', after.contacts === before.contacts + 1);
ok('and leaves no timeline entry behind on the dead lead',
   await p.evaluate(id => DATA.activity.filter(e => e.kind === 'leads' && e.id2 === id).length, leadId) === 0);
ok('and lands you on the new record', await p.evaluate(() => S.record.mod) === 'accounts');
await p.evaluate(() => closeRecord());

console.log('\nvalidation');
await tab(p, 'accounts');
await p.evaluate(() => openNew('accounts'));
await p.waitForTimeout(250);
await p.locator('.modal .btn.primary').click();
await p.waitForTimeout(250);
ok('an empty required field blocks the save', await p.locator('.modal .err').count() > 0);
await p.locator('#f-name').fill('Test Pharmacy');
await p.locator('#f-licence').fill('IQ-PHM-000117');   // already taken by Al-Rahma
await p.locator('#f-appEmail').fill('t@example.com');
await p.locator('.modal .btn.primary').click();
await p.waitForTimeout(250);
ok('a duplicate licence number is refused',
   (await p.locator('.modal').innerText()).match(/licence|الإجازة/i) !== null
   && await p.locator('.modal').count() > 0);
await p.locator('#f-licence').fill('IQ-PHM-999999');
await p.locator('.modal .btn.primary').click();
await p.waitForTimeout(280);
ok('a valid form saves and closes', await p.locator('.modal').count() === 0);

await p.evaluate(() => openNew('leads'));
await p.waitForTimeout(220);
await p.locator('#f-name').fill('X');
await p.locator('#f-contact').fill('Y');
await p.locator('#f-phone').fill('12345');
await p.locator('.modal .btn.primary').click();
await p.waitForTimeout(230);
ok('a non-Iraqi phone number is refused', await p.locator('.modal .err').count() > 0);
await p.evaluate(() => closeModal());

console.log('\nsearch');
await p.locator('#q').fill('Furat');
await p.waitForTimeout(250);
ok('search spans modules', await p.locator('.tb-result').count() > 0);
await p.locator('.tb-result').first().click();
await p.waitForTimeout(250);
ok('a hit opens its record', await p.evaluate(() => !!S.record));
await p.evaluate(() => closeRecord());

console.log('\nlanguage');
await p.evaluate(() => setLang('en'));
await p.waitForTimeout(250);
ok('English turns the page around', await p.evaluate(() => document.documentElement.dir) === 'ltr');
/* A missing string falls through t() as its own key, which looks like a label
   until you read it. Sweep every module AND a record of each kind, in both
   languages, for anything shaped like one. */
const KEYISH = /(?:^|[\s>|])[a-z]{1,12}\.[a-zA-Z][a-zA-Z0-9]{1,20}(?:$|[\s<|])/i;
async function sweep(label) {
  const leaks = [];
  for (const k of ['home','leads','accounts','contacts','deals','activities','reports']) {
    await tab(p, k);
    const txt = await p.locator('#shell').innerText();
    if (KEYISH.test(txt)) leaks.push(k + ': ' + (txt.match(KEYISH) || [])[0].trim());
    if (/[٠-٩]/.test(txt)) leaks.push(k + ': eastern-arabic numerals');
  }
  for (const [mod, id] of [['accounts','A1'],['leads','L2'],['deals','D1'],['contacts','C1'],['activities','T1']]) {
    await p.evaluate(a => openRecord(a[0], a[1]), [mod, id]);
    await p.waitForTimeout(160);
    const txt = await p.locator('#shell').innerText();
    if (KEYISH.test(txt)) leaks.push(mod + ' record: ' + (txt.match(KEYISH) || [])[0].trim());
  }
  await p.evaluate(() => closeRecord());
  ok(label, leaks.length === 0);
  leaks.forEach(x => console.log('        ' + x));
}
await p.evaluate(() => setLang('en'));
await p.waitForTimeout(250);
await sweep('every English screen is fully translated, Western numerals throughout');
await p.evaluate(() => setLang('ar'));
await p.waitForTimeout(250);
await sweep('every Arabic screen is too');

console.log('\nnarrow viewport');
const m = await open(430, 900);
await tab(m, 'accounts');
ok('no horizontal page overflow at 430px',
   await m.evaluate(() => document.documentElement.scrollWidth) <= 430);
ok('the table scrolls inside its own pane instead',
   await m.evaluate(() => document.getElementById('work-body').scrollWidth >= 430));

console.log('\ncharts tell the truth');
await tab(p, 'home');
const pcts = await p.locator('.funnel-pct').allInnerTexts();
ok('no stage share exceeds 100%', pcts.every(x => parseInt(x) <= 100));
ok('the shares add up to about 100%',
   Math.abs(pcts.reduce((n, x) => n + parseInt(x), 0) - 100) <= 3);
const avatars = await p.evaluate(() =>
  DATA.accounts.map(a => initialsOf(a.name.ar)));
ok('pharmacy avatars are not all the same two letters', new Set(avatars).size > 1);

await b.close();
console.log(errs.length ? `\n${errs.length} failed:\n` + errs.join('\n') : '\nAll checks passed.');
process.exit(errs.length ? 1 : 0);
