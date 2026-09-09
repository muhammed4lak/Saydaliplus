import { z } from 'zod';
import { containsArabic } from '@/lib/arabic-script';
import { isUniversityEmail } from '@/lib/university-email';
import { MIN_LOG_CHARACTERS } from '@/lib/logbook';

/**
 * One set of schemas, used by the form and by the Server Action that receives
 * it. The client copy is a courtesy that saves a round trip; the server copy is
 * the one that decides.
 */

export const DISTRICTS = [
  'Karrada',
  'Jadriya',
  'Zayouna',
  'Mansour',
  'Sadr City',
  'Adhamiya',
  'Kadhimiya',
  'Dora',
] as const;

const password = z.string().min(8, 'auth.errors.password');
const phone = z.string().trim().min(10, 'auth.errors.required');
const district = z.string().trim().min(1, 'auth.errors.required');

export const signInSchema = z.object({
  email: z.string().trim().email('auth.errors.email'),
  password: z.string().min(1, 'auth.errors.required'),
});

const withPasswordConfirmation = <T extends z.ZodRawShape>(shape: T) =>
  z
    .object({ ...shape, password, confirmPassword: z.string() })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'auth.errors.passwordMatch',
    });

export const pharmacistSignUpSchema = withPasswordConfirmation({
  fullName: z.string().trim().min(2, 'auth.errors.required'),
  email: z.string().trim().email('auth.errors.email'),
  phone,
  syndicateRegNo: z.string().trim().min(3, 'auth.errors.required'),
  graduationYear: z.coerce
    .number()
    .int()
    .min(1950)
    .max(new Date().getFullYear()),
  district,
  cardDocumentUrl: z.string().url().optional(),
});

export const pharmacySignUpSchema = withPasswordConfirmation({
  // Both scripts, because Arabic is the default language and a Latin-only name
  // is unreadable to most of the pharmacists this pharmacy will be shown to.
  // The Arabic field has to contain Arabic or the requirement is cosmetic —
  // see containsArabic. Mirrored by a check constraint, so a request that
  // bypasses this schema is still refused.
  pharmacyNameAr: z
    .string()
    .trim()
    .min(2, 'auth.errors.required')
    .refine(containsArabic, 'auth.errors.arabicRequired'),
  pharmacyNameEn: z.string().trim().min(2, 'auth.errors.required'),
  responsiblePharmacist: z.string().trim().min(2, 'auth.errors.required'),
  email: z.string().trim().email('auth.errors.email'),
  phone,
  licenceNo: z.string().trim().min(3, 'auth.errors.required'),
  district,
  address: z.string().trim().min(4, 'auth.errors.required'),
  licenceDocumentUrl: z.string().url().optional(),
});

export const studentSignUpSchema = withPasswordConfirmation({
  fullName: z.string().trim().min(2, 'auth.errors.required'),
  university: z.string().trim().min(2, 'auth.errors.required'),
  // The rule that makes student verification automatic at all.
  universityEmail: z
    .string()
    .trim()
    .email('auth.errors.email')
    .refine(isUniversityEmail, 'auth.errors.universityEmail'),
  phone,
  district,
});

const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

export const postShiftSchema = z
  .object({
    type: z.literal('shift'),
    district,
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    startTime: z.string().regex(HH_MM),
    endTime: z.string().regex(HH_MM),
    rateType: z.enum(['hourly', 'flat']),
    rateAmount: z.coerce.number().positive(),
    includesControlled: z.coerce.boolean().default(false),
    notes: z.string().trim().max(2000).optional(),
  })
  // Deliberately no rule that the end time must be later than the start: an
  // overnight shift is 22:00-06:00 and perfectly valid. resolveShiftWindow()
  // rolls the date forward.
  .refine((data) => data.startTime !== data.endTime || data.rateType === 'flat', {
    path: ['endTime'],
    message: 'A shift priced by the hour needs a start and end that differ',
  });

export const postInternshipSchema = z.object({
  type: z.literal('internship'),
  district,
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().trim().max(2000).optional(),
});

export const postListingSchema = z.discriminatedUnion('type', [
  postShiftSchema.innerType(),
  postInternshipSchema,
]);

export const logWeekSchema = z.object({
  weekId: z.string().uuid(),
  daysPresent: z.array(z.boolean()).length(5),
  text: z.string().trim(),
});

/** The submit gate, as opposed to the save gate: saving a partial week is fine. */
export const submitLogWeekSchema = logWeekSchema
  .refine((data) => data.daysPresent.some(Boolean), {
    path: ['daysPresent'],
    message: 'logbook.needsAttendance',
  })
  .refine((data) => data.text.length >= MIN_LOG_CHARACTERS, {
    path: ['text'],
    message: 'logbook.needsText',
  });

export const ratingSchema = z.object({
  bookingId: z.string().uuid(),
  stars: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

export const incidentSchema = z.object({
  bookingId: z.string().uuid(),
  category: z.enum([
    'no_show',
    'controlled_substance_discrepancy',
    'till_discrepancy',
    'conduct',
    'non_payment',
    'unsafe_conditions',
    'pressure_to_dispense_improperly',
    'other',
  ]),
  description: z.string().trim().min(50, 'incidents.descriptionHint'),
});

export const payoutSchema = z.object({
  method: z.enum(['zaincash', 'qicard']),
});

export type PharmacistSignUp = z.infer<typeof pharmacistSignUpSchema>;
export type PharmacySignUp = z.infer<typeof pharmacySignUpSchema>;
export type StudentSignUp = z.infer<typeof studentSignUpSchema>;
export type PostListing = z.infer<typeof postListingSchema>;
