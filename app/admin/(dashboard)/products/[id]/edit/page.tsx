import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminSkeleton } from "@/features/admin/admin-skeleton";
import { updateProduct } from "@/features/admin/products/product-actions";
import { ProductForm } from "@/features/admin/products/product-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProduct, getAllCategories } from "@/lib/admin-product-queries";
import { parseProductId } from "@/lib/product-id";

async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const id = parseProductId((await params).id);
  const product = id === null ? null : await getAdminProduct(id);
  if (id === null || !product) notFound();

  const categories = await getAllCategories();
  const initialValues = {
    name: product.name,
    slug: product.slug,
    category: product.category,
    price: (product.price / 100).toFixed(2),
    stock: String(product.stock),
    description: product.description,
    specs: Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join("\n"),
    images: product.images.join("\n"),
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit product</h1>
      <ProductForm
        action={updateProduct.bind(null, id)}
        initialValues={initialValues}
        categories={categories}
        submitLabel="Save changes"
      />
    </div>
  );
}

export default function EditProductPage({ params }: PageProps<"/admin/products/[id]/edit">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <EditProduct params={params} />
    </Suspense>
  );
}
