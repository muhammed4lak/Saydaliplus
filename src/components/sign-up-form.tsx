'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { signUpPharmacist, signUpPharmacy, signUpStudent } from '@/app/actions/auth';
import { DISTRICTS } from '@/lib/validation';

const UNIVERSITIES = [
  'University of Baghdad',
  'Al-Mustansiriyah University',
  'University of Basrah',
  'University of Mosul',
  'University of Kufa',
  'University of Kerbala',
  'Other',
] as const;

export function SignUpForm({ role }: { role: 'pharmacist' | 'pharmacy' | 'student' }) {
  const t = useTranslations();

  const action =
    role === 'pharmacist' ? signUpPharmacist : role === 'pharmacy' ? signUpPharmacy : signUpStudent;

  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="font-display text-[19px] font-bold">{t(`auth.roles.${role}`)}</h1>
      <p className="!mt-1 text-[13px] leading-relaxed text-ink-faint">
        {role === 'student' ? t('verification.pendingBody') : t('verification.manualNote')}
      </p>

      {role === 'pharmacy' ? (
        <>
          <Field
            name="pharmacyNameAr"
            label={t('auth.fields.pharmacyNameAr')}
            hint={t('auth.fields.pharmacyNameArHint')}
            dir="rtl"
          />
          <Field name="pharmacyNameEn" label={t('auth.fields.pharmacyNameEn')} dir="ltr" />
          <Field name="responsiblePharmacist" label={t('auth.fields.responsiblePharmacist')} />
          <Field name="email" label={t('auth.email')} type="email" dir="ltr" />
          <Field name="phone" label={t('auth.fields.phone')} type="tel" dir="ltr" />
          <Field name="licenceNo" label={t('auth.fields.licenceNo')} mono dir="ltr" />
          <Select name="district" label={t('auth.fields.district')} options={DISTRICTS} />
          <Field name="address" label={t('auth.fields.address')} />
        </>
      ) : role === 'pharmacist' ? (
        <>
          <Field
            name="fullName"
            label={t('auth.fields.fullName')}
            hint={t('auth.fields.fullNameHint')}
          />
          <Field name="email" label={t('auth.email')} type="email" dir="ltr" />
          <Field name="phone" label={t('auth.fields.phone')} type="tel" dir="ltr" />
          <Field name="syndicateRegNo" label={t('auth.fields.syndicateNo')} mono dir="ltr" />
          <div className="flex gap-2.5">
            <div className="flex-1">
              <Field
                name="graduationYear"
                label={t('auth.fields.graduationYear')}
                type="number"
                dir="ltr"
              />
            </div>
            <div className="flex-1">
              <Select
                name="district"
                label={t('auth.fields.primaryDistrict')}
                options={DISTRICTS}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <Field name="fullName" label={t('auth.fields.fullName')} />
          <Select name="university" label={t('auth.fields.university')} options={UNIVERSITIES} />
          <Field
            name="universityEmail"
            label={t('auth.fields.universityEmail')}
            type="email"
            dir="ltr"
            hint={t('auth.fields.universityEmailHint')}
          />
          <Field name="phone" label={t('auth.fields.phone')} type="tel" dir="ltr" />
          <Select name="district" label={t('auth.fields.district')} options={DISTRICTS} />
        </>
      )}

      <Field name="password" label={t('auth.password')} type="password" />
      <Field name="confirmPassword" label={t('auth.confirmPassword')} type="password" />

      {state.error !== null && (
        <p role="alert" className="text-[12.5px] font-medium text-amber">
          {t(state.error)}
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? t('common.loading') : t('auth.signUp')}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = 'text',
  hint,
  mono,
  dir,
}: {
  name: string;
  label: string;
  type?: string;
  hint?: string;
  mono?: boolean;
  dir?: 'ltr' | 'rtl';
}) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        dir={dir}
        required
        className={`field-input ${mono ? 'figure' : ''}`}
      />
      {hint && <p className="mt-1 text-[11.5px] leading-relaxed text-ink-faint">{hint}</p>}
    </div>
  );
}

function Select({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: readonly string[];
}) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <select id={name} name={name} required defaultValue="" className="field-input">
        <option value="" disabled />
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
