import { Suspense } from "react";
import { Catalog } from "@/features/catalog/catalog";
import { CatalogSkeleton } from "@/features/catalog/catalog-skeleton";
import { HomeIntro } from "@/features/home/home-intro";

type RawParams = Record<string, string | string[] | undefined>;

/** The storefront intro is only for the plain home page; any search or filter goes straight to results. */
async function Intro({ searchParams }: { searchParams: Promise<RawParams> }) {
  const raw = await searchParams;
  if (raw.category || raw.q || raw.sort) return null;
  return <HomeIntro />;
}

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-8">
      <Suspense fallback={<div aria-hidden className="h-96 animate-pulse rounded-2xl bg-surface" />}>
        <Intro searchParams={searchParams} />
      </Suspense>
      <section id="shop" aria-labelledby="shop-heading" className="flex scroll-mt-24 flex-col gap-4">
        <h2 id="shop-heading" className="text-2xl font-bold tracking-tight">All products</h2>
        <Suspense fallback={<CatalogSkeleton />}>
          <Catalog searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  );
}
