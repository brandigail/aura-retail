"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { CartItem } from "@/types/cart";
import {
  addItem,
  clearCart,
  getCartServerSnapshot,
  getCartSnapshot,
  reconcileItems,
  removeItem,
  setItemQty,
  subscribeCart,
} from "./cart-store";

interface CartContextValue {
  items: readonly CartItem[];
  /** False during SSR and hydration; use it to avoid flashing an empty cart. */
  ready: boolean;
  count: number;
  /** Integer cents. */
  subtotal: number;
  addItem: typeof addItem;
  setItemQty: typeof setItemQty;
  removeItem: typeof removeItem;
  reconcileItems: typeof reconcileItems;
  clearCart: typeof clearCart;
}

const CartContext = createContext<CartContextValue | null>(null);

const noopSubscribe = () => () => {};

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, getCartServerSnapshot);
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      subtotal: items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0),
      addItem,
      setItemQty,
      removeItem,
      reconcileItems,
      clearCart,
    }),
    [items, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
