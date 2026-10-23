import Link from "next/link";
import { Suspense } from "react";
import { Pencil } from "lucide-react";
import type { AdminProductRow } from "@/lib/admin-product-queries";
import { formatMoney } from "@/lib/money";
import { getStockStatus } from "@/lib/product-display";
import { DeleteProductButton } from "./delete-product-button";
import { DeletionPanel } from "./deletion-panel";

const STOCK_TEXT = {
  "in-stock": "",
  "low-stock": "text-amber-700 dark:text-amber-300",
  "out-of-stock": "text-red-700 dark:text-red-300",
} as const;

export function ProductsTable({ rows }: { rows: readonly AdminProductRow[] }) {
  if (rows.length === 0) {
    return <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted">No products yet.</p>;
  }

  return (
    // `relative` makes the wrapper contain (and clip) the absolutely positioned sr-only labels inside the table.
    <div className="relative overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="sr-only">Products</caption>
        <thead className="bg-surface text-muted">
          <tr>
            <th scope="col" className="px-3 py-2.5 font-medium">Name</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Category</th>
            <th scope="col" className="px-3 py-2.5 text-right font-medium">Price</th>
            <th scope="col" className="px-3 py-2.5 text-right font-medium">Stock</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
            <th scope="col" className="px-3 py-2.5 font-medium"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const pending = row.deletionRequestedAt !== null;
            return (
              <tr key={row.id} className="border-t border-border align-top">
                <td className="px-3 py-3">
                  <p className="font-medium">{row.name}</p>
                  <p className="text-muted">{row.slug}</p>
                  {pending && (
                    <Suspense fallback={<p className="mt-2 text-muted">Loading deletion status…</p>}>
                      <DeletionPanel productId={row.id} productName={row.name} />
                    </Suspense>
                  )}
                </td>
                <td className="px-3 py-3">{row.category}</td>
                <td className="px-3 py-3 text-right">{formatMoney(row.price)}</td>
                <td className={`px-3 py-3 text-right font-medium ${STOCK_TEXT[getStockStatus(row.stock)]}`}>{row.stock}</td>
                <td className="px-3 py-3">{pending ? "Pending deletion" : "Live"}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-col items-start gap-1">
                    <Link
                      href={`/admin/products/${row.id}/edit`}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-accent hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <Pencil aria-hidden className="size-4" />
                      Edit<span className="sr-only"> {row.name}</span>
                    </Link>
                    <DeleteProductButton productId={row.id} productName={row.name} pending={pending} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
