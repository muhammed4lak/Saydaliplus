/**
 * Student verification is the only automatic one we have: there is no digital
 * registry to check a pharmacist against, but a university address is
 * self-proving enough for an unpaid placement.
 *
 * The rule is deliberately permissive on academic domains and strict on the
 * personal providers, because the failure modes are asymmetric — a rejected real
 * student emails support, an accepted Gmail address puts an unverified stranger
 * into a pharmacy.
 */

/** Rejected outright, however academic the rest of the address looks. */
export const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'live.com',
  'protonmail.com',
  'proton.me',
  'aol.com',
  'mail.ru',
  'yandex.com',
  'yandex.ru',
] as const;

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_SHAPE.test(value.trim());
}

export function emailDomain(value: string): string | null {
  if (!isValidEmail(value)) return null;
  const domain = value.trim().toLowerCase().split('@')[1];
  return domain ?? null;
}

/**
 * Accepts `.edu`, `.edu.iq`, `.ac.*`, and any domain containing `uni`/`univ`.
 * That last clause is what catches the real Iraqi faculties — uobaghdad.edu.iq,
 * uomustansiriyah.edu.iq, uobasrah.edu.iq — which are `.edu.iq` anyway, but also
 * the private universities that use bare `uni…` domains.
 */
export function isUniversityEmail(value: string): boolean {
  const domain = emailDomain(value);
  if (domain === null) return false;
  if ((PERSONAL_EMAIL_DOMAINS as readonly string[]).includes(domain)) return false;

  return (
    /\.edu(\.[a-z]{2})?$/.test(domain) ||
    /\.ac(\.[a-z]{2})?$/.test(domain) ||
    /uni|univ/.test(domain)
  );
}
