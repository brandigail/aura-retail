import { Money } from "@/components/money";
import type { Order } from "@/types/order";

const SHIPPING_NAMES: Record<string, string> = { standard: "Standard delivery", express: "Express delivery" };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}

/** The price breakdown of a placed order. Orders from before itemised pricing show just their total. */
export function OrderTotals({ order, vatPercent }: { order: Order; vatPercent: number }) {
  const itemised = order.subtotal > 0;

  return (
    <dl className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
      {itemised && (
        <>
          <Row label="Subtotal"><Money cents={order.subtotal} /></Row>
          {order.discountCents > 0 && (
            <Row label={`Discount${order.discountCode ? ` (${order.discountCode})` : ""}`}>
              <span className="text-accent">-<Money cents={order.discountCents} /></span>
            </Row>
          )}
          <Row label={SHIPPING_NAMES[order.shippingMethod ?? ""] ?? "Delivery"}>
            {order.shippingCents === 0 ? <span className="font-medium text-accent">Free</span> : <Money cents={order.shippingCents} />}
          </Row>
        </>
      )}
      <div className="flex items-start justify-between gap-3 border-t border-border pt-3 text-lg font-bold">
        <dt>Total</dt>
        <dd className="text-right"><Money cents={order.total} stacked className="items-end" /></dd>
      </div>
      {order.vatCents > 0 && (
        <p className="text-xs text-muted">Includes {vatPercent}% VAT of <Money cents={order.vatCents} />.</p>
      )}
    </dl>
  );
}
