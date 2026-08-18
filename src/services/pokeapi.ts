import type {
  Pokemon,
  PokemonListResponse,
  PokemonRef,
  PokemonSummary,
  TypeDetailResponse,
  TypeListResponse,
} from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

/** Thrown for any failure talking to PokéAPI so the UI can branch on `.kind`. */
export class PokeApiError extends Error {
  kind: 'not-found' | 'network' | 'server';

  constructor(kind: PokeApiError['kind'], message: string) {
    super(message);
    this.name = 'PokeApiError';
    this.kind = kind;
  }
}

async function request<T>(url: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new PokeApiError(
      'network',
      'Could not reach PokéAPI. Check your connection and try again.'
    );
  }

  if (response.status === 404) {
    throw new PokeApiError('not-found', 'That Pokémon could not be found.');
  }
  if (!response.ok) {
    throw new PokeApiError(
      'server',
      `PokéAPI responded with an error (${response.status}). Please try again.`
    );
  }

  return (await response.json()) as T;
}

/** Best-available artwork for a Pokémon, falling back gracefully. */
function pickImage(sprites: Pokemon['sprites']): string {
  return (
    sprites.other?.['official-artwork']?.front_default ||
    sprites.other?.home?.front_default ||
    sprites.front_default ||
    ''
  );
}

function statValue(pokemon: Pokemon, statName: string): number {
  return pokemon.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0;
}

export function toSummary(pokemon: Pokemon): PokemonSummary {
  return {
    id: pokemon.id,
    name: pokemon.name,
    image: pickImage(pokemon.sprites),
    types: pokemon.types
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name),
    hp: statValue(pokemon, 'hp'),
    attack: statValue(pokemon, 'attack'),
    speed: statValue(pokemon, 'speed'),
  };
}

/** Fetches one page of the Pokémon list, then hydrates each entry with full detail
 *  (needed for sprite + type data, which the list endpoint doesn't include). */
export async function fetchPokemonPage(
  limit: number,
  offset: number
): Promise<{ summaries: PokemonSummary[]; hasMore: boolean }> {
  const list = await request<PokemonListResponse>(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );

  const details = await Promise.all(
    list.results.map((r) => request<Pokemon>(r.url))
  );

  return {
    summaries: details.map(toSummary),
    hasMore: list.next !== null,
  };
}

export async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const normalized = name.trim().toLowerCase();
  return request<Pokemon>(`${BASE_URL}/pokemon/${normalized}`);
}

export async function fetchPokemonById(id: number): Promise<Pokemon> {
  return request<Pokemon>(`${BASE_URL}/pokemon/${id}`);
}

export async function fetchAllTypes(): Promise<string[]> {
  const data = await request<TypeListResponse>(`${BASE_URL}/type`);
  // The last two entries (shadow, unknown) aren't real battle types.
  return data.results
    .map((t) => t.name)
    .filter((name) => name !== 'shadow' && name !== 'unknown');
}

/** Pulls the trailing numeric id out of a PokéAPI resource URL, e.g.
 *  "https://pokeapi.co/api/v2/pokemon/25/" -> 25. Lets us sort/paginate
 *  type-filter results without fetching every Pokémon's full detail payload. */
function idFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

/** Returns every Pokémon belonging to a type as lightweight refs (id, name, url) —
 *  a single request, no per-Pokémon detail fetch. Callers hydrate only the slice
 *  they're about to display via `fetchPokemonSummariesByUrls`. */
export async function fetchPokemonRefsByType(type: string): Promise<PokemonRef[]> {
  const data = await request<TypeDetailResponse>(`${BASE_URL}/type/${type}`);
  return data.pokemon
    .map((p) => ({
      id: idFromUrl(p.pokemon.url),
      name: p.pokemon.name,
      url: p.pokemon.url,
    }))
    .sort((a, b) => a.id - b.id);
}

/** Hydrates a specific batch of Pokémon detail URLs into summaries. Used to
 *  fetch only the currently-visible page of a type-filtered or searched list. */
export async function fetchPokemonSummariesByUrls(
  urls: string[]
): Promise<PokemonSummary[]> {
  const details = await Promise.all(urls.map((url) => request<Pokemon>(url)));
  return details.map(toSummary);
}
