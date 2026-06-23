import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Youtube,
  Info,
  ListChecks,
  AlertTriangle,
  Dumbbell,
  Trophy,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';
import { ExerciseThumb } from '../components/ExerciseThumb';
import { exerciseById } from '../data/exercises';
import { DIFFICULTY_CHIP, MUSCLE_CHIP } from '../utils/muscleStyle';
import { dateKey } from '../utils/date';

export function ExerciseDetail() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const { state, addPersonalRecord } = useApp();
  const i18n = useI18n();
  const { t, muscle, equipment, difficulty, shortDate } = i18n;
  const raw = exerciseId ? exerciseById(exerciseId) : undefined;

  const [showVideo, setShowVideo] = useState(false);
  const [prWeight, setPrWeight] = useState('');
  const [prReps, setPrReps] = useState('');

  if (!raw) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-lg font-bold">{t('detail.notFound')}</p>
        <Link to="/library" className="btn-primary px-5 py-2.5">
          {t('detail.backToLibrary')}
        </Link>
      </div>
    );
  }

  const exercise = i18n.exercise(raw);
  const pr = state.personalRecords.find((p) => p.exerciseId === raw.id);
  // Query YouTube with the canonical English name for better search results.
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${raw.name} proper form tutorial`,
  )}`;

  function savePr(e: React.FormEvent) {
    e.preventDefault();
    const weightKg = parseFloat(prWeight);
    const reps = parseInt(prReps, 10);
    if (!Number.isFinite(weightKg) || weightKg <= 0 || !Number.isFinite(reps) || reps <= 0) return;
    addPersonalRecord({ exerciseId: raw!.id, weightKg, reps, date: dateKey(new Date()) });
    setPrWeight('');
    setPrReps('');
  }

  return (
    <div>
      {/* Hero with back button */}
      <div className="relative">
        <ExerciseThumb exercise={exercise} className="h-52 w-full" showLabel={false} />
        <button
          onClick={() => navigate(-1)}
          aria-label={t('detail.back')}
          className="absolute start-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md"
        >
          <ArrowLeft className="h-5 w-5 rtl:-scale-x-100" />
        </button>
      </div>

      <div className="space-y-5 p-4">
        <div>
          <h1 className="text-2xl font-extrabold leading-tight">{exercise.name}</h1>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className={`chip ${MUSCLE_CHIP[exercise.muscleGroup]}`}>{muscle(exercise.muscleGroup)}</span>
            <span className={`chip ${DIFFICULTY_CHIP[exercise.difficulty]}`}>{difficulty(exercise.difficulty)}</span>
            <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Dumbbell className="h-3 w-3" /> {equipment(exercise.equipment)}
            </span>
            {exercise.secondaryMuscles?.map((m) => (
              <span key={m} className="chip bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                + {muscle(m)}
              </span>
            ))}
          </div>
        </div>

        {/* Video */}
        <div className="card overflow-hidden">
          {showVideo && exercise.videoId ? (
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${exercise.videoId}?rel=0`}
                title={`${exercise.name} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <button
              onClick={() => exercise.videoId && setShowVideo(true)}
              className="flex w-full items-center gap-3 p-4 text-start"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/15">
                <Youtube className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold leading-tight">{t('detail.watchTechnique')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {exercise.videoId ? t('detail.tapToPlay') : t('detail.searchTutorial')}
                </p>
              </div>
            </button>
          )}
          <a
            href={searchUrl}
            target="_blank"
            rel="noreferrer"
            className="block border-t border-slate-100 py-2.5 text-center text-sm font-semibold text-brand-600 dark:border-slate-800 dark:text-brand-400"
          >
            {t('detail.searchOnYoutube', { name: exercise.name })}
          </a>
        </div>

        {/* Description */}
        <p className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
          {exercise.description}
        </p>

        {/* Steps */}
        <div className="card p-4">
          <h2 className="mb-2 flex items-center gap-1.5 font-bold">
            <ListChecks className="h-4 w-4 text-brand-500" /> {t('detail.stepByStep')}
          </h2>
          <ol className="list-decimal space-y-1.5 ps-5 text-sm text-slate-600 dark:text-slate-300">
            {exercise.instructions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>

        {/* Mistakes */}
        <div className="card p-4">
          <h2 className="mb-2 flex items-center gap-1.5 font-bold">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> {t('detail.commonMistakes')}
          </h2>
          <ul className="list-disc space-y-1.5 ps-5 text-sm text-slate-600 dark:text-slate-300">
            {exercise.mistakes.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>

        {/* Personal record */}
        <div className="card p-4">
          <h2 className="mb-2 flex items-center gap-1.5 font-bold">
            <Trophy className="h-4 w-4 text-amber-500" /> {t('detail.personalRecord')}
          </h2>
          {pr ? (
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
              {t('detail.currentBest', { weight: pr.weightKg, reps: pr.reps, date: shortDate(pr.date) })}
            </p>
          ) : (
            <p className="mb-3 text-sm text-slate-400">{t('detail.noRecordYet')}</p>
          )}
          <form onSubmit={savePr} className="flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              step="0.5"
              value={prWeight}
              onChange={(e) => setPrWeight(e.target.value)}
              placeholder={t('common.kg')}
              className="w-20 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              type="number"
              inputMode="numeric"
              value={prReps}
              onChange={(e) => setPrReps(e.target.value)}
              placeholder={t('common.reps')}
              className="w-20 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800"
            />
            <button type="submit" className="btn-primary flex-1 py-2.5">
              <Plus className="h-4 w-4" /> {t('detail.saveRecord')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
