"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

// ───────────────────────────────────────────────── Anatomy copy ──
const PARTS = [
  {
    n: 1,
    name: "Command input",
    token: "CommandInput",
    see: "The search field at the top. It filters everything below as you type — the palette is empty until you ask, then narrows instantly with each keystroke.",
    how: "A controlled <input> (value comes from state, a value the component remembers between keystrokes). Every onChange updates query state, React re-renders and re-filters the list. Like the search bar on your phone: type 'inv' and only Invoice items remain. Receives autoFocus and aria-controls.",
  },
  {
    n: 2,
    name: "Command group",
    token: "CommandGroup",
    see: "The quiet heading — Suggestions, Navigation, Commands — that turns a long list into scannable chunks. You read the heading, not every row.",
    how: "A <div role=\"group\"> with aria-label set to the heading text. In data it's { heading, items[] }. We filter items per group, then hide empty groups. Same idea as chapters in a menu: headings are not selectable, ArrowDown jumps over them.",
  },
  {
    n: 3,
    name: "Active command",
    token: "CommandItem · aria-selected",
    see: "The full-row highlight showing what Enter will run. Arrow keys move it; mouse hover moves it; one row is always active.",
    how: "activeIndex is a number in state (0 = first visible item). ArrowDown increments it (wrapping), ArrowUp decrements. The active <div role=\"option\" aria-selected=\"true\"> gets bg-accent + white text and is scrolled into view with scrollIntoView({block:'nearest'}). Enter reads items[activeIndex] and executes it.",
  },
  {
    n: 4,
    name: "Command shortcut",
    token: "CommandShortcut · ⌘ ⇧",
    see: "The keys aligned on the trailing edge — ⌘K, ⇧N, G H. They teach the faster way while you use the slower way.",
    how: "Trailing <span> with ml-auto and font-mono text. It's data on the item — shortcut: \"⌘ K\" — not a separate control and never receives focus. The handler listens for the same combo globally so pressing it runs the command even without opening the palette.",
  },
] as const;

// ───────────────────────────────────────────────── Demo data ──
type Cmd = {
  id: string;
  label: string;
  sub?: string;
  icon: string;
  shortcut?: string;
  group: string;
};

const ALL_GROUPS = ["Suggestions", "Navigation", "Commands"] as const;

const COMMANDS: Cmd[] = [
  // Suggestions
  { id: "s1", label: "Continue editing — Q2 Roadmap", sub: "Last edited 12 minutes ago", icon: "doc", shortcut: "↵", group: "Suggestions" },
  { id: "s2", label: "Open — Pricing teardown notes", sub: "You viewed yesterday", icon: "clock", group: "Suggestions" },
  // Navigation
  { id: "n1", label: "Go to Dashboard", icon: "home", shortcut: "G D", group: "Navigation" },
  { id: "n2", label: "Go to Inbox", icon: "inbox", shortcut: "G I", group: "Navigation" },
  { id: "n3", label: "Go to Settings", icon: "gear", shortcut: "G S", group: "Navigation" },
  { id: "n4", label: "Go to Members", sub: "12 members", icon: "users", group: "Navigation" },
  // Commands
  { id: "c1", label: "Create new document", icon: "plus", shortcut: "C", group: "Commands" },
  { id: "c2", label: "Create new project", icon: "plus", shortcut: "⇧ P", group: "Commands" },
  { id: "c3", label: "Invite member", sub: "Share with your team", icon: "invite", shortcut: "I", group: "Commands" },
  { id: "c4", label: "Toggle dark mode", icon: "moon", shortcut: "⌘ ⇧ T", group: "Commands" },
  { id: "c5", label: "Search issues…", icon: "search", shortcut: "/", group: "Commands" },
];

