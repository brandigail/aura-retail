import { Suspense } from "react";
import { AdminSkeleton } from "@/features/admin/admin-skeleton";
import { StockTable } from "@/features/admin/stock/stock-table";
import { requireAdmin } from "@/lib/admin-auth";
import { listAdminProducts } from "@/lib/admin-product-queries";
import { LOW_STOCK_THRESHOLD } from "@/lib/product-display";

async function StockList() {
  await requireAdmin();
  const rows = (await listAdminProducts()).sort((a, b) => a.stock - b.stock || a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stock</h1>
        <p className="mt-1 text-muted">Lowest stock first. Items at {LOW_STOCK_THRESHOLD} or fewer are flagged as low.</p>
      </div>
      <StockTable rows={rows} />
    </div>
  );
}

export default function AdminStockPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <StockList />
    </Suspense>
  );
}
