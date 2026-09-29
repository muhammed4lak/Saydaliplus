/* The prototypes' attendance history (v0.0017): who works where, on what
   schedule, and five weeks of shifts and sales generated from it.

   Both single-file builds embed this module (scripts/embed-drugs.mjs), the
   generator included, so the app's Reports and the figures an owner shares
   with the CRM are computed from the same shifts and sales — and a check can
   hold the two to each other.

   The history is deterministic: each person's day comes from a generator
   seeded by pharmacy, person and date, so the same day always has the same
   shifts and sales whatever range is asked for. Days are counted back from
   the real date, like the rest of the app's timeline. Nothing here is a real
   pharmacy's data. */

/* Minutes after the scheduled end before a shift nobody checked out of
   closes itself (W18: not at midnight — overnight shifts exist). */
export const SHIFT_GRACE_MIN = 60;

/* How many days back the seeded history runs, yesterday included. */
export const HISTORY_DAYS = 35;

/* Each pharmacy's people and their current schedule. `days` are
   Date.getDay() numbers (0 is Sunday, 6 Saturday); an end at or before the
   start runs past midnight. The owner is listed where they work shifts. */
export const HISTORY_TEAMS = {
  P1: [
    { email:'rahma@example.com',  owner:true, days:[6, 0, 1],       start:'16:00', end:'22:00' },
    { email:'hassan@example.com', days:[6, 0, 1, 2, 3],             start:'08:00', end:'16:00' },
    { email:'zahraa@example.com', days:[0, 1, 2, 3, 4],             start:'16:00', end:'23:00' },
    { email:'omar@example.com',   days:[6, 1, 3],                   start:'09:00', end:'15:00' }
  ],
  P7: [
    { email:'karim@example.com',  days:[6, 0, 1, 2, 3, 4],          start:'08:00', end:'16:00' },
    { email:'rusul@example.com',  days:[0, 1, 2, 3, 4],             start:'16:00', end:'23:00' },
    { email:'maryam@example.com', days:[5, 6],                      start:'10:00', end:'18:00' }
  ],
  P8: [
    { email:'maryam@example.com', days:[0, 1, 2, 3, 4],             start:'08:00', end:'16:00' },
    { email:'ali@example.com',    days:[6, 0, 1, 2, 3],             start:'15:00', end:'23:00' },
    { email:'rahma@example.com',  days:[4, 5],                      start:'09:00', end:'15:00' }
  ],
  P9: [
    { email:'layla@example.com',  owner:true, days:[6, 0, 1, 2, 3, 4], start:'09:00', end:'17:00' }
  ]
};

/* Shifts nobody checked out of, to show the claim and the approval as two
   facts (W18): one approved, one waiting for the owner, one too old to claim
   — three in thirty days, which is itself worth the owner's attention. */
export const HISTORY_AUTO = [
  { pharmacy:'P1', email:'zahraa@example.com', daysAgo:16 },
  { pharmacy:'P1', email:'zahraa@example.com', daysAgo:9, claim:'23:05', approval:{ by:'rahma@example.com', out:'23:05' } },
  { pharmacy:'P1', email:'zahraa@example.com', daysAgo:2, claim:'23:20' }
];

/* Whether the owner shares the pharmacy's Reports with Saydali+ — on unless
   turned off (decided 28 Sep 2026). Dar Al-Dawa's owner turned it off. */
export const REPORTS_SHARED = { P9:false };

/* The history itself: every shift and every sale in it. Self-contained, so it
   can be embedded as source. */
export function historyFor(teams, autos, days, nowMs) {
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rngOf = seed => { let a = seed; return () => { a = (a + 0x6D2B79F5) | 0; let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; };
  const pad = n => String(n).padStart(2, '0');
  const ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const at = (day, hhmm, addDays) => { const d = new Date(day); d.setDate(d.getDate() + (addDays || 0));
    const [h, m] = hhmm.split(':').map(Number); d.setHours(h, m, 0, 0); return d; };
  const shifts = [], sales = [];
  const today = new Date(nowMs); today.setHours(0, 0, 0, 0);
  for (let k = days; k >= 1; k--) {
    const day = new Date(today); day.setDate(day.getDate() - k);
    const key = ymd(day);
    Object.keys(teams).forEach(ph => teams[ph].forEach(p => {
      if (p.days.indexOf(day.getDay()) < 0) return;
      const rnd = rngOf(hash(ph + '|' + p.email + '|' + key));
      const auto = autos.find(a => a.pharmacy === ph && a.email === p.email && a.daysAgo === k);
      if (!auto && rnd() < 0.1) return;                       // a day off
      const overnight = p.end <= p.start;
      const sStart = at(day, p.start), sEnd = at(day, p.end, overnight ? 1 : 0);
      const inAt = new Date(sStart.getTime() + Math.round(rnd() * 25 - 10) * 6e4);
      const clean = new Date(sEnd.getTime() + Math.round(rnd() * 30 - 10) * 6e4);
      const id = 'H-' + ph + '-' + p.email.split('@')[0] + '-' + key;
      const iso = d => d.toISOString();
      const shift = { id, pharmacy:ph, email:p.email, in:iso(inAt), out:iso(auto ? sEnd : clean), state:auto ? 'auto' : 'closed',
        how:'checkin', sched:{ start:p.start, end:p.end }, claim:null, approval:null, past:true };
      if (auto) {
        shift.autoAt = iso(new Date(sEnd.getTime() + 60 * 6e4));
        const next = new Date(day); next.setDate(next.getDate() + 1);
        if (auto.claim) shift.claim = { out:iso(at(day, auto.claim, auto.claim <= p.start ? 1 : 0)), at:iso(at(next, '15:55', 0)), by:p.email };
        if (auto.approval) shift.approval = { out:iso(at(day, auto.approval.out, auto.approval.out <= p.start ? 1 : 0)),
          at:iso(at(next, '18:30', 0)), by:auto.approval.by, verdict:auto.approval.out === auto.claim ? 'accepted' : 'amended' };
      }
      shifts.push(shift);
      /* Sales through the shift — ending before the scheduled end on a shift
         that closed itself, since the last sale is the evidence of when the
         person really left. */
      const until = auto ? new Date(sEnd.getTime() - 25 * 6e4) : clean;
      const hours = (until - inAt) / 36e5;
      const n = Math.max(3, Math.round(hours * (1.6 + rnd() * 1.8)));
      for (let i = 0; i < n; i++) {
        const t = new Date(inAt.getTime() + ((i + rnd()) / n) * (until - inAt));
        const r = rnd();
        sales.push({ id:id + '-' + (i + 1), pharmacy:ph, by:p.email, at:iso(t), shift:id,
          total:250 * Math.round((1500 + r * r * 38000) / 250), items:1 + Math.floor(rnd() * 3), past:true });
      }
    }));
  }
  return { shifts, sales };
}
