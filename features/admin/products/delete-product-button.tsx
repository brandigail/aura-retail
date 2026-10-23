"use client";

import { Trash2 } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { deleteProduct, type DeleteProductState } from "./product-actions";

interface DeleteProductButtonProps {
  productId: number;
  productName: string;
  /** True once the removal process has started and customers have been notified. */
  pending: boolean;
}

const initialState: DeleteProductState = { status: "idle", message: "" };

export function DeleteProductButton({ productId, productName, pending }: DeleteProductButtonProps) {
  const [state, formAction, submitting] = useActionState(
    async () => deleteProduct(productId),
    initialState,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (state.status !== "idle") dialogRef.current?.close();
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-red-700 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-red-300"
      >
        <Trash2 aria-hidden className="size-4" />
        {pending ? "Delete now" : "Delete"}
        <span className="sr-only"> {productName}</span>
      </button>
      {state.message && (
        <p role="status" className="mt-1 max-w-xs text-sm text-muted">
          {state.message}
        </p>
      )}
      <dialog
        ref={dialogRef}
        aria-labelledby={`delete-title-${productId}`}
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-lg border border-border bg-background p-6 text-foreground shadow-xl backdrop:bg-black/50"
      >
        <form action={formAction} className="flex flex-col gap-4">
          <h2 id={`delete-title-${productId}`} className="text-lg font-semibold">
            Delete {productName}?
          </h2>
          <p className="text-muted">
            {pending
              ? "This will delete the product if every affected customer has accepted the removal notice."
              : "If customers have paid or pending orders for this product, they will be notified and must accept before it is deleted. Until then it is hidden from the store. Otherwise it is deleted immediately."}{" "}
            Order history keeps its own copy of the name and price.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-md border border-border px-4 py-2 font-medium hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
              {submitting ? "Working…" : "Delete product"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
