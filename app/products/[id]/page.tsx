import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductDetail, parseProductId } from "@/features/product/product-detail";
import { ProductSkeleton } from "@/features/product/product-skeleton";
import { getProductById } from "@/lib/product-queries";

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const productId = parseProductId(id);
  const product = productId === null ? null : await getProductById(productId);
  return product
    ? { title: `${product.name} | Aura Retail`, description: product.description }
    : { title: "Product not found | Aura Retail" };
}

export default function ProductPage({ params }: PageProps<"/products/[id]">) {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetail params={params} />
      </Suspense>
    </div>
  );
}
