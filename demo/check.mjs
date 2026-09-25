/**
 * Drives the newest demo/saydali-plus_v*.html in a real browser.
 *
 * The single-file app has no build step and no test runner, which makes it the
 * easiest thing in the repository to break silently: a typo inside a string of
 * concatenated HTML does not fail a compile, it just renders an empty screen.
 * So the check is behavioural — sign in as each account, walk every screen,
 * and assert the rules that matter (the payout gate, the logbook gates, the
 * assistant never applying its own suggestion) actually hold.
 *
 *   node demo/check.mjs
 */
import { chromium } from 'playwright';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import DRUG_DATA, { DUPLICATE_RULES } from '../data/drugs.mjs';
import PRODUCT_DATA from '../data/products.mjs';
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
const build = newestBuild(here, 'saydali-plus_v');
const file = join(here, build);
/* Since v0.0009 the marketplace is switched OFF by default (backlog Part 0).
   Everything below that exercises it — which is most of this file — runs with
   it switched back on, because "dark" must mean "unreachable", not "broken":
   the day W21 turns it on, it has to work exactly as it did. The dark build is
   checked separately, on a page opened without the switch. */
const url = 'file://' + file + '#flags=marketplace';
const darkUrl = 'file://' + file;
console.log('build: ' + build);

// Sandboxes here ship one Chromium at a fixed path; everywhere else Playwright
// finds its own.
const PREINSTALLED = '/opt/pw-browsers/chromium';
const launch = existsSync(PREINSTALLED) ? { executablePath: PREINSTALLED } : {};

const errs = [];
const ok = (name, cond) => { console.log((cond ? '  ok    ' : '  FAIL  ') + name); if (!cond) errs.push(name); };
const browser = await chromium.launch(launch);

async function open(w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  // Network noise only: the file:// page asks for Google Fonts, which this
  // sandbox serves through a proxy. A real script error carries no ERR_ code.
  p.on('console', m => {
    if (m.type() === 'error' && !/ERR_(CONNECTION|NAME|INTERNET|CERT)/.test(m.text())) errs.push('console: ' + m.text());
  });
  await p.goto(url);
  await p.waitForTimeout(400);
  return p;
}
const go = async (p, k) => { await p.evaluate(x => goto(x), k); await p.waitForTimeout(200); };
async function signIn(p, mail) {
  await p.locator('.account-btn', { hasText: mail }).click();
  await p.locator('#password').fill('x');
  await p.locator('.btn-primary').first().click();
  await p.waitForTimeout(300);
}
async function signOut(p) {
  await go(p, 'profile');
  await p.locator('.btn-secondary', { hasText: /Sign out|تسجيل الخروج/ }).click();
  await p.waitForTimeout(250);
}

const d = await open(1440, 900);

console.log('\nversioning');
ok('the file states the build its name claims',
   (readFileSync(file, 'utf8').match(/const VERSION = '([^']+)'/) || [])[1]
     === 'App_v' + (build.match(/_v([\d.]+)\.html$/) || [])[1]);
{
  // The cross-link is the one thing a rename can break silently.
  const peer = (readFileSync(file, 'utf8').match(/const PEER_CRM = '([^']+)'/) || [])[1];
  ok(`the CRM link points at a file that exists (${peer})`,
     !!peer && existsSync(join(here, peer)));
}

console.log('\nsign-in');
ok('the sign-in page is what you land on', await d.locator('#auth').isVisible());
ok('the app is not reachable without signing in', await d.locator('#app').isHidden());
await d.locator('#email').fill('nobody@example.com');
await d.locator('#password').fill('x');
await d.locator('.btn-primary').first().click();
await d.waitForTimeout(200);
ok('an unknown address is refused', await d.locator('.auth-error').isVisible());
ok('and does not sign anyone in', await d.locator('#app').isHidden());

console.log('\nevery account reaches every one of its screens');
const accounts = await d.locator('.account-btn').evaluateAll(
  els => els.map(e => e.querySelector('.account-mail').textContent));
for (const mail of accounts) {
  await signIn(d, mail);
  const n = await d.locator('.side-nav-item').count();
  let empty = 0;
  for (let i = 0; i < n; i++) {
    await d.locator('.side-nav-item').nth(i).click();
    await d.waitForTimeout(120);
    if ((await d.locator('#app-body').innerText()).trim().length < 20) empty++;
  }
  ok(`${mail} — ${n} screens, none empty`, empty === 0);
  await signOut(d);
}

console.log('\nthe pharmacy owner is a pharmacist linked to a pharmacy');
await signIn(d, 'rahma@example.com');
ok('the account type is pharmacist, not a third type',
   await d.evaluate(() => ACCOUNTS['rahma@example.com'].type === 'pharmacist'));
ok('and ownership is a link, not a type',
   await d.evaluate(() => !!ACCOUNTS['rahma@example.com'].pharmacy));
ok('"owner" is derived from the link rather than stored',
   await d.evaluate(() => {
     const a = ACCOUNTS['rahma@example.com'];
     const keep = a.pharmacy;
     const was = viewRole(a);
     a.pharmacy = null;
     const now = viewRole(a);
     a.pharmacy = keep;
     return was === 'owner' && now === 'pharmacist';
   }));

console.log('\nshift-taking is off by default and opts in');
ok('an owner starts with shift work off', await d.evaluate(() => S.takesShifts === false));
{
  const reach = () => d.evaluate(() =>
    navFor('owner').map(x => x[0]).concat(ownerGroups().flatMap(g => g.items.map(x => x[0]))));
  const off = await reach();
  ok('with it off, Browse and My Shifts are unreachable',
     !off.includes('browse') && !off.includes('shifts'));
  ok('and Earnings is too', !off.includes('earnings'));
  ok('but Billing is reachable — a pharmacy is charged either way',
     off.includes('billing'));
  ok('and the CV stays: it is not shift-specific', off.includes('cv'));
  ok('the pharmacy screens all remain',
     ['dashboard','post','applicants','trainees'].every(x => off.includes(x)));
  ok('the bottom bar holds the pharmacy screens outright, still five',
     await d.evaluate(() => { const n = navFor('owner'); return n.length === 5 && n[0][0] === 'dashboard'; }));

  await go(d, 'profile');
  ok('the toggle is on the profile', await d.locator('.switch').count() === 1);
  ok('and the verified block is hidden while there is no record',
     !(await d.locator('#app-body').innerText()).includes(await d.evaluate(() => t('pr.verifiedSection'))));

  await d.locator('.switch').click();
  await d.waitForTimeout(220);
  const on = await reach();
  ok('turning it on reveals the pharmacist half',
     on.includes('browse') && on.includes('shifts') && on.includes('earnings'));
  ok('and the bottom bar makes room via "More"',
     await d.evaluate(() => navFor('owner').some(x => x[0] === 'more')));
  ok('the verified block appears once they take shifts',
     (await d.locator('#app-body').innerText()).includes(await d.evaluate(() => t('pr.verifiedSection'))));

  let empty = [];
  for (const id of on) {
    await go(d, id);
    if ((await d.locator('#app-body').innerText()).trim().length < 30) empty.push(id);
  }
  ok(`all ${on.length} owner screens render (${empty.join(',') || 'none empty'})`, empty.length === 0);

  // Turning it off while sitting on a pharmacist screen must not strand you.
  await go(d, 'browse');
  await go(d, 'profile');
  await d.locator('.switch').click();
  await d.waitForTimeout(220);
  ok('turning it back off does not strand you on a hidden screen',
     await d.evaluate(() => navFor('owner').map(x => x[0])
       .concat(ownerGroups().flatMap(g => g.items.map(y => y[0]))).includes(S.screen)));
}

console.log('\nbilling: what the pharmacy owes');
await go(d, 'billing');
{
  const txt = await d.locator('#app-body').innerText();
  ok('billing shows a total', /\d/.test(txt));
  ok('and is priced by the real fee engine, not a literal',
     await d.evaluate(() => {
       const f = calculateFees({ grossAmount:20000, pharmacyInTrial:S.trial, pharmacistInTrial:false });
       return document.querySelector('.txn-amount').textContent.includes(fmt(f.pharmacyCharge));
     }));
  await d.locator('.txn').first().click();
  await d.waitForTimeout(220);
  ok('a charge opens its breakdown', await d.locator('.modal').isVisible());
  await d.keyboard.press('Escape');
  await d.waitForTimeout(150);
}
await signOut(d);

console.log('\nsigning up as an owner creates both records');
await d.locator('.link-btn', { hasText: /Create an account|أنشئ حساباً/ }).click();
await d.waitForTimeout(200);
await d.locator('.role-option').nth(1).click();
await d.waitForTimeout(250);
{
  const form = await d.locator('.auth-form').innerText();
  ok('the owner form asks for the Syndicate number (they are a pharmacist)',
     await d.locator('#su-reg').count() === 1);
  ok('and the pharmacy licence (they are a pharmacy)',
     await d.locator('#su-lic').count() === 1);
  ok('and says the pharmacy record is created with the application',
     /created with your application|يُنشأ سجل صيدليتك/.test(form));
  ok('and asks for the Arabic pharmacy name, which is mandatory',
     await d.locator('#su-ar').count() === 1);
}
await d.evaluate(() => setAuth('signin'));
await d.waitForTimeout(200);

console.log('\nmoney');
await signIn(d, 'ahmed@example.com');
await go(d, 'earnings');
ok('a payout cannot be requested without a destination',
   await d.locator('.btn-on-dark.solid').isDisabled());
