import Link from "next/link";
import { Plus } from "lucide-react";
import { ProductsTable } from "@/features/admin/products/products-table";
import { listAdminProducts } from "@/lib/admin-product-queries";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminProductsPage() {
  await requireAdmin();
  const rows = await listAdminProducts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 font-semibold text-accent-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Plus aria-hidden className="size-5" />
          Add product
        </Link>
      </div>
      <ProductsTable rows={rows} />
    </div>
  );
}
