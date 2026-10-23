import { count, lte } from "drizzle-orm";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { LOW_STOCK_THRESHOLD } from "@/lib/product-display";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [[productCount], [orderCount], [lowStockCount]] = await Promise.all([
    db.select({ n: count() }).from(products),
    db.select({ n: count() }).from(orders),
    db.select({ n: count() }).from(products).where(lte(products.stock, LOW_STOCK_THRESHOLD)),
  ]);

  const stats = [
    { label: "Products", value: productCount.n },
    { label: "Orders", value: orderCount.n },
    { label: "Low or out of stock", value: lowStockCount.n },
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
    </div>
  );
}
