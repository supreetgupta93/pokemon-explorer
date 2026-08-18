import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface CompareEntry {
  id: number;
  name: string;
}

interface CompareContextValue {
  selected: CompareEntry[];
  isSelected: (id: number) => boolean;
  toggle: (entry: CompareEntry) => void;
  clear: () => void;
  isFull: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

const MAX_COMPARE = 2;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<CompareEntry[]>([]);

  const toggle = useCallback((entry: CompareEntry) => {
    setSelected((prev) => {
      const exists = prev.some((p) => p.id === entry.id);
      if (exists) return prev.filter((p) => p.id !== entry.id);
      if (prev.length >= MAX_COMPARE) return [prev[1], entry];
      return [...prev, entry];
    });
  }, []);

  const isSelected = useCallback(
    (id: number) => selected.some((p) => p.id === id),
    [selected]
  );

  const clear = useCallback(() => setSelected([]), []);

  const value = useMemo(
    () => ({ selected, isSelected, toggle, clear, isFull: selected.length >= MAX_COMPARE }),
    [selected, isSelected, toggle, clear]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
