# Backlog

Split four ways because they are read at different times:

- **Work** — things to build. Each says where the code stands, what it should
  become, and what needs deciding first.
- **Strategy** — revenue routes and features that follow from them. Not work
  until one is chosen.
- **Principles** — decisions to settle before the relevant build, not after.
- **Context** — findings worth not re-deriving.

IDs are stable. Reordering does not renumber anything.

**W1–W5 shipped in App_v0.0003 / CRM_v0.0003. W8's code shipped in v0.0004; its
open questions did not** (18 Sep 2026). They are kept
below rather than deleted, because what each one says about *why* is the part
worth not re-deriving; each now opens with a **Built** line saying what landed
and what was decided along the way. W6 and W7 have not been started.

Parts 2–4 are not untouched either: S8 is largely built, and S4, S5, S6 and P1
each carry what the dispensing log changed about them. Read W8 before any of
those four.

---

# Part 1 — Work

## W1. Model a pharmacy owner as a pharmacist *linked to* a pharmacy

**Built — App_v0.0003 / CRM_v0.0003.** The app's `ACCOUNTS` carries `type` and
`pharmacy`; `isOwner()` derives ownership from the link and `viewRole()` turns it
into a navigation. The CRM's `USER_TYPES` is down to two, "owner" is a saved view
over `isOwner`, the type column renders one chip reading "Pharmacist + Owner",
and `owns_pharmacy` is a derived column in the SQL view. The check proves it is
derived by clearing the link and watching the row leave the view.

**Raised:** 11 Sep 2026. **Touches:** app + CRM.

An owner is not a third kind of user. They are a **pharmacist** with an
**ownership link** to a pharmacy. The system should hold it that way.

**Where it stands after App_v0.0002 / CRM_v0.0002.** `owner` is a *user type*
beside `pharmacist` and `student` — in the app's `ACCOUNTS` roles, in the CRM's
`USER_TYPES`, in the Users module's saved views, in the `ut1.*` labels. The
pharmacy link exists (`user.pharmacy` → a `pharmacies` row) but the type is
doing work the link should do.

**What it should become.** Two account types describing what a person *is* —
pharmacist and student — plus a relation describing what they *own*. "Is an
owner" becomes a derived fact, like `dormant` and `unclaimed` already are.

**Needs deciding:**
- Does Users still offer "Pharmacy owners" as a saved view? Probably yes, as a
  view *over pharmacists* rather than a type.
- Can one pharmacist own more than one pharmacy? Migration `0001` currently says
  no, on the basis that one licensed pharmacist may own one pharmacy under Iraqi
  law. If that holds the link is one-to-one and much stays simple. If not, the
  ownership edge becomes a table and several screens change shape.
- What does the link mean when a pharmacy is sold or the responsible pharmacist
  changes? A link with a start and end date is a different object from a foreign
  key.

## W2. Owner's pharmacist half: off by default, enabled in settings

**Built — App_v0.0003.** `S.takesShifts`, off by default, with the switch on
the profile screen. `navFor()` and `ownerGroups()` rebuild both navigations from
it, and turning it off while standing on a screen it removes lands you on the
profile rather than on a blank. Two things were decided while building: the CV
stays visible either way (it is a professional record, not a feature of taking
shifts), and the verified-pharmacist stats block is gated on actually having a
shift record, so an owner who never takes one is not shown an empty one.

**Raised:** 11 Sep 2026, judgement calls made 18 Sep. **Touches:** app.

Most owners will never take a locum shift. The pharmacist half should be opt-in.

**Where it stands after App_v0.0002.** Both halves are always present: the
sidebar shows a "My own work" group, "More" lists those four screens, and the
home page carries a pharmacist section under the pharmacy one.

**The calls, made rather than left open:**

| Screen | Default | Why |
|---|---|---|
| Dashboard, Post, Applicants, Trainees | **On** | The pharmacy half. This is what they open the app to do. |
| Notifications, Incidents, Profile | **On** | A pharmacy is a party to an incident and gets notified regardless. |
| **Browse shifts** | **Off** | The "I want to take work" action. The clearest thing to gate. |
| **My shifts** | **Off** | Only meaningful once you have taken one. |
| **Earnings** | **Off** | Pharmacist payouts. See the gap below. |
| **CV** | **On** | Not shift-specific. An owner uses a CV for a supplier, a regulator, a bank, and later the CPD transcript. The clinical / non-clinical split in App_v0.0001 exists precisely for that audience. **My call — overrule it if you disagree.** |

**Two things this surfaces:**

- **There is no pharmacy-side billing screen.** The owner currently reaches
  "Earnings", which is the *pharmacist payout* view. A pharmacy is charged, not
  paid. Gating Earnings leaves an owner with no way to see what they owe. A
  pharmacy Billing screen is needed either way, and it should be always-on.
- **Verified stats read badly at zero.** An owner who has never taken a shift
  would show "0 shifts, no reliability record" on their profile, which looks
  worse than showing nothing. Hide the block when empty rather than rendering
  zeros.

**Behaviour when switched off after use:** the toggle governs *finding new
work*. Browse and My Shifts disappear; Earnings and history stay reachable while
there is anything in them. Hiding a screen that holds someone's money is
different from hiding one that does not.

## W3. Rename "Student training" to "Student placement"

**Built — App_v0.0003 / CRM_v0.0003.** Interface strings only; the order type
is still `training` in the data, so nothing downstream had to move.

**Raised:** 11 Sep 2026. **Touches:** CRM, and probably the app.

**Where it stands.** Type key `training`, label `ot.training`, saved view
`v.training`. Orders segments on it.

**Scope.** Label only — keep the key `training` so nothing else moves. The app
also says "تدريب طلابي" / "Student training" in several places; the two halves
disagreeing about the same thing is the sort of inconsistency that costs trust
in a demo. Probably both or neither.

## W4. Externals: roles are licences, registration is a product fact

**Built — CRM_v0.0003.** `EXTERNAL_ROLES` is the five licences; `roles` is an
array on the company and the facet matches on *one of* rather than equality;
`represents` links a bureau to its principals and `bureauxFor()` reads it back
the other way. Registration moved onto the brand as `registrationHolder`, beside
`bureau`, and the drug record renders the three-line chain. The fixtures now
carry the case that proves the model: a metformin brand made at Samarra under
licence from Hikma, who hold the registration, represented by a Baghdad bureau —
so "is Samarra a manufacturer or the registration holder" has no answer except
*of which product*.

**Raised:** 18 Sep 2026. **Settled:** 18 Sep 2026. **Touches:** CRM.

Rename the Companies module to **Externals**; replace the single-select company
type with multi-select roles; move marketing authorisation to the product.

**Where it stands.** `companies` module with `type` ∈ {manufacturer, marketing,
importer, distributor}, single-select. Brands point at one company.

**What settled it.** "Is Acino a manufacturer or a marketing authorisation
holder?" has no answer. Acino manufactures some products and markets them,
markets others made under contract, and may contract-manufacture for a third
party. The role is not a property of the company — it is a property of the
company's relationship to a *particular product*.

That yields the rule:

> **A company role = a licence that company holds.**
> **Registration = a product licence, so it lives on the product.**

Iraqi product registration (تسجيل المستحضر) is issued per product, not per
company, so "marketing authorisation holder" was never a company type. It was a
product field wearing the wrong hat, which is what made the question
unanswerable.

**Company roles — five, each a real licence, multi-select:**

| Role | Licence behind it |
|---|---|
| Manufacturer | Drug factory licence (معمل أدوية) |
| Scientific bureau | Bureau licence (إجازة مكتب علمي) |
| Importer / agent | Import licence / agency |
| Storage house | Drug warehouse licence (إجازة مخزن أدوية) |
| Distributor | Distribution to pharmacies |

