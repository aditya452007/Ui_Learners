"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ---------- cubic-bezier math ---------- */
function cubicAt(t: number, p1: number, p2: number) {
  const u = 1 - t;
  return 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t;
}
function cubicDeriv(t: number, p1: number, p2: number) {
  const u = 1 - t;
  return 3 * u * u * p1 + 6 * u * t * (p2 - p1) + 3 * t * t * (1 - p2);
}
/** Solve eased y for a given linear x using Newton + bisection fallback. */
function easedProgress(x: number, x1: number, y1: number, x2: number, y2: number) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  let t = x;
  for (let i = 0; i < 8; i++) {
    const cx = cubicAt(t, x1, x2) - x;
    const d = cubicDeriv(t, x1, x2);
    if (Math.abs(d) < 1e-6) break;
    const nt = t - cx / d;
    if (nt < 0 || nt > 1) break;
    t = nt;
    if (Math.abs(cx) < 1e-6) break;
  }
  // fallback bisection
  let lo = 0;
  let hi = 1;
  t = x;
  for (let i = 0; i < 24; i++) {
    const cx = cubicAt(t, x1, x2);
    if (Math.abs(cx - x) < 1e-5) break;
    if (cx < x) lo = t;
    else hi = t;
    t = (lo + hi) / 2;
  }
  return cubicAt(t, y1, y2);
}

function fmt(n: number) {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? `${r}` : `${r}`;
}

const PRESETS = [
  { name: "linear", label: "linear", v: [0, 0, 1, 1] as const, hint: "robot: constant speed" },
  { name: "ease-out", label: "ease-out", v: [0, 0, 0.2, 1] as const, hint: "soft landing" },
  { name: "standard", label: "standard", v: [0.4, 0, 0.2, 1] as const, hint: "UI moves default" },
  { name: "ease-in-out", label: "ease-in-out", v: [0.42, 0, 0.58, 1] as const, hint: "S-curve" },
];

const TRACK = 320;

/* ---------- small presentational helpers ---------- */
function Pill({ n }: { n: string }) {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-700 text-[12px] font-bold text-white">
      {n}
    </span>
  );
}

