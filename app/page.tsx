import { ThemeToggle } from "@/features/theme/theme-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-3xl font-semibold text-accent">Aura Retail</h1>
      <ThemeToggle />
    </main>
  );
}
