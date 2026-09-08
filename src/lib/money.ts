/**
 * Money formatting.
 *
 * Western numerals in both languages — 40,000, never ٤٠٬٠٠٠. Iraqi digital
 * interfaces, ZainCash and Qi Card included, all use Western digits; Eastern
 * Arabic numerals in a price field read as a typo to the people using this.
 * Same for phone numbers and licence IDs.
 */

const GROUPED = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

/** `40000` → `"40,000"`. */
export function formatAmount(amount: number): string {
  return GROUPED.format(Math.round(amount));
}

/** `40000` → `"40,000 IQD"` / `"40,000 د.ع"`. */
export function formatIQD(amount: number, locale: 'ar' | 'en' = 'ar'): string {
  return `${formatAmount(amount)} ${locale === 'ar' ? 'د.ع' : 'IQD'}`;
}

/**
 * The rate basis line under a price: `5,000/hr × 8h` or `flat · 7h`.
 * Shown on every card so a pharmacist can compare like with like at a glance.
 */
export function formatRateBasis(
  rateType: 'hourly' | 'flat',
  rateAmount: number,
  hours: number,
  locale: 'ar' | 'en' = 'ar',
): string {
  const hoursLabel = locale === 'ar' ? `${formatAmount(hours)} س` : `${formatAmount(hours)}h`;
  if (rateType === 'hourly') {
    return locale === 'ar'
      ? `${formatAmount(rateAmount)}/ساعة × ${hoursLabel}`
      : `${formatAmount(rateAmount)}/hr × ${hoursLabel}`;
  }
  return locale === 'ar' ? `مقطوع · ${hoursLabel}` : `flat · ${hoursLabel}`;
}
