import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPokemonById, toSummary } from '@/services/pokeapi';
import type { PokemonSummary } from '@/types/pokemon';
import { useFavorites } from '@/context/FavoritesContext';
import { PokemonGrid } from '@/components/PokemonGrid';

export function FavoritesPage() {
  const { favorites } = useFavorites();
  const [items, setItems] = useState<PokemonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (favorites.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all(favorites.map((id) => fetchPokemonById(id)))
      .then((list) => setItems(list.map(toSummary).sort((a, b) => a.id - b.id)))
      .catch(() => setError('Could not load your favorites right now.'))
      .finally(() => setLoading(false));
  }, [favorites]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <section className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Favorites</h1>
        <p className="mt-2 text-sm text-ink-soft dark:text-cream/60">
          Pokémon you've saved with the heart icon, kept right here on this device.
        </p>
      </section>

      <PokemonGrid
        items={items}
        isLoading={loading}
        error={error}
        onRetry={() => setError(null)}
        emptyTitle="No favorites yet"
        emptyMessage="Tap the heart icon on any Pokémon card to save it here."
        hasActiveFilters={false}
        onClearFilters={() => navigate('/')}
      />
    </div>
  );
}
