-- Add one optional private image to each gratitude item.
-- Files live in a private Storage bucket under {user_id}/{entry_id}/{slot}.webp.

alter table public.entries
  add column if not exists image_1_path text,
  add column if not exists image_2_path text,
  add column if not exists image_3_path text;

alter table public.entries
  drop constraint if exists entries_image_1_path_check,
  drop constraint if exists entries_image_2_path_check,
  drop constraint if exists entries_image_3_path_check;

alter table public.entries
  add constraint entries_image_1_path_check
    check (image_1_path is null or (char_length(image_1_path) between 10 and 500 and image_1_path not like '%..%')),
  add constraint entries_image_2_path_check
    check (image_2_path is null or (char_length(image_2_path) between 10 and 500 and image_2_path not like '%..%')),
  add constraint entries_image_3_path_check
    check (image_3_path is null or (char_length(image_3_path) between 10 and 500 and image_3_path not like '%..%'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gratitude-images',
  'gratitude-images',
  false,
  524288,
  array['image/webp']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can read their own gratitude images" on storage.objects;
drop policy if exists "Users can upload their own gratitude images" on storage.objects;
drop policy if exists "Users can delete their own gratitude images" on storage.objects;

create policy "Users can read their own gratitude images"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'gratitude-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can upload their own gratitude images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'gratitude-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can delete their own gratitude images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'gratitude-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