Marketing authorisation holder drops off; **storage house** joins. The test for
any role added later: does somebody hold a licence for it? If not it is a
relationship or an attribute, not a role.

**Product (brand) fields — three, each answering a different question:**

| Field | Answers |
|---|---|
| `manufacturer` | Who made it |
| `registration_holder` | Whose registration it is — often a foreign company |
| `bureau` | Who to actually phone in Baghdad |

Later, for batch tracing, importer and storage house belong on the *consignment*
rather than the product.

**Scientific bureau stays a role AND gains a link** (founder's call, and the
right one). `represents` points at one or more principals. The reason it matters:
a foreign company usually holds **no Iraqi licence at all** — it exists in the
data as a name on products, reachable only through the bureau that holds the
actual licence. The existing `country` field already separates those two cases.

**Worked examples** — the method is settled, these two firms are not; check them
against current arrangements before seeding data:

| Entity | Iraqi roles | On products as |
|---|---|---|
| Pioneer (if the Sulaymaniyah manufacturer) | Manufacturer, probably Distributor | Manufacturer *and* registration holder of its own lines |
| Acino (Swiss) | none — no Iraqi licence | Registration holder, reached via its bureau |
| A Baghdad bureau representing Acino | Scientific bureau; usually Importer, Storage and Distributor too | The bureau on Acino's products |
| A standalone licensed warehouse | Storage house | Only on a consignment, once batches are traced |

**Deliberately not added:** "Pharmaceutical company" as a role — ambiguous
between *makes it* and *owns the brand*, and both now exist elsewhere. Two ways
to record one fact is how a reference dataset rots. Fine as a plain-language UI
label.

**One edge decided:** a foreign company with an Iraqi subsidiary holding its own
bureau licence is **two records**, linked by `represents` — one record per legal
entity. Collapsing them is tidy until a regulator asks which entity holds the
licence.

**Migration note.** Renaming the module renames the SQL table `companies`, and
saved report R10 references it. Keep the table name and change only the label —
recommended — or plan the rename as a migration that rewrites saved queries.

## W5. CRM accounts: owner admin, admin, employee

**Built — CRM_v0.0003.** `CAPS` is the matrix, in one object beside the data it
protects, and the team screen draws the table on screen from it rather than
retyping it. The proposal above was adopted unchanged, including the report
editor sitting at admin. Three things were decided while building:

- **Every gated action is hidden *and* refused.** Hiding alone is decoration —
  the handler is a global on a page anyone with the file can open — and refusing
  alone leaves a button that does nothing. The check calls each gated function
  directly to prove the refusal is real, including posting a role an admin
  cannot grant.
- **The open question — records owned by a leaver — is settled by not deleting.**
  An account is deactivated rather than deleted, so its history stays, and the
  dialog will not complete until the records have a named new owner. It counts
  them first, so nobody agrees to inherit an unknown number of pharmacies.
- **The owner admin is transferred, in one step.** The account handing it over
  becomes an admin in the same operation, so the CRM is never left with zero
  owner admins and never with two.

Still open: nothing in the CRM stores who did what. The matrix says who *may*;
an audit trail saying who *did* is a separate piece of work and is not here.

**Raised:** 18 Sep 2026. **Touches:** CRM.

**Where it stands.** The CRM has no account model. It assumes a single operator
(`ME = 'u1'`); `USERS` is a three-person lookup used for the `owner` field on
records. No sign-in, no permissions.

**What it should become.** Three levels:
- **Owner admin** — exactly one, yours. The only account that can create another
  admin. Cannot be deleted or demoted; transferred rather than removed.
- **Admin** — full operational access. Can create employees.
- **Employee** — day-to-day work.

**Needs deciding — the permission matrix.** A starting proposal, not a decision:

| Capability | Employee | Admin | Owner admin |
|---|---|---|---|
| Read every module | ✓ | ✓ | ✓ |
| Create and edit records | ✓ | ✓ | ✓ |
| Delete records, bulk actions | — | ✓ | ✓ |
| CSV import (drugs, roster) | — | ✓ | ✓ |
| Write and edit SQL reports | — | ✓ | ✓ |
| Create employee accounts | — | ✓ | ✓ |
| Create admin accounts | — | — | ✓ |

**The SQL report editor is the sharp one.** Arbitrary `SELECT` across every
table is a data-export capability — phone numbers, licence numbers, the whole
roster. Whoever can write a report can extract the database. That is why it sits
at admin in the proposal above; if employees need reports, give them *run* on
saved reports without *edit*.

**Also needs deciding:** what happens to records owned by a deleted employee.
Every record carries an `owner`; orphaning them silently is how a pharmacy stops
being anybody's job.

## W6. Data-model changes that are cheap now and awkward later

**Raised:** 18 Sep 2026. Small, individually. Grouped because none justifies its
own entry and all become expensive once there is real data.

- **W6a. Subscription in the fee config.** A plan alongside the commission
  constants in `src/config/fees.ts`. Required by S1.
- **W6b. CPD credit ledger on the user.** Append-only; provider, topic, hours,
  date, evidence. Same principle as the verified CV stats — issued or computed,
  never editable by the holder. Required by S7.
- **W6c. Provider as a first-class entity.** A university, a clinical society,
  the Syndicate. The Universities and Externals modules are most of it.
- **W6d. Sponsorship field on a module, separate from its content.** So
  disclosure is structural rather than something someone remembers to type.
  Required by P1.
- **W6e. Model the real supply chain in Externals.** Covered by W4; listed here
  because it is also what a procurement product (S4) later runs on.

## W7. Chain and multi-branch accounts

**Raised:** 18 Sep 2026. **Touches:** app + CRM.

Excluded from v1 by the brief. Worth revisiting sooner than that implies: the
first customer willing to pay a real subscription (S1) is a chain with several
branches and a staffing headache, and the exclusion blocks exactly that sale.

## W8. The dispensing log: what v0.0004 settled, and what it did not

**Raised:** 18 Sep 2026. **Touches:** app, CRM, and — before any of it is real —
a lawyer.

**Built.** The check and the log, on the terms agreed: tallies rather than
baskets, pharmacy-scoped rather than patient-scoped, a pharmacist seeing only
their own shift and an owner seeing their own pharmacy, the CRM holding every
tally for reporting, and "this does not replace the legal register" on screen in
both places.

**Not settled, and needed before this ships to a real pharmacy:**

- **The local legal read.** Iraq has no comprehensive data protection statute,
  which is not a safe harbour — it is an absence of a path. Three questions for
  a local lawyer: does a dispensing record with no patient identity count as
  health data here; can a platform hold it on a pharmacy's behalf; does any of
  it touch the controlled-substances register. Same gate as the Tier 3 incident
  channel.
- **Consent and disclosure.** A relief pharmacist's entries become the
  pharmacy's asset. That needs to be in the pharmacy's terms and stated to the
  pharmacist at the point of logging, not discovered later.
- **Controlled substances.** Four of the reference are controlled (tramadol,
  diazepam, alprazolam, pregabalin). The screen disclaims the legal register,
  but a log that *includes* them and can be silently edited is worse than one
  that excludes them. Decide: exclude, or make the rows append-only with a
  visible correction trail.
- **The trust risk, which is larger than the legal one.** Consumption data is
  what pharma pays for (S5). If pharmacists work out that a safety tool feeds a
  sales pipeline, they stop logging and the checker dies with the habit. P1 says
  pharma money never touches clinical content; it does not yet cover data
  *generated by* clinical tooling. Extend it, or decide deliberately not to.
