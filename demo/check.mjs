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
const url = 'file://' + file;
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
ok('and the app and the CRM hold the same list, from the same file',
   await d.evaluate(() => DRUGS.length) === 100);
await go(d, 'drugs');
ok('the module renders every drug', await d.locator('.drug-row').count() === 100);
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

await d.evaluate(() => { S.drugForm = 'inhaler'; render(); });
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
     goto('drugs');
     return document.querySelectorAll('.drug-row .sev').length > 50;
   }));

console.log('\nwho gets the reference');
ok('an owner reaches it from More', await d.evaluate(() =>
   ownerGroups().some(g => g.items.some(x => x[0] === 'drugs'))));
ok('a student has it in the bar — a placement is twelve weeks of being asked',
   await d.evaluate(() => navFor('student').some(x => x[0] === 'drugs')));
ok('the CV the bar gave up for it is still reachable from More',
   await d.evaluate(() => moreGroups().some(g => g.items.some(x => x[0] === 'cv'))));
ok('and so is incident reporting, which had no route on a phone before',
   await d.evaluate(() => moreGroups().some(g => g.items.some(x => x[0] === 'incidents'))));
await go(d, 'more');
ok('More renders those rows rather than an empty screen',
   await d.locator('.row').count() >= 4);

console.log('\nboth languages');
await d.evaluate(() => { setLang('ar'); goto('drugs'); });
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
    ['zainab@uobaghdad.edu.iq', ['browse', 'placement', 'logbook', 'drugs', 'profile']]
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

await browser.close();
console.log(errs.length ? `\n${errs.length} failed:\n` + errs.join('\n') : '\nAll checks passed.');
process.exit(errs.length ? 1 : 0);
