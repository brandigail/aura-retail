import { AlertTriangle, Check } from "lucide-react";
import type { OrderNotice } from "@/types/order";
import { acknowledgeNotice } from "./notice-actions";

interface OrderNoticesProps {
  token: string;
  orderId: number;
  notices: readonly OrderNotice[];
}

export function OrderNotices({ token, orderId, notices }: OrderNoticesProps) {
  if (notices.length === 0) return null;

  return (
    <section aria-label="Important notices about your order" className="flex flex-col gap-3">
      {notices.map((notice) =>
        notice.acknowledgedAt === null ? (
          <div
            key={notice.id}
            role="alert"
            className="rounded-lg border border-amber-600 bg-amber-50 p-4 text-amber-900 dark:border-amber-400 dark:bg-amber-950 dark:text-amber-100"
          >
            <p className="flex items-center gap-2 font-semibold">
              <AlertTriangle aria-hidden className="size-5 shrink-0" />
              Important: a product in your order is being discontinued
            </p>
            <p className="mt-2">
              <strong>{notice.productName}</strong> from order #{orderId} is being removed from our store. Your order
              details stay on record, including the name and price you paid. Please confirm you have seen this notice.
            </p>
            <form action={acknowledgeNotice.bind(null, token, notice.id)} className="mt-3">
              <button
                type="submit"
                className="rounded-md bg-amber-900 px-4 py-2 font-semibold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-900 dark:bg-amber-100 dark:text-amber-950 dark:focus-visible:outline-amber-100"
              >
                OK, no problem
              </button>
            </form>
          </div>
        ) : (
          <p key={notice.id} className="flex items-center gap-2 text-sm text-muted">
            <Check aria-hidden className="size-4 shrink-0 text-accent-text" />
            You accepted the notice that {notice.productName} is being discontinued.
          </p>
        ),
      )}
    </section>
  );
}
