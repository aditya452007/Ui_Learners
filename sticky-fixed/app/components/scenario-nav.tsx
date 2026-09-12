import Link from "next/link";

export const SCENARIOS = [
  {
    href: "/scenarios/data-table",
    tag: "Scenario 1 · table headers",
    title: "Expense ledger table",
    text: "Dozens of rows inside a scrollable card. The column header row sticks so amounts never lose their labels.",
  },
  {
    href: "/scenarios/grouped-feed",
    tag: "Scenario 2 · section headers",
    title: "Team chat history",
    text: "Messages grouped by day. Each date divider sticks, then gets pushed off by the next — trapped inside its panel.",
  },
  {
    href: "/scenarios/fixed-controls",
    tag: "Scenario 3 · viewport controls",
    title: "Product page buy bar",
    text: "A buy bar and help button pinned to the viewport itself. They survive every scroll container — until a transform traps them.",
  },
];

export function ScenarioNav({
  current,
  note,
}: {
  current?: string;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/"
          className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:border-teal-700/40 hover:text-teal-800"
        >
          ← Learning hub
        </Link>
        {SCENARIOS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            aria-current={current === s.href ? "page" : undefined}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              current === s.href
                ? "bg-stone-900 text-white"
                : "border border-stone-200 bg-white text-stone-600 hover:border-teal-700/40 hover:text-teal-800"
            }`}
          >
            {s.title}
          </Link>
        ))}
      </div>
      {note ? (
        <p className="mt-3 border-t border-stone-100 pt-3 text-[13px] leading-relaxed text-stone-600">
          {note}
        </p>
      ) : null}
    </div>
  );
}