- **Incomplete data is biased data.** Pharmacists will log some prescriptions
  and not others, so consumption is a floor, not a count. Anything built on it
  for procurement (S4, S6) has to say so or a pharmacy will under-order.

## W9. A name that does not mean "pharmacist"

**Raised:** 18 Sep 2026. **Touches:** everything, and the sooner the cheaper.

Saydali+ means *pharmacist+*. It is a good name for what exists and a wall in
front of what is intended: the same machinery — verified professional, shift
posted, shift taken, hours logged, money moved — is what a hospital needs for
locum doctors and nurses, and none of them will sign up to something called
"pharmacist". Renaming later means the licence, the domain, the Syndicate
paperwork and whatever brand equity exists by then.

**What the name has to survive:** a pharmacist in a community pharmacy, a doctor
taking a hospital shift, a nurse, a student on placement, and — separately — a
medical representative who is not clinical at all (W10). It also has to work
said aloud in Arabic in Baghdad and typed in Latin script by a foreign supplier.

**What does not change:** the pharmacy side is still the scarce side and still
the customer. A broader name must not turn into a broader product before the
pharmacy market is won — the failure mode is a marketplace that is thin in five
professions instead of deep in one. Name broad, launch narrow.

**Sequencing:** decide the name before the Syndicate conversation, because the
first thing they will ask is what this is called and who it is for.

## W10. Medical representatives as an account type

**Raised:** 18 Sep 2026. **Touches:** app, CRM, and P1.

A medical rep works for a manufacturer or a scientific bureau and calls on
pharmacies. Externals (W4) already models the companies they work for, so the
link exists; what does not exist is a person who belongs to one.

**Why it is not simply another user type.** Every account type on the platform
today is a licensed clinician whose verification is the Syndicate roster. A rep
is not clinical, is not on that roster, and is verified by their *employer*
rather than by a register — the company vouches for them, which is a different
mechanism with a different failure mode (a rep who leaves the company keeps
their login unless the company says otherwise). That alone makes it a build
rather than a row in `USER_TYPES`.

**What a rep would actually do here**, roughly in order of how defensible each
is:
- See which pharmacies exist, where, and who to ask for — a directory, which is
  the least controversial and probably the first paid thing.
- Log a visit. This is the CRM the reps' employers are currently keeping in
  notebooks, and it is worth more to the company than to the pharmacy.
- Reach pharmacists with product information. **This is where P1 applies** and
  where it currently has nothing to say: P1 governs sponsored clinical content,
  not a salesperson messaging a pharmacist directly. Settle it before building
  the channel, not after somebody complains.
- See consumption data (W8). Do not, or not without the pharmacy's explicit
  consent — see S5 and the trust argument in W8. A rep reading what a pharmacy
  dispensed is the single fastest way to make pharmacists stop logging.

**The conflict to resolve first:** the platform's value to a pharmacist rests on
it being on their side. A rep channel is a second customer whose interests point
the other way. Every mature comparable (Medscape, Doximity) keeps the two
separated by a wall the clinician can see. Decide where that wall is before the
first rep account exists.

## W11. Name the check "مساعد الوصفات" / "Dispensing Helper"

**Raised:** 18 Sep 2026. **Touches:** app strings only. Small.

The module is currently called **فحص الصرف** / **Dispensing check**. Rename it to
**مساعد الوصفات** / **Dispensing Helper**.

**Where it appears** — one string, `dc.tabCheck`, in both language blocks of
`demo/saydali-plus_v*.html`. It renders in exactly two places: the tab in the
Drugs module's segmented control, and the title of the card on the home screen.
`dc.cardSub` sits under that title and may want rewording to match the softer
name. Nothing in the CRM carries it; the check is app-only.

**Two things worth not "correcting" later.**

The two names are not translations of each other, deliberately. The Arabic keys
on **الوصفة** — the prescription, the thing physically in the pharmacist's
hand — and the English on **dispensing**, the act. Each is the word its own
reader would use, which is the point of having both rather than one rendered
twice. Somebody will eventually notice they do not match and try to align them;
the mismatch is the decision.

And **"helper" softens the claim on purpose**, which lands on the right side of
a line this product has already drawn twice: the verdict never says a
combination is safe, only what was checked, and the contraindications are
questions rather than warnings. A tool called *check* implies a verdict; a tool
called *helper* implies a second pair of eyes. That is what it is, and it is
also the safer thing for it to be called if a dispensing error ever gets argued
over.

**Not the same as W9.** That entry renames the *platform*; this renames one
module inside it. They can be decided independently and in either order.

## W12. Streamlining: five measured pieces of friction

**Raised:** 18 Sep 2026. **Touches:** app. Measured by walking v0.0005 and
counting interactions, not by inspection.

### W12a. The check costs three interactions per drug — make it one

Adding a drug is **tap the field → type → tap the result**, and focus is
dropped after each add (`activeElement` becomes `BODY`), so the field must be
tapped again for the next one. A four-drug prescription is **13 interactions**,
on the app's most-used screen, with a patient waiting.

Three fixes, ascending in value:

1. **Keep focus after adding.** One line — `setDrugQuery()` already restores
   focus and the caret; `addToBasket()` does not. Removes four taps from the
   example above.
2. **Enter adds the top hit.** There is no keydown handler on `#drug-q` at all.
   Type, Enter, type, Enter — no taps after the first.
3. **One-tap chips for the pharmacy's most-dispensed drugs**, from the W8
   tallies. Makes the common prescription almost tap-free, and closes a loop
   worth having: log more → checks get faster → log more. It is also the only
   place where the data W8 collects pays back the person who generated it
   *immediately*, which is the argument W8's trust problem needs.

### W12b. The owner's dashboard ignores their own setting

`screenDashboard()` renders `pharmacistHalf` unconditionally. An owner who has
never turned shift-taking on still sees "My own work", a browse link, an
upcoming shift at another pharmacy, and "38 shifts completed · 96%
reliability". The navigation honours `S.takesShifts`; the home screen does not.
This is the thing W2 existed to prevent, and it makes their landing screen a
third longer than it needs to be. Gate it the way `navFor()` and
`ownerGroups()` already do.

### W12c. Posting a shift is six inputs, every time

Pharmacies post the same patterns weekly — *Friday evening, 6–11,
6,000/hr*. There is no repeat affordance anywhere.

**Decided:** a repeat opens the post form **pre-filled**, for the owner to
confirm, rather than posting silently. The rate may have changed, the date
certainly has, and a shift posted by accident costs a real phone call to undo.
Entry points: a "post this again" on a filled or completed shift, and a repeat
of the most recent post on the dashboard.

Weight this heavily. The brief's premise is that pharmacy demand is the scarce
side, so friction on the pharmacy side is the most expensive friction in the
product.

### W12d. Two screens are dead ends

- **Student placement: zero buttons.** Nothing to do on it. It should at least
  push to the logbook week that is due.
- **Pharmacist shifts: one button.** A shift starting in two days offers only
  "view handoff checklist" — no directions, no way to call the pharmacy, no
  add-to-calendar. Those are what a locum wants the night before.

### W12e. Smaller

Sign-in is three taps before any content — remember the last account. And the
reference tab rebuilds all 119 rows on every keystroke (1,303 nodes, 5.3 ms on
a desktop, plausibly 40–60 ms on a cheap Android). The check tab caps at eight
results and is fine. Watch it; do not pre-optimise it.

### What must NOT be streamlined

Applying to a shift is two taps and stays two: the intermediate screen is where
the fee breakdown lives, and applying without seeing the pay would be faster and
worse. Same for the handoff checklist, the logbook's 80-character gate and the
"ask the patient" list. **The test for every item above is whether removing the
step loses information the person needed.**

