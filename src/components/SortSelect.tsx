import { ArrowUpDown } from 'lucide-react';
import type { SortKey } from '@/types/pokemon';

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'id', label: 'Pokédex № ' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'attack', label: 'Attack (high–low)' },
  { value: 'speed', label: 'Speed (high–low)' },
  { value: 'hp', label: 'HP (high–low)' },
];

export function SortSelect({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (sort: SortKey) => void;
}) {
  return (
    <div className="relative">
      <ArrowUpDown
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/60 dark:text-cream/40"
        strokeWidth={2}
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        aria-label="Sort Pokémon"
        className="w-full cursor-pointer appearance-none rounded-full border border-ink/10 bg-white py-3 pl-11 pr-8 text-sm text-ink shadow-sm outline-none transition-all focus:border-pokedex-red/40 focus:ring-4 focus:ring-pokedex-red/10 dark:border-cream/10 dark:bg-navy-soft dark:text-cream sm:w-48"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
