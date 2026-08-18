import type { PokemonTypeName } from '@/types/pokemon';

interface TypeTheme {
  /** Solid background used on badges */
  bg: string;
  /** Text color that stays readable on `bg` */
  text: string;
  /** Gradient pair used for card accents / detail screen header */
  gradient: string;
}

// Each type gets a two-stop gradient (not just a flat color) so cards and the
// detail "screen" have some depth without leaning on shadows alone.
const THEME: Record<PokemonTypeName, TypeTheme> = {
  normal: { bg: '#A8A77A', text: '#2B2B1F', gradient: 'linear-gradient(135deg,#C6C6A7,#A8A77A)' },
  fire: { bg: '#EE8130', text: '#3D1400', gradient: 'linear-gradient(135deg,#FF9D4D,#DC4B1F)' },
  water: { bg: '#6390F0', text: '#0B1F4D', gradient: 'linear-gradient(135deg,#7FB0FF,#3A5FC7)' },
  electric: { bg: '#F7D02C', text: '#3D3400', gradient: 'linear-gradient(135deg,#FFE55E,#F0B90B)' },
  grass: { bg: '#7AC74C', text: '#123B0A', gradient: 'linear-gradient(135deg,#95E06C,#4E9E2C)' },
  ice: { bg: '#96D9D6', text: '#0F3D3B', gradient: 'linear-gradient(135deg,#B8ECEA,#5FBFBC)' },
  fighting: { bg: '#C22E28', text: '#FFE9E7', gradient: 'linear-gradient(135deg,#E24A44,#8E1712)' },
  poison: { bg: '#A33EA1', text: '#FCE9FB', gradient: 'linear-gradient(135deg,#C15FC0,#7A2B78)' },
  ground: { bg: '#E2BF65', text: '#3D2E00', gradient: 'linear-gradient(135deg,#F0D68C,#C99B32)' },
  flying: { bg: '#A98FF3', text: '#241A4D', gradient: 'linear-gradient(135deg,#C4B0FF,#8567D6)' },
  psychic: { bg: '#F95587', text: '#3D0016', gradient: 'linear-gradient(135deg,#FF7FA6,#E82A60)' },
  bug: { bg: '#A6B91A', text: '#232B00', gradient: 'linear-gradient(135deg,#C3D642,#828F0F)' },
  rock: { bg: '#B6A136', text: '#2E2600', gradient: 'linear-gradient(135deg,#D3BF5C,#8F7C1E)' },
  ghost: { bg: '#735797', text: '#EDE5FB', gradient: 'linear-gradient(135deg,#9576BC,#4F3A70)' },
  dragon: { bg: '#6F35FC', text: '#EAE1FF', gradient: 'linear-gradient(135deg,#8F5FFF,#4D1FCB)' },
  dark: { bg: '#705746', text: '#EFE5DC', gradient: 'linear-gradient(135deg,#8F7563,#4A392E)' },
  steel: { bg: '#B7B7CE', text: '#26263A', gradient: 'linear-gradient(135deg,#D3D3E5,#8F8FAB)' },
  fairy: { bg: '#D685AD', text: '#3D0F26', gradient: 'linear-gradient(135deg,#EFAAD0,#BD5C90)' },
};

const FALLBACK: TypeTheme = { bg: '#8F8F8F', text: '#1A1A1A', gradient: 'linear-gradient(135deg,#B0B0B0,#707070)' };

export function getTypeTheme(type: string): TypeTheme {
  return THEME[type as PokemonTypeName] ?? FALLBACK;
}

export function getTypeGradient(types: string[]): string {
  if (types.length === 0) return FALLBACK.gradient;
  if (types.length === 1) return getTypeTheme(types[0]).gradient;
  const [a, b] = types;
  const colorA = getTypeTheme(a).bg;
  const colorB = getTypeTheme(b).bg;
  return `linear-gradient(135deg, ${colorA}, ${colorB})`;
}

export const ALL_TYPE_NAMES: PokemonTypeName[] = Object.keys(THEME) as PokemonTypeName[];
