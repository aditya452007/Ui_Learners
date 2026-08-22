"use client";

import { useState } from "react";
import Link from "next/link";
import { ContextMenu, useContextMenu, type MenuItem } from "@/components/context-menu";
import { ScenarioNav } from "@/components/scenario-nav";

type Shape = {
  id: string;
  type: "rect" | "circle" | "text";
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label?: string;
};

const INITIAL: Shape[] = [
  { id: "s1", type: "rect", x: 48, y: 56, w: 140, h: 96, color: "#6366f1" },
  { id: "s2", type: "circle", x: 228, y: 82, w: 110, h: 110, color: "#f59e0b" },
  { id: "s3", type: "text", x: 360, y: 60, w: 148, h: 40, color: "#1c1917", label: "Hello, team" },
  { id: "s4", type: "rect", x: 82, y: 192, w: 168, h: 84, color: "#10b981" },
  { id: "s5", type: "circle", x: 296, y: 198, w: 86, h: 86, color: "#ec4899" },
];

function ShapeIcon({ type }: { type: Shape["type"] }) {
  if (type === "circle") return <span className="grid size-3.5 place-items-center rounded-full border border-current" />;
  if (type === "text")
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.2}>
        <path d="M3 4h10M8 4v8M5 12h6" />
      </svg>
    );
  return <span className="h-3.5 w-3.5 rounded-sm border border-current" />;
}

