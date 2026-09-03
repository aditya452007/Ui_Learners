"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

// ──────────────────────────────────────────────
//  Data
// ──────────────────────────────────────────────

type Node = {
  id: string;
  label: string;
  kind: "folder" | "file";
  meta?: string;
  children?: Node[];
};

const HUB_TREE: Node[] = [
  {
    id: "design",
    label: "Design",
    kind: "folder",
    children: [
      {
        id: "logos",
        label: "Logos",
        kind: "folder",
        children: [
          { id: "logo-svg", label: "logo.svg", kind: "file", meta: "12 KB" },
          { id: "wordmark-svg", label: "wordmark.svg", kind: "file", meta: "8 KB" },
        ],
      },
      {
        id: "mockups",
        label: "Mockups",
        kind: "folder",
        children: [
          { id: "home-png", label: "home.png", kind: "file", meta: "1.4 MB" },
          { id: "checkout-png", label: "checkout.png", kind: "file", meta: "2.1 MB" },
        ],
      },
      { id: "tokens", label: "Tokens.ts", kind: "file", meta: "0.9 KB" },
    ],
  },
  {
    id: "engineering",
    label: "Engineering",
    kind: "folder",
    children: [
      { id: "auth", label: "Auth", kind: "folder", children: [{ id: "jwt", label: "jwt.ts", kind: "file", meta: "1.3 KB" }] },
      { id: "payments", label: "Payments", kind: "folder", children: [] },
    ],
  },
  { id: "notes", label: "Notes.txt", kind: "file", meta: "2 KB" },
];

const INTRO = [
  {
    step: "The triangle",
    desc: "A tiny filled arrow beside any row that has children. It is the only control — one click reveals or hides the next level.",
  },
  {
    step: "Sideways = closed",
    desc: "Pointing right (▶) means children exist but are hidden. Nothing below the row belongs to it — yet.",
  },
  {
    step: "Down = open",
    desc: "Pointing down (▼) means the children are revealed directly beneath the row, indented one step.",
  },
] as const;

const PARTS = [
  {
    n: 1,
    name: "Disclosure indicator — NSButton.BezelStyle.disclosure",
    token: "BezelStyle.disclosure",
    see: "The tiny filled triangle sitting just left of the row label. It only appears on rows that actually have children — leaf rows like Notes.txt leave the same space blank so every label stays aligned. If you see the triangle, there is more hiding underneath; if you don't, the row is the end of the line.",
    how: "In AppKit this is a standalone button style: NSButton with BezelStyle.disclosure — a 10-pixel arrow that rotates 90° when clicked. Props are the settings you hand it (which row it belongs to); state is what the outline remembers (expanded or not, per row id). In React we render one small <button> per expandable row and rotate its SVG with a CSS transition — transform: rotate(90deg) when open. Think of it as a light switch labelled by position: same flick, different circuit per row.",
  },
  {
    n: 2,
    name: "Collapsed state — DisclosureGroup.isExpanded = false",
    token: "isExpanded = false",
    see: "The arrow points sideways (▶) and the row looks like any other line — its children are completely hidden, and the rows below it belong to the level above. The outline stays short and scannable: you see the shape of the hierarchy without the detail. Click the Mockups or Engineering row above to feel how much stays tucked away.",
    how: "A boolean (true/false value) stored per row: expanded[\"mockups\"] === false. When you click the triangle, an event (a message that says “this was clicked”) fires and runs setExpanded — React's way of updating its memory — which flips that one boolean. Render means drawing the screen again: React re-draws, sees false, and gives the children container zero height so nothing shows. The children are still there in data — like a folded map — just not drawn.",
  },
  {
    n: 3,
    name: "Expanded state — DisclosureGroup.isExpanded = true",
    token: "isExpanded = true",
    see: "The arrow has rotated to point down (▼) and the row's children appear directly beneath it, indented one step — Logos, Mockups and Tokens.ts belong to Design, and you can tell purely by position. Click again and they fold back up. The rotation is the promise kept: down always means “what follows is mine”.",
    how: "The same boolean, now true: expanded[\"design\"] === true. Re-render gives the children container full height with a short slide animation (a CSS grid-rows transition), and the triangle rotates via the same re-draw — no separate animation code. In SwiftUI this whole pattern is one control: DisclosureGroup(isExpanded: $open) { children } label: { title }. For accessibility the triangle is a real <button> with aria-expanded=\"true/false\", so screen readers announce “expanded” or “collapsed” — the state blind users can't see in the rotation.",
  },
] as const;

