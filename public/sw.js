/**
 * Service worker.
 *
 * The point of this is installability and a civil offline screen — not offline
 * browsing. That distinction is deliberate and worth stating, because the
 * obvious "cache pages for speed" service worker would be actively harmful
 * here: a pharmacist shown a cached listing that was filled an hour ago will
 * travel across Baghdad for a shift that no longer exists, and a pharmacy shown
 * a cached applicant list will accept somebody who has already withdrawn. Stale
 * marketplace data is worse than a spinner.
 *
 * So:
 *   - Navigations are network-first. The cache is a fallback for when the
 *     network is genuinely gone, and what it serves is an offline notice, not a
 *     pretend copy of the app.
 *   - Only immutable build output and icons are cache-first. Those are
 *     content-hashed by Next, so a stale one cannot exist.
 *   - Anything that is not a GET, and anything to another origin (Supabase,
 *     fonts), is left alone entirely. Caching an authenticated API response in
 *     a shared cache is how one person's data ends up on another person's
 *     screen.
 */

const VERSION = 'saydali-v1';
const STATIC_CACHE = `${VERSION}-static`;
const OFFLINE_URL = '/offline';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll([OFFLINE_URL])),
  );
  // Take over immediately: a half-updated worker serving an old shell is a
  // confusing state to debug and a worse one to be a user of.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

const isImmutableAsset = (url) =>
  url.pathname.startsWith('/_next/static/') ||
  url.pathname.startsWith('/icons/') ||
  url.pathname === '/favicon-32.png';

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Never interfere with writes, and never with another origin.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Auth callbacks must always hit the network — a cached redirect would strip
  // the one-time token out of the flow.
  if (url.pathname.startsWith('/auth')) return;

  if (isImmutableAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          }),
      ),
    );
    return;
  }

  // Everything else — every page in the app — is network-first, with the
  // offline notice as the only fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(STATIC_CACHE);
        return (
          (await cache.match(OFFLINE_URL)) ??
          new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
        );
      }),
    );
  }
});
