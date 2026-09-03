"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// ── A package navigator: some folders load lazily, one is empty ──

type Kids = Node[] | null; // null = not loaded yet (lazy)
type Node = { id: string; label: string; kind: "folder" | "file"; lang?: string; kids: Kids };

const INITIAL: Node[] = [
  {
    id: "sources",
    label: "Sources",
    kind: "folder",
    kids: [
      { id: "app-main", label: "AppMain.swift", kind: "file", lang: "swift", kids: [] },
      { id: "outline-view", label: "OutlineView.swift", kind: "file", lang: "swift", kids: [] },
      {
        id: "views",
        label: "Views",
        kind: "folder",
        kids: [
          { id: "row-view", label: "OutlineRow.swift", kind: "file", lang: "swift", kids: [] },
          { id: "triangle-view", label: "DisclosureTriangle.swift", kind: "file", lang: "swift", kids: [] },
        ],
      },
    ],
  },
  {
    id: "deps",
    label: "Dependencies",
    kind: "folder",
    kids: null, // lazy — fetched on first expand
  },
  {
    id: "tests",
    label: "Tests",
    kind: "folder",
    kids: [{ id: "outline-tests", label: "OutlineTests.swift", kind: "file", lang: "swift", kids: [] }],
  },
  {
    id: "artifacts",
    label: "Build Artifacts",
    kind: "folder",
    kids: [], // honestly empty — no triangle
  },
  { id: "package-swift", label: "Package.swift", kind: "file", lang: "swift", kids: [] },
];

const LAZY_PAYLOAD: Node[] = [
  {
    id: "netkit",
    label: "NetKit 2.4.1",
    kind: "folder",
    kids: [
      { id: "netkit-src", label: "Client.swift", kind: "file", lang: "swift", kids: [] },
      { id: "netkit-doc", label: "README.md", kind: "file", lang: "md", kids: [] },
    ],
  },
  {
    id: "layoutcore",
    label: "LayoutCore 1.9.0",
    kind: "folder",
    kids: [{ id: "layout-src", label: "Stack.swift", kind: "file", lang: "swift", kids: [] }],
  },
  { id: "license", label: "LICENSES.txt", kind: "file", lang: "txt", kids: [] },
];

