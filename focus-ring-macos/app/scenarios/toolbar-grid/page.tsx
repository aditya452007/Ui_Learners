"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

type ToolId = "search" | "filter" | "sort" | "view0" | "view1" | "view2" | "add" | "more";
type RowId = `row-${number}`;

const FILES = [
  { name: "Lark — Lookbook.pdf", size: "4.2 MB", dims: "A4 · 24p", updated: "Today" },
  { name: "Studio Invoices Q3.csv", size: "82 KB", dims: "—", updated: "Yesterday" },
  { name: "Palette 14 — muted.sketch", size: "12 MB", dims: "—", updated: "Aug 28" },
  { name: "Hero still 16:9.jpg", size: "3.1 MB", dims: "3840×2160", updated: "Aug 20" },
  { name: "Type test — Sora.woff2", size: "42 KB", dims: "—", updated: "Aug 12" },
  { name: "Walkthrough v4.mov", size: "128 MB", dims: "1920×1080", updated: "Aug 10" },
];

export default function ToolbarGridPage() {
  const [active, setActive] = useState<string>("filter");
  const [fixed, setFixed] = useState(false);
  const [view, setView] = useState(0);
  const [selected, setSelected] = useState<number | null>(1);
  const hostRef = useRef<HTMLDivElement>(null);

  const order = ["search", "filter", "sort", "view0", "view1", "view2", "add", "more", ...FILES.map((_, i) => `row-${i}`)];

  const move = useCallback(
    (dir: 1 | -1) => {
      const idx = order.indexOf(active);
      const nxt = order[(idx + dir + order.length) % order.length];
      setActive(nxt);
      // scroll into view if row
      if (nxt.startsWith("row-")) {
        document.getElementById(nxt)?.scrollIntoView({ block: "nearest" });
      }
    },
    [active]
  );

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        move(e.shiftKey ? -1 : 1);
      }
    };
    el.addEventListener("keydown", h);
    return () => el.removeEventListener("keydown", h);
  }, [move]);

  useEffect(() => {
    hostRef.current?.focus();
  }, []);

  const ring = (id: string) => (active === id ? "macos-ring !border-[#0a84ff]" : "border-border");

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <nav className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs">
        <Link href="/" className="rounded-full border border-border bg-white px-3 py-1 hover:border-border-strong">
          ← Hub
        </Link>
        <span className="text-text-faint">/</span>
        <span className="rounded-full bg-[#1c1917] px-3 py-1 font-semibold text-white">03 · Toolbar + grid</span>
        <span className="hidden sm:inline-flex rounded-full border border-border bg-white px-3 py-1 text-text-muted">overflow · breathing room</span>
        <div className="ml-auto flex gap-1.5">
          <Link href="/scenarios/system-settings" className="rounded-full border border-border bg-white px-3 py-1 hover:border-border-strong">
            ← Settings
          </Link>
          <Link href="/" className="rounded-full bg-[#0a84ff] px-3 py-1 font-semibold text-white hover:bg-[#0066cc]">
            Hub ↑
          </Link>
        </div>
      </nav>

      <header className="mb-8 max-w-3xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0a84ff]">Scenario 03 · Dense workspace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">The clipped ring you’ve shipped before</h1>
        <p className="mt-3 text-base leading-relaxed text-text-muted">
          A file browser toolbar + grid — icons jammed edge-to-edge, rows in a scroll container. It’s the exact place AppKit
          warns: <em>“leave enough space for the focus ring.”</em> No space →{" "}
          <span className="font-medium text-foreground">half a halo</span>. Add 6 px padding + negative margin and the full
          ring breathes again — without changing any control.
        </p>
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          <span className="font-semibold">Why it fits here:</span> Not every bug is missing focus — sometimes it’s{" "}
          <em>clipped</em> focus. Toolbars and tables with{" "}
          <code className="rounded bg-white px-1 font-mono text-xs">overflow: hidden</code> or tight stacks cut the glow.
          This is the layout fix the hub only names.
        </p>
      </header>

      {/* toggle */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex overflow-hidden rounded-full border border-border bg-white p-1 shadow-sm">
          <button
            onClick={() => setFixed(false)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${!fixed ? "bg-[#1c1917] text-white" : "text-text-muted hover:text-foreground"}`}
          >
            ✗ Clipped (tight)
          </button>
          <button
            onClick={() => setFixed(true)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${fixed ? "bg-emerald-600 text-white" : "text-text-muted hover:text-foreground"}`}
          >
            ✓ Fixed (breathing room)
          </button>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 font-mono text-xs ${fixed ? "border-emerald-200 text-emerald-700" : "border-amber-200 text-amber-700"}`}>
          <span className={`h-2 w-2 rounded-full ${fixed ? "bg-emerald-500" : "bg-amber-500"}`} />
          {fixed ? "padding: 6px; margin: -6px; overflow: visible" : "overflow: hidden — ring cut"}
        </span>
        <span className="font-mono text-xs text-text-faint hidden sm:inline">Tab through toolbar then rows</span>
      </div>

      <div
        ref={hostRef}
        tabIndex={0}
        className="overflow-visible rounded-2xl border border-border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] outline-none"
      >
        {/* window bar */}
        <div className="flex h-9 items-center gap-2 border-b border-border bg-[#f5f5f4] px-4">
          <span className="h-3 w-3 rounded-full border border-[#e0443e] bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full border border-[#d9a01d] bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full border border-[#1fac2e] bg-[#28c840]" />
          <span className="ml-2 hidden text-xs font-medium text-text-muted sm:inline">Finder · Studio Exports</span>
          <span className="ml-auto flex gap-1">
            <button onClick={() => move(-1)} className="rounded-full border border-border bg-white px-2.5 py-1 text-xs font-medium">
              ⇧ Tab
            </button>
            <button onClick={() => move(1)} className="rounded-full bg-[#0a84ff] px-2.5 py-1 text-xs font-semibold text-white">
              Tab →
            </button>
          </span>
        </div>

        <div className="flex">
          {/* sidebar */}
          <aside className="hidden w-[180px] shrink-0 border-r border-border bg-[#fcfcfa] p-3 sm:block">
            <p className="px-2 mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Sources</p>
            {[
              ["Recents", "◷"],
              ["Exports", "▭", true],
              ["Archive", "▭"],
              ["Drafts", "▭"],
            ].map(([label, icon, activeS]) => (
              <div key={label as string} className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${activeS ? "bg-[#0a84ff] text-white" : "text-text-muted"}`}>
                <span className={`grid h-5 w-5 place-items-center rounded text-xs ${activeS ? "bg-white/20" : "bg-white border border-border"}`}>{icon as string}</span>
                {label as string}
              </div>
            ))}
            <div className="mt-4 rounded-lg border border-dashed border-border bg-white p-2">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Active</p>
              <p className="mt-1 font-mono text-xs font-bold text-[#0a84ff]">{active}</p>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">Watch the halo at the toolbar edge — it’s cut when clipped.</p>
            </div>
          </aside>

          {/* main */}
          <div className="flex-1 min-w-0 bg-white">
            {/* toolbar */}
            <div className={`border-b border-border bg-[#fafaf9] px-2 py-2 sm:px-3 ${fixed ? "noclip-ring" : "clip-ring"}`}>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {/* search */}
                <div className="relative flex-1 min-w-[160px] max-w-[260px]">
                  <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-faint text-xs">⌕</span>
                  <input
                    id="search"
                    onFocus={() => setActive("search")}
                    placeholder="Search exports"
                    className={`w-full rounded-md border bg-white py-1.5 pl-7 pr-2 text-sm outline-none ${ring("search")}`}
                  />
                </div>

                <div className="h-6 w-px bg-border hidden sm:block" />

                <button
                  id="filter"
                  onFocus={() => setActive("filter")}
                  onClick={() => setActive("filter")}
                  className={`inline-flex items-center gap-1.5 rounded-md border bg-white px-2.5 py-1.5 text-xs font-medium shadow-sm ${ring("filter")}`}
                >
                  <span className="text-text-faint">☰</span> Filter
                </button>
                <button
                  id="sort"
                  onFocus={() => setActive("sort")}
                  onClick={() => setActive("sort")}
                  className={`inline-flex items-center gap-1.5 rounded-md border bg-white px-2.5 py-1.5 text-xs font-medium shadow-sm ${ring("sort")}`}
                >
                  Sort <span className="text-zinc-400">▾</span>
                </button>

                <div className="h-6 w-px bg-border hidden sm:block" />

                {/* view switcher — group */}
                <div className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm p-0.5">
                  {["▦", "≡", "◧"].map((icon, i) => (
                    <button
                      key={i}
                      id={`view${i}`}
                      onFocus={() => setActive(`view${i}`)}
                      onClick={() => {
                        setActive(`view${i}`);
                        setView(i);
                      }}
                      className={`grid h-7 w-7 place-items-center rounded text-xs ${ring(`view${i}`)} ${view === i ? "bg-[#1c1917] text-white border-[#1c1917]" : "bg-white text-text-muted hover:text-foreground border-transparent"}`}
                      aria-label={`View ${i}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>

                <div className="ml-auto flex items-center gap-1.5">
                  <button
                    id="add"
                    onFocus={() => setActive("add")}
                    onClick={() => setActive("add")}
                    className={`inline-flex items-center gap-1.5 rounded-md bg-[#0a84ff] px-3 py-1.5 text-xs font-semibold text-white shadow-sm ${ring("add") ? ring("add") + " !bg-[#0a84ff]" : "hover:bg-[#0066cc]"}`}
                  >
                    <span className="text-sm leading-none">+</span> New
                  </button>
                  <button
                    id="more"
                    onFocus={() => setActive("more")}
                    onClick={() => setActive("more")}
                    className={`grid h-7 w-7 place-items-center rounded-md border bg-white text-text-muted ${ring("more")}`}
                    aria-label="More"
                  >
                    ⋯
                  </button>
                </div>
              </div>

              {!fixed && (
                <p className="mt-2 font-mono text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1 inline-flex gap-1.5">
                  <span>⚠</span> Toolbar parent is <code>overflow: hidden</code> — right/bottom edge of the ring is cropped.
                </p>
              )}
              {fixed && (
                <p className="mt-2 font-mono text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-1 inline-flex gap-1.5">
                  <span>✓</span> Parent uses <code>padding:6px; margin:-6px; overflow:visible</code> — full 4 px halo visible.
                </p>
              )}
            </div>

            {/* column header */}
            <div className="flex items-center gap-2 border-b border-border bg-white px-3 py-2 text-[11px] font-medium text-text-faint">
              <span className="flex-1">Name</span>
              <span className="hidden sm:inline w-20 text-right">Size</span>
              <span className="hidden sm:inline w-32 text-right">Dimensions</span>
              <span className="hidden sm:inline w-20 text-right">Modified</span>
            </div>

            {/* grid — also clipping demo */}
            <div className={`max-h-[320px] overflow-auto col-scroll ${fixed ? "noclip-ring" : "clip-ring"}`}>
              <div className="divide-y divide-[#f5f5f4]">
                {FILES.map((f, i) => {
                  const id = `row-${i}`;
                  const isSel = selected === i;
                  const isFocus = active === id;
                  return (
                    <button
                      key={f.name}
                      id={id}
                      onFocus={() => setActive(id)}
                      onClick={() => {
                        setActive(id);
                        setSelected(i);
                      }}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm ${isFocus ? (fixed ? "macos-ring !border-[#0a84ff] bg-[#eff6ff]" : "bg-[#eff6ff] border border-[#0a84ff]") : isSel ? "bg-[#f5f5f4]" : "hover:bg-[#fafaf9]"} ${isFocus && !fixed ? "relative" : ""} border ${isFocus ? "border-[#0a84ff]" : "border-transparent"}`}
                    >
                      <span
                        className={`grid h-7 w-7 place-items-center rounded border text-xs shrink-0 ${isFocus ? "bg-[#0a84ff] text-white border-[#0a84ff]" : isSel ? "bg-white border-border text-text-muted" : "bg-white border-border text-text-muted"}`}
                      >
                        {f.name.endsWith(".pdf") ? "◧" : f.name.endsWith(".csv") ? "▦" : f.name.endsWith(".sketch") ? "⬢" : f.name.endsWith(".jpg") ? "▭" : f.name.endsWith(".woff2") ? "Aa" : "▶"}
                      </span>
                      <span className="flex-1 truncate font-[450]">{f.name}</span>
                      <span className="hidden sm:inline w-20 text-right font-mono text-xs text-text-faint">{f.size}</span>
                      <span className="hidden sm:inline w-32 text-right font-mono text-xs text-text-faint">{f.dims}</span>
                      <span className="hidden sm:inline w-20 text-right text-xs text-text-muted">{f.updated}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* footer bar */}
            <div className="flex items-center justify-between border-t border-border bg-[#fafaf9] px-3 py-2">
              <span className="font-mono text-xs text-text-faint">{FILES.length} items · sorted by Name</span>
              <span className="hidden sm:inline font-mono text-xs text-text-faint">Press Tab to traverse toolbar → rows</span>
            </div>
          </div>
        </div>
      </div>

      {/* explain — two cards */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-sm font-semibold">The bug — clipped</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            A parent with <code className="rounded bg-surface-alt px-1 font-mono text-xs">overflow: hidden</code> crops the{" "}
            <code className="font-mono text-xs">box-shadow</code> halo. You’ll see the left/top of the ring and a
            chopped right/bottom. Same for tight flex rows with no gap.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-amber-200 bg-amber-50 p-3 font-mono text-xs leading-relaxed text-amber-900">
            {`.toolbar { overflow: hidden; } /* clips */
.btn:focus-visible {
  box-shadow: 0 0 0 4px rgba(10,132,255,.22);
  /* bottom 2px hidden */
}`}
          </pre>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <h3 className="text-sm font-semibold text-emerald-900">The fix — breathing room</h3>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800">
            Give the scroll container padding, pull it back with negative margin, and allow overflow to show. No control
            changes — just space.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-emerald-200 bg-white p-3 font-mono text-xs leading-relaxed text-emerald-900">
            {`.toolbar, .grid {
  padding: 6px;
  margin: -6px;
  overflow: visible; /* or clip with padding */
}
.btn:focus-visible{
  box-shadow: 0 0 0 1px #0a84ff,
              0 0 0 4px rgba(10,132,255,.22);
}`}
          </pre>
          <p className="mt-2 font-mono text-xs text-emerald-700">AppKit docs say the same: leave space in layout.</p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <h3 className="text-sm font-semibold">What you gain here</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            A toolbar that stays dense but never hides where you are. Keyboard users can blaze Tab → Tab → Space without
            guessing; mouse users see no change. Clip-fix is free accessibility — one rule, every toolbar.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-6 w-6 rounded-md border border-[#0a84ff] shadow-[0_0_0_4px_rgba(10,132,255,0.18)] bg-white" />
            <span className="font-mono text-xs text-text-muted">Full halo · 3:1 contrast · rounded-lg</span>
          </div>
          <div className="mt-3 rounded-lg bg-[#1c1917] p-3">
            <p className="font-mono text-[11px] font-semibold tracking-widest text-white/60">TRY IT</p>
            <p className="mt-1 text-sm leading-relaxed text-white/85">Focus the card above, Tab to “Filter” then “Sort” — toggle Clipped ↔ Fixed and watch the bottom edge appear.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between font-mono text-xs">
        <Link href="/scenarios/system-settings" className="text-text-muted hover:text-foreground">
          ← 02 Settings
        </Link>
        <Link href="/" className="font-semibold text-[#0a84ff] hover:text-[#0066cc]">
          Back to hub →
        </Link>
      </div>
    </main>
  );
}
