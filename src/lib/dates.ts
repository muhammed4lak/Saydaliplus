/**
 * Date formatting.
 *
 * Iraqi Arabic uses the Levantine month names — حزيران، تموز، آب، أيلول — not the
 * Gulf transliterations (يونيو، يوليو) that `Intl` produces for `ar`. Getting this
 * wrong is a small thing that reads as foreign immediately, so the month names
 * are supplied rather than taken from the locale data.
 */

import type { Locale } from '@/i18n/routing';

const LEVANTINE_MONTHS = [
  'كانون الثاني',
  'شباط',
  'آذار',
  'نيسان',
  'أيار',
  'حزيران',
  'تموز',
  'آب',
  'أيلول',
  'تشرين الأول',
  'تشرين الثاني',
  'كانون الأول',
] as const;

const ENGLISH_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/** Sunday-first, because the Iraqi working week runs Sunday to Thursday. */
const WEEKDAYS = {
  ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
} as const;

export function monthName(monthIndex: number, locale: Locale): string {
  const months = locale === 'ar' ? LEVANTINE_MONTHS : ENGLISH_MONTHS;
  return months[monthIndex] ?? '';
}

export function weekdayName(date: Date, locale: Locale): string {
  return WEEKDAYS[locale][date.getDay()] ?? '';
}

/** `15 حزيران` / `15 June` — Western numerals in both. */
export function formatDayMonth(date: Date, locale: Locale): string {
  const day = date.getDate();
  const month = monthName(date.getMonth(), locale);
  return locale === 'ar' ? `${day} ${month}` : `${day} ${month}`;
}

export function formatDate(date: Date, locale: Locale): string {
  return `${formatDayMonth(date, locale)} ${date.getFullYear()}`;
}

/** `8:00 ص – 4:00 م` / `8:00 AM – 4:00 PM`. */
export function formatTimeRange(startsAt: Date, endsAt: Date, locale: Locale): string {
  return `${formatTime(startsAt, locale)} – ${formatTime(endsAt, locale)}`;
}

export function formatTime(date: Date, locale: Locale): string {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const meridiem = locale === 'ar' ? (hours < 12 ? 'ص' : 'م') : hours < 12 ? 'AM' : 'PM';
  return `${hour12}:${minutes} ${meridiem}`;
}

/** The date range on a listing card: `15 حزيران – 7 أيلول`. */
export function formatDateRange(from: Date, to: Date, locale: Locale): string {
  return `${formatDayMonth(from, locale)} – ${formatDayMonth(to, locale)}`;
}
