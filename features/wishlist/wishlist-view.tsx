"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Price } from "@/components/price";
import { useCart } from "@/features/cart/cart-provider";
import { getStockStatus, stockLabel } from "@/lib/product-display";
import { salePrice } from "@/lib/money";
import { getWishlistProducts } from "./wishlist-actions";
import { getWishlistServerSnapshot, getWishlistSnapshot, removeFromWishlist, subscribeWishlist } from "./wishlist-store";
import { EMPTY_WISHLIST, type WishlistProduct, type WishlistState } from "./wishlist-types";

const noopSubscribe = () => () => {};
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function WishlistCard({ product, priority }: { product: WishlistProduct; priority: boolean }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const status = getStockStatus(product.stock);
  const inCart = items.find((i) => i.productId === product.id)?.qty ?? 0;
  const canAdd = product.stock > 0 && inCart < product.stock;

  return (
    <li className="flex flex-col overflow-hidden rounded-lg border border-border bg-background sm:flex-row">
      <Link href={`/products/${product.id}`} className={`relative aspect-[4/3] bg-surface sm:aspect-auto sm:w-48 sm:shrink-0 ${FOCUS}`}>
        <Image src={product.image} alt={product.name} fill priority={priority} sizes="(min-width: 640px) 12rem, 100vw" className={`object-cover ${status === "out-of-stock" ? "opacity-60" : ""}`} />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{product.category}</p>
          <h2 className="text-lg font-semibold leading-snug">
            <Link href={`/products/${product.id}`} className={`rounded hover:text-accent-text hover:underline ${FOCUS}`}>{product.name}</Link>
          </h2>
        </div>
        <Price price={product.price} discountPercent={product.discountPercent} />
        <p className={`text-sm font-medium ${status === "out-of-stock" ? "text-red-700 dark:text-red-300" : status === "low-stock" ? "text-amber-700 dark:text-amber-300" : "text-muted"}`}>
          {stockLabel(product.stock)}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!canAdd}
            onClick={() => {
              addItem(
                { productId: product.id, slug: product.slug, name: product.name, unitPrice: salePrice(product.price, product.discountPercent), stock: product.stock, image: product.image },
                1,
              );
              setAdded(true);
            }}
            className={`inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 font-semibold text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS}`}
          >
            <ShoppingCart aria-hidden className="size-5" />
            {product.stock <= 0 ? "Out of stock" : inCart >= product.stock ? "All stock in your cart" : "Add to cart"}
          </button>
          <button
            type="button"
            onClick={() => removeFromWishlist(product.id)}
            className={`inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted hover:bg-surface hover:text-foreground ${FOCUS}`}
          >
            <Trash2 aria-hidden className="size-4" />
            Remove<span className="sr-only"> {product.name} from wishlist</span>
          </button>
          <p role="status" className="text-sm text-muted">{added && inCart > 0 ? `${inCart} in your cart.` : ""}</p>
        </div>
      </div>
    </li>
  );
}

/** The products saved with the heart button on this device. */
export function WishlistView() {
  const ids = useSyncExternalStore(subscribeWishlist, getWishlistSnapshot, getWishlistServerSnapshot);
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [state, load] = useActionState(async (_previous: WishlistState, list: number[]) => getWishlistProducts(list), EMPTY_WISHLIST);
  const [, startTransition] = useTransition();

  // `ids` keeps the same identity until the saved list really changes.
  useEffect(() => {
    if (!ready || ids.length === 0) return;
    startTransition(() => load([...ids]));
  }, [ready, ids, load]);

  if (!ready || (ids.length > 0 && state.status === "idle")) {
    return <div aria-busy="true" aria-label="Loading your wishlist" className="h-56 animate-pulse rounded-xl bg-surface" />;
  }

  if (state.status === "error") {
    return <p role="alert" className="rounded-lg border border-red-600 p-4 text-red-700 dark:border-red-400 dark:text-red-300">We couldn&apos;t load your wishlist right now. Please refresh the page.</p>;
  }

  // Only show what is still saved, so removing an item disappears at once without waiting for another lookup.
  const shown = ids.length === 0 ? [] : state.products.filter((p) => ids.includes(p.id));

  if (shown.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-4 py-14 text-center">
        <Heart aria-hidden className="size-10 text-muted" />
        <p className="text-lg font-semibold">Your wishlist is empty</p>
        <p className="max-w-md text-muted">Tap the heart on any product to save it here for later. Your wishlist stays on this device.</p>
        <Link href="/" className={`mt-1 rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground hover:opacity-90 ${FOCUS}`}>
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p role="status" className="text-sm text-muted">{shown.length} {shown.length === 1 ? "item" : "items"} saved</p>
      <ul className="flex flex-col gap-4">
        {shown.map((product, index) => (
          <WishlistCard key={product.id} product={product} priority={index === 0} />
        ))}
      </ul>
    </div>
  );
}
