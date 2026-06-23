import { Languages } from 'lucide-react';
import { useI18n } from '../i18n/LanguageContext';

export function LanguageToggle() {
  const { lang, toggleLang, t } = useI18n();
  return (
    <button
      onClick={toggleLang}
      aria-label={t('toggle.lang')}
      className="btn-ghost h-10 gap-1.5 rounded-full px-3 text-sm font-bold"
    >
      <Languages className="h-4 w-4" />
      {lang === 'en' ? 'ع' : 'EN'}
    </button>
  );
}