## W13. Where things live, and what each home screen is for

**Raised:** 18 Sep 2026. **Touches:** app navigation and three screens.
Agreed in discussion; not built.

### The navigation

**Fold "More" into Profile and free a bar slot.** The pharmacist's More holds CV,
notifications, incidents and profile. Notifications already have the header
bell on every screen and profile is in the sidebar, so More is a two-item menu
wearing a five-item coat. Move CV and Incidents into Profile — already an
account screen, and only one screen tall — and drop More. The bar becomes
**Browse · My Shifts · Earnings · Check · Profile**, with everything account-ish
where people already look for it.

**Leave the owner's grouped sidebar alone.** My pharmacy / My own work /
Account is right: two jobs in one flat list is how both become unscannable.

**Consumption is filed correctly for today and not for tomorrow.** It sits with
Post/Applicants/Trainees, which is right while it is a staffing screen. It is
also the seed of the procurement story (S4, S6), and those will not want to
live in the staffing group. Not urgent — worth knowing before the second thing
that reads tallies gets built.

### The home screens

**The rule:** a home screen should show what needs the person *today* and reach
what they do *most*, without scrolling. Every one of ours currently reports
where it should prompt. "2 applicants" is a fact; "2 people are waiting on you"
is a job.

**Pharmacist — what's next and what's owed**
1. The dispensing check (built)
2. **Next shift, if there is one.** Currently only on My Shifts, so a locum's
   home screen says nothing about the thing happening tomorrow.
3. The shift board, filtered to their district (built)
4. One earnings line — *"38,800 pending"* — not the full breakdown

**Owner — what needs a decision**
1. **Applicants waiting.** The one thing where their delay costs a filled shift.
2. **Shifts unfilled and starting soon.** The actual emergency.
3. Repeat last shift (W12c)
4. Trial days remaining (built)
5. Billing total, one line

Drop: the pharmacist half when they have turned it off (W12b), and the
three-stat row, which reports rather than prompts.

**Student — which week am I on**
1. **The logbook week that is due**, with days remaining. This is their entire
   relationship with the app.
2. Progress through the twelve weeks
3. The check
4. The placement board — **only if they do not have a placement yet**

The student home is the most broken of the three. A student with a placement
and a student without one want completely different screens and currently get
the same one.

## W14. The subscription, and the groundwork every revenue line needs

**Raised:** 18 Sep 2026. **Touches:** `src/config/fees.ts`, the schema, the app's
billing screen, and a new CRM module. **Price set in discussion: 25,000 IQD per
pharmacy per month.**

### The tiers, and the arithmetic behind them

**Set in discussion: Basic 9,000 IQD/month, Premium 19,000 IQD/month.** Premium
carries extra features, to be chosen later — candidates at the end of this
entry.

Per 40,000 IQD shift today: pharmacy pays 2,800 (7% on top), pharmacist pays
1,200 (3% deducted), platform grosses 4,000 and keeps **3,224** after the ~2%
processor cut. A plan replaces the **pharmacy's 7% only**; the pharmacist's 3%
always remains.

| Shifts/mo | On commission | Basic 9,000 | Premium 19,000 | Platform: commission | Platform: Basic |
| --- | --- | --- | --- | --- | --- |
| 2 | 5,600 | 9,000 | 19,000 | 6,448 | 9,848 |
| **4** *(expected)* | **11,200** | **9,000** | 19,000 | **12,896** | **10,696** |
| 7 | 19,600 | 9,000 | 19,000 | 22,568 | 11,968 |
| 20 | 56,000 | 9,000 | 19,000 | 64,480 | 17,480 |

**Basic at 9,000 is well priced.** Break-even is 3.2 shifts a month, so at the
expected four it is already cheaper than commission — the pharmacy saves 2,200
and needs no argument made to them. The platform gives up about 2,200 a month
at that volume, which is the correct trade: a predictable floor and a committed
customer are worth more than the last two thousand dinars of a variable fee.

**Premium at 19,000 breaks even at 6.8 shifts**, so below that it is more
expensive than commission. That is fine and it is the right shape — Premium is
sold on what it includes, never on price. Do not let anyone pitch it as a
saving to a four-shift pharmacy.

### The hole: unlimited posting on Basic

If Basic includes unlimited shifts, a high-volume pharmacy subscribes and the
platform bleeds:

| Shifts/mo | Platform on commission | Platform on Basic | Lost |
| --- | --- | --- | --- |
| 20 | 64,480 | 17,480 | **47,000** |
| 40 | 128,960 | 25,960 | **103,000** |

A chain would find this in a week. **DECIDED: each tier carries an included
shift allowance, with ordinary commission beyond it.** Starting numbers, open to
moving once real volume is visible: **Basic 5 included, Premium 12 included.**

| | 4 shifts | 10 shifts | 40 shifts |
| --- | --- | --- | --- |
| Basic — pharmacy pays | 9,000 | 23,000 | 107,000 |
| Basic — platform keeps | 10,696 | 27,240 | 123,960 |
| *(vs commission)* | *12,896* | *32,240* | *128,960* |

The intended deal survives at the bottom and the runaway disappears at the top:
a forty-shift pharmacy still saves 5,000 and the platform still earns 124,000.
The allowance is also the natural upgrade prompt — "you used 5 of 5 this month"
is the best Premium pitch there is.

### Premium: ideas to choose from later

Not decided, kept so the conversation starts from somewhere. **Operational:**
multi-branch and staff accounts (needs W7), priority placement on the shift
board, a larger shift allowance, saved shift templates (W12c). **Analytical:**
the pharmacy's consumption analytics with history and export, fill-rate and
time-to-fill benchmarking against the district. **Clinical:** the drug
reference and check for every member of staff rather than the owner alone.
**Commercial, later:** a procurement discount (S4), first look at
near-expiry stock (S9).

One to think about carefully: putting the **dispensing check** behind Premium
would be the single most effective upsell and the wrong thing to do. It is a
patient-safety tool and the doc commits it to being free. Extending it to *more
staff* is a fair paid feature; gating it at all is not.

### Build three primitives, not one feature

The temptation is to add `subscribed: boolean` to the pharmacy. Resist it —
every later revenue line needs the same three things, and the third is the one
that is expensive to retrofit.

1. **A plan on the account.** Not on the pharmacy specifically: on the account,
   so an Externals company (W10, S5) or a university can hold one later.
2. **An entitlement check.** `can(account, 'shifts.allowance')`. Features ask the
   entitlement, never the plan name — otherwise every pricing change becomes a
   code change.
3. **One append-only billing ledger.** Every charge, whatever its source:
   commission, subscription, placement fee, credential export. This is the
   expensive one. Commission is computed on the fly today; if subscription
   charges land somewhere else, the CRM cannot answer "what does this pharmacy
   owe this month" without unioning two shapes, and reconciliation with the
   processor breaks.

### The fee engine

`calculateFees()` takes the plan as an input and returns the same shape. No
`if (subscribed)` scattered through callers, and the app's live fee preview
keeps working unchanged. Add `planId` to `FeeInput`; `pharmacyFee` becomes 0
under a plan that covers it, and a new field records which plan zeroed it, so a
charge row can say why it was zero.

### Collection is the hard part, and it is not a technical problem

There is **no wallet** (by principle, P-level) and low card penetration, so
there is no rail that pulls 25,000 IQD from a pharmacy on the 1st of the month.
Realistically: an invoice is raised, a human collects, an employee records the
payment. That means the CRM needs a genuine **invoice → payment → receipt**
flow, not a `paid: true` checkbox.

