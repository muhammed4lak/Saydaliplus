'use client';

import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { saveCv } from '@/app/actions/cv';
import { CvAiAssist } from '@/components/cv-ai-assist';
import { PdfExport } from '@/components/pdf-export';
import { NavIcon } from '@/components/icons';
import {
  LANGUAGE_PRESETS,
  PROFICIENCY_LEVELS,
  SKILL_PRESETS,
  presetLabel,
} from '@/config/cv-presets';
import { formatDate } from '@/lib/dates';
import type { Locale } from '@/i18n/routing';
import type {
  CvCertification,
  CvEducation,
  CvExperience,
  CvLang,
  CvLanguage,
} from '@/lib/supabase/database.types';

interface CvContent {
  summary: string;
  experience: CvExperience[];
  education: CvEducation[];
  certifications: CvCertification[];
  skills: string[];
  languages: CvLanguage[];
}

interface VerifiedStats {
  shiftsCompleted: number;
  hoursWorked: number;
  pharmaciesWorkedWith: number;
  averageRating: number | null;
  reliabilityPercent: number | null;
  memberSince: string;
}

/**
 * The CV builder.
 *
 * Two halves, kept visibly separate because the separation *is* the product:
 * the top is computed from the booking record and cannot be edited, the bottom
 * is what the pharmacist writes. An employer who cannot tell which is which
 * learns nothing from either.
 */