await d.locator('.btn-on-dark').nth(1).click();
await d.locator('#dest-input').fill('0770 123 4567');
await d.locator('.modal .btn-primary').click();
await d.waitForTimeout(250);
ok('once a destination is saved it can', await d.locator('.btn-on-dark.solid').isEnabled());
await d.locator('.txn').first().click();
await d.waitForTimeout(200);
ok('a shift row opens the fee breakdown that priced it',
   /45,000/.test(await d.locator('.modal').innerText()));
await d.keyboard.press('Escape');
await d.waitForTimeout(150);
ok('Escape closes it', await d.locator('.modal').count() === 0);

console.log('\nthe CV');
await go(d, 'cv');
const uiLang = await d.evaluate(() => document.documentElement.lang);
await d.locator('.segmented button', { hasText: 'English' }).first().click();
await d.waitForTimeout(200);
ok('the CV language is independent of the app language',
   await d.evaluate(() => document.documentElement.lang) === uiLang);
ok('and turns the sheet around', await d.locator('.cv-sheet').getAttribute('dir') === 'ltr');
ok('the verified figures are on the sheet',
   /38/.test(await d.locator('.cv-sheet').innerText()));

// Skills are two lists, and a skill goes into the one it was picked from
// The editor's labels follow the APP language; the sheet's follow the CV's.
ok('the editor offers a picker per group',
   await d.evaluate(() => document.querySelectorAll('.pill-pick').length
     === SKILL_PRESETS.medical.length + SKILL_PRESETS.nonMedical.length));
ok('the editor labels each group in the app language',
   await d.evaluate(() => {
     const labels = [...document.querySelectorAll('.field-label')].map(e => e.textContent);
     return labels.includes(t('cv.skills.medical')) && labels.includes(t('cv.skills.nonMedical'));
   }));
ok('the sheet heads them separately, in the CV language',
   await d.evaluate(() => {
     // .cv-sec is uppercased by CSS, and innerText reflects that.
     const txt = document.querySelector('.cv-sheet').innerText.toLowerCase();
     const h = SKILL_HEAD[S.cvLang];
     return txt.includes(h.medical.toLowerCase()) && txt.includes(h.nonMedical.toLowerCase());
   }));
ok('the whole sheet is in the CV language, proficiencies included',
   await d.evaluate(() => {
     const txt = document.querySelector('.cv-sheet').innerText;
     const wrong = CV_LEVELS[S.cvLang === 'en' ? 'ar' : 'en'];
     return !Object.values(wrong).some(v => txt.includes(v));
   }));
const skillsBefore = await d.evaluate(() => JSON.parse(JSON.stringify(S.cv.en.skills)));
await d.evaluate(() => toggleSkill('nonMedical', 'Supplier negotiation'));
await d.waitForTimeout(180);
ok('picking a non-medical skill lands in the non-medical list only',
   await d.evaluate(() => S.cv.en.skills.nonMedical.includes('Supplier negotiation')
     && !S.cv.en.skills.medical.includes('Supplier negotiation')));
await d.evaluate(() => toggleSkill('nonMedical', 'Supplier negotiation'));
await d.waitForTimeout(150);
ok('and picking it again removes it',
   await d.evaluate(s => JSON.stringify(S.cv.en.skills) === JSON.stringify(s), skillsBefore));
ok('an empty group leaves no orphan heading on the sheet',
   await d.evaluate(() => {
     const keep = S.cv.en.skills.nonMedical.slice();
     S.cv.en.skills.nonMedical = [];
     render();
     const gone = !/Other professional skills/.test(document.querySelector('.cv-sheet').innerText);
     S.cv.en.skills.nonMedical = keep;
     render();
     return gone;
   }));
const before = await d.locator('.cv-sheet').innerText();
await d.locator('.btn-ghost', { hasText: /Improve|حسّن/ }).click();
await d.waitForTimeout(200);
ok('the assistant suggests without applying',
   (await d.locator('.cv-sheet').innerText()) === before);
await d.locator('.btn-small', { hasText: /Use this|اعتمد/ }).click();
await d.waitForTimeout(250);
ok('and applies only when asked', (await d.locator('.cv-sheet').innerText()) !== before);
await signOut(d);

console.log('\nthe logbook');
await signIn(d, 'zainab@uobaghdad.edu.iq');
await go(d, 'logbook');
await d.locator('.week-pip').nth(11).click();
await d.waitForTimeout(200);
ok('a later week cannot be opened early', await d.evaluate(() => S.openWeek) !== 12);
ok('an empty week cannot be submitted', await d.locator('.card .btn-primary').isDisabled());
await d.locator('.day-btn').first().click();
await d.locator('textarea').fill('x'.repeat(40));
await d.waitForTimeout(150);
ok('nor one under 80 characters', await d.locator('.card .btn-primary').isDisabled());
await d.locator('textarea').fill('y'.repeat(90));
await d.waitForTimeout(150);
ok('a day plus 80 characters submits', await d.locator('.card .btn-primary').isEnabled());
await d.locator('.card .btn-primary').click();
await d.waitForTimeout(250);
ok('and that is what unlocks the next week',
   await d.evaluate(() => S.weeks[6].status) === 'draft');
await go(d, 'placement');
ok('the certificate stays locked until every month is approved',
   /Unlocks|تُفتح/.test(await d.locator('#app-body').innerText()));

console.log('\nthe drug reference');
await signOut(d);
await signIn(d, 'ahmed@example.com');
ok('a pharmacist has it in the bottom bar, not buried behind More',
   await d.evaluate(() => navFor('pharmacist').some(x => x[0] === 'drugs')));
ok(`and the app and the CRM hold the same list, from the same file (${DRUG_DATA.length})`,
   await d.evaluate(() => DRUGS.length) === DRUG_DATA.length);
await go(d, 'drugs');
ok('the module opens on the check, not the reference',
   await d.evaluate(() => S.drugTab) === 'check');
await d.evaluate(() => setDrugTab('reference'));
await d.waitForTimeout(200);
ok('the module renders every drug', await d.locator('.drug-row').count() === DRUG_DATA.length);
ok('and says what kind of reference it is',
   /مرجع مساعد|A reference, not a substitute/.test(await d.locator('.inline-note').first().innerText()));

/* Search has to work the way a pharmacist types: either script, and without
   the diacritics or the alif hamza that nobody keys in a hurry. */
await d.evaluate(() => setDrugQuery('amox'));
await d.waitForTimeout(200);
ok('a Latin fragment finds the molecule',
   await d.locator('.drug-row').count() === 2
   && (await d.locator('.drug-row').first().innerText()).includes('Amox'));
await d.evaluate(() => setDrugQuery('اموكسيسيلين'));   // no hamza on the alif
await d.waitForTimeout(200);
ok('an Arabic query without the hamza still finds أموكسيسيلين',
   await d.locator('.drug-row').count() >= 1);
await d.evaluate(() => setDrugQuery('J01CA04'));
await d.waitForTimeout(200);
ok('and so does the ATC code', await d.locator('.drug-row').count() === 1);
await d.evaluate(() => setDrugQuery('zzzz'));
await d.waitForTimeout(200);
ok('a query that matches nothing says so rather than showing an empty page',
   await d.locator('.drug-row').count() === 0
   && /لا يوجد دواء|Nothing matches/.test(await d.locator('#app-body').innerText()));
await d.evaluate(() => setDrugQuery(''));
ok('the search box keeps the caret after a keystroke',
   await d.evaluate(() => document.activeElement && document.activeElement.id === 'drug-q'));

await d.evaluate(() => { setDrugTab('reference'); S.drugForm = 'inhaler'; render(); });
await d.waitForTimeout(200);
ok('a form filter narrows to that form and nothing else',
   await d.evaluate(() => DRUGS.filter(x => x.form === 'inhaler').length) === await d.locator('.drug-row').count()
   && await d.locator('.drug-row').count() > 0);
await d.evaluate(() => { S.drugForm = 'all'; render(); });

console.log('\na drug record');
await d.evaluate(() => openDrug('Clarithromycin'));
await d.waitForTimeout(250);
{
  const txt = await d.locator('#app-body').innerText();
  ok('the counselling line leads the record', /CYP3A4|مثبّط قوي/.test(await d.locator('.drug-note-v').innerText()));
  ok('it carries the ATC code and every strength', txt.includes('J01FA09') && txt.includes('500 mg'));
  ok('interactions are ranked worst first, not in the order they were typed',
     await d.evaluate(() => {
       const rank = { critical:3, serious:2, warning:1 };
       const shown = [...document.querySelectorAll('.drug-inter .sev')]
         .map(e => [...e.classList].find(c => c.startsWith('sev-')).slice(4));
       return shown.length > 1 && shown.every((s, i) => i === 0 || rank[shown[i - 1]] >= rank[s]);
     }));
  ok('a critical interaction is shown with a word and an icon, not colour alone',
     await d.locator('.sev-critical .ico').count() > 0
     && /Critical|حرج/.test(await d.locator('.sev-critical').first().innerText()));
  ok('contraindications are listed', /Simvastatin|سيمفاستاتين/.test(txt) && txt.includes('QT'));
}
ok('an interaction partner that is in the reference is a link to it',
   await d.evaluate(() => {
     const b = [...document.querySelectorAll('.drug-inter .link-inline')][0];
     if (!b) return false;
     b.click();
     return S.screen === 'drug' && S.openDrug !== 'Clarithromycin';
   }));
ok('and one that is not stays plain text rather than a dead link',
   await d.evaluate(() => {
     openDrug('Metformin');
     const inter = DRUGS.find(x => x.sci === 'Metformin').interactions;
     const outside = inter.find(i => !DRUGS.some(x => x.sci === i.with));
     return !!outside && document.querySelectorAll('.drug-inter-w').length > 0;
   }));

/* The worst-interaction chip is computed, and the seed value is the classic
   way to get it wrong: a reduce seeded with '' compares against undefined and
   reports every drug as clean. */
