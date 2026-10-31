# Push reminder setup

The subscription database migration is installed. The app still needs one Web Push key pair and a scheduled call to its sender. No separate paid notification service is required.

1. The one-time keys and scheduler secret are in the ignored local file `.env.push.local`. Keep this file private and backed up. Add these Vercel environment variables to **both Preview and Production**; the `staging` branch uses Preview:

   - `VITE_VAPID_PUBLIC_KEY`: generated public key
   - `VAPID_PRIVATE_KEY`: generated private key
   - `VAPID_SUBJECT`: `https://gr3tful.vercel.app`
   - `SUPABASE_SERVICE_ROLE_KEY`: service role key from Supabase Project Settings → API
   - `CRON_SECRET`: value from `.env.push.local`

   `VITE_SUPABASE_URL` is already required by the app. Never put the service role key or private VAPID key in a `VITE_` variable. Add the public key to local `.env` to test a production build locally, and redeploy after adding Vercel variables.

2. The same `CRON_SECRET` and the production sender URL have already been saved in Supabase Vault. The SQL below records how to recreate them if needed; do not run it again while those entries exist:

   ```sql
   select vault.create_secret('https://gr3tful.vercel.app/api/send-reminders', 'gr3tful_reminder_url');
   select vault.create_secret('REPLACE_WITH_THE_SAME_CRON_SECRET', 'gr3tful_cron_secret');
   ```

3. Cron and `pg_net` are enabled by a versioned migration. Run this in the Supabase SQL editor after the sender URL is deployed to production:

   ```sql
   select cron.schedule(
     'gr3tful-push-reminders',
     '*/15 * * * *',
     $$select net.http_post(
       url := (select decrypted_secret from vault.decrypted_secrets where name = 'gr3tful_reminder_url'),
       headers := jsonb_build_object(
         'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'gr3tful_cron_secret'),
         'Content-Type', 'application/json'
       ),
       body := '{}'::jsonb
     )$$
   );
   ```

4. Open the installed app, sign in, and choose **Tools → Enable reminders**. On iPhone, install the web app to the Home Screen first. Test on the same origin where it was enabled; browser subscriptions do not carry over from a preview URL to `gr3tful.vercel.app`.

The morning notification is due at 9:00 AM local time if today's entry is missing. The 8:00 PM notification is due only if yesterday's entry exists and today's is missing. Cron checks every 15 minutes, so arrival may be a few minutes after the stated time. Turning reminders off removes the device's subscription. Signing out also removes it from this device.
