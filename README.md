# Saydali+ — صيدلي+

A two-sided marketplace for Iraq's pharmacy sector, plus a student training
module. Pharmacies post shifts they need covered; freelance pharmacists accept
them and are paid per shift; pharmacy students find 12-week summer placements and
keep a logbook the host pharmacy approves monthly.

Next.js (App Router, TypeScript strict) + Supabase, delivered as an installable
PWA. Arabic is the default language.

---

## Running it

```bash
npm install
cp .env.example .env.local     # fill in your Supabase project details
npm run dev
```

```bash
npm test          # 164 unit tests — the business rules, the drug reference, the attendance history, the exchange and incidents
npm run typecheck
npm run build
npm run drugs         # re-embed data/drugs.mjs into both single-file builds
npm run drugs:export  # write the reference to data/export/ (JSON and CSV)
python3 scripts/read-sources.py   # re-map the Ministry register and the EDL onto the reference
```

### Database

Migrations are plain SQL in `supabase/migrations`, applied in filename order.
With the Supabase CLI:

```bash
supabase db reset
npm run db:types   # regenerate src/lib/supabase/database.types.ts from the schema
```

### The single-file app

`demo/saydali-plus_v*.html` is the whole front end in one file — open it in a
browser, no server and no build. It fills the window, you sign in as an account
to get that account's app, and every screen in every navigation is a screen.
The sign-in page lists the five seeded accounts; picking one is how you become
that person, because a role switcher floating over the app is a thing a
prototype has and a product does not.

It is the front end with its data stubbed, not the whole product. What you can
see and do here you can see and do in the real app; what stops you doing it to
someone *else's* data is row-level security, which cannot exist in a file you
open from disk. That half lives in `supabase/` and is tested there.

Two things in it are real rather than mocked, because they are the things worth
checking in front of a pharmacy: the fee engine is a port of `src/config/fees.ts`
and the shift-hours function a port of `src/lib/time.ts`, so the numbers it shows
are the numbers the product charges — including the floor falling on the
pharmacy.

```bash
npm run check:app     # drives it in a real browser
```

There is no build step and no compiler over that file, which makes it the
easiest thing here to break silently — a typo inside a string of concatenated
HTML renders an empty screen rather than failing anything. So the check is
behavioural: sign in as each of the five accounts, walk every screen, and assert
the rules hold — the payout gate, the logbook's 80-character and attendance
gates, forward-fill, the assistant never applying its own suggestion, and no
horizontal scroll at 320px.

### The CRM

`crm/saydali-crm_v*.html` is the other half of the same product, also one openable
file: what the team in Baghdad sees, rather than what a pharmacy or a pharmacist
sees. Modelled on Zoho CRM — module tabs, saved views, a filter rail, record
pages with a timeline, bulk actions, CSV import — in Saydali+'s palette, so the
two read as one company's software.

**It is English only, on purpose.** The app is Arabic-first and stays that way;
its users are pharmacists and owners across Iraq. This is the back office, used
by one team, so a second language buys nothing and costs a permanent risk of
half-translated screens. Arabic still appears as *data* — a pharmacy is really
called صيدلية الرحمة, a drug really has an Arabic name — shown as its own field
on the record rather than as a translation of the interface. The check enforces
the line: Arabic in a column heading or a button fails; Arabic in a record field
is expected.

Nine tabs: a customisable dashboard, seven data modules, and Reports.

| Module | What it holds |
|---|---|
| **Orders** | The main one. Every shift and every placement, segmented by order type — pharmacist shift, student placement — with the status lifecycle from posted to completed. Still marked in-progress on the screen itself. |
| **Users** | Every account. Two types — pharmacist and student — plus a saved view for owners, which is a view and not a type. |
| **Pharmacies** | The business behind a pharmacy account — licence, district, trial clock, fill rate. |
| **Externals** | Everyone in the supply chain who is not a pharmacy: factories, scientific bureaux, importers, storage houses, distributors, and the foreign principals behind them. |
| **Universities** | Colleges of pharmacy, and the email domain that makes student verification automatic. |
| **Syndicate roster** | Pharmacist names and numbers as the Syndicate supplies them, with the match against platform accounts. |
| **Drugs** | Scientific name as the identifier; brands under it, each naming who made it, who holds its registration and who represents the principal — and able to override the doses. |
| **Reports** | A report is a name, a SQL query and how to draw the result. The dashboard is built only from these. |

