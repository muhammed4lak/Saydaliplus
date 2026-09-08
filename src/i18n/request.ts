import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested !== undefined && (routing.locales as readonly string[]).includes(requested)
      ? (requested as (typeof routing.locales)[number])
      : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    formats: {
      number: {
        // Western numerals in both languages — 40,000, never ٤٠٬٠٠٠. Iraqi
        // digital interfaces, ZainCash and Qi Card included, use these, and a
        // price or a phone number in Eastern Arabic numerals reads as a typo.
        default: { useGrouping: true, maximumFractionDigits: 0 },
      },
    },
  };
});
