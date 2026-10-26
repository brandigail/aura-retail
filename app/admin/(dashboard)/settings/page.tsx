import { Suspense } from "react";
import { AdminSkeleton } from "@/features/admin/admin-skeleton";
import { SettingsForm } from "@/features/admin/settings/settings-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getSettings } from "@/lib/settings";

async function Settings() {
  await requireAdmin();
  const settings = await getSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Store settings</h1>
        <p className="mt-1 text-muted">Everything customers see about your shop, in one place. Changes go live as soon as you save.</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Settings />
    </Suspense>
  );
}