ok('the worst interaction is reported rather than swallowed',
   await d.evaluate(() =>
     drugWorst(DRUGS.find(x => x.sci === 'Clarithromycin')) === 'critical'
     && drugWorst(DRUGS.find(x => x.sci === 'Paracetamol')) === 'warning'
     && drugWorst({ interactions: [] }) === ''));
ok('and the list shows it on more rows than not',
   await d.evaluate(() => {
     goto('drugs'); setDrugTab('reference');
     return document.querySelectorAll('.drug-row .sev').length > 50;
   }));

console.log('\nwho gets the reference');
ok('an owner reaches it from More', await d.evaluate(() =>
   ownerGroups().some(g => g.items.some(x => x[0] === 'drugs'))));
ok('a student has it in the bar — a placement is twelve weeks of being asked',
   await d.evaluate(() => navFor('student').some(x => x[0] === 'drugs')));
/* W13 folded More into Profile for the flat roles and gave the bar its slot
   back. The owner keeps More — two jobs, genuinely more screens than a phone
   bar holds. */
ok('the pharmacist bar no longer carries More',
   await d.evaluate(() => !navFor('pharmacist').some(x => x[0] === 'more')));
ok('and carries Profile instead',
   await d.evaluate(() => navFor('pharmacist').some(x => x[0] === 'profile')));
ok('the CV moved into Profile, where people already look',
   await d.evaluate(() => profileLinks().some(x => x[0] === 'cv')));
ok('and so did incident reporting',
   await d.evaluate(() => profileLinks().some(x => x[0] === 'incidents')));
await signOut(d);
await signIn(d, 'ahmed@example.com');
await d.evaluate(() => setLang('en'));
await go(d, 'profile');
ok('Profile renders those rows rather than hiding them',
   /My CV/.test(await d.locator('#app-body').innerText()));
await signOut(d);
await signIn(d, 'rahma@example.com');
await d.evaluate(() => setLang('en'));
ok('the owner keeps More, and it still lists their groups',
   await d.evaluate(() => S.role === 'owner' && moreGroups().length > 1));
await signOut(d);
await signIn(d, 'ahmed@example.com');
await d.evaluate(() => setLang('en'));

console.log('\nboth languages');
await d.evaluate(() => { setLang('ar'); goto('drugs'); setDrugTab('reference'); });
await d.waitForTimeout(250);
ok('the Arabic list leads with the Arabic name',
   await d.evaluate(() => {
     const first = document.querySelector('.drug-row .row-title');
     return /[؀-ۿ]/.test(first.textContent);
   }));
await d.evaluate(() => openDrug('Metformin'));
await d.waitForTimeout(200);
ok('and an Arabic record carries Arabic interaction notes',
   /[؀-ۿ]/.test(await d.locator('.drug-inter .row-sub').first().innerText()));
ok('while the scientific name stays Latin and left-to-right',
   await d.evaluate(() => {
     const el = [...document.querySelectorAll('.kv-value span')].find(x => x.textContent === 'Metformin');
     return !!el && el.getAttribute('dir') === 'ltr';
   }));
await d.evaluate(() => { setLang('en'); goto('browse'); });

console.log('\nthe check is the way in');
ok('the home screen carries it above the board',
   await d.evaluate(() => { goto('browse'); return !!document.querySelector('.check-card'); })
   && await d.locator('.check-card').count() === 1);
