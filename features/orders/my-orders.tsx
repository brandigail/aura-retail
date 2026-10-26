"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useSyncExternalStore, useTransition } from "react";
import { PackageOpen } from "lucide-react";
import { Money } from "@/components/money";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";
import type { OrderStatus } from "@/types/order";
import { getMyOrders } from "./my-orders-actions";
import { forgetAllOrders, getOrdersServerSnapshot, getOrdersSnapshot, subscribeOrders } from "./my-orders-store";
import { initialMyOrdersState, type MyOrder, type MyOrdersState } from "./my-orders-types";

const DATE = new Intl.DateTimeFormat("en-ZA", { dateStyle: "long", timeZone: "Africa/Johannesburg" });
const noopSubscribe = () => () => {};
const MAX_THUMBS = 4;

const STEPS = ["Ordered", "Paid", "On its way"] as const;

/** How far along an order is: 1 = ordered, 2 = paid, 3 = shipped. Cancelled orders have no progress. */
function progressFor(status: OrderStatus): number {
  return status === "pending" ? 1 : status === "paid" ? 2 : status === "shipped" ? 3 : 0;
}

function Progress({ status }: { status: OrderStatus }) {
  if (status === "cancelled") return <p className="text-sm font-medium text-red-700 dark:text-red-300">This order was cancelled.</p>;
  const reached = progressFor(status);
  return (
    <ol aria-label={`Progress: ${ORDER_STATUS_LABEL[status]}`} className="grid grid-cols-3 gap-2">
      {STEPS.map((label, index) => (
        <li key={label} aria-current={index + 1 === reached ? "step" : undefined} className="flex flex-col gap-1.5">
          <span className={`h-1.5 rounded-full ${index < reached ? "bg-accent" : "bg-border"}`} />
          <span className={`text-xs ${index < reached ? "font-semibold text-foreground" : "text-muted"}`}>{label}</span>
        </li>
      ))}
    </ol>
  );
}

function OrderCard({ order }: { order: MyOrder }) {
  const shown = order.items.slice(0, MAX_THUMBS);
  const more = order.items.length - shown.length;
  const unitCount = order.items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <li className="overflow-hidden rounded-xl border border-border">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 bg-surface px-5 py-3 text-sm">
        <dl className="flex flex-wrap gap-x-8 gap-y-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Order placed</dt>
            <dd className="font-medium">{DATE.format(new Date(order.createdAt))}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Total</dt>
            <dd className="font-medium"><Money cents={order.total} /></dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Order number</dt>
            <dd className="font-medium">#{order.id}</dd>
          </div>
        </dl>
        <Link
          href={`/orders/${order.token}`}
          className="rounded-md border border-border bg-background px-4 py-2 font-semibold hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          View order<span className="sr-only"> #{order.id}</span>
        </Link>
      </div>
      <div className="flex flex-col gap-5 p-5">
        <div>
          <p className="mb-3 text-lg font-bold">{ORDER_STATUS_LABEL[order.status]}</p>
          <Progress status={order.status} />
        </div>
        <ul className="flex flex-wrap items-center gap-3" aria-label={`${unitCount} ${unitCount === 1 ? "item" : "items"} in this order`}>
          {shown.map((item, index) => (
            <li key={`${item.name}-${index}`} className="flex items-center gap-3">
              <span className="relative size-16 shrink-0 overflow-hidden rounded-md border border-border bg-surface">
                <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
              </span>
              <span className="max-w-[10rem] text-sm leading-snug">
                {item.name}
                {item.qty > 1 && <span className="text-muted"> × {item.qty}</span>}
              </span>
            </li>
          ))}
          {more > 0 && <li className="text-sm text-muted">and {more} more</li>}
        </ul>
      </div>
    </li>
  );
}

/** The orders placed from this device, shown automatically. No order number or email needed. */
export function MyOrders() {
  const tokens = useSyncExternalStore(subscribeOrders, getOrdersSnapshot, getOrdersServerSnapshot);
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [state, load] = useActionState(async (_previous: MyOrdersState, list: string[]) => getMyOrders(list), initialMyOrdersState);
  const [pending, startTransition] = useTransition();

  // `tokens` keeps the same identity until the stored list really changes, so this runs once per change.
  useEffect(() => {
    if (!ready || tokens.length === 0) return;
    startTransition(() => load([...tokens]));
  }, [ready, tokens, load]);

  if (!ready || (tokens.length > 0 && state.status === "idle")) {
    return <div aria-busy="true" aria-label="Loading your orders" className="flex flex-col gap-4"><div className="h-52 animate-pulse rounded-xl bg-surface" /></div>;
  }

  if (tokens.length === 0 || (state.status === "ready" && state.orders.length === 0)) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-4 py-12 text-center">
        <PackageOpen aria-hidden className="size-10 text-muted" />
        <p className="text-lg font-semibold">No orders on this device yet</p>
        <p className="max-w-md text-muted">When you place an order it shows up here straight away, with its progress. Orders from another device can be found below.</p>
        <Link href="/" className="mt-1 rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          Start shopping
        </Link>
      </div>
    );
  }

  if (state.status === "error") {
    return <p role="alert" className="rounded-lg border border-red-600 p-4 text-red-700 dark:border-red-400 dark:text-red-300">We couldn&apos;t load your orders right now. Please refresh the page.</p>;
  }

  return (
    <div className="flex flex-col gap-4" aria-busy={pending}>
      <ul className="flex flex-col gap-5">
        {state.orders.map((order) => (
          <OrderCard key={order.token} order={order} />
        ))}
      </ul>
      <button
        type="button"
        onClick={forgetAllOrders}
        className="self-start rounded text-sm text-muted underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Clear my orders from this device
      </button>
    </div>
  );
}
