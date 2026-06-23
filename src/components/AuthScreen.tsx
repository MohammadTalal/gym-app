import { useState } from 'react';
import { Dumbbell, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const { t } = useI18n();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error } = await fn(email.trim(), password);
    setBusy(false);
    if (error) {
      setError(error);
    } else if (mode === 'signup') {
      setNotice(t('auth.checkEmail'));
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 p-6">
      <div className="absolute end-4 top-4">
        <LanguageToggle />
      </div>

      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
          <Dumbbell className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-extrabold">{t('auth.welcome')}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {mode === 'signin' ? t('auth.signInSubtitle') : t('auth.signUpSubtitle')}
        </p>
      </div>

      <form onSubmit={submit} className="card space-y-3 p-5">
        <div>
          <label className="mb-1 block text-sm font-semibold">{t('auth.email')}</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">{t('auth.password')}</label>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800"
          />
        </div>

        {error && <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>}
        {notice && <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{notice}</p>}

        <button type="submit" disabled={busy} className="btn-primary w-full py-3 text-base disabled:opacity-60">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === 'signin' ? t('auth.signIn') : t('auth.createAccount')}
        </button>
      </form>

      <button
        onClick={() => {
          setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
          setError(null);
          setNotice(null);
        }}
        className="text-center text-sm font-semibold text-brand-600 dark:text-brand-400"
      >
        {mode === 'signin' ? t('auth.toSignUp') : t('auth.toSignIn')}
      </button>
    </div>
  );
}
