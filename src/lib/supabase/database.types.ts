/**
 * Database types.
 *
 * Hand-maintained to match supabase/migrations. Once you have a local Supabase
 * running, `npm run db:types` regenerates this file from the schema itself and
 * that becomes the source of truth — until then, if you add a migration, add the
 * matching type here or the compiler will not catch the mismatch.
 */

export type UserRole = 'pharmacist' | 'pharmacy' | 'student';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type ListingType = 'shift' | 'internship';
export type ListingStatus = 'open' | 'filled' | 'cancelled';
export type RateType = 'hourly' | 'flat';
export type ApplicationStatus = 'applied' | 'accepted' | 'rejected' | 'withdrawn';
export type BookingStatus = 'upcoming' | 'completed' | 'no_show' | 'cancelled';
export type CancellationOutcome = 'free' | 'late' | 'no_show';
export type PlacementStatus = 'active' | 'completed' | 'withdrawn';
export type LogWeekStatus = 'locked' | 'draft' | 'submitted' | 'approved';
export type PayoutMethod = 'zaincash' | 'qicard';
export type PayoutStatus = 'requested' | 'processing' | 'settled' | 'failed';
export type CvLang = 'en' | 'ar';
export type IncidentTier = 'tier_1' | 'tier_2' | 'tier_3';

