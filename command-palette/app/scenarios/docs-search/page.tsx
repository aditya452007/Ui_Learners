"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Doc = { id: string; title: string; path: string; icon: string; updated: string; group: string };
type Person = { id: string; name: string; handle: string; avatar: string; group: string };
type Cmd = { id: string; label: string; sub?: string; icon: string; shortcut?: string; group: string };

const DOCS: Doc[] = [
  { id: "d1", title: "Getting started — Installation", path: "Docs › Getting started", icon: "📦", updated: "Updated 2h ago", group: "Pages" },
  { id: "d2", title: "Command palette — API reference", path: "Docs › Components", icon: "⌘", updated: "Updated yesterday", group: "Pages" },
  { id: "d3", title: "Authentication & Sessions", path: "Guides › Auth", icon: "🔐", updated: "Updated 3 days ago", group: "Pages" },
  { id: "d4", title: "Pricing teardown — Q2 review", path: "Internal › Reviews", icon: "💰", updated: "Updated last week", group: "Pages" },
  { id: "d5", title: "Q2 Roadmap — Product planning", path: "Internal › Planning", icon: "🗺️", updated: "Viewed 12 min ago", group: "Recent" },
  { id: "d6", title: "Design tokens — Color & Type", path: "Foundation › Tokens", icon: "🎨", updated: "Viewed yesterday", group: "Recent" },
];

const PEOPLE: Person[] = [
  { id: "pe1", name: "Maya Kim", handle: "maya", avatar: "MK", group: "People" },
  { id: "pe2", name: "Alex Stone", handle: "alex", avatar: "AS", group: "People" },
  { id: "pe3", name: "Jon Lee", handle: "jon", avatar: "JL", group: "People" },
];

const ACTIONS: Cmd[] = [
  { id: "a1", label: "Create new page…", sub: "Blank page in this workspace", icon: "plus", group: "Actions" },
  { id: "a2", label: "Search in docs…", sub: "Full-text search", icon: "search", shortcut: "/", group: "Actions" },
  { id: "a3", label: "Copy link to current page", icon: "link", shortcut: "⌘ L", group: "Actions" },
];

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-amber-200 px-0.5 font-semibold text-foreground">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function Icon({ name, active }: { name: string; active?: boolean }) {
  const cls = `h-4 w-4 ${active ? "text-white" : "text-zinc-500"}`;
  if (name === "plus")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M8 3.5V12.5M3.5 8H12.5" />
      </svg>
    );
  if (name === "search")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <circle cx={7} cy={7} r={4} />
        <path d="M10 10 13 13" strokeLinecap="round" />
      </svg>
    );
  if (name === "link")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <path d="M6 7.5 5 8.5A2 2 0 0 0 8 11l1-1M10 8.5l1-1A2 2 0 0 0 8 5l-1 1" strokeLinecap="round" />
        <path d="M7 9 9 7" strokeLinecap="round" />
      </svg>
    );
  return null;
}

type FlatItem = (Doc & { kind: "doc" }) | (Person & { kind: "person" }) | (Cmd & { kind: "action" });

