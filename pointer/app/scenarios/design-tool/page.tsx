"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";

/* ---------- cursor factories (SVG data-URI, one colour each) ---------- */

const makeCursor = (svg: string, x: number, y: number, fallback: string, color: string) => ({
  svg,
  hot: [x, y] as [number, number],
  color,
  css: `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${x} ${y}, ${fallback}`,
});

const cursors = {
  crosshair: makeCursor(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" stroke-width="2.4" stroke-linecap="round"><g stroke="#fff"><path d="M16 4v7M16 21v7M4 16h7M21 16h7"/><circle cx="16" cy="16" r="3"/></g><g stroke="#7c3aed"><path d="M16 4v7M16 21v7M4 16h7M21 16h7"/><circle cx="16" cy="16" r="3"/></g></g></svg>`,
    16, 16, "crosshair", "#7c3aed"
  ),
  grab: makeCursor(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><g stroke="#fff"><path d="M8 15V9.5a2.5 2.5 0 0 1 5 0V15M13 14.5V6.5a2.5 2.5 0 0 1 5 0v7.5M18 14.8V7.2a2.5 2.5 0 0 1 5 0V15M23 15.5v-2.5a2.5 2.5 0 0 1 5 0V19a7 7 0 0 1-7 7h-3.4a7 7 0 0 1-5.3-2.4l-4.2-4.8a2.5 2.5 0 0 1 3.6-3.4L13 16.2"/></g><g stroke="#0ea5e9"><path d="M8 15V9.5a2.5 2.5 0 0 1 5 0V15M13 14.5V6.5a2.5 2.5 0 0 1 5 0v7.5M18 14.8V7.2a2.5 2.5 0 0 1 5 0V15M23 15.5v-2.5a2.5 2.5 0 0 1 5 0V19a7 7 0 0 1-7 7h-3.4a7 7 0 0 1-5.3-2.4l-4.2-4.8a2.5 2.5 0 0 1 3.6-3.4L13 16.2"/></g></g></svg>`,
    16, 12, "grab", "#0ea5e9"
  ),
  grabbing: makeCursor(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="#f59e0b" stroke="#fff" stroke-width="1.6"><rect x="8.2" y="7.5" width="4.6" height="9.5" rx="2.3"/><rect x="13.7" y="5.5" width="4.6" height="10.5" rx="2.3"/><rect x="19.2" y="7" width="4.6" height="9.5" rx="2.3"/><rect x="4.8" y="15.5" width="4.4" height="6" rx="2.2"/><rect x="6.5" y="12.5" width="19" height="12.5" rx="4.5"/></g></svg>`,
    15, 14, "grabbing", "#f59e0b"
  ),
  nwse: makeCursor(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><g stroke="#fff"><path d="M13.5 4.5 4.5 13.5M6 5v7h7"/><path d="M18.5 27.5l9-9M26 27h-7v-7"/></g><g stroke="#10b981"><path d="M13.5 4.5 4.5 13.5M6 5v7h7"/><path d="M18.5 27.5l9-9M26 27h-7v-7"/></g></g></svg>`,
    16, 16, "nwse-resize", "#10b981"
  ),
  copy: makeCursor(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M8 4l1.6 16.8L14.4 16l3.9 8.1 2.3-1.1-3.9-8.1 6.3-4.6z" fill="#f43f5e" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/><g stroke-linecap="round"><g stroke="#fff" stroke-width="4.4"><path d="M22.5 21.5v9M18 26h9"/></g><g stroke="#f43f5e" stroke-width="2.4"><path d="M22.5 21.5v9M18 26h9"/></g></g></svg>`,
    9, 6, "copy", "#f43f5e"
  ),
  move: makeCursor(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><g stroke="#fff"><path d="M16 3.5 11.8 7.7h8.4z"/><path d="M16 28.5l-4.2-4.2h8.4z"/><path d="M3.5 16l4.2-4.2v8.4z"/><path d="M28.5 16l-4.2-4.2v8.4z"/></g><g stroke="#6366f1"><path d="M16 3.5 11.8 7.7h8.4z"/><path d="M16 28.5l-4.2-4.2h8.4z"/><path d="M3.5 16l4.2-4.2v8.4z"/><path d="M28.5 16l-4.2-4.2v8.4z"/></g></g><circle cx="16" cy="16" r="2.4" fill="#6366f1" stroke="#fff" stroke-width="1.6"/></svg>`,
    16, 16, "move", "#6366f1"
  ),
  notAllowed: makeCursor(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="10.5" fill="#fff" stroke="#ef4444" stroke-width="2.6"/><path d="M8.8 8.8l14.4 14.4" stroke="#fff" stroke-width="5.4" stroke-linecap="round"/><path d="M8.8 8.8l14.4 14.4" stroke="#ef4444" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    16, 16, "not-allowed", "#ef4444"
  ),
  zoom: makeCursor(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" stroke-linecap="round"><circle cx="13.5" cy="13.5" r="8.5" fill="#fff" stroke="#64748b" stroke-width="2.2"/><g stroke="#fff" stroke-width="4.6"><path d="M19.9 19.9 27 27"/><path d="M13.5 9.7v7.6M9.7 13.5h7.6"/></g><path d="M19.9 19.9 27 27" stroke="#64748b" stroke-width="2.6"/><g stroke="#64748b" stroke-width="2.2"><path d="M13.5 9.7v7.6M9.7 13.5h7.6"/></g></g></svg>`,
    13.5, 13.5, "zoom-in", "#64748b"
  ),
};

