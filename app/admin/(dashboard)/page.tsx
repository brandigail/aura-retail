import { asc, lte } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/db";
import { products } from "@/db/schema";
import { AdminSkeleton } from "@/features/admin/admin-skeleton";
import { DualPrice } from "@/features/admin/dual-price";
import { SalesChart } from "@/features/admin/sales-chart";
import { requireAdmin } from "@/lib/admin-auth";
import { getSalesStats } from "@/lib/admin-order-queries";
import { getZarRate } from "@/lib/settings";
import { LOW_STOCK_THRESHOLD, stockLabel } from "@/lib/product-display";

const SALES_DAYS = 30;

async function Dashboard() {
  await requireAdmin();

  const [stats, lowStock] = await Promise.all([
    getSalesStats(SALES_DAYS),
    db
      .select({ id: products.id, name: products.name, stock: products.stock })
      .from(products)
      .where(lte(products.stock, LOW_STOCK_THRESHOLD))
      .orderBy(asc(products.stock), asc(products.name)),
  ]);
  const zarRate = await getZarRate();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border p-5">
          <dt className="text-sm text-muted">Revenue, last {SALES_DAYS} days</dt>
          <dd className="mt-1 text-2xl font-bold"><DualPrice cents={stats.revenue} zarRate={zarRate} /></dd>
        </div>
        <div className="rounded-lg border border-border p-5">
          <dt className="text-sm text-muted">Orders</dt>
          <dd className="mt-1 text-2xl font-bold">{stats.orders}</dd>
        </div>
        <div className="rounded-lg border border-border p-5">
          <dt className="text-sm text-muted">Average order</dt>
          <dd className="mt-1 text-2xl font-bold"><DualPrice cents={stats.averageOrder} zarRate={zarRate} /></dd>
        </div>
        <div className="rounded-lg border border-border p-5">
          <dt className="text-sm text-muted">Low or out of stock</dt>
          <dd className="mt-1 text-2xl font-bold">{lowStock.length}</dd>
        </div>
      </dl>

      <section aria-labelledby="sales-heading" className="rounded-lg border border-border p-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="sales-heading" className="text-xl font-semibold">Sales, last {SALES_DAYS} days</h2>
          <Link href="/admin/orders" className="text-accent hover:underline">View all orders</Link>
        </div>
        <SalesChart daily={stats.daily} zarRate={zarRate} />
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="top-heading" className="flex flex-col gap-3">
          <h2 id="top-heading" className="text-xl font-semibold">Best sellers</h2>
          {stats.topProducts.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-muted">No sales in this period yet.</p>
          ) : (
            <ol className="divide-y divide-border rounded-lg border border-border">
              {stats.topProducts.map((p, i) => (
                <li key={p.productId} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span>
                    <span className="mr-2 text-muted">{i + 1}.</span>
                    <span className="font-medium">{p.name}</span>
                    <span className="ml-2 text-sm text-muted">{p.units} sold</span>
                  </span>
                  <DualPrice cents={p.revenue} zarRate={zarRate} className="items-end" />
                </li>
              ))}
            </ol>
          )}
        </section>

        <section aria-labelledby="low-stock-heading" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="low-stock-heading" className="text-xl font-semibold">Low stock</h2>
            <Link href="/admin/stock" className="text-accent hover:underline">Manage stock</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-muted">Everything is well stocked.</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <Link href={`/admin/products/${p.id}/edit`} className="font-medium hover:underline">{p.name}</Link>
                  <span className={p.stock <= 0 ? "font-semibold text-red-700 dark:text-red-300" : "font-semibold text-amber-700 dark:text-amber-300"}>
                    {stockLabel(p.stock)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
