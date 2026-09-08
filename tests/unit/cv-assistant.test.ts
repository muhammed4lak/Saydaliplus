import { describe, expect, it } from 'vitest';
import { parseAssistResponse } from '@/lib/ai/cv-schema';

/**
 * The parsing rules, tested without an API key.
 *
 * Every one of these cases ends in a throw, and a throw means the CV is left
 * exactly as the pharmacist wrote it. That is the behaviour worth pinning down:
 * the failure mode this feature must never have is quietly writing something
 * wrong into a document backed by Syndicate verification.
 */
describe('parseAssistResponse', () => {
  const valid = JSON.stringify({
    summary: 'Community pharmacist with eight years on the counter in Baghdad.',
    experienceDetails: ['Counter and dispensing.', 'Night cover and narcotics register.'],
  });

  it('parses a well-formed response', () => {
    const result = parseAssistResponse(valid, 2);
    expect(result.summary).toContain('Community pharmacist');
    expect(result.experienceDetails).toHaveLength(2);
  });

  it('strips a code fence the model added anyway', () => {
    expect(parseAssistResponse('```json\n' + valid + '\n```', 2).experienceDetails).toHaveLength(2);
    expect(parseAssistResponse('```\n' + valid + '\n```', 2).experienceDetails).toHaveLength(2);
  });

  it('tolerates surrounding whitespace', () => {
    expect(parseAssistResponse(`\n\n  ${valid}  \n`, 2).summary).toBeTruthy();
  });

  it('rejects a response that is not JSON at all', () => {
    expect(() => parseAssistResponse('Sorry, I cannot help with that.', 2)).toThrow();
  });

  it('rejects a response missing a required field', () => {
    expect(() => parseAssistResponse(JSON.stringify({ summary: 'x' }), 0)).toThrow();
  });

  it('rejects wrong types', () => {
    expect(() =>
      parseAssistResponse(JSON.stringify({ summary: 42, experienceDetails: [] }), 0),
    ).toThrow();
    expect(() =>
      parseAssistResponse(JSON.stringify({ summary: 'x', experienceDetails: 'not an array' }), 0),
    ).toThrow();
  });

  it('rejects a mismatched number of experience entries', () => {
    // The dangerous case: two jobs in, three descriptions back. Applying that
    // would put one job's description onto another.
    expect(() => parseAssistResponse(valid, 3)).toThrow();
    expect(() => parseAssistResponse(valid, 1)).toThrow();
  });

  it('accepts an empty experience list when none was sent', () => {
    const empty = JSON.stringify({ summary: 'A short summary.', experienceDetails: [] });
    expect(parseAssistResponse(empty, 0).experienceDetails).toEqual([]);
  });
});
