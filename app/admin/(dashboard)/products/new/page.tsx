import { createProduct } from "@/features/admin/products/product-actions";
import { EMPTY_PRODUCT_VALUES } from "@/features/admin/products/product-form-state";
import { ProductForm } from "@/features/admin/products/product-form";
import { getAllCategories } from "@/lib/admin-product-queries";
import { requireAdmin } from "@/lib/admin-auth";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getAllCategories();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Add product</h1>
      <ProductForm action={createProduct} initialValues={EMPTY_PRODUCT_VALUES} categories={categories} submitLabel="Create product" />
    </div>
  );
}
