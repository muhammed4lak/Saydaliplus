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
npm test          # 85 unit tests — the business rules
npm run typecheck
npm run build
```

### Database

Migrations are plain SQL in `supabase/migrations`, applied in filename order.
With the Supabase CLI:

```bash
supabase db reset
npm run db:types   # regenerate src/lib/supabase/database.types.ts from the schema
```

### The single-file app

`demo/saydali-plus.html` is the whole front end in one file — open it in a
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

`crm/saydali-crm.html` is the other half of the same product, also one openable
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

Eight tabs: a home dashboard and seven modules.

| Module | What it holds |
|---|---|
| **Orders** | The main one. Every shift and every placement, segmented by order type — pharmacist shift, student training — with the status lifecycle from posted to completed. Still marked in-progress on the screen itself. |
| **Users** | Every account, segmented by the platform's three types: pharmacist, pharmacy, student. |
| **Pharmacies** | The business behind a pharmacy account — licence, district, trial clock, fill rate. |
| **Companies** | Manufacturers, marketing companies, importers and distributors. |
| **Universities** | Colleges of pharmacy, and the email domain that makes student verification automatic. |
| **Syndicate roster** | Pharmacist names and numbers as the Syndicate supplies them, with the match against platform accounts. |
| **Drugs** | Scientific name as the identifier; brands under it, each owned by a company and able to override the doses. |

Three things in it are worth reading the code for.

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

```bash
npm run check:crm     # drives it in a real browser
```

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

## Decisions worth knowing before you read the code

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
| Single-file build | `demo/saydali-plus.html` — the same screens with stubbed data, in one openable file |
| CRM | `crm/saydali-crm.html` — the operator's side: orders, users, pharmacies, companies, universities, the Syndicate roster, drugs |

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

The seed gives you five accounts, all with password `password123`:

| Account | Why it is there |
|---|---|
| `ahmed@example.com` | Verified pharmacist with a completed shift, so stats and the CV have something behind them |
| `noor@example.com` | **Pending** pharmacist who applied while unverified — the queued-application rule, visible |
| `rahma@example.com` | Verified pharmacy with open shifts, an overnight one, and one that hits the fee floor |
| `zainab@uobaghdad.edu.iq` | Student |
| `admin@saydali.example` | Platform reviewer, for the verification queue |

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

- 85 unit tests over the business rules (fees, overnight hours, university
  email, logbook transitions, reliability, AI response parsing, Arabic script).
- 130 policy assertions run against a real Postgres as real users.
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
