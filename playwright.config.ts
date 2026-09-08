import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests.
 *
 * These need a real Supabase behind them — `supabase start && supabase db reset`
 * seeds the accounts they sign in as. They are not run in the unit-test pass,
 * because a test that silently passes against no database is worse than no test.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    locale: 'ar-IQ',
  },

  projects: [
    // Arabic RTL is the default the product actually ships, so it is the
    // default the tests run in. English is a second project rather than the
    // primary one.
    { name: 'arabic', use: { ...devices['Pixel 7'] } },
    { name: 'desktop-english', use: { ...devices['Desktop Chrome'], locale: 'en-GB' } },
  ],

  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
