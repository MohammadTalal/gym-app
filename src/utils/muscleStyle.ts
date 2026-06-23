import type { Difficulty, MuscleGroup } from '../types';

/** Tailwind gradient classes per muscle group (used for placeholder art & chips). */
export const MUSCLE_GRADIENT: Record<MuscleGroup, string> = {
  Chest: 'from-rose-500 to-orange-400',
  Back: 'from-sky-500 to-cyan-400',
  Shoulders: 'from-amber-500 to-yellow-400',
  Arms: 'from-violet-500 to-fuchsia-400',
  Quads: 'from-emerald-500 to-teal-400',
  Hamstrings: 'from-lime-500 to-green-400',
  Glutes: 'from-pink-500 to-rose-400',
  Calves: 'from-indigo-500 to-blue-400',
  Core: 'from-orange-500 to-red-400',
  Legs: 'from-teal-500 to-emerald-400',
  'Full Body': 'from-slate-500 to-slate-400',
};

export const MUSCLE_CHIP: Record<MuscleGroup, string> = {
  Chest: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  Back: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  Shoulders: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  Arms: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  Quads: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  Hamstrings: 'bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300',
  Glutes: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300',
  Calves: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  Core: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  Legs: 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
  'Full Body': 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
};

export const DIFFICULTY_CHIP: Record<Difficulty, string> = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
  Intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  Advanced: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
};
