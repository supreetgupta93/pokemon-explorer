import { Search, X } from 'lucide-react';

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative flex-1 min-w-0">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/60 dark:text-cream/40"
        strokeWidth={2}
      />
      <input
        type="text"
        inputMode="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, e.g. pikachu"
        aria-label="Search Pokémon by name"
        className="w-full rounded-full border border-ink/10 bg-white py-3 pl-11 pr-10 text-sm text-ink placeholder:text-ink-soft/50 shadow-sm outline-none transition-all focus:border-pokedex-red/40 focus:ring-4 focus:ring-pokedex-red/10 dark:border-cream/10 dark:bg-navy-soft dark:text-cream dark:placeholder:text-cream/30"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-soft/60 hover:bg-cream-dim dark:text-cream/50 dark:hover:bg-navy-line"
        >
          <X className="h-4 w-4" strokeWidth={2.25} />
        </button>
      )}
    </div>
  );
}
