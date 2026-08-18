import { useEffect, useState } from 'react';
import { ListFilter } from 'lucide-react';
import { fetchAllTypes } from '@/services/pokeapi';

export function TypeFilter({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (type: string | null) => void;
}) {
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchAllTypes()
      .then(setTypes)
      .catch(() => setTypes([]));
  }, []);

  return (
    <div className="relative">
      <ListFilter
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/60 dark:text-cream/40"
        strokeWidth={2}
      />
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        aria-label="Filter by type"
        className="w-full cursor-pointer appearance-none rounded-full border border-ink/10 bg-white py-3 pl-11 pr-8 text-sm capitalize text-ink shadow-sm outline-none transition-all focus:border-pokedex-red/40 focus:ring-4 focus:ring-pokedex-red/10 dark:border-cream/10 dark:bg-navy-soft dark:text-cream sm:w-44"
      >
        <option value="">All types</option>
        {types.map((t) => (
          <option key={t} value={t} className="capitalize">
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
