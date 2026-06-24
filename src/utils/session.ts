import type { AppState, CompletedWorkout, WorkoutDay } from '../types';
import { getWorkoutForDate } from '../data/workouts';
import { parseDateKey } from './date';

/** How many exercises must be ticked for a day to count as a trained session. */
export const MIN_EXERCISES_TO_COUNT = 1;

/** The workout scheduled for a yyyy-mm-dd key, or null on a rest day. */
export function scheduledWorkoutForKey(key: string): WorkoutDay | null {
  return getWorkoutForDate(parseDateKey(key));
}

/** How many of a workout's exercises are ticked complete for a given day. */
export function completedCount(
  completionByDate: Record<string, string[]>,
  key: string,
  workout: WorkoutDay,
): number {
  const ids = new Set(workout.exercises.map((e) => e.exerciseId));
  return (completionByDate[key] ?? []).filter((id) => ids.has(id)).length;
}

function estimateDuration(workout: WorkoutDay, completed: number): number {
  const mid = (workout.duration[0] + workout.duration[1]) / 2;
  return Math.max(1, Math.round((mid * completed) / workout.exercises.length));
}

/**
 * Returns `completedWorkouts` updated so a single day reflects its ticked
 * exercises: auto-creates/updates a logged session when ≥ MIN are done, and
 * removes it when none are. An existing duration (e.g. a real one from Workout
 * Mode) is preserved; otherwise it's estimated from how much was completed.
 */
export function syncDayLog(
  completedWorkouts: CompletedWorkout[],
  completionByDate: Record<string, string[]>,
  key: string,
): CompletedWorkout[] {
  const workout = scheduledWorkoutForKey(key);
  if (!workout) return completedWorkouts;

  const others = completedWorkouts.filter((w) => !(w.date === key && w.workoutDayId === workout.id));
  const completed = completedCount(completionByDate, key, workout);
  if (completed < MIN_EXERCISES_TO_COUNT) return others;

  const existing = completedWorkouts.find((w) => w.date === key && w.workoutDayId === workout.id);
  return [
    ...others,
    {
      id: `${workout.id}-${key}`,
      workoutDayId: workout.id,
      date: key,
      durationMinutes: existing?.durationMinutes ?? estimateDuration(workout, completed),
      completedExercises: completed,
      totalExercises: workout.exercises.length,
    },
  ];
}

/** Reconcile every day that has ticked exercises (used on load to backfill). */
export function reconcileLogs(state: AppState): CompletedWorkout[] {
  let logs = state.completedWorkouts;
  for (const key of Object.keys(state.completionByDate)) {
    logs = syncDayLog(logs, state.completionByDate, key);
  }
  return logs;
}
