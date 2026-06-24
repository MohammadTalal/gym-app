/** yyyy-mm-dd key in local time. */
export function dateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse a yyyy-mm-dd key back into a local-time Date (avoids UTC day shifts). */
export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function dayName(date: Date = new Date()): string {
  return FULL_DAYS[date.getDay()];
}

/** "Mon, Jun 22" */
export function prettyDate(date: Date = new Date()): string {
  return `${FULL_DAYS[date.getDay()].slice(0, 3)}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

/** "Jun 22" */
export function shortDate(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** Returns Monday-based start of the week for a date. */
export function startOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day; // shift so Monday is the first day
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Returns array of the 7 Date objects in the week containing `date` (Mon→Sun). */
export function weekDates(date: Date = new Date()): Date[] {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function formatRest(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
}
