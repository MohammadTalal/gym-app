import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import type {
  AppState,
  BodyWeightEntry,
  CompletedWorkout,
  PersonalRecord,
  UserProfile,
} from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { DEFAULT_PROFILE, STARTING_WEIGHT_KG } from '../data/sampleData';
import { dateKey } from '../utils/date';
import { reconcileLogs, scheduledWorkoutForKey, syncDayLog } from '../utils/session';
import { AppContext } from './AppContext';
import type { AppContextValue } from './AppContext';

/** Map a CompletedWorkout to its Supabase row shape. */
function workoutRow(userId: string, w: CompletedWorkout) {
  return {
    user_id: userId,
    workout_day_id: w.workoutDayId,
    date: w.date,
    duration_minutes: w.durationMinutes,
    completed_exercises: w.completedExercises,
    total_exercises: w.totalExercises,
  };
}

/** Supabase-backed data provider: loads the signed-in user's data and syncs writes. */
export function CloudAppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user!.id;
  const [state, setState] = useState<AppState | null>(null);
  const stateRef = useRef<AppState | null>(null);
  stateRef.current = state;

  // Load everything for this user, bootstrapping a profile on first sign-in.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const sb = supabase!;
      let profileRow = (await sb.from('profiles').select('*').eq('user_id', userId).maybeSingle()).data;

      if (!profileRow) {
        // First sign-in: seed the real profile + starting weight, no fake history.
        const today = dateKey(new Date());
        profileRow = {
          user_id: userId,
          name: DEFAULT_PROFILE.name,
          sex: DEFAULT_PROFILE.sex,
          height_cm: DEFAULT_PROFILE.heightCm,
          level: DEFAULT_PROFILE.level,
          goal: DEFAULT_PROFILE.goal,
          dark_mode: true,
        };
        await sb.from('profiles').insert(profileRow);
        await sb.from('body_weight').insert({ user_id: userId, date: today, weight_kg: STARTING_WEIGHT_KG });
      }

      const [workouts, weights, prs, completions] = await Promise.all([
        sb.from('completed_workouts').select('*').eq('user_id', userId),
        sb.from('body_weight').select('*').eq('user_id', userId).order('date'),
        sb.from('personal_records').select('*').eq('user_id', userId),
        sb.from('exercise_completions').select('*').eq('user_id', userId),
      ]);

      const completionByDate: Record<string, string[]> = {};
      for (const row of completions.data ?? []) {
        (completionByDate[row.date] ??= []).push(row.exercise_id);
      }

      if (cancelled) return;
      const loaded: AppState = {
        profile: {
          name: profileRow.name,
          sex: profileRow.sex,
          heightCm: Number(profileRow.height_cm),
          level: profileRow.level,
          goal: profileRow.goal,
        },
        darkMode: profileRow.dark_mode,
        completionByDate,
        completedWorkouts: (workouts.data ?? []).map((w) => ({
          id: w.id,
          workoutDayId: w.workout_day_id,
          date: w.date,
          durationMinutes: w.duration_minutes,
          completedExercises: w.completed_exercises,
          totalExercises: w.total_exercises,
        })),
        bodyWeight: (weights.data ?? []).map((b) => ({ date: b.date, weightKg: Number(b.weight_kg) })),
        personalRecords: (prs.data ?? []).map((p) => ({
          exerciseId: p.exercise_id,
          weightKg: Number(p.weight_kg),
          reps: p.reps,
          date: p.date,
        })),
      };

      // Backfill: past days with ticked exercises that were never logged become
      // trained sessions. Persist any newly-created ones to Supabase.
      const reconciled = reconcileLogs(loaded);
      const loadedIds = new Set(loaded.completedWorkouts.map((w) => w.id));
      const newLogs = reconciled.filter((w) => !loadedIds.has(w.id));
      if (newLogs.length) {
        await sb
          .from('completed_workouts')
          .upsert(newLogs.map((w) => workoutRow(userId, w)), { onConflict: 'user_id,workout_day_id,date' });
      }

      if (cancelled) return;
      setState({ ...loaded, completedWorkouts: reconciled });
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Keep the <html> dark class in sync.
  useEffect(() => {
    if (!state) return;
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state?.darkMode]);

  const toggleDarkMode = useCallback(() => {
    setState((s) => (s ? { ...s, darkMode: !s.darkMode } : s));
    const next = !stateRef.current?.darkMode;
    void supabase!.from('profiles').update({ dark_mode: next }).eq('user_id', userId);
  }, [userId]);

  const completedExerciseIds = useCallback(
    (date: Date = new Date()) => stateRef.current?.completionByDate[dateKey(date)] ?? [],
    [],
  );

  const isExerciseComplete = useCallback(
    (exerciseId: string, date: Date = new Date()) =>
      (stateRef.current?.completionByDate[dateKey(date)] ?? []).includes(exerciseId),
    [],
  );

  const toggleExerciseComplete = useCallback(
    (exerciseId: string, date: Date = new Date()) => {
      const cur = stateRef.current;
      if (!cur) return;
      const key = dateKey(date);
      const currentList = cur.completionByDate[key] ?? [];
      const currentlyDone = currentList.includes(exerciseId);
      const nextList = currentlyDone
        ? currentList.filter((id) => id !== exerciseId)
        : [...currentList, exerciseId];
      const completionByDate = { ...cur.completionByDate, [key]: nextList };
      const completedWorkouts = syncDayLog(cur.completedWorkouts, completionByDate, key);

      setState((s) => (s ? { ...s, completionByDate, completedWorkouts } : s));

      // Persist the exercise tick.
      if (currentlyDone) {
        void supabase!
          .from('exercise_completions')
          .delete()
          .match({ user_id: userId, date: key, exercise_id: exerciseId });
      } else {
        void supabase!
          .from('exercise_completions')
          .insert({ user_id: userId, date: key, exercise_id: exerciseId });
      }

      // Persist the auto-derived "trained" log for that day.
      const workout = scheduledWorkoutForKey(key);
      if (workout) {
        const entry = completedWorkouts.find((w) => w.date === key && w.workoutDayId === workout.id);
        if (entry) {
          void supabase!
            .from('completed_workouts')
            .upsert(workoutRow(userId, entry), { onConflict: 'user_id,workout_day_id,date' });
        } else {
          void supabase!
            .from('completed_workouts')
            .delete()
            .match({ user_id: userId, date: key, workout_day_id: workout.id });
        }
      }
    },
    [userId],
  );

  const logWorkout = useCallback(
    (entry: Omit<CompletedWorkout, 'id'>) => {
      setState((s) => {
        if (!s) return s;
        const filtered = s.completedWorkouts.filter(
          (w) => !(w.date === entry.date && w.workoutDayId === entry.workoutDayId),
        );
        return {
          ...s,
          completedWorkouts: [...filtered, { ...entry, id: `${entry.workoutDayId}-${entry.date}` }],
        };
      });
      void supabase!.from('completed_workouts').upsert(
        {
          user_id: userId,
          workout_day_id: entry.workoutDayId,
          date: entry.date,
          duration_minutes: entry.durationMinutes,
          completed_exercises: entry.completedExercises,
          total_exercises: entry.totalExercises,
        },
        { onConflict: 'user_id,workout_day_id,date' },
      );
    },
    [userId],
  );

  const addBodyWeight = useCallback(
    (entry: BodyWeightEntry) => {
      setState((s) => {
        if (!s) return s;
        const filtered = s.bodyWeight.filter((b) => b.date !== entry.date);
        return {
          ...s,
          bodyWeight: [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date)),
        };
      });
      void supabase!
        .from('body_weight')
        .upsert({ user_id: userId, date: entry.date, weight_kg: entry.weightKg }, { onConflict: 'user_id,date' });
    },
    [userId],
  );

  const addPersonalRecord = useCallback(
    (entry: PersonalRecord) => {
      setState((s) => {
        if (!s) return s;
        const filtered = s.personalRecords.filter((p) => p.exerciseId !== entry.exerciseId);
        return { ...s, personalRecords: [...filtered, entry] };
      });
      void supabase!.from('personal_records').upsert(
        {
          user_id: userId,
          exercise_id: entry.exerciseId,
          weight_kg: entry.weightKg,
          reps: entry.reps,
          date: entry.date,
        },
        { onConflict: 'user_id,exercise_id' },
      );
    },
    [userId],
  );

  const updateProfile = useCallback(
    (profile: UserProfile) => {
      setState((s) => (s ? { ...s, profile } : s));
      void supabase!.from('profiles').update({
        name: profile.name,
        sex: profile.sex,
        height_cm: profile.heightCm,
        level: profile.level,
        goal: profile.goal,
      }).eq('user_id', userId);
    },
    [userId],
  );

  const resetProgress = useCallback(() => {
    setState((s) =>
      s ? { ...s, completionByDate: {}, completedWorkouts: [], bodyWeight: [], personalRecords: [] } : s,
    );
    const sb = supabase!;
    void sb.from('completed_workouts').delete().eq('user_id', userId);
    void sb.from('body_weight').delete().eq('user_id', userId);
    void sb.from('personal_records').delete().eq('user_id', userId);
    void sb.from('exercise_completions').delete().eq('user_id', userId);
  }, [userId]);

  const signOut = useCallback(async () => {
    await supabase!.auth.signOut();
  }, []);

  const value = useMemo<AppContextValue | null>(() => {
    if (!state) return null;
    return {
      state,
      mode: 'cloud',
      toggleDarkMode,
      toggleExerciseComplete,
      isExerciseComplete,
      completedExerciseIds,
      logWorkout,
      addBodyWeight,
      addPersonalRecord,
      updateProfile,
      resetProgress,
      signOut,
    };
  }, [
    state,
    toggleDarkMode,
    toggleExerciseComplete,
    isExerciseComplete,
    completedExerciseIds,
    logWorkout,
    addBodyWeight,
    addPersonalRecord,
    updateProfile,
    resetProgress,
    signOut,
  ]);

  if (!value) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
