"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { CartLineItem } from "./cart-line-item";
import { useCart } from "./cart-provider";
import { CartSummary } from "./cart-summary";
import { EmptyCart } from "./empty-cart";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

/** A modal side panel on the native <dialog>, which gives focus trapping, Esc and inert background. */
export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, ready } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="cart-drawer-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="fixed inset-y-0 right-0 m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-background p-0 text-foreground shadow-xl backdrop:bg-black/50"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 id="cart-drawer-title" className="text-lg font-semibold">
            Your cart
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="inline-flex size-10 items-center justify-center rounded-md hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>

        {!ready ? null : items.length === 0 ? (
          <EmptyCart onNavigate={onClose} />
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-4">
              {items.map((item) => (
                <CartLineItem key={item.productId} item={item} onNavigate={onClose} />
              ))}
            </ul>
            <div className="flex flex-col gap-3 border-t border-border p-4">
              <CartSummary onNavigate={onClose} />
              <Link
                href="/cart"
                onClick={onClose}
                className="text-center text-sm font-medium text-accent underline underline-offset-4"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
