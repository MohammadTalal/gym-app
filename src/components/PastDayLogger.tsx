import { useState } from 'react';
import { CalendarPlus, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';
import { getWorkoutForDate } from '../data/workouts';
import { dateKey, parseDateKey } from '../utils/date';

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}

/** Lets you mark a past (or today's) scheduled day as trained without SQL. */
export function PastDayLogger() {
  const { state, setDayCompletion } = useApp();
  const { t, workoutTitle } = useI18n();
  const [day, setDay] = useState(yesterdayKey());

  const workout = getWorkoutForDate(parseDateKey(day));
  const isDone = state.completedWorkouts.some((w) => w.date === day);
  const todayKey = dateKey(new Date());

  return (
    <div className="card p-4">
      <h2 className="mb-3 flex items-center gap-1.5 font-bold">
        <CalendarPlus className="h-4 w-4 text-brand-500" /> {t('past.title')}
      </h2>

      <input
        type="date"
        value={day}
        max={todayKey}
        onChange={(e) => setDay(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800"
      />

      {!workout ? (
        <p className="mt-3 text-center text-sm text-slate-400">{t('past.restDay')}</p>
      ) : (
        <div className="mt-3">
          <p className="mb-2 text-sm font-semibold">{workoutTitle(workout)}</p>
          <button
            onClick={() =>
              setDayCompletion(
                workout.exercises.map((e) => e.exerciseId),
                !isDone,
                parseDateKey(day),
              )
            }
            className={
              isDone
                ? 'btn w-full bg-green-100 py-2.5 text-sm font-bold text-green-700 dark:bg-green-500/15 dark:text-green-300'
                : 'btn-primary w-full py-2.5'
            }
          >
            <CheckCircle2 className="h-4 w-4" />
            {isDone ? t('today.doneUndo') : t('today.markDone')}
          </button>
        </div>
      )}
    </div>
  );
}
