"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ScenarioNav, WhyFits } from "../../ScenarioNav";

type Widget = {
  id: string;
  title: string;
  kind: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

const CANVAS_W = 760;
const CANVAS_H = 460;

const INITIAL: Widget[] = [
  { id: "w1", title: "Revenue", kind: "bars", x: 24, y: 24, w: 300, h: 190 },
  { id: "w2", title: "Tasks", kind: "list", x: 344, y: 24, w: 260, h: 190 },
  { id: "w3", title: "Notes", kind: "note", x: 24, y: 234, w: 340, h: 190 },
  { id: "w4", title: "Activity", kind: "feed", x: 384, y: 234, w: 220, h: 190 },
];

const BARS = [42, 68, 55, 80, 62, 90, 74];

function WidgetBody({ kind }: { kind: string }) {
  if (kind === "bars")
    return (
      <div className="flex h-full items-end gap-1.5 px-1 pb-1 pt-3" aria-hidden="true">
        {BARS.map((b, i) => (
          <span
            key={i}
            className="flex-1 rounded-sm bg-blue-600/80"
            style={{ height: `${b}%`, opacity: 0.45 + (i / BARS.length) * 0.55 }}
          />
        ))}
      </div>
    );
  if (kind === "list")
    return (
      <ul className="flex flex-col gap-1.5 px-1 pt-2 text-[12px] text-stone-600">
        {["Review pricing page", "Book 3 interviews", "Write launch notes"].map((t) => (
          <li
            key={t}
            className="flex items-center gap-2 rounded-lg bg-stone-50 px-2.5 py-1.5 ring-1 ring-stone-100"
          >
            <span className="size-3.5 rounded-full border-2 border-stone-300" aria-hidden="true" />
            <span className="truncate">{t}</span>
          </li>
        ))}
      </ul>
    );
  if (kind === "note")
    return (
      <p className="px-1 pt-2 text-[12.5px] leading-relaxed text-stone-500">
        Drag me by the header — anywhere else just selects. Pull a blue square
        to reshape. Arrow keys nudge the selected widget.
      </p>
    );
  return (
    <ul className="flex flex-col gap-1 px-1 pt-2 font-mono text-[11px] text-stone-500">
      {["09:12 deploy ok", "09:40 +3 trials", "10:05 review posted"].map((t) => (
        <li key={t} className="rounded-md bg-stone-50 px-2 py-1 ring-1 ring-stone-100">
          {t}
        </li>
      ))}
    </ul>
  );
}

export default function CanvasPage() {
  const [widgets, setWidgets] = useState<Widget[]>(INITIAL);
  const [selectedId, setSelectedId] = useState<string>("w1");
  const [snap, setSnap] = useState(true);
  const [live, setLive] = useState(
    "Canvas loaded with 4 widgets. Drag a widget by its header bar; click one to reveal its eight resize squares."
  );
  const dragRef = useRef<{
    id: string;
    dx: number;
    dy: number;
    moved: boolean;
  } | null>(null);

  const selected = widgets.find((w) => w.id === selectedId) ?? widgets[0];
  const snapV = (v: number) => (snap ? Math.round(v / 8) * 8 : Math.round(v));

  const patch = (id: string, p: Partial<Widget>) =>
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, ...p } : w)));

  const onHeaderDown = (e: React.PointerEvent, w: Widget) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setSelectedId(w.id);
    dragRef.current = { id: w.id, dx: e.clientX - w.x, dy: e.clientY - w.y, moved: false };
    const onMove = (ev: PointerEvent) => {
      const d = dragRef.current;
      if (!d || d.id !== w.id) return;
      d.moved = true;
      patch(w.id, {
        x: Math.max(0, Math.min(CANVAS_W - w.w, snapV(ev.clientX - d.dx))),
        y: Math.max(0, Math.min(CANVAS_H - w.h, snapV(ev.clientY - d.dy))),
      });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      const d = dragRef.current;
      dragRef.current = null;
      if (d?.moved) {
        const cur = widgets.find((x) => x.id === w.id);
        setLive(
          `${w.title} moved${cur ? ` to ${Math.round(cur.x)}, ${Math.round(cur.y)}` : ""} (pointer drag on canvas).`
        );
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  };

  const onResizeDown = (
    e: React.PointerEvent,
    w: Widget,
    dir: { x: -1 | 0 | 1; y: -1 | 0 | 1 }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setSelectedId(w.id);
    const sx = e.clientX;
    const sy = e.clientY;
    const base = { ...w };
    const onMove = (ev: PointerEvent) => {
      let nw = base.w;
      let nh = base.h;
      let nx = base.x;
      let ny = base.y;
      if (dir.x === 1) nw = base.w + (ev.clientX - sx);
      if (dir.x === -1) {
        nw = base.w - (ev.clientX - sx);
        nx = base.x + (ev.clientX - sx);
      }
      if (dir.y === 1) nh = base.h + (ev.clientY - sy);
      if (dir.y === -1) {
        nh = base.h - (ev.clientY - sy);
        ny = base.y + (ev.clientY - sy);
      }
      nw = Math.max(150, Math.min(560, nw));
      nh = Math.max(110, Math.min(380, nh));
      if (dir.x === -1) nx = Math.max(0, Math.min(base.x + base.w - 150, nx));
      if (dir.y === -1) ny = Math.max(0, Math.min(base.y + base.h - 110, ny));
      nx = Math.max(0, Math.min(CANVAS_W - nw, nx));
      ny = Math.max(0, Math.min(CANVAS_H - nh, ny));
      patch(w.id, { x: snapV(nx), y: snapV(ny), w: snapV(nw), h: snapV(nh) });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      setLive(`${w.title} resized with ${dir.x !== 0 && dir.y !== 0 ? "a corner" : "an edge"} handle (pointer events).`);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  };

  const nudgeSelected = (dx: number, dy: number) => {
    if (!selected) return;
    patch(selected.id, {
      x: Math.max(0, Math.min(CANVAS_W - selected.w, selected.x + dx)),
      y: Math.max(0, Math.min(CANVAS_H - selected.h, selected.y + dy)),
    });
  };

  const handles = (
    w: Widget
  ): { id: string; style: React.CSSProperties; dir: { x: -1 | 0 | 1; y: -1 | 0 | 1 }; cursor: string }[] => [
    { id: "nw", style: { left: -7, top: -7 }, dir: { x: -1, y: -1 }, cursor: "nwse-resize" },
    { id: "n", style: { left: "50%", top: -7, marginLeft: -6 }, dir: { x: 0, y: -1 }, cursor: "ns-resize" },
    { id: "ne", style: { right: -7, top: -7 }, dir: { x: 1, y: -1 }, cursor: "nesw-resize" },
    { id: "e", style: { right: -7, top: "50%", marginTop: -6 }, dir: { x: 1, y: 0 }, cursor: "ew-resize" },
    { id: "se", style: { right: -7, bottom: -7 }, dir: { x: 1, y: 1 }, cursor: "nwse-resize" },
    { id: "s", style: { left: "50%", bottom: -7, marginLeft: -6 }, dir: { x: 0, y: 1 }, cursor: "ns-resize" },
    { id: "sw", style: { left: -7, bottom: -7 }, dir: { x: -1, y: 1 }, cursor: "nesw-resize" },
    { id: "w", style: { left: -7, top: "50%", marginTop: -6 }, dir: { x: -1, y: 0 }, cursor: "ew-resize" },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <ScenarioNav current="/scenarios/dashboard-canvas/" />
        <header className="max-w-2xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-blue-700">
            Scenario 3 · free-form pointer drag · eight resize squares
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Morning dashboard builder
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
            No lists, no drop targets — widgets live anywhere on a canvas.
            Dragging uses <strong>pointer events</strong> (not HTML draggable)
            so cards glide pixel-smooth, and the selected widget grows eight
            blue resize squares: corners reshape both axes, edges reshape one.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[13px] text-stone-700">
            <input
              type="checkbox"
              checked={snap}
              onChange={(e) => setSnap(e.target.checked)}
              className="size-4 accent-blue-600"
            />
            Snap to 8px grid
          </label>
          <button
            type="button"
            onClick={() => {
              setWidgets(INITIAL);
              setSelectedId("w1");
              setLive("Canvas reset to the morning layout.");
            }}
            className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[13px] font-medium text-stone-600 hover:border-blue-600/40 hover:text-blue-700"
          >
            Reset layout
          </button>
          <span className="font-mono text-[11px] text-stone-400">
            {selected
              ? `selected ${selected.title} · ${Math.round(selected.x)},${Math.round(selected.y)} · ${Math.round(selected.w)}×${Math.round(selected.h)}`
              : "nothing selected"}
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <section className="overflow-x-auto rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
            <div
              role="application"
              aria-label="Dashboard canvas. Tab to a widget header, use arrow keys to nudge."
              className="relative mx-auto rounded-xl border border-stone-200 bg-[#fafaf9] bg-[linear-gradient(#e7e5e4_1px,transparent_1px),linear-gradient(90deg,#e7e5e4_1px,transparent_1px)] bg-[size:24px_24px]"
              style={{ width: CANVAS_W, height: CANVAS_H, maxWidth: "100%" }}
              onPointerDown={() => setSelectedId("")}
            >
              <div className="absolute inset-0 rounded-xl bg-white/60" aria-hidden="true" />
              {widgets.map((w) => {
                const isSel = w.id === selectedId;
                return (
                  <div
                    key={w.id}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(w.id);
                    }}
                    style={{ left: w.x, top: w.y, width: w.w, height: w.h }}
                    className={`absolute flex flex-col overflow-visible rounded-xl border-2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.07)] transition-shadow ${
                      isSel ? "border-blue-600 shadow-[0_0_0_3px_#2563eb22]" : "border-stone-200"
                    }`}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`Drag ${w.title} by this header. Arrow keys nudge when selected.`}
                      onPointerDown={(e) => onHeaderDown(e, w)}
                      onKeyDown={(e) => {
                        setSelectedId(w.id);
                        const step = e.shiftKey ? 16 : 8;
                        if (e.key === "ArrowLeft") { e.preventDefault(); patch(w.id, { x: Math.max(0, w.x - step) }); }
                        if (e.key === "ArrowRight") { e.preventDefault(); patch(w.id, { x: Math.min(CANVAS_W - w.w, w.x + step) }); }
                        if (e.key === "ArrowUp") { e.preventDefault(); patch(w.id, { y: Math.max(0, w.y - step) }); }
                        if (e.key === "ArrowDown") { e.preventDefault(); patch(w.id, { y: Math.min(CANVAS_H - w.h, w.y + step) }); }
                      }}
                      className={`flex cursor-grab touch-none items-center gap-2 rounded-t-[10px] px-3 py-2 active:cursor-grabbing ${
                        isSel ? "bg-blue-600 text-white" : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      <span aria-hidden="true" className="grid grid-cols-3 gap-[2px] opacity-70">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <span key={i} className="size-[3px] rounded-full bg-current" />
                        ))}
                      </span>
                      <span className="truncate text-[13px] font-semibold">{w.title}</span>
                      <span className={`ml-auto font-mono text-[10px] ${isSel ? "text-blue-100" : "text-stone-400"}`}>
                        grip: header
                      </span>
                    </div>
                    <div className="min-h-0 flex-1 overflow-hidden p-2.5">
                      <WidgetBody kind={w.kind} />
                    </div>
                    {isSel &&
                      handles(w).map((h) => (
                        <span
                          key={h.id}
                          onPointerDown={(e) => onResizeDown(e, w, h.dir)}
                          style={{ ...h.style, cursor: h.cursor }}
                          className="dnd-resize-handle"
                          aria-hidden="true"
                        />
                      ))}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-center font-mono text-[10.5px] text-stone-400">
              {CANVAS_W} × {CANVAS_H} canvas · header = drag handle · squares = resize (pointer events)
            </p>
          </section>

          <aside className="flex flex-col gap-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">Nudge the selection</p>
              <p className="mt-1 text-[12.5px] text-stone-500">
                Keyboard path for the same move — screen readers hear the live
                region below.
              </p>
              <div className="mx-auto mt-3 grid w-fit grid-cols-3 gap-1.5">
                <span />
                <button type="button" onClick={() => nudgeSelected(0, -8)} aria-label="Nudge up" className="grid size-9 place-items-center rounded-lg border border-stone-200 bg-white hover:border-blue-600/40 hover:text-blue-700">↑</button>
                <span />
                <button type="button" onClick={() => nudgeSelected(-8, 0)} aria-label="Nudge left" className="grid size-9 place-items-center rounded-lg border border-stone-200 bg-white hover:border-blue-600/40 hover:text-blue-700">←</button>
                <button type="button" onClick={() => nudgeSelected(0, 8)} aria-label="Nudge down" className="grid size-9 place-items-center rounded-lg border border-stone-200 bg-white hover:border-blue-600/40 hover:text-blue-700">↓</button>
                <button type="button" onClick={() => nudgeSelected(8, 0)} aria-label="Nudge right" className="grid size-9 place-items-center rounded-lg border border-stone-200 bg-white hover:border-blue-600/40 hover:text-blue-700">→</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {widgets.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(w.id);
                      setLive(`${w.title} selected. Drag its header to move, pull a blue square to resize.`);
                    }}
                    className={`rounded-full border px-2.5 py-1 text-[12px] font-medium ${
                      w.id === selectedId
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-white text-stone-600 hover:border-blue-600/40"
                    }`}
                  >
                    {w.title}
                  </button>
                ))}
              </div>
            </div>
            <WhyFits>
              A dashboard is <em>place anywhere, size anything</em> — lists
              cannot express it, so HTML draggable&apos;s slot model is the
              wrong tool. Pointer-event dragging plus eight resize squares gives
              direct manipulation on open space: arrange once, and tomorrow
              morning&apos;s numbers sit exactly where your eyes expect them.
            </WhyFits>
          </aside>
        </div>

        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl bg-stone-900 px-5 py-4 text-[13.5px] leading-relaxed text-stone-100"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone-400">
            Live region — moves and resizes announced
          </span>
          <p className="mt-1">{live}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-[13px]">
          <Link
            href="/scenarios/file-dropzone/"
            className="rounded-full border border-stone-200 bg-white px-3 py-1.5 font-medium text-stone-600 hover:border-blue-600/40 hover:text-blue-700"
          >
            ← File triage
          </Link>
          <Link
            href="/"
            className="rounded-full bg-stone-900 px-3 py-1.5 font-medium text-white hover:bg-stone-700"
          >
            Back to hub →
          </Link>
        </div>
      </div>
    </main>
  );
}
