"use client";

import { useActionState, useState } from "react";
import { adjustStock, type StockState } from "./stock-actions";

const initialState: StockState = { status: "idle", message: "" };

const FIELD =
  "rounded-md border border-border bg-background px-2 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function StockAdjustForm({ productId, productName }: { productId: number; productName: string }) {
  const [state, formAction, submitting] = useActionState(adjustStock.bind(null, productId), initialState);
  const [mode, setMode] = useState<"add" | "set">("add");

  return (
    <form action={formAction} className="flex flex-col items-start gap-1">
      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor={`mode-${productId}`}>Adjustment type for {productName}</label>
        {/* Controlled: a successful submit resets the form, which would otherwise flip "Set to" back to "Add / remove". */}
        <select id={`mode-${productId}`} name="mode" value={mode} onChange={(e) => setMode(e.target.value as "add" | "set")} className={FIELD}>
          <option value="add">Add / remove</option>
          <option value="set">Set to</option>
        </select>
        <label className="sr-only" htmlFor={`amount-${productId}`}>Amount for {productName}</label>
        <input
          id={`amount-${productId}`}
          name="amount"
          type="number"
          inputMode="numeric"
          step={1}
          required
          placeholder="e.g. 10 or -3"
          className={`${FIELD} w-28`}
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {submitting ? "Saving…" : "Apply"}
        </button>
      </div>
      {state.message && (
        <p role={state.status === "error" ? "alert" : "status"} className={`text-sm ${state.status === "error" ? "text-red-700 dark:text-red-300" : "text-muted"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
