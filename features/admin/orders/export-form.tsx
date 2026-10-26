import { Download } from "lucide-react";

const INPUT =
  "rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** A plain GET form: the browser downloads the file the export route returns. No script needed. */
export function ExportForm() {
  return (
    <form action="/admin/orders/export" method="get" className="flex flex-wrap items-end gap-3 rounded-lg border border-border p-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="export-status" className="text-sm text-muted">Status</label>
        <select id="export-status" name="status" defaultValue="all" className={INPUT}>
          <option value="all">All orders</option>
          <option value="pending">Waiting for payment</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="export-from" className="text-sm text-muted">From</label>
        <input id="export-from" name="from" type="date" className={INPUT} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="export-to" className="text-sm text-muted">To</label>
        <input id="export-to" name="to" type="date" className={INPUT} />
      </div>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Download aria-hidden className="size-4" />
        Download CSV
      </button>
      <p className="basis-full text-xs text-muted">Opens in Excel or Google Sheets. Leave the dates empty to include every order.</p>
    </form>
  );
}
