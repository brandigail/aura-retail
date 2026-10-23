export function CatalogSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading products" className="flex flex-col gap-6">
      <div className="h-11 animate-pulse rounded-md bg-surface" />
      <div className="h-10 animate-pulse rounded-full bg-surface" />
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i} className="overflow-hidden rounded-lg border border-border">
            <div className="aspect-[4/3] animate-pulse bg-surface" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-1/3 animate-pulse rounded bg-surface" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-surface" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-surface" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
