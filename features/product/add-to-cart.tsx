"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/features/cart/cart-provider";
import { getProductImages } from "@/lib/product-display";
import type { Product } from "@/types/product";

export function AddToCart({ product }: { product: Product }) {
  const { items, addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const inCart = items.find((item) => item.productId === product.id)?.qty ?? 0;
  const remaining = Math.max(0, product.stock - inCart);

  if (product.stock <= 0) {
    return (
      <button type="button" disabled className="h-12 rounded-md bg-surface px-6 font-semibold text-muted">
        Out of stock
      </button>
    );
  }

  const quantity = Math.min(qty, Math.max(remaining, 1));

  function handleAdd(): void {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        unitPrice: product.price,
        stock: product.stock,
        image: getProductImages(product)[0],
      },
      quantity,
    );
    setAdded(true);
    setQty(1);
  }

  const stepper =
    "inline-flex size-12 items-center justify-center disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Quantity" className="inline-flex items-center rounded-md border border-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQty(quantity - 1)}
            className={stepper}
          >
            <Minus aria-hidden className="size-4" />
          </button>
          <span aria-live="polite" className="w-10 text-center font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={quantity >= remaining}
            onClick={() => setQty(quantity + 1)}
            className={stepper}
          >
            <Plus aria-hidden className="size-4" />
          </button>
        </div>
        <button
          type="button"
          disabled={remaining === 0}
          onClick={handleAdd}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-accent px-6 font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex-none"
        >
          <ShoppingCart aria-hidden className="size-5" />
          {remaining === 0 ? "All stock in your cart" : "Add to cart"}
        </button>
      </div>
      <p role="status" className="min-h-5 text-sm text-muted">
        {added && inCart > 0 ? `${inCart} in your cart.` : ""}
      </p>
    </div>
  );
}
