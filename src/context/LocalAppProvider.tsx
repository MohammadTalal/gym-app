import { useCallback, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type {
  AppState,
  BodyWeightEntry,
  CompletedWorkout,
  PersonalRecord,
  UserProfile,
} from '../types';
import { createInitialState } from '../data/sampleData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { dateKey } from '../utils/date';
import { AppContext } from './AppContext';
import type { AppContextValue } from './AppContext';

// v2: starts clean (real profile, no mock history). The old v1 key with sample
// data is intentionally ignored so previous fake data never reappears.
const STORAGE_KEY = 'gymcoach-state-v2';

/** Browser-only data provider (used when no Supabase backend is configured). */
export function LocalAppProvider({ children }: { children: ReactNode }) {
  const [state, setState, reset] = useLocalStorage<AppState>(STORAGE_KEY, createInitialState());

  useEffect(() => {
    const root = document.documentElement;
    if (state.darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [state.darkMode]);

  const toggleDarkMode = useCallback(
    () => setState((s) => ({ ...s, darkMode: !s.darkMode })),
    [setState],
  );

  const completedExerciseIds = useCallback(
    (date: Date = new Date()) => state.completionByDate[dateKey(date)] ?? [],
    [state.completionByDate],
  );

  const isExerciseComplete = useCallback(
    (exerciseId: string, date: Date = new Date()) =>
      (state.completionByDate[dateKey(date)] ?? []).includes(exerciseId),
    [state.completionByDate],
  );

  const toggleExerciseComplete = useCallback(
    (exerciseId: string, date: Date = new Date()) => {
      const key = dateKey(date);
      setState((s) => {
        const current = s.completionByDate[key] ?? [];
        const next = current.includes(exerciseId)
          ? current.filter((id) => id !== exerciseId)
          : [...current, exerciseId];
        return { ...s, completionByDate: { ...s.completionByDate, [key]: next } };
      });
    },
    [setState],
  );

  const logWorkout = useCallback(
    (entry: Omit<CompletedWorkout, 'id'>) => {
      setState((s) => {
        const filtered = s.completedWorkouts.filter(
          (w) => !(w.date === entry.date && w.workoutDayId === entry.workoutDayId),
        );
        const id = `${entry.workoutDayId}-${entry.date}`;
        return { ...s, completedWorkouts: [...filtered, { ...entry, id }] };
      });
    },
    [setState],
  );

  const addBodyWeight = useCallback(
    (entry: BodyWeightEntry) => {
      setState((s) => {
        const filtered = s.bodyWeight.filter((b) => b.date !== entry.date);
        return {
          ...s,
          bodyWeight: [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date)),
        };
      });
    },
    [setState],
  );

  const addPersonalRecord = useCallback(
    (entry: PersonalRecord) => {
      setState((s) => {
        const filtered = s.personalRecords.filter((p) => p.exerciseId !== entry.exerciseId);
        return { ...s, personalRecords: [...filtered, entry] };
      });
    },
    [setState],
  );

  const updateProfile = useCallback(
    (profile: UserProfile) => setState((s) => ({ ...s, profile })),
    [setState],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      mode: 'local',
      toggleDarkMode,
      toggleExerciseComplete,
      isExerciseComplete,
      completedExerciseIds,
      logWorkout,
      addBodyWeight,
      addPersonalRecord,
      updateProfile,
      resetProgress: reset,
    }),
    [
      state,
      toggleDarkMode,
      toggleExerciseComplete,
      isExerciseComplete,
      completedExerciseIds,
      logWorkout,
      addBodyWeight,
      addPersonalRecord,
      updateProfile,
      reset,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
