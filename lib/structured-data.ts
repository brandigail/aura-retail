import { salePrice } from "@/lib/money";
import type { Product } from "@/types/product";

/** schema.org Product data, so search engines can show price and availability. Prices are in US dollars. */
export function productJsonLd(product: Product, siteUrl: string, rating: { average: number | null; count: number }): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    image: product.images.map((src) => new URL(src, siteUrl).toString()),
    offers: {
      "@type": "Offer",
      url: new URL(`/products/${product.id}`, siteUrl).toString(),
      priceCurrency: "USD",
      price: (salePrice(product.price, product.discountPercent) / 100).toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(rating.average !== null && rating.count > 0
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: rating.average.toFixed(1), reviewCount: rating.count } }
      : {}),
  };
  // "<" is escaped so product text can never close the script tag.
  return JSON.stringify(data).replace(/</g, "\u003c");
}
