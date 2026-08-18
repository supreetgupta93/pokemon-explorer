import { Heart, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PokemonSummary } from '@/types/pokemon';
import { TypeBadge } from './ui/TypeBadge';
import { getTypeGradient } from '@/utils/typeColors';
import { useFavorites } from '@/context/FavoritesContext';
import { useCompare } from '@/context/CompareContext';

export function PokemonCard({ pokemon }: { pokemon: PokemonSummary }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isSelected, toggle, isFull } = useCompare();
  const favorite = isFavorite(pokemon.id);
  const compareOn = isSelected(pokemon.id);
  const paddedId = String(pokemon.id).padStart(3, '0');

  return (
    <Link
      to={`/pokemon/${pokemon.name}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pokedex-red dark:bg-navy-soft"
      aria-label={`View details for ${pokemon.name}, number ${paddedId}`}
    >
      {/* Accent header with type gradient + power-light dot, the card's signature detail */}
      <div
        className="relative flex h-28 items-center justify-center overflow-hidden"
        style={{ backgroundImage: getTypeGradient(pokemon.types) }}
      >
        <div className="scanline-overlay absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-70" />
        <span className="absolute left-3 top-3 h-2 w-2 rounded-full bg-white/90 shadow-[0_0_0_2px_rgba(0,0,0,0.15)]" />
        {pokemon.image ? (
          <img
            src={pokemon.image}
            alt={pokemon.name}
            loading="lazy"
            className="relative z-10 h-24 w-24 object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <span className="relative z-10 font-mono-num text-xs text-white/80">no image</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono-num text-xs text-ink-soft dark:text-cream/60">#{paddedId}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggle({ id: pokemon.id, name: pokemon.name });
              }}
              disabled={!compareOn && isFull}
              aria-pressed={compareOn}
              aria-label={compareOn ? `Remove ${pokemon.name} from comparison` : `Add ${pokemon.name} to comparison`}
              className={`rounded-full p-1.5 transition-colors ${
                compareOn
                  ? 'bg-screen-glow/20 text-screen-glow'
                  : 'text-ink-soft/50 hover:bg-cream-dim disabled:opacity-30 dark:text-cream/40 dark:hover:bg-navy-line'
              }`}
            >
              <Scale className="h-4 w-4" strokeWidth={2.25} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(pokemon.id);
              }}
              aria-pressed={favorite}
              aria-label={favorite ? `Remove ${pokemon.name} from favorites` : `Add ${pokemon.name} to favorites`}
              className="rounded-full p-1.5 text-ink-soft/50 transition-colors hover:bg-cream-dim disabled:opacity-30 dark:text-cream/40 dark:hover:bg-navy-line"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${favorite ? 'fill-pokedex-red text-pokedex-red' : ''}`}
                strokeWidth={2.25}
              />
            </button>
          </div>
        </div>

        <h3 className="font-display text-lg font-semibold capitalize leading-tight">
          {pokemon.name}
        </h3>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
        </div>
      </div>
    </Link>
  );
}
