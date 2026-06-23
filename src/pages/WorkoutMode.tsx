import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Clock,
  Plus,
  Minus,
  SkipForward,
  PartyPopper,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';
import { ExerciseThumb } from '../components/ExerciseThumb';
import { ProgressRing } from '../components/ProgressRing';
import { workoutById } from '../data/workouts';
import { exerciseById } from '../data/exercises';
import { MUSCLE_CHIP } from '../utils/muscleStyle';
import { dateKey, formatRest } from '../utils/date';

export function WorkoutMode() {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();
  const { toggleExerciseComplete, isExerciseComplete, logWorkout } = useApp();
  const i18n = useI18n();
  const { t, muscle, reps: locReps } = i18n;

  const workout = workoutId ? workoutById(workoutId) : undefined;

  // Per-exercise count of completed sets.
  const [setsDone, setSetsDone] = useState<number[]>(() =>
    workout ? workout.exercises.map(() => 0) : [],
  );
  const [current, setCurrent] = useState(0);
  const [restLeft, setRestLeft] = useState(0); // seconds remaining on the rest timer
  const [restTotal, setRestTotal] = useState(0);
  const [finished, setFinished] = useState(false);
  const startedAt = useRef<number>(Date.now());

  // Rest-timer countdown.
  useEffect(() => {
    if (restLeft <= 0) return;
    const t = setInterval(() => setRestLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [restLeft > 0]);

  if (!workout) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-lg font-bold">{t('mode.notFound')}</p>
        <Link to="/today" className="btn-primary px-5 py-2.5">
          {t('mode.backToToday')}
        </Link>
      </div>
    );
  }

  const prescription = workout.exercises[current];
  const exercise = i18n.exercise(exerciseById(prescription.exerciseId)!);
  const doneSets = setsDone[current];
  const allSetsDone = doneSets >= prescription.sets;

  const totalSets = workout.exercises.reduce((sum, e) => sum + e.sets, 0);
  const completedSets = setsDone.reduce((sum, n) => sum + n, 0);
  const overallProgress = totalSets ? completedSets / totalSets : 0;

  function completeSet() {
    setSetsDone((prev) => {
      const next = [...prev];
      if (next[current] < prescription.sets) next[current] += 1;
      return next;
    });
    const willBeDone = doneSets + 1 >= prescription.sets;
    if (willBeDone) {
      // Mark the whole exercise complete in shared state.
      if (!isExerciseComplete(prescription.exerciseId)) {
        toggleExerciseComplete(prescription.exerciseId);
      }
    } else {
      // Start the rest timer between sets.
      setRestTotal(prescription.restSeconds);
      setRestLeft(prescription.restSeconds);
    }
  }

  function adjustSets(delta: number) {
    setSetsDone((prev) => {
      const next = [...prev];
      next[current] = Math.max(0, Math.min(prescription.sets, next[current] + delta));
      return next;
    });
  }

  function goTo(index: number) {
    setRestLeft(0);
    setCurrent(Math.max(0, Math.min(workout!.exercises.length - 1, index)));
  }

  function next() {
    if (current < workout!.exercises.length - 1) goTo(current + 1);
    else finishWorkout();
  }

  function finishWorkout() {
    const minutes = Math.max(1, Math.round((Date.now() - startedAt.current) / 60000));
    const completedExercises = workout!.exercises.filter((e) =>
      isExerciseComplete(e.exerciseId),
    ).length;
    logWorkout({
      workoutDayId: workout!.id,
      date: dateKey(new Date()),
      durationMinutes: minutes,
      completedExercises,
      totalExercises: workout!.exercises.length,
    });
    setFinished(true);
  }

  if (finished) {
    const completedExercises = workout.exercises.filter((e) => isExerciseComplete(e.exerciseId)).length;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gradient-to-b from-brand-500 to-brand-700 p-8 text-center text-white">
        <PartyPopper className="h-16 w-16" />
        <h1 className="text-3xl font-extrabold">{t('mode.completeTitle')}</h1>
        <p className="text-brand-50">
          {t('mode.completeMsg', {
            done: completedExercises,
            total: workout.exercises.length,
            sets: completedSets,
          })}
        </p>
        <div className="mt-2 flex w-full max-w-xs flex-col gap-3">
          <button onClick={() => navigate('/progress')} className="btn w-full bg-white py-3 text-base text-brand-700">
            {t('mode.viewProgress')}
          </button>
          <button onClick={() => navigate('/')} className="btn w-full bg-brand-400/40 py-3 text-base text-white">
            {t('mode.backHome')}
          </button>
        </div>
      </div>
    );
  }

  const isResting = restLeft > 0;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Top bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-slate-50/90 px-4 py-3 backdrop-blur-lg dark:bg-slate-950/90">
        <button
          onClick={() => navigate('/today')}
          aria-label={t('mode.exit')}
          className="btn-ghost h-10 w-10 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: `${overallProgress * 100}%` }}
            />
          </div>
        </div>
        <span className="w-12 text-end text-sm font-bold tabular-nums">
          {current + 1}/{workout.exercises.length}
        </span>
      </header>

      {/* Main exercise area */}
      <div className="flex flex-1 flex-col px-4 pb-4">
        <ExerciseThumb exercise={exercise} className="h-44 w-full rounded-2xl" />

        <div className="mt-4">
          <span className={`chip ${MUSCLE_CHIP[exercise.muscleGroup]}`}>{muscle(exercise.muscleGroup)}</span>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight">{exercise.name}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t('mode.target', {
              sets: prescription.sets,
              reps: locReps(prescription.reps),
              rest: formatRest(prescription.restSeconds),
            })}
          </p>
        </div>

        {/* Set tracker dots */}
        <div className="mt-5 flex items-center justify-center gap-2.5">
          {Array.from({ length: prescription.sets }).map((_, i) => (
            <div
              key={i}
              className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-bold transition-active ${
                i < doneSets
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-slate-300 text-slate-400 dark:border-slate-600'
              }`}
            >
              {i < doneSets ? <Check className="h-5 w-5" strokeWidth={3} /> : i + 1}
            </div>
          ))}
        </div>
        <button
          onClick={() => adjustSets(-1)}
          disabled={doneSets === 0}
          className="mx-auto mt-2 flex items-center gap-1 text-xs font-semibold text-slate-400 disabled:opacity-0"
        >
          <Minus className="h-3 w-3" /> {t('mode.undoSet')}
        </button>

        {/* Rest timer OR action button */}
        <div className="mt-auto pt-6">
          {isResting ? (
            <div className="card flex flex-col items-center gap-3 p-5">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4" /> {t('mode.rest')}
              </p>
              <ProgressRing progress={restTotal ? (restTotal - restLeft) / restTotal : 0} size={132} stroke={11}>
                <span className="text-3xl font-extrabold tabular-nums">{formatRest(restLeft)}</span>
              </ProgressRing>
              <div className="flex w-full gap-3">
                <button onClick={() => setRestLeft((s) => s + 15)} className="btn-ghost flex-1 py-2.5">
                  <Plus className="h-4 w-4" /> {t('mode.add15')}
                </button>
                <button onClick={() => setRestLeft(0)} className="btn-primary flex-1 py-2.5">
                  <SkipForward className="h-4 w-4 rtl:-scale-x-100" /> {t('mode.skipRest')}
                </button>
              </div>
            </div>
          ) : allSetsDone ? (
            <button onClick={next} className="btn-primary w-full py-4 text-lg">
              {current < workout.exercises.length - 1 ? (
                <>
                  {t('mode.nextExercise')} <ChevronRight className="h-6 w-6 rtl:-scale-x-100" />
                </>
              ) : (
                <>
                  {t('mode.finishWorkout')} <Check className="h-6 w-6" strokeWidth={3} />
                </>
              )}
            </button>
          ) : (
            <button onClick={completeSet} className="btn-primary w-full py-4 text-lg">
              <Check className="h-6 w-6" strokeWidth={3} /> {t('mode.completeSet', { n: doneSets + 1 })}
            </button>
          )}
        </div>

        {/* Prev / Next nav */}
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className="btn-ghost flex-1 py-3 disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5 rtl:-scale-x-100" /> {t('mode.previous')}
          </button>
          <button onClick={next} className="btn-ghost flex-1 py-3">
            {current < workout.exercises.length - 1 ? t('mode.skip') : t('mode.finish')}{' '}
            <ChevronRight className="h-5 w-5 rtl:-scale-x-100" />
          </button>
        </div>

        {/* Quick reference: steps & mistakes */}
        <details className="card mt-3 p-4">
          <summary className="cursor-pointer font-bold">{t('mode.howTo')}</summary>
          <ol className="mt-2 list-decimal space-y-1 ps-5 text-sm text-slate-600 dark:text-slate-300">
            {exercise.instructions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </details>
      </div>
    </div>
  );
}
