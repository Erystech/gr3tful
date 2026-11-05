# gr3tful

A daily gratitude journal. Write three things every day, track your streak, and look back on how far you've come.

**Stack:** React 19 · Vite · Tailwind CSS v4 · Supabase

The first browser visit opens the landing page. Later visits open login; the landing page is always available at `/welcome`. Installed apps start at `/launch`, which opens login even when Home Screen storage is separate from the browser.

Authentication stays in memory for the current visit. Refreshing, reopening, or restoring a page from the browser's back/forward cache requires sign-in again. Switching tabs or briefly switching apps keeps the current login. Old saved Supabase logins are removed when this version loads; theme and visit preferences remain. Password-reset links can still establish their temporary recovery session. Existing push subscriptions remain active across refreshes; explicit sign-out removes this device's reminders as before.

---
