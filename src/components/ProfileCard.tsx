import { useEffect, useState } from 'react';
import { Check, LogOut, Pencil, User, Volume2, VolumeX, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SOUND_KEY } from '../utils/sound';
import type { Difficulty, UserProfile } from '../types';

const LEVELS: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

export function ProfileCard() {
  const { state, updateProfile, signOut, mode } = useApp();
  const { t, difficulty } = useI18n();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(state.profile);
  const [soundOn, setSoundOn] = useLocalStorage<boolean>(SOUND_KEY, true);

  // Keep the draft in sync if the profile changes (e.g. after cloud load).
  useEffect(() => {
    if (!editing) setDraft(state.profile);
  }, [state.profile, editing]);

  function save() {
    updateProfile({ ...draft, heightCm: Number(draft.heightCm) || 0 });
    setEditing(false);
  }

  const p = state.profile;

  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
          <User className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-extrabold leading-tight">{p.name}</h2>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {difficulty(p.level)} · {p.heightCm} {t('profile.cm')}
          </p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-ghost h-9 gap-1.5 px-3 text-sm">
            <Pencil className="h-4 w-4" /> {t('profile.edit')}
          </button>
        )}
      </div>

      {editing && (
        <div className="mt-4 space-y-3">
          <Field label={t('profile.name')}>
            <input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t('profile.sex')}>
              <select
                value={draft.sex}
                onChange={(e) => setDraft((d) => ({ ...d, sex: e.target.value as UserProfile['sex'] }))}
                className={inputCls}
              >
                <option value="Male">{t('profile.male')}</option>
                <option value="Female">{t('profile.female')}</option>
              </select>
            </Field>
            <Field label={t('profile.height')}>
              <input
                type="number"
                inputMode="numeric"
                value={draft.heightCm}
                onChange={(e) => setDraft((d) => ({ ...d, heightCm: Number(e.target.value) }))}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label={t('profile.level')}>
            <select
              value={draft.level}
              onChange={(e) => setDraft((d) => ({ ...d, level: e.target.value as Difficulty }))}
              className={inputCls}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {difficulty(l)}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t('profile.goal')}>
            <textarea
              rows={2}
              value={draft.goal}
              onChange={(e) => setDraft((d) => ({ ...d, goal: e.target.value }))}
              className={inputCls}
            />
          </Field>

          <div className="flex gap-2">
            <button onClick={save} className="btn-primary flex-1 py-2.5">
              <Check className="h-4 w-4" /> {t('profile.save')}
            </button>
            <button
              onClick={() => {
                setDraft(state.profile);
                setEditing(false);
              }}
              className="btn-ghost px-4 py-2.5"
            >
              <X className="h-4 w-4" /> {t('profile.cancel')}
            </button>
          </div>
        </div>
      )}

      {!editing && p.goal && (
        <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
          🎯 {p.goal}
        </p>
      )}

      {!editing && (
        <button
          onClick={() => setSoundOn((v) => !v)}
          className="mt-3 flex w-full items-center justify-between border-t border-slate-100 pt-3 text-sm dark:border-slate-800"
        >
          <span className="flex items-center gap-2 font-semibold">
            {soundOn ? <Volume2 className="h-4 w-4 text-brand-500" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
            {t('profile.sound')}
          </span>
          <span
            className={`relative h-6 w-10 rounded-full transition-colors ${
              soundOn ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                soundOn ? 'start-[1.125rem]' : 'start-0.5'
              }`}
            />
          </span>
        </button>
      )}

      {mode === 'cloud' && signOut && (
        <button
          onClick={() => signOut()}
          className="mt-3 flex w-full items-center justify-center gap-1.5 border-t border-slate-100 pt-3 text-sm font-semibold text-slate-500 dark:border-slate-800"
        >
          <LogOut className="h-4 w-4 rtl:-scale-x-100" /> {t('profile.signOut')}
        </button>
      )}
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      {children}
    </label>
  );
}
