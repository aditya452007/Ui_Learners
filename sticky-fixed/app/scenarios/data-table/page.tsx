"use client";

import { useMemo, useState } from "react";
import { ScenarioNav } from "../../components/scenario-nav";

type Row = {
  id: string;
  date: string;
  vendor: string;
  category: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
};

const VENDORS: [string, string][] = [
  ["Figma", "Design"],
  ["Vercel", "Hosting"],
  ["Notion", "Productivity"],
  ["AWS", "Infrastructure"],
  ["Slack", "Communication"],
  ["Stripe", "Fees"],
  ["Framer", "Design"],
  ["Linear", "Engineering"],
  ["Google Cloud", "Infrastructure"],
  ["Loom", "Communication"],
];

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function DataTablePage() {
  const [sticky, setSticky] = useState(true);
  const [stickyFirstCol, setStickyFirstCol] = useState(false);
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState("");

  const rows: Row[] = useMemo(
    () =>
      Array.from({ length: 64 }).map((_, i) => {
        const [vendor, category] = VENDORS[i % VENDORS.length];
        return {
          id: `INV-${2400 + i}`,
          date: `2026-0${(i % 9) + 1}-${String((i % 27) + 1).padStart(2, "0")}`,
          vendor: i % 11 === 0 ? `${vendor} (annual)` : vendor,
          category,
          amount: 18 + ((i * 137) % 2400),
          status: i % 13 === 0 ? "Overdue" : i % 4 === 0 ? "Pending" : "Paid",
        };
      }),
    []
  );

  const filtered = rows.filter(
    (r) =>
      query.trim() === "" ||
      `${r.vendor} ${r.id} ${r.category}`.toLowerCase().includes(query.toLowerCase())
  );
  const total = filtered.reduce((s, r) => s + r.amount, 0);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-6">
        <ScenarioNav
          current="/scenarios/data-table"
          note="Scenario 1 · Expense ledger — the canonical sticky: a thead pinned with top: 0 so long tables never lose their labels. Toggle stickiness off to feel how quickly 64 rows become unreadable."
        />
        <header className="max-w-3xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-teal-700">
            Scenario 1 · table headers · position: sticky + top: 0
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Expense ledger
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Acme Studio&apos;s finance intern exports 64 expense rows into a
            scrollable card. <strong>Why sticky fits here:</strong> the Date /
            Vendor / Amount labels must stay visible while the rows scroll —
            without them every number is meaningless. A fixed header would cover
            content outside the card; a sticky{" "}
            <code className="rounded bg-stone-100 px-1 font-mono text-[12px]">&lt;thead&gt;</code>{" "}
            stays glued only inside its own panel, then scrolls away with it.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            role="switch"
            aria-checked={sticky}
            onClick={() => setSticky((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 hover:border-teal-700/40"
          >
            <span className={`relative h-4 w-7 rounded-full transition-colors ${sticky ? "bg-teal-700" : "bg-stone-300"}`}>
              <span className={`absolute top-0.5 size-3 rounded-full bg-white shadow transition-all ${sticky ? "left-3.5" : "left-0.5"}`} />
            </span>
            sticky header {sticky ? "on" : "off"}
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={stickyFirstCol}
            onClick={() => setStickyFirstCol((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 hover:border-teal-700/40"
          >
            <span className={`relative h-4 w-7 rounded-full transition-colors ${stickyFirstCol ? "bg-teal-700" : "bg-stone-300"}`}>
              <span className={`absolute top-0.5 size-3 rounded-full bg-white shadow transition-all ${stickyFirstCol ? "left-3.5" : "left-0.5"}`} />
            </span>
            sticky first column
          </button>
          <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2">
            <label htmlFor="offset" className="font-mono text-[11px] text-stone-500">top =</label>
            <input
              id="offset"
              type="range"
              min={0}
              max={40}
              step={4}
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value))}
              className="h-1 w-24 accent-teal-700"
            />
            <span className="font-mono text-[11px] font-bold text-stone-900">{offset}px</span>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter vendor, id, category…"
            className="min-w-52 flex-1 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20 sm:max-w-72"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 bg-stone-50 px-5 py-3">
            <div>
              <p className="text-sm font-semibold text-stone-900">Q3 operating expenses</p>
              <p className="font-mono text-[11px] text-stone-500">
                {filtered.length} rows · total {money(total)} · container h-[420px] overflow-auto
              </p>
            </div>
            <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-bold ${sticky ? "bg-teal-700 text-white" : "bg-stone-200 text-stone-600"}`}>
              {sticky ? `thead sticky · top: ${offset}px` : "thead static — scrolls away"}
            </span>
          </div>
          <div className="thin-scroll h-[420px] overflow-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
              <thead>
                <tr>
                  {["Invoice", "Date", "Vendor", "Category", "Status", "Amount"].map((h, i) => (
                    <th
                      key={h}
                      scope="col"
                      style={sticky ? { top: offset } : undefined}
                      className={`${sticky ? "sticky z-10" : ""} border-b border-stone-200 bg-white/95 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500 backdrop-blur ${
                        stickyFirstCol && i === 0 ? "sticky left-0 shadow-[1px_0_0_#e7e5e4]" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} className={`border-b border-stone-100 transition-colors hover:bg-teal-50/50 ${i % 2 ? "bg-stone-50/60" : "bg-white"}`}>
                    <td className={`px-4 py-2.5 font-mono text-[12px] text-stone-500 ${stickyFirstCol ? "sticky left-0 bg-inherit" : ""}`}>
                      {r.id}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[12px] text-stone-600">{r.date}</td>
                    <td className="px-4 py-2.5 font-medium text-stone-800">{r.vendor}</td>
                    <td className="px-4 py-2.5 text-stone-600">{r.category}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          r.status === "Paid"
                            ? "bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-700/20"
                            : r.status === "Pending"
                              ? "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/20"
                              : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-semibold text-stone-900">
                      {money(r.amount)}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-stone-500">
                      No rows match “{query}”. Clear the filter to bring the ledger back.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 bg-stone-50 px-5 py-3 text-xs text-stone-600">
            <p>
              Scroll the card: the header row {sticky ? `pins at top: ${offset}px` : "scrolls away with the rows"}.
              {stickyFirstCol ? " Invoice column is pinned left too." : ""}
            </p>
            <p className="font-mono text-[11px] text-stone-400">th {"{ position: sticky; top: 0; }"} + solid bg</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-sm font-semibold text-stone-900">What you gain</p>
            <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
              Scanning 64 rows without losing the labels: fewer misread amounts,
              no scrolling back up to check which column is which. The header
              behaves like the frozen top row in a spreadsheet — because it is
              exactly that pattern, rebuilt with CSS.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-stone-900">⚠ Builder note</p>
            <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
              Sticky <code className="font-mono text-[12px]">th</code> cells need
              an opaque background — transparent headers show rows sliding
              underneath. And the threshold must clear any card toolbar above
              it: raise <code className="font-mono text-[12px]">top</code> to the
              toolbar&apos;s height or the header will tuck underneath.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
