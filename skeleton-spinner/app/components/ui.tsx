import Link from "next/link";

/* ---------- primitives ---------- */

export function Skeleton({
  className = "",
  shimmer = true,
  label,
}: {
  className?: string;
  shimmer?: boolean;
  label?: string;
}) {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      title={label}
      className={`skeleton rounded-md ${shimmer ? "skeleton-shimmer" : "skeleton-pulse"} ${className}`}
    />
  );
}

export function Spinner({
  size = 40,
  label = "Loading…",
  className = "",
  trackClass = "text-stone-200",
  arcClass = "text-teal-700",
}: {
  size?: number;
  label?: string;
  className?: string;
  trackClass?: string;
  arcClass?: string;
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="animate-spin-arc"
      >
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="currentColor"
          strokeWidth="4"
          className={trackClass}
        />
        <path
          d="M36 20a16 16 0 0 0-16-16"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className={arcClass}
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function NumPill({ n, active }: { n: number; active?: boolean }) {
  return (
    <span
      className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold tabular-nums ring-2 ring-white transition ${
        active ? "bg-teal-700 text-white" : "bg-stone-900 text-white"
      }`}
    >
      {n}
    </span>
  );
}

export function Token({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md border border-teal-800/10 bg-teal-50 px-1.5 py-0.5 font-mono text-[11px] font-medium text-teal-800">
      {children}
    </code>
  );
}

/* ---------- chrome ---------- */

export function TopBar() {
  return (
    <div className="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid size-7 place-items-center rounded-lg bg-stone-900 text-white">
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
              >
                <rect x="1.5" y="1.5" width="13" height="5" rx="1.5" />
                <rect x="1.5" y="9.5" width="8" height="2" rx="1" />
                <rect x="1.5" y="12.5" width="5" height="2" rx="1" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight">NameThatUi</span>
            <span className="hidden text-sm text-text-faint sm:inline">
              · Learning Lab
            </span>
          </Link>
        </div>
        <nav className="flex items-center gap-2 text-xs font-medium">
          <Link
            href="/scenarios/feed"
            className="hidden rounded-full border border-border bg-surface px-3 py-1.5 transition hover:border-accent hover:text-accent sm:inline-flex"
          >
            Feed
          </Link>
          <Link
            href="/scenarios/checkout"
            className="hidden rounded-full border border-border bg-surface px-3 py-1.5 transition hover:border-accent hover:text-accent sm:inline-flex"
          >
            Checkout
          </Link>
          <Link
            href="/scenarios/dashboard"
            className="rounded-full bg-stone-900 px-3 py-1.5 text-white transition hover:bg-teal-700"
          >
            Dashboard →
          </Link>
        </nav>
      </div>
    </div>
  );
}

export function ScenarioNav({
  prev,
  next,
}: {
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
}) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
      <Link
        href="/"
        className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:border-accent hover:text-accent"
      >
        ← Learning hub
      </Link>
      <div className="flex flex-wrap gap-2 text-sm">
        {prev && (
          <Link
            href={prev.href}
            className="rounded-full border border-border bg-surface px-4 py-2 font-medium transition hover:border-accent hover:text-accent"
          >
            ← {prev.label}
          </Link>
        )}
        {next && (
          <Link
            href={next.href}
            className="rounded-full bg-stone-900 px-4 py-2 font-medium text-white transition hover:bg-teal-700"
          >
            {next.label} →
          </Link>
        )}
      </div>
    </div>
  );
}
