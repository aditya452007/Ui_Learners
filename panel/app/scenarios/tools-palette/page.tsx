"use client";

import { useRef, useState } from "react";
import FloatingPanel from "@/components/FloatingPanel";
import { BackLink, ConfigChips, Eyebrow, ScenarioNav, WhyFit } from "@/components/chrome";

const W = 880;
const H = 520;

const COLORS = ["#1c1917", "#dc2626", "#ea580c", "#16a34a", "#0071e3", "#7c3aed"];

type Tool = "brush" | "eraser" | "fill" | "pick";

const TOOL_META: { id: Tool; glyph: string; label: string }[] = [
  { id: "brush", glyph: "✎", label: "Brush" },
  { id: "eraser", glyph: "⌫", label: "Eraser" },
  { id: "fill", glyph: "◩", label: "Fill" },
  { id: "pick", glyph: "◉", label: "Pick" },
];

function paintStarter(c: HTMLCanvasElement) {
  const ctx = c.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#e7e5e4";
  ctx.lineWidth = 1;
  for (let x = 40; x < W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, H);
    ctx.stroke();
  }
  for (let y = 40; y < H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(W, y + 0.5);
    ctx.stroke();
  }
  ctx.fillStyle = "#a8a29e";
  ctx.font = "15px system-ui, sans-serif";
  ctx.fillText("Sketch here — the floating Tools panel paints on this document.", 32, 48);
}

