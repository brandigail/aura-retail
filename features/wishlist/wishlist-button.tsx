"use client";

import { Heart } from "lucide-react";
import { useSyncExternalStore } from "react";
import { getWishlistServerSnapshot, getWishlistSnapshot, subscribeWishlist, toggleWishlist } from "./wishlist-store";

interface WishlistButtonProps {
  productId: number;
  productName: string;
  /** "icon" is a round heart for product cards; "labelled" is a full button for the product page. */
  variant?: "icon" | "labelled";
}

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function WishlistButton({ productId, productName, variant = "icon" }: WishlistButtonProps) {
  const ids = useSyncExternalStore(subscribeWishlist, getWishlistSnapshot, getWishlistServerSnapshot);
  const saved = ids.includes(productId);
  const heart = <Heart aria-hidden className={`size-5 ${saved ? "fill-accent text-accent-text" : ""}`} />;

  if (variant === "labelled") {
    return (
      <button
        type="button"
        onClick={() => toggleWishlist(productId)}
        aria-pressed={saved}
        className={`inline-flex h-12 items-center gap-2 rounded-md border border-border px-5 font-semibold hover:bg-surface ${FOCUS}`}
      >
        {heart}
        {saved ? "Saved to wishlist" : "Save to wishlist"}
        <span className="sr-only"> for {productName}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleWishlist(productId)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
      className={`inline-flex size-9 items-center justify-center rounded-full border border-border bg-background/90 shadow-sm backdrop-blur transition-colors hover:bg-surface ${FOCUS}`}
    >
      {heart}
    </button>
  );
}
