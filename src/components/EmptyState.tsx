import { SearchX } from 'lucide-react';

export function EmptyState({
  title = "No Pokémon here",
  message = 'Try a different name, or clear your filters to browse the full Pokédex.',
  actionLabel,
  onAction,
}: {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-ink/10 bg-white/60 px-6 py-16 text-center dark:border-cream/10 dark:bg-navy-soft/60">
      <div className="rounded-full bg-cream-dim p-4 dark:bg-navy-line">
        <SearchX className="h-6 w-6 text-ink-soft dark:text-cream/60" strokeWidth={1.75} />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-ink-soft dark:text-cream/60">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-ink/85 dark:bg-cream dark:text-navy dark:hover:bg-cream/85"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
