// Core PokéAPI response shapes, trimmed to the fields the app actually uses.

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
    home?: {
      front_default: string | null;
    };
  };
}

export interface PokemonTypeSlot {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonAbilitySlot {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonMoveSlot {
  move: NamedAPIResource;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number; // decimetres
  weight: number; // hectograms
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  abilities: PokemonAbilitySlot[];
  stats: PokemonStat[];
  moves: PokemonMoveSlot[];
  base_experience: number | null;
}

export interface TypeListResponse {
  count: number;
  results: NamedAPIResource[];
}

export interface TypeDetailResponse {
  pokemon: { pokemon: NamedAPIResource; slot: number }[];
}

// Lightweight shape used throughout the UI once a Pokémon has been fetched
// and normalized for card / list rendering.
export interface PokemonSummary {
  id: number;
  name: string;
  image: string;
  types: string[];
  hp: number;
  attack: number;
  speed: number;
}

export type SortKey = 'id' | 'name' | 'attack' | 'speed' | 'hp';

// Lightweight reference to a Pokémon belonging to a type, resolved from the
// `/type/{name}` endpoint without fetching each Pokémon's full detail payload.
// The numeric id is parsed straight out of the resource URL, which is enough
// to sort and paginate the list before any detail data has been fetched.
export interface PokemonRef {
  id: number;
  name: string;
  url: string;
}

export type PokemonTypeName =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';
