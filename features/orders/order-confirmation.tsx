import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock } from "lucide-react";
import { Money } from "@/components/money";
import { isEmailConfigured } from "@/lib/mailer";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";
import { getNoticesForOrder, getOrderByToken } from "@/lib/order-queries";
import { getSettings } from "@/lib/settings";
import { OrderNotices } from "./order-notices";
import { RememberOrder } from "./remember-order";
import { OrderTotals } from "./order-totals";

const dateFormat = new Intl.DateTimeFormat("en-ZA", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Johannesburg" });

/** Awaits the params promise, so render it inside <Suspense>. */
export async function OrderConfirmation({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const order = await getOrderByToken(token);
  if (!order) notFound();
  const [notices, settings] = await Promise.all([getNoticesForOrder(order.id), getSettings()]);
  const awaitingEft = order.status === "pending" && order.paymentMethod?.startsWith("EFT");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <RememberOrder token={order.token} />
      <div className="flex flex-col items-center gap-2 text-center">
        {awaitingEft ? <Clock aria-hidden className="size-12 text-amber-600" /> : <CheckCircle2 aria-hidden className="size-12 text-accent" />}
        <h1 className="text-3xl font-bold tracking-tight">Thank you, {order.name.split(" ")[0]}!</h1>
        <p className="text-muted">
          Order #{order.id} was placed on {dateFormat.format(new Date(order.createdAt))}.
        </p>
        <p className="rounded-full border border-border px-3 py-1 text-sm font-medium">Status: {ORDER_STATUS_LABEL[order.status]}</p>
        <p className="text-sm text-muted">
          {isEmailConfigured()
            ? `We've emailed your confirmation to ${order.email}.`
            : `Demo store: no mail provider is connected, so the confirmation for ${order.email} is kept in the owner's Emails inbox instead of being sent.`}
        </p>
      </div>

      {awaitingEft && (
        <section aria-labelledby="eft-heading" className="rounded-lg border border-amber-600 bg-amber-50 p-5 text-amber-900 dark:border-amber-400 dark:bg-amber-950 dark:text-amber-100">
          <h2 id="eft-heading" className="text-xl font-semibold">Pay by bank transfer</h2>
          <p className="mt-1">
            Please pay <strong><Money cents={order.total} /></strong> using <strong>Order {order.id}</strong> as your payment reference. We ship as soon as the money reaches us.
          </p>
          {settings.bankDetails && <pre className="mt-3 whitespace-pre-wrap rounded-md bg-background/60 p-3 font-sans text-foreground">{settings.bankDetails}</pre>}
        </section>
      )}

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
              <span className="shrink-0 text-right font-medium"><Money cents={item.qty * item.unitPrice} stacked className="items-end" /></span>
            </li>
          ))}
        </ul>
        <OrderTotals order={order} vatPercent={settings.vatPercent} />
        <p className="mt-2 text-sm text-muted">Charged in US dollars. Rand amounts are approximate.</p>
      </section>

      <section aria-labelledby="delivery-heading" className="rounded-lg border border-border p-5">
        <h2 id="delivery-heading" className="mb-2 text-xl font-semibold">
          Delivery and payment
        </h2>
        <p className="font-medium">{order.name}</p>
        <p className="whitespace-pre-line text-muted">{order.address}</p>
        <p className="mt-2 text-muted">{order.email}</p>
        {order.paymentMethod && (
          <p className="mt-3 text-sm">
            <span className="text-muted">Payment: </span>
            {order.paymentMethod}
            {order.paymentRef && <span className="text-muted"> (ref {order.paymentRef})</span>}
          </p>
        )}
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Continue shopping
        </Link>
        <Link
          href="/track"
          className="rounded-md border border-border px-6 py-3 font-semibold hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Your orders
        </Link>
      </div>
    </div>
  );
}
