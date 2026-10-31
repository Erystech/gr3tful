import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../supabaseClient';
import { useAuth } from './context/AuthContext';

function decodeKey(value) {
  const padding = '='.repeat((4 - value.length % 4) % 4);
  const raw = atob((value + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

function supported() {
  return window.isSecureContext && 'serviceWorker' in navigator
    && 'PushManager' in window && 'Notification' in window;
}

export default function PushReminders() {
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const available = import.meta.env.PROD && supported();
  const configured = Boolean(import.meta.env.VITE_VAPID_PUBLIC_KEY);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user || !available) { setLoading(false); return; }
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        const subscription = await registration?.pushManager.getSubscription();
        if (!subscription) return;
        const { data, error } = await supabase.from('push_subscriptions')
          .select('id, morning_enabled, streak_enabled, timezone')
          .eq('endpoint', subscription.endpoint).maybeSingle();
        if (error) throw error;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (data && data.timezone !== timezone) {
          await supabase.from('push_subscriptions').update({ timezone }).eq('id', data.id);
        }
        if (!cancelled) setRecord(data);
      } catch { if (!cancelled) toast.error('Could not load reminder settings'); }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [user, available]);

  async function enable() {
    if (!user || busy || !available || !configured) return;
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') throw new Error('Notifications were not allowed in this browser.');
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodeKey(import.meta.env.VITE_VAPID_PUBLIC_KEY),
      });
      const keys = subscription.toJSON().keys;
      const { data, error } = await supabase.from('push_subscriptions').upsert({
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh: keys.p256dh,
        auth_key: keys.auth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        morning_enabled: true,
        streak_enabled: true,
      }, { onConflict: 'endpoint' }).select('id, morning_enabled, streak_enabled').single();
      if (error) throw error;
      setRecord(data);
      toast.success('Reminders are on for this device');
    } catch (error) { toast.error(error.message || 'Could not enable reminders'); }
    finally { setBusy(false); }
  }

  async function disable() {
    setBusy(true);
    try {
      if (record) {
        const { error } = await supabase.from('push_subscriptions').delete().eq('id', record.id);
        if (error) throw error;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) await subscription.unsubscribe();
      setRecord(null);
      toast.success('Reminders are off for this device');
    } catch { toast.error('Could not turn off reminders'); }
    finally { setBusy(false); }
  }

  async function toggle(field) {
    if (!record) return;
    setBusy(true);
    const value = !record[field];
    const { error } = await supabase.from('push_subscriptions').update({ [field]: value }).eq('id', record.id);
    if (error) toast.error('Could not save reminder settings');
    else setRecord({ ...record, [field]: value });
    setBusy(false);
  }

  return <section className="mb-6 rounded-2xl border border-borderline bg-surface p-4 font-parag text-secondary">
    <h2 className="text-xs uppercase tracking-[1.5px]">Reminders</h2>
    <p className="mt-2 text-xs text-secondary-text">A gentle nudge at 9 AM and a streak reminder at 8 PM, in your local time. Only sent when needed.</p>
    {!available ? <p className="mt-3 text-xs">Install Gr3tful to your Home Screen to enable notifications on iPhone. Your browser may also need notification support.</p>
      : !configured ? <p className="mt-3 text-xs">Reminders are being set up. Check back soon.</p>
        : loading ? <p className="mt-3 text-xs">Loading reminder settings…</p>
          : !record ? <button type="button" disabled={busy} onClick={enable} className="mt-3 rounded-full bg-deep px-4 py-2 text-xs text-fwhite disabled:opacity-50">Enable reminders</button>
            : <div className="mt-3 space-y-3 text-xs">
              <label className="flex items-center justify-between gap-3"><span>Morning · 9:00 AM</span><input type="checkbox" checked={record.morning_enabled} disabled={busy} onChange={() => toggle('morning_enabled')} /></label>
              <label className="flex items-center justify-between gap-3"><span>Streak warning · 8:00 PM</span><input type="checkbox" checked={record.streak_enabled} disabled={busy} onChange={() => toggle('streak_enabled')} /></label>
              <button type="button" disabled={busy} onClick={disable} className="underline disabled:opacity-50">Turn off on this device</button>
            </div>}
  </section>;
}
