/** What the client sends per cart line. Prices are only used to detect changes, never to charge. */
export interface CheckoutLine {
  productId: number;
  qty: number;
  unitPrice: number;
}

export type ConflictReason = "unavailable" | "stock" | "price";

/** A cart line that no longer matches the catalog, with the current server-side truth. */
export interface CheckoutConflict {
  productId: number;
  name: string;
  reason: ConflictReason;
  /** Current price in cents. */
  unitPrice: number;
  /** Units currently available (0 when unavailable). */
  stock: number;
  requested: number;
}

export type CheckoutField = "name" | "email" | "address";

export interface CheckoutFormState {
  status: "idle" | "error" | "conflict" | "success";
  message: string;
  errors: Partial<Record<CheckoutField, string>>;
  values: Record<CheckoutField, string>;
  conflicts: CheckoutConflict[];
  /** Set on success; used for the confirmation URL. */
  token: string | null;
}

export const initialCheckoutState: CheckoutFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: { name: "", email: "", address: "" },
  conflicts: [],
  token: null,
};
