"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

// ── Data: a believable project workspace, 4 levels deep ──

type Node = { id: string; label: string; kind: "folder" | "file"; meta?: string; children?: Node[] };

const TREE: Node[] = [
  {
    id: "app",
    label: "App",
    kind: "folder",
    children: [
      {
        id: "routes",
        label: "(routes)",
        kind: "folder",
        children: [
          { id: "page-tsx", label: "page.tsx", kind: "file", meta: "4.1 KB" },
          { id: "layout-tsx", label: "layout.tsx", kind: "file", meta: "1.2 KB" },
          {
            id: "settings",
            label: "settings",
            kind: "folder",
            children: [
              { id: "settings-page", label: "page.tsx", kind: "file", meta: "6.8 KB" },
              { id: "loading", label: "loading.tsx", kind: "file", meta: "0.4 KB" },
            ],
          },
        ],
      },
      {
        id: "components",
        label: "components",
        kind: "folder",
        children: [
          { id: "outline", label: "OutlineView.tsx", kind: "file", meta: "5.5 KB" },
          { id: "triangle", label: "DisclosureTriangle.tsx", kind: "file", meta: "2.2 KB" },
          { id: "row", label: "OutlineRow.tsx", kind: "file", meta: "3.0 KB" },
        ],
      },
      { id: "globals", label: "globals.css", kind: "file", meta: "1.1 KB" },
    ],
  },
  {
    id: "packages",
    label: "Packages",
    kind: "folder",
    children: [
      {
        id: "ui-kit",
        label: "ui-kit",
        kind: "folder",
        children: [
          { id: "button", label: "Button.tsx", kind: "file", meta: "1.9 KB" },
          { id: "dialog", label: "Dialog.tsx", kind: "file", meta: "4.4 KB" },
        ],
      },
      { id: "config", label: "tsconfig.base.json", kind: "file", meta: "0.8 KB" },
    ],
  },
  {
    id: "docs",
    label: "Docs",
    kind: "folder",
    children: [{ id: "readme", label: "README.md", kind: "file", meta: "3.3 KB" }],
  },
  { id: "package-json", label: "package.json", kind: "file", meta: "1.0 KB" },
];

function Triangle({ open, dim }: { open: boolean; dim?: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      className="disclosure-tri shrink-0"
      style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", opacity: dim ? 0.45 : 1 }}
    >
      <path d="M3.2 1.8 7.8 5 3.2 8.2V1.8Z" fill="#57534e" stroke="#57534e" strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  );
}

type FlatRow = { node: Node; depth: number; hasKids: boolean; parentId: string | null };

function flatten(tree: Node[], expanded: Record<string, boolean>): FlatRow[] {
  const out: FlatRow[] = [];
  function walk(nodes: Node[], depth: number, parentId: string | null) {
    for (const n of nodes) {
      const hasKids = !!n.children && n.children.length > 0;
      out.push({ node: n, depth, hasKids, parentId });
      if (hasKids && expanded[n.id]) walk(n.children!, depth + 1, n.id);
    }
  }
  walk(tree, 0, null);
  return out;
}

function collectExpandable(nodes: Node[], acc: string[] = []): string[] {
  for (const n of nodes) {
    if (n.children && n.children.length > 0) {
      acc.push(n.id);
      collectExpandable(n.children, acc);
    }
  }
  return acc;
}
const ALL = collectExpandable(TREE);

