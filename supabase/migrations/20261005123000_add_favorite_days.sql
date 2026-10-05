-- Let each user mark an entire journal day as a favorite.

alter table public.entries
  add column if not exists is_favorite boolean not null default false;

create index if not exists entries_user_favorites_idx
  on public.entries (user_id, journal_date desc)
  where is_favorite = true;