ok('and it is the first thing on that screen, not buried under the listings',
   await d.evaluate(() => {
     const card = document.querySelector('.check-card');
     const first = document.querySelector('.grid-cards, .chip-row');
     return !!card && !!first &&
       (card.compareDocumentPosition(first) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
   }));
ok('tapping it opens the module on the check',
   await d.evaluate(() => { document.querySelector('.check-card').click();
     return S.screen === 'drugs' && S.drugTab === 'check'; }));
ok('a part-built basket is named on the card rather than lost',
   await d.evaluate(() => {
     clearBasket(); ['Warfarin', 'Ibuprofen'].forEach(addToBasket);
     goto('browse');
     return /2/.test(document.querySelector('.check-card-n').textContent);
   }));
ok('and the card reads as a prompt when there is nothing in it',
   await d.evaluate(() => {
     clearBasket(); goto('browse');
     return !document.querySelector('.check-card-n')
       && document.querySelector('.check-card-s').textContent.length > 20;
   }));
/* Entering the module resets to the check, but moving between its own tabs
   must not — a pharmacist mid-scroll in the reference is not yanked back. */
ok('switching to the reference tab sticks while you stay on the screen',
   await d.evaluate(() => { setDrugTab('reference'); setDrugQuery('met'); return S.drugTab === 'reference'; }));
ok('and coming back from a drug record returns to the reference, not the check',
   await d.evaluate(() => {
     setDrugTab('reference'); openDrug('Metformin'); backToReference();
     return S.screen === 'drugs' && S.drugTab === 'reference';
   }));
ok('while arriving from the navigation resets to the check',
   await d.evaluate(() => { setDrugTab('reference'); goto('browse'); goto('drugs'); return S.drugTab === 'check'; }));
ok('a student gets the same door from their home screen',
   await d.evaluate(() => navFor('student').some(x => x[0] === 'drugs')));

console.log('\nthe dispensing check');
await go(d, 'drugs');
await d.evaluate(() => { setLang('en'); setDrugTab('check'); clearBasket(); });
await d.waitForTimeout(220);
ok('the check is a tab of the drug screen, not a separate place',
   await d.locator('.segbar .seg').count() === 2);
ok('an empty basket says what to do rather than showing a blank verdict',
   await d.locator('.empty-check').count() === 1
   && await d.locator('.verdict').count() === 0);

/* THE CORE ASSERTION. Interactions are written from one side — 149 of the
   pairs in the reference are one-way — so a checker that reads drug A's list
   for drug B finds a pair only when the drugs happen to be added in the order
   the data was written. Amiodarone lists Warfarin as critical; Warfarin's own
   record does not mention amiodarone. Both orders must find it. */
for (const order of [['Amiodarone', 'Warfarin'], ['Warfarin', 'Amiodarone']]) {
  await d.evaluate(o => { clearBasket(); o.forEach(addToBasket); }, order);
  await d.waitForTimeout(200);
  const found = await d.evaluate(() => basketInteractions(S.basket));
  ok(`a one-way pair is found added as ${order.join(' then ')}`,
     found.length === 1 && found[0].severity === 'critical');
}
ok('and the index is built once rather than scanned per lookup',
   await d.evaluate(() => INTERACTION_INDEX.size > 100));
ok('where the two sides disagree on severity, the worse one wins',
   await d.evaluate(() => {
     // Bisoprolol calls salbutamol a warning; salbutamol calls bisoprolol serious.
     const hit = INTERACTION_INDEX.get('Bisoprolol', 'Salbutamol');
     return !!hit && hit.severity === 'serious';
   }));
ok('a pair with no interaction in the reference returns nothing, not undefined',
   await d.evaluate(() => INTERACTION_INDEX.get('Paracetamol', 'Cetirizine') === null));

await d.evaluate(() => { clearBasket(); ['Warfarin', 'Ibuprofen', 'Clarithromycin', 'Simvastatin'].forEach(addToBasket); });
await d.waitForTimeout(250);
{
  const txt = await d.locator('#app-body').innerText();
  ok('every pair in the basket is checked, not just adjacent ones',
     await d.evaluate(() => basketInteractions(S.basket).length) === 3);
  ok('findings are ranked worst first',
     await d.evaluate(() => {
       const rank = { critical:3, serious:2, warning:1 };
       const f = basketInteractions(S.basket);
       return f.every((x, i) => i === 0 || rank[f[i - 1].severity] >= rank[x.severity]);
     }));
  ok('the verdict states what was checked, in drugs and in pairs',
     /4 drugs, 6 pairs checked/.test(txt));
  ok('and it never claims the combination is safe',
     !/\bsafe\b/i.test(await d.locator('.verdict').innerText()));
  ok('a drug can be taken back out of the basket',
     await d.evaluate(() => { removeFromBasket('Simvastatin'); return S.basket.length === 3; }));
}

console.log('\nnothing found is not a green tick');
await d.evaluate(() => { clearBasket(); ['Paracetamol', 'Cetirizine'].forEach(addToBasket); });
await d.waitForTimeout(220);
{
  const v = await d.locator('.verdict').innerText();
  ok('it says nothing was found', /Nothing found/.test(v));
  ok('with the count of what was actually checked', /2 drugs, 1 pairs? checked/.test(v));
  ok('and says out loud that the reference is not complete', /not a complete interaction database/.test(v));
  ok('the clear verdict is neutral, not the success colour',
     await d.locator('.verdict-clear').count() === 1 && await d.locator('.verdict-serious').count() === 0);
}

console.log('\ntherapeutic duplication');
ok('two NSAIDs are flagged',
   await d.evaluate(() => {
     clearBasket(); ['Ibuprofen', 'Diclofenac'].forEach(addToBasket);
     const dupes = basketDuplicates(S.basket);
     return dupes.length === 1 && dupes[0].rule.id === 'nsaid' && dupes[0].members.length === 2;
   }));
ok('an ACE inhibitor with an ARB is flagged across two classes',
   await d.evaluate(() => {
     clearBasket(); ['Lisinopril', 'Losartan'].forEach(addToBasket);
     return basketDuplicates(S.basket).some(x => x.rule.id === 'ras');
   }));
/* The rules are curated rather than derived from ATC precisely so that the
   standard regimens do not fire. If these ever start flagging, the tool is on
   its way to being muted. */
for (const [pair, why] of [
  [['Metformin', 'Gliclazide'], 'metformin plus a sulfonylurea is standard dual therapy'],
  [['Insulin glargine', 'Insulin regular'], 'basal plus bolus insulin is how insulin is prescribed'],
  [['Isosorbide dinitrate', 'Glyceryl trinitrate'], 'a background nitrate plus a rescue spray is normal'],
  [['Amoxicillin', 'Azithromycin'], 'two antibiotics together is a clinical decision, not a duplicate'],
  [['Carbamazepine', 'Sodium valproate'], 'two antiepileptics is ordinary practice']
]) {
  ok(`no false alarm: ${why}`,
     await d.evaluate(x => { clearBasket(); x.forEach(addToBasket); return basketDuplicates(S.basket).length === 0; }, pair));
}
ok('the ones that are often deliberate say so rather than crying wolf',
   await d.evaluate(() => {
     clearBasket(); ['Aspirin', 'Clopidogrel'].forEach(addToBasket);
     const x = basketDuplicates(S.basket)[0];
     return !!x && x.rule.oftenIntended === true;
   }));
await d.waitForTimeout(150);
ok('and the screen marks them', await d.locator('.drug-inter .pill-tag').count() > 0);

console.log('\ncontraindications become questions');
await d.evaluate(() => { clearBasket(); ['Warfarin', 'Ibuprofen', 'Diclofenac'].forEach(addToBasket); });
await d.waitForTimeout(220);
ok('one question, not one per drug, when several share it',
   await d.evaluate(() => {
     const q = basketQuestions(S.basket).find(x => x.text.en === 'Active peptic ulcer');
     return !!q && q.drugs.length === 3;
   }));
ok('the questions touching most drugs come first',
   await d.evaluate(() => {
     const q = basketQuestions(S.basket);
     return q.every((x, i) => i === 0 || q[i - 1].drugs.length >= x.drugs.length);
   }));
ok('each question names which drugs it is about',
   (await d.locator('.ask-list .ask-for').first().innerText()).length > 3);
ok('it is headed as something to ask, not as a warning',
   /Ask the patient/i.test(await d.locator('#app-body').innerText()));

console.log('\ncoverage is shown, not footnoted');
await d.evaluate(() => { clearBasket(); addToBasket('Metformin'); });
await d.waitForTimeout(220);
ok('a partner outside the reference is named on screen',
   await d.locator('.coverage').count() === 1
   && /Contrast media/.test(await d.locator('.coverage').innerText()));
ok('and the coverage block is a card, not small print',
   await d.evaluate(() => {
     const el = document.querySelector('.coverage');
     return el && parseFloat(getComputedStyle(el.querySelector('.coverage-t')).fontSize) >= 12;
   }));
await d.evaluate(() => { clearBasket(); ['Paracetamol', 'Cetirizine'].forEach(addToBasket); });
await d.waitForTimeout(200);
ok('and it is absent when everything named could be checked',
   await d.locator('.coverage').count() === 0);

console.log('\nrecording keeps counts, never baskets');
await d.evaluate(() => { S.dispensing = []; clearBasket(); ['Amoxicillin', 'Paracetamol'].forEach(addToBasket); });
await d.waitForTimeout(220);
ok('a pharmacist on a shift can record', await d.locator('.btn-primary', { hasText: /Record at/ }).count() === 1);
ok('and the button names the pharmacy it records against',
   /Record at .+/.test(await d.locator('.btn-primary', { hasText: /Record at/ }).innerText()));
ok('it says on screen that this does not replace the legal register',
   /does not replace the controlled-substances register/.test(await d.locator('#app-body').innerText()));
await d.locator('.btn-primary', { hasText: /Record at/ }).click();
await d.waitForTimeout(250);
ok('recording stores one row per drug with a count',
   await d.evaluate(() => S.dispensing.length === 2 && S.dispensing.every(r => r.n === 1)));
ok('and stores no patient, no basket and no time of day',
   await d.evaluate(() => S.dispensing.every(r =>
     !('patient' in r) && !('basket' in r) && !('time' in r) &&
     Object.keys(r).sort().join() === 'date,n,pharmacist,pharmacy,sci')));
ok('nothing in the stored rows says these two drugs went out together',
   await d.evaluate(() => {
     const keys = new Set(S.dispensing.map(r => JSON.stringify([r.pharmacy, r.pharmacist, r.date])));
     // Rows share a day, which is the point: a day is not a basket.
     return keys.size === 1 && S.dispensing.length === 2;
   }));
ok('the basket is emptied once recorded', await d.evaluate(() => S.basket.length === 0));
ok('recording the same drug again increments rather than adding a row',
   await d.evaluate(() => {
     clearBasket(); addToBasket('Amoxicillin'); recordDispense();
     const row = S.dispensing.find(r => r.sci === 'Amoxicillin');
     return S.dispensing.length === 2 && row.n === 2;
   }));
await d.waitForTimeout(200);
ok('the pharmacist sees their own shift, as a tally',
   await d.locator('.tally-row').count() === 2);
ok('and is told it is their shift and not the pharmacy log',
   /Your shift only/.test(await d.locator('#app-body').innerText()));

console.log('\nwho may record');
await signOut(d);
await signIn(d, 'zainab@uobaghdad.edu.iq');
await go(d, 'drugs');
await d.evaluate(() => { setLang('en'); setDrugTab('check'); clearBasket(); addToBasket('Amoxicillin'); });
await d.waitForTimeout(250);
ok('a student gets the check', await d.locator('.verdict').count() === 1);
ok('but cannot record — they are not the dispensing pharmacist',
   await d.evaluate(() => canRecord() === false)
   && await d.locator('.btn-primary', { hasText: /Record at/ }).count() === 0);
ok('and recordDispense refuses if called directly',
   await d.evaluate(() => { const n = S.dispensing.length; recordDispense(); return S.dispensing.length === n; }));

console.log('\nthe pharmacy gets its own data first');
await signOut(d);
await signIn(d, 'rahma@example.com');
await d.evaluate(() => {
  setLang('en');
  S.dispensing = [
    { pharmacy:'P1', pharmacist:'rahma@example.com', date:'2026-09-18', sci:'Amoxicillin', n:7 },
    { pharmacy:'P1', pharmacist:'other@example.com', date:'2026-09-17', sci:'Amoxicillin', n:3 },
    { pharmacy:'P1', pharmacist:'other@example.com', date:'2026-09-17', sci:'Paracetamol', n:5 },
    { pharmacy:'P9', pharmacist:'x@example.com',     date:'2026-09-17', sci:'Ibuprofen',   n:9 }
  ];
  goto('consumption');
});
await d.waitForTimeout(250);
ok('the owner reaches consumption from the pharmacy group',
   await d.evaluate(() => ownerGroups()[0].items.some(x => x[0] === 'consumption')));
ok('it totals the pharmacy across every pharmacist who worked there',
   (await d.locator('.stat-num').first().innerText()).trim() === '15');
ok('and shows nothing from another pharmacy',
   !/Ibuprofen/.test(await d.locator('#app-body').innerText()));
ok('drugs are ranked by volume',
   (await d.locator('.cn-name').first().innerText()).includes('Amoxicillin'));
ok('the screen says whose data it is and who benefits first',
   /whoever generates it gets value from it before anybody else/.test(await d.locator('#app-body').innerText()));
await signOut(d);
await signIn(d, 'ahmed@example.com');

console.log('\nthe check got faster (W12a)');
await signOut(d);
await signIn(d, 'ahmed@example.com');
await go(d, 'drugs');
await d.evaluate(() => { setLang('en'); clearBasket(); });
await d.waitForTimeout(200);
/* Focus was dropped on every add, so a four-drug basket cost three
   interactions per drug instead of two. */
await d.locator('#drug-q').fill('warf');
await d.waitForTimeout(200);
await d.locator('.drug-row').first().click();
await d.waitForTimeout(200);
ok('the cursor stays in the search box after adding a drug',
   await d.evaluate(() => document.activeElement && document.activeElement.id === 'drug-q'));
ok('and the box is cleared ready for the next one',
   await d.evaluate(() => document.getElementById('drug-q').value === ''));
await d.locator('#drug-q').fill('ibupro');
await d.waitForTimeout(200);
await d.locator('#drug-q').press('Enter');
await d.waitForTimeout(200);
ok('Enter adds the top hit — no tap at all',
   await d.evaluate(() => S.basket.indexOf('Ibuprofen') >= 0 && S.basket.length === 2));
ok('Enter on an empty box does nothing rather than adding something arbitrary',
   await d.evaluate(() => {
     const before = S.basket.length;
     setDrugQuery('');
     drugSearchKey({ key:'Enter', preventDefault(){} });
     return S.basket.length === before;
   }));
ok('and a drug already in the basket is skipped rather than re-added',
   await d.evaluate(() => {
     setDrugQuery('warf');
     drugSearchKey({ key:'Enter', preventDefault(){} });
     return S.basket.filter(x => x === 'Warfarin').length === 1;
   }));
/* The tallies pay back the person who generated them: one tap, not two. */
await d.evaluate(() => {
  clearBasket(); setDrugQuery('');
  S.dispensing = [
    { pharmacy:'P2', pharmacist:'ahmed@example.com', date:TODAY_ISO, sci:'Paracetamol', n:9 },
    { pharmacy:'P2', pharmacist:'ahmed@example.com', date:TODAY_ISO, sci:'Amoxicillin', n:4 }
  ];
  render();
});
await d.waitForTimeout(220);
ok('the pharmacy’s most-dispensed drugs are offered as one-tap chips',
   await d.locator('.pill-pick').count() === 2);
ok('ordered by how often they are actually dispensed',
   (await d.locator('.pill-pick').first().innerText()).includes('Paracetamol'));
await d.locator('.pill-pick').first().click();
await d.waitForTimeout(200);
ok('tapping one adds it', await d.evaluate(() => S.basket.indexOf('Paracetamol') >= 0));
ok('and it leaves the chip row, so nothing is offered twice',
   await d.locator('.pill-pick').count() === 1);
await d.evaluate(() => { S.dispensing = []; clearBasket(); });

console.log('\nthe owner’s home honours their own setting (W12b)');
await signOut(d);
await signIn(d, 'rahma@example.com');
await d.evaluate(() => setLang('en'));
for (const on of [false, true]) {
  await d.evaluate(x => { S.takesShifts = x; goto('dashboard'); }, on);
  await d.waitForTimeout(200);
  const txt = (await d.locator('#app-body').innerText()).toLowerCase();
  ok(`shift-taking ${on ? 'on' : 'off'}: the pharmacist half is ${on ? 'shown' : 'hidden'}`,
     txt.includes('my own work') === on);
  ok(`  and the reliability figure follows it`, txt.includes('reliability') === on);
}
await d.evaluate(() => { S.takesShifts = false; });

console.log('\nthe plan, its allowance, and what it saved (W14)');
await go(d, 'billing');
await d.evaluate(() => { S.trial = false; S.plan = 'basic'; render(); });
await d.waitForTimeout(250);
{
  const txt = await d.locator('#app-body').innerText();
  ok('the billing screen names the plan', /Basic/.test(txt));
  ok('and shows the allowance as used-of-included',
     await d.locator('.allowance-pip').count() === 5
     && /\d+ \/ 5/.test(txt));
  ok('a shift the allowance absorbed is labelled, not silently zero',
     /Covered by your plan/.test(txt));
  ok('the monthly fee is its own line, not folded into a shift',
     /Monthly subscription/.test(txt));
  ok('and it says what the same month would have cost on commission',
     /saved|would have been/i.test(txt));
}
ok('the fee engine only spends the allowance on shifts it actually covered',
   await d.evaluate(() => {
     const covered = billingLedger().filter(x => x.fees.coveredByPlan).length;
     return covered > 0 && covered <= PLANS.basic.includedShifts;
   }));
ok('beyond the allowance the pharmacy pays ordinary commission',
   await d.evaluate(() => {
     S.plan = 'commission'; render();
     return billingLedger().every(x => x.fees.coveredByPlan === null);
   }));
ok('the trial still wins over a plan, and does not burn the allowance',
   await d.evaluate(() => {
     S.trial = true; S.plan = 'basic'; render();
     const rows = billingLedger();
     const r = rows.every(x => x.fees.pharmacyFee === 0 && x.fees.coveredByPlan === null);
     S.trial = true; S.plan = 'basic';
     return r;
   }));
await d.evaluate(() => { S.plan = 'basic'; S.trial = true; render(); });

console.log('\ntwo screens that had nothing to press (W12d)');
await signOut(d);
await signIn(d, 'zainab@uobaghdad.edu.iq');
await d.evaluate(() => { setLang('en'); goto('placement'); });
await d.waitForTimeout(250);
ok('the placement screen now leads with the week that is due',
   await d.locator('.check-card').count() === 1
   && /Week \d+ is due/.test(await d.locator('#app-body').innerText()));
ok('and it reaches the logbook',
   await d.evaluate(() => { document.querySelector('.check-card').click(); return S.screen === 'logbook'; }));
await signOut(d);
await signIn(d, 'ahmed@example.com');
await d.evaluate(() => { setLang('en'); goto('shifts'); });
await d.waitForTimeout(250);
ok('an upcoming shift offers more than a checklist',
   await d.locator('.shift-actions .btn-secondary').count() === 3);
ok('including a number to call',
   (await d.locator('.shift-actions a').first().getAttribute('href')).startsWith('tel:'));
ok('and a calendar entry the phone can take',
   await d.evaluate(() => typeof addShiftToCalendar === 'function'));

console.log('\njobs, banners, and the line they may not cross (W15)');
await signOut(d);
await signIn(d, 'ahmed@example.com');
await d.evaluate(() => { setLang('en'); goto('browse'); });
await d.waitForTimeout(250);
ok('Jobs is a tab of Browse, not a bar item',
   await d.locator('.segbar .seg').count() === 2
   && !(await d.evaluate(() => navFor('pharmacist').some(x => x[0] === 'jobs'))));
await d.evaluate(() => setBrowseTab('jobs'));
await d.waitForTimeout(250);
ok('it lists the live jobs and only those',
   await d.locator('.job-row').count() === await d.evaluate(() => liveJobs().length)
   && await d.evaluate(() => liveJobs().every(j => j.state === 'live')));
ok('each names the company behind it',
   /Samarra|Iraqi Drug Agency/.test(await d.locator('#app-body').innerText()));
ok('and says these are not relief shifts',
   /separate from relief shifts/i.test(await d.locator('#app-body').innerText()));

/* THE P1 BOUNDARY. This is the assertion that matters more than any other in
   this build: a placement may never appear beside clinical content. */
{
  const seen = [];
  for (const [screen, setup] of [
    ['browse',  () => { setBrowseTab('shifts'); goto('browse'); }],
    ['jobs',    () => { setBrowseTab('jobs'); goto('browse'); }],
    ['drugs (helper)',    () => { goto('drugs'); setDrugTab('check'); }],
    ['drugs (reference)', () => { goto('drugs'); setDrugTab('reference'); }],
    ['drug record',       () => { goto('drugs'); openDrug('Warfarin'); }],
    ['shifts',  () => goto('shifts')],
    ['earnings',() => goto('earnings')],
    ['profile', () => goto('profile')]
  ]) {
    await d.evaluate(f => eval('(' + f + ')()'), setup.toString());
    await d.waitForTimeout(160);
    if (await d.locator('.banner-slot').count() > 0) seen.push(screen);
  }
  ok(`a paid placement appears only on permitted surfaces (found on: ${seen.join(', ') || 'none'})`,
     seen.length > 0 && !seen.some(x => x.startsWith('drug')));
  ok('and never anywhere near the Dispensing Helper or the reference',
     !seen.includes('drugs (helper)') && !seen.includes('drugs (reference)') && !seen.includes('drug record'));
}
await d.evaluate(() => { setBrowseTab('shifts'); goto('browse'); });
await d.waitForTimeout(200);
ok('a placement is labelled as paid, in the reader’s language',
   /paid placement/i.test(await d.locator('.banner-slot').innerText()));
/* A draft banner is real content with a real company behind it. The only thing
   keeping it off the screen is its state, so the check looks for its text on
   the surface it was bought for, not just wherever the page happens to be. */
ok('a banner awaiting review is not shown to anybody, on its own surface either',
   await d.evaluate(() => {
     const drafts = LISTINGS.filter(x => x.kind === 'banner' && x.state !== 'live');
     if (!drafts.length) return false;
     let clean = true;
     for (const tab of ['shifts', 'jobs']) {
       setBrowseTab(tab); goto('browse');
       const shown = document.getElementById('app').innerText;
       if (drafts.some(b => shown.indexOf(b.title.en) >= 0)) clean = false;
     }
     return clean;
   }));

/* Impressions: counted, but with nothing that could become targeting. */
ok('an impression is counted per placement per day, and holds no identity',
   await d.evaluate(() => {
     S.impressions = {};
     setBrowseTab('shifts'); goto('browse');
     setBrowseTab('jobs'); goto('browse');
     const keys = Object.keys(S.impressions);
     return keys.length > 0
       && keys.every(k => k.split('|').length === 2 && /^\d{4}-\d{2}-\d{2}$/.test(k.split('|')[1]));
   }));
ok('nothing recorded says WHO saw it',
   await d.evaluate(() => JSON.stringify(S.impressions).indexOf('@') < 0));

console.log('\nthe Partner account (W15 / W10)');
await signOut(d);
await signIn(d, 'sales@sdi.example');
await d.evaluate(() => setLang('en'));
await d.waitForTimeout(250);
ok('a partner signs in to their own view, not a pharmacist’s',
   await d.evaluate(() => S.role === 'partner' && S.screen === 'partner'));
ok('and gets no clinical screens at all',
   await d.evaluate(() => !navFor('partner').some(x => ['drugs', 'browse', 'shifts'].includes(x[0]))));
ok('they see their own listings and nobody else’s',
   await d.evaluate(() => {
     const mine = myListings();
     return mine.length > 0 && mine.every(x => x.company === ACCOUNTS[S.email].company);
   }));
ok('each shows the state it is in',
   await d.locator('.state').count() > 0);
ok('and the screen says nothing goes live without review',
   /nothing goes live until|reviewed/i.test(await d.locator('#app-body').innerText()));

await d.evaluate(() => goto('partnerNew'));
await d.waitForTimeout(250);
ok('the submission form asks for four things, not forty',
   await d.locator('.field input').count() === 4);
{
  const before = await d.evaluate(() => LISTINGS.length);
  await d.locator('.btn-primary').click();
  await d.waitForTimeout(200);
  ok('an incomplete form is refused rather than filed',
     await d.locator('.auth-error').count() === 1
     && await d.evaluate(() => LISTINGS.length) === before);
  await d.evaluate(() => {
    setPartnerField('title', 'Regulatory affairs pharmacist');
    setPartnerField('where', 'Baghdad');
    setPartnerField('from', '2026-10-05');
    setPartnerField('contact', '07711110001');
  });
  await d.waitForTimeout(150);
  await d.locator('.btn-primary').click();
  await d.waitForTimeout(250);
  ok('a complete one is accepted', await d.evaluate(() => LISTINGS.length) === before + 1);
  /* The whole point of the hybrid: the partner types, a person publishes. */
  ok('and it arrives as a DRAFT — a partner cannot publish',
     await d.evaluate(() => LISTINGS[LISTINGS.length - 1].state === 'draft'));
  ok('so it is not yet visible to any pharmacist',
     await d.evaluate(() => !liveJobs().some(j => L(j.title) === 'Regulatory affairs pharmacist')));
  ok('it carries the contact number the call will use',
     await d.evaluate(() => !!LISTINGS[LISTINGS.length - 1].contact));
  ok('and it is filed against the partner’s own company',
     await d.evaluate(() => LISTINGS[LISTINGS.length - 1].company === ACCOUNTS[S.email].company));
}
await signOut(d);
await signIn(d, 'ahmed@example.com');
await d.evaluate(() => setLang('en'));

console.log('\nrepeat a shift, pre-filled (W12c)');
await signOut(d);
await signIn(d, 'rahma@example.com');
await d.evaluate(() => { setLang('en'); goto('dashboard'); });
await d.waitForTimeout(250);
ok('the dashboard offers the patterns this pharmacy already posts',
   await d.locator('.repeat-chip').count() === 2);
await d.locator('.repeat-chip').first().click();
await d.waitForTimeout(250);
ok('tapping one opens the post form',
   await d.evaluate(() => S.screen === 'post'));
ok('pre-filled from that pattern rather than posted outright',
   await d.evaluate(() => S.rate === 6000 && S.start === '18:00' && S.end === '23:00'));
ok('and it says so, so nobody posts last week’s rate blind',
   /Pre-filled from/.test(await d.locator('#app-body').innerText()));
ok('reaching the form any other way is a fresh post, not a repeat',
   await d.evaluate(() => { goto('dashboard'); goto('post'); return S.repeatedFrom === null; }));

console.log('\nthe home screens prompt rather than report (W13)');
await d.evaluate(() => goto('dashboard'));
await d.waitForTimeout(250);
{
  const txt = await d.locator('#app-body').innerText();
  ok('the owner is told who is waiting on them, not given a number',
     /people are waiting on you/.test(txt));
  ok('and what is unfilled and starting soon', /unfilled/.test(txt));
  ok('the three-stat reporting row is gone',
     !/open posts/i.test(txt));
}
await signOut(d);
await signIn(d, 'ahmed@example.com');
await d.evaluate(() => { setLang('en'); setBrowseTab('shifts'); goto('browse'); });
await d.waitForTimeout(250);
ok('a locum’s home names the shift happening in two days',
   await d.locator('.next-shift').count() === 1);
await signOut(d);
await signIn(d, 'zainab@uobaghdad.edu.iq');
await d.evaluate(() => { setLang('en'); setBrowseTab('shifts'); goto('browse'); });
await d.waitForTimeout(250);
ok('a placed student leads with the logbook week, not a board they cannot use',
   await d.locator('.check-card').first().innerText().then(x => /Week \d+ is due/.test(x)));
ok('and the placement board is not shown to them at all',
   await d.locator('.grid-cards').count() === 0);
await signOut(d);
await signIn(d, 'ahmed@example.com');
await d.evaluate(() => setLang('en'));

console.log('\nremembering the account (W12e)');
ok('signing in remembers who it was',
   await d.evaluate(() => lastAccount() === 'ahmed@example.com'));
await signOut(d);
await d.waitForTimeout(200);
ok('and the sign-in page comes back filled in',
   await d.locator('#email').inputValue() === 'ahmed@example.com');
await signIn(d, 'ahmed@example.com');

console.log('\ndisclosure is a field, not a sentence (W6d)');
await signOut(d);
await signIn(d, 'ahmed@example.com');
await d.evaluate(() => { setLang('en'); setBrowseTab('shifts'); goto('browse'); });
await d.waitForTimeout(250);
ok('a paid placement names who paid for it, from the field rather than the copy',
   /paid placement \u2014 samarra/i.test(await d.locator('.banner-slot').innerText()));
ok('and deleting the sentence would not delete the disclosure',
   await d.evaluate(() => {
     const html = disclosure({ sponsor:'CO1' });
     return html.includes('Samarra') && disclosure({}) === '';
   }));
/* The one that matters: the clinical surfaces refuse sponsored content by
   FILTERING it, so putting a paid item in front of a dispensing decision means
   defeating a filter rather than forgetting a rule. Proved by planting one. */
{
  const planted = await d.evaluate(() => {
    const victim = DRUGS.find(x => x.sci === 'Warfarin');
    victim.sponsor = 'CO1';
    const inReference = clinicalOnly(DRUGS).some(x => x.sci === 'Warfarin');
    setDrugTab('reference'); goto('drugs');
    const onScreen = document.getElementById('app-body').innerText.includes('Warfarin');
    delete victim.sponsor;
    return { inReference, onScreen };
  });
  ok('a sponsored entry is dropped from the reference rather than shown with a label',
     planted.inReference === false && planted.onScreen === false);
}
ok('and the Helper will not even let one be added to a check',
   await d.evaluate(() => {
     const victim = DRUGS.find(x => x.sci === 'Warfarin');
     victim.sponsor = 'CO1';
     setDrugTab('check'); goto('drugs');
     S.basket = [];
     setDrugQuery('Warfarin');
     const found = clinicalOnly(DRUGS).filter(x => drugMatches(x, drugNorm('Warfarin'))).length;
     delete victim.sponsor;
     S.drugQuery = '';
     return found === 0;
   }));
ok('with nothing sponsored, the reference is whole again',
   await d.evaluate(() => clinicalOnly(DRUGS).length === DRUGS.length));

console.log('\nthe name on the check (W11)');
await signOut(d);
await signIn(d, 'ahmed@example.com');
await d.evaluate(() => { setLang('en'); goto('drugs'); });
await d.waitForTimeout(250);
ok('the module is called Dispensing Helper, not Dispensing check',
   await d.evaluate(() => t('dc.tabCheck') === 'Dispensing Helper'));
ok('and \u0645\u0633\u0627\u0639\u062f \u0627\u0644\u0648\u0635\u0641\u0627\u062a in Arabic',
   await d.evaluate(() => { setLang('ar'); const x = t('dc.tabCheck'); setLang('en'); return x; })
     === '\u0645\u0633\u0627\u0639\u062f \u0627\u0644\u0648\u0635\u0641\u0627\u062a');
ok('both the tab and the home card carry the new name',
   (await d.locator('#app-body').innerText()).toLowerCase().includes('dispensing helper'));

console.log('\nchains: a group of branches, one bill (W7)');
await signOut(d);
await signIn(d, 'layla@rahmagroup.example');
await d.evaluate(() => setLang('en'));
await d.waitForTimeout(250);
ok('a chain manager is a pharmacist with a GROUP link, not a new account type',
   await d.evaluate(() => ACCOUNTS[S.email].type === 'pharmacist' && !!ACCOUNTS[S.email].manages));
ok('and the view follows the link rather than a stored role',
   await d.evaluate(() => S.role === 'manager' && viewRole({ type:'pharmacist', manages:'G1' }) === 'manager'));
/* W1's rule is the one this build could most easily have broken. */
ok('every branch still keeps its own licence and its own responsible pharmacist',
   await d.evaluate(() => myBranches().every(b => 'responsible' in b)
     && Object.values(PHARMACIES).filter(x => x.responsible)
          .every(x => typeof x.responsible === 'object')));
ok('a manager lands on the group, not on one branch',
   await d.evaluate(() => S.screen === 'group' && S.branch === null));

{
  const txt = await d.locator('#app-body').innerText();
  ok('the board says how many branches are short, not how many exist',
     /branches need cover/.test(txt));
  ok('and lists every branch in the group',
     await d.locator('.branch-row').count() === await d.evaluate(() => myBranches().length));
  ok('the branch that cannot legally open sorts first',
     await d.evaluate(() => branchBoard()[0].responsible === null));
  ok('and says so in the one colour nothing else on the board uses',
     await d.locator('.branch-row').first().locator('.badge-alert').count() === 1);
  ok('a covered branch sorts last and is marked as needing nothing',
     await d.evaluate(() => { const b = branchBoard(); return b[b.length - 1].uncovered === 0; }));
  ok('the screen states that the group does not replace a branch licence',
     /licence/i.test(txt) && /replaces neither|does not replace/i.test(txt));
}

await d.evaluate(() => setBranch('P9'));
await d.waitForTimeout(250);
ok('tapping a branch scopes the screen to it',
   await d.evaluate(() => S.screen === 'branch' && S.branch === 'P9'));
ok('and names the branch, not the group',
   (await d.locator('#app-body').innerText()).includes('Mansour'));
await d.locator('.branch-scope').click();
await d.waitForTimeout(250);
ok('and there is a way back to all of them',
   await d.evaluate(() => S.screen === 'group' && S.branch === null));

console.log('\nwhat a chain is charged');
await d.evaluate(() => goto('billing'));
await d.waitForTimeout(250);
{
  const txt = await d.locator('#app-body').innerText();
  ok('priced per branch, so one subscription cannot cover twelve of them',
     await d.evaluate(() => myPlan().monthlyFeeIQD === PLANS[S.plan].monthlyFeeIQD * myBranches().length));
  ok('and the bill says so in words as well as arithmetic',
     /per branch/i.test(txt) && /one invoice/i.test(txt));
  ok('the allowance is pooled across the group',
     await d.evaluate(() => myPlan().includedShifts === PLANS[S.plan].includedShifts * myBranches().length));
  ok('and the screen says it is spendable at any branch',
     /pooled|any of them/i.test(txt));
  ok('an independent pharmacy is charged exactly the plan, unchanged',
     await d.evaluate(() => {
       const c = subscriptionCharge('basic', 1);
       return c.monthlyFeeIQD === PLANS.basic.monthlyFeeIQD
           && c.includedShifts === PLANS.basic.includedShifts;
     }));
  ok('a group with no branches is never billed as zero branches',
     await d.evaluate(() => [0, -2, NaN].every(n => subscriptionCharge('basic', n).branches === 1)));
  ok('the pooled allowance runs out where the arithmetic says it does',
     await d.evaluate(() => {
       const n = myBranches().length;
       const within = calculateFees({ grossAmount:40000, pharmacyInTrial:false, pharmacistInTrial:false,
                                      plan:'basic', branches:n, shiftsFilledThisMonth:(5 * n) - 1 });
       const beyond = calculateFees({ grossAmount:40000, pharmacyInTrial:false, pharmacistInTrial:false,
                                      plan:'basic', branches:n, shiftsFilledThisMonth:5 * n });
       return within.coveredByPlan === 'basic' && within.pharmacyFee === 0
           && beyond.coveredByPlan === null && beyond.pharmacyFee === 2800;
     }));
}

ok('a manager gets no pharmacist half \u2014 nothing about their day is a shift they work',
   await d.evaluate(() => !navFor('manager').some(x => ['browse', 'shifts', 'earnings'].includes(x[0]))));
ok('but the reference is still theirs, in the account group',
   await d.evaluate(() => managerGroups().some(g => g.items.some(x => x[0] === 'drugs'))));

console.log('\nevery inline handler actually parses');
/* A value interpolated into onclick="f(...)" without escaping its own quotes
   ends the attribute early, and the browser keeps whatever is left. Nothing
   looks wrong — the markup reads correctly in the source and the button simply
   does nothing when pressed. It cost the More screen its entire contents once,
   so it is swept for rather than tested one button at a time. */
{
  const broken = [];
  for (const [mail, screens] of [
    ['ahmed@example.com', ['browse', 'shifts', 'earnings', 'drugs', 'more', 'cv', 'profile', 'incidents', 'notifications']],
    ['rahma@example.com', ['dashboard', 'post', 'applicants', 'trainees', 'billing', 'more', 'cv', 'profile']],
    ['zainab@uobaghdad.edu.iq', ['browse', 'placement', 'logbook', 'drugs', 'profile']],
    ['sales@sdi.example', ['partner', 'partnerNew', 'profile']],
    ['layla@rahmagroup.example', ['group', 'branch', 'post', 'applicants', 'billing',
                                  'consumption', 'drugs', 'cv', 'notifications', 'profile']]
  ]) {
    await signOut(d);
    await signIn(d, mail);
    for (const sc of screens) {
      await go(d, sc);
      const bad = await d.evaluate(() => [...document.querySelectorAll('[onclick]')]
        .map(el => el.getAttribute('onclick'))
        .filter(h => { try { new Function(h); return false; } catch (e) { return true; } }));
      bad.forEach(h => broken.push(`${mail} / ${sc}: ${h.slice(0, 60)}`));
    }
  }
  // And one record page, where the interpolated value is a drug name.
  await go(d, 'drugs');
  await d.evaluate(() => openDrug('Amoxicillin/Clavulanic acid'));   // a name with a slash in it
  await d.waitForTimeout(200);
  const bad = await d.evaluate(() => [...document.querySelectorAll('[onclick]')]
    .map(el => el.getAttribute('onclick'))
    .filter(h => { try { new Function(h); return false; } catch (e) { return true; } }));
  bad.forEach(h => broken.push('drug record: ' + h.slice(0, 60)));
  ok(`no broken inline handler on any screen of any account`, broken.length === 0);
  broken.slice(0, 6).forEach(x => console.log('        ' + x));
}

console.log('\nthings on one screen line up with each other');
/* The home card shipped inside a 660px-capped wrapper while the chip row and
   the listing grid below it used the screen's full width, so above about
   700px they stopped lining up — inset on one side, flush on the other, and
   invisible at phone width where the cap never binds. Width- and
   direction-dependent, so the check has to be both. */
{
  const off = [];
  for (const w of [430, 700, 800, 1000, 1440]) {
    const q = await open(w, 860);
    await signIn(q, 'ahmed@example.com');
    for (const dir of ['rtl', 'ltr']) {
      await q.evaluate(x => { setLang(x === 'rtl' ? 'ar' : 'en'); goto('browse'); }, dir);
      await q.waitForTimeout(220);
      const bad = await q.evaluate(() => {
        const edge = el => { const r = el.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right)]; };
        const card = document.querySelector('.check-card');
        const grid = document.querySelector('.grid-cards') || document.querySelector('.chip-row');
        if (!card || !grid) return 'missing';
        const a = edge(card), c = edge(grid);
        return (Math.abs(a[0] - c[0]) > 1 || Math.abs(a[1] - c[1]) > 1) ? `${a} vs ${c}` : null;
      });
      if (bad) off.push(`${w}px ${dir}: ${bad}`);
    }
    await q.close();
  }
  ok('the home card shares its edges with the board below it, at every width and both directions',
     off.length === 0);
  off.forEach(x => console.log('        ' + x));
}