export default function Page() {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [currentDoc, setCurrentDoc] = useState(DOCS[1]);
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

  const flatAll: FlatItem[] = useMemo(
    () => [
      ...DOCS.map((d) => ({ ...d, kind: "doc" as const })),
      ...PEOPLE.map((p) => ({ ...p, kind: "person" as const })),
      ...ACTIONS.map((a) => ({ ...a, kind: "action" as const })),
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return flatAll;
    return flatAll.filter((it) => {
      if (it.kind === "doc") return it.title.toLowerCase().includes(q) || it.path.toLowerCase().includes(q);
      if (it.kind === "person") return it.name.toLowerCase().includes(q) || it.handle.toLowerCase().includes(q);
      return it.label.toLowerCase().includes(q) || (it.sub && it.sub.toLowerCase().includes(q));
    });
  }, [query, flatAll]);

  // when query empty: show Recent first, else Pages. Maintain order: Recent, Pages, People, Actions
  const groups = useMemo(() => {
    const order = query.trim() ? ["Pages", "Recent", "People", "Actions"] : ["Recent", "Pages", "People", "Actions"];
    return order
      .map((g) => ({ heading: g, items: filtered.filter((it: FlatItem) => it.group === g) }))
      .filter((g) => g.items.length > 0);
  }, [filtered, query]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => {
    if (active >= flat.length) setActive(0);
  }, [flat.length, active]);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function run(it: FlatItem) {
    if (it.kind === "doc") {
      setCurrentDoc(it as Doc);
      setToast(`Opened “${(it as Doc).title}”`);
    } else if (it.kind === "person") {
      setToast(`Opened profile — ${(it as Person).name}`);
    } else {
      setToast(`Ran “${(it as Cmd).label}”`);
    }
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
      const it = flat[active];
      if (it) run(it);
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
            <span className="font-semibold">Docs jump-to</span>
            <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-xs text-emerald-700 sm:inline">Search pages & people</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium hover:border-accent sm:inline-flex">
              ← Back to hub
            </Link>
            <button ref={triggerRef} onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-2 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-white">
              ⌘K <span className="hidden sm:inline">{open ? "Close" : "Jump to…"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-10 pt-6">
        {/* doc site layout */}
        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          {/* sidebar */}
          <div className="hidden rounded-2xl border border-border bg-surface p-4 lg:block">
            <div className="flex items-center gap-2">
              <div className="grid size-7 place-items-center rounded-lg bg-foreground text-white">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.4}>
                  <path d="M4 2.5h5.5L12 5v8.5H4z" />
                  <path d="M9.5 2.5v2.5H12" />
                </svg>
              </div>
              <span className="text-sm font-bold">Acme Docs</span>
              <span className="ml-auto rounded-full bg-surface-alt px-2 py-0.5 font-mono text-xs text-text-muted">⌘K</span>
            </div>
            <button onClick={() => setOpen(true)} className="mt-4 flex w-full items-center gap-2 rounded-xl border border-border bg-surface-alt px-3 py-2 text-left">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.4}>
                <circle cx={7} cy={7} r={4.3} />
                <path d="M10.2 10.2 13 13" strokeLinecap="round" />
              </svg>
              <span className="text-sm text-text-muted">Search…</span>
              <span className="ml-auto rounded border bg-white px-1.5 py-0.5 font-mono text-xs">⌘K</span>
            </button>
            <div className="mt-5 space-y-4">
              {[
                { heading: "Getting started", items: ["Installation", "Quick start", "Configuration"] },
                { heading: "Components", items: ["Command palette", "Dialog", "Popover"] },
                { heading: "Guides", items: ["Authentication", "Theming"] },
              ].map((sec) => (
                <div key={sec.heading}>
                  <p className="px-2 font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">{sec.heading}</p>
                  <div className="mt-1.5 space-y-0.5">
                    {sec.items.map((it) => (
                      <div key={it} className={`rounded-lg px-2 py-1.5 text-sm ${it === "Command palette" ? "bg-accent font-medium text-white" : "text-text-muted hover:bg-surface-alt hover:text-foreground"}`}>
                        {it}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-accent-light p-3">
              <p className="text-xs font-bold text-accent">Fuzzy match + highlight</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">Type “auth” or “pri” and the matching slice glows. Recent pages surface when the input is empty — no typing needed for what you just saw.</p>
            </div>
          </div>

          {/* article */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-text-muted">{currentDoc.path}</p>
                <h1 className="mt-1 max-w-xl text-2xl font-bold leading-tight sm:text-3xl">{currentDoc.title}</h1>
                <p className="mt-2 flex items-center gap-2 font-mono text-xs text-text-muted">
                  <span className="size-2 rounded-full bg-emerald-500" /> {currentDoc.updated} · press{" "}
                  <kbd className="rounded border border-border bg-surface-alt px-1 py-0.5">⌘K</kbd> to jump
                </p>
              </div>
              <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium hover:border-accent">
                <span className="hidden sm:inline">Jump to…</span> ⌘K
              </button>
            </div>
            <div className="prose prose-zinc mt-6 max-w-none">
              <p className="leading-relaxed text-text-muted">
                The command palette is the fastest way through a docs site with hundreds of pages. Instead of hunting the sidebar or guessing the URL, you hit{" "}
                <kbd className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-xs text-white">⌘K</kbd> and type a fragment — “auth”, “tokens”, “pricing” — and the match is highlighted in place. Recent pages and people stay at the top when the input is empty.
              </p>
              <div className="mt-6 rounded-xl border border-border bg-surface-alt p-4">
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">On this page</p>
                <ul className="mt-2 space-y-1.5 text-sm text-text-muted">
                  <li>• Anatomy — Input, Group, Active item, Shortcut</li>
                  <li>• When to use a palette vs. a combobox</li>
                  <li>• Keyboard: ⌘K · ↑↓ · Enter · Esc (focus restores)</li>
                </ul>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-white p-4">
                  <p className="text-sm font-semibold">Try it</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">Hit ⌘K and type “auth” → jumps to Authentication. Type “maya” → opens a person. Empty input shows your two most recent pages.</p>
                </div>
                <div className="rounded-xl border border-border bg-white p-4">
                  <p className="text-sm font-semibold">What you gain</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">2–3 keystrokes instead of 3 clicks + scroll. Especially powerful when the sidebar is deep — guides stay reachable instantly.</p>
                </div>
              </div>
              <pre className="mt-6 overflow-auto rounded-xl bg-zinc-900 p-4 font-mono text-xs leading-relaxed text-zinc-200">
                {`// open + focus + restore
function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    setOpen(v => !v);        // toggle dialog
    inputRef.current?.focus();
  }
  if (e.key === 'Escape') {
    setOpen(false);
    triggerRef.current?.focus(); // restore
  }
}`}
              </pre>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <button onClick={() => setOpen(true)} className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600">
                Open palette → jump to a page
              </button>
              <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1.5 font-mono text-xs text-text-muted">type “pri” to see highlight</span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
          <h2 className="text-sm font-bold">Why the palette fits here</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-700">
            Docs are <em className="font-medium not-italic">search-heavy navigation</em>: hundreds of pages, but you only ever want one. The palette collapses the whole sidebar into a filtered list with <strong>highlighted matches</strong> and surfaces <strong>recents</strong> when you haven’t typed yet. It’s broader than a combobox because the same input finds pages, people, and actions like “Create new page”.
          </p>
          <p className="mt-2 font-mono text-xs text-emerald-800">Extensibility shown: inline match highlights, empty-state recents, mixed types (pages + people + actions), no per-row shortcuts for pages — just jump.</p>
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
                  placeholder="Search pages, people, or run a command…"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="cmd-list4"
                  className="flex-1 bg-transparent text-sm font-medium placeholder:text-zinc-400 focus:outline-none"
                />
                <span className="hidden rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-1 font-mono text-xs text-zinc-500 sm:inline-flex">ESC</span>
              </div>
              <div ref={listRef} id="cmd-list4" role="listbox" className="no-scrollbar max-h-[380px] overflow-auto py-2">
                {groups.length === 0 ? (
                  <div className="px-6 py-10 text-center">
                    <p className="text-sm font-medium">No results for “{query}”</p>
                    <p className="mt-1 text-sm text-zinc-500">Try “auth”, “pricing”, or “maya”.</p>
                  </div>
                ) : (
                  groups.map((g) => (
                    <div key={g.heading} role="group" aria-label={g.heading} className="px-2 py-1">
                      <div className="px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">{g.heading}</div>
                      <div className="space-y-0.5">
                        {g.items.map((it) => {
                          const idx = flat.indexOf(it as FlatItem);
                          const isActive = idx === active;
                          const isDoc = (it as FlatItem).kind === "doc";
                          const isPerson = (it as FlatItem).kind === "person";
                          return (
                            <div
                              key={(it as FlatItem).id}
                              role="option"
                              aria-selected={isActive}
                              data-idx={idx}
                              onMouseEnter={() => setActive(idx)}
                              onClick={() => run(it as FlatItem)}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 ${isActive ? "bg-accent text-white" : "hover:bg-zinc-100"}`}
                            >
                              {isDoc ? (
                                <span className={`grid size-7 place-items-center rounded-md border text-sm ${isActive ? "border-white/20 bg-white/15 text-white" : "border-zinc-200 bg-white"}`}>{(it as Doc).icon}</span>
                              ) : isPerson ? (
                                <span className={`grid size-7 place-items-center rounded-full text-xs font-bold ${isActive ? "bg-white text-accent" : "bg-zinc-900 text-white"}`}>{(it as Person).avatar}</span>
                              ) : (
                                <span className={`grid size-7 place-items-center rounded-md border ${isActive ? "border-white/20 bg-white/15" : "border-zinc-200 bg-white"}`}>
                                  <Icon name={(it as Cmd).icon} active={isActive} />
                                </span>
                              )}
                              <span className="min-w-0 flex-1">
                                <span className={`block truncate text-sm font-medium leading-none ${isActive ? "text-white" : "text-zinc-900"}`}>
                                  {isDoc ? <Highlight text={(it as Doc).title} q={query} /> : isPerson ? (it as Person).name : (it as Cmd).label}
                                </span>
                                <span className={`block truncate text-xs ${isActive ? "text-white/70" : "text-zinc-500"}`}>
                                  {isDoc ? (it as Doc).path + " · " + (it as Doc).updated : isPerson ? "@" + (it as Person).handle : (it as Cmd).sub}
                                </span>
                              </span>
                              {(it as Cmd).shortcut && (
                                <span className={`ml-auto hidden shrink-0 rounded border px-1.5 py-0.5 font-mono text-xs sm:inline-flex ${isActive ? "border-white/20 bg-white/15 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-500"}`}>
                                  {(it as Cmd).shortcut}
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
                  <kbd className="rounded border bg-white px-1">↓</kbd> navigate · <kbd className="rounded border bg-white px-1">↵</kbd> open · <kbd className="rounded border bg-white px-1">esc</kbd> close
                </span>
                <span className="hidden sm:inline">{flat.length} results · highlights matches</span>
              </div>
            </div>
          </div>
          {toast && <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white shadow-lg">{toast}</div>}
        </div>
      )}
    </div>
  );
}
