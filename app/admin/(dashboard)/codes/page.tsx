import { desc } from "drizzle-orm";
import { Suspense } from "react";
import { connection } from "next/server";
import { db } from "@/db";
import { discountCodes } from "@/db/schema";
import { AdminSkeleton } from "@/features/admin/admin-skeleton";
import { CodeForm } from "@/features/admin/codes/code-form";
import { CodesTable, type CodeRow } from "@/features/admin/codes/codes-table";
import { requireAdmin } from "@/lib/admin-auth";

async function loadCodeRows(): Promise<CodeRow[]> {
  await connection();
  const now = Date.now();
  const rows = await db.select().from(discountCodes).orderBy(desc(discountCodes.createdAt), desc(discountCodes.id));
  return rows.map((r) => ({
    id: r.id,
    code: r.code,
    percent: r.percent,
    active: r.active,
    maxUses: r.maxUses,
    usesCount: r.usesCount,
    expiresAt: r.expiresAt?.toISOString() ?? null,
    expired: r.expiresAt !== null && r.expiresAt.getTime() < now,
  }));
}

async function Codes() {
  await requireAdmin();
  const rows = await loadCodeRows();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discount codes</h1>
        <p className="mt-1 text-muted">
          Codes customers type at checkout for a percentage off their order. To put products on sale instead, use <em>Sales</em>.
        </p>
      </div>
      <CodeForm />
      <CodesTable rows={rows} />
    </div>
  );
}

export default function AdminCodesPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Codes />
    </Suspense>
  );
}
