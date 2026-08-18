import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  PokeApiError,
  fetchPokemonByName,
  fetchPokemonRefsByType,
  fetchPokemonPage,
  fetchPokemonSummariesByUrls,
  toSummary,
} from '@/services/pokeapi';
import type { PokemonRef, PokemonSummary, SortKey } from '@/types/pokemon';
import { useDebounce } from './useDebounce';

const PAGE_SIZE = 20;

function sortSummaries(list: PokemonSummary[], key: SortKey): PokemonSummary[] {
  const sorted = [...list];
  switch (key) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'attack':
      return sorted.sort((a, b) => b.attack - a.attack);
    case 'speed':
      return sorted.sort((a, b) => b.speed - a.speed);
    case 'hp':
      return sorted.sort((a, b) => b.hp - a.hp);
    case 'id':
    default:
      return sorted.sort((a, b) => a.id - b.id);
  }
}

export function usePokemonExplorer() {
  // Base (unfiltered) server-paginated list
  const [baseList, setBaseList] = useState<PokemonSummary[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [baseError, setBaseError] = useState<string | null>(null);

  // Search
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput.trim(), 400);
  const [searchResult, setSearchResult] = useState<PokemonSummary | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const searchRequestId = useRef(0);

  // Type filter — the `/type/{name}` endpoint returns every member's name/url
  // in one cheap request. We keep that full ref list (typeRefs) but only fetch
  // full detail data (typeSummaries) for the page currently on screen, so
  // selecting a type with 100+ Pokémon doesn't fire 100+ requests at once.
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [typeRefs, setTypeRefs] = useState<PokemonRef[]>([]);
  const [typeSummaries, setTypeSummaries] = useState<Map<number, PokemonSummary>>(
    () => new Map()
  );
  const [typeVisibleCount, setTypeVisibleCount] = useState(PAGE_SIZE);
  const [typeLoading, setTypeLoading] = useState(false);
  const [typeLoadingMore, setTypeLoadingMore] = useState(false);
  const [typeError, setTypeError] = useState<string | null>(null);
  const typeRequestId = useRef(0);

  // Sort
  const [sortKey, setSortKey] = useState<SortKey>('id');

  const loadInitial = useCallback(async () => {
    setLoadingInitial(true);
    setBaseError(null);
    try {
      const { summaries, hasMore: more } = await fetchPokemonPage(PAGE_SIZE, 0);
      setBaseList(summaries);
      setOffset(PAGE_SIZE);
      setHasMore(more);
    } catch (err) {
      setBaseError(
        err instanceof PokeApiError
          ? err.message
          : 'Something went wrong loading Pokémon.'
      );
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setBaseError(null);
    try {
      const { summaries, hasMore: more } = await fetchPokemonPage(PAGE_SIZE, offset);
      setBaseList((prev) => [...prev, ...summaries]);
      setOffset((prev) => prev + PAGE_SIZE);
      setHasMore(more);
    } catch (err) {
      setBaseError(
        err instanceof PokeApiError
          ? err.message
          : 'Something went wrong loading more Pokémon.'
      );
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, offset]);

  // Run search whenever the debounced term changes
  useEffect(() => {
    if (!debouncedSearch) {
      setSearchResult(null);
      setSearchError(null);
      setSearching(false);
      return;
    }

    const requestId = ++searchRequestId.current;
    setSearching(true);
    setSearchError(null);

    fetchPokemonByName(debouncedSearch)
      .then((pokemon) => {
        if (searchRequestId.current !== requestId) return;
        setSearchResult(toSummary(pokemon));
        setSearchError(null);
      })
      .catch((err) => {
        if (searchRequestId.current !== requestId) return;
        setSearchResult(null);
        setSearchError(
          err instanceof PokeApiError
            ? err.message
            : 'Something went wrong searching for that Pokémon.'
        );
      })
      .finally(() => {
        if (searchRequestId.current === requestId) setSearching(false);
      });
  }, [debouncedSearch]);

  /** Hydrates full detail data for whichever refs in the given slice aren't
   *  already cached, then merges them into typeSummaries. */
  const hydrateTypeRefs = useCallback(
    async (refs: PokemonRef[], requestId: number, markLoadingMore: boolean) => {
      const missing = refs.filter((r) => !typeSummaries.has(r.id));
      if (missing.length === 0) return;

      if (markLoadingMore) setTypeLoadingMore(true);
      try {
        const summaries = await fetchPokemonSummariesByUrls(missing.map((r) => r.url));
        if (typeRequestId.current !== requestId) return;
        setTypeSummaries((prev) => {
          const next = new Map(prev);
          summaries.forEach((s) => next.set(s.id, s));
          return next;
        });
      } catch (err) {
        if (typeRequestId.current !== requestId) return;
        setTypeError(
          err instanceof PokeApiError
            ? err.message
            : 'Something went wrong loading that type.'
        );
      } finally {
        if (typeRequestId.current === requestId && markLoadingMore) setTypeLoadingMore(false);
      }
    },
    [typeSummaries]
  );

  // Fetch the (cheap) full ref list whenever the selected type changes, then
  // hydrate only the first page of detail data — not the whole type.
  useEffect(() => {
    if (!selectedType) {
      setTypeRefs([]);
      setTypeSummaries(new Map());
      setTypeError(null);
      return;
    }

    const requestId = ++typeRequestId.current;
    setTypeLoading(true);
    setTypeError(null);
    setTypeVisibleCount(PAGE_SIZE);
    setTypeSummaries(new Map());

    fetchPokemonRefsByType(selectedType)
      .then(async (refs) => {
        if (typeRequestId.current !== requestId) return;
        setTypeRefs(refs);
        const firstPage = refs.slice(0, PAGE_SIZE);
        const summaries = await fetchPokemonSummariesByUrls(firstPage.map((r) => r.url));
        if (typeRequestId.current !== requestId) return;
        setTypeSummaries(new Map(summaries.map((s) => [s.id, s])));
      })
      .catch((err) => {
        if (typeRequestId.current !== requestId) return;
        setTypeError(
          err instanceof PokeApiError
            ? err.message
            : 'Something went wrong loading that type.'
        );
      })
      .finally(() => {
        if (typeRequestId.current === requestId) setTypeLoading(false);
      });
  }, [selectedType]);

  const isSearchMode = debouncedSearch.length > 0;
  const isTypeMode = !isSearchMode && selectedType !== null;

  // Only the refs within the currently-revealed window, hydrated where available.
  // Sorting is applied to whatever's loaded so far (same behavior as browse mode,
  // which also only ever sorts the pages it has already fetched).
  const visibleTypeRefs = useMemo(
    () => typeRefs.slice(0, typeVisibleCount),
    [typeRefs, typeVisibleCount]
  );

  const typeResults = useMemo(
    () =>
      visibleTypeRefs
        .map((r) => typeSummaries.get(r.id))
        .filter((s): s is PokemonSummary => Boolean(s)),
    [visibleTypeRefs, typeSummaries]
  );

  const displayedList = useMemo(() => {
    if (isSearchMode) return searchResult ? [searchResult] : [];
    if (isTypeMode) return sortSummaries(typeResults, sortKey);
    return sortSummaries(baseList, sortKey);
  }, [isSearchMode, isTypeMode, searchResult, typeResults, sortKey, baseList]);

  const mode: 'search' | 'type' | 'browse' = isSearchMode
    ? 'search'
    : isTypeMode
      ? 'type'
      : 'browse';

  const isLoading =
    mode === 'search' ? searching : mode === 'type' ? typeLoading : loadingInitial;

  const error = mode === 'search' ? searchError : mode === 'type' ? typeError : baseError;

  const canLoadMore =
    mode === 'browse'
      ? hasMore
      : mode === 'type'
        ? typeVisibleCount < typeRefs.length
        : false;

  const handleLoadMore = useCallback(() => {
    if (mode === 'browse') {
      loadMore();
      return;
    }
    if (mode === 'type') {
      const requestId = typeRequestId.current;
      const nextCount = typeVisibleCount + PAGE_SIZE;
      const nextSlice = typeRefs.slice(typeVisibleCount, nextCount);
      setTypeVisibleCount(nextCount);
      hydrateTypeRefs(nextSlice, requestId, true);
    }
  }, [mode, loadMore, typeVisibleCount, typeRefs, hydrateTypeRefs]);

  const clearFilters = useCallback(() => {
    setSearchInput('');
    setSelectedType(null);
  }, []);

  return {
    displayedList,
    mode,
    isLoading,
    isLoadingMore: mode === 'type' ? typeLoadingMore : loadingMore,
    error,
    canLoadMore,
    handleLoadMore,
    retryInitial: loadInitial,

    searchInput,
    setSearchInput,

    selectedType,
    setSelectedType,

    sortKey,
    setSortKey,

    clearFilters,
  };
}