Plus **Team & access**, reached from the account menu rather than the tab bar,
because it is who may do what rather than a pile of records to work through.

**The dashboard holds no numbers of its own.** Every tile names a saved report,
and a report is SQL. So a figure on the dashboard can always be traced to the
query that produced it, changing the query moves the tile with it, and the
dashboard cannot show something the Reports module could not reproduce. Tiles
reorder, resize and come off; a tile whose report was deleted says so rather
than vanishing.

The query engine runs a documented subset of SQL over the in-memory tables —
SELECT with COUNT/SUM/AVG/MIN/MAX, FROM, inner JOIN on equality, WHERE with
AND/OR/IN/LIKE/IS NULL, GROUP BY, ORDER BY, LIMIT. It **refuses** subqueries,
UNION, HAVING, OUTER JOIN and DISTINCT by name rather than ignoring them, because
an engine that quietly drops half a clause returns a wrong number that looks
right. A report that does not run cannot be saved.

A report shows what its query returns, including raw column values — `in_progress`
rather than "In progress". That is deliberate: the moment the dashboard prettifies
a value the report did not produce, the two stop agreeing. Rename it in the SQL
with `AS` if you want it prettier.

Three more things worth reading the code for.

**The Syndicate module is honest about what it is.** Iraq has no digital
pharmacist registry and the Syndicate's processes are paper-based, so this is a
roster somebody loaded from a spreadsheet, with the batch date on every row. The
module says that on screen. What it is *for* is the match: a pharmacist's number
is either absent from the roster, or present with a name that agrees, or present
with a name that does not — three outcomes a reviewer acts on differently. The
name comparison strips Arabic diacritics, normalises alif and ya and ta-marbuta,
and tolerates a roster's full tribal name against a three-part sign-up. It
produces a suggestion; a person still decides. **All of this is provisional
until the Syndicate confirms how they will actually supply the list.**

**The drug model keys on the molecule, not the brand.** Brands come and go and
one drug ships under a dozen, so keying on a brand scatters one drug across a
dozen rows. Doses live on the drug; a brand may override them, because two
companies genuinely do not always supply the same strengths — and a pharmacist
reading "500 mg" for a brand that only comes in 250 is being told something
false. Interactions carry a severity and contraindications are a list.

**CSV import parses properly and previews before it writes.** Both the drug list
and the Syndicate roster arrive as somebody else's spreadsheet, so the importer
uses a real CSV parser rather than `split(',')` — a drug note containing a comma
is the normal case, and splitting on commas silently corrupts those rows. It
validates each row, flags duplicates *within the file*, shows what it would do
as new / update / error, and writes nothing until that preview has been read.
Rows with an error are skipped; the rest apply.

**An Externals role is a licence, and registration is a fact about a product.**
"Is Acino a manufacturer or a marketing authorisation holder?" has no answer,
and asking it is the mistake. A company holds whatever Iraqi licences it holds —
manufacturer, scientific bureau, importer/agent, storage house, distributor —
and the normal Iraqi case is one entity wearing four of them at once, so roles
are multi-valued and the facet matches on *one of* rather than on equality. A
foreign principal holds none, and the form lets it: ticking a licence to fill in
a required field puts a lie in the data. Registration does not live on the
company at all, because the same company is the registration holder for one
product and merely the factory for another — so it lives on the brand, beside
who manufactured it and which bureau represents the principal. The fixtures
include the case that proves it: a metformin brand made at Samarra under licence
from Hikma, who hold the registration, represented here by a Baghdad bureau.

