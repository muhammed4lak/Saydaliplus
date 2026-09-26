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
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { deflateRawSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import DRUG_DATA, { DUPLICATE_RULES, TAKE as TAKE_DATA } from '../data/drugs.mjs';
import PRODUCT_DATA from '../data/products.mjs';
import { dirname, join } from 'node:path';


/* Files carry their version in the name, so this picks the highest-numbered
   build in the directory rather than a name baked into the test — otherwise
   every bump silently tests a stale file, or fails for the wrong reason. */
function newestBuild(dir, prefix) {
  const found = readdirSync(dir)
    .filter(f => f.startsWith(prefix) && f.endsWith('.html'))
    /* v0.0012.1 — an amendment carries a third number, and outranks the
       version it amends. */
    .map(f => ({ f, v: (f.match(/_v(\d+)\.(\d+)(?:\.(\d+))?\.html$/) || [0, 0, 0, 0]).slice(1).map(x => Number(x || 0)) }))
    .sort((a, b) => (b.v[0] - a.v[0]) || (b.v[1] - a.v[1]) || (b.v[2] - a.v[2]));
  if (!found.length) throw new Error(`no ${prefix}*.html in ${dir}`);
  return found[0].f;
}

const here = dirname(fileURLToPath(import.meta.url));
const build = newestBuild(here, 'saydali-plus_v');
const file = join(here, build);
/* Since v0.0009 the marketplace is switched OFF by default (backlog Part 0).
   Everything below that exercises it — which is most of this file — runs with
   it switched back on — partners too, since v0.0011 — because "dark" must mean
   "unreachable", not "broken":
   the day W21 turns it on, it has to work exactly as it did. The dark build is
   checked separately, on a page opened without the switch. */
const url = 'file://' + file + '#flags=marketplace,partners';
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
   await d.evaluate(() => ACCOUNTS['rahma@example.com'].pharmacies.length === 1));
ok('"owner" is derived from the link rather than stored',
   await d.evaluate(() => {
     const a = ACCOUNTS['rahma@example.com'];
     const keep = a.pharmacies;
     const was = viewRole(a);
     a.pharmacies = [];
     const now = viewRole(a);
     a.pharmacies = keep;
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
    if (await d.locator('.banner-slot.paid').count() > 0) seen.push(screen);
  }
  ok(`a paid placement appears only on permitted surfaces (found on: ${seen.join(', ') || 'none'})`,
     seen.length > 0 && !seen.some(x => x.startsWith('drug')));
  ok('and never anywhere near the Dispensing Helper or the reference',
     !seen.includes('drugs (helper)') && !seen.includes('drugs (reference)') && !seen.includes('drug record'));
}
await d.evaluate(() => { setBrowseTab('shifts'); goto('browse'); });
await d.waitForTimeout(200);
ok('a placement is labelled as paid, in the reader’s language',
   /paid placement/i.test(await d.locator('.banner-slot.paid').innerText()));
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
   /paid placement \u2014 samarra/i.test(await d.locator('.banner-slot.paid').innerText()));
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

console.log('\nan owner of more than one pharmacy (W7, revised v0.0010)');
/* Iraq has no pharmacy chains; some pharmacists own several pharmacies. So
   this is an OWNER with more than one ownership link — not a manager, not a
   group, not a user type of its own. */
ok('there is no manager role and no group anywhere in the build',
   await d.evaluate(() => !Object.values(ACCOUNTS).some(a => viewRole(a) === 'manager' || 'manages' in a)
     && typeof GROUPS === 'undefined' && typeof isManager === 'undefined'));
await signOut(d);
await signIn(d, 'layla@example.com');
await d.evaluate(() => setLang('en'));
await d.waitForTimeout(250);
ok('an owner of three is simply an owner, whose link points at three pharmacies',
   await d.evaluate(() => S.role === 'owner' && ACCOUNTS[S.email].pharmacies.length === 3
     && viewRole({ type:'pharmacist', pharmacies:['P1'] }) === viewRole(ACCOUNTS[S.email])));
ok('with the same bar as an owner of one',
   await d.evaluate(() => navFor('owner').map(x => x[0]).join() ===
     (() => { const keep = S.email; S.email = 'rahma@example.com'; const n = navFor('owner').map(x => x[0]).join(); S.email = keep; return n; })()));
/* W1's rule is the one this change could most easily have broken. */
ok('every pharmacy keeps its own name, licence and responsible pharmacist',
   await d.evaluate(() => {
     const mine = myPharmacies();
     return new Set(mine.map(p => p.licence)).size === mine.length
       && new Set(mine.map(p => p.name.en)).size === mine.length
       && mine.every(p => 'responsible' in p);
   }));
ok('there is one tab per pharmacy, plus All — and they start on All',
   await d.locator('.ptab:not(.ptab-add)').count() === 4 && await d.evaluate(() => currentPharmacy() === null)
   && await d.locator('.ptab.on').innerText() === 'All');
{
  const txt = await d.locator('#app-body').innerText();
  ok('All says how many of them need the owner, not how many exist', /needing cover this week: \d of 3/.test(txt));
  ok('and lists every pharmacy', await d.locator('.branch-row').count() === 3);
  ok('the pharmacy that cannot legally open sorts first',
     await d.evaluate(() => pharmacyBoard()[0].responsible === null));
  ok('and says so in the one colour nothing else on the list uses',
     await d.locator('.branch-row').first().locator('.badge-alert').count() === 1);
  ok('its tab carries the mark too, so it shows from any of them', await d.locator('.ptab .ptab-dot').count() === 1);
  ok('a covered pharmacy sorts last', await d.evaluate(() => { const b = pharmacyBoard(); return b[b.length - 1].uncovered === 0; }));
  ok('the screen says owning several changes nothing about what each one needs',
     /licence/i.test(txt) && /one responsible pharmacist cannot answer for three/i.test(txt));
}
await d.locator('.branch-row').first().click();
await d.waitForTimeout(250);
ok('opening one from the list selects its tab', await d.evaluate(() => currentPharmacy().id === 'P9')
   && await d.locator('.ptab.on').innerText() === 'Dar Al-Dawa');
{
  const txt = await d.locator('#app-body').innerText();
  ok('and heads the screen with that pharmacy, its licence and who answers for it',
     /Dar Al-Dawa Pharmacy/.test(txt) && /IQ-PHM-000658/.test(txt) && /cannot open until one is named/.test(txt));
}
await d.locator('.ptab', { hasText:'All' }).click();
await d.waitForTimeout(250);
ok('and All takes them back to all of them', await d.evaluate(() => currentPharmacy() === null));
ok('the profile lists every pharmacy held, each as itself',
   await d.evaluate(() => { goto('profile'); const t2 = document.getElementById('app-body').innerText;
     return ['IQ-PHM-000633', 'IQ-PHM-000641', 'IQ-PHM-000658'].every(l => t2.includes(l)); }));
ok('the alert about a pharmacy nobody can sign for reaches its owner and nobody else',
   await d.evaluate(() => {
     const mine = S.notifs.filter(notifMine).some(n => n.id === 'n7');
     const keep = S.email; S.email = 'rahma@example.com';
     const theirs = S.notifs.filter(notifMine).some(n => n.id === 'n7');
     S.email = keep; return mine && !theirs;
   }));
ok('an owner without a trainee is not shown someone else’s',
   await d.evaluate(() => { goto('trainees'); return !/Zainab/.test(document.getElementById('app-body').innerText); }));
ok('signing in again starts on All, not on the last tab somebody chose',
   await d.evaluate(() => { setPharmacy('P8'); signOut(); signInAs('layla@example.com'); return currentPharmacy() === null; }));
ok('an owner of one sees no tabs at all',
   await d.evaluate(() => { signOut(); signInAs('rahma@example.com'); goto('dashboard');
     const n = document.querySelectorAll('.ptab').length; signOut(); signInAs('layla@example.com'); return n === 0; }));

