/**
 * Preset options for the CV's skills and languages.
 *
 * Presets rather than free text for two reasons. A picker is far faster on a
 * phone than typing a list; and a shared vocabulary means a pharmacy searching
 * for "narcotics register" finds the pharmacists who have it, which free text
 * would fragment across a dozen spellings in two scripts. Free text stays
 * available as an escape hatch — the list cannot anticipate everything.
 */

export interface Preset {
  key: string;
  en: string;
  ar: string;
}

/** Pharmacy-specific, drawn from what an Iraqi community pharmacist actually does. */
export const SKILL_PRESETS: Preset[] = [
  { key: 'dispensing', en: 'Dispensing', ar: 'صرف الأدوية' },
  { key: 'patient_counselling', en: 'Patient counselling', ar: 'إرشاد المرضى' },
  { key: 'prescription_screening', en: 'Prescription screening', ar: 'مراجعة الوصفات' },
  { key: 'narcotics_register', en: 'Narcotics register', ar: 'سجل المواد المخدرة' },
  { key: 'inventory_control', en: 'Inventory control', ar: 'إدارة المخزون' },
  { key: 'cold_chain', en: 'Cold chain', ar: 'سلسلة التبريد' },
  { key: 'otc_advice', en: 'OTC advice', ar: 'الإرشاد للأدوية بدون وصفة' },
  { key: 'vaccination', en: 'Vaccination', ar: 'التطعيم' },
  { key: 'bp_measurement', en: 'Blood-pressure measurement', ar: 'قياس ضغط الدم' },
  { key: 'blood_glucose', en: 'Blood glucose testing', ar: 'فحص سكر الدم' },
  { key: 'compounding', en: 'Compounding', ar: 'تحضير المستحضرات' },
  { key: 'stock_ordering', en: 'Stock ordering', ar: 'طلب المخزون' },
  { key: 'expiry_management', en: 'Expiry management', ar: 'إدارة الصلاحية' },
  { key: 'chronic_follow_up', en: 'Chronic disease follow-up', ar: 'متابعة الأمراض المزمنة' },
  { key: 'medication_reconciliation', en: 'Medication reconciliation', ar: 'مطابقة الأدوية' },
  { key: 'pharmacovigilance', en: 'Pharmacovigilance', ar: 'التيقظ الدوائي' },
  { key: 'insurance_claims', en: 'Insurance claims', ar: 'مطالبات التأمين' },
  { key: 'pos_systems', en: 'POS systems', ar: 'أنظمة نقاط البيع' },
  { key: 'first_aid', en: 'First aid', ar: 'الإسعافات الأولية' },
  { key: 'infant_formula', en: 'Infant formula advice', ar: 'إرشاد حليب الأطفال' },
];

/** The languages actually spoken across Iraq, plus the ones employers ask for. */
export const LANGUAGE_PRESETS: Preset[] = [
  { key: 'arabic', en: 'Arabic', ar: 'العربية' },
  { key: 'english', en: 'English', ar: 'الإنجليزية' },
  { key: 'kurdish', en: 'Kurdish', ar: 'الكردية' },
  { key: 'turkmen', en: 'Turkmen', ar: 'التركمانية' },
  { key: 'syriac', en: 'Syriac', ar: 'السريانية' },
  { key: 'persian', en: 'Persian', ar: 'الفارسية' },
  { key: 'turkish', en: 'Turkish', ar: 'التركية' },
  { key: 'french', en: 'French', ar: 'الفرنسية' },
  { key: 'german', en: 'German', ar: 'الألمانية' },
];

export const PROFICIENCY_LEVELS = ['native', 'fluent', 'professional', 'basic'] as const;

export const presetLabel = (preset: Preset, locale: 'ar' | 'en'): string =>
  locale === 'ar' ? preset.ar : preset.en;
