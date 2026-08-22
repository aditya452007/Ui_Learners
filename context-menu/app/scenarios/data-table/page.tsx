"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ContextMenu, useContextMenu, type MenuItem } from "@/components/context-menu";
import { ScenarioNav } from "@/components/scenario-nav";

type Row = {
  id: string;
  project: string;
  owner: string;
  status: "Active" | "Review" | "Done" | "Blocked";
  due: string;
  budget: string;
};

const ROWS: Row[] = [
  { id: "r1", project: "Atlas — mobile nav", owner: "Mina Park", status: "Active", due: "Aug 28", budget: "$14.2k" },
  { id: "r2", project: "Hearth — checkout", owner: "Jon Reyes", status: "Review", due: "Sep 02", budget: "$8.9k" },
  { id: "r3", project: "Orbit — design tokens", owner: "Sasha Lee", status: "Done", due: "Aug 19", budget: "$22k" },
  { id: "r4", project: "Nimbus — auth flow", owner: "Devon Wu", status: "Blocked", due: "Sep 10", budget: "$31k" },
  { id: "r5", project: "Pylon — API v2", owner: "Ava Kim", status: "Active", due: "Sep 01", budget: "$18.5k" },
  { id: "r6", project: "Tide — onboarding", owner: "Leo Martin", status: "Review", due: "Aug 30", budget: "$9.4k" },
];

function StatusDot({ status }: { status: Row["status"] }) {
  const map: Record<Row["status"], string> = {
    Active: "bg-emerald-500",
    Review: "bg-amber-500",
    Done: "bg-zinc-400",
    Blocked: "bg-red-500",
  };
  return <span className={`inline-block size-2 rounded-full ${map[status]}`} />;
}

