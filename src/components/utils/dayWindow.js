/**
 * Returns the ISO start/end of the "journaling day" that is currently active.
 * A new day begins at 09:00 local time.
 *
 * e.g. if now is 2026-05-31 08:30, the active window is
 *      2026-05-30T09:00:00  →  2026-05-31T08:59:59
 * if now is 2026-05-31 10:00, the active window is
 *      2026-05-31T09:00:00  →  2026-06-01T08:59:59
 */
export function getJournalDayWindow() {
  const now = new Date();
  const hour = now.getHours();

  // If it's before 9 AM, the active "day" started yesterday at 09:00
  const windowStart = new Date(now);
  if (hour < 9) {
    windowStart.setDate(windowStart.getDate() - 1);
  }
  windowStart.setHours(9, 0, 0, 0);

  const windowEnd = new Date(windowStart);
  windowEnd.setDate(windowEnd.getDate() + 1); // +24 h
  windowEnd.setSeconds(windowEnd.getSeconds() - 1); // -1 s → 08:59:59

  return {
    start: windowStart.toISOString(),
    end: windowEnd.toISOString(),
  };
}