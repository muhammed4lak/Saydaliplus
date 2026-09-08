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
npm test          # 67 unit tests — the business rules
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

### The demo

`demo/saydali-plus-demo.html` is a single self-contained file — open it in a
browser, no server and no build. It reproduces the screens, the design system
and the arithmetic so the product can be shown to a pharmacy or an investor
without standing anything up. Switch language, switch layout, switch role.

It is a demo, not the app: there is no database behind it, and therefore none
of the row-level security that is the actual security model. Two things in it
are real rather than mocked, because they are the things worth checking — the
fee engine is a port of `src/config/fees.ts` and the shift-hours function a
port of `src/lib/time.ts`, so the numbers it shows are the numbers the product
charges. Screens that are not built in the real app say so there too.

### Policy tests

RLS is the security boundary, so it is tested against a real database rather than
reasoned about:

```bash
./supabase/tests/run.sh    # needs psql pointed at any Postgres 15+
```

That rebuilds a throwaway database from the migrations and runs **118
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
| CV | Bilingual builder, preset pickers, verified half read from the record, PDF export, AI assistant |
| Notifications | Raised by database triggers, rendered in the reader's current language |
| Incidents | Tiers 1-2, evidence gate, right of reply, symmetric both ways |

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

- 75 unit tests over the business rules (fees, overnight hours, university
  email, logbook transitions, reliability, AI response parsing).
- 121 policy assertions run against a real Postgres as real users.
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
- **Whether a `pharmacy_details.pharmacy_name_ar` should be mandatory.** Right now
  a pharmacy can register with an English name only, and Arabic-browsing
  pharmacists then see it in Latin script.
- **How the minimum fee floor should split.** It currently splits 70/30 like any
  other commission, so on a 20,000 IQD shift the pharmacist pays 750 rather than
  600 — a 25% increase in their fee, on the shortest and lowest-paid shifts. That
  sits awkwardly against the principle of not depressing earnings further; the
  alternative is to put the floor's excess entirely on the pharmacy. A pricing
  call, not a technical one. Noted in `src/config/fees.ts`.
