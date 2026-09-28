/* Types for data/drugs.mjs — only the parts read outside the single-file
   builds. The builds themselves embed the data and are untyped. */
export type Severity = 'warning' | 'serious' | 'critical';
export interface Bilingual { ar: string; en: string }

export interface Drug {
  sci: string;
  ar: string;
  atc: string;
  /** A class key of CATEGORIES ("cvs.acei"); its group is the part before the dot. */
  cat: string;
  form: string;
  doses: string[];
  /** Originator or international brand names it is asked for by. */
  brand?: string[];
  /** Other names for the same molecule. */
  aka?: string[];
  /** Interaction classes it belongs to, keys of TAGS. */
  tags?: string[];
  notes: Bilingual;
  /** `with` is a drug's `sci`, a class ("#nsaid"), or one of OUTSIDE. */
  interactions?: { with: string; severity: Severity; note: Bilingual }[];
  contraindications?: Bilingual[];
  /** One to three questions to ask the patient when dispensing it. */
  ask: Bilingual[];
  /** A controlled substance: its movements form the controlled register. */
  controlled?: boolean;
  /** Keys of TAKE: when and how to take it. Never a dose. */
  take?: string[];
}

export interface DuplicateRule {
  id: string;
  codes: string[];
  severity: Severity;
  label: Bilingual;
  note: Bilingual;
  oftenIntended?: boolean;
}

export const FORM_KEYS: string[];
export const TAKE: Record<string, Bilingual>;
export const DUPLICATE_RULES: DuplicateRule[];
export const CATEGORIES: Record<string, Bilingual>;
export const TAGS: Record<string, Bilingual>;
/** A class rule: [class, class, severity, English note, Arabic note]. */
export const RULES: [string, string, Severity, string, string][];
export const OUTSIDE: string[];
export const QUESTIONS: Record<string, Bilingual>;
export const CONTRA: Record<string, Bilingual>;
declare const DRUGS: Drug[];
export default DRUGS;
