import type { WorkoutDay, WeekDay } from '../types';

/**
 * Beginner 4-day split (Mon–Thu, legs at the end of the week):
 *   Mon  – Upper Body A
 *   Tue  – Upper Body B
 *   Wed  – Lower Body A
 *   Thu  – Lower Body B
 *
 * Each session: warm-up + 6 exercises, ~45–60 min, machines first.
 */
export const WORKOUTS: WorkoutDay[] = [
  {
    id: 'upper-a',
    day: 'Monday',
    title: 'Upper Body A',
    focus: 'Chest · Back · Shoulders · Arms',
    duration: [45, 60],
    warmup: [
      '5 min easy cardio (bike, treadmill or rower)',
      '20 arm circles forward + backward',
      '15 band pull-aparts',
      '1 light warm-up set on your first exercise',
    ],
    exercises: [
      { exerciseId: 'chest-press-machine', sets: 3, reps: '10–12', restSeconds: 90 },
      { exerciseId: 'lat-pulldown', sets: 3, reps: '10–12', restSeconds: 90 },
      { exerciseId: 'shoulder-press-machine', sets: 3, reps: '10–12', restSeconds: 90 },
      { exerciseId: 'seated-cable-row', sets: 3, reps: '10–12', restSeconds: 90 },
      { exerciseId: 'dumbbell-bicep-curl', sets: 3, reps: '12', restSeconds: 60 },
      { exerciseId: 'tricep-pushdown', sets: 3, reps: '12', restSeconds: 60 },
    ],
  },
  {
    id: 'lower-a',
    day: 'Wednesday',
    title: 'Lower Body A',
    focus: 'Quads · Hamstrings · Glutes · Calves · Core',
    duration: [45, 60],
    warmup: [
      '5 min easy cardio',
      '15 bodyweight squats',
      '10 walking lunges per leg',
      '1 light warm-up set on the leg press',
    ],
    exercises: [
      { exerciseId: 'leg-press', sets: 3, reps: '12', restSeconds: 90 },
      { exerciseId: 'seated-leg-curl', sets: 3, reps: '12', restSeconds: 90 },
      { exerciseId: 'hip-thrust-machine', sets: 3, reps: '12', restSeconds: 90 },
      { exerciseId: 'leg-extension', sets: 3, reps: '12–15', restSeconds: 60 },
      { exerciseId: 'calf-raise-machine', sets: 3, reps: '15', restSeconds: 60 },
      { exerciseId: 'plank', sets: 3, reps: '30 sec', restSeconds: 45 },
    ],
  },
  {
    id: 'upper-b',
    day: 'Tuesday',
    title: 'Upper Body B',
    focus: 'Chest · Back · Shoulders · Arms',
    duration: [45, 60],
    warmup: [
      '5 min easy cardio',
      '15 band pull-aparts',
      '10 scapular pull-ups or dead hangs',
      '1 light warm-up set on the incline press',
    ],
    exercises: [
      { exerciseId: 'incline-chest-press-machine', sets: 3, reps: '10–12', restSeconds: 90 },
      { exerciseId: 'assisted-pull-up', sets: 3, reps: '8–10', restSeconds: 90 },
      { exerciseId: 'dumbbell-lateral-raise', sets: 3, reps: '12–15', restSeconds: 60 },
      { exerciseId: 'pec-deck', sets: 3, reps: '12', restSeconds: 60 },
      { exerciseId: 'cable-bicep-curl', sets: 3, reps: '12', restSeconds: 60 },
      { exerciseId: 'overhead-tricep-extension', sets: 3, reps: '12', restSeconds: 60 },
    ],
  },
  {
    id: 'lower-b',
    day: 'Thursday',
    title: 'Lower Body B',
    focus: 'Legs · Glutes · Core',
    duration: [45, 60],
    warmup: [
      '5 min easy cardio',
      '15 bodyweight squats',
      '10 glute bridges',
      '1 light warm-up set on the goblet squat',
    ],
    exercises: [
      { exerciseId: 'goblet-squat', sets: 3, reps: '10–12', restSeconds: 90 },
      { exerciseId: 'romanian-deadlift', sets: 3, reps: '10–12', restSeconds: 90 },
      { exerciseId: 'cable-glute-kickback', sets: 3, reps: '12 / leg', restSeconds: 60 },
      { exerciseId: 'standing-calf-raise', sets: 3, reps: '15', restSeconds: 45 },
      { exerciseId: 'hanging-knee-raise', sets: 3, reps: '12', restSeconds: 60 },
      { exerciseId: 'cable-crunch', sets: 3, reps: '15', restSeconds: 45 },
    ],
  },
];

// Built from each workout's `day` field so it stays correct if the order changes.
const DAY_TO_WORKOUT: Partial<Record<string, WorkoutDay>> = Object.fromEntries(
  WORKOUTS.map((w) => [w.day, w]),
);

/** Day name for a JS Date. */
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Returns the workout scheduled for the given date, or null on a rest day. */
export function getWorkoutForDate(date: Date): WorkoutDay | null {
  const dayName = WEEKDAY_NAMES[date.getDay()];
  return DAY_TO_WORKOUT[dayName] ?? null;
}

/** The next upcoming workout (today if it's a training day, else the next one). */
export function getNextWorkout(date: Date): { workout: WorkoutDay; daysAway: number } {
  for (let i = 0; i < 7; i++) {
    const d = new Date(date);
    d.setDate(date.getDate() + i);
    const w = getWorkoutForDate(d);
    if (w) return { workout: w, daysAway: i };
  }
  // Fallback (won't happen with a 4-day schedule)
  return { workout: WORKOUTS[0], daysAway: 0 };
}

export const workoutById = (id: string): WorkoutDay | undefined =>
  WORKOUTS.find((w) => w.id === id);

export const TRAINING_DAYS: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
