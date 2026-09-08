import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageBody, PageHeader } from '@/components/app-shell';
import { PostListingForm } from '@/components/post-listing-form';
import { requireRole } from '@/lib/session';
import { isInTrial } from '@/config/fees';
import type { Locale } from '@/i18n/routing';

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireRole('pharmacy');
  const t = await getTranslations('listings.post');

  return (
    <>
      <PageHeader eyebrow={t('title')} title={t('title')} />

      <PageBody>
        <div className="mx-auto max-w-xl">
          <PostListingForm
            locale={locale as Locale}
            inTrial={isInTrial(new Date(session.profile.created_at))}
            canPost={session.isVerified}
          />
        </div>
      </PageBody>
    </>
  );
}
