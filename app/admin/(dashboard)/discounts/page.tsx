import { Suspense } from "react";
import { AdminSkeleton } from "@/features/admin/admin-skeleton";
import { DiscountManager } from "@/features/admin/discounts/discount-manager";
import { requireAdmin } from "@/lib/admin-auth";
import { listAdminProducts } from "@/lib/admin-product-queries";
import { getZarRate } from "@/lib/currency";

async function Discounts() {
  await requireAdmin();
  const rows = await listAdminProducts();
  const categories = [...new Set(rows.map((r) => r.category))].sort();
  const zarRate = getZarRate();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discounts</h1>
        <p className="mt-1 text-muted">
          Tick one or many products (or filter by category and select all), type a percentage and apply it. Rand amounts use R{zarRate} per $1
          and are for reference; customers are charged in dollars.
        </p>
      </div>
      <DiscountManager rows={rows} categories={categories} zarRate={zarRate} />
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
