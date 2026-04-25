
import { differenceInCalendarDays, parseISO } from "date-fns";

export function calcStreak(entries) {
  if (!entries.length) return 0;
  const dates = [...new Set(entries.map(e => e.date))].sort().reverse();
  let streak = 0;
  let cursor = new Date();
  for (const d of dates) {
    const diff = differenceInCalendarDays(cursor, parseISO(d));
    if (diff > 1) break;
    streak++;
    cursor = parseISO(d);
  }
  return streak;
}