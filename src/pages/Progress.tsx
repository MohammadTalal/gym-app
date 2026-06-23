import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Activity, Dumbbell, Flame, Plus, Trophy, TrendingDown, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';
import { PageHeader } from '../components/PageHeader';
import { ProfileCard } from '../components/ProfileCard';
import { exerciseById } from '../data/exercises';
import { dateKey, startOfWeek } from '../utils/date';
import { TRAINING_DAYS } from '../data/workouts';

export function Progress() {
  const { state, addBodyWeight, resetProgress } = useApp();
  const { t, lang, shortDate, exercise: locExercise } = useI18n();
  const [weightInput, setWeightInput] = useState('');

  const weightData = useMemo(
    () =>
      [...state.bodyWeight]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((b) => ({ date: shortDate(b.date), kg: b.weightKg })),
    [state.bodyWeight, lang],
  );

  // Group completed workouts into the last 6 weeks (Mon-based).
  const weeklyData = useMemo(() => {
    const buckets = new Map<string, number>();
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i * 7);
      const key = dateKey(startOfWeek(d));
      buckets.set(key, 0);
    }
    for (const w of state.completedWorkouts) {
      const key = dateKey(startOfWeek(new Date(w.date)));
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    return [...buckets.entries()].map(([key, count]) => ({
      week: shortDate(key),
      workouts: count,
    }));
  }, [state.completedWorkouts, lang]);

  const stats = useMemo(() => {
    const total = state.completedWorkouts.length;
    const totalMinutes = state.completedWorkouts.reduce((s, w) => s + w.durationMinutes, 0);
    const first = state.bodyWeight[0]?.weightKg;
    const last = state.bodyWeight.at(-1)?.weightKg;
    const weightDelta = first != null && last != null ? last - first : 0;
    const streak = computeStreak(state.completedWorkouts.map((w) => w.date));
    return { total, totalMinutes, weightDelta, streak };
  }, [state.completedWorkouts, state.bodyWeight]);

  function submitWeight(e: React.FormEvent) {
    e.preventDefault();
    const kg = parseFloat(weightInput);
    if (!Number.isFinite(kg) || kg <= 0) return;
    addBodyWeight({ date: dateKey(new Date()), weightKg: Math.round(kg * 10) / 10 });
    setWeightInput('');
  }

  return (
    <div>
      <PageHeader title={t('prog.title')} subtitle={t('prog.subtitle')} />

      <div className="space-y-4 p-4">
        {/* Profile */}
        <ProfileCard />

        {/* Stat grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<Dumbbell className="h-5 w-5 text-brand-500" />} value={stats.total} label={t('prog.workoutsDone')} />
          <StatCard icon={<Flame className="h-5 w-5 text-orange-500" />} value={`${stats.streak}`} label={t('prog.weekStreak')} />
          <StatCard icon={<Activity className="h-5 w-5 text-emerald-500" />} value={`${stats.totalMinutes}`} label={t('prog.totalMinutes')} />
          <StatCard
            icon={<TrendingDown className="h-5 w-5 text-sky-500" />}
            value={`${stats.weightDelta > 0 ? '+' : ''}${stats.weightDelta.toFixed(1)}`}
            label={t('prog.weightChange')}
          />
        </div>

        {/* Workouts per week */}
        <div className="card p-4">
          <h2 className="mb-3 font-bold">{t('prog.workoutsPerWeek')}</h2>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" vertical={false} />
                <XAxis dataKey="week" reversed={lang === 'ar'} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(51,163,255,0.08)' }}
                  contentStyle={tooltipStyle}
                  labelStyle={{ fontWeight: 700 }}
                />
                <Bar dataKey="workouts" radius={[6, 6, 0, 0]} fill="#33a3ff" maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-1 text-center text-xs text-slate-400">{t('prog.goalPerWeek', { n: TRAINING_DAYS.length })}</p>
        </div>

        {/* Body weight */}
        <div className="card p-4">
          <h2 className="mb-3 font-bold">{t('prog.bodyWeight')}</h2>
          {weightData.length > 1 ? (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" vertical={false} />
                  <XAxis dataKey="date" reversed={lang === 'ar'} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={{ fontWeight: 700 }} formatter={(v) => [`${v} ${t('common.kg')}`, t('prog.weightLabel')]} />
                  <Line
                    type="monotone"
                    dataKey="kg"
                    stroke="#1c84f5"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#1c84f5' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-slate-400">{t('prog.logWeightHint')}</p>
          )}

          <form onSubmit={submitWeight} className="mt-3 flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder={t('prog.todaysWeight')}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800"
            />
            <button type="submit" className="btn-primary px-4 py-2.5">
              <Plus className="h-4 w-4" /> {t('prog.log')}
            </button>
          </form>
        </div>

        {/* Personal records */}
        <div className="card p-4">
          <h2 className="mb-3 flex items-center gap-1.5 font-bold">
            <Trophy className="h-4 w-4 text-amber-500" /> {t('prog.personalRecords')}
          </h2>
          {state.personalRecords.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-400">{t('prog.noRecords')}</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[...state.personalRecords]
                .sort((a, b) => b.weightKg - a.weightKg)
                .map((pr) => {
                  const ex = exerciseById(pr.exerciseId);
                  return (
                    <div key={pr.exerciseId} className="flex items-center justify-between py-2.5">
                      <div>
                        <p className="font-semibold leading-tight">{ex ? locExercise(ex).name : pr.exerciseId}</p>
                        <p className="text-xs text-slate-400">{shortDate(pr.date)}</p>
                      </div>
                      <p className="text-end font-bold">
                        {pr.weightKg} {t('common.kg')}
                        <span className="block text-xs font-normal text-slate-400">× {pr.reps} {t('common.reps')}</span>
                      </p>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            if (confirm(t('prog.resetConfirm'))) resetProgress();
          }}
          className="btn-ghost mx-auto flex py-2.5 text-sm text-slate-500"
        >
          <RotateCcw className="h-4 w-4" /> {t('prog.resetAll')}
        </button>
      </div>
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  borderRadius: 12,
  border: 'none',
  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  fontSize: 12,
};

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="card flex items-center gap-3 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">{icon}</div>
      <div>
        <p className="text-xl font-extrabold leading-none">{value}</p>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      </div>
    </div>
  );
}

/** Counts consecutive weeks (ending this week or last) that have ≥1 workout. */
function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const weeks = new Set(dates.map((d) => dateKey(startOfWeek(new Date(d)))));
  let streak = 0;
  const cursor = startOfWeek(new Date());
  // Allow the streak to be "alive" even if this week has no workout yet.
  if (!weeks.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 7);
  while (weeks.has(dateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 7);
  }
  return streak;
}
