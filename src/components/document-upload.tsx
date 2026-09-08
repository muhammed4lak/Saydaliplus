'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { attachVerificationDocument } from '@/app/actions/documents';
import { NavIcon } from '@/components/icons';

export const VERIFICATION_BUCKET = 'verification-documents';
const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Uploads a photograph of a Syndicate card or pharmacy licence, then attaches it
 * to the account awaiting review.
 *
 * This deliberately lives *after* sign-up rather than inside it. The bucket path
 * is the user's own id, so there is nowhere to put a file until the account
 * exists — and separating the two means a failed image upload on Iraqi mobile
 * data never costs somebody a completed registration form. They land on the
 * waiting screen with an account, and add the photo from there.
 *
 * The file goes straight from the browser to Storage, so a large photo on a slow
 * connection is not also a long-running server request.
 */
export function DocumentUpload({
  userId,
  kind,
  existingPath,
}: {
  userId: string;
  kind: 'card' | 'licence';
  existingPath: string | null;
}) {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>(
    existingPath ? 'done' : 'idle',
  );
  const [fileName, setFileName] = useState(existingPath ? existingPath.split('/').pop()! : '');
  const [message, setMessage] = useState('');

  async function upload(file: File) {
    if (file.size > MAX_BYTES) {
      setStatus('error');
      setMessage(t('upload.tooLarge'));
      return;
    }

    setStatus('uploading');
    setMessage('');

    const supabase = createClient();
    const extension = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const objectPath = `${userId}/${kind}-${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from(VERIFICATION_BUCKET)
      .upload(objectPath, file, { upsert: true, contentType: file.type });

    if (error) {
      setStatus('error');
      setMessage(t('upload.failed'));
      return;
    }

    const result = await attachVerificationDocument(objectPath);
    if (!result.ok) {
      setStatus('error');
      setMessage(t('upload.failed'));
      return;
    }

    setFileName(file.name);
    setStatus('done');
  }

  const label = kind === 'licence' ? t('auth.fields.uploadLicence') : t('auth.fields.uploadSyndicateCard');
  const hint = kind === 'licence' ? t('auth.fields.uploadLicenceSub') : t('auth.fields.uploadSyndicateCardSub');

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={status === 'uploading'}
        className={`flex w-full items-center gap-3.5 rounded-[14px] border-[1.6px] p-4 text-start transition ${
          status === 'done'
            ? 'border-palm bg-palm-tint/50'
            : 'border-line bg-card hover:border-indigo hover:bg-indigo-tint/40'
        }`}
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            status === 'done' ? 'bg-palm text-white' : 'bg-indigo-tint text-indigo-dark'
          }`}
        >
          <NavIcon name={status === 'done' ? 'badge' : 'upload'} className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold">
            {status === 'done' ? t('upload.uploaded') : label}
          </span>
          <span className="mt-0.5 block truncate text-[12.5px] leading-relaxed text-ink-faint">
            {status === 'uploading' ? t('upload.uploading') : status === 'done' ? fileName : hint}
          </span>
        </span>
        {status === 'done' && (
          <span className="shrink-0 text-[12px] font-medium text-indigo underline underline-offset-2">
            {t('upload.replace')}
          </span>
        )}
      </button>

      {status === 'error' && (
        <p role="alert" className="mt-1.5 text-[12px] font-medium text-amber">
          {message}
        </p>
      )}
    </div>
  );
}
