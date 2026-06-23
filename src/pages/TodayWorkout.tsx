import { Link } from 'react-router-dom';
import { Clock, Flame, Play, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';
import { PageHeader } from '../components/PageHeader';
import { ExerciseCard } from '../components/ExerciseCard';
import { ProgressRing } from '../components/ProgressRing';
import { getWorkoutForDate, getNextWorkout } from '../data/workouts';
import { exerciseById } from '../data/exercises';

export function TodayWorkout() {
  const { isExerciseComplete, toggleExerciseComplete } = useApp();
  const { t, workoutTitle, workoutFocus, workoutWarmup, weekday, prettyDate } = useI18n();
  const today = new Date();

  // On a rest day, preview the next scheduled session instead.
  const scheduled = getWorkoutForDate(today);
  const isRestDay = !scheduled;
  const workout = scheduled ?? getNextWorkout(today).workout;

  const total = workout.exercises.length;
  const doneCount = workout.exercises.filter((e) => isExerciseComplete(e.exerciseId)).length;
  const progress = total ? doneCount / total : 0;

  return (
    <div>
      <PageHeader
        title={workoutTitle(workout)}
        subtitle={isRestDay ? t('today.upNext') : prettyDate(today)}
      />

      <div className="space-y-4 p-4">
        {isRestDay && (
          <div className="card flex items-start gap-3 border-brand-100 bg-brand-50 p-4 dark:border-brand-500/20 dark:bg-brand-500/10">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {t('today.restMessage', { day: weekday(workout.day) })}
            </p>
          </div>
        )}

        {/* Summary card */}
        <div className="card flex items-center gap-4 p-4">
          <ProgressRing progress={progress} size={96} stroke={8}>
            <span className="text-xl font-extrabold leading-none">{Math.round(progress * 100)}%</span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{t('today.complete')}</span>
          </ProgressRing>
          <div className="flex-1 space-y-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">{workoutFocus(workout)}</p>
            <div className="flex flex-wrap gap-1.5">
              <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Clock className="h-3 w-3" /> {workout.duration[0]}–{workout.duration[1]} {t('common.min')}
              </span>
              <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Flame className="h-3 w-3" /> {total} {t('common.exercises')}
              </span>
              <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <CheckCircle2 className="h-3 w-3" /> {doneCount}/{total} {t('today.complete')}
              </span>
            </div>
          </div>
        </div>

        {/* Warm-up */}
        <div className="card p-4">
          <h2 className="mb-2 flex items-center gap-1.5 font-bold">
            <Flame className="h-4 w-4 text-orange-500" /> {t('today.warmup')}
          </h2>
          <ul className="list-disc space-y-1 ps-5 text-sm text-slate-600 dark:text-slate-300">
            {workoutWarmup(workout).map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>

        {/* Exercises */}
        <div>
          <h2 className="mb-2 font-bold">{t('today.exercises')}</h2>
          <div className="space-y-3">
            {workout.exercises.map((prescription, i) => {
              const exercise = exerciseById(prescription.exerciseId);
              if (!exercise) return null;
              return (
                <ExerciseCard
                  key={prescription.exerciseId}
                  exercise={exercise}
                  prescription={prescription}
                  index={i}
                  completed={isExerciseComplete(prescription.exerciseId)}
                  onToggle={() => toggleExerciseComplete(prescription.exerciseId)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Start Workout button */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-slate-200 bg-white/90 p-3 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/90"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
      >
        <Link to={`/workout/${workout.id}`} className="btn-primary w-full py-3.5 text-base">
          <Play className="h-5 w-5 rtl:-scale-x-100" fill="currentColor" />
          {doneCount > 0 && doneCount < total ? t('today.resume') : t('today.start')}
        </Link>
      </div>
      {/* Spacer so content isn't hidden behind the sticky button + bottom nav */}
      <div className="h-20" />
    </div>
  );
}