export default function CanvasBoardPage() {
  const [shapes, setShapes] = useState<Shape[]>(INITIAL);
  const [selected, setSelected] = useState<string | null>("s1");
  const [targetId, setTargetId] = useState<string | null>(null);
  const [bgMenu, setBgMenu] = useState(false);
  const { pos, open, handleContextMenu, close } = useContextMenu();
  const [toast, setToast] = useState<string | null>(null);
  const [order, setOrder] = useState<string[]>(INITIAL.map((s) => s.id));

  function show(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1700);
  }

  function bringToFront(id: string) {
    setOrder((o) => [...o.filter((x) => x !== id), id]);
  }
  function sendToBack(id: string) {
    setOrder((o) => [id, ...o.filter((x) => x !== id)]);
  }

  function handleCanvasContext(e: React.MouseEvent) {
    const hit = (e.target as HTMLElement).closest("[data-shape]");
    if (hit) {
      const id = hit.getAttribute("data-shape")!;
      setTargetId(id);
      setSelected(id);
      setBgMenu(false);
    } else {
      setTargetId(null);
      setBgMenu(true);
    }
    handleContextMenu(e);
  }

  function shapeMenu(): MenuItem[] {
    const s = shapes.find((x) => x.id === targetId);
    if (!s) return [];
    return [
      { label: "Copy", keyEq: "⌘C", icon: <CopyIcon /> },
      { label: "Duplicate", keyEq: "⌘D", icon: <DupIcon /> },
      { label: "Cut", keyEq: "⌘X" },
      { type: "separator" },
      {
        label: "Arrange",
        submenu: [
          { label: "Bring to Front", keyEq: "⇧⌘]" },
          { label: "Bring Forward", keyEq: "⌘]" },
          { label: "Send Backward", keyEq: "⌘[" },
          { label: "Send to Back", keyEq: "⇧⌘[" },
        ],
      },
      { label: "Group", keyEq: "⌘G", icon: <GroupIcon /> },
      { label: "Lock", keyEq: "⌘L" },
      { type: "separator" },
      { label: "Copy as PNG" },
      { label: "Copy link to selection" },
      { type: "separator" },
      { label: "Delete", keyEq: "⌫", danger: true },
    ];
  }

  function bgMenuItems(): MenuItem[] {
    return [
      { label: "Paste", keyEq: "⌘V", disabled: true },
      { label: "Paste Here", disabled: false },
      { type: "separator" },
      { label: "Select All", keyEq: "⌘A" },
      { label: "Deselect" },
      { type: "separator" },
      { label: "Show Grid", keyEq: "⌘'" },
      { label: "Set Background…", submenu: [{ label: "White" }, { label: "Warm" }, { label: "Grid" }, { label: "Dots" }] },
      { type: "separator" },
      { label: "Board Settings…" },
    ];
  }

  function onAction(label: string) {
    close();
    if (label === "Bring to Front" && targetId) bringToFront(targetId);
    else if (label === "Send to Back" && targetId) sendToBack(targetId);
    else if (label === "Duplicate" && targetId) {
      const s = shapes.find((x) => x.id === targetId);
      if (s) {
        const id = "s" + Date.now();
        setShapes((prev) => [...prev, { ...s, id, x: s.x + 18, y: s.y + 18 }]);
        setOrder((o) => [...o, id]);
        setSelected(id);
        show("Duplicated");
        return;
      }
    } else if (label === "Delete" && targetId) {
      setShapes((p) => p.filter((x) => x.id !== targetId));
      setOrder((o) => o.filter((x) => x !== targetId));
      setSelected(null);
      show("Deleted");
      return;
    }
    show(label);
  }

  const items = bgMenu ? bgMenuItems() : shapeMenu();

  return (
    <main className="min-h-screen bg-background">
      <ScenarioNav current="/scenarios/canvas-board" />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">Scenario 02 — Canvas</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Board & Layers</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted">
              Right-click a shape vs. the empty board — two completely different menus. The menu is built from the object under the pointer, with
              Arrange as a nested submenu and destructive Delete at the bottom.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-border bg-white px-3 py-1 font-mono text-xs">
              {shapes.length} objects · {selected ? "1 selected" : "no selection"}
            </span>
            <button
              onClick={() => {
                setShapes(INITIAL);
                setOrder(INITIAL.map((s) => s.id));
                setSelected("s1");
              }}
              className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold hover:bg-surface-alt"
            >
              Reset board
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-border bg-surface-alt/60 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-red-400" />
              <span className="size-3 rounded-full bg-amber-400" />
              <span className="size-3 rounded-full bg-emerald-400" />
              <span className="ml-2 font-mono text-xs font-semibold">Untitled board</span>
              <span className="hidden font-mono text-xs text-text-muted sm:inline">· Figma-like · right-click a shape or the background</span>
            </div>
            <div className="hidden items-center gap-1 sm:flex">
              <span className="rounded bg-white px-2 py-1 font-mono text-xs border border-border">⌘C Copy</span>
              <span className="rounded bg-white px-2 py-1 font-mono text-xs border border-border">⌘D Duplicate</span>
              <span className="rounded bg-white px-2 py-1 font-mono text-xs border border-border">⌫ Delete</span>
            </div>
          </div>

          <div className="grid md:grid-cols-[200px_1fr]">
            {/* layers */}
            <div className="border-r border-border bg-white p-3">
              <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wide text-text-muted">Layers</p>
              <div className="space-y-1">
                {[...order].reverse().map((id) => {
                  const s = shapes.find((x) => x.id === id)!;
                  if (!s) return null;
                  const isSel = selected === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelected(id)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setTargetId(id);
                        setSelected(id);
                        setBgMenu(false);
                        handleContextMenu(e);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left ${isSel ? "border-accent bg-accent-light text-accent" : "border-transparent hover:bg-surface-alt"}`}
                    >
                      <span className={`${isSel ? "text-accent" : "text-zinc-400"}`}>
                        <ShapeIcon type={s.type} />
                      </span>
                      <span className={`flex-1 truncate text-xs font-medium ${isSel ? "text-accent" : "text-foreground"}`}>
                        {s.label ?? (s.type === "rect" ? "Rectangle" : s.type === "circle" ? "Ellipse" : "Text")}
                      </span>
                      <span className="font-mono text-[11px] text-text-faint">{s.id}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 font-mono text-xs text-text-faint">Right-click a layer for the same menu.</p>
            </div>

            {/* canvas */}
            <div
              className="relative h-[420px] overflow-hidden bg-[#fcfcf9]"
              onContextMenu={handleCanvasContext}
              onClick={() => setSelected(null)}
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e7e5e4_1px,transparent_1px),linear-gradient(to_bottom,#e7e5e4_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
              <div className="absolute inset-0">
                {order.map((id) => {
                  const s = shapes.find((x) => x.id === id);
                  if (!s) return null;
                  const isSel = selected === s.id;
                  return (
                    <div
                      key={s.id}
                      data-shape={s.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(s.id);
                      }}
                      className={`absolute select-none ${isSel ? "ring-2 ring-accent ring-offset-2" : ""}`}
                      style={{
                        left: s.x,
                        top: s.y,
                        width: s.w,
                        height: s.h,
                        zIndex: order.indexOf(s.id) + 1,
                      }}
                    >
                      {s.type === "rect" && (
                        <div className="h-full w-full rounded-xl border border-black/10 shadow-sm" style={{ background: s.color }} />
                      )}
                      {s.type === "circle" && (
                        <div className="h-full w-full rounded-full border border-black/10 shadow-sm" style={{ background: s.color }} />
                      )}
                      {s.type === "text" && (
                        <div className="flex h-full w-full items-center rounded-xl border border-dashed border-zinc-300 bg-white px-4 shadow-sm">
                          <span className="text-sm font-semibold">{s.label}</span>
                        </div>
                      )}
                      {isSel && (
                        <>
                          <span className="absolute -left-1 -top-1 size-2 rounded-full border border-white bg-accent shadow" />
                          <span className="absolute -right-1 -top-1 size-2 rounded-full border border-white bg-accent shadow" />
                          <span className="absolute -left-1 -bottom-1 size-2 rounded-full border border-white bg-accent shadow" />
                          <span className="absolute -right-1 -bottom-1 size-2 rounded-full border border-white bg-accent shadow" />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-border bg-white/90 px-3 py-1.5 font-mono text-xs text-text-muted shadow-sm backdrop-blur">
                Right-click a shape → shape menu · Right-click empty → board menu
              </div>
            </div>
          </div>
        </div>

        <ContextMenu items={items} pos={pos} open={open} onClose={close} onAction={onAction} />
        {toast && <div className="animate-menu-in fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white shadow-lg">✓ {toast}</div>}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold">Why it fits here</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              A canvas has no toolbar entry for “bring this exact shape forward.” The context menu lets the gesture target the layer directly — no
              need to find it in the layers list first. Background vs. object menus keep destructive and structural actions separated.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold">What the user gains</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Speed: duplicate, delete, and layer order without moving to a panel. Clarity: Arrange is a submenu so the top level stays short.
              Safety: Delete is last, red, and has keyEquivalent ⌫ — hard to hit by accident, easy to learn.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold">Builder notes</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Branch on hit-test: if an element is under the pointer, build the shape menu; else the board menu. Submenus are just
              <code className="mx-1 rounded bg-surface-alt px-1 py-0.5 font-mono text-xs">NSMenuItem.submenu</code> arrays. Keep the menu mounted
              near the cursor and flip if it would overflow the viewport — measure with getBoundingClientRect before committing x/y.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/scenarios/file-browser" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-surface-alt">
            ← Files
          </Link>
          <Link href="/scenarios/data-table" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Next: Data Table →
          </Link>
        </div>
      </div>
    </main>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.2}>
      <rect x={3.5} y={2.5} width={7} height={9} rx={1} />
      <rect x={5.5} y={5} width={7} height={9} rx={1} />
    </svg>
  );
}
function DupIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.2}>
      <rect x={2.5} y={4} width={6.5} height={7} rx={1} />
      <rect x={7} y={2} width={6.5} height={7} rx={1} />
    </svg>
  );
}
function GroupIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.2}>
      <rect x={2} y={3} width={5} height={5} rx={1} />
      <rect x={9} y={3} width={5} height={5} rx={1} />
      <rect x={2} y={9} width={5} height={5} rx={1} />
      <rect x={9} y={9} width={5} height={5} rx={1} />
    </svg>
  );
}