**The CRM has three levels of account, and the report editor is the sharp one.**
One owner admin — transferred rather than deleted, so the operation is never
left with none and never with two. Admins run it and can create employees;
employees do the day-to-day work. Everyone reads every module, because an
operator who cannot see a pharmacy cannot phone it. What separates the levels is
deleting, CSV import, creating accounts — and writing SQL. That last one is a
data-export capability wearing a chart's clothes: arbitrary `SELECT` across every
table is the roster, the phone numbers and the licence numbers in one download.
So employees keep *run* and *pin* on saved reports and do not get the editor.
Every gated action is hidden **and** refused: hiding a button is decoration when
the handler is a global on a page anyone can open, and the check calls each one
directly to prove the refusal is real. Deactivating an account will not complete
until its records have a named new owner — a pharmacy that stops being anybody's
job is how a customer stops being called.

```bash
npm run check:crm     # drives it in a real browser
```

### The drug reference

Since v0.0015.3 the reference is **every molecule on the Iraqi market** —
1,174 of them, drawn from the Ministry of Health register (5,214 products) and
the NCDS Essential Drugs List (597 items). They live in `data/drugs/`, one file
per part of the body (32 files: blood pressure, heart, antibiotics, skin,
eye, anaesthesia, antidotes, herbal…), and `data/drugs.mjs` joins them into
the one list everything else reads. `npm run drugs` writes it into both
single-file builds between `DRUGS:BEGIN` / `DRUGS:END` markers. **One list, two
readers.** The CRM has it as a module with editing, CSV import and brand links
on top; the app has it as a lookup a pharmacist opens at the counter. Two copies
of the same reference drift, and the copy that drifts is the one somebody is
reading with a patient in front of them.

Each molecule carries its **category** (a class in one of 20 groups — *ACE
inhibitors* in *Heart and blood vessels*; 136 classes in all), its scientific
and Arabic names, other names it goes by, the international brands it is asked
for by, ATC code, main dosage form, the strengths marketed, a counselling line
(what you say handing it over), the interactions worth stopping a sale for with
a severity, its contraindications, and **at most three questions to ask the
patient** when dispensing it — the three whose answer changes what happens next.
The source files write a drug briefly, drawing on shared banks in
`data/drugs/banks.mjs` (114 questions, 111 contraindications, 65 interaction
classes, 57 class rules), and `data/drugs/expand.mjs` turns it into the full
shape; an unknown bank key fails the build, naming the drug.

**Interactions come three ways.** A drug names another drug (873 lines); names
a *class* (`#nsaid`, `#statin`, `#contrast` — 195 of those lines); or falls
under a **class rule** that holds whichever two members of the classes meet
(any opioid with any benzodiazepine is critical) — written once rather than on
every drug. 936 of the 1,174 have at least one; most of the rest are creams,
eye drops, IV fluids and diagnostics, and a drug with none listed is still not
a drug with none.

**A cream is not its tablet.** A molecule that also comes as tablets has its
skin and eye forms as entries of their own — `Diclofenac (topical)`,
`Ciprofloxacin (eye)` — with their own counselling and without the tablet's
interaction classes, so a gel does not raise the tablet's bleeding alert.

**Brands registered in Iraq come from the register, not from memory.**
`scripts/read-sources.py` matches every registered product's ingredients to the
reference — by scientific name, other names and the register's own spellings;
it splits run-together text (`rivaroxaban20`), puts misspelt names back
(`loratidine`, `ceftriaxon`) when one name is clearly nearest, sends creams,
vaginal forms and eye drops to the right entry, and falls back to brand names
for rows with no ingredient text. **5,103 of the 5,186 registered products now
link to the reference** (2,245 before), and every generic the Essential Drugs
List names is in it. A drug's page lists the trade names it is registered
under.

**Exports.** `npm run drugs:export` writes `data/export/`: `medications.json`
(everything, with the banks, the registered trade names and EDL codes),
`medications.csv` (one row per molecule, English and Arabic side by side) and
`interactions.csv` (every interaction and class rule). The CSV files open in
Excel with the Arabic intact.

