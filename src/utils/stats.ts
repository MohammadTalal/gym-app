import { dateKey, parseDateKey, startOfWeek } from './date';

/** Counts consecutive weeks (ending this week or last) that have ≥1 workout. */
export function weekStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const weeks = new Set(dates.map((d) => dateKey(startOfWeek(parseDateKey(d)))));
  let streak = 0;
  const cursor = startOfWeek(new Date());
  // Keep the streak alive even if this week has no workout logged yet.
  if (!weeks.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 7);
  while (weeks.has(dateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 7);
  }
  return streak;
}

/** The highest number of workouts logged within any single (Mon-based) week. */
export function bestWeekCount(dates: string[]): number {
  const counts = new Map<string, number>();
  for (const d of dates) {
    const key = dateKey(startOfWeek(parseDateKey(d)));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts.size ? Math.max(...counts.values()) : 0;
}
