import { Suspense } from "react";
import { AdminSkeleton } from "@/features/admin/admin-skeleton";
import { createProduct } from "@/features/admin/products/product-actions";
import { EMPTY_PRODUCT_VALUES } from "@/features/admin/products/product-form-state";
import { ProductForm } from "@/features/admin/products/product-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllCategories } from "@/lib/admin-product-queries";

async function NewProduct() {
  await requireAdmin();
  const categories = await getAllCategories();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Add product</h1>
      <ProductForm action={createProduct} initialValues={EMPTY_PRODUCT_VALUES} categories={categories} submitLabel="Create product" />
    </div>
  );
}

export default function NewProductPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <NewProduct />
    </Suspense>
  );
}
