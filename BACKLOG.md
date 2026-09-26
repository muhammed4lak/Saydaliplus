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
   tasks — once v0.0016, v0.0017 and v0.0019 have been in front of owners.
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
| **v0.0015** | Clinical governance | W19; P8; W17 helper tiers |
| **v0.0016** | Attendance | W18 roster, check-in/out |
| **v0.0017** | Permissions, and what was done on each shift | W23 |
| **v0.0018** | The near-expiry exchange | W22 |
| **v0.0019** | Tasks, performance, and the absent owner's day | W18; P7 |
| **v0.0020** | Paying for it | pricing — *blocked on a decision* |
| later | Assessment, then shift credits, then the ecosystem | W20, W21, P6 |

System 1 is complete at v0.0015, System 2 at v0.0019. Fixes to a built
version are numbered `.1`, `.2` after it and listed under "Amendments" below;
they never renumber this table. Versions were inserted
twice on 25 Sep 2026 — v0.0010 for the W7 correction and v0.0011 for the
review fixes — and W22 and W23 were given v0.0018 and v0.0017, so the numbers
below are the current ones. The till was built as v0.0012; stock and
purchasing are next.

**v0.0009 — the switch, and the catalogue.** **Built** (25 Sep 2026) — see
"v0.0009 as built" below.
A feature flag per surface, with the marketplace off by default and switchable
per district later (W21 needs exactly that). The pharmacist's bar becomes
Check-in · Tasks · Drugs · CV · Profile, with Tasks and Check-in as honest
"coming in this build series" placeholders until v0.0016. The product layer
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
v0.0016).

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
2. **Discounts are the owner's alone** until permissions arrive (v0.0017), and
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
  whether it was acknowledged — the raw material for v0.0015's override report.
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
  with who, where and when. v0.0014's audit trail and v0.0017's shift timeline
  are views of it.

**Known limits of the prototype** (not decisions — each is a later version's
work): sales, prices and the log live in memory and are gone on reload; the
logo is remembered on the device only; the market prices are a fixed fixture,
where production computes them from real sales; the default instructions are
placeholders by dosage form until the curator writes them (W19); the camera
scan works on Android's Chrome but not on an iPhone, whose browser has no
barcode detector — a scanning library fixes that in production; and a refund
does not return anything to stock, because there is no stock until v0.0013.

### Before v0.0013 — to decide

v0.0013 is stock and purchasing. Most of it was settled on 20 and 25 Sep
(movements not levels, batches, first-expiring first, quarantine, write-off
with a reason, near-expiry at 90 days, suppliers are Externals). These are
what is left:

1. **Selling what the system thinks is out of stock.** In the first weeks the
   system's stock will be wrong — boxes on the shelf that were never entered.
   Refuse the sale, or allow it and flag the product for a count?
   *Recommended:* allow it, record the stock as negative, and put "count this"
   on the owner's home. Refusing a sale because the software is behind the
   shelf is how pharmacies stop using a till.
2. **Opening stock.** How does a pharmacy that already exists get its shelf in?
   *Recommended:* a **count mode** — scan every box once, enter expiry per
   batch — plus a spreadsheet import for a pharmacy moving off another system.
   Which competitors' exports matter is a question only you can answer.
3. **Purchase cost and bonus units.** Record what each batch cost (it makes
   margin and stock value possible; owner-only), and the distributor's free
   units — the *بونص*, 10 + 1 — as units received at zero cost?
   *Recommended:* yes to both; bonus goods are routine here, and ignoring them
   makes every cost figure wrong.
4. **A supplier not in the CRM.** Can an owner add their own distributor, kept
   private to their pharmacy, or only choose from the Externals list?
   *Recommended:* add their own; the CRM team is told, and may later link it to
   an Externals record.
5. **Where a refunded item goes.** Back to sellable stock, or to quarantine
   until the pharmacist decides? *Recommended:* the pharmacist chooses at the
   refund, with *sealed and undamaged* as the only way back to sellable stock,
   and anything else to quarantine.

**Leftovers that are yours, not the code's:** the certified printer and
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

**v0.0013 — stock and purchasing.**
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

**v0.0015 — clinical governance.**
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

**v0.0016 — attendance.**
The roster: an employment record per person with start and end dates and a role
(pharmacist or assistant), invitations for staff without accounts, deactivation
that keeps history. Check-in is tied to opening a till session. A missed
check-out closes automatically at the **scheduled** end plus a grace period —
not at midnight, because overnight shifts exist — and is marked `auto_closed`.
On the next check-in the person is asked when they actually left; the claim and
the owner's approval are stored as two facts, editable for seven days, and the
last till transaction is shown beside the claim as evidence.
*The check asserts:* an auto-closed shift never counts as clean; approval never
overwrites the claim.

**v0.0017 — permissions, and what was done on each shift.** (W23)
The owner's grants, per pharmacy, default deny: a new employee can sell and
check in, nothing else. Voids and refunds, discounts, prices, stock
corrections, write-offs, cash variances, the receipt and its logo, the average
market price, and the near-expiry exchange become grantable. Every action
carries who did it and in which shift; the owner reads a timeline per shift,
the employee reads their own, and a grant or a revocation is itself on it.
*The check asserts:* an action without the permission is refused and recorded;
the CRM can read no timeline.

**v0.0018 — the near-expiry exchange.** (W22)
Built on v0.0013's batches: the owner's batches inside the near-expiry window,
listed per batch by choice, never automatically; visible to nearby pharmacies;
controlled substances excluded; settlement between the two pharmacies, recorded
as a stock movement at both ends and never passing through the platform.
Owners by default; grantable (v0.0017). *The check asserts:* a controlled item
cannot be listed; nothing is listed that the owner did not choose.

**v0.0019 — tasks, performance, and the absent owner's day.**
Tasks with due dates and recurrence — the daily fridge-temperature check is the
case to design for — and completion. Performance derived from what people must
do anyway (attendance, till activity) rather than from self-reported ticks.
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

Reported 26 Sep 2026, from the till on a phone. **Not built yet.**

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
clinical governance, v0.0015. *Plan:* correct the two strings.

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

## The non-code track

These are yours, and several gate the production track. None is a coding task.

1. **Name the clinical curator** (W19) — before v0.0015 leaves the prototype.
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

- **The five questions before v0.0013** — out-of-stock sales, opening stock,
  cost and bonus units, private suppliers, and where refunds go. See "Before
  v0.0013" above.
- **The price of the two systems**, and whether Basic 9,000 / Premium 19,000
  survive as they are once the marketplace is dark.
- **A pharmacist-side subscription** — still needed before half of W16 is real.
- **The name** (W9).
- **W8's legal read**, now extended to patient history kept by the pharmacy (P8).
- **W7's three leftovers.**
- **F8**, parked by decision until before the ecosystem step.

**Settled since this list was first written:** receipt contents, language and
tenders; each pharmacy's own price against an average market reference;
usage-level default instructions; partners hidden and announcements on;
placements staying on; exact totals with no cash rounding; and discounts as
the owner's alone, with a reason. See "Before v0.0012" above.

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
v0.0012–v0.0015 in Part 0. **Catalogue layer built in v0.0009** — products, mapping confidence,
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
v0.0016 and v0.0019.

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
v0.0015; the person is on the non-code track.

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
**Not built — scheduled for v0.0017.**

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