The embed step validates before it writes — a duplicate scientific name, an
unknown category, form, class or bank key, a fourth question, a partner that is
neither a drug, a class nor a known outside partner, or a severity outside
warning/serious/critical fails the run rather than rendering as a blank chip
later. `tests/unit/drugs.test.ts` holds the data module to the same rules.

**What is reference content and what is a fixture.** The molecule data is
written from standard formulary sources and is **placeholder clinical content
until the clinical curator has reviewed it** (the header of `data/drugs.mjs`
says so). The brand rows in the CRM are
invented, because who holds an Iraqi registration for what changes with every
renewal and cannot be verified from here — and a plausible-looking wrong
registration in front of an operator is worse than an obviously invented one.
Both screens say which is which.

**It is a reference, not a prescriber**, and every screen that shows it says so.
The interactions listed are the ones that change what a pharmacist does at the
counter, not the complete set; a drug with none listed is not a drug with none.

In the app it sits in the bottom bar rather than behind "More", because it is
the one screen used *during* the work — several times a shift, with someone
waiting. What it displaced is the CV, opened a handful of times a year, which
moved to More along with incident reporting. Search matches either script,
the ATC code, other names, international brands and the trade names in the
register, and flattens diacritics, hamza and ta-marbuta on both sides, because a
pharmacist keying a name in a hurry writes ا for أ and ه for ة. A name that
starts with what was typed comes first — Enter adds the top hit. The list
draws the first hundred and counts the rest; category chips narrow it.

### The dispensing check

The reference answers "tell me about this drug". The check answers the question
a pharmacist actually has — *can they take these together* — and it is a second
tab of the same screen rather than a second place. It is what the module
**opens on**, and it has a card at the top of the home screen: looking a single
drug up is the rarer errand, and two taps is too many for something you reach
for with a patient waiting. Moving between the two tabs sticks while you stay
on the screen; only arriving from the navigation resets to the check. Add the drugs on a
prescription and it reports, worst first:

1. **Interactions** between any two drugs in the basket, every pair, not just
   adjacent ones.
2. **Therapeutic duplication**, from a curated list of classes rather than from
   the ATC codes (see below).
3. **The questions to ask.** The app does not know the patient, so what it
   cannot know it asks: each drug's own (at most three), deduplicated across
   the basket, so three drugs that need "are you pregnant?" ask it once.
   The contraindications stay on each drug's record.

**The bidirectional index is the part that matters.** Interactions in the
reference are written from one side: 149 of the pairs are one-way. Amiodarone
lists warfarin as critical; warfarin's own record does not mention amiodarone.
So the obvious check — does drug A's list contain drug B — finds a pair only
when the two drugs happen to be added in the order the data was written. Same
two boxes, opposite order, silence, and no error to show for it. The pairs are
therefore normalised once into an undirected index, and where the two sides
disagree on severity the worse one wins. Both orders are asserted in the check
suite. Since v0.0015.3 a lookup also reads the two drugs' classes — a drug's
`#class` lines and the class rules — and the worst of the three kinds wins; at
equal severity the drug's own wording is kept.

**Duplication is curated, not computed.** The obvious implementation is "two
drugs sharing an ATC class", and it is wrong: run it over this list and it
fires on metformin + gliclazide, on basal + bolus insulin, on aspirin +
clopidogrel after a stent, and on two antiepileptics — every one a standard
regimen. Alert fatigue is the documented way these tools fail, not missing
data. So `DUPLICATE_RULES` in `data/drugs.mjs` names the ten classes where a
second drug is a real problem, each with its own wording, and the ones that are
often deliberate say so. The check suite asserts that the standard combinations
stay silent.

**Nothing found is never a green tick.** The system knows that no pair in its
table matched; it does not know that a combination is safe, and the gap between
those two statements is where a missed interaction stops being a known limit
and becomes a broken promise. So the verdict reports what was checked — *"4
drugs, 6 pairs checked against the reference"* — and says the reference is not
complete. Coverage gets the same treatment: a partner named by a drug in the
basket that no basket can hold (alcohol, named by metronidazole; grapefruit
juice) is shown as a card, not a footnote.

