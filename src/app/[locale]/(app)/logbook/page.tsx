import { setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { NotBuiltYet } from '@/components/not-built-yet';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader eyebrow="Training logbook" title="Training logbook" />
      <PageBody>
        <NotBuiltYet
          title="Training logbook"
          phase="Build order — step 6: student module"
          detail="submit_log_week, approve_month and return_month are implemented and covered by 30 assertions in supabase/tests/logbook.sql. The weekly writing surface is not built."
        />
      </PageBody>
    </>
  );
}
