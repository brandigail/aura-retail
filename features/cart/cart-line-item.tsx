"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { QuantityStepper } from "@/components/quantity-stepper";
import { Money } from "@/components/money";
import { PLACEHOLDER_IMAGE } from "@/lib/product-display";
import type { CartItem } from "@/types/cart";
import { useCart } from "./cart-provider";

interface CartLineItemProps {
  item: CartItem;
  /** Called when the product link is followed, e.g. to close the drawer. */
  onNavigate?: () => void;
}

export function CartLineItem({ item, onNavigate }: CartLineItemProps) {
  const { setItemQty, removeItem } = useCart();
  const atLimit = item.qty >= item.stock;

  return (
    <li className="flex gap-4 py-4">
      <Link
        href={`/products/${item.productId}`}
        onClick={onNavigate}
        className="relative size-20 shrink-0 overflow-hidden rounded-md border border-border bg-surface"
        tabIndex={-1}
        aria-hidden
      >
        <Image src={item.image ?? PLACEHOLDER_IMAGE} alt="" fill sizes="80px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${item.productId}`}
            onClick={onNavigate}
            className="font-medium leading-snug hover:text-accent-text hover:underline"
          >
            {item.name}
          </Link>
          <p className="shrink-0 text-right font-semibold"><Money cents={item.qty * item.unitPrice} stacked className="items-end" /></p>
        </div>
        <p className="text-sm text-muted"><Money cents={item.unitPrice} /> each</p>
        <div className="flex flex-wrap items-center gap-3">
          <QuantityStepper
            compact
            value={item.qty}
            max={item.stock}
            subject={`quantity of ${item.name}`}
            onChange={(next) => setItemQty(item.productId, next)}
          />
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            className="inline-flex items-center gap-1 rounded text-sm text-muted hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:hover:text-red-300"
          >
            <Trash2 aria-hidden className="size-4" />
            Remove<span className="sr-only"> {item.name}</span>
          </button>
        </div>
        {atLimit && <p className="text-sm text-amber-700 dark:text-amber-300">Maximum available quantity.</p>}
      </div>
    </li>
  );
}
