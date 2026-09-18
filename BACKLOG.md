# Backlog

Agreed but not built. Split four ways because they are read at different times:

- **Work** — things to build. Each says where the code stands, what it should
  become, and what needs deciding first.
- **Strategy** — revenue routes and features that follow from them. Not work
  until one is chosen.
- **Principles** — decisions to settle before the relevant build, not after.
- **Context** — findings worth not re-deriving.

IDs are stable. Reordering does not renumber anything. Nothing here has been
started.

---

# Part 1 — Work

## W1. Model a pharmacy owner as a pharmacist *linked to* a pharmacy

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

**Raised:** 11 Sep 2026. **Touches:** CRM, and probably the app.

**Where it stands.** Type key `training`, label `ot.training`, saved view
`v.training`. Orders segments on it.

**Scope.** Label only — keep the key `training` so nothing else moves. The app
also says "تدريب طلابي" / "Student training" in several places; the two halves
disagreeing about the same thing is the sort of inconsistency that costs trust
in a demo. Probably both or neither.

## W4. Externals: roles are licences, registration is a product fact

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

## S5. Pharma company access
*The margin business. Needs a daily-active audience first.*

Product education, sponsored CPD, launches, market research panels. Comparable:
**Medscape**, **Doximity** — both make most of their money here, and neither
sold the network as the product. Requires P1 settled first.

## S6. Embedded finance on procurement
*Much later. Arguably a different company.*

Working capital underwritten against observed purchase history. Comparable:
**MaxAB**, **Halan**, **Khazna**. Needs a licensed partner — same warning as the
payments provider note in the README.

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

---

## Picking these up

Each Work entry names the files and identifiers involved, so nothing needs
re-deriving. W1 and W2 revise decisions made in the v0.0002 builds; that is
expected, not a defect — those were built from what was known then.