export default function ToolsPalette() {
  const [tool, setTool] = useState<Tool>("brush");
  const [color, setColor] = useState(COLORS[4]);
  const [size, setSize] = useState(10);
  const [strokes, setStrokes] = useState(0);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [hideOnDeactivate, setHideOnDeactivate] = useState(true);
  const [appActive, setAppActive] = useState(true);
  const [panelStart] = useState(() =>
    typeof window === "undefined"
      ? { x: 560, y: 48 }
      : { x: window.innerWidth < 760 ? 16 : Math.min(640, Math.round(window.innerWidth * 0.5)), y: 48 },
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const started = useRef(false);

  function ctxOf() {
    const c = canvasRef.current;
    if (!c) return null;
    if (!started.current) {
      started.current = true;
      paintStarter(c);
    }
    return c.getContext("2d");
  }

  function toCanvas(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * W,
      y: ((e.clientY - r.top) / r.height) * H,
    };
  }

  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!appActive) return;
    const ctx = ctxOf();
    if (!ctx) return;
    const p = toCanvas(e);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    if (tool === "pick") {
      const d = ctx.getImageData(Math.round(p.x), Math.round(p.y), 1, 1).data;
      setColor(`#${[d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, "0")).join("")}`);
      return;
    }
    if (tool === "fill") {
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      setStrokes((s) => s + 1);
      return;
    }
    drawing.current = true;
    ctx.save();
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.restore();
    // stash style for the move handler
    moveStyle.current = { tool, color, size };
  }

  const moveStyle = useRef({ tool, color, size });

  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    setCursor({
      x: Math.round(((e.clientX - r.left) / r.width) * W),
      y: Math.round(((e.clientY - r.top) / r.height) * H),
    });
    if (!drawing.current) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const p = toCanvas(e);
    const s = moveStyle.current;
    ctx.save();
    ctx.globalCompositeOperation = s.tool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.restore();
  }

  function onUp() {
    if (drawing.current) {
      drawing.current = false;
      setStrokes((s) => s + 1);
    }
  }

  function clear() {
    const c = canvasRef.current;
    if (!c) return;
    started.current = true;
    paintStarter(c);
    setStrokes(0);
  }

  const toolLabel = TOOL_META.find((t) => t.id === tool)?.label;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <BackLink />
        <div>
          <Eyebrow>Scenario 1 · Utility panel</Eyebrow>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">Tools palette over a paint canvas</h1>
          <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-stone-600">
            PixelForge, a tiny painting app. The Tools panel is a light utility{" "}
            <code className="rounded bg-stone-100 px-1 font-mono text-[13px]">NSPanel</code>: it floats
            above the canvas, drags anywhere, and every control acts on the document — paint with it for real.
          </p>
        </div>
        <ConfigChips items={["NSPanel · utility", "NSWindow.Level.floating", "hidesOnDeactivate", "draggable mini title bar"]} />
        <WhyFit>
          A painter reaches for tools dozens of times a minute. Docking them in a floating panel keeps
          them one click away without surrendering canvas space to a permanent sidebar — and because the
          panel is auxiliary, closing it never risks the artwork. Paint a stroke, then drag the panel
          somewhere it isn&apos;t in the way: that freedom is the feature.
        </WhyFit>

        <div className="flex flex-wrap items-center gap-2.5">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-[13px] font-medium text-stone-700">
            <input
              type="checkbox"
              checked={hideOnDeactivate}
              onChange={(e) => setHideOnDeactivate(e.target.checked)}
              className="size-4 accent-[#0071e3]"
            />
            Hide panel when app deactivates
            <code className="font-mono text-[10px] text-stone-400">hidesOnDeactivate</code>
          </label>
          <button
            type="button"
            onClick={() => setAppActive((v) => !v)}
            className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-[13px] font-medium text-stone-700 transition-colors hover:border-stone-300"
          >
            {appActive ? "⌘Tab away" : "Return to PixelForge"}
          </button>
        </div>

        <div className="desktop-dots relative min-h-[600px] overflow-hidden rounded-2xl border border-stone-300/70 p-4 sm:p-8">
          {!appActive && (
            <div className="absolute inset-x-0 top-0 z-50 flex justify-center pt-3">
              <p className="rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-800 shadow">
                Finder is frontmost — PixelForge and its panels stand down
              </p>
            </div>
          )}

          {/* document window with canvas */}
          <div className="relative w-full max-w-[720px]" style={{ zIndex: 10 }}>
            <div
              className={`overflow-hidden rounded-xl border bg-white transition-all ${
                appActive ? "border-stone-300 shadow-[0_16px_44px_rgba(0,0,0,0.16)]" : "border-stone-200 opacity-70 shadow-md saturate-50"
              }`}
            >
              <div className="flex items-center gap-2 border-b border-stone-200 bg-stone-50 px-3 py-2">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="size-3 rounded-full bg-[#ff5f57]" />
                  <span className="size-3 rounded-full bg-[#febc2e]" />
                  <span className="size-3 rounded-full bg-[#28c840]" />
                </span>
                <p className="flex-1 text-center text-[12px] font-semibold text-stone-600">Untitled-1 · PixelForge</p>
                <button
                  type="button"
                  onClick={clear}
                  className="rounded-md px-2 py-1 text-[12px] font-medium text-stone-500 transition-colors hover:bg-stone-200/70 hover:text-stone-700"
                >
                  Clear
                </button>
              </div>
              <canvas
                ref={canvasRef}
                width={W}
                height={H}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
                className="block h-auto w-full cursor-crosshair touch-none bg-white"
                aria-label="Paint canvas. Choose a tool in the floating panel, then paint here."
              />
              <div className="flex items-center gap-3 border-t border-stone-200 bg-stone-50 px-3 py-1.5 font-mono text-[11px] text-stone-500">
                <span>{cursor ? `${cursor.x}, ${cursor.y}` : "—, —"}</span>
                <span>{strokes} stroke{strokes === 1 ? "" : "s"}</span>
                <span className="flex-1" />
                <span>{toolLabel} · {size}px · {color}</span>
              </div>
            </div>
          </div>

          {/* floating tools panel */}
          <FloatingPanel
            title="Tools"
            initialX={panelStart.x}
            initialY={panelStart.y}
            width={232}
            zIndex={30}
            hidden={!appActive && hideOnDeactivate}
            footer={<span>NSPanel · level floating · follows Untitled-1</span>}
          >
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-4 gap-1" role="group" aria-label="Paint tools">
                {TOOL_META.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    data-nodrag
                    onClick={() => setTool(t.id)}
                    aria-pressed={tool === t.id}
                    title={t.label}
                    className={`flex flex-col items-center gap-0.5 rounded-lg py-1.5 transition-colors ${
                      tool === t.id ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    <span aria-hidden className="text-base leading-none">{t.glyph}</span>
                    <span className="text-[9px] font-medium leading-none">{t.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5" role="group" aria-label="Colors">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    data-nodrag
                    onClick={() => {
                      setColor(c);
                      setTool("brush");
                    }}
                    title={c}
                    aria-label={`Paint color ${c}`}
                    aria-pressed={color === c}
                    className={`size-6 rounded-full border border-black/10 transition-transform hover:scale-110 ${
                      color === c ? "ring-2 ring-[#0071e3] ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <label className="block text-[11px] font-medium text-stone-500">
                <span className="mb-1 flex justify-between">
                  <span>Brush size</span>
                  <span className="font-mono">{size}px</span>
                </span>
                <input
                  type="range"
                  data-nodrag
                  min={2}
                  max={48}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="light-range w-full"
                />
              </label>
              <p className="rounded-lg bg-stone-100 px-2.5 py-2 text-[11px] leading-relaxed text-stone-600">
                {tool === "pick" && "Pick: click the canvas to lift a color."}
                {tool === "fill" && "Fill: click the canvas to flood it — panel acts, document changes."}
                {tool === "eraser" && "Eraser: drag to wipe back to paper."}
                {tool === "brush" && "Brush: drag on the canvas. The panel never takes the canvas away."}
              </p>
            </div>
          </FloatingPanel>
        </div>

        <ScenarioNav
          prev={{ href: "/", label: "Anatomy hub" }}
          next={{ href: "/scenarios/hud-inspector", label: "Color HUD" }}
        />
      </div>
    </main>
  );
}
