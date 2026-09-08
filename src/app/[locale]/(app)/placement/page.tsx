import { setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { NotBuiltYet } from '@/components/not-built-yet';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader eyebrow="Placement" title="Placement" />
      <PageBody>
        <NotBuiltYet
          title="Placement"
          phase="Build order — step 6: student module"
          detail="The database side is complete and tested. This is the student's view of their placement and certificate, which is not built."
        />
      </PageBody>
    </>
  );
}
