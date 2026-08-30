"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

type FNode = {
  id: string;
  label: string;
  kind: "folder" | "file";
  meta?: string;
  size?: string;
  modified?: string;
  preview?: "image" | "code" | "doc" | "pdf";
  children?: FNode[];
};

const FS: FNode[] = [
  {
    id: "projects",
    label: "Projects",
    kind: "folder",
    children: [
      {
        id: "website",
        label: "Website Redesign",
        kind: "folder",
        children: [
          {
            id: "assets",
            label: "Assets",
            kind: "folder",
            children: [
              { id: "hero", label: "hero.jpg", kind: "file", meta: "2.4 MB", preview: "image", modified: "Aug 12" },
              { id: "logo", label: "logo.svg", kind: "file", meta: "18 KB", preview: "image", modified: "Aug 10" },
              { id: "icons", label: "icons.zip", kind: "file", meta: "4.1 MB", preview: "doc", modified: "Aug 9" },
            ],
          },
          {
            id: "pages",
            label: "Pages",
            kind: "folder",
            children: [
              { id: "index", label: "index.tsx", kind: "file", meta: "3.2 KB", preview: "code", modified: "Aug 18" },
              { id: "about", label: "about.tsx", kind: "file", meta: "2.1 KB", preview: "code", modified: "Aug 17" },
              { id: "pricing", label: "pricing.tsx", kind: "file", meta: "4.6 KB", preview: "code", modified: "Aug 15" },
            ],
          },
          { id: "pkg", label: "package.json", kind: "file", meta: "1.1 KB", preview: "code", modified: "Aug 18" },
          { id: "readme", label: "README.md", kind: "file", meta: "0.9 KB", preview: "doc", modified: "Aug 14" },
        ],
      },
      {
        id: "mobile",
        label: "Mobile App",
        kind: "folder",
        children: [
          { id: "screens", label: "Screens", kind: "folder", children: [{ id: "home-screen", label: "Home.fig", kind: "file", meta: "12 MB", preview: "image", modified: "Aug 8" }] },
          { id: "components-m", label: "Components", kind: "folder", children: [] },
        ],
      },
    ],
  },
  {
    id: "documents",
    label: "Documents",
    kind: "folder",
    children: [
      {
        id: "reports",
        label: "Reports",
        kind: "folder",
        children: [
          { id: "q3", label: "Q3-2025.pdf", kind: "file", meta: "1.8 MB", preview: "pdf", modified: "Sep 1" },
          { id: "q2", label: "Q2-2025.pdf", kind: "file", meta: "2.1 MB", preview: "pdf", modified: "Jun 30" },
        ],
      },
      { id: "invoices", label: "Invoices", kind: "folder", children: [{ id: "inv-042", label: "INV-042.pdf", kind: "file", meta: "86 KB", preview: "pdf", modified: "Aug 20" }] },
      { id: "notes", label: "Meeting notes.txt", kind: "file", meta: "4 KB", preview: "doc", modified: "Aug 19" },
    ],
  },
  {
    id: "photos",
    label: "Photos",
    kind: "folder",
    children: [
      {
        id: "y2025",
        label: "2025",
        kind: "folder",
        children: [
          {
            id: "summer",
            label: "Summer",
            kind: "folder",
            children: [
              { id: "beach", label: "beach.jpg", kind: "file", meta: "3.2 MB", preview: "image", modified: "Jul 21" },
              { id: "sunset", label: "sunset.jpg", kind: "file", meta: "4.8 MB", preview: "image", modified: "Jul 22" },
            ],
          },
          { id: "winter", label: "Winter", kind: "folder", children: [{ id: "snow", label: "snow.jpg", kind: "file", meta: "2.9 MB", preview: "image", modified: "Jan 8" }] },
        ],
      },
      { id: "favorites", label: "Favorites", kind: "folder", children: [] },
    ],
  },
];

function buildCols(tree: FNode[], path: string[]) {
  const cols: FNode[][] = [tree];
  let cur = tree;
  for (const id of path) {
    const n = cur.find((x) => x.id === id);
    if (n && n.kind === "folder" && n.children && n.children.length > 0) {
      cols.push(n.children);
      cur = n.children;
    } else break;
  }
  return cols;
}
function findNode(tree: FNode[], id: string): FNode | undefined {
  for (const n of tree) {
    if (n.id === id) return n;
    if (n.children) {
      const r = findNode(n.children, id);
      if (r) return r;
    }
  }
}

