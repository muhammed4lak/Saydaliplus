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

---

# Part 2 — Strategy

Revenue routes and the features that follow from them. Not work until chosen.
Every market figure here is an order of magnitude to sanity-check, not research.

## S1. Pharmacy subscription alongside or instead of commission
*Near term. Highest priority of the revenue routes.*

Flat monthly fee per pharmacy for unlimited posting plus the management tools.
Comparable: **Lantum**, **Locum's Nest**, **Patchwork** (UK) all moved off
per-shift commission. Commission makes you an agency and agencies get
disintermediated; subscription makes you infrastructure. Needs W6a.

## S2. Verified credentials as a product
*Near term. Half-built already.*

Verification-on-demand for employers, or a paid verified profile for the
pharmacist. Comparable: **Medallion**, **Verifiable** (US). Builds directly on
the Syndicate roster module. Nobody in Iraq has a clean, matched, current map of
pharmacist ↔ registration ↔ employment history.

## S3. Permanent placement fees
*Near term. Nearly free given what exists.*

The relief network is a recruiting funnel that already knows who is reliable.
Charge when a locum becomes a hire. Comparable: **Doximity**'s hiring line.
55,000 pharmacists against 17,000 pharmacies with a hiring freeze is the largest
pool of under-employed pharmacists in the region.

## S4. B2B procurement marketplace
*Later. Capital-heavy. Largest revenue.*

1–2% of procurement GMV is plausibly 50–100× the shift commission from the same
pharmacy. Comparable: **Grinta** (Egypt), **DrugStoc** (Nigeria), **Retailio**
(India), **MaxAB** (Egypt). Do not build early; do model the supply chain now
(W4).

**W8 gave this its first demand signal** — per-pharmacy consumption tallies —
and a caveat that has to travel with it: pharmacists will log some prescriptions
and not others, so consumption is a floor, not a count. A procurement engine
that treats it as a count will make pharmacies under-order.

## S5. Pharma company access
*The margin business. Needs a daily-active audience first.*

Product education, sponsored CPD, launches, market research panels. Comparable:
**Medscape**, **Doximity** — both make most of their money here, and neither
sold the network as the product. Requires P1 settled first.

The consumption tallies from W8 are the most sellable thing here and the most
dangerous: aggregate above the individual pharmacy unless that pharmacy has
consented, disclose it to pharmacists where they log, and give the pharmacy its
own analytics before anyone outside sees a number. The first of those is built;
the other two are not.

## S6. Embedded finance on procurement
*Much later. Arguably a different company.*

Working capital underwritten against observed purchase history. Comparable:
**MaxAB**, **Halan**, **Khazna**. Needs a licensed partner — same warning as the
payments provider note in the README. Underwriting on W8's tallies inherits
their bias: they under-count, so they under-state a pharmacy's turnover.

## S7. CPD — the ledger, not the courses

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
  identity, delivery, the ledger and the certificate.
- **S7d. The combined Syndicate ask.** The register alone reads as a taking —
  you want their data, what do they get? Register *plus* a CPD system they do
  not have reads as a trade in their favour. Same meeting, same proposition: let
  us be your digital infrastructure.

## S8. Drug reference as a daily-use tool

**Built — App_v0.0003 / App_v0.0004.** `data/drugs.mjs` holds 119 molecules,
embedded into both builds by `npm run drugs`. v0.0003 gave the app the
*reference*; v0.0004 gave it the *check* — a basket that takes the whole
prescription at once, which is the thing that turns a lookup into a habit.

Still open under this heading: availability ("which pharmacy near me has this"),
which needs stock data the platform does not have, and whatever the Syndicate or
the Ministry will confirm as authoritative, which is a conversation rather than a
build.
*Highest-leverage feature on the list.*

Arabic interaction and contraindication checking. Shift-hunting is episodic; a
drug lookup is daily. This is the retention hook that makes S4, S5 and S7
possible, and the CRM's Drugs module is already the schema for it.

## S9. Near-expiry stock exchange between pharmacies

Pharmacies list near-expiry stock to each other. Expiry write-off is a real
unsolved cost in fragmented pharmacy markets. Not directly monetised — a density
engine that makes the pharmacy side valuable independent of shifts.

## S10. WhatsApp as an interface, not a feature

Post a shift by WhatsApp, have it appear in the app. Removes the largest
adoption barrier for an older pharmacy owner. Distribution beats product in a
market that has not seen this category.

