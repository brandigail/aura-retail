import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { formatMoney } from "@/lib/money";
import { getNoticesForOrder, getOrderByToken } from "@/lib/order-queries";
import { OrderNotices } from "./order-notices";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" });

/** Awaits the params promise, so render it inside <Suspense>. */
export async function OrderConfirmation({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const order = await getOrderByToken(token);
  if (!order) notFound();
  const notices = await getNoticesForOrder(order.id);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <CheckCircle2 aria-hidden className="size-12 text-accent" />
        <h1 className="text-3xl font-bold tracking-tight">Thank you, {order.name.split(" ")[0]}!</h1>
        <p className="text-muted">
          Order #{order.id} was placed on {dateFormat.format(new Date(order.createdAt))} UTC.
        </p>
        <p className="text-sm text-muted">Demo store: no payment was taken and no email was sent.</p>
      </div>

      <OrderNotices token={order.token} orderId={order.id} notices={notices} />

      <section aria-labelledby="items-heading" className="rounded-lg border border-border p-5">
        <h2 id="items-heading" className="mb-3 text-xl font-semibold">
          Items
        </h2>
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-3 py-2.5">
              <span>
                {item.name} <span className="text-muted">× {item.qty}</span>
              </span>
              <span className="shrink-0 font-medium">{formatMoney(item.qty * item.unitPrice)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between border-t border-border pt-3 text-lg font-bold">
          <span>Total</span>
          <span>{formatMoney(order.total)}</span>
        </p>
      </section>

      <section aria-labelledby="delivery-heading" className="rounded-lg border border-border p-5">
        <h2 id="delivery-heading" className="mb-2 text-xl font-semibold">
          Delivery
        </h2>
        <p className="font-medium">{order.name}</p>
        <p className="whitespace-pre-line text-muted">{order.address}</p>
        <p className="mt-2 text-muted">{order.email}</p>
      </section>

      <Link
        href="/"
        className="mx-auto rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Continue shopping
      </Link>
    </div>
  );
}
