import { Suspense } from "react";
import { AdminSkeleton } from "@/features/admin/admin-skeleton";
import { DualPrice } from "@/features/admin/dual-price";
import { requireAdmin } from "@/lib/admin-auth";
import { listCustomers } from "@/lib/admin-customer-queries";

const DATE = new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeZone: "Africa/Johannesburg" });

async function Customers() {
  await requireAdmin();
  const rows = await listCustomers();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="mt-1 text-muted">Everyone who has ordered, newest first. {rows.length} {rows.length === 1 ? "customer" : "customers"}.</p>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted">No customers yet. They appear here after their first order.</p>
      ) : (
        <div className="relative overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <caption className="sr-only">Customers</caption>
            <thead className="bg-surface text-muted">
              <tr>
                <th scope="col" className="px-3 py-2.5 font-medium">Customer</th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">Orders</th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">Total spent</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Last order</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.email} className="border-t border-border align-top">
                  <td className="px-3 py-3">
                    <p className="font-medium">{c.name}</p>
                    <a href={`mailto:${c.email}`} className="text-accent-text hover:underline">{c.email}</a>
                  </td>
                  <td className="px-3 py-3 text-right">{c.orderCount}</td>
                  <td className="px-3 py-3 text-right"><DualPrice cents={c.spent} className="items-end" /></td>
                  <td className="px-3 py-3 whitespace-nowrap">{DATE.format(new Date(c.lastOrderAt))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Customers />
    </Suspense>
  );
}