### The dispensing log: tallies, never baskets

Recording keeps a **count per drug**, for a pharmacy, a pharmacist and a day.
The basket is thrown away.

That is the decision that makes a log defensible at all. There is no patient
anywhere in it, and — just as important — no record that these particular drugs
went out *together*, because a basket is a fingerprint. In a small district
there may be one person on methotrexate, and "methotrexate + folic acid at
14:20" identifies them to anyone who knows the neighbourhood with no name
stored anywhere. A day's tally does not: a pharmacy dispenses enough in a day
to dissolve the co-occurrence. The day is also the finest grain kept, because
an hour would put the basket back together.

Who sees what:

| | Sees |
|---|---|
| **Pharmacist** | What they recorded, at that pharmacy, on that shift. A locum who worked one Thursday has no business reading two years of somebody else's dispensing. |
| **Pharmacy owner** | The whole log for their own pharmacy, as consumption by drug. |
| **Operator (CRM)** | Every tally, as a `dispensing` table in the SQL view, with two seeded reports. |

A student on placement gets the check — it is the half that teaches — and
cannot record, because they are not the dispensing pharmacist. A pharmacist not
working a shift can check but has nowhere to record to: the log belongs to a
pharmacy.

Two things are said on screen rather than buried: **this log does not replace
the controlled-substances register or any legally required record**, and the
pharmacy's own consumption view exists because whoever generates the data
should get value from it before anybody else does.

### Plans and the billing ledger

Two subscription tiers sit beside pay-as-you-go commission: **Basic 9,000 IQD**
and **Premium 19,000 IQD** a month. A plan replaces the **pharmacy's 7%** and
never the pharmacist's 3% — which keeps the one rule the supply side can hold in
its head, and keeps per-shift revenue growing with volume even on a flat fee.

**Each tier carries a shift allowance**, with ordinary commission beyond it.
Without one, unlimited posting on the cheaper plan is a hole: at twenty shifts a
month a subscribed pharmacy would cost us ~47,000 IQD against commission, and at
forty, ~103,000. With it, a forty-shift pharmacy still saves and the platform
still earns. `calculateFees()` takes the plan and the count of shifts already
filled this month; the fee engine has no clock, so the caller owns the month
boundary.

`coveredByPlan` on the result is what lets a charge row say **why** it was zero.
A shift absorbed by an allowance and a shift inside the free trial are both
zero, and six months later the difference between them is the difference
between a working system and a bug.

**The ledger is one table for every charge** — a shift's commission, a monthly
subscription, and later a listing fee. Commission is computed on the fly, so if
subscription charges lived anywhere else nobody could answer "what does this
pharmacy owe this month" without unioning two shapes, and reconciliation with
the processor would break. It is append-only by intention: a correction is a new
row, never an edit.

### Policy tests

RLS is the security boundary, so it is tested against a real database rather than
reasoned about:

```bash
./supabase/tests/run.sh    # needs psql pointed at any Postgres 15+
```

That rebuilds a throwaway database from the migrations and runs **130
assertions** as real users — a rival pharmacy, an uninvolved pharmacist, another
student, a platform admin — checking what each can and cannot see or do.
`harness.sql` supplies the small part of Supabase the schema depends on
(`auth.users`, `auth.uid()`, the three roles), so this needs no Supabase
installation.

---

## Versions

Both single-file builds carry their version in the filename — `App_v0.0001`,
`CRM_v0.0001` — because these files get emailed, opened from a desktop and
shown on somebody else's laptop, where a filename is the only thing that says
which one you are looking at. Each file also states its own build on screen,
and a check asserts the two agree: a file called `_v0.0002` that still says
`v0.0001` inside fails.

Bumping a version renames the file, which breaks exactly one thing — the link
between the two builds, since each opens the other by name. So each holds a
`PEER_APP` / `PEER_CRM` constant, and each check asserts that the file it names
exists on disk. **Bump one build, change that line in the other.** Forgetting
makes a test fail rather than a button do nothing.

