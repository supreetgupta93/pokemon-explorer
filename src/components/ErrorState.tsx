import { RefreshCcw, WifiOff } from 'lucide-react';

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-pokedex-red/20 bg-pokedex-red/5 px-6 py-16 text-center">
      <div className="rounded-full bg-pokedex-red/10 p-4">
        <WifiOff className="h-6 w-6 text-pokedex-red" strokeWidth={1.75} />
      </div>
      <h3 className="font-display text-lg font-semibold">Something went sideways</h3>
      <p className="max-w-sm text-sm text-ink-soft dark:text-cream/60">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-pokedex-red px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-pokedex-red-dim"
        >
          <RefreshCcw className="h-4 w-4" strokeWidth={2.25} />
          Try again
        </button>
      )}
    </div>
  );
}