function FolderIcon({ sel }: { sel?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M2 5.5A1.5 1.5 0 0 1 3.5 4h3l1.2 1.5H12.5A1.5 1.5 0 0 1 14 7v4.5A1.5 1.5 0 0 1 12.5 13h-9A1.5 1.5 0 0 1 2 11.5v-6Z"
        fill={sel ? "white" : "#0a84ff"}
        fillOpacity={sel ? 0.95 : 0.12}
        stroke={sel ? "white" : "#0a84ff"}
        strokeWidth="1.1"
      />
    </svg>
  );
}
function FileIcon({ kind, sel }: { kind?: string; sel?: boolean }) {
  if (kind === "image")
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
        <rect x="2.5" y="3" width="11" height="10" rx="1.2" fill={sel ? "white" : "#f5f5f4"} stroke={sel ? "white" : "#d6d3d1"} strokeWidth="1.1" />
        <circle cx="6" cy="6.5" r="1.4" fill={sel ? "#0a84ff" : "#0a84ff"} opacity={sel ? 0.9 : 0.2} />
        <path d="M3.2 11 6 8l2 2 1.2-1.2L12.5 11" stroke={sel ? "white" : "#a8a29e"} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (kind === "code")
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
        <path d="M4 3.5h5.2L12 5.3V12.5A1.2 1.2 0 0 1 10.8 13.7H4A1.2 1.2 0 0 1 2.8 12.5V4.7A1.2 1.2 0 0 1 4 3.5Z" fill={sel ? "white" : "#f5f5f4"} stroke={sel ? "white" : "#d6d3d1"} strokeWidth="1.1" />
        <path d="M6 7.5 4.5 9 6 10.5M10 7.5l1.5 1.5L10 10.5" stroke={sel ? "#0a84ff" : "#78716c"} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
      <path d="M5 2.5h4.2L11 4.3V12.5A1.2 1.2 0 0 1 9.8 13.7H5A1.2 1.2 0 0 1 3.8 12.5V3.7A1.2 1.2 0 0 1 5 2.5Z" fill={sel ? "white" : "#f5f5f4"} stroke={sel ? "white" : "#d6d3d1"} strokeWidth="1.1" />
      <path d="M9.2 2.5v1.8H11" stroke={sel ? "white" : "#d6d3d1"} strokeWidth="1.1" />
    </svg>
  );
}
function Chevron({ sel }: { sel?: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className={`shrink-0 ${sel ? "text-white" : "text-zinc-400"}`}>
      <path d="M4.2 2.5 7.7 6 4.2 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FileBrowser() {
  const [path, setPath] = useState<string[]>(["projects", "website", "assets", "hero"]);
  const [search, setSearch] = useState("");
  const cols = buildCols(FS, path);
  const scrollRef = useRef<HTMLDivElement>(null);
  const leafId = path[path.length - 1];
  const leaf = leafId ? findNode(FS, leafId) : undefined;
  const isFileLeaf = leaf?.kind === "file";
  const breadcrumb = path.map((id) => findNode(FS, id)?.label ?? id);

  useEffect(() => {
    scrollRef.current?.scrollTo({ left: scrollRef.current.scrollWidth, behavior: "smooth" });
  }, [cols.length, leafId]);

  function selectAt(depth: number, n: FNode) {
    if (n.kind === "folder" && n.children && n.children.length > 0) setPath([...path.slice(0, depth), n.id]);
    else setPath([...path.slice(0, depth), n.id]);
  }

  // keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const active = document.activeElement?.closest("[data-browser]");
      if (!active) return;
      const depth = cols.length - (isFileLeaf ? 1 : 1); // current column with selection
      // Determine current column to navigate
      const curColIndex = Math.min(depth, cols.length - 1);
      // Actually last column that contains selection
      const selDepth = path.length - 1;
      const selCol = selDepth < cols.length ? selDepth : cols.length - 1;
      const col = cols[selCol];
      if (!col) return;
      const idx = col.findIndex((n) => n.id === path[selCol]);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = col[Math.min(idx + 1, col.length - 1)];
        if (next) selectAt(selCol, next);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = col[Math.max(idx - 1, 0)];
        if (prev) selectAt(selCol, prev);
      } else if (e.key === "ArrowRight") {
        const cur = col[idx];
        if (cur?.kind === "folder" && cur.children && cur.children.length) {
          e.preventDefault();
          const first = cur.children[0];
          if (first) setPath([...path.slice(0, selCol + 1), first.id]);
        }
      } else if (e.key === "ArrowLeft") {
        if (selCol > 0) {
          e.preventDefault();
          setPath(path.slice(0, selCol));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cols, path, isFileLeaf]);

  return (
    <div className="min-h-screen bg-[#fcfcfa]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* nav */}
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 font-medium text-text-muted hover:text-foreground hover:border-border-strong transition-colors">
            ← Anatomy
          </Link>
          <span className="text-text-faint">/</span>
          <span className="font-mono text-xs tracking-widest uppercase text-text-faint">Scenario 1 · File Browser</span>
          <div className="ml-auto flex gap-2">
            <Link href="/scenarios/category-browser" className="rounded-full bg-[#0a84ff] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0066cc] transition-colors">
              Next: Category → 
            </Link>
          </div>
        </div>

        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight">File browser — Finder in the browser</h1>
          <p className="mt-3 text-lg leading-relaxed text-text-muted">
            The canonical use case. A column per folder, a chevron per branch, a blue trail for the path, and a preview column when you land on a file. Exactly what NSBrowser was built for.
          </p>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex gap-3">
            <span className="text-amber-600 mt-0.5">⌘</span>
            <p className="text-sm leading-relaxed text-amber-900">
              <span className="font-semibold">Try the keyboard:</span> click the browser to focus, then use <span className="font-mono bg-white border border-amber-200 rounded px-1">↑</span>{" "}
              <span className="font-mono bg-white border border-amber-200 rounded px-1">↓</span> to move, <span className="font-mono bg-white border border-amber-200 rounded px-1">→</span> to drill in,{" "}
              <span className="font-mono bg-white border border-amber-200 rounded px-1">←</span> to go up. Watch the columns animate.
            </p>
          </div>
        </header>

        {/* why it fits */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-faint mb-1">Why column view here</p>
            <p className="text-sm leading-relaxed text-text-muted">File hierarchies are deep and narrow — 3–5 levels, ~10 items per folder. Seeing ancestors stay visible prevents “where am I?” syndrome.</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-faint mb-1">Branch vs leaf distinct</p>
            <p className="text-sm leading-relaxed text-text-muted">Folders get a › and open a new column; files get no › and open a preview column with kind, size, and Quick Look.</p>
          </div>
          <div className="rounded-xl border border-[#0a84ff]/20 bg-[#eff6ff] p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0a84ff] mb-1">What user gains</p>
            <p className="text-sm leading-relaxed text-text-muted">Spatial memory — muscle memory for paths — plus zero back-buttoning. Selecting is exploring.</p>
          </div>
        </div>

        {/* Finder window */}
        <div className="overflow-hidden rounded-2xl border border-[#d6d3d1] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          {/* toolbar */}
          <div className="flex h-[52px] items-center gap-3 border-b border-border bg-[#f5f5f4] px-4">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#d9a01d]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840] border border-[#1fac2e]" />
            </div>
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              <button className="grid h-7 w-7 place-items-center rounded-md border border-border bg-white text-text-muted hover:text-foreground">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 3 4 7l4.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="grid h-7 w-7 place-items-center rounded-md border border-border bg-white text-text-faint">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.5 3 10 7l-4.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <div className="hidden sm:flex items-center gap-1 ml-3 rounded-full bg-white border border-border px-1 py-1">
              <span className="rounded-full bg-[#0a84ff] px-3 py-1 text-xs font-semibold text-white">Columns</span>
              <span className="px-3 py-1 text-xs font-medium text-text-muted">Icons</span>
              <span className="px-3 py-1 text-xs font-medium text-text-muted">List</span>
              <span className="px-3 py-1 text-xs font-medium text-text-muted">Gallery</span>
            </div>
            <div className="flex-1 flex justify-end">
              <label className="flex items-center gap-2 rounded-full border border-border bg-white pl-3 pr-2 py-1.5 w-full max-w-[260px] focus-within:border-[#0a84ff] focus-within:ring-2 focus-within:ring-[#0a84ff]/20 transition">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><circle cx="6" cy="6" r="3.5" stroke="#a8a29e" strokeWidth="1.3"/><path d="M8.8 8.8 11.5 11.5" stroke="#a8a29e" strokeWidth="1.3" strokeLinecap="round"/></svg>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search this folder" className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-faint" />
              </label>
            </div>
          </div>

          {/* columns */}
          <div data-browser tabIndex={0} ref={scrollRef} className="flex h-[380px] overflow-x-auto overflow-y-hidden bg-white outline-none focus:ring-2 focus:ring-inset focus:ring-[#0a84ff]/20">
            {cols.map((col, depth) => {
              const selId = path[depth];
              const filtered = search && depth === cols.length - (isFileLeaf ? 2 : 1) ? col.filter((n) => n.label.toLowerCase().includes(search.toLowerCase())) : col;
              return (
                <div key={depth} className="flex w-[220px] shrink-0 flex-col border-r border-border bg-white">
                  <div className="flex h-6 items-center justify-between bg-[#fafaf9] border-b border-border px-3">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint truncate">{depth === 0 ? "Macintosh HD" : breadcrumb[depth - 1]}</span>
                    <span className="font-mono text-[10px] text-text-faint">{filtered.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {filtered.length === 0 ? (
                      <div className="grid place-items-center h-32 text-center p-6">
                        <p className="text-sm text-text-faint">No matches for “{search}”</p>
                      </div>
                    ) : (
                      filtered.map((n) => {
                        const isBranch = n.kind === "folder" && !!n.children && n.children.length > 0;
                        const isSel = selId === n.id;
                        return (
                          <button key={n.id} onClick={() => selectAt(depth, n)} className={`flex w-full items-center gap-2 px-3 py-[7px] text-left ${isSel ? "bg-[#0a84ff] text-white" : "hover:bg-[#f5f5f4] text-[#1c1917]"} `}>
                            {n.kind === "folder" ? <FolderIcon sel={isSel} /> : <FileIcon kind={n.preview} sel={isSel} />}
                            <span className={`flex-1 truncate text-[13px] ${isSel ? "font-medium text-white" : "text-zinc-800"}`}>{n.label}</span>
                            {isBranch ? <Chevron sel={isSel} /> : <span className={`hidden sm:inline font-mono text-[10px] ${isSel ? "text-white/70" : "text-text-faint"}`}>{n.size ?? n.meta}</span>}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}

            {/* preview column */}
            {isFileLeaf && leaf && (
              <div className="flex w-[280px] shrink-0 flex-col bg-[#fafaf9] border-r border-border">
                <div className="flex h-6 items-center bg-[#fafaf9] border-b border-border px-3">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Preview</span>
                  <span className="ml-auto font-mono text-[10px] text-text-faint">isLeaf = true</span>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                  {leaf.preview === "image" && (
                    <div>
                      <div className="aspect-[4/3] overflow-hidden rounded-xl border border-border bg-white grid place-items-center">
                        <div className="h-full w-full bg-gradient-to-br from-zinc-100 to-zinc-200 grid place-items-center">
                          <span className="text-4xl">🖼️</span>
                        </div>
                      </div>
                      <h3 className="mt-4 text-sm font-semibold">{leaf.label}</h3>
                      <p className="text-xs text-text-muted mt-1">{leaf.size} · Modified {leaf.modified}</p>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg bg-white border border-border p-3"><p className="text-text-faint">Kind</p><p className="font-medium">JPEG image</p></div>
                        <div className="rounded-lg bg-white border border-border p-3"><p className="text-text-faint">Dimensions</p><p className="font-medium">2400 × 1800</p></div>
                      </div>
                    </div>
                  )}
                  {leaf.preview === "code" && (
                    <div>
                      <div className="rounded-xl border border-border bg-white p-3 overflow-hidden">
                        <p className="font-mono text-[11px] text-text-faint mb-2">{leaf.label} — 42 lines</p>
                        <pre className="font-mono text-xs leading-relaxed text-zinc-800 overflow-x-auto">
                          {`export default function Page() {\n  return (\n    <main>\n      <Header />\n      <Hero />\n    </main>\n  )\n}`}
                        </pre>
                      </div>
                      <h3 className="mt-4 text-sm font-semibold">{leaf.label}</h3>
                      <p className="text-xs text-text-muted">{leaf.size} · Modified {leaf.modified}</p>
                    </div>
                  )}
                  {leaf.preview === "pdf" && (
                    <div className="text-center">
                      <div className="mx-auto w-20 h-24 rounded-lg border border-red-200 bg-red-50 grid place-items-center">
                        <span className="text-2xl">📄</span>
                      </div>
                      <h3 className="mt-3 text-sm font-semibold">{leaf.label}</h3>
                      <p className="text-xs text-text-muted">{leaf.size} · {leaf.modified}</p>
                      <button className="mt-4 w-full rounded-full bg-[#0a84ff] py-2 text-sm font-semibold text-white hover:bg-[#0066cc]">Open in Preview</button>
                    </div>
                  )}
                  {leaf.preview === "doc" && (
                    <div>
                      <h3 className="text-sm font-semibold">{leaf.label}</h3>
                      <p className="text-xs text-text-muted mt-1">{leaf.size} · {leaf.modified}</p>
                      <p className="mt-3 text-sm leading-relaxed text-text-muted">No preview available. This is a leaf node — selecting it does not create another path column. Finder shows Quick Look here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* status */}
          <div className="flex h-7 items-center justify-between border-t border-border bg-[#f5f5f4] px-3">
            <span className="font-mono text-xs text-text-muted truncate">{breadcrumb.join("  ›  ")} {isFileLeaf ? ` › ${leaf?.label}` : ""}</span>
            <span className="font-mono text-[11px] text-text-faint hidden sm:inline">{cols.length} columns · {cols[cols.length - 1]?.length ?? 0} items · Tab to focus, arrows to navigate</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <Link href="/" className="text-text-muted hover:text-[#0a84ff]">← Back to anatomy</Link>
          <div className="flex gap-3">
            <Link href="/scenarios/category-browser" className="text-[#0a84ff] font-medium hover:underline">Category browser →</Link>
            <Link href="/scenarios/team-directory" className="text-text-muted hover:text-foreground">Team directory →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
