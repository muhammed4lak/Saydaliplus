# Backlog

Split five ways because they are read at different times:

- **Direction** — what was decided, and the version plan it produces. Read
  first; everything else is now in its service.
- **Work** — things to build. Each says where the code stands, what it should
  become, and what needs deciding first.
- **Strategy** — revenue routes and features that follow from them. Not work
  until one is chosen.
- **Principles** — decisions to settle before the relevant build, not after.
- **Context** — findings worth not re-deriving.

IDs are stable. Reordering does not renumber anything.

**The direction changed on 20 Sep 2026** — owner-first, with a point-of-sale
system and a staff-management system ahead of the marketplace. Part 0 records the
decision and the version plan; W17–W21, P6–P9 and C6 are new with it.

**Shipped so far**: W1–W5 in v0.0003; W8's code in v0.0004; W12a, W12b, W12d in
v0.0005; W14 steps 1–3 and 5 in v0.0006; W10 (in part), W12c, W12e (in part),
W13, W14 step 4 and W15 in v0.0007; W6d, W7 and W11 in v0.0008; **the switch and the
catalogue layer of W17 in v0.0009; W7 rebuilt as owners of several pharmacies
in v0.0010; **partners closed, announcements, and adding a pharmacy in v0.0011**. Nothing is
deleted when it ships, because what each entry says about *why* is the part worth
not re-deriving; each opens with a **Built** line saying what landed and what was
decided along the way.

**W11 was reported as shipped in v0.0007 and was not** — the string was never
changed. It shipped in v0.0008, and the check now asserts the name in both
languages so the claim cannot be made again without the file backing it.

**Not built on purpose:** W6b and W6c, which are groundwork for S7 and cannot
take a shape until S7 is chosen.

**Open but not buildable without a decision:** W8's legal and consent questions,
W9 (the app's name — nothing chosen), the human half of W14 step 4 (who calls, on
which day, and what suspension stops), the rep channel in W10 (gated on P1),
W7's three leftovers (the discount ladder, whether a chain manager must be a
pharmacist, and what a manager may see of W8's tallies), and W16 (which needs a
yes or no on a pharmacist-side subscription before half its table is real).

Parts 2–4 are not untouched either: S8 is largely built, and S4, S5, S6 and P1
each carry what the dispensing log changed about them. Read W8 before any of
those four.

---

# Part 0 — Direction and roadmap

*Recorded 25 Sep 2026, from the business meeting. This part is read first: it
says what the rest of the file is now in service of.*

## The decision

**Owner-first.** The product is sold to pharmacy owners first, because they are
the side with a budget and the side that is scarce. Pharmacists follow once
there is an installed base of pharmacies behind them.

**Two systems, not three:**

- **System 1 — the till.** Point of sale, inventory and purchasing as one build,
  with the Dispensing Helper running inside the cart. It sells on its own:
  existing pharmacy systems are dated, and a pharmacy with no staff gets full
  value from it. One database behind a phone app and a web page, so a pharmacy
  with no laptop scans with its phone and prints to a Bluetooth receipt printer.
  **W17.**
- **System 2 — the pharmacy's people.** Check-in/check-out, tasks and
  performance, for the owner who is not always in the building. Seen working at
  Salim. Worth nothing to a one-person pharmacy and a great deal to a ten-person
  one, and priced accordingly. **W18.**

**The sequence after that:**

1. The installed base grows, district by district.
2. The pharmacist side opens with three things only: check-in/out, tasks, and
   the CV.
3. The Syndicate is offered an accredited assessment that sorts pharmacists into
   specialty categories. **W20.**
4. Pharmacies are given subsidised shift credits — the Trojan horse — and the
   marketplace switches on in districts dense enough to match. **W21.**
5. Jobs, company listings, pharma advertising on the owner's app, and area-level
   (never pharmacy-level) consumption data for companies. **P6, W15, P1.**

**Not re-litigated here.** An earlier analysis argued for shipping the
marketplace first. That argument lost at the meeting and is not repeated; its
useful parts (catalogue risk, capacity, the clinical curator) are carried into
the entries below as conditions rather than objections.

### What this changes about what is already built

- **The marketplace stays in the code, dark.** Listings, handoff, fees, chains,
  partner accounts, invoices: all kept, behind a flag, and still checked by the
  suites every build. Nothing is deleted. It is the product for step 4.
- **The Helper moves into the till.** The standalone tab stays for a pharmacist
  without a till; inside a till the basket *is* the cart.
- **W8's tallies become a derived view of sales** wherever a till exists. The
  separate "record this" step disappears there.
- **W14's ledger, invoices and dunning ladder carry the new subscriptions.** The
  Basic 9,000 / Premium 19,000 plans were priced for shift posting and need
  re-scoping once the price of the two systems is set.
- **W8's privacy-by-shape decision is revised, for the till only** — see P8.
- **W9 (the name) is more urgent, not less.** The buyer is now the pharmacy.
- **F8** (three customers with diverging interests) is **parked** by decision,
  to be picked up before step 5.

## Two tracks

**The spec track** is the prototype: `App_v…` and `CRM_v…`, one file each, no
backend. Each version below is one step. It is cheap, it is fast, and it is what
gets put in front of pharmacy owners, pharmacists and the team.

**The production track** is the Next.js + Supabase build. It does **not** start
on System 1 until three gates are passed, because each is the kind of mistake
that costs a rewrite rather than a fix:

1. **The offline model is decided** — movements, not levels (W17).
2. **The catalogue go/no-go is answered** — ten hours on a hundred real SKUs
   (W17), not a year of mapping on faith.
3. **The clinical curator is named** (W19).

System 2 carries none of those risks and can start in production as soon as its
spec versions are settled.

**The production track, in order** (added 25 Sep 2026, so that what the
backlog records is also scheduled):

1. **The ownership migration** (W1, W7). The real schema still makes each
   pharmacy its own login. It needs a `pharmacies` table of its own, an
   ownership table between pharmacists and pharmacies, RLS rewritten around
   the owner, and adding a pharmacy (v0.0011) with its review. **First**,
   because both systems key everything on the pharmacy, and it gates
   onboarding any owner who holds more than one — or who adds one.
2. **System 2** — attendance, then permissions and the shift timeline, then
   tasks — once v0.0017, v0.0015 and v0.0019 have been in front of owners.
3. **System 1** — the till, stock, cash and offline, clinical governance —
   once the three gates above are passed.

## The versions

| Version | Theme | Entries |
| --- | --- | --- |
| **v0.0009** | The switch, and the catalogue underneath the till | flags; W17 catalogue |
| **v0.0010** | Owners of more than one pharmacy — no chains, no manager | W7 revised |
| **v0.0011** | Review fixes: partners closed, announcements, adding a pharmacy | W15, W7 |
| **v0.0012** | The till | W17 sell |
| **v0.0013** | Stock and purchasing | W17 inventory |
| **v0.0014** | Cash, and the offline model | W17 cash, offline |
| **v0.0015** | Permissions, and what was done on each shift | W23 |
| **v0.0016** | Clinical governance | W19; P8; W17 helper tiers |
| **v0.0017** | Attendance, and the owner's Reports | W18 roster, check-in/out; performance (moved from v0.0019, 28 Sep 2026) |
| **v0.0018** | The near-expiry exchange | W22 |
| **v0.0019** | Tasks, incidents in a pharmacy, and the absent owner's day | W18; P7 |
| **v0.0020** | Paying for it | pricing — *blocked on a decision* |
| later | Assessment, then shift credits, then the ecosystem | W20, W21, P6 |

System 1 is complete at v0.0016, System 2 at v0.0019. Fixes to a built
version are numbered `.1`, `.2` after it and listed under "Amendments" below;
they never renumber this table. Versions were inserted
twice on 25 Sep 2026 — v0.0010 for the W7 correction and v0.0011 for the
review fixes — and W22 and W23 were given v0.0018 and v0.0015, so the numbers
below are the current ones. The till was built as v0.0012; stock and
purchasing are next.

**v0.0009 — the switch, and the catalogue.** **Built** (25 Sep 2026) — see
"v0.0009 as built" below.
A feature flag per surface, with the marketplace off by default and switchable
per district later (W21 needs exactly that). The pharmacist's bar becomes
Check-in · Tasks · Drugs · CV · Profile, with Tasks and Check-in as honest
"coming in this build series" placeholders until v0.0017. The product layer
beneath the existing molecule layer: barcode, AR/EN name, form, strength, pack,
price, molecule links, and a **mapping confidence** (verified / auto-mapped /
unmapped). A **Catalogue** module in the CRM with the mapping queue: an unknown
barcode scanned anywhere becomes a task there.
*The check asserts:* the marketplace is unreachable with the flag off and fully
green with it on; every product either maps to molecules or says it does not.

### v0.0009 as built

- **The switch.** `FLAGS` with `marketplace` off and `placements` on by default;
  one gate, `screenAllowed()`, asked by navigation, the sidebar, Profile's
  links, `goto()` and `render()`, so a dark screen is unreachable rather than
  unlinked. Relief shifts, jobs, paid placements and incidents (which need a
  booking) are dark. Switchable from the sign-in page, remembered per browser,
  and from the page address (`#flags=marketplace`). Per-district switching is
  still W21's.
- **Dark homes.** Pharmacist: Check-in · Tasks · Drugs · CV · Profile, with
  check-in and tasks as labelled placeholders. Owner: Home · Products ·
  Trainees · Drugs · Profile, the home prompting about the coming till, the
  catalogue and the trainee. Manager: the board leads with branches that have
  no responsible pharmacist; shift badges and posting are gone.
- **The catalogue.** `data/products.mjs` (59 fixture products, fictional valid
  EAN-13s), validated and embedded into both builds; `src/lib/barcode.ts` with
  unit tests; a Products screen that searches in both scripts, takes a wedge
  scanner's digits-then-Enter, refuses a misread, and sends an unknown barcode
  for mapping without blocking the sale. Every product states how much of it
  the Helper can check, never in green.
- **The CRM Catalogue module**, with the mapping queue ordered by how many
  pharmacies scanned a barcode, a mapping dialog that saves **auto-matched and
  never verified**, and reports R20–R21.
- **Checks.** The whole marketplace suite now runs with the switch on and
  still passes; a new block proves the dark build and the catalogue. Three
  mutations were run to prove the key assertions fail when their rule is
  broken.

### Decisions for the till — answered 25 Sep 2026

The answers, then the questions as they were asked.

1. **Price: each pharmacy sets its own.** The reference is the **average market
   price** — derived from what pharmacies actually charge, never typed in.
2. **Receipt:** pharmacy name, licence number, date, items and total; **default
   instructions per drug**, which the dispensing pharmacist can override; the
   **dispensing pharmacist's name**; and a **logo** at the top, uploaded by the
   owner from their own view.
3. **Tenders: cash, ZainCash and Qi Card** — all three recorded, none processed
   by the platform.
4. **Partner accounts: still open** — see below.
5. **Placements stay on.**

The questions as they were asked:

1. **Whose price does the till sell at?** The catalogue carries a reference
   price. Either every pharmacy sells at it, or each pharmacy sets its own
   selling price with the reference as the default. The till writes the price
   onto the sale line either way; this decides where that price comes from.
