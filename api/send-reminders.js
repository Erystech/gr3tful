import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import process from 'node:process';

function allowedPushEndpoint(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.port || url.username || url.password) return false;
    const host = url.hostname.toLowerCase();
    return host === 'fcm.googleapis.com'
      || (host === 'jmt17.google.com' && url.pathname.startsWith('/fcm/send/'))
      || host === 'updates.push.services.mozilla.com'
      || host === 'push.services.mozilla.com'
      || host === 'push.apple.com'
      || host.endsWith('.push.apple.com')
      || host === 'wns.notify.windows.com'
      || host.endsWith('.notify.windows.com');
  } catch { return false; }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  if (!process.env.CRON_SECRET || request.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401).json({ error: 'Unauthorized' });
  }
  const { VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VITE_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;
  if (![VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VITE_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT].every(Boolean)) {
    return response.status(500).json({ error: 'Push sender is not configured' });
  }

  const db = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  webpush.setVapidDetails(VAPID_SUBJECT, VITE_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  const { data: due, error } = await db.rpc('claim_due_push_reminders');
  if (error) return response.status(500).json({ error: 'Could not claim reminders' });

  let sent = 0;
  let failed = 0;
  for (const item of due ?? []) {
    const claim = { subscription_id: item.subscription_id, kind: item.kind, journal_date: item.journal_date };
    if (!allowedPushEndpoint(item.endpoint)) {
      await db.from('push_deliveries').delete().match(claim);
      failed += 1;
      continue;
    }
    try {
      await webpush.sendNotification({
        endpoint: item.endpoint,
        keys: { p256dh: item.p256dh, auth: item.auth_key },
      }, JSON.stringify({ kind: item.kind, date: item.journal_date }), { TTL: 3600 });
      sent += 1;
    } catch (pushError) {
      if (pushError.statusCode === 404 || pushError.statusCode === 410) {
        await db.from('push_subscriptions').delete().eq('id', item.subscription_id);
      } else {
        await db.from('push_deliveries').delete().match(claim);
      }
      failed += 1;
    }
  }
  return response.status(200).json({ claimed: due?.length ?? 0, sent, failed });
}
