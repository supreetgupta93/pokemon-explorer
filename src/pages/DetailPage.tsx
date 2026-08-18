import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, Ruler, Weight } from 'lucide-react';
import { PokeApiError, fetchPokemonById, fetchPokemonByName } from '@/services/pokeapi';
import type { Pokemon } from '@/types/pokemon';
import { getTypeGradient, getTypeTheme } from '@/utils/typeColors';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { StatBar } from '@/components/StatBar';
import { ErrorState } from '@/components/ErrorState';
import { useFavorites } from '@/context/FavoritesContext';

const MOVES_PREVIEW = 12;

export function DetailPage() {
  const { name = '' } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllMoves, setShowAllMoves] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    setShowAllMoves(false);
    fetchPokemonByName(name)
      .then(setPokemon)
      .catch((err) => {
        setError(
          err instanceof PokeApiError ? err.message : 'Something went wrong loading this Pokémon.'
        );
      })
      .finally(() => setLoading(false));
  }, [name]);

  useEffect(() => {
    load();
    window.scrollTo({ top: 0 });
  }, [load]);

  const goAdjacent = (direction: 1 | -1) => {
    if (!pokemon) return;
    const targetId = pokemon.id + direction;
    if (targetId < 1) return;
    fetchPokemonById(targetId)
      .then((p) => navigate(`/pokemon/${p.name}`))
      .catch(() => {
        /* silently ignore — likely out of range */
      });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="shimmer h-64 w-full rounded-3xl" />
        <div className="mt-6 space-y-3">
          <div className="shimmer h-8 w-1/2 rounded-full" />
          <div className="shimmer h-4 w-1/3 rounded-full" />
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <BackLink />
        <div className="mt-6">
          <ErrorState message={error ?? 'Pokémon not found.'} onRetry={load} />
        </div>
      </div>
    );
  }

  const image =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default ||
    '';
  const types = pokemon.types.sort((a, b) => a.slot - b.slot).map((t) => t.type.name);
  const heightM = (pokemon.height / 10).toFixed(1);
  const weightKg = (pokemon.weight / 10).toFixed(1);
  const favorite = isFavorite(pokemon.id);
  const moves = pokemon.moves.map((m) => m.move.name);
  const visibleMoves = showAllMoves ? moves : moves.slice(0, MOVES_PREVIEW);
  const accent = getTypeTheme(types[0]).bg;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <BackLink />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goAdjacent(-1)}
            disabled={pokemon.id <= 1}
            aria-label="Previous Pokémon"
            className="rounded-full border border-ink/10 p-2 text-ink-soft transition-colors hover:bg-cream-dim disabled:opacity-30 dark:border-cream/10 dark:text-cream/60 dark:hover:bg-navy-line"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => goAdjacent(1)}
            aria-label="Next Pokémon"
            className="rounded-full border border-ink/10 p-2 text-ink-soft transition-colors hover:bg-cream-dim dark:border-cream/10 dark:text-cream/60 dark:hover:bg-navy-line"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* "Device screen" panel — the page's signature element */}
      <div
        className="relative overflow-hidden rounded-[2rem] shadow-[var(--shadow-card-hover)]"
        style={{ backgroundImage: getTypeGradient(types) }}
      >
        <div className="scanline-overlay absolute inset-0" />
        {/* corner rivets, echoing a physical device bezel */}
        <span className="absolute left-4 top-4 h-2 w-2 rounded-full bg-white/70" />
        <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-white/70" />

        <div className="relative flex flex-col items-center px-6 pb-6 pt-10 sm:pt-12">
          <span className="font-mono-num text-sm text-white/80">
            #{String(pokemon.id).padStart(3, '0')}
          </span>
          {image ? (
            <img
              src={image}
              alt={pokemon.name}
              className="h-48 w-48 object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.3)] sm:h-56 sm:w-56"
            />
          ) : (
            <div className="flex h-48 w-48 items-center justify-center text-white/70">
              No image available
            </div>
          )}
          <h1 className="font-display text-2xl font-bold capitalize text-white sm:text-3xl">
            {pokemon.name}
          </h1>
          <div className="mt-2 flex gap-2">
            {types.map((t) => (
              <TypeBadge key={t} type={t} size="md" />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleFavorite(pokemon.id)}
          aria-pressed={favorite}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute right-4 top-12 rounded-full bg-white/20 p-2.5 backdrop-blur-sm transition-colors hover:bg-white/30 sm:top-14"
        >
          <Heart
            className={`h-5 w-5 ${favorite ? 'fill-white text-white' : 'text-white'}`}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Physical stats */}
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[var(--shadow-card)] dark:bg-navy-soft">
          <Ruler className="h-5 w-5 text-ink-soft dark:text-cream/60" strokeWidth={1.75} />
          <div>
            <p className="text-xs text-ink-soft dark:text-cream/50">Height</p>
            <p className="font-mono-num font-semibold">{heightM} m</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[var(--shadow-card)] dark:bg-navy-soft">
          <Weight className="h-5 w-5 text-ink-soft dark:text-cream/60" strokeWidth={1.75} />
          <div>
            <p className="text-xs text-ink-soft dark:text-cream/50">Weight</p>
            <p className="font-mono-num font-semibold">{weightKg} kg</p>
          </div>
        </div>
      </div>

      {/* Abilities */}
      <div className="mt-5 rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] dark:bg-navy-soft">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-soft dark:text-cream/60">
          Abilities
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {pokemon.abilities.map((a) => (
            <span
              key={a.ability.name}
              className="rounded-full bg-cream-dim px-3 py-1 text-sm capitalize dark:bg-navy-line"
            >
              {a.ability.name.replace(/-/g, ' ')}
              {a.is_hidden && <span className="ml-1 text-xs text-ink-soft dark:text-cream/50">(hidden)</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Base stats */}
      <div className="mt-5 rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] dark:bg-navy-soft">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-soft dark:text-cream/60">
          Base stats
        </h2>
        <div className="mt-4 space-y-3">
          {pokemon.stats.map((s) => (
            <StatBar key={s.stat.name} statName={s.stat.name} value={s.base_stat} accent={accent} />
          ))}
        </div>
      </div>

      {/* Moves */}
      <div className="mt-5 rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] dark:bg-navy-soft">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-soft dark:text-cream/60">
          Moves ({moves.length})
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {visibleMoves.map((m) => (
            <span
              key={m}
              className="rounded-full bg-cream-dim px-3 py-1 text-xs capitalize dark:bg-navy-line"
            >
              {m.replace(/-/g, ' ')}
            </span>
          ))}
        </div>
        {moves.length > MOVES_PREVIEW && (
          <button
            type="button"
            onClick={() => setShowAllMoves((v) => !v)}
            className="mt-3 text-sm font-semibold text-pokedex-red hover:underline"
          >
            {showAllMoves ? 'Show fewer moves' : `Show all ${moves.length} moves`}
          </button>
        )}
      </div>
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
