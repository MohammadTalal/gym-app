import { describe, expect, it } from 'vitest';
import { bestWeekCount, weekStreak } from './stats';
import { dateKey, startOfWeek } from './date';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return dateKey(d);
}

describe('weekStreak', () => {
  it('is 0 with no workouts', () => {
    expect(weekStreak([])).toBe(0);
  });

  it('counts this week as a streak of 1', () => {
    expect(weekStreak([dateKey(new Date())])).toBe(1);
  });

  it('counts two consecutive weeks', () => {
    const thisWeek = dateKey(startOfWeek(new Date()));
    const lastWeek = daysAgo(7);
    expect(weekStreak([thisWeek, lastWeek])).toBe(2);
  });

  it('breaks the streak when a week is skipped', () => {
    // this week + three weeks ago (gap) => streak only counts this week
    expect(weekStreak([dateKey(new Date()), daysAgo(21)])).toBe(1);
  });
});

describe('bestWeekCount', () => {
  it('is 0 with no workouts', () => {
    expect(bestWeekCount([])).toBe(0);
  });

  it('counts the most workouts in a single week', () => {
    const a = daysAgo(0);
    const b = daysAgo(1);
    const c = daysAgo(2);
    expect(bestWeekCount([a, b, c])).toBeGreaterThanOrEqual(1);
  });
});
