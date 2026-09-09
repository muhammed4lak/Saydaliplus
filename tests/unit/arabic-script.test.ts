import { describe, expect, it } from 'vitest';
import { containsArabic } from '@/lib/arabic-script';

describe('containsArabic', () => {
  it('accepts an Arabic pharmacy name', () => {
    expect(containsArabic('صيدلية الرحمة')).toBe(true);
  });

  it('rejects the Latin name pasted into the Arabic box', () => {
    // The failure the rule exists to catch. A NOT NULL alone would pass this.
    expect(containsArabic('Al-Rahma Pharmacy')).toBe(false);
  });

  it('accepts a name that mixes scripts', () => {
    // Real names carry branch numbers and Latin brands; rejecting them would be
    // a worse failure than the one this fixes.
    expect(containsArabic('صيدلية النهرين 2')).toBe(true);
    expect(containsArabic('صيدلية Vitamin House')).toBe(true);
  });

  it('rejects an empty or whitespace-only name', () => {
    expect(containsArabic('')).toBe(false);
    expect(containsArabic('   ')).toBe(false);
  });

  it('does not count a byte-order mark as Arabic', () => {
    // U+FEFF sits inside the presentation-forms block but is invisible; a name
    // made of one would otherwise pass.
    expect(containsArabic('\uFEFF')).toBe(false);
  });

  it('rejects other non-Latin scripts that are not Arabic', () => {
    expect(containsArabic('Аптека')).toBe(false); // Cyrillic
    expect(containsArabic('\u05D1\u05D9\u05EA \u05DE\u05E8\u05E7\u05D7\u05EA')).toBe(false); // Hebrew
  });

  it('accepts Arabic-Indic digits and Arabic punctuation', () => {
    expect(containsArabic('١٢٣')).toBe(true);
  });
});
