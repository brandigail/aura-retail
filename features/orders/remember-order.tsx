"use client";

import { useEffect } from "react";
import { rememberOrder } from "./my-orders-store";

/** Renders nothing. Opening an order page (right after checkout, or from an email link) adds it to "Your orders" on this device. */
export function RememberOrder({ token }: { token: string }) {
  useEffect(() => {
    rememberOrder(token);
  }, [token]);
  return null;
}