The checks find the highest-numbered build in their directory themselves, so
they never need updating for a rename:

```bash
npm run check:app     # newest demo/saydali-plus_v*.html
npm run check:crm     # newest crm/saydali-crm_v*.html
```

---

## Decisions worth knowing before you read the code

**A pharmacy owner is a pharmacist *linked to* a pharmacy, not a third type.**
Same person, same Syndicate card, plus a pharmacy licence — so signing up
collects both and creates both records at once. The account type stays
`pharmacist`; what makes them an owner is the link to the licence created with
their application. So "is an owner" is derived, never stored: clear the link and
every screen, view and count follows, which is the whole reason not to make it a
third type that can disagree with the data.

**The pharmacist half of an owner's app is off by default.** They get every
pharmacy screen from the start; the shift-taking screens — browse, my shifts,
earnings — appear only once they turn shift management on in settings. Most
owners never take a locum shift, and a screen you will not use is clutter on a
phone. Their CV stays visible either way: it is their professional record, not a
feature of taking shifts. Five thumb-sized targets is the bottom bar's limit, so
the rest live behind "More" — a screen, not a hidden menu — and the desktop
sidebar shows the same items under headings, which is why turning the toggle on
reshuffles both navigations rather than only one.

**Applications are queued during verification, not blocked.** §3 of the brief left
this open. An unverified pharmacist can browse *and apply*; the application is
invisible to the pharmacy until the Syndicate review clears. A week of read-only
access is a real churn risk on the side of the market we most need, and showing an
owner an unvetted name is the risk we are not willing to take. The queue is an RLS
predicate on `applications`, not application code, and `accept_application()`
re-checks it so a guessed id cannot route around it.

**Verification is a human reading a photograph.** Iraq has no digital pharmacist
registry and the Syndicate's processes are paper-based, so there is no number to
look up and no API to call. `/admin/queue` is where a reviewer compares the
uploaded card or licence against Syndicate records and decides. Nothing in the
codebase pretends otherwise.

**Money is server-authoritative.** A pharmacy sends a rate, never a total: a
trigger derives the total from the rate and the stored shift interval, and
`accept_application()` computes the fees. A pharmacy that overwrites
`total_amount` to reduce its commission gets the value recomputed — there is a
test for that.

**Fee constants live in one file.** `src/config/fees.ts` holds the 10% commission,
its 70/30 split, the 2,500 IQD floor, the 30-day trial and the processor rate. The
two trials are evaluated independently, because they run from two different signup
dates: a new pharmacy hiring an established pharmacist waives only the pharmacy's
share, and the pharmacist still pays their 3%.

There is a second implementation in SQL (`calculate_fees()`), because a trigger
cannot call TypeScript. Both are tested on the same cases, so drift shows up as a
failing test rather than a silent discrepancy. If you change one, change the other.

**The minimum fee floor falls entirely on the pharmacy.** The pharmacist pays 3%
of the shift value, always — the floor never touches their side. Splitting it
70/30 like an ordinary commission would cost them 750 on a 20,000 IQD shift
rather than 600, and that same 150 dinars is 0.7% of what the pharmacy is charged
against 25% of what the pharmacist is deducted. It is also the pharmacy that
creates the cost the floor covers, by posting a shift too small to pay for its
own processing. What this buys is a rule that fits in one sentence, in a market
we are asking to trust us.

**Derived stats are a view, never columns.** `shifts_completed`, `hours_worked`,
`average_rating`, `reliability_percent` and `pharmacies_worked_with` are computed
from `bookings` and `ratings`. The CV's credibility rests entirely on their being
underivable by hand, and a view cannot be written to.

`pharmacist_stats` runs with owner rights so a pharmacy can read a stranger's
record — that is the whole point of a reputation. What crosses that boundary is
only the aggregate; RLS still hides every underlying booking, counterparty and
rating comment.

**`profiles` is private to its owner.** It carries a phone number and a home
district. What a pharmacy sees about an applicant is `applicant_cards`, a narrow
projection with the Syndicate number masked to its last two characters — shown at
all because it is the one real accountability anchor in Iraqi pharmacy, and masked
because a full registry number held by every pharmacy that ever received an
application is a gift to an impersonator.

