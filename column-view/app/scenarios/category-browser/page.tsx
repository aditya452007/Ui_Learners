"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

type Node = {
  id: string;
  label: string;
  meta?: string;
  kind: "branch" | "product";
  price?: string;
  badge?: string;
  children?: Node[];
};

const SHOP: Node[] = [
  {
    id: "women",
    label: "Women",
    kind: "branch",
    meta: "248 items",
    children: [
      {
        id: "w-clothing",
        label: "Clothing",
        kind: "branch",
        meta: "124",
        children: [
          {
            id: "tops",
            label: "Tops",
            kind: "branch",
            meta: "42",
            children: [
              { id: "linen-blouse", label: "Linen Blouse", kind: "product", price: "$89", badge: "New", meta: "Organic linen" },
              { id: "silk-cami", label: "Silk Cami", kind: "product", price: "$120", meta: "Mulberry silk" },
              { id: "cotton-tee", label: "Cotton Tee", kind: "product", price: "$45", meta: "Pima cotton" },
              { id: "wool-sweater", label: "Wool Sweater", kind: "product", price: "$165", badge: "Bestseller", meta: "Merino" },
            ],
          },
          {
            id: "dresses",
            label: "Dresses",
            kind: "branch",
            meta: "28",
            children: [
              { id: "midi-dress", label: "Midi Dress", kind: "product", price: "$149", meta: "Cotton poplin" },
              { id: "slip-dress", label: "Slip Dress", kind: "product", price: "$135", meta: "Silk" },
            ],
          },
          { id: "bottoms", label: "Bottoms", kind: "branch", meta: "34", children: [{ id: "wide-leg", label: "Wide-leg Trousers", kind: "product", price: "$129", meta: "Wool blend" }] },
        ],
      },
      { id: "w-shoes", label: "Shoes", kind: "branch", meta: "56", children: [{ id: "loafers", label: "Leather Loafers", kind: "product", price: "$195", meta: "Italian leather" }] },
      { id: "w-bags", label: "Bags", kind: "branch", meta: "36", children: [{ id: "tote", label: "Canvas Tote", kind: "product", price: "$75", meta: "Organic canvas" }] },
    ],
  },
  {
    id: "men",
    label: "Men",
    kind: "branch",
    meta: "186 items",
    children: [
      {
        id: "m-clothing",
        label: "Clothing",
        kind: "branch",
        meta: "82",
        children: [
          {
            id: "outerwear",
            label: "Outerwear",
            kind: "branch",
            meta: "18",
            children: [
              { id: "harrington", label: "Harrington Jacket", kind: "product", price: "$249", badge: "New", meta: "Water-resistant" },
              { id: "overshirt", label: "Overshirt", kind: "product", price: "$149", meta: "Brushed cotton" },
            ],
          },
          { id: "knitwear", label: "Knitwear", kind: "branch", meta: "22", children: [{ id: "crew", label: "Crew Sweater", kind: "product", price: "$135", meta: "Lambswool" }] },
        ],
      },
      { id: "m-shoes", label: "Shoes", kind: "branch", meta: "44", children: [{ id: "derby", label: "Derby Shoes", kind: "product", price: "$225", meta: "Calf leather" }] },
    ],
  },
  {
    id: "home",
    label: "Home",
    kind: "branch",
    meta: "94 items",
    children: [
      { id: "living", label: "Living", kind: "branch", meta: "32", children: [{ id: "throw", label: "Wool Throw", kind: "product", price: "$129", meta: "Icelandic wool" }] },
      { id: "kitchen", label: "Kitchen", kind: "branch", meta: "28", children: [{ id: "ceramic-mug", label: "Ceramic Mug Set", kind: "product", price: "$42", meta: "Set of 2" }] },
    ],
  },
];

function buildCols(tree: Node[], path: string[]) {
  const cols: Node[][] = [tree];
  let cur = tree;
  for (const id of path) {
    const n = cur.find((x) => x.id === id);
    if (n && n.kind === "branch" && n.children && n.children.length > 0) {
      cols.push(n.children);
      cur = n.children;
    } else break;
  }
  return cols;
}
function findNode(tree: Node[], id: string): Node | undefined {
  for (const n of tree) {
    if (n.id === id) return n;
    if (n.children) {
      const r = findNode(n.children, id);
      if (r) return r;
    }
  }
}

