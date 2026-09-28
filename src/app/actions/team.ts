'use server';

import { randomInt } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/session';
import { addPharmacySchema, inviteCodeSchema, inviteStaffSchema } from '@/lib/validation';
import { DEFAULT_ROLE, extrasBeyondRole, isPermission } from '@/lib/permissions';

/**
 * Owners and teams (migration 0015).
 *
 * The database is the rule: only a Syndicate-verified pharmacist owns a
 * pharmacy or joins a team, only the owner changes a team, nobody becomes
 * active except by accepting, and what anyone may do is has_permission().
 * These actions check the badge first only to say so plainly rather than
 * return a policy error; a request that skips them is refused all the same.
 */

export interface ActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

const needBadge = { ok: false, error: 'team.errors.needBadge' } as const;

/** Adding a pharmacy: how a pharmacist becomes an owner. It starts pending review. */
export async function addPharmacy(formData: FormData): Promise<ActionResult> {
  const session = await requireSession();
  if (!session.hasBadge) return needBadge;
  const parsed = addPharmacySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'common.somethingWentWrong' };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pharmacies')
    .insert({
      owner_id: session.userId,
      name_ar: parsed.data.pharmacyNameAr,
      name_en: parsed.data.pharmacyNameEn,
      licence_no: parsed.data.licenceNo,
      district: parsed.data.district,
      address: parsed.data.address,
      licence_document_url: parsed.data.licenceDocumentUrl ?? null,
    })
    .select('id')
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? 'common.somethingWentWrong' };

  revalidatePath('/');
  return { ok: true, id: data.id };
}

/**
 * An invitation: a link to send on WhatsApp or by text, and a six-digit code
 * as the fallback. Someone new holds the Cashier role.
 */
export async function inviteStaff(formData: FormData): Promise<ActionResult> {
  const session = await requireSession();
  if (!session.hasBadge) return needBadge;
  const parsed = inviteStaffSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'common.somethingWentWrong' };
  if (!session.owned.some((p) => p.id === parsed.data.pharmacyId)) return { ok: false, error: 'team.errors.notYours' };

  const supabase = await createClient();
  const { data: role } = await supabase.from('staff_roles').select('id').eq('preset', DEFAULT_ROLE).single();
  if (!role) return { ok: false, error: 'common.somethingWentWrong' };

  const code = String(randomInt(100000, 1000000));
  const { data, error } = await supabase
    .from('pharmacy_staff')
    .insert({
      pharmacy_id: parsed.data.pharmacyId,
      invited_contact: parsed.data.contact.includes('@') ? parsed.data.contact.toLowerCase() : parsed.data.contact,
      name: parsed.data.name,
      role_id: role.id,
      invite_code: code,
      invited_by: session.userId,
    })
    .select('id')
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? 'common.somethingWentWrong' };

  revalidatePath('/');
  return { ok: true, id: data.id };
}

/** Accepting, from the link or by typing the code. The database checks the badge. */
export async function acceptInvitation(formData: FormData): Promise<ActionResult> {
  const session = await requireSession();
  if (!session.hasBadge) return needBadge;
  const parsed = inviteCodeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'team.errors.code' };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc('accept_invitation', { code: parsed.data.code });
  if (error || !data) return { ok: false, error: 'team.errors.badCode' };

  revalidatePath('/');
  return { ok: true, id: data.id };
}

/** A role for someone, and anything extra for them alone. Extras the role gives are dropped. */
export async function setStaffAccess(staffId: string, roleId: string, extras: string[]): Promise<ActionResult> {
  const session = await requireSession();
  if (!session.hasBadge) return needBadge;
  const supabase = await createClient();
  const { data: role } = await supabase.from('staff_roles').select('grants').eq('id', roleId).single();
  if (!role) return { ok: false, error: 'common.somethingWentWrong' };

  const { error } = await supabase
    .from('pharmacy_staff')
    .update({ role_id: roleId, extra_grants: extrasBeyondRole(role.grants, extras.filter(isPermission)) })
    .eq('id', staffId);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/');
  return { ok: true };
}

/** Ending employment: the record stays, and they can do nothing there any more. */
export async function endEmployment(staffId: string): Promise<ActionResult> {
  const session = await requireSession();
  if (!session.hasBadge) return needBadge;
  const supabase = await createClient();
  const { error } = await supabase
    .from('pharmacy_staff')
    .update({ state: 'ended', ended_on: new Date().toISOString().slice(0, 10), invite_code: null })
    .eq('id', staffId);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/');
  return { ok: true };
}

/**
 * An owner's own role: a name and permissions, at all of their pharmacies.
 * Saved over an existing one, it changes everyone who holds it.
 */
export async function saveRole(name: string, grants: string[], roleId?: string): Promise<ActionResult> {
  const session = await requireSession();
  if (!session.hasBadge) return needBadge;
  const clean = grants.filter(isPermission);
  if (!name.trim() || !clean.length) return { ok: false, error: 'auth.errors.required' };

  const supabase = await createClient();
  const { data, error } = roleId
    ? await supabase.from('staff_roles').update({ name: name.trim(), grants: clean }).eq('id', roleId).select('id').single()
    : await supabase.from('staff_roles').insert({ owner_id: session.userId, name: name.trim(), grants: clean }).select('id').single();
  if (error || !data) return { ok: false, error: error?.message ?? 'common.somethingWentWrong' };

  revalidatePath('/');
  return { ok: true, id: data.id };
}