console.log('\nthe marketplace, switched off (v0.0009)');
const dk = await (async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('pageerror (dark): ' + e.message));
  p.on('console', m => {
    if (m.type() === 'error' && !/ERR_(CONNECTION|NAME|INTERNET|CERT)/.test(m.text())) errs.push('console (dark): ' + m.text());
  });
  await p.goto(darkUrl);
  await p.waitForTimeout(400);
  return p;
})();
const parses = p => p.evaluate(() => [...document.querySelectorAll('[onclick]')]
  .map(el => el.getAttribute('onclick'))
  .filter(h => { try { new Function(h); return false; } catch (e) { return true; } }));

ok('it is off by default — nobody has to remember to switch it off',
   await dk.evaluate(() => FLAGS.marketplace === false && FLAGS.placements === true));
ok('and the sign-in page shows the switches, saying what each one holds',
   await dk.locator('.flags .switch').count() === 2
   && await dk.locator('.flags .switch[data-flag="marketplace"]').getAttribute('aria-checked') === 'false');

await signIn(dk, 'ahmed@example.com');
await dk.evaluate(() => setLang('en'));
await dk.waitForTimeout(200);
ok('a pharmacist’s bar is check-in, tasks, the Helper, the CV and their profile',
   await dk.evaluate(() => navFor('pharmacist').map(x => x[0]).join() === 'checkin,tasks,drugs,cv,profile'));
