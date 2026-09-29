/* The near-expiry exchange (v0.0018, W22): where the prototypes' pharmacies
   are, how near counts as nearby, and the listings already made.

   Both single-file builds embed this module (scripts/embed-drugs.mjs), so the
   app's exchange and the CRM's report table start from the same listings.

   Nearby is a distance, not a district: two pharmacies either side of a
   district line can be a street apart. The points are a district's rough
   centre — enough for "is it worth the drive", never a pharmacy's address. */

/* Kilometres within which a listing is shown. */
export const EXCHANGE_KM = 6;

/* Days before expiry within which a batch can be listed — the app's own
   near-expiry window (v0.0013). */
export const EXCHANGE_WINDOW_DAYS = 90;

/* [latitude, longitude], a district's rough centre. */
export const PHARMACY_LOC = {
  P1: [33.3050, 44.4200],   // Karrada
  P2: [33.3380, 44.3990],   // Adhamiya
  P3: [33.2900, 44.3500],   // Yarmouk
  P4: [33.3480, 44.3500],   // Kadhimiya
  P5: [33.3200, 44.4300],   // Karrada Kharij
  P6: [33.3150, 44.3450],   // Mansour
  P7: [33.2790, 44.3830],   // Jadriya
  P8: [33.3340, 44.4550],   // Zayouna
  P9: [33.3160, 44.3450]    // Mansour
};

/* Listings made before the prototype opens. `months` is the expiry, counted
   from this month (1 is next month); `daysAgo` when it was listed. None is a
   controlled substance or a precursor — the build refuses one that is. */
export const EXCHANGE_SEED = [
  { id:'X001', pharmacy:'P7', by:'layla@example.com', code:'5000000001071', months:1, qty:8, stock:14, price:7500,
    note:{ en:'Sealed boxes, kept at room temperature.', ar:'علب مغلقة، محفوظة بدرجة حرارة الغرفة.' }, daysAgo:3 },
  { id:'X002', pharmacy:'P8', by:'layla@example.com', code:'5000000001194', months:1, qty:12, stock:12, price:9000,
    note:{ en:'Whole packs only.', ar:'علب كاملة فقط.' }, daysAgo:1 },
  { id:'X003', pharmacy:'P9', by:'layla@example.com', code:'5000000001316', months:1, qty:5, stock:5, price:11000,
    note:{ en:'', ar:'' }, daysAgo:2 }
];

/* Straight-line distance in kilometres. Self-contained, so it can be
   embedded as source. */
export function distanceKm(a, b) {
  const R = 6371, rad = x => x * Math.PI / 180;
  const dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
