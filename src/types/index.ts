// ───────────────────────────────────────────────────────────
// Core domain models
// ───────────────────────────────────────────────────────────

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Arms'
  | 'Quads'
  | 'Hamstrings'
  | 'Glutes'
  | 'Calves'
  | 'Core'
  | 'Legs'
  | 'Full Body';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';

/** A single exercise definition (lives in the exercise library). */
export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: string;
  difficulty: Difficulty;
  description: string;
  instructions: string[];
  mistakes: string[];
  /** YouTube video id used for the embedded player. */
  videoId?: string;
}

/** An exercise as prescribed within a specific workout (sets/reps/rest). */
export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  /** Human readable rep target, e.g. "10–12" or "30 sec". */
  reps: string;
  restSeconds: number;
}

/** A full training day. */
export interface WorkoutDay {
  id: string;
  day: WeekDay;
  title: string;
  focus: string;
  /** [min, max] estimated minutes. */
  duration: [number, number];
  warmup: string[];
  exercises: WorkoutExercise[];
}

// ───────────────────────────────────────────────────────────
// Progress / user state (persisted in localStorage)
// ───────────────────────────────────────────────────────────

export interface CompletedWorkout {
  id: string;
  workoutDayId: string;
  /** ISO date string (yyyy-mm-dd). */
  date: string;
  durationMinutes: number;
  completedExercises: number;
  totalExercises: number;
}

export interface BodyWeightEntry {
  date: string; // yyyy-mm-dd
  weightKg: number;
}

export interface PersonalRecord {
  exerciseId: string;
  weightKg: number;
  reps: number;
  date: string; // yyyy-mm-dd
}

export interface UserProfile {
  name: string;
  sex: 'Male' | 'Female';
  heightCm: number;
  level: Difficulty;
  goal: string;
}

export interface AppState {
  profile: UserProfile;
  darkMode: boolean;
  /** Map of dateKey -> array of completed exercise ids for that day's session. */
  completionByDate: Record<string, string[]>;
  completedWorkouts: CompletedWorkout[];
  bodyWeight: BodyWeightEntry[];
  personalRecords: PersonalRecord[];
}
