export function AdminSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="flex flex-col gap-4">
      <div className="h-9 w-48 animate-pulse rounded bg-surface" />
      <div className="h-48 animate-pulse rounded-lg bg-surface" />
    </div>
  );
}