**A pharmacy's Arabic name is mandatory, and must be in Arabic.** Arabic is the
default and most pharmacists browse in it, so a Latin-only pharmacy name appeared
in Latin on every listing card, shift row and certificate — the one line that says
who you would be working for, in a script the reader may not read. Two rules,
because NOT NULL alone achieves nothing: the column is required, and a check
constraint requires it to contain Arabic characters, or a pharmacy pastes its
Latin name into both boxes and the reader is where they started. "Contains
Arabic", not "is entirely Arabic" — real names carry branch numbers and Latin
brands. The English name stays optional.

**Reliability has a definition, and cancelling early is not a failure.**
`reliability_percent` is completed ÷ accepted with adequately-notified
cancellations removed from both sides. Cancel 48 hours out and it costs nothing;
inside 2 hours it is treated as a no-show. Penalising honest early withdrawal
would push people to accept shifts they cannot work, which is worse for the
pharmacy. A pharmacist with no history reads as **"no record yet"**, not 100% — a
pharmacy weighing a stranger against a proven pharmacist has to be able to tell
those apart.

**The handoff record is load-bearing.** Five items, both parties confirming, no
withdrawal once given. The second confirmation is what completes a booking (a
trigger, so there is no other route), what increments the verified statistics, and
the evidence gate every incident report has to clear.

**No wallet, no balances.** Money flows pharmacy → platform merchant account →
pharmacist; the pharmacist-side 3% is only collectable if we disburse. There is no
balance column anywhere in the schema and a test asserts it. Acting as a payment
intermediary in Iraq likely requires operating under a licensed provider's
arrangement, which we do not have — so if something in
`src/lib/payments/provider.ts` starts to look like custody of customer funds, that
is the signal to get legal advice rather than to implement it.

**Incident tier 3 is off.** Tiers 1 and 2 work. Escalation to the Syndicate is
defined so the tiers read honestly, but is refused by a feature flag and stays
that way until we have written confirmation the Syndicate will accept reports
through this channel, and legal review of what we are entitled to send. Reporting
a stranger to their regulator through a route we have not confirmed exists is not
something to ship on an assumption.

### Localisation details that matter

- Arabic is the default and carries no URL prefix.
- **Western numerals in both languages** — 40,000, never ٤٠٬٠٠٠. ZainCash, Qi Card
  and every Iraqi digital interface use these; a price in Eastern Arabic numerals
  reads as a typo.
- **Levantine month names** — حزيران، تموز، آب، أيلول — not the Gulf
  transliterations `Intl` produces for `ar`.
- Sunday–Thursday is the working week; `days_present` is a five-day array.
- A name is rendered once, in the reader's language. Never a translated label plus
  a separate Arabic line.
- The CV's language is independent of the app's — a pharmacist may browse in
  Arabic while writing an English CV for a Gulf employer.

---

## What is built

Every screen in the navigation is a working screen. There are no placeholder
panels left.

| Area | State |
|---|---|
| Auth and verification | Three sign-up flows, document upload to private Storage, admin review queue with signed-URL document viewing |
| Marketplace | Listings (hourly, flat, overnight), browse and filter, applications, applicant cards, acceptance, bookings |
| Handoff and completion | Five-item checklist, dual confirmation, derived stats, ratings, cancellation with notice classification |
| Money | Fee engine with trial and floor, payout requests through the provider interface, per-booking transaction history |
| Student module | 12-week forward-fill logbook, monthly approval and return, certificate with PDF export |
| CV | Bilingual builder, skills split into clinical and non-clinical, verified half read from the record, PDF export, AI assistant |
| Notifications | Raised by database triggers, rendered in the reader's current language |
| Incidents | Tiers 1-2, evidence gate, right of reply, symmetric both ways |
| PWA | Manifest, generated icons, and a deliberately conservative service worker |
| Single-file build | `demo/saydali-plus_v*.html` — the same screens with stubbed data, in one openable file |
| CRM | `crm/saydali-crm_v*.html` — the operator's side: orders, users, pharmacies, companies, universities, the Syndicate roster, drugs |

