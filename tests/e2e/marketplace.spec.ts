import { expect, test } from '@playwright/test';

/**
 * The core loop, end to end, against a seeded database.
 *
 * Run with:
 *   supabase start && supabase db reset      # seeds the accounts below
 *   npm run test:e2e
 *
 * These deliberately assert on behaviour a user would notice — the fee shown,
 * the queued application, the handoff gate — rather than on markup.
 */

const ACCOUNTS = {
  pharmacist: { email: 'ahmed@example.com', password: 'password123' },
  pendingPharmacist: { email: 'noor@example.com', password: 'password123' },
  pharmacy: { email: 'rahma@example.com', password: 'password123' },
  reviewer: { email: 'admin@saydali.example', password: 'password123' },
};

async function signIn(page: import('@playwright/test').Page, account: { email: string; password: string }) {
  await page.goto('/sign-in');
  await page.getByLabel(/email|البريد/i).fill(account.email);
  await page.getByLabel(/password|كلمة المرور/i).first().fill(account.password);
  await page.getByRole('button', { name: /sign in|تسجيل الدخول/i }).click();
  await page.waitForURL((url) => !url.pathname.includes('sign-in'));
}

test('Arabic is the default, and the layout is right-to-left', async ({ page }) => {
  await page.goto('/sign-in');

  // Not negotiated from Accept-Language: Arabic is what everyone gets.
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('English is reachable by choice and carried in the URL', async ({ page }) => {
  await page.goto('/en/sign-in');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
});

test('a pharmacist sees the fee breakdown before applying', async ({ page }) => {
  await signIn(page, ACCOUNTS.pharmacist);
  await page.goto('/en/browse');

  await page.getByRole('link').filter({ hasText: /Al-Rahma/ }).first().click();

  // Both halves of the fee are on the page: what they get, and what the
  // commission is. Prices are Western numerals in both languages.
  await expect(page.getByText(/Agreed rate|Your agreed rate/i)).toBeVisible();
  await expect(page.getByText(/40,000/)).toBeVisible();
});

test('an unverified pharmacist can apply, and is told the application is held', async ({ page }) => {
  await signIn(page, ACCOUNTS.pendingPharmacist);

  // The pending banner is on every page, not just at the moment of failure.
  await expect(page.getByText(/being verified|قيد التوثيق/i).first()).toBeVisible();

  await page.goto('/en/browse');
  await page.getByRole('link').filter({ hasText: /Al-Rahma/ }).first().click();

  await expect(
    page.getByText(/will reach the pharmacy once your account is verified/i),
  ).toBeVisible();
});

test('a pharmacy cannot see an application from an unverified pharmacist', async ({ page }) => {
  await signIn(page, ACCOUNTS.pharmacy);
  await page.goto('/en/applicants');

  // Noor applied in the seed while still pending. RLS holds it back.
  await expect(page.getByText(/Noor/)).toHaveCount(0);
});

test('the reviewer cannot verify an account with no document attached', async ({ page }) => {
  await signIn(page, ACCOUNTS.reviewer);
  await page.goto('/en/admin/queue');

  await expect(page.getByText(/No document uploaded yet/i).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /^Verify$/ }).first()).toBeDisabled();
});

test('the handoff cannot be confirmed until all five items are agreed', async ({ page }) => {
  await signIn(page, ACCOUNTS.pharmacist);
  await page.goto('/en/shifts');

  const handoffLink = page.getByRole('link', { name: /handoff/i }).first();
  if ((await handoffLink.count()) === 0) test.skip(true, 'no upcoming booking in the seed');

  await handoffLink.click();
  await expect(page.getByRole('button', { name: /Confirm handoff/i })).toBeDisabled();
});

test('a pharmacy posting an overnight shift is told it crosses midnight', async ({ page }) => {
  await signIn(page, ACCOUNTS.pharmacy);
  await page.goto('/en/post');

  await page.getByLabel('Start time').fill('22:00');
  await page.getByLabel('End time').fill('06:00');

  // 22:00–06:00 is eight hours, and the pharmacy should learn that here rather
  // than from the applicant.
  await expect(page.getByText(/runs past midnight/i)).toBeVisible();
  await expect(page.getByText(/8 × 5,000 = 40,000/)).toBeVisible();
});
