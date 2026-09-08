import { setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { NotBuiltYet } from '@/components/not-built-yet';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader eyebrow="Earnings" title="Earnings" />
      <PageBody>
        <NotBuiltYet
          title="Earnings"
          phase="Build order — step 5: money"
          detail="The fee engine, the trial and the payout request all exist and are tested, in config/fees.ts and request_payout(). What is missing is this screen and the real ZainCash and Qi Card integrations behind the provider interface. The brief says ship steps 1-4 first: a marketplace that cannot match people is not improved by having a payment system."
        />
      </PageBody>
    </>
  );
}
