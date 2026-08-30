"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

// ──────────────────────────────────────────────
//  Data
// ──────────────────────────────────────────────

type TreeNode = {
  id: string;
  label: string;
  meta?: string;
  count?: number;
  children?: TreeNode[];
  isLeaf?: boolean;
};

const HUB_TREE: TreeNode[] = [
  {
    id: "design-system",
    label: "Design System",
    count: 18,
    children: [
      {
        id: "components",
        label: "Components",
        count: 24,
        children: [
          {
            id: "navigation",
            label: "Navigation",
            count: 5,
            children: [
              { id: "breadcrumb", label: "Breadcrumb.tsx", meta: "2.1 KB", isLeaf: true },
              { id: "tabs", label: "Tabs.tsx", meta: "3.4 KB", isLeaf: true },
              { id: "pagination", label: "Pagination.tsx", meta: "1.8 KB", isLeaf: true },
              { id: "stepper", label: "Stepper.tsx", meta: "2.6 KB", isLeaf: true },
            ],
          },
          {
            id: "forms",
            label: "Forms",
            count: 8,
            children: [
              { id: "input", label: "Input.tsx", meta: "1.2 KB", isLeaf: true },
              { id: "select", label: "Select.tsx", meta: "2.0 KB", isLeaf: true },
              { id: "checkbox", label: "Checkbox.tsx", meta: "1.5 KB", isLeaf: true },
            ],
          },
          {
            id: "feedback",
            label: "Feedback",
            count: 6,
            children: [
              { id: "toast", label: "Toast.tsx", meta: "1.9 KB", isLeaf: true },
              { id: "alert", label: "Alert.tsx", meta: "2.3 KB", isLeaf: true },
            ],
          },
          { id: "button", label: "Button.tsx", meta: "1.4 KB", isLeaf: true },
          { id: "card", label: "Card.tsx", meta: "2.2 KB", isLeaf: true },
          { id: "dialog", label: "Dialog.tsx", meta: "2.8 KB", isLeaf: true },
        ],
      },
      {
        id: "foundations",
        label: "Foundations",
        count: 6,
        children: [
          {
            id: "color",
            label: "Color",
            count: 4,
            children: [
              { id: "palette", label: "Palette.ts", meta: "0.9 KB", isLeaf: true },
              { id: "tokens-col", label: "Tokens.ts", meta: "1.1 KB", isLeaf: true },
            ],
          },
          {
            id: "typography",
            label: "Typography",
            count: 3,
            children: [{ id: "scale", label: "Scale.ts", meta: "0.7 KB", isLeaf: true }],
          },
          { id: "spacing", label: "Spacing.ts", meta: "0.6 KB", isLeaf: true },
        ],
      },
      { id: "tokens", label: "Tokens", count: 3, children: [{ id: "spacing-token", label: "Spacing.ts", meta: "0.5 KB", isLeaf: true }] },
    ],
  },
  {
    id: "marketing",
    label: "Marketing Site",
    count: 12,
    children: [
      {
        id: "campaigns",
        label: "Campaigns",
        count: 4,
        children: [{ id: "summer", label: "Summer 2026", meta: "Folder", children: [{ id: "hero", label: "Hero.png", meta: "1.2 MB", isLeaf: true }] }],
      },
      { id: "assets", label: "Assets", count: 32, children: [{ id: "logos", label: "Logos", meta: "Folder", children: [] }] },
      { id: "pages", label: "Pages", count: 9, children: [] },
    ],
  },
  {
    id: "engineering",
    label: "Engineering",
    count: 24,
    children: [
      {
        id: "services",
        label: "Services",
        count: 7,
        children: [
          { id: "auth", label: "Auth", count: 3, children: [{ id: "jwt", label: "jwt.ts", meta: "1.3 KB", isLeaf: true }] },
          { id: "payments", label: "Payments", meta: "Folder", children: [] },
        ],
      },
      { id: "infra", label: "Infrastructure", count: 5, children: [] },
    ],
  },
];

