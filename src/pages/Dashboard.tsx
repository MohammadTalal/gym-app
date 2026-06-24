import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Dumbbell, Flame, Sparkles, TrendingUp, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { PageHeader } from '../components/PageHeader';
import { ProgressRing } from '../components/ProgressRing';
import { getWorkoutForDate, getNextWorkout, workoutById, TRAINING_DAYS } from '../data/workouts';
import { ACHIEVEMENTS } from '../data/achievements';
import { dateKey, weekDates } from '../utils/date';

function greetingKey(d: Date): string {
  const h = d.getHours();
  if (h < 12) return 'greeting.morning';
  if (h < 18) return 'greeting.afternoon';
  return 'greeting.evening';
}

export function Dashboard() {
  const { state } = useApp();
  const { t, workoutTitle, workoutFocus, prettyDate, dayLabel, dailyTip } = useI18n();
  const { unit, fmt } = useUnits();
  const today = new Date();
  const earnedCount = ACHIEVEMENTS.filter((a) => a.earned(state)).length;
  const todaysWorkout = getWorkoutForDate(today);
  const next = getNextWorkout(today);

  // How many of this week's scheduled sessions are already logged.
  const week = weekDates(today);
  const weekKeys = new Set(week.map(dateKey));
  const doneThisWeek = state.completedWorkouts.filter((w) => weekKeys.has(w.date)).length;
  const weeklyTarget = TRAINING_DAYS.length;
  const weekProgress = weeklyTarget ? doneThisWeek / weeklyTarget : 0;
  const left = weeklyTarget - doneThisWeek;

  const totalWorkouts = state.completedWorkouts.length;
  const latestWeight = state.bodyWeight.at(-1)?.weightKg;

  const nextWhen =
    next.daysAway === 0
      ? t('common.today')
      : next.daysAway === 1
        ? t('common.tomorrow')
        : t('common.inDays', { n: next.daysAway });

  return (
    <div>
      <PageHeader title={state.profile.name} subtitle={t(greetingKey(today))} />

      <div className="animate-fade-in space-y-4 p-4">
        {/* Daily motivation */}
        <p className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          <Sparkles className="h-4 w-4 shrink-0 text-brand-500" />
          {dailyTip}
        </p>

        {/* Today's focus */}
        <Link to="/today" className="card block overflow-hidden">
          <div className="flex items-stretch">
            <div className="flex flex-1 flex-col justify-center gap-1 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                {todaysWorkout ? t('dash.todaysWorkout') : t('dash.restDay')}
              </p>
              {todaysWorkout ? (
                <>
                  <h2 className="text-xl font-extrabold leading-tight">{workoutTitle(todaysWorkout)}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{workoutFocus(todaysWorkout)}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400">
                    {t('dash.startNow')} <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                  </span>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-extrabold leading-tight">{t('dash.recoverGrow')}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t('dash.nextUp', { title: workoutTitle(next.workout), when: nextWhen })}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400">
                    {t('dash.previewWorkout')} <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                  </span>
                </>
              )}
            </div>
            <div className="flex w-28 shrink-0 items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <Dumbbell className="h-12 w-12 animate-float drop-shadow" strokeWidth={1.5} />
            </div>
          </div>
        </Link>

        {/* Weekly progress ring */}
        <div className="card flex items-center gap-4 p-4">
          <ProgressRing progress={weekProgress} size={104} stroke={9}>
            <span className="text-2xl font-extrabold leading-none">
              {doneThisWeek}
              <span className="text-base text-slate-400">/{weeklyTarget}</span>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{t('dash.workouts')}</span>
          </ProgressRing>
          <div className="flex-1">
            <p className="flex items-center gap-1.5 font-bold">
              <Calendar className="h-4 w-4 text-brand-500" /> {t('dash.thisWeek')}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {left <= 0
                ? t('dash.weekDone')
                : left === 1
                  ? t('dash.sessionsLeftOne')
                  : t('dash.sessionsLeftMany', { n: left })}
            </p>
            <div className="mt-3 flex gap-1.5">
              {week.map((d) => {
                const isTraining = !!getWorkoutForDate(d);
                const done = state.completedWorkouts.some((w) => w.date === dateKey(d));
                const isToday = dateKey(d) === dateKey(today);
                return (
                  <div
                    key={dateKey(d)}
                    title={prettyDate(d)}
                    className={`flex h-7 flex-1 items-center justify-center rounded-md text-[10px] font-bold ${
                      done
                        ? 'bg-brand-500 text-white'
                        : isTraining
                          ? 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                          : 'bg-transparent text-slate-300 dark:text-slate-700'
                    } ${isToday ? 'ring-2 ring-brand-400' : ''}`}
                  >
                    {dayLabel(d)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={<Flame className="h-5 w-5 text-orange-500" />} value={totalWorkouts} label={t('dash.totalWorkouts')} />
          <StatCard icon={<Trophy className="h-5 w-5 text-amber-500" />} value={state.personalRecords.length} label={t('dash.prsSet')} />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
            value={latestWeight != null ? fmt(latestWeight) : '—'}
            label={`${t('dash.weightKg')} (${t(unit === 'kg' ? 'common.kg' : 'common.lb')})`}
          />
        </div>

        {/* Achievements */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-bold">{t('dash.achievements')}</h2>
            <span className="text-xs font-semibold text-slate-400">
              {t('ach.unlocked', { n: earnedCount, total: ACHIEVEMENTS.length })}
            </span>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
            {ACHIEVEMENTS.map((a) => {
              const earned = a.earned(state);
              return (
                <div
                  key={a.id}
                  title={t(`ach.${a.id}.desc`)}
                  className={`flex w-24 shrink-0 flex-col items-center gap-1 rounded-2xl border p-3 text-center transition-active ${
                    earned
                      ? 'border-brand-200 bg-brand-50 dark:border-brand-500/30 dark:bg-brand-500/10'
                      : 'border-slate-100 bg-slate-50 opacity-60 grayscale dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <span className={`text-3xl ${earned ? 'animate-pop' : ''}`}>{a.emoji}</span>
                  <span className="text-[11px] font-bold leading-tight">{t(`ach.${a.id}.name`)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent activity */}
        {state.completedWorkouts.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-bold">{t('dash.recentSessions')}</h2>
              <Link to="/progress" className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                {t('common.seeAll')}
              </Link>
            </div>
            <div className="space-y-2">
              {[...state.completedWorkouts]
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 3)
                .map((w) => {
                  const day = workoutById(w.workoutDayId);
                  return (
                    <div key={w.id} className="card flex items-center gap-3 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                        <Dumbbell className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold leading-tight">{day ? workoutTitle(day) : w.workoutDayId}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{prettyDate(new Date(w.date))}</p>
                      </div>
                      <div className="text-end text-xs text-slate-500 dark:text-slate-400">
                        <p className="font-bold text-slate-700 dark:text-slate-200">
                          {w.durationMinutes} {t('common.min')}
                        </p>
                        <p>
                          {w.completedExercises}/{w.totalExercises} {t('common.done')}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="card flex flex-col items-center gap-1 p-3 text-center">
      {icon}
      <p className="text-xl font-extrabold leading-none">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}
