"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Cmd = { id: string; label: string; sub?: string; shortcut?: string; group: string; icon: string; kbd?: string };

const GROUPS: { heading: string; items: Cmd[] }[] = [
  {
    heading: "Create",
    items: [
      { id: "cr1", label: "Create frame", sub: "Insert a new frame on canvas", icon: "frame", shortcut: "F", group: "Create" },
      { id: "cr2", label: "Create text layer", icon: "text", shortcut: "T", group: "Create" },
      { id: "cr3", label: "Insert component…", sub: "Button / Card / Avatar", icon: "comp", shortcut: "⌘ I", group: "Create" },
      { id: "cr4", label: "Import image", icon: "img", shortcut: "⇧ ⌘ K", group: "Create" },
    ],
  },
  {
    heading: "Arrange",
    items: [
      { id: "ar1", label: "Auto layout", sub: "Wrap selection in auto layout", icon: "layout", shortcut: "⇧ A", group: "Arrange" },
      { id: "ar2", label: "Bring to front", icon: "front", shortcut: "⌘ ]", group: "Arrange" },
      { id: "ar3", label: "Send to back", icon: "back", shortcut: "⌘ [", group: "Arrange" },
      { id: "ar4", label: "Distribute horizontally", icon: "dist", group: "Arrange" },
    ],
  },
  {
    heading: "Plugins & Tools",
    items: [
      { id: "pl1", label: "Run — Remove background", icon: "plug", group: "Plugins & Tools" },
      { id: "pl2", label: "Run — Content reel", icon: "plug", group: "Plugins & Tools" },
      { id: "pl3", label: "Find and replace…", icon: "search", shortcut: "⌘ F", group: "Plugins & Tools" },
    ],
  },
  {
    heading: "Export",
    items: [
      { id: "ex1", label: "Export selection as PNG", icon: "export", shortcut: "⇧ E", group: "Export" },
      { id: "ex2", label: "Copy as SVG", icon: "copy", shortcut: "⌘ ⇧ C", group: "Export" },
      { id: "ex3", label: "Present fullscreen", icon: "present", shortcut: "⌘ .", group: "Export" },
    ],
  },
];

const ALL = GROUPS.flatMap((g) => g.items);

function Icon({ name, active }: { name: string; active?: boolean }) {
  const cls = `h-4 w-4 ${active ? "text-white" : "text-zinc-500"}`;
  if (name === "frame")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.3}>
        <rect x={2.5} y={2.5} width={11} height={11} rx={1.2} strokeDasharray="2 1.2" />
        <rect x={4.5} y={4.5} width={7} height={7} rx={0.6} />
      </svg>
    );
  if (name === "text")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.4}>
        <path d="M4 4.5h8M8 4.5v7M5.5 11.5h5" strokeLinecap="round" />
      </svg>
    );
  if (name === "comp")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.3}>
        <rect x={3} y={3} width={10} height={4} rx={1} />
        <rect x={3} y={9} width={4.5} height={4} rx={1} />
        <rect x={8.5} y={9} width={4.5} height={4} rx={1} />
      </svg>
    );
  if (name === "img")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <rect x={2.5} y={2.5} width={11} height={11} rx={1.5} />
        <circle cx={5.8} cy={6.2} r={1.2} />
        <path d="M2.5 11 6.5 7l3 3 1.5-1.5 2 2.5" strokeLinejoin="round" />
      </svg>
    );
  if (name === "layout")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <rect x={2.5} y={3} width={11} height={3} rx={1} />
        <rect x={2.5} y={7.5} width={5} height={5.5} rx={1} />
        <rect x={8.5} y={7.5} width={5} height={5.5} rx={1} />
      </svg>
    );
  if (name === "front")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.3}>
        <rect x={3} y={7} width={10} height={6} rx={1} />
        <rect x={5} y={3} width={6} height={6} rx={1} fill={active ? "white" : "none"} fillOpacity={0.14} />
      </svg>
    );
  if (name === "back")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.3}>
        <rect x={3} y={3} width={10} height={6} rx={1} fill={active ? "white" : "none"} fillOpacity={0.14} />
        <rect x={5} y={7} width={6} height={6} rx={1} />
      </svg>
    );
  if (name === "dist")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round">
        <path d="M3 3V13M13 3V13M8 5V11M5.5 8H10.5" />
      </svg>
    );
  if (name === "plug")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <path d="M6 3.5h4v3H6z" />
        <path d="M7 6.5V9a1 1 0 0 0 1 1h0a1 1 0 0 0 1-1V6.5" />
        <path d="M5 9h6M6 11h4" strokeLinecap="round" />
      </svg>
    );
  if (name === "search")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <circle cx={7} cy={7} r={4} />
        <path d="M10 10 13 13" strokeLinecap="round" />
      </svg>
    );
  if (name === "export")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <path d="M8 3.5V10M5.5 7.5 8 10l2.5-2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 11.5V12.5A1 1 0 0 0 4 13.5h8a1 1 0 0 0 1-1v-1" />
      </svg>
    );
  if (name === "copy")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <rect x={3.5} y={2.5} width={7} height={9} rx={1} />
        <path d="M6 2.5V4A1 1 0 0 0 7 5h3" />
      </svg>
    );
  if (name === "present")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <rect x={2.5} y={3.5} width={11} height={7} rx={1} />
        <path d="M6.5 13.5h3M8 10.5V13.5" strokeLinecap="round" />
      </svg>
    );
  return null;
}

