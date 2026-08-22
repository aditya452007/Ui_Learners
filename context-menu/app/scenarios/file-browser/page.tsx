"use client";

import { useState } from "react";
import Link from "next/link";
import { ContextMenu, useContextMenu, type MenuItem } from "@/components/context-menu";
import { ScenarioNav } from "@/components/scenario-nav";

type FileItem = {
  id: string;
  name: string;
  kind: "pdf" | "image" | "folder" | "video" | "doc";
  size: string;
  modified: string;
  locked?: boolean;
};

const FILES: FileItem[] = [
  { id: "1", name: "Quarterly-Report.pdf", kind: "pdf", size: "4.2 MB", modified: "Today 09:14" },
  { id: "2", name: "Hiroshi-portrait.jpg", kind: "image", size: "6.8 MB", modified: "Yesterday" },
  { id: "3", name: "Brand System", kind: "folder", size: "—", modified: "Aug 19" },
  { id: "4", name: "Onboarding.mov", kind: "video", size: "242 MB", modified: "Aug 17", locked: true },
  { id: "5", name: "Roadmap-Q4.docx", kind: "doc", size: "1.1 MB", modified: "Aug 15" },
  { id: "6", name: "Archive-2019.zip", kind: "folder", size: "1.4 GB", modified: "Aug 10" },
  { id: "7", name: "Moodboard.png", kind: "image", size: "3.3 MB", modified: "Aug 9" },
  { id: "8", name: "Invoice-1042.pdf", kind: "pdf", size: "88 KB", modified: "Aug 8" },
];

function FileIcon({ kind, locked }: { kind: FileItem["kind"]; locked?: boolean }) {
  const wrap = "grid size-9 place-items-center rounded-xl";
  if (kind === "folder")
    return (
      <span className={`${wrap} bg-amber-50 text-amber-600 border border-amber-100`}>
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.4}>
          <path d="M2.5 6.5A1.5 1.5 0 0 1 4 5h3.4l1.2 1.4H16A1.5 1.5 0 0 1 17.5 8v6A1.5 1.5 0 0 1 16 15.5H4A1.5 1.5 0 0 1 2.5 14v-7.5Z" />
        </svg>
      </span>
    );
  if (kind === "image")
    return (
      <span className={`${wrap} bg-emerald-50 text-emerald-600 border border-emerald-100`}>
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.4}>
          <rect x={2.5} y={3.5} width={15} height={12} rx={1.5} />
          <circle cx={7} cy={7.5} r={1.2} />
          <path d="M2.5 12.5 6.5 8.5 11 13 14 10l3.5 3.5" />
        </svg>
      </span>
    );
  if (kind === "video")
    return (
      <span className={`${wrap} bg-violet-50 text-violet-600 border border-violet-100 relative`}>
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.4}>
          <rect x={2.5} y={4} width={15} height={11} rx={1.5} />
          <path d="M8 7.2 13 10 8 12.8V7.2Z" fill="currentColor" stroke="none" />
        </svg>
        {locked && <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-zinc-900 text-white"> <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={1.4}><rect x={2} y={5} width={8} height={5} rx={1}/><path d="M4 5V3.5A2 2 0 0 1 8 3.5V5"/></svg></span>}
      </span>
    );
  if (kind === "pdf")
    return (
      <span className={`${wrap} bg-red-50 text-red-600 border border-red-100`}>
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.3}>
          <path d="M6 2.5A1.5 1.5 0 0 1 7.5 1h4.2L15 4.3V17.5A1.5 1.5 0 0 1 13.5 19H7.5A1.5 1.5 0 0 1 6 17.5v-15Z" />
          <path d="M11.7 1v3.2A1.1 1.1 0 0 0 12.8 5.4H16" />
        </svg>
      </span>
    );
  return (
    <span className={`${wrap} bg-sky-50 text-sky-600 border border-sky-100`}>
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.3}>
        <path d="M6 2.5A1.5 1.5 0 0 1 7.5 1h4.2L15 4.3V17.5A1.5 1.5 0 0 1 13.5 19H7.5A1.5 1.5 0 0 1 6 17.5v-15Z" />
        <path d="M7.5 8h5M7.5 11h5M7.5 14h3.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function miniIcon(label: string) {
  const cls = "h-3.5 w-3.5";
  if (label === "Open")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.2}>
        <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h3.2l1.1 1.3H12.5A1.5 1.5 0 0 1 14 6.8v4.7A1.5 1.5 0 0 1 12.5 13H3.5A1.5 1.5 0 0 1 2 11.5v-6Z" />
      </svg>
    );
  if (label === "Quick Look")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.2}>
        <circle cx={8} cy={7.5} r={3.2} />
        <path d="M3.5 7.5S6 4 8 4s4.5 3.5 4.5 3.5S10 11 8 11 3.5 7.5 3.5 7.5Z" />
        <circle cx={8} cy={7.5} r={1.2} fill="currentColor" stroke="none" />
      </svg>
    );
  if (label === "Rename")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.2}>
        <path d="M11.5 2.5 13.5 4.5 5.8 12.2H3.8v-2Z" />
        <path d="M10.2 3.8 12.2 5.8" />
      </svg>
    );
  if (label.includes("Copy"))
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.2}>
        <rect x={3.5} y={2.5} width={7} height={9} rx={1} />
        <rect x={5.5} y={5} width={7} height={9} rx={1} />
      </svg>
    );
  if (label === "Duplicate")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.2}>
        <rect x={2.5} y={4} width={6.5} height={7} rx={1} />
        <rect x={7} y={2} width={6.5} height={7} rx={1} />
      </svg>
    );
  return undefined;
}

