# Backlog

Agreed but not built. Each entry says what is there now, what should change, and
anything that needs deciding before it can be done. Nothing here has been
started.

---

## 1. Model a pharmacy owner as a pharmacist *linked to* a pharmacy

**Raised:** 11 September 2026. **Touches:** app + CRM.

An owner is not a third kind of user. They are a **pharmacist**, who
additionally has an **ownership link** to a pharmacy. The system needs to hold
it that way rather than as a separate account type.

**Where it stands after App_v0.0002 / CRM_v0.0002.** `owner` is currently a
*user type* sitting beside `pharmacist` and `student` — in the app's `ACCOUNTS`
roles, in the CRM's `USER_TYPES`, in the Users module's saved views, and in the
`ut1.*` labels. The pharmacy link exists (`user.pharmacy` → a `pharmacies` row)
but the type is doing work the link should be doing.

**What it should become.** Two account types that describe what a person *is* —
pharmacist and student — plus a relation that describes what they *own*. An
owner is then a pharmacist row with an ownership edge to a pharmacy row, and
"is an owner" becomes a derived fact, the way `dormant` and `unclaimed` already
are.

**Needs deciding before building:**
- Does the Users module still offer "Pharmacy owners" as a saved view? (Probably
  yes — as a *view over pharmacists*, not a type. Worth confirming.)
- Can one pharmacist own more than one pharmacy? The schema in
  `supabase/migrations/0001` currently says no, on the basis that one licensed
  pharmacist may own only one pharmacy under Iraqi law. If that holds, the link
  is one-to-one and a lot stays simple. If it does not, the ownership edge
  becomes a table and several screens change shape.
- What does an ownership link mean when the pharmacy is sold or the responsible
  pharmacist changes? A link with a start and end date is a different object
  from a foreign key.

---

## 2. Shift management for owners should be opt-in, in settings

**Raised:** 11 September 2026. **Touches:** app.

A pharmacy owner gets the pharmacist half of the app — browse, my shifts,
earnings, CV — so they can cover somebody else's counter. Most owners will
never do this. It should be **off by default** and turned on from settings.

**Where it stands after App_v0.0002.** Both halves are always present: the
owner's sidebar shows a "My own work" group, "More" lists those four screens,
and the home page carries a pharmacist section under the pharmacy one. That was
built on the assumption that an owner wants both at once, which this entry
corrects.

**What it should become.** A setting on the owner's profile — something like
"Take shifts as a pharmacist" — off by default. Off: the pharmacist group
disappears from the sidebar and "More", and the home page is pharmacy only. On:
today's behaviour.

**Needs deciding before building:**
- What does an owner who has already taken shifts see if they turn it off?
  Hiding a screen that holds their earnings history is different from hiding one
  that does not. Probably: the toggle governs *finding new work*, and earnings
  stay reachable while there is anything in them.
- Does the same toggle gate the CV module, or is a CV worth keeping regardless?
  (A CV is also how an owner presents themselves to a supplier or a regulator,
  which has nothing to do with taking shifts — see the clinical / non-clinical
  split in App_v0.0001.)

---

## 3. Rename "Student training" to "Student placement" in the CRM

**Raised:** 11 September 2026. **Touches:** CRM.

The order type reads "Student training". It should read **"Student placement"**.

**Where it stands.** The type key is `training` and the label is `ot.training`
in the CRM's string table; the saved view is `v.training` ("Student training")
and the Orders module segments on it.

**Scope note.** This is a label change, not a data change — the key can stay
`training` so nothing else moves. Worth checking whether the app should follow:
it currently says "تدريب طلابي" / "Student training" in several places, and the
two halves reading differently for the same thing is the kind of small
inconsistency that costs trust in a demo.

---

## How to pick these up

Each entry names the files and identifiers involved, so the work can start
without re-deriving the current state. Items 1 and 2 both revise decisions made
in the v0.0002 builds — that is expected, not a correction; they were built from
what was known then.
