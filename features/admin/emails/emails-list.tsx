import Link from "next/link";
import { ResendButton } from "./resend-button";

export interface EmailRow {
  id: number;
  toEmail: string;
  subject: string;
  body: string;
  html: string | null;
  kind: string;
  status: "recorded" | "sent" | "failed";
  error: string | null;
  orderId: number | null;
  createdAt: string;
}

const DATE = new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Johannesburg" });

const KIND_LABEL: Record<string, string> = {
  order_confirmation: "Order confirmation",
  order_shipped: "Shipped",
  order_cancelled: "Cancelled",
  order_lookup: "Order list",
};

const STATUS_STYLE = {
  sent: "border-green-700 text-green-700 dark:border-green-400 dark:text-green-300",
  recorded: "border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-300",
  failed: "border-red-600 text-red-700 dark:border-red-400 dark:text-red-300",
} as const;

const STATUS_TEXT = { sent: "Sent", recorded: "Not sent (no mail provider)", failed: "Failed" } as const;

export function EmailsList({ rows }: { rows: readonly EmailRow[] }) {
  if (rows.length === 0) {
    return <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted">No emails yet. Order confirmations and other messages appear here as they are sent.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {rows.map((m) => (
        <li key={m.id} className="rounded-lg border border-border">
          <details>
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              <span className="flex min-w-0 flex-col">
                <span className="font-medium">{m.subject}</span>
                <span className="text-sm text-muted">
                  To {m.toEmail} · {KIND_LABEL[m.kind] ?? m.kind} · {DATE.format(new Date(m.createdAt))}
                </span>
              </span>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[m.status]}`}>{STATUS_TEXT[m.status]}</span>
            </summary>
            <div className="flex flex-col gap-3 border-t border-border p-4">
              {m.error && <p className="text-sm text-red-700 dark:text-red-300">The mail provider said: {m.error}</p>}
              <div className="flex flex-wrap items-start gap-4">
                {/* One stable button, so its confirmation message survives the list refreshing when the status flips to Sent. */}
                <ResendButton id={m.id} label={m.status === "sent" ? "Send again" : "Send now"} />
                {m.orderId !== null && (
                  <Link href={`/admin/orders/${m.orderId}`} className="py-1.5 text-sm text-accent-text hover:underline">
                    View order #{m.orderId}
                  </Link>
                )}
              </div>
              {m.html ? (
                <iframe
                  title={`Preview of: ${m.subject}`}
                  sandbox=""
                  srcDoc={m.html}
                  className="h-[34rem] w-full rounded-md border border-border bg-white"
                />
              ) : (
                <pre className="whitespace-pre-wrap rounded-md bg-surface p-3 font-sans text-sm">{m.body}</pre>
              )}
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
