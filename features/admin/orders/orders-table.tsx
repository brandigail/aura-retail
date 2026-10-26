import Link from "next/link";
import { DualPrice } from "@/features/admin/dual-price";
import type { AdminOrderRow } from "@/lib/admin-order-queries";
import { StatusBadge } from "./status-badge";

const DATE = new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Johannesburg" });

export function OrdersTable({ rows, zarRate }: { rows: readonly AdminOrderRow[]; zarRate: number }) {
  if (rows.length === 0) {
    return <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted">No orders yet. They appear here as customers check out.</p>;
  }

  return (
    <div className="relative overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="sr-only">Orders, newest first</caption>
        <thead className="bg-surface text-muted">
          <tr>
            <th scope="col" className="px-3 py-2.5 font-medium">Order</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Customer</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Placed</th>
            <th scope="col" className="px-3 py-2.5 text-right font-medium">Items</th>
            <th scope="col" className="px-3 py-2.5 text-right font-medium">Total</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-border align-top">
              <td className="px-3 py-3">
                <Link href={`/admin/orders/${row.id}`} className="font-semibold text-accent hover:underline">
                  #{row.id}
                </Link>
              </td>
              <td className="px-3 py-3">
                <p className="font-medium">{row.name}</p>
                <p className="text-muted">{row.email}</p>
              </td>
              <td className="px-3 py-3 whitespace-nowrap">{DATE.format(new Date(row.createdAt))}</td>
              <td className="px-3 py-3 text-right">{row.itemCount}</td>
              <td className="px-3 py-3 text-right"><DualPrice cents={row.total} zarRate={zarRate} className="items-end" /></td>
              <td className="px-3 py-3"><StatusBadge status={row.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
