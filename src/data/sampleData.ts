import type { AppState, UserProfile } from '../types';
import { dateKey } from '../utils/date';

/**
 * Real starting profile (from the user's brief). No fake workout/PR history —
 * the app starts clean and fills up with real data as you use it.
 */
export const DEFAULT_PROFILE: UserProfile = {
  name: 'Athlete',
  sex: 'Male',
  heightCm: 176,
  level: 'Beginner',
  goal: 'Build muscle, improve overall fitness, and learn proper technique',
};

/** Your real current body weight, used as the first weight entry. */
export const STARTING_WEIGHT_KG = 84.5;

/** A fresh, empty state: real profile + your starting weight, no other history. */
export function createInitialState(): AppState {
  return {
    profile: { ...DEFAULT_PROFILE },
    darkMode: true,
    completionByDate: {},
    completedWorkouts: [],
    bodyWeight: [{ date: dateKey(new Date()), weightKg: STARTING_WEIGHT_KG }],
    personalRecords: [],
  };
}