2. **What must the receipt carry?** Pharmacy name and licence number, date,
   items, total — and anything else required in practice (a tax line, a
   pharmacist's name for prescription items). Worth one question to an
   accountant or to how Salim's receipts are laid out.
3. **Tenders at the till.** Cash only for now, or cash plus ZainCash / Qi Card
   *recorded* as the way a customer paid (not processed by us)? Recommended:
   cash plus recorded tenders, because the drawer count in v0.0014 needs to
   know which takings are not in the drawer.
4. **Partner accounts while the marketplace is dark.** A partner can still sign
   in and submit listings nobody will see until step 5. Keep collecting them
   as drafts, or close partner sign-in until then?
5. **Confirm placements stay on.** Students and trainees were not part of the
   meeting's decision, so the switch was left on.

**Also before the production till, not before v0.0012:** during the catalogue
go/no-go, note which barcode types real packs carry — EAN-13 is all this build
reads; EAN-8, UPC-A and 2D codes on some imports would each need handling.

**Known and left alone on purpose:** the owner's Billing screen still shows the
shift-era plans and charges (v0.0020, blocked on price), and a pharmacist's
Profile still shows the relief-shift record (replaced by attendance in
v0.0017).

### v0.0010 as built — owners of more than one pharmacy

A correction to W7, not the till. Iraq has no pharmacy chains, but some
pharmacists own several pharmacies. So the group, the chain and the manager
role are gone, and an owner's ownership link is a **list**: Rahma owns one
pharmacy, Layla owns three. An owner of several sees an **All** tab and one tab
per pharmacy; an owner of one sees no tabs. Billing follows the owner: priced
per pharmacy, the shift allowance shared across them, one invoice. See W7.

It went before the till because the till's first decision — each pharmacy
sets its own price — needs the pharmacy on screen to be unambiguous.

### v0.0011 as built — review fixes

- **Partners are closed.** A switch of their own, off: partner accounts are
  not offered on the sign-in page, a partner who signs in is told plainly that
  company accounts open later, and no paid placement shows anywhere.
- **Announcements from day one.** The banner slots stay, carrying the
  platform's own announcements, labelled as from Saydali+ rather than as paid,
  on every role's home screen and — like any placement — never on a clinical
  one. The CRM's Listings module holds them as a third kind, written by a named
  person on the team.
- **Nothing about shifts while there are none.** The owner's "take shifts as a
  pharmacist" switch is hidden with the marketplace off, and the sign-up cards
  describe what an account gets now rather than relief shifts.
- **Adding a pharmacy.** From the owner's profile (or the + at the end of an
  owner of several's tabs), and from a pharmacist's profile, which is how a
  pharmacist becomes an owner. The form asks for what verification needs; the
  pharmacy joins the owner's tabs at once, marked as under review; it goes to
  the same human admin queue as every account; it is not billed until
  verified; and a refused one leaves the tabs but stays on the profile, marked.
  A licence already registered elsewhere is refused.

### Before v0.0012 — answered 25 Sep 2026

1. **Default instructions are usage, never dose.** A default says how to take
   it; the dispensing pharmacist always types the dose.
2. **Receipt language: Arabic by default**, switched to English by the
   pharmacist with a single press, per receipt.
3. **The average market price** is shown in the owner's view and to staff the
   owner has given that permission (W23), and only for a product at least five
   pharmacies price (P6).
4. **Partners are hidden**, and banners are there from the start for the
   platform's announcements.

### Before v0.0012 — the last two, answered 25 Sep 2026

1. **No rounding.** The total is the exact sum of what was sold, in either
   direction. (Asked as: hold prices to multiples of 250 IQD, or round the
   total for cash and record the difference?) The average market price, used
   as a default price, is still shown to the nearest 250 because it becomes a
   price somebody charges; a sale's total never is.
2. **Discounts are the owner's alone** until permissions arrive (v0.0015), and
   every discount is on the record with its reason.

### v0.0012 as built — the till

- **Where it lives.** On the owner's bar in the trainee's slot (the trainee
  stays one tap away from the dashboard's card), and in the sidebar's pharmacy
  group. It is not a marketplace screen, so it is there with everything off.
  An employed pharmacist has no till yet: selling is granted by the owner, and
  grants are v0.0017.
- **Which pharmacy.** The till belongs to the pharmacy on screen. An owner of
  several on All is asked which; picking one opens that pharmacy's till, not
  its dashboard. A pharmacy under review cannot sell, and nor can one with no
  responsible pharmacist — the second is the law, not caution. Switching
  pharmacy with a cart open sets the cart aside, and that is recorded.
- **Prices.** Each pharmacy's own, set on the product screen or at the till.
  With none set, the product sells at the **average market price** — derived,
  never typed — and with neither, the till does not guess: the owner prices it
  there and then. The average is shown to the owner only, and only from five
  pharmacies up; below that the screen says why there is none. A pharmacist
  sees no price on the catalogue. Every price change is logged with what it
  was before, and the price is **written onto the sale line**: the check
  changes a price after a sale and proves the sale did not move.
- **Scanning.** A wedge scanner or the keyboard (digits then Enter), a name
  search, and the phone camera **where the browser has a barcode detector** —
  where it has none the button is not offered rather than offered broken. A
  misread (bad check digit) is refused; an unknown valid barcode can still be
  sold by name and price, is marked *not checked*, and goes to the mapping
  queue. The same barcode twice is one line, quantity two.
- **The Helper on the basket.** One consolidated check as the cart fills —
  interactions and duplicate therapy across every line — with coverage first,
  in one sentence: *"3 of 4 medicines checked · 1 not checked · 1 not a
  medicine"*, and each unchecked or part-checked line marked on the cart
  itself. Two tiers render, by severity: **Warn** (serious, critical) on the
  basket with a one-tap *Acknowledge*, and **Note** (the rest) folded away. The
  Stop tier is empty (P9). Nothing is ever blocked: a sale with an
  unacknowledged warning completes, and the sale records every finding and
  whether it was acknowledged — the raw material for v0.0016's override report.
  Questions for the patient (contraindications) are folded under the findings.
- **Money.** The total is the exact sum. Cash needs an amount received at
  least the total and shows the exact change; ZainCash and Qi Card take an
  optional reference and say on screen that only the method is recorded —
  nothing passes through the platform. Discounts: owner only, amount no larger
  than the basket, reason required, logged. Removing a line is a **void**, and
  every void is logged. Refunds of a completed sale: owner only, reason
  required, logged; the sale stays in the list marked refunded.
- **The receipt.** Drawn as a bitmap 384 dots wide (a 58 mm printer at
  203 dpi), so Arabic is shaped and joined. At the top the owner's **logo**
  (uploaded per pharmacy from the owner's profile, printed in greyscale, 300 KB
  at most); then pharmacy name, licence number, date and time, sale number,
  each item with quantity × unit price, and under each medicine its **dose**
  (typed by the pharmacist, never filled in) and **how to use it** (a default
  by dosage form, editable per line); discount, total, tender, change, and the
  **dispensing pharmacist's name**. **Arabic by default; one press for
  English.** Printing waits for the certified printers; the preview is exactly
  the bitmap that will be sent.
- **No banner anywhere on it** (P1): the till never asks for one, and the
  check proves the slot that is on the dashboard is absent here.
- **The record every later version reads.** `S.tillLog` holds sales, voids,
  discounts, refunds, price changes, logo uploads and carts set aside, each
  with who, where and when. v0.0014's audit trail and v0.0015's shift timeline
  are views of it.

**Known limits of the prototype** (not decisions — each is a later version's
work): sales, prices and the log live in memory and are gone on reload; the
logo is remembered on the device only; the market prices are a fixed fixture,
where production computes them from real sales; the default instructions are
placeholders by dosage form until the curator writes them (W19); the camera
scan works on Android's Chrome but not on an iPhone, whose browser has no
barcode detector — a scanning library fixes that in production; and a refund
does not return anything to stock, because there is no stock until v0.0013.

### Before v0.0013 — answered 26 Sep 2026

1. **S1 — selling what the system thinks is out of stock: allowed.** Stock
   goes negative and the product goes on the owner's "count this" list. The
   till never refuses a sale because the software is behind the shelf.
2. **S2 — opening stock: both.** **Count mode is the default**; a
   **spreadsheet import** is the second way in. The import has a **review and
   confirm step** before anything is added. **Undo works on the whole thing**:
   a whole import, or a whole count session, can be taken back in one press,
   because a wrong file or a wrong shelf is added all at once. Undo is itself a
   set of movements (the ledger is append-only — nothing is deleted), and
   every import, count, confirm and undo is **logged for the owner**, and shows
   on the owner's timeline (W23).
3. **S3 — cost and bonus units: record both.** Each batch carries what it
   cost (owner-only), and distributor bonus units (*بونص*, 10 + 1) are received
   at zero cost.
4. **S4 — suppliers: owners can add their own**, and adding one is how the
   supplier database grows:
   - As the owner types, the app **suggests matching suppliers from the CRM**
     by relevance, forgiving the ways one name gets written — *مذخر / مخزن /
     مستودع*, *ال*, *ة / ه*, *ى / ي*, spacing, English or Arabic ("Al-Shifa
     storage house" = "مذخر الشفاء").
   - If one is the same, the owner **confirms** it and is linked. If none is,
     the supplier is added, private to that pharmacy, and lands in the CRM
     queue — grouped, so "three pharmacies added *Al-Shifa storage*" is one
     task, not three.
   - When the CRM team adds or links the record, the owner is **asked**, not
     told: "Is *Al-Shifa storage* the same as *Al-Shifa Drug Store (Karrada)*?"
     Nothing is ever linked without the owner confirming it.
5. **S5 — refunds: the pharmacist chooses, with *back to stock* pre-selected.**
   Two options are shown — back to sellable stock, or quarantine — and one
   tap confirms the default.

### Making the switch-over easy — ideas, 26 Sep 2026

Raised after the team's meeting on onboarding: the move from paper or a
competitor to this till has to be as simple and smooth as possible. These are
ideas to choose from, not decisions (T = transition):

- **T1. Sell from day one; count later.** Because of S1 the till works with no
  stock entered at all. Every product sold before it has been counted joins
  the "count this" list, most-sold first — so the first thing counted is what
  moves, and the long tail can wait.
- **T2. Count a shelf at a time.** A count session is one shelf or section,
  paused and resumed at will, with a progress figure ("63 % of your shelf is
  counted"). Two or three phones can count different shelves at once and it
  all lands in the same stock.
- **T3. Fast counting.** Scan with keep-scanning on: each scan adds one, a long
  press types a quantity. Expiry entered as **month and year only** (medicines
  are dated to the month), with "same as the last box" one tap away.
- **T4. The distributor's invoices as the source.** Most stock arrives on an
  invoice, and distributors here often send Excel. Importing the last two or
  three months of invoices gives a first figure for most of the shelf, with
  batches and expiry already on it — and it is the same path purchasing will
  use every week after.
- **T5. A spreadsheet that reads itself.** Our template for anyone starting
  fresh; for anyone else, the import recognises the barcode, name, quantity,
  expiry and cost columns itself, whatever they are called, in either
  language. Rows are matched to the catalogue by barcode, then by name with a
  confidence; the review step shows *matched*, *probably matched — check*,
  *not found*, *duplicates* and *errors* before anything is confirmed.
- **T6. Someone from the team does it with them.** For the first pharmacies,
  a person from the team spends a morning at the counter and does the count
  with them. It costs the team's time and teaches the team exactly where the
  count is slow, which is worth more than anything in this list.
- **T7. Run both for two weeks.** Keep the old system or notebook alongside
  for a fortnight, with a daily "the two disagree on these five products"
  prompt, then switch off the old one.
- **T8. "Expiry unknown", for the opening count only.** Let a box be counted
  without its expiry, marked *check expiry*, so the count does not stall on a
  date nobody can read. **In tension with W17** (expired stock is never
  available stock): such boxes would count as available until checked. Only
  with a decision.

### Before v0.0013 — answered 26 Sep 2026 (the switch-over)

**Two ways in: scanning (the default) and a spreadsheet.**

1. **Scanning — count mode, the default.**
   - **Shelf by shelf (T2).** The app cannot know where anything sits, so the
     pharmacist says so: a count session starts by naming the shelf or
     section — typed once ("Shelf 3 — painkillers") or picked from the
     pharmacy's own list of shelves, which it builds as it goes. Optionally a
     printed shelf label (a QR code) is scanned to start that shelf's session.
     **Every box counted is linked to its shelf**, so the product remembers
     where it lives — which later answers "where is it?" for a new employee.
     Several phones can count different shelves at once.
   - **Progress is a count, never a percentage**: "13 drugs counted", per
     shelf and in total. The app cannot know how many boxes a shelf holds.
   - **Fast counting (T3).** Keep-scanning on: each scan adds one, a long
     press types a quantity, expiry as month and year with "same as the last
     box" one tap away.
2. **The spreadsheet import (T5) — a placeholder reader now**, for **CSV and
   Excel (.xlsx)**. It finds the barcode, name, quantity, expiry and cost
   columns by what they contain, in either language, and goes through the
   review-and-confirm step and the one-press undo. Karmasoft-specific
   recognition follows once a sample export is seen. The older Excel format
   (**.xls**) is not read by the placeholder; such a file is met with "save it
   as .xlsx or CSV and try again" rather than a failure.
3. **Save and continue later.** A count session or an import under review can
   be **saved and resumed where it was left** — the shelf, the boxes counted
   so far, the rows already checked. Nothing saved is in stock until it is
   confirmed. (In the prototype a saved session lives on the device; in
   production it follows the owner to any of their devices.)
4. **Undo (Q3):** a whole import or count can be undone **until the end of
   the next day**, and never after a later count of the same products; after
   that, a correction is an ordinary adjustment with a reason.
5. **History (Q4):** v0.0013 shows each product's **stock history** and a list
   of **imports and counts, each with its undo button**. The owner's full
   timeline follows in v0.0017.

S1 stands: a sale is never refused because the system thinks a product is out
of stock — it goes negative and joins **Count this**. What was dropped is T1,
the "sell first, count later" way of starting (see "Unused concepts").

T4 (distributors' invoices) arrives with purchasing; T6, T7 are the team's
call; T8 is out.

**Leftovers that are yours, not the code's:** **a Karmasoft export** — one
real file, names and prices anonymised if you like, or even a screenshot of
its columns — so the import can recognise it by name; the certified printer and
scanner (non-code item 3) before this receipt is shown to a customer; the
curator (W19) for the real default instructions; and, before production
computes an average market price from real sales, a line in the pharmacy's
terms saying their prices feed an anonymous average of at least five.

### Before v0.0012 — decisions as they were first asked

1. **Default instructions: usage, or dose?** Recommended: a default says how to
   take the medicine (*"after food"*, *"shake well"*, *"swallow whole"*), and the
   **dose is always typed by the pharmacist**. A default dose is wrong for most
   patients, and printed on a receipt it carries an authority it should not.
   Who writes the defaults is the curator's call (W19); until one is named the
   prototype uses plain usage lines, clearly marked as placeholders.
2. **Receipt language.** Arabic by default with English on request, per receipt?
3. **The average market price, shown to whom?** Showing a pharmacy what others
   charge is useful and sensitive: it needs P6's floor — no average from fewer
   than five pharmacies — or it tells one pharmacy another's price.
4. **Partner accounts** (still open): see the recommendation in chat, recorded
   under W15.

**v0.0012 — the till.** **Built** (25 Sep 2026) — see "v0.0012 as built" below.
Scan (camera, wedge scanner, or typed), cart, quantities, cash with change due,
receipt preview rendered as an image, void and refund with a reason. The price is
written **onto the sale line** at the moment of sale. The Helper checks the
basket as one consolidated check, not per item, and states coverage per basket:
"3 of 4 items checked; 1 not in the reference." Tiers render as Note and Warn;
the Stop list ships **empty** (P9). Phone and desktop layouts, both directions.
As decided on 25 Sep 2026: **each pharmacy's own price**, with the average
market price beside it as the reference; tenders **cash, ZainCash and Qi Card**,
recorded not processed; and a receipt carrying the owner's **logo** (uploaded
from the owner's view), pharmacy name, licence number, date, items with their
**instructions** (defaults the dispensing pharmacist can override), total, and
the **dispensing pharmacist's name**. For an owner of several, the till belongs
to the pharmacy tab on screen. The receipt is **Arabic by default**, switched to
English with one press; default instructions say how to take the medicine and
never the dose; the average market price is shown only in the owner's view and
to permitted staff, and only from five pharmacies up.
*The check asserts:* a price change never alters a past sale; an unmapped item is
announced rather than silently passed; nothing in the cart can open a banner.

**v0.0013 — stock and purchasing.** **Built** (26 Sep 2026) — see "v0.0013 as built" below.
Stock as a **ledger of movements** — sale, receipt, adjustment, return, expiry
write-off — with levels always derived, never stored. Purchase orders from
suppliers, who are already Externals (distributors and storage houses, W4):
draft → sent → received, with partial receipt. Batches and expiry dates;
near-expiry and low-stock prompts on the owner's home. **Expired stock is never
available stock** (W17): an expired batch is quarantined, not sellable, and
leaves stock only by a write-off with a reason. The controlled-substance
register falls out of dispensing as a derived view of movements for controlled
items, not a separate log.
*The check asserts:* no stock level is ever written directly; the register
reconciles to movements exactly.

### v0.0013 as built — stock and purchasing

- **A ledger of movements.** Count, import, receipt, bonus, sale, refund,
  write-off, settle, undo — each appended by one function, `addMovement()`, and
  never edited. Every level on every screen is summed from them. The check
  reads the page's own source to prove there is one writer and no stored level.
- **Batches.** Each has a product, an expiry (month and year), and the shelf
  it was counted on. An expired batch is counted but never available — it is
  in quarantine — and leaves only by a **write-off with a reason** (destroyed,
  returned to the supplier, other).
- **The till** sells **first-expiring first**, never from an expired batch.
  Past what is recorded the sale still completes (S1) and the shortfall lands
  on the product's *sold before it was counted* line, below zero, and on
  **Count this**. A line whose recorded stock is only expired says *check the
  date on the box*.
- **Refunds (S5):** *back to stock* is pre-selected — each unit returns to the
  batch it left; *set aside* puts it in quarantine.
- **Counting (T2, T3).** Name the shelf (typed, or picked from the pharmacy's
  list, which grows). Each scan adds a box; the quantity can be typed; expiry
  as MM/YY, *same as the last box* one tap away, *a box with another date* for
  a second line. The camera works here too, with keep-scanning. A count is the
  truth about **one shelf**: what is recorded there and not found now leaves
  it — and while counting, the screen lists **what is recorded on this shelf
  and not counted yet**, so nothing leaves by surprise. A count settles the
  product's sales made before it. Every counted product is **linked to its
  shelf** ("Where: Shelf 1 — painkillers · Shelf 2" on the product).
- **Progress is a count, never a percentage:** "13 drugs counted", per shelf
  with its boxes.
- **The import (T5):** CSV and .xlsx, read in the page (no library) — the
  .xlsx unzipped with the browser's own decompressor, the first sheet found
  through the workbook's relationships, shared and inline strings, Excel date
  serials. Columns found by heading (Arabic or English) and by content, and
  re-pointable. Five piles — matched, probably matched (answered yes or no
  before it can be confirmed), not found (one with a real barcode can come in
  by its name, and goes for mapping), duplicates (merged), errors (no
  quantity, no readable expiry). An expired row goes straight to quarantine;
  a product already in stock is flagged. Nothing is in stock until confirmed.
  Old .xls is met with "save it as .xlsx or CSV". Our CSV template downloads.
- **Save and continue later** for counts and imports — kept on the device
  (`localStorage`) across closing the app; a count open when switching
  pharmacy is saved, to continue there.
- **Undo (Q3):** a whole count or import, in one press, as reversing
  movements; until the end of the next day, and never once a later count or
  import has touched the same products (undoing the later one frees the
  earlier). The screen says why when there is no undo.
- **History (Q4):** per product, its movements (who, when, which operation);
  on the Stock screen, every count and import with its undo button or the
  reason there is none.
- **Purchase orders:** draft → sent → partly received → received, or closed
  with the rest not coming. Lines carry quantity, **bonus** and unit cost.
  Receiving writes a batch per line with its expiry and cost; bonus units
  arrive **at zero cost**, lowering the batch's average cost (S3). The order
  text copies for WhatsApp; nothing passes through the platform. With costs
  recorded, the owner sees stock value at cost.
- **Suppliers (S4):** suggestions from the CRM's distributors and storage
  houses as the owner types, forgiving مذخر / مخزن / مستودع, ال, ة/ه, ى/ي and
  Arabic or English; *this one* links; *none of these* adds it privately and
  queues it for the team. When the team proposes a link, the owner is asked
  "Is *مخزن الشفاء* the same as *Al-Shifa Drug Store*?" — only a yes links it.
  The CRM gained **Al-Shifa Drug Store** (CO8), a *Named by pharmacies* view,
  the pharmacies that named a record on the record itself, and report **R22**
  — one row per supplier however many ways it was written, with how many
  owners confirmed. The CRM has no way to confirm on an owner's behalf.
- **The controlled register** is the ledger filtered to controlled
  substances, with a running balance — so it reconciles to the movements
  exactly, which the check proves. Controlled is a new flag in the drug
  reference: tramadol, diazepam, alprazolam, phenobarbital and pregabalin,
  placeholder until the curator and the Ministry's schedule confirm it.
- **Prompts** on the owner's home and the Stock screen, only when non-zero:
  count this, expired in quarantine, expiring within 90 days, below the
  minimum the owner set on a product, returns set aside.
- **Logged** for the owner: counts started, saved, confirmed, undone; imports
  started, saved, confirmed, undone, discarded; orders created, sent, received,
  closed; write-offs; minimum levels; suppliers added, linked, refused.
- **Owner-only**, per pharmacy; an owner of several picks the pharmacy first.
- **Demo data:** Al-Rahma starts with one shelf counted three days ago (past
  its undo window), including an expired batch, one expiring within 90 days
  and a controlled substance; two suppliers, one of them awaiting the owner's
  confirmation.

**Known limits of the prototype:** stock lives in memory (only saved drafts
survive a reload); the CRM's proposals are a fixture, since the prototype has
no shared backend; *(v0.0014: shelf labels are printed, and a correction can
be made with the adjustment form as well as by recounting the shelf)*; counted stock carries no cost, so
stock value covers what came in with a cost (imports and receipts); the undo
window follows the device's clock.

### Before v0.0014 — answered 26 Sep 2026

1. **One session per drawer**, every sale tagged with who made it; the
   per-person figure comes from the tags.
2. **The opening float is counted**, blind, like the close.
3. **A note for every variance; the owner signs off above an amount they
   set** (e.g. 5,000 IQD).
4. **Offline: warn at 24 hours and on every sale after 72; never block.**
5. *(Open — see below.)*
6. **An adjustment form in v0.0014**, a correction with a reason, on the same
   audit trail.

### Before v0.0014 — D5 answered 26 Sep 2026

**D5 — the last box sold twice offline: as recommended.** Both sales stand;
stock goes below zero; on syncing the product is flagged *sold on two devices
while offline — check the shelf*, naming both sales; a controlled substance
below zero goes to the top of the owner's home.

**L3 — printed shelf labels: in, as an option** (26 Sep 2026). A label per
shelf, printed on the receipt printer (as a bitmap, like the receipt);
scanning it starts that shelf's count. Naming or picking a shelf stays the
default. Scheduled with v0.0014.

**L2 — the controlled list: the two files, read 26 Sep 2026.**
- **The spreadsheet** is the Ministry's **register of registered medicines**:
  5,214 products with national code (some), scientific name, trade name,
  pack and form, manufacturer and its country, the marketing-authorisation
  holder, registration numbers and dates, notes (renamings, cancellations,
  suspensions) and shelf life. It has **no barcodes** and no controlled
  marking. It is not the controlled list — but it is the best source yet for
  the catalogue: trade names to match against (the import's "probably"
  pile, the till's name search), registration numbers to show on a product,
  and manufacturers and authorisation holders for the CRM's Externals.
- **The PDF** is the **National Committee for Drug Selection's Essential Drugs
  List** (25 Jul 2023, list 1188, 54 pages): national codes, strength and
  unit per item, grouped by therapeutic class, with notes on which level of
  care may hold it. It is a formulary, **not a schedule of controlled
  substances**. What it does confirm by class: tramadol (4H, opioid
  analgesics — with morphine, pethidine) and diazepam (4A, hypnotics and
  anxiolytics — with lorazepam, chlordiazepoxide). It does not settle
  alprazolam, phenobarbital or pregabalin; **pregabalin is not on it at all**
  (gabapentin is, without restriction).
- **So the controlled list stays as it is**, its source noted in the drug
  reference, and the real schedule is still needed. *Proposed uses of the two
  files* (not built): the register as a reference table in the CRM, with
  each catalogue product linked to its registration; the EDL's national code
  on each molecule. **Go given 26 Sep 2026 ("use them for what they are good
  for") — built in v0.0013.2.**

### Proposed — the till and the Helper as one, and simpler (26 Sep 2026)

Raised: the Helper should be part of the till — the pharmacist is already
dispensing through it — and the till is cluttered. Mockups were made (not
built) of this proposal:

- **U1. Three zones.** Scan bar on top; the basket; a **Pay bar pinned above
  the navigation** with the total. Payment moves into a sheet that opens from
  it, instead of sitting under the basket.
- **U2. Lean lines.** Name, the instruction that will print, a quantity
  badge, the line total. Steppers, *Instructions* and *Remove* go into a
  **sheet opened by tapping the line** (quantity, dose, how-to-take chips,
  remove).
- **U3. The Helper folds into the basket.** Per line, only a tag when it
  matters (*checked in part*, *not checked*). Under the basket, **one strip**
  ("1 warning to look at — Marevan + Aspirin Protect · bleeding risk") and
  **one line of coverage** ("Helper: 2 of 4 fully checked · 1 in part · 1 not
  checked"). Coverage stays visible and as loud as the finding (W8).
- **U4. One item per pair.** Findings about the same two drugs (here an
  interaction and a duplication) are one warning with both reasons and one
  *Acknowledge*. Tapping the strip opens a sheet: what was and was not
  checked, the warning, the questions for the patient folded underneath, and
  "it never stops a sale; whether it was acknowledged is recorded" (P9).
- **U5. Pay sheet.** Total large, the three tenders, a single large *Received
  exactly …* button; *Different amount* and *Discount* as links.
- **U6. Today's sales** leave the till screen for one line on the empty till
  ("Today · 7 sales · 184,500 IQD").
- **U7. Check only.** A *Sell / Check only* switch: the same basket without
  prices or payment, for a prescription question on the phone — and the mode
  the till opens in for anyone not permitted to sell (until v0.0015, every
  pharmacist). The Drugs tab keeps the reference only.

**Decided 26 Sep 2026:** as shown; shipped as the amendment **v0.0013.1**,
and UI amendments continue (v0.0013.2, …) until the UI is approved; the
pharmacist's bar becomes Check-in · Tasks · Till · Drugs · Profile. See
"v0.0013.1 as built" under Amendments.

### A simpler home screen (26 Sep 2026) — built as v0.0013.2

Mocked up, then built as shown:
- **H1. One headline figure:** today's sales at the pharmacy on screen, with
  the change against yesterday (named) and the number of sales, and a
  seven-day line in a muted colour with only today marked.
- **H2. Two actions:** Open the till · Count a shelf.
- **H3. "Needs you":** one list, only what needs the owner, each row one tap
  from what to do — expired batches, near-expiry, suppliers to confirm, a
  trainee's month to review. It replaces the stack of cards (till, stock,
  catalogue, trainee, Helper).
- **H4. The announcement** shrinks to one quiet line at the bottom; the
  trial countdown moves to Profile.
- **H5. An owner of several, on All:** the combined figure, then one row per
  pharmacy with its sales, its change, and whether anything needs the owner
  there (a pharmacy that cannot sell says so).

**Leftovers that are yours:** a **Karmasoft export** (being obtained);
confirming the **controlled list** against the Ministry's schedule — see L2 as
explained 26 Sep 2026; whether **printed shelf labels** are worth having at
launch — see L3; and the **printer and scanner test** (planned for the coming
days).

- **L2, explained.** The app treats five drugs as controlled — tramadol,
  diazepam, alprazolam, phenobarbital, pregabalin — so every movement of them
  goes into the register. That list was chosen here as a placeholder. In Iraq
  the real one is the Ministry of Health's schedule of narcotic and
  psychotropic substances; what is needed is that official list (or someone
  who can read it against ours), so the register holds exactly what an
  inspector will ask for. Pregabalin is the one to check first: restricted
  here because of misuse, but its exact status could not be confirmed.
- **L3, explained.** A small printed sticker per shelf with a code on it;
  scanning it starts that shelf's count without typing, and later helps a new
  employee find things. The receipt printer can print them. *Recommended:*
  not at launch — naming or picking a shelf takes a second — and revisit after
  the owner conversations.

### Before v0.0014 — questions put 27 Sep 2026 (UI approved for now)

**Answered 27 Sep 2026:** all eight as recommended (C4 after an example: the
owner signs off any difference over 5,000 IQD, changeable per pharmacy).
Built as v0.0014 — see *as built* below.

Already settled (26 Sep): one session per drawer with every sale tagged; the
opening float counted blind; a note for every variance and the owner's
sign-off above an amount; offline warns at 24h and on every sale after 72h,
never blocks; an adjustment form; D5 (the last box sold twice offline); L3
shelf labels scheduled here. Still to decide:

- **C1. Selling before the drawer is opened.** *Recommended:* the first sale
  of the day asks for the opening count, with "Later" — logged, and the
  session opens uncounted — so the count never stops a sale (as the Helper
  never does, P9).
- **C2. What the drawer count covers.** *Recommended:* cash only. ZainCash and
  Qi Card totals are shown beside it as "to match against your statement",
  not counted.
- **C3. Handing the drawer over mid-day.** *Recommended:* optional — a
  "hand over" count when one person leaves and another takes the drawer;
  without it the session simply continues, every sale still tagged.
- **C4. The sign-off amount.** *Recommended:* 5,000 IQD by default, the owner
  changes it per pharmacy.
- **C5. What works offline.** *Recommended:* sales, refunds, voids, counts and
  receiving an order queue and sync; setting a price, suppliers, imports and
  sending an order wait for the connection (they conflict badly).
- **C6. Receipt numbers offline.** *Recommended:* each device has a letter —
  `P1-A-000123` — so two offline devices never print the same number.
- **C7. The close.** *Recommended:* closing prints a one-slip summary on the
  receipt printer (sales, tenders, refunds, voids, discounts, the count and
  the variance, who signed).
- **C8. "No sale" drawer opens.** *Recommended:* a "No sale" button with a
  reason, on the audit trail — useful once a cash drawer is wired to the
  printer; until then it records the event only.

**v0.0014 — cash, and the offline model.**
Till sessions opened and closed per person. **Blind count**: the drawer total is
entered before the expected figure is shown. Every variance carries a note and
an owner sign-off. Voids, refunds, discounts and no-sale drawer opens are all
on an audit trail. Nothing ever deducts from anyone's pay. And the offline
model made demonstrable: a simulated offline switch, sales queued as movements
on the device, a sync that replays them, and two devices selling the last box
of the same product while offline — reconciling to the right level.
*The check asserts:* the expected total is not in the page before the count is
entered; two offline devices reconcile correctly.

**v0.0015 — permissions, and what was done on each shift.** (W23)
**Moved up on 26 Sep 2026** (was v0.0017): straight after cash and offline,
because the till is check-only for every employed pharmacist until
permissions exist, and discounts, refunds, prices and stock are the owner's
alone. Until attendance (v0.0017) exists, the timeline shows each person's
actions **per day**; it becomes **per shift** once check-in/out does.
Clinical governance and attendance each moved back one version; every
reference was renumbered. **The roster moves with it**: permissions need
employees to grant them to, so the employment record per person (pharmacist
or assistant, start and end dates), invitations for staff without accounts,
and deactivation that keeps history arrive here; check-in/out stays in
attendance.
The owner's grants, per pharmacy, default deny: a new employee can sell,
nothing else (check-in joins with attendance). Voids and refunds, discounts, prices, stock
corrections, write-offs, cash variances, the receipt and its logo, the average
market price, and the near-expiry exchange become grantable. Every action
carries who did it and in which shift; the owner reads a timeline per shift,
the employee reads their own, and a grant or a revocation is itself on it.
*The check asserts:* an action without the permission is refused and recorded;
the CRM can read no timeline.

**Before v0.0015 — answered 28 Sep 2026.**
1. **The drawer comes with selling:** whoever may sell may open, hand over and
   close a drawer; a close over the sign-off amount still waits for the owner.
2. **Invitations:** a link the owner sends (WhatsApp or SMS), with a code to
   type as the fallback.
3. **Roles — later ("after a while"):** ready-made roles with their
   permissions (e.g. *Cashier*, *Pharmacist*, *Stock keeper*) so an owner
   assigns a role rather than ticking boxes, plus **custom roles** the owner
   builds, names, saves and assigns. v0.0015 builds per-person grants in a
   shape roles can sit on top of (a role is a saved set of grants), so adding
   them later changes nothing already granted. Not scheduled yet.
4. **The phone app and the stores — delayed to after v0.0017**, with every
   reminder (see *Reminders*).

**v0.0016 — clinical governance.**
A **Rules** module in the CRM — `proposed → under review → approved (tier) →
retired` — with a named approver and date on every transition, and a rule that
was never approved never fires. Every released rule set is versioned and
archived. The override report: every Warn and Stop overridden, per rule, with
anything above one in five flagged for demotion. The Stop tier becomes live but
stays empty until the curator fills it. And the pharmacy's own patient history
(P8): a sale may be attached to a patient the pharmacy keeps, which enables
per-patient alert suppression inside that pharmacy and nowhere else.
*The check asserts:* no CRM role can read a patient row; a retired rule stops
firing; a rule set from any past date can be reproduced.

**v0.0017 — attendance.**
On the roster that arrived with permissions (v0.0015): check-in is tied to
opening a till session. A missed
check-out closes automatically at the **scheduled** end plus a grace period —
not at midnight, because overnight shifts exist — and is marked `auto_closed`.
On the next check-in the person is asked when they actually left; the claim and
the owner's approval are stored as two facts, editable for seven days, and the
last till transaction is shown beside the claim as evidence.
*The check asserts:* an auto-closed shift never counts as clean; approval never
overwrites the claim.
**Also, since 28 Sep 2026 (v0.0016.1, A3–A4):** the owner's **Reports**
module (التقارير) — the pharmacy's sales and number of sales per day, week and
month, and the same per person — and a team member's page in three parts:
their timeline shift by shift; their performance for a day, a week or a month
(shifts worked, and per shift the sales in IQD and the number of sales, each
as average and median, with the period's totals); their permissions. Owner
only — not the Manager role. Each person sees their own figures in My
activity. Under P7 nobody is ranked: a person is shown against the pharmacy's
average on their own page, never in a league table. *The check asserts:* no
screen lists people ordered by sales; a staff member sees only their own
figures.
**Decided 28 Sep 2026, before building:**
1. **The owner has shifts too.** An owner who sells at their own pharmacy
   checks in and out like anyone on the team, and appears in the performance
   figures on their own page like anyone else.
2. **A minimal rota: the owner sets each person's shift times** (days and
   hours) — the scheduled end is what a missed check-out closes at. **Every
   change to someone's schedule is written to the timeline** — who changed
   it, from what, to what, when — **and shown to both** the owner and that
   person.
3. **Reports in the CRM are the owner's choice**: a setting, **on by
   default** (changed from off, 28 Sep 2026), that the owner turns on or off
   per pharmacy. Off, the CRM sees
   none of that pharmacy's Reports figures; on, the Saydali+ team sees the
   pharmacy-level figures (never a person's). Turning it on or off is itself
   on the record, and the CRM shows only pharmacies that have it on.
*The check asserts, as well:* a schedule change appears in both people's
timelines; with the setting off the CRM holds no Reports figure for that
pharmacy.

**v0.0018 — the near-expiry exchange.** (W22)
Built on v0.0013's batches: the owner's batches inside the near-expiry window,
listed per batch by choice, never automatically; visible to nearby pharmacies;
controlled substances excluded; settlement between the two pharmacies, recorded
as a stock movement at both ends and never passing through the platform.
Owners by default; grantable (v0.0015). *The check asserts:* a controlled item
cannot be listed; nothing is listed that the owner did not choose.

**v0.0019 — tasks, incidents, and the absent owner's day.**
Tasks with due dates and recurrence — the daily fridge-temperature check is the
case to design for — and completion; the owner assigns them from Team, to a
person or to whoever is on shift. Performance itself moved to v0.0017 (28 Sep
2026). **Incidents inside a pharmacy** (A3): anyone on the team reports a
colleague or an event to the owner — never the owner, never anonymously, and
the person reported does not see it.
Sales per pharmacist, segmented by ATC class, with antibiotics and controlled
substances flagged **relative** to the pharmacy's own average and the
district's, shown to the owner as a question — never as a leaderboard (P7). The
owner's home becomes "what happened today while you were not here". The
pharmacist side opens its three things: check-in, tasks, CV.
*The check asserts:* no screen ranks pharmacists by sales; a flag names its
comparison.

**v0.0020 — paying for it.**
Subscriptions for the two systems on the W14 ledger, seat-aware so a one-person
pharmacy is not charged for staff it does not have. **Blocked** until the price
is set — see the open decisions below.

**Later, in this order:** W20 (the assessment, runnable as unaccredited
self-assessment from its first build), then W21 (shift credits and the
marketplace switching on district by district), then P6's area data and the
pharma-facing products.

## Amendments — bug fixes and changes to built versions

**How this works (decided 26 Sep 2026).** A problem found in a built version is
**not fixed on the spot**. It is written down here first — what is wrong and
what will be done about it — and built only when asked. Fixes to version
`v0.00NN` ship as **`v0.00NN.1`**, then `.2`, and so on; the planned versions
above keep their numbers, so an amendment never pushes stock, permissions or
anything else down the list. Files carry the full number
(`saydali-plus_v0.0012.1.html`), and the test harness's newest-build picker
learns to read the third number when the first amendment is built.

### v0.0012.1 — the till: receipt, instructions, scanning and cash

Reported 26 Sep 2026, from the till on a phone. **Built 26 Sep 2026** — see
"v0.0012.1 as built" at the end of this entry.

**A1. The line prices on the receipt are too big.** Each item's
`1 × 35,250 = 35,250` is drawn at the same size as the item's name, so the
figures compete with the name. *Plan:* the item-line figures drop from 15 px to
about 12 px, and stay bold; the item name keeps its size, and the **Total**
stays the largest thing on the receipt. The payment and change lines follow the
smaller size.

**A2. The default instructions say nothing useful.** v0.0012 prints a default
by dosage form: "Swallow with water" under every tablet, "Shake the bottle"
under every syrup. A patient learns nothing from that. *Plan:*
- **Remove the form-based defaults entirely.** A medicine with nothing worth
  saying prints no instruction line, only the dose if the pharmacist typed one.
- **Defaults come from the molecule, and only where timing or food changes
  something.** Examples: **levothyroxine** (the thyroid one) — on an empty
  stomach, in the morning, 30 minutes before breakfast; proton-pump inhibitors
  (omeprazole, esomeprazole) — before breakfast; NSAIDs (ibuprofen,
  diclofenac) and low-dose aspirin — after food; metformin — with food;
  gliclazide, glimepiride — with breakfast; furosemide, hydrochlorothiazide —
  in the morning; simvastatin, montelukast — in the evening; amitriptyline —
  at bedtime; warfarin, insulin glargine — at the same time every day;
  **methotrexate — once a week only**; ciprofloxacin — two hours apart from
  milk and antacids; metronidazole — after food, no alcohol. About fifty of the
  119 molecules get one; the rest get none.
- **A fixed list of instructions, in both languages**, kept in the drug
  reference (`data/drugs.mjs`) next to the interactions, so the app and the
  CRM read the same thing and a receipt switched to English translates every
  line: before food · after food · with food · on an empty stomach · before
  breakfast · with breakfast · in the morning · in the evening · at bedtime ·
  at the same time every day · once a week only · apart from milk and antacids
  · no alcohol.
- **At the till, those are quick taps.** Opening a line's instructions shows
  them as chips, the molecule's defaults already on; the pharmacist taps to
  add or remove, and can add a short note of their own. The dose stays typed
  by the pharmacist, every time, never filled in.
- For a combination product (Janumet: sitagliptin + metformin), the defaults of
  each molecule are merged, without repeats.
- The chosen instructions show on the cart line itself, so the pharmacist can
  see what will print without opening anything.
- Content is **placeholder until the clinical curator (W19) reviews it**, as
  the interactions are.

**A3. A stale version number in the CRM.** The Catalogue screen says marking a
link *verified* "arrives with the Rules module in v0.0013". The Rules module is
clinical governance, v0.0016. *Plan:* correct the two strings.

**A4. There is no visible way to scan with the camera.** Reported 26 Sep
2026: the till says "scan a barcode" and offers no button to do it. v0.0012
shows the camera button only where the browser has a built-in barcode detector,
and hides it everywhere else — which includes the phone's file viewer, iPhones,
and any browser that will not give a local file the camera. Hiding it was
meant as "never offer something broken"; in practice it reads as "the feature
does not exist". *Plan:*
- **The scan button is always there**, beside the search box, large enough for
  a thumb.
- Where the browser has no built-in detector, a **small scanning library
  bundled into the file** reads the camera instead, so it works on iPhones and
  in browsers without the detector.
- Where the camera cannot be opened at all (permission refused, or a viewer
  that blocks it), tapping the button **says why and what to do** ("open this
  file in Chrome", "allow the camera") instead of doing nothing.
- The camera view scans continuously, beeps or vibrates once on a read, adds
  the item and closes; a *keep scanning* option keeps it open for a full
  basket.
- The search box's hint says a USB or Bluetooth scanner works by simply
  scanning into it.

**A5. Cash received is a confirmation, not a form.** Reported 26 Sep 2026.
v0.0012 makes the pharmacist type the amount received for every cash sale,
even when the customer hands over exactly the total — which is most sales.
*Plan:*
- For cash, the default is **one tap to confirm the exact amount**: "Received
  49,500 IQD ✓". Confirmed, the sale completes with the amount received equal
  to the total and no change.
- **Not confirmed** — the customer handed over more — the pharmacist enters
  the amount received by hand, and the till shows the change, exactly as
  v0.0012 does now. An amount below the total is still refused.
- The sale records which of the two it was (confirmed exact, or entered), so
  v0.0014's drawer count can tell a confirmed sale from a typed one.
- The receipt is unchanged: amount paid and change (0 IQD when confirmed).
- ZainCash and Qi Card are unaffected: the method is recorded, with the
  optional reference.

*The check will assert:* no generic form line ("swallow", "shake") appears on
any receipt; levothyroxine and methotrexate carry their instructions by
default; the scan button is present with or without a built-in detector, and
a refused camera produces a message rather than silence; a cash sale completes
on a single confirmation with no typing, records itself as confirmed, and a
typed amount below the total is still refused; a medicine with no defaults prints no instruction line; every
instruction exists in both languages and follows the receipt's language; the
item figures are drawn smaller than the item names and the total; the dose is
never pre-filled.

### v0.0012.1 as built

- **A1.** Receipt type sizes are one table (`RECEIPT_TYPE`): item name 15,
  item figures 12 and bold, instructions 13, payment lines 13, total 19. The
  check reads the fonts the receipt is actually drawn with.
- **A2.** `take` added to the drug reference with a 13-entry bilingual
  vocabulary; 49 of 119 molecules carry defaults. The form-based lines are
  gone. At the till: the instruction under each line is shown on the cart; the
  editor has the dose field, the 13 choices as chips (the medicine's own
  pre-selected) and an optional note, which prints as typed in either language.
  The embed script and a new unit test refuse an unknown key or a missing
  language.
- **A3.** Both CRM strings now say v0.0015.
- **A4.** A **Scan** button always beside the search box. It uses the browser's
  built-in detector where there is one, and otherwise an EAN-13 reader written
  into the file — no outside library, a few kilobytes. It reads several lines
  across the frame and several down it, both ways round, and needs two lines
  to agree and the check digit to pass; in the check it reads every catalogue
  barcode across 413 generated images (straight, sideways, upside down,
  blurred, noisy) with no wrong read, and reads a real camera stream through
  Chromium's fake camera. A beep and a buzz on each read. *Keep scanning*
  leaves the camera open for a basket, says what it added, and counts a box
  held in view once — the same code counts again only after it has left the
  view for a second. With no camera API, with the camera refused, or with no
  camera, the button says which and what to do, with *type the barcode
  instead*. The empty till says a USB or Bluetooth scanner works as it is.
- **A5.** Cash opens on **Received exactly {total} ✓**; one tap completes the
  sale, recorded `cashConfirmed: true`. *Customer paid a different amount*
  opens the typed field, with the change (or the shortfall) shown as it is
  typed; typed sales are recorded `cashConfirmed: false`; a short amount is
  still refused and stays on screen. Card and ZainCash are unchanged.
- The test harness and the embed script now read the third number of a
  version, so `v0.0012.1` is picked over `v0.0012`.

**Still true after v0.0012.1:** the camera needs a browser that will give the
page the camera — Chrome on Android, Safari on iPhone. A phone's built-in file
viewer usually will not, and now says so. Real-world reading of small or
crumpled barcodes in shop lighting is untested until the hardware test
(non-code item 3); the built-in reader is tuned for a box held up to the
camera, not for a barcode across a room.

### v0.0013.1 as built — the till and the Helper as one

- **U1** Scan bar, basket, and a **Pay bar pinned above the navigation** (and
  beside the sidebar on a wide screen), measured rather than assumed.
- **U2** A line is its name, what will print, "×2" and its total; tapping it
  opens a **sheet** with the quantity stepper, dose, the how-to-take chips, a
  note, and *Remove*.
- **U3** One **Helper strip** under the basket ("1 warning to look at —
  Aspirin Protect + Marevan · Major bleeding risk…", or "Warning
  acknowledged") and one **coverage line** ("Helper: 2 of 4 medicines checked ·
  1 in part · 1 not checked", or "… · nothing found in what it checked").
- **U4** Findings about the same drugs are **one item** with each reason
  (*Interaction*, *Duplicate therapy*) and one *Acknowledge*, which
  acknowledges all of them; the sale still records each finding and its
  acknowledgement. The Helper sheet names what was and was not checked and
  folds the patient questions.
- **U5** **Pay** opens a sheet: the total, the three tenders, *Received
  exactly … ✓*, and *Different amount* / *Discount* as links.
- **U6** Today's sales are one line on the empty till, opening their own
  sheet.
- **U7** **Sell / Check only** for the owner; checking needs no prices and
  sells nothing; *Sell this basket* turns it into a sale and asks for any
  missing price. A pharmacist gets the till in **check-only** mode — no
  prices, no payment — until selling is granted (v0.0015).
- The pharmacist's bar is **Check-in · Tasks · Till · Drugs · Profile**; the
  CV is on Profile. With the marketplace off, **Drugs is the reference
  only**, with a line pointing to the till.
- **Leftover:** the marketplace-on build keeps its own check in Drugs, where
  W8's dispensing tally lives. Folding that tally into the till (check-only
  records nothing today) is to be done before W21 switches the market on.

### v0.0013.2 as built — the simpler home, and the Ministry sources

- **Home (H1–H5)**, with the marketplace off. One headline figure — today's
  sales at the pharmacy on screen — with the change against yesterday (named,
  with an arrow as well as a colour), the number of sales, and a seven-day
  line in a muted colour with only today marked; the six days before today
  are a fixture until real history exists. *Open the till* and *Count a shelf*
  (the till button is disabled where the pharmacy cannot sell). **Needs you ·
  N**: one list — under review, no responsible pharmacist, expired batches,
  count this, near expiry, below minimum, returns set aside, suppliers to
  confirm, a trainee's month — each row one tap from doing it. The
  announcement is one quiet line (the same labelled slot); the trial is on
  Profile. On All, an owner of several sees the pharmacies together, then a
  row per pharmacy with its sales and change, whether anything needs them,
  and "can't sell" where nobody can sign.
- **The Ministry's register** (`data/sources/moh-register.csv`, read by
  `scripts/read-sources.py` into `data/register.json`): all 5,214 rows are in
  the **CRM** as a new **Register** module — list capped at 300 drawn rows
  with a note to search or filter, views (all / in our catalogue / with
  notes), a country filter, the top search reaching it, and a record page per
  registration. **26 of the 59 catalogue products are linked** to their
  registration — by brand, strength and dosage form, only when one row clearly
  fits (Neurobion's injection was refused for its tablets) — shown on the
  CRM's catalogue record and, as *Registered in Iraq*, on the app's product
  screen. **Mapping an unknown barcode** in the CRM starts with *Find it in
  the Ministry's register*: suggestions as the operator types; a pick fills
  the name and pack and records the registration. The phone app does **not**
  carry the register — only its 26 links.
- **The Essential Drugs List** (`data/sources/ncds-essential-drugs-list-2023.pdf`,
  its text extracted once): 597 items in 154 classes; **80 of the 119
  reference drugs** found on it, matched by name and the list's own spellings
  (Amoxycillin, Frusemide, Phenobarbitone, Thyroxine, Acetylsalicylic acid,
  Co-trimoxazole), a single drug never claiming a combination. Each drug record
  — app and CRM — shows its entries (national code, item, class) and the
  source, or says it is not on the list.
- The drug record's *Add to check* is gone with the Helper in the till.
- **Still true:** neither source is a controlled-substance schedule; the
  register has no barcodes, so it cannot be scanned against; both are "for
  now", and `scripts/read-sources.py` re-reads replacements in one command.

### v0.0013.3 — search by any name, and stock without barcodes

Reported 26 Sep 2026. **Built as v0.0013.3** — see *as built* below.

**A1. Every search finds a drug by its brand AND its scientific name.** Today
each search box knows only one side: the drug reference matches the
scientific name (and Arabic, ATC, strengths) but not brands — "Panadol" finds
nothing; the till, the count and the purchase order match brands only —
"paracetamol" finds nothing; only the catalogue screen matches both. *Plan:*
- **One search, used everywhere** — till, count, purchase order, import
  ("probably" pile), catalogue, drug reference — matching the brand (English
  and Arabic), the scientific name, the Arabic scientific name, and a product's
  every ingredient, with the Arabic letter forms folded as the reference
  already does.
- **Results say why they matched:** "Panadol Extra — paracetamol + caffeine"
  when the scientific name was typed; in the drug reference, "Paracetamol —
  sold as Panadol 500 mg, Panadol Extra" when a brand was typed.
- **Order:** a name that starts with what was typed, then a brand containing
  it, then a scientific-name match.

**A2. Stock without barcodes — the owner can turn barcodes off.** Some
pharmacies will not use barcodes at all. *Plan:*
- A setting on the pharmacy (owner only): **"We use barcodes"**, on by
  default. Off, every screen leads with a name search instead of a scan:
  the till's scan button and scan wording go; the count becomes **pick from a
  searchable list and type the quantity**, shelf by shelf as now; purchase
  orders and receipts add by name. A scanner that happens to be plugged in
  still works.
- **Items of the pharmacy's own.** A pharmacy without barcodes will stock
  things not in our catalogue. The owner (staff later, by permission) adds an
  item by name — with form and strength if known — and it becomes a product
  of that pharmacy with an internal code instead of a barcode: sellable,
  countable, orderable, on the receipt, priced like any other. It goes to the
  CRM's mapping queue by name, so the Helper can check it once it is linked;
  until then it is marked *not checked*, as any unmapped product is.
- Imports without a barcode column match by name (brand or scientific), and a
  row that matches nothing can become one of the pharmacy's own items instead
  of being left out.
- **Decided 26 Sep 2026:** (1) the setting is **per pharmacy**; (2) a
  pharmacy **with** barcodes may also add its own no-barcode items; (3) the
  **owner** adds items by name, and staff once permissions (v0.0015) grant it.

### v0.0013.3 as built — one search by any name, and stock without barcodes

- **One search (A1)** — `findProducts()` — behind the till, the count, the
  purchase order and the catalogue: brand (English and Arabic), scientific
  name (English and Arabic) and every ingredient of a combination, letter
  forms folded. Order: a brand that starts with the words, then a brand that
  contains them, then an ingredient match. Each result's second line says why:
  its pack when the brand matched, what it is made of ("Paracetamol +
  Caffeine") when the scientific name did. A number is left to the scanner.
  **A name and Enter** takes the first result, in the till, the count and the
  order, as a scan would.
- **The drug reference** now finds a drug by its brands: "panadol" finds
  Paracetamol, and the row says *Sold as: Panadol 500 mg, Panadol Extra,
  Panadol Cold & Flu Day* — only when the brand was what matched.
- **Spreadsheets**: a row naming the scientific name ("Paracetamol 500 mg")
  now finds the product for the *probably* pile.
- **"We use barcodes" (A2)** — a switch at the top of Stock, owner only,
  **per pharmacy**, on by default, written to the log. Off: no Scan button in
  the till or the count, the boxes ask for a name, and the empty till says
  "Type the first item's name — brand or scientific". A plugged-in scanner
  still works: digits and Enter are still read as a barcode.
- **Items of the pharmacy's own.** When a name search finds nothing, the
  owner is offered *Add "…" as an item of your own* — in the till, the count
  and the purchase order, whether barcodes are on or off. A short form (name;
  form and strength optional) makes it a product **of that pharmacy only**,
  with an internal code (`L-P1-001`) instead of a barcode: the till asks its
  price once, then it sells, prints, counts, orders and imports like any
  product, labelled *Your pharmacy's own item* in results. It goes to the
  mapping queue **by name**; until mapped the Helper has nothing to check on
  it and never stops the sale (P9). The same name twice is the same item.
- **Spreadsheets without barcodes**: a row naming an own item is matched to
  it; a row that matches nothing, has a name and no barcode, can be ticked to
  **come in as a new own item** with its stock (its pile opens so the owner
  sees it).
- Staff other than the owner are not offered to add items — until
  permissions (v0.0015) grant it.
- Checks: 35 new (527 app in all); mutation-tested.

### v0.0013.4 — proposed: fewer main modules (27 Sep 2026)

Raised 27 Sep 2026: *Drugs, Till and Stock are three main modules but
overlap — can they be one, with sub-modules?* **Decided 27 Sep 2026: A,
named "Pharmacy"; and the till renamed "Point of sale / نقطة البيع".
Built as v0.0013.4** — see *as built* below.

Why they are separate today: they were built as three jobs — the till
(every minute, at the counter), stock (back office, weekly), the drug
reference (looking something up). Since v0.0013.1 and v0.0013.3 the overlap
is real: all three search the same products the same way, the Helper already
lives in the till, and Drugs is reference-only.

Options:
- **A. One module, three tabs** (Till · Stock · Drugs). Bottom bar: Home,
  Pharmacy, Profile. Cost: the till, the busiest screen, sits behind a tab,
  and a mis-tap at a queue lands in the wrong place.
- **B. (Recommended) Till stays alone; Stock and Drugs become one
  "Products" module.** One search over the pharmacy's products and our drug
  reference; a product opens one page — its stock and batches, its price,
  and its drug information (ingredients, interactions, Essential Drugs List,
  registration). Count, import, orders, suppliers and the controlled register
  stay as its sub-screens. Bottom bar: Home, Till, Products, Profile (four).
  The till stays one tap; the duplicate search goes; permissions (v0.0015)
  map cleanly — a cashier gets Till, a stock-keeper Products.
- **C. Keep the three**, only share the search (already done in v0.0013.3).

Pharmacist (non-owner) bar under B: Check-in, Tasks, Till, Products
(reference, and stock read-only until permissions say otherwise), Profile.

Questions: (1) A, B or C; (2) the name — "Products / المواد", "Stock /
المخزون" or other; (3) mock-ups first, or build straight away as v0.0013.4.

Mock-ups shown 27 Sep 2026 (A: three tabs under "Pharmacy"; B: "Products"
with one search over the pharmacy's products and the drug reference, stock
figures and prices in the list, and a product page holding stock, price and a
link to the drug's information).

Also noticed while making them: the minimum-level box on a product's stock
card reads "Tell me below…" — unclear. Proposed: "Warn me when fewer than…" /
"نبّهني عندما يقلّ عن…".

### v0.0013.4 as built — one Pharmacy module; the till is Point of sale

- **Pharmacy / الصيدلية** replaces Till, Stock and Drugs on the bar and in
  the sidebar (marketplace off). The owner's bar is **Dashboard · Pharmacy ·
  Profile**; a pharmacist's is **Check-in · Tasks · Pharmacy · Profile**.
- Inside, a tab each — **Point of sale · Stock · Drugs** — under the header
  "Pharmacy", with the pharmacy's name above it. The tabs a person sees are
  the ones their role may open: a pharmacist has Point of sale (check only)
  and Drugs; Stock waits for permissions (v0.0015).
- The module **remembers its last tab**; it opens on Point of sale the first
  time. The Pharmacy button stays lit a level down (a count, an order, a
  product, a drug record), where the tabs are not repeated.
- An owner of several keeps the pharmacy chooser, under the module tabs.
- **The till is "Point of sale" / "نقطة البيع"** everywhere the app says it
  (tab, home button "Open point of sale", the announcement, check-in and
  barcode wording, the CRM's catalogue notes). Code names are unchanged.
- The Drugs tab lost its "Checking a prescription? It is in Point of sale
  now" card (the tab is beside it); the desktop sidebar lost its separate
  Products line (the catalogue is inside Stock).
- The minimum-level box reads **"Warn me when fewer than…" / "نبّهني عندما
  يقلّ عن…"**.
- With the marketplace switched on, the bars are as they were.
- Checks: 14 new (541 app in all); mutation-tested.

### v0.0013.5 — a UI review (27 Sep 2026) — built

A design review of v0.0013.4 (every main screen, phone and desktop, English
and Arabic, with an automated scan for small text, small targets and low
contrast). Mock-ups shown, then **built as v0.0013.5** — see *as built*
below.

- **U1. A shorter header.** Two dark bands (the "Saydali+" strip and the
  title block) take ~30% of a phone screen before any content; on Point of
  sale the scan box starts a third of the way down. Proposed: one compact
  band — "Saydali+" small, the pharmacy's name (or "Good morning, Rahma" on
  Home), the language and bell buttons.
- **U2. Sell / Check only beside the basket** instead of a second full-width
  row under the module tabs — "Basket · 3 items" on the left, a compact
  Sell | Check only on the right.
- **U3. Point of sale on a computer: two columns** — the basket on the left;
  on the right the total, the lines, Pay, and the Helper's warnings — instead
  of a 660px column with the Pay bar stretched across the whole screen. Maybe
  keyboard keys (F2 pay, Esc clear).
- **U4. Home, "today so far".** At the start of the day the week's line dives
  to 0 and reads like a crash. Proposed: today drawn dashed and hollow,
  labelled "Today so far", compared with yesterday *by the same time*. Also a
  missing gap between the two buttons and "Needs you".
- **U5. A pharmacist's home** still leads with a large Dispensing Helper card
  and "Look up a product", both now inside Pharmacy. Proposed: the
  announcement (U9), one "Check a prescription" card, and Check-in.
- **U6. Readability and targets (no mock-up needed).** Secondary text
  (#8B87A3) is 3.4:1 on white and 3:1 on the background — below the 4.5:1
  minimum; bar labels are 10px; the language and bell buttons are 36px, Sell /
  Check and the form chips 31px, the count's − / + 34×32, the interaction links
  on a drug record 15px tall. Proposed: secondary text #6B6785 (≈5:1), bar
  labels 11.5px, every target at least 40–44px.
- **U7. Small defects.** "1 drugs · 1 boxes" and "Confirm the count — 1
  drugs" (plurals); the count line's card edges look clipped; "Discount" and
  "Different amount" sit on different lines in the pay sheet; the Essential
  Drugs List shows raw text ("Warfarin sodium 3mg Tablet Tablet \1070"); the
  profile name breaks as "Rahma Al- / Jubouri" beside its badge; the drug
  record has a separate "Back" button under a header that already says where
  you are; the sidebar still says "A professional relief network" (the
  marketplace-era tagline).

Questions put 27 Sep 2026: which of U1–U7 to build; the new tagline; whether
the compact header applies to every screen or only Pharmacy.

**Answered 27 Sep 2026 (from the before/after pairs):**
- **U8. Keep a back button** — as an arrow in the slim header, always in the
  same place, on every screen below the three tabs (counting a shelf, a drug
  record, a product). It replaces the "Back" pill inside the page, not the
  way back.
- **U9. Keep the announcement / ads banner where it is, and make it eye-
  catching** — on both homes: a bold card in the brand's indigo with a gold
  glow, a gold "From Saydali+" label (a paid placement's label says
  "Sponsored" and who paid, as now), a large title, a white button, a star
  mark, and a slow moving sheen that stops for people who turn motion off.
  The pharmacist's home keeps it at the top; U5's "quiet line" is withdrawn.
  Still never on a clinical surface (Point of sale, the Helper, Drugs) — P1.

### v0.0013.5 as built — the UI review

- **U1. One slim header** on every screen (the dark strip above it is gone on
  phones): a small line, the title, the language and bell buttons. The small
  line is "Saydali+" on the three Pharmacy tabs (title: the pharmacy's name)
  and on both homes (title: "Good morning, Rahma" — first name); elsewhere it
  says where you are ("Stock" over "Count a shelf"). ~68px on a phone, was
  ~124.
- **U2. Sell / Check only beside the basket** — "Basket · 3 items" on the
  left, the switch on the right, directly above the lines.
- **U3. Point of sale on a computer (1100px and wider):** the basket on the
  left; on the right a panel with the total, the lines, Pay, and the keys —
  **F2** pays, **Esc** closes a sheet and then clears the search box (the
  mock-up said "Esc clear"; clearing the basket by one key is too easy to do by
  accident, so it clears the search). The Helper's warnings stay under the
  basket. Below 1100px the Pay bar is pinned as before.
- **U4. Home, "today so far":** the six past days solid; today dashed to a
  hollow point, labelled "Today so far". *Changed from the mock-up:* the
  mock-up drew today level with yesterday; the build draws today's real
  figure, because a point at yesterday's level would say today had sold as
  much. The comparison is with **yesterday by this time** — sample data (the
  prototype takes yesterday's total in proportion to the trading day gone,
  08:00–22:00) until sales are kept by the hour. More space above "Needs you".
- **U5. A pharmacist's home:** the announcement on top, "Check a prescription"
  (into Point of sale), then check-in. The Helper card and "Look up a product"
  are gone (both inside Pharmacy).
- **U6.** Secondary grey #6B6785 (≥4.5:1 on white, was 3.4:1); bar labels
  11.5px (were 10px); header buttons 44px (were 36px); Sell / Check and the
  form filters 40px (were 31px); the count's − / + 44px (were 34×32); drug
  interaction links have a 40px+ tap area.
- **U7.** "1 drug · 1 box" and "Confirm the count — 1 drug"; the count's
  focused line no longer spills past the card's corners; "Different amount"
  and "Discount" aligned; **Essential Drugs List names cleaned at the source**
  (`scripts/read-sources.py`): "Warfarin sodium 3 mg Tablet", not "3mg Tablet
  Tablet \1070" — 356 of 597 entries had run-on columns or page numbers, 33
  still carry a note from the list itself; the profile's badge moved under
  the email; the sidebar says **"Run your pharmacy" / "أدِر صيدليتك"**.
- **U8. A back arrow in the header** one level below the Pharmacy tabs:
  counting, import, orders and an order, suppliers, the register, the
  catalogue, a product (→ the catalogue), a drug record (→ Drugs, where you
  were). It points the other way in Arabic. The drug record's and product's
  in-page Back buttons are gone.
- **U9. The announcement / ads banner:** kept where it was on both homes; now
  slim (~100px), bold (indigo, gold glow, gold "From Saydali+" label, a star,
  a slow sheen that stops for anyone with reduced motion on) and **pressable**
  — the whole card is one button, with a white arrow; "Point of sale is here"
  leads to Point of sale. Presses are counted like impressions. A paid
  placement keeps its "Sponsored" label. Still never on Point of sale, Drugs or
  a drug record (P1).
- Checks: 21 new (562 app in all); mutation-tested.

### v0.0014 as built — cash, and the offline model

**The drawer** (Point of sale → the drawer line → *Cash drawer*; owner only
until permissions, v0.0015).
- One session per drawer — a drawer is a device at a pharmacy — every sale
  and refund tagged with the drawer and who made it. Sales and drawers have
  ids that are never reused.
- **Opening (C1):** the first sale asks for the cash in the drawer, with
  **"Later"** — which opens it uncounted, on the record, and goes straight on
  to paying. A sale with no drawer open is never refused: one opens uncounted.
  The opening count is **blind**: what was left the night before appears only
  after counting, and a difference needs a note.
- **Hand-over (C3):** optional; counted blind, a note for any difference, to
  whom; the session carries on.
- **Close:** counted **blind** — what the drawer should hold is nowhere on the
  page until the count is entered — then counted / should be / difference.
  Every difference needs a note; **over the sign-off amount (C4, 5,000 IQD by
  default, the owner's setting per pharmacy)** the owner signs it; anyone else
  closing leaves it *waiting*, on the owner's home, until the owner signs.
  What is left for tomorrow is recorded.
- **Only cash is counted (C2);** ZainCash and Qi Card are shown apart, "to
  match against your statement". A cash refund comes out of the drawer it is
  paid from.
- **The close slip (C7),** drawn like the receipt (Arabic by default,
  English on request): sales and each tender, refunds, removed lines,
  discounts, no-sale openings, the float, what should be there, the count, the
  difference and its note, what was left, who closed and who signed.
- **"No sale" (C8),** with a reason, on the record.
- **The session's record:** sales (with discounts), refunds, removed lines,
  no-sales, hand-overs, going offline and back, with who and when.
- *"Nothing is ever deducted from anyone's pay"* says so on the screen.
- **The adjustment form** (item 6 of 26 Sep): *Correct the stock* on a
  product's stock card — a quantity (+/−) and a reason (damaged, lost, found,
  miscounted, other with a note), a movement on the record.

**Offline.**
- A switch on the drawer screen (*This device, and the connection*), and —
  for the prototype — **Device A / Device B**, a second point of sale at the
  same pharmacy.
- Offline, every movement waits in the **device's queue**; the device sees
  its own queue, the record does not, and another device does not see it
  either. Back online, the queue **replays onto the record in order** and the
  device's sales are marked sent. Stock still has one writer.
- **C5:** setting a price, adding or linking a supplier, an import and sending
  an order wait for the connection and say so. A product with no price is
  not refused offline: the price holds for that sale only, on the record.
- **C6:** receipt numbers `P1-A-000123` — pharmacy, device letter, the
  device's own count.
- Point of sale shows offline and how many sales wait; **over a day** it says
  so louder; **after three days every sale says so** — and goes through.
- **D5:** the last box sold on two devices while both were offline — both
  sales stand, the level goes below zero, and the product is flagged naming
  both sales, on the drawer screen and the owner's home; **a controlled
  substance goes to the very top of the home**, until the owner marks the
  shelf checked.

**L3 — shelf labels:** *Print shelf labels* on the count's shelf picker; a
label per shelf, drawn for the receipt printer, with an in-store EAN-13
(prefix 29, the pharmacy, the shelf). The app's own camera decoder reads it
back; scanning it (or typing it) starts that shelf's count.

- Checks: 34 new (596 app in all); mutation-tested (27 of 27 caught).

### v0.0015 as built — permissions, the staff list, and the day's record

**Who may do what.** Per pharmacy, per person, **default deny**: someone new
can **sell — and, with selling, open, hand over and close the drawer** — and
nothing else. The owner grants, and takes back: voids and refunds (removing a
line from a sale, emptying the basket, refunding), discounts, prices, stock
(counts, imports, orders, suppliers, corrections, shelf labels), write-offs,
cash differences (signing a drawer difference over the amount), the receipt
and its logo, the average market price, and the pharmacy's own items. The
near-expiry exchange is listed but cannot be granted before it exists
(v0.0018). What someone may not do is not offered to them; **an action tried
without the grant is refused and recorded** ("Refused: Discounts — not
granted"), never silently ignored. An owner's powers are at pharmacies they
own only. Grants are stored per person as a set, so the ready-made and custom
**roles** (decided 28 Sep 2026, later) can sit on top as saved sets.

**The staff list** — *Team*, a new button on the owner's bar (Dashboard ·
Pharmacy · Team · Profile) and a line in the sidebar.
- **Invite** by name, phone number or email, and position (pharmacist or
  pharmacy assistant): a **link** to send on WhatsApp or by text, and a
  **six-digit code** as the fallback. Someone with an account sees the
  invitation on their home and accepts; anyone can type the code on their
  home (*Have an invitation code?*). The prototype has *accept as them*.
- Each person: position, contact, since when; **what they may do** as a list
  of switches; their day; **end employment** — the record stays, they can do
  nothing there any more — or withdraw an invitation.

**The day's record.** Every action with who did it and when, **per day**
(per shift once check-in exists, v0.0017): sales, refunds, removed lines,
discounts, prices, corrections, counts, drawer openings, hand-overs and
closes, no-sales, going offline, invitations, joining, grants and
revocations, refusals. The owner reads everyone's (or one person's), day by
day; an employee reads **their own**, under *My activity* on Profile, with
what they may do. **The CRM reads none of it** (checked: nothing in the CRM
build reads the record).

- Checks: 22 new (618 app in all); mutation-tested (17 of 17 caught).

### v0.0015.1 — roles, the international controlled list, and the drug lists (28 Sep 2026)

**Decided 28 Sep 2026.**
- **The clinical curator:** a placeholder ("Clinical curator — to be named")
  until the person is chosen; the real one is needed before the Stop tier
  holds anything (v0.0016).
- **Patient history (P8, v0.0016):** grantable, off by default.
- **Roles (now):** ready-made — *Cashier* (sell), *Pharmacist* (sell, voids
  and refunds, discounts, own items; patient history from v0.0016), *Stock
  keeper* (sell, stock, write-offs), *Manager* (everything grantable); the
  owner's **custom roles** (a name and a set of switches, saved); a person
  gets a role **plus any extra grants** ("Pharmacist + Prices"). (a) the set
  as above; (b) editing a role changes everyone holding it, on the record;
  (c) a role works at all the owner's pharmacies.
- **Controlled substances — the UN conventions for now** (1961 narcotics,
  1971 psychotropics, 1988 precursors), each labelled with its convention
  and schedule. Diazepam, alprazolam and phenobarbital: 1971 Schedule IV.
  **(d)** tramadol and pregabalin stay in the controlled register, marked
  *not on the UN lists — nationally controlled in much of the region*,
  until Iraq's schedule. **(e)** pseudoephedrine marked a **precursor** (1988
  Table I): its sales in a precursor list, not the controlled register.

**Asked 28 Sep 2026: add every drug in the lists sent earlier to the app.**
The two lists are the Ministry's register (5,214 registered products — trade
names, no barcodes) and the Essential Drugs List (597 items, ~500 generics).
Proposed:
- **The register's products into the app's catalogue**, as products *with
  no barcode yet* (an internal code, e.g. `REG-R0001`): found by trade or
  scientific name at Point of sale, the count and orders, priced by the
  owner like any product. Where the scientific name is one of the reference
  drugs (~2,170 rows) it is linked, so the Helper checks it; the rest say
  *not checked yet*. When a pharmacy scans an unknown barcode, the CRM's
  mapping links that barcode to its register product. The 29 registrations
  the register notes as **cancelled** are left out; the 32 **suspended** are
  kept but marked and not offered for sale.
- **The Essential Drugs List's generics into the drug reference** — ~400 not
  there yet — as entries with the national code and class and *no clinical
  information yet*: shown in Drugs, not checked by the Helper until the
  curator adds their interactions.
- Cost: the app file grows from ~0.8 MB to ~2 MB (a prototype limit; in
  production this is the database). **Go given 28 Sep 2026.**

### v0.0015.1 as built — roles, the international controlled list, and the drug lists

**Roles.** On *Team*, a **Roles** card: four ready-made — *Cashier* (selling
and the drawer), *Pharmacist* (+ voids and refunds, discounts, own items),
*Stock keeper* (+ stock, write-offs), *Manager* (everything that exists
today; not the near-expiry exchange before v0.0018) — and the owner's own. A
ready-made role is **copied, not edited**; a custom role is a name and
switches, needs at least one, and is **edited in place: the change reaches
everyone who holds it**, and the record says how many ("Edited the Night
pharmacist role (held by 1)"). A role someone holds cannot be deleted. Roles
belong to the owner and work **at all of their pharmacies**, nobody else's.
- Someone invited holds **Cashier** (the default deny of v0.0015, now as a
  role). On their page: a **role picker**; what the role gives is ticked and
  locked, marked *From the role: Pharmacist*; the rest are **extra grants for
  this person alone**, shown as "Pharmacist + Prices". A role's own
  permission is changed by changing the role, not taken off one person.
  Changing role drops extras the new role already covers.
- Setting a role, and creating, editing or deleting one, is on the day's
  record. Only the owner can. *My activity* shows the role and what it gives.

**The controlled list — the UN conventions** (`data/controlled.json`, 36
substances): 1961 narcotics (morphine, pethidine, fentanyl, codeine…), 1971
psychotropics (diazepam, alprazolam, phenobarbital — Schedule IV), and 1988
precursors (pseudoephedrine, ephedrine, ergometrine, ergotamine — Table I).
**Tramadol and pregabalin** are kept, labelled *Controlled in Iraq (not on the
UN schedules)*. The controlled register shows each entry's convention and
schedule; **precursors are listed apart** under their own heading, not in the
controlled register; the source is named under it. Drug and product pages
carry the label. Until the clinical curator confirms the list — the curator
is a placeholder, *to be named*.

**The Ministry's register, in the catalogue.** **5,186 products** (the
register's 5,214 rows, the **28 cancelled** left out), each with an
**internal code** (`REG-R0001`) and *no barcode yet — linked the first time
it is scanned*. Found by trade or scientific name at Point of sale and in
Products; **what can be scanned comes first**, registered
products after. Products lists them only when searched (80 at a time). The
product page shows the composition as registered, the registration number,
maker and country, and a **control banner** when it carries one.
- **2,245 are linked** to the reference by their scientific name, so the
  Helper checks them; a combination with an ingredient the reference lacks
  says *Other ingredients — not in the reference*, and is only partly
  checked. The rest are *unmapped*, as any unmapped product.
- The **7 suspended** registrations (the register lists 7, not the 32
  estimated earlier) are shown with a banner and **not offered for sale**.
- Like any product with no price, the till asks for one before selling.
- 163 products carry a controlled or precursor substance.

**The Essential Drugs List, in Drugs.** The **355 generics** the reference
lacks (the earlier estimate was ~400: salts and duplicates merged) follow
the reference's own 119, under *On the Essential Drugs List — no clinical
information yet* (40 shown until searched). Each has its EDL entries (code,
item, class) and the registered products that name it; the page says
plainly *no doses, no interactions; the Helper does not check it*, until the
curator adds them. In Arabic their name is the scientific name.

**Sizes.** The app file is 2.3 MB (was 0.8 MB) — a prototype limit; in
production the catalogue is the database. Search over ~5,250 products stays
under 40 ms a keystroke (checked).

- Checks: 40 new (658 app in all); CRM unchanged (271). Mutation-tested: 23 of 23 caught (two checks tightened after the first run: a role's own permission added as an extra, and a crash-proof control banner check).

### v0.0015.2 — the teams filled in, and a pharmacist on a team (28 Sep 2026)

Asked: a view for a pharmacist who is part of a team, and team positions
filled for the owners, to see how they look. Demo data, plus two fixes it
showed up.
- **Two new demo accounts** on the sign-in list: **Hassan Al-Dulaimi**
  (`hassan@example.com`), a pharmacist at Al-Rahma, *Pharmacist + Prices*;
  **Maryam Kadhim** (`maryam@example.com`), at two of Layla's pharmacies —
  *Pharmacist* at Al-Hayat, *Manager* at Al-Shifa.
- **Al-Rahma's team:** Hassan; Zahraa Ali (assistant, Cashier); Omar Faisal
  (assistant, Stock keeper); Duaa Salim (left 30 Jun 2026); Mustafa Naji
  (invited two days ago, not yet accepted). Today's record has Hassan's
  no-sale and Zahraa's refused discount; the days before, the invitation, a
  grant and a role change.
- **Layla's:** her custom role *Branch lead* (selling, voids, discounts,
  prices, stock, write-offs, cash differences), held by Karim Mahdi at
  Al-Shifa; Rusul Adnan (Cashier) and Maryam (Manager) there too; at
  Al-Hayat, Maryam (Pharmacist) and Ali Hussein (Stock keeper + Discounts);
  at Dar Al-Dawa, Hiba Saad invited. The other seeded staff have accounts
  (their names show in both languages) but are not on the sign-in list.
- **Fixed:** someone employed at **two pharmacies** had no way to choose one —
  the Point of sale fell back to *check only*. They now get a switch between
  their workplaces (no *All*: they work at one at a time), starting on the
  first; switching keeps them on the screen they were on, and what they may
  do follows the pharmacy.
- **Fixed:** a staff page left open carried over into another owner's Team
  (Layla could open Hassan's page). Team now opens only someone at the
  pharmacy on screen, and signing in clears it.
- Not done — for a mock-up if wanted: a staff member's home says nothing
  about where they work or their role (that is under Profile → *My
  activity*).
- The sign-in list still says the accounts are those of `supabase/seed.sql`;
  Layla and the staff are prototype-only (so is the staff list itself).
- Checks: 13 new (671 app in all); CRM unchanged (271). Mutation-tested: 7 of
  7 caught (two checks tightened after the first run).

### After v0.0015.2 — answered 28 Sep 2026

- **The staff home (1: yes, a mock-up).** Shown: **A** — a *Where you work*
  card at the top of a staff member's home: the pharmacy, district and since
  when; their role ("Pharmacist + Prices") with what it gives, opening *My
  activity*; the drawer's state and a *Point of sale* button for someone who
  sells. Working at two pharmacies, the switch between them sits in the card.
  **B** — only the header changes: "Al-Rahma · Pharmacist + Prices" above
  their name. Waiting for a pick. (Arabic "+ N more" wording to tidy when
  built.)
- **Seed file (2: "seed file").** Looked into it: the codebase's schema is
  still the marketplace model — a pharmacy *is* an account (`profiles.role =
  'pharmacy'`), there is no pharmacist-owns-pharmacies link, and no staff,
  roles or grants tables (nor the till, stock or drawer). Seeding the teams
  properly needs those tables, with their RLS and policy tests, first. Asked
  which way to go.
- **The clinical curator (3a): not yet.** The placeholder stays.
- **Patient history in the Pharmacist role (3b): yes** — the ready-made
  *Pharmacist* role includes it when it exists (v0.0016); still off for
  everyone else unless granted.
- **Linking a register product's barcode (3c): "wdyt".** Proposed: the first
  scan links it **for that pharmacy at once** (the sale goes on — P9), marked
  *linked here, not yet confirmed*, and the Helper says so on that line; it
  becomes the link **for every pharmacy only when the CRM confirms it**. Two
  pharmacies linking the same barcode to the same product put it first in the
  CRM's queue; to different products, it is flagged as a conflict and each
  keeps its own until the CRM decides. Why: a wrong link means the Helper
  checks the wrong ingredients, and one counter's mistake should not reach
  every pharmacy's Helper. Waiting for an ok.

**Answered 28 Sep 2026 (second round).**
- **Staff home: A** — the *Where you work* card. To build (waiting for "go").
- **Seed file: c** — no piecemeal seeding. The codebase catches up with the
  prototype's owner-first model in one planned step (pharmacies owned by
  pharmacists, staff, roles, grants, till, stock, drawer — with RLS and
  policy tests), before the React Native switch.
- **Barcode linking: ok** as proposed above. To build (waiting for "go").
- Asked how each kind of user is treated. In the prototype an owner and a
  team member are both the one account type, *pharmacist*; owning is a link
  to pharmacies and working somewhere is a staff record at one, neither
  stored as a type. In the codebase, a pharmacy is still its own account
  type — which is what (c) fixes. Two gaps found and put to the owner:
  (i) an owner who also works on someone else's team never sees that
  workplace (the view goes to the pharmacies they own, and at a pharmacy
  they do not own they may do nothing); (ii) pharmacy assistants are stored
  as *pharmacist* accounts with a flag, though they hold no licence and
  cannot be Syndicate-verified.

**Answered 28 Sep 2026 (third round).**
- **An owner who also works on someone else's team: yes** — that pharmacy
  becomes one of their tabs, and there they are staff like anyone else.
- **Pharmacy assistants: no.** *Anyone without a Syndicate badge cannot use
  the app.* Every team member is a Syndicate-verified pharmacist.
- **Build v0.0016 with all of it**, and **settle the users issue in the
  codebase too** (the rest of the codebase catch-up stays (c): one planned
  step before the React Native switch).

### v0.0016 as built — clinical governance, patient history, teams by badge only

**Clinical governance (W19, P9).** Every rule has an id — an interaction pair
(`IX:Aspirin|Ibuprofen`), a duplication rule (`DUP:nsaid`) — and a history,
kept in a ledger (`data/rules.json`) that both builds embed: proposed, under
review, approved at a tier by a named person on a date, retired. **A rule
never approved never fires.** The 218 rules built so far are the baseline rule
set (20 Sep 2026), approved at the tier their severity gives, *provisionally,
until the clinical curator — still to be named — reviews them*. Every approval
or retirement is a new version; the rule set of any past day is rebuilt from
the ledger (today: version 3). The fixture shows the life cycle: ibuprofen +
diclofenac as a pair was proposed, approved as a Note on 22 Sep and retired on
26 Sep (the class rule "Two NSAIDs" covers it); fluconazole + atorvastatin is
under review and clopidogrel + fluoxetine proposed — neither fires.
- **Tiers:** Note, Warn, **Stop**. The Stop list ships empty. A Stop is not
  acknowledged by a tap: the Helper asks *why go ahead?*, and with a typed
  reason the sale goes on — the till never refuses (P9). Paying with a Stop
  open opens the Helper for the reason.
- **Every sale records** each rule that fired, its tier, whether it was
  acknowledged, the reason for a Stop, and the rule-set version — the raw
  material of the override report. The Helper names the rule set and who
  approved it.
- **CRM — Rules** (new module): all 221 rules with state, tier, since, by and
  the 30-day override rate; *Rule set as of* a date (version, counts, "the
  Stop list is empty"); views for live, under review, retired, Stop, and
  **flagged for demotion** — over one in five of at least twenty showings,
  Warn or Stop only (aspirin + ibuprofen, 34%). Each rule's history with
  names, dates and reasons. **Only the clinical curator approves, re-tiers or
  retires** — not the owner admin, not operations, who propose and send for
  review. The curator is a placeholder CRM account ("Clinical curator — to be
  named", its own role with that one capability). The CRM and the app rebuild
  the same rule set for any day (checked).

**Patient history (P8).** A pharmacy keeps its own patients: at the Point of
sale, *+ Patient* finds or adds one (name, phone optional) and attaches the
sale. A **Warn can be quieted for that patient**, at that pharmacy — it reads
as a quieted note for them and still warns for anyone else; **a Stop cannot be
quieted**. The patient's page: what they bought here, and what was quieted,
with *Warn again*. The sheet says it plainly — the pharmacy's own record;
Saydali+ cannot read it; no other pharmacy shares it; not the legal register.
Patients are per pharmacy (another pharmacy has none of them). **Patient
history is its own grant**: off by default, in the Pharmacist and Manager
roles. The CRM holds, derives and reads no patient row, and its report tables
have none (checked).

**Teams: a Syndicate badge or nothing.** No position to choose on an
invitation, no assistants (the seeded assistants are pharmacists now). Someone
still waiting for verification sees an invitation but cannot accept until
verified (by button, link or code).

**An owner who also works elsewhere.** Rahma owns Al-Rahma and works shifts at
Layla's Al-Hayat: her tabs are *Al-Rahma* and *Al-Hayat · works here* (no
All). At Al-Hayat she is staff: a staff home, no Team, only what her role
gives, no drawer settings, no inviting. My activity opens for her there.

**The staff home (mock-up A, chosen).** *Where you work* first on the home of
anyone on a team: the pharmacy, since when, the role and what it gives (opens
My activity), the drawer and the Point of sale. Working at two, the switch is
in the card.

**Barcode linking (ok'd).** An unknown barcode can be linked, at the Point of
sale, to a product on the Ministry's register, found by name: it works **at
that pharmacy at once**, marked *Linked here — not confirmed yet*, and the
Helper checks it as that product. Another pharmacy still sees it as unknown.
**CRM — Barcode links** (new module): conflicts first, then links pharmacies
agree on, then single ones, then confirmed; confirming makes it the link for
every pharmacy.

**The codebase — one kind of account (migration 0015).** A pharmacy is a place
a Syndicate-verified pharmacist owns (`pharmacies.owner_id`), not an account;
nobody signed in can create or become a pharmacy account. Teams are
`pharmacy_staff` (invited → active → ended) with ready-made and owners' own
`staff_roles` and extra grants; `has_permission()` decides, and no badge
means no permissions, owner or not. Accepting is `accept_invitation()` —
verified pharmacists only, an emailed invitation only by that address. The old
pharmacy accounts' pharmacies are carried over, unclaimed; the marketplace-era
tables keep pointing at the old accounts until the marketplace returns.
Sign-up has no "I own a pharmacy" option: owners sign up as pharmacists. The
session derives the view (owner / pharmacist) from the links. Seeded: Rahma
owning Al-Rahma and working at Al-Hayat, Layla with three pharmacies and a
"Branch lead" role, Hassan, Maryam and the teams; Noor invited but pending.
**Not yet in the Next.js app:** the screens for adding a pharmacy and running
a team (the server actions exist); they come with the catch-up.

- Checks: app 704 (33 new), CRM 292 (21 new); database 190 (60 new, all four
  suites run on a local Postgres); unit tests 137 (13 new); typecheck and
  `next build` clean. Mutation-tested: app and CRM 19 of 19 caught (one
  check tightened after the first run: a Warn quieted for one patient must
  still warn for a second patient); database 11 planted faults — 8 caught
  by the tests, 3 survived only because a second layer (a trigger behind a
  policy, or a status check behind a date check) still refused, so the rule
  held; one visibility check tightened after the first run.

### v0.0016.1 — reported 28 Sep 2026: an owner's pharmacies, tasks, two kinds of report, a person's record

Reported 28 Sep 2026, as the owner of several pharmacies. **Not built** — each
item says what will be done; A2–A4 wait on the decisions listed with them.

**A1. Choosing a pharmacy throws the owner out of the module they were in.**
On Team with *All* selected, the owner is asked which pharmacy; tapping one
opens that pharmacy's **Home**, and they must tap Team again. The same happens
from the tab strip on any screen but Point of sale and Stock. Cause:
`setPharmacy()` keeps only the till and the stock screens and sends everything
else to the dashboard. **Fix:** choosing a pharmacy keeps you where you are —
Team stays Team (and a person's page closes, since they belong to the other
pharmacy), and the same for every per-pharmacy screen. Home goes to Home only
from Home or the *All* board. *The check asserts:* from Team, choosing a
pharmacy by tab or by the chooser lands on that pharmacy's Team.

**A2. There is nowhere for the owner to give out tasks.** Intentional so far:
tasks are v0.0019 (W18) — due dates, recurrence (the daily fridge-temperature
check is the design case) and completion. The pharmacist's bar already has a
*Tasks* slot marked as coming; the owner has no entry at all, which reads as
missing rather than planned. **To do:** the owner gets *Tasks* in Team (assign
to a person or to whoever is on shift, due date, repeat) and the staff side
fills its existing slot. *Needs deciding:* whether tasks stay at v0.0019 or
move forward.

**A3. Two report sections, not one.**
- **Incidents (البلاغات)** — one person reporting another. Today there is only
  the marketplace's incident screen: tied to a booking, behind Profile, and
  labelled "Reports" in English. With the marketplace off, a pharmacy's own
  people have no way to report anything. **To do:** incidents inside a
  pharmacy — anyone on the team can report, about a colleague or an event;
  the owner receives them. The English label becomes **Incidents**, so
  "Reports" is free for the second section. *Needs deciding:* can staff report
  the owner (and then to whom — the Syndicate escalation is still off); does
  the person reported see it; can a report be anonymous to the owner.
- **Reports (التقارير)** — the owner's module for how the pharmacy and each
  person are doing: the pharmacy's sales and receipts per day, week and month,
  and the same per person (A4). Owner only — not a Manager role, not staff
  (decided 28 Sep 2026). Under **P7** it never ranks people against each other
  by sales: each person is shown on their own page, against the pharmacy's
  average, never in a league table.

**A4. A team member's page: their record, their performance, their access.**
Opened by the owner from Team. Three parts:
- **Timeline** — what they did, shift by shift, not only one day at a time as
  now.
- **Performance** — for a day, a week or a month: shifts worked; per shift,
  sales (IQD) and number of sales, each as **average and median**; the
  period's totals. "Orders" is read here as sales rung up at the Point of
  sale (receipts), not purchase orders — to be confirmed.
- **Permissions** — the role and extras, as now.
A *shift* needs attendance: v0.0017 defines it (check-in to check-out, tied to
opening the drawer). Until then the nearest thing is a drawer session.
*Needs deciding:* whether performance comes with attendance (v0.0017, where
shifts first exist) rather than waiting for v0.0019; whether a person sees
their own figures in My activity.

### After v0.0016.1 was reported — answered 28 Sep 2026

1. **A1 — build it now**, as v0.0016.1.
2. **Tasks stay at v0.0019.**
3. **Incidents:** staff **cannot** report the owner; the person reported
   **does not** see the report; a report is **never anonymous** to the owner.
4. **"Orders" means sales** rung up at the Point of sale (receipts).
5. **Performance moves to v0.0017**, with attendance, since that is where
   shifts first exist — on condition that it does not disturb the other plans.
   It does not: performance is read from attendance and the till, both of
   which exist by then, and nothing later depends on it waiting. v0.0019 keeps
   tasks, the ATC-segmented flags of W18/P7 and the absent owner's day.
6. **A person sees their own figures** in My activity.

So v0.0017 is now **attendance, the owner's Reports module, and a team
member's page** (timeline by shift, performance by day/week/month with average
and median per shift, permissions). Incidents inside a pharmacy (A3) are not
yet placed on the version table; v0.0019, beside tasks, unless moved.

### v0.0016.1 as built — choosing a pharmacy keeps the module

- Choosing a pharmacy — by the tab strip or from the "which pharmacy?" list —
  keeps the owner on the screen they were on for every per-pharmacy screen:
  Point of sale, drawer, **Team**, My activity, Stock and its screens,
  labels. Home stays Home, and the *All* board opens a pharmacy's Home. An
  open person, order or product belongs to the pharmacy it was opened at: the
  person closes and an order or product goes back to its list. Switching to a
  pharmacy where the owner only works and Team is not theirs lands on their
  staff home there.
- The "which pharmacy?" list names what it is for: *Which pharmacy's team?*,
  *…drawer?* — it said *stock* on all of them.
- Checks: app 709 (5 new), CRM 292. Mutation-tested on a copy: 4 planted
  faults, 3 caught; the fourth (not closing the open person on a switch)
  survived only because the person's page already closes itself when that
  person is not at the pharmacy on screen, so the behaviour held.

### v0.0015.3 — the medication database: every drug on the Iraqi market (28 Sep 2026)

*Built in a parallel session on `claude/medication-database-iraqi-oty9g9`, from
v0.0015.2; merged into this line as **v0.0016.2** (below).*

Asked: a database of every known drug, categorised, with brand and scientific
names, each with interactions, contraindications and the notes a patient
should hear, plus the most important questions to ask when dispensing it —
at most three — kept to the Iraqi market, from the Ministry files already in
the repository.
- **1,174 molecules** (from 119), in `data/drugs/`, one file per part of the
  body (32 files); `data/drugs.mjs` joins them. Each has a **category** (136
  classes in 20 groups), scientific and Arabic names, other names, the
  international brands (1,100 have them), ATC, main form, strengths,
  counselling in both languages, contraindications, **one to three questions
  to ask**, and interactions. The migrated 119 kept their wording verbatim
  (checked field by field); metformin's "Contrast media" became the class
  `#contrast`, and metronidazole gained alcohol as an interaction.
- **Interactions three ways:** drug → drug (873 lines), drug → class
  (`#nsaid`, 195 of them), and **57 class rules** that hold whichever two
  members meet (opioid + benzodiazepine critical; strong CYP3A4 inhibitor +
  sensitive substrate critical…). 936 molecules have at least one; the rest are
  mostly topicals, eye drops, fluids and diagnostics.
- **Skin and eye forms are their own entries** where the molecule is also a
  tablet (33: `Diclofenac (topical)`, `Ciprofloxacin (eye)`…), so a gel does
  not raise the tablet's alerts.
- **The register mapped:** `read-sources.py` now matches ingredients by name,
  other names and the register's spellings, splits run-together text, puts
  misspelt names back when one name is clearly nearest (reviewed by hand:
  *tyrosine* is not *thyroxine*, *gemifloxacin* is not *gatifloxacin*, a trade
  name alone is never "corrected"), routes creams and eye drops to the right
  entry, and falls back to brands. **5,103 of 5,186 registered products link**
  (from 2,245). Every generic the EDL names is now in the reference (it was
  355 short); 573 of its 597 lines map (the rest are fragments of the PDF).
- **The app:** the interaction index reads classes and class rules; the
  Helper's questions are each drug's own (contraindications stay on the
  record); search ranks names that start with the query first and also finds
  other names, international brands and registered trade names; the list
  draws 100 and counts the rest, with category chips; a drug's page shows its
  category, other names, brands, how to take it, its questions, what it is
  registered as in Iraq, and its class interactions marked as classes.
  **The CRM** record shows the category, other names, brands, class partners
  and questions.
- **Exports:** `npm run drugs:export` → `data/export/medications.json`,
  `medications.csv` (one row per molecule, both languages, Excel-ready) and
  `interactions.csv`.
- Catalogue fixtures: pseudoephedrine, triprolidine and caffeine are now in
  the reference, so the "outside the reference" examples are a propolis cough
  syrup and royal jelly; Mebeverine 135 mg is mapped.
- **Placeholder clinical content until the clinical curator reviews it** —
  written from standard formulary knowledge, not yet checked line by line by a
  pharmacist.
- Not done: a combination entry for every fixed-dose combination (the
  register's combinations link to their ingredients instead); interactions for
  the ~240 molecules with none listed (mostly topicals); the multi-herb
  formulas (Himalaya and similar) are not in the reference.
- Checks: app 679, from 671 (the drug-list, search, question, coverage, till
  and EDL checks rewritten for the new data; 9 new); CRM 273 (2 new; the CSV-import
  test now adds Tiotixene, since Nystatin is in the reference); unit 135 (11
  new in `tests/unit/drugs.test.ts`).

### v0.0016.2 as built — the medication database merged, under the rule set

v0.0015.3 (above) was built beside v0.0016 from the same starting point; this
brings it in. **Decided 28 Sep 2026:** for the prototype every rule in the
database is approved, like the first 218; **what the rule set looks like at
launch is a decision for then** (open decisions).
- **Data and scripts** merged as built there: 1,174 molecules in
  `data/drugs/`, the register mapping (5,103 of 5,186 products), the exports.
- **The app and CRM:** its screen changes were carried over onto v0.0016.1 —
  class-aware interactions, each drug's own questions, ranked search over
  other names and brands, category chips and the capped list, the richer drug
  page; in the CRM, category, names, brands, class partners and questions.
- **The rule set now governs all three kinds of interaction.** Each has an id
  the curator approves, re-tiers or retires: a drug pair (`IX:A|B`), a drug's
  line against a class (`IX:#nsaid|Warfarin`), and a class rule
  (`CLS:benzo|opioid`, shown in the CRM as a *Class rule*, named by its
  classes). The baseline counts every one of them. Where several rules cover
  a pair, the till fires the worst **live** one: retiring the opioid +
  benzodiazepine rule does not silence diazepam + morphine while the
  opioid + sedative rule still covers it. The app and the CRM rebuild the same
  rule set for any day (checked).
- **The ledger's examples changed:** the database already covers fluconazole +
  atorvastatin and clopidogrel + fluoxetine, so the rules shown *under review*
  and *proposed* are now **allopurinol + amoxicillin** (rash) and **cimetidine
  + metformin**. The ledger check refuses a rule for a pair the reference
  covers by any of the three ways. The data file's class rules are called
  `RULES` there; the ledger is `LEDGER` in the embed script.
- Fixed on the way: v0.0016.1's `<meta name="version">` still said v0.0016.
- Checks: app 725, CRM 295 (the rule counts are now worked out from the data
  file in each check, independently of the build; 9 new); unit 148; typecheck
  clean. Mutation-tested on a copy: 8 planted faults in the new rule code, all
  caught — two only after tightening a check (a milder rule the curator raised
  to Stop must win over a critical one at Warn; a class rule's CRM title must
  be the classes' names exactly).

### v0.0016.3 — reported 28 Sep 2026: search results that all look alike

Reported from Point of sale on a phone (searching "Warf"). **Not built.**

**A1. A search lists three shapes of row.** The same search shows:
- a catalogue product with an Arabic name, and under it the molecule
  ("ماريفان 5 ملغ" / وارفارين);
- a register product found by its trade name, with its name as the Ministry's
  file spells it, full stop and all, and under it strength · maker · *no
  barcode yet* ("Warfarin 5mg tab." / 5mg · Bristol Lab. Ltd · …);
- a register product found by its molecule, with the molecule and *no barcode
  yet* under it ("Marevan 1mg tab." / وارفارين · …).
So the first line switches script and the second switches content depending
on where the row came from and how it matched.

**Where the names stand.** Every one of the 1,174 molecules has an Arabic
name as well as its scientific one (the build refuses one without). Of the
products, the 61 in the catalogue have both; **the 5,186 register products
have only the trade name the Ministry publishes, in Latin script** — the file
has no Arabic names, and it is the name printed on the pack.

**Proposed fix — one row shape everywhere a product is searched** (Point of
sale, the count, a purchase order):
1. **Line 1 — the trade name as on the pack**, always in Latin script and
   tidied: the register's trailing full stops, ® and packaging words
   ("tab.", "Inj.", "sol.for infusion…") stripped, and its capitals made
   regular. A catalogue product shows its Latin name here too; its Arabic name
   moves to line 2.
2. **Line 2 — what it is, in the page's language:** molecule(s) · strength ·
   form ("وارفارين · 5 ملغ · أقراص"). Always these three, in this order,
   whatever matched.
3. **One tag at the end**, the same place on every row, only when it applies:
   *no barcode yet*, *suspended*, or *own item*. The maker moves off the row
   (it is on the product's page).
*The check asserts:* every result row has exactly two lines and at most one
tag; line 1 has no trailing full stop or ®; line 2 names the molecule,
strength and form in the page's language.

**Needs deciding:** whether line 1 should also have an **Arabic** trade name.
The register has none; they could be written by hand for the most-sold
products first, or generated and marked unchecked. Recommended: keep the
pack's Latin name, which is what a pharmacist reads off the box.
**Decided 28 Sep 2026: keep the Latin names** as on the pack.

### v0.0016.3 as built — one shape for every search result

- **One row everywhere a product is searched** — Point of sale, the count, a
  purchase order: line 1 the name on the pack, in Latin script, for catalogue
  and register products alike (a catalogue product's Arabic name stays on its
  page and on the cart, not on the search row; a pharmacy's own item shows the
  name it was given); line 2 molecule · strength · form in the page's
  language; one tag at the end, in the same place, only when it applies —
  *no barcode yet*, *Suspended* or *Own item*. The maker left the row. Each
  line is one line, cut rather than wrapped, so every row is the same height.
- **The register's names are tidied once, where the products are built**, so
  the cart, the stock screens and the product page read the same: ®, ™,
  brackets, trailing full stops and packaging words ("tab.", "Inj.", "powder
  for solution for infusion…") are dropped, units spaced ("5mg" → "5 mg") and
  all-capital or all-lower names given ordinary capitals. "Warfarin 5mg tab."
  is **Warfarin 5 mg**. Tried on all 5,186: none comes out empty. The name as
  registered is kept (`trade`) and still searched.
- A product with no molecule linked says *not linked to a medicine yet* on
  line 2; a combination's unknown part reads *other ingredients* in the page's
  language.
- Checks: app 734 (9 new), CRM 295. Mutation-tested on a copy: 6 planted
  faults, all caught — one only after tightening a check (the registered
  wording is searched: "pyrogenic", which is only in the name as registered,
  finds Solu-pac).

### v0.0017 as built — attendance, the rota, performance and the owner's Reports

As planned (W18, the v0.0017 entry above) with the decisions of 28 Sep 2026.
- **Shifts.** A shift is one person's, at one pharmacy: *Check in* / *Check
  out* on the home of anyone on a team, and on the owner's own home — **the
  owner has shifts too**. The work checks you in as well: opening the drawer
  or ringing up a sale opens a shift if none is open, and the timeline says
  which ("Checked in — rang up a sale").
- **A shift nobody checked out of** stays open until its scheduled end plus a
  **60-minute grace period**, then closes itself **at the scheduled end** (12
  hours on for a day that is not on the rota), marked as such — it never
  counts as a clean shift. At the next check-in the person is asked when they
  left, with the last thing they did there beside the question ("Last activity
  there: a sale of 12,000 IQD, at 22:17"). **The claim and the owner's
  decision are two facts**: the owner accepts the time or sets another, and
  the claim stays as it was given. Both for seven days only. A person cannot
  decide their own; the owner is told on Team and Reports ("Check-out times
  waiting for you"). **Three in thirty days** is marked on the Team list.
- **The rota is the owner's:** days and hours per person, on the person's
  page (the owner's own on theirs). **Every change is on the timeline — the
  owner's and the person's** — with the schedule before and after. Nobody else
  can change one.
- **A team member's page** (from Team, or from Reports): their schedule, then
  **their shifts one by one** for a day, a week (Saturday to Friday) or a
  month — hours, sales, number of sales, what happened on each, and the
  claim and approval where there are — then **their performance**: shifts,
  hours, sales (IQD), number of sales, and per shift the **average and the
  median** of both, **beside the pharmacy's average per shift**; then their
  permissions, as before. The owner has the same page for themselves (the
  first row on Team).
- **The owner's Reports** (a new item on the bar and in the sidebar: owner
  only — not a Manager role, not an owner where they only work): the
  pharmacy's figures for the period, check-out times waiting, the sales day
  by day, and **the people, by name**, with shifts and hours only — **no
  screen ranks anyone by sales (P7)**. The switch **Share these figures with
  Saydali+**: on by default, the owner's to turn off, on the record.
- **My activity**: your shift, your schedule, your shifts and **your own
  figures** — without the pharmacy's average, which is the owner's.
- **The CRM** shows, on a pharmacy's record, what its owner shares: the last
  30 days' sales, their number, shifts, and per shift the average and the
  median — the pharmacy's totals, never a person's; a pharmacy whose owner
  turned sharing off (Dar Al-Dawa, in the fixture) says so and has no figure
  anywhere. A new report table, `pharmacy_reports` (pharmacy, day, sales,
  number, shifts), holds only pharmacies that share.
- **The history** (`data/history.mjs`): each pharmacy's people and schedules
  and a generator for five weeks of shifts and sales from them, embedded in
  both builds so the app and the CRM agree to the dinar (checked). Zahraa has
  three forgotten check-outs — one approved, one waiting, one too old to
  claim — and Hassan is on shift now. The sales stand for what the server
  holds, apart from this device's own.
- Fixed on the way: Arabic section headings were spaced letter by letter
  (the monospace eyebrow style), which breaks the joined letters; in Arabic
  they now use the Arabic font with no spacing.
- **Not in the codebase yet:** attendance, the rota and the Reports are in the
  prototypes only; the tables come with the codebase catch-up.
- Checks: app 759 (25 new), CRM 300 (5 new), unit 155 (7 new, for the
  history); typecheck clean. Mutation-tested on a copy: 14 planted faults,
  all caught — one only after adding a check (an owner cannot approve a claim
  on their own shift: the first check tried it as a staff member, who is
  refused for another reason).

### v0.0018 as built — the near-expiry exchange (W22)

As planned, with the open points of W22 settled as the v0.0018 entry above
has them.
- **What can be listed:** a pharmacy's own batches within **90 days** of
  expiry (the app's near-expiry window) — per batch, by the owner's choice,
  never automatically: how many boxes (never more than the batch holds, less
  what is already on offer), a price a box or none ("price on asking"), and a
  note. **Controlled substances and precursors cannot be listed** — the batch
  says so and the listing is refused (Lyrica, pregabalin, at Al-Rahma).
- **Who sees it: pharmacies within 6 km**, by distance from a district's
  rough centre, not by district (`data/exchange.mjs`) — Karrada sees Jadriya
  (4.5 km) and Zayouna (4.6 km), not Mansour (7.1 km). Never your own; not
  once withdrawn, all taken, or past its expiry. **A listing names no
  pharmacy** ("A pharmacy in Jadriya · 4.5 km") until you ask; then each side
  is named to the other.
- **The steps:** *Ask for it* (how many) → the listing pharmacy *Agrees* or
  *Declines* → *Handed over*, which takes it **out of their batch as a stock
  movement** (`exchangeOut`) → the other pharmacy's *Received*, which puts it
  **into a new batch of the same expiry as a stock movement** (`exchangeIn`,
  the agreed price as its cost). Every step is on each pharmacy's own
  timeline.
- **No money passes through Saydali+**: nothing records a payment; the screen
  says to settle between you.
- **Who:** the owner by default; grantable to a team member ("Near-expiry
  exchange" is no longer "arrives later"), and in the Manager role. The way in
  is on the Stock screen and in the sidebar, and on a staff home for someone
  granted it.
- **The CRM:** the listings as a report table (`exchange_listings`: what, how
  many, the expiry, the asking price) — no table of payments, buyers or
  settlements.
- **Seeded:** Layla lists Augmentin at Al-Shifa, Lipitor at Al-Hayat and
  Nexium at Dar Al-Dawa; Al-Rahma has Augmentin and Lyrica near expiry to list
  (and refuse).
- **Not in the codebase yet:** the permission list there still says the
  exchange arrives later (`LATER_PERMISSIONS`); it changes with the catch-up.
- Checks: app 774 (15 new; 4 older ones updated — the exchange can be granted
  now, the Manager role holds it, and the seed adds near-expiry batches), CRM
  303 (3 new), unit 159 (4 new); typecheck clean. Mutation-tested on a copy:
  12 planted faults, all caught on the first run.

### After v0.0018 — answered 30 Sep 2026

- **The choices made in v0.0018 stand** (corrected 30 Sep 2026 — the
  agreement was for v0.0018's only): nearby is 6 km from a district's
  centre; the listing window is 90 days; the codebase's permission list
  changes with the catch-up. **v0.0017's four are still open:** a 60-minute
  grace period (12 hours on a day not on the rota); staff see their own
  figures, not the pharmacy's average; weeks run Saturday to Friday; the CRM
  gets the last 30 days' pharmacy totals.
- **Saydali+ must be able to remove a bad listing** — v0.0018 left the CRM
  read-only. Recorded as A1 below.
- **Reminders wait until after v0.0019.**

### v0.0018.1 — reported 30 Sep 2026: the CRM takes a bad listing down

**Built with v0.0019** (see below). **A1. A listing Saydali+ can remove.** In the CRM, a new
*Exchange* module lists every listing (pharmacy, product, expiry, how many,
price, state) with *Take down*: a reason is required (from a short list —
controlled or regulated, wrong product or expiry, suspected counterfeit or
unsafe, other — plus words), and the take-down is on the record with who and
when. In the app the listing leaves every nearby pharmacy's list at once; the
listing pharmacy sees it as *Removed by Saydali+* with the reason. A request
already agreed is cancelled with the same reason; stock already handed over
stays where it is (the movements happened). *Needs deciding* with v0.0019's
decisions: which CRM roles can take down (proposed: owner admin and admin,
not employees), and whether a removed listing can be listed again after
correction (proposed: yes, as a new listing).

### v0.0019 — decided 30 Sep 2026

**Tasks**
1. The owner gives tasks, and anyone granted **Assign tasks** (a new
   permission, in the Manager role).
2. A task goes to **a person by name, or to "the whole desk"** — everyone on
   shift sees it, and it is done when any one of them ticks it.
3. Once, daily, chosen weekdays, weekly or monthly, with a due time.
4. *Asked to explain* — a task that asks for a reading (the fridge
   temperature, with its safe range; out of range tells the owner at once).
5. A task not done by its due time is **missed**: on the record, shown to the
   owner, not carried over — **mock-up first** (shown 30 Sep 2026: A, missed
   tasks on their own on the away-home; B, one list for the day; and the
   staff view; plus whether "done late" is allowed).
6. *Asked to explain* — whether ticks count in the performance figures.

**Incidents**
7. Kinds: conduct, cash, stock or suspected theft, dispensing error or patient
   safety, other.
8. A report can be linked to a sale.
9. The owner acknowledges, keeps private notes, and closes — and **may write a
   note to the person who reported it**, which they see (optional). The
   reporter otherwise sees only received / closed.
10. **The CRM holds only the number of incidents at each pharmacy** — nothing
    about what they are, who, or when beyond the count.

**The away-home**
11. Since the owner last looked (or today): simple and presentable.
12. **Every check-in is recorded, whenever it happens. No check-in within one
    hour of the scheduled start is an absence** — kept even if they check in
    later — and **the owner can override an absence** (on the record). No
    separate "late" mark (read this way; to be confirmed).
13. In the phone app, an instant alert for a new incident, a reading out of
    range, a Stop gone ahead with, and a drawer difference over the owner's
    amount.

**Sales per pharmacist (P7)**
14. Against the pharmacy's own average now; the district's once at least five
    pharmacies in it share (the minimum N of five). *Asked why this is in.*
15. A flag at 1.5 times the pharmacy's share, over at least 30 sales, worded
    as a question.

**v0.0018.1**
16. Owner admin and admin take listings down, not employees — for now.
17. A removed listing can be listed again after correction, as a new listing.

### v0.0019 — the rest answered 30 Sep 2026

- **v0.0017's four choices stand**, with one change to the first:
  1. The grace period (60 minutes; 12 hours on a day not on the rota) stays,
     **but always with reminders**: at the scheduled end, "Your shift ended
     at 16:00 — check out?", and again before the grace period runs out,
     "Your shift closes itself at 17:00". On the person's home and in the
     bell; a push notification in the phone app. *(v0.0017.1, built with
     v0.0019.)*
  2. Staff see their own figures, not the pharmacy's average.
  3. Weeks run Saturday to Friday.
  4. The CRM gets the last 30 days' pharmacy totals when sharing is on.
- **4. Readings: yes** — a task can ask for a number with a safe range; out
  of range tells the owner at once.
- **6. Ticks do not count** in the performance figures; they show on the
  timeline and the owner's home only.
- **14. The P7 flags: as proposed.**
- **12. A "late" mark as well:** a check-in more than 15 minutes after the
  scheduled start is late; no check-in within one hour is an absence (kept
  even if they check in afterwards); the owner can override either, on the
  record.
- **5. Mock-up A:** the away-home shows missed tasks on their own, first,
  and everything else as numbers.
- **"Done late": yes** — a missed task can be ticked until the end of the
  day, kept as late, never as on time.

### v0.0019 as built — tasks, incidents, and the absent owner's day (W18; P7), with v0.0017.1 and v0.0018.1

**Tasks.** A *Tasks* screen for the owner and for pharmacists on a team.
- The owner gives them, and anyone granted **Assign tasks** (a new
  permission, in the Manager role): to **the whole desk** or to **someone by
  name**; once, daily, chosen weekdays, weekly or monthly; with a due time and
  a start day.
- A task can **ask for a reading with a safe range** (the fridge: 2–8 °C). A
  reading outside it is kept and **tells the owner at once** (the bell; a push
  in the phone app later).
- A task not ticked by its due time is **missed** — read from the ticks,
  never stored, not carried over. It can be ticked **until the end of that
  day**, and is then kept as *done late*, never as on time.
- A desk task is done when any one of them ticks it. A task given by name is
  that person's alone.
- **Ticks never count in the performance figures.** They show on the
  timeline, the Tasks screen and the owner's home.
- **Seeded at Al-Rahma:** the fridge at 09:00 and 21:00, and the near-expiry
  shelf at 12:00 (all for the desk); Omar's weekly count of Shelf 1. There is
  a week of ticks behind them: the last morning fridge check was missed, and
  one reading three days back was 9.1 °C.

**Incidents.** Anyone on the team reports one to the owner, from their
home or the *Incidents* screen.
- **Kinds:** conduct, cash, stock or suspected theft, dispensing error or
  patient safety, other. A report can be linked to a sale.
- **Never about the owner, never about yourself, never about someone off the
  team, never anonymous.** The person it is about does not see it. The
  timeline entry says a report was made and names no one else.
- **Who sees what:** the owner sees every report. A reporter sees only their
  own, with its state and any note the owner wrote back.
- **What the owner does:** acknowledges it, keeps private notes, may write
  one note back to the reporter, and closes it.
- **The CRM holds only how many there are at each pharmacy.** The pharmacy
  record shows the count, and the `pharmacy_incidents` table has two columns:
  the pharmacy and the number. The build carries nothing more: no text, no
  names, no ids.

**Late and absent.**
- Every check-in is recorded, whenever it comes.
- **Late** is more than 15 minutes after the scheduled start. **Absent** is
  no check-in within the hour, and stays absent even if they check in
  afterwards.
- A day off the owner gave is **leave**, not an absence.
- The owner **excuses** either one, on the record (`attExcused`). Nobody else
  can, and never for themselves.
- On a person's page: their late and absent days in the period, each with
  *Excuse*.
- Seeded: Omar was absent at his last shift and 35 minutes late the one
  before; Zahraa was 22 minutes late four shifts back. These are counted in
  scheduled shifts, not calendar days, so the seeded days are always working
  days, whatever day it is.

**P7 — a question, never a ranking.**
- On a person's page, for the owner only: if their share of sales with an
  antibiotic (J01) or a controlled substance is at least **1.5 times the
  pharmacy's own share**, over **at least 30 sales**, it is shown as a
  question, with the reasons it might be innocent.
- Seeded: Zahraa's antibiotics are 35% against 22% for the pharmacy.
- The district comparison waits for five pharmacies there that share.

**While you were away (mock-up A).** At the top of the owner's home:
- the sales today, tasks done out of those due, and the number missed;
- **the missed tasks listed first**;
- then one line each: who is late or absent today (opens their page),
  readings out of range, new incident reports, drawers waiting, sales that
  went ahead on a Stop, and refused actions.
- *Seen* starts it again from now. Only the owner has the card.

**v0.0017.1 — check-out reminders.**
- An open shift warns **at the scheduled end** ("Your shift ended at 15:00 —
  check out?").
- It warns **again 15 minutes before it would close itself** ("Your shift
  closes itself at 16:00 if you do not check out.").
- Both appear on the person's home and in the bell, each once, and only for
  that person. The phone app will add a push.

**v0.0018.1 — Saydali+ takes a bad listing down.**
- A new CRM *Exchange* module lists every listing, with its state.
- **Admins and owner admins** can *Take down*; employees are neither offered
  it nor allowed.
- It needs a reason chosen from the list (controlled or regulated, wrong
  product or expiry, suspected counterfeit or unsafe, other) and words. It
  is kept with who and when. `exchange_listings` gains `state`.
- In the app, the listing leaves every list at once, and requests not yet
  handed over are cancelled. The listing pharmacy sees *Removed by Saydali+ —
  the reason: the words*, and the pharmacy that asked sees its request
  cancelled.
- Seeded: Concor 5 mg at Al-Hayat, taken down because the listed expiry did
  not match the pack.
- A corrected listing is listed again as a new one.

**Left over.**
- The forgotten check-outs seeded in v0.0017 (`HISTORY_AUTO`) still count
  calendar days. On some weekdays one can fall on a day off and drop out. It
  should move to scheduled shifts the way late and absent now do.
- Seeded task titles are English (as Rahma typed them). A title shows as it
  was written.
- Tasks, incidents, late/absent, excuses, the take-down and the incident
  counts are **not in the codebase yet**. They come with the catch-up.
- Instant alerts are in the bell only; push waits for the phone app.

Checks: app 810 (36 new; 3 older ones updated — incidents are now
reachable with the marketplace off, and the Tasks placeholder changed), CRM
308 (5 new; 3 older ones updated for the 16th tab, the removed listing and
the `state` column), unit 164 (5 new); typecheck clean. Mutation-tested on
a copy: 17 planted faults. 13 were caught on the first run. Four got
through, and each was a gap in the checks:
- a report about the owner, which was only ever tried as someone off the team;
- ticking someone else's task;
- the CRM employee's attempt, which was refused for the missing reason and
  not for the role;
- the reading alert, which was caught only by a crash.

All four are caught now.

The run also turned up a v0.0017 race. The claim form's last activity
compared a sale with its own timeline entry, and the entry could be stamped
a millisecond later, which changed the evidence's wording. A sale is now
read only from the sale itself.

### v0.0019.1 — reported 1 Oct 2026: attendance in Reports, and a simpler owner's app

**Built (see v0.0019.1 as built).**

**A1. The attendance schedule in Reports.** The owner sees the weekly and
monthly attendance in the Reports tab: who was due when, and whether they came
on time, late, were absent, on leave, or were excused. Today it lives only on
each person's page.

**A2. The owner's app got cluttered.** Simpler and easier to use: someone who
opens it must not get lost between options. The user suggested tabs inside
the modules and different outline colours for the most important sections.
What the screens show today (1 Oct 2026):
- **The home has two lists of what needs the owner:** *While you were away*
  and *Needs you*, one after the other. Sales today shows twice (a tile and the
  big figure). The home is seven blocks: the away card, sales, two buttons,
  check-in, Needs you, and the Saydali+ card.
- **The sidebar is 14 flat entries** with no grouping, and **"Reports" appears
  twice**: the incidents entry is labelled "Reports" in English
  (`nav.incidents`). The Arabic reads البلاغات, so it is an English-only slip.
- **Team stacks nine sections:** check-out claims, Tasks, Incidents, staff,
  invitations, Invite, Roles, day by day, and former staff. Check-out claims
  also appear in Reports.
- **Pharmacy already has tabs** (Point of sale, Stock, Drugs). That is the
  pattern to extend.

**Mock-ups shown 1 Oct 2026.** *Answered 1 Oct 2026: **Option A**; the three outline levels stand for now ("we'll see"); this is **v0.0019.1**, before v0.0020. **The Saydali+ announcement card stays on the home, smaller and higher:** a compact card (its tag, a title and one sentence; about two-thirds of today's height, not a one-line strip) under *Open point of sale*, above *Needs you*. It opens the full news when tapped. **Closing it (×) shrinks it to the slim one-line strip** (the tag and the title cut to one line) in the same place, and it stays slim from then on. **It is there until it is opened** — the strip has no ×; opening the news (from the card or the strip) is what clears it. A newer item from Saydali+ arrives as the compact card. Answered 1 Oct 2026. Answered 1 Oct 2026.*
- **The home: one list of what needs you.**
  - *Option A, recommended:* today's figures, *Open point of sale*, and one
    *Needs you* list grouped as **Act now** (red outline), **Today** (amber
    outline) and *when you have a minute* (no colour).
  - *Option B:* tabs on the home (Today · To do · Day by day), with only
    *Act now* items on the first tab.
  - In both, your own check-in moves to the header. (The Saydali+ cards were
    proposed for More; answered: they stay on the home as a compact card.)
- **Five places with tabs inside:**
  - Home.
  - Pharmacy: Point of sale · Stock · Drugs · **Exchange**.
  - Team: **People · Tasks · Incidents · Log**. Invitations, roles and former
    staff become quiet rows.
  - Reports: **Sales · Attendance · People**.
  - More: post a shift, trainees, consumption, billing, notifications,
    profile and CV.
- **The sidebar** becomes the same four places, then More and You in a quieter
  colour. This drops the duplicate English "Reports".
- **Reports > Attendance (A1):** a week grid (people × days; a tick, minutes
  late, Absent, leave, or the start time still to come; excuse from a cell) and
  a month view (one strip of days per person, with the counts and hours
  written beside it).
- **What the colours mean** is fixed everywhere:
  - *Act now:* patient safety, money, or a person missing.
  - *Today:* waiting on a decision or due today.
  - Nothing else is coloured.

### v0.0019.1 as built — a simpler app for the owner, and attendance in Reports

**Five places, the same on the phone and the computer:** Home, Pharmacy,
Team, Reports, More.
- **Tabs inside each module** (the pattern Pharmacy already had):
  - Pharmacy: Point of sale · Stock · Drugs · **Exchange**.
  - Team: **People · Tasks · Incidents · Log**.
  - Reports: **Sales · Attendance · People**.
- A tab shows a count only when something there needs the owner: missed tasks
  in amber, open incidents in red, and on Attendance the absences waiting and
  the check-out times to approve.
- A person's page has no tabs. The module's name is the header on every tab,
  and its button stays lit.
- On *All* (an owner of several), Team and Reports first ask which pharmacy,
  with no tabs over the question.
- **The sidebar has four places, then More, then You.** Tasks, Incidents and
  the Exchange are no longer separate entries.
- **The English incidents entry said "Reports"**, so "Reports" appeared twice.
  It now says Incidents.
- **The phone bar's fifth button is More** (it was Profile). More lists only
  what is not on the bar.
- **Home and Team carry counts on the bar and in the sidebar:** what needs you
  now or today, and the open incidents.

**The home (mock-up A).** In this order:
1. Your own shift, compact.
2. Today at a glance: sales against yesterday by now, tasks done and missed,
   and who is on shift.
3. *Open point of sale*.
4. The Saydali+ card.
5. **One *Needs you* list.**

The away card and the old *Needs you* are merged into that one list. The
groups:
- **Act now (red outline):** readings out of range, someone absent today, new
  incident reports, Stops gone ahead with, expired stock, an offline
  controlled-substance conflict.
- **Today (amber):** missed tasks, someone late, check-out times and drawers to
  approve, stock near expiry or to count.
- **The rest** folds under *"N more when you have a minute"*.

How the list behaves:
- Each group is named, so colour is never the only signal.
- *Seen* clears what happened (readings, reports, Stops, refusals). What still
  needs doing (stock, drawers, approvals) stays.
- The week's line and *Count a shelf* left the home. The days are in
  Reports > Sales, and counting is in Stock.

**The Saydali+ card:**
- It is compact under the till button: its tag, a title and one sentence.
- × shrinks it to a slim one-line strip, for good, with no ×.
- It stays until it is opened. Opening it goes where it says and is counted.
- The state is per person. A newer announcement arrives as the compact card.

**Team > People:**
- *On shift now* (who, since when, and who is due).
- Each person's place today: On shift, Absent, Due 16:00, On leave or Off
  today.
- Invitations, invite, roles and former staff fold away.
- The day by day is the Log tab.
- Check-out times to approve are on the home and in Reports > Attendance,
  not on Team.

**Reports > Attendance (A1):**
- **The week** is a grid, a row a person and a cell a day. Each cell shows a
  tick for on time, the minutes late, Absent, Excused, Leave (hatched), or the
  start time still to come. A day off the rota is empty.
- Each cell tells a screen reader what it is, and a legend sits under the
  grid.
- Tapping a cell opens that person at that week.
- The counts for the period are written above the grid. The check-out times
  waiting sit below it, then *Waiting for your decision*: each absence or late
  day with **Excuse**, on the record.
- **The month** shows a strip of days per person, with the counts and the
  days and hours worked written beside it.
- The view moves back and forward a week or a month at a time, never into the
  future. It belongs to the owner, as the rest of Reports does.

**Reports > Sales** keeps the period, the pharmacy's figures, the days and the
sharing switch. **Reports > People** lists people by name, never by sales
(P7).

**Fixed on the way:** the stock seed backdates the opening count three days,
and it worked out the expiry months on that shifted clock. On the 1st to 3rd
of a month every seeded expiry slipped a month, so "the till sells
first-expiring first" failed on 1 Oct (in v0.0019 as well). The months are now
counted from today.

**Left over:**
- The design detector flags the incumbent look: the Space Grotesk face, the
  announcement's sheen and glow, and its radial halo. They are kept, because
  this was a refinement, not a redesign. It also flags the hatched *Leave*
  cell, which is kept on purpose: the pattern is what tells leave apart
  without colour.
- Seeded task titles are still English, as typed.
- Staff (not owners) keep their own bar: Check-in, Tasks, Pharmacy, Profile.
- Not in the codebase yet; it comes with the catch-up.

Checks: app 839 (29 new; 24 older ones updated for the new home, the tabs,
the Log tab and the bar, and 3 anchored a week back so the 1st of a month
still has history in them). CRM 308 (its link now opens the v0.0019.1 build).
Unit 164. Typecheck clean. Mutation-tested on a copy: 17 planted faults, and 16 were caught on the
first run. The one that got through (the list unsorted) showed a real slip:
the list is drawn group by group, so the order inside Act now followed the
order things were found in, and **a controlled substance sold twice offline
was no longer at the very top** once someone was absent (v0.0014, D5). It is
first again, and a check now proves it with an absence on the list. All 17
are caught.

### v0.0019.2 — reported 3 Oct 2026: too many words

**Not built — mock-ups first.** The prototype reads as too much text,
especially the figures for team members. Measured on 3 Oct 2026, a team
member's page (Zahraa, September) is **620 words, 382 of them explanation**,
in one scroll about 3,500 px tall:
- details and schedule;
- 22 shifts of two lines each;
- the late and absent days again;
- a table of average, median and the pharmacy's average, with two notes;
- the P7 question as a paragraph;
- 14 permissions, each with its own sentence.

The worst after it are Tasks (82 words of notes), Hassan's own Activity
(48) and Stock (42).

**Mock-ups shown 3 Oct 2026:** a team member's page in **three tabs**:
- **Overview** (about 70 words): four numbers (shifts, hours, sales in IQD,
  number of sales); *a shift, on average* as two bars, theirs and the
  pharmacy's, with one line beneath; the month's attendance as the strip from
  Reports, with its counts as chips; the P7 question in one line.
- **Shifts:** one line a shift (day, in–out, sales, amount). Late, no
  check-out and accepted are chips. The latest eight, then *Show all*.
- **Permissions:** the role, then one line and a switch each. What a
  permission does is behind its ⓘ.

**The rules proposed for the whole app:**
1. Numbers and chips, not sentences.
2. Explanations behind an ⓘ: one tap away, never deleted.
3. Long lists folded, with *Show all*.
4. Say it once.
5. Bars where the point is a comparison.

They apply to staff's own Activity, Reports > Sales, and the standing notes
on Tasks, Incidents, Team and Stock.

**Every view, every user — audited 3 Oct 2026** (98 views across ten people,
each with its word count; the contact sheets were shown). What is out of line
with v0.0019.1:

*The staff side is still the old design* (Hassan, Zahraa, Omar, Maryam):
- **The bar:** Check-in · Tasks · Pharmacy · Profile. Home is called
  "Check-in", there is no More, and Incidents is behind Profile while Tasks
  is on the bar.
- **No counts on the bar.** Hassan has two tasks missed and nothing says so
  outside Tasks.
- **No *Needs you* list and no Act now / Today colours on the home.**
  "Tasks · 3 still to do today" hides that 2 are missed.
- **The Saydali+ card is the old full-size one,** with no ×.
- **Headers name the person** ("HASSAN AL-DULAIMI · Tasks"); the owner's name
  the pharmacy.
- **My activity is the long page:** 368 words for Zahraa's month.

*Gaps:*
- **Maryam works at two pharmacies.** Her home switches between them with tabs
  inside a card, where the owner's switch is a row of chips. **Her Tasks has
  no pharmacy switch at all,** so as a Manager she can give a task without
  the screen saying which pharmacy it is for.
- **Ahmed and Noor, on no team yet:** Tasks stays on the bar ("Tasks start when
  you join a pharmacy's team"), and Incidents behind Profile. The Saydali+
  card announces the Point of sale to someone who can only check with it.
- **Rahma at Al-Hayat, where she only works:** she gets the staff home, her
  bar is Home · Pharmacy · More, and Tasks and Incidents open under a "Team"
  header that nothing on the bar lights.
- **Layla on All:** each pharmacy's "need you" count is still the old one
  (stock and drawers only); the pharmacy's own home counts missed tasks,
  absences and readings too. The Saydali+ card sits at the bottom there.
- **Zainab, a student,** is shown "Point of sale is here", an announcement
  for pharmacies.

## Unused concepts

Ideas that were considered and set aside — kept, with why, so they are not
rediscovered as new or lost when circumstances change.

- **T1. Sell from day one, count later** (set aside 26 Sep 2026). The till
  would work with nothing counted; every product sold before being counted
  would join a "count this" list, most-sold first, and a disclaimer would say
  so: *"You can sell before you count. Until a product is counted its stock
  figure is not real: sales can take it below zero, and it joins **Count
  this**, most-sold first. Nothing is ever blocked."* Set aside in favour of
  counting first (scan by shelf, or a spreadsheet). S1 — never refusing a
  sale over a stock figure — is unaffected.
- **T8. "Expiry unknown" at the opening count** (set aside 26 Sep 2026): in
  tension with W17 — unchecked boxes would count as available.

## Reminders

- **After v0.0019 — the phone app and the stores.** *(Brought back with
  v0.0014's notes; delayed to after v0.0017 on 28 Sep 2026, brought back
  with v0.0018's notes, and **delayed again to after v0.0019** on 30 Sep
  2026 — every reminder waits until then; **brought back with v0.0019's notes**. The steps from here to the stores
  were set out on 30 Sep 2026; see "From the prototypes to the stores" under
  the open decisions.)* Meanwhile: keep the hardware test on its own
  track (the printer and a wedge scanner can be tested from the web build);
  no pharmacy runs its till on a prototype. Raised 26 Sep 2026: when
  to move to React for Google Play and the App Store. The recommendation given,
  not yet decided: the project already has React (the Next.js codebase); the
  phone app should be **React Native with Expo**, sharing the business rules
  and data with the web app, because the till needs Bluetooth printing,
  reliable camera scanning and offline storage that a website cannot give on
  an iPhone. Start it **after v0.0014** (the offline model proven), **after
  the hardware test** (the printer decides the Bluetooth code) and with the
  five owner conversations done; the prototypes' checks become the real app's
  acceptance tests. Needed for the stores: a Google Play developer account, an
  Apple developer account, a privacy policy covering patient data, and the
  name (W9). **Bring this back to the user with v0.0019's notes.**

## The non-code track

These are yours, and several gate the production track. None is a coding task.

1. **Name the clinical curator** (W19) — before v0.0016 leaves the prototype.
2. **The catalogue go/no-go** (W17) — ten hours, a hundred real SKUs seeded from
   Kimadia / MoH registration lists, mapped to molecules. Count how many map
   cleanly. Before any production work on System 1.
3. **Certify the hardware** (W17) — buy one or two Bluetooth thermal printers
   and a wedge scanner and test Arabic bitmap receipts on them. Before v0.0012's
   receipt is shown to a customer.
4. **Five owner conversations** with v0.0012–v0.0014 in hand.
5. **Price the two systems** — gates v0.0020.
6. **Choose the name** (W9) — before the first sale.
7. **Word the moonlighting clause** (W21) — before the first shift credit.

## Open decisions

- **v0.0013.4 built** — one Pharmacy module (Point of sale · Stock ·
  Drugs); the till renamed Point of sale.
- **v0.0013.5 built** — the UI review (U1–U9).
- **Banner presses in the CRM:** the app counts them; the CRM's listing
  record does not show them yet, nor where an announcement leads.
- **v0.0013.3 built** (search by any name; stock without barcodes; own
  items). **Permissions moved up to v0.0015** (26 Sep 2026) — it will carry
  "may add items" for staff.
- **Own items in the CRM** — the app sends them to the mapping queue by name,
  but the CRM prototype's queue still lists barcodes only; showing a by-name
  request (and mapping it) is a CRM change to schedule.
- **UI amendments continue** until the UI is approved.
  **A controlled-substance schedule** is still needed before production.
  **UI approved for now (27 Sep 2026).** **v0.0014 built.**
- **The price of the two systems**, and whether Basic 9,000 / Premium 19,000
  survive as they are once the marketplace is dark.
- **A pharmacist-side subscription** — still needed before half of W16 is real.
- **The name** (W9).
- **W8's legal read**, now extended to patient history kept by the pharmacy (P8).
- **The rule set at launch (decided to be decided, 28 Sep 2026).** In the
  prototype every rule in the medication database is approved. Before launch:
  which of its rules go live on day one, which wait for the clinical curator,
  and at what tier — the database's clinical content is still a placeholder
  until a pharmacist checks it line by line.
- **W7's three leftovers.**
- **F8**, parked by decision until before the ecosystem step.

**Settled since this list was first written:** receipt contents, language and
tenders; each pharmacy's own price against an average market reference;
usage-level default instructions; partners hidden and announcements on;
placements staying on; exact totals with no cash rounding; and discounts as
the owner's alone, with a reason. See "Before v0.0012" above.

---

# Part 1 — Work

### From the prototypes to the stores (set out 30 Sep 2026)

The two HTML files are the specification — every screen, rule and check —
not the product. What ships is the Next.js + Supabase codebase for the web
and the CRM, and a React Native (Expo) app for Android and iPhone, sharing
the business rules (`src/lib`) and the database.

1. **Freeze the prototype** at a version and treat its checks as the
   acceptance tests.
2. **The codebase catch-up (the decided "c"):** Supabase tables and access
   rules for everything built since the marketplace — catalogue and register,
   Point of sale, drawer, stock, rules ledger, patients, teams, shifts,
   Reports, the exchange — each with its database checks, as migration 0015
   was done. The Anthropic key stays on the server.
3. **The offline model for real:** a local database on the phone that syncs
   (the v0.0014 rules), because Point of sale must work without a connection.
4. **The phone app (Expo):** the screens ported, Arabic first, right to left;
   camera scanning; Bluetooth receipt printing (after the hardware test
   picks the printer); push notifications for what the owner must see.
5. **The web and the CRM** on the same database, the CRM for the platform
   team only.
6. **Hardening:** security review and a penetration test, backups, error
   monitoring, in-app account deletion (both stores require it).
7. **Accounts and paperwork (non-code):** a registered business; a Google
   Play developer account and an Apple developer account (as an
   organisation — Apple needs a D-U-N-S number); the app's name (W9); a
   privacy policy and terms covering patient data; a support address.
8. **Store listings:** icon, screenshots in Arabic and English, descriptions,
   the privacy declarations (Play's Data safety form, Apple's privacy
   labels), why the camera and Bluetooth are needed, and demo accounts for
   the reviewers — health-adjacent apps get a closer review.
9. **Testing with real pharmacies:** internal testing (Play's testing tracks,
   Apple's TestFlight) with the five pilot pharmacies, on their own devices
   and printers.
10. **Release:** a staged rollout; fixes to the app's code shipped as
    over-the-air updates where the stores allow, new store builds otherwise.
11. **Paying for it (v0.0020):** the price first; how pharmacies pay (an
    invoice outside the app is the usual way for business software — the
    stores' rules on in-app subscriptions to be checked before launch).

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
- Can one pharmacist own more than one pharmacy? **Answered 25 Sep 2026: yes —
  some do.** The prototypes model it from v0.0010 (W7). **The real schema does
  not yet:** in migration `0001`, `pharmacy_details` is keyed on the account's
  profile, so each pharmacy is its own login, and the comment there states the
  one-pharmacy rule. The production track needs a `pharmacies` table of its own
  and an ownership table between pharmacists and pharmacies, with RLS rewritten
  around the owner rather than the pharmacy account. That is a migration to
  write before any owner of several is onboarded, not after.
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

**W6a built in v0.0006, W6d built in v0.0008. W6b and W6c deliberately not
built** — see the note under each. W6e was always covered by W4.

- **W6a. Subscription in the fee config.** A plan alongside the commission
  constants in `src/config/fees.ts`. Required by S1.
- **W6b. CPD credit ledger on the user.** Append-only; provider, topic, hours,
  date, evidence. Same principle as the verified CV stats — issued or computed,
  never editable by the holder. Required by S7.
  **Not built, on purpose.** "Cheap now" is the argument for it, but its shape
  is decided by S7, and S7 is not chosen. Building an append-only ledger before
  anyone has decided what a credit IS produces a migration either way — the
  difference is that one of them is also a screen nobody asked for. Revisit the
  moment S7 moves, not before.
- **W6c. Provider as a first-class entity.** A university, a clinical society,
  the Syndicate. The Universities and Externals modules are most of it.
  **Not built, same reason as W6b:** it exists to carry CPD credits, and nothing
  issues one yet. The two modules that are most of it already exist.
- **W6d. Sponsorship field on a module, separate from its content.** So
  disclosure is structural rather than something someone remembers to type.
  Required by P1.

  **Built — App_v0.0008.** Anything paid for carries `sponsor`, the id of the
  Externals record behind it, and two things follow from the field alone. Its
  disclosure is **derived** — `disclosure(o)` builds the label from `sponsor`,
  so deleting the sentence does not delete the disclosure and nobody can forget
  to type it. And every clinical surface **filters it out** — `clinicalOnly()`
  drops anything carrying a sponsor, so the reference, the Helper's search and
  the Helper's add-by-Enter all refuse it. Putting paid content in front of a
  dispensing decision now means defeating a filter rather than forgetting a
  rule. The check proves it by planting a sponsor on Warfarin and watching it
  leave both screens.
- **W6e. Model the real supply chain in Externals.** Covered by W4; listed here
  because it is also what a procurement product (S4) later runs on.

## W7. Owners of more than one pharmacy

**Rebuilt — App_v0.0010 / CRM_v0.0010,** replacing the chain model v0.0008
shipped.

**What changed, and why.** v0.0008 modelled a *chain*: a group over branches,
and a manager account with a link to the group. **Iraq has no pharmacy
chains.** What it has is pharmacists who own more than one pharmacy — each a
business in its own right, with its own name, its own licence and its own
responsible pharmacist. So there is no group, no chain and no manager role. An
**owner** is a pharmacist whose ownership link is a **list**: one pharmacy for
most, several for some. `isOwner()` and `viewRole()` derive the role from the
list; nothing stores it, and an owner of one and an owner of three are the same
role.

**The app.** An owner of several sees an **All** tab and one tab per pharmacy,
by its short name. All lists their pharmacies worst-first — one with no
responsible pharmacist first, because it cannot legally open; then, with the
marketplace on, by what is outstanding there — and says on screen that owning
several changes nothing about what each one needs. A pharmacy's tab is headed
with its name, licence and responsible pharmacist, and warns first if it has
none; that tab carries a mark on the strip so it shows from any of the others.
An owner of one sees no tabs. The profile lists every pharmacy held, each as
itself. Notifications about a pharmacy reach its owner and nobody else.

**The pricing, and the two decisions inside it** (`subscriptionCharge()` in
`src/config/fees.ts`, with unit tests):

1. **Priced per pharmacy.** The cost driver is pharmacies, not owners. A flat
   per-owner price is the W14 allowance hole one level up.
2. **The allowance is shared.** The shifts an owner is owed are the sum of their
   pharmacies', spendable at any of them — the same total, and the reason an
   owner of several buys: pharmacies are uneven. R19 shows the unevenness.

Volume discounts are not in code: a negotiated discount is data on the owner in
the CRM.

**The CRM.** Users carry `pharmacies` (a list) instead of `pharmacy`. Each
pharmacy row names its owning pharmacist in a column, with a saved view and a
facet for owners of several. Commission stays at the pharmacy that generated
it; the subscription and the **invoice belong to the owner** when they own
several — one invoice, their pharmacies none — and to the pharmacy otherwise.
There is no group table, because there are no groups.

**Decided by default in v0.0010:** an owner's pharmacies share **one plan**,
since they are billed as one subscription.

**Still open:**
- **The production schema** — see W1: the real tables still make each pharmacy
  its own login. **Scheduled as the first step of the production track** (Part 0).
- **The discount ladder** for owners of several — linear pricing is what
  shipped.
- **Per-pharmacy staff and stock.** From the till onward (v0.0011) everything
  that happens at a counter belongs to one pharmacy's tab; employees belong to a
  pharmacy, not to the owner (W23).
- **What an owner of several sees of W8's tallies** — their own pharmacies',
  per pharmacy and labelled, never pooled into a number that hides which one.

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

**Partly built — App_v0.0007 / CRM_v0.0007.** The *company-side* account landed
as **Partner** (W15): a person who belongs to an Externals record, verified by
their employer rather than by the Syndicate roster, who can raise listings and
banners and see nothing clinical. That is the account mechanism this item said
had to be built rather than added as a row. What did **not** land is everything
specific to a *representative*: the pharmacy directory, the visit log, and the
channel that reaches a pharmacist directly. The wall this item asks for is, for
now, drawn at its most conservative — `navFor('partner')` has no clinical screen
on it at all, and a check asserts that. Consumption data (W8) remains out of
reach, and the direct-messaging question is still open and still gated on P1.

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

**Built — App_v0.0007.** `dc.tabCheck` now reads مساعد الوصفات / Dispensing Helper in both
language blocks, and the home card and the P1 boundary assertions name it.

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

**Built — App_v0.0006: W12a, W12b and W12d.** W12c (repeat a shift, pre-filled)
and W12e (remember the account; the reference list's per-keystroke rebuild) are
still open.

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

**Built — App_v0.0007.** `RECENT_POSTS` holds the patterns this pharmacy already
posts; `repeatPost(i)` opens the post form pre-filled and sets `S.repeatedFrom`,
and the form carries a banner saying where the values came from, so nobody posts
last week's rate blind. Reaching the form any other way clears `repeatedFrom` —
a fresh post, not a repeat. Nothing posts on a single tap.

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

**Half built — App_v0.0007.** Sign-in remembers the last account:
`rememberAccount()` / `lastAccount()` write and read one localStorage key inside
try/catch, and the email field comes back filled. The reference-tab rebuild is
untouched and stays untouched — see the note below.

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

**Built — App_v0.0007.** The pharmacist's bar is now
**Browse · My Shifts · Earnings · Drugs · Profile**, with More folded into Profile
via `profileLinks()`. The three home screens prompt rather than report: the
owner's dashboard leads with who is waiting on them and what is unfilled and
starting soon (the three-stat row is gone), a locum's home names the shift
happening in two days, and a placed student leads with the logbook week that is
due and is not shown a placement board they cannot use.

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

**Built — App_v0.0006 / CRM_v0.0006: steps 1–3 and 5 of the build order below.**
The plans and their allowances are in `src/config/fees.ts` and ported to both
builds; `calculateFees()` takes a plan and returns `coveredByPlan`; the CRM
holds the ledger with all three row kinds and reports off it; the app's billing
screen shows the plan, the allowance and what the month would have cost on
commission.

**Step 4 built — CRM_v0.0007.** `DATA.invoices` carries the
`open → due → overdue → grace → suspended` ladder with `paid` as the exit at any
rung, and every paid row records `collectedOn`, `collectedBy` and `method`,
because in Iraq collection is a person with a phone and a receipt, not a card on
file. The Invoices module lists them with facets per state, R16 returns what is
unpaid and who to call, R17 what is collected this month, R18 the split between
subscription and commission. **What is still not decided is the human half:** who
makes the call, on which day of the ladder, and what "suspended" actually stops a
pharmacy doing — see the open questions at the end of this entry.

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

**Built — App_v0.0007 / CRM_v0.0007.** The Partner account signs in to its own
view, raises listings through a four-field form, and **cannot publish**: every
submission arrives as a `draft` and an operator walks it through
`draft → in_review → live → ended`, or `refused`, in the CRM's Listings module.
The pharmacist gets Jobs as a second tab of Browse, not a bar item. Banners are
confined to three surfaces — `BANNER_SURFACES = ['browse', 'jobs', 'home']` — and
**P1 is enforced by where `bannerFor()` is invoked** rather than by a flag
somebody could flip: the Helper, the reference and a drug record never call it.
A check sweeps eight screens and asserts a placement is found on the permitted
ones and on none of the clinical ones, and a second asserts a draft banner's text
appears nowhere on the surface it was bought for. Impressions are counted as
`(placement, day)` counters and nothing else, so no query can reconstruct who saw
what — the same shape, for the same reason, as the dispensing tallies in W8.

**Decided 25 Sep 2026: partners are hidden** until the ecosystem step — their
own switch, off since v0.0011 — and **banners are there from the start**, used
for the platform's own announcements. A paid placement returns with partners;
the P1 rules hold for both.

**The hybrid intake is what the user chose:** the partner fills the form, then a
person calls to collect everything the form deliberately does not ask for. The
form holds four fields; the contact number it captures is what the call uses.

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

### Decided 18 Sep 2026

**Who may refuse a placement: the app admin, case by case.** In CRM terms that
is the owner admin (W5) — a named role, not "whoever is around".

*The risk in a case-by-case veto, named once so it is a choice rather than an
oversight:* the person holding it is also the person with the revenue interest.
That is unavoidable in a one-founder company and it is not a reason to move the
veto. It **is** a reason to write the refusal criteria down **now, while no
money is on the table** — so a future decision argues with a past decision
rather than with nothing. Four questions the admin answers on the record for
each placement, stored on the placement itself:

1. Does it sit on a permitted surface? *(If no, it stops here.)*
2. Does it make a clinical claim, or could it be read as one?
3. Would a pharmacist seeing it understand it is paid?
4. Would we be comfortable if the Syndicate saw this placement and the fee?

A refusal and an approval both leave a row. The log is the whole point: a
case-by-case veto with no record is indistinguishable from no veto.

**Pricing: by day, from launch.** Impression counting is wanted and comes as a
*measurement* layer alongside it, never as the price at first — see below.

**Students see the jobs view.** A graduating student is exactly the audience for
a first job, and it costs nothing: the view is the same, the listings are the
same.

**Partners self-serve the form, then a person finishes it.** A partner signs in
and fills a form carrying the information the listing cannot exist without;
submitting it raises a **draft**, and an operator phones to collect the rest
before anything goes live.

This is better than either extreme. Pure operator entry makes your team a typing
service and loses the partner's own words. Pure self-serve puts unreviewed
commercial content in front of pharmacists, which the P1 criteria above forbid.
The hybrid keeps the human check exactly where it has to be — between
submission and publication — while the partner does the data entry.

**What it needs:** a partner sign-in, a submission form, a **draft → in review →
live → ended** state machine on the listing, and a CRM queue of drafts awaiting a
call. The call is a real workflow step, so it wants a "called on / by / notes"
field rather than living in somebody's phone.

**The form asks only for what a listing cannot exist without** — role or
placement, company, location, dates, and a contact. Everything negotiable
(wording, artwork, slot, price) is what the call is for, which keeps the form
short enough that a partner finishes it.

### Impression counting, without building a targeting engine

Wanted, and safe to build if it is built the right way round.

**What it requires:** an event on each render, deduplication (one person
scrolling past twice is not two impressions), a viewability rule (was it
actually on screen), and a rollup for the partner's report.

**The trap:** an impression log is a behavioural log. A row saying *this
pharmacist saw this banner* is exactly the substrate P1's second rule promises
never to use — and once it exists, the argument for using it arrives on its own.

**The design that avoids it: count without identity.** Increment a counter keyed
on `(placement, day)`. Nothing records who. The partner report says *"shown
1,240 times on 14 September"*, which is the number they want, and **no query can
reconstruct a pharmacist's viewing history**, because the rows to reconstruct it
from were never written. Same shape as W8's tallies, for the same reason.

**Sequence:** day-rate pricing from launch; the anonymous counter alongside it
from the start so there are real numbers to show a partner; impression-based
*pricing* only once there are months of counts to price against. Quoting a CPM
before you know typical volumes is quoting a number you cannot defend.

## W16. The order's accounting tab, and an overridable Company Share

**Raised:** 19 Sep 2026. **Touches:** the CRM's order record, `src/config/fees.ts`,
the ledger. **Not built.**

**Where it stands.** An order record shows the rate, the hours and the total — the
three numbers the *pharmacy* cares about — and says nothing whatever about what
Saydali+ earned on it. The money exists: `calculateFees()` computes all of it and
the ledger holds a row per chargeable event. But it lives a module away, so the
one question an operator asks while looking at a disputed shift — "what did we
make on this, and why that much?" — cannot be answered on the screen they are
already on. The order is where the fee arose and the order is where the answer
belongs.

### The accounting tab

The order record becomes tabbed — **Details / Accounting / Timeline** — and
Accounting shows the whole per-order breakdown, line by line, each line saying
*why* it is what it is:

| Line | Where it comes from |
| --- | --- |
| Shift value | `order.total` — what the two sides agreed |
| Pharmacy fee | `pharmacyFee`, added on top, with its rate or its waiver reason |
| Pharmacist fee | `pharmacistFee`, deducted, always 3% of shift value |
| Floor applied | `floorApplied` — shown only when it bit, with what it added |
| Covered by plan | `coveredByPlan` — the plan id, never a bare zero |
| **Company Share (gross)** | `platformGross` |
| Processor fee | `processorFee`, out of our share, not the pharmacist's payout |
| **Company Share (net)** | `platformNet` |
| Adjustments | any override rows, each with its author and reason |
| **Company Share (final)** | net plus adjustments |

Granular on purpose. A single "commission: 4,000" tells an operator nothing when
a pharmacy rings up to argue, and every line above has been the subject of a real
decision recorded in this backlog — the 70/30 asymmetry, the floor landing
entirely on the pharmacy, the processor cut coming out of our share. The tab is
where those decisions become visible to the person who has to defend them.

### Company Share, and what "overridable" has to mean

Company Share is **derived** — it is `platformNet` out of the fee engine, and the
standing rule in this codebase is that a derived value is never stored as an
editable column. So the override is **not an edit to the field**. It is an
**adjustment row on the ledger**, carrying an amount, a reason and the operator
who made it, and the tab renders `derived + adjustments` with the derived figure
still on screen above it.

Three properties fall out of doing it that way, and all three are the point:

1. **The original number survives.** "We charged 4,000 and credited 1,500 because
   the locum arrived an hour late" is a different record from "we charged 2,500",
   and only the first one can be audited or reversed.
2. **The ledger stays append-only.** A correction is a new row, never a rewrite.
3. **It cannot touch the other two sides.** An override adjusts *our* share and
   nothing else. What the pharmacy was charged and what the pharmacist was paid
   are settled transactions with a counterparty; a CRM field that silently
   changed either would be a way to alter somebody else's money from an internal
   screen. If a pharmacy is genuinely owed money back, that is a credit note on
   an invoice (W14 step 4), not an override here.

Real reasons to override, which is why it is wanted: a goodwill credit on a shift
that went wrong, a disputed booking, a rate negotiated with a chain ahead of the
discount ladder existing (W7), an early-customer arrangement nobody wants to
encode in `PLANS`.

### How it reads under each subscription state

This is the part that needs your decision before any of it is built, because
**one of the four states does not exist yet.**

Worked on a 40,000 IQD shift, which is the example every other entry uses:

| State | Pharmacy fee | Pharmacist fee | Share (gross) | Processor | **Share (net)** |
| --- | --- | --- | --- | --- | --- |
| Neither subscribed | 2,800 | 1,200 | 4,000 | 776 | **3,224** |
| **Owner subscribed** (within allowance) | 0 — *covered by plan* | 1,200 | 1,200 | 776 | **424** |
| **Pharmacist subscribed** only | 2,800 | 0 — *covered by plan* | 2,800 | 800 | **2,000** |
| **Both subscribed** | 0 | 0 | 0 | 800 | **−800** |

Two things that table says out loud, which is the argument for building it:

- **A subscribed pharmacy's order is nearly break-even on its own.** 424 dinars,
  and the month's 9,000 is what actually pays. That is the design working as
  intended — but it means order-level margin is a misleading number to read
  alone, and the tab has to say so rather than let somebody conclude the shift
  was unprofitable.
- **With both sides subscribed, every filled shift is a small loss at the order
  level.** The processor still takes its cut of a payout we now earn no
  commission on. Nothing is wrong with that if the two subscriptions cover it,
  but it is a fact that should be discovered on this screen before it is
  discovered in a monthly total.

**The decision this request forces.** *There is no pharmacist-side subscription.*
W14 priced a plan for the pharmacy only, and made "**the pharmacist pays 3%,
always**" a deliberately load-bearing rule — one sentence the oversupplied side
can hold in their head, worth more than the dinars it costs us. A pharmacist plan
breaks that sentence. It may still be right — a pharmacist taking fifteen shifts
a month is paying us 18,000 and would buy a cap in a heartbeat — but it is a
pricing decision, not a reporting one, and it belongs in W14 or a new strategy
entry rather than being invented by a CRM column.

So the tab should be built to read **four** states from day one, while only two
of them are reachable. The other two render from the same `coveredByPlan`
mechanism the moment a pharmacist plan exists, and until then the pharmacist row
always reads 3%.

**Needs deciding:**
- **Is there a pharmacist-side subscription at all?** If yes, what does it cost,
  what does it cap, and what happens to the one-sentence rule? If no, two rows of
  that table are permanently theoretical and the tab should say so rather than
  imply a product that is not coming.
- **Does the subscription get apportioned across the month's orders?** The
  recommendation is **no**: dividing 9,000 by however many shifts happened
  invents a per-order number that changes every time another shift is booked, and
  a figure that moves retroactively is a figure nobody can quote. Show the order's
  own cash and show the plan absorption as its own line; apportionment, if it is
  ever wanted, belongs in a margin *report* where the month is the unit.
- **Who may override, and above what amount does it need a second pair of eyes?**
  W5 built owner-admin / admin / employee — this is the first thing in the CRM
  where those three should mean different powers.
- **Does an override change the invoice?** An adjustment raised before the month
  closes should land on that month's invoice; one raised after a paid invoice is a
  credit carried to the next. That is a rule, and it should be written down before
  the first operator has to guess.
- **For a chain (W7), which entity does the adjustment belong to?** The commission
  arose at a branch and the invoice is the group's. The adjustment should follow
  the money — branch-level, rolling into the group invoice like every other row —
  so the roll-up report keeps saying which branch cost what.

## W17. System 1 — the till: point of sale, inventory, purchasing, and the Helper in the cart

**Raised:** 20 Sep 2026. **Touches:** everything. Versions v0.0009 and
v0.0012–v0.0016 in Part 0. **Catalogue layer built in v0.0009** — products, mapping confidence,
the unknown-barcode path and the CRM queue. **The till built in v0.0012**; stock
and purchasing are next.

One build, not three. A till that decrements stock as it sells *is* the
inventory system, and a controlled-substance register that falls out of
dispensing is more reliable than one somebody has to remember to keep.

### Decided

**Phone and web, one database.** A pharmacy with no laptop scans with its phone
camera and prints to a Bluetooth receipt printer; a busy counter adds a wedge
scanner, because camera scanning is slower at volume. Same records either way.

**Offline: sync movements, never levels.** Sales are append-only events and sync
whenever the connection allows. Stock levels are *derived* from movements —
sale, receipt, adjustment, return, write-off — and never written directly.
Otherwise two devices selling the last box offline both write "9" and the
truth is 8. The price is written onto the sale line at the moment of sale, so a
later price change cannot rewrite yesterday's takings. Selling, printing and
taking cash work offline; reports, price updates and catalogue refreshes wait.
Retrofitting this later is close to a rewrite, which is why it is a gate on the
production track rather than a feature.

**Hardware is a short certified list.** One or two printer models, one or two
scanners, nothing else supported at launch. Arabic receipts are rendered as an
image and printed as a bitmap — the same technique that makes Arabic CVs export
correctly — rather than fighting printer code pages.

**The catalogue has two layers, and completeness costs no app weight.** The
clinical rules are keyed on *molecules* (a few hundred to fifteen hundred in
community practice; 119 exist today) and stay small forever. The product layer
is a lookup — barcode → product → molecules and strengths — that grows to tens
of thousands of rows at roughly 150–250 bytes each: one download at setup,
daily deltas of a few kilobytes after that, stored on the device. Every product
carries a **mapping confidence** (verified / auto-mapped / unmapped), so a product
can be sold before it is clinically mapped, and the Helper states it: "3 of 4
items checked; 1 not in the reference." An unknown barcode scanned anywhere
becomes a mapping task in the CRM, so the fleet fills the catalogue. **Launch
coverage does not have to be complete; it has to be honest.** The failure to
design against is not missing data but silent partial coverage presented as a
clean check.

**Cash: record, never accuse.** A till that says the drawer should hold 847,000
when it holds 831,000 has created an accusation, and if its number is wrong the
accusation is against an innocent person. So: a **blind count** (the total is
entered before the expected figure is shown — without this the feature is
decorative); a note and an owner sign-off on every variance; an audit trail of
voids, refunds, discounts and no-sale drawer opens, which is where shrinkage
actually shows; and **no automatic deduction from anyone's pay, ever.**

**Suppliers are Externals.** Distributors and storage houses already exist as
Externals records (W4); purchase orders are raised against them.

**Expired stock is never available stock** (added 25 Sep 2026). This is a real
failure in the competitor: an expired box still counts as stock on hand, so the
shelf looks full, reorders do not happen, and nothing stops it being sold. Here:

- Stock is held **by batch**, each with its expiry date, and "available" is
  computed from unexpired batches only. On its expiry date a batch moves to
  **expired — quarantined**: still counted, never as available.
- The till sells **first-expiring first** from what is available. If the only
  stock left is expired, the product shows as **out of stock**, with how many
  expired units are sitting in quarantine.
- An expired batch leaves stock only by a **write-off movement** with a reason
  (destroyed, returned to supplier), a date and who did it — the evidence an
  inspector or the supplier will ask for.
- This is not a clinical block, so P9 is not in tension with it. If an expiry
  date was entered wrongly, the fix is an audited **correction to the batch**,
  which is an owner's permission (W23) — never an override at the till.
- Near-expiry stock (the next 90 days, adjustable) is where W22 begins.

### Needs deciding

- The catalogue go/no-go (Part 0, non-code track item 2).
- The certified hardware list (item 3).
- What a dispensing tally (W8) means for a pharmacy that has a till *and* a
  pharmacist on a relief shift — probably nothing new, because the sale is the
  record, but confirm before W21.

## W18. System 2 — the pharmacy's people: check-in/out, tasks, performance

**Raised:** 20 Sep 2026. **Touches:** app + CRM. **Not built.** Versions
v0.0017 and v0.0019.

For the owner who is not always in the building. Seen working at Salim.

### Decided

**Worth it at ten staff, invisible at one.** A one-person pharmacy never sees
this system and is not charged for seats it does not have.

**Make the valuable data a byproduct of work people must do anyway.** Staff
comply with what the workflow enforces and quietly ignore what it does not.
Check-in is tied to opening a till session; performance is derived from
attendance and till activity; self-reported task ticks are kept for things that
genuinely need a human, and treated as softer data.

**A missed check-out** closes automatically at the **scheduled end plus a grace
period** — not at 23:59, because overnight shifts exist and the fee engine
already handles them — and is marked `auto_closed`, visibly distinct from a
clean shift. On the next check-in the person is asked when they left. **The
claim and the owner's approval are stored as two facts**; approval never
overwrites the claim. Editable for seven days, no further. The last till
transaction is shown beside the claim as evidence. Repeated auto-closes are
themselves worth showing the owner.

**Sales per pharmacist is in, under P7.**

**Tasks** have due dates and recurrence from the start: the daily
fridge-temperature check is the design case, and recurrence is where task
systems get expensive if added later.

### Needs deciding

- Whether scheduling (a rota) is in System 2 at all. It is not in the decided
  scope, but W21's moonlighting rule needs availability, so something minimal
  will be needed before the marketplace switches on.

## W19. The clinical curator, and the rule-governance module

**Raised:** 20 Sep 2026. **Touches:** CRM, the Helper. **Not built.** Version
v0.0016; the person is on the non-code track.

Once the Helper sits in a till influencing what is dispensed, somebody must be
accountable for a rule being wrong or missing. "The software said so" is not a
defence.

**The person.** A named, practising community or clinical pharmacist — ideally
with some hospital or academic standing — part-time, plus a second reviewer.
Paid, by retainer or equity, so a turnaround can be held to. Not the founder,
who is conflicted on shipping speed, and not a developer, who is not qualified.

**What they own.** The rule list: every interaction pair, contraindication and
duplication rule, and the tier on each. Nothing enters or changes tier without
their sign-off.

**The mechanism** is a shape built twice already (the verification queue and the
listings machine): a Rules module in the CRM, `proposed → under review →
approved (tier) → retired`, a name and date on every transition, and a rule never
approved never fires. Every released rule set is **versioned and archived**, so a
dispensing decision questioned two years later can be shown against the exact
rules live that day and who approved them. That archive is the most valuable
thing the role produces.

**Their rhythm.** Monthly, two to four hours: new rules proposed (literature, a
pharmacy's report, a new mapping); the override report, demoting anything
overridden more than roughly one time in five; and unmapped products needing a
clinical call. Batched and asynchronous — not support, not on call.

**Before launch, once:** review the 119 molecules and ten duplication rules
already built, sign off the initial tiers, agree the promotion criteria. Ten to
fifteen hours.

**Commercially,** a named clinical owner is the first question the Syndicate will
ask and the first question a pharma partner's compliance team will ask.

## W20. The Syndicate assessment, and specialty categories

**Raised:** 20 Sep 2026. **Touches:** app, CRM, the CV. **Not built.** After
v0.0020.

An accredited test that scores pharmacists and sorts them into specialty
categories — dermatological, OTC, cardiovascular and so on — which they present
when applying for shifts or jobs. The Syndicate gains revenue and an answer to
its unemployment problem; pharmacists gain a credential; the platform gains a
verified, categorised supply side, and the matching problem the marketplace
never answered ("is this stranger any good?") gets one.

### Decided

- **Sat in invigilated halls** the Syndicate provides, on the candidate's phone,
  with session credentials issued at the hall. **The invigilator is the control.**
  In-app lockdown and focus detection are layered on top but are not relied on:
  a second phone, a watch or a paper crib sheet defeats them.
- **Validity comes from the item bank**, not the software: a large bank with
  randomised selection per candidate so no two papers match, randomised option
  order, rotation between sittings, and post-hoc item statistics (an item
  everyone gets right has leaked). Items written and reviewed by a panel of
  practising pharmacists against a blueprint agreed with the Syndicate.
- **Written down before the first sitting:** the pass standard, the appeals
  process and the retake policy.
- **Sitting fee 25,000–50,000 IQD**, framed as Syndicate accreditation delivered
  through the app — not as an app fee to apply for work. Pharmacy-paid verified
  lookups are a possible **second** line once there is a pool worth looking up,
  not a replacement.
- **Non-exclusive** (P2). The agreement states who owns the **item bank** and the
  **score records** if it ends; whoever owns the items owns the test.
- **Works unaccredited first.** The module runs as a self-assessment from its
  first build, and accreditation is an upgrade rather than a gate, so an
  institutional delay costs nothing.
- **Accredited hours.** Check-in/out records (W18) submitted for Syndicate
  verification become a second credential at almost no marginal cost.

Respects P4 throughout: with Syndicate backing the platform delivers the
credential; it does not become the credentialing authority.

## W21. Shift credits — the Trojan horse — and switching the marketplace on

**Raised:** 20 Sep 2026. **Touches:** fees, ledger, app. **Not built.** After
W20.

### Decided

- **A subsidy, not a discount.** The pharmacist's rate is unchanged — 40,000
  stays 40,000 — and the platform pays part of the pharmacy's cost (8,000 IQD on
  a 40,000 shift, for example). The labour price is never anchored low.
- **Shown explicitly and finitely**: "your subscription covered 8,000 of this."
  The anchor that is at risk is the pharmacy's sense of the *fee*; showing the
  subsidy is what makes its end legible.
- **Moved through the ledger, not a new payout path.** The commission is waived
  and a credit is posted against the pharmacy's invoice as an adjustment row —
  the W16 shape. No money is disbursed outside the existing flow, which keeps
  clear of the no-wallet rule.
- **Budgeted as customer acquisition**, capped per pharmacy per month.
- **District by district**, by density, never by total count. The flag from
  v0.0009 switches it on per district.
- **Moonlighting — availability conflict only.** When an owner's employee takes
  a relief shift elsewhere, the owner sees that the person is unavailable, never
  where or for whom. Written into the terms both sides accept at sign-up.
- **Disintermediation: the record is the product.** A shift booked and paid
  through the platform feeds the verified CV, the reliability score and the
  accredited hours; a shift arranged directly counts toward none of them. Phone
  numbers are not exposed before acceptance. The handoff record stays the
  evidentiary backbone. (C2.)

## W22. The near-expiry exchange

**Raised:** 25 Sep 2026. **Touches:** app, CRM. Promotes S9 from strategy to
work. **Not built — scheduled for v0.0018.**

A page listing stock nearing its expiry date, for exchange or sale between
pharmacies. **Available to pharmacy owners by default**; an owner can grant it
to an employee pharmacist (W23).

It follows from W17's batches: the candidates are the pharmacy's own batches
inside the near-expiry window, and a listing is created from a batch, not typed.
Worth deciding before it is built:

- **Who can see a listing** — every pharmacy, or pharmacies within a distance?
  Nearby is what makes an exchange practical; everywhere is what makes it
  liquid.
- **Whether money passes through the platform.** The no-wallet rule says no:
  the platform matches, the two pharmacies settle between themselves, and the
  transfer is recorded as a stock movement at both ends.
- **Controlled substances are excluded.** Moving them between pharmacies is a
  regulated transfer with its own register, not a marketplace listing.
- **What it shows a competitor.** A pharmacy's near-expiry list says something
  about its stock and its sales; listings are opt-in, per batch, and name the
  pharmacy only once the other side asks.

## W23. Permissions an owner grants, and what was done on each shift

**Raised:** 25 Sep 2026. **Touches:** app, CRM, every System 1 and 2 screen.
**Not built — scheduled for v0.0015 (moved up from v0.0017, 26 Sep 2026).**

Some things are an owner's by default: the near-expiry exchange (W22),
purchase orders, setting prices, stock corrections, write-offs, cash
variances, voids and refunds above an amount, and editing the receipt and its
logo. An owner can **grant** any of them to an employee pharmacist, per pharmacy.

**And the owner sees what was done.** Every action at a pharmacy carries who
did it and which shift it happened in — the shift being the till session that
check-in opens (W18). A **timeline per shift** shows the owner, in order, what
each person did: sales, voids, refunds, overrides of default instructions,
price changes, corrections, write-offs, stock received, listings made.

Design rules worth writing down now:

- **Default deny.** A new employee can sell and check in, and nothing else,
  until the owner grants it.
- **Granted per pharmacy.** An owner of several trusts different people at
  different pharmacies.
- **A grant is itself on the timeline** — who granted what, to whom, when — and
  revoking it is too.
- **The timeline is a record, not a surveillance feed.** It shows actions taken
  in the system, never location, and the employee can see their own. P7 still
  governs anything that looks like a sales ranking.
- **The CRM does not read it.** It is the pharmacy's operational record, like
  patient history (P8); the platform sees counts, not names.

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

**How far to go — recommendation, 18 Sep 2026.** Not one answer for the whole
ladder; the line falls between rung 3 and rung 4.

**Rungs 1–3 — go, with the W15 rules.** A directory touches no pharmacist. Job
listings and banners reach one, but on a shift board, where advertising is
expected and recognised as such. Visit logging is a tool for the rep's employer
and never reaches a pharmacist at all. None of the three touches clinical
judgement, which is what P1 actually protects.

**Rung 4 — sponsored education: only with the policy written and the reviewer
named.** This is where the money is and where the line is. It is doable, and it
is exactly what ACPE's commercial-support standards exist to make doable: the
funder buys the slot, an independent clinician writes the content, the
sponsorship is disclosed on the module, and no sponsored material ranks a
product inside a clinical recommendation. Without those four, it is
advertising wearing a lab coat.

**Rung 5 — market research panels: the same policy, plus two more conditions.**
The pharmacist is **paid** for their time, and declining carries **no
consequence of any kind** — not to their shift access, their ranking, or their
standing. The failure here is quiet: a pharmacist who merely *suspects* that
saying no costs them work is already being coerced, whether or not it is true.
That makes it as much a design problem as a policy one — the ask must visibly
sit outside the part of the app that gives them work.

**Ruled out permanently, at every rung:** using clinical behaviour — what a
pharmacist looked up in the reference, what they checked in the dispensing
helper, what their pharmacy dispensed — to target a placement or to select a
panel. It is the most valuable signal the platform will ever hold and using it
converts a safety tool into a lead generator. Once pharmacists work that out,
they stop using the safety tool, and the safety tool is what the whole of Part 2
rests on (S8).

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
*Promoted to work as W22 on 25 Sep 2026.*

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
it runs, (d) what the disclosure says, in Arabic, and (e) who can refuse a
placement.

**Decided 18 Sep 2026: the app admin refuses, case by case**, against the four
written criteria in W15, with every approval and refusal logged on the placement.
The criteria exist because a case-by-case veto with no record is
indistinguishable from no veto — and they were written before there was revenue
riding on any of them, which is the only time criteria are easy to write.

**Still open:** how far up S5's ladder to go. Rungs 1–3 are a different question
from rungs 4–5; see S5.

**Extended 20 Sep 2026, for the till (W17).** The cart and every other
dispensing surface join the Helper and the reference on the forbidden list, and
are kept off it the same way: `bannerFor()` is simply never called from them, so
there is no flag to flip. Paid placements go to the **owner's app** — a
commercial surface — and never to the counter.

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

## P6. Area data: a published minimum, and a dominance rule
*Settle before the first data product is sold. Decided 20 Sep 2026.*

What is sold to companies is **area-level aggregates**, never a pharmacy's own
row, and the rule protecting that is public:

- **Minimum N = 5.** No area figure is reported unless at least five pharmacies
  contributed to it. In a district with three, "this area dispenses a lot of X"
  is one pharmacy's data, and anybody who knows the district can name it.
- **Dominance: 40%.** A figure is suppressed if one pharmacy contributes more than
  roughly 40% of it, even when N is met — otherwise a large pharmacy in a small
  district stays identifiable.
- **The pharmacy sees its own analytics first** (W8), and **opts in** to its
  data contributing to aggregates.

Selling to companies rather than to reps does not change the pharmacy's
question — the company deploys the reps. The answer is *what* is sold, not *to
whom*. Publishing the rule is what makes it a promise rather than a setting.

## P7. A sales figure is a risk signal, never a target
*Decided 20 Sep 2026. Governs W18.*

Sales per pharmacist is tracked, as a safeguard rather than a scoreboard:

- **Segmented by ATC class** — antibiotics (J01), controlled substances, and any
  other class the curator designates — not a two-way split.
- **Flagged relatively:** a pharmacist's share against the pharmacy's own average
  and the district's, so whoever works the winter evening shift is not
  punished by an absolute threshold. Every flag names its comparison.
- **Shown to the owner as a question**, the same pattern as contraindications.
- **Never ranked.** No leaderboard, no "top seller", no sales goal. A number on
  display becomes a target; the risk is not that the system creates
  over-dispensing but that it amplifies it.

## P8. Patient history stays inside the pharmacy
*Decided 20 Sep 2026. Revises W8's privacy-by-shape decision, for the till only.*

W8 kept patient identity out entirely because a shift app had no clinical need
for it. A till does — per-patient alert suppression is the clinical case. So a
pharmacy may keep its patients' purchase history, and the pharmacist may use it
where it is ethical to. But **"we don't look" is policy and "we can't look" is
architecture**, and only the second is held:

- Patient rows carry **no RLS grant to any operator or CRM role**, and no CRM
  view or SQL export includes them.
- Patient identity is **per pharmacy**. The same person at two pharmacies is two
  unrelated rows with no shared key.
- **There is never a cross-pharmacy patient identity.** That would be a national
  dispensing record — a different regulatory animal entirely.
- Area aggregates (P6) are computed from separately written, de-identified
  counters, never by joining patient rows.
- Stated on screen and in the contract, alongside "does not replace the legal
  register".

W8's legal read, which is still open, now covers this too.

## P9. The till never refuses a licensed professional
*Decided 20 Sep 2026. Governs W17 and W19.*

Everything built so far *advises*. A tier that blocks a sale is a different risk
class: a wrong block stops a legitimate sale in front of a customer; the
workaround (ringing the item as something else) corrupts the inventory and
dispensing data the whole plan depends on; and a tool that blocks implies that
anything not blocked was checked and approved.

- The tiers are **Note, Warn and Stop**; new rules default to Note.
- **The Stop list ships empty**, and only the curator (W19) promotes into it.
- A Stop requires a **typed reason** — and then lets the pharmacist proceed. The
  till never refuses outright. The pharmacist's judgement governs, and the record
  shows it was exercised.
- **Override rate is instrumented from day one.** A rule overridden more than
  roughly one time in five is miscalibrated and is demoted.

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

## C6. Capacity is the binding constraint

Recorded 19 Sep 2026, because the estimate that prompted it will be made again.

Part-time alongside a full-time role buys roughly **110–150 hours a quarter**.
The real implementation's own measurements say what features cost here: 9,380
lines of TypeScript and **4,120 lines of SQL** — a third of the codebase is RLS
and policy — plus 130 policy assertions, bilingual RTL throughout, two layouts,
and a CRM counterpart for every module. Estimates that list features as bullets
miss all of that.

Two consequences worth keeping. **Work that is independent is not therefore
parallel**: the catalogue, the conversations and the build all draw on the same
evenings. And **point of sale is larger than everything built so far combined**,
which is why Part 0 puts it behind three gates on the production track and does
its thinking on the spec track first, where a version costs days rather than
months.

---

## Picking these up

**Start with Part 0.** Since 20 Sep 2026 the order of work is the version plan
there, not the order of the Work entries: W17 and W18 are the next eight
versions, W19 is what makes W17 safe to sell, and W20–W21 come after. The
entries below that predate it remain accurate about *why* things are built the
way they are, and the marketplace they describe is still in the code, dark,
waiting for W21.

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