function Icon({ name, active }: { name: string; active?: boolean }) {
  const cls = `h-4 w-4 shrink-0 ${active ? "text-white" : "text-zinc-500"}`;
  if (name === "doc")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <path d="M5 2.5h4.2L11.5 5v8.5H5z" />
        <path d="M9.2 2.5v2.3H11.5" />
        <path d="M6.2 8.5h3.6M6.2 10.5h2.8" strokeLinecap="round" />
      </svg>
    );
  if (name === "clock")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <circle cx={8} cy={8} r={5.2} />
        <path d="M8 5.2V8l2 1.8" strokeLinecap="round" />
      </svg>
    );
  if (name === "home")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <path d="M2 7.2 8 2.8 14 7.2V13.2H2z" />
        <path d="M6 13.2V8.2h4v5" />
      </svg>
    );
  if (name === "inbox")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <path d="M2 4.2h12v7.6H2z" />
        <path d="M2 4.5 8 8.8 14 4.5" />
      </svg>
    );
  if (name === "gear")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <circle cx={8} cy={8} r={2.2} />
        <path d="M8 3V4.8M8 11.2V13M3 8H4.8M11.2 8H13M4.6 4.6l1.3 1.3M10.1 10.1l1.3 1.3M4.6 11.4l1.3-1.3M10.1 5.9l1.3-1.3" strokeLinecap="round" />
      </svg>
    );
  if (name === "users")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <circle cx={6} cy={6.2} r={2.2} />
        <circle cx={11} cy={6.2} r={1.7} />
        <path d="M2.2 12.5a3.2 3.2 0 0 1 3.2-3.2h1.2a3.2 3.2 0 0 1 3.2 3.2" />
        <path d="M9.8 10.2a2.6 2.6 0 0 1 2.6 2.6" />
      </svg>
    );
  if (name === "plus")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M8 3.5V12.5M3.5 8H12.5" />
      </svg>
    );
  if (name === "invite")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <circle cx={8} cy={5.2} r={2.2} />
        <path d="M3 12.8a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4" />
        <path d="M11.5 4.5v3M10 6h3" strokeLinecap="round" />
      </svg>
    );
  if (name === "moon")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <path d="M11.5 3.2A5.2 5.2 0 1 1 5 12.2 4.2 4.2 0 0 0 11.5 3.2Z" />
      </svg>
    );
  if (name === "search")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <circle cx={7} cy={7} r={4} />
        <path d="M10 10 13 13" strokeLinecap="round" />
      </svg>
    );
  return null;
}

function useIsMac() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform));
  }, []);
  return isMac;
}

