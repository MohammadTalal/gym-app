import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ExerciseThumb } from '../components/ExerciseThumb';
import { useI18n } from '../i18n/LanguageContext';
import { EXERCISES } from '../data/exercises';
import type { MuscleGroup } from '../types';
import { DIFFICULTY_CHIP, MUSCLE_CHIP } from '../utils/muscleStyle';

// Muscle groups actually represented in the library, in display order.
const FILTERS: (MuscleGroup | 'All')[] = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Quads',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Core',
];

export function Library() {
  const { t, lang, muscle, equipment, difficulty, exercise: locExercise } = useI18n();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MuscleGroup | 'All'>('All');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISES.filter((e) => {
      const matchesFilter = filter === 'All' || e.muscleGroup === filter;
      // Match against both the English data and the localized text so search
      // works in either language.
      const haystack = [
        e.name,
        e.muscleGroup,
        e.equipment,
        locExercise(e).name,
        muscle(e.muscleGroup),
        equipment(e.equipment),
      ]
        .join(' ')
        .toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter, lang]);

  return (
    <div>
      <PageHeader title={t('lib.title')} subtitle={t('lib.movements', { n: EXERCISES.length })} />

      <div className="space-y-4 p-4">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('lib.search')}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pe-10 ps-10 text-sm outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label={t('lib.clear')}
              className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`chip shrink-0 transition-colors ${
                filter === f
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {f === 'All' ? t('lib.all') : muscle(f)}
            </button>
          ))}
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">{t('lib.noResults')}</p>
        ) : (
          <div className="space-y-2.5">
            {results.map((exercise) => (
              <Link
                key={exercise.id}
                to={`/library/${exercise.id}`}
                className="card flex items-center gap-3 overflow-hidden p-0 pe-3"
              >
                <ExerciseThumb exercise={exercise} className="h-20 w-20 shrink-0" showLabel={false} />
                <div className="min-w-0 flex-1 py-2">
                  <h3 className="truncate font-bold leading-tight">{locExercise(exercise).name}</h3>
                  <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{equipment(exercise.equipment)}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className={`chip ${MUSCLE_CHIP[exercise.muscleGroup]}`}>{muscle(exercise.muscleGroup)}</span>
                    <span className={`chip ${DIFFICULTY_CHIP[exercise.difficulty]}`}>{difficulty(exercise.difficulty)}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600 rtl:-scale-x-100" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
