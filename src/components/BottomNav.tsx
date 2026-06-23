import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, LineChart, Library } from 'lucide-react';
import { useI18n } from '../i18n/LanguageContext';

const ITEMS = [
  { to: '/', labelKey: 'nav.home', icon: Home, end: true },
  { to: '/today', labelKey: 'nav.workout', icon: Dumbbell, end: false },
  { to: '/progress', labelKey: 'nav.progress', icon: LineChart, end: false },
  { to: '/library', labelKey: 'nav.library', icon: Library, end: false },
];

export function BottomNav() {
  const { t } = useI18n();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/90"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {ITEMS.map(({ to, labelKey, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-400 dark:text-slate-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                {t(labelKey)}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
