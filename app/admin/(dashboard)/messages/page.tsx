import { desc } from "drizzle-orm";
import { Suspense } from "react";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { AdminSkeleton } from "@/features/admin/admin-skeleton";
import { MessagesList } from "@/features/admin/messages/messages-list";
import { requireAdmin } from "@/lib/admin-auth";

async function Messages() {
  await requireAdmin();
  const rows = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt), desc(contactMessages.id));
  const unread = rows.filter((r) => r.readAt === null).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="mt-1 text-muted">{unread} unread of {rows.length}. Replies go from your own email, so customers always hear from you directly.</p>
      </div>
      <MessagesList
        rows={rows.map((r) => ({ id: r.id, name: r.name, email: r.email, message: r.message, read: r.readAt !== null, createdAt: r.createdAt.toISOString() }))}
      />
    </div>
  );
}

export default function AdminMessagesPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Messages />
    </Suspense>
  );
}
