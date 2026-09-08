'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { assistCv } from '@/app/actions/cv';
import { NavIcon } from '@/components/icons';
import type { AssistResult } from '@/lib/ai/cv-assistant';
import type { CvExperience, CvLang } from '@/lib/supabase/database.types';

type Action = 'polish' | 'shorten' | 'tailor' | 'translate';

/**
 * The CV assistant's interface.
 *
 * Nothing it produces reaches the CV without the pharmacist reading a
 * before/after and choosing Apply. That is not politeness — it is the only
 * defence against a rewrite that is subtly wrong, and a subtly wrong CV backed
 * by Syndicate verification is a document that misrepresents a real person.
 *
 * The no-invention rule is stated to the user as well as to the model, because
 * a person who knows the tool will not embellish reads its output differently:
 * they check it for accuracy rather than assuming it improved things.
 */
export function CvAiAssist({
  cvLang,
  summary,
  experience,
  onApply,
}: {
  cvLang: CvLang;
  summary: string;
  experience: CvExperience[];
  onApply: (result: AssistResult) => void;
}) {
  const t = useTranslations('cv.ai');
  const [pending, startTransition] = useTransition();
  const [action, setAction] = useState<Action | null>(null);
  const [advert, setAdvert] = useState('');
  const [result, setResult] = useState<AssistResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nothingToWorkOn = !summary.trim() && experience.length === 0;

  const run = (chosen: Action) => {
    setError(null);
    setResult(null);
    setAction(chosen);

    if (chosen === 'tailor' && !advert.trim()) return; // wait for the advert

    startTransition(async () => {
      const response = await assistCv({
        action: chosen,
        lang: cvLang,
        targetLang: chosen === 'translate' ? (cvLang === 'ar' ? 'en' : 'ar') : undefined,
        jobAdvert: chosen === 'tailor' ? advert : undefined,
      });

      if (response.ok && response.result) setResult(response.result);
      else setError(response.error ?? 'failed');
    });
  };

  return (
    <section className="no-print card p-4">
      <div className="mb-3 flex items-center gap-2">
        <NavIcon name="sparkle" className="h-4 w-4 text-amber" />
        <h2 className="eyebrow !m-0">{t('title')}</h2>
      </div>

      {/* Said plainly, in the UI, not only in the prompt. */}
      <p className="mb-3 rounded-[11px] bg-amber-tint/50 p-3 text-[11.5px] leading-relaxed text-[#8a5610]">
        {t('noInvention')}
      </p>

      <div className="flex flex-wrap gap-2">
        {(['polish', 'shorten', 'tailor', 'translate'] as const).map((option) => (
          <button
            key={option}
            type="button"
            disabled={pending || nothingToWorkOn}
            onClick={() => run(option)}
            className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition disabled:opacity-40 ${
              action === option
                ? 'border-indigo bg-indigo text-white'
                : 'border-line bg-card text-ink-soft hover:border-indigo/50'
            }`}
          >
            {t(option)}
          </button>
        ))}
      </div>

      {nothingToWorkOn && (
        <p className="mt-2 text-[11.5px] text-ink-faint">{t('nothingToWorkOn')}</p>
      )}

      {action === 'tailor' && !result && (
        <div className="mt-3">
          <textarea
            rows={4}
            value={advert}
            onChange={(event) => setAdvert(event.target.value)}
            placeholder={t('jobAdvert')}
            className="field-input resize-none text-[13px]"
          />
          <button
            type="button"
            disabled={pending || !advert.trim()}
            onClick={() => run('tailor')}
            className="btn-small mt-2"
          >
            {t('tailor')}
          </button>
        </div>
      )}

      {pending && <p className="mt-3 text-[12.5px] text-ink-faint">{t('working')}</p>}

      {error && (
        <p role="alert" className="mt-3 text-[12.5px] font-medium text-amber">
          {/* Fails loudly, and says the CV is untouched. */}
          {error === 'cv.ai.rateLimited'
            ? t('rateLimited')
            : error === 'cv.ai.nothingToWorkOn'
              ? t('nothingToWorkOn')
              : t('failed')}
        </p>
      )}

      {result && (
        <div className="mt-4 space-y-3">
          <h3 className="text-[13px] font-semibold">{t('reviewTitle')}</h3>

          <Diff before={summary} after={result.summary} beforeLabel={t('before')} afterLabel={t('after')} />

          {experience.map((entry, index) => (
            <Diff
              key={index}
              heading={`${entry.role}${entry.organisation ? ` — ${entry.organisation}` : ''}`}
              before={entry.details}
              after={result.experienceDetails[index] ?? entry.details}
              beforeLabel={t('before')}
              afterLabel={t('after')}
            />
          ))}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setAction(null);
              }}
              className="flex-1 rounded-[11px] border border-line py-2.5 text-[13px] font-semibold text-ink-soft"
            >
              {t('discard')}
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(result);
                setResult(null);
                setAction(null);
              }}
              className="flex-1 rounded-[11px] bg-indigo py-2.5 text-[13px] font-semibold text-white"
            >
              {t('apply')}
            </button>
          </div>

          <p className="text-center text-[11px] text-ink-faint">{t('applyStillNeedsSave')}</p>
        </div>
      )}
    </section>
  );
}

function Diff({
  heading,
  before,
  after,
  beforeLabel,
  afterLabel,
}: {
  heading?: string;
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  if (!before && !after) return null;
  const unchanged = before.trim() === after.trim();

  return (
    <div className="rounded-[12px] border border-line p-3">
      {heading && <p className="mb-2 text-[12px] font-semibold">{heading}</p>}

      <p className="text-[10.5px] uppercase tracking-wide text-ink-faint">{beforeLabel}</p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-ink-faint line-through decoration-ink-faint/40">
        {before || '—'}
      </p>

      <p className="mt-2.5 text-[10.5px] uppercase tracking-wide text-palm">{afterLabel}</p>
      <p className="mt-1 text-[12.5px] leading-relaxed">{after || '—'}</p>

      {unchanged && (
        <p className="mt-2 text-[11px] text-ink-faint">— unchanged —</p>
      )}
    </div>
  );
}
