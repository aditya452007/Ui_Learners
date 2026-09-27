"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function Nav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold text-white">~</span>
          <span className="text-sm font-bold tracking-tight">Easing Lab <span className="font-normal text-slate-500">· Enter / Exit</span></span>
        </Link>
        <nav className="ml-auto flex flex-wrap items-center gap-2 text-sm">
          <Link href="/" className="rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:border-teal-700 hover:text-teal-800">Hub</Link>
          <Link href="/scenarios/enter-exit" className="rounded-full bg-teal-700 px-3 py-1.5 font-semibold text-white">Enter / Exit</Link>
          <Link href="/scenarios/ui-motion" className="rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:border-teal-700 hover:text-teal-800">UI motion</Link>
          <Link href="/scenarios/curve-studio" className="rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:border-teal-700 hover:text-teal-800">Curve studio</Link>
        </nav>
      </div>
    </header>
  );
}

const EASE_OUT = "cubic-bezier(0, 0, 0.2, 1)";
const EASE_IN = "cubic-bezier(0.4, 0, 1, 1)";
const STANDARD = "cubic-bezier(0.4, 0, 0.2, 1)";

type Log = { label: string; ms: number; curve: string };

export default function EnterExitPage() {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastGone, setToastGone] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [linearMode, setLinearMode] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [copied, setCopied] = useState(false);
  const timers = useRef<number[]>([]);

  const inCurve = linearMode ? "linear" : EASE_OUT;
  const outCurve = linearMode ? "linear" : EASE_IN;
  const modalCurve = linearMode ? "linear" : STANDARD;

  const pushLog = (label: string, ms: number, curve: string) =>
    setLogs((l) => [{ label, ms, curve }, ...l].slice(0, 6));

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const sendInvite = () => {
    setToastGone(false);
    setToastVisible(false);
    const t0 = performance.now();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setToastVisible(true);
        window.setTimeout(() => pushLog("toast entered", Math.round(performance.now() - t0), `${inCurve} · 220ms`), 240);
      })
    );
    timers.current.push(window.setTimeout(() => dismissToast(true), 4200));
  };

  const dismissToast = (auto = false) => {
    const t0 = performance.now();
    setToastVisible(false);
    pushLog(auto ? "toast auto-dismiss started" : "toast dismissed", 160, `${outCurve} · 160ms`);
    void t0;
    timers.current.push(window.setTimeout(() => setToastGone(true), 200));
  };

  const openModal = () => {
    setModalOpen(true);
    pushLog("modal opened", 240, `${modalCurve} · 240ms`);
  };

  const css = `/* Flowboard — ${linearMode ? "LINEAR (robotic demo)" : "curated easing"} */\n.toast-enter { transition: opacity 220ms ${inCurve}, transform 220ms ${inCurve}; }\n.toast-exit  { transition: opacity 160ms ${outCurve}, transform 160ms ${outCurve}; }\n.modal-enter { transition: opacity 240ms ${modalCurve}, transform 240ms ${modalCurve}; /* scale .96 → 1 */ }`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Nav />
      <main className="mx-auto max-w-6xl px-6 pb-20">
        <section className="pt-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Scenario 1 · enter / exit</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Flowboard — invite toast + share modal</h1>
          <p className="mt-3 max-w-3xl rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm leading-relaxed text-teal-950">
            <strong>Why it fits here:</strong> notifications and dialogs live and die by asymmetric
            easing — they should <em>arrive gently</em> (ease-out, a soft landing that catches the
            eye without startling) and <em>leave quickly</em> (ease-in, out of the way fast). The
            modal scales 96%→100% on the standard curve so it feels placed, not popped. Flip the
            linear switch to feel the robotic difference on the exact same motion.
          </p>
        </section>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold">
            <input type="checkbox" checked={linearMode} onChange={(e) => setLinearMode(e.target.checked)} className="h-4 w-4 accent-amber-500" />
            {linearMode ? "🤖 linear mode ON — feel the robot" : "Compare: switch to linear"}
          </label>
          <span className="font-mono text-xs text-slate-500">in: {inCurve} · out: {outCurve} · modal: {modalCurve}</span>
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Fake product */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 font-bold text-white">F</span>
                <div>
                  <p className="text-sm font-bold">Flowboard</p>
                  <p className="text-xs text-slate-500">Q3 launch · board shared with 6 people</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={sendInvite} className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800">
                  + Invite teammate
                </button>
                <button onClick={openModal} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-700 hover:text-teal-800">
                  Share…
                </button>
              </div>
            </div>
            <div className="relative min-h-[380px] bg-slate-50 p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { t: "Homepage hero", s: "In review · 4 comments" },
                  { t: "Pricing table", s: "Draft · you edited 2h ago" },
                  { t: "Onboarding flow", s: "Approved ✓ · ready to ship" },
                ].map((c) => (
                  <div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="h-20 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200" />
                    <p className="mt-3 text-sm font-bold">{c.t}</p>
                    <p className="text-xs text-slate-500">{c.s}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-400">↑ a realistic board. Click “Invite teammate” to fire the toast · “Share…” for the modal.</p>

              {/* Toast */}
              {!toastGone && (
                <div
                  role="status"
                  className="absolute left-1/2 top-5 w-[min(420px,90%)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl"
                  style={{
                    opacity: toastVisible ? 1 : 0,
                    transform: toastVisible ? "translate(-50%, 0)" : "translate(-50%, -12px)",
                    transition: toastVisible
                      ? `opacity 220ms ${inCurve}, transform 220ms ${inCurve}`
                      : `opacity 160ms ${outCurve}, transform 160ms ${outCurve}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm">✓</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold">Invite sent to priya@studio.co</p>
                      <p className="text-xs text-slate-500">She can now comment on Q3 launch · {linearMode ? "linear 220/160ms" : "ease-out 220ms in · ease-in 160ms out"}</p>
                    </div>
                    <button onClick={() => dismissToast()} aria-label="Dismiss notification" className="rounded-lg px-2 py-1 text-sm text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">✕</button>
                  </div>
                </div>
              )}

              {/* Modal */}
              {modalOpen && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30 p-6" onClick={() => setModalOpen(false)}>
                  <div
                    role="dialog" aria-modal="true" aria-label="Share board"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
                    ref={(el) => {
                      if (el) {
                        el.style.opacity = "0";
                        el.style.transform = "scale(0.96) translateY(8px)";
                        el.style.transition = "none";
                        requestAnimationFrame(() =>
                          requestAnimationFrame(() => {
                            el.style.transition = `opacity 240ms ${modalCurve}, transform 240ms ${modalCurve}`;
                            el.style.opacity = "1";
                            el.style.transform = "scale(1) translateY(0)";
                          })
                        );
                      }
                    }}
                  >
                    <h2 className="text-lg font-extrabold">Share “Q3 launch”</h2>
                    <p className="mt-1 text-sm text-slate-500">Scales 96% → 100% + fades · {linearMode ? "linear" : "standard cubic-bezier(0.4,0,0.2,1)"} · 240ms</p>
                    <div className="mt-4 space-y-2">
                      {["maya@studio.co — editor", "leo@studio.co — viewer", "priya@studio.co — invited"].map((m) => (
                        <div key={m} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                          <span>{m}</span>
                          <span className="text-xs text-slate-400">●</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex justify-end gap-2">
                      <button onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold">Cancel</button>
                      <button onClick={() => { setModalOpen(false); sendInvite(); }} className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800">Copy link + invite</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timing readout */}
          <aside className="flex flex-col gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Side-by-side timing readout</h2>
              <dl className="mt-3 space-y-3 font-mono text-xs">
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="font-sans font-bold text-slate-700">toast enter</dt>
                  <dd className="text-teal-800">220ms · {inCurve}</dd>
                  <dd className="text-slate-500">fade + slide 12px → 0</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="font-sans font-bold text-slate-700">toast exit</dt>
                  <dd className="text-teal-800">160ms · {outCurve}</dd>
                  <dd className="text-slate-500">shorter — never keep users waiting to dismiss</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="font-sans font-bold text-slate-700">modal enter</dt>
                  <dd className="text-teal-800">240ms · {modalCurve}</dd>
                  <dd className="text-slate-500">opacity + scale .96 → 1</dd>
                </div>
              </dl>
              {linearMode && (
                <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
                  🤖 Linear is on: entrances start and stop dead — watch the toast <em>halt</em>
                  instead of settling. That halt is why linear feels robotic.
                </p>
              )}
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">Motion spec</h2>
                <button onClick={() => { navigator.clipboard.writeText(css); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }} className="rounded-lg bg-teal-600 px-3 py-1 text-xs font-bold text-white hover:bg-teal-500">
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <pre className="mt-2 overflow-x-auto font-mono text-[11.5px] leading-relaxed text-teal-100">{css}</pre>
              {logs.length > 0 && (
                <ul className="mt-3 space-y-1 font-mono text-[11px] text-slate-300">
                  {logs.map((l, i) => (
                    <li key={i}>· {l.label} — {l.ms}ms · {l.curve}</li>
                  ))}
                </ul>
              )}
            </div>
            <Link href="/" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-teal-800 shadow-sm transition hover:border-teal-700">← Back to hub</Link>
          </aside>
        </section>
      </main>
    </div>
  );
}
