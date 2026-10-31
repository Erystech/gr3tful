-- Supabase Cron runs the reminder job; pg_net makes its HTTP call to Vercel.
-- The job itself is installed after the deployment URL and secrets are ready.
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;
