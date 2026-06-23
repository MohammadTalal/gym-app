import { Dumbbell } from 'lucide-react';
import type { Exercise } from '../types';
import { MUSCLE_GRADIENT } from '../utils/muscleStyle';
import { useI18n } from '../i18n/LanguageContext';

/**
 * Self-contained gradient "image" placeholder for an exercise.
 * Works fully offline (no broken remote images) and is colour-coded by
 * muscle group. Swap for real photos/GIFs later if you like.
 */
export function ExerciseThumb({
  exercise,
  className = '',
  showLabel = true,
}: {
  exercise: Exercise;
  className?: string;
  showLabel?: boolean;
}) {
  const { muscle } = useI18n();
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${MUSCLE_GRADIENT[exercise.muscleGroup]} ${className}`}
    >
      <Dumbbell className="absolute -right-3 -bottom-3 h-20 w-20 text-white/20" strokeWidth={1.5} />
      <div className="flex flex-col items-center gap-1 px-2 text-center text-white">
        <Dumbbell className="h-7 w-7 drop-shadow" />
        {showLabel && (
          <span className="text-[11px] font-bold uppercase tracking-wide drop-shadow">
            {muscle(exercise.muscleGroup)}
          </span>
        )}
      </div>
    </div>
  );
}
