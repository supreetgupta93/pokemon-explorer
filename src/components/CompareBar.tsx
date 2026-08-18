import { Scale, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '@/context/CompareContext';

export function CompareBar() {
  const { selected, clear, toggle } = useCompare();
  const navigate = useNavigate();

  if (selected.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 animate-pop-in">
      <div className="flex items-center gap-3 rounded-full bg-ink px-4 py-2.5 text-cream shadow-2xl dark:bg-cream dark:text-navy">
        <Scale className="h-4 w-4 shrink-0" strokeWidth={2.25} />
        <div className="flex items-center gap-1.5">
          {selected.map((s) => (
            <span
              key={s.id}
              className="flex items-center gap-1 rounded-full bg-white/10 py-1 pl-2.5 pr-1 text-xs font-medium capitalize dark:bg-navy/10"
            >
              {s.name}
              <button
                type="button"
                onClick={() => toggle(s)}
                aria-label={`Remove ${s.name} from comparison`}
                className="rounded-full p-0.5 hover:bg-white/20 dark:hover:bg-navy/20"
              >
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>
        <button
          type="button"
          disabled={selected.length < 2}
          onClick={() => navigate(`/compare?a=${selected[0].name}&b=${selected[1]?.name ?? ''}`)}
          className="rounded-full bg-pokedex-red px-4 py-1.5 text-xs font-semibold text-white transition-opacity disabled:opacity-40"
        >
          Compare
        </button>
        <button
          type="button"
          onClick={clear}
          aria-label="Clear comparison selection"
          className="text-cream/60 hover:text-cream dark:text-navy/60 dark:hover:text-navy"
        >
          <X className="h-4 w-4" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
