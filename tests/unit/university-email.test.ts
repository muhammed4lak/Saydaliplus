import { describe, expect, it } from 'vitest';
import { isUniversityEmail, isValidEmail } from '@/lib/university-email';

describe('isUniversityEmail', () => {
  it('accepts the real Iraqi faculty domains named in the spec', () => {
    const accepted = [
      'name@uobaghdad.edu.iq',
      'name@uomustansiriyah.edu.iq',
      'name@uobasrah.edu.iq',
      'name@uomosul.edu.iq',
      'name@uokufa.edu.iq',
    ];

    for (const email of accepted) {
      expect(isUniversityEmail(email), email).toBe(true);
    }
  });

  it('accepts the general academic patterns', () => {
    expect(isUniversityEmail('student@mit.edu')).toBe(true);
    expect(isUniversityEmail('student@ox.ac.uk')).toBe(true);
    expect(isUniversityEmail('student@university-of-kerbala.iq')).toBe(true);
  });

  it('rejects the personal providers', () => {
    const rejected = [
      'zainab@gmail.com',
      'zainab@yahoo.com',
      'zainab@hotmail.com',
      'zainab@outlook.com',
      'zainab@icloud.com',
      'zainab@live.com',
      'zainab@protonmail.com',
      'zainab@aol.com',
      'zainab@mail.ru',
      'zainab@yandex.com',
    ];

    for (const email of rejected) {
      expect(isUniversityEmail(email), email).toBe(false);
    }
  });

  it('rejects a personal provider even on an academic-looking address', () => {
    expect(isUniversityEmail('pharmacy.student.uobaghdad@gmail.com')).toBe(false);
  });

  it('rejects an ordinary commercial domain', () => {
    expect(isUniversityEmail('someone@company.iq')).toBe(false);
    expect(isUniversityEmail('someone@example.com')).toBe(false);
  });

  it('is case and whitespace insensitive', () => {
    expect(isUniversityEmail('  Name@UOBaghdad.Edu.IQ  ')).toBe(true);
  });

  it('rejects malformed addresses', () => {
    expect(isUniversityEmail('not-an-email')).toBe(false);
    expect(isUniversityEmail('missing@domain')).toBe(false);
    expect(isUniversityEmail('')).toBe(false);
  });
});

describe('isValidEmail', () => {
  it('accepts a normal address and rejects obvious junk', () => {
    expect(isValidEmail('ahmed@example.com')).toBe(true);
    expect(isValidEmail('ahmed@@example.com')).toBe(false);
    expect(isValidEmail('ahmed @example.com')).toBe(false);
  });
});