export default function FileBrowserPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string | null>("1");
  const [target, setTarget] = useState<FileItem | null>(FILES[0]);
  const [bgTarget, setBgTarget] = useState(false);
  const { pos, open, handleContextMenu, close } = useContextMenu();
  const [toast, setToast] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [names, setNames] = useState<Record<string, string>>(Object.fromEntries(FILES.map((f) => [f.id, f.name])));

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  function getMenu(): MenuItem[] {
    if (bgTarget) {
      return [
        { label: "New Folder", keyEq: "⇧⌘N", icon: miniIcon("Open") },
        { label: "Get Info", icon: miniIcon("Quick Look") },
        { type: "separator" },
        { label: "Sort By", submenu: [{ label: "Name" }, { label: "Date" }, { label: "Size" }, { label: "Kind" }] },
        { label: "Show View Options", keyEq: "⌘J" },
        { type: "separator" },
        { label: "Use Groups", keyEq: "⌃⌘0" },
      ];
    }
    if (!target) return [];
    const isFolder = target.kind === "folder";
    const isImage = target.kind === "image";
    const locked = !!target.locked;

    const base: MenuItem[] = [
      { label: "Open", keyEq: "⌘O", icon: miniIcon("Open") },
      { label: "Open With", submenu: [{ label: "Preview" }, { label: "Figma" }, { label: "VS Code" }, { type: "separator" }, { label: "Other…" }] },
      { type: "separator" },
      { label: "Quick Look", keyEq: "Space", icon: miniIcon("Quick Look") },
      { label: "Get Info", keyEq: "⌘I" },
      { type: "separator" },
      { label: "Rename", disabled: locked, icon: miniIcon("Rename") },
      { label: "Duplicate", keyEq: "⌘D", icon: miniIcon("Duplicate") },
      { label: "Copy", keyEq: "⌘C", icon: miniIcon("Copy") },
      { type: "separator" },
      {
        label: "Share",
        submenu: [
          { label: "AirDrop" },
          { label: "Messages" },
          { label: "Mail" },
          { type: "separator" },
          { label: "Copy Link", keyEq: "⌥⌘C" },
        ],
      },
      {
        label: "Tags…",
        submenu: [
          { label: "🔴  Red" },
          { label: "🟠  Orange" },
          { label: "🟢  Green" },
          { label: "🔵  Blue" },
          { type: "separator" },
          { label: "Edit Tags…" },
        ],
      },
      ...(isImage
        ? [
            {
              label: "Quick Actions",
              submenu: [{ label: "Set Desktop Picture" }, { label: "Rotate Left" }, { label: "Create PDF" }],
            } as MenuItem,
          ]
        : []),
      ...(isFolder
        ? [
            {
              label: "New Folder Inside",
              submenu: [{ label: "New Folder" }, { label: "Smart Folder" }],
            } as MenuItem,
          ]
        : []),
      { type: "separator" },
      { label: "Move to Trash", keyEq: "⌘⌫", danger: true },
    ];
    return base;
  }

  function onAction(label: string) {
    close();
    if (label === "Rename" && target) setRenaming(target.id);
    else showToast(label);
  }

  return (
    <main className="min-h-screen bg-background">
      <ScenarioNav current="/scenarios/file-browser" />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">Scenario 01 — Finder</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">File Browser</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted">
              Right-click any file — the menu belongs to <em className="font-medium not-italic text-foreground">that</em> file. An image offers
              “Set Desktop Picture,” a folder offers “New Folder Inside,” a locked video disables Rename. Right-click the empty background for a
              different menu entirely.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-surface p-1">
            <button
              onClick={() => setView("grid")}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${view === "grid" ? "bg-foreground text-white" : "text-text-muted hover:text-foreground"}`}
            >
              Grid
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${view === "list" ? "bg-foreground text-white" : "text-text-muted hover:text-foreground"}`}
            >
              List
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-accent-light px-3 py-1 font-mono text-xs font-medium text-accent">NSMenuItem.separator()</span>
          <span className="rounded-full bg-accent-light px-3 py-1 font-mono text-xs font-medium text-accent">keyEquivalent ⌘C</span>
          <span className="rounded-full bg-accent-light px-3 py-1 font-mono text-xs font-medium text-accent">submenu ▸</span>
          <span className="rounded-full border border-border bg-white px-3 py-1 font-mono text-xs text-text-muted">disabled items</span>
        </div>

        {/* Window */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-border bg-surface-alt/60 px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-red-400" />
              <span className="size-3 rounded-full bg-amber-400" />
              <span className="size-3 rounded-full bg-emerald-400" />
              <span className="ml-3 hidden font-mono text-xs text-text-muted sm:inline">~/Documents · 8 items</span>
            </div>
            <span className="font-mono text-xs text-text-faint">Right-click any row · Ctrl-click works too</span>
          </div>

          <div
            className="relative bg-white"
            onContextMenu={(e) => {
              const t = (e.target as HTMLElement).closest("[data-file]");
              if (t) {
                const id = t.getAttribute("data-file");
                const f = FILES.find((x) => x.id === id) || null;
                setTarget(f);
                setBgTarget(false);
                if (f) setSelected(f.id);
              } else {
                setBgTarget(true);
                setTarget(null);
              }
              handleContextMenu(e);
            }}
          >
            {view === "grid" ? (
              <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
                {FILES.map((f) => (
                  <div
                    key={f.id}
                    data-file={f.id}
                    onClick={() => setSelected(f.id)}
                    className={`group relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors ${selected === f.id ? "border-accent bg-accent-light" : "border-transparent hover:border-border hover:bg-surface-alt"}`}
                  >
                    <FileIcon kind={f.kind} locked={f.locked} />
                    {renaming === f.id ? (
                      <input
                        autoFocus
                        defaultValue={names[f.id]}
                        onBlur={(e) => {
                          setNames((n) => ({ ...n, [f.id]: e.target.value }));
                          setRenaming(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setNames((n) => ({ ...n, [f.id]: (e.target as HTMLInputElement).value }));
                            setRenaming(null);
                          }
                          if (e.key === "Escape") setRenaming(null);
                        }}
                        className="w-full rounded border border-accent bg-white px-1 py-0.5 text-center text-xs font-medium outline-none"
                      />
                    ) : (
                      <p className="line-clamp-2 text-xs font-medium leading-tight">{names[f.id]}</p>
                    )}
                    <p className="font-mono text-[11px] text-text-faint">{f.size}</p>
                    {f.locked && <span className="absolute right-2 top-2 rounded-full bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-white">Locked</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border">
                <div className="grid grid-cols-[1fr_90px_130px] gap-2 bg-surface-alt px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide text-text-muted">
                  <span>Name</span>
                  <span>Size</span>
                  <span>Modified</span>
                </div>
                {FILES.map((f) => (
                  <div
                    key={f.id}
                    data-file={f.id}
                    onClick={() => setSelected(f.id)}
                    className={`grid grid-cols-[1fr_90px_130px] items-center gap-2 px-4 py-2.5 text-sm ${selected === f.id ? "bg-accent text-white" : "hover:bg-surface-alt"}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <FileIcon kind={f.kind} locked={f.locked} />
                      {renaming === f.id ? (
                        <input
                          autoFocus
                          defaultValue={names[f.id]}
                          onBlur={(e) => {
                            setNames((n) => ({ ...n, [f.id]: e.target.value }));
                            setRenaming(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setNames((n) => ({ ...n, [f.id]: (e.target as HTMLInputElement).value }));
                              setRenaming(null);
                            }
                            if (e.key === "Escape") setRenaming(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="min-w-0 flex-1 rounded border border-accent bg-white px-1.5 py-0.5 text-xs font-medium text-foreground outline-none"
                        />
                      ) : (
                        <span className={`truncate text-xs font-medium ${selected === f.id ? "text-white" : "text-foreground"}`}>{names[f.id]}</span>
                      )}
                    </span>
                    <span className={`font-mono text-xs ${selected === f.id ? "text-white/80" : "text-text-muted"}`}>{f.size}</span>
                    <span className={`font-mono text-xs ${selected === f.id ? "text-white/80" : "text-text-muted"}`}>{f.modified}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-border bg-surface-alt/40 px-4 py-2">
              <span className="font-mono text-xs text-text-muted">{selected ? `"${names[selected]}" selected` : "No selection"} · right-click for actions</span>
              <span className="hidden font-mono text-xs text-text-faint sm:inline">8 items · 1.65 GB available</span>
            </div>
          </div>
        </div>

        <ContextMenu items={getMenu()} pos={pos} open={open} onClose={close} onAction={onAction} />

        {toast && <div className="animate-menu-in fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white shadow-lg">✓ {toast}</div>}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold">Why a context menu here?</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              A file browser can’t put Open, Get Info, Share, Tags, and Move to Trash in a toolbar for every file — it would be noise. The context
              menu keeps the window clean and makes actions <em className="font-medium not-italic text-foreground">reach the file</em> where the
              user’s attention already is.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold">What the user gains</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Fewer misclicks: the same gesture works everywhere, but the options adapt to the file’s kind and lock state. Disabled “Rename” and the
              red “Move to Trash” teach safely. Shortcuts (⌘C, ⌘I, ⌘⌫) are learned passively from the trailing key equivalents.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold">Builder notes</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Generate the menu from the clicked file: <code className="rounded bg-surface-alt px-1 py-0.5 font-mono text-xs">getMenuFor(file)</code>.
              Right-click on the background builds a different array. Keep NSMenuItem.separator() as data, not decoration — and skip disabled rows
              when moving the highlight with arrows.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-surface-alt">
            ← Anatomy
          </Link>
          <Link href="/scenarios/canvas-board" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Next: Canvas Board →
          </Link>
        </div>
      </div>
    </main>
  );
}