**On the service worker.** It exists for installability and a civil offline
notice, not offline browsing. The obvious "cache pages for speed" worker would
be actively harmful here: a pharmacist shown a cached listing filled an hour ago
travels across Baghdad for a shift that no longer exists. So navigations are
network-first with an offline notice as the only fallback, and cache-first
applies solely to content-hashed build output. Authenticated responses are never
cached — a shared cache is how one person's data reaches another's screen.

### Running it against a real database

```bash
supabase start
supabase db reset      # applies migrations, then supabase/seed.sql
npm run dev
```

The seed's accounts all use the password `password123`. Since migration 0015
there is one kind of account for a pharmacist: owning a pharmacy and working on
a team are links, not account types, and both need the Syndicate badge.

| Account | Why it is there |
|---|---|
| `ahmed@example.com` | Verified pharmacist with a completed shift, so stats and the CV have something behind them |
| `noor@example.com` | **Pending** pharmacist who applied while unverified — the queued-application rule, visible; also invited to Al-Rahma's team, which she cannot accept until verified |
| `rahma@example.com` | Pharmacist who **owns** Al-Rahma, and works shifts on Layla's team at Al-Hayat |
| `layla@example.com` | Pharmacist who owns three pharmacies, with her own role "Branch lead" |
| `hassan@example.com` | On Al-Rahma's team: Pharmacist + Prices |
| `maryam@example.com` | On two of Layla's teams: Pharmacist at Al-Hayat, Manager at Al-Shifa |
| `alrahma.pharmacy@example.com` | The old Al-Rahma pharmacy *account* from before 0015, kept for the marketplace-era rows (open shifts, an overnight one, the fee floor) |
| `zainab@uobaghdad.edu.iq` | Student |
| `admin@saydali.example` | Platform reviewer, for the verification queue |

Karim, Zahraa, Omar, Duaa (left), Rusul and Ali fill the teams (`<name>@example.com`).

```bash
npm run test:e2e       # Playwright, against the seeded database
```

---

## What is still not built

- **Real payment integration.** The provider interface and a failing-capable
  mock exist and the payout flow runs through them end to end; ZainCash and Qi
  Card need signed merchant agreements before there is anything to integrate.
- **SMS/WhatsApp notifications.** In-app notifications work. Push will
  underperform SMS in this market, and SMS needs a gateway contract.
- **Incident tier 3.** Deliberately behind a feature flag — see above.
- **Distance on listing cards.** The prototype showed "2.1 km"; there is no
  geocoding, so cards show the district.
- **Public CV pages.** Out of scope for v1 by the brief; sharing is by PDF.

### Verified how

- 137 unit tests over the business rules (fees, chain pricing, barcodes and the catalogue, overnight hours, university
  email, logbook transitions, reliability, AI response parsing, Arabic script, who may do what at a pharmacy).
- 190 policy assertions run against a real Postgres as real users (`supabase/tests/run.sh`), 60 of them on
  owners, teams and roles (migration 0015).
- 861 behavioural assertions driving the app build in a real browser
  (`npm run check:app`), and 308 driving the CRM (`npm run check:crm`).
- `npm run typecheck` and `npm run build` clean.
- Playwright specs covering the Arabic default, the queued application, the
  document gate on verification, the handoff gate, and the overnight fee
  preview. **These need a running Supabase** — they were written against the
  schema and seed, not executed in the environment this was built in, where
  Docker Hub is blocked by egress policy. Run them before trusting them.

### Still open

- **A lawyer should review the handoff record.** With ownership and licence tied to
  one named pharmacist, responsibility for dispensing errors and stock
  discrepancies *during* a relief shift is genuinely unsettled in Iraqi law. The
  handoff is our current answer, and it has not been tested by anyone qualified to
  test it.
- **The Syndicate escalation channel** has to be confirmed before tier 3 can be
  enabled.
