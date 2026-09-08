'use client';

import { useOptimistic, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { HANDOFF_ITEM_KEYS, confirmHandoff, toggleHandoffItem } from '@/app/actions/handoff';
import { NavIcon } from '@/components/icons';
import type { HandoffItems } from '@/lib/supabase/database.types';

export function HandoffChecklist({
  bookingId,
  items,
  confirmedByYou,
  confirmedByOther,
}: {
  bookingId: string;
  items: HandoffItems;
  confirmedByYou: boolean;
  confirmedByOther: boolean;
}) {
  const t = useTranslations('handoff');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(confirmedByYou);

  const [optimisticItems, setOptimisticItem] = useOptimistic(
    items,
    (state, update: { key: keyof HandoffItems; done: boolean }) => ({
      ...state,
      [update.key]: update.done,
    }),
  );

  const allTicked = HANDOFF_ITEM_KEYS.every((key) => optimisticItems[key]);
  const locked = confirmed;

  const toggle = (key: keyof HandoffItems) => {
    if (locked) return;
    const done = !optimisticItems[key];
    startTransition(async () => {
      setOptimisticItem({ key, done });
      await toggleHandoffItem(bookingId, key, done);
    });
  };

  const confirm = () => {
    setError(null);
    startTransition(async () => {
      const result = await confirmHandoff(bookingId);
      if (result.ok) setConfirmed(true);
      else setError(result.error ?? 'handoff.allItemsRequired');
    });
  };

  return (
    <div className="space-y-3">
      <ul className="card divide-y divide-line">
        {HANDOFF_ITEM_KEYS.map((key) => {
          const done = optimisticItems[key];
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => toggle(key)}
                disabled={locked}
                aria-pressed={done}
                className="flex w-full items-start gap-3 p-4 text-start transition
                           hover:bg-mist disabled:cursor-default disabled:hover:bg-transparent"
              >
                <span
                  className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                    done ? 'border-palm bg-palm text-white' : 'border-line'
                  }`}
                >
                  {done && <NavIcon name="badge" className="h-3.5 w-3.5" />}
                </span>
                <span className={`text-[13.5px] leading-relaxed ${done ? 'text-ink' : 'text-ink-soft'}`}>
                  {t(`items.${key}`)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {confirmed && confirmedByOther ? (
        <p className="rounded-card bg-palm-tint px-4 py-3 text-center text-[13px] font-semibold text-palm">
          {t('bothConfirmed')}
        </p>
      ) : confirmed ? (
        <p className="rounded-card bg-amber-tint px-4 py-3 text-center text-[13px] font-medium text-[#8a5610]">
          {t('waitingOther')}
        </p>
      ) : (
        <>
          <button
            type="button"
            onClick={confirm}
            disabled={!allTicked || pending}
            className="btn-primary"
          >
            {t('confirm')}
          </button>
          <p className="text-center text-[12px] text-ink-faint">
            {allTicked ? t('cannotUndo') : t('allItemsRequired')}
          </p>
        </>
      )}

      {error !== null && (
        <p role="alert" className="text-center text-[12.5px] font-medium text-amber">
          {t('allItemsRequired')}
        </p>
      )}
    </div>
  );
}