export type Profile = {
  id: string;
  role: UserRole;
  full_name_en: string | null;
  full_name_ar: string | null;
  phone: string | null;
  district: string | null;
  locale: 'ar' | 'en';
  verification_status: VerificationStatus;
  verified_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export type PharmacistDetails = {
  profile_id: string;
  syndicate_reg_no: string;
  graduation_year: number;
  card_document_url: string | null;
  scope_tags: string[];
  districts: string[];
  available: boolean;
  /** Wallet or card identifier with the payment provider. */
  payout_destination: string | null;
}

export type PharmacyDetails = {
  profile_id: string;
  pharmacy_name_en: string | null;
  /** Required, and must contain Arabic script — see migration 0013. */
  pharmacy_name_ar: string;
  licence_no: string;
  address: string | null;
  licence_document_url: string | null;
}

export type StudentDetails = {
  profile_id: string;
  university: string;
  university_email: string;
  email_verified_at: string | null;
}

export type Listing = {
  id: string;
  pharmacy_id: string;
  type: ListingType;
  status: ListingStatus;
  district: string;
  starts_at: string;
  ends_at: string;
  rate_type: RateType | null;
  rate_amount: number | null;
  total_amount: number | null;
  includes_controlled: boolean;
  notes: string | null;
  created_at: string;
}

export type Application = {
  id: string;
  listing_id: string;
  applicant_id: string;
  status: ApplicationStatus;
  created_at: string;
}

export type Booking = {
  id: string;
  listing_id: string;
  pharmacist_id: string;
  pharmacy_id: string;
  status: BookingStatus;
  gross_amount: number;
  pharmacy_fee: number;
  pharmacist_fee: number;
  net_payout: number;
  cancelled_at: string | null;
  cancelled_by: string | null;
  cancellation_outcome: CancellationOutcome | null;
  completed_at: string | null;
  created_at: string;
}

/** The five items, in the order they are worked through at the counter. */
export type HandoffItems = {
  controlled_register_counted: boolean;
  till_float_agreed: boolean;
  fridge_log_checked: boolean;
  keys_alarm_safe_handed_over: boolean;
  owner_emergency_contact_confirmed: boolean;
}

export type Handoff = {
  booking_id: string;
  items: HandoffItems;
  started_at: string;
  confirmed_by_pharmacist_at: string | null;
  confirmed_by_pharmacy_at: string | null;
}

export type Rating = {
  id: string;
  booking_id: string;
  rater_id: string;
  ratee_id: string;
  stars: number;
  comment: string | null;
  created_at: string;
}

export type Placement = {
  id: string;
  listing_id: string;
  student_id: string;
  pharmacy_id: string;
  starts_on: string;
  ends_on: string;
  status: PlacementStatus;
  created_at: string;
}

export type LogWeekRow = {
  id: string;
  placement_id: string;
  week_no: number;
  week_start: string;
  week_end: string;
  days_present: boolean[];
  text_en: string | null;
  text_ar: string | null;
  status: LogWeekStatus;
  submitted_at: string | null;
  updated_at: string;
}

export type MonthApproval = {
  placement_id: string;
  month_no: number;
  approved_by: string | null;
  approved_at: string | null;
  returned_at: string | null;
  returned_note: string | null;
}

export type CvRow = {
  pharmacist_id: string;
  lang: CvLang;
  summary: string | null;
  experience: CvExperience[];
  education: CvEducation[];
  certifications: CvCertification[];
  skills: string[];
  languages: CvLanguage[];
  updated_at: string;
}

export type CvExperience = {
  role: string;
  organisation: string;
  from: string;
  to: string | null;
  details: string;
}

export type CvEducation = {
  qualification: string;
  institution: string;
  year: string;
}

export type CvCertification = {
  name: string;
  issuer: string;
  year: string;
}

export type CvLanguage = {
  language: string;
  proficiency: 'native' | 'fluent' | 'professional' | 'basic';
}

export type Payout = {
  id: string;
  pharmacist_id: string;
  amount: number;
  method: PayoutMethod;
  status: PayoutStatus;
  provider_ref: string | null;
  failure_reason: string | null;
  requested_at: string;
  settled_at: string | null;
}

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  title_key: string;
  payload: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

/** Derived, never stored. Read-only by construction — it is a view. */
export type PharmacistStats = {
  pharmacist_id: string;
  shifts_completed: number;
  hours_worked: number;
  pharmacies_worked_with: number;
  average_rating: number | null;
  ratings_received: number;
  reliability_percent: number | null;
  member_since: string;
}

/** The narrow projection a pharmacy sees about an applicant. */
export type ApplicantCard = {
  application_id: string;
  listing_id: string;
  application_status: ApplicationStatus;
  applied_at: string;
  pharmacy_id: string;
  applicant_id: string;
  applicant_role: UserRole;
  full_name_en: string | null;
  full_name_ar: string | null;
  district: string | null;
  syndicate_reg_masked: string | null;
  graduation_year: number | null;
  scope_tags: string[] | null;
  university: string | null;
  shifts_completed: number | null;
  average_rating: number | null;
  reliability_percent: number | null;
  member_since: string | null;
}

export type PlacementCertificate = {
  placement_id: string;
  student_id: string;
  pharmacy_id: string;
  starts_on: string;
  ends_on: string;
  university: string;
  weeks_approved: number;
  days_attended: number;
  days_possible: number;
  unlocked: boolean;
}

/**
 * The shape `supabase-js` expects per table. `Relationships` must be present —
 * without it the client's generics collapse and every `.select()` infers as
 * `never`, which looks like a schema mismatch but is only a missing key.
 */
type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type Table<T, R extends Relationship[] = []> = {
  Row: T;
  Insert: Partial<T>;
  Update: Partial<T>;
  Relationships: R;
};

type View<T> = { Row: T; Relationships: [] };

/**
 * Only the relationships the app actually embeds are declared. PostgREST derives
 * embedding from foreign keys, so these mirror real constraints in the
 * migrations — they are not decoration, and inventing one here would produce a
 * query that typechecks and then fails at runtime.
 */
type ListingRelationships = [
  {
    foreignKeyName: 'listings_pharmacy_id_fkey_details';
    columns: ['pharmacy_id'];
    isOneToOne: true;
    referencedRelation: 'pharmacy_details';
    referencedColumns: ['profile_id'];
  },
];

type BookingRelationships = [
  {
    foreignKeyName: 'bookings_listing_id_fkey';
    columns: ['listing_id'];
    isOneToOne: true;
    referencedRelation: 'listings';
    referencedColumns: ['id'];
  },
];

type DetailRelationships<Name extends string> = [
  {
    foreignKeyName: `${Name}_profile_id_fkey`;
    columns: ['profile_id'];
    isOneToOne: true;
    referencedRelation: 'profiles';
    referencedColumns: ['id'];
  },
];

type PlacementRelationships = [
  {
    foreignKeyName: 'placements_pharmacy_id_fkey_details';
    columns: ['pharmacy_id'];
    isOneToOne: true;
    referencedRelation: 'pharmacy_details';
    referencedColumns: ['profile_id'];
  },
];

type HandoffRelationships = [
  {
    foreignKeyName: 'handoffs_booking_id_fkey';
    columns: ['booking_id'];
    isOneToOne: true;
    referencedRelation: 'bookings';
    referencedColumns: ['id'];
  },
];

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile>;
      pharmacist_details: Table<PharmacistDetails, DetailRelationships<'pharmacist_details'>>;
      pharmacy_details: Table<PharmacyDetails, DetailRelationships<'pharmacy_details'>>;
      student_details: Table<StudentDetails, DetailRelationships<'student_details'>>;
      platform_admins: Table<{ profile_id: string; granted_at: string }>;
      listings: Table<Listing, ListingRelationships>;
      applications: Table<Application>;
      bookings: Table<Booking, BookingRelationships>;
      handoffs: Table<Handoff, HandoffRelationships>;
      ratings: Table<Rating>;
      placements: Table<Placement, PlacementRelationships>;
      log_weeks: Table<LogWeekRow>;
      month_approvals: Table<MonthApproval>;
      cv: Table<CvRow>;
      payouts: Table<Payout>;
      notifications: Table<Notification>;
      incidents: Table<Incident>;
    };
    Views: {
      pharmacist_stats: View<PharmacistStats>;
      applicant_cards: View<ApplicantCard>;
      placement_certificates: View<PlacementCertificate>;
      payable_bookings: View<PayableBooking>;
      placement_people: View<PlacementPerson>;
    };
    Functions: {
      accept_application: { Args: { application_id: string }; Returns: Booking | null };
      cancel_booking: { Args: { booking_id: string; reason?: string }; Returns: Booking };
      submit_log_week: { Args: { week_id: string }; Returns: LogWeekRow };
      approve_month: { Args: { placement_id: string; month_no: number }; Returns: undefined };
      return_month: {
        Args: { placement_id: string; month_no: number; note?: string };
        Returns: undefined;
      };
      request_payout: { Args: { method: PayoutMethod }; Returns: Payout };
    };
    Enums: {
      user_role: UserRole;
      verification_status: VerificationStatus;
      listing_type: ListingType;
      listing_status: ListingStatus;
      rate_type: RateType;
    };
    CompositeTypes: Record<never, never>;
  };
}

export type Incident = {
  id: string;
  booking_id: string;
  reporter_id: string;
  subject_id: string;
  category: string;
  description: string;
  evidence: unknown[];
  tier: IncidentTier;
  status: string;
  subject_notified_at: string | null;
  subject_reply: string | null;
  subject_replied_at: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  resolution_note: string | null;
  created_at: string;
}

/** The narrow projection a host pharmacy sees about its trainee. */
export type PlacementPerson = {
  placement_id: string;
  student_id: string;
  pharmacy_id: string;
  student_name_en: string | null;
  student_name_ar: string | null;
  university: string | null;
};

export type PayableBooking = {
  booking_id: string;
  pharmacist_id: string;
  pharmacy_id: string;
  net_payout: number;
  completed_at: string | null;
}
