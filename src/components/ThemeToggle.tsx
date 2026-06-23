import { Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';

export function ThemeToggle() {
  const { state, toggleDarkMode } = useApp();
  const { t } = useI18n();
  return (
    <button
      onClick={toggleDarkMode}
      aria-label={t('toggle.theme')}
      className="btn-ghost h-10 w-10 rounded-full"
    >
      {state.darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