export default function Page() {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [added, setAdded] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function h(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setTimeout(() => inputRef.current?.focus(), 10);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
    else triggerRef.current?.focus();
  }, [open]);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS.map((g) => ({ heading: g.heading, items: g.items.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)) })).filter((g) => g.items.length > 0);
  }, [query]);

  const flat = useMemo(() => filteredGroups.flatMap((g) => g.items), [filteredGroups]);
  useEffect(() => {
    if (active >= flat.length) setActive(0);
  }, [flat.length, active]);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function run(c: Cmd) {
    setToast(`Ran “${c.label}”`);
    if (c.id.startsWith("cr")) setAdded((a) => [...a, c.label]);
    setTimeout(() => setToast(null), 2200);
    setOpen(false);
  }
  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(1, flat.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + flat.length) % Math.max(1, flat.length));
    } else if (e.key === "Enter") {
      const c = flat[active];
      if (c) run(c);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-6">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="font-medium hover:text-accent">
              ← Hub
            </Link>
            <span className="text-text-faint">/</span>
            <span className="font-semibold">Design canvas</span>
            <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-xs text-amber-700 sm:inline">Actions only</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/scenarios/docs-search" className="hidden rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium hover:border-accent sm:inline-flex">
              Next → Docs jump-to
            </Link>
            <button ref={triggerRef} onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-2 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-white">
              ⌘K <span className="hidden sm:inline">{open ? "Close" : "Open"} palette</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-10 pt-6">
        {/* toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-lg bg-zinc-900 text-white">
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.4}>
                <path d="M3 3.5h10v9H3z" />
                <path d="M3 5.5h10M5.5 3.5v9" />
              </svg>
            </div>
            <span className="text-sm font-semibold">Untitled · Figma-ish</span>
            <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-xs font-medium text-emerald-700 sm:inline">All changes saved</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { k: "F", label: "Frame" },
              { k: "T", label: "Text" },
              { k: "⌘I", label: "Component" },
            ].map((t) => (
              <span key={t.k} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-alt px-2.5 py-1 text-xs">
                <span className="rounded bg-white px-1 py-0.5 font-mono text-xs shadow-sm">{t.k}</span> {t.label}
              </span>
            ))}
            <button onClick={() => setOpen(true)} className="ml-1 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-600">
              Quick actions ⌘K
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[220px_1fr_220px]">
          {/* layers */}
          <div className="hidden rounded-2xl border border-border bg-surface p-3 lg:block">
            <p className="px-2 py-1 font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">Layers</p>
            <div className="mt-2 space-y-1">
              {[
                { n: "Frame 1", type: "frame", on: true },
                { n: "Hero / Title", type: "text", on: true },
                { n: "Button · Primary", type: "comp", on: true },
                { n: "Card · Pricing", type: "comp", on: false },
                ...added.map((a) => ({ n: a, type: "frame", on: true })),
              ].map((l) => (
                <div key={l.n} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${l.on ? "bg-accent-light text-foreground" : "text-text-muted"}`}>
                  <span className={`size-2 rounded-full ${l.on ? "bg-accent" : "bg-zinc-300"}`} />
                  <span className="truncate text-sm">{l.n}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-surface-alt p-3">
              <p className="text-xs font-semibold">Tip</p>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">This palette is <em className="font-medium not-italic text-foreground">actions over objects</em> — no page jumping, only doing. Try typing “export” or “layout”.</p>
            </div>
          </div>

          {/* canvas */}
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">
            <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-[#fbfaf9] p-6 sm:p-8" style={{ minHeight: 380 }}>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e7e5e4_1px,transparent_1px),linear-gradient(to_bottom,#e7e5e4_1px,transparent_1px)] bg-[size:20px_20px] opacity-40" />
              <div className="relative">
                <div className="mx-auto max-w-sm rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                  <div className="h-3 w-20 rounded-full bg-zinc-900" />
                  <p className="mt-3 text-sm font-bold leading-tight">Pricing that scales with you</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted">Start free, add seats as you grow. No hidden fees, cancel anytime.</p>
                  <div className="mt-4 flex gap-2">
                    <span className="rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-white">Get started</span>
                    <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium">View demo</span>
                  </div>
                </div>
                {added.length > 0 && (
                  <div className="mx-auto mt-4 max-w-sm rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700">+ Added via palette: {added.join(" · ")}</div>
                )}
                <div className="pointer-events-none absolute -right-2 -top-2 hidden rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-mono text-xs text-amber-700 shadow-sm sm:block">⌘K → “Create frame”</div>
              </div>
              {/* floating hint */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 shadow-sm">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="font-mono text-xs text-text-muted">Canvas · 100%</span>
                <span className="hidden font-mono text-xs text-text-faint sm:inline">· actions, no navigation</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Create frame", "Auto layout", "Export as PNG"].map((a) => (
                <button key={a} onClick={() => setOpen(true)} className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium hover:border-accent hover:text-accent">
                  Try “{a}” →
                </button>
              ))}
            </div>
          </div>

          {/* props */}
          <div className="hidden rounded-2xl border border-border bg-surface p-3 lg:block">
            <p className="px-2 py-1 font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">Properties</p>
            <div className="mt-2 space-y-3">
              <div className="rounded-xl border border-border bg-white p-3">
                <p className="text-xs font-semibold">Frame</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <span className="rounded-lg bg-surface-alt px-2 py-1.5 font-mono text-xs">W 512</span>
                  <span className="rounded-lg bg-surface-alt px-2 py-1.5 font-mono text-xs">H 320</span>
                </div>
              </div>
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-xs font-bold text-amber-900">Shortcuts taught here</p>
                <p className="mt-1 text-xs leading-relaxed text-amber-800">Notice every row ends with a <em className="font-medium not-italic">CommandShortcut</em>. After 2–3 palette uses you stop opening it — you press the keys directly.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6">
          <h2 className="text-sm font-bold">Why the palette fits here</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-700">
            A design canvas has <strong>dozens of actions</strong> hidden in menus — frames, auto-layout, plugins, exports. The palette puts them one keystroke away, grouped by intent (Create / Arrange / Export). No “recent pages” noise: it’s pure <em className="font-medium not-italic">command execution</em>, not navigation. The fastest users never leave the keyboard.
          </p>
          <p className="mt-2 font-mono text-xs text-amber-800">Extensibility shown: actions-only grouping, command-specific icons, no heterogeneous objects — contrast with the Linear board.</p>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-30">
          <div className="absolute inset-0 bg-[#1c1917]/30 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div className="relative flex min-h-screen items-start justify-center px-4 pt-[10vh]">
            <div role="dialog" aria-modal="true" aria-label="Command palette" className="animate-palette-in flex w-full max-w-[640px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
              <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3.5">
                <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.4}>
                  <circle cx={7} cy={7} r={4.3} />
                  <path d="M10.2 10.2 13 13" strokeLinecap="round" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onKey}
                  placeholder="Run a command… (try “export” or “layout”)"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="cmd-list3"
                  className="flex-1 bg-transparent text-sm font-medium placeholder:text-zinc-400 focus:outline-none"
                />
                <span className="hidden rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-1 font-mono text-xs text-zinc-500 sm:inline-flex">ESC</span>
              </div>
              <div ref={listRef} id="cmd-list3" role="listbox" className="no-scrollbar max-h-[380px] overflow-auto py-2">
                {filteredGroups.length === 0 ? (
                  <div className="px-6 py-10 text-center text-sm text-zinc-500">No commands match “{query}”</div>
                ) : (
                  filteredGroups.map((g) => (
                    <div key={g.heading} role="group" aria-label={g.heading} className="px-2 py-1">
                      <div className="px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">{g.heading}</div>
                      <div className="space-y-0.5">
                        {g.items.map((c) => {
                          const idx = flat.indexOf(c);
                          const isActive = idx === active;
                          return (
                            <div
                              key={c.id}
                              role="option"
                              aria-selected={isActive}
                              data-idx={idx}
                              onMouseEnter={() => setActive(idx)}
                              onClick={() => run(c)}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 ${isActive ? "bg-accent text-white" : "hover:bg-zinc-100"}`}
                            >
                              <span className={`grid size-7 place-items-center rounded-md border ${isActive ? "border-white/20 bg-white/15" : "border-zinc-200 bg-white"}`}>
                                <Icon name={c.icon} active={isActive} />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className={`block truncate text-sm font-medium leading-none ${isActive ? "text-white" : "text-zinc-900"}`}>{c.label}</span>
                                {c.sub && <span className={`block truncate text-xs ${isActive ? "text-white/70" : "text-zinc-500"}`}>{c.sub}</span>}
                              </span>
                              {c.shortcut && (
                                <span className={`ml-auto shrink-0 rounded border px-1.5 py-0.5 font-mono text-xs ${isActive ? "border-white/20 bg-white/15 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-500"}`}>
                                  {c.shortcut}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-500">
                <span className="flex items-center gap-2">
                  <kbd className="rounded border bg-white px-1">↑</kbd>
                  <kbd className="rounded border bg-white px-1">↓</kbd> navigate · <kbd className="rounded border bg-white px-1">↵</kbd> run
                </span>
                <span>{flat.length} commands</span>
              </div>
            </div>
          </div>
          {toast && <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white shadow-lg">{toast}</div>}
        </div>
      )}
    </div>
  );
}