And **dunning has to be designed before launch, not after.** What happens on
day 35 unpaid? Proposal: grace period → posting disabled → account suspended,
with the CRM surfacing a queue at each stage. Left undesigned, this becomes
forty pharmacies three months in arrears and nobody's job to chase them.

### What the trial becomes

Everyone already gets 30 free days from signup. The clean answer: **the trial
is 30 days of the full paid plan**, and at day 30 they choose plan or
commission. It makes the upgrade path natural and it means every pharmacy has
already used what they are being asked to buy.

### Surfaces

**App (owner), on Billing:** current plan and what it includes, next invoice
date and amount, invoice history, and — importantly — *"on commission this
month you would have paid X"*. A subscriber who cannot see what they saved
churns at the first quiet month.

**CRM:** a plan column on Pharmacies; an invoices/payments module; a dunning
queue; and MRR, churn and plan mix as **saved reports**, since the Reports
module already runs SQL over the live tables and the dashboard is built only
from those.

### How this carries the other lines

Once the three primitives exist, the rest is configuration rather than
architecture:

- **S2 verified credentials** — a per-export charge on the ledger.
- **S3 permanent placement fees** — a one-off charge triggered by a conversion
  event, on the same ledger.
- **S5 pharma access** — a plan on an Externals company, entitlements for
  directory access, visit logging and messaging. Gated by P1 first.
- **S4/S6 procurement** — a different shape (orders, margin), but the charges
  still land on the one ledger.

**One thing to settle alongside:** bundling the pharmacy's own consumption
analytics into a paid tier is fine — it is their data. Selling it onward is
what P1 does not yet cover (see W8).

### Sequence

1. The ledger, with commission charges written to it. Nothing user-visible
   changes; the CRM gains a straight answer to "what is owed".
2. Plans and entitlements, with one plan defined and nobody on it.
3. The fee engine reading the plan.
4. The CRM invoice/payment/dunning flow.
5. The app's billing screen and the upgrade path.
6. Only then: sell it, to the high-volume pharmacies first.

## W15. The PARTNER account: job listings and banner placements

**Raised:** 18 Sep 2026. **Touches:** app (two new views), CRM (a new module),
schema, and P1 — which this is the first thing to actually test.

**DECIDED: the account is called Partner / شريك.** It links to an Externals record (W4)
and belongs to a company rather than a clinician: it posts permanent job
listings and books banner placements, both operated from the CRM.

### Naming — decided 18 Sep 2026

| Candidate | Arabic | For | Against |
| --- | --- | --- | --- |
| **Partner** *(recommended)* | شريك | Standard marketplace word; covers a manufacturer, bureau, importer or storage house without implying any of them; short in both scripts | Can read as a revenue-share relationship |
| Company | شركة | Maximally plain, zero ambiguity | Bland; does not stretch to a university or hospital later |
| Sponsor | راعٍ | Accurate for the banner half | **Collides with P1** — implies paying for influence, which is the thing the principle forbids |
| Supplier | مورّد | Right for the supply chain | Wrong for a bureau posting a job |
| Employer | جهة توظيف | Right for job listings | Wrong for banners, and pharmacies are employers too |

**Chosen: Partner / شريك** as the account name, with the CRM keeping
**Externals** as the record type. The account is a relationship; the record is a
licence-holding entity. Two words for two things is correct here.

### Why it is not simply another `USER_TYPE`

Every account today is a licensed clinician verified against the Syndicate
roster. A partner is not clinical, is not on that roster, and is verified by
**the operator team in the CRM** — nobody self-serves into this type. That is a
different verification mechanism with a different failure mode (an employee who
leaves keeps their login until the company or the operator says otherwise), and
it is the same shape as W10's medical representative. **Build W15 and W10 on one
account model**, or you will build it twice.

### P1: the banner rules, which are the hard part

This is the first feature that puts pharma money anywhere near a pharmacist,
and P1 currently governs sponsored *clinical content* only. Extend it with
these, and treat them as commitments rather than defaults:

1. **No banner inside the dispensing check or the drug reference. Ever.** A
   placement beside an interaction warning is precisely what P1 exists to
   prevent, and it is also the highest-paying slot anybody will ever offer you.
2. **Never target a banner on clinical behaviour.** What a pharmacist looked up
   is the most valuable targeting signal on the platform and the most
   corrosive to use. The moment the safety tool feeds the ad engine,
   pharmacists work it out and stop using the safety tool — see W8's trust
   argument, which is the same argument.
3. **Labelled as a paid placement**, plainly, in Arabic.
4. **Permitted surfaces only:** the shift board, the jobs view, and the home
   screen below the fold. Nowhere else.

### The app

**Jobs is a second tab of Browse**, not a new bar item — Browse is already
"find work", and a permanent job is the same errand on a longer timescale. It
matches the Reference / Check tab pattern the drug module already uses, and the
bar has no free slot (W13).

Who sees it: pharmacists and owners. Students — open question, since a
graduating student is exactly the audience for a first job.

### The CRM: a Listings module

Segmented by listing type the way Orders is segmented by order type:
**Jobs** and **Banners**. Assumed rather than stated — confirm.

**Agreed 18 Sep 2026:** this shape, the P1 banner rules above, Jobs as a tab of
Browse, and the Jobs / Banners segmentation.

- A **job listing**: partner, role, location, description, dates, status.
  Approved by an operator before it appears, like every other externally
  supplied content in this product.
- A **banner placement**: slot, date range, partner, creative, price, status.
  Needs a **scheduling model** — two partners cannot hold the same slot on the
  same day, which is a booking conflict and has to be refused rather than
  resolved by whoever saved last.

Both are chargeable, and both land on **W14's billing ledger**, which is the
argument for building the ledger first: this is the second revenue line and it
should not need its own money plumbing.

### Open questions

- Do partners self-serve at all, or is everything operator-entered at first?
  Operator-entered is slower and much safer for a first version.
- Does a banner placement price by slot, by day, or by impression? Impressions
  need counting infrastructure that does not exist; day-rate does not.
- Students on the jobs view — yes or no.

---

# Part 2 — Strategy

Revenue routes and the features that follow from them. Not work until chosen.
Every market figure here is an order of magnitude to sanity-check, not research.

## S1. Pharmacy subscription alongside or instead of commission
*Near term. Specified and priced in W14.*

Flat monthly fee per pharmacy. Comparable: **Lantum**, **Locum's Nest**,
**Patchwork** (UK) all moved off per-shift commission. Commission makes you an
agency and agencies get disintermediated; subscription makes you infrastructure.

**Priced in W14**: Basic 9,000, Premium 19,000, each with an included shift
allowance and ordinary commission beyond it.

**What subscription does not fix.** It defends the *pharmacy* end of leakage
(C2) and does nothing about the pharmacist end. A subscribed pharmacy still has
every pharmacist's phone number. What holds the pharmacist is the reliability
record, the payment trail and the drug reference — not the billing model.

**Needs deciding:** whether commission survives at all for non-subscribers, or
whether subscription eventually becomes the only way to post. Keeping both
forever means maintaining two revenue models and explaining the choice to every
new pharmacy. A date to retire commission — even a distant one — makes the sales
conversation one sentence instead of a comparison table.

## S2. Verified credentials as a product
*Near term. Half-built already.*

Comparable: **Medallion**, **Verifiable** (US). Builds directly on the Syndicate
roster module and the verification queue, both of which exist.

**The product is not a badge on a profile.** It is an answer to a question
somebody is already asking by phone: *does this person hold a current licence,
and have they actually worked?* Three shapes, ascending in value:

1. **A one-off check.** An employer asks about a named pharmacist; you answer
   from the roster match plus the platform's own work history. Cheapest to
   build, sold per check.
