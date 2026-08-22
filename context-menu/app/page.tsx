"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Anatomy data
const PARTS = [
  {
    n: 1,
    name: "Selection highlight",
    token: "NSMenuItem — selection",
    see: "The soft indigo bar that follows your pointer. It tells you exactly which option will fire if you release — no second-guessing.",
    how: "When the pointer enters a menu item, React sets highlightedIndex (a value the component remembers) to that row. The row re-renders with bg-accent and white text. Keyboard arrows do the same — ArrowDown increments the index, wrapping at the ends. Screen readers hear aria-selected via role=\"menuitem\". Analogous to running your finger along a restaurant menu.",
  },
  {
    n: 2,
    name: "Separator item",
    token: "NSMenuItem.separator()",
    see: "The hairline between groups — Open/Get Info above, editing actions in the middle, destructive action below. It turns a flat list into scannable chunks.",
    how: "Not a disabled row — a semantic separator: role=\"separator\" and aria-hidden. In code it's { type: 'separator' } in the items array, rendered as a 1px div with margin. Skipped by keyboard navigation so ArrowDown jumps over it. Like a divider in a toolbox drawer.",
  },
  {
    n: 3,
    name: "Key equivalent",
    token: "NSMenuItem.keyEquivalent → ⌘C",
    see: "The faint shortcut on the right edge. It teaches the faster way while you use the slower way — next time you skip the menu and press the keys.",
    how: "Just text rendered at the trailing edge with ml-auto. The string (⌘C, ⇧⌘D, ⌘⌫) is data on the item, not a separate element. The handler checks e.metaKey/e.shiftKey so the same function runs from menu or keyboard. It's a label, not a button — it never receives focus itself.",
  },
  {
    n: 4,
    name: "Submenu indicator",
    token: "NSMenuItem.submenu — chevron ▸",
    see: "The tiny chevron that says “more inside.” Hover and a second menu blooms to the side — Share → Messages, Mail, AirDrop — without leaving the context.",
    how: "When an item has submenu: true, we render a chevron and on hover (or ArrowRight) open a sibling <div role=\"menu\"> beside the parent. It's a second menu positioned with left:100%. Pointer stays inside the parent item's hit-area so the submenu doesn't flicker. Think of a drawer that slides out only when you linger.",
  },
] as const;

type MenuItem =
  | { type: "separator" }
  | { label: string; keyEq?: string; danger?: boolean; submenu?: boolean; disabled?: boolean };

const ANATOMY_ITEMS: MenuItem[] = [
  { label: "Open", keyEq: "⌘O" },
  { label: "Get Info", keyEq: "⌘I" },
  { type: "separator" },
  { label: "Copy", keyEq: "⌘C" },
  { label: "Duplicate", keyEq: "⇧⌘D" },
  { type: "separator" },
  { label: "Share", submenu: true },
  { label: "Move to Trash", keyEq: "⌘⌫", danger: true },
];

const SUBMENU_ITEMS: MenuItem[] = [
  { label: "Messages" },
  { label: "Mail" },
  { label: "AirDrop" },
  { type: "separator" },
  { label: "Copy Link", keyEq: "⌥⌘C" },
];

function Icons({ name }: { name: string }) {
  const common = "h-3.5 w-3.5 shrink-0";
  if (name === "Open")
    return (
      <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth={1.2}>
        <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h3.2l1.1 1.3H12.5A1.5 1.5 0 0 1 14 6.8v4.7A1.5 1.5 0 0 1 12.5 13H3.5A1.5 1.5 0 0 1 2 11.5v-6Z" />
      </svg>
    );
  if (name === "Get Info")
    return (
      <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth={1.2}>
        <circle cx={8} cy={8} r={5.5} />
        <path d="M8 7.2v3.2M8 5.4h.01" strokeLinecap="round" />
      </svg>
    );
  if (name === "Copy")
    return (
      <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth={1.2}>
        <rect x={3.5} y={2.5} width={7} height={9} rx={1} />
        <path d="M6 2.5V3.8A1.2 1.2 0 0 0 7.2 5h2.3" />
        <rect x={5.5} y={5} width={7} height={9} rx={1} fill="white" strokeWidth={1.1} />
      </svg>
    );
  if (name === "Duplicate")
    return (
      <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth={1.2}>
        <rect x={2.5} y={4} width={6.5} height={7} rx={1} />
        <rect x={7} y={2} width={6.5} height={7} rx={1} />
      </svg>
    );
  if (name === "Share")
    return (
      <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth={1.2}>
        <circle cx={5} cy={8} r={2} />
        <circle cx={11.5} cy={3.2} r={2} />
        <circle cx={11.5} cy={12.8} r={2} />
        <path d="M6.8 7 9.7 4.2M6.8 9 9.7 11.8" />
      </svg>
    );
  if (name === "Move to Trash")
    return (
      <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth={1.2}>
        <path d="M3 4.2h10M6 4.2V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.2" />
        <path d="M4.2 4.2 4 11.5a1.5 1.5 0 0 0 1.5 1.5h4.9A1.5 1.5 0 0 0 12 11.5L11.8 4.2" />
      </svg>
    );
  return null;
}