// ──────────────────────────────────────────────
//  Small pieces
// ──────────────────────────────────────────────

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

function FolderGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M2 5.5A1.5 1.5 0 0 1 3.5 4h3.2l1.3 1.5H12.5A1.5 1.5 0 0 1 14 7v4.5A1.5 1.5 0 0 1 12.5 13h-9A1.5 1.5 0 0 1 2 11.5v-6Z"
        fill="#0a84ff"
        fillOpacity="0.12"
        stroke="#0a84ff"
        strokeWidth="1.1"
      />
    </svg>
  );
}

function FileGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M4 1.8h4L10.5 4.3V11A1.2 1.2 0 0 1 9.3 12.2H4A1.2 1.2 0 0 1 2.8 11V3A1.2 1.2 0 0 1 4 1.8Z"
        fill="#fafaf9"
        stroke="#d6d3d1"
        strokeWidth="1.1"
      />
      <path d="M8 1.8v2.5h2.5" stroke="#d6d3d1" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}

type FlatRow = { node: Node; depth: number; hasKids: boolean };

function flatten(tree: Node[], expanded: Record<string, boolean>): FlatRow[] {
  const out: FlatRow[] = [];
  function walk(nodes: Node[], depth: number) {
    for (const n of nodes) {
      const hasKids = !!n.children && n.children.length > 0;
      out.push({ node: n, depth, hasKids });
      if (hasKids && expanded[n.id]) walk(n.children!, depth + 1);
    }
  }
  walk(tree, 0);
  return out;
}

function countDescendants(n: Node): number {
  if (!n.children || n.children.length === 0) return 0;
  return n.children.length + n.children.reduce((a, c) => a + countDescendants(c), 0);
}

// ──────────────────────────────────────────────
//  Page
// ──────────────────────────────────────────────

const DEFAULT_EXPANDED = { design: true, logos: true, mockups: false, engineering: false };