console.log('\nwhat an owner of several is charged');
await d.evaluate(() => goto('billing'));
await d.waitForTimeout(250);
{
  const txt = await d.locator('#app-body').innerText();
  ok('priced per pharmacy, so one subscription cannot cover twelve of them',
     await d.evaluate(() => myPlan().monthlyFeeIQD === PLANS[S.plan].monthlyFeeIQD * myPharmacies().length));
  ok('and the bill says so in words as well as arithmetic',
     /per pharmacy/i.test(txt) && /one invoice/i.test(txt));
  ok('the allowance is shared across their pharmacies',
     await d.evaluate(() => myPlan().includedShifts === PLANS[S.plan].includedShifts * myPharmacies().length));
  ok('and the screen says it is spendable at any of them', /shared|any of them/i.test(txt));
  ok('an owner of one is charged exactly the plan, unchanged',
     await d.evaluate(() => {
       const c = subscriptionCharge('basic', 1);
       return c.monthlyFeeIQD === PLANS.basic.monthlyFeeIQD && c.includedShifts === PLANS.basic.includedShifts;
     }));
  ok('nobody is ever billed for zero pharmacies',
     await d.evaluate(() => [0, -2, NaN].every(n => subscriptionCharge('basic', n).pharmacies === 1)));
  ok('the shared allowance runs out where the arithmetic says it does',
     await d.evaluate(() => {
       const n = myPharmacies().length;
       const within = calculateFees({ grossAmount:40000, pharmacyInTrial:false, pharmacistInTrial:false,
                                      plan:'basic', pharmacies:n, shiftsFilledThisMonth:(5 * n) - 1 });
       const beyond = calculateFees({ grossAmount:40000, pharmacyInTrial:false, pharmacistInTrial:false,
                                      plan:'basic', pharmacies:n, shiftsFilledThisMonth:5 * n });
       return within.coveredByPlan === 'basic' && within.pharmacyFee === 0
           && beyond.coveredByPlan === null && beyond.pharmacyFee === 2800;
     }));
}

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
    ['layla@example.com', ['dashboard', 'post', 'applicants', 'trainees', 'billing',
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
   await dk.locator('.flags .switch').count() === 3
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
    const n = await dk.evaluate(() => document.querySelectorAll('.listing-card, .job-row, .banner-slot.paid, .next-shift').length);
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
ok('an owner’s bar is their home, the till, stock, the Helper and their profile',
   await dk.evaluate(() => navFor('owner').map(x => x[0]).join() === 'dashboard,till,stock,drugs,profile'));
{
  const txt = await dk.locator('#app-body').innerText();
  ok('their home stops prompting about applicants and unfilled shifts',
     !/waiting on you|unfilled/i.test(txt) && await dk.locator('.repeat-chip').count() === 0);
  /* v0.0012: what used to be "coming" is here — the till is a link now, not
     a promise. */
  ok('and leads to the till instead, which is no longer “coming”',
     /Till/.test(txt) && !/on its way/i.test(txt) && await dk.locator('.soon-tag').count() === 0);
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
await signIn(dk, 'layla@example.com');
await dk.evaluate(() => setLang('en'));
await dk.waitForTimeout(200);
ok('an owner of several sees, on All, the one thing still true without the market: a pharmacy nobody can sign for',
   /no responsible pharmacist/i.test(await dk.locator('#app-body').innerText())
   && await dk.locator('.branch-row .badge-pending, .branch-row .badge-stage').count() === 0);
await dk.evaluate(() => setPharmacy('P9'));
await dk.waitForTimeout(200);
ok('and a pharmacy’s own tab offers no shift to post, only its till',
   !/post a shift/i.test(await dk.locator('#app-body').innerText()) &&
   await dk.evaluate(() => [...document.querySelectorAll('#app-body [onclick]')].some(el => /goto\('till'\)/.test(el.getAttribute('onclick')))));

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

console.log('\npartners closed, announcements open, nothing about shifts (v0.0011)');
await dk.evaluate(() => { signOut(); });
await dk.waitForTimeout(150);
ok('partners are switched off by default, on their own switch',
   await dk.evaluate(() => FLAGS.partners === false));
ok('and a partner account is not offered on the sign-in page',
   !(await dk.locator('.account-btn').allInnerTexts()).some(x => /sdi\.example/.test(x)));
ok('a partner who signs in anyway is told plainly, and let in to nothing',
   await dk.evaluate(() => { signInAs('sales@sdi.example'); return !S.signedIn; })
   && /Partner accounts open later|حسابات الشركاء/.test(await dk.locator('.auth-error').innerText()));
ok('with partners off no paid placement shows anywhere, even with the marketplace on',
   await dk.evaluate(() => {
     setFlag('marketplace', true); signInAs('ahmed@example.com'); setBrowseTab('shifts'); goto('browse');
     const paid = document.querySelectorAll('.banner-slot.paid').length;
     setFlag('marketplace', false); signOut();
     return paid === 0;
   }));
{
  const homes = [];
  for (const [mail, sc] of [['ahmed@example.com', 'checkin'], ['rahma@example.com', 'dashboard'],
                            ['layla@example.com', 'dashboard'], ['zainab@uobaghdad.edu.iq', 'browse']]) {
    const n = await dk.evaluate(([m, x]) => { signOut(); signInAs(m); setLang('en'); goto(x);
      return document.querySelectorAll('.banner-slot.announce').length; }, [mail, sc]);
    if (n !== 1) homes.push(mail);
  }
  ok(`the platform’s announcements are there from the start, on every home${homes.length ? ' (missing for ' + homes.join(', ') + ')' : ''}`,
     homes.length === 0);
}
ok('an announcement says it is from the platform, not that someone paid',
   await dk.evaluate(() => { const b = document.querySelector('.banner-slot.announce');
     return /saydali\+/i.test(b.innerText) && !/paid/i.test(b.innerText); }));
ok('and it stays off every clinical surface, like any placement',
   await dk.evaluate(() => {
     signOut(); signInAs('ahmed@example.com');
     const found = [];
     [() => { goto('drugs'); setDrugTab('check'); }, () => { goto('drugs'); setDrugTab('reference'); },
      () => { goto('drugs'); openDrug('Warfarin'); }, () => openProduct(PRODUCTS[0].barcode)].forEach((f, i) => {
       f(); if (document.querySelector('.banner-slot')) found.push(i);
     });
     return found.length === 0;
   }));
ok('an owner is not offered a switch for taking shifts while there are none to take',
   await dk.evaluate(() => { signOut(); signInAs('rahma@example.com'); setLang('en'); goto('profile');
     return !/Take shifts as a pharmacist/.test(document.getElementById('app-body').innerText)
       && !document.querySelector('[onclick="toggleTakesShifts()"]'); }));
ok('and the sign-up cards stop promising relief shifts',
   await dk.evaluate(() => { signOut(); setLang('en'); setAuth('roles');
     const txt = document.getElementById('auth').innerText; setAuth('signin');
     return !/relief shifts|Post shifts/i.test(txt) && /Dispensing Helper/.test(txt); }));

console.log('\nadding a pharmacy (v0.0011)');
await dk.evaluate(() => { signInAs('rahma@example.com'); setLang('en'); goto('profile'); });
await dk.waitForTimeout(150);
ok('an owner adds a pharmacy from their profile',
   await dk.locator('button', { hasText:'Add another pharmacy' }).count() === 1);
await dk.locator('button', { hasText:'Add another pharmacy' }).click();
await dk.waitForTimeout(150);
ok('the form asks for what verification needs', await dk.evaluate(() => S.screen === 'addPharmacy')
   && await dk.locator('#ap-licence').count() === 1 && await dk.locator('#ap-doc').count() === 1
   && await dk.locator('#ap-responsible').count() === 1);
await dk.locator('.btn-primary').click();
await dk.waitForTimeout(150);
ok('an empty form is refused, field by field',
   await dk.locator('.auth-error').count() === 4 && await dk.evaluate(() => myPharmacies().length === 1));
await dk.fill('#ap-nameEn', 'Al-Noor Pharmacy');
await dk.fill('#ap-licence', 'IQ-PHM-000117');
await dk.fill('#ap-district', 'Karrada');
await dk.evaluate(() => setAddPh('doc', 'licence.jpg'));
await dk.locator('.btn-primary').click();
await dk.waitForTimeout(150);
ok('a licence already registered to another pharmacy is refused',
   /already registered/.test(await dk.locator('.auth-error').innerText()));
await dk.fill('#ap-licence', 'IQ-PHM-000999');
await dk.locator('.btn-primary').click();
await dk.waitForTimeout(200);
const added = await dk.evaluate(() => currentPharmacy() && currentPharmacy().id);
ok('it joins the owner’s pharmacies at once — so an owner of one now has tabs',
   !!added && await dk.locator('.ptab:not(.ptab-add)').count() === 3);
ok('marked as under review, on its tab and at the top of its screen',
   await dk.locator('.ptab-dot.pending').count() === 1 && await dk.locator('.ap-pending').count() === 1);
ok('and it is not on the bill until it is verified',
   await dk.evaluate(() => myPlan().pharmacies === 1));
ok('it goes to the same human review queue as every other account',
   await dk.evaluate(id => { signOut(); signInAs('admin@saydali.example'); setLang('en');
     return DATA.reviewQueue.some(r => r.pharmacy === id) && /Al-Noor Pharmacy/.test(document.getElementById('app-body').innerText); }, added));
ok('approved there, it is verified — and billed',
   await dk.evaluate(id => { decide('r-' + id, true); signOut(); signInAs('rahma@example.com');
     return PHARMACIES[id].verification === 'verified' && myPlan().pharmacies === 2; }, added));
ok('refused there, it leaves the tabs but stays on the profile, marked',
   await dk.evaluate(id => {
     PHARMACIES[id].verification = 'pending';
     signOut(); signInAs('admin@saydali.example'); S.reviewed['r-' + id] = false; decide('r-' + id, false);
     signOut(); signInAs('rahma@example.com'); setLang('en');
     const tabs = myPharmacies().some(p => p.id === id);
     goto('profile'); const listed = /Not verified/.test(document.getElementById('app-body').innerText);
     return !tabs && listed;
   }, added));
ok('a pharmacist who owns a pharmacy adds it the same way, and becomes an owner',
   await dk.evaluate(() => {
     signOut(); signInAs('ahmed@example.com');
     const offered = profileLinks().some(x => x[0] === 'addPharmacy');
     goto('addPharmacy');
     setAddPh('nameEn', 'Al-Kawthar Pharmacy'); setAddPh('licence', 'IQ-PHM-000888');
     setAddPh('district', 'Adhamiya'); setAddPh('doc', 'licence.pdf');
     submitAddPharmacy();
     const became = S.role === 'owner' && myPharmacies().length === 1;
     ACCOUNTS['ahmed@example.com'].pharmacies = []; signOut();
     return offered && became;
   }));
await dk.evaluate(() => { ACCOUNTS['rahma@example.com'].pharmacies = ['P1']; });

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
    ['rahma@example.com', ['dashboard', 'till', 'stock', 'count', 'import', 'orders', 'suppliers', 'register', 'products', 'trainees', 'post', 'billing', 'profile']],
    ['layla@example.com', ['dashboard', 'till', 'stock', 'products', 'trainees', 'billing', 'profile']]
  ]) {
    await dk.evaluate(m => { signOut(); signInAs(m); }, mail);
    for (const sc of screens) {
      await go(dk, sc);
      (await parses(dk)).forEach(h => broken.push(`${mail} / ${sc}: ${h.slice(0, 60)}`));
    }
  }
  await dk.evaluate(() => openProduct(PRODUCTS[1].barcode));
  (await parses(dk)).forEach(h => broken.push('product: ' + h.slice(0, 60)));
  /* The till with everything on it at once: lines, open instructions, a
     finding, the discount form, an unknown item, and then the receipt. */
  await dk.evaluate(() => { signOut(); signInAs('rahma@example.com'); goto('till');
    tillScan('5000000001224'); tillScan('4000000001065'); tillToggleLine(0); tillOpenDiscount(); tillScan('6291234567894'); });
  (await parses(dk)).forEach(h => broken.push('till: ' + h.slice(0, 60)));
  await dk.evaluate(() => { S.till.given = '1000000'; completeSale(); });
  (await parses(dk)).forEach(h => broken.push('receipt: ' + h.slice(0, 60)));
  ok('no broken inline handler on any screen of the switched-off build', broken.length === 0);
  broken.slice(0, 6).forEach(x => console.log('        ' + x));
}
/* ---------------------------------------------------------------------------
   v0.0012 — THE TILL. Every rule decided before it was built is asserted here:
   each pharmacy's own price, the average only from five pharmacies and only for
   the owner, prices written onto the sale, the exact sum, tenders recorded not
   processed, discounts owner-only with a reason, voids and refunds on the
   record, the Helper on the whole basket without ever stopping a sale, and no
   banner anywhere near it.
   --------------------------------------------------------------------------- */
