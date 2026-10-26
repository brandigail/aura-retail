import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { AdminSkeleton } from "@/features/admin/admin-skeleton";
import { DualPrice } from "@/features/admin/dual-price";
import { NEXT_STATUSES } from "@/features/admin/orders/order-status";
import { OrderStatusForm } from "@/features/admin/orders/order-status-form";
import { StatusBadge } from "@/features/admin/orders/status-badge";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminOrder } from "@/lib/admin-order-queries";
import { OrderTotals } from "@/features/orders/order-totals";
import { getSettings } from "@/lib/settings";
import { parseProductId } from "@/lib/product-id";

const DATE = new Intl.DateTimeFormat("en-ZA", { dateStyle: "full", timeStyle: "short", timeZone: "Africa/Johannesburg" });

async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const id = parseProductId((await params).id);
  const order = id === null ? null : await getAdminOrder(id);
  if (id === null || !order) notFound();
  const settings = await getSettings();

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
        <ArrowLeft aria-hidden className="size-4" /> All orders
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Order #{order.id}</h1>
        <StatusBadge status={order.status} />
      </div>
      <p className="text-muted">Placed {DATE.format(new Date(order.createdAt))}</p>

      <section aria-labelledby="items-heading" className="rounded-lg border border-border p-5">
        <h2 id="items-heading" className="mb-3 text-xl font-semibold">Items</h2>
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.name}`} className="flex items-start justify-between gap-3 py-2.5">
              <span>
                {item.name} <span className="text-muted">× {item.qty}</span>
              </span>
              <DualPrice cents={item.qty * item.unitPrice} className="items-end" />
            </li>
          ))}
        </ul>
        <OrderTotals order={order} vatPercent={settings.vatPercent} />
      </section>

      <section aria-labelledby="payment-heading" className="rounded-lg border border-border p-5">
        <h2 id="payment-heading" className="mb-2 text-xl font-semibold">Payment</h2>
        <p>{order.paymentMethod ?? "Not recorded"}{order.paymentRef && <span className="text-muted"> (ref {order.paymentRef})</span>}</p>
        {order.status === "pending" && order.paymentMethod?.startsWith("EFT") && (
          <p className="mt-1 text-sm text-muted">Waiting for the bank transfer. Once the money arrives, mark the order as paid.</p>
        )}
      </section>

      <section aria-labelledby="customer-heading" className="rounded-lg border border-border p-5">
        <h2 id="customer-heading" className="mb-2 text-xl font-semibold">Customer</h2>
        <p className="font-medium">{order.name}</p>
        <a href={`mailto:${order.email}`} className="text-accent hover:underline">{order.email}</a>
        <p className="mt-2 whitespace-pre-line text-muted">{order.address}</p>
      </section>

      <section aria-labelledby="status-heading" className="rounded-lg border border-border p-5">
        <h2 id="status-heading" className="mb-3 text-xl font-semibold">Update status</h2>
        <OrderStatusForm orderId={order.id} next={NEXT_STATUSES[order.status]} />
      </section>
    </div>
  );
}

export default function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <OrderDetail params={params} />
    </Suspense>
  );
}