export default function DataTablePage() {
  const [rows, setRows] = useState<Row[]>(ROWS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(["r1"]));
  const [contextId, setContextId] = useState<string | null>("r1");
  const [hasClipboard, setHasClipboard] = useState(false);
  const { pos, open, handleContextMenu, close } = useContextMenu();
  const [toast, setToast] = useState<string | null>(null);

  const multi = selectedIds.size > 1;

  const menuItems: MenuItem[] = useMemo(() => {
    if (!contextId && selectedIds.size === 0) {
      // header/empty
      return [
        { label: "Sort Ascending" },
        { label: "Sort Descending" },
        { type: "separator" },
        { label: "Filter…", submenu: [{ label: "By status" }, { label: "By owner" }, { label: "By due date" }] },
        { label: "Hide column", submenu: [{ label: "Budget" }, { label: "Due" }, { label: "Owner" }] },
      ];
    }
    if (multi) {
      return [
        { label: `Copy ${selectedIds.size} rows`, keyEq: "⌘C" },
        { label: `Duplicate ${selectedIds.size} rows`, keyEq: "⌘D" },
        { type: "separator" },
        {
          label: "Export",
          submenu: [{ label: "Export as CSV" }, { label: "Export as PDF" }, { label: "Copy as Markdown" }],
        },
        { label: "Change status…", submenu: [{ label: "Active" }, { label: "Review" }, { label: "Done" }, { label: "Blocked" }] },
        { type: "separator" },
        { label: `Archive ${selectedIds.size} rows` },
        { label: `Delete ${selectedIds.size} rows`, danger: true, keyEq: "⌘⌫" },
      ];
    }
    const r = rows.find((x) => x.id === contextId);
    return [
      { label: "Copy row", keyEq: "⌘C" },
      { label: "Duplicate row", keyEq: "⇧⌘D" },
      { label: "Insert row above", keyEq: "⌥⌘↑" },
      { label: "Insert row below", keyEq: "⌥⌘↓" },
      { label: "Paste", keyEq: "⌘V", disabled: !hasClipboard },
      { type: "separator" },
      {
        label: "Share",
        submenu: [{ label: "Copy link to row" }, { label: "Invite…" }, { type: "separator" }, { label: "Copy row URL" }],
      },
      {
        label: "Export",
        submenu: [{ label: "Export as CSV" }, { label: "Export as PDF" }, { label: "Copy as Markdown" }],
      },
      { type: "separator" },
      { label: "Archive", disabled: r?.status === "Done" },
      { label: "Delete row", danger: true, keyEq: "⌘⌫" },
    ];
  }, [contextId, multi, selectedIds.size, hasClipboard, rows]);

  function show(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1700);
  }

  function handleAction(label: string) {
    close();
    if (label.includes("Copy")) {
      setHasClipboard(true);
      show("Copied to clipboard");
      return;
    }
    if (label.includes("Duplicate")) {
      const ids = multi ? [...selectedIds] : contextId ? [contextId] : [];
      const toDup = rows.filter((r) => ids.includes(r.id));
      const clones = toDup.map((r) => ({ ...r, id: "r" + Date.now() + Math.random().toString(36).slice(2, 4), project: r.project + " (copy)" }));
      setRows((prev) => {
        const idx = contextId ? prev.findIndex((x) => x.id === contextId) : prev.length - 1;
        const next = [...prev];
        next.splice(idx + 1, 0, ...clones);
        return next;
      });
      show(`Duplicated ${clones.length} row(s)`);
      return;
    }
    if (label.includes("Delete")) {
      const ids = multi ? selectedIds : new Set(contextId ? [contextId!] : []);
      setRows((p) => p.filter((r) => !ids.has(r.id)));
      setSelectedIds(new Set());
      show(`Deleted ${ids.size} row(s)`);
      return;
    }
    if (label.includes("Paste")) {
      show("Pasted below selection");
      return;
    }
    if (label.includes("Insert row")) {
      const id = "r" + Date.now();
      const blank: Row = { id, project: "New project", owner: "You", status: "Active", due: "—", budget: "—" };
      setRows((prev) => {
        const idx = prev.findIndex((x) => x.id === contextId);
        const at = label.includes("above") ? idx : idx + 1;
        const next = [...prev];
        next.splice(at < 0 ? 0 : at, 0, blank);
        return next;
      });
      show(label);
      return;
    }
    if (label === "Archive") {
      setRows((prev) => prev.map((r) => (r.id === contextId ? { ...r, status: "Done" as const } : r)));
      show("Archived");
      return;
    }
    show(label);
  }

  function onRowContext(e: React.MouseEvent, id: string) {
    // if right-clicked row isn't selected, make it the selection
    if (!selectedIds.has(id)) {
      setSelectedIds(new Set([id]));
    }
    setContextId(id);
    handleContextMenu(e);
  }

  function toggleSelect(id: string, e: React.MouseEvent) {
    if (e.metaKey || e.ctrlKey) {
      setSelectedIds((prev) => {
        const n = new Set(prev);
        if (n.has(id)) n.delete(id);
        else n.add(id);
        return n;
      });
    } else {
      setSelectedIds(new Set([id]));
      setContextId(id);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <ScenarioNav current="/scenarios/data-table" />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">Scenario 03 — Notion / Sheets</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Data Table</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted">
              Right-click a row for row actions, try ⌘-click to multi-select then right-click for bulk actions. Paste is disabled until you copy.
              Same menu pattern, entirely different items.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-border bg-white px-3 py-1 font-mono text-xs sm:inline">
              {selectedIds.size} selected · {hasClipboard ? "clipboard: 1 row" : "clipboard empty"}
            </span>
            <button
              onClick={() => {
                setRows(ROWS);
                setSelectedIds(new Set(["r1"]));
                setContextId("r1");
                setHasClipboard(false);
              }}
              className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold hover:bg-surface-alt"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-border bg-surface-alt/60 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-red-400" />
              <span className="size-3 rounded-full bg-amber-400" />
              <span className="size-3 rounded-full bg-emerald-400" />
              <span className="ml-2 font-mono text-xs font-semibold">Projects · Q3</span>
              <span className="hidden rounded-full bg-white px-2 py-0.5 font-mono text-xs border border-border sm:inline">{rows.length} rows</span>
            </div>
            <span className="font-mono text-xs text-text-faint">Right-click any row · long-press on touch · Esc to dismiss</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr
                  className="border-b border-border bg-surface-alt text-xs uppercase tracking-wide text-text-muted"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextId(null);
                    handleContextMenu(e);
                  }}
                >
                  <th className="w-10 px-3 py-2.5 font-semibold">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === rows.length && rows.length > 0}
                      onChange={(e) => setSelectedIds(e.target.checked ? new Set(rows.map((r) => r.id)) : new Set())}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="px-3 py-2.5 font-semibold">Project</th>
                  <th className="px-3 py-2.5 font-semibold">Owner</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 font-semibold">Due</th>
                  <th className="px-3 py-2.5 font-semibold">Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {rows.map((r) => {
                  const sel = selectedIds.has(r.id);
                  return (
                    <tr
                      key={r.id}
                      data-row={r.id}
                      onClick={(e) => toggleSelect(r.id, e)}
                      onContextMenu={(e) => onRowContext(e, r.id)}
                      className={`cursor-default text-sm transition-colors ${sel ? "bg-accent text-white" : "hover:bg-surface-alt"}`}
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={sel}
                          onChange={() => {}}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelect(r.id, e as unknown as React.MouseEvent);
                          }}
                          className="rounded border-border"
                        />
                      </td>
                      <td className={`px-3 py-3 font-medium ${sel ? "text-white" : "text-foreground"}`}>{r.project}</td>
                      <td className={`px-3 py-3 ${sel ? "text-white/90" : "text-text-muted"}`}>{r.owner}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${sel ? "border-white/30 bg-white/15 text-white" : "border-border bg-surface text-foreground"}`}>
                          <StatusDot status={r.status} />
                          {r.status}
                        </span>
                      </td>
                      <td className={`px-3 py-3 font-mono text-xs ${sel ? "text-white/80" : "text-text-muted"}`}>{r.due}</td>
                      <td className={`px-3 py-3 font-mono text-xs ${sel ? "text-white/80" : "text-text-muted"}`}>{r.budget}</td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <p className="text-sm font-medium">No rows</p>
                      <p className="mt-1 font-mono text-xs text-text-muted">Reset to bring them back</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-alt/40 px-4 py-3">
            <span className="font-mono text-xs text-text-muted">
              Tip: ⌘-click rows to multi-select, then right-click any selected row for bulk menu · disabled Paste shows clipboard state
            </span>
            <div className="flex gap-1.5">
              <kbd className="rounded border border-border bg-white px-1.5 py-0.5 font-mono text-xs">⌘C</kbd>
              <kbd className="rounded border border-border bg-white px-1.5 py-0.5 font-mono text-xs">⌘V</kbd>
              <kbd className="rounded border border-border bg-white px-1.5 py-0.5 font-mono text-xs">⌘⌫</kbd>
              <kbd className="rounded border border-border bg-white px-1.5 py-0.5 font-mono text-xs">Esc</kbd>
            </div>
          </div>
        </div>

        <ContextMenu items={menuItems} pos={pos} open={open} onClose={close} onAction={handleAction} />
        {toast && <div className="animate-menu-in fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white shadow-lg">✓ {toast}</div>}

        <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-xs font-medium text-white">selection highlight</span>
            <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-xs font-medium text-white">separator</span>
            <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-xs font-medium text-white">keyEquivalent</span>
            <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-xs font-medium text-white">submenu ▸</span>
            <span className="rounded-full border border-border bg-white px-2.5 py-1 font-mono text-xs">disabled Paste when clipboard empty</span>
            <span className="rounded-full bg-red-50 px-2.5 py-1 font-mono text-xs font-medium text-danger">destructive Delete</span>
          </div>
          <p className="mt-3 font-mono text-xs text-text-muted">
            Long-press (touch) → contextmenu event fires after 500ms. The component suppresses the native browser menu with preventDefault() and shows
            the custom NSMenu instead.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold">Why it fits here</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Tables overflow with actions — copy, duplicate, insert, export, archive, delete — but showing them all per row would drown the data. A
              right-click turns each row into its own toolbar on demand, and multi-select turns it into a bulk toolbar.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold">What the user gains</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Zero chrome until needed, then everything for that row under the pointer. Disabled “Paste” signals system state instead of failing
              silently. Shortcuts in the menu teach power use without a manual.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold">Builder notes</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Build the menu from selection state: single → row actions, multi → bulk actions, zero → column actions. Track
              <code className="mx-1 rounded bg-surface-alt px-1 py-0.5 font-mono text-xs">hasClipboard</code> to disable Paste (and keep it in the menu
              so the shortcut remains discoverable). Destructive items always last, with danger styling.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/scenarios/canvas-board" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-surface-alt">
            ← Canvas
          </Link>
          <Link href="/" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Back to Anatomy
          </Link>
        </div>
      </div>
    </main>
  );
}
