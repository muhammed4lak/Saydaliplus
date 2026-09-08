import { getTranslations } from 'next-intl/server';
import { NavIcon } from '@/components/icons';
import type { UserRole } from '@/lib/supabase/database.types';

/**
 * Shown on every page until the Syndicate review clears.
 *
 * The two messages differ because the two situations differ. A pharmacist can
 * apply straight away and their applications are held until they are verified;
 * a pharmacy genuinely cannot post yet. Telling a pharmacist they are locked out
 * when they are not would cost us the signup we just made.
 */
export async function VerificationBanner({ role }: { role: UserRole }) {
  const t = await getTranslations('verification');

  return (
    <div className="no-print flex items-start gap-2.5 border-b border-amber-tint bg-amber-tint px-5 py-3 md:px-8">
      <NavIcon name="hourglass" className="mt-0.5 h-[18px] w-[18px] shrink-0 text-amber" />
      <p className="text-[12.5px] leading-relaxed text-[#8a5610]">
        {role === 'pharmacy' ? t('bannerPharmacy') : t('banner')}
      </p>
    </div>
  );
}
