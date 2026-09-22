"use client";

import { useState } from "react";
import { ScenarioNav } from "../../components/nav";

interface Stop {
  title: string;
  detail: string;
  location: string;
  datetime: string;
  timeShort: string;
  timeSub: string;
  icon: "receipt" | "box" | "truck" | "van" | "home";
}

const STOPS: Stop[] = [
  {
    title: "Order placed",
    detail: "Payment confirmed · 3 items",
    location: "Berlin store",
    datetime: "2026-09-14T09:24",
    timeShort: "Sep 14",
    timeSub: "09:24",
    icon: "receipt",
  },
  {
    title: "Packed",
    detail: "Boxed + label printed",
    location: "Fulfilment centre",
    datetime: "2026-09-15T11:02",
    timeShort: "Sep 15",
    timeSub: "11:02",
    icon: "box",
  },
  {
    title: "Shipped",
    detail: "DHL · tracking 8421 0093 77",
    location: "Leipzig hub",
    datetime: "2026-09-16T06:40",
    timeShort: "Sep 16",
    timeSub: "06:40",
    icon: "truck",
  },
  {
    title: "Out for delivery",
    detail: "Courier has your parcel (van 12)",
    location: "Your district",
    datetime: "2026-09-18T07:15",
    timeShort: "Sep 18",
    timeSub: "07:15",
    icon: "van",
  },
  {
    title: "Delivered",
    detail: "Signed by neighbour · photo saved",
    location: "Front door",
    datetime: "2026-09-18T12:30",
    timeShort: "Sep 18",
    timeSub: "12:30",
    icon: "home",
  },
];

function Icon({ kind }: { kind: Stop["icon"] }) {
  const cls = "size-3";
  switch (kind) {
    case "receipt":
      return (
        <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 1.5h8v13l-2-1.4-2 1.4-2-1.4L4 14.5v-13Z" />
          <path d="M6.5 5.5h3M6.5 8h3" />
        </svg>
      );
    case "box":
      return (
        <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 5.5 8 2l6 3.5v5L8 14l-6-3.5v-5Z" />
          <path d="M2 5.5 8 9l6-3.5M8 9v5" />
        </svg>
      );
    case "truck":
      return (
        <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M1.5 4.5h8v7h-8v-7ZM9.5 7h3l2 2.5v2h-5" />
          <circle cx="4.5" cy="12" r="1.4" />
          <circle cx="11.5" cy="12" r="1.4" />
        </svg>
      );
    case "van":
      return (
        <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M1.5 5h8l3 3.5V12h-11V5Z" />
          <circle cx="4.5" cy="12.5" r="1.3" />
          <circle cx="11" cy="12.5" r="1.3" />
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 16 16" className={cls} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 8 8 2.5 14 8" />
          <path d="M4 7.5V13.5h8V7.5" />
          <path d="M5.5 10.5l2 2 3.5-4" />
        </svg>
      );
  }
}

