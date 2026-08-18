const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

const MAX_STAT = 180; // comfortably above nearly all base stats, keeps bars readable

export function StatBar({
  statName,
  value,
  accent,
}: {
  statName: string;
  value: number;
  accent: string;
}) {
  const label = STAT_LABELS[statName] ?? statName;
  const pct = Math.min(100, Math.round((value / MAX_STAT) * 100));

  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-cream/60">
        {label}
      </span>
      <span className="w-8 shrink-0 font-mono-num text-sm font-semibold">{value}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-dim dark:bg-navy-line">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%`, background: accent }}
        />
      </div>
    </div>
  );
}
