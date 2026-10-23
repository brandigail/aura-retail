export function ProductSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading product" className="flex flex-col gap-8">
      <div className="h-4 w-40 animate-pulse rounded bg-surface" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-[4/3] animate-pulse rounded-lg bg-surface" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-surface" />
          <div className="h-9 w-4/5 animate-pulse rounded bg-surface" />
          <div className="h-9 w-32 animate-pulse rounded bg-surface" />
          <div className="h-20 animate-pulse rounded bg-surface" />
          <div className="h-12 w-60 animate-pulse rounded bg-surface" />
        </div>
      </div>
    </div>
  );
}
