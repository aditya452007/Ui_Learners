"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DataTable, {
  type ColumnDef,
  type SortState,
  type SpotlightPart,
} from "./components/DataTable";

/* ------------------------------------------------------------------ */
/* Demo data: seat renewals at a fictional SaaS called Northloop       */
/* ------------------------------------------------------------------ */

interface Renewal {
  id: string;
  customer: string;
  plan: string;
  seats: number;
  total: number;
  status: "Paid" | "Due soon" | "Overdue";
}

const RENEWALS: Renewal[] = [
  { id: "r1", customer: "Acme Studios", plan: "Team", seats: 24, total: 5760, status: "Paid" },
  { id: "r2", customer: "Briar & Co.", plan: "Starter", seats: 6, total: 1140, status: "Due soon" },
  { id: "r3", customer: "Copperline", plan: "Business", seats: 58, total: 20300, status: "Paid" },
  { id: "r4", customer: "Dovetail Labs", plan: "Team", seats: 17, total: 4080, status: "Overdue" },
  { id: "r5", customer: "Elmwood Health", plan: "Business", seats: 82, total: 28700, status: "Due soon" },
  { id: "r6", customer: "Fable Goods", plan: "Starter", seats: 4, total: 760, status: "Paid" },
  { id: "r7", customer: "Granary Bank", plan: "Enterprise", seats: 140, total: 63000, status: "Due soon" },
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function StatusPill({ status }: { status: Renewal["status"] }) {
  const cls =
    status === "Paid"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
      : status === "Due soon"
        ? "bg-amber-50 text-amber-700 ring-amber-600/25"
        : "bg-rose-50 text-rose-700 ring-rose-600/20";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cls}`}>
      {status}
    </span>
  );
}

const COLUMNS: ColumnDef<Renewal>[] = [
  { key: "customer", label: "Customer", defaultWidth: 190, accessor: (r) => r.customer },
  { key: "plan", label: "Plan", defaultWidth: 130, accessor: (r) => r.plan },
  { key: "seats", label: "Seats", numeric: true, defaultWidth: 96, accessor: (r) => r.seats },
  {
    key: "total",
    label: "Total",
    numeric: true,
    defaultWidth: 120,
    accessor: (r) => r.total,
    render: (r) => money.format(r.total),
  },
  {
    key: "status",
    label: "Status",
    defaultWidth: 130,
    accessor: (r) => r.status,
    render: (r) => <StatusPill status={r.status} />,
  },
];

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

function Explain({
  num,
  name,
  code,
  see,
  work,
  active,
  onEnter,
  onLeave,
}: {
  num: string;
  name: string;
  code: string;
  see: string;
  work: string;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
        active ? "border-teal-600/60 shadow-md" : "border-slate-200"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
          {num}
        </span>
        <p className="text-sm font-semibold text-slate-900">{name}</p>
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
          {code}
        </code>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-teal-50/70 p-3 ring-1 ring-inset ring-teal-700/10">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-700">
            What you see
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{see}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-200/70">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            How it works
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{work}</p>
        </div>
      </div>
    </div>
  );
}

function WildCard({
  href,
  kicker,
  title,
  text,
}: {
  href: string;
  kicker: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-600/40 hover:shadow-md"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-700">{kicker}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{text}</p>
      <p className="mt-3 text-xs font-semibold text-teal-700 group-hover:underline">
        Open the demo →
      </p>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Hub page                                                            */
/* ------------------------------------------------------------------ */

type PartId = Exclude<SpotlightPart, null>;

export default function Home() {
  const [sort, setSort] = useState<SortState>({ key: "total", dir: "desc" });
  const [selected, setSelected] = useState<Set<string>>(() => new Set(["r3", "r5"]));
  const [zebra, setZebra] = useState(true);
  const [spot, setSpot] = useState<SpotlightPart>(null);

  const sortedLabel = useMemo(
    () => COLUMNS.find((c) => c.key === sort.key)?.label ?? sort.key,
    [sort.key]
  );
  const all = selected.size === RENEWALS.length;
  const some = selected.size > 0 && !all;

  const pills: { id: PartId; title: string; live: string }[] = [
    {
      id: "select-all",
      title: "Select-all checkbox",
      live: all ? "every row ticked" : some ? `${selected.size} of ${RENEWALS.length} ticked — dash showing` : "none ticked — tick a row",
    },
    {
      id: "resize",
      title: "Column resize handle",
      live: "drag the dividers between headers",
    },
    {
      id: "sort",
      title: "Sort indicator",
      live: `${sortedLabel} ${sort.dir === "asc" ? "↑ ascending" : "↓ descending"}`,
    },
    {
      id: "selected",
      title: "Selected row",
      live: `${selected.size} row${selected.size === 1 ? "" : "s"} tinted teal`,
    },
    {
      id: "zebra",
      title: "Zebra stripes",
      live: zebra ? "every other row banded" : "stripes off — try the toggle",
    },
  ];

  function resetDemo() {
    setSort({ key: "total", dir: "desc" });
    setSelected(new Set(["r3", "r5"]));
    setZebra(true);
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      {/* ---------- header ---------- */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
          NameThatUI · Web component
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Data Table</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Also called: <strong className="font-semibold text-slate-700">data grid</strong>,{" "}
          <strong className="font-semibold text-slate-700">sortable table</strong>, table view
          (Apple&apos;s term), list view with columns, grid of records. A list of records with
          columns — one row per record, one column per field, under a header row you can click to
          sort.
        </p>
      </header>

      {/* ---------- what am I looking at ---------- */}
      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          {
            t: "① Header row",
            d: "Column names. Click one to sort every row by that field; the arrow marks the winner.",
          },
          {
            t: "② Body rows",
            d: "One record per row. Zebra bands help your eye travel left-to-right without slipping a line.",
          },
          {
            t: "③ Checkbox column",
            d: "Tick rows to act on them. The header box ticks everything — or shows a dash for “some”.",
          },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{c.t}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{c.d}</p>
          </div>
        ))}
      </section>

      {/* ---------- live anatomy ---------- */}
      <section className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Live anatomy</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
          The real thing — click it, drag it, tick it
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          This is a working table, not a picture. Sort a column and label{" "}
          <strong className="font-semibold text-slate-700">3</strong> follows the arrow. Tick rows
          and label <strong className="font-semibold text-slate-700">1</strong> counts up to the
          dash state. Hover any label to spotlight its part.
        </p>

        {/* live labels with leader stems */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {pills.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onMouseEnter={() => setSpot(p.id)}
              onMouseLeave={() => setSpot(null)}
              onFocus={() => setSpot(p.id)}
              onBlur={() => setSpot(null)}
              onClick={() => setSpot(spot === p.id ? null : p.id)}
              className={`relative rounded-xl border bg-white px-3 pb-3 pt-2.5 text-left shadow-sm transition ${
                spot === p.id ? "border-teal-600/60 shadow-md" : "border-slate-200"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="grid size-5 place-items-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-xs font-semibold text-slate-900">{p.title}</span>
              </span>
              <span className="mt-1 block text-[11px] leading-snug text-teal-800">{p.live}</span>
              <span
                aria-hidden="true"
                className={`mx-auto mt-2 block h-3 w-px ${spot === p.id ? "bg-teal-600" : "bg-slate-300"}`}
              />
            </button>
          ))}
        </div>

        <div className="mt-1">
          <DataTable
            columns={COLUMNS}
            rows={RENEWALS}
            getRowId={(r) => r.id}
            label="Seat renewals"
            sort={sort}
            onSortChange={setSort}
            selectedIds={selected}
            onSelectionChange={setSelected}
            zebra={zebra}
            spotlight={spot}
          />
        </div>

        {/* demo controls */}
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Try it:</span>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-teal-600/40 hover:text-teal-800"
          >
            Tick none
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set(["r2", "r4"]))}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-teal-600/40 hover:text-teal-800"
          >
            Tick two (dash!)
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set(RENEWALS.map((r) => r.id)))}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-teal-600/40 hover:text-teal-800"
          >
            Tick all
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={zebra}
            data-on={zebra}
            onClick={() => setZebra(!zebra)}
            className="dt-switch ml-1"
            aria-label="Toggle zebra stripes"
          >
            <span />
          </button>
          <span className="text-xs text-slate-500">zebra stripes</span>
          <button
            type="button"
            onClick={resetDemo}
            className="ml-auto rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-800"
          >
            Reset demo
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Tip: drag the thin dividers between column names to resize — hover a divider and it turns
          teal. Double-click a divider (or press ← → with it focused) to adjust precisely.
        </p>
      </section>

      {/* ---------- layered explanations ---------- */}
      <section className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
          Every part, in plain words
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
          What you see · how it works
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Left: the end-user view — what it feels like. Right: the builder view.{" "}
          <em>Props</em> are settings you hand a component. <em>State</em> is what it remembers
          between clicks. <em>Render</em> means drawing the screen again.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Explain
            num="1"
            name="Select-all checkbox"
            code="HTMLInputElement.indeterminate"
            see="The box at the top of the checkbox column. One click ticks every row; it shows a dash (–) instead of a tick when only some rows are ticked, so you can tell “some” apart from “all”."
            work="A real checkbox input whose dash is the indeterminate property — set from JavaScript, like flipping a sign to “half”. When you click it, an event (a message that something happened) replaces the remembered set of ticked ids with “everyone” or “nobody”, and the screen re-renders. Screen readers announce “some rows ticked”."
            active={spot === "select-all"}
            onEnter={() => setSpot("select-all")}
            onLeave={() => setSpot(null)}
          />
          <Explain
            num="2"
            name="Column resize handle"
            code="header.getResizeHandler()"
            see="The invisible divider at the right edge of each column name. Hover and the cursor turns into a left-right arrow; drag to give a cramped column more room."
            work="A thin grab strip that listens for drag events. While you drag, it updates a remembered widths map (state: one number per column, like a tailor's notes) and re-renders the table with the new sizes. Keyboard users get the same control with the arrow keys — try focusing a divider and pressing ← →."
            active={spot === "resize"}
            onEnter={() => setSpot("resize")}
            onLeave={() => setSpot(null)}
          />
          <Explain
            num="3"
            name="Sort indicator (sort arrow)"
            code='aria-sort="ascending"'
            see="The little arrow beside one column name. Up means A→Z / smallest first, down means the reverse. Click the header again and it flips."
            work="Clicking a header stores which column and direction win (state, like a bookmark). The rows are then re-sorted — the whole list, not just the visible page — and that header gets aria-sort, a code label that tells screen readers “this is the sorted column”. Only one column wears the arrow at a time."
            active={spot === "sort"}
            onEnter={() => setSpot("sort")}
            onLeave={() => setSpot(null)}
          />
          <Explain
            num="4"
            name="Selected row"
            code='aria-selected="true"'
            see="A ticked row turns a pale teal so it stands out from the gray zebra bands — your “shopping basket” of rows, ready for a bulk action like Ship or Refund."
            work="Each row checks “is my id in the ticked set?” when rendering. Matches get a tint class plus aria-selected, the code flag that marks them chosen for assistive tech. The tint is deliberately different from the zebra gray so selection never hides inside the stripes."
            active={spot === "selected"}
            onEnter={() => setSpot("selected")}
            onLeave={() => setSpot(null)}
          />
          <Explain
            num="5"
            name="Zebra stripes (alternating rows)"
            code="usesAlternatingRowBackgroundColors"
            see="Every other row wears a faint gray band, like ruled notebook paper rotated sideways — it keeps your eye on one row as you read across five columns."
            work="Stripes come from each row's position (even/odd) at render time, so they stay perfectly alternating after sorting or filtering — like re-numbering seats after people move. On the Mac this is one switch: usesAlternatingRowBackgroundColors. Numbers still line up on the right, where amounts are easiest to compare."
            active={spot === "zebra"}
            onEnter={() => setSpot("zebra")}
            onLeave={() => setSpot(null)}
          />
        </div>
      </section>

      {/* ---------- in code + not a table ---------- */}
      <section className="mt-10 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">In code</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              "<table> + <th scope=“col”>",
              'aria-sort="descending"',
              ".indeterminate (dash)",
              "NSTableView (Mac)",
              "SwiftUI Table",
              "shadcn <Table>",
              "MUI <DataGrid>",
            ].map((c) => (
              <code key={c} className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600">
                {c}
              </code>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Web: a real <code className="font-mono text-[11px]">&lt;table&gt;</code> with header and
            body sections. Mac: NSTableView under AppKit, or SwiftUI&apos;s Table with a bound sort
            order. Number columns sit right-aligned so digits compare at a glance.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
            What it is not
          </p>
          <ul className="mt-2 space-y-2 text-xs leading-relaxed text-slate-500">
            <li>
              <strong className="font-semibold text-slate-700">Not a spreadsheet</strong> — you
              can&apos;t type in the cells; rows are for reading, sorting and choosing.
            </li>
            <li>
              <strong className="font-semibold text-slate-700">Not an outline</strong> — rows never
              nest or collapse; one flat list, one record per row.
            </li>
            <li>
              <strong className="font-semibold text-slate-700">Not a phone list</strong> — on
              iPhone a table is a single column; the multi-column grid belongs to wider screens.
            </li>
          </ul>
        </div>
      </section>

      {/* ---------- scenarios ---------- */}
      <section className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
          Where it belongs
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
          Three places a data table earns its keep
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <WildCard
            href="/scenarios/order-fulfillment"
            kicker="Scenario 1 · Admin"
            title="Order fulfillment queue"
            text="Bulk selection with a dash-state header, whole-data-set sorting across pages, right-aligned money."
          />
          <WildCard
            href="/scenarios/file-explorer"
            kicker="Scenario 2 · Files"
            title="File manager details view"
            text="The Windows Details view, rebuilt: draggable dividers that persist, size/date sorting, row-click select."
          />
          <WildCard
            href="/scenarios/stock-ledger"
            kicker="Scenario 3 · Inventory"
            title="Parts stock ledger"
            text="A dense numeric ledger with sticky header, zebra + density toggles, low-stock flags and a reorder list."
          />
        </div>
      </section>

      <footer className="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-400">
        Built by hand with Next.js 16 + Tailwind v4 — no table library. Every behavior above is a
        few dozen lines of state, events and rendering.
      </footer>
    </main>
  );
}