function Triangle({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      className="disclosure-tri shrink-0"
      style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
    >
      <path d="M3.2 1.8 7.8 5 3.2 8.2V1.8Z" fill="#57534e" stroke="#57534e" strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0 animate-spin">
      <circle cx="6" cy="6" r="4.5" stroke="#d6d3d1" strokeWidth="1.6" />
      <path d="M10.5 6A4.5 4.5 0 0 0 6 1.5" stroke="#0a84ff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const LANG_DOT: Record<string, string> = { swift: "bg-[#f05138]", md: "bg-[#0a84ff]", txt: "bg-[#a8a29e]" };

type FlatRow = { node: Node; depth: number; expandable: boolean };

function flatten(tree: Node[], expanded: Record<string, boolean>): FlatRow[] {
  const out: FlatRow[] = [];
  function walk(nodes: Node[], depth: number) {
    for (const n of nodes) {
      const expandable = n.kind === "folder" && n.kids !== null && n.kids.length > 0 ? true : n.kind === "folder" && n.kids === null ? true : false;
      out.push({ node: n, depth, expandable });
      if (n.kind === "folder" && n.kids && expanded[n.id]) walk(n.kids, depth + 1);
    }
  }
  walk(tree, 0);
  return out;
}

function setKids(tree: Node[], id: string, kids: Node[]): Node[] {
  return tree.map((n) => {
    if (n.id === id) return { ...n, kids };
    if (n.kids) return { ...n, kids: setKids(n.kids, id, kids) };
    return n;
  });
}

function findPath(tree: Node[], target: string, trail: string[] = []): string[] | null {
  for (const n of tree) {
    if (n.id === target) return trail;
    if (n.kids) {
      const r = findPath(n.kids, target, [...trail, n.id]);
      if (r) return r;
    }
  }
  return null;
}

function matches(node: Node, q: string) {
  return node.label.toLowerCase().includes(q);
}

function searchIds(tree: Node[], q: string, acc: string[] = []): string[] {
  for (const n of tree) {
    if (matches(n, q)) acc.push(n.id);
    if (n.kids) searchIds(n.kids, q, acc);
  }
  return acc;
}

export default function PackageNavigatorPage() {
  const [tree, setTree] = useState<Node[]>(INITIAL);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ sources: true });
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState("triangle-view");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  // auto-expand ancestors of matches (lazy folder excluded until loaded)
  const autoExpanded = useMemo(() => {
    if (!searching) return expanded;
    const hits = searchIds(tree, q);
    const next = { ...expanded };
    for (const id of hits) {
      const trail = findPath(tree, id) ?? [];
      for (const a of trail) next[a] = true;
    }
    return next;
  }, [searching, q, tree, expanded]);

  const rows = useMemo(() => flatten(tree, autoExpanded), [tree, autoExpanded]);

  const visibleRows = useMemo(() => {
    if (!searching) return rows;
    const hits = new Set(searchIds(tree, q));
    const ancestors = new Set<string>();
    for (const id of hits) for (const a of findPath(tree, id) ?? []) ancestors.add(a);
    return rows.filter((r) => hits.has(r.node.id) || ancestors.has(r.node.id));
  }, [rows, searching, q, tree]);

  const matchCount = useMemo(() => (searching ? searchIds(tree, q).length : 0), [searching, q, tree]);

  function toggle(id: string) {
    const node = (function find(nodes: Node[]): Node | undefined {
      for (const n of nodes) {
        if (n.id === id) return n;
        if (n.kids) {
          const r = find(n.kids);
          if (r) return r;
        }
      }
    })(tree);
    if (!node) return;
    if (node.kids === null && !expanded[id] && !loading[id]) {
      // first expand of a lazy folder: show spinner, then resolve
      setLoading((p) => ({ ...p, [id]: true }));
      setExpanded((p) => ({ ...p, [id]: true }));
      window.setTimeout(() => {
        setTree((t) => setKids(t, id, LAZY_PAYLOAD));
        setLoading((p) => ({ ...p, [id]: false }));
      }, 800);
      return;
    }
    setExpanded((p) => ({ ...p, [id]: !p[id] }));
  }

  useEffect(() => {
    if (searching && visibleRows.length > 0) setSelected(visibleRows[0].node.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <nav className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs text-text-faint">
        <Link href="/" className="rounded-full border border-border bg-surface px-3 py-1.5 transition-colors hover:border-[#0a84ff]/40 hover:text-[#0a84ff]">
          ← Learning hub
        </Link>
        <span aria-hidden="true">·</span>
        <span className="px-1 font-semibold text-foreground">Scenario 3 — Package navigator</span>
        <span aria-hidden="true">·</span>
        <Link href="/scenarios/finder-outline" className="rounded-full border border-border bg-surface px-3 py-1.5 transition-colors hover:border-[#0a84ff]/40 hover:text-[#0a84ff]">
          Back to Finder outline →
        </Link>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0a84ff]">Scenario 3 · lazy disclosure · search + empty states</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Package navigator</h1>
        <p className="mt-4 leading-relaxed text-text-muted">
          An Xcode-style navigator for a Swift package. Folders disclose their contents — but{" "}
          <span className="font-mono text-sm">Dependencies</span> fetches its listing only when first opened, search
          auto-expands the ancestors of every match, and the honestly-empty{" "}
          <span className="font-mono text-sm">Build Artifacts</span> folder gets no triangle at all.
        </p>
      </header>

      <div className="mb-8 rounded-xl border border-[#0a84ff]/20 bg-[#eff6ff] px-5 py-4">
        <p className="text-sm font-semibold text-[#0a84ff]">Why disclosure fits here</p>
        <p className="mt-1 text-sm leading-relaxed text-text-muted">
          Navigators juggle thousands of nodes — loading them all upfront would stall launch. Lazy disclosure fetches a
          folder&apos;s children on first expand (note the spinner inside the row), search turns the triangle into a
          wayfinding device by opening only matching trails, and empty folders opt out of the affordance instead of
          opening onto nothing.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-8">
        <div
          className="relative overflow-visible rounded-xl border border-border bg-[#fcfcfa] p-3 sm:p-6"
          style={{ backgroundImage: "radial-gradient(circle, #e7e5e4 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        >
          <div className="relative mx-auto max-w-[600px] overflow-hidden rounded-xl border border-[#d6d3d1] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="flex h-9 items-center justify-between border-b border-border bg-[#f5f5f4] px-3">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full border border-[#e0443e] bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full border border-[#d9a01d] bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full border border-[#1fac2e] bg-[#28c840]" />
              </div>
              <span className="text-xs font-medium text-text-muted">AcmeKit — Package</span>
              <span className="font-mono text-[11px] text-text-faint">{visibleRows.length} rows</span>
            </div>

            {/* search */}
            <div className="border-b border-border bg-[#fafaf9] px-3 py-2">
              <label className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 focus-within:border-[#0a84ff] focus-within:ring-2 focus-within:ring-[#0a84ff]/20">
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <circle cx="5" cy="5" r="3.2" stroke="#a8a29e" strokeWidth="1.2" />
                  <path d="M7.5 7.5 10 10" stroke="#a8a29e" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter navigator — try “swift” or “net”"
                  aria-label="Filter navigator"
                  className="w-full bg-transparent text-[13px] outline-none placeholder:text-text-faint"
                />
                {query && (
                  <button onClick={() => setQuery("")} aria-label="Clear filter" className="grid h-5 w-5 place-items-center rounded-full bg-surface-alt text-xs text-text-muted hover:text-foreground">
                    ×
                  </button>
                )}
              </label>
              {searching && (
                <p className="px-1 pt-1.5 font-mono text-[11px] text-text-muted">
                  {matchCount} match{matchCount === 1 ? "" : "es"} · ancestors auto-expanded ·{" "}
                  <button onClick={() => setQuery("")} className="font-semibold text-[#0a84ff] hover:underline">clear</button>
                </p>
              )}
            </div>

            <div className="max-h-[340px] overflow-y-auto bg-white py-1.5 col-scroll" role="tree" aria-label="Package navigator">
              {visibleRows.length === 0 && (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm font-semibold text-[#1c1917]">No matches for “{query}”</p>
                  <p className="mt-1 text-xs text-text-muted">The outline folds flat — nothing to disclose. Try “swift”.</p>
                </div>
              )}
              {visibleRows.map(({ node, depth, expandable }) => {
                const open = !!autoExpanded[node.id];
                const isSel = selected === node.id;
                const isLoading = !!loading[node.id];
                const isEmpty = node.kind === "folder" && node.kids !== null && node.kids.length === 0;
                const hl = searching && matches(node, q);
                return (
                  <div
                    key={node.id}
                    role="treeitem"
                    aria-expanded={expandable ? open : undefined}
                    aria-selected={isSel}
                    className={`flex w-full items-center pr-3 transition-colors ${
                      isSel ? "bg-[#0a84ff] text-white" : "text-[#1c1917] hover:bg-[#f5f5f4]"
                    }`}
                    style={{ paddingLeft: 10 + depth * 24, paddingTop: 2, paddingBottom: 2 }}
                  >
                    {expandable ? (
                      <button
                        onClick={() => toggle(node.id)}
                        aria-label={open ? `Collapse ${node.label}` : `Expand ${node.label}`}
                        aria-expanded={open}
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-md transition-colors ${
                          isSel ? "hover:bg-white/20" : "hover:bg-black/[0.06]"
                        }`}
                      >
                        <Triangle open={open} />
                      </button>
                    ) : (
                      <span
                        className="h-6 w-6 shrink-0"
                        aria-hidden="true"
                        title={isEmpty ? "Empty folder — no triangle because there is nothing to reveal" : "File — no children"}
                      />
                    )}
                    <button onClick={() => setSelected(node.id)} onDoubleClick={() => expandable && toggle(node.id)} className="flex min-w-0 flex-1 items-center gap-2 rounded px-1 py-[5px] text-left">
                      {node.kind === "folder" ? (
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
                          <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h3.2l1.3 1.5H12.5A1.5 1.5 0 0 1 14 7v4.5A1.5 1.5 0 0 1 12.5 13h-9A1.5 1.5 0 0 1 2 11.5v-6Z" fill={isSel ? "white" : "#0a84ff"} fillOpacity={isSel ? 0.9 : 0.12} stroke={isSel ? "white" : "#0a84ff"} strokeWidth="1.1" />
                        </svg>
                      ) : (
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-[4px] ${node.lang ? LANG_DOT[node.lang] ?? "bg-stone-300" : "bg-stone-300"}`} aria-hidden="true" />
                      )}
                      <span className={`flex-1 truncate font-mono text-[13px] leading-none ${hl && !isSel ? "font-semibold text-[#0a84ff]" : ""} ${isSel ? "font-semibold" : ""}`}>
                        {node.label}
                      </span>
                      {isLoading && <Spinner />}
                      {node.id === "deps" && !isLoading && node.kids === null && (
                        <span className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${isSel ? "bg-white/20 text-white" : "bg-surface-alt text-text-faint"}`}>lazy</span>
                      )}
                      {node.id === "deps" && !isLoading && node.kids !== null && (
                        <span className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${isSel ? "bg-white/20 text-white" : "bg-surface-alt text-text-faint"}`}>{node.kids.length} pkgs</span>
                      )}
                      {isEmpty && (
                        <span className={`font-mono text-[10px] italic ${isSel ? "text-white/70" : "text-text-faint"}`}>empty</span>
                      )}
                    </button>
                  </div>
                );
              })}
              {/* lazy loading placeholder row */}
              {loading["deps"] && (
                <div className="flex items-center gap-2 py-2 pl-[58px] pr-3 text-xs text-text-muted">
                  <Spinner />
                  <span className="font-mono text-[11px]">Resolving dependencies…</span>
                </div>
              )}
            </div>

            <div className="flex h-8 items-center justify-between border-t border-border bg-[#f5f5f4] px-3">
              <span className="truncate font-mono text-[11px] text-text-muted">
                {searching ? `${matchCount} matches` : "NSOutlineView · lazy item expansion"}
              </span>
              <span className="hidden shrink-0 font-mono text-[11px] text-text-faint sm:inline">empty folders grow no triangle</span>
            </div>
          </div>
          <p className="mt-4 text-center text-xs leading-relaxed text-text-faint">
            Try: expand <span className="font-medium text-foreground">Dependencies</span> and watch it resolve, then filter{" "}
            <span className="rounded border border-border bg-white px-1 font-mono">net</span> — NetKit&apos;s ancestors open themselves.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 rounded-xl border border-border bg-surface p-6 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">What the user gains</p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Instant launch with on-demand depth: only opened folders pay the loading cost, and the spinner sits exactly
            where the children will land — no layout jump, no mystery. Search respects the hierarchy instead of flattening
            it, so a match always arrives with its context attached.
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Builder note</p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Children are <span className="font-mono text-xs">Node[] | null</span> — <span className="font-mono text-xs">null</span> means
            “unknown, fetch me”, <span className="font-mono text-xs">[]</span> means “known empty, show no triangle”. That one
            distinction drives all three behaviours: the lazy badge, the spinner on first expand, and the honest empty row.
            Search never mutates expansion — it layers auto-opened ancestors over the user&apos;s own state.
          </p>
        </div>
      </div>

      <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <Link href="/" className="text-sm font-medium text-text-muted transition-colors hover:text-[#0a84ff]">← Learning hub</Link>
        <div className="flex gap-2">
          <Link href="/scenarios/finder-outline" className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition-all hover:border-[#0a84ff]/30 hover:text-[#0a84ff]">← Finder outline</Link>
          <Link href="/scenarios/settings-sections" className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition-all hover:border-[#0a84ff]/30 hover:text-[#0a84ff]">← Settings sections</Link>
        </div>
      </nav>
    </main>
  );
}