export default function OrderTrackingPage() {
  // Index of the in-progress stop; everything before is done, after is waiting.
  // When it passes the last stop the parcel is delivered (all dots solid).
  const [current, setCurrent] = useState(3);
  const delivered = current > STOPS.length - 1;
  const active = delivered ? STOPS.length - 1 : current;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <ScenarioNav prev={{ href: "/", label: "Hub" }} next={{ href: "/scenarios/product-changelog", label: "Changelog" }} />

      <header className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Scenario 1 — linear tracker</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Parcel tracking</h1>
        <p className="mt-1 text-sm text-slate-500">
          Order <span className="font-mono font-semibold text-slate-700">#DE-88412</span> · DHL Express ·
          arriving today. Press <span className="font-semibold text-slate-700">Advance parcel</span> to
          step the in-progress stop forward and watch the pulsing dot — and the filled connector —
          move with it.
        </p>
      </header>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <p className="text-sm font-bold text-slate-900">Wireless headphones + case</p>
            <p className="mt-0.5 font-mono text-[11px] text-slate-500">tracking 8421 0093 77 · insured</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-bold ${
              delivered ? "bg-teal-700 text-white" : "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/25"
            }`}
            role="status"
          >
            {delivered ? "✓ Delivered" : `● ${STOPS[active].title}`}
          </span>
        </div>

        <ol aria-label="Parcel journey" className="mt-2">
          {STOPS.map((s, i) => {
            const done = delivered || i < current;
            const loading = !delivered && i === current;
            const todo = !delivered && i > current;
            return (
              <li key={s.title} className="grid grid-cols-[92px_36px_1fr] items-stretch gap-2 sm:grid-cols-[110px_36px_1fr]">
                <time dateTime={s.datetime} className="block pt-3.5 text-right font-mono text-[11px] leading-snug text-slate-500">
                  {s.timeShort}
                  <br />
                  <span className="text-slate-400">{s.timeSub}</span>
                </time>
                <span className="relative flex justify-center pt-3" aria-hidden="true">
                  {loading ? (
                    <span className="relative grid size-7 place-items-center">
                      <span className="tl-ping-ring absolute inset-0 rounded-full bg-amber-500/50" />
                      <span className="relative grid size-7 place-items-center rounded-full border-2 border-amber-600 bg-white text-amber-700">
                        <Icon kind={s.icon} />
                      </span>
                    </span>
                  ) : (
                    <span
                      className={`grid size-7 place-items-center rounded-full text-white ${
                        done ? "bg-teal-700" : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      <Icon kind={s.icon} />
                    </span>
                  )}
                  {i < STOPS.length - 1 && (
                    <span
                      className={`absolute left-1/2 top-10 h-[calc(100%-1.75rem+10px)] min-h-6 w-0.5 -translate-x-1/2 rounded-full transition-colors ${
                        delivered || i < active ? "bg-teal-600/60" : "bg-slate-200"
                      }`}
                    />
                  )}
                </span>
                <span className={`rounded-xl px-3 py-3 transition ${loading ? "bg-amber-50/70 ring-1 ring-inset ring-amber-600/20" : ""}`}>
                  <span className={`block text-[13px] font-semibold ${todo ? "text-slate-400" : "text-slate-900"}`}>
                    {s.title}
                    {loading && (
                      <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-amber-800">
                        in transit
                      </span>
                    )}
                    {done && (
                      <span className="ml-2 font-mono text-[10px] font-medium text-teal-700">✓ done</span>
                    )}
                  </span>
                  <span className={`mt-0.5 block text-xs ${todo ? "text-slate-400" : "text-slate-500"}`}>
                    {todo ? "Waiting…" : s.detail} · <span className="text-slate-400">{s.location}</span>
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.min(c + 1, STOPS.length))}
            disabled={delivered}
            className="rounded-full bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {delivered ? "Parcel delivered ✓" : `Advance parcel → ${current === STOPS.length - 1 ? "Delivered" : STOPS[current + 1].title}`}
          </button>
          <button
            type="button"
            onClick={() => setCurrent(0)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-teal-600/40 hover:text-teal-800"
          >
            Replay from start
          </button>
          <p className="ml-auto font-mono text-[11px] text-slate-400">
            step {Math.min(current + 1, STOPS.length)} of {STOPS.length}
          </p>
        </div>
      </section>

      <aside className="mt-4 rounded-2xl border border-teal-700/20 bg-teal-50/60 p-4 shadow-sm">
        <p className="text-xs font-bold text-teal-800">Why a timeline fits here</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          A parcel is a finished-until-now story, not a form to fill: the shopper wants “where has it
          been, where is it now” in one glance. Opposite-side timestamps keep the when scannable,
          status-coloured icon dots say what kind of stop each was, and the single pulsing stop plus
          the filling connector point the eye at exactly one thing — what happens next.
        </p>
      </aside>
    </main>
  );
}
