"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface SortState {
  key: string;
  dir: "asc" | "desc";
}

export interface ColumnDef<T> {
  /** Stable id for the column (used for sorting + widths). */
  key: string;
  /** Visible header label. */
  label: string;
  /** Numeric columns render right-aligned with tabular figures. */
  numeric?: boolean;
  /** Defaults to true. */
  sortable?: boolean;
  /** Starting width in px (ignored for the last column, which is fluid). */
  defaultWidth?: number;
  minWidth?: number;
  /** Raw value used for sorting. Keep dates as ISO strings so they sort. */
  accessor: (row: T) => string | number;
  /** Custom cell content. Defaults to the accessor value. */
  render?: (row: T) => React.ReactNode;
}

export type SpotlightPart =
  | "select-all"
  | "resize"
  | "sort"
  | "selected"
  | "zebra"
  | null;

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  label?: string;
  initialSort?: SortState;
  /** Controlled sort (the hub uses this so labels can chase the sort). */
  sort?: SortState;
  onSortChange?: (s: SortState) => void;
  selectable?: boolean;
  /** Controlled selection. */
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  defaultSelectedIds?: string[];
  resizable?: boolean;
  zebra?: boolean;
  density?: "comfortable" | "compact";
  /** When set, the table paginates — sorting still applies to ALL rows first. */
  pageSize?: number;
  /** Sticky-header scroll region height in px (for long ledgers). */
  scrollHeight?: number;
  /** Persist column widths in localStorage under this key. */
  storageKey?: string;
  spotlight?: SpotlightPart;
  emptyNote?: string;
}

const CHECK_W = 44;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function compareValues(a: string | number, b: string | number): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

function widthOf<T>(col: ColumnDef<T>): number {
  return col.defaultWidth ?? (col.numeric ? 120 : 170);
}
function minOf<T>(col: ColumnDef<T>): number {
  return col.minWidth ?? 84;
}

/* ------------------------------------------------------------------ */
/* DataTable — hand-built, no dependencies                             */
/* ------------------------------------------------------------------ */

