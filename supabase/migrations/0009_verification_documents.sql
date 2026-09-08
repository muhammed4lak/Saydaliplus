-- Storage for verification documents.
--
-- Without this the review queue has nothing to look at: a reviewer's whole job
-- is comparing a Syndicate card or a pharmacy licence against the registry, and
-- until now sign-up could only accept a URL somebody had to host themselves.
--
-- These are photographs of identity documents belonging to named people. The
-- bucket is private, an applicant can write only into a folder named after their
-- own user id, and nobody but that person and a reviewer can read it. A public
-- bucket here would put scans of pharmacists' Syndicate cards on the open web.
--
-- Guarded on the storage schema existing so the plain-Postgres policy harness
-- (supabase/tests) can still run the migrations end to end.

do $$
begin
  if to_regclass('storage.buckets') is null then
    raise notice 'storage schema not present — skipping bucket setup (test harness)';
    return;
  end if;

  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values (
    'verification-documents',
    'verification-documents',
    false,
    10 * 1024 * 1024,                             -- a phone photo of a card
    array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf']
  )
  on conflict (id) do update
    set public = false,
        file_size_limit = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;

  -- Objects are stored at `<user id>/<filename>`, so the first path segment is
  -- the owner and every policy below is a comparison against it.
  execute $policy$
    drop policy if exists verification_documents_insert_own on storage.objects;
    create policy verification_documents_insert_own on storage.objects
      for insert to authenticated
      with check (
        bucket_id = 'verification-documents'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  $policy$;

  execute $policy$
    drop policy if exists verification_documents_read_own on storage.objects;
    create policy verification_documents_read_own on storage.objects
      for select to authenticated
      using (
        bucket_id = 'verification-documents'
        and (
          (storage.foldername(name))[1] = auth.uid()::text
          or public.is_platform_admin()
        )
      );
  $policy$;

  -- Replacing a document you already uploaded is fine — people photograph a card
  -- badly the first time. Deleting is not exposed: once a decision has been made
  -- against a document, the document is part of that decision's record.
  execute $policy$
    drop policy if exists verification_documents_update_own on storage.objects;
    create policy verification_documents_update_own on storage.objects
      for update to authenticated
      using (
        bucket_id = 'verification-documents'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  $policy$;
end
$$;
