import { setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { NotBuiltYet } from '@/components/not-built-yet';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader eyebrow="My CV" title="My CV" />
      <PageBody>
        <NotBuiltYet
          title="My CV"
          phase="Build order — step 7: CV"
          detail="The schema stores the CV twice, once per language, and pharmacist_stats supplies the verified half that cannot be edited. The builder, the preset skill and language pickers, the PDF export and the AI assist are not built."
        />
      </PageBody>
    </>
  );
}
