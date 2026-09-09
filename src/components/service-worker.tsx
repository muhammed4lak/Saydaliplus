'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker, which is what makes the app installable.
 *
 * Registered after load so it never competes with the first paint on a slow
 * connection — the people this is for are on Iraqi mobile data, and an install
 * prompt is worth nothing if the first screen was slow to arrive.
 *
 * Development is excluded: a service worker caching a dev build produces the
 * kind of "why is my change not showing" afternoon that is very hard to
 * diagnose.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Registration failing costs installability, nothing else. The app
        // works exactly as before, so there is nothing to tell the user.
      });
    };

    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }, []);

  return null;
}