export default function Home() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [highlighted, setHighlighted] = useState<number>(3); // Copy
  const [submenuOpen, setSubmenuOpen] = useState(true);
  const [activePill, setActivePill] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // default position centered after mount
  useEffect(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setPos({ x: rect.width / 2 - 120, y: 84 });
  }, []);

  // close on outside click / esc
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!menuRef.current || !canvasRef.current) return;
      if (menuRef.current.contains(e.target as Node)) return;
      // if click inside canvas but outside menu, reposition
      if (canvasRef.current.contains(e.target as Node) && (e.target as HTMLElement).closest("[data-canvas]")) {
        return;
      }
      // setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // sync pill -> highlight
  useEffect(() => {
    if (activePill === 1) setHighlighted(3);
    if (activePill === 3) setHighlighted(3);
    if (activePill === 4) {
      setHighlighted(6);
      setSubmenuOpen(true);
    }
  }, [activePill]);

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    // clamp to stay inside canvas (menu ~240w, ~260h)
    x = Math.min(Math.max(8, x), rect.width - 248);
    y = Math.min(Math.max(8, y), rect.height - 276);
    setPos({ x, y });
    setMenuOpen(true);
    setHighlighted(3);
  }

  function handleAction(label: string) {
    setToast(label);
    setTimeout(() => setToast(null), 1700);
    setMenuOpen(false);
    setTimeout(() => setMenuOpen(true), 300);
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-lg bg-foreground text-xs font-bold text-white">⌘</span>
            <span className="text-sm font-semibold tracking-tight">NameThatUi</span>
            <span className="hidden sm:inline text-sm text-text-faint">/ Context Menu</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline font-mono text-xs text-text-muted">macOS · NSMenu</span>
            <span className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-xs">View.contextMenu</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <header className="pt-10 pb-8 sm:pt-14">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            macOS · Web approximation
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Context Menu</h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-text-muted">
            The menu that appears exactly where you right-clicked — actions for <em className="font-medium not-italic text-foreground">that</em> thing, not
            for the page. A secondary click, not a button.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            Also called:{" "}
            <span className="font-medium text-foreground">contextual menu · right-click menu · shortcut menu</span>
            <span className="text-text-faint"> · “copy / rename / delete menu under the mouse”</span>
          </p>

          {/* API chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              "NSMenu",
              "NSMenuItem",
              "NSView.menu",
              "NSMenuItem.separator()",
              "keyEquivalent",
              "submenu ▸",
            ].map((c) => (
              <span key={c} className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-foreground">
                {c}
              </span>
            ))}
          </div>
        </header>

        {/* Intro strip */}
        <section className="mb-10 grid gap-3 sm:grid-cols-3">
          {[
            {
              k: "01 — Secondary click",
              t: "You right-click the object",
              d: "Control-click, two-finger tap, or right button — directly on the thing you mean. No visible button needed.",
            },
            {
              k: "02 — Appears at the pointer",
              t: "Menu blooms beside the cursor",
              d: "It floats at the click point, not anchored to a toolbar. A light surface with blur, just above the content.",
            },
            {
              k: "03 — Acts on that object only",
              t: "Actions for this selection",
              d: "Copy here means copy this file. Unlike a dropdown that always does the same thing, context is the point.",
            },
          ].map((c) => (
            <div key={c.k} className="rounded-2xl border border-border bg-surface p-5">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">{c.k}</p>
              <h3 className="mt-2 text-sm font-semibold">{c.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{c.d}</p>
            </div>
          ))}
        </section>

        {/* Anatomy */}
        <section className="mb-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted">Anatomy — every part, named</h2>
            <p className="text-sm text-text-muted">Right-click anywhere in the canvas to move the menu · Esc to dismiss</p>
          </div>

          <div
            ref={canvasRef}
            onContextMenu={handleContextMenu}
            data-canvas
            className="relative mt-4 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm"
            style={{ minHeight: 520 }}
          >
            {/* canvas background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(#e7e5e4_1px,transparent_1px)] [background-size:14px_14px] opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-alt/50" />
            </div>

            {/* target objects in canvas - the thing you right-clicked */}
            <div className="relative flex h-full min-h-[520px] items-center justify-center p-8">
              {/* hint file card behind menu */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-5 py-4 shadow-sm">
                  <div className="grid size-10 place-items-center rounded-xl bg-red-50 text-red-600">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h5.2L17 5.3V19.5A1.5 1.5 0 0 1 15.5 21H8.5A1.5 1.5 0 0 1 7 19.5v-16Z" />
                      <path d="M13.7 2v3.3A1.2 1.2 0 0 0 14.9 6.5H18" />
                      <path d="M9.5 12h5M9.5 15h3.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold leading-none">Quarterly-Report.pdf</p>
                    <p className="mt-1 font-mono text-xs text-text-muted">4.2 MB · Modified today</p>
                  </div>
                  <span className="ml-2 rounded-full bg-stone-900 px-2 py-0.5 font-mono text-xs font-medium text-white">PDF</span>
                </div>
                <p className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
                  <span className="inline-flex size-4 items-center justify-center rounded bg-foreground text-[10px] text-white">⌃</span>
                  right-click / Control-click here
                  <span className="hidden sm:inline"> — the menu belongs to this file</span>
                </p>
                {/* keyboard hint */}
                <div className="mt-2 flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 shadow-sm">
                  <span className="font-mono text-xs text-text-muted">Try:</span>
                  <kbd className="rounded border border-border bg-surface-alt px-1.5 py-0.5 font-mono text-xs">⌘C</kbd>
                  <kbd className="rounded border border-border bg-surface-alt px-1.5 py-0.5 font-mono text-xs">↑↓</kbd>
                  <kbd className="rounded border border-border bg-surface-alt px-1.5 py-0.5 font-mono text-xs">Esc</kbd>
                </div>
              </div>
            </div>

            {/* the context menu itself */}
            {menuOpen && pos && (
              <div
                ref={menuRef}
                role="menu"
                aria-label="File actions"
                className="animate-menu-in absolute z-10 w-60 overflow-hidden rounded-xl border border-zinc-200 bg-white/95 shadow-[0_12px_40px_rgba(0,0,0,0.16),0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur-xl"
                style={{ left: pos.x, top: pos.y }}
                onMouseLeave={() => {
                  setHighlighted(3);
                  setSubmenuOpen(true);
                }}
              >
                <div className="p-1.5">
                  {ANATOMY_ITEMS.map((item, idx) => {
                    if ("type" in item && item.type === "separator") {
                      const isTarget = activePill === 2;
                      return (
                        <div
                          key={idx}
                          role="separator"
                          className={`mx-1.5 my-1 h-px ${isTarget ? "bg-accent" : "bg-zinc-200"}`}
                          style={{
                            boxShadow: isTarget ? "0 0 0 2px #eef2ff" : undefined,
                            borderRadius: 1,
                          }}
                        />
                      );
                    }
                    const it = item as Extract<MenuItem, { label: string }>;
                    const isHighlighted = highlighted === idx;
                    const isPillTarget =
                      (activePill === 1 && isHighlighted) ||
                      (activePill === 3 && it.keyEq) ||
                      (activePill === 4 && it.submenu);
                    return (
                      <div
                        key={it.label}
                        role="menuitem"
                        aria-haspopup={it.submenu ? "menu" : undefined}
                        aria-disabled={it.disabled}
                        tabIndex={-1}
                        onMouseEnter={() => {
                          setHighlighted(idx);
                          setSubmenuOpen(!!it.submenu);
                          if (it.submenu) setActivePill(null);
                        }}
                        onClick={() => !it.submenu && handleAction(it.label)}
                        className={`relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                          isHighlighted
                            ? "bg-accent text-white"
                            : it.danger
                              ? "text-danger hover:bg-red-50"
                              : "text-foreground hover:bg-zinc-100"
                        } ${isPillTarget ? "ring-2 ring-accent ring-offset-1" : ""}`}
                        style={{
                          background: isHighlighted ? "#4f46e5" : undefined,
                        }}
                      >
                        <span className={`shrink-0 ${isHighlighted ? "text-white" : "text-zinc-500"}`}>
                          <Icons name={it.label} />
                        </span>
                        <span className={`flex-1 text-[13px] font-medium leading-none ${isHighlighted ? "text-white" : ""}`}>
                          {it.label}
                        </span>
                        {it.keyEq && (
                          <span
                            className={`ml-auto font-mono text-xs tracking-wide ${isHighlighted ? "text-white/80" : "text-zinc-400"}`}
                          >
                            {it.keyEq}
                          </span>
                        )}
                        {it.submenu && (
                          <svg
                            viewBox="0 0 16 16"
                            className={`h-3 w-3 shrink-0 ${isHighlighted ? "text-white/80" : "text-zinc-400"}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.7}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M6 3.2 10 8 6 12.8" />
                          </svg>
                        )}
                        {/* submenu */}
                        {it.submenu && submenuOpen && isHighlighted && (
                          <div
                            role="menu"
                            className="animate-submenu-in absolute left-full top-0 ml-1.5 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white/95 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.16),0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-xl"
                          >
                            {SUBMENU_ITEMS.map((s, si) => {
                              if ("type" in s && s.type === "separator")
                                return <div key={si} role="separator" className="mx-1.5 my-1 h-px bg-zinc-200" />;
                              const ss = s as Extract<MenuItem, { label: string }>;
                              return (
                                <div
                                  key={ss.label}
                                  role="menuitem"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(ss.label);
                                  }}
                                  className="flex items-center rounded-md px-2.5 py-1.5 text-sm hover:bg-zinc-100"
                                >
                                  <span className="text-[13px] font-medium">{ss.label}</span>
                                  {ss.keyEq && <span className="ml-auto font-mono text-xs text-zinc-400">{ss.keyEq}</span>}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* footer hint inside menu */}
                <div className="border-t border-zinc-100 bg-zinc-50 px-3 py-1.5">
                  <p className="font-mono text-xs text-zinc-500">↗ opens in place — no button</p>
                </div>
              </div>
            )}

            {/* callout pills - desktop */}
            <div className="pointer-events-none absolute inset-0 hidden lg:block">
              {/* 1 selection highlight */}
              <div
                className="pointer-events-auto absolute"
                style={{ left: pos ? pos.x - 162 : 80, top: pos ? pos.y + 85 : 180 }}
              >
                <button
                  onMouseEnter={() => setActivePill(1)}
                  onMouseLeave={() => setActivePill(null)}
                  onClick={() => setActivePill(activePill === 1 ? null : 1)}
                  className={`pointer-events-auto flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm backdrop-blur transition-all ${activePill === 1 ? "scale-105 border-accent bg-accent text-white" : "border-border bg-white hover:border-accent/30"}`}
                >
                  <span
                    className={`grid size-5 place-items-center rounded-full text-xs font-bold ${activePill === 1 ? "bg-white text-accent" : "bg-accent text-white"}`}
                  >
                    1
                  </span>
                  <span className={`text-xs font-semibold ${activePill === 1 ? "text-white" : "text-foreground"}`}>Selection highlight</span>
                </button>
                <div className="absolute left-full top-1/2 ml-2 hidden h-px w-8 bg-zinc-300 xl:block" />
                <div className="absolute left-full top-1/2 ml-10 hidden size-1.5 -translate-y-1/2 rounded-full bg-zinc-400 xl:block" />
              </div>

              {/* 2 separator - left */}
              <div className="pointer-events-auto absolute" style={{ left: pos ? pos.x - 148 : 80, top: pos ? pos.y + 118 : 220 }}>
                <button
                  onMouseEnter={() => setActivePill(2)}
                  onMouseLeave={() => setActivePill(null)}
                  onClick={() => setActivePill(activePill === 2 ? null : 2)}
                  className={`pointer-events-auto flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm backdrop-blur transition-all ${activePill === 2 ? "scale-105 border-accent bg-accent text-white" : "border-border bg-white hover:border-accent/30"}`}
                >
                  <span
                    className={`grid size-5 place-items-center rounded-full text-xs font-bold ${activePill === 2 ? "bg-white text-accent" : "bg-accent text-white"}`}
                  >
                    2
                  </span>
                  <span className={`text-xs font-semibold ${activePill === 2 ? "text-white" : "text-foreground"}`}>Separator item</span>
                </button>
              </div>

              {/* 3 key equivalent - right */}
              <div className="pointer-events-auto absolute" style={{ left: pos ? pos.x + 250 : 480, top: pos ? pos.y + 82 : 180 }}>
                <div className="absolute right-full top-1/2 mr-2 hidden h-px w-8 bg-zinc-300 xl:block" />
                <div className="absolute right-full top-1/2 mr-10 hidden size-1.5 -translate-y-1/2 rounded-full bg-zinc-400 xl:block" />
                <button
                  onMouseEnter={() => setActivePill(3)}
                  onMouseLeave={() => setActivePill(null)}
                  onClick={() => setActivePill(activePill === 3 ? null : 3)}
                  className={`pointer-events-auto flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm backdrop-blur transition-all ${activePill === 3 ? "scale-105 border-accent bg-accent text-white" : "border-border bg-white hover:border-accent/30"}`}
                >
                  <span
                    className={`grid size-5 place-items-center rounded-full text-xs font-bold ${activePill === 3 ? "bg-white text-accent" : "bg-accent text-white"}`}
                  >
                    3
                  </span>
                  <span className={`text-xs font-semibold ${activePill === 3 ? "text-white" : "text-foreground"}`}>Key equivalent</span>
                </button>
              </div>

              {/* 4 submenu indicator - right */}
              <div className="pointer-events-auto absolute" style={{ left: pos ? pos.x + 250 : 480, top: pos ? pos.y + 158 : 250 }}>
                <div className="absolute right-full top-1/2 mr-2 hidden h-px w-8 bg-zinc-300 xl:block" />
                <div className="absolute right-full top-1/2 mr-10 hidden size-1.5 -translate-y-1/2 rounded-full bg-zinc-400 xl:block" />
                <button
                  onMouseEnter={() => {
                    setActivePill(4);
                    setHighlighted(6);
                    setSubmenuOpen(true);
                  }}
                  onMouseLeave={() => setActivePill(null)}
                  onClick={() => setActivePill(activePill === 4 ? null : 4)}
                  className={`pointer-events-auto flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm backdrop-blur transition-all ${activePill === 4 ? "scale-105 border-accent bg-accent text-white" : "border-border bg-white hover:border-accent/30"}`}
                >
                  <span
                    className={`grid size-5 place-items-center rounded-full text-xs font-bold ${activePill === 4 ? "bg-white text-accent" : "bg-accent text-white"}`}
                  >
                    4
                  </span>
                  <span className={`text-xs font-semibold ${activePill === 4 ? "text-white" : "text-foreground"}`}>Submenu indicator</span>
                </button>
              </div>
            </div>

            {/* toast feedback */}
            {toast && (
              <div className="animate-menu-in absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-border bg-foreground px-4 py-2 text-sm font-medium text-white shadow-lg">
                ✓ {toast}
              </div>
            )}

            {/* bottom bar controls */}
            <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-white/80 px-4 py-3 backdrop-blur sm:px-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${menuOpen ? "bg-foreground text-white" : "border border-border bg-white text-foreground hover:bg-surface-alt"}`}
                >
                  {menuOpen ? "Menu open" : "Menu closed"}
                </button>
                <span className="hidden font-mono text-xs text-text-muted sm:inline">Hover Share to open submenu</span>
              </div>
              <span className="font-mono text-xs text-text-faint">NSMenu · opened by secondary click at the pointer</span>
            </div>
          </div>

          {/* mobile pills */}
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:hidden">
            {PARTS.map((p) => (
              <button
                key={p.n}
                onClick={() => setActivePill(activePill === p.n ? null : p.n)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${activePill === p.n ? "border-accent bg-accent-light" : "border-border bg-surface"}`}
              >
                <span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${activePill === p.n ? "bg-accent text-white" : "bg-foreground text-white"}`}>
                  {p.n}
                </span>
                <span className="text-sm font-semibold">{p.name}</span>
                <span className="ml-auto font-mono text-xs text-text-muted">{p.token}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Layered explanations */}
        <section className="mb-12">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-text-muted">Every part, in plain language</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {PARTS.map((p) => (
              <div
                key={p.n}
                onMouseEnter={() => setActivePill(p.n)}
                onMouseLeave={() => setActivePill(null)}
                className={`group rounded-2xl border p-6 transition-all ${activePill === p.n ? "border-accent bg-accent-light shadow-sm" : "border-border bg-surface hover:border-border-strong"}`}
              >
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className={`grid size-7 place-items-center rounded-full text-xs font-bold ${activePill === p.n ? "bg-accent text-white" : "bg-foreground text-white"}`}
                  >
                    {p.n}
                  </span>
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
                  <div className="rounded-xl bg-surface-alt p-3 group-hover:bg-white">
                    <p className="font-mono text-xs font-semibold uppercase tracking-wide text-text-muted">How it works</p>
                    <p className="mt-1 text-sm leading-relaxed text-text-muted">{p.how}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Context vs Dropdown comparison */}
        <section className="mb-12">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
            <h3 className="text-sm font-bold">Context menu vs. Dropdown menu — don’t mix them</h3>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">Context menu</p>
                <p className="mt-1 text-sm font-semibold">No visible button · invoked from content</p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">
                  You right-click the PDF, the image, the row — the menu appears <em className="font-medium text-foreground">at the pointer</em> and
                  offers actions for that object. View.contextMenu in SwiftUI. If there’s a button that opens it with a left-click, it isn’t a
                  context menu.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Dropdown menu</p>
                <p className="mt-1 text-sm font-semibold">Visible control · primary click</p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">
                  A chevron button or select that you left-click to choose an option. Always in the same place, always the same options. Use it
                  when the action isn’t about the thing under the cursor.
                </p>
              </div>
            </div>
            <p className="mt-3 font-mono text-xs text-amber-800">Paste-ready: NSMenu on NSView (SwiftUI: View.contextMenu), opened by right-click or Control-click.</p>
          </div>
        </section>

        {/* Keyboard & a11y */}
        <section className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Keyboard</p>
            <h4 className="mt-1 text-sm font-bold">Fully operable without a mouse</h4>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Shift+F10 or the Menu key opens it. Arrows move the highlight (skipping separators), Enter activates, Esc dismisses the whole stack,
              ArrowRight opens a submenu.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Roles</p>
            <h4 className="mt-1 text-sm font-bold">role=“menu” · menuitem · separator</h4>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              The container is role=“menu”, each row role=“menuitem” (or separator). Submenus use aria-haspopup=“menu” and aria-expanded. Focus stays
              on the trigger; the highlight is aria-activedescendant.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Placement</p>
            <h4 className="mt-1 text-sm font-bold">Flips to stay on-screen</h4>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              We clamp x/y to the viewport so the menu never spills off-screen. Submenus flip to the left if there’s no room on the right — like
              macOS does.
            </p>
          </div>
        </section>

        {/* Scenarios */}
        <section className="mb-16">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted">See it in the wild — three real products</h2>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-text-muted">
            Same NSMenu pattern, three different contexts — each menu is generated from the object under the pointer, with different items, submenus,
            and edge cases.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                href: "/scenarios/file-browser",
                k: "Scenario 01",
                title: "Finder File Browser",
                desc: "Grid & list of files. Right-click a PDF, an image, or a folder — each shows the right actions, disabled states, and Tag/Share submenus.",
                pills: ["NSMenuItem.separator()", "submenu ▸", "keyEquivalent"],
              },
              {
                href: "/scenarios/canvas-board",
                k: "Scenario 02",
                title: "Canvas Board",
                desc: "Figma-like board. Right-click a shape vs. empty canvas gives a completely different menu — layers, grouping, and Arrange submenus.",
                pills: ["NSView.menu", "context-sensitivity", "placement"],
              },
              {
                href: "/scenarios/data-table",
                k: "Scenario 03",
                title: "Data Table",
                desc: "Sheets-like table. Row-level actions, bulk selection menu, nested Export submenus, destructive deletes with ⌘⌫, and long-press on touch.",
                pills: ["disabled items", "destructive", "keyboard"],
              },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all hover:border-accent/30 hover:shadow-md"
              >
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">{s.k}</p>
                <h3 className="mt-2 text-base font-bold group-hover:text-accent">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{s.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.pills.map((pill) => (
                    <span key={pill} className="rounded-full bg-surface-alt px-2.5 py-1 font-mono text-xs text-text-muted">
                      {pill}
                    </span>
                  ))}
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  Open scenario
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M6 3 10 8 6 13" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <footer className="border-t border-border py-8">
          <p className="text-center font-mono text-xs text-text-faint">
            Built as a web approximation of AppKit NSMenu / SwiftUI View.contextMenu · Right-click is secondary click · Ctrl+click is the keyboard equivalent
          </p>
        </footer>
      </div>
    </main>
  );
}
