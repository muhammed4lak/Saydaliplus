/* Types for data/drugs.mjs — only the parts read outside the single-file
   builds. The builds themselves embed the data and are untyped. */
export interface Drug {
  sci: string;
  ar: string;
  atc: string;
  form: string;
  doses: string[];
  notes: { ar: string; en: string };
  interactions?: { with: string; severity: 'warning' | 'serious' | 'critical'; note: { ar: string; en: string } }[];
  contraindications?: { ar: string; en: string }[];
  /** A controlled substance: its movements form the controlled register. */
  controlled?: boolean;
  /** Keys of TAKE: when and how to take it. Never a dose. */
  take?: string[];
}

export interface DuplicateRule {
  id: string;
  codes: string[];
  severity: 'warning' | 'serious' | 'critical';
  label: { ar: string; en: string };
  note: { ar: string; en: string };
  oftenIntended?: boolean;
}

export const FORM_KEYS: string[];
export const TAKE: Record<string, { ar: string; en: string }>;
export const DUPLICATE_RULES: DuplicateRule[];
declare const DRUGS: Drug[];
export default DRUGS;
