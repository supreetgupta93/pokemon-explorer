import { Loader2 } from 'lucide-react';
import { usePokemonExplorer } from '@/hooks/usePokemonExplorer';
import { SearchBar } from '@/components/SearchBar';
import { TypeFilter } from '@/components/TypeFilter';
import { SortSelect } from '@/components/SortSelect';
import { PokemonGrid } from '@/components/PokemonGrid';

export function HomePage() {
  const {
    displayedList,
    mode,
    isLoading,
    isLoadingMore,
    error,
    canLoadMore,
    handleLoadMore,
    retryInitial,
    searchInput,
    setSearchInput,
    selectedType,
    setSelectedType,
    sortKey,
    setSortKey,
    clearFilters,
  } = usePokemonExplorer();

  const hasActiveFilters = searchInput.trim().length > 0 || selectedType !== null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <section className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Explore the Pokédex
        </h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft dark:text-cream/60">
          Browse, search, and compare Pokémon straight from PokéAPI. Tap a card for the full
          stat readout.
        </p>
      </section>

      <section className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchBar value={searchInput} onChange={setSearchInput} />
        <div className="flex gap-3">
          <TypeFilter value={selectedType} onChange={setSelectedType} />
          <SortSelect value={sortKey} onChange={setSortKey} />
        </div>
      </section>

      <PokemonGrid
        items={displayedList}
        isLoading={isLoading}
        error={error}
        onRetry={retryInitial}
        emptyTitle={mode === 'search' ? 'No match found' : 'No Pokémon here'}
        emptyMessage={
          mode === 'search'
            ? `We couldn't find a Pokémon named "${searchInput.trim()}". Check the spelling and try again.`
            : 'Try a different type, or clear your filters to browse everything.'
        }
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {canLoadMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60 dark:bg-cream dark:text-navy"
          >
            {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />}
            {isLoadingMore ? 'Loading more…' : 'Load more Pokémon'}
          </button>
        </div>
      )}
    </div>
  );
}