export function CvBuilder({
  cvLang,
  uiLocale,
  name,
  initial,
  otherLangHasContent,
  stats,
}: {
  cvLang: CvLang;
  uiLocale: Locale;
  name: string;
  initial: CvContent;
  otherLangHasContent: boolean;
  stats: VerifiedStats | null;
}) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [cv, setCv] = useState<CvContent>(initial);
  const [state, formAction, pending] = useActionState(saveCv, { ok: false });

  const dir = cvLang === 'ar' ? 'rtl' : 'ltr';
  const update = <K extends keyof CvContent>(key: K, value: CvContent[K]) =>
    setCv((current) => ({ ...current, [key]: value }));

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* The CV's language, switched independently of the app's. */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">{t('cv.cvLanguage')}</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-ink-faint">
            {t('cv.cvLanguageNote')}
          </p>
        </div>
        <div className="flex rounded-[10px] bg-indigo-tint p-[3px]">
          {(['ar', 'en'] as const).map((option) => (
            <button
              key={option}
              type="button"
              lang={option}
              onClick={() => router.replace({ pathname, query: { lang: option } })}
              className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold text-indigo-dark transition ${
                cvLang === option ? 'bg-white shadow-sm' : ''
              }`}
            >
              {option === 'ar' ? t('common.arabic') : t('common.english')}
            </button>
          ))}
        </div>
      </div>

      {/* ---- The verified half ---- */}
      {stats && (
        <section className="card p-4">
          <h2 className="eyebrow mb-3">{t('cv.verifiedSection')}</h2>
          <div className="grid grid-cols-3 gap-2.5">
            <Stat value={stats.shiftsCompleted} label={t('cv.shiftsCompleted')} />
            <Stat value={Math.round(stats.hoursWorked)} label={t('cv.hoursWorked')} />
            <Stat value={stats.pharmaciesWorkedWith} label={t('cv.pharmaciesWorkedWith')} />
            <Stat value={stats.averageRating ?? '—'} label={t('cv.averageRating')} />
            <Stat
              value={
                stats.reliabilityPercent === null ? '—' : `${stats.reliabilityPercent}%`
              }
              label={t('cv.reliability')}
            />
            <Stat
              value={new Date(stats.memberSince).getFullYear()}
              label={t('cv.memberSince')}
            />
          </div>
          <p className="mt-3 flex items-start gap-2 text-[11.5px] leading-relaxed text-ink-faint">
            <NavIcon name="lock" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {t('cv.verifiedNote')}
          </p>
        </section>
      )}

      <CvAiAssist
        cvLang={cvLang}
        summary={cv.summary}
        experience={cv.experience}
        onApply={(result) =>
          setCv((current) => ({
            ...current,
            summary: result.summary,
            experience: current.experience.map((entry, index) => ({
              ...entry,
              details: result.experienceDetails[index] ?? entry.details,
            })),
          }))
        }
      />

      {/* ---- The authored half ---- */}
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="payload" value={JSON.stringify({ ...cv, lang: cvLang })} />

        <section className="card p-4" dir={dir}>
          <h2 className="eyebrow mb-3">{t('cv.summary')}</h2>
          <textarea
            rows={4}
            value={cv.summary}
            onChange={(event) => update('summary', event.target.value)}
            className="field-input resize-none"
          />
        </section>

        <ListSection
          title={t('cv.experience')}
          dir={dir}
          items={cv.experience}
          onAdd={() =>
            update('experience', [
              ...cv.experience,
              { role: '', organisation: '', from: '', to: null, details: '' },
            ])
          }
          onRemove={(index) =>
            update(
              'experience',
              cv.experience.filter((_, i) => i !== index),
            )
          }
          addLabel={t('cv.addItem')}
          render={(entry, index) => (
            <>
              <div className="flex gap-2">
                <input
                  value={entry.role}
                  onChange={(event) =>
                    update(
                      'experience',
                      cv.experience.map((e, i) =>
                        i === index ? { ...e, role: event.target.value } : e,
                      ),
                    )
                  }
                  placeholder={t('cv.role')}
                  className="field-input flex-1"
                />
                <input
                  value={entry.organisation}
                  onChange={(event) =>
                    update(
                      'experience',
                      cv.experience.map((e, i) =>
                        i === index ? { ...e, organisation: event.target.value } : e,
                      ),
                    )
                  }
                  placeholder={t('cv.organisation')}
                  className="field-input flex-1"
                />
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  value={entry.from}
                  onChange={(event) =>
                    update(
                      'experience',
                      cv.experience.map((e, i) =>
                        i === index ? { ...e, from: event.target.value } : e,
                      ),
                    )
                  }
                  placeholder={t('cv.from')}
                  className="field-input figure flex-1"
                  dir="ltr"
                />
                <input
                  value={entry.to ?? ''}
                  onChange={(event) =>
                    update(
                      'experience',
                      cv.experience.map((e, i) =>
                        i === index ? { ...e, to: event.target.value || null } : e,
                      ),
                    )
                  }
                  placeholder={t('cv.to')}
                  className="field-input figure flex-1"
                  dir="ltr"
                />
              </div>
              <textarea
                rows={3}
                value={entry.details}
                onChange={(event) =>
                  update(
                    'experience',
                    cv.experience.map((e, i) =>
                      i === index ? { ...e, details: event.target.value } : e,
                    ),
                  )
                }
                placeholder={t('cv.details')}
                className="field-input mt-2 resize-none"
              />
            </>
          )}
        />

        <ListSection
          title={t('cv.education')}
          dir={dir}
          items={cv.education}
          onAdd={() =>
            update('education', [
              ...cv.education,
              { qualification: '', institution: '', year: '' },
            ])
          }
          onRemove={(index) =>
            update(
              'education',
              cv.education.filter((_, i) => i !== index),
            )
          }
          addLabel={t('cv.addItem')}
          render={(entry, index) => (
            <div className="flex flex-wrap gap-2">
              <input
                value={entry.qualification}
                onChange={(event) =>
                  update(
                    'education',
                    cv.education.map((e, i) =>
                      i === index ? { ...e, qualification: event.target.value } : e,
                    ),
                  )
                }
                placeholder={t('cv.qualification')}
                className="field-input min-w-[140px] flex-1"
              />
              <input
                value={entry.institution}
                onChange={(event) =>
                  update(
                    'education',
                    cv.education.map((e, i) =>
                      i === index ? { ...e, institution: event.target.value } : e,
                    ),
                  )
                }
                placeholder={t('cv.institution')}
                className="field-input min-w-[140px] flex-1"
              />
              <input
                value={entry.year}
                onChange={(event) =>
                  update(
                    'education',
                    cv.education.map((e, i) =>
                      i === index ? { ...e, year: event.target.value } : e,
                    ),
                  )
                }
                placeholder={t('cv.year')}
                className="field-input figure w-24"
                dir="ltr"
              />
            </div>
          )}
        />

        <ListSection
          title={t('cv.certifications')}
          dir={dir}
          items={cv.certifications}
          onAdd={() =>
            update('certifications', [...cv.certifications, { name: '', issuer: '', year: '' }])
          }
          onRemove={(index) =>
            update(
              'certifications',
              cv.certifications.filter((_, i) => i !== index),
            )
          }
          addLabel={t('cv.addItem')}
          render={(entry, index) => (
            <div className="flex flex-wrap gap-2">
              <input
                value={entry.name}
                onChange={(event) =>
                  update(
                    'certifications',
                    cv.certifications.map((e, i) =>
                      i === index ? { ...e, name: event.target.value } : e,
                    ),
                  )
                }
                placeholder={t('cv.certificateName')}
                className="field-input min-w-[140px] flex-1"
              />
              <input
                value={entry.issuer}
                onChange={(event) =>
                  update(
                    'certifications',
                    cv.certifications.map((e, i) =>
                      i === index ? { ...e, issuer: event.target.value } : e,
                    ),
                  )
                }
                placeholder={t('cv.issuer')}
                className="field-input min-w-[140px] flex-1"
              />
              <input
                value={entry.year}
                onChange={(event) =>
                  update(
                    'certifications',
                    cv.certifications.map((e, i) =>
                      i === index ? { ...e, year: event.target.value } : e,
                    ),
                  )
                }
                placeholder={t('cv.year')}
                className="field-input figure w-24"
                dir="ltr"
              />
            </div>
          )}
        />

        {/* Preset pickers, with free text as the escape hatch. */}
        <section className="card p-4" dir={dir}>
          <h2 className="eyebrow mb-3">{t('cv.skills')}</h2>
          <div className="flex flex-wrap gap-2">
            {SKILL_PRESETS.map((preset) => {
              const label = presetLabel(preset, cvLang);
              const selected = cv.skills.includes(label);
              return (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() =>
                    update(
                      'skills',
                      selected
                        ? cv.skills.filter((skill) => skill !== label)
                        : [...cv.skills, label],
                    )
                  }
                  className={`rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition ${
                    selected
                      ? 'border-indigo bg-indigo text-white'
                      : 'border-line bg-card text-ink-soft hover:border-indigo/50'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <FreeTextAdd
            placeholder={t('cv.addSkill')}
            onAdd={(value) => update('skills', [...cv.skills, value])}
          />

          {cv.skills.filter((s) => !SKILL_PRESETS.some((p) => presetLabel(p, cvLang) === s)).length >
            0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {cv.skills
                .filter((s) => !SKILL_PRESETS.some((p) => presetLabel(p, cvLang) === s))
                .map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-full border border-indigo bg-indigo px-3 py-1.5 text-[12.5px] font-medium text-white"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          'skills',
                          cv.skills.filter((s) => s !== skill),
                        )
                      }
                      aria-label={t('cv.remove')}
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>
          )}
        </section>

        <section className="card p-4" dir={dir}>
          <h2 className="eyebrow mb-3">{t('cv.languages')}</h2>
          <div className="space-y-2">
            {cv.languages.map((entry, index) => (
              <div key={index} className="flex flex-wrap gap-2">
                <span className="field-input flex-1 !py-2 text-[13px]">{entry.language}</span>
                <select
                  value={entry.proficiency}
                  onChange={(event) =>
                    update(
                      'languages',
                      cv.languages.map((l, i) =>
                        i === index
                          ? { ...l, proficiency: event.target.value as CvLanguage['proficiency'] }
                          : l,
                      ),
                    )
                  }
                  className="field-input !py-2 w-36 text-[13px]"
                >
                  {PROFICIENCY_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {t(`cv.proficiency.${level}`)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() =>
                    update(
                      'languages',
                      cv.languages.filter((_, i) => i !== index),
                    )
                  }
                  className="rounded-[9px] border border-line px-3 text-[12.5px] text-ink-soft"
                >
                  {t('cv.remove')}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {LANGUAGE_PRESETS.filter(
              (preset) => !cv.languages.some((l) => l.language === presetLabel(preset, cvLang)),
            ).map((preset) => (
              <button
                key={preset.key}
                type="button"
                onClick={() =>
                  update('languages', [
                    ...cv.languages,
                    { language: presetLabel(preset, cvLang), proficiency: 'professional' },
                  ])
                }
                className="rounded-full border border-line bg-card px-3 py-1.5 text-[12.5px] font-medium text-ink-soft hover:border-indigo/50"
              >
                + {presetLabel(preset, cvLang)}
              </button>
            ))}
          </div>
        </section>

        <div className="no-print flex flex-wrap gap-2">
          <button type="submit" disabled={pending} className="btn-primary flex-1 !w-auto">
            {pending ? t('common.loading') : state.ok ? t('cv.saved') : t('common.save')}
          </button>
        </div>

        {state.error && (
          <p role="alert" className="text-center text-[12.5px] font-medium text-amber">
            {t('common.somethingWentWrong')}
          </p>
        )}
      </form>

      <PdfExport
        targetId="cv-document"
        // Named for the CV's language, not the app's.
        fileName={`cv-${name.replace(/\s+/g, '-')}-${cvLang}`}
        documentLocale={cvLang}
      />

      {/* The printable document, laid out in the CV's own direction. */}
      <article
        id="cv-document"
        dir={dir}
        lang={cvLang}
        className="print-document rounded-card border border-line bg-white p-8"
      >
        <h1 className="font-display text-[20px] font-bold">{name}</h1>
        {stats && (
          <p className="figure mt-1 text-[12px] text-ink-faint">
            {stats.shiftsCompleted} {t('cv.shiftsCompleted')} · {Math.round(stats.hoursWorked)}{' '}
            {t('cv.hoursWorked')}
            {stats.averageRating !== null && ` · ★ ${stats.averageRating}`}
            {' · '}
            {t('cv.memberSince')} {formatDate(new Date(stats.memberSince), cvLang)}
          </p>
        )}

        {cv.summary && <p className="mt-4 text-[13px] leading-relaxed">{cv.summary}</p>}

        <DocSection title={t('cv.experience')} show={cv.experience.length > 0}>
          {cv.experience.map((entry, index) => (
            <div key={index} className="mb-3">
              <p className="text-[13.5px] font-semibold">
                {entry.role}
                {entry.organisation && ` — ${entry.organisation}`}
              </p>
              <p className="figure text-[11.5px] text-ink-faint">
                {entry.from}
                {entry.to ? ` – ${entry.to}` : ''}
              </p>
              {entry.details && (
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{entry.details}</p>
              )}
            </div>
          ))}
        </DocSection>

        <DocSection title={t('cv.education')} show={cv.education.length > 0}>
          {cv.education.map((entry, index) => (
            <p key={index} className="mb-1.5 text-[12.5px]">
              <span className="font-medium">{entry.qualification}</span>
              {entry.institution && ` — ${entry.institution}`}
              {entry.year && <span className="figure text-ink-faint"> · {entry.year}</span>}
            </p>
          ))}
        </DocSection>

        <DocSection title={t('cv.certifications')} show={cv.certifications.length > 0}>
          {cv.certifications.map((entry, index) => (
            <p key={index} className="mb-1.5 text-[12.5px]">
              <span className="font-medium">{entry.name}</span>
              {entry.issuer && ` — ${entry.issuer}`}
              {entry.year && <span className="figure text-ink-faint"> · {entry.year}</span>}
            </p>
          ))}
        </DocSection>

        <DocSection title={t('cv.skills')} show={cv.skills.length > 0}>
          <p className="text-[12.5px] leading-relaxed">{cv.skills.join(' · ')}</p>
        </DocSection>

        <DocSection title={t('cv.languages')} show={cv.languages.length > 0}>
          <p className="text-[12.5px] leading-relaxed">
            {cv.languages
              .map((l) => `${l.language} (${t(`cv.proficiency.${l.proficiency}`)})`)
              .join(' · ')}
          </p>
        </DocSection>
      </article>

      {otherLangHasContent && (
        <p className="no-print text-center text-[11.5px] text-ink-faint">
          {t('cv.otherLangExists')}
        </p>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-[12px] border border-line p-2.5 text-center">
      <span className="figure block text-[16px] font-semibold text-indigo">{value}</span>
      <span className="mt-0.5 block text-[10px] leading-tight text-ink-faint">{label}</span>
    </div>
  );
}

function DocSection({
  title,
  show,
  children,
}: {
  title: string;
  show: boolean;
  children: React.ReactNode;
}) {
  if (!show) return null;
  return (
    <section className="mt-5 border-t border-line pt-4">
      <h2 className="mb-2 font-display text-[13px] font-semibold uppercase tracking-wide text-indigo">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ListSection<T>({
  title,
  dir,
  items,
  onAdd,
  onRemove,
  addLabel,
  render,
}: {
  title: string;
  dir: 'rtl' | 'ltr';
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  addLabel: string;
  render: (item: T, index: number) => React.ReactNode;
}) {
  return (
    <section className="card p-4" dir={dir}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="eyebrow">{title}</h2>
        <button type="button" onClick={onAdd} className="btn-small">
          + {addLabel}
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-[12px] border border-line p-3">
            {render(item, index)}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="mt-2 text-[12px] text-ink-faint underline underline-offset-2"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function FreeTextAdd({
  placeholder,
  onAdd,
}: {
  placeholder: string;
  onAdd: (value: string) => void;
}) {
  const [value, setValue] = useState('');

  return (
    <div className="mt-3 flex gap-2">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            if (value.trim()) {
              onAdd(value.trim());
              setValue('');
            }
          }
        }}
        placeholder={placeholder}
        className="field-input flex-1 !py-2 text-[13px]"
      />
      <button
        type="button"
        onClick={() => {
          if (value.trim()) {
            onAdd(value.trim());
            setValue('');
          }
        }}
        className="btn-small"
      >
        +
      </button>
    </div>
  );
}
