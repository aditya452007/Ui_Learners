"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DataTable, { type ColumnDef } from "../../components/DataTable";

/* ------------------------------------------------------------------ */

interface FileRow {
  id: string;
  name: string;
  kind: "Folder" | "PDF" | "Image" | "Video" | "Sheet" | "Doc";
  sizeBytes: number | null; // folders have no file size
  modified: string; // ISO
}

const FILES: FileRow[] = [
  { id: "f1", name: "Brand guidelines", kind: "Folder", sizeBytes: null, modified: "2026-09-22" },
  { id: "f2", name: "Launch photos", kind: "Folder", sizeBytes: null, modified: "2026-09-20" },
  { id: "f3", name: "Homepage hero v3.mp4", kind: "Video", sizeBytes: 482_000_000, modified: "2026-09-24" },
  { id: "f4", name: "Q3 campaign report.pdf", kind: "PDF", sizeBytes: 4_200_000, modified: "2026-09-23" },
  { id: "f5", name: "Logo lockups.zip", kind: "Doc", sizeBytes: 86_000_000, modified: "2026-09-21" },
  { id: "f6", name: "Team offsite.png", kind: "Image", sizeBytes: 3_100_000, modified: "2026-09-19" },
  { id: "f7", name: "Pricing sheet.csv", kind: "Sheet", sizeBytes: 240_000, modified: "2026-09-18" },
  { id: "f8", name: "Packaging proof.pdf", kind: "PDF", sizeBytes: 18_700_000, modified: "2026-09-17" },
  { id: "f9", name: "Storefront banner.png", kind: "Image", sizeBytes: 5_600_000, modified: "2026-09-15" },
  { id: "f10", name: "Founder interview.mp4", kind: "Video", sizeBytes: 1_240_000_000, modified: "2026-09-12" },
  { id: "f11", name: "Press kit notes.doc", kind: "Doc", sizeBytes: 310_000, modified: "2026-09-10" },
  { id: "f12", name: "Ad spend Q3.csv", kind: "Sheet", sizeBytes: 96_000, modified: "2026-09-08" },
];

function fmtSize(bytes: number | null) {
  if (bytes === null) return "—";
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`;
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${Math.round(bytes / 1_000)} KB`;
}

function fmtDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function KindIcon({ kind }: { kind: FileRow["kind"] }) {
  if (kind === "Folder") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0 fill-amber-400">
        <path d="M1.5 3.5c0-.8.7-1.5 1.5-1.5h3l1.2 1.5h5.3c.8 0 1.5.7 1.5 1.5v6c0 .8-.7 1.5-1.5 1.5H3c-.8 0-1.5-.7-1.5-1.5v-7.5Z" />
      </svg>
    );
  }
  const fill =
    kind === "PDF" ? "#e11d48" : kind === "Image" ? "#0ea5e9" : kind === "Video" ? "#8b5cf6" : kind === "Sheet" ? "#059669" : "#64748b";
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      <path d="M4 1.5h5.5L13 5v9.5c0 .3-.2.5-.5.5h-8c-.3 0-.5-.2-.5-.5v-12c0-.3.2-.5.5-.5Z" fill={fill} opacity="0.85" />
      <path d="M9.5 1.5V5H13" fill="#ffffff" opacity="0.7" />
    </svg>
  );
}

const COLUMNS: ColumnDef<FileRow>[] = [
  {
    key: "name",
    label: "Name",
    defaultWidth: 250,
    accessor: (f) => f.name,
    render: (f) => (
      <span className="inline-flex max-w-full items-center gap-2">
        <KindIcon kind={f.kind} />
        <span className={`truncate ${f.kind === "Folder" ? "font-semibold text-slate-900" : ""}`}>{f.name}</span>
      </span>
    ),
  },
  {
    key: "size",
    label: "Size",
    numeric: true,
    defaultWidth: 110,
    accessor: (f) => f.sizeBytes ?? -1,
    render: (f) => fmtSize(f.sizeBytes),
  },
  {
    key: "modified",
    label: "Modified",
    defaultWidth: 140,
    accessor: (f) => f.modified,
    render: (f) => fmtDate(f.modified),
  },
  { key: "kind", label: "Kind", defaultWidth: 110, accessor: (f) => f.kind },
];

/* ------------------------------------------------------------------ */

export default function FileExplorer() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set(["f3"]));

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FILES;
    return FILES.filter(
      (f) => f.name.toLowerCase().includes(q) || f.kind.toLowerCase().includes(q)
    );
  }, [query]);

  const totalBytes = FILES.reduce((n, f) => n + (f.sizeBytes ?? 0), 0);
  const selBytes = FILES.filter((f) => selected.has(f.id)).reduce(
    (n, f) => n + (f.sizeBytes ?? 0),
    0
  );

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <nav className="flex items-center justify-between text-xs font-semibold">
        <Link href="/" className="text-teal-700 hover:underline">
          ← Hub
        </Link>
        <span className="flex gap-3 text-slate-400">
          <Link href="/scenarios/order-fulfillment" className="hover:text-teal-700 hover:underline">
            ← 1 · Orders
          </Link>
          <span className="text-slate-700">2 · Files</span>
          <Link href="/scenarios/stock-ledger" className="hover:text-teal-700 hover:underline">
            3 · Stock →
          </Link>
        </span>
      </nav>

      <header className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
          Scenario 2 · File manager
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Relay Drive — Details view
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          <strong className="font-semibold text-slate-700">Why a table fits here:</strong> finding a
          file means comparing names, sizes and dates side by side — the exact job Windows&apos;
          Details view and the Mac&apos;s table view were built for. Sorting by Size answers
          “what&apos;s eating my disk?”, sorting by Modified answers “what changed today?”.
        </p>
      </header>

      {/* path bar + search */}
      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <span className="rounded-lg bg-slate-100 px-2 py-1 text-slate-700">Relay Drive</span>
          <span aria-hidden="true">/</span>
          <span className="rounded-lg bg-slate-100 px-2 py-1 text-slate-700">Brand</span>
          <span aria-hidden="true">/</span>
          <span className="rounded-lg bg-teal-50 px-2 py-1 text-teal-800 ring-1 ring-inset ring-teal-700/15">Q3</span>
        </nav>
        <span className="text-xs text-slate-400">
          {visible.length} items · {fmtSize(totalBytes)} total
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search this folder…"
          aria-label="Search this folder"
          className="dt-input ml-auto w-52"
        />
      </div>

      {selected.size > 0 && (
        <p className="mt-2 text-xs text-slate-500" aria-live="polite">
          <strong className="font-semibold text-teal-800">{selected.size} selected</strong> ·{" "}
          {fmtSize(selBytes)} — click any row (or its checkbox) to toggle it.
        </p>
      )}

      {/* the table: resize persistence is the star here */}
      <div className="mt-3">
        <DataTable
          columns={COLUMNS}
          rows={visible}
          getRowId={(f) => f.id}
          label="Files in Q3"
          initialSort={{ key: "name", dir: "asc" }}
          selectedIds={selected}
          onSelectionChange={setSelected}
          storageKey="relay-drive"
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Edge handling</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Folders have no size, so they show an em dash and sort before files when ascending —
            just like a real explorer. Column widths are remembered in this browser: resize Name,
            reload the page, and your layout survives. Double-click any divider to snap it back.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Try it</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Sort by Size ↓ to spot the 1.2 GB interview footage, then by Modified to see what
            landed this week. Sizes stay right-aligned so “482.0 MB” and “96 KB” compare digit to
            digit.
          </p>
        </div>
      </div>
    </main>
  );
}
