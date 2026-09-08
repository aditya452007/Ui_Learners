import Link from "next/link";
import type { ReactNode } from "react";

/* Shared page chrome: eyebrow, headers, scenario nav, code chips. */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
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
  alsoCalled?: string[];
  lede: string;
}) {
  return (
    <header className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
        {title}
      </h1>
      {alsoCalled && (
        <p className="mt-2 text-sm text-stone-500">
          Also called:{" "}
          <span className="font-medium text-stone-600">{alsoCalled.join(" · ")}</span>
        </p>
      )}
      <p className="mt-4 text-[15px] leading-7 text-stone-600">{lede}</p>
    </header>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-stone-200 bg-stone-100 px-1.5 py-0.5 font-mono text-[12px] text-stone-800">
      {children}
    </code>
  );
}

const SCENARIOS = [
  { href: "/scenarios/inspiration-board", label: "Inspiration board", hint: "photo wall" },
  { href: "/scenarios/recipe-magazine", label: "Recipe magazine", hint: "mixed text" },
  { href: "/scenarios/maker-shop", label: "Maker shop", hint: "ordering + loading" },
];

export function ScenarioNav({ active }: { active: string }) {
  return (
    <nav
      aria-label="Showcase pages"
      className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface p-2 shadow-[0_1px_2px_rgba(28,25,23,0.05)]"
    >
      <NavLink href="/" active={active === "hub"} label="Learning hub" hint="anatomy" />
      {SCENARIOS.map((s) => (
        <NavLink key={s.href} href={s.href} active={active === s.href} label={s.label} hint={s.hint} />
      ))}
    </nav>
  );
}

function NavLink({ href, active, label, hint }: { href: string; active: boolean; label: string; hint: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group flex items-baseline gap-2 rounded-xl px-3.5 py-2.5 text-sm transition-colors ${
        active
          ? "bg-stone-900 text-white shadow-sm"
          : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
      }`}
    >
      <span className="font-medium">{label}</span>
      <span className={`font-mono text-[10px] ${active ? "text-stone-300" : "text-stone-400"}`}>
        {hint}
      </span>
    </Link>
  );
}

export function WhyCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-red-900/15 bg-accent-soft/60 p-5 text-[14px] leading-6 text-stone-700">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
        Why masonry fits here
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 sm:px-6">
        <p className="font-mono text-[11px] text-stone-400">
          NameThatUI learning lab · Masonry Layout · also called waterfall layout · 瀑布流
        </p>
        <Link href="/" className="font-mono text-[11px] text-accent hover:underline">
          ← back to the learning hub
        </Link>
      </div>
    </footer>
  );
}