---

# Part 3 — Principles to settle before the relevant build

## P1. Pharma money never touches clinical content
*Settle before the first sponsorship cheque, not after.*

If a manufacturer funds a module and the module nudges toward their product, you
have influenced what reaches patients who did not consent to that. The
international answer: funders buy the **slot**, never the **content**; an
independent clinician writes it; sponsorship is disclosed on the module;
sponsored material never ranks a product inside a clinical recommendation. Adopt
something equivalent to ACPE's commercial-support standards. Retrofitting ethics
onto a live revenue line is how these platforms lose a profession permanently.
Needs W6d to be structural rather than a habit.

**W8 widened this and the wording has not caught up.** This principle covers
clinical *content*. Since v0.0004 the platform also holds data **generated by** a
clinical tool — what each pharmacy dispensed, collected inside a safety checker.
Selling that is not selling content, but it is selling the exhaust of something
pharmacists were told was for patient safety, and if they work that out they stop
using it. Either extend the principle to cover it or decide deliberately not to;
do not leave it resting on the fact that nobody has asked yet.

## P2. Non-exclusivity with the Syndicate

Do not ask a professional body to lock out competitors. It is how you get
refused, and if granted, how you become the thing the membership resents.
Non-exclusive-but-first is a more durable position than a contract nobody likes.

## P3. Register data stays the Syndicate's, and stays exportable

You run it; you do not own it. The right answer, and the one that survives a
change of Syndicate leadership.

## P4. The credentialing-authority line

The student certificate deliberately states that Saydali+ **is not** a
credentialing authority. CPD is the move to becoming one. Do it with a signed
recognition rather than by quietly issuing credits and hoping it sticks — the
difference between "a company that issues certificates" and "the recognised CPD
tracker" is that signature, and everything downstream depends on which one you
are.

---

# Part 4 — Context

## C1. The commission ceiling

At ~40,000 IQD a shift, the 10% is ~4,000 IQD ≈ $3.

| Active pharmacies | Shifts each / month | Revenue / year |
|---|---|---|
| 1,000 | 2 | ~$72k |
| 3,000 | 3 | ~$324k |
| 5,000 (≈30% of the market) | 3 | ~$540k |

The last row is a *mature* business — a third of every community pharmacy in
Iraq transacting monthly — at roughly half a million dollars. Real, but not what
justifies years of category creation on its own. The conclusion is not "charge
more": it is that the shift network's value is the relationship and the data,
not the take rate.

## C2. Leakage is the existential risk

In a market where everyone has everyone's number, a commission-only marketplace
teaches both sides to transact around you by the third booking. Subscription
(S1), the reliability record, the handoff evidence and the drug reference (S8)
are all defences against it — a better reason to build them than the revenue.

## C3. The CRM's build source is not in the repository

The CRM ships as one 260 KB file, assembled by a `build.sh` from about twenty
part files that live in a session scratchpad rather than in git. Nothing is lost
— the built file is complete, self-contained and committed, and the drug data it
carries is regenerable from `data/drugs.mjs` with `npm run drugs` — but the next
person to change the CRM edits the built file directly rather than the parts.

Two options, neither urgent: commit the part files and the build script beside
the output, or accept the single file as the source and delete the split. The
worst outcome is the current ambiguity persisting long enough that someone edits
the built file while a stale set of parts still exists somewhere, and a rebuild
silently reverts their work.

---

## Picking these up

Each Work entry names the files and identifiers involved, so nothing needs
re-deriving. W1 and W2 revised decisions made in the v0.0002 builds; that was
expected, not a defect — those were built from what was known then.

What is left in Part 1 is **W6** (data-model changes that are cheap now and
awkward later — mostly CPD groundwork, and speculative until a revenue route in
Part 2 is chosen), **W7** (chain and multi-branch accounts, which is large), the
unbuilt half of **W8**, and the two entries that decide what this becomes:
**W9** (a name that is not "pharmacist") and **W10** (medical reps). W9 is
cheap now and expensive at every later point, and it gates the Syndicate
conversation.

W8 is the one to read first, because it is the only entry here where the code
shipped ahead of the decisions. The dispensing check and the log are in
v0.0004; the legal read, the consent wording, the ruling on controlled
substances and the extension of P1 are not, and none of them is a coding task.
Nothing breaks if they wait, but the first real pharmacy is the wrong place to
discover any of them.