function Icon({ kind, sel }: { kind: string; sel?: boolean }) {
  if (kind === "product")
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
        <rect x="2.5" y="3" width="11" height="10" rx="2" fill={sel ? "white" : "#fff7ed"} stroke={sel ? "white" : "#fdba74"} strokeWidth="1.1" />
        <path d="M6 7h4M6 9.5h3" stroke={sel ? "#0a84ff" : "#9ca3af"} strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
      <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h3l1.2 1.5H12.5A1.5 1.5 0 0 1 14 7v4.5A1.5 1.5 0 0 1 12.5 13h-9A1.5 1.5 0 0 1 2 11.5v-6Z" fill={sel ? "white" : "#0a84ff"} fillOpacity={sel ? 0.95 : 0.1} stroke={sel ? "white" : "#0a84ff"} strokeWidth="1.1" />
    </svg>
  );
}

export default function CategoryBrowser() {
  const [path, setPath] = useState<string[]>(["women", "w-clothing", "tops", "linen-blouse"]);
  const [bag, setBag] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cols = buildCols(SHOP, path);
  const leafId = path[path.length - 1];
  const leaf = leafId ? findNode(SHOP, leafId) : undefined;
  const isProduct = leaf?.kind === "product";
  const breadcrumb = path.map((id) => findNode(SHOP, id)?.label ?? id);

  useEffect(() => {
    scrollRef.current?.scrollTo({ left: scrollRef.current.scrollWidth, behavior: "smooth" });
  }, [cols.length, leafId]);

  function selectAt(depth: number, n: Node) {
    if (n.kind === "branch" && n.children && n.children.length) setPath([...path.slice(0, depth), n.id]);
    else setPath([...path.slice(0, depth), n.id]);
  }

  return (
    <div className="min-h-screen bg-[#fcfcfa]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 font-medium text-text-muted hover:text-foreground">← Anatomy</Link>
          <span className="text-text-faint">/</span>
          <span className="font-mono text-xs tracking-widest uppercase text-text-faint">Scenario 2 · Category browser</span>
          <div className="ml-auto flex gap-2">
            <Link href="/scenarios/team-directory" className="rounded-full bg-[#0a84ff] px-3 py-1.5 text-xs font-semibold text-white">Next: Team →</Link>
          </div>
        </div>

        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight">Shop by taxonomy — Miller columns for retail</h1>
          <p className="mt-3 text-lg leading-relaxed text-text-muted">
            Not a file system — a product taxonomy. Departments → categories → products. The same Miller columns let shoppers keep their bearings while drilling from “Women” to “Linen Blouse” without ever losing the path.
          </p>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-faint mb-1">Why column view here</p>
            <p className="text-sm leading-relaxed text-text-muted">E-com taxonomies explode in width if flattened (“All tops on one page”). Columns keep each level glanceable and preserve the shopper’s trail.</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-faint mb-1">How extensibility shows</p>
            <p className="text-sm leading-relaxed text-text-muted">Leaf is not a file preview but a product card — image, price, badge, and “Add to bag”. Same NSBrowser, different leaf renderer.</p>
          </div>
          <div className="rounded-xl border border-[#0a84ff]/20 bg-[#eff6ff] p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0a84ff] mb-1">What shopper gains</p>
            <p className="text-sm leading-relaxed text-text-muted">Faster wayfinding, fewer wrong turns, and a spatial breadcrumb they can click any blue row to jump back to.</p>
          </div>
        </div>

        {/* store window */}
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          {/* store header */}
          <div className="flex h-14 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg bg-[#1c1917] grid place-items-center text-white font-serif text-sm">A</div>
              <span className="font-semibold tracking-tight">Atelier</span>
              <span className="hidden sm:inline ml-2 rounded-full bg-zinc-100 px-2.5 py-1 font-mono text-xs text-zinc-600">Column taxonomy</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-text-muted">Free shipping over $150</span>
              <button className="relative rounded-full border border-border bg-white px-4 py-2 text-sm font-medium flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4h10l-1 6H4L3 4Z" stroke="#1c1917" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6 7h4" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round"/></svg>
                Bag
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0a84ff] text-white text-xs font-bold">{bag.length}</span>
              </button>
            </div>
          </div>

          {/* breadcrumb strip */}
          <div className="flex items-center gap-2 border-b border-border bg-[#fafaf9] px-4 py-2 overflow-x-auto">
            <span className="font-mono text-xs text-text-faint shrink-0">You are here:</span>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-white border border-border px-2.5 py-1 text-xs font-medium">Shop</span>
              {breadcrumb.map((b, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span className="text-text-faint">›</span>
                  <button
                    onClick={() => setPath(path.slice(0, i + 1))}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium border ${i === breadcrumb.length - 1 ? "bg-[#0a84ff] text-white border-[#0a84ff]" : "bg-white border-border text-text-muted hover:text-foreground"}`}
                  >
                    {b}
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* columns */}
          <div ref={scrollRef} className="flex h-[400px] overflow-x-auto overflow-y-hidden bg-white">
            {cols.map((col, depth) => {
              const selId = path[depth];
              return (
                <div key={depth} className="flex w-[200px] shrink-0 flex-col border-r border-border bg-white">
                  <div className="flex h-7 items-center justify-between bg-[#fafaf9] border-b border-border px-3">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint truncate">{depth === 0 ? "Departments" : breadcrumb[depth - 1]}</span>
                    <span className="font-mono text-[10px] text-text-faint">{col.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {col.map((n) => {
                      const isBranch = n.kind === "branch";
                      const isSel = selId === n.id;
                      return (
                        <button
                          key={n.id}
                          onClick={() => selectAt(depth, n)}
                          className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left border-b border-zinc-50 ${isSel ? "bg-[#0a84ff] text-white" : "hover:bg-zinc-50 text-[#1c1917]"}`}
                        >
                          <Icon kind={n.kind} sel={isSel} />
                          <div className="flex-1 min-w-0">
                            <p className={`truncate text-[13px] leading-none ${isSel ? "font-medium text-white" : "font-[450]"}`}>{n.label}</p>
                            {n.meta && <p className={`truncate font-mono text-[11px] ${isSel ? "text-white/70" : "text-text-faint"}`}>{n.meta}</p>}
                          </div>
                          {isBranch ? (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`shrink-0 ${isSel ? "text-white/70" : "text-zinc-400"}`}><path d="M4.2 2.5 7.7 6 4.2 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          ) : (
                            <span className={`font-mono text-xs font-semibold ${isSel ? "text-white" : "text-zinc-900"}`}>{n.price}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* product preview */}
            {isProduct && leaf && (
              <div className="flex w-[300px] shrink-0 flex-col bg-[#fafaf9] border-r border-border">
                <div className="flex h-7 items-center bg-[#fafaf9] border-b border-border px-3">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Product</span>
                  <span className="ml-auto font-mono text-[10px] text-text-faint">isLeaf · product</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="rounded-2xl overflow-hidden border border-border bg-white">
                    <div className="aspect-[4/3] bg-gradient-to-br from-zinc-100 to-zinc-200 grid place-items-center relative">
                      <span className="text-5xl">👚</span>
                      {leaf.badge && <span className="absolute top-3 left-3 rounded-full bg-[#1c1917] px-2.5 py-1 text-xs font-semibold text-white">{leaf.badge}</span>}
                      <span className="absolute bottom-3 right-3 rounded-full bg-white border border-border px-2 py-1 font-mono text-xs">{leaf.price}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold leading-tight">{leaf.label}</h3>
                      <p className="text-sm text-text-muted mt-1">{leaf.meta} · Free returns</p>
                      <div className="mt-3 flex gap-2">
                        <span className="rounded-full border border-border bg-zinc-50 px-2.5 py-1 text-xs">XS</span>
                        <span className="rounded-full border border-[#1c1917] bg-[#1c1917] px-2.5 py-1 text-xs text-white">S</span>
                        <span className="rounded-full border border-border bg-white px-2.5 py-1 text-xs">M</span>
                        <span className="rounded-full border border-border bg-white px-2.5 py-1 text-xs">L</span>
                      </div>
                      <button
                        onClick={() => setBag((b) => (b.includes(leaf.id) ? b : [...b, leaf.id]))}
                        className={`mt-4 w-full rounded-full py-2.5 text-sm font-semibold transition-colors ${bag.includes(leaf.id) ? "bg-emerald-600 text-white" : "bg-[#0a84ff] text-white hover:bg-[#0066cc]"}`}
                      >
                        {bag.includes(leaf.id) ? "✓ Added to bag" : "Add to bag — " + leaf.price}
                      </button>
                      <p className="mt-3 text-xs text-text-faint text-center">Leaf preview replaces the next column. No › — no deeper level.</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> In stock · Ships today
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex h-7 items-center justify-between border-t border-border bg-[#f5f5f4] px-3">
            <span className="font-mono text-xs text-text-muted truncate">{breadcrumb.join("  ›  ")}</span>
            <span className="font-mono text-[11px] text-text-faint">{breadcrumb.length} levels · {isProduct ? "product leaf" : "branch"} selected</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <Link href="/scenarios/file-browser" className="text-text-muted hover:text-[#0a84ff]">← File browser</Link>
          <Link href="/scenarios/team-directory" className="text-[#0a84ff] font-medium hover:underline">Team directory →</Link>
        </div>
      </div>
    </div>
  );
}
