/**
 * Barcodes, as a till reads them (W17).
 *
 * A wedge scanner types digits and presses Enter; a phone camera hands over a
 * string. Either way the first thing a till must know is whether what arrived
 * is a well-formed barcode or a mis-scan, because a mis-scan that is accepted
 * becomes a "new product" in the mapping queue and a pharmacist chasing a
 * product that does not exist.
 *
 * EAN-13 is what pharmaceutical packs carry in practice. The check digit is the
 * whole defence against a single misread digit, so it is verified rather than
 * trusted.
 */

/** The EAN-13 check digit for the first twelve digits. */
export function ean13CheckDigit(first12: string): number {
  if (!/^\d{12}$/.test(first12)) {
    throw new Error(`EAN-13 needs exactly twelve digits before the check digit, got "${first12}"`);
  }
  const sum = [...first12].reduce(
    (n, c, i) => n + Number(c) * (i % 2 === 0 ? 1 : 3),
    0,
  );
  return (10 - (sum % 10)) % 10;
}

/** True for a thirteen-digit code whose check digit is right. */
export function isValidEan13(code: string): boolean {
  if (!/^\d{13}$/.test(code)) return false;
  return ean13CheckDigit(code.slice(0, 12)) === Number(code[12]);
}

/**
 * What a scanner or a keyboard actually delivers, cleaned: whitespace and the
 * stray separators some scanners are configured to send are dropped, and
 * nothing else is guessed at. A code that is still not thirteen digits after
 * this is not "fixed" — it is rejected.
 */
export function normaliseScan(raw: string): string {
  return raw.replace(/[\s-]/g, '');
}
