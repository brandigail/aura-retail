import { desc } from "drizzle-orm";
import { Suspense } from "react";
import { db } from "@/db";
import { emailOutbox } from "@/db/schema";
import { AdminSkeleton } from "@/features/admin/admin-skeleton";
import { EmailsList } from "@/features/admin/emails/emails-list";
import { requireAdmin } from "@/lib/admin-auth";
import { isEmailConfigured } from "@/lib/mailer";

const SHOWN = 100;

async function Emails() {
  await requireAdmin();
  const rows = await db.select().from(emailOutbox).orderBy(desc(emailOutbox.createdAt), desc(emailOutbox.id)).limit(SHOWN);
  const connected = isEmailConfigured();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Emails</h1>
        <p className="mt-1 text-muted">Every message the shop sends to customers, exactly as they see it. Open one to preview it.</p>
      </div>
      {connected ? (
        <p className="rounded-lg border border-green-700 bg-green-50 p-4 text-green-900 dark:border-green-400 dark:bg-green-950 dark:text-green-100">
          <strong>Email delivery is on.</strong> Customers receive these messages in their inbox.
        </p>
      ) : (
        <p role="note" className="rounded-lg border border-amber-600 bg-amber-50 p-4 text-amber-900 dark:border-amber-400 dark:bg-amber-950 dark:text-amber-100">
          <strong>No mail provider is connected yet.</strong> Messages are saved here but not delivered. Add the SMTP settings (SMTP_HOST, SMTP_USER, SMTP_PASS)
          to the shop&apos;s environment, then use <em>Send now</em> on any message.
        </p>
      )}
      <EmailsList
        rows={rows.map((r) => ({
          id: r.id,
          toEmail: r.toEmail,
          subject: r.subject,
          body: r.body,
          html: r.html,
          kind: r.kind,
          status: r.status,
          error: r.error,
          orderId: r.orderId,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}

export default function AdminEmailsPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Emails />
    </Suspense>
  );
}
