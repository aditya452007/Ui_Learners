"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DataTable, { type ColumnDef } from "../../components/DataTable";

/* ------------------------------------------------------------------ */

interface Order {
  id: string;
  code: string;
  customer: string;
  items: number;
  total: number;
  placed: string; // ISO date — sorts correctly as a string
  status: "Unfulfilled" | "Shipped" | "Refunded";
}

const SEED: Order[] = [
  { id: "o1", code: "#1041", customer: "Acme Studios", items: 3, total: 248, placed: "2026-09-24", status: "Unfulfilled" },
  { id: "o2", code: "#1042", customer: "Briar & Co.", items: 1, total: 59, placed: "2026-09-24", status: "Unfulfilled" },
  { id: "o3", code: "#1043", customer: "Copperline", items: 8, total: 1120, placed: "2026-09-23", status: "Shipped" },
  { id: "o4", code: "#1044", customer: "Dovetail Labs", items: 2, total: 134, placed: "2026-09-23", status: "Unfulfilled" },
  { id: "o5", code: "#1045", customer: "Elmwood Health", items: 5, total: 689, placed: "2026-09-22", status: "Shipped" },
  { id: "o6", code: "#1046", customer: "Fable Goods", items: 12, total: 2040, placed: "2026-09-22", status: "Unfulfilled" },
  { id: "o7", code: "#1047", customer: "Granary Bank", items: 1, total: 89, placed: "2026-09-21", status: "Shipped" },
  { id: "o8", code: "#1048", customer: "Harbor Press", items: 4, total: 412, placed: "2026-09-21", status: "Unfulfilled" },
  { id: "o9", code: "#1049", customer: "Inkwell Co.", items: 6, total: 930, placed: "2026-09-20", status: "Shipped" },
  { id: "o10", code: "#1050", customer: "Juniper Outfit", items: 2, total: 176, placed: "2026-09-20", status: "Unfulfilled" },
  { id: "o11", code: "#1051", customer: "Kiln & Kilo", items: 9, total: 1510, placed: "2026-09-19", status: "Unfulfilled" },
  { id: "o12", code: "#1052", customer: "Larkspur Ltd.", items: 1, total: 45, placed: "2026-09-19", status: "Refunded" },
  { id: "o13", code: "#1053", customer: "Meadowlark", items: 7, total: 868, placed: "2026-09-18", status: "Shipped" },
  { id: "o14", code: "#1054", customer: "Northbeam", items: 3, total: 299, placed: "2026-09-18", status: "Unfulfilled" },
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function fmtDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function StatusPill({ status }: { status: Order["status"] }) {
  const cls =
    status === "Shipped"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
      : status === "Unfulfilled"
        ? "bg-amber-50 text-amber-700 ring-amber-600/25"
        : "bg-slate-100 text-slate-500 ring-slate-500/20";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cls}`}>
      {status}
    </span>
  );
}

const COLUMNS: ColumnDef<Order>[] = [
  { key: "code", label: "Order", defaultWidth: 96, accessor: (o) => o.code, render: (o) => <span className="font-mono text-[13px]">{o.code}</span> },
  { key: "customer", label: "Customer", defaultWidth: 180, accessor: (o) => o.customer },
  { key: "items", label: "Items", numeric: true, defaultWidth: 88, accessor: (o) => o.items },
  { key: "total", label: "Total", numeric: true, defaultWidth: 110, accessor: (o) => o.total, render: (o) => money.format(o.total) },
  { key: "placed", label: "Placed", defaultWidth: 110, accessor: (o) => o.placed, render: (o) => fmtDate(o.placed) },
  { key: "status", label: "Status", defaultWidth: 130, accessor: (o) => o.status, render: (o) => <StatusPill status={o.status} /> },
];

type Filter = "All" | "Unfulfilled" | "Shipped" | "Refunded";

/* ------------------------------------------------------------------ */

export default function OrderFulfillment() {
  const [orders, setOrders] = useState<Order[]>(SEED);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (filter === "All" || o.status === filter) &&
        (q === "" || o.customer.toLowerCase().includes(q) || o.code.toLowerCase().includes(q.replace("#", "")))
    );
  }, [orders, query, filter]);

  const unfulfilled = orders.filter((o) => o.status === "Unfulfilled").length;
  const revenue = orders
    .filter((o) => o.status !== "Refunded")
    .reduce((n, o) => n + o.total, 0);

  function bulk(next: Order["status"]) {
    setOrders((os) => os.map((o) => (selected.has(o.id) ? { ...o, status: next } : o)));
    setSelected(new Set());
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <nav className="flex items-center justify-between text-xs font-semibold">
        <Link href="/" className="text-teal-700 hover:underline">
          ← Hub
        </Link>
        <span className="flex gap-3 text-slate-400">
          <span className="text-slate-700">1 · Orders</span>
          <Link href="/scenarios/file-explorer" className="hover:text-teal-700 hover:underline">
            2 · Files →
          </Link>
        </span>
      </nav>

      <header className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
          Scenario 1 · Store admin
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Harbor &amp; Pine — order queue
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          <strong className="font-semibold text-slate-700">Why a table fits here:</strong> the
          warehouse crew scans dozens of orders a shift. Sortable columns surface the biggest or
          newest orders first, right-aligned money compares at a glance, and the checkbox column
          turns “ship these five” into one bulk click instead of five trips into detail pages.
        </p>
      </header>

      {/* stats */}
      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { t: "Unfulfilled", v: String(unfulfilled), d: "orders waiting in the queue" },
          { t: "Revenue (excl. refunds)", v: money.format(revenue), d: `across ${orders.length} orders` },
          { t: "Ticked", v: String(selected.size), d: "rows in the bulk basket" },
        ].map((s) => (
          <div key={s.t} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{s.t}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{s.v}</p>
            <p className="text-xs text-slate-500">{s.d}</p>
          </div>
        ))}
      </section>

      {/* controls */}
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customer or order…"
          aria-label="Search orders"
          className="dt-input w-56"
        />
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1" role="group" aria-label="Filter by status">
          {(["All", "Unfulfilled", "Shipped", "Refunded"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                filter === f ? "bg-white text-teal-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        {selected.size > 0 && (
          <div className="ml-auto flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-1.5 ring-1 ring-inset ring-teal-700/15">
            <span className="text-xs font-semibold text-teal-800" aria-live="polite">
              {selected.size} ticked
            </span>
            <button
              type="button"
              onClick={() => bulk("Shipped")}
              className="rounded-lg bg-teal-700 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-teal-800"
            >
              Mark shipped
            </button>
            <button
              type="button"
              onClick={() => bulk("Refunded")}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-rose-300 hover:text-rose-700"
            >
              Refund
            </button>
          </div>
        )}
      </div>

      {/* the table: pagination proves whole-data-set sorting */}
      <div className="mt-3">
        <DataTable
          columns={COLUMNS}
          rows={visible}
          getRowId={(o) => o.id}
          label="Orders"
          initialSort={{ key: "placed", dir: "desc" }}
          selectedIds={selected}
          onSelectionChange={setSelected}
          pageSize={6}
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Edge handling</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Sorting applies to <em>all</em> matching orders first, then the table pages — page 2
            stays correctly ordered. Search across customers and order numbers; an empty result
            shows a friendly empty row instead of a broken grid.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Try it</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Sort by Total ↓ to find the biggest orders, tick a few with the header dash-state, then
            hit “Mark shipped” and watch the stat cards move. Drag the dividers if Customer feels
            cramped.
          </p>
        </div>
      </div>
    </main>
  );
}
