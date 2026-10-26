import Link from "next/link";
import { getCategories, getProductSummaries } from "@/lib/catalog-queries";
import { parseCatalogParams } from "./catalog-params";
import { FilterBar } from "./filter-bar";
import { ProductCard } from "./product-card";

interface CatalogProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Reads request-time search params, so render it inside <Suspense>. */
export async function Catalog({ searchParams }: CatalogProps) {
  const raw = await searchParams;
  const categories = await getCategories();
  const filters = parseCatalogParams(raw, categories);
  const items = await getProductSummaries(filters);
  const isFiltered = filters.category !== null || filters.q !== "";

  return (
    <div className="flex flex-col gap-6">
      <FilterBar filters={filters} categories={categories} />
      <p role="status" className="text-sm text-muted">
        {items.length} {items.length === 1 ? "product" : "products"}
        {filters.category ? ` in ${filters.category}` : ""}
        {filters.q ? ` matching “${filters.q}”` : ""}
      </p>
      {items.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <p className="text-lg font-semibold">No products found</p>
          <p className="mt-1 text-muted">Try a different search term or category.</p>
          {isFiltered && (
            <Link href="/" className="mt-4 inline-block font-medium text-accent-text underline underline-offset-4">
              Clear all filters
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
