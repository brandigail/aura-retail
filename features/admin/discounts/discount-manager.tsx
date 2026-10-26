"use client";

import { useActionState, useMemo, useState } from "react";
import type { AdminProductRow } from "@/lib/admin-product-queries";
import { MAX_DISCOUNT_PERCENT } from "@/lib/money";
import { applyDiscount, type DiscountState } from "./discount-actions";
import { DiscountRow } from "./discount-row";

const initialState: DiscountState = { status: "idle", message: "" };
const PRESETS = [10, 20, 30, 50] as const;

const FIELD =
  "rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const BUTTON =
  "rounded-md px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

interface DiscountManagerProps {
  rows: readonly AdminProductRow[];
  categories: readonly string[];
  zarRate: number;
}

export function DiscountManager({ rows, categories, zarRate }: DiscountManagerProps) {
  const [state, formAction, submitting] = useActionState(applyDiscount, initialState);
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [percent, setPercent] = useState("");
  const [selected, setSelected] = useState<ReadonlySet<number>>(new Set());

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => (!category || r.category === category) && (!q || r.name.toLowerCase().includes(q)));
  }, [rows, category, query]);

  const allShownSelected = shown.length > 0 && shown.every((r) => selected.has(r.id));
  const parsed = Number(percent);
  const previewPercent = percent.trim() !== "" && Number.isInteger(parsed) && parsed >= 1 && parsed <= MAX_DISCOUNT_PERCENT ? parsed : null;
  // Only rows still in the list can be submitted; a changed filter must not leave hidden rows silently selected.
  const submitIds = shown.filter((r) => selected.has(r.id)).length;

  function toggle(id: number): void {
    setSelected((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  function toggleAllShown(): void {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const r of shown) {
        if (allShownSelected) next.delete(r.id);
        else next.add(r.id);
      }
      return next;
    });
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="discount-category" className="text-sm text-muted">Category</label>
          <select id="discount-category" value={category} onChange={(e) => setCategory(e.target.value)} className={FIELD}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="discount-search" className="text-sm text-muted">Search</label>
          <input id="discount-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Product name" className={`${FIELD} w-52`} />
        </div>
      </div>

      <div className="sticky top-0 z-10 flex flex-col gap-3 rounded-lg border border-border bg-background p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="discount-percent" className="text-sm text-muted">Discount (%)</label>
            <input
              id="discount-percent"
              name="percent"
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_DISCOUNT_PERCENT}
              step={1}
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              placeholder={`1 to ${MAX_DISCOUNT_PERCENT}`}
              className={`${FIELD} w-32`}
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Quick percentages">
            {PRESETS.map((p) => (
              <button key={p} type="button" onClick={() => setPercent(String(p))} className={`${BUTTON} border border-border hover:bg-surface`}>
                {p}%
              </button>
            ))}
          </div>
          <button type="submit" name="intent" value="apply" disabled={submitting || submitIds === 0 || previewPercent === null} className={`${BUTTON} bg-accent text-accent-foreground hover:opacity-90`}>
            {submitting ? "Saving…" : `Apply to ${submitIds} selected`}
          </button>
          <button type="submit" name="intent" value="remove" formNoValidate disabled={submitting || submitIds === 0} className={`${BUTTON} border border-border hover:bg-surface`}>
            Remove discount
          </button>
        </div>
        <p role={state.status === "error" ? "alert" : "status"} className={`min-h-5 text-sm ${state.status === "error" ? "text-red-700 dark:text-red-300" : "text-muted"}`}>
          {state.message || (selected.size > submitIds ? `${selected.size - submitIds} selected product${selected.size - submitIds === 1 ? " is" : "s are"} hidden by your filter and won't change.` : "")}
        </p>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted">No products match.</p>
      ) : (
        <div className="relative overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
            <caption className="sr-only">Products and their discounts</caption>
            <thead className="bg-surface text-muted">
              <tr>
                <th scope="col" className="px-3 py-2.5">
                  <input type="checkbox" checked={allShownSelected} onChange={toggleAllShown} aria-label="Select all shown products" className="size-5 accent-[#008080]" />
                </th>
                <th scope="col" className="px-3 py-2.5 font-medium">Product</th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">List price (USD / ZAR)</th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">Discount</th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">Customer pays</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => (
                <DiscountRow key={row.id} row={row} zarRate={zarRate} selected={selected.has(row.id)} previewPercent={previewPercent} onToggle={toggle} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </form>
  );
}
