import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "@/features/admin/login-form";
import { isAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Admin sign in | Aura Retail", robots: { index: false, follow: false } };

async function RedirectIfSignedIn() {
  if (await isAdmin()) redirect("/admin");
  return null;
}

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-16">
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin sign in</h1>
        <p className="mt-1 text-muted">Enter the admin password to manage products, stock and orders.</p>
      </div>
      <LoginForm />
    </div>
  );
}
