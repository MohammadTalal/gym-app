import { createContext, useContext } from 'react';
import type {
  AppState,
  BodyWeightEntry,
  CompletedWorkout,
  PersonalRecord,
  UserProfile,
} from '../types';

export interface AppContextValue {
  state: AppState;
  /** 'cloud' when backed by Supabase, 'local' when using browser storage only. */
  mode: 'cloud' | 'local';
  toggleDarkMode: () => void;
  /** Toggle a single exercise's completed state for a given date (default today). */
  toggleExerciseComplete: (exerciseId: string, date?: Date) => void;
  /** Mark a set of exercises complete/incomplete at once (e.g. whole session). */
  setDayCompletion: (exerciseIds: string[], complete: boolean, date?: Date) => void;
  isExerciseComplete: (exerciseId: string, date?: Date) => boolean;
  completedExerciseIds: (date?: Date) => string[];
  /** Save a finished workout into history. */
  logWorkout: (entry: Omit<CompletedWorkout, 'id'>) => void;
  addBodyWeight: (entry: BodyWeightEntry) => void;
  addPersonalRecord: (entry: PersonalRecord) => void;
  /** Update the personal profile (name, height, goal, …). */
  updateProfile: (profile: UserProfile) => void;
  resetProgress: () => void;
  /** Present only in cloud mode — signs the user out. */
  signOut?: () => void | Promise<void>;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an App provider');
  return ctx;
}
