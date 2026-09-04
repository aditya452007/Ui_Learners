import Link from "next/link";
import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0071e3]">
      {children}
    </p>
  );
}

export function PageHeader({
  eyebrow,
  title,
  alsoCalled,
  lede,
}: {
  eyebrow: string;
  title: string;
  alsoCalled: string;
  lede: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
        {title}
      </h1>
      <p className="text-sm text-stone-500">
        Also called: <span className="font-medium text-stone-600">{alsoCalled}</span>
      </p>
      <div className="max-w-3xl text-[15px] leading-relaxed text-stone-600">{lede}</div>
    </header>
  );
}

export function ApiChips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((a) => (
        <code
          key={a}
          className="rounded-md border border-stone-200 bg-white px-2 py-1 font-mono text-[11px] text-stone-600"
        >
          {a}
        </code>
      ))}
    </div>
  );
}

export function WhyFit({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-[#0071e3]/25 bg-[#e8f1fd] px-5 py-4 text-sm leading-relaxed text-stone-700">
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#0071e3]">
        Why the window fits here
      </p>
      {children}
    </div>
  );
}

export function ConfigChips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((c) => (
        <span
          key={c}
          className="rounded-full border border-stone-200 bg-white px-2.5 py-1 font-mono text-[11px] text-stone-600"
        >
          {c}
        </span>
      ))}
    </div>
  );
}

export function BackLink({ href = "/", label = "All anatomy" }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-[#0071e3]"
    >
      <span aria-hidden>←</span> {label}
    </Link>
  );
}

export function ScenarioNav({
  prev,
  next,
}: {
  prev: { href: string; label: string };
  next: { href: string; label: string };
}) {
  return (
    <nav className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href={prev.href}
        className="group inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-[#0071e3]"
      >
        <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">←</span>
        <span>
          <span className="block text-[11px] font-normal uppercase tracking-wider text-stone-400">Previous</span>
          {prev.label}
        </span>
      </Link>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-[#0071e3]/40 hover:text-[#0071e3]"
      >
        Anatomy hub
      </Link>
      <Link
        href={next.href}
        className="group inline-flex items-center justify-end gap-2 text-right text-sm font-medium text-stone-600 transition-colors hover:text-[#0071e3]"
      >
        <span>
          <span className="block text-[11px] font-normal uppercase tracking-wider text-stone-400">Next</span>
          {next.label}
        </span>
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
      </Link>
    </nav>
  );
}
