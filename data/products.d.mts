/* Types for data/products.mjs, so the unit tests (and later the real app) read
   the catalogue as typed data rather than `any`. */
export type MappingState = 'verified' | 'auto' | 'unmapped' | 'nondrug';

export interface ProductMolecule {
  sci: string;
  strength: string;
  /** Present and false only for an ingredient outside the reference. */
  ref?: false;
}

export interface Product {
  barcode: string;
  name: { ar: string; en: string };
  form: string | null;
  strength: string;
  pack: { ar: string; en: string };
  price: number;
  mapping: MappingState;
  molecules: ProductMolecule[];
}

export const MAPPING_STATES: MappingState[];
declare const PRODUCTS: Product[];
export default PRODUCTS;