ok('and they land on check-in', await dk.evaluate(() => S.screen === 'checkin'));
ok('every marketplace screen is unreachable, not merely unlinked',
   await dk.evaluate(() => ['browse', 'listing', 'shifts', 'handoff', 'earnings', 'applicants', 'incidents']
     .every(x => { goto(x); return S.screen !== x; })));
ok('including by a render that finds itself on one',
   await dk.evaluate(() => { S.screen = 'earnings'; render(); return S.screen === 'checkin'; }));
{
  const found = [];
  for (const sc of await dk.evaluate(() => navFor(S.role).map(x => x[0]).concat(['products', 'notifications']))) {
    await go(dk, sc);
    const n = await dk.evaluate(() => document.querySelectorAll('.listing-card, .job-row, .banner-slot, .next-shift').length);
    if (n) found.push(sc);
  }
  ok(`no shift, job or paid placement appears anywhere a pharmacist can go${found.length ? ' (found on ' + found.join(', ') + ')' : ''}`,
     found.length === 0);
}
await go(dk, 'checkin');
ok('check-in says it is coming rather than pretending to work',
   await dk.locator('.soon-tag').count() === 1 && /attendance/i.test(await dk.locator('#app-body').innerText()));
ok('the Helper is still one tap from the pharmacist’s home', await dk.locator('.check-card').count() === 1);
await go(dk, 'tasks');
ok('so do tasks, with what they will do', await dk.locator('.soon-tag').count() === 1
   && await dk.locator('.soon-list li').count() === 3);