export default function FinderOutlinePage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ app: true, routes: true, components: true });
  const [selected, setSelected] = useState("triangle");
  const [guides, setGuides] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => flatten(TREE, expanded), [expanded]);
  const selIndex = Math.max(0, rows.findIndex((r) => r.node.id === selected));

  function toggle(id: string) {
    setExpanded((p) => ({ ...p, [id]: !p[id] }));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const cur = rows[selIndex];
    if (!cur) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = rows[Math.min(rows.length - 1, selIndex + 1)];
      if (next) setSelected(next.node.id);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = rows[Math.max(0, selIndex - 1)];
      if (prev) setSelected(prev.node.id);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (cur.hasKids && !expanded[cur.node.id]) toggle(cur.node.id);
      else if (cur.hasKids && expanded[cur.node.id]) {
        const child = rows[selIndex + 1];
        if (child && child.depth > cur.depth) setSelected(child.node.id);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (cur.hasKids && expanded[cur.node.id]) toggle(cur.node.id);
      else if (cur.parentId) setSelected(cur.parentId);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (cur.hasKids) toggle(cur.node.id);
    }
  }

  const openCount = Object.values(expanded).filter(Boolean).length;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <nav className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs text-text-faint">
        <Link href="/" className="rounded-full border border-border bg-surface px-3 py-1.5 transition-colors hover:border-[#0a84ff]/40 hover:text-[#0a84ff]">
          ← Learning hub
        </Link>
        <span aria-hidden="true">·</span>
        <span className="px-1 font-semibold text-foreground">Scenario 1 — Finder outline</span>
        <span aria-hidden="true">·</span>
        <Link href="/scenarios/settings-sections" className="rounded-full border border-border bg-surface px-3 py-1.5 transition-colors hover:border-[#0a84ff]/40 hover:text-[#0a84ff]">
          Next: Settings sections →
        </Link>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0a84ff]">Scenario 1 · NSOutlineView · deep hierarchy</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Finder outline</h1>
        <p className="mt-4 leading-relaxed text-text-muted">
          A project workspace browsed as an outline — four levels deep, dozens of rows, but only the branches you open
          take up space. Disclosure triangles carry the whole navigation: sideways branches stay one line each, and the
          open trail shows exactly where you are.
        </p>
      </header>

      <div className="mb-8 rounded-xl border border-[#0a84ff]/20 bg-[#eff6ff] px-5 py-4">
        <p className="text-sm font-semibold text-[#0a84ff]">Why disclosure fits here</p>
        <p className="mt-1 text-sm leading-relaxed text-text-muted">
          Hierarchies this deep would need four columns or endless drilling in any other pattern. Triangles keep every
          level in one scrollable list, open independently — the user expands <em>App → (routes) → settings</em> while{" "}
          <em>Packages</em> stays a single quiet line. Keyboard arrows make it a power tool, not just a tree.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setExpanded(Object.fromEntries(ALL.map((id) => [id, true])))}
            className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-border-strong hover:text-foreground"
          >
            Expand all
          </button>
          <button
            onClick={() => setExpanded({})}
            className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-border-strong hover:text-foreground"
          >
            Collapse all
          </button>
          <button
            onClick={() => setGuides((v) => !v)}
            aria-pressed={guides}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              guides ? "border-[#0a84ff]/30 bg-[#eff6ff] text-[#0a84ff]" : "border-border bg-white text-text-muted hover:text-foreground"
            }`}
          >
            Indent guides {guides ? "on" : "off"}
          </button>
          <span className="ml-auto font-mono text-xs text-text-faint">
            {rows.length} visible · {openCount} expanded
          </span>
        </div>

        <div
          className="relative overflow-visible rounded-xl border border-border bg-[#fcfcfa] p-3 sm:p-6"
          style={{ backgroundImage: "radial-gradient(circle, #e7e5e4 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        >
          <div className="relative mx-auto max-w-[620px] overflow-hidden rounded-xl border border-[#d6d3d1] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="flex h-9 items-center justify-between border-b border-border bg-[#f5f5f4] px-3">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full border border-[#e0443e] bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full border border-[#d9a01d] bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full border border-[#1fac2e] bg-[#28c840]" />
              </div>
              <span className="text-xs font-medium text-text-muted">acme-web — Outline</span>
              <button
                onClick={() => listRef.current?.focus()}
                className="rounded-md border border-border bg-white px-2 py-1 font-mono text-[10px] text-text-muted transition-colors hover:border-[#0a84ff]/40 hover:text-[#0a84ff]"
              >
                focus list ⌨
              </button>
            </div>

            <div
              ref={listRef}
              tabIndex={0}
              onKeyDown={onKeyDown}
              role="tree"
              aria-label="Project outline — use arrow keys"
              className="max-h-[380px] overflow-y-auto bg-white py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0a84ff]/40 col-scroll"
            >
              {rows.map(({ node, depth, hasKids }) => {
                const open = !!expanded[node.id];
                const isSel = selected === node.id;
                return (
                  <div
                    key={node.id}
                    role="treeitem"
                    aria-expanded={hasKids ? open : undefined}
                    aria-selected={isSel}
                    aria-level={depth + 1}
                    className={`relative flex w-full items-center pr-3 transition-colors ${
                      isSel ? "bg-[#0a84ff] text-white" : "text-[#1c1917] hover:bg-[#f5f5f4]"
                    }`}
                    style={{ paddingLeft: 10 + depth * 24, paddingTop: 2, paddingBottom: 2 }}
                  >
                    {guides && depth > 0 && (
                      <span className="pointer-events-none absolute inset-y-0" style={{ left: 10 + (depth - 1) * 24 + 22 }} aria-hidden="true">
                        <span className={`block h-full w-px ${isSel ? "bg-white/25" : "bg-border"}`} />
                      </span>
                    )}
                    {hasKids ? (
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
                      <span className="h-6 w-6 shrink-0" aria-hidden="true" />
                    )}
                    <button onClick={() => setSelected(node.id)} onDoubleClick={() => hasKids && toggle(node.id)} className="flex min-w-0 flex-1 items-center gap-2 rounded px-1 py-[5px] text-left">
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
                        {node.kind === "folder" ? (
                          <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h3.2l1.3 1.5H12.5A1.5 1.5 0 0 1 14 7v4.5A1.5 1.5 0 0 1 12.5 13h-9A1.5 1.5 0 0 1 2 11.5v-6Z" fill={isSel ? "white" : "#0a84ff"} fillOpacity={isSel ? 0.9 : 0.12} stroke={isSel ? "white" : "#0a84ff"} strokeWidth="1.1" />
                        ) : (
                          <path d="M5 2.5h4.2L11 4.3V12.5A1.2 1.2 0 0 1 9.8 13.7H5A1.2 1.2 0 0 1 3.8 12.5V3.7A1.2 1.2 0 0 1 5 2.5Z" fill={isSel ? "white" : "#fafaf9"} stroke={isSel ? "white" : "#d6d3d1"} strokeWidth="1.1" />
                        )}
                      </svg>
                      <span className={`flex-1 truncate font-mono text-[13px] leading-none ${isSel ? "font-semibold text-white" : ""}`}>{node.label}</span>
                      {node.meta && (
                        <span className={`hidden font-mono text-[10px] sm:inline ${isSel ? "text-white/70" : "text-text-faint"}`}>{node.meta}</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex h-8 items-center justify-between border-t border-border bg-[#f5f5f4] px-3">
              <span className="truncate font-mono text-[11px] text-text-muted">
                selected: <span className="font-semibold text-foreground">{selected}</span>
              </span>
              <span className="hidden shrink-0 font-mono text-[11px] text-text-faint sm:inline">↑↓ move · → expand · ← collapse · ⏎ toggle</span>
            </div>
          </div>
          <p className="mt-4 text-center text-xs leading-relaxed text-text-faint">
            Click <span className="font-medium text-foreground">focus list</span>, then drive with ↑ ↓ → ←. Notice selection (blue row)
            and disclosure (triangle rotation) are independent — arrows move, triangles open.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 rounded-xl border border-border bg-surface p-6 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">What the user gains</p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            The whole project in one scroll: open only the branch being edited, keep the rest as single lines. Arrow-key
            travel means hands never leave the keyboard — expanding <span className="font-mono text-xs">settings/</span> to
            reach <span className="font-mono text-xs">page.tsx</span> takes four keystrokes.
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Builder note</p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Selection and expansion are two separate pieces of state (<span className="font-mono text-xs">selected</span> vs{" "}
            <span className="font-mono text-xs">expanded[id]</span>) — a classic beginner trap is merging them. Rows flatten
            via a recursive walk that skips collapsed children, so ↑/↓ simply move through the visible array.
          </p>
        </div>
      </div>

      <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <Link href="/" className="text-sm font-medium text-text-muted transition-colors hover:text-[#0a84ff]">← Learning hub</Link>
        <div className="flex gap-2">
          <Link href="/scenarios/settings-sections" className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition-all hover:border-[#0a84ff]/30 hover:text-[#0a84ff]">Settings sections →</Link>
          <Link href="/scenarios/package-navigator" className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition-all hover:border-[#0a84ff]/30 hover:text-[#0a84ff]">Package navigator →</Link>
        </div>
      </nav>
    </main>
  );
}
