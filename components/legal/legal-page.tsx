import Link from "next/link";
import type { ReactNode } from "react";

type Section = { heading: string; body: ReactNode };

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: ReactNode;
  sections: Section[];
}) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/login" className="text-sm text-muted-foreground hover:underline">
        ← Back
      </Link>
      <h1 className="mt-6 text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
      <div className="mt-6 leading-relaxed">{intro}</div>
      {sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="text-xl font-semibold">{section.heading}</h2>
          <div className="mt-2 space-y-2 leading-relaxed">{section.body}</div>
        </section>
      ))}
    </article>
  );
}
