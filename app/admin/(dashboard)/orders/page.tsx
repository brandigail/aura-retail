import { Suspense } from "react";
import { AdminSkeleton } from "@/features/admin/admin-skeleton";
import { OrdersTable } from "@/features/admin/orders/orders-table";
import { requireAdmin } from "@/lib/admin-auth";
import { listAdminOrders } from "@/lib/admin-order-queries";
import { getZarRate } from "@/lib/settings";

async function Orders() {
  await requireAdmin();
  const rows = await listAdminOrders();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="mt-1 text-muted">{rows.length} {rows.length === 1 ? "order" : "orders"}, newest first.</p>
      </div>
      <OrdersTable rows={rows} zarRate={await getZarRate()} />
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Orders />
    </Suspense>
  );
}
