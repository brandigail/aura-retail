import { asc, count, lte } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { AdminSkeleton } from "@/features/admin/admin-skeleton";
import { requireAdmin } from "@/lib/admin-auth";
import { LOW_STOCK_THRESHOLD, stockLabel } from "@/lib/product-display";

async function Dashboard() {
  await requireAdmin();

  const [[productCount], [orderCount], lowStock] = await Promise.all([
    db.select({ n: count() }).from(products),
    db.select({ n: count() }).from(orders),
    db
      .select({ id: products.id, name: products.name, stock: products.stock })
      .from(products)
      .where(lte(products.stock, LOW_STOCK_THRESHOLD))
      .orderBy(asc(products.stock), asc(products.name)),
  ]);

  const stats = [
    { label: "Products", value: productCount.n },
    { label: "Orders", value: orderCount.n },
    { label: "Low or out of stock", value: lowStock.length },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <dl className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border p-5">
            <dt className="text-sm text-muted">{stat.label}</dt>
            <dd className="mt-1 text-3xl font-bold">{stat.value}</dd>
          </div>
        ))}
      </dl>
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
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
