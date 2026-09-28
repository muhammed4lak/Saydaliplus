/**
 * Who may do what at a pharmacy (migration 0015).
 *
 * One kind of account for a pharmacist. Owning a pharmacy is a link
 * (pharmacies.owner_id) and so is working on its team (pharmacy_staff); both
 * need the Syndicate badge. At a pharmacy they own, an owner may do
 * everything; anyone else — an owner included, at someone else's pharmacy —
 * has what their role gives plus any extras granted to them alone.
 *
 * The database decides (public.has_permission); this mirrors it so a screen
 * does not offer what the database would refuse. The permission list and the
 * ready-made roles are checked against the migration by a unit test, so the
 * two cannot drift apart quietly.
 */

export const PERMISSIONS = [
  'sell',
  'voids',
  'discounts',
  'prices',
  'stock',
  'writeoffs',
  'cashVariance',
  'receipt',
  'market',
  'ownItems',
  'patients',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/** Granted to nobody until the feature exists. */
export const LATER_PERMISSIONS = { exchange: 'v0.0018' } as const;

export type ReadyMadeRole = 'cashier' | 'pharmacist' | 'stockKeeper' | 'manager';

export const READY_MADE_ROLES: Record<ReadyMadeRole, readonly Permission[]> = {
  cashier: ['sell'],
  pharmacist: ['sell', 'voids', 'discounts', 'ownItems', 'patients'],
  stockKeeper: ['sell', 'stock', 'writeoffs'],
  manager: PERMISSIONS,
};

/** Someone new holds the Cashier role: selling, and nothing else. */
export const DEFAULT_ROLE: ReadyMadeRole = 'cashier';

export const isPermission = (value: string): value is Permission =>
  (PERMISSIONS as readonly string[]).includes(value);

/** What a person may do: their role's grants and their own extras, in list order. */
export function effectiveGrants(
  roleGrants: readonly string[],
  extraGrants: readonly string[] = [],
): Permission[] {
  const held = new Set([...roleGrants, ...extraGrants]);
  return PERMISSIONS.filter((p) => held.has(p));
}

/** Extras the role already gives are not extras. */
export function extrasBeyondRole(roleGrants: readonly string[], extraGrants: readonly string[]): Permission[] {
  return effectiveGrants([], extraGrants).filter((p) => !roleGrants.includes(p));
}

export type ViewRole = 'owner' | 'pharmacist' | 'student' | 'legacyPharmacy';

/**
 * What the interface shows. Derived, never stored: a pharmacist who owns a
 * pharmacy sees the owner's app; one who owns none sees a pharmacist's, and
 * the pharmacies they work at. The old pharmacy accounts (before 0015) keep
 * the marketplace screens they had.
 */
export function viewRole(accountRole: 'pharmacist' | 'pharmacy' | 'student', ownedPharmacies: number): ViewRole {
  if (accountRole === 'pharmacy') return 'legacyPharmacy';
  if (accountRole === 'student') return 'student';
  return ownedPharmacies > 0 ? 'owner' : 'pharmacist';
}

/**
 * May this person do this at this pharmacy? Mirrors public.has_permission:
 * no badge means nothing, owner or not.
 */
export function mayAt(
  who: { hasBadge: boolean; owns: boolean; roleGrants?: readonly string[]; extraGrants?: readonly string[]; active?: boolean },
  perm: Permission,
): boolean {
  if (!who.hasBadge) return false;
  if (who.owns) return true;
  if (!who.active) return false;
  return effectiveGrants(who.roleGrants ?? [], who.extraGrants ?? []).includes(perm);
}
