'use client';

import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';
import { postListing } from '@/app/actions/marketplace';
import { DISTRICTS } from '@/lib/validation';
import { calculateFees } from '@/config/fees';
import { formatAmount, formatIQD } from '@/lib/money';
import { shiftHours } from '@/lib/time';
import type { Locale } from '@/i18n/routing';

export function PostListingForm({
  locale,
  inTrial,
  canPost,
}: {
  locale: Locale;
  inTrial: boolean;
  canPost: boolean;
}) {
  const t = useTranslations();
  const [state, formAction, pending] = useActionState(postListing, { ok: false });

  const [type, setType] = useState<'shift' | 'internship'>('shift');
  const [rateType, setRateType] = useState<'hourly' | 'flat'>('hourly');
  const [rate, setRate] = useState(5000);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:00');

  // The same functions the server uses, so the preview and the invoice agree.
  const hours = safeHours(startTime, endTime);
  const total = rateType === 'hourly' ? rate * hours : rate;
  const fees = calculateFees({
    grossAmount: total,
    pharmacyInTrial: inTrial,
    pharmacistInTrial: false,
  });

  // 22:00–06:00 is eight hours, and the pharmacy should be told the shift will
  // run into the next day rather than discovering it from the applicant.
  const crossesMidnight = endTime <= startTime;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="type" value={type} />

      <div className="flex rounded-[11px] bg-indigo-tint p-[3px]">
        {(['shift', 'internship'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setType(option)}
            className={`flex-1 rounded-lg py-2 text-[13px] font-semibold text-indigo-dark transition ${
              type === option ? 'bg-white shadow-sm' : ''
            }`}
          >
            {t(option === 'shift' ? 'listings.post.paidShift' : 'listings.post.internship')}
          </button>
        ))}
      </div>

      <div>
        <label className="field-label" htmlFor="district">
          {t('auth.fields.district')}
        </label>
        <select id="district" name="district" className="field-input" required>
          {DISTRICTS.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      {type === 'shift' ? (
        <>
          <div>
            <label className="field-label" htmlFor="date">
              {t('listings.post.date')}
            </label>
            <input id="date" name="date" type="date" required className="field-input" />
          </div>

          <div className="flex gap-2.5">
            <div className="flex-1">
              <label className="field-label" htmlFor="startTime">
                {t('listings.post.startTime')}
              </label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="field-input"
                required
              />
            </div>
            <div className="flex-1">
              <label className="field-label" htmlFor="endTime">
                {t('listings.post.endTime')}
              </label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="field-input"
                required
              />
            </div>
          </div>

          {crossesMidnight && (
            <p className="text-[12px] text-ink-faint">{t('listings.post.overnightNote')}</p>
          )}

          <input type="hidden" name="rateType" value={rateType} />
          <div>
            <span className="field-label">{t('listings.post.howPaid')}</span>
            <div className="flex rounded-[11px] bg-indigo-tint p-[3px]">
              {(['hourly', 'flat'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setRateType(option);
                    setRate(option === 'hourly' ? 5000 : 40000);
                  }}
                  className={`flex-1 rounded-lg py-2 text-[13px] font-semibold text-indigo-dark transition ${
                    rateType === option ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  {t(option === 'hourly' ? 'listings.post.hourly' : 'listings.post.flat')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="rateAmount">
              {t(
                rateType === 'hourly'
                  ? 'listings.post.ratePerHour'
                  : 'listings.post.totalForShift',
              )}
            </label>
            <input
              id="rateAmount"
              name="rateAmount"
              type="number"
              min={1}
              value={rate}
              onChange={(event) => setRate(Number(event.target.value) || 0)}
              className="field-input figure"
              required
            />

            <p className="mt-1.5 text-[12px] text-ink-faint">
              {rateType === 'hourly'
                ? t('listings.post.hoursLine', {
                    hours: formatAmount(hours),
                    rate: formatAmount(rate),
                    total: formatAmount(total),
                  })
                : t('listings.post.flatLine', {
                    hours: formatAmount(hours),
                    implied: formatAmount(hours > 0 ? total / hours : 0),
                  })}
            </p>

            {/* Both numbers, always. The trial figure alone would make the
                first month feel cheaper than the product is. */}
            <p className={`mt-1 text-[11.5px] ${inTrial ? 'font-medium text-palm' : 'text-ink-faint'}`}>
              {inTrial
                ? `${t('fees.trialActive')} · ${t('fees.youPayNow', { amount: formatIQD(total, locale) })} · ${t('fees.afterTrial', { amount: formatIQD(calculateFees({ grossAmount: total, pharmacyInTrial: false, pharmacistInTrial: false }).pharmacyCharge, locale), percent: 7 })}`
                : `${t('fees.youPay', { amount: formatIQD(fees.pharmacyCharge, locale) })} · ${t('fees.pharmacistReceives', { amount: formatIQD(fees.pharmacistNet, locale) })}`}
            </p>
          </div>

          <label className="flex items-center gap-2.5 rounded-[11px] border-[1.4px] border-line p-3">
            <input
              type="checkbox"
              name="includesControlled"
              className="h-[18px] w-[18px] accent-[color:var(--amber)]"
            />
            <span className="text-[13.5px]">{t('listings.post.includesControlled')}</span>
          </label>
        </>
      ) : (
        <>
          <div className="flex gap-2.5">
            <div className="flex-1">
              <label className="field-label" htmlFor="startDate">
                {t('listings.post.startDate')}
              </label>
              <input id="startDate" name="startDate" type="date" required className="field-input" />
            </div>
            <div className="flex-1">
              <label className="field-label" htmlFor="endDate">
                {t('listings.post.endDate')}
              </label>
              <input id="endDate" name="endDate" type="date" required className="field-input" />
            </div>
          </div>

          <p className="rounded-[11px] border border-[#e3ce9e] bg-amber-tint p-3 text-[12.5px] leading-relaxed text-[#8a5610]">
            {t('listings.post.internshipNote')}
          </p>
        </>
      )}

      <div>
        <label className="field-label" htmlFor="notes">
          {t('listings.post.notesForPharmacist')}
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder={t('listings.post.notesPlaceholder')}
          className="field-input resize-none"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={pending || !canPost}>
        {pending ? t('common.loading') : t('listings.post.submit')}
      </button>

      {!canPost && (
        <p className="text-center text-[12px] leading-relaxed text-ink-faint">
          {t('verification.bannerPharmacy')}
        </p>
      )}

      {state.error && (
        <p role="alert" className="text-center text-[12.5px] font-medium text-amber">
          {t('common.somethingWentWrong')}
        </p>
      )}

      {state.ok && (
        <p className="rounded-card bg-palm-tint px-4 py-3 text-center text-[13px] font-medium text-palm">
          {t('listings.post.submit')} ✓
        </p>
      )}
    </form>
  );
}

function safeHours(start: string, end: string): number {
  try {
    return shiftHours(start, end);
  } catch {
    return 0;
  }
}
