import Link from "next/link";
import type { ReactNode } from "react";

export function ScenarioShell({
  kicker,
  title,
  context,
  why,
  config,
  prev,
  next,
  children,
}: {
  kicker: string;
  title: string;
  context: string;
  why: string;
  config: string[];
  prev: { href: string; label: string };
  next: { href: string; label: string };
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <nav aria-label="Breadcrumb">
          <Link
            href="/"
            className="text-sm font-medium text-[#0d9488] hover:underline"
          >
            ← Back to Bottom Navigation hub
          </Link>
        </nav>

        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#0d9488]">
            {kicker}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            {context}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {config.map((c) => (
              <span
                key={c}
                className="rounded-full bg-stone-100 px-2.5 py-0.5 font-mono text-[11px] text-stone-600"
              >
                {c}
              </span>
            ))}
          </div>
        </header>

        {children}

        <section className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-[#0d9488]/25 bg-[#e6f5f3]/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0d9488]">
              Why bottom nav fits here
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-700">
              {why}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href={prev.href}
              className="rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:border-[#0d9488]/40 hover:shadow-sm"
            >
              <p className="font-mono text-[11px] text-stone-400">← previous</p>
              <p className="mt-1 text-sm font-semibold text-stone-900">
                {prev.label}
              </p>
            </Link>
            <Link
              href={next.href}
              className="rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:border-[#0d9488]/40 hover:shadow-sm"
            >
              <p className="font-mono text-[11px] text-stone-400">next →</p>
              <p className="mt-1 text-sm font-semibold text-stone-900">
                {next.label}
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