const INTRO = [
  { step: "One column per level", desc: "Each path column shows one folder. Selecting a folder opens its children in the column immediately to the right." },
  { step: "Branch chevron tells you", desc: "A › at the row's end means 'has children'. No chevron means it's a file — the end of the line." },
  { step: "The blue trail is the path", desc: "One highlighted row per column forms a spatial breadcrumb. You see where you are without reading a text path." },
] as const;

const PARTS = [
  {
    n: 1,
    name: "Path column — NSBrowser",
    token: "NSBrowser",
    see: "Each vertical column is one level of the hierarchy — like hallway doors laid side-by-side. Selecting a folder opens its children in the next column, so the whole ancestry stays visible at once. No back-button needed; the path is spatial.",
    how: "In React the path is an array like [\"design-system\", \"components\"]. Columns are derived by walking the tree: column 0 = root items, column 1 = children of path[0], column 2 = children of path[1], and so on. Changing the path (setPath) re-renders with more or fewer columns — like sliding out a new drawer.",
  },
  {
    n: 2,
    name: "Branch indicator — NSBrowserCell.isLeaf",
    token: "isLeaf === false",
    see: "The little › at the row's right edge tells you this row is a branch — it has an unseen next level. Clicking it will reveal another column. When there is no ›, you're looking at a file (a leaf) — tapping it shows a preview instead.",
    how: "Every node has isLeaf (or simply children?.length === 0). If isLeaf is false we render the chevron. Props are the settings you hand a row; state is what the browser remembers. The chevron itself is just an SVG that appears when isLeaf === false — no extra logic, just a visual promise that another column exists.",
  },
  {
    n: 3,
    name: "Selected path — NSBrowser.path",
    token: "NSBrowser.path",
    see: "One highlighted row in every visible column, forming a continuous blue trail from left to right. It is the hierarchy made physical — you read the path by scanning the highlights, not by parsing a string like /a/b/c.",
    how: "NSBrowser.path is stored as the path array. A row is highlighted when path[depth] === row.id. Clicking a row in column N does setPath([...path.slice(0,N), id]) — keeping ancestors, dropping anything deeper. The blue background is just a conditional class: isSelected ? \"bg-[#0a84ff] text-white\" : \"\".",
  },
] as const;

// ──────────────────────────────────────────────
//  Icons
// ──────────────────────────────────────────────

function FolderIcon({ selected }: { selected?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M2 5.5A1.5 1.5 0 0 1 3.5 4h3.2l1.3 1.5H12.5A1.5 1.5 0 0 1 14 7v4.5A1.5 1.5 0 0 1 12.5 13h-9A1.5 1.5 0 0 1 2 11.5v-6Z"
        fill={selected ? "white" : "#0a84ff"}
        fillOpacity={selected ? 0.95 : 0.12}
        stroke={selected ? "white" : "#0a84ff"}
        strokeWidth="1.1"
      />
    </svg>
  );
}
function FileIcon({ selected }: { selected?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M5 2.5h4.2L11 4.3V12.5A1.2 1.2 0 0 1 9.8 13.7H5A1.2 1.2 0 0 1 3.8 12.5V3.7A1.2 1.2 0 0 1 5 2.5Z"
        fill={selected ? "white" : "#f5f5f4"}
        stroke={selected ? "white" : "#d6d3d1"}
        strokeWidth="1.1"
      />
      <path d="M9.2 2.5v1.8H11" stroke={selected ? "white" : "#d6d3d1"} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M6 7h4M6 9h4M6 11h2.5" stroke={selected ? "rgba(255,255,255,0.9)" : "#a8a29e"} strokeWidth="1" strokeLinecap="round" opacity={selected ? 1 : 0.9} />
    </svg>
  );
}
function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0 opacity-60">
      <path d="M4.2 2.5 7.7 6 4.2 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ──────────────────────────────────────────────
//  Column helpers
// ──────────────────────────────────────────────

