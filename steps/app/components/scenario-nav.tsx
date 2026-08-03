import Link from "next/link";

export function ScenarioNav({
  prev,
  next,
}: {
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
}) {
  return (
    <nav
      aria-label="Scenario navigation"
      className="mt-14 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-6 text-sm"
    >
      <Link href="/" className="font-semibold text-indigo-600 hover:underline">
        ← Learning hub
      </Link>
      {prev && (
        <Link href={prev.href} className="text-slate-500 hover:text-slate-900 hover:underline">
          ← {prev.label}
        </Link>
      )}
      {next && (
        <Link
          href={next.href}
          className="ml-auto font-medium text-slate-700 hover:text-slate-900 hover:underline"
        >
          {next.label} →
        </Link>
      )}
    </nav>
  );
}
