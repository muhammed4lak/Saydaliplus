'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { markAllNotificationsRead } from '@/app/actions/notifications';

export function MarkAllRead() {
  const t = useTranslations('common');
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(async () => void (await markAllNotificationsRead()))}
      className="text-[12.5px] font-medium text-indigo underline underline-offset-2"
    >
      {t('markAllRead')}
    </button>
  );
}
