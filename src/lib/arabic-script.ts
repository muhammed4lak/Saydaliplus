/**
 * Does this string contain Arabic script?
 *
 * Used to keep the Arabic name fields honest. Requiring an Arabic name is only
 * worth anything if the field actually holds Arabic: a pharmacy that pastes
 * "Al-Rasheed Pharmacy" into both boxes has satisfied a NOT NULL and changed
 * nothing for the Arabic-browsing pharmacist the rule exists for.
 *
 * The test is "contains at least one Arabic character", not "is entirely
 * Arabic". Real pharmacy names mix scripts — a branch number, a Latin brand
 * name, a transliterated street — and rejecting those would be a worse failure
 * than the one we are fixing.
 *
 * Written as escapes rather than literal characters because several of these
 * are invisible or bidirectional in a source file. U+FEFF is deliberately left
 * outside the last range: it is the byte-order mark, and a name that is nothing
 * but an invisible BOM should not count as Arabic.
 *
 * The same ranges are enforced in SQL by `pharmacy_name_ar_is_arabic` in
 * migration 0013. If you change one, change the other.
 */
const ARABIC =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFC]/;

export function containsArabic(value: string): boolean {
  return ARABIC.test(value);
}