type CursorKey = keyof typeof cursors;

const CURSOR_INFO: Record<CursorKey, { label: string; desc: string }> = {
  crosshair: { label: "Crosshair", desc: "Empty canvas — the draw/pan area" },
  grab: { label: "Grab", desc: "Press the canvas to start panning" },
  grabbing: { label: "Grabbing", desc: "You are panning right now" },
  nwse: { label: "Resize (NWSE)", desc: "Corner handles stretch a shape" },
  copy: { label: "Copy", desc: "Alt-drag duplicates a shape" },
  move: { label: "Move", desc: "Hover a shape, then drag it" },
  notAllowed: { label: "Not allowed", desc: "Frame edge — movement is clamped" },
  zoom: { label: "Zoom", desc: "Scale the canvas from 50% to 200%" },
};

/* ---------- types & data ---------- */

type Kind = "rect" | "circle" | "star";

interface Shape {
  id: number;
  kind: Kind;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  stroke: string;
}

type DragMode = "pan" | "move" | "copy" | "resize";
type HandleId = "nw" | "ne" | "sw" | "se";

interface DragState {
  mode: DragMode;
  startX: number;
  startY: number;
  pan: { x: number; y: number };
  shape?: Shape;
  offsetX?: number;
  offsetY?: number;
  handle?: HandleId;
}

const INITIAL_SHAPES: Shape[] = [
  { id: 1, kind: "rect", x: 150, y: 105, w: 210, h: 130, fill: "#ede9fe", stroke: "#8b5cf6" },
  { id: 2, kind: "circle", x: 460, y: 115, w: 140, h: 140, fill: "#dbeafe", stroke: "#60a5fa" },
  { id: 3, kind: "star", x: 300, y: 240, w: 110, h: 110, fill: "#fce7f3", stroke: "#f472b6" },
];

const LINKS = [
  { href: "/", label: "Hub" },
  { href: "/scenarios/design-tool/", label: "Design tool" },
  { href: "/scenarios/text-editor/", label: "Text editor" },
  { href: "/scenarios/web-builder/", label: "Web builder" },
];

