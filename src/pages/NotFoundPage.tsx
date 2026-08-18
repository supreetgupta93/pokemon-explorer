import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6">
      <span className="font-display text-6xl font-bold text-pokedex-red">404</span>
      <h1 className="font-display text-xl font-semibold">This route wandered off into tall grass</h1>
      <p className="max-w-sm text-sm text-ink-soft dark:text-cream/60">
        The page you're looking for doesn't exist. Head back to the Pokédex to keep exploring.
      </p>
      <Link
        to="/"
        className="mt-2 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-ink/85 dark:bg-cream dark:text-navy"
      >
        Back to Pokédex
      </Link>
    </div>
  );
}
