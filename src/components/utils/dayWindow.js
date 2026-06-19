const GRACE_CUTOFF_HOUR = 9;

/**
 * Returns the ISO start/end of the "journaling day" window that contains
 * `referenceDate` (defaults to now). Unchanged from before.
 */
export function getJournalDayWindow(referenceDate = new Date()) {
  const windowStart = new Date(referenceDate);
  if (windowStart.getHours() < GRACE_CUTOFF_HOUR) {
    windowStart.setDate(windowStart.getDate() - 1);
  }
  windowStart.setHours(GRACE_CUTOFF_HOUR, 0, 0, 0);

  const windowEnd = new Date(windowStart);
  windowEnd.setDate(windowEnd.getDate() + 1);
  windowEnd.setHours(GRACE_CUTOFF_HOUR - 1, 59, 59, 999);

  return {
    start: windowStart.toISOString(),
    end: windowEnd.toISOString(),
  };
}

/**
 * Converts any timestamp into the "journal date" (YYYY-MM-DD) it belongs
 * to. Anything before 9am counts as the previous calendar day — this is
 * the single source of truth for "what day does this entry belong to."
 */
export function toJournalDate(timestamp) {
  const d = new Date(timestamp);
  if (d.getHours() < GRACE_CUTOFF_HOUR) {
    d.setDate(d.getDate() - 1);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


export function getCurrentJournalDate() {
  return toJournalDate(new Date());
}


export function isInGracePeriod(referenceDate = new Date()) {
  return referenceDate.getHours() < GRACE_CUTOFF_HOUR;
}