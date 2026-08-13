import Link from "next/link";
import type { ReactNode } from "react";

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-indigo-600">
      {children}
    </p>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-stone-200 bg-stone-100 px-1.5 py-0.5 font-mono text-[0.85em] text-stone-800">
      {children}
    </code>
  );
}

export function WhyNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
        Why it fits here
      </p>
      <p className="mt-1.5 text-sm leading-6 text-stone-700">{children}</p>
    </div>
  );
}

export function ScenarioNav({
  nextHref,
  nextLabel,
}: {
  nextHref: string;
  nextLabel: string;
}) {
  return (
    <nav className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
      >
        ← Anatomy hub
      </Link>
      <Link
        href={nextHref}
        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500"
      >
        Next: {nextLabel} →
      </Link>
    </nav>
  );
}
