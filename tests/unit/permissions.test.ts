import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_ROLE,
  PERMISSIONS,
  READY_MADE_ROLES,
  effectiveGrants,
  extrasBeyondRole,
  mayAt,
  viewRole,
} from '@/lib/permissions';

const migration = readFileSync(
  join(__dirname, '..', '..', 'supabase', 'migrations', '0015_owner_first_accounts.sql'),
  'utf8',
);

describe('the permission list mirrors the database', () => {
  it('has exactly the permissions staff_permissions() allows', () => {
    const body = migration.match(/function public\.staff_permissions\(\)[\s\S]*?select array\[([\s\S]*?)\];/);
    expect(body).not.toBeNull();
    const inSql = [...(body?.[1] ?? '').matchAll(/'([A-Za-z]+)'/g)].map((m) => m[1]);
    expect(inSql).toEqual([...PERMISSIONS]);
  });

  it('has the same ready-made roles, with the same grants', () => {
    const rows = [...migration.matchAll(/\('(cashier|pharmacist|stockKeeper|manager)',\s*(array\[[^\]]*\]|public\.staff_permissions\(\))\)/g)];
    const inSql = Object.fromEntries(
      rows.map(([, key, grants = '']) => [
        key,
        grants.startsWith('public.') ? [...PERMISSIONS] : [...grants.matchAll(/'([A-Za-z]+)'/g)].map((m) => m[1]),
      ]),
    );
    expect(inSql).toEqual(Object.fromEntries(Object.entries(READY_MADE_ROLES).map(([k, v]) => [k, [...v]])));
  });

  it('does not let the near-expiry exchange be granted before it exists', () => {
    expect(PERMISSIONS as readonly string[]).not.toContain('exchange');
  });
});

describe('roles', () => {
  it('someone new is a Cashier: selling, and nothing else', () => {
    expect(DEFAULT_ROLE).toBe('cashier');
    expect(READY_MADE_ROLES.cashier).toEqual(['sell']);
  });

  it('the Pharmacist role includes patient history (decided 28 Sep 2026)', () => {
    expect(READY_MADE_ROLES.pharmacist).toContain('patients');
  });

  it('a role plus extras, in one order, without repeats', () => {
    expect(effectiveGrants(READY_MADE_ROLES.pharmacist, ['prices', 'sell'])).toEqual([
      'sell',
      'voids',
      'discounts',
      'prices',
      'ownItems',
      'patients',
    ]);
  });

  it('extras the role already gives are not extras, and unknown ones are dropped', () => {
    expect(extrasBeyondRole(READY_MADE_ROLES.pharmacist, ['voids', 'prices', 'exchange'])).toEqual(['prices']);
  });
});

describe('who may do what', () => {
  it('an owner may do everything at their own pharmacy', () => {
    expect(mayAt({ hasBadge: true, owns: true }, 'stock')).toBe(true);
  });

  it('elsewhere an owner is staff: what the role gives, and no more', () => {
    const shift = { hasBadge: true, owns: false, active: true, roleGrants: READY_MADE_ROLES.pharmacist };
    expect(mayAt(shift, 'voids')).toBe(true);
    expect(mayAt(shift, 'stock')).toBe(false);
  });

  it('no Syndicate badge, no app — owner or not', () => {
    expect(mayAt({ hasBadge: false, owns: true }, 'sell')).toBe(false);
    expect(mayAt({ hasBadge: false, owns: false, active: true, roleGrants: ['sell'] }, 'sell')).toBe(false);
  });

  it('ended or not yet accepted: nothing', () => {
    expect(mayAt({ hasBadge: true, owns: false, active: false, roleGrants: ['sell'] }, 'sell')).toBe(false);
  });
});

describe('the view follows the links, not a type', () => {
  it('a pharmacist who owns a pharmacy sees the owner view; one who owns none, the pharmacist view', () => {
    expect(viewRole('pharmacist', 1)).toBe('owner');
    expect(viewRole('pharmacist', 3)).toBe('owner');
    expect(viewRole('pharmacist', 0)).toBe('pharmacist');
  });

  it('the old pharmacy accounts keep their marketplace screens', () => {
    expect(viewRole('pharmacy', 0)).toBe('legacyPharmacy');
  });
});
