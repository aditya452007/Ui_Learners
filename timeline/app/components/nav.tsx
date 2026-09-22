import Link from "next/link";

export function ScenarioNav({ prev, next }: { prev?: { href: string; label: string }; next?: { href: string; label: string } }) {
  return (
    <nav aria-label="Scenario navigation" className="flex flex-wrap items-center gap-2 text-xs">
      <Link
        href="/"
        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 shadow-sm transition hover:border-teal-600/40 hover:text-teal-800"
      >
        ← Hub
      </Link>
      <span className="hidden text-slate-300 sm:inline">·</span>
      <Link
        href="/scenarios/order-tracking"
        className="rounded-full px-3 py-1.5 font-medium text-slate-500 transition hover:bg-white hover:text-teal-800"
      >
        Order tracking
      </Link>
      <Link
        href="/scenarios/product-changelog"
        className="rounded-full px-3 py-1.5 font-medium text-slate-500 transition hover:bg-white hover:text-teal-800"
      >
        Changelog
      </Link>
      <Link
        href="/scenarios/team-activity"
        className="rounded-full px-3 py-1.5 font-medium text-slate-500 transition hover:bg-white hover:text-teal-800"
      >
        Activity
      </Link>
      <span className="ml-auto flex gap-2">
        {prev && (
          <Link
            href={prev.href}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 shadow-sm transition hover:border-teal-600/40 hover:text-teal-800"
          >
            ← {prev.label}
          </Link>
        )}
        {next && (
          <Link
            href={next.href}
            className="rounded-full bg-teal-700 px-3 py-1.5 font-semibold text-white shadow-sm transition hover:bg-teal-800"
          >
            {next.label} →
          </Link>
        )}
      </span>
    </nav>
  );
}