console.log('\nthe till (v0.0012)');
{
  /* Coverage worked out here from the data files, independently of the page. */
  const refSci = new Set(DRUG_DATA.map(d => d.sci));
  const covOf = p => p.mapping === 'nondrug' ? 'nondrug'
    : (p.mapping === 'unmapped' || !p.molecules.length) ? 'none'
    : p.molecules.every(x => x.ref !== false && refSci.has(x.sci)) ? 'full'
    : p.molecules.some(x => x.ref !== false && refSci.has(x.sci)) ? 'partial' : 'none';
  const pick = k => PRODUCT_DATA.find(p => covOf(p) === k).barcode;
  const mixed = [pick('full'), pick('partial'), pick('none'), pick('nondrug')];

  await dk.evaluate(() => { signOut(); signInAs('ahmed@example.com'); setLang('en'); goto('till'); });
  ok('a pharmacist without a pharmacy has no till — it is the owner’s until permissions (v0.0017)',
     await dk.evaluate(() => !screenAllowed('till') && S.screen !== 'till' && !navFor(S.role).some(x => x[0] === 'till')));
  await dk.evaluate(() => { goto('products'); openProduct(PRODUCTS[0].barcode); });
  ok('…and sees no price on the catalogue: what a pharmacy charges is the owner’s business',
     await dk.evaluate(() => !document.querySelector('.price-card, .market-avg') &&
       (goto('products'), !/IQD/.test(document.getElementById('app-body').innerText))));

  await dk.evaluate(() => { signOut(); signInAs('rahma@example.com'); setLang('en'); goto('dashboard'); });
  ok('the owner’s dashboard carries the till card, and a banner slot (so the next check is not vacuous)',
     await dk.evaluate(() => /Till/.test(document.getElementById('app-body').innerText) &&
       document.querySelectorAll('.banner-slot').length > 0));
  await dk.evaluate(() => goto('till'));
  ok('the till opens on the owner’s pharmacy, named, with who is dispensing',
     await dk.evaluate(() => S.screen === 'till' && /Al-Rahma/.test(document.querySelector('.till-ph').innerText) &&
       /Rahma/.test(document.querySelector('.till-by').innerText)));

  const avgCode = await dk.evaluate(() => PRODUCTS.find(p => marketAverage(p.barcode) != null && p.mapping !== 'nondrug').barcode);
  const thinCode = await dk.evaluate(() => (PRODUCTS.find(p => marketPrices(p.barcode).length && marketAverage(p.barcode) == null) || {}).barcode);
  ok('the fixture has products on both sides of the five-pharmacy floor', !!avgCode && !!thinCode);
  /* The floor itself, stated with the literal 5 rather than read back from
     the page's own constant. */
  ok('an average exists exactly when five or more pharmacies price the product (P6)',
     await dk.evaluate(() => PRODUCTS.every(p => (marketAverage(p.barcode) != null) === (marketPrices(p.barcode).length >= 5))));

  ok('scanning the same barcode twice is one line with a quantity of two, at the market average by default',
     await dk.evaluate(c => { tillScan(c); tillScan(c);
       return S.till.lines.length === 1 && S.till.lines[0].qty === 2 && S.till.lines[0].unit === marketAverage(c); }, avgCode));
  ok('a product under the floor, with no price of its own, is not guessed: the owner is asked to price it',
     await dk.evaluate(c => { tillScan(c);
       return S.till.lines.length === 1 && S.till.needPrice === c && !!document.querySelector('.till-needprice #till-price'); }, thinCode));
  ok('…and once priced it is added at that price, and it is the pharmacy’s price from then on',
     await dk.evaluate(c => { document.getElementById('till-price').value = '5125'; tillSetPriceAndAdd(c);
       const l = S.till.lines.find(x => x.barcode === c);
       return l && l.unit === 5125 && S.prices.P1[c] === 5125 && pharmacyPrice('P1', c) === 5125; }, thinCode));
  ok('a price change is on the record, with what it was before',
     await dk.evaluate(c => S.tillLog.some(x => x.kind === 'price' && x.code === c && x.to === 5125 && x.pharmacy === 'P1'), thinCode));

  ok('the total is the exact sum — no rounding to 250 or to anything else',
     await dk.evaluate(c => { setPrice('P1', c, 1234); S.till = tillReset(); tillScan(c); tillQty(0, 1); tillQty(0, 1);
       render(); return tillTotals().total === 3702 && /3,702/.test(document.getElementById('till-total').innerText); }, avgCode));
  ok('cash short of the total is refused and nothing is sold',
     await dk.evaluate(() => { const n = S.sales.length; S.till.given = '3700'; completeSale();
       return S.sales.length === n && S.till.note && S.till.note.kind === 'shortCash' && !!document.querySelector('.till-note'); }));
  ok('cash covering it completes the sale, with the exact change',
     await dk.evaluate(() => { S.till.given = '5000'; completeSale(); const s = S.sales[0];
       return s.total === 3702 && s.given === 5000 && s.change === 1298 && s.tender === 'cash' && s.pharmacy === 'P1'; }));
  ok('the price is written onto the sale: changing it afterwards leaves the past sale as it was',
     await dk.evaluate(c => { const id = S.sales[0].id; setPrice('P1', c, 9999);
       const s = S.sales.find(x => x.id === id);
       return s.lines[0].unit === 1234 && s.lines[0].total === 3702 && s.total === 3702 && pharmacyPrice('P1', c) === 9999; }, avgCode));

  ok('the receipt follows the sale, drawn 384 dots wide for a 58 mm printer',
     await dk.evaluate(() => { const img = document.querySelector('.receipt-img');
       return !!img && img.getAttribute('width') === '384' && img.src.startsWith('data:image/png') && img.dataset.lang === 'ar'; }));
  ok('it carries the pharmacy, licence, date, items, total, tender and the dispensing pharmacist — in Arabic by default',
     await dk.evaluate(() => { const s = S.sales[0]; const txt = receiptLines(s, 'ar').map(l => l.text + ' ' + (l.amount || '')).join('\n');
       return txt.includes(PHARMACIES.P1.name.ar) && txt.includes(PHARMACIES.P1.licence) && txt.includes(TODAY_ISO) &&
         txt.includes(s.lines[0].name.ar) && txt.includes('3,702') && txt.includes('نقداً') && txt.includes('1,298') &&
         txt.includes('رحمة'); }));
  ok('one press turns it English',
     await dk.evaluate(() => { toggleReceiptLang(); const img = document.querySelector('.receipt-img');
       const txt = receiptLines(S.sales[0], 'en').map(l => l.text).join('\n');
       return img.dataset.lang === 'en' && txt.includes(PHARMACIES.P1.name.en) && txt.includes('Rahma') && /Change/.test(receiptLines(S.sales[0], 'en').map(l => l.text).join()); }));
  ok('an owner-uploaded logo goes at the top of the receipt',
     await dk.evaluate(async () => { const c = document.createElement('canvas'); c.width = 60; c.height = 30;
       const g = c.getContext('2d'); g.fillRect(0, 0, 60, 30); setLogo('P1', c.toDataURL('image/png'));
       await new Promise(r => setTimeout(r, 100));
       const a = renderReceipt(S.sales[0], 'ar'), b = (delete LOGO_IMG.P1, renderReceipt(S.sales[0], 'ar'));
       return a.hasLogo && !b.hasLogo && a.height > b.height && a.width === 384; }));
  ok('a refund needs a reason and is the owner’s',
     await dk.evaluate(() => { const id = S.sales[0].id; openReceipt(id); refundSale(id);
       const refused = !S.sales[0].refunded && S.till.note.kind === 'needReason';
       if (!refused) return false;
       document.getElementById('refund-reason').value = 'Wrong strength'; refundSale(id);
       return refused && S.sales[0].refunded.reason === 'Wrong strength' &&
         S.tillLog.some(x => x.kind === 'refund' && x.sale === id && x.reason === 'Wrong strength'); }));

  await dk.evaluate(() => { closeReceipt(); S.till = tillReset(); });
  ok('Marevan with Aspirin is a Warn on the basket, acknowledgeable in one tap, never a stop',
     await dk.evaluate(() => { setPrice('P1', '5000000001224', 6000); setPrice('P1', '4000000001065', 3500);
       tillScan('5000000001224'); tillScan('4000000001065');
       const warn = document.querySelector('.till-finding.tier-warn .till-ack');
       return !!warn && !document.querySelector('.modal-back') && !!document.querySelector('.till-confirm, .till-complete'); }));
  ok('completing without acknowledging still sells — and records that it was not acknowledged',
     await dk.evaluate(() => { S.till.given = '10000'; completeSale(); const f = S.sales[0].findings.find(x => x.a && x.b);
       return S.sales[0].total === 9500 && f && f.tier === 'warn' && f.acknowledged === false; }));
  ok('acknowledged, it is recorded as acknowledged',
     await dk.evaluate(() => { closeReceipt(); tillScan('5000000001224'); tillScan('4000000001065');
       document.querySelector('.till-finding.tier-warn .till-ack').click();
       const shown = /Acknowledged/.test(document.querySelector('.till-helper').innerText);
       S.till.tender = 'zaincash'; S.till.ref = 'ZC-7781'; completeSale();
       const s = S.sales[0];
       return shown && s.findings.find(x => x.a && x.b).acknowledged === true &&
         s.tender === 'zaincash' && s.ref === 'ZC-7781' && s.given === null && s.change === null; }));
  ok('ZainCash and Qi Card are recorded, never processed — the screen says so',
     await dk.evaluate(() => { closeReceipt(); tillScan('4000000001065'); tillTender('qicard');
       const said = /no money passes through/i.test(document.querySelector('.till-pay').innerText);
       completeSale(); return said && S.sales[0].tender === 'qicard' && S.sales[0].ref === null; }));

  await dk.evaluate(() => { closeReceipt(); S.till = tillReset(); });
  ok('a mixed basket says how much of it was checked, the same way these data files do',
     await dk.evaluate(codes => { codes.forEach(c => { if (pharmacyPrice('P1', c) == null) setPrice('P1', c, 1000); tillScan(c); });
       const c = tillCoverage(S.till.lines);
       return S.till.lines.length === 4 && c.full === 1 && c.partial === 1 && c.unchecked === 1 && c.nondrug === 1 && c.medicines === 3; }, mixed));
  ok('…in one sentence at the top of the Helper, not a footnote',
     await dk.evaluate(() => /1 of 3 medicines checked.*1 in part.*1 not checked.*1 not a medicine/
       .test(document.querySelector('.till-helper .till-cov').innerText)));
  ok('the unchecked line is marked on the cart itself',
     await dk.evaluate(() => [...document.querySelectorAll('.till-line')].filter(x => /Not checked/i.test(x.innerText)).length === 1));
  ok('nothing on the till opens a banner — it is a dispensing surface (P1)',
     await dk.evaluate(() => !document.querySelector('#app-body .banner-slot') && !/SAYDALI\+ ·/i.test(document.getElementById('app-body').innerText)));

  ok('the dose is never filled in for the pharmacist',
     await dk.evaluate(() => S.till.lines.every(l => l.dose === '')));
  ok('a dose typed by the pharmacist reaches the receipt beside the instruction',
     await dk.evaluate(() => { if (pharmacyPrice('P1', '5000000001033') == null) setPrice('P1', '5000000001033', 2000);
       tillScan('5000000001033'); const i = S.till.lines.findIndex(x => x.barcode === '5000000001033');
       tillToggleLine(i); const el = document.querySelector('.till-instr .till-dose'); el.value = '1 tablet twice daily';
       el.dispatchEvent(new Event('input'));
       S.till.given = '100000'; completeSale();
       return receiptLines(S.sales[0], 'en').some(l => l.kind === 'instr' && l.text === '1 tablet twice daily — After food'); }));
  ok('a non-medicine carries no instruction',
     await dk.evaluate(() => { const s = S.sales[0]; const nd = s.lines.find(l => l.mapping === 'nondrug');
       const lines = receiptLines(s, 'en'); const at = lines.findIndex(l => l.text === nd.name.en);
       return !nd.take.length && !nd.note && (lines[at + 1] || {}).kind !== 'instr'; }));

  await dk.evaluate(() => { closeReceipt(); S.till = tillReset(); });
  ok('a misread is refused and nothing is added',
     await dk.evaluate(() => { tillScan('1234567890123');
       return !S.till.lines.length && S.till.note.kind === 'misread' && !!document.querySelector('.till-note'); }));
  ok('an unknown barcode can still be sold by name and price, and goes for mapping',
     await dk.evaluate(() => { const code = '6291234567894'; if (!ean13Valid(code)) return false;
       tillScan(code); const asked = !!document.querySelector('.till-unknown');
       document.getElementById('unk-name').value = 'Local herbal tea'; document.getElementById('unk-price').value = '1750'; tillAddUnknown();
       const l = S.till.lines[0];
       return asked && l && l.mapping === 'unmapped' && l.unit === 1750 && S.mappingRequests.some(r => r.barcode === code) &&
         /1 not checked/.test(document.querySelector('.till-cov').innerText); }));
  ok('removing a line is a void, and a void is on the record',
     await dk.evaluate(() => { const n = S.tillLog.filter(x => x.kind === 'void').length; tillVoid(0);
       return !S.till.lines.length && S.tillLog.filter(x => x.kind === 'void').length === n + 1; }));
  ok('a discount needs a reason; with one it comes off the exact total and is logged',
     await dk.evaluate(() => { tillScan('4000000001065'); tillScan('4000000001065'); tillOpenDiscount();
       document.getElementById('disc-amount').value = '500'; tillApplyDiscount();
       const refused = S.till.discount === 0 && S.till.note.kind === 'badDiscount';
       const kept = document.getElementById('disc-amount').value === '500';
       document.getElementById('disc-reason').value = 'Regular patient';
       tillApplyDiscount();
       return refused && kept && tillTotals().total === 6500 && S.tillLog.some(x => x.kind === 'discount' && x.reason === 'Regular patient'); }));
  ok('a discount larger than the basket is refused',
     await dk.evaluate(() => { const T = S.till; T.discount = 0; tillOpenDiscount();
       document.getElementById('disc-amount').value = '8000'; document.getElementById('disc-reason').value = 'x'; tillApplyDiscount();
       return T.discount === 0; }));
  ok('discounts and refunds are the owner’s alone (until permissions)',
     await dk.evaluate(() => { const keep = S.role; S.role = 'pharmacist';
       const r = !canDiscount() && !canRefund() && !canSetPrices() && !canSeeMarket() && !setPrice('P1', '4000000001065', 1);
       S.role = keep; return r; }));
  /* v0.0012.1 (A4): the button is offered with or without a built-in
     detector — v0.0012 hid it, and it looked as if scanning did not exist. */
  ok('the scan button is there without a built-in barcode detector',
     await dk.evaluate(() => { delete window.BarcodeDetector; render(); return !!document.querySelector('.till-cam'); }));
  ok('and with one',
     await dk.evaluate(() => { window.BarcodeDetector = function () {}; render();
       const shown = !!document.querySelector('.till-cam'); delete window.BarcodeDetector; render(); return shown; }));

  await dk.evaluate(() => { S.till = tillReset(); goto('products'); openProduct(PRODUCTS.find(p => marketAverage(p.barcode) != null).barcode); });
  ok('the owner sees their price and the average market price, from five pharmacies up',
     await dk.evaluate(() => /Average market price: [\d,]+ IQD — from \d+ pharmacies/.test(document.querySelector('.market-avg').innerText)));
  await dk.evaluate(c => openProduct(c), thinCode);
  ok('below five, no average is shown — fewer is somebody’s price',
     await dk.evaluate(() => /fewer than 5 pharmacies/i.test(document.querySelector('.market-avg').innerText) &&
       !/Average market price/.test(document.getElementById('app-body').innerText)));

  /* An owner of several: the till belongs to the pharmacy on screen. */
  await dk.evaluate(() => { signOut(); signInAs('layla@example.com'); setLang('en'); goto('till'); });
  ok('an owner of several on All is asked which pharmacy to sell from',
     await dk.evaluate(() => S.screen === 'till' && /Which pharmacy/i.test(document.getElementById('app-body').innerText) && !document.getElementById('till-q')));
  ok('picking one opens that pharmacy’s till, not the dashboard',
     await dk.evaluate(() => { setPharmacy('P7'); return S.screen === 'till' && !!document.getElementById('till-q') &&
       document.querySelector('.till-ph').innerText.includes(L(PHARMACIES.P7.name)); }));
  ok('prices are each pharmacy’s own: setting one at P7 leaves P8 alone',
     await dk.evaluate(c => { setPrice('P7', c, 4321); return pharmacyPrice('P7', c) === 4321 && pharmacyPrice('P8', c) === marketAverage(c); }, avgCode));
  ok('switching pharmacy with a cart open sets the cart aside, on the record',
     await dk.evaluate(c => { tillScan(c); const had = S.till.lines.length === 1; setPharmacy('P8');
       return had && !S.till.lines.length && S.tillLog.some(x => x.kind === 'cleared' && x.pharmacy === 'P7'); }, avgCode));
  ok('a sale is recorded against the pharmacy it was made in, and listed only there',
     await dk.evaluate(c => { tillScan(c); S.till.given = '100000'; completeSale(); const id = S.sales[0].id;
       closeReceipt(); const atP8 = document.getElementById('app-body').innerText.includes(id);
       setPharmacy('P7'); const atP7 = document.getElementById('app-body').innerText.includes(id);
       return S.sales[0].pharmacy === 'P8' && atP8 && !atP7; }, avgCode));
  ok('a pharmacy with no responsible pharmacist cannot sell',
     await dk.evaluate(() => { setPharmacy('P9'); return !!document.querySelector('.till-blocked') && !document.getElementById('till-q') &&
       (tillAdd(PRODUCTS[0].barcode), !S.till.lines.length); }));
  ok('nor can one still under review',
     await dk.evaluate(() => { PHARMACIES.P8.verification = 'pending'; setPharmacy('P8');
       const r = !!document.querySelector('.till-blocked') && !document.getElementById('till-q');
       PHARMACIES.P8.verification = 'verified'; return r; }));
  ok('the owner can upload a receipt logo from each pharmacy’s card on their profile',
     await dk.evaluate(() => { goto('profile');
       return document.querySelectorAll('.logo-input').length === myPharmacies().length; }));
}

