import { Suspense } from "react";
import { AdminSkeleton } from "@/features/admin/admin-skeleton";
import { DiscountManager } from "@/features/admin/discounts/discount-manager";
import { requireAdmin } from "@/lib/admin-auth";
import { listAdminProducts } from "@/lib/admin-product-queries";

async function Discounts() {
  await requireAdmin();
  const rows = await listAdminProducts();
  const categories = [...new Set(rows.map((r) => r.category))].sort();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discounts</h1>
        <p className="mt-1 text-muted">
          Tick one or many products (or filter by category and select all), type a percentage and apply it. Use the currency menu at the top to see prices in dollars, Rands or both; customers are always charged in dollars.
        </p>
      </div>
      <DiscountManager rows={rows} categories={categories} />
    </div>
  );
}

export default function AdminDiscountsPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Discounts />
    </Suspense>
  );
}
