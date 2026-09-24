-- Version the existing journal table and harden it for production use.
-- This migration is intentionally safe to run against the existing project
-- and when bootstrapping a fresh Supabase environment.

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  item_1 text not null,
  item_2 text not null,
  item_3 text not null,
  tags text[] not null default '{}'
);

alter table public.entries
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column tags set default '{}',
  alter column tags set not null;

-- Give the app a timezone-independent day key. Existing rows were created
-- while Gr3tful used the Africa/Lagos 09:00 cutoff, so that rule is used only
-- for the one-time backfill. New rows send the user's local journal date.
alter table public.entries
  add column if not exists journal_date date;

with ranked_entries as (
  select
    id,
    ((created_at at time zone 'Africa/Lagos') - interval '9 hours')::date as derived_journal_date,
    row_number() over (
      partition by
        user_id,
        ((created_at at time zone 'Africa/Lagos') - interval '9 hours')::date
      order by created_at, id
    ) as occurrence
  from public.entries
  where journal_date is null
)
update public.entries as entries
set journal_date = case
  when ranked_entries.occurrence = 1 then ranked_entries.derived_journal_date
  else null
end
from ranked_entries
where entries.id = ranked_entries.id;

create unique index if not exists entries_user_journal_date_key
  on public.entries (user_id, journal_date)
  where journal_date is not null;

create index if not exists entries_user_created_at_idx
  on public.entries (user_id, created_at desc);

-- Recreate the foreign key with account-deletion cleanup.
alter table public.entries
  drop constraint if exists entries_user_id_fkey;

alter table public.entries
  add constraint entries_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.entries
  drop constraint if exists entries_item_1_length_check,
  drop constraint if exists entries_item_2_length_check,
  drop constraint if exists entries_item_3_length_check;

alter table public.entries
  add constraint entries_item_1_length_check
    check (char_length(btrim(item_1)) between 1 and 500),
  add constraint entries_item_2_length_check
    check (char_length(btrim(item_2)) between 1 and 500),
  add constraint entries_item_3_length_check
    check (char_length(btrim(item_3)) between 1 and 500);

alter table public.entries enable row level security;

drop policy if exists "Users can read their own entries" on public.entries;
drop policy if exists "Users can insert their own entries" on public.entries;
drop policy if exists "Users can update their own entries" on public.entries;
drop policy if exists "Users Can Delete their own entries" on public.entries;

create policy "Users can read their own entries"
  on public.entries
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own entries"
  on public.entries
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and journal_date is not null
  );

create policy "Users can update their own entries"
  on public.entries
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and journal_date is not null
  );

create policy "Users can delete their own entries"
  on public.entries
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- RLS blocks anonymous rows, but removing table grants also reduces the
-- exposed attack surface and prevents non-row operations such as TRUNCATE.
revoke all on table public.entries from anon;
revoke all on table public.entries from authenticated;
grant select, insert, update, delete on table public.entries to authenticated;

-- This platform event-trigger helper does not need to be callable through
-- PostgREST RPC. It remains executable by its owner for the event trigger.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
