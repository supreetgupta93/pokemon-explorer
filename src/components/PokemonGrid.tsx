import type { PokemonSummary } from '@/types/pokemon';
import { PokemonCard } from './PokemonCard';
import { SkeletonCard } from './SkeletonCard';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';

interface Props {
  items: PokemonSummary[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  emptyTitle?: string;
  emptyMessage?: string;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

export function PokemonGrid({
  items,
  isLoading,
  error,
  onRetry,
  emptyTitle,
  emptyMessage,
  onClearFilters,
  hasActiveFilters,
}: Props) {
  if (error && items.length === 0) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        actionLabel={hasActiveFilters ? 'Clear filters' : undefined}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((pokemon) => (
        <div key={pokemon.id} className="animate-pop-in">
          <PokemonCard pokemon={pokemon} />
        </div>
      ))}
    </div>
  );
}
