import { useTranslations } from 'next-intl';
import {
  MINIMUM_COMMISSION_IQD,
  PHARMACIST_SHARE_OF_COMMISSION,
  PHARMACY_SHARE_OF_COMMISSION,
  TOTAL_COMMISSION_RATE,
  calculateFees,
} from '@/config/fees';
import { formatIQD } from '@/lib/money';
import type { Locale } from '@/i18n/routing';

const asPercent = (share: number) => Math.round(TOTAL_COMMISSION_RATE * share * 100);

/**
 * The fee breakdown shown on a listing before anyone commits to it.
 *
 * While a trial is running this shows *both* the trial figure and what the same
 * shift will cost once the trial ends. Hiding the second number would make the
 * first month feel cheaper than the product is, and the bill that arrives in
 * week five would be the moment a pharmacy decides we were not straight with
 * them. The model is the thing we are asking them to trust.
 */
export function FeeBreakdown({
  grossAmount,
  side,
  inTrial,
  otherSideInTrial,
  locale,
}: {
  grossAmount: number;
  side: 'pharmacy' | 'pharmacist';
  inTrial: boolean;
  otherSideInTrial: boolean;
  locale: Locale;
}) {
  const t = useTranslations('fees');

  const now = calculateFees({
    grossAmount,
    pharmacyInTrial: side === 'pharmacy' ? inTrial : otherSideInTrial,
    pharmacistInTrial: side === 'pharmacist' ? inTrial : otherSideInTrial,
  });

  const afterTrial = calculateFees({
    grossAmount,
    pharmacyInTrial: false,
    pharmacistInTrial: false,
  });

  const isPharmacy = side === 'pharmacy';
  const nowTotal = isPharmacy ? now.pharmacyCharge : now.pharmacistNet;
  const laterTotal = isPharmacy ? afterTrial.pharmacyCharge : afterTrial.pharmacistNet;
  const fee = isPharmacy ? now.pharmacyFee : now.pharmacistFee;

  return (
    <div className="card p-4">
      <dl className="space-y-2 text-[13px]">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-ink-soft">{t('yourRate')}</dt>
          <dd className="figure font-semibold">{formatIQD(grossAmount, locale)}</dd>
        </div>

        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-ink-soft">{t('platformFee')}</dt>
          <dd className={`figure font-semibold ${inTrial ? 'text-palm' : ''}`}>
            {inTrial ? t('trialActive') : `${isPharmacy ? '+' : '−'} ${formatIQD(fee, locale)}`}
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-3 border-t border-line pt-2">
          <dt className="font-semibold">
            {isPharmacy ? t('pharmacyCharged') : t('youReceive')}
          </dt>
          <dd className="figure text-[15px] font-semibold text-indigo">
            {formatIQD(nowTotal, locale)}
          </dd>
        </div>
      </dl>

      {inTrial && (
        <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-ink-faint">
          {t('afterTrial', {
            amount: formatIQD(laterTotal, locale),
            percent: asPercent(
              isPharmacy ? PHARMACY_SHARE_OF_COMMISSION : PHARMACIST_SHARE_OF_COMMISSION,
            ),
          })}
        </p>
      )}

      <p className="mt-3 text-[11.5px] leading-relaxed text-ink-faint">
        {t('feeExplainer', {
          pharmacyPercent: asPercent(PHARMACY_SHARE_OF_COMMISSION),
          pharmacistPercent: asPercent(PHARMACIST_SHARE_OF_COMMISSION),
        })}
        {afterTrial.floorApplied && (
          <> {t('floorNote', { amount: MINIMUM_COMMISSION_IQD })}</>
        )}
      </p>
    </div>
  );
}
