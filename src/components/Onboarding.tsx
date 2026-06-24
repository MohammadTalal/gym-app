import { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { LanguageToggle } from './LanguageToggle';
import { dateKey } from '../utils/date';

export const ONBOARDED_KEY = 'gymcoach-onboarded-v1';

/** One-time first-run setup: name, units, current weight, goal. */
export function Onboarding({ onDone }: { onDone: () => void }) {
  const { state, updateProfile, addBodyWeight } = useApp();
  const { t } = useI18n();
  const { unit, setUnit, fromDisplay } = useUnits();
  const unitLabel = t(unit === 'kg' ? 'common.kg' : 'common.lb');

  const [name, setName] = useState(state.profile.name === 'Athlete' ? '' : state.profile.name);
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState(state.profile.goal);

  function finish() {
    updateProfile({
      ...state.profile,
      name: name.trim() || state.profile.name,
      goal: goal.trim() || state.profile.goal,
    });
    const w = parseFloat(weight);
    if (Number.isFinite(w) && w > 0) {
      addBodyWeight({ date: dateKey(new Date()), weightKg: Math.round(fromDisplay(w) * 10) / 10 });
    }
    onDone();
  }

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-md flex-col overflow-y-auto bg-slate-50 p-6 dark:bg-slate-950">
      <div className="flex justify-end">
        <LanguageToggle />
      </div>

      <div className="mt-4 flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
          <Dumbbell className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-extrabold">{t('onb.welcome')}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('onb.subtitle')}</p>
      </div>

      <div className="mt-6 space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">{t('onb.yourName')}</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </label>

        <div>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">{t('profile.units')}</span>
          <div className="flex overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            {(['kg', 'lb'] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`flex-1 py-2.5 text-sm font-bold ${unit === u ? 'bg-brand-600 text-white' : 'text-slate-500'}`}
              >
                {t(u === 'kg' ? 'common.kg' : 'common.lb')}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            {t('prog.todaysWeight')} ({unitLabel})
          </span>
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">{t('profile.goal')}</span>
          <textarea rows={2} value={goal} onChange={(e) => setGoal(e.target.value)} className={inputCls} />
        </label>
      </div>

      <div className="mt-6 space-y-2">
        <button onClick={finish} className="btn-primary w-full py-3 text-base">
          {t('onb.start')}
        </button>
        <button onClick={onDone} className="w-full py-2 text-sm font-semibold text-slate-400">
          {t('onb.skip')}
        </button>
      </div>
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900';
