"use client";

import { useEffect, useRef, useState } from "react";
import { ScenarioNav, Skeleton, Spinner, TopBar } from "../../components/ui";

type Phase = "loading" | "ready" | "refreshing" | "error";

const KPIS = [
  { label: "Revenue", value: "€48,290", delta: "+12.4% vs last week", spark: [35, 55, 42, 68, 58, 80, 74] },
  { label: "Active sailors", value: "8,412", delta: "+3.1% vs last week", spark: [50, 46, 60, 55, 70, 66, 82] },
  { label: "Conversion", value: "4.8%", delta: "+0.6 pts vs last week", spark: [30, 38, 34, 48, 44, 58, 62] },
];

const ACTIVITY = [
  { t: "Booking #FJ-2941 confirmed", d: "Geiranger kayak · 2 guests", time: "2 min ago" },
  { t: "Sauna slot released", d: "Aker Brygge · Sat 18:00", time: "19 min ago" },
  { t: "New review: 5 stars", d: "“Still water, zero engines.”", time: "1 h ago" },
  { t: "Payout to partner sent", d: "Bergen Rowing Club · €1,240", time: "3 h ago" },
];

function now() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

export default function DashboardPage() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [failNext, setFailNext] = useState(false);
  const [log, setLog] = useState<string[]>([
    `${now()} — first paint: card layout is known → skeleton + aria-busy="true"`,
  ]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const push = (msg: string) => setLog((l) => [`${now()} — ${msg}`, ...l].slice(0, 6));

  const initialLoad = () => {
    if (timer.current) clearTimeout(timer.current);
    setPhase("loading");
    push('reload: layout known → skeleton blocks hold KPI geometry');
    timer.current = setTimeout(() => {
      setPhase("ready");
      push("data arrived → skeletons replaced by KPIs (aria-busy=false)");
    }, 2000);
  };

  const refresh = () => {
    if (phase === "refreshing" || phase === "loading") return;
    if (timer.current) clearTimeout(timer.current);
    setPhase("refreshing");
    push('refresh clicked: data already visible → spinner in button (role="status"), stale data dimmed');
    timer.current = setTimeout(() => {
      if (failNext) {
        setPhase("error");
        push("refresh failed → spinner AND skeletons evicted, error state takes over");
      } else {
        setPhase("ready");
        push("refresh done → spinner replaced by fresh numbers, log kept");
      }
    }, 1800);
  };

  // initial load
  useEffect(() => {
    const t = setTimeout(() => {
      setPhase((p) => (p === "loading" ? "ready" : p));
      setLog((l) =>
        l.length === 1
          ? [...l, `${now()} — data arrived → skeletons replaced by KPIs (aria-busy=false)`]
          : l
      );
    }, 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const busy = phase === "loading" || phase === "refreshing";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-teal-700">
          Scenario 3 · Both · chooses correctly
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Dashboard that picks the right loader
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
          <strong className="font-semibold text-foreground">Why it fits here:</strong>{" "}
          a dashboard needs both patterns at once — skeletons when cards first
          load (geometry known), a spinner when refreshing values that are
          already on screen (no new shape), and an error card that replaces
          either the moment something fails. Users always know what&apos;s
          happening, never stare at a stale loader.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface p-4">
          <button
            onClick={refresh}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-teal-700 disabled:opacity-70"
          >
            {phase === "refreshing" && <Spinner size={14} label="Refreshing…" trackClass="text-white/25" arcClass="text-white" />}
            {phase === "refreshing" ? "Refreshing…" : "↻ Refresh data"}
          </button>
          <button
            onClick={initialLoad}
            className="rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-medium transition hover:border-accent hover:text-accent"
          >
            Replay first load
          </button>
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-text-muted">
            <input
              type="checkbox"
              checked={failNext}
              onChange={(e) => setFailNext(e.target.checked)}
              className="size-4 accent-teal-700"
            />
            Next refresh fails
          </label>
          <span
            className={`ml-auto rounded-full px-3 py-1.5 font-mono text-[11px] ${
              busy ? "bg-amber-100 text-amber-900" : phase === "error" ? "bg-red-100 text-red-900" : "bg-teal-100 text-teal-900"
            }`}
            aria-live="polite"
          >
            {phase === "loading"
              ? 'aria-busy="true" · skeleton'
              : phase === "refreshing"
                ? 'role="status" · spinner'
                : phase === "error"
                  ? "error — loaders evicted"
                  : 'aria-busy="false" · ready'}
          </span>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
          <section aria-busy={busy} aria-label="Analytics" className="space-y-4">
            {phase === "loading" ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-2xl border border-border bg-surface p-5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="mt-3 h-8 w-28" />
                    <Skeleton className="mt-2 h-3 w-32" />
                    <div className="mt-4 flex h-10 items-end gap-1.5">
                      {[0, 1, 2, 3, 4, 5, 6].map((b) => (
                        <Skeleton key={b} className="w-full" />
                      ))}
                    </div>
                  </div>
                ))}
                <div className="rounded-2xl border border-border bg-surface p-5 sm:col-span-3">
                  <Skeleton className="h-4 w-48" />
                  <div className="mt-4 space-y-2.5">
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-[92%]" />
                    <Skeleton className="h-3.5 w-[78%]" />
                  </div>
                </div>
              </div>
            ) : phase === "error" ? (
              <div className="animate-pop-in rounded-2xl border border-red-200 bg-red-50/60 p-8 text-center">
                <span className="mx-auto grid size-11 place-items-center rounded-full bg-red-500 text-lg font-bold text-white">
                  !
                </span>
                <p className="mt-3 font-semibold">Couldn&apos;t refresh analytics</p>
                <p className="mx-auto mt-1 max-w-[42ch] text-[13px] text-text-muted">
                  The loader is gone on purpose — neither skeleton nor spinner
                  may remain after an error. Your last good data is one retry away.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setFailNext(false);
                      refresh();
                    }}
                    className="rounded-full bg-stone-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-teal-700"
                  >
                    Retry
                  </button>
                  <button
                    onClick={initialLoad}
                    className="rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-medium transition hover:border-accent hover:text-accent"
                  >
                    Reload from scratch
                  </button>
                </div>
              </div>
            ) : (
              <div className={phase === "refreshing" ? "opacity-60 saturate-50 transition" : "transition"}>
                <div className="grid gap-4 sm:grid-cols-3">
                  {KPIS.map((k) => (
                    <div
                      key={k.label}
                      className="animate-fade-in rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(28,25,23,0.05)]"
                    >
                      <p className="text-[12.5px] font-medium text-text-muted">{k.label}</p>
                      <p className="mt-1 text-[26px] font-semibold tabular-nums tracking-tight">{k.value}</p>
                      <p className="text-[12px] font-medium text-teal-700">{k.delta}</p>
                      <div className="mt-3 flex h-10 items-end gap-1.5" aria-hidden="true">
                        {k.spark.map((h, i) => (
                          <span
                            key={i}
                            style={{ height: `${h}%` }}
                            className="w-full rounded-sm bg-teal-700/70"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold">Latest activity</h2>
                    {phase === "refreshing" && (
                      <span className="inline-flex items-center gap-2 text-[12.5px] text-text-muted">
                        <Spinner size={14} label="Updating activity…" />
                        Updating…
                      </span>
                    )}
                  </div>
                  <ul className="mt-3 divide-y divide-border">
                    {ACTIVITY.map((a) => (
                      <li key={a.t} className="flex items-center justify-between gap-4 py-2.5">
                        <div>
                          <p className="text-[13.5px] font-medium">{a.t}</p>
                          <p className="text-[12.5px] text-text-muted">{a.d}</p>
                        </div>
                        <span className="shrink-0 text-[12px] text-text-faint">{a.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* decision log */}
          <aside className="h-fit rounded-2xl border border-border bg-stone-950 p-5 text-white lg:sticky lg:top-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
              Decision log
            </p>
            <p className="mt-1 text-[13px] text-white/65">
              Which indicator, and why — as the dashboard sees it.
            </p>
            <ul className="mt-3 space-y-2" aria-live="polite">
              {log.map((l, i) => (
                <li
                  key={`${l}-${i}`}
                  className={`rounded-xl px-3 py-2 font-mono text-[11.5px] leading-relaxed ${
                    i === 0 ? "bg-teal-500/20 text-teal-100" : "bg-white/5 text-white/55"
                  }`}
                >
                  {l}
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-white/10 pt-3 text-[12px] leading-relaxed text-white/50">
              Rule of thumb: <span className="text-white">new layout → skeleton</span>;
              updating visible numbers → <span className="text-white">spinner</span>;
              answer in hand → <span className="text-white">neither</span>.
            </div>
          </aside>
        </div>

        <ScenarioNav
          prev={{ href: "/scenarios/checkout", label: "Checkout payment" }}
        />
      </main>
    </div>
  );
}
