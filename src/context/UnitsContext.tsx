import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type Unit = 'kg' | 'lb';
const UNIT_KEY = 'gymcoach-unit-v1';
const LB_PER_KG = 2.2046226218;

interface UnitsValue {
  unit: Unit;
  setUnit: (u: Unit) => void;
  /** kg (stored) → number in the chosen display unit. */
  toDisplay: (kg: number) => number;
  /** number in the chosen display unit → kg (for storage). */
  fromDisplay: (val: number) => number;
  /** kg → rounded display string (no unit suffix). */
  fmt: (kg: number, digits?: number) => string;
}

const UnitsContext = createContext<UnitsValue | null>(null);

export function UnitsProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useLocalStorage<Unit>(UNIT_KEY, 'kg');

  const value = useMemo<UnitsValue>(() => {
    const toDisplay = (kg: number) => (unit === 'kg' ? kg : kg * LB_PER_KG);
    const fromDisplay = (val: number) => (unit === 'kg' ? val : val / LB_PER_KG);
    const fmt = (kg: number, digits = 1) => {
      const v = toDisplay(kg);
      return (Math.round(v * 10) / 10).toFixed(digits).replace(/\.0$/, '');
    };
    return { unit, setUnit, toDisplay, fromDisplay, fmt };
  }, [unit, setUnit]);

  return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>;
}

export function useUnits(): UnitsValue {
  const ctx = useContext(UnitsContext);
  if (!ctx) throw new Error('useUnits must be used within <UnitsProvider>');
  return ctx;
}
