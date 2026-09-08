import { z } from 'zod';

/**
 * The assistant's output shape and the defensive parsing around it.
 *
 * Deliberately free of `server-only` and of any SDK import: these are pure
 * rules, and they are the part most worth testing — every failure path here
 * ends in a throw, and a throw means the pharmacist's CV is left exactly as
 * they wrote it.
 */

/**
 * The output shape. Fixing this in the schema is half the no-invention
 * guarantee: the model returns exactly as many experience entries as it was
 * given, so it cannot add a job by adding an array element.
 */
export const assistResultSchema = z.object({
  summary: z.string(),
  experienceDetails: z.array(z.string()),
});

/**
 * The same shape as a JSON schema, for `output_config.format`. Written out
 * rather than derived from the Zod schema because the SDK's `zodOutputFormat`
 * helper requires Zod 4 and this project is on 3.x — the two are checked against
 * each other by `assistResultSchema.safeParse` on the way back, so they cannot
 * drift without the parse failing.
 */
export class CvAssistantError extends Error {}

export const ASSIST_JSON_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    experienceDetails: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary', 'experienceDetails'],
  additionalProperties: false,
} as const;

export type AssistResult = z.infer<typeof assistResultSchema>;


/**
 * Parse the model's reply defensively.
 *
 * `output_config.format` already constrains this to the schema, so in the normal
 * case the fence-stripping never fires. It stays because the cost of being wrong
 * is asymmetric: a parse failure throws and the CV is untouched, whereas an
 * unhandled shape change would surface as a corrupted CV.
 *
 * Exported for tests — the parsing rules are worth testing without an API key.
 */
export function parseAssistResponse(raw: string, expectedEntries: number): AssistResult {
  // Strip a ```json fence if one appears despite the schema.
  const unfenced = raw
    .replace(/^\s*```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  let json: unknown;
  try {
    json = JSON.parse(unfenced);
  } catch {
    throw new CvAssistantError('The assistant returned something unreadable');
  }

  const parsed = assistResultSchema.safeParse(json);
  if (!parsed.success) {
    throw new CvAssistantError('The assistant returned an unexpected shape');
  }

  // A real invariant, not a formality: a mismatch would write one job's
  // description onto another, which is exactly the quiet corruption this
  // feature must never cause.
  if (parsed.data.experienceDetails.length !== expectedEntries) {
    throw new CvAssistantError('The assistant returned the wrong number of entries');
  }

  return parsed.data;
}
