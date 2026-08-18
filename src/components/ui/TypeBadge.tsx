import { getTypeTheme } from '@/utils/typeColors';

export function TypeBadge({ type, size = 'sm' }: { type: string; size?: 'sm' | 'md' }) {
  const theme = getTypeTheme(type);
  const sizing = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3.5 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full font-display font-semibold uppercase tracking-wide ${sizing} shadow-sm`}
      style={{ background: theme.bg, color: theme.text }}
    >
      {type}
    </span>
  );
}
