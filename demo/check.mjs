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

console.log('\nthe pharmacy owner is a pharmacist and a pharmacy');
await signIn(d, 'rahma@example.com');
ok('the account is an owner, not a bare pharmacy',
   await d.evaluate(() => S.role === 'owner'));
ok('and the account is a person, as the CRM also has it',
   await d.evaluate(() => /Rahma Al-Jubouri|رحمة الجبوري/.test(t('acc.rahma'))));
ok('with the pharmacy named beside them rather than instead of them',
   await d.evaluate(() => /Al-Rahma Pharmacy|صيدلية الرحمة/.test(t('acc.rahmaTag'))));
ok('the sidebar groups the two jobs under headings',
   await d.locator('.side-group').count() === 3);
{
  const reachable = await d.evaluate(() =>
    OWNER_GROUPS.flatMap(g => g.items.map(i => i[0])));
  // Every pharmacist screen AND every pharmacy screen, from one account.
  const wantPharmacy = ['dashboard', 'post', 'applicants', 'trainees'];
  const wantPharmacist = ['browse', 'shifts', 'earnings', 'cv'];
  ok('every pharmacy screen is reachable', wantPharmacy.every(x => reachable.includes(x)));
  ok('and every pharmacist screen too', wantPharmacist.every(x => reachable.includes(x)));

  let empty = [];
  for (const id of reachable) {
    await go(d, id);
    if ((await d.locator('#app-body').innerText()).trim().length < 30) empty.push(id);
  }
  ok(`all ${reachable.length} of them render (${empty.join(',') || 'none empty'})`, empty.length === 0);
}
ok('the pharmacy half leads the bottom bar',
   await d.evaluate(() => NAV.owner[0][0] === 'dashboard'));
ok('and the bottom bar still holds only five',
   await d.evaluate(() => NAV.owner.length === 5));
await go(d, 'dashboard');
{
  const txt = await d.locator('#app-body').innerText();
  ok('the home page carries both halves, pharmacy first',
     txt.indexOf(await d.evaluate(() => t('grp.pharmacy'))) >= 0
     && txt.indexOf(await d.evaluate(() => t('grp.pharmacist'))) >
        txt.indexOf(await d.evaluate(() => t('grp.pharmacy'))));
}
await go(d, 'more');
ok('"More" lists what the bottom bar could not hold',
   await d.locator('.row-title').count() >= 8);
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
