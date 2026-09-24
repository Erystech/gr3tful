-- Maintain a public aggregate without exposing journal rows or per-user data.

create table if not exists public.public_stats (
  id text primary key,
  gratitude_count bigint not null default 0,
  updated_at timestamptz not null default now(),
  constraint public_stats_singleton_check check (id = 'global'),
  constraint public_stats_gratitude_count_check check (gratitude_count >= 0)
);

insert into public.public_stats (id, gratitude_count, updated_at)
select 'global', count(*) * 3, now()
from public.entries
on conflict (id) do update
set gratitude_count = excluded.gratitude_count,
    updated_at = excluded.updated_at;

create or replace function public.sync_public_gratitude_count()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog
as $$
begin
  if tg_op = 'INSERT' then
    update public.public_stats
    set gratitude_count = gratitude_count + 3,
        updated_at = now()
    where id = 'global';
  elsif tg_op = 'DELETE' then
    update public.public_stats
    set gratitude_count = greatest(gratitude_count - 3, 0),
        updated_at = now()
    where id = 'global';
  end if;

  return null;
end;
$$;

revoke execute on function public.sync_public_gratitude_count()
  from public, anon, authenticated;

drop trigger if exists entries_sync_public_gratitude_count on public.entries;

create trigger entries_sync_public_gratitude_count
after insert or delete on public.entries
for each row execute function public.sync_public_gratitude_count();

alter table public.public_stats enable row level security;

drop policy if exists "Public stats are readable" on public.public_stats;

create policy "Public stats are readable"
on public.public_stats
for select
to anon, authenticated
using (id = 'global');

revoke all on table public.public_stats from anon, authenticated;
grant select on table public.public_stats to anon, authenticated;
