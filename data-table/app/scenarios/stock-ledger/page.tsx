"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DataTable, { type ColumnDef } from "../../components/DataTable";

/* ------------------------------------------------------------------ */

interface Part {
  id: string;
  sku: string;
  name: string;
  onHand: number;
  reorderAt: number;
  unitCost: number;
}

const PARTS: Part[] = [
  { id: "p1", sku: "BRG-608", name: "Sealed bearing 608", onHand: 420, reorderAt: 150, unitCost: 2.4 },
  { id: "p2", sku: "BLT-M8x40", name: "Hex bolt M8×40", onHand: 88, reorderAt: 200, unitCost: 0.35 },
  { id: "p3", sku: "MTR-24V", name: "DC motor 24V 120W", onHand: 36, reorderAt: 25, unitCost: 48.9 },
  { id: "p4", sku: "BELT-720", name: "Timing belt 720mm", onHand: 12, reorderAt: 30, unitCost: 9.75 },
  { id: "p5", sku: "SEN-IR", name: "IR proximity sensor", onHand: 210, reorderAt: 80, unitCost: 6.2 },
  { id: "p6", sku: "CTRL-4CH", name: "Relay board 4ch", onHand: 64, reorderAt: 40, unitCost: 14.5 },
  { id: "p7", sku: "WIRE-22R", name: "Hookup wire 22AWG red", onHand: 9, reorderAt: 20, unitCost: 11.0 },
  { id: "p8", sku: "PSU-24-10", name: "Power supply 24V 10A", onHand: 27, reorderAt: 15, unitCost: 39.0 },
  { id: "p9", sku: "NUT-M8", name: "Flange nut M8", onHand: 510, reorderAt: 300, unitCost: 0.18 },
  { id: "p10", sku: "WHEEL-100", name: "Caster wheel 100mm", onHand: 44, reorderAt: 50, unitCost: 8.4 },
  { id: "p11", sku: "LCD-20x4", name: "LCD module 20×4", onHand: 73, reorderAt: 30, unitCost: 12.9 },
  { id: "p12", sku: "FUSE-5A", name: "Blade fuse 5A", onHand: 1200, reorderAt: 400, unitCost: 0.09 },
  { id: "p13", sku: "ENC-ROT", name: "Rotary encoder", onHand: 19, reorderAt: 25, unitCost: 4.6 },
  { id: "p14", sku: "FRAME-4040", name: "Alu extrusion 4040 1m", onHand: 58, reorderAt: 20, unitCost: 16.75 },
  { id: "p15", sku: "GREASE-1K", name: "Bearing grease 1kg", onHand: 6, reorderAt: 10, unitCost: 13.2 },
  { id: "p16", sku: "SW-LIM", name: "Limit switch roller", onHand: 145, reorderAt: 60, unitCost: 1.85 },
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
const money0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const valueOf = (p: Part) => p.onHand * p.unitCost;
const lowOf = (p: Part) => p.onHand <= p.reorderAt;

/* ------------------------------------------------------------------ */

export default function StockLedger() {
  const [zebra, setZebra] = useState(true);
  const [density, setDensity] = useState<"comfortable" | "compact">("compact");
  const [flags, setFlags] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set(["p4", "p7"]));

  const columns: ColumnDef<Part>[] = useMemo(
    () => [
      {
        key: "sku",
        label: "SKU",
        defaultWidth: 130,
        accessor: (p) => p.sku,
        render: (p) => <span className="font-mono text-[13px]">{p.sku}</span>,
      },
      {
        key: "name",
        label: "Part",
        defaultWidth: 220,
        accessor: (p) => p.name,
        render: (p) => (
          <span className="inline-flex max-w-full items-center gap-2">
            {flags && lowOf(p) && (
              <span
                className="inline-block size-2 shrink-0 rounded-full bg-amber-500"
                title="At or below reorder point"
                aria-label="Low stock"
                role="img"
              />
            )}
            <span className="truncate">{p.name}</span>
            {flags && lowOf(p) && (
              <span className="shrink-0 rounded-full bg-amber-50 px-2 py-px text-[11px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/25">
                Low
              </span>
            )}
          </span>
        ),
      },
      { key: "onHand", label: "On hand", numeric: true, defaultWidth: 100, accessor: (p) => p.onHand },
      { key: "reorderAt", label: "Reorder at", numeric: true, defaultWidth: 110, accessor: (p) => p.reorderAt },
      {
        key: "unitCost",
        label: "Unit cost",
        numeric: true,
        defaultWidth: 110,
        accessor: (p) => p.unitCost,
        render: (p) => money.format(p.unitCost),
      },
      {
        key: "value",
        label: "Stock value",
        numeric: true,
        defaultWidth: 130,
        accessor: valueOf,
        render: (p) => money0.format(valueOf(p)),
      },
    ],
    [flags]
  );

  const lowCount = PARTS.filter(lowOf).length;
  const totalValue = PARTS.reduce((n, p) => n + valueOf(p), 0);

  const reorder = useMemo(() => {
    const lines = PARTS.filter((p) => selected.has(p.id)).map((p) => {
      const qty = Math.max(0, p.reorderAt * 2 - p.onHand);
      return { ...p, qty, cost: qty * p.unitCost };
    });
    return { lines, total: lines.reduce((n, l) => n + l.cost, 0) };
  }, [selected]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <nav className="flex items-center justify-between text-xs font-semibold">
        <Link href="/" className="text-teal-700 hover:underline">
          ← Hub
        </Link>
        <span className="flex gap-3 text-slate-400">
          <Link href="/scenarios/file-explorer" className="hover:text-teal-700 hover:underline">
            ← 2 · Files
          </Link>
          <span className="text-slate-700">3 · Stock</span>
        </span>
      </nav>

      <header className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
          Scenario 3 · Inventory
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Northwind Parts — stock ledger
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          <strong className="font-semibold text-slate-700">Why a table fits here:</strong> a stock
          clerk compares quantities against reorder points across hundreds of SKUs. Four of the six
          columns are numbers, so right-alignment does the heavy lifting — and sorting by Stock
          value answers “where is my money sitting?” in one click.
        </p>
      </header>

      {/* stats */}
      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { t: "SKUs tracked", v: String(PARTS.length), d: "in this ledger view" },
          { t: "At / below reorder", v: String(lowCount), d: "parts flagged Low" },
          { t: "Total stock value", v: money0.format(totalValue), d: "on hand right now" },
        ].map((s) => (
          <div key={s.t} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{s.t}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{s.v}</p>
            <p className="text-xs text-slate-500">{s.d}</p>
          </div>
        ))}
      </section>

      {/* display controls */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <span className="inline-flex items-center gap-2 text-xs text-slate-500">
          <button type="button" role="switch" aria-checked={zebra} data-on={zebra} onClick={() => setZebra(!zebra)} className="dt-switch" aria-label="Toggle zebra stripes">
            <span />
          </button>
          zebra
        </span>
        <span className="inline-flex items-center gap-2 text-xs text-slate-500">
          <button type="button" role="switch" aria-checked={flags} data-on={flags} onClick={() => setFlags(!flags)} className="dt-switch" aria-label="Toggle low-stock flags">
            <span />
          </button>
          low-stock flags
        </span>
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1" role="group" aria-label="Row density">
          {(["comfortable", "compact"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDensity(d)}
              aria-pressed={density === d}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold capitalize transition ${
                density === d ? "bg-white text-teal-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-slate-400">header sticks while you scroll ↓</span>
      </div>

      <div className="mt-3 grid items-start gap-3 lg:grid-cols-[1fr_240px]">
        {/* the table: dense, sticky header, numeric emphasis */}
        <DataTable
          columns={columns}
          rows={PARTS}
          getRowId={(p) => p.id}
          label="Parts stock"
          initialSort={{ key: "value", dir: "desc" }}
          selectedIds={selected}
          onSelectionChange={setSelected}
          zebra={zebra}
          density={density}
          scrollHeight={430}
        />

        {/* reorder list side panel */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Reorder list</p>
          {reorder.lines.length === 0 ? (
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Tick low-stock rows in the ledger and they land here with a suggested top-up order.
            </p>
          ) : (
            <>
              <ul className="mt-2 space-y-2">
                {reorder.lines.map((l) => (
                  <li key={l.id} className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-inset ring-slate-200/60">
                    <p className="truncate text-xs font-semibold text-slate-800">{l.name}</p>
                    <p className="mt-0.5 text-[11px] tabular-nums text-slate-500">
                      order {l.qty} × {money.format(l.unitCost)} ={" "}
                      <strong className="font-semibold text-slate-700">{money.format(l.cost)}</strong>
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-500">
                Suggested order total{" "}
                <strong className="font-bold tabular-nums text-slate-900">{money.format(reorder.total)}</strong>
              </p>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="mt-2 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-teal-600/40 hover:text-teal-800"
              >
                Clear list
              </button>
            </>
          )}
        </aside>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Edge handling</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            The header sticks to the top of the scroll region so column names never leave sight.
            Turning stripes off shows how much harder rows are to follow — the toggle exists so you
            can feel the difference, not just read about it.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Try it</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Sort by On hand ↑ to bubble the thinnest shelves to the top, tick the Low rows, and
            watch the reorder list price the top-up. Switch density to comfortable if the compact
            rows feel cramped.
          </p>
        </div>
      </div>
    </main>
  );
}
