import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { AdminSkeleton } from "@/features/admin/admin-skeleton";
import { ProductsTable } from "@/features/admin/products/products-table";
import { requireAdmin } from "@/lib/admin-auth";
import { listAdminProducts } from "@/lib/admin-product-queries";
import { getZarRate } from "@/lib/settings";

async function ProductsList() {
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
      <ProductsTable rows={rows} zarRate={await getZarRate()} />
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <ProductsList />
    </Suspense>
  );
}
