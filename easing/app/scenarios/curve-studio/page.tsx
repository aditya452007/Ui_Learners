"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

function Nav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold text-white">~</span>
          <span className="text-sm font-bold tracking-tight">Easing Lab <span className="font-normal text-slate-500">· Curve studio</span></span>
        </Link>
        <nav className="ml-auto flex flex-wrap items-center gap-2 text-sm">
          <Link href="/" className="rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:border-teal-700 hover:text-teal-800">Hub</Link>
          <Link href="/scenarios/enter-exit" className="rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:border-teal-700 hover:text-teal-800">Enter / Exit</Link>
          <Link href="/scenarios/ui-motion" className="rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:border-teal-700 hover:text-teal-800">UI motion</Link>
          <Link href="/scenarios/curve-studio" className="rounded-full bg-teal-700 px-3 py-1.5 font-semibold text-white">Curve studio</Link>
        </nav>
      </div>
    </header>
  );
}

const CURVES: Record<string, string> = {
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
  "ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1)",
  "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
  linear: "linear",
  spring: "cubic-bezier(0.34, 1.4, 0.64, 1)",
};

function parseBezier(curve: string): [number, number, number, number] | null {
  const m = curve.match(/cubic-bezier\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(",").map((s) => Number(s.trim()));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return null;
  return parts as [number, number, number, number];
}

function MiniPreview({ curve }: { curve: string }) {
  const d = useMemo(() => {
    const b = parseBezier(curve);
    if (!b) return "M4,36 L60,4"; // linear
    const [x1, y1, x2, y2] = b;
    const X = (t: number) => 4 + t * 56;
    const Y = (p: number) => {
      const c = Math.min(1.5, Math.max(-0.5, p));
      return 36 - ((c + 0.5) / 2) * 32;
    };
    const cubic = (t: number, p1: number, p2: number) => {
      const u = 1 - t;
      return 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t;
    };
    let s = "";
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      s += `${i === 0 ? "M" : "L"}${X(cubic(t, x1, x2)).toFixed(1)},${Y(cubic(t, y1, y2)).toFixed(1)} `;
    }
    return s;
  }, [curve]);
  return (
    <svg viewBox="0 0 64 40" className="h-10 w-16 rounded-lg border border-slate-200 bg-slate-50" aria-hidden>
      <line x1={4} y1={36} x2={60} y2={4} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
      <path d={d} fill="none" stroke="#0f766e" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

type Row = { prop: "opacity" | "translate" | "scale"; curveName: string; duration: number };

export default function CurveStudioPage() {
  const [rows, setRows] = useState<Row[]>([
    { prop: "opacity", curveName: "ease-out", duration: 180 },
    { prop: "translate", curveName: "standard", duration: 240 },
    { prop: "scale", curveName: "spring", duration: 300 },
  ]);
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const setRow = (i: number, patch: Partial<Row>) =>
    setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));

  const css = useMemo(() => {
    const line = (r: Row) => {
      const curve = CURVES[r.curveName];
      const prop = r.prop === "opacity" ? "opacity" : r.prop === "translate" ? "transform (translateY)" : "transform (scale)";
      return `  /* ${prop} */\n  transition: ... ${r.duration}ms ${curve};`;
    };
    const opacity = rows[0];
    const translate = rows[1];
    const scale = rows[2];
    return `.btn-primary {\n  transition:\n    opacity ${opacity.duration}ms ${CURVES[opacity.curveName]},\n    translate ${translate.duration}ms ${CURVES[translate.curveName]},\n    scale ${scale.duration}ms ${CURVES[scale.curveName]};\n}\n.btn-primary:hover {\n  opacity: 0.92;\n  translate: 0 -1px;\n  scale: 1.03;\n}`;
  }, [rows]);

  void css.split;

  const exportCss = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard unavailable */ }
  };

  const overshootRows = rows.filter((r) => {
    const b = parseBezier(CURVES[r.curveName]);
    return b !== null && (b[1] < 0 || b[1] > 1 || b[3] < 0 || b[3] > 1);
  });

  const btnStyle = {
    opacity: hovered ? 0.92 : 1,
    transform: `translateY(${hovered ? -1 : 0}px) scale(${hovered ? 1.03 : 1})`,
    transition: `opacity ${rows[0].duration}ms ${CURVES[rows[0].curveName]}, transform ${Math.max(rows[1].duration, rows[2].duration)}ms ${CURVES[rows[1].curveName]}`,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Nav />
      <main className="mx-auto max-w-6xl px-6 pb-20">
        <section className="pt-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Scenario 3 · curve studio</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Motion inspector — button hover transitions</h1>
          <p className="mt-3 max-w-3xl rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm leading-relaxed text-teal-950">
            <strong>Why it fits here:</strong> real design tools let you tune <em>each property on
            its own curve</em> — a fade wants a different personality than a lift or a pop. Here
            you edit a button component&apos;s hover: opacity, translate and scale each get their
            own preset + duration, with S-curve previews and an overshoot guard. Export the CSS
            when it feels right.
          </p>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Inspector */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold">Motion inspector <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">btn / primary / hover</span></h2>
              <button onClick={exportCss} className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800">
                {copied ? "✓ Copied CSS" : "Export CSS"}
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {rows.map((r, i) => {
                const curve = CURVES[r.curveName];
                const b = parseBezier(curve);
                const overshoot = b !== null && (b[1] < 0 || b[1] > 1 || b[3] < 0 || b[3] > 1);
                return (
                  <div key={r.prop} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="w-20 rounded-lg bg-slate-900 px-2 py-1 text-center font-mono text-xs font-bold text-white">{r.prop}</span>
                      <MiniPreview curve={curve} />
                      <label className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-slate-600">curve</span>
                        <select
                          className="easing-select"
                          value={r.curveName}
                          aria-label={`${r.prop} easing curve`}
                          onChange={(e) => setRow(i, { curveName: e.target.value })}
                        >
                          {Object.keys(CURVES).map((k) => (
                            <option key={k} value={k}>{k} — {CURVES[k]}</option>
                          ))}
                        </select>
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-slate-600">ms</span>
                        <input
                          type="number" min={50} max={1000} step={10}
                          className="easing-input w-24"
                          value={r.duration}
                          aria-label={`${r.prop} duration in milliseconds`}
                          onChange={(e) => setRow(i, { duration: Math.min(1000, Math.max(50, Number(e.target.value) || 0)) })}
                        />
                      </label>
                      <input
                        type="range" min={50} max={600} step={10}
                        value={Math.min(600, r.duration)}
                        aria-label={`${r.prop} duration slider`}
                        onChange={(e) => setRow(i, { duration: Number(e.target.value) })}
                        className="easing-range w-32"
                      />
                    </div>
                    <p className="mt-2 font-mono text-[11px] text-slate-500">
                      {r.prop}: {r.duration}ms · {curve}
                      {r.duration < 150 && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 font-sans font-bold text-amber-800">snappy — under sweet spot</span>}
                      {r.duration > 300 && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 font-sans font-bold text-amber-800">lingering — over sweet spot</span>}
                    </p>
                    {overshoot && (
                      <p className="mt-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                        ⚠ Overshoot warning: {curve} leaves 0–1, so {r.prop} will spring past its
                        target. Delightful for scale, usually wrong for opacity.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            {overshootRows.length > 0 && (
              <p className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                {overshootRows.length} row{overshootRows.length > 1 ? "s" : ""} overshoot
                ({overshootRows.map((r) => r.prop).join(", ")}). Rule: overshoot only where passing
                the target is physically plausible — position and scale, never fades.
              </p>
            )}
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-900 p-4 font-mono text-[12px] leading-relaxed text-teal-100">{css}</pre>
          </section>

          {/* Preview */}
          <aside className="flex flex-col gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Live button preview</h2>
              <p className="mt-1 text-xs text-slate-500">Hover the button — or toggle hover state for precise study.</p>
              <div className="mt-4 flex min-h-[140px] items-center justify-center rounded-2xl bg-slate-50 p-6">
                <button
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  onFocus={() => setHovered(true)}
                  onBlur={() => setHovered(false)}
                  onClick={() => setHovered((h) => !h)}
                  style={btnStyle}
                  className="rounded-2xl bg-teal-700 px-8 py-3.5 text-base font-bold text-white shadow-lg"
                >
                  Get started →
                </button>
              </div>
              <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={hovered} onChange={(e) => setHovered(e.target.checked)} className="h-4 w-4 accent-teal-700" />
                hover state {hovered ? "ON" : "off"}
              </label>
              <dl className="mt-3 space-y-1.5 font-mono text-[11px] text-slate-600">
                <div className="flex justify-between rounded-lg bg-slate-50 px-2 py-1"><dt>opacity</dt><dd>{rows[0].duration}ms · {CURVES[rows[0].curveName]}</dd></div>
                <div className="flex justify-between rounded-lg bg-slate-50 px-2 py-1"><dt>translate</dt><dd>{rows[1].duration}ms · {CURVES[rows[1].curveName]}</dd></div>
                <div className="flex justify-between rounded-lg bg-slate-50 px-2 py-1"><dt>scale</dt><dd>{rows[2].duration}ms · {CURVES[rows[2].curveName]}</dd></div>
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Try this: set scale to <em>spring</em> and hover — the button pops past 103% then
                settles. Now set opacity to spring too — the fade <em>blinks</em> past full
                visibility, which looks broken. That&apos;s the overshoot rule in one experiment.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/" className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm transition hover:border-teal-700">← Hub</Link>
              <Link href="/scenarios/enter-exit" className="rounded-2xl bg-teal-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800">↻ Enter / Exit</Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
