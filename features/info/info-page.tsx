import type { ReactNode } from "react";

interface InfoPageProps {
  title: string;
  intro?: string;
  children: ReactNode;
}

/** Shared layout for the shop's written pages: readable width, clear headings. */
export function InfoPage({ title, intro, children }: InfoPageProps) {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
      {intro && <p className="mt-3 text-lg text-muted">{intro}</p>}
      <div className="mt-8 flex flex-col gap-4 leading-relaxed [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5">
        {children}
      </div>
    </div>
  );
}
