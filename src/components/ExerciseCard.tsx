import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, Clock, Info, AlertTriangle, ListChecks } from 'lucide-react';
import type { Exercise, WorkoutExercise } from '../types';
import { ExerciseThumb } from './ExerciseThumb';
import { MUSCLE_CHIP } from '../utils/muscleStyle';
import { formatRest } from '../utils/date';
import { useI18n } from '../i18n/LanguageContext';

interface ExerciseCardProps {
  exercise: Exercise;
  prescription: WorkoutExercise;
  completed: boolean;
  index: number;
  onToggle: () => void;
}

export function ExerciseCard({ exercise: rawExercise, prescription, completed, index, onToggle }: ExerciseCardProps) {
  const [open, setOpen] = useState(false);
  const i18n = useI18n();
  const { t, muscle, reps } = i18n;
  const exercise = i18n.exercise(rawExercise);

  return (
    <div className={`card overflow-hidden transition-opacity ${completed ? 'opacity-70' : ''}`}>
      <div className="flex items-stretch">
        <ExerciseThumb exercise={exercise} className="w-24 shrink-0" showLabel={false} />

        <div className="flex flex-1 flex-col gap-1 p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                {t('card.exercise', { n: index + 1 })}
              </p>
              <h3 className={`font-bold leading-tight ${completed ? 'line-through' : ''}`}>
                {exercise.name}
              </h3>
            </div>

            {/* Completion checkbox — large touch target */}
            <button
              onClick={onToggle}
              aria-label={completed ? t('card.markNotDone') : t('card.markDone')}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-active active:scale-90 ${
                completed
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-slate-300 text-transparent dark:border-slate-600'
              }`}
            >
              <Check className="h-5 w-5" strokeWidth={3} />
            </button>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className={`chip ${MUSCLE_CHIP[exercise.muscleGroup]}`}>{muscle(exercise.muscleGroup)}</span>
            <span className="chip bg-slate-100 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {prescription.sets} × {reps(prescription.reps)}
            </span>
            <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Clock className="h-3 w-3" /> {formatRest(prescription.restSeconds)} {t('common.rest')}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-center gap-1 border-t border-slate-100 py-2 text-sm font-semibold text-brand-600 dark:border-slate-800 dark:text-brand-400"
      >
        {open ? t('card.hideDetails') : t('card.howTo')}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="animate-slide-up space-y-4 border-t border-slate-100 p-4 text-sm dark:border-slate-800">
          <p className="flex gap-2 text-slate-600 dark:text-slate-300">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
            {exercise.description}
          </p>

          <div>
            <p className="mb-1 flex items-center gap-1.5 font-bold">
              <ListChecks className="h-4 w-4 text-brand-500" /> {t('card.steps')}
            </p>
            <ol className="list-decimal space-y-1 ps-6 text-slate-600 dark:text-slate-300">
              {exercise.instructions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <p className="mb-1 flex items-center gap-1.5 font-bold">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> {t('card.avoid')}
            </p>
            <ul className="list-disc space-y-1 ps-6 text-slate-600 dark:text-slate-300">
              {exercise.mistakes.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>

          <Link to={`/library/${exercise.id}`} className="btn-ghost w-full py-2.5 text-sm">
            {t('card.viewFull')}
          </Link>
        </div>
      )}
    </div>
  );
}
