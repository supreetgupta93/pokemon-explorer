export function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-card)] dark:bg-navy-soft">
      <div className="shimmer h-28 w-full" />
      <div className="flex flex-col gap-3 p-4">
        <div className="shimmer h-3 w-10 rounded-full" />
        <div className="shimmer h-5 w-2/3 rounded-full" />
        <div className="flex gap-1.5 pt-1">
          <div className="shimmer h-5 w-14 rounded-full" />
          <div className="shimmer h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}
