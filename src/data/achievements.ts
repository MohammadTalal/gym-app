import type { AppState } from '../types';
import { bestWeekCount, weekStreak } from '../utils/stats';

export interface Achievement {
  id: string;
  emoji: string;
  /** Whether the achievement is unlocked for the given state. */
  earned: (s: AppState) => boolean;
  /** Optional progress toward unlocking (for the not-yet-earned ones). */
  progress?: (s: AppState) => { current: number; target: number };
}

/**
 * Achievements are derived entirely from existing data — no extra storage.
 * Names/descriptions live in i18n under `ach.<id>.name` / `ach.<id>.desc`.
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_workout',
    emoji: '💪',
    earned: (s) => s.completedWorkouts.length >= 1,
    progress: (s) => ({ current: Math.min(s.completedWorkouts.length, 1), target: 1 }),
  },
  {
    id: 'full_session',
    emoji: '✅',
    earned: (s) => s.completedWorkouts.some((w) => w.completedExercises >= w.totalExercises && w.totalExercises > 0),
  },
  {
    id: 'first_pr',
    emoji: '🏆',
    earned: (s) => s.personalRecords.length >= 1,
  },
  {
    id: 'perfect_week',
    emoji: '📅',
    earned: (s) => bestWeekCount(s.completedWorkouts.map((w) => w.date)) >= 4,
    progress: (s) => ({ current: Math.min(bestWeekCount(s.completedWorkouts.map((w) => w.date)), 4), target: 4 }),
  },
  {
    id: 'five_workouts',
    emoji: '🏋️',
    earned: (s) => s.completedWorkouts.length >= 5,
    progress: (s) => ({ current: Math.min(s.completedWorkouts.length, 5), target: 5 }),
  },
  {
    id: 'streak_2',
    emoji: '🔥',
    earned: (s) => weekStreak(s.completedWorkouts.map((w) => w.date)) >= 2,
    progress: (s) => ({ current: Math.min(weekStreak(s.completedWorkouts.map((w) => w.date)), 2), target: 2 }),
  },
  {
    id: 'ten_workouts',
    emoji: '🎖️',
    earned: (s) => s.completedWorkouts.length >= 10,
    progress: (s) => ({ current: Math.min(s.completedWorkouts.length, 10), target: 10 }),
  },
  {
    id: 'weigh_in',
    emoji: '⚖️',
    earned: (s) => s.bodyWeight.length >= 3,
    progress: (s) => ({ current: Math.min(s.bodyWeight.length, 3), target: 3 }),
  },
];