export default function DataTable<T>({
  columns,
  rows,
  getRowId,
  label = "Data table",
  initialSort,
  sort: controlledSort,
  onSortChange,
  selectable = true,
  selectedIds: controlledSelected,
  onSelectionChange,
  defaultSelectedIds = [],
  resizable = true,
  zebra = true,
  density = "comfortable",
  pageSize,
  scrollHeight,
  storageKey,
  spotlight = null,
  emptyNote = "No rows match. Clear the search or filter to see the full data set.",
}: DataTableProps<T>) {
  /* ---- sort (controlled or internal) ---- */
  const firstSortable = columns.find((c) => c.sortable !== false);
  const [innerSort, setInnerSort] = useState<SortState>(
    initialSort ?? { key: firstSortable?.key ?? "", dir: "asc" }
  );
  const sort = controlledSort ?? innerSort;
  const setSort = (s: SortState) => {
    if (!controlledSort) setInnerSort(s);
    onSortChange?.(s);
  };

  /* ---- selection (controlled or internal) ---- */
  const [innerSelected, setInnerSelected] = useState<Set<string>>(
    () => new Set(defaultSelectedIds)
  );
  const selected = controlledSelected ?? innerSelected;
  const setSelected = (next: Set<string>) => {
    if (!controlledSelected) setInnerSelected(next);
    onSelectionChange?.(next);
  };

  /* ---- column widths (+ optional persistence) ---- */
  const [widths, setWidths] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const c of columns) init[c.key] = widthOf(c);
    if (storageKey && typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem(`dt-widths:${storageKey}`);
        if (saved) {
          const parsed = JSON.parse(saved) as Record<string, number>;
          for (const c of columns) {
            if (typeof parsed[c.key] === "number") {
              init[c.key] = Math.max(minOf(c), Math.min(560, parsed[c.key]));
            }
          }
        }
      } catch {
        /* corrupted value — fall back to defaults */
      }
    }
    return init;
  });
  useEffect(() => {
    if (!storageKey) return;
    try {
      window.localStorage.setItem(`dt-widths:${storageKey}`, JSON.stringify(widths));
    } catch {
      /* storage full or blocked — widths still work for this session */
    }
  }, [widths, storageKey]);

  const dragRef = useRef<{ key: string; startX: number; startW: number } | null>(null);
  const [dragKey, setDragKey] = useState<string | null>(null);

  /* ---- pagination ---- */
  const [page, setPage] = useState(0);
  useEffect(() => {
    setPage(0);
  }, [rows.length, sort.key, sort.dir, pageSize]);

  /* ---- header checkbox indeterminate dash ---- */
  const headCheckRef = useRef<HTMLInputElement | null>(null);

  /* ---- derived: sort the WHOLE data set, then slice the page ---- */
  const sortedRows = useMemo(() => {
    const col = columns.find((c) => c.key === sort.key);
    if (!col || col.sortable === false || sort.key === "") return [...rows];
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((ra, rb) => compareValues(col.accessor(ra), col.accessor(rb)) * dir);
  }, [rows, columns, sort]);

  const totalPages = pageSize ? Math.max(1, Math.ceil(sortedRows.length / pageSize)) : 1;
  const safePage = Math.min(page, totalPages - 1);
  const pageRows = pageSize ? sortedRows.slice(safePage * pageSize, safePage * pageSize + pageSize) : sortedRows;

  const allIds = useMemo(() => rows.map(getRowId), [rows, getRowId]);
  const allSelected = rows.length > 0 && selected.size === rows.length;
  const someSelected = selected.size > 0 && !allSelected;

  useEffect(() => {
    if (headCheckRef.current) headCheckRef.current.indeterminate = someSelected;
  }, [someSelected, allSelected]);

  const sortedCol = columns.find((c) => c.key === sort.key && c.sortable !== false);

  function toggleSort(key: string) {
    const col = columns.find((c) => c.key === key);
    if (!col || col.sortable === false) return;
    if (sort.key === key) {
      setSort({ key, dir: sort.dir === "asc" ? "desc" : "asc" });
    } else {
      setSort({ key, dir: "asc" });
    }
  }

  function toggleAll() {
    if (allSelected || someSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  }

  function toggleRow(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function onResizeStart(e: React.PointerEvent<HTMLElement>, col: ColumnDef<T>) {
    if (!resizable) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { key: col.key, startX: e.clientX, startW: widths[col.key] ?? widthOf(col) };
    setDragKey(col.key);
  }
  function onResizeMove(e: React.PointerEvent<HTMLElement>) {
    const d = dragRef.current;
    if (!d) return;
    const col = columns.find((c) => c.key === d.key);
    if (!col) return;
    const next = Math.max(minOf(col), Math.min(560, d.startW + (e.clientX - d.startX)));
    setWidths((w) => (w[d.key] === next ? w : { ...w, [d.key]: next }));
  }
  function onResizeEnd() {
    dragRef.current = null;
    setDragKey(null);
  }
  function onResizeKey(e: React.KeyboardEvent<HTMLElement>, col: ColumnDef<T>) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const step = e.shiftKey ? 24 : 8;
    const delta = e.key === "ArrowRight" ? step : -step;
    setWidths((w) => ({
      ...w,
      [col.key]: Math.max(minOf(col), Math.min(560, (w[col.key] ?? widthOf(col)) + delta)),
    }));
  }
  function resetWidth(col: ColumnDef<T>) {
    setWidths((w) => ({ ...w, [col.key]: widthOf(col) }));
  }

  const cellPad = density === "compact" ? "px-3 py-1.5" : "px-4 py-3";
  const minTotal =
    (selectable ? CHECK_W : 0) +
    columns.reduce((n, c, i) => (i === columns.length - 1 ? n : n + (widths[c.key] ?? widthOf(c))), 0) +
    120;

  const spot = (part: Exclude<SpotlightPart, null>) =>
    spotlight === part
      ? "outline outline-2 -outline-offset-2 outline-teal-600 bg-teal-50/60"
      : "";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        className="dt-scroll"
        style={scrollHeight ? { maxHeight: scrollHeight, overflowY: "auto" } : undefined}
      >
        <table
          role="grid"
          aria-label={label}
          aria-rowcount={sortedRows.length}
          className="w-full border-collapse"
          style={{ tableLayout: "fixed", minWidth: minTotal }}
        >
          <caption className="sr-only">{label}</caption>
          <thead>
            <tr className="bg-slate-50">
              {selectable && (
                <th
                  scope="col"
                  className={`relative ${scrollHeight ? "sticky top-0 z-10" : ""} bg-slate-50 ${cellPad} text-left ${spot("select-all")}`}
                  style={{ width: CHECK_W }}
                >
                  <input
                    ref={headCheckRef}
                    type="checkbox"
                    className="dt-check align-middle"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label={
                      allSelected
                        ? "All rows ticked — activate to clear every row"
                        : someSelected
                          ? "Some rows ticked — activate to tick every row"
                          : "No rows ticked — activate to tick every row"
                    }
                  />
                </th>
              )}
              {columns.map((col, i) => {
                const isLast = i === columns.length - 1;
                const isSorted = sort.key === col.key && col.sortable !== false;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={
                      col.sortable === false
                        ? undefined
                        : isSorted
                          ? sort.dir === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                    }
                    className={`relative ${scrollHeight ? "sticky top-0 z-10" : ""} bg-slate-50 ${cellPad} ${
                      col.numeric ? "text-right" : "text-left"
                    } text-xs font-semibold uppercase tracking-wider text-slate-500 ${
                      isSorted ? "bg-teal-50/70 text-teal-900" : ""
                    } ${spotlight === "sort" && isSorted ? "outline outline-2 -outline-offset-2 outline-teal-600" : ""}`}
                    style={isLast ? { minWidth: 120 } : { width: widths[col.key] ?? widthOf(col) }}
                  >
                    {col.sortable === false ? (
                      <span className="block truncate">{col.label}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        aria-label={`Sort by ${col.label}${isSorted ? ` (currently ${sort.dir === "asc" ? "ascending" : "descending"})` : ""}`}
                        title={`Sort by ${col.label}`}
                        className={`dt-sortbtn group inline-flex max-w-full items-center gap-1.5 uppercase ${
                          col.numeric ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <span className="truncate">{col.label}</span>
                        <span
                          aria-hidden="true"
                          className={`grid size-5 shrink-0 place-items-center rounded-md text-[11px] font-bold transition ${
                            isSorted
                              ? "bg-teal-700 text-white"
                              : "bg-slate-200/70 text-slate-400 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                          }`}
                        >
                          {isSorted ? (sort.dir === "asc" ? "↑" : "↓") : "↕"}
                        </span>
                      </button>
                    )}
                    {resizable && !isLast && (
                      <span
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`Resize ${col.label} column`}
                        aria-valuenow={Math.round(widths[col.key] ?? widthOf(col))}
                        tabIndex={0}
                        title={`Drag to resize ${col.label} (double-click resets)`}
                        data-active={dragKey === col.key}
                        data-spot={spotlight === "resize"}
                        className="dt-resize"
                        onPointerDown={(e) => onResizeStart(e, col)}
                        onPointerMove={onResizeMove}
                        onPointerUp={onResizeEnd}
                        onPointerCancel={onResizeEnd}
                        onKeyDown={(e) => onResizeKey(e, col)}
                        onDoubleClick={() => resetWidth(col)}
                      >
                        <span />
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, idx) => {
              const id = getRowId(row);
              const isSel = selected.has(id);
              const striped = zebra && idx % 2 === 1;
              return (
                <tr
                  key={id}
                  aria-selected={selectable ? isSel : undefined}
                  onClick={(e) => {
                    if (!selectable) return;
                    const t = e.target as HTMLElement;
                    if (t.closest("input,button,a,select,textarea")) return;
                    toggleRow(id);
                  }}
                  className={`border-t border-slate-100 transition-colors ${
                    selectable ? "cursor-pointer" : ""
                  } ${
                    isSel
                      ? `bg-teal-50 hover:bg-teal-100/70 ${spotlight === "selected" ? "outline outline-2 -outline-offset-2 outline-teal-600" : ""}`
                      : striped
                        ? `bg-slate-50/90 hover:bg-slate-100 ${spotlight === "zebra" ? "outline outline-2 -outline-offset-2 outline-teal-600" : ""}`
                        : "bg-white hover:bg-slate-50"
                  }`}
                >
                  {selectable && (
                    <td className={`${cellPad}`} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="dt-check align-middle"
                        checked={isSel}
                        onChange={() => toggleRow(id)}
                        aria-label={`Select row ${idx + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`${cellPad} overflow-hidden text-sm ${
                        col.numeric ? "text-right tabular-nums text-slate-900" : "text-slate-700"
                      } ${isSel ? "text-teal-950" : ""}`}
                    >
                      <span className="block truncate">
                        {col.render ? col.render(row) : String(col.accessor(row))}
                      </span>
                    </td>
                  ))}
                </tr>
              );
            })}
            {pageRows.length === 0 && (
              <tr className="border-t border-slate-100 bg-white">
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  {emptyNote}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* footer: selection + sort proof + pagination */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs text-slate-500">
        <span aria-live="polite">
          {selected.size === 0 ? (
            "No rows ticked"
          ) : (
            <>
              <strong className="font-semibold text-teal-800">
                {selected.size} of {rows.length} ticked
              </strong>{" "}
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="ml-1 font-semibold text-teal-700 underline-offset-2 hover:underline"
              >
                Clear
              </button>
            </>
          )}
        </span>
        <span className="hidden sm:inline" aria-hidden="true">
          ·
        </span>
        <span>
          Sorted by{" "}
          <strong className="font-semibold text-slate-700">
            {sortedCol ? sortedCol.label : "—"} {sort.dir === "asc" ? "↑" : "↓"}
          </strong>{" "}
          across all {rows.length} rows
          {pageSize ? ` (page ${safePage + 1} of ${totalPages})` : ""}
        </span>
        {pageSize && totalPages > 1 && (
          <span className="ml-auto inline-flex items-center gap-1">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-600 transition hover:border-teal-600/40 hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Prev
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage(safePage + 1)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-600 transition hover:border-teal-600/40 hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