2. **A verified transcript the pharmacist controls.** They export a signed
   record — licence, shifts completed, reliability, hours — and hand it to
   whoever asks. The pharmacist is the distribution channel, which means no
   sales team.
3. **Continuous verification for an employer.** A standing feed: this person's
   licence lapsed, this person's details changed. Recurring revenue, and the
   thing US comparables actually monetise.

**Who pays is the important question, and the answer is the employer, not the
pharmacist.** Charging a pharmacist to prove they are licensed is charging the
oversupplied side for the privilege of being employable, and it will be read
exactly that way.

**The Gulf angle is the real money.** An Iraqi pharmacist applying to SCFHS,
DHA, DOH or MOHAP assembles licence and experience evidence by hand today, in
paper, across years. A signed, exportable transcript is worth far more to that
person than a badge in an Iraqi app — and they are the ones already paying
agents for help with it. *Verify current requirements; these bodies revise
them.*

**The line to watch:** this is how you drift into being a credentialing
authority without deciding to (P4). A transcript that says *"Saydali+ confirms
this licence is current"* is a claim about a regulator's register. Say instead
*"the Syndicate roster of [date] lists this number"* — attribution, not
assertion.

**Needs deciding:** which of the three shapes ships first, and whether the
transcript is free to the pharmacist (distribution) or paid (revenue). They
point in opposite directions.

## S3. Permanent placement fees
*Near term. Nearly free given what exists.*

Charge when a relief pharmacist becomes a permanent hire. Comparable:
**Doximity**'s hiring line. The relief network is already a recruiting funnel
that knows who turns up.

**The hard part is not the fee, it is the trigger.** Both sides have a reason to
hide a conversion: the pharmacy avoids the fee, the pharmacist keeps the
pharmacy happy. A conversion fee you cannot observe is a fee nobody pays. Three
options, least to most workable:

- **Self-declaration.** Honest pharmacies declare; the rest do not. Do not build
  a revenue line on it.
- **Inference.** The same pharmacist covers the same pharmacy repeatedly, then
  the shifts stop being posted. That is a strong signal and an ugly
  conversation — you are accusing a customer.
- **Sell the hire instead of policing it.** A posted permanent vacancy with a
  flat fee to advertise it, paid up front whether or not it fills. No trigger to
  detect, no accusation, and it slots straight into **W15's Jobs listings** —
  the same module, a pharmacy instead of a partner.

**The third is the one to build**, and it is nearly free once W15 exists.

**The pricing norm does not transfer.** Recruitment charges a percentage of
first-year salary. At Iraqi pharmacist salaries that is both small in absolute
terms and offensive to quote. A flat listing fee is more honest and easier to
sell.

**Needs deciding:** flat listing fee (recommended) or conversion fee. If
conversion, accept that it is unenforceable and price it as an honesty box.

## S4. B2B procurement marketplace
*Later. Capital-heavy. Largest ceiling.*

1–2% of procurement value is plausibly 50–100× the shift commission from the
same pharmacy. Comparable: **Grinta** (Egypt), **DrugStoc** (Nigeria),
**Retailio** (India), **MaxAB** (Egypt).

**Two models, and they are different companies.**

- **Marketplace.** You connect pharmacies to distributors and take a fee. Light
  on capital, weak on margin, and easy to route around once both sides know each
  other — the same leakage problem as shifts (C2), on larger numbers.
- **Distributor.** You hold stock, set prices and deliver. Real margin, real
  moat, and a different business entirely: warehousing, a fleet, working
  capital, and a **wholesale distribution licence**. The Externals model (W4)
  already describes exactly the licence you would need to hold.

**Do not build early.** But the modelling is already done — W4's licence model
and W8's consumption tallies are the two things a procurement product needs and
neither was built for it.

**The caveat that has to travel with the data:** pharmacists log some
prescriptions and not others, so consumption is a floor, not a count. A
procurement engine that treats it as a count makes pharmacies under-order.

**Needs deciding, eventually:** marketplace or distributor. Not now — but know
that the answer determines whether this is a feature or a second company, and do
not let a "light marketplace pilot" drift into holding stock without that
decision being made deliberately.

## S5. Pharma company access
*The margin business. Needs a daily-active audience first.*

Comparable: **Medscape**, **Doximity** — both make most of their money here, and
neither sold the network as the product.

**A ladder, ascending in revenue and in P1 exposure.** Each rung needs the one
below it to exist first.

1. **Directory.** A partner sees which pharmacies exist, where, and who to ask
   for. No pharmacist is touched. Least controversial, probably the first paid
   thing, and it is mostly built — the Pharmacies module is the product.
2. **Job listings and banners — W15.** The first rung that reaches a
   pharmacist. Its P1 rules are the precedent every rung above inherits.
3. **Visit logging.** The CRM a rep's employer currently keeps in a notebook.
   Worth more to the company than to the pharmacy, which is worth knowing when
   pricing it.
4. **Sponsored education.** Real money, and where P1 stops being a principle
   and becomes an operating procedure: who writes it, who reviews it, what the
   disclosure says, who can refuse a placement.
5. **Market research panels.** Asking pharmacists questions on a sponsor's
   behalf. Highest margin, and the rung where the pharmacist must be paid and
   must be able to decline without consequence.

**The audience gate.** Nobody buys access to 200 pharmacists. This entire ladder
is worthless until the app has a daily-active population, which is why S8 — the
thing that generates no revenue — is upstream of the thing that generates the
most.

**The consumption tallies (W8) are the most sellable and most dangerous asset
here.** Aggregate above the individual pharmacy unless that pharmacy consented;
disclose it to pharmacists where they log; give the pharmacy its own analytics
before anyone outside sees a number. The third is built. The first two are not.

**Needs deciding:** how far up this ladder you are willing to go, decided once
and in advance rather than one lucrative offer at a time. Rung 5 with a weak
policy is how a platform loses a profession.

## S6. Embedded finance on procurement
*Much later. Arguably a different company.*

Working capital underwritten against observed purchase history. Comparable:
**MaxAB**, **Halan**, **Khazna**.

**This is lending**, and lending is licensed, capital-intensive and collections-
heavy. A software company that starts lending discovers it has become a lender
with a software problem. **Partner, do not build** — and the partner brings the
licence, the capital and the appetite for default.

Underwriting on W8's tallies inherits their bias: they under-count, so they
under-state a pharmacy's turnover, which makes credit decisions conservative in
a way that looks like caution and is actually a data artefact.

**Needs deciding:** nothing yet. Revisit only when procurement (S4) is real and
a licensed partner has approached you rather than the other way round.

## S7. CPD — the ledger, not the courses
*The one that compounds. Longest horizon.*

The asset is the **credit ledger**: the authoritative record of who holds how
many credits. Comparable: **NABP's CPE Monitor** (US) — accredited providers
deposit credits, state boards read from it, NABP teaches nothing.

It converts an episodic product into an annual one. A pharmacist uses the shift
board when they want work; they would touch a CPD ledger every year for their
entire career. Needs W6b and W6c.

- **S7a. Gulf-ready certified transcript — revenue with no Iraqi regulation.**
  SCFHS, DHA, DOH and MOHAP all require verifiable CPD for licensing, and Iraqi
  pharmacists assemble that evidence by hand today. This version works whether
  or not the Syndicate ever mandates anything. *Verify current requirements —
  these bodies revise them.*
- **S7b. Bundle CPD with the drug reference as one pharmacist subscription.**
  Comparable: **Pharmacist's Letter / TRC** — a drug reference and a CE library
  sold together. CPD alone is a hard sell, a drug reference alone is a
  nice-to-have; together it renews without thinking.