ok('the relief shift a pharmacist recorded dispensing against is gone with the market',
   await dk.evaluate(() => dispensePharmacy() === null));

await signOut(dk);
await signIn(dk, 'rahma@example.com');
await dk.evaluate(() => setLang('en'));
await dk.waitForTimeout(200);
ok('an owner’s bar is their home, products, trainees, the Helper and their profile',
   await dk.evaluate(() => navFor('owner').map(x => x[0]).join() === 'dashboard,products,trainees,drugs,profile'));
{
  const txt = await dk.locator('#app-body').innerText();
  ok('their home stops prompting about applicants and unfilled shifts',
     !/waiting on you|unfilled/i.test(txt) && await dk.locator('.repeat-chip').count() === 0);
  ok('and says what arrives next instead', /point of sale/i.test(txt) && await dk.locator('.soon-tag').count() === 1);
  ok('it counts the catalogue, and how much of it the Helper cannot fully check',
     await dk.evaluate(t => { const s = catalogueSummary(); return t.includes(s.total + ' products') && t.includes(s.uncheckable + ' of them'); }, txt));
  ok('and still leads to the trainee waiting on a decision', /Zainab/.test(txt));
}
ok('nothing in the sidebar leads to the market',
   await dk.evaluate(() => ![...document.querySelectorAll('#side-nav [onclick]')]
     .some(el => /'(browse|shifts|earnings|applicants|incidents)'/.test(el.getAttribute('onclick')))));
await go(dk, 'post');
ok('the post form offers a placement and nothing else',
   await dk.evaluate(() => S.postType === 'internship') && await dk.locator('.segmented').count() === 0);

await signOut(dk);
await signIn(dk, 'layla@rahmagroup.example');
await dk.evaluate(() => setLang('en'));
await dk.waitForTimeout(200);
ok('a manager’s board leads with the one thing still true without the market: a branch nobody can sign for',
   /no responsible pharmacist/i.test(await dk.locator('#app-body').innerText())
   && await dk.locator('.branch-row .badge-pending, .branch-row .badge-stage').count() === 0);
