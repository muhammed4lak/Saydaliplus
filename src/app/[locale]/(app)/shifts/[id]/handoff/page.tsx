import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PageBody, PageHeader } from '@/components/app-shell';
import { HandoffChecklist } from '@/components/handoff-checklist';
import { requireSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function HandoffPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await requireSession();
  const t = await getTranslations('handoff');
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, pharmacist_id, pharmacy_id, status')
    .eq('id', id)
    .maybeSingle();

  if (!booking) notFound();

  const { data: handoff } = await supabase
    .from('handoffs')
    .select('*')
    .eq('booking_id', id)
    .maybeSingle();

  if (!handoff) notFound();

  const isPharmacist = booking.pharmacist_id === session.userId;
  const confirmedByYou = isPharmacist
    ? handoff.confirmed_by_pharmacist_at !== null
    : handoff.confirmed_by_pharmacy_at !== null;
  const confirmedByOther = isPharmacist
    ? handoff.confirmed_by_pharmacy_at !== null
    : handoff.confirmed_by_pharmacist_at !== null;

  return (
    <>
      <PageHeader eyebrow={t('title')} title={t('title')} />

      <PageBody>
        <div className="mx-auto max-w-2xl space-y-4">
          <p className="rounded-card bg-indigo-tint p-4 text-[12.5px] leading-relaxed text-indigo-dark">
            {t('intro')}
          </p>

          <HandoffChecklist
            bookingId={booking.id}
            items={handoff.items}
            confirmedByYou={confirmedByYou}
            confirmedByOther={confirmedByOther}
          />
        </div>
      </PageBody>
    </>
  );
}