- **S7c. Be the platform, not a content company.** Content from colleges of
  pharmacy (Universities module), clinical societies, the Syndicate. You run
  identity, delivery, the ledger and the certificate. **Content is the trap** —
  it is expensive, it dates, and it puts you in competition with the bodies you
  need as partners.
- **S7d. The combined Syndicate ask.** The register alone reads as a taking —
  you want their data, what do they get? Register *plus* a CPD system they do
  not have reads as a trade in their favour. Same meeting, same proposition.

**The sequencing question underneath all of it:** S7a works without the
Syndicate and S7d needs them. Launching S7a first proves the thing works and
arrives at the meeting with evidence — but a Syndicate that finds you already
issuing credits may read it as a land grab rather than a demonstration. That is
a judgement about the relationship, not about the product.

**Needs deciding:** whether CPD launches before, with, or only after a Syndicate
agreement — and P4, which this crosses.

## S8. Drug reference as a daily-use tool
*Built. The retention hook the rest of Part 2 depends on.*

**Built — App_v0.0003 / App_v0.0004.** `data/drugs.mjs` holds 119 molecules,
embedded into both builds by `npm run drugs`. v0.0003 gave the app the
*reference*; v0.0004 gave it the *check* — a basket that takes the whole
prescription at once, which is what turns a lookup into a habit.

Shift-hunting is episodic; a drug lookup is daily. Nothing else on this list
makes the app open every day, and S4, S5 and S7 all need it to.

**Still open under this heading:**

- **The full formulary.** 119 molecules is a working reference, not a complete
  one. The coverage line is honest about it; a real launch wants everything
  marketed in Iraq, which is a data-sourcing problem rather than a build.
- **Availability** — "which pharmacy near me has this". Needs stock data the
  platform does not have. Arguably arrives free with S4.
- **Authoritative status.** Whatever the Syndicate or the Ministry will confirm.
  A conversation, not a build — and the single thing that would make the
  reference unassailable.

## S9. Near-expiry stock exchange between pharmacies
*Later. A density play, not a revenue line.*

Pharmacies list near-expiry stock to each other. Expiry write-off is a real,
unsolved cost in fragmented pharmacy markets, and a pharmacy that opens the app
to shift surplus opens it for reasons unrelated to shifts.

**The reason it is not simple: liability.** Facilitating the transfer of
medicines between pharmacies is a regulated activity in most jurisdictions, and
if something is dispensed past expiry after moving through your platform, the
question of who is responsible has to already have an answer. Two versions:

- **Visibility only.** You show what exists and who holds it; the pharmacies
  transact and document it themselves, exactly as they do today by phone. Much
  lower exposure, most of the density benefit.
- **Facilitated transfer.** You handle the transaction. Higher value, and you
  are now in the supply chain with the licensing and liability that implies.

**Start with visibility.** It is the version that does not need a lawyer before
the first line of code.

**Needs deciding:** nothing near-term. Note it as the cheapest way to make the
pharmacy side valuable independent of shifts, whenever pharmacy density is high
enough for a listing to find a taker.

## S10. WhatsApp as an interface, not a feature
*Near term for notifications. Later for posting.*

Removes the largest adoption barrier for an older pharmacy owner who will not
install an app. Distribution beats product in a market that has not seen this
category.

**Two halves with very different costs.**

