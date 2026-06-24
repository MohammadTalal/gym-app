import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';
import { dateKey, startOfWeek } from '../utils/date';

const WEEKS = 12;

/** GitHub-style grid of trained days over the last 12 weeks. */
export function ConsistencyHeatmap() {
  const { state } = useApp();
  const { t, prettyDate } = useI18n();

  const trained = new Set(state.completedWorkouts.map((w) => w.date));
  const todayKey = dateKey(new Date());

  // Build columns (weeks), each with 7 day cells (Mon→Sun).
  const start = startOfWeek(new Date());
  start.setDate(start.getDate() - (WEEKS - 1) * 7);

  const columns = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      const key = dateKey(date);
      return { key, date, isTrained: trained.has(key), isFuture: key > todayKey, isToday: key === todayKey };
    }),
  );

  return (
    <div className="card p-4">
      <h2 className="mb-3 font-bold">{t('prog.consistency')}</h2>
      <div className="flex justify-between gap-1">
        {columns.map((week, i) => (
          <div key={i} className="flex flex-1 flex-col gap-1">
            {week.map((cell) => (
              <div
                key={cell.key}
                title={`${prettyDate(cell.date)}${cell.isTrained ? ' ✓' : ''}`}
                className={`aspect-square w-full rounded-[3px] ${
                  cell.isFuture
                    ? 'bg-transparent'
                    : cell.isTrained
                      ? 'bg-brand-500'
                      : 'bg-slate-100 dark:bg-slate-800'
                } ${cell.isToday ? 'ring-1 ring-brand-400' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
