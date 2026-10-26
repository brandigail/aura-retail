import { Trash2 } from "lucide-react";
import { deleteCode, setCodeActive } from "./code-actions";

export interface CodeRow {
  id: number;
  code: string;
  percent: number;
  active: boolean;
  maxUses: number | null;
  usesCount: number;
  expiresAt: string | null;
  /** Decided on the server when the rows are loaded. */
  expired: boolean;
}

const DATE = new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeZone: "Africa/Johannesburg" });
const ACTION =
  "inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** What a customer would experience with this code right now. */
function stateOf(row: CodeRow): { label: string; style: string } {
  if (!row.active) return { label: "Switched off", style: "border-border text-muted" };
  if (row.expired) return { label: "Expired", style: "border-red-600 text-red-700 dark:border-red-400 dark:text-red-300" };
  if (row.maxUses !== null && row.usesCount >= row.maxUses) return { label: "Fully used", style: "border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-300" };
  return { label: "Live", style: "border-green-700 text-green-700 dark:border-green-400 dark:text-green-300" };
}

export function CodesTable({ rows }: { rows: readonly CodeRow[] }) {
  if (rows.length === 0) {
    return <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted">No codes yet. Create one above and customers can use it at checkout.</p>;
  }

  return (
    <div className="relative overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="sr-only">Discount codes</caption>
        <thead className="bg-surface text-muted">
          <tr>
            <th scope="col" className="px-3 py-2.5 font-medium">Code</th>
            <th scope="col" className="px-3 py-2.5 text-right font-medium">Discount</th>
            <th scope="col" className="px-3 py-2.5 text-right font-medium">Used</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Last day</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
            <th scope="col" className="px-3 py-2.5 font-medium"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const state = stateOf(row);
            return (
              <tr key={row.id} className="border-t border-border align-top">
                <td className="px-3 py-3 font-mono font-semibold">{row.code}</td>
                <td className="px-3 py-3 text-right">{row.percent}%</td>
                <td className="px-3 py-3 text-right">{row.usesCount}{row.maxUses !== null ? ` of ${row.maxUses}` : ""}</td>
                <td className="px-3 py-3">{row.expiresAt ? DATE.format(new Date(row.expiresAt)) : <span className="text-muted">No end date</span>}</td>
                <td className="px-3 py-3">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${state.style}`}>{state.label}</span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    <form action={setCodeActive.bind(null, row.id, !row.active)}>
                      <button type="submit" className={ACTION}>
                        {row.active ? "Switch off" : "Switch on"}<span className="sr-only"> {row.code}</span>
                      </button>
                    </form>
                    <form action={deleteCode.bind(null, row.id)}>
                      <button type="submit" className={`${ACTION} text-red-700 dark:text-red-300`}>
                        <Trash2 aria-hidden className="size-4" />
                        Delete<span className="sr-only"> {row.code}</span>
                      </button>
                    </form>
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
