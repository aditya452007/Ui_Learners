import Link from "next/link";
import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">
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
  lede: string;
}) {
  return (
    <header className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900 sm:text-[44px] sm:leading-[1.05]">
        {title}
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        Also called: <span className="font-medium text-stone-700">{alsoCalled}</span>
      </p>
      <p className="mt-4 max-w-2xl text-[15.5px] leading-7 text-stone-600">{lede}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-md bg-stone-900 px-2 py-1 font-mono text-[11.5px] text-white">NSTokenField</span>
        <span className="rounded-md bg-stone-100 px-2 py-1 font-mono text-[11.5px] text-stone-700 ring-1 ring-inset ring-stone-200">
          NSTokenField.TokenStyle
        </span>
        <span className="rounded-md bg-stone-100 px-2 py-1 font-mono text-[11.5px] text-stone-700 ring-1 ring-inset ring-stone-200">
          NSTokenFieldDelegate
        </span>
      </div>
    </header>
  );
}

export function ScenarioNav({
  current,
}: {
  current?: string;
}) {
  const items = [
    { href: "/", label: "Learning hub" },
    { href: "/scenarios/mail-compose", label: "1 · Mail compose" },
    { href: "/scenarios/tagging", label: "2 · Note tagging" },
    { href: "/scenarios/team-invite", label: "3 · Team invite" },
  ];
  return (
    <nav aria-label="Showcase pages" className="flex flex-wrap gap-2">
      {items.map((it) => {
        const active = current === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              active
                ? "bg-stone-900 text-white"
                : "bg-white text-stone-600 ring-1 ring-inset ring-stone-200 hover:bg-stone-50 hover:text-stone-900"
            }`}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-stone-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Num({ n, tone = "blue" }: { n: number; tone?: "blue" | "ink" | "red" }) {
  const tones = {
    blue: "bg-blue-600 text-white",
    ink: "bg-stone-900 text-white",
    red: "bg-red-600 text-white",
  } as const;
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${tones[tone]}`}
    >
      {n}
    </span>
  );
}
