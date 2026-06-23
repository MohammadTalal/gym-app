import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200/70 bg-slate-50/80 px-4 py-3 backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-950/80">
      <div className="min-w-0">
        {subtitle && (
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            {subtitle}
          </p>
        )}
        <h1 className="truncate text-2xl font-extrabold leading-tight">{title}</h1>
      </div>
      {action ?? (
        <div className="flex shrink-0 items-center gap-1.5">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      )}
    </header>
  );
}
