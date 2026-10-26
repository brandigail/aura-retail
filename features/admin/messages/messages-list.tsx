import { Mail, MailOpen, Trash2 } from "lucide-react";
import { deleteMessage, setMessageRead } from "./message-actions";

export interface MessageRow {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const DATE = new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Johannesburg" });
const ACTION =
  "inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function MessagesList({ rows }: { rows: readonly MessageRow[] }) {
  if (rows.length === 0) {
    return <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted">No messages yet. Customer enquiries from the contact page land here.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {rows.map((m) => (
        <li key={m.id} className={`rounded-lg border p-5 ${m.read ? "border-border" : "border-accent bg-accent/5"}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold">
                {m.name} {!m.read && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">New</span>}
              </p>
              <a href={`mailto:${m.email}?subject=Re: your message`} className="text-sm text-accent-text hover:underline">{m.email}</a>
            </div>
            <p className="text-sm text-muted">{DATE.format(new Date(m.createdAt))}</p>
          </div>
          <p className="mt-3 whitespace-pre-line">{m.message}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            <a href={`mailto:${m.email}?subject=Re: your message`} className={`${ACTION} text-accent-text`}>
              <Mail aria-hidden className="size-4" /> Reply by email
            </a>
            <form action={setMessageRead.bind(null, m.id, !m.read)}>
              <button type="submit" className={ACTION}>
                <MailOpen aria-hidden className="size-4" /> {m.read ? "Mark as unread" : "Mark as read"}
              </button>
            </form>
            <form action={deleteMessage.bind(null, m.id)}>
              <button type="submit" className={`${ACTION} text-red-700 dark:text-red-300`}>
                <Trash2 aria-hidden className="size-4" /> Delete
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