export default function Page() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(DEFAULT_EXPANDED);
  const [selected, setSelected] = useState("logo-svg");
  const [lastToggled, setLastToggled] = useState<string | null>("design");
  const [standaloneOpen, setStandaloneOpen] = useState(false);

  const rows = useMemo(() => flatten(HUB_TREE, expanded), [expanded]);

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    setLastToggled(id);
  }
  function expandAll() {
    const next: Record<string, boolean> = {};
    (function walk(nodes: Node[]) {
      for (const n of nodes) {
        if (n.children && n.children.length > 0) {
          next[n.id] = true;
          walk(n.children);
        }
      }
    })(HUB_TREE);
    setExpanded(next);
    setLastToggled(null);
  }
  function collapseAll() {
    setExpanded({});
    setLastToggled(null);
  }

  // numbered pills chase the live structure:
  const firstBranch = rows.find((r) => r.hasKids);
  const firstCollapsed = rows.find((r) => r.hasKids && !expanded[r.node.id]);
  const firstExpanded = rows.find((r) => r.hasKids && expanded[r.node.id]);
  const openCount = Object.values(expanded).filter(Boolean).length;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      {/* header */}
      <header className="mb-12 max-w-3xl">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0a84ff]">
          macOS · Web approximation · NSOutlineView / DisclosureGroup
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Disclosure Triangle</h1>
        <p className="mt-2 font-mono text-sm text-text-faint">
          Also called: disclosure control · outline disclosure button · expand-collapse triangle
        </p>
        <p className="mt-6 text-lg leading-relaxed text-text-muted">
          The compact arrow beside an outline row or section label that reveals nested content. It points sideways
          while collapsed and rotates downward when expanded. AppKit draws it with{" "}
          <code className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-sm">NSOutlineView</code> for
          hierarchies and <code className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-sm">DisclosureGroup</code> for
          standalone sections — rebuilt here for the web, pixel for pixel in behaviour.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">
          If you called it “the tiny triangle that opens a folder row” or “the little arrow that rotates when a
          section expands” — this is it. Don&apos;t substitute a chevron menu or an accordion with big headers: the
          disclosure triangle is small, sits inline before the label, and only ever means “children live here”.
        </p>
      </header>

      {/* intro strip */}
      <section className="mb-16">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-text-muted">What am I looking at?</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {INTRO.map((c, i) => (
            <div key={c.step} className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eff6ff] font-mono text-xs font-bold text-[#0a84ff]">
                {i + 1}
              </span>
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
          The live outline below is the real pattern. Click any triangle to rotate it and reveal or hide its children —
          the numbered pills chase the actual rows. Leaves like <span className="font-mono text-xs">Notes.txt</span> get
          no triangle at all.
        </p>

        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-8">
          {/* controls row */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#0a84ff] shadow-[0_0_0_4px_rgba(10,132,255,0.12)]" />
              <span className="font-mono text-xs text-text-muted">DisclosureGroup.isExpanded</span>
              <span className="font-mono text-xs font-medium text-foreground">
                {lastToggled ? `${lastToggled} = ${expanded[lastToggled] ? "true" : "false"}` : `${openCount} open`}
              </span>
            </div>
            <span className="hidden items-center gap-2 font-mono text-xs text-text-faint sm:inline-flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> live preview
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={expandAll}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-border-strong hover:text-foreground"
              >
                Expand all
              </button>
              <button
                onClick={collapseAll}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-border-strong hover:text-foreground"
              >
                Collapse all
              </button>
              <button
                onClick={() => {
                  setExpanded(DEFAULT_EXPANDED);
                  setSelected("logo-svg");
                  setLastToggled("design");
                }}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-border-strong hover:text-foreground"
              >
                Reset
              </button>
            </div>
          </div>

          <p className="mb-5 font-mono text-xs leading-relaxed text-text-faint">
            {"<NSOutlineView>"} · {"<NSButton bezelStyle=.disclosure>"} · {rows.length} visible rows · {openCount} expanded · selected = “{selected}”
          </p>

          {/* stage */}
          <div
            className="relative overflow-visible rounded-xl border border-border bg-[#fcfcfa] p-3 sm:p-6"
            style={{ backgroundImage: "radial-gradient(circle, #e7e5e4 1px, transparent 1px)", backgroundSize: "20px 20px" }}
          >
            <div className="absolute inset-3 rounded-xl border-2 border-dashed border-[#0a84ff]/25 pointer-events-none" aria-hidden="true">
              <div className="absolute -top-3 left-6 flex items-center gap-1.5 bg-[#fcfcfa] px-1.5">
                <span className="rounded-full border border-[#0a84ff]/20 bg-white px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#0a84ff] shadow-sm">
                  NSOutlineView · disclosure rows
                </span>
              </div>
            </div>

            <div className="relative mx-auto max-w-[640px]">
              {/* outline window */}
              <div className="overflow-hidden rounded-xl border border-[#d6d3d1] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                <div className="flex h-9 items-center justify-between border-b border-border bg-[#f5f5f4] px-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full border border-[#e0443e] bg-[#ff5f57]" />
                    <span className="h-3 w-3 rounded-full border border-[#d9a01d] bg-[#febc2e]" />
                    <span className="h-3 w-3 rounded-full border border-[#1fac2e] bg-[#28c840]" />
                  </div>
                  <span className="text-xs font-medium text-text-muted">Acme Workspace — Outline</span>
                  <span className="font-mono text-[11px] text-text-faint">{rows.length} rows</span>
                </div>

                <div className="bg-white py-1.5" role="tree" aria-label="Workspace outline">
                  {rows.map(({ node, depth, hasKids }) => {
                    const open = !!expanded[node.id];
                    const isSel = selected === node.id;
                    return (
                      <div key={node.id}>
                        <div
                          role="treeitem"
                          aria-expanded={hasKids ? open : undefined}
                          aria-selected={isSel}
                          className={`group flex w-full items-center gap-0.5 pr-3 transition-colors ${
                            isSel ? "bg-[#0a84ff] text-white" : "text-[#1c1917] hover:bg-[#f5f5f4]"
                          }`}
                          style={{ paddingLeft: 10 + depth * 22, paddingTop: 3, paddingBottom: 3 }}
                        >
                          {/* the disclosure indicator — or its honest absence */}
                          {hasKids ? (
                            <button
                              onClick={() => toggle(node.id)}
                              aria-label={open ? `Collapse ${node.label}` : `Expand ${node.label}`}
                              aria-expanded={open}
                              className={`disclosure-tri grid h-6 w-6 shrink-0 place-items-center rounded-md transition-colors ${
                                isSel ? "hover:bg-white/20" : "hover:bg-black/[0.06]"
                              }`}
                            >
                              <Triangle open={open} />
                            </button>
                          ) : (
                            <span className="h-6 w-6 shrink-0" aria-hidden="true" title="Leaf row — no children, no triangle" />
                          )}
                          <button
                            onClick={() => setSelected(node.id)}
                            onDoubleClick={() => hasKids && toggle(node.id)}
                            className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-[5px] text-left"
                          >
                            {node.kind === "folder" ? <FolderGlyph /> : <FileGlyph />}
                            <span className={`flex-1 truncate text-[13px] leading-none ${isSel ? "font-medium" : "font-[450]"}`}>
                              {node.label}
                            </span>
                            {hasKids && (
                              <span
                                className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] leading-none ${
                                  isSel ? "bg-white/20 text-white" : "bg-surface-alt text-text-faint"
                                }`}
                              >
                                {countDescendants(node)}
                              </span>
                            )}
                            {node.meta && (
                              <span className={`hidden font-mono text-[10px] sm:inline ${isSel ? "text-white/70" : "text-text-faint"}`}>
                                {node.meta}
                              </span>
                            )}
                          </button>
                          {/* inline numbered pills — these ARE the callouts, pinned to live rows */}
                          {firstBranch?.node.id === node.id && (
                            <span className="ml-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#0a84ff] font-mono text-[10px] font-bold text-white shadow-sm" title="Part 1 — disclosure indicator">
                              1
                            </span>
                          )}
                          {firstCollapsed?.node.id === node.id && firstCollapsed.node.id !== firstBranch?.node.id && (
                            <span className="ml-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1c1917] font-mono text-[10px] font-bold text-white shadow-sm" title="Part 2 — collapsed state">
                              2
                            </span>
                          )}
                          {firstExpanded?.node.id === node.id && firstExpanded.node.id !== firstBranch?.node.id && (
                            <span className="ml-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-600 font-mono text-[10px] font-bold text-white shadow-sm" title="Part 3 — expanded state">
                              3
                            </span>
                          )}
                          {firstBranch?.node.id === node.id && firstCollapsed?.node.id === node.id && (
                            <span className="ml-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1c1917] font-mono text-[10px] font-bold text-white shadow-sm" title="Part 2 — collapsed state (same row also shows part 1)">
                              2
                            </span>
                          )}
                          {firstBranch?.node.id === node.id && firstExpanded?.node.id === node.id && (
                            <span className="ml-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-600 font-mono text-[10px] font-bold text-white shadow-sm" title="Part 3 — expanded state (same row also shows part 1)">
                              3
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex h-7 items-center justify-between border-t border-border bg-[#f5f5f4] px-3">
                  <span className="font-mono text-[11px] text-text-muted">
                    {openCount} expanded · {rows.length} visible
                  </span>
                  <span className="font-mono text-[11px] text-text-faint">click triangle = toggle · double-click row = toggle</span>
                </div>

                {/* desktop leader labels */}
                <div className="pointer-events-none absolute right-2 top-[52px] hidden items-center gap-1.5 xl:flex" aria-hidden="true">
                  <span className="h-px w-6 bg-[#d6d3d1]" />
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0a84ff] font-mono text-[10px] font-bold text-white">1</span>
                  <span className="rounded-full border border-[#0a84ff]/20 bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-[#0a84ff] shadow-sm">
                    indicator · BezelStyle.disclosure
                  </span>
                </div>
                <div className="pointer-events-none absolute bottom-10 right-2 hidden items-center gap-1.5 xl:flex" aria-hidden="true">
                  <span className="rounded-full bg-[#1c1917] px-2.5 py-1 font-mono text-[10px] font-semibold text-white shadow-sm">2 · collapsed ▶</span>
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-600 font-mono text-[10px] font-bold text-white">3</span>
                  <span className="rounded-full bg-emerald-600 px-2.5 py-1 font-mono text-[10px] font-semibold text-white shadow-sm">expanded ▼</span>
                </div>
              </div>

              {/* standalone DisclosureGroup — the same triangle outside an outline */}
              <div className="mt-4 overflow-hidden rounded-xl border border-[#d6d3d1] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                <button
                  onClick={() => setStandaloneOpen((v) => !v)}
                  aria-expanded={standaloneOpen}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-[#fafaf9]"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-md hover:bg-black/[0.06]">
                    <Triangle open={standaloneOpen} />
                  </span>
                  <span className="flex-1 text-[13px] font-semibold text-[#1c1917]">Advanced options</span>
                  <span className="rounded-full bg-surface-alt px-2 py-0.5 font-mono text-[10px] text-text-faint">
                    DisclosureGroup · isExpanded = {standaloneOpen ? "true" : "false"}
                  </span>
                </button>
                <div className={`reveal ${standaloneOpen ? "reveal-open" : "reveal-closed"}`}>
                  <div className="reveal-inner">
                    <div className="border-t border-border bg-[#fafaf9] px-4 py-3 pl-[52px]">
                      <p className="text-[13px] leading-relaxed text-text-muted">
                        Same triangle, no outline: a standalone section that folds electively — cache size, retry
                        policy, verbose logging. One row, one boolean, children directly beneath.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-xs leading-relaxed text-text-faint">
                Try: collapse <span className="font-medium text-foreground">Design</span> and watch five rows vanish —
                the pills re-pin to whichever rows now demonstrate each state. Leaves never grow a triangle.
              </p>
            </div>
          </div>

          {/* mini legend */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-xl bg-surface-alt px-4 py-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#0a84ff] font-mono text-[10px] font-bold text-white">1</span>
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Indicator · disclosure</p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">Only on rows with children. Same 24px slot stays empty on leaves so labels align.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-surface-alt px-4 py-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1c1917] font-mono text-[10px] font-bold text-white">2</span>
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Collapsed · isExpanded false</p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">Sideways ▶, children hidden. The outline shows shape without detail.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-emerald-600/15 bg-emerald-50/60 px-4 py-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-600 font-mono text-[10px] font-bold text-white">3</span>
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-emerald-700">Expanded · isExpanded true</p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">Down ▼, children revealed directly beneath, indented one step.</p>
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
                </p>
                <code className="mt-1 inline-block font-mono text-[10px] font-normal text-text-faint">{part.token}</code>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{part.see}</p>
              </div>
              <div className="border-t border-border bg-surface p-5 sm:p-6 md:border-l md:border-t-0">
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
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Outline hierarchy</p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">NSOutlineView</code>
              <p className="mt-2 text-xs leading-relaxed text-text-faint">The indented row list. Supplies a disclosure control per expandable row and indents each revealed level automatically.</p>
            </div>
            <div className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Standalone section</p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">DisclosureGroup</code>
              <p className="mt-2 text-xs leading-relaxed text-text-faint">One label + one boolean. SwiftUI&apos;s <code className="font-mono text-xs">isExpanded</code> binding drives both the rotation and the reveal — try it in “Advanced options” above.</p>
            </div>
            <div className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">The triangle itself</p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">NSButton.BezelStyle.disclosure</code>
              <p className="mt-2 text-xs leading-relaxed text-text-faint">A standalone disclosure button style — the tiny arrow alone, placeable beside any label, even outside an outline.</p>
            </div>
          </div>
          <div className="border-t border-border bg-[#fafaf9] px-6 py-4">
            <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-text-faint">Paste-ready prompt</p>
            <code className="block rounded-lg border border-border bg-white px-4 py-3 font-mono text-xs leading-relaxed text-text-muted">
              Use a native Disclosure Triangle for expandable rows: NSOutlineView for an outline hierarchy or SwiftUI
              DisclosureGroup for a standalone section. The small indicator must rotate between collapsed and expanded
              states while the row&apos;s children appear directly beneath it.
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
              href: "/scenarios/finder-outline",
              title: "Finder outline",
              desc: "A deep file hierarchy with keyboard arrows, expand-all / collapse-all, and selection separate from disclosure. The NSOutlineView classic.",
            },
            {
              href: "/scenarios/settings-sections",
              title: "Settings sections",
              desc: "Standalone DisclosureGroups in a settings form — independent sections that fold electively, with controls living inside the reveal.",
            },
            {
              href: "/scenarios/package-navigator",
              title: "Package navigator",
              desc: "An Xcode-style navigator with lazy-loaded folders, search that auto-expands matches, and honest empty states. Disclosure at scale.",
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
          Disclosure triangles suit deep, narrow hierarchies where the user opens a few branches at a time — outlines,
          navigators, progressive settings. For a flat stack of large sections opened one at a time, an accordion fits
          better; for side-by-side levels, a column view keeps ancestry visible. The triangle&apos;s contract is small
          but strict: sideways hides, down reveals, and children always sit directly beneath.
        </p>
      </footer>
    </main>
  );
}