- **Outbound — notifications.** "Your shift is filled." "Your invoice is due."
  Template messages through the WhatsApp Business API, priced per conversation.
  Straightforward, and it is the half that lifts fill rates and collections
  (W14's dunning ladder wants exactly this).
- **Inbound — posting a shift by message.** Much harder than it sounds.
  Free-text needs parsing and will be wrong in ways that cost a filled shift;
  structured commands need teaching. The workable middle is a **guided reply
  flow** — the platform asks four questions and the owner answers each.

**Build outbound first.** It is most of the value for a fraction of the work,
and it teaches you whether pharmacies read WhatsApp from you at all before you
invest in listening on it.

*Verify Business API pricing and template-approval rules for Iraq before
committing — both change, and per-conversation pricing at scale is a real line
item, not a rounding error.*

---

# Part 3 — Principles to settle before the relevant build

Each of these is cheap to hold now and expensive to retrofit. A principle is not
settled until it is **written down and someone owns saying no with it** — an
intention held only in the founder's head does not survive the first lucrative
offer made while the founder is tired.

## P1. Pharma money never touches clinical content
*Settle before the first sponsorship cheque. **W15 makes this urgent.***

If a manufacturer funds a module and the module nudges toward their product, you
have influenced what reaches patients who did not consent to that. The
international answer: funders buy the **slot**, never the **content**; an
independent clinician writes it; sponsorship is disclosed on the module;
sponsored material never ranks a product inside a clinical recommendation. Adopt
something equivalent to ACPE's commercial-support standards.

**W15 is the first feature that actually tests this**, and its banner rules
belong here once agreed: no placement inside the dispensing check or the drug
reference, ever; never target a banner on what a pharmacist looked up; labelled
as a paid placement; permitted surfaces named explicitly.

**W8 widened this and the wording has not caught up.** This principle covers
clinical *content*. Since v0.0004 the platform also holds data **generated by** a
clinical tool — what each pharmacy dispensed, collected inside a safety checker.
Selling that is not selling content, but it is selling the exhaust of something
pharmacists were told was for patient safety, and if they work that out they stop
using it.

**What "settled" looks like:** a one-page written policy covering (a) what a
sponsor can buy, (b) what they can never buy, (c) who reviews a placement before
it runs, (d) what the disclosure says, in Arabic, and (e) **who can refuse a
placement and cannot be overruled on revenue grounds**. The fifth is the one
that makes the other four real.

**Needs your judgement:** how far up S5's ladder you will go, and who holds the
veto.

## P2. Non-exclusivity with the Syndicate

Do not ask a professional body to lock out competitors. It is how you get
refused, and if granted, how you become the thing the membership resents.
Non-exclusive-but-first is a more durable position than a contract nobody likes.

**The harder half is what they get.** "Give us your register" is a taking. The
ask has to be a trade, written before the meeting: a CPD system they do not have
(S7d), a verification queue that reduces their phone calls, and reporting on
their own membership they currently cannot produce. **Non-exclusivity is what
makes that trade safe for them to accept** — they are not handing a monopoly to
a company, they are digitising a function and keeping the right to do it with
someone else.

**Needs your judgement:** the shape of the ask, and whether it is one
conversation or a pilot with one governorate first. A pilot is easier to say yes
to and slower to scale.

## P3. Register data stays the Syndicate's, and stays exportable

You run it; you do not own it. The right answer, and the one that survives a
change of Syndicate leadership — which it will have to.

**What "settled" looks like:** contractual language, not goodwill. Specifically:
the register remains their property; they can export it whole, in a documented
format, on request and without cause; termination returns it and deletes your
copy; and none of that depends on who is running either organisation. A clause
that can only be exercised by asking nicely is not a clause.

**The asymmetry to be honest about:** this protects them, and it also protects
you. A platform that can be accused of holding a profession's register hostage
has a political problem no product solves.

**Needs your judgement:** nothing — unless you disagree, in which case say so
before the meeting rather than after.

## P4. The credentialing-authority line

The student certificate deliberately states that Saydali+ **is not** a
credentialing authority. CPD (S7) is the move to becoming one, and S2's
transcript brushes against it too.

Do it with a signed recognition rather than by quietly issuing credits and
hoping it sticks — the difference between "a company that issues certificates"
and "the recognised CPD tracker" is that signature, and everything downstream
depends on which one you are.

**The drift risk is real and quiet.** Nobody decides to become a credentialing
authority. You issue a certificate, then a transcript, then something that
*looks* like a credit, and one day an employer treats your record as
authoritative and you have the liability without the mandate. The wording on the
student certificate is the current guard; it needs the same guard on anything
S2 or S7 emits.

**Needs your judgement:** whether CPD launches before, with, or only after a
signed recognition. S7a says it can work without one; P4 says doing so has a
cost that is not on the invoice.

## P5. What the platform says about a pharmacist, and what they can do about it
*Not previously written down. It should be.*

The app computes and displays a **reliability percentage and a rating** that
follow a pharmacist between pharmacies. That is the most valuable thing the
platform holds for the supply side — and the most consequential thing it says
about a person's livelihood.

There is currently no written answer to any of:

- **Can a pharmacist see what a pharmacy said about them?** Ratings that are
  invisible to their subject are rumours with arithmetic.
- **Can they contest one?** A single unfair no-show mark — a family emergency, a
  pharmacy that changed the time — sits on a reliability score indefinitely.
- **Does a rating expire?** A bad month two years ago should probably not price
  someone out of work today.
- **What happens on account closure?** They leave; does the record follow them,
  vanish, or stay visible to pharmacies?
- **Who else sees it?** It is visible to pharmacies. Is it visible to a partner
  (W15)? To a future employer through S2? Those are very different promises.

**This costs nothing to settle now and is nearly impossible to retrofit**, for
the same reason every rating system discovers late: by the time it matters,
there are ten thousand scores computed under rules nobody wrote down.

**Needs your judgement:** all five. The one I would not compromise on is the
first — a pharmacist should be able to see everything the platform says about
them.

---

# Part 4 — Context

Findings worth not re-deriving. Nothing here is a task.

## C1. The commission ceiling

At ~40,000 IQD a shift, the 10% is ~4,000 IQD ≈ $3 gross, **~3,224 net** once
the processor takes its cut.

| Active pharmacies | Shifts each / month | Revenue / year |
|---|---|---|
| 1,000 | 2 | ~$72k |
| 3,000 | 3 | ~$324k |
| 5,000 (≈30% of the market) | 3 | ~$540k |

The last row is a *mature* business — a third of every community pharmacy in
Iraq transacting monthly — at roughly half a million dollars. Real, but not what
justifies years of category creation on its own.

**Subscription raises the floor, not the ceiling.** At Basic 9,000 a pharmacy
yields ~108,000 IQD a year (≈$82) whether or not it posts, against ~$36 from two
shifts a month on commission. That roughly doubles revenue per pharmacy at low
volume and *caps* it at high volume — which is the trade W14 makes deliberately.
It does not change the conclusion: **the shift network's value is the
relationship and the data, not the take rate.**

## C2. Leakage is the existential risk

In a market where everyone has everyone's number, a commission-only marketplace
teaches both sides to transact around you by the third booking.

**What it looks like in the data**, so it can be watched rather than assumed: a
pharmacy whose posting rate falls while its staffing need obviously has not; the
same pharmacist covering the same pharmacy repeatedly and then both going quiet;
a rising share of shifts posted and cancelled rather than filled. None is proof.
Together they are the metric that matters more than GMV, and **nobody is
currently computing any of them** — the Reports module could, and should, before
there is enough volume for the trend to be invisible.

The defences are subscription (S1/W14), the reliability record, the handoff
evidence, the payment trail and the drug reference (S8) — a better reason to
build each of them than the revenue.

## C3. The CRM's build source is not in the repository

The CRM ships as one 260 KB file, assembled by a `build.sh` from about twenty
part files that live in a session scratchpad rather than in git. Nothing is lost
— the built file is complete, self-contained and committed, and the drug data it
carries is regenerable from `data/drugs.mjs` with `npm run drugs` — but the next
person to change the CRM edits the built file directly rather than the parts.

Two options, neither urgent: commit the part files and the build script beside
the output, or accept the single file as the source and delete the split. The
worst outcome is the ambiguity persisting long enough that someone edits the
built file while a stale set of parts still exists, and a rebuild silently
reverts their work.

## C4. The regulated surfaces this roadmap touches

Not legal advice, and not a blocker list — a map of where a licence or a
licensed partner is required, so none of it arrives as a surprise mid-build.

| Activity | Where it appears | Position taken |
|---|---|---|
| Holding customer funds | Payments, any wallet | **Avoided by design.** Money moves pharmacy → merchant account → pharmacist; no balances held |
| Payment processing | Every shift | Merchant agreement with a licensed processor (ZainCash / Qi Card) |
| Wholesale drug distribution | S4 procurement | Licensed. Either hold one or partner — W4 already models exactly this licence |
| Lending | S6 embedded finance | Licensed. Partner; do not build |
| Health data | W8's dispensing log | Mitigated by design (no patient identity), **not yet lawyer-reviewed** — W8 |
| Controlled substances | The drug reference, W8's log | The log disclaims the legal register on screen; whether controlled substances belong in it at all is open — W8 |
| Credentialing | S2, S7 | P4. Recognition, not assertion |

**Iraq has no comprehensive data protection statute.** That is an absence of a
path, not a safe harbour: no clear compliance route, and no safe harbour either.
The Syndicate and the Ministry may hold views that matter more in practice than
a statute would.

## C5. What competition would actually look like

Worth having thought about once, since the answer shapes how much of Part 2 is
urgent.

The shift board is **not** the defensible part. It is a few months of work for
anyone, and a well-funded copy could exist within a year of proof that the
market is real. What is slow to copy, in order:

1. **The Syndicate relationship** (P2, P3). One professional body, one
   agreement. Hardest to copy and the least under your control.
2. **The verified roster and work history.** Time-based. Every month of
   operation widens it and a competitor starts at zero.
3. **The drug reference and check** (S8). Copyable in principle; the data
   curation and the clinical judgement in it are a genuine grind.
4. **Pharmacy relationships and the CRM discipline behind them.** Unglamorous
   and the most durable of the four.

**The strategic conclusion:** speed matters most on the things that compound
with time, and least on the things that can be built any time. Shipping the
shift board faster wins little; starting the Syndicate conversation and the
verified history earlier wins a lot.

---

## Picking these up

Each Work entry names the files and identifiers involved, so nothing needs
re-deriving. **Parts 2–4 were expanded on 18 Sep 2026**, and P5 and C4–C5 are
new: a rating policy that was never written down, the regulated surfaces the
roadmap touches, and what a competitor could and could not copy. W1 and W2 revised decisions made in the v0.0002 builds; that was
expected, not a defect — those were built from what was known then.

What is left in Part 1 is **W6** (data-model changes that are cheap now and
awkward later — mostly CPD groundwork, and speculative until a revenue route in
Part 2 is chosen), **W7** (chain and multi-branch accounts, which is large), the
unbuilt half of **W8**, and the two entries that decide what this becomes:
**W9** (a name that is not "pharmacist") and **W10** (medical reps). W9 is
cheap now and expensive at every later point, and it gates the Syndicate
conversation. **W11** is a one-string rename and can go in with anything, and
**W12** is five measured pieces of friction, of which W12a and W12b are the
cheapest work in this file with the highest effect. **W13** is navigation and
the three home screens. **W14** is the subscription, at Basic 9,000 and Premium
19,000 — read its arithmetic before its architecture, especially the shift
allowance that stops a chain subscribing to Basic and posting forty shifts.
**W15** is the partner account, job listings and banners, and it is the first
feature that tests P1 rather than merely respecting it.

W8 is the one to read first, because it is the only entry here where the code
shipped ahead of the decisions. The dispensing check and the log are in
v0.0004; the legal read, the consent wording, the ruling on controlled
substances and the extension of P1 are not, and none of them is a coding task.
Nothing breaks if they wait, but the first real pharmacy is the wrong place to
discover any of them.
