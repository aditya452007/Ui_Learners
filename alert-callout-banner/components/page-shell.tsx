import type { ReactNode } from "react";
import { SiteNav, type PageKey } from "@/components/site-nav";

export interface PageShellProps {
  navCurrent: PageKey;
  kicker: string;
  title: string;
  intro?: string;
  children: ReactNode;
}

export function PageShell({ navCurrent, kicker, title, intro, children }: PageShellProps) {
  return (
    <div className="min-h-screen">
      <SiteNav current={navCurrent} />
      <main className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-8 sm:py-16">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          {kicker}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {intro != null && (
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">{intro}</p>
        )}
        <div className="mt-10">{children}</div>
      </main>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-surface p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  note,
}: {
  children: ReactNode;
  note?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold tracking-tight text-ink">{children}</h2>
      {note != null && <p className="mt-1 text-sm leading-relaxed text-muted">{note}</p>}
    </div>
  );
}
