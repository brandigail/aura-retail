import { Suspense } from "react";
import { Catalog } from "@/features/catalog/catalog";
import { CatalogSkeleton } from "@/features/catalog/catalog-skeleton";

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">PC hardware, sorted</h1>
        <p className="mt-1 text-muted">Processors, graphics cards, storage and more.</p>
      </header>
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
