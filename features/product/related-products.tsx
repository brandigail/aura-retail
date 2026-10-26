import { ProductCard } from "@/features/catalog/product-card";
import { getProductSummaries } from "@/lib/catalog-queries";

const SHOWN = 4;

/** Other products from the same category, best rated first. Renders nothing when there are none. */
export async function RelatedProducts({ productId, category }: { productId: number; category: string }) {
  const all = await getProductSummaries({ category, q: "", sort: "rating" });
  const related = all.filter((p) => p.id !== productId).slice(0, SHOWN);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="flex flex-col gap-4">
      <h2 id="related-heading" className="text-xl font-semibold">More in {category}</h2>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </ul>
    </section>
  );
}
