"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Cmd = { id: string; label: string; sub?: string; icon?: string; shortcut?: string; group: string; meta?: string };
type Issue = { id: string; title: string; status: "todo" | "progress" | "done"; prio: "no" | "low" | "med" | "high" | "urgent"; assignee: string };

const ISSUES: Issue[] = [
  { id: "LIN-204", title: "Redesign pricing page teardown", status: "progress", prio: "high", assignee: "AS" },
  { id: "LIN-201", title: "Add command palette to marketing site", status: "todo", prio: "urgent", assignee: "MK" },
  { id: "LIN-198", title: "Fix scroll jank on mobile timeline", status: "todo", prio: "med", assignee: "JL" },
  { id: "LIN-195", title: "Invite flow — magic link expiry", status: "done", prio: "low", assignee: "SM" },
  { id: "LIN-193", title: "Q2 Roadmap review deck", status: "progress", prio: "high", assignee: "AS" },
];

const PEOPLE = [
  { id: "p1", label: "Assign to Maya Kim", sub: "maya@linear.app", icon: "MK", group: "People" },
  { id: "p2", label: "Assign to Alex Stone", sub: "alex@linear.app", icon: "AS", group: "People" },
  { id: "p3", label: "Assign to Jon Lee", sub: "jon@linear.app", icon: "JL", group: "People" },
];

const COMMANDS: Cmd[] = [
  { id: "c1", label: "Create new issue", sub: "Lin → New issue", icon: "plus", shortcut: "C", group: "Commands" },
  { id: "c2", label: "Change status…", sub: "Move current issue", icon: "status", shortcut: "S", group: "Commands" },
  { id: "c3", label: "Change priority…", sub: "Set urgent / high / med", icon: "prio", shortcut: "P", group: "Commands" },
  { id: "c4", label: "Copy Git branch name", icon: "branch", shortcut: "⌘ ⇧ C", group: "Commands" },
  { id: "c5", label: "Go to Inbox", icon: "inbox", shortcut: "G I", group: "Commands" },
];

function StatusDot({ s }: { s: Issue["status"] }) {
  const map: Record<string, string> = { todo: "bg-zinc-300", progress: "bg-amber-400", done: "bg-violet-500" };
  return <span className={`inline-block size-2 rounded-full ${map[s]}`} />;
}
function PrioIcon({ p, active }: { p: Issue["prio"]; active?: boolean }) {
  const v: Record<string, string> = { no: "—", low: "▁", med: "▃", high: "▅", urgent: "█" };
  return <span className={`font-mono text-xs ${active ? "text-white" : p === "urgent" ? "text-red-500" : p === "high" ? "text-orange-500" : "text-zinc-400"}`}>{v[p]}</span>;
}
function CmdIcon({ name, active }: { name?: string; active?: boolean }) {
  const cls = `h-3.5 w-3.5 ${active ? "text-white" : "text-zinc-500"}`;
  if (name === "plus")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M8 3.5V12.5M3.5 8H12.5" />
      </svg>
    );
  if (name === "status")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.3}>
        <rect x={3} y={3} width={10} height={10} rx={1.5} />
        <path d="M6 8.2 7.2 9.5 10 6.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (name === "prio")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.3}>
        <path d="M8 3 12.5 6.2v6.3H3.5V6.2z" />
        <path d="M3.5 6.2 8 9 12.5 6.2" />
      </svg>
    );
  if (name === "branch")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <circle cx={5} cy={4} r={1.7} />
        <circle cx={11} cy={12} r={1.7} />
        <circle cx={5} cy={12} r={1.7} />
        <path d="M5 5.7V10.3M5 10.3 9.3 10.3M9.3 10.3V10.3" />
        <path d="M11 5V10.3H5" strokeDasharray="1.5 1.2" />
      </svg>
    );
  if (name === "inbox")
    return (
      <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth={1.25}>
        <path d="M2 4.2h12v7.6H2z" />
        <path d="M2 4.5 8 8.8 14 4.5" />
      </svg>
    );
  return <span className={`grid size-7 place-items-center rounded-md border text-xs font-semibold ${active ? "border-white/20 bg-white/15 text-white" : "border-zinc-200 bg-white text-zinc-600"}`}>{name?.slice(0, 2).toUpperCase()}</span>;
}