await dk.evaluate(() => setBranch('P9'));
await dk.waitForTimeout(200);
ok('and a branch offers no shift to post', await dk.locator('.btn-primary').count() === 0);

await signOut(dk);
await signIn(dk, 'zainab@uobaghdad.edu.iq');
await dk.evaluate(() => setLang('en'));
await dk.waitForTimeout(200);
ok('students keep their placement board — placements are a separate switch, and on',
   await dk.evaluate(() => navFor('student')[0][0] === 'browse'));
ok('but the jobs tab went with the market', await dk.locator('.segbar').count() === 0);

ok('switching the market on brings every screen back, and switching it off takes them away again',
   await dk.evaluate(() => {
     signOut(); signInAs('ahmed@example.com');
     setFlag('marketplace', true);
     const on = navFor('pharmacist')[0][0] === 'browse';
     goto('earnings'); const reached = S.screen === 'earnings';
     setFlag('marketplace', false);
     return on && reached && S.screen === 'checkin';
   }));
ok('and this browser remembers the choice',
   await dk.evaluate(() => { try { return JSON.parse(localStorage.getItem(FLAGS_KEY)).marketplace === false; } catch (e) { return false; } }));
ok('placements have their own switch',
   await dk.evaluate(() => {
     setFlag('placements', false);
     const stu = navFor('student').map(x => x[0]).join();
     const own = navFor('owner').map(x => x[0]);
     setFlag('placements', true);
     return stu === 'drugs,profile' && !own.includes('trainees');
   }));

console.log('\nthe product catalogue (v0.0009)');
await dk.evaluate(() => { signOut(); signInAs('rahma@example.com'); setLang('en'); goto('products'); });
await dk.waitForTimeout(200);
ok('the catalogue lists every product', await dk.locator('.prod-row').count() === PRODUCT_DATA.length);
ok('every product either maps to its ingredients or says it does not',
   await dk.evaluate(() => PRODUCTS.every(p => {
     openProduct(p.barcode);
     const body = document.getElementById('app-body');
     return !!body.querySelector('[class*="cov-"]') && !!body.querySelector('.badge')
       && (p.molecules.length > 0) === (p.mapping === 'verified' || p.mapping === 'auto');
   })));
ok('a product with an ingredient outside the reference never reads as fully checkable',
   await dk.evaluate(() => PRODUCTS.filter(p => p.molecules.some(m => m.ref === false)).every(p => {
     openProduct(p.barcode);
     return !document.querySelector('.cov-full') && productCoverage(p).kind !== 'full';
   })));
ok('full coverage is said plainly, never in green — the Helper does not hand out ticks',
   await dk.evaluate(() => { openProduct(PRODUCTS.find(p => productCoverage(p).kind === 'full').barcode);
     const b = document.querySelector('.cov-full'); return !!b && !b.classList.contains('banner-green'); }));
ok('an unmapped product can still be sold, and the Helper will say so',
   await dk.evaluate(() => { openProduct(PRODUCTS.find(p => p.mapping === 'unmapped').barcode);
     return /can still be sold/.test(document.getElementById('app-body').innerText); }));
ok('an ingredient in the reference opens its drug record',
   await dk.evaluate(() => { openProduct(PRODUCTS.find(p => p.name.en === 'Co-Diovan 160/12.5 mg').barcode);
     document.querySelector('#app-body .card button.row').click(); return S.screen === 'drug' && S.openDrug === 'Valsartan'; }));

await dk.evaluate(() => goto('products'));
ok('scanning a known barcode opens the product',
   await dk.evaluate(() => { scanProduct(PRODUCTS[0].barcode); return S.screen === 'product' && S.openProduct === PRODUCTS[0].barcode; }));
ok('an unknown barcode is sent for mapping, once, however often it is scanned',
   await dk.evaluate(() => {
     goto('products'); S.mappingRequests = [];
     scanProduct('4006381333931'); scanProduct(' 4006381-333931 ');
     return S.mappingRequests.length === 1 && S.mappingRequests[0].times === 2 && S.scanNote.kind === 'unknown';
   }));
ok('and the screen says it can still be sold',
   /can still sell it/.test(await dk.locator('.scan-note').innerText()));
ok('a misread is refused, and nothing is sent for mapping',
   await dk.evaluate(() => { scanProduct('4006381333932'); scanProduct('12345');
     return S.mappingRequests.length === 1 && S.scanNote.kind === 'misread'; }));
ok('a wedge scanner works: digits, then Enter, in the search box',
   await dk.evaluate(async () => {
     const el = document.getElementById('prod-q');
     el.value = PRODUCTS[5].barcode;
     el.dispatchEvent(new KeyboardEvent('keydown', { key:'Enter', bubbles:true }));
     return S.screen === 'product' && S.openProduct === PRODUCTS[5].barcode;
   }));
await dk.evaluate(() => goto('products'));
ok('a name search works in Arabic',
   await dk.evaluate(() => { setProductQuery('بنادول'); const n = document.querySelectorAll('.prod-row').length;
     setProductQuery(''); return n === PRODUCTS.filter(p => p.name.ar.includes('بنادول')).length && n > 0; }));
ok('the filters count what they hold',
   await dk.evaluate(() => { setProductFilter('unmapped'); const n = document.querySelectorAll('.prod-row').length;
     setProductFilter('all'); return n === catalogueSummary().unmapped; }));

{
  const broken = [];
  for (const [mail, screens] of [
    ['ahmed@example.com', ['checkin', 'tasks', 'drugs', 'cv', 'products', 'profile']],
    ['rahma@example.com', ['dashboard', 'products', 'trainees', 'post', 'billing', 'profile']],
    ['layla@rahmagroup.example', ['group', 'branch', 'products', 'billing', 'profile']]
  ]) {
    await dk.evaluate(m => { signOut(); signInAs(m); }, mail);
    for (const sc of screens) {
      await go(dk, sc);
      (await parses(dk)).forEach(h => broken.push(`${mail} / ${sc}: ${h.slice(0, 60)}`));
    }
  }
  await dk.evaluate(() => openProduct(PRODUCTS[1].barcode));
  (await parses(dk)).forEach(h => broken.push('product: ' + h.slice(0, 60)));
  ok('no broken inline handler on any screen of the switched-off build', broken.length === 0);
  broken.slice(0, 6).forEach(x => console.log('        ' + x));
}
await dk.setViewportSize({ width: 320, height: 700 });
{
  const wide = [];
  for (const [mail, screens] of [['ahmed@example.com', ['checkin', 'tasks', 'products']],
                                 ['rahma@example.com', ['dashboard', 'products']]]) {
    await dk.evaluate(m => { signOut(); signInAs(m); }, mail);
    for (const dir of ['ar', 'en']) {
      await dk.evaluate(x => setLang(x), dir);
      for (const sc of screens) {
        await go(dk, sc);
        if (await dk.evaluate(() => document.body.scrollWidth) > 320) wide.push(`${sc} (${dir})`);
      }
      await dk.evaluate(() => openProduct(PRODUCTS[2].barcode));
      if (await dk.evaluate(() => document.body.scrollWidth) > 320) wide.push(`product (${dir})`);
    }
  }
  ok(`the new screens do not scroll sideways at 320px, in either direction${wide.length ? ' (' + wide.join(', ') + ')' : ''}`,
     wide.length === 0);
}

console.log('\nlayout');
ok('the sidebar carries navigation at 1440px', await d.locator('.sidebar').isVisible());
ok('the bottom bar does not', await d.locator('.bottom-nav').isHidden());
const m = await open(430, 932);
await signIn(m, 'rahma@example.com');
ok('at 430px they swap', await m.locator('.sidebar').isHidden() && await m.locator('.bottom-nav').isVisible());
ok('five targets, no more', await m.locator('.nav-item').count() === 5);
ok('Arabic is the default', await m.evaluate(() => document.documentElement.dir) === 'rtl');
await m.evaluate(() => setLang('en'));
await m.waitForTimeout(200);
ok('English turns the page around', await m.evaluate(() => document.documentElement.dir) === 'ltr');
const narrow = await open(320, 700);
await signIn(narrow, 'ahmed@example.com');
for (const s of ['browse', 'shifts', 'earnings', 'cv', 'profile']) {
  await go(narrow, s);
  ok(`${s} does not scroll sideways at 320px`,
     await narrow.evaluate(() => document.body.scrollWidth) <= 320);
}
/* The branch board is the widest thing in the build — a name, a responsible
   pharmacist and up to three badges on one row — so it gets the narrow
   treatment in both directions. A chain manager on a cheap Android is the
   person most likely to be standing in one of the branches. */
{
  await narrow.evaluate(() => signOut());
  await signIn(narrow, 'layla@rahmagroup.example');
  for (const dir of ['ar', 'en']) {
    await narrow.evaluate(x => setLang(x), dir);
    for (const s of ['group', 'billing']) {
      await narrow.evaluate(x => { if (x === 'group') setBranch(null); goto(x); }, s);
      await narrow.waitForTimeout(150);
      ok(`${s} does not scroll sideways at 320px (${dir})`,
         await narrow.evaluate(() => document.body.scrollWidth) <= 320);
    }
    await narrow.evaluate(() => setBranch('P9'));
    await narrow.waitForTimeout(150);
    ok(`a branch does not scroll sideways at 320px (${dir})`,
       await narrow.evaluate(() => document.body.scrollWidth) <= 320);
  }
}

await browser.close();
console.log(errs.length ? `\n${errs.length} failed:\n` + errs.join('\n') : '\nAll checks passed.');
process.exit(errs.length ? 1 : 0);