/* ---------------------------------------------------------------------------
   v0.0012.1 — the till's first amendment: smaller figures on the receipt
   (A1), instructions that say something (A2), a scan button that is always
   there with a reader of its own (A4), and cash confirmed in one tap (A5).
   A3 is a CRM string, checked in crm/check.mjs.
   --------------------------------------------------------------------------- */
console.log('\nthe till, amended (v0.0012.1)');
{
  /* EAN-13 bars, drawn here from the standard's tables rather than from the
     page's, so the reader is tested against an independent encoder. */
  const EL = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
  const EG = EL.map(x => [...x].map(c => c === '1' ? '0' : '1').reverse().join(''));
  const ER = EL.map(x => [...x].map(c => c === '1' ? '0' : '1').join(''));
  const EP = ['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'];
  const eanBits = c => { const d = [...c].map(Number); let s = '101';
    for (let i = 1; i < 7; i++) s += (EP[d[0]][i - 1] === 'L' ? EL : EG)[d[i]];
    s += '01010'; for (let i = 7; i < 13; i++) s += ER[d[i]]; return s + '101'; };

  await dk.evaluate(() => { signOut(); signInAs('rahma@example.com'); setLang('en'); goto('till'); S.till = tillReset(); render(); });

  /* A1 */
  ok('A1 — an item’s figures are drawn smaller than its name, still bold, and the total is the largest',
     await dk.evaluate(() => {
       tillScan('4000000001065'); S.till.given = '100000'; completeSale();
       const fonts = []; const orig = CanvasRenderingContext2D.prototype.fillText;
       CanvasRenderingContext2D.prototype.fillText = function (txt) { fonts.push([String(txt), this.font]); return orig.apply(this, arguments); };
       try { renderReceipt(S.sales[0], 'en'); } finally { CanvasRenderingContext2D.prototype.fillText = orig; }
       const px = f => Number((f.match(/(\d+)px/) || [])[1]);
       const name = fonts.find(x => x[0] === S.sales[0].lines[0].name.en);
       const amount = fonts.find(x => /^1 × /.test(x[0]));
       const total = fonts.find(x => /^Total$/.test(x[0]));
       return name && amount && total && px(amount[1]) < px(name[1]) && px(name[1]) < px(total[1]) &&
         /^600 /.test(amount[1]) && px(amount[1]) === 12; }));
  await dk.evaluate(() => closeReceipt());

  /* A2 */
  ok('A2 — no product prints a generic line: nothing like “swallow with water” or “shake well”',
     await dk.evaluate(() => PRODUCTS.every(p => { const l = tillLineFromProduct(p, 1000);
       return ['ar', 'en'].every(rl => !/swallow|shake|as directed|يُبلع|تُبلع|رُجّ|حسب الإرشاد/i.test(instructionText(l, rl))); })));
  ok('the drug reference’s instructions all come from the fixed list, in both languages',
     Object.values(TAKE_DATA).every(v => v.ar && v.en) &&
     DRUG_DATA.every(d => (d.take || []).every(k => TAKE_DATA[k])) &&
     DRUG_DATA.filter(d => d.take && d.take.length).length >= 40);
  ok('levothyroxine: on an empty stomach, 30 minutes before breakfast, by default',
     await dk.evaluate(() => { const p = PRODUCTS.find(x => x.molecules.some(m => m.sci === 'Levothyroxine'));
       const l = tillLineFromProduct(p, 1000);
       return l.take.includes('emptyStomach') && l.take.includes('beforeBreakfast') &&
         /empty stomach.*30 minutes before breakfast/i.test(instructionText(l, 'en')); }));
  ok('methotrexate: once a week only',
     await dk.evaluate(() => defaultTake({ molecules:[{ sci:'Methotrexate' }] }).join() === 'weekly'));
  ok('a combination merges its molecules’ instructions without repeats (Janumet: with food, once)',
     await dk.evaluate(() => defaultTake(productByCode('5000000001286')).join() === 'withFood'));
  ok('a medicine with nothing worth saying prints no instruction line (Panadol)',
     await dk.evaluate(() => { S.till = tillReset(); tillScan('5000000001002'); S.till.given = '100000'; completeSale();
       const r = !receiptLines(S.sales[0], 'en').some(l => l.kind === 'instr'); closeReceipt(); return r; }));
  ok('the choices are one tap each, the medicine’s own already on',
     await dk.evaluate(() => { S.till = tillReset(); tillScan('4000000001065'); tillToggleLine(0);
       const on = [...document.querySelectorAll('.take-chip.active')].map(x => x.dataset.take);
       document.querySelector('.take-chip[data-take="morning"]').click();
       document.querySelector('.take-chip[data-take="afterFood"]').click();
       return on.join() === 'afterFood' && S.till.lines[0].take.join() === 'morning' &&
         document.querySelectorAll('.take-chip').length === Object.keys(TAKE).length; }));
  ok('what will print shows on the cart line without opening it',
     await dk.evaluate(() => document.querySelector('.till-line-instr').innerText === 'In the morning'));
  ok('the receipt translates the chosen instructions; a typed note prints as typed',
     await dk.evaluate(() => { S.till.lines[0].note = 'Keep away from children'; S.till.given = '100000'; completeSale();
       const en = receiptLines(S.sales[0], 'en').find(l => l.kind === 'instr').text;
       const ar = receiptLines(S.sales[0], 'ar').find(l => l.kind === 'instr').text;
       closeReceipt();
       return en === 'In the morning · Keep away from children' && ar === 'صباحاً · Keep away from children'; }));

  /* A4 */
  ok('A4 — the till says a USB or Bluetooth scanner works as it is',
     await dk.evaluate(() => { S.till = tillReset(); render(); return /USB or Bluetooth scanner/.test(document.querySelector('.till-empty').innerText); }));
  ok('with no camera API at all (a file viewer), the button explains itself instead of doing nothing',
     await dk.evaluate(async () => { const keep = Object.getOwnPropertyDescriptor(Navigator.prototype, 'mediaDevices');
       Object.defineProperty(navigator, 'mediaDevices', { value:undefined, configurable:true });
       try { document.querySelector('.till-cam').click(); await new Promise(r => setTimeout(r, 50));
         return S.modal.error === 'unsupported' && /Open the file in Chrome/.test(document.getElementById('modal-root').innerText);
       } finally { delete navigator.mediaDevices; if (keep) Object.defineProperty(Navigator.prototype, 'mediaDevices', keep); } }));
  ok('a refused camera says how to allow it',
     await dk.evaluate(async () => { closeModal(); const md = navigator.mediaDevices, orig = md.getUserMedia;
       md.getUserMedia = () => Promise.reject(Object.assign(new Error('no'), { name:'NotAllowedError' }));
       try { await cameraScan(); return S.modal.error === 'denied' && /Allow the camera/.test(document.getElementById('modal-root').innerText); }
       finally { md.getUserMedia = orig; } }));
  ok('“type it instead” closes the camera and puts the cursor in the box',
     await dk.evaluate(() => { cameraTypeInstead(); return !S.modal && document.activeElement && document.activeElement.id === 'till-q'; }));
  {
    const codes = PRODUCT_DATA.map(p => p.barcode);
    const r = await dk.evaluate(([codes, allBits]) => {
      const draw = (bits, mw, o) => { const c = document.createElement('canvas'); c.width = 640; c.height = 480; const g = c.getContext('2d');
        g.fillStyle = '#fff'; g.fillRect(0, 0, 640, 480); if (o.blur) g.filter = 'blur(' + o.blur + 'px)';
        g.save(); g.translate(320, 240); if (o.rot) g.rotate(o.rot); const w = bits.length * mw; g.fillStyle = '#111';
        [...bits].forEach((x, i) => { if (x === '1') g.fillRect(-w / 2 + i * mw, -80, mw, 160); }); g.restore();
        const d = g.getImageData(0, 0, 640, 480);
        if (o.noise) for (let i = 0; i < d.data.length; i += 4) { const n = (((i * 7919) % 97) / 97 - 0.5) * o.noise; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n; }
        return d; };
      const cases = [[3, {}], [4, { blur:1 }], [2.5, {}], [4, { rot:Math.PI / 2 }], [3, { rot:Math.PI }], [3.5, { rot:0.05, blur:1.2 }], [3, { noise:60 }]];
      let read = 0, wrong = 0, total = 0;
      codes.forEach((c, k) => cases.forEach(([mw, o]) => { total++; const got = decodeEan13(draw(allBits[k], mw, o));
        if (got === c) read++; else if (got) wrong++; }));
      const blank = document.createElement('canvas'); blank.width = 320; blank.height = 240;
      const bg = blank.getContext('2d'); bg.fillStyle = '#777'; bg.fillRect(0, 0, 320, 240);
      return { read, wrong, total, blank:decodeEan13(bg.getImageData(0, 0, 320, 240)) };
    }, [codes, codes.map(eanBits)]);
    ok(`the built-in reader reads every catalogue barcode — straight, sideways, upside down, blurred, noisy (${r.read}/${r.total})`,
       r.read === r.total);
    ok('and never reads a wrong number, or one off a blank frame', r.wrong === 0 && r.blank === null);
  }
  {
    /* The whole path, through a camera: Chromium's fake device plays a frame
       with Aspirin Protect's barcode on it. */
    const W = 640, H = 480, bits = eanBits('4000000001065'), mw = 4, x0 = (W - bits.length * mw) / 2;
    const Y = Buffer.alloc(W * H, 235);
    for (let y = 140; y < 340; y++) for (let i = 0; i < bits.length; i++) if (bits[i] === '1') for (let k = 0; k < mw; k++) Y[y * W + x0 + i * mw + k] = 20;
    const y4m = join(tmpdir(), 'saydali-bar-' + process.pid + '.y4m');
    writeFileSync(y4m, Buffer.concat([Buffer.from(`YUV4MPEG2 W${W} H${H} F10:1 Ip A1:1 C420jpeg\nFRAME\n`), Y, Buffer.alloc(W * H / 2, 128)]));
    const camBrowser = await chromium.launch({ ...launch, args:['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream',
      '--use-file-for-fake-video-capture=' + y4m] });
    const cp = await (await camBrowser.newContext({ viewport:{ width:390, height:844 } })).newPage();
    cp.on('pageerror', e => errs.push('pageerror (camera): ' + e.message));
    await cp.goto(darkUrl);
    await cp.evaluate(() => { signInAs('rahma@example.com'); setLang('en'); goto('till'); delete window.BarcodeDetector;
      document.querySelector('.till-cam').click(); });
    await cp.waitForFunction(() => S.till.lines.length > 0, null, { timeout:8000 }).catch(() => {});
    ok('a real camera stream is read and the item lands in the cart, and the camera closes',
       await cp.evaluate(() => S.till.lines.length === 1 && S.till.lines[0].barcode === '4000000001065' && !S.modal));
    await cp.evaluate(() => { S.till = tillReset(); render(); S.scanKeep = true; document.querySelector('.till-cam').click(); });
    await cp.waitForFunction(() => S.till.lines.length > 0, null, { timeout:8000 }).catch(() => {});
    await cp.waitForTimeout(2500);
    ok('keep scanning stays open, says what it added, and a box held up is counted once',
       await cp.evaluate(() => !!S.modal && /Added: Aspirin Protect/.test(document.getElementById('cam-status').innerText) &&
         S.till.lines.length === 1 && S.till.lines[0].qty === 1 && !!document.getElementById('cam')));
    await cp.evaluate(() => closeModal());
    await camBrowser.close();
  }

  /* A5 */
  await dk.evaluate(() => { closeModal(); S.till = tillReset(); tillScan('4000000001065'); tillScan('4000000001065'); });
  ok('A5 — cash is one tap to confirm the exact total, with nothing to type',
     await dk.evaluate(() => /Received exactly 7,000 IQD/.test(document.querySelector('.till-confirm').innerText) &&
       !document.getElementById('till-given')));
  ok('confirmed, it completes: received equals the total, no change, recorded as confirmed',
     await dk.evaluate(() => { document.querySelector('.till-confirm').click(); const s = S.sales[0];
       const rc = receiptLines(s, 'en').map(l => l.text + ' ' + (l.amount || '')).join('\n');
       return s.total === 7000 && s.given === 7000 && s.change === 0 && s.cashConfirmed === true &&
         /Change 0 IQD/.test(rc); }));
  await dk.evaluate(() => { closeReceipt(); tillScan('4000000001065'); });
  ok('a different amount is typed, and the change shows as it is typed',
     await dk.evaluate(() => { document.querySelector('.till-other').click();
       const el = document.getElementById('till-given'); el.value = '10000'; el.dispatchEvent(new Event('input'));
       const shown = document.getElementById('till-change').innerText;
       el.value = '3000'; el.dispatchEvent(new Event('input'));
       const short = document.getElementById('till-change').innerText;
       return !!el && shown === 'Change: 6,500 IQD' && short === 'Short by 500 IQD'; }));
  ok('below the total it is still refused, and the typed amount stays on screen',
     await dk.evaluate(() => { const n = S.sales.length; completeSale();
       return S.sales.length === n && S.till.note.kind === 'shortCash' && !!document.getElementById('till-given'); }));
  ok('typed, it is recorded as typed, not confirmed',
     await dk.evaluate(() => { const el = document.getElementById('till-given'); el.value = '10000'; el.dispatchEvent(new Event('input'));
       completeSale(); const s = S.sales[0]; closeReceipt();
       return s.given === 10000 && s.change === 6500 && s.cashConfirmed === false; }));
  ok('ZainCash and Qi Card are untouched: no cash confirmation, a reference, recorded only',
     await dk.evaluate(() => { tillScan('4000000001065'); tillTender('zaincash');
       const r = !document.querySelector('.till-confirm') && !!document.getElementById('till-ref') && !!document.querySelector('.till-complete');
       completeSale(); const s = S.sales[0]; closeReceipt(); return r && s.tender === 'zaincash' && s.cashConfirmed === null; }));
}

