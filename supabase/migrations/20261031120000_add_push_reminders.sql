create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth_key text not null,
  timezone text not null,
  morning_enabled boolean not null default true,
  streak_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  constraint push_endpoint_length check (char_length(endpoint) between 20 and 2048),
  constraint push_key_length check (char_length(p256dh) between 20 and 512 and char_length(auth_key) between 8 and 512)
);

create index push_subscriptions_user_id_idx on public.push_subscriptions (user_id);
alter table public.push_subscriptions enable row level security;
revoke all on public.push_subscriptions from anon, authenticated;
grant select, insert, update, delete on public.push_subscriptions to authenticated;

create policy "Read own push subscriptions" on public.push_subscriptions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Add own push subscriptions" on public.push_subscriptions
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own push subscriptions" on public.push_subscriptions
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Delete own push subscriptions" on public.push_subscriptions
  for delete to authenticated using ((select auth.uid()) = user_id);

create table public.push_deliveries (
  subscription_id uuid not null references public.push_subscriptions(id) on delete cascade,
  kind text not null check (kind in ('morning', 'streak')),
  journal_date date not null,
  claimed_at timestamptz not null default now(),
  primary key (subscription_id, kind, journal_date)
);
alter table public.push_deliveries enable row level security;
revoke all on public.push_deliveries from anon, authenticated;

-- The service role alone can claim due messages. Unique delivery rows prevent
-- duplicate sends when cron retries or two runs overlap.
create or replace function public.claim_due_push_reminders(at_time timestamptz default now())
returns table (subscription_id uuid, endpoint text, p256dh text, auth_key text, kind text, journal_date date)
language sql security definer set search_path = '' as $$
  with local_times as (
    select s.*, (at_time at time zone s.timezone) as local_now
    from public.push_subscriptions s
    join pg_catalog.pg_timezone_names tz on tz.name = s.timezone
  ), due as (
    select s.id, s.endpoint, s.p256dh, s.auth_key,
      case when extract(hour from s.local_now) = 9 then 'morning' else 'streak' end as kind,
      s.local_now::date as journal_date
    from local_times s
    where extract(minute from s.local_now) < 30
      and ((extract(hour from s.local_now) = 9 and s.morning_enabled)
        or (extract(hour from s.local_now) = 20 and s.streak_enabled
          and exists (select 1 from public.entries e where e.user_id = s.user_id
            and e.journal_date = s.local_now::date - 1)))
      and not exists (select 1 from public.entries e where e.user_id = s.user_id
        and e.journal_date = s.local_now::date)
  ), claimed as (
    insert into public.push_deliveries (subscription_id, kind, journal_date)
    select id, kind, journal_date from due
    on conflict do nothing
    returning push_deliveries.subscription_id, push_deliveries.kind, push_deliveries.journal_date
  )
  select c.subscription_id, d.endpoint, d.p256dh, d.auth_key, c.kind, c.journal_date
  from claimed c join due d on d.id = c.subscription_id
$$;
revoke all on function public.claim_due_push_reminders(timestamptz) from public, anon, authenticated;
grant execute on function public.claim_due_push_reminders(timestamptz) to service_role;
