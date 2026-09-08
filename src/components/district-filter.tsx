'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { DISTRICTS } from '@/lib/validation';

export function DistrictFilter({ selected }: { selected: string }) {
  const t = useTranslations('listings');
  const router = useRouter();
  const pathname = usePathname();

  const select = (district: string) => {
    const query = district === 'all' ? {} : { district };
    router.replace({ pathname, query });
  };

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {['all', ...DISTRICTS].map((district) => (
        <button
          key={district}
          type="button"
          onClick={() => select(district)}
          aria-pressed={selected === district}
          className={`shrink-0 rounded-full border px-3.5 py-[7px] text-[13px] font-medium transition ${
            selected === district
              ? 'border-indigo bg-indigo text-white'
              : 'border-line bg-card text-ink-soft hover:border-indigo/40'
          }`}
        >
          {district === 'all' ? t('allDistricts') : district}
        </button>
      ))}
    </div>
  );
}