/* ---------------------------------------------------------------------------
   v0.0013 — STOCK AND PURCHASING. The two things the backlog said this
   version's check must prove — no stock level is ever written directly, and
   the controlled register reconciles to the movements exactly — and every
   decision behind it: batches and expiry, first-expiring first, quarantine,
   write-offs with a reason, never refusing a sale (S1), cost and bonus units
   (S3), suppliers matched and confirmed (S4), refunds back to stock by
   default (S5), shelf-by-shelf counting, a spreadsheet import with a review,
   save-and-continue, undo with its window (Q3), and history (Q4).
   --------------------------------------------------------------------------- */
console.log('\nstock and purchasing (v0.0013)');
{
  /* A real .xlsx, built here: a zip of the XML a spreadsheet program writes,
     with Arabic headings the way a Karmasoft export might have them. */
  const crcTable = [...Array(256)].map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc32 = buf => { let c = 0xFFFFFFFF; for (const b of buf) c = crcTable[(c ^ b) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  const zip = files => {
    const locals = [], centrals = []; let off = 0;
    for (const [name, text] of files) {
      const raw = Buffer.from(text, 'utf8'), data = deflateRawSync(raw), nm = Buffer.from(name, 'utf8');
      const h = Buffer.alloc(30); h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x0800, 6); h.writeUInt16LE(8, 8);
      h.writeUInt32LE(crc32(raw), 14); h.writeUInt32LE(data.length, 18); h.writeUInt32LE(raw.length, 22); h.writeUInt16LE(nm.length, 26);
      const c = Buffer.alloc(46); c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8); c.writeUInt16LE(8, 10);
      c.writeUInt32LE(crc32(raw), 16); c.writeUInt32LE(data.length, 20); c.writeUInt32LE(raw.length, 24); c.writeUInt16LE(nm.length, 28); c.writeUInt32LE(off, 42);
      locals.push(h, nm, data); centrals.push(c, nm); off += 30 + nm.length + data.length;
    }
    const cd = Buffer.concat(centrals), e = Buffer.alloc(22);
    e.writeUInt32LE(0x06054b50, 0); e.writeUInt16LE(files.length, 8); e.writeUInt16LE(files.length, 10); e.writeUInt32LE(cd.length, 12); e.writeUInt32LE(off, 16);
    return Buffer.concat([...locals, cd, e]);
  };
  const sheetRows = [
    ['ت', 'اسم المادة', 'الباركود', 'الكمية', 'تاريخ الانتهاء', 'سعر الشراء'],
    ['1', 'Panadol 500 mg', '5000000001002', '10', '2027-06-30', '1500'],
    ['2', 'بروفين 400 ملغ', '', '5', '46752', '2500'],          // no barcode; an Excel date serial
    ['3', 'Panadol 500 mg', '5000000001002', '2', '06/2027', '1500'],   // same product and expiry: a duplicate
    ['4', 'Voltaren 50 mg', '7600000001040', '4', '', '3000'],     // no expiry: an error
    ['5', 'Local cough syrup', '6291234567894', '4', '12/2027', '1800'], // a real barcode, not in the catalogue
    ['6', 'Something unreadable', '', '3', '01/2028', ''],           // nothing to match
    ['7', 'Voltaren 50 mg', '7600000001040', '2', '01/2026', '3000']  // already expired
  ];
  const strings = [...new Set(sheetRows.flat().filter(v => !/^\d+$/.test(v) && v !== ''))];
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const colL = i => String.fromCharCode(65 + i);
  const sheetXml = '<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>' +
    sheetRows.map((r, y) => '<row r="' + (y + 1) + '">' + r.map((v, x) => v === '' ? '' :
      /^\d+$/.test(v) && x !== 2 ? '<c r="' + colL(x) + (y + 1) + '"><v>' + v + '</v></c>' :
      x === 2 ? '<c r="' + colL(x) + (y + 1) + '" t="inlineStr"><is><t>' + v + '</t></is></c>' :
      '<c r="' + colL(x) + (y + 1) + '" t="s"><v>' + strings.indexOf(v) + '</v></c>').join('') + '</row>').join('') + '</sheetData></worksheet>';
  const xlsx = zip([
    ['[Content_Types].xml', '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>'],
    ['xl/workbook.xml', '<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Stock" sheetId="1" r:id="rId7"/></sheets></workbook>'],
    ['xl/_rels/workbook.xml.rels', '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/stock.xml"/></Relationships>'],
    ['xl/worksheets/stock.xml', sheetXml],
    ['xl/sharedStrings.xml', '<?xml version="1.0"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' + strings.map(s => '<si><t>' + esc(s) + '</t></si>').join('') + '</sst>']
  ]);

  await dk.evaluate(() => { signOut(); signInAs('rahma@example.com'); setLang('en'); goto('dashboard'); });
  ok('an owner’s bar: home, the till, stock, the Helper, their profile',
     await dk.evaluate(() => navFor('owner').map(x => x[0]).join() === 'dashboard,till,stock,drugs,profile'));
  ok('the catalogue is one tap inside Stock and in the sidebar',
     await dk.evaluate(() => { goto('stock'); return /Catalogue and prices/.test(document.getElementById('app-body').innerText) &&
       sidebarGroups()[0].items.some(x => x[0] === 'products'); }));
  ok('the home screen says what the shelf needs',
     await dk.evaluate(() => { goto('dashboard'); const t = document.getElementById('app-body').innerText;
       return /Stock/.test(t) && /Expired batches in quarantine: 1/.test(t) && /Expiring within 90 days: 1/.test(t); }));

  /* The two things this version's check was promised to prove. */
  ok('NO STOCK LEVEL IS EVER WRITTEN DIRECTLY: one writer of movements, and no level stored anywhere',
     await dk.evaluate(() => {
       const src = [...document.scripts].map(s => s.textContent).join('\n');
       const writers = (src.match(/S\.movements\.push\(/g) || []).length;
       const assigned = /S\.movements\s*=(?!=)|\.movements\[[^\]]*\]\s*=(?!=)|\b(level|onHand|available)\s*:\s*\d/.test(src.replace(/available:\s*stock/g, ''));
       const batchKeys = new Set(S.batches.flatMap(b => Object.keys(b)));
       return writers === 1 && !assigned && ['qty', 'level', 'available', 'stock'].every(k => !batchKeys.has(k)); }));
  ok('every level on screen is the sum of its movements',
     await dk.evaluate(() => stockCodes('P1').every(c => { const st = stockOf('P1', c);
       return st.onHand === S.movements.filter(m => m.pharmacy === 'P1' && m.code === c).reduce((n, m) => n + m.qty, 0); })));

  ok('a pharmacist without a pharmacy reaches none of it',
     await dk.evaluate(() => STOCK_SCREENS.every(s => !screenAllowed(s, 'pharmacist'))));

  /* Batches, expiry, first-expiring first, quarantine. */
  ok('an expired batch is counted but never available — it is in quarantine',
     await dk.evaluate(() => { const st = stockOf('P1', '7600000001040'); return st.available === 0 && st.expired === 3 && st.onHand === 3; }));
  ok('the till sells first-expiring first',
     await dk.evaluate(() => { goto('count'); startCount('Shelf 2'); countScan('5000000001002'); countScan('5000000001002');
       countExpiry(0, ymOffset(3).slice(5) + '/' + ymOffset(3).slice(2, 4)); confirmCount();
       goto('till'); S.till = tillReset(); tillScan('5000000001002'); tillQty(0, 1); tillQty(0, 1);
       const before = stockOf('P1', '5000000001002').batches.filter(b => b.kind === 'stock').map(b => [b.expiry, b.qty]);
       confirmCash(); closeReceipt();
       const moves = S.movements.filter(m => m.ref === S.sales[0].id).map(m => [S.batches.find(b => b.id === m.batch).expiry, m.qty]);
       return moves.length === 2 && moves[0][0] === ymOffset(3) && moves[0][1] === -2 && moves[1][0] === ymOffset(14) && moves[1][1] === -1; }));
  ok('never from an expired batch: with only expired stock the line says to check the box, and the sale still goes through (S1)',
     await dk.evaluate(() => { S.till = tillReset(); tillScan('7600000001040');
       const said = /only expired|All that is recorded is expired/i.test(document.querySelector('.till-line').innerText);
       confirmCash(); closeReceipt(); const st = stockOf('P1', '7600000001040');
       return said && st.expired === 3 && st.unbatched === -1 && st.available === -1; }));
  ok('a product sold past its record joins “Count this”',
     await dk.evaluate(() => stockPrompts('P1').countThis.some(x => x.code === '7600000001040' && x.short === 1)));

  /* Counting. */
  ok('a count starts by naming the shelf — nothing is assumed about where things are',
     await dk.evaluate(() => { goto('count'); startCount(''); return S.stockNote.kind === 'needShelf' && !openCountSession(); }));
  ok('shelves already named are offered',
     await dk.evaluate(() => { render(); return [...document.querySelectorAll('.st-shelf-pick')].map(x => x.innerText).join('|') === 'Shelf 1 — painkillers|Fridge|Shelf 2'; }));
  ok('each scan adds a box; a box with no expiry cannot be confirmed',
     await dk.evaluate(() => { startCount('Shelf 3'); countScan('5000000001316'); countScan('5000000001316'); countScan('5000000001316');
       const s = openCountSession(); confirmCount();
       return s.items.length === 1 && s.items[0].qty === 3 && S.stockNote.kind === 'needExpiry' && s.state === 'open'; }));
  ok('expiry is month and year; the last box’s is one tap away; another date is another line',
     await dk.evaluate(() => { countExpiry(0, '11/27'); countSplit(0); const s = openCountSession();
       const offered = /Same as the last box \(11\/2027\)/.test(document.querySelector('.ct-same').innerText);
       countSameAsLast(1); /* the same date again merges back into one line */
       const merged = s.items.length === 1 && s.items[0].qty === 4;
       countSplit(0); countExpiry(1, '02/28');
       return offered && merged && s.items.length === 2 && s.items[1].expiry === '2028-02'; }));
  ok('progress is a count of drugs and boxes, never a percentage',
     await dk.evaluate(() => { const t = document.querySelector('.ct-progress').innerText; return t === '1 drugs · 5 boxes' && !/%/.test(document.getElementById('app-body').innerText); }));
  ok('save and continue later: it leaves the screen, waits on the hub, and resumes where it was',
     await dk.evaluate(() => { saveCount(); const onHub = /Count: Shelf 3/.test(document.getElementById('app-body').innerText) &&
       !!document.querySelector('.st-draft .btn-small');
       const id = S.countSessions.find(x => x.shelf === 'Shelf 3').id; resumeCount(id);
       return onHub && S.screen === 'count' && openCountSession().items.length === 2; }));
  ok('a saved count survives closing the app (on this device)',
     await (async () => { const p2 = await dk.context().newPage(); await p2.goto(darkUrl);
       const r = await p2.evaluate(() => { signInAs('rahma@example.com'); setLang('en');
         return S.countSessions.some(x => x.shelf === 'Shelf 3' && x.state === 'saved'); });
       await p2.close(); return r; })());
  ok('confirmed: “2 drugs counted” on the shelf, each linked to its shelf',
     await dk.evaluate(() => { countScan('5000000001316'); openCountSession().items.forEach((it, i) => { if (!it.expiry) countExpiry(i, '11/27'); });
       countScan('4000000001294'); countExpiry(openCountSession().items.length - 1, '05/28'); confirmCount();
       const nex = stockOf('P1', '5000000001316');
       /* After resuming, the next Nexium joined its last line (02/28): 4 + 2. */
       return S.screen === 'stock' && nex.available === 6 && S.shelfOf.P1['5000000001316'].join() === 'Shelf 3' &&
         /Shelf 3 · 2 drugs, 7 boxes/.test(document.querySelector('.st-shelves').innerText); }));
  ok('a count settles sales made before it: they were already off the shelf it saw',
     await dk.evaluate(() => { goto('till'); S.till = tillReset(); tillScan('3000000001219'); tillQty(0, 1); confirmCash(); closeReceipt();
       const before = stockOf('P1', '3000000001219').available;
       goto('count'); startCount('Shelf 3'); countScan('3000000001219'); countExpiry(0, '09/28');
       /* a recount of Shelf 3: Nexium and Jardiance are not on it this time —
          and the screen says so before it is confirmed */
       window.__warned = /Recorded on this shelf, not counted yet: 2/.test(document.querySelector('.ct-left').innerText);
       confirmCount(); const st = stockOf('P1', '3000000001219');
       return before === -2 && st.available === 1 && st.unbatched === 0 && !stockPrompts('P1').countThis.some(x => x.code === '3000000001219'); }));
  ok('a recount of a shelf is the truth about that shelf: what is no longer on it leaves',
     await dk.evaluate(() => window.__warned && stockOf('P1', '5000000001316').available === 0 && stockOf('P1', '4000000001294').available === 0));

  /* Undo (Q3). */
  ok('the earlier count cannot be undone once a later one touched the same products; the later one can',
     await dk.evaluate(() => { const [a, b] = S.countSessions.filter(x => x.shelf === 'Shelf 3' && x.state === 'committed');
       return undoState(a).ok === false && undoState(a).why === 'later' && undoState(b).ok === true; }));
  ok('undo takes the whole count back in one press, as movements, and is recorded',
     await dk.evaluate(() => { goto('stock'); const b = S.countSessions.filter(x => x.shelf === 'Shelf 3' && x.state === 'committed')[1];
       const n = S.movements.length;
       document.querySelector('.st-op[data-op="' + b.id + '"] .st-undo').click();
       return b.state === 'undone' && stockOf('P1', '5000000001316').available === 6 && S.movements.length > n &&
         S.movements.slice(n).every(m => m.kind === 'undo' && m.ref === b.id) && S.tillLog.some(x => x.kind === 'countUndone' && x.op === b.id); }));
  ok('once the later one is undone, the earlier one can be undone again',
     await dk.evaluate(() => undoState(S.countSessions.filter(x => x.shelf === 'Shelf 3' && x.state === 'committed')[0]).ok));
  ok('until the end of the next day — after that, no undo, and the screen says why',
     await dk.evaluate(() => { const a = S.countSessions.filter(x => x.shelf === 'Shelf 3' && x.state === 'committed')[0];
       S.clockShift = 2 * 864e5; render(); const r = undoState(a).why === 'window' &&
         /undo window has passed/.test(document.querySelector('.st-op[data-op="' + a.id + '"]').innerText) &&
         !document.querySelector('.st-op[data-op="' + a.id + '"] .st-undo');
       S.clockShift = 0; render(); return r; }));

  /* The spreadsheet (T5). */
  await dk.evaluate(() => { goto('import'); window.__pan = stockOf('P1', '5000000001002').available; window.__vol = stockOf('P1', '7600000001040').expired;
    window.__bru = stockOf('P1', '5000000001033').available; });
  await dk.setInputFiles('#im-file', { name:'karmasoft-export.xlsx', mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer:xlsx });
  await dk.waitForFunction(() => S.screen === 'import' && !!document.querySelector('.im-pile'), null, { timeout:5000 }).catch(() => {});
  ok('an .xlsx is read — first sheet by its relationship, shared and inline strings — and its Arabic columns found by themselves',
     await dk.evaluate(() => { const imp = S.imports.find(x => x.id === S.openImport);
       return !!imp && imp.rows.length === 7 && imp.cols.barcode === 2 && imp.cols.name === 1 && imp.cols.qty === 3 &&
         imp.cols.expiry === 4 && imp.cols.cost === 5; }));
  ok('nothing is in stock yet: it is a review',
     await dk.evaluate(() => stockOf('P1', '5000000001002').available === window.__pan));
  ok('every row lands in its pile: matched, probably, not found, duplicates, errors',
     await dk.evaluate(() => { const rows = classifyImport(S.imports.find(x => x.id === S.openImport)); const p = k => rows.filter(r => r.pile === k).map(r => r.i + 1).join();
       return p('matched') === '1,7' && p('probable') === '2' && p('notFound') === '5,6' && p('duplicate') === '3' && p('error') === '4'; }));
  ok('an Excel date serial and a written date read as the same month',
     await dk.evaluate(() => { const rows = classifyImport(S.imports.find(x => x.id === S.openImport));
       return rows[1].expiry === '2027-12' && rows[0].expiry === '2027-06' && rows[2].expiry === '2027-06'; }));
  ok('an expired row and a product already in stock are flagged before anything is added',
     await dk.evaluate(() => { const t = document.getElementById('app-body').textContent;   /* matched rows sit in a closed <details> */
       return /expired — goes to quarantine/i.test(t) && /adds to what is recorded/i.test(t); }));
  ok('a “probably” row must be answered before the import can be confirmed',
     await dk.evaluate(() => { document.querySelector('.im-confirm').click(); return S.importNote.kind === 'probableLeft' && stockOf('P1', '5000000001002').available === window.__pan; }));
  ok('“is it Brufen 400 mg?” — yes moves it to matched',
     await dk.evaluate(() => { const q = document.querySelector('.im-row[data-pile="probable"]'); const said = /Is it Brufen 400 mg\?/.test(q.innerText);
       q.querySelector('.im-yes').click(); return said && !document.querySelector('.im-row[data-pile="probable"]'); }));
  ok('an unknown product with a real barcode can come in by its name — the owner ticks it',
     await dk.evaluate(() => { document.querySelector('.im-row[data-row="4"] input[type=checkbox]').click();
       return !!document.querySelector('.im-row[data-row="4"] input:checked'); }));
  ok('save and continue later works for an import too',
     await dk.evaluate(() => { const id = S.openImport; saveImport(id); const waiting = /Import: karmasoft-export.xlsx/.test(document.getElementById('app-body').innerText);
       resumeImport(id); return waiting && S.screen === 'import' && S.imports.find(x => x.id === id).decide[1] === 'yes'; }));
  ok('confirmed: duplicates merged, costs kept, the expired row straight to quarantine, the unknown one sent for mapping',
     await dk.evaluate(() => { const id = S.openImport; document.querySelector('.im-confirm').click();
       const imp = S.imports.find(x => x.id === id);
       const pan = S.movements.filter(m => m.ref === id && m.code === '5000000001002');
       return imp.state === 'committed' && pan.length === 1 && pan[0].qty === 12 && pan[0].unitCost === 1500 &&
         stockOf('P1', '7600000001040').expired === window.__vol + 2 && stockOf('P1', '5000000001033').available === window.__bru + 5 &&
         S.mappingRequests.some(r => r.barcode === '6291234567894') && stockOf('P1', '6291234567894').available === 4; }));
  ok('the whole import can be undone in one press',
     await dk.evaluate(() => { const imp = S.imports.find(x => x.state === 'committed'); undoOp(imp.id);
       return imp.state === 'undone' && stockOf('P1', '5000000001002').available === window.__pan && stockOf('P1', '6291234567894').available === 0; }));
  ok('an old .xls is met with “save it as .xlsx or CSV”, not a failure',
     await (async () => { await dk.evaluate(() => goto('import'));
       await dk.setInputFiles('#im-file', { name:'old.xls', mimeType:'application/vnd.ms-excel', buffer:Buffer.from('not really') });
       await dk.waitForTimeout(150);
       return dk.evaluate(() => S.importNote && S.importNote.kind === 'xls' && /Save it as \.xlsx or CSV/.test(document.querySelector('.im-note').innerText)); })());
  ok('a CSV reads too: a byte-order mark, semicolons, quoted commas',
     await (async () => {
       const csv = '﻿Barcode;Name;Qty;Expiry;Cost\r\n5000000001316;"Nexium 40 mg, 14 caps";3;09/2027;9000\r\n';
       await dk.setInputFiles('#im-file', { name:'stock.csv', mimeType:'text/csv', buffer:Buffer.from(csv, 'utf8') });
       await dk.waitForTimeout(200);
       return dk.evaluate(() => { const imp = S.imports.find(x => x.id === S.openImport); const r = classifyImport(imp);
         const ok1 = r.length === 1 && r[0].pile === 'matched' && r[0].raw.name === 'Nexium 40 mg, 14 caps' && r[0].expiry === '2027-09';
         discardImport(imp.id); return ok1; }); })());

  /* Purchase orders, cost and bonus (S3). */
  ok('an order needs a supplier before it is sent',
     await dk.evaluate(() => { goto('orders'); newOrder(); const o = openOrderRec(); o.supplier = null; render();
       orderAdd('5000000001316'); orderLine(0, 'qty', '10'); orderLine(0, 'bonus', '1'); orderLine(0, 'cost', '9000');
       sendOrder(); return o.state === 'draft' && S.stockNote.kind === 'needSupplier'; }));
  ok('sent, it records that it was sent — the text can be copied for WhatsApp; nothing passes through us',
     await dk.evaluate(() => { const o = openOrderRec(); orderSupplier('SP1'); sendOrder();
       return o.state === 'sent' && /Nexium 40 mg × 10 \(\+1 Bonus\)/.test(orderText(o)); }));
  ok('received in part: a batch with its expiry and cost; the bonus arrives at zero and lowers the unit cost',
     await dk.evaluate(() => { const o = openOrderRec(); orderRecv(0, 'qty', '6'); orderRecv(0, 'bonus', '1'); orderRecv(0, 'expiry', '08/28'); orderRecv(0, 'cost', '9000');
       const before = stockOf('P1', '5000000001316').available; receiveOrder();
       const b = S.batches.find(x => x.id === o.receipts[0].lines[0].batch);
       return o.state === 'partial' && stockOf('P1', '5000000001316').available === before + 7 && b.expiry === '2028-08' &&
         Math.round(batchCost(b.id)) === Math.round(6 * 9000 / 7) &&
         S.movements.some(m => m.batch === b.id && m.kind === 'bonus' && m.qty === 1 && m.unitCost === 0); }));
  ok('the rest can arrive later, or the order be closed',
     await dk.evaluate(() => { const o = openOrderRec(); const left = o.lines[0].recv.qty === 4 && o.lines[0].recv.bonus === 0;
       closeOrder(); return left && o.state === 'closed'; }));
  ok('with costs recorded, the owner sees the stock’s value',
     await dk.evaluate(() => { goto('stock'); return !!document.querySelector('.st-value') && stockValue('P1') > 0; }));

  /* Suppliers (S4). */
  ok('a supplier is suggested from the database however it is written',
     await dk.evaluate(() => ['Al-Shifa storage house', 'مخزن الشفا', 'مذخر الشفاء', 'مستودع الشفاء'].every(n => (supplierMatches(n)[0] || {}).id === 'CO8') &&
       (supplierMatches('Rafidain')[0] || {}).id === 'CO5' && supplierMatches('مذخر النور').length === 0));
  ok('picking the suggestion links it',
     await dk.evaluate(() => { goto('suppliers'); supplierQuery('Rafidain pharma'); document.querySelector('.sp-sugg[data-crm="CO5"] .sp-pick').click();
       return suppliersOf('P1').some(s => s.linked === 'CO5'); }));
  ok('none of them: it is added as the pharmacy’s own, and goes to the team',
     await dk.evaluate(() => { supplierQuery('مذخر النور'); const offered = !document.querySelector('.sp-sugg');
       document.querySelector('.sp-own').click();
       const s = suppliersOf('P1').find(x => x.name === 'مذخر النور');
       return offered && s && !s.linked && S.supplierRequests.some(r => r.name === 'مذخر النور' && r.pharmacy === 'P1'); }));
  ok('even with a suggestion on screen, “none of these” stays private — nothing is linked for the owner',
     await dk.evaluate(() => { supplierQuery('الشفاء الجديد'); const suggested = !!document.querySelector('.sp-sugg[data-crm="CO8"]');
       document.querySelector('.sp-own').click(); const s = suppliersOf('P1').find(x => x.name === 'الشفاء الجديد');
       return suggested && s && s.linked === null; }));
  ok('when the team finds the record, the owner is asked — and only a yes links it',
     await dk.evaluate(() => { const card = document.querySelector('.sp-confirm[data-sp="SP2"]');
       const asked = /Is “مخزن الشفاء” the same as “Al-Shifa Drug Store”\?/.test(card.innerText);
       const s = S.suppliers.find(x => x.id === 'SP2'); const before = s.linked;
       card.querySelector('.sp-yes').click();
       return asked && before === null && s.linked === 'CO8' && S.tillLog.some(x => x.kind === 'supplierLinked' && x.supplier === 'SP2'); }));

  /* Refunds (S5). */
  ok('a refund offers two places, with back to stock already chosen',
     await dk.evaluate(() => { goto('till'); S.till = tillReset(); tillScan('5000000001002'); confirmCash();
       const radios = [...document.querySelectorAll('input[name="rf-dest"]')];
       return radios.length === 2 && (radios.find(r => r.checked) || {}).value === 'stock'; }));
  ok('confirmed as it stands, the box goes back to the batch it left',
     await dk.evaluate(() => { const before = stockOf('P1', '5000000001002').available; const sale = S.sales[0];
       const from = S.movements.find(m => m.ref === sale.id && m.kind === 'sale').batch;
       document.getElementById('refund-reason').value = 'Wrong item'; refundSale(sale.id);
       const back = S.movements.find(m => m.ref === sale.id && m.kind === 'refund');
       return stockOf('P1', '5000000001002').available === before + 1 && back.batch === from && sale.refunded.dest === 'stock'; }));
  ok('set aside instead, it goes to quarantine — counted, not available',
     await dk.evaluate(() => { closeReceipt(); tillScan('5000000001002'); confirmCash(); const sale = S.sales[0];
       const before = stockOf('P1', '5000000001002');
       document.querySelector('input[name="rf-dest"][value="quarantine"]').checked = true;
       document.getElementById('refund-reason').value = 'Opened box'; refundSale(sale.id);
       const after = stockOf('P1', '5000000001002'); closeReceipt();
       return after.quarantine === 1 && after.available === before.available && sale.refunded.dest === 'quarantine'; }));

  /* Write-offs, minimums, the product screen. */
  ok('an expired batch leaves only by a write-off with a reason',
     await dk.evaluate(() => { openProduct('7600000001040'); const b = S.batches.find(x => x.pharmacy === 'P1' && x.code === '7600000001040' && x.kind === 'stock' && isExpired(x.expiry) && batchQty(x.id) > 0);
       writeOff(b.id); const refused = batchQty(b.id) > 0 && S.stockNote.kind === 'needReason';
       document.getElementById('wo-' + b.id).value = 'destroyed'; writeOff(b.id);
       return refused && batchQty(b.id) === 0 && S.movements.some(m => m.batch === b.id && m.kind === 'writeoff' && m.reason === 'destroyed'); }));
  ok('the product screen says where it lives and shows its history',
     await dk.evaluate(() => { openProduct('5000000001002'); const t = document.getElementById('app-body').innerText;
       return /Where: Shelf 1 — painkillers · Shelf 2/.test(t) && !!document.querySelector('.sk-hist'); }));
  ok('a minimum the owner sets brings the product onto “below your minimum”',
     await dk.evaluate(() => { document.getElementById('min-level').value = '500'; setMinLevel('5000000001002');
       return stockPrompts('P1').low.some(x => x.code === '5000000001002' && x.min === 500); }));

  /* The controlled register. */
  ok('THE CONTROLLED REGISTER RECONCILES TO THE MOVEMENTS EXACTLY',
     await dk.evaluate(() => { goto('till'); S.till = tillReset(); tillScan('3000000001455'); tillQty(0, 1); confirmCash(); closeReceipt();
       const reg = controlledRegister('P1');
       const codes = [...new Set(reg.map(r => r.code))];
       const everyMove = S.movements.filter(m => m.pharmacy === 'P1' && isControlled(m.code)).map(m => m.id).join() === reg.map(r => r.id).join();
       const balances = codes.every(c => reg.filter(r => r.code === c).pop().balance === stockOf('P1', c).onHand);
       return reg.length >= 2 && everyMove && balances && codes.includes('3000000001455') && !codes.includes('5000000001002'); }));
  ok('the register lists them, newest first, with who and why',
     await dk.evaluate(() => { goto('register'); const rows = [...document.querySelectorAll('.rg-row')];
       return rows.length >= 2 && /Xanax/.test(rows[0].innerText) && /Sale/.test(rows[0].innerText) && /balance 8/.test(rows[0].innerText); }));

  /* Logged, and kept per pharmacy. */
  ok('everything is logged for the owner: counts, imports, undo, receipts, write-offs, suppliers',
     await dk.evaluate(() => ['count', 'countSaved', 'countUndone', 'import', 'importUndone', 'orderReceived', 'writeoff', 'supplierLinked', 'supplierAdded']
       .every(k => S.tillLog.some(x => x.kind === k))));
  ok('each pharmacy’s stock is its own',
     await dk.evaluate(() => { signOut(); signInAs('layla@example.com'); setLang('en'); setPharmacy('P7'); goto('stock');
       const clean = stockCodes('P7').length === 0 && /0 drugs counted/.test(document.getElementById('app-body').innerText);
       goto('count'); startCount('Front'); countScan('5000000001002'); countExpiry(0, '10/27'); confirmCount();
       return clean && stockOf('P7', '5000000001002').available === 1 && stockOf('P1', '5000000001002').available !== 1 &&
         suppliersOf('P7').length === 1; }));
  ok('an owner of several on All is asked which pharmacy first',
     await dk.evaluate(() => { setPharmacy(null); goto('stock'); return /Which pharmacy’s stock/i.test(document.getElementById('app-body').innerText); }));
  ok('switching pharmacy mid-count saves the count, to continue there',
     await dk.evaluate(() => { setPharmacy('P7'); goto('count'); startCount('Back'); countScan('4000000001065');
       const id = S.openCount; setPharmacy('P8'); const s = S.countSessions.find(x => x.id === id);
       return s.state === 'saved' && S.screen === 'count' && !openCountSession(); }));
}