function Nav({ current }: { current: string }) {
  return (
    <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`transition-colors hover:text-[#7c3aed] ${
            l.label === current ? "font-semibold text-[#7c3aed]" : "text-stone-500"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

export default function DesignToolScenario() {
  const [shapes, setShapes] = useState<Shape[]>(INITIAL_SHAPES);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragMode, setDragMode] = useState<DragMode | null>(null);
  const [panMoved, setPanMoved] = useState(false);
  const [clamped, setClamped] = useState(false);
  const [hover, setHover] = useState<"shape" | "handle" | null>(null);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const idRef = useRef(4);

  const nextId = () => idRef.current++;
  const clampNum = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  /* pointer position in world coordinates (pan + zoom undone) */
  const toWorld = (clientX: number, clientY: number) => {
    const r = viewportRef.current!.getBoundingClientRect();
    return {
      x: (clientX - r.left - pan.x) / scale,
      y: (clientY - r.top - pan.y) / scale,
    };
  };

  const updateShape = (id: number, patch: Partial<Shape>) =>
    setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const onViewportDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setSelectedId(null);
    dragRef.current = { mode: "pan", startX: e.clientX, startY: e.clientY, pan: { ...pan } };
    setDragMode("pan");
    setPanMoved(false);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onShapeDown = (e: ReactPointerEvent<HTMLDivElement>, id: number) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const s = shapes.find((sh) => sh.id === id)!;
    const wp = toWorld(e.clientX, e.clientY);
    let target = s;
    if (e.altKey) {
      const copy: Shape = { ...s, id: nextId() };
      setShapes((prev) => [...prev, copy]);
      target = copy;
    }
    setSelectedId(target.id);
    dragRef.current = {
      mode: e.altKey ? "copy" : "move",
      startX: e.clientX,
      startY: e.clientY,
      pan: { ...pan },
      shape: target,
      offsetX: wp.x - target.x,
      offsetY: wp.y - target.y,
    };
    setDragMode(e.altKey ? "copy" : "move");
    setClamped(false);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onHandleDown = (e: ReactPointerEvent<HTMLDivElement>, id: number, handle: HandleId) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const s = shapes.find((sh) => sh.id === id)!;
    dragRef.current = {
      mode: "resize",
      startX: e.clientX,
      startY: e.clientY,
      pan: { ...pan },
      shape: { ...s },
      handle,
    };
    setDragMode("resize");
    setClamped(false);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const r = viewportRef.current!.getBoundingClientRect();
    const vw = r.width;
    const vh = r.height;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    let clampedNow = false;

    if (d.mode === "pan") {
      const range = { x: vw * 0.6, y: vh * 0.6 };
      const nx = clampNum(d.pan.x + dx, -range.x, range.x);
      const ny = clampNum(d.pan.y + dy, -range.y, range.y);
      clampedNow = nx !== d.pan.x + dx || ny !== d.pan.y + dy;
      if (!panMoved && Math.hypot(dx, dy) > 4) setPanMoved(true);
      setPan({ x: nx, y: ny });
    } else if (d.mode === "move" || d.mode === "copy") {
      const wp = toWorld(e.clientX, e.clientY);
      const nx = clampNum(wp.x - d.offsetX!, 0, Math.max(0, vw - d.shape!.w));
      const ny = clampNum(wp.y - d.offsetY!, 0, Math.max(0, vh - d.shape!.h));
      clampedNow = nx !== wp.x - d.offsetX! || ny !== wp.y - d.offsetY!;
      updateShape(d.shape!.id, { x: nx, y: ny });
    } else {
      const o = d.shape!;
      const ddx = dx / scale;
      const ddy = dy / scale;
      let nx = o.x, ny = o.y, nw = o.w, nh = o.h;
      if (d.handle!.includes("e")) nw = Math.max(40, o.w + ddx);
      else {
        nw = Math.max(40, o.w - ddx);
        nx = o.x + o.w - nw;
      }
      if (d.handle!.includes("s")) nh = Math.max(40, o.h + ddy);
      else {
        nh = Math.max(40, o.h - ddy);
        ny = o.y + o.h - nh;
      }
      if (nx < 0) { nw += nx; nx = 0; clampedNow = true; }
      if (ny < 0) { nh += ny; ny = 0; clampedNow = true; }
      if (nx + nw > vw) { nw = vw - nx; clampedNow = true; }
      if (ny + nh > vh) { nh = vh - ny; clampedNow = true; }
      updateShape(o.id, { x: nx, y: ny, w: Math.max(40, nw), h: Math.max(40, nh) });
    }
    setClamped(clampedNow);
  };

  const onUp = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragMode(null);
    setPanMoved(false);
    setClamped(false);
  };

  /* which cursor shape is live right now */
  const getCursorKey = (): CursorKey => {
    if (clamped && dragMode) return "notAllowed";
    if (dragMode === "pan") return panMoved ? "grabbing" : "grab";
    if (dragMode === "copy") return "copy";
    if (dragMode === "resize") return "nwse";
    if (dragMode === "move") return "move";
    if (hover === "handle") return "nwse";
    if (hover === "shape") return "move";
    return "crosshair";
  };
  const cursor = cursors[getCursorKey()];
  const cursorInfo = CURSOR_INFO[getCursorKey()];

  const zoomBy = (d: number) => setScale((s) => clampNum(s + d, 0.5, 2));

  return (
    <main className="min-h-screen bg-[#f6f5f1] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Nav current="Design tool" />

        <header className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c3aed]">
            macOS pattern · NSCursor
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
            The Pointer in Canvas Studio
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-stone-500">
            A macOS pattern (the system <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[13px] text-stone-600">NSCursor</code>)
            approximated on the web with CSS <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[13px] text-stone-600">cursor</code> +
            inline SVG data-URIs. In a design tool the pointer is a living status line: it announces
            what the next click will do before you click.
          </p>
        </header>

        {/* ---- the tool frame ---- */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl shadow-stone-200/50">
          <div className="flex h-11 items-center gap-3 border-b border-stone-200 bg-white px-4">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="h-4 w-px bg-stone-200" />
            <span className="text-[13px] font-semibold text-stone-800">Canvas Studio</span>
            <span className="text-[13px] text-stone-400">— untitled.canvas</span>
            <div className="ml-auto flex items-center gap-1.5">
              <button
                onClick={() => zoomBy(-0.25)}
                aria-label="Zoom out"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-base leading-none text-stone-600 transition hover:border-violet-300 hover:text-[#7c3aed] active:scale-90"
              >
                −
              </button>
              <div
                className="flex h-8 min-w-14 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 px-2 text-xs font-medium tabular-nums text-stone-600"
                style={{ cursor: cursors.zoom.css }}
              >
                {Math.round(scale * 100)}%
              </div>
              <button
                onClick={() => zoomBy(0.25)}
                aria-label="Zoom in"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-base leading-none text-stone-600 transition hover:border-violet-300 hover:text-[#7c3aed] active:scale-90"
              >
                +
              </button>
            </div>
          </div>

          {/* ---- the canvas ---- */}
          <div
            ref={viewportRef}
            onPointerDown={onViewportDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onDragStart={(e) => e.preventDefault()}
            className="relative aspect-[16/9] w-full touch-none select-none overflow-hidden"
            style={{ cursor: cursor.css }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transformOrigin: "0 0",
                backgroundImage: "radial-gradient(circle, #d6d3d1 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              {shapes.map((s) => {
                const selected = s.id === selectedId;
                return (
                  <div
                    key={s.id}
                    onPointerDown={(e) => onShapeDown(e, s.id)}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onUp}
                    onPointerEnter={() => setHover("shape")}
                    onPointerLeave={() => setHover(null)}
                    className="absolute"
                    style={{
                      left: s.x,
                      top: s.y,
                      width: s.w,
                      height: s.h,
                      cursor: cursor.css,
                      boxShadow: selected ? "0 0 0 2px rgba(124,58,237,0.85)" : undefined,
                    }}
                  >
                    {s.kind === "rect" && (
                      <div
                        className="h-full w-full rounded-xl"
                        style={{ background: s.fill, border: `2px solid ${s.stroke}` }}
                      />
                    )}
                    {s.kind === "circle" && (
                      <div
                        className="h-full w-full rounded-full"
                        style={{ background: s.fill, border: `2px solid ${s.stroke}` }}
                      />
                    )}
                    {s.kind === "star" && (
                      <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="h-full w-full"
                      >
                        <polygon
                          points="50,4 61,34 93,34 67,53 77,86 50,67 23,86 33,53 7,34 39,34"
                          fill={s.fill}
                          stroke={s.stroke}
                          strokeWidth={3}
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {selected &&
                      (["nw", "ne", "sw", "se"] as HandleId[]).map((hp) => (
                        <div
                          key={hp}
                          onPointerDown={(e) => onHandleDown(e, s.id, hp)}
                          onPointerMove={onMove}
                          onPointerUp={onUp}
                          onPointerCancel={onUp}
                          onPointerEnter={() => setHover("handle")}
                          onPointerLeave={() => setHover(null)}
                          className="cs-handle"
                          style={{
                            left: hp.includes("w") ? 0 : s.w,
                            top: hp.includes("n") ? 0 : s.h,
                            cursor: cursor.css,
                          }}
                        />
                      ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---- status bar ---- */}
          <div className="flex h-9 items-center justify-between border-t border-stone-200 bg-[#fafaf9] px-4 text-[11px] text-stone-500">
            <span>
              Alt-drag to duplicate · drag corner handles to resize · drag the canvas to pan
            </span>
            <span className="flex items-center gap-1.5 font-medium text-stone-600">
              <span className="h-2 w-2 rounded-full" style={{ background: cursor.color }} />
              {cursorInfo.label}
            </span>
          </div>
        </div>

        {/* ---- cursor legend ---- */}
        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(Object.keys(CURSOR_INFO) as CursorKey[]).map((k) => (
            <div
              key={k}
              className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: cursors[k].color }} />
                <span className="text-xs font-semibold text-stone-700">{CURSOR_INFO[k].label}</span>
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-stone-500">{CURSOR_INFO[k].desc}</p>
            </div>
          ))}
        </section>

        {/* ---- why it fits ---- */}
        <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-400">
            Why the pointer fits here
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-stone-700">
            In a vector design tool the cursor is the only promise of what the next click will do, so
            every mode gets its own shape: a <b>crosshair</b> says “draw here”, an open{" "}
            <b>grab hand</b> says “pan the canvas”, corner handles say “resize”, and a{" "}
            <b>copy badge</b> says “this drag duplicates”. Because the shape changes before the click,
            users never have to guess the mode — and a <b>not-allowed</b> cursor at the frame edge
            stops the mistake of dragging a shape off-canvas without noticing.
          </p>
        </section>

        <footer className="mt-10 border-t border-stone-200 pt-6">
          <Nav current="Design tool" />
          <p className="mt-6 text-xs text-stone-400">
            macOS pattern (NSCursor) approximated on the web — CSS cursor + SVG data-URIs.
          </p>
        </footer>
      </div>

      <style>{`
        .cs-handle {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 3px;
          background: #fff;
          border: 1.5px solid #7c3aed;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
          transform: translate(-50%, -50%);
          animation: cs-pop 0.18s ease-out;
        }
        @keyframes cs-pop {
          from { transform: translate(-50%, -50%) scale(0.4); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>
    </main>
  );
}