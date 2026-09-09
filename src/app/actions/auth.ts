'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  pharmacistSignUpSchema,
  pharmacySignUpSchema,
  signInSchema,
  studentSignUpSchema,
} from '@/lib/validation';

export interface ActionState {
  error: string | null;
}

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: 'auth.errors.email' };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  // Deliberately not distinguishing "no such account" from "wrong password":
  // the difference tells an attacker which addresses are registered.
  if (error) return { error: 'auth.errors.signInFailed' };

  redirect('/');
}

export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/sign-in');
}

export async function signUpPharmacist(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = pharmacistSignUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'common.somethingWentWrong' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error || !data.user) return { error: 'common.somethingWentWrong' };

  // verification_status defaults to 'pending'. There is no digital registry to
  // check a Syndicate number against, so a person reviews the uploaded card —
  // see the admin queue. Nothing here can shortcut that.
  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    role: 'pharmacist',
    full_name_en: parsed.data.fullName,
    phone: parsed.data.phone,
    district: parsed.data.district,
  });
  if (profileError) return { error: 'common.somethingWentWrong' };

  const { error: detailsError } = await supabase.from('pharmacist_details').insert({
    profile_id: data.user.id,
    syndicate_reg_no: parsed.data.syndicateRegNo,
    graduation_year: parsed.data.graduationYear,
    card_document_url: parsed.data.cardDocumentUrl ?? null,
    districts: [parsed.data.district],
  });
  if (detailsError) return { error: 'common.somethingWentWrong' };

  redirect('/verification-pending');
}

export async function signUpPharmacy(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = pharmacySignUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'common.somethingWentWrong' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error || !data.user) return { error: 'common.somethingWentWrong' };

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    role: 'pharmacy',
    full_name_en: parsed.data.responsiblePharmacist,
    phone: parsed.data.phone,
    district: parsed.data.district,
  });
  if (profileError) return { error: 'common.somethingWentWrong' };

  const { error: detailsError } = await supabase.from('pharmacy_details').insert({
    profile_id: data.user.id,
    pharmacy_name_en: parsed.data.pharmacyNameEn,
    pharmacy_name_ar: parsed.data.pharmacyNameAr,
    licence_no: parsed.data.licenceNo,
    address: parsed.data.address,
    licence_document_url: parsed.data.licenceDocumentUrl ?? null,
  });
  if (detailsError) return { error: 'common.somethingWentWrong' };

  redirect('/verification-pending');
}

export async function signUpStudent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = studentSignUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'auth.errors.universityEmail' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.universityEmail,
    password: parsed.data.password,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm` },
  });
  if (error || !data.user) return { error: 'common.somethingWentWrong' };

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    role: 'student',
    full_name_en: parsed.data.fullName,
    phone: parsed.data.phone,
    district: parsed.data.district,
  });
  if (profileError) return { error: 'common.somethingWentWrong' };

  const { error: detailsError } = await supabase.from('student_details').insert({
    profile_id: data.user.id,
    university: parsed.data.university,
    university_email: parsed.data.universityEmail,
  });
  if (detailsError) return { error: 'common.somethingWentWrong' };

  // Students verify by confirming the university address — the domain check has
  // already passed, so clicking the link is the whole of it. /auth/confirm flips
  // the profile to verified.
  redirect('/check-your-email');
}