await dk.setViewportSize({ width: 320, height: 700 });
{
  const wide = [];
  for (const [mail, screens] of [['ahmed@example.com', ['checkin', 'tasks', 'products']],
                                 ['rahma@example.com', ['dashboard', 'products', 'till']]]) {
    await dk.evaluate(m => { signOut(); signInAs(m); }, mail);
    for (const dir of ['ar', 'en']) {
      await dk.evaluate(x => setLang(x), dir);
      for (const sc of screens) {
        await go(dk, sc);
        if (await dk.evaluate(() => document.body.scrollWidth) > 320) wide.push(`${sc} (${dir})`);
      }
      await dk.evaluate(() => openProduct(PRODUCTS[2].barcode));
      if (await dk.evaluate(() => document.body.scrollWidth) > 320) wide.push(`product (${dir})`);
      if (await dk.evaluate(() => S.role === 'owner')) {
        /* A full till — long names, a finding, the discount form, an unknown
           item — and then its receipt. */
        await dk.evaluate(() => { goto('till'); S.till = tillReset(); tillScan('5000000001224'); tillScan('4000000001065');
          tillScan('5000000001286'); tillToggleLine(0); tillOpenDiscount(); tillScan('6291234567894'); tillCashManual(true); });
        if (await dk.evaluate(() => document.body.scrollWidth) > 320) wide.push(`till (${dir})`);
        await dk.evaluate(() => { S.till.given = '1000000'; completeSale(); });
        if (await dk.evaluate(() => document.body.scrollWidth) > 320) wide.push(`receipt (${dir})`);
        await dk.evaluate(() => closeReceipt());
        /* v0.0013: the stock screens, each with something in it. */
        for (const [label, fn] of [
          ['stock', () => { goto('stock'); document.querySelectorAll('details').forEach(d => d.open = true); }],
          ['count', () => { goto('count'); startCount('A long shelf name — fridge, cold chain items'); countScan('5000000001286'); countSplit(0); countScan('4000000001065'); }],
          ['import', () => { goto('import'); }],
          ['order', () => { goto('orders'); newOrder(); orderAdd('5000000001286'); orderAdd('4000000001065'); }],
          ['order receiving', () => { orderSupplier('SP1'); sendOrder(); }],
          ['suppliers', () => { goto('suppliers'); supplierQuery('Al-Shifa storage house'); }],
          ['register', () => { goto('register'); }],
          ['product with stock', () => { openProduct('5000000001002'); document.querySelectorAll('details').forEach(d => d.open = true); }]]) {
          await dk.evaluate(f => eval('(' + f + ')()'), fn.toString());
          if (await dk.evaluate(() => document.body.scrollWidth) > 320) wide.push(`${label} (${dir})`);
        }
        await dk.evaluate(() => { const s = openCountSession(); if (s) discardCount(s.id); });
      }
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
/* An owner of several gets the widest things in the build: four tabs in a
   strip, and a list where a row carries a name, a responsible pharmacist and a
   badge. Both get the narrow treatment in both directions — the owner of
   three is the person most likely to be standing in one of them with a phone. */
{
  await narrow.evaluate(() => signOut());
  await signIn(narrow, 'layla@example.com');
  for (const dir of ['ar', 'en']) {
    await narrow.evaluate(x => setLang(x), dir);
    for (const [label, go] of [['All', () => setPharmacy(null)], ['a pharmacy tab', () => setPharmacy('P9')],
                               ['billing', () => goto('billing')], ['profile', () => goto('profile')]]) {
      await narrow.evaluate(f => eval('(' + f + ')()'), go.toString());
      await narrow.waitForTimeout(150);
      ok(`${label} does not scroll sideways at 320px (${dir})`,
         await narrow.evaluate(() => document.body.scrollWidth) <= 320);
    }
  }
}

await browser.close();
console.log(errs.length ? `\n${errs.length} failed:\n` + errs.join('\n') : '\nAll checks passed.');
process.exit(errs.length ? 1 : 0);
