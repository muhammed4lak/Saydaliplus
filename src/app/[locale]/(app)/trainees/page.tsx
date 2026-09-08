import { setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { NotBuiltYet } from '@/components/not-built-yet';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader eyebrow="Trainees" title="Trainees" />
      <PageBody>
        <NotBuiltYet
          title="Trainees"
          phase="Build order — step 6: student module"
          detail="The database side is complete and tested: placements, the twelve-week forward-fill logbook, month approval and return, and the certificate gate. This is the pharmacy's view of a trainee's months, which is not built."
        />
      </PageBody>
    </>
  );
}
