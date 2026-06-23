import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Difficulty, Exercise, MuscleGroup, WeekDay, WorkoutDay } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DAY_LABELS, DAY_NAMES, MONTHS, STRINGS } from './ui';
import type { Lang } from './ui';
import {
  AR_DIFFICULTY,
  AR_EQUIPMENT,
  AR_EXERCISES,
  AR_MUSCLE,
  AR_WEEKDAY,
  AR_WORKOUTS,
} from './content';

type Params = Record<string, string | number>;

interface I18nValue {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  /** Translate a UI string key, filling `{token}` placeholders from params. */
  t: (key: string, params?: Params) => string;

  // Content localizers (fall back to the English data when no translation).
  exercise: (e: Exercise) => Exercise;
  muscle: (g: MuscleGroup) => string;
  equipment: (e: string) => string;
  difficulty: (d: Difficulty) => string;
  workoutTitle: (w: WorkoutDay) => string;
  workoutFocus: (w: WorkoutDay) => string;
  workoutWarmup: (w: WorkoutDay) => string[];
  weekday: (d: WeekDay) => string;
  reps: (r: string) => string;

  // Localized date formatting.
  shortDate: (input: string | Date) => string;
  prettyDate: (date: Date) => string;
  dayLabel: (date: Date) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = 'gymcoach-lang-v1';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useLocalStorage<Lang>(STORAGE_KEY, 'en');
  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr';

  // Keep <html> lang/dir in sync so RTL mirroring + fonts apply globally.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
  }, [lang, dir]);

  const toggleLang = useCallback(
    () => setLang((l) => (l === 'en' ? 'ar' : 'en')),
    [setLang],
  );

  const t = useCallback(
    (key: string, params?: Params) => {
      const entry = STRINGS[key];
      let str = entry ? entry[lang] : key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }
      }
      return str;
    },
    [lang],
  );

  const value = useMemo<I18nValue>(() => {
    const isAr = lang === 'ar';

    const exercise = (e: Exercise): Exercise => {
      if (!isAr) return e;
      const tr = AR_EXERCISES[e.id];
      if (!tr) return e;
      // Keep id / muscleGroup / equipment keys intact for styling & lookups;
      // only the displayed text fields are swapped.
      return { ...e, name: tr.name, description: tr.description, instructions: tr.instructions, mistakes: tr.mistakes };
    };

    const muscle = (g: MuscleGroup) => (isAr ? AR_MUSCLE[g] ?? g : g);
    const equipment = (e: string) => (isAr ? AR_EQUIPMENT[e] ?? e : e);
    const difficulty = (d: Difficulty) => (isAr ? AR_DIFFICULTY[d] ?? d : d);
    const workoutTitle = (w: WorkoutDay) => (isAr ? AR_WORKOUTS[w.id]?.title ?? w.title : w.title);
    const workoutFocus = (w: WorkoutDay) => (isAr ? AR_WORKOUTS[w.id]?.focus ?? w.focus : w.focus);
    const workoutWarmup = (w: WorkoutDay) => (isAr ? AR_WORKOUTS[w.id]?.warmup ?? w.warmup : w.warmup);
    const weekday = (d: WeekDay) => (isAr ? AR_WEEKDAY[d] ?? d : d);

    // Localize the free-text tokens that appear inside rep targets.
    const reps = (r: string) => {
      if (!isAr) return r;
      return r
        .replace(/\bsec\b/gi, 'ثانية')
        .replace(/\/\s*leg\b/gi, '/ للساق')
        .replace(/\bleg\b/gi, 'ساق');
    };

    const shortDate = (input: string | Date) => {
      const d = typeof input === 'string' ? new Date(input) : input;
      const m = MONTHS[lang][d.getMonth()];
      return isAr ? `${d.getDate()} ${m}` : `${m} ${d.getDate()}`;
    };

    const prettyDate = (date: Date) => {
      const day = DAY_NAMES[lang][date.getDay()];
      const m = MONTHS[lang][date.getMonth()];
      return isAr ? `${day}، ${date.getDate()} ${m}` : `${day.slice(0, 3)}, ${m} ${date.getDate()}`;
    };

    const dayLabel = (date: Date) => DAY_LABELS[lang][date.getDay()];

    return {
      lang,
      dir,
      setLang,
      toggleLang,
      t,
      exercise,
      muscle,
      equipment,
      difficulty,
      workoutTitle,
      workoutFocus,
      workoutWarmup,
      weekday,
      reps,
      shortDate,
      prettyDate,
      dayLabel,
    };
  }, [lang, dir, setLang, toggleLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within <LanguageProvider>');
  return ctx;
}
