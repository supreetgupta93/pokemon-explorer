import { Link, useLocation } from 'react-router-dom';
import { Heart, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useFavorites } from '@/context/FavoritesContext';

export function Header() {
  const [isDark, toggleDark] = useDarkMode();
  const location = useLocation();
  const onFavorites = location.pathname === '/favorites';
  const { favorites } = useFavorites();

  return (
    <header className="sticky top-0 z-30 border-b border-ink/5 bg-cream/85 backdrop-blur-md dark:border-cream/10 dark:bg-navy/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-ink dark:border-cream">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-pokedex-red" />
            <span className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
            <span className="absolute h-2.5 w-2.5 rounded-full border-2 border-ink bg-white" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Pokédex</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/favorites"
            aria-current={onFavorites ? 'page' : undefined}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
              onFavorites
                ? 'bg-pokedex-red text-white'
                : 'text-ink-soft hover:bg-cream-dim dark:text-cream/70 dark:hover:bg-navy-line'
            }`}
          >
            <Heart className="h-4 w-4" strokeWidth={2.25} fill={onFavorites ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">Favorites</span>
            {favorites.length > 0 && (
              <span
                className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none ${
                  onFavorites ? 'bg-white text-pokedex-red' : 'bg-pokedex-red text-white'
                }`}
              >
                {favorites.length}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleDark}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-full p-2.5 text-ink-soft transition-colors hover:bg-cream-dim dark:text-cream/70 dark:hover:bg-navy-line"
          >
            {isDark ? <Sun className="h-4 w-4" strokeWidth={2.25} /> : <Moon className="h-4 w-4" strokeWidth={2.25} />}
          </button>
        </div>
      </div>
    </header>
  );
}