function TopNav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold text-white">
            ~
          </span>
          <span className="text-sm font-bold tracking-tight text-slate-900">
            Easing Lab <span className="font-normal text-slate-500">· NameThatUi</span>
          </span>
        </Link>
        <nav className="ml-auto flex flex-wrap items-center gap-2 text-sm">
          <Link href="/" className="rounded-full bg-teal-700 px-3 py-1.5 font-semibold text-white">
            Hub
          </Link>
          <Link href="/scenarios/enter-exit" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 transition hover:border-teal-700 hover:text-teal-800">
            Enter / Exit
          </Link>
          <Link href="/scenarios/ui-motion" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 transition hover:border-teal-700 hover:text-teal-800">
            UI motion
          </Link>
          <Link href="/scenarios/curve-studio" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 transition hover:border-teal-700 hover:text-teal-800">
            Curve studio
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function EasingHub() {
  const [x1, setX1] = useState(0.4);
  const [y1, setY1] = useState(0);
  const [x2, setX2] = useState(0.2);
  const [y2, setY2] = useState(1);
  const [duration, setDuration] = useState(320);
  const [compare, setCompare] = useState(true);
  const [playKey, setPlayKey] = useState(0);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(1);
  const [reduced, setReduced] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState("standard");
  const [versus, setVersus] = useState<"curve" | "linear" | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const dragTarget = useRef<1 | 2 | null>(null);
  const rafRef = useRef<number>(0);

  const bezier = useMemo(
    () => `cubic-bezier(${fmt(x1)}, ${fmt(y1)}, ${fmt(x2)}, ${fmt(y2)})`,
    [x1, y1, x2, y2]
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    setProgress(mq.matches ? 1 : 1);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  /* progress readout loop — measures wall-clock and maps through the curve */
  useEffect(() => {
    if (reduced) {
      setRunning(false);
      setProgress(1);
      return;
    }
    if (playKey === 0) {
      setProgress(1);
      return;
    }
    setRunning(true);
    setProgress(0);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(easedProgress(t, x1, y1, x2, y2));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else setRunning(false);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playKey, duration, x1, y1, x2, y2, reduced]);

  const replay = useCallback(() => setPlayKey((k) => k + 1), []);

  useEffect(() => {
    // auto-play once on load (unless reduced motion)
    if (!reduced) {
      const id = window.setTimeout(() => setPlayKey(1), 400);
      return () => window.clearTimeout(id);
    }
  }, [reduced]);

  /* ---- SVG geometry ---- */
  const W = 440;
  const H = 340;
  const L = 52;
  const R = 404;
  const T = 26;
  const B = 292;
  const YMIN = -0.3;
  const YMAX = 1.3;
  const X = (t: number) => L + t * (R - L);
  const Y = (p: number) => B - ((p - YMIN) / (YMAX - YMIN)) * (B - T);
  const invX = (px: number) => (px - L) / (R - L);
  const invY = (py: number) => YMIN + ((B - py) / (B - T)) * (YMAX - YMIN);

  const curvePath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const cx = cubicAt(t, x1, x2);
      const cy = cubicAt(t, y1, y2);
      pts.push(`${i === 0 ? "M" : "L"}${X(cx).toFixed(1)},${Y(cy).toFixed(1)}`);
    }
    return pts.join(" ");
  }, [x1, x2, y1, y2]);

  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

  const svgPoint = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { px: 0, py: 0 };
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const py = ((e.clientY - rect.top) / rect.height) * H;
    return { px, py };
  };

  const onPointDown = (which: 1 | 2) => (e: React.PointerEvent) => {
    dragTarget.current = which;
    (e.target as SVGElement).setPointerCapture?.(e.pointerId);
  };
  const onSvgMove = (e: React.PointerEvent) => {
    if (!dragTarget.current) return;
    const { px, py } = svgPoint(e);
    const nx = clamp01(invX(px));
    const ny = Math.round(invY(py) * 100) / 100;
    const clampedY = Math.min(1.4, Math.max(-0.4, ny));
    if (dragTarget.current === 1) {
      setX1(Math.round(nx * 100) / 100);
      setY1(clampedY);
    } else {
      setX2(Math.round(nx * 100) / 100);
      setY2(clampedY);
    }
    setActivePreset("custom");
  };
  const endDrag = () => (dragTarget.current = null);

  const applyPreset = (name: string, v: readonly [number, number, number, number]) => {
    setX1(v[0]);
    setY1(v[1]);
    setX2(v[2]);
    setY2(v[3]);
    setActivePreset(name);
    replay();
  };

  const copyCss = async () => {
    const text = `transition-timing-function: ${bezier};\ntransition-duration: ${duration}ms;`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const dotX = (p: number) => Math.max(0, Math.min(1, p)) * TRACK;
  const showGhost = compare;

  const tableRows = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    t,
    v: easedProgress(t, x1, y1, x2, y2),
  }));

  const overshoot = y1 < 0 || y1 > 1 || y2 < 0 || y2 > 1;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 pb-20">
        {/* Title */}
        <section className="pt-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            Motion vocabulary · timing
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Easing <span className="font-light text-slate-500">(Timing Function)</span>
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">
            Also called: <strong className="text-slate-800">timing function</strong>,{" "}
            <strong className="text-slate-800">easing curve</strong>,{" "}
            <strong className="text-slate-800">bezier curve</strong>. Easing decides{" "}
            <em>how fast</em> a transition moves through time — the personality of every slide,
            fade, and scale.
          </p>
        </section>

        {/* Intro strip */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Time → curve → feel",
              d: "Every animation maps clock time (left→right) to progress (bottom→top). The curve between them is the feel.",
              tag: "mental model",
            },
            {
              t: "linear = robotic",
              d: "A straight diagonal never speeds up or slows down. Machines move like that — people don't. Save it for marquee loops.",
              tag: "cubic-bezier(0,0,1,1)",
            },
            {
              t: "ease-out · standard · ease-in-out",
              d: "ease-out lands softly (entering). Standard (.4,0,.2,1) glides UI moves. ease-in-out is the symmetric S-curve default.",
              tag: "150–300ms sweet spot",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="inline-block rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-teal-800">
                {c.tag}
              </p>
              <h2 className="mt-2 text-base font-bold">{c.t}</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{c.d}</p>
            </div>
          ))}
        </section>

        {/* LIVE anatomy */}
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-label="Interactive easing lab">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                The live lab <span className="ml-2 rounded-full bg-teal-700 px-2.5 py-1 align-middle text-[11px] font-bold uppercase tracking-wide text-white">interactive</span>
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                One curve drives everything below. Drag the teal handles, pick a preset, change
                the duration — the dot, the card and the code all follow the{" "}
                <em>same</em> timing function.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={replay}
                disabled={reduced}
                className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {reduced ? "Loop paused (reduced motion)" : running ? "Playing…" : "↻ Replay"}
              </button>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} className="h-4 w-4 accent-teal-700" />
                vs linear ghost
              </label>
            </div>
          </div>

          {reduced && (
            <p className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
              prefers-reduced-motion is on — looping is disabled and the demos rest at their end
              state. Dragging the graph still works so you can study shapes statically.
            </p>
          )}

          {/* presets */}
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Easing presets">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p.name, p.v)}
                title={p.hint}
                className={`rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${
                  activePreset === p.name
                    ? "border-teal-700 bg-teal-700 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-teal-700 hover:text-teal-800"
                }`}
              >
                {p.label}
                <span className={`ml-2 text-xs font-normal ${activePreset === p.name ? "text-teal-100" : "text-slate-400"}`}>
                  {p.hint}
                </span>
              </button>
            ))}
            {activePreset === "custom" && (
              <span className="rounded-xl border border-dashed border-teal-700 bg-teal-50 px-3.5 py-2 text-sm font-semibold text-teal-800">
                custom ✎
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Graph */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">
                  ①–④ Timing curve <span className="font-mono text-xs font-normal text-slate-500">cubic-bezier(x1, y1, x2, y2)</span>
                </p>
                <p className="font-mono text-sm font-bold text-teal-800">{bezier}</p>
              </div>
              <svg
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                role="img"
                aria-label={`Timing curve graph. cubic-bezier ${x1}, ${y1}, ${x2}, ${y2}. Time runs left to right, progress bottom to top.`}
                className="mt-2 w-full touch-none select-none rounded-xl border border-slate-200 bg-white"
                onPointerMove={onSvgMove}
                onPointerUp={endDrag}
                onPointerLeave={endDrag}
              >
                {/* grid */}
                {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                  <g key={t}>
                    <line x1={X(t)} y1={T} x2={X(t)} y2={B} stroke="#e2e8f0" strokeWidth={t === 0 || t === 1 ? 1.5 : 1} />
                    <line x1={L} y1={Y(t)} x2={R} y2={Y(t)} stroke="#e2e8f0" strokeWidth={t === 0 || t === 1 ? 1.5 : 1} />
                  </g>
                ))}
                {/* overshoot zone */}
                <rect x={L} y={T} width={R - L} height={Y(1) - T} fill="#fef3c7" opacity={0.45} />
                <rect x={L} y={Y(0)} width={R - L} height={B - Y(0)} fill="#fef3c7" opacity={0.45} />
                {/* axes labels */}
                <text x={L - 8} y={Y(1) + 4} textAnchor="end" fontSize={11} fill="#64748b" fontWeight={700}>100%</text>
                <text x={L - 8} y={Y(0) + 4} textAnchor="end" fontSize={11} fill="#64748b" fontWeight={700}>0%</text>
                <text x={X(0)} y={B + 18} textAnchor="middle" fontSize={11} fill="#64748b" fontWeight={700}>0ms ③ time →</text>
                <text x={X(1)} y={B + 18} textAnchor="middle" fontSize={11} fill="#64748b" fontWeight={700}>{duration}ms</text>
                <text x={L - 34} y={(T + B) / 2} fontSize={11} fill="#64748b" fontWeight={700} transform={`rotate(-90 ${L - 34} ${(T + B) / 2})`} textAnchor="middle">④ progress ↑</text>
                {/* linear reference */}
                <line x1={X(0)} y1={Y(0)} x2={X(1)} y2={Y(1)} stroke="#f59e0b" strokeWidth={2} strokeDasharray="7 6" />
                <text x={X(0.72)} y={Y(0.72) - 10} fontSize={11} fill="#b45309" fontWeight={700}>linear reference</text>
                {/* steep / flat annotations */}
                <g fontSize={11} fontWeight={700}>
                  <rect x={X(0.06)} y={Y(0.92)} width={86} height={20} rx={10} fill="#0f766e" />
                  <text x={X(0.06) + 43} y={Y(0.92) + 14} textAnchor="middle" fill="#fff">steep = fast</text>
                  <rect x={X(0.62)} y={Y(0.32)} width={80} height={20} rx={10} fill="#334155" />
                  <text x={X(0.62) + 40} y={Y(0.32) + 14} textAnchor="middle" fill="#fff">flat = slow</text>
                </g>
                {/* handles */}
                <line x1={X(0)} y1={Y(0)} x2={X(x1)} y2={Y(y1)} stroke="#99c5c0" strokeWidth={1.5} />
                <line x1={X(1)} y1={Y(1)} x2={X(x2)} y2={Y(y2)} stroke="#99c5c0" strokeWidth={1.5} />
                {/* curve */}
                <path d={curvePath} fill="none" stroke="#0f766e" strokeWidth={3.5} strokeLinecap="round" />
                {/* animated progress marker */}
                {!reduced && (
                  <circle
                    cx={X(Math.min(1, Math.max(0, (() => { let lo = 0, hi = 1, tt = 0.5; for (let i = 0; i < 20; i++) { const v = easedProgress((lo + hi) / 2, 0, 0, 1, 1); void v; break; } return tt; })())))}
                    cy={0}
                    r={0}
                    fill="transparent"
                  />
                )}
                {/* control points */}
                <circle
                  cx={X(x1)} cy={Y(y1)} r={11} fill="#0f766e" stroke="#fff" strokeWidth={3}
                  style={{ cursor: "grab" }}
                  onPointerDown={onPointDown(1)}
                >
                  <title>P1 (x1, y1) — drag me</title>
                </circle>
                <circle
                  cx={X(x2)} cy={Y(y2)} r={11} fill="#0f766e" stroke="#fff" strokeWidth={3}
                  style={{ cursor: "grab" }}
                  onPointerDown={onPointDown(2)}
                >
                  <title>P2 (x2, y2) — drag me</title>
                </circle>
                <text x={X(x1)} y={Y(y1) - 16} textAnchor="middle" fontSize={11} fontWeight={800} fill="#0f766e">② P1</text>
                <text x={X(x2)} y={Y(y2) - 16} textAnchor="middle" fontSize={11} fontWeight={800} fill="#0f766e">② P2</text>
                <text x={X(0.5)} y={Y(0.55)} textAnchor="middle" fontSize={11} fontWeight={800} fill="#0f766e" opacity={0.85}>① curve</text>
              </svg>
              <p className="mt-2 text-xs text-slate-500">
                Drag the teal handles with mouse / touch. Keyboard users: use the four sliders
                below — same values, fully accessible. Amber band = overshoot zone (y outside
                0–1 → the motion springs past its target).
              </p>
              {/* numeric sliders */}
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "x1 (time)", v: x1, set: setX1, min: 0, max: 1, step: 0.01 },
                  { label: "y1 (pace)", v: y1, set: setY1, min: -0.4, max: 1.4, step: 0.01 },
                  { label: "x2 (time)", v: x2, set: setX2, min: 0, max: 1, step: 0.01 },
                  { label: "y2 (pace)", v: y2, set: setY2, min: -0.4, max: 1.4, step: 0.01 },
                ].map((s) => (
                  <label key={s.label} className="rounded-xl border border-slate-200 bg-white p-3">
                    <span className="flex items-center justify-between text-xs font-bold text-slate-700">
                      {s.label}
                      <span className="font-mono text-teal-800">{fmt(s.v)}</span>
                    </span>
                    <input
                      type="range"
                      className="easing-range mt-2 w-full"
                      min={s.min} max={s.max} step={s.step} value={s.v}
                      aria-label={s.label}
                      onChange={(e) => { s.set(Number(e.target.value)); setActivePreset("custom"); }}
                    />
                  </label>
                ))}
              </div>
              {/* duration */}
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Duration <span className="font-mono text-teal-800">{duration}ms</span></span>
                  <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] text-teal-800">sweet spot 150–300ms</span>
                </div>
                <div className="relative mt-2">
                  <div className="absolute left-[6.25%] right-[28.5%] top-1/2 h-2 -translate-y-1/2 rounded-full bg-teal-100" aria-hidden />
                  <input
                    type="range" className="easing-range relative w-full" min={100} max={800} step={10}
                    value={duration} aria-label="Animation duration in milliseconds"
                    onChange={(e) => setDuration(Number(e.target.value))}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                  <span>100ms</span><span>300ms</span><span>500ms</span><span>800ms</span>
                </div>
              </div>
              {overshoot && (
                <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                  ⚠ Overshoot: a y value left 0–1, so the curve exits the white band — the
                  animation will spring past its end point and settle back. Great for playful
                  pops, wrong for calm fades.
                </p>
              )}
            </div>

            {/* Synced visualizations */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-bold">(a) Dot race — same curve, same {duration}ms</p>
                <p className="text-xs text-slate-500">Teal dot uses your curve · amber ghost is linear.</p>
                <div className="relative mt-3 h-16 overflow-hidden rounded-xl bg-slate-50" style={{ maxWidth: TRACK + 48 }}>
                  <div className="absolute left-6 right-6 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200" />
                  {showGhost && (
                    <div
                      className="absolute top-[14px] h-4 w-4 rounded-full bg-amber-500 opacity-70"
                      style={{
                        left: 24,
                        transform: `translateX(${reduced ? TRACK : playKey === 0 ? TRACK : running || progress < 1 ? dotX(progress) : TRACK}px)`,
                        transition: reduced ? "none" : playKey === 0 ? "none" : `transform ${duration}ms linear`,
                      }}
                    />
                  )}
                  <div
                    className="absolute top-[38px] h-5 w-5 rounded-full bg-teal-700 shadow"
                    style={{
                      left: 24,
                      transform: `translateX(${reduced ? TRACK : playKey === 0 ? TRACK : 0}px)`,
                      transition: "none",
                    }}
                    // The real animated dot: key on playKey to retrigger CSS transition
                    key={`teal-${playKey}-${bezier}-${duration}`}
                    ref={(el) => {
                      if (el && !reduced && playKey > 0) {
                        el.style.transform = "translateX(0px)";
                        el.style.transition = "none";
                        requestAnimationFrame(() =>
                          requestAnimationFrame(() => {
                            el.style.transition = `transform ${duration}ms ${bezier}`;
                            el.style.transform = `translateX(${TRACK}px)`;
                          })
                        );
                      }
                    }}
                  />
                </div>
                <p className="mt-2 font-mono text-xs text-slate-600">
                  progress: <strong className="text-teal-800">{Math.round(progress * 100)}%</strong>
                  {running ? " · playing…" : " · settled"} · eased value chases the curve, not the clock
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-bold">(b) Bar fill + fade-slide card</p>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    key={`bar-${playKey}-${bezier}-${duration}`}
                    ref={(el) => {
                      if (el && !reduced && playKey > 0) {
                        el.style.width = "0%";
                        el.style.transition = "none";
                        requestAnimationFrame(() =>
                          requestAnimationFrame(() => {
                            el.style.transition = `width ${duration}ms ${bezier}`;
                            el.style.width = "100%";
                          })
                        );
                      }
                    }}
                    className="h-full rounded-full bg-teal-700"
                    style={{ width: reduced || playKey === 0 ? "100%" : "0%" }}
                  />
                </div>
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div
                    key={`card-${playKey}-${bezier}-${duration}`}
                    ref={(el) => {
                      if (el && !reduced && playKey > 0) {
                        el.style.opacity = "0";
                        el.style.transform = "translateY(12px)";
                        el.style.transition = "none";
                        requestAnimationFrame(() =>
                          requestAnimationFrame(() => {
                            el.style.transition = `opacity ${duration}ms ${bezier}, transform ${duration}ms ${bezier}`;
                            el.style.opacity = "1";
                            el.style.transform = "translateY(0px)";
                          })
                        );
                      }
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
                    style={{ opacity: reduced || playKey === 0 ? 1 : undefined }}
                  >
                    <p className="text-sm font-bold">Invite sent ✓</p>
                    <p className="text-xs text-slate-500">This card fades + slides with your curve.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
                <p className="text-sm font-bold text-white">(c) Live CSS snippet</p>
                <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 font-mono text-[12.5px] leading-relaxed text-teal-100">
{`.invite-toast {
  transition-duration: ${duration}ms;
  transition-timing-function: ${bezier};
  /* Motion (Framer): transition={{ duration: ${(duration / 1000).toFixed(2)}, ease: [${fmt(x1)}, ${fmt(y1)}, ${fmt(x2)}, ${fmt(y2)}] }} */
  /* linear() baseline (2023+): linear(0, 0.2 20%, 1) ≈ springs/bounces */
}`}
                </pre>
                <button
                  onClick={copyCss}
                  className="mt-2 rounded-xl bg-teal-600 px-3 py-1.5 text-sm font-bold text-white transition hover:bg-teal-500"
                >
                  {copied ? "✓ Copied!" : "Copy CSS"}
                </button>
              </div>
            </div>
          </div>

          {/* text fallback table */}
          <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            <summary className="cursor-pointer font-semibold text-slate-800">
              Text fallback: sampled curve values (screen-reader friendly)
            </summary>
            <table className="mt-2 w-full max-w-md font-mono text-xs">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-1">clock time</th>
                  <th>eased progress</th>
                  <th>meaning</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r) => (
                  <tr key={r.t} className="border-t border-slate-200">
                    <td className="py-1">{Math.round(r.t * 100)}%</td>
                    <td>{(Math.round(r.v * 1000) / 1000).toFixed(3)}</td>
                    <td className="font-sans text-slate-500">
                      {r.t === 0 ? "start" : r.t === 1 ? "end" : r.v > r.t + 0.05 ? "ahead of clock (fast)" : r.v < r.t - 0.05 ? "behind clock (slow)" : "on pace"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </section>

        {/* Layered explanations */}
        <section className="mt-10">
          <h2 className="text-2xl font-extrabold tracking-tight">What each part means</h2>
          <p className="mt-1 text-sm text-slate-600">
            Left column: what a <em>user feels</em>. Right column: how a <em>builder wires it</em> — every term defined.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              {
                n: "①", title: "Curve line — the personality",
                see: "What you see: the motion's character. A curve that jumps up early feels snappy; one that creeps then rushes feels hesitant. Users never see the line — they feel it as 'smooth' or 'janky'.",
                how: "How it works: a timing function maps clock time (x) to progress (y). In CSS you set it with transition-timing-function. In Framer Motion you pass transition={{ ease: … }}. Steep slope = large progress per millisecond = fast. Flat = slow. When you change x1, the early slope changes because the first handle pulls the curve toward itself.",
              },
              {
                n: "②", title: "Control points & handles — the steering",
                see: "What you see: nothing directly — but dragging P1 toward the top makes everything start fast and land gently, like a car pulling away quickly then braking into a parking spot.",
                how: "How it works: cubic-bezier(x1,y1,x2,y2) has 4 numbers. x1/x2 are times (always 0–1) of two invisible magnets; y1/y2 are how hard they pull progress up/down (they may leave 0–1 for overshoot). Props = settings you hand a component. State = values it remembers (here: the four numbers). Render = re-drawing the SVG path whenever state changes.",
              },
              {
                n: "③", title: "Time axis — the clock",
                see: "What you see: duration. 160ms feels instant, 320ms feels deliberate, 800ms feels cinematic — or sluggish if it blocks input. Users forgive slow entrances, never slow responses.",
                how: "How it works: duration is separate from shape: transition-duration: 220ms says how long; the curve says how progress is distributed inside those milliseconds. Rule of thumb: entering 200–300ms, exiting 120–180ms, small UI moves ~240ms. When you shorten duration, the same curve feels snappier because the same shape is squeezed into fewer frames.",
              },
              {
                n: "④", title: "Progress axis — the journey",
                see: "What you see: how far along the animation is — 0% hidden, 100% arrived. Overshoot (curve above 100%) looks like a bounce past the target, like a car nosing over a stop line then rolling back.",
                how: "How it works: progress 0→1 drives opacity, translateX, scale — any animatable value. linear() (baseline 2023) lets you chain many stops for springs/bounces without JavaScript. Overshoot happens when y1 or y2 leaves 0–1: the math legitimately returns 1.08, and CSS dutifully renders 108% of the distance, then settles.",
              },
            ].map((c) => (
              <article key={c.n} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="flex items-center gap-2 text-base font-bold"><Pill n={c.n} /> {c.title}</h3>
                <p className="mt-3 rounded-xl bg-teal-50/70 p-3 text-sm leading-relaxed text-slate-700">
                  <strong className="text-teal-900">What you see — </strong>{c.see}
                </p>
                <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                  <strong>How it works — </strong>{c.how}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              { t: "Why linear feels robotic", d: "Real bodies accelerate and brake. Constant velocity never happens in nature — so our brains read it as mechanical. Use linear only for loops with no start/end (marquees, spinners, progress stripes) where any ease would visibly hitch each lap." },
              { t: "ease-out enters · ease-in leaves", d: "Entering elements should arrive gently (fast start, soft landing: ease-out). Leaving elements should get out of the way quickly then vanish (slow start, fast end: ease-in). Symmetric moves (carousels, reorders) want ease-in-out or standard." },
              { t: "Standard (.4,0,.2,1) + 150–300ms", d: "Material's standard curve accelerates fast then decelerates long — responsive yet calm. Pair it with 150–300ms for UI feedback. Under 150ms feels accidental; over 400ms feels laggy unless the travel distance is huge." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-teal-900">{c.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Robotic vs human */}
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Robotic vs human</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Same 240px slide, same 400ms. One runs <code className="font-mono text-slate-800">linear</code>, the other runs your curve above. Press play — feel which one breathes.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setVersus("linear")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${versus === "linear" ? "bg-amber-500 text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-amber-500"}`}
            >
              ▸ Play linear (robot)
            </button>
            <button
              onClick={() => setVersus("curve")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${versus === "curve" ? "bg-teal-700 text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-teal-700"}`}
            >
              ▸ Play my curve (human)
            </button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {(["linear", "curve"] as const).map((kind) => {
              const active = versus === kind;
              const tf = kind === "linear" ? "linear" : bezier;
              return (
                <div key={kind} className={`rounded-2xl border p-4 ${kind === "linear" ? "border-amber-200 bg-amber-50/50" : "border-teal-200 bg-teal-50/50"}`}>
                  <p className="text-sm font-bold">{kind === "linear" ? "🤖 linear — constant speed" : `🙂 your curve — ${bezier}`}</p>
                  <div className="relative mt-3 h-14 overflow-hidden rounded-xl bg-white">
                    <div className="absolute left-4 right-4 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200" />
                    <div
                      key={`${kind}-${active}-${bezier}`}
                      ref={(el) => {
                        if (el && active && !reduced) {
                          el.style.transform = "translateX(0px)";
                          el.style.transition = "none";
                          requestAnimationFrame(() =>
                            requestAnimationFrame(() => {
                              el.style.transition = `transform 400ms ${tf}`;
                              el.style.transform = "translateX(240px)";
                            })
                          );
                        }
                      }}
                      className={`absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full shadow ${kind === "linear" ? "bg-amber-500" : "bg-teal-700"}`}
                      style={{ left: 16, transform: active && (reduced || versus) ? undefined : "translateX(0px)" }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-600">
                    {kind === "linear"
                      ? "Starts and stops dead — like a conveyor belt. Fine for a ticker, cold for a button."
                      : "Eases in and/or out — like a hand placing a card down. Warm, intentional, human."}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Scenario cards */}
        <section className="mt-10">
          <h2 className="text-2xl font-extrabold tracking-tight">Take it into products</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              { href: "/scenarios/enter-exit", t: "Enter / Exit", d: "Flowboard invites: toast in with ease-out 220ms, out with ease-in 160ms; share modal on standard. With a linear-toggle A/B.", tag: "toast + modal" },
              { href: "/scenarios/ui-motion", t: "UI motion", d: "Travel carousel on standard 280ms + itinerary reorder with FLIP ease-in-out 240ms. The 'UI moves' rule, fixed in the sweet spot.", tag: "carousel + reorder" },
              { href: "/scenarios/curve-studio", t: "Curve studio", d: "A motion inspector for a button's hover: per-property curves, durations, S-curve previews, overshoot warnings, export-CSS.", tag: "design tool" },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-700 hover:shadow-md">
                <p className="inline-block rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-800">{c.tag}</p>
                <h3 className="mt-2 text-lg font-bold group-hover:text-teal-800">{c.t} →</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{c.d}</p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-xs text-slate-500">
          <p>Built as a standalone Next.js 16 + TypeScript + Tailwind v4 mini-app · no dependencies · pure React + SVG + CSS transitions · respects prefers-reduced-motion.</p>
        </footer>
      </main>
    </div>
  );
}