function buildColumns(tree: TreeNode[], path: string[]) {
  const cols: TreeNode[][] = [tree];
  let cur: TreeNode[] = tree;
  for (const id of path) {
    const node = cur.find((n) => n.id === id);
    if (node && node.children && node.children.length > 0 && !node.isLeaf) {
      cols.push(node.children);
      cur = node.children;
    } else break;
  }
  return cols;
}
function findLabel(tree: TreeNode[], id: string): string | undefined {
  for (const n of tree) {
    if (n.id === id) return n.label;
    if (n.children) {
      const r = findLabel(n.children, id);
      if (r) return r;
    }
  }
}

// ──────────────────────────────────────────────
//  Page
// ──────────────────────────────────────────────

export default function Page() {
  const [path, setPath] = useState<string[]>(["design-system", "components", "navigation", "tabs"]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const columns = buildColumns(HUB_TREE, path);
  const breadcrumb = path.map((id) => findLabel(HUB_TREE, id) ?? id);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
  }, [columns.length]);

  function selectAt(depth: number, node: TreeNode) {
    const isBranch = !node.isLeaf && node.children && node.children.length > 0;
    if (isBranch) {
      setPath([...path.slice(0, depth), node.id]);
    } else {
      // leaf — keep path up to depth plus leaf id (highlight leaf but no new column)
      setPath([...path.slice(0, depth), node.id]);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      {/* header */}
      <header className="mb-12 max-w-3xl">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0a84ff]">macOS · Web approximation · NSBrowser</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Column View</h1>
        <p className="mt-2 font-mono text-sm text-text-faint">Also called: browser view · Finder column view · Miller columns · hierarchical browser</p>
        <p className="mt-6 text-lg leading-relaxed text-text-muted">
          Every selected branch opens its children in the next column to the right. Several ancestry levels remain visible at once — the path is spatial, not just textual. Finder&apos;s
          Column view is the familiar example; AppKit&apos;s native control is <code className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-sm">NSBrowser</code>.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">
          If you called it “the finder columns thing” or “folders opening in columns to the right” — this is it. Do not substitute a flat list or a single sidebar-detail split.
        </p>
      </header>

      {/* intro strip */}
      <section className="mb-16">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-text-muted">What am I looking at?</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {INTRO.map((c, i) => (
            <div key={c.step} className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eff6ff] font-mono text-xs font-bold text-[#0a84ff]">{i + 1}</span>
              <div>
                <h3 className="mb-1 text-sm font-semibold leading-tight">{c.step}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* anatomy */}
      <section className="mb-16">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted">Anatomy — every part, named</h2>
        <p className="mb-6 text-sm text-text-muted">
          The live browser below is Finder&apos;s column view rebuilt for the web. Click any row to see a new column slide in. The numbered pills chase the real structure — drag, resize, and watch
          the path stay honest.
        </p>

        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-8">
          {/* controls row */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#0a84ff] shadow-[0_0_0_4px_rgba(10,132,255,0.12)]" />
              <span className="font-mono text-xs text-text-muted">NSBrowser.path</span>
              <span className="font-mono text-xs font-medium text-foreground">[{path.map((p) => `"${p}"`).join(", ")}]</span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 font-mono text-xs text-text-faint">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> live preview
            </span>
            <button
              onClick={() => setPath(["design-system", "components", "navigation", "tabs"])}
              className="ml-auto rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text-muted hover:text-foreground hover:border-border-strong transition-colors"
            >
              Reset trail
            </button>
          </div>

          <p className="mb-5 font-mono text-xs leading-relaxed text-text-faint">
            {"<NSBrowser>"} · {"<NSBrowserCell isLeaf>"} · path = {path.length} deep · {columns.length} visible columns
          </p>

          {/* stage with dotted bg + dashed outer */}
          <div
            className="relative overflow-visible rounded-xl border border-border bg-[#fcfcfa] p-3 sm:p-6"
            style={{ backgroundImage: "radial-gradient(circle, #e7e5e4 1px, transparent 1px)", backgroundSize: "20px 20px" }}
          >
            {/* outer dashed label — NSBrowser */}
            <div className="absolute inset-3 rounded-xl border-2 border-dashed border-[#0a84ff]/25 pointer-events-none" aria-hidden="true">
              <div className="absolute -top-3 left-6 flex items-center gap-1.5 bg-[#fcfcfa] px-1.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0a84ff] font-mono text-[10px] font-bold leading-none text-white">1</span>
                <span className="rounded-full bg-white border border-[#0a84ff]/20 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest uppercase text-[#0a84ff] shadow-sm">
                  Path column · NSBrowser
                </span>
              </div>
            </div>

            {/* Finder window */}
            <div className="relative mx-auto max-w-[860px] overflow-hidden rounded-xl border border-[#d6d3d1] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              {/* mac title bar */}
              <div className="flex h-9 items-center justify-between border-b border-border bg-[#f5f5f4] px-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#d9a01d]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840] border border-[#1fac2e]" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1 rounded-md border border-border bg-white px-2 py-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <circle cx="5" cy="5" r="3.2" stroke="#a8a29e" strokeWidth="1.2" />
                      <path d="M7.5 7.5 10 10" stroke="#a8a29e" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs text-text-faint">Search</span>
                  </div>
                  <span className="hidden sm:inline text-xs font-medium text-text-muted">Finder — Acme Workspace</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="rounded-md bg-white border border-border px-2 py-1 font-mono text-[10px] text-text-muted">≣</span>
                  <span className="rounded-md bg-[#0a84ff] px-2 py-1 font-mono text-[10px] font-semibold text-white">▦ Columns</span>
                  <span className="rounded-md border border-border bg-white px-2 py-1 font-mono text-[10px] text-text-muted">☰ List</span>
                </div>
              </div>

              {/* columns */}
              <div ref={scrollRef} className="flex h-[320px] overflow-x-auto overflow-y-hidden bg-white col-scroll">
                {columns.map((col, depth) => {
                  const selectedId = path[depth];
                  return (
                    <div key={depth} className="relative flex w-[214px] shrink-0 flex-col border-r border-border bg-white last:border-r-0">
                      {/* column header */}
                      <div className="sticky top-0 z-[1] flex h-6 items-center justify-between border-b border-border bg-[#fafaf9] px-3">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">
                          {depth === 0 ? "Acme Workspace" : breadcrumb[depth - 1] ?? `Level ${depth}`}
                        </span>
                        <span className="font-mono text-[10px] text-text-faint">{col.length}</span>
                      </div>

                      {/* rows */}
                      <div className="flex-1 overflow-y-auto col-scroll">
                        {col.map((node) => {
                          const isBranch = !node.isLeaf && !!node.children && node.children.length > 0;
                          const isSelected = selectedId === node.id;
                          return (
                            <button
                              key={node.id}
                              onClick={() => selectAt(depth, node)}
                              className={`flex w-full items-center gap-2 border-b border-transparent px-3 py-[7px] text-left transition-colors ${
                                isSelected ? "bg-[#0a84ff] text-white" : "hover:bg-[#f5f5f4] text-[#1c1917]"
                              }`}
                            >
                              {isBranch ? <FolderIcon selected={isSelected} /> : <FileIcon selected={isSelected} />}
                              <span className={`flex-1 truncate text-[13px] leading-none ${isSelected ? "font-medium text-white" : "font-[450] text-zinc-800"}`}>{node.label}</span>
                              {node.meta && !isBranch && (
                                <span className={`hidden sm:inline font-mono text-[10px] ${isSelected ? "text-white/70" : "text-text-faint"}`}>{node.meta}</span>
                              )}
                              {isBranch && (
                                <span className={`${isSelected ? "text-white" : "text-zinc-400"}`}>
                                  <Chevron />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* subtle right shadow for depth */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/[0.04] to-transparent" />
                    </div>
                  );
                })}

                {/* preview pane for leaf selection */}
                {(() => {
                  const lastId = path[path.length - 1];
                  // find leaf node
                  function findNode(nodes: TreeNode[], id: string): TreeNode | undefined {
                    for (const n of nodes) {
                      if (n.id === id) return n;
                      if (n.children) {
                        const r = findNode(n.children, id);
                        if (r) return r;
                      }
                    }
                  }
                  const leaf = lastId ? findNode(HUB_TREE, lastId) : undefined;
                  const isLeaf = leaf?.isLeaf;
                  if (!isLeaf) return null;
                  return (
                    <div className="flex w-[214px] shrink-0 flex-col items-center justify-center bg-[#fafaf9] px-6 text-center border-r border-border">
                      <div className="rounded-xl bg-white border border-border p-4 shadow-sm">
                        <FileIcon />
                        <p className="mt-2 text-sm font-semibold text-foreground">{leaf.label}</p>
                        <p className="mt-1 font-mono text-xs text-text-faint">{leaf.meta ?? "—"}</p>
                        <p className="mt-3 text-xs leading-relaxed text-text-muted">Leaf preview — no further column. In Finder this column shows icon, kind, and Quick Look.</p>
                      </div>
                      <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-text-faint">isLeaf = true</p>
                    </div>
                  );
                })()}
              </div>

              {/* status bar */}
              <div className="flex h-7 items-center justify-between border-t border-border bg-[#f5f5f4] px-3">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  {breadcrumb.length ? (
                    <span className="flex items-center gap-1.5 truncate font-mono text-xs text-text-muted">
                      <span className="hidden sm:inline h-2 w-2 rounded-full bg-[#0a84ff]" />
                      {breadcrumb.join("  ›  ")}
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-text-faint">No selection</span>
                  )}
                </div>
                <span className="shrink-0 font-mono text-[11px] text-text-faint">
                  {columns.length} columns · {columns[columns.length - 1]?.length ?? 0} items
                </span>
              </div>

              {/* ── callout 2: branch indicator — anchored near first branch chevron */}
              <div className="pointer-events-none absolute right-2 top-[68px] hidden items-center gap-1.5 sm:flex z-10" aria-hidden="true">
                <span className="h-px w-7 bg-[#d6d3d1]" />
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1c1917] font-mono text-[10px] font-bold text-white">2</span>
                <span className="rounded-full border border-border bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-text-muted shadow-sm">
                  branch indicator · isLeaf = false ›
                </span>
              </div>
              {/* mobile fallback for 2 */}
              <div className="flex justify-center py-2 sm:hidden" aria-hidden="true">
                <span className="inline-flex items-center gap-1.5">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-[#1c1917] font-mono text-[9px] text-white">2</span>
                  <span className="font-mono text-[10px] text-text-faint">› means another column will open</span>
                </span>
              </div>

              {/* callout 3 — selected path */}
              <div className="pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 sm:flex z-10" aria-hidden="true">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0a84ff] font-mono text-[10px] font-bold text-white">3</span>
                <span className="rounded-full bg-[#0a84ff] px-2.5 py-1 font-mono text-[10px] font-semibold text-white shadow-sm">selected path · NSBrowser.path</span>
                <span className="h-px w-7 bg-[#0a84ff]/30" />
              </div>
            </div>

            {/* footer hint + keyboard */}
            <p className="mt-4 text-center text-xs leading-relaxed text-text-faint">
              Try: click <span className="font-medium text-foreground">Design System → Foundations → Color</span> to watch columns collapse and regrow. The blue trail is always one row per
              column.
            </p>
          </div>

          {/* mini legend under stage */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-surface-alt px-4 py-3 flex items-start gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#0a84ff] font-mono text-[10px] font-bold text-white">1</span>
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Path column · NSBrowser</p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">One folder per column. Each selection appends the next siblings to the right.</p>
              </div>
            </div>
            <div className="rounded-xl bg-surface-alt px-4 py-3 flex items-start gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1c1917] font-mono text-[10px] font-bold text-white">2</span>
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Branch indicator · isLeaf</p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">
                  <span className="font-mono text-xs">›</span> means “has children”. No › means leaf/file — preview instead.
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-[#eff6ff] border border-[#0a84ff]/10 px-4 py-3 flex items-start gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#0a84ff] font-mono text-[10px] font-bold text-white">3</span>
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#0a84ff]">Selected path · NSBrowser.path</p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">Blue in every column — the highlighted ancestry that stays visible as you drill.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* layered explanations */}
      <section className="mb-16">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted">The three parts, in plain words</h2>
        <p className="mb-6 text-sm text-text-muted">Every named part, explained twice: for the person using the product, and for the person building it.</p>
        <div className="overflow-hidden rounded-2xl border border-border bg-border">
          {PARTS.map((part, i) => (
            <div key={part.n} className={`grid md:grid-cols-2 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="bg-surface p-5 sm:p-6">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#0a84ff]">What you see</p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-foreground font-mono text-[10px] text-white">{part.n}</span>
                  {part.name}
                  <code className="font-mono text-[10px] font-normal text-text-faint">{part.token}</code>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{part.see}</p>
              </div>
              <div className="border-t border-border bg-surface p-5 md:border-t-0 md:border-l sm:p-6">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#0a84ff]">How it works</p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{part.how}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* in code */}
      <section className="mb-16">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-text-muted">In code — the AppKit names</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="grid sm:grid-cols-3 sm:divide-x sm:divide-border">
            <div className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Path column</p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">NSBrowser</code>
              <p className="mt-2 text-xs leading-relaxed text-text-faint">One column per hierarchy level. Selecting a row loads the next column to the right. SwiftUI&apos;s NavigationSplitView is only an approximation.</p>
            </div>
            <div className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Branch indicator</p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">NSBrowserCell.isLeaf</code>
              <p className="mt-2 text-xs leading-relaxed text-text-faint">
                <code className="font-mono text-xs">isLeaf == false</code> draws the ›. True means leaf — no next column, show preview.
              </p>
            </div>
            <div className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Selected path</p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">NSBrowser.path</code>
              <p className="mt-2 text-xs leading-relaxed text-text-faint">The highlighted row in every column — the ancestry that stays on screen. Clicking column N truncates anything deeper.</p>
            </div>
          </div>
          <div className="border-t border-border bg-[#fafaf9] px-6 py-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-faint mb-2">Paste-ready prompt</p>
            <code className="block rounded-lg bg-white border border-border px-4 py-3 font-mono text-xs leading-relaxed text-text-muted">
              Build a Finder-style Column View with NSBrowser and NSBrowserCell: selecting a non-leaf row reveals its children in a new column immediately to the right,
              preserving the visible hierarchy path. Do not substitute a flat list or a single sidebar-detail split.
            </code>
          </div>
        </div>
      </section>

      {/* scenarios */}
      <section>
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-text-muted">See it in the wild — three scenarios</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              href: "/scenarios/file-browser",
              title: "File browser",
              desc: "Literal Finder: folders, files, Quick Look preview, path bar, and keyboard arrows. The classic use case.",
            },
            {
              href: "/scenarios/category-browser",
              title: "Category browser",
              desc: "E-commerce taxonomy — departments → categories → products. Leaf shows product detail, not a folder.",
            },
            {
              href: "/scenarios/team-directory",
              title: "Team directory",
              desc: "Org chart as Miller columns — company → division → team → person. Leaf is a profile card with contact.",
            },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group block rounded-xl border border-border bg-surface p-6 transition-all hover:border-[#0a84ff]/30 hover:shadow-md"
            >
              <h3 className="mb-2 text-sm font-semibold transition-colors group-hover:text-[#0a84ff]">{s.title}</h3>
              <p className="text-sm leading-relaxed text-text-muted">{s.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#0a84ff]">
                Explore <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-border pt-6 text-xs leading-relaxed text-text-faint">
        <p>
          Column view trades vertical depth for horizontal space. It shines when the hierarchy is deep but narrow — 3–5 levels, ~5–20 siblings per level — and when keeping ancestors
          visible helps orientation. For wide, shallow lists a plain sidebar is faster; for very deep trees an outline (disclosure triangles) saves width.
        </p>
      </footer>
    </main>
  );
}
