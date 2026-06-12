/**
 * Returns the ISO start/end of the "journaling day" that is currently active.
 * A new day begins at 09:00 local time.
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
  windowEnd.setDate(windowEnd.getDate() + 1);
  windowEnd.setHours(8, 59, 59, 999);
  return {
    start: windowStart.toISOString(),
    end: windowEnd.toISOString(),
  };
}