export default function Page() {
  const isMac = useIsMac();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [activePill, setActivePill] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // global ⌘K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
        setTimeout(() => inputRef.current?.focus(), 10);
      }
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // focus input when opened
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(t);
    } else {
      // restore focus to trigger
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(q) || (c.sub && c.sub.toLowerCase().includes(q)) || c.group.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    return ALL_GROUPS.map((g) => ({
      heading: g,
      items: filtered.filter((c) => c.group === g),
    })).filter((g) => g.items.length > 0);
  }, [filtered]);

  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  // keep activeIndex in range
  useEffect(() => {
    if (activeIndex >= flat.length) setActiveIndex(0);
  }, [flat.length, activeIndex]);

  // scroll active into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-idx="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function run(cmd: Cmd) {
    setToast(`Ran “${cmd.label}”`);
    setTimeout(() => setToast(null), 2400);
    setIsOpen(false);
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % Math.max(1, flat.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flat.length) % Math.max(1, flat.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = flat[activeIndex];
      if (cmd) run(cmd);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  const kbd = isMac ? "⌘K" : "Ctrl K";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* top bar */}
      <div className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-7 place-items-center rounded-lg bg-foreground text-white">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
                <path d="M5.5 8h5M8 5.5v5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight">NameThatUi</span>
            <span className="hidden text-sm text-text-faint sm:inline">· Learning Lab</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/scenarios/linear-board" className="hidden rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:border-accent hover:text-accent sm:inline-flex">
              Scenarios
            </Link>
            <button
              ref={triggerRef}
              onClick={() => setIsOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium shadow-sm transition hover:border-accent"
            >
              <span className="hidden sm:inline">Open palette</span>
              <span className="sm:hidden">⌘K</span>
              <span className="grid h-5 place-items-center rounded-full bg-foreground px-2 font-mono text-xs text-white">{kbd}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        {/* header */}
        <header className="pb-10 pt-10 sm:pt-14">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent">Web · Keyboard &amp; Search</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Command Palette</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-muted">
            A keyboard-first overlay that searches <em className="font-medium not-italic text-foreground">actions, pages, and objects</em> from one place. Highlight one result at a time, hit Enter to run it.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            Also called: <span className="font-medium text-foreground">command menu · quick actions · launcher · command bar</span>
            <span className="text-text-faint"> · “the ⌘K menu”, “the vscode style command search”</span>
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["shadcn/ui <Command>", 'role="dialog"', 'role="combobox"', "Radix Dialog", "CommandInput", "CommandGroup", "CommandItem"].map((t) => (
              <span key={t} className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-foreground">
                {t}
              </span>
            ))}
          </div>
        </header>

        {/* intro strip */}
        <section className="mb-10 grid gap-3 sm:grid-cols-3">
          {[
            { k: "01 · Trigger", t: "⌘K opens it", d: "From anywhere — the overlay floats over the page. No button hunting, no navigation." },
            { k: "02 · Filter", t: "Type to narrow", d: "One input filters heterogeneous items: pages, actions, recent files. Results appear as you type." },
            { k: "03 · Execute", t: "Enter runs it", d: "One highlight, one action. Arrow keys move, Enter executes, Esc restores focus." },
          ].map((c) => (
            <div key={c.k} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">{c.k}</p>
              <h3 className="mt-2 text-sm font-semibold">{c.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{c.d}</p>
            </div>
          ))}
        </section>

        {/* ── Anatomy: live palette ── */}
        <section className="mb-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted">Anatomy · every part, named</h2>
            <p className="text-sm text-text-muted">
              <span className="hidden sm:inline">Press </span>
              <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs">{kbd}</kbd> to toggle · <span className="hidden sm:inline">↑↓</span>
              <span className="sm:hidden">Arrows</span> to move · ↵ to run
            </p>
          </div>

          {/* stage */}
          <div className="relative mt-4 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
            {/* backdrop grid */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(#e7e5e4_1px,transparent_1px)] [background-size:14px_14px] opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-alt/50" />
              {/* fake page behind */}
              <div className="absolute inset-0 p-6 opacity-70 sm:p-8">
                <div className="mx-auto max-w-4xl">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-28 rounded-lg bg-zinc-900" />
                    <div className="h-5 w-20 rounded-full bg-zinc-200" />
                    <div className="ml-auto hidden h-8 w-56 rounded-full border border-zinc-200 bg-white sm:block" />
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="h-24 rounded-2xl border border-zinc-200 bg-white" />
                    <div className="h-24 rounded-2xl border border-zinc-200 bg-white" />
                    <div className="h-24 rounded-2xl border border-zinc-200 bg-white" />
                  </div>
                  <div className="mt-4 h-40 rounded-2xl border border-zinc-200 bg-white" />
                </div>
              </div>
              {/* scrim when open */}
              {isOpen && <div className="animate-backdrop-in absolute inset-0 bg-[#1c1917]/30 backdrop-blur-[1px]" onClick={() => setIsOpen(false)} />}
            </div>

            {/* palette card - centered */}
            <div className="relative flex min-h-[520px] items-start justify-center px-4 py-10 sm:px-6 sm:py-12">
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Command palette"
                className={`relative flex w-full max-w-[640px] flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_16px_48px_rgba(0,0,0,0.18),0_4px_12px_rgba(0,0,0,0.08)] ${isOpen ? "animate-palette-in" : "hidden"}`}
              >
                {/* 1 · CommandInput */}
                <div
                  className={`flex items-center gap-3 border-b px-4 py-3.5 transition ${activePill === 1 ? "ring-2 ring-accent ring-inset bg-accent-light/50" : "border-zinc-200 bg-white"}`}
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.4}>
                    <circle cx={7} cy={7} r={4.3} />
                    <path d="M10.2 10.2 13 13" strokeLinecap="round" />
                  </svg>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActiveIndex(0);
                    }}
                    onKeyDown={onInputKeyDown}
                    placeholder="Type a command or search…"
                    aria-label="Search commands"
                    aria-controls="cmd-list"
                    role="combobox"
                    aria-expanded="true"
                    aria-autocomplete="list"
                    className="flex-1 bg-transparent text-sm font-medium placeholder:text-zinc-400 focus:outline-none"
                  />
                  <span className="hidden items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-1 font-mono text-xs text-zinc-500 sm:inline-flex">
                    ESC
                  </span>
                </div>

                {/* list */}
                <div ref={listRef} id="cmd-list" role="listbox" aria-label="Commands" className="no-scrollbar max-h-[320px] overflow-auto py-2">
                  {grouped.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                      <p className="text-sm font-medium text-zinc-900">No results for “{query}”</p>
                      <p className="mt-1 text-sm text-zinc-500">Try searching for dashboard, invite, or create.</p>
                    </div>
                  ) : (
                    grouped.map((g) => (
                      <div
                        key={g.heading}
                        role="group"
                        aria-label={g.heading}
                        className={`px-2 py-1 ${activePill === 2 ? "ring-1 ring-accent/30" : ""}`}
                      >
                        <div
                          className={`px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest ${activePill === 2 ? "text-accent" : "text-zinc-400"}`}
                        >
                          {g.heading}
                        </div>
                        <div className="space-y-0.5">
                          {g.items.map((cmd) => {
                            const flatIdx = flat.indexOf(cmd);
                            const isActive = flatIdx === activeIndex;
                            const pillFocus = activePill === 3 && isActive;
                            const showShortcutRing = activePill === 4 && isActive && cmd.shortcut;
                            return (
                              <div
                                key={cmd.id}
                                role="option"
                                aria-selected={isActive}
                                data-idx={flatIdx}
                                onMouseEnter={() => setActiveIndex(flatIdx)}
                                onClick={() => run(cmd)}
                                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive ? "bg-accent text-white shadow-sm" : "text-zinc-800 hover:bg-zinc-100"} ${pillFocus ? "ring-2 ring-accent ring-offset-1" : ""}`}
                              >
                                <span className={`grid size-7 place-items-center rounded-md border text-zinc-600 ${isActive ? "border-white/20 bg-white/15 text-white" : "border-zinc-200 bg-white"}`}>
                                  <Icon name={cmd.icon} active={isActive} />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className={`block truncate text-sm font-medium leading-none ${isActive ? "text-white" : "text-zinc-900"}`}>{cmd.label}</span>
                                  {cmd.sub && <span className={`block truncate text-xs ${isActive ? "text-white/70" : "text-zinc-500"}`}>{cmd.sub}</span>}
                                </span>
                                {cmd.shortcut && (
                                  <span
                                    className={`ml-auto shrink-0 rounded border px-1.5 py-0.5 font-mono text-xs tracking-wide ${isActive ? "border-white/20 bg-white/15 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-500"} ${showShortcutRing ? "ring-2 ring-amber-400" : ""}`}
                                  >
                                    {cmd.shortcut}
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

                {/* footer */}
                <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-3 py-2">
                  <div className="flex items-center gap-3 font-mono text-xs text-zinc-500">
                    <span className="hidden items-center gap-1 sm:inline-flex">
                      <kbd className="rounded border border-zinc-300 bg-white px-1 py-0.5">↑</kbd>
                      <kbd className="rounded border border-zinc-300 bg-white px-1 py-0.5">↓</kbd> navigate
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <kbd className="rounded border border-zinc-300 bg-white px-1 py-0.5">↵</kbd> select
                    </span>
                    <span className="hidden items-center gap-1 sm:inline-flex">
                      <kbd className="rounded border border-zinc-300 bg-white px-1 py-0.5">esc</kbd> close
                    </span>
                  </div>
                  <span className="font-mono text-xs text-zinc-400">10 commands</span>
                </div>
              </div>

              {/* closed state hint */}
              {!isOpen && (
                <button
                  onClick={() => setIsOpen(true)}
                  className="absolute inset-0 grid place-items-center"
                  aria-label="Open command palette"
                >
                  <span className="rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold shadow-lg transition hover:border-accent hover:text-accent">
                    Palette closed — press {kbd} or click to open
                  </span>
                </button>
              )}
            </div>

            {/* toast */}
            {toast && <div className="animate-palette-in pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white shadow-lg">{toast}</div>}

            {/* bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-center justify-between gap-2 border-t border-border bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen((v) => !v)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${isOpen ? "bg-foreground text-white" : "border border-border bg-white hover:bg-zinc-50"}`}
                >
                  {isOpen ? "Palette open" : "Palette closed"}
                </button>
                <span className="hidden font-mono text-xs text-text-muted sm:inline">Focus returns to trigger on Esc</span>
              </div>
              <span className="font-mono text-xs text-text-faint">role="dialog" · restores focus on dismissal</span>
            </div>
          </div>

          {/* callout pills desktop */}
          <div className="mt-4 hidden gap-2 lg:flex lg:flex-wrap">
            {PARTS.map((p) => (
              <button
                key={p.n}
                onMouseEnter={() => setActivePill(p.n)}
                onMouseLeave={() => setActivePill(null)}
                onClick={() => setActivePill(activePill === p.n ? null : p.n)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-left shadow-sm backdrop-blur transition ${activePill === p.n ? "border-accent bg-accent text-white" : "border-border bg-surface hover:border-accent/30"}`}
              >
                <span className={`grid size-5 place-items-center rounded-full text-xs font-bold ${activePill === p.n ? "bg-white text-accent" : "bg-accent text-white"}`}>{p.n}</span>
                <span className={`text-xs font-semibold ${activePill === p.n ? "text-white" : "text-foreground"}`}>{p.name}</span>
                <code className={`hidden font-mono text-xs xl:inline ${activePill === p.n ? "text-white/80" : "text-text-faint"}`}>{p.token}</code>
              </button>
            ))}
          </div>
          {/* mobile pills */}
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:hidden">
            {PARTS.map((p) => (
              <button
                key={p.n}
                onClick={() => setActivePill(activePill === p.n ? null : p.n)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${activePill === p.n ? "border-accent bg-accent-light" : "border-border bg-surface"}`}
              >
                <span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${activePill === p.n ? "bg-accent text-white" : "bg-foreground text-white"}`}>{p.n}</span>
                <span className="text-sm font-semibold">{p.name}</span>
                <span className="ml-auto hidden font-mono text-xs text-text-muted sm:inline">{p.token}</span>
              </button>
            ))}
          </div>
        </section>

        {/* layered explanations */}
        <section className="mb-12">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-text-muted">Every part, in plain language</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {PARTS.map((p) => (
              <div
                key={p.n}
                onMouseEnter={() => setActivePill(p.n)}
                onMouseLeave={() => setActivePill(null)}
                className={`group rounded-2xl border p-6 transition ${activePill === p.n ? "border-accent bg-accent-light shadow-sm" : "border-border bg-surface hover:border-border-strong"}`}
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className={`grid size-7 place-items-center rounded-full text-xs font-bold ${activePill === p.n ? "bg-accent text-white" : "bg-foreground text-white"}`}>{p.n}</span>
                  <div>
                    <h3 className="text-sm font-bold leading-none">{p.name}</h3>
                    <p className="mt-1 font-mono text-xs text-accent">{p.token}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-wide text-text-muted">What you see</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground">{p.see}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${activePill === p.n ? "bg-white" : "bg-surface-alt group-hover:bg-white"}`}>
                    <p className="font-mono text-xs font-semibold uppercase tracking-wide text-text-muted">How it works</p>
                    <p className="mt-1 text-sm leading-relaxed text-text-muted">{p.how}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* palette vs combobox */}
        <section className="mb-12">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
            <h3 className="text-sm font-bold">Palette vs. Combobox — don’t mix them</h3>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-sm font-semibold">Command palette does…</p>
                <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-text-muted">
                  <li>• Launches <em className="font-medium not-italic text-foreground">heterogeneous</em> things: actions, pages, objects, recent files.</li>
                  <li>• Floats as a dialog over any page — opened by ⌘K globally.</li>
                  <li>• Executes immediately on Enter; restores focus to where you were.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-sm font-semibold">Combobox does…</p>
                <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-text-muted">
                  <li>• Chooses <em className="font-medium not-italic text-foreground">one value</em> for a single field (e.g., pick a country).</li>
                  <li>• Lives inside a form; its value stays in the input after selection.</li>
                  <li>• Writes back to that field — not launching a command.</li>
                </ul>
              </div>
            </div>
            <p className="mt-4 font-mono text-xs text-amber-800">Rule of thumb: palette = do something anywhere. combobox = choose a value here.</p>
          </div>
        </section>

        {/* in code */}
        <section className="mb-12">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-text-muted">In code</h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="p-6">
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">ARIA</p>
                <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">role="dialog" + role="combobox"</code>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">Dialog wraps the overlay; combobox on the input with aria-controls → listbox. listbox → option + aria-selected for the active row.</p>
              </div>
              <div className="p-6">
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">Keyboard</p>
                <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">⌘K open · ↑↓ move · ↵ run · Esc close</code>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">Trap focus inside while open; on Esc restore focus to the element that opened it.</p>
              </div>
              <div className="p-6">
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">shadcn/ui</p>
                <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">{"<Command><CommandInput /><CommandGroup><CommandItem />"}</code>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">Command handles filtering + active selection; Dialog handles the overlay.</p>
              </div>
              <div className="p-6">
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">Radix</p>
                <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">Dialog.Root + Command primitive</code>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">Or build headless: input + filtered groups + roving activeIndex + scrollIntoView.</p>
              </div>
            </div>
          </div>
        </section>

        {/* scenarios */}
        <section>
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-text-muted">See it in the wild — three scenarios</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { href: "/scenarios/linear-board", title: "Linear-style board", desc: "Issue tracker: recent issues, people, and status-change commands. Grouped + avatars + two-level detail.", accent: "Heterogeneous objects" },
              { href: "/scenarios/design-canvas", title: "Design canvas", desc: "Figma-like: create, insert, run plugins, arrange layers. Actions only, no navigation.", accent: "Actions over objects" },
              { href: "/scenarios/docs-search", title: "Docs jump-to", desc: "Wiki/docs: fuzzy search across pages + people. Highlights matches, shows recents.", accent: "Search over pages" },
            ].map((s) => (
              <Link key={s.href} href={s.href} className="group flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-accent hover:shadow-md">
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">{s.accent}</p>
                <h3 className="mt-2 text-sm font-semibold group-hover:text-accent">{s.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-muted">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">Explore <span aria-hidden>→</span></span>
              </Link>
            ))}
          </div>
        </section>

        <p className="mt-10 text-center font-mono text-xs text-text-faint">Built with Next.js 16 · Tailwind v4 · no extra deps · focus restores on close · try ⌘K anywhere</p>
      </main>
    </div>
  );
}
