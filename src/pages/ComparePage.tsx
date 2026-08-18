import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PokeApiError, fetchPokemonByName } from '@/services/pokeapi';
import type { Pokemon } from '@/types/pokemon';
import { getTypeTheme } from '@/utils/typeColors';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';

const STAT_ORDER = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

function useComparePokemon(name: string | null) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(name));

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    fetchPokemonByName(name)
      .then(setPokemon)
      .catch((err) => setError(err instanceof PokeApiError ? err.message : 'Failed to load.'))
      .finally(() => setLoading(false));
  }, [name]);

  return { pokemon, error, loading };
}

export function ComparePage() {
  const [params] = useSearchParams();
  const nameA = params.get('a');
  const nameB = params.get('b');

  const a = useComparePokemon(nameA);
  const b = useComparePokemon(nameB);

  if (!nameA || !nameB) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <BackLink />
        <div className="mt-6">
          <EmptyState
            title="Nothing to compare yet"
            message="Pick two Pokémon from the Pokédex using the compare icon on their cards."
          />
        </div>
      </div>
    );
  }

  if (a.error || b.error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <BackLink />
        <div className="mt-6">
          <ErrorState message={a.error ?? b.error ?? 'Something went wrong.'} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 animate-fade-in">
      <BackLink />
      <h1 className="mt-4 font-display text-2xl font-bold">Compare Pokémon</h1>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {[a, b].map((entry, i) => (
          <div key={i} className="flex flex-col items-center rounded-3xl bg-white p-5 shadow-[var(--shadow-card)] dark:bg-navy-soft">
            {entry.loading || !entry.pokemon ? (
              <div className="shimmer h-32 w-32 rounded-full" />
            ) : (
              <>
                <img
                  src={
                    entry.pokemon.sprites.other?.['official-artwork']?.front_default ||
                    entry.pokemon.sprites.front_default ||
                    ''
                  }
                  alt={entry.pokemon.name}
                  className="h-32 w-32 object-contain"
                />
                <h2 className="font-display text-lg font-semibold capitalize">{entry.pokemon.name}</h2>
                <div className="mt-1 flex gap-1.5">
                  {entry.pokemon.types.map((t) => (
                    <TypeBadge key={t.type.name} type={t.type.name} />
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {a.pokemon && b.pokemon && (
        <div className="mt-5 rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] dark:bg-navy-soft">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-soft dark:text-cream/60">
            Base stat comparison
          </h2>
          <div className="mt-4 space-y-4">
            {STAT_ORDER.map((statName) => {
              const valA = a.pokemon!.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0;
              const valB = b.pokemon!.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0;
              const max = Math.max(valA, valB, 1);
              const accentA = getTypeTheme(a.pokemon!.types[0].type.name).bg;
              const accentB = getTypeTheme(b.pokemon!.types[0].type.name).bg;
              return (
                <div key={statName}>
                  <p className="mb-1 text-center text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-cream/60">
                    {STAT_LABELS[statName]}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="w-8 shrink-0 text-right font-mono-num text-sm font-semibold">{valA}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-dim dark:bg-navy-line">
                      <div
                        className="ml-auto h-full rounded-full transition-[width] duration-700"
                        style={{ width: `${(valA / max) * 100}%`, background: accentA }}
                      />
                    </div>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-dim dark:bg-navy-line">
                      <div
                        className="h-full rounded-full transition-[width] duration-700"
                        style={{ width: `${(valB / max) * 100}%`, background: accentB }}
                      />
                    </div>
                    <span className="w-8 shrink-0 font-mono-num text-sm font-semibold">{valB}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink dark:text-cream/60 dark:hover:text-cream"
    >
      <ArrowLeft className="h-4 w-4" strokeWidth={2.25} />
      Back to Pokédex
    </Link>
  );
}
