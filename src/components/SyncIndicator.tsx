import { Check, CloudOff, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/LanguageContext';

/** Small save-status pill shown in the header (cloud mode only). */
export function SyncIndicator() {
  const { syncStatus } = useApp();
  const { t } = useI18n();

  if (!syncStatus || syncStatus === 'idle') return null;

  if (syncStatus === 'saving') {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> {t('sync.saving')}
      </span>
    );
  }
  if (syncStatus === 'saved') {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <Check className="h-3.5 w-3.5" /> {t('sync.saved')}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400" title={t('sync.error')}>
      <CloudOff className="h-3.5 w-3.5" /> {t('sync.error')}
    </span>
  );
}