export default function Page() {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
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

  const issueCmds: Cmd[] = ISSUES.map((i) => ({
    id: i.id,
    label: `${i.id} — ${i.title}`,
    sub: `${i.status} · ${i.prio} priority · ${i.assignee}`,
    icon: i.id,
    group: "Recent issues",
    meta: i.id,
  }));

  const all: Cmd[] = [...issueCmds, ...PEOPLE.map((p) => ({ ...p })), ...COMMANDS];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((c) => c.label.toLowerCase().includes(q) || (c.sub && c.sub.toLowerCase().includes(q)) || c.group.toLowerCase().includes(q));
  }, [query, all]);

  const groups = useMemo(() => {
    const order = ["Recent issues", "People", "Commands"];
    return order
      .map((g) => ({ heading: g, items: filtered.filter((c) => c.group === g) }))
      .filter((g) => g.items.length > 0);
  }, [filtered]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  useEffect(() => {
    if (active >= flat.length) setActive(0);
  }, [flat.length, active]);
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function run(c: Cmd) {
    setToast(`Ran “${c.label}”`);
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
      {/* top nav */}
      <div className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-6">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="font-medium hover:text-accent">
              ← Hub
            </Link>
            <span className="text-text-faint">/</span>
            <span className="font-semibold">Linear-style board</span>
            <span className="hidden rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 font-mono text-xs text-violet-700 sm:inline">Heterogeneous objects</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/scenarios/design-canvas" className="hidden rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium hover:border-accent sm:inline-flex">
              Next → Design canvas
            </Link>
            <button
              ref={triggerRef}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800"
            >
              <span>⌘K</span>
              <span className="hidden sm:inline">{open ? "Close" : "Open"} palette</span>
            </button>
          </div>
        </div>
      </div>

      {/* board backdrop */}
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-6">
        {/* board header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-8 place-items-center rounded-lg bg-violet-600 text-white">
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M3 5.5 8 3 13 5.5v5L8 13 3 10.5z" />
                <path d="M3 5.5 8 8 13 5.5" />
                <path d="M8 8V13" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none">Acme · Product</h1>
              <p className="mt-1 font-mono text-xs text-text-muted">5 issues · ⌘K to jump, filter, or act</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 font-mono text-xs text-text-muted sm:inline-flex">
              <span className="size-2 rounded-full bg-violet-500" /> 2 in progress
            </span>
            <button onClick={() => setOpen(true)} className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium hover:border-accent">
              New issue <span className="ml-1 rounded bg-zinc-900 px-1 py-0.5 font-mono text-xs text-white">C</span>
            </button>
          </div>
        </div>

        {/* columns */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { title: "Todo", status: "todo" as const, count: ISSUES.filter((i) => i.status === "todo").length },
            { title: "In Progress", status: "progress" as const, count: ISSUES.filter((i) => i.status === "progress").length },
            { title: "Done", status: "done" as const, count: ISSUES.filter((i) => i.status === "done").length },
          ].map((col) => (
            <div key={col.title} className="rounded-2xl border border-border bg-surface p-3">
              <div className="flex items-center justify-between px-1 pb-3">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-muted">
                  <StatusDot s={col.status} />
                  {col.title}
                </span>
                <span className="rounded-full bg-surface-alt px-2 py-0.5 font-mono text-xs text-text-muted">{col.count}</span>
              </div>
              <div className="space-y-2">
                {ISSUES.filter((i) => i.status === col.status).map((issue) => (
                  <div key={issue.id} className="rounded-xl border border-border bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-text-muted">{issue.id}</span>
                      <span className="ml-auto grid size-6 place-items-center rounded-full bg-zinc-900 text-xs font-semibold text-white">{issue.assignee}</span>
                    </div>
                    <p className="mt-1.5 text-sm font-medium leading-snug">{issue.title}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <PrioIcon p={issue.prio} />
                      <span className="font-mono text-xs capitalize text-text-muted">{issue.prio}</span>
                      <span className="ml-auto flex items-center gap-1 font-mono text-xs text-text-faint">
                        <StatusDot s={issue.status} /> {issue.status}
                      </span>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setToast("New issue draft opened");
                    setTimeout(() => setToast(null), 2000);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2.5 text-sm text-text-muted hover:border-accent hover:text-accent"
                >
                  <span className="text-lg leading-none">+</span> New issue
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* why it fits */}
        <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50/70 p-5 sm:p-6">
          <h2 className="text-sm font-bold">Why the palette fits here</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-700">
            Issue trackers are <em className="font-medium not-italic">navigation + action heavy</em>: jump to an issue, reassign, change status/priority, copy a branch — all without leaving the keyboard. The palette
            groups <strong>objects</strong> (recent issues, people) alongside <strong>commands</strong>, so one input handles “go to LIN-201” and “change priority” together. Press <kbd className="rounded bg-white px-1 py-0.5 font-mono text-xs">G I</kbd> or type “assign maya”.
          </p>
          <p className="mt-2 font-mono text-xs text-violet-700">Extensibility shown: heterogeneous groups, avatars, status dots, priority glyphs, and shortcuts per row.</p>
        </div>
      </div>

      {/* palette overlay */}
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
                  placeholder="Search issues, people, or run a command…"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="cmd-list2"
                  aria-autocomplete="list"
                  className="flex-1 bg-transparent text-sm font-medium placeholder:text-zinc-400 focus:outline-none"
                />
                <span className="hidden rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-1 font-mono text-xs text-zinc-500 sm:inline-flex">ESC</span>
              </div>
              <div ref={listRef} id="cmd-list2" role="listbox" className="no-scrollbar max-h-[380px] overflow-auto py-2">
                {groups.length === 0 ? (
                  <div className="px-6 py-10 text-center text-sm text-zinc-500">No results for “{query}”</div>
                ) : (
                  groups.map((g) => (
                    <div key={g.heading} role="group" aria-label={g.heading} className="px-2 py-1">
                      <div className="px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">{g.heading}</div>
                      <div className="space-y-0.5">
                        {g.items.map((c) => {
                          const flatIdx = flat.indexOf(c);
                          const isActive = flatIdx === active;
                          const isIssue = c.group === "Recent issues";
                          const issue = isIssue ? ISSUES.find((x) => x.id === c.meta) : null;
                          const isPerson = c.group === "People";
                          return (
                            <div
                              key={c.id}
                              role="option"
                              aria-selected={isActive}
                              data-idx={flatIdx}
                              onMouseEnter={() => setActive(flatIdx)}
                              onClick={() => run(c)}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 ${isActive ? "bg-accent text-white" : "hover:bg-zinc-100"}`}
                            >
                              {isIssue && issue ? (
                                <span className={`grid size-7 place-items-center rounded-md border ${isActive ? "border-white/20 bg-white/15" : "border-zinc-200 bg-white"}`}>
                                  <StatusDot s={issue.status} />
                                </span>
                              ) : isPerson ? (
                                <span className={`grid size-7 place-items-center rounded-full text-xs font-bold ${isActive ? "bg-white text-accent" : "bg-zinc-900 text-white"}`}>{c.icon}</span>
                              ) : (
                                <span className={`grid size-7 place-items-center rounded-md border ${isActive ? "border-white/20 bg-white/15 text-white" : "border-zinc-200 bg-white"}`}>
                                  <CmdIcon name={c.icon} active={isActive} />
                                </span>
                              )}
                              <span className="min-w-0 flex-1">
                                <span className={`block truncate text-sm font-medium leading-none ${isActive ? "text-white" : "text-zinc-900"}`}>{c.label}</span>
                                {c.sub && <span className={`block truncate text-xs ${isActive ? "text-white/70" : "text-zinc-500"}`}>{c.sub}</span>}
                              </span>
                              {isIssue && issue && <PrioIcon p={issue.prio} active={isActive} />}
                              {c.shortcut && (
                                <span className={`ml-1 shrink-0 rounded border px-1.5 py-0.5 font-mono text-xs ${isActive ? "border-white/20 bg-white/15 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-500"}`}>
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
                  <span className="hidden sm:inline-flex items-center gap-1">
                    <kbd className="rounded border bg-white px-1">↑</kbd>
                    <kbd className="rounded border bg-white px-1">↓</kbd> navigate
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border bg-white px-1">↵</kbd> run
                  </span>
                </span>
                <span>{filtered.length} results</span>
              </div>
            </div>
          </div>
          {toast && <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white shadow-lg">{toast}</div>}
        </div>
      )}
    </div>
  );
}
