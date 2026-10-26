import Link from "next/link";
import type { AdminProductRow } from "@/lib/admin-product-queries";
import { getStockStatus, stockLabel } from "@/lib/product-display";
import { ProductThumb } from "@/features/admin/product-thumb";
import { StockAdjustForm } from "./stock-adjust-form";

const STOCK_TEXT = {
  "in-stock": "",
  "low-stock": "text-amber-700 dark:text-amber-300",
  "out-of-stock": "text-red-700 dark:text-red-300",
} as const;

export function StockTable({ rows }: { rows: readonly AdminProductRow[] }) {
  if (rows.length === 0) {
    return <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted">No products yet.</p>;
  }

  return (
    <div className="relative overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="sr-only">Stock levels, lowest first</caption>
        <thead className="bg-surface text-muted">
          <tr>
            <th scope="col" className="px-3 py-2.5 font-medium">Product</th>
            <th scope="col" className="px-3 py-2.5 text-right font-medium">Stock</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Adjust</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = getStockStatus(row.stock);
            return (
              <tr key={row.id} className="border-t border-border align-top">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <ProductThumb src={row.image} />
                    <div>
                      <Link href={`/admin/products/${row.id}/edit`} className="font-medium hover:underline">{row.name}</Link>
                      <p className="text-muted">{row.category}</p>
                    </div>
                  </div>
                </td>
                <td className={`px-3 py-3 text-right font-semibold ${STOCK_TEXT[status]}`}>{row.stock}</td>
                <td className={`px-3 py-3 ${STOCK_TEXT[status]}`}>{stockLabel(row.stock)}</td>
                <td className="px-3 py-3"><StockAdjustForm productId={row.id} productName={row.name} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
