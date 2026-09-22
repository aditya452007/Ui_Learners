"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  TimelineConnector,
  TimelineDot,
  TimelineOppositeContent,
} from "./timeline";

const W = 960;
const H = 640;
const PILL_W = 296;
const PILL_EDGE = PILL_W + 6;

type Accent = "teal" | "slate" | "white";

const ACCENT: Record<Accent, { badge: string; line: string; dot: string; marker: string }> = {
  teal: {
    badge: "bg-teal-700 text-white",
    line: "#0F766E",
    dot: "#0F766E",
    marker: "url(#arr-teal)",
  },
  slate: {
    badge: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
    line: "#94a3b8",
    dot: "#94a3b8",
    marker: "url(#arr-slate)",
  },
  white: {
    badge: "bg-white text-teal-800 ring-1 ring-teal-600",
    line: "#0d9488",
    dot: "#0d9488",
    marker: "url(#arr-white)",
  },
};

interface CalloutDef {
  id: string;
  num: number;
  side: "left" | "right";
  slot: number;
  title: string;
  caption: string;
  accent: Accent;
}

const CALLOUTS: CalloutDef[] = [
  {
    id: "dot",
    num: 1,
    side: "left",
    slot: 84,
    title: "<TimelineDot />",
    caption: "One small circle per event, centred on the line — solid once finished, and it can hold an icon.",
    accent: "teal",
  },
  {
    id: "time",
    num: 3,
    side: "left",
    slot: 330,
    title: "<TimelineOppositeContent>",
    caption: "Fixed-width column across the line — a <time datetime> right-aligned back toward the dots.",
    accent: "slate",
  },
  {
    id: "connector",
    num: 2,
    side: "right",
    slot: 190,
    title: "<TimelineConnector />",
    caption: "Thin vertical segment owned by each item, dot-to-dot — omitted after the last event.",
    accent: "slate",
  },
  {
    id: "loading",
    num: 4,
    side: "right",
    slot: 470,
    title: "loading: true",
    caption: "The latest event stays hollow + pulsing with muted text until complete — then it turns solid.",
    accent: "white",
  },
];

interface HubEvent {
  title: string;
  detail: string;
  datetime: string;
  timeShort: string;
  timeSub: string;
}

const EVENTS: HubEvent[] = [
  {
    title: "Project created",
    detail: "Kickoff doc signed, repo opened.",
    datetime: "2026-01-12T09:00",
    timeShort: "Jan 12",
    timeSub: "09:00",
  },
  {
    title: "Designs approved",
    detail: "Homepage + pricing signed off.",
    datetime: "2026-01-20T14:30",
    timeShort: "Jan 20",
    timeSub: "14:30",
  },
  {
    title: "Beta released",
    detail: "200 testers invited, flags on.",
    datetime: "2026-02-02T10:00",
    timeShort: "Feb 2",
    timeSub: "10:00",
  },
  {
    title: "Public launch",
    detail: "Announcement post + changelog.",
    datetime: "2026-02-18T09:00",
    timeShort: "Feb 18",
    timeSub: "09:00",
  },
  {
    title: "Post-launch review",
    detail: "Collecting feedback, numbers pending.",
    datetime: "2026-02-25T15:00",
    timeShort: "Feb 25",
    timeSub: "15:00",
  },
];

export function Anatomy() {
  const [selected, setSelected] = useState(4);
  const [completed, setCompleted] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const [targets, setTargets] = useState<Record<string, { x: number; y: number } | null>>({});

  const last = EVENTS.length - 1;
  const isLoading = (i: number) => i === last && !completed;

  const measure = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    const b = box.getBoundingClientRect();
    const pt = (el: Element | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2 };
    };
    const dots = Array.from(box.querySelectorAll<HTMLElement>('[data-part="dot"]'));
    const conns = Array.from(box.querySelectorAll<HTMLElement>('[data-part="connector"]'));
    const times = Array.from(box.querySelectorAll<HTMLElement>('[data-part="time"]'));
    const end = box.querySelector<HTMLElement>('[data-part="connector-end"]');
    setTargets({
      dot: pt(dots[selected] ?? null),
      time: pt(times[selected] ?? null),
      connector: selected < last ? pt(conns[selected] ?? null) : pt(end),
      loading: pt(dots[dots.length - 1] ?? null),
    });
  }, [selected]);

  useLayoutEffect(() => {
    measure();
  }, [measure, completed]);

  useEffect(() => {
    const onR = () => measure();
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, [measure]);

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div ref={boxRef} className="relative mx-auto" style={{ width: W, height: H }}>
          <svg
            className="pointer-events-none absolute inset-0"
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
          >
            <defs>
              {(["teal", "slate", "white"] as Accent[]).map((a) => (
                <marker
                  key={a}
                  id={`arr-${a}`}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6.5"
                  markerHeight="6.5"
                  orient="auto-start-reverse"
                >
                  <path d="M0 0 L10 5 L0 10 z" fill={ACCENT[a].line} />
                </marker>
              ))}
            </defs>
            {CALLOUTS.map((c) => {
              const t = targets[c.id];
              if (!t) return null;
              const edgeX = c.side === "left" ? PILL_EDGE : W - PILL_EDGE;
              const dx = c.side === "left" ? t.x - 4 : t.x + 4;
              return (
                <g key={c.id}>
                  <polyline
                    points={`${edgeX},${c.slot} ${edgeX},${t.y} ${dx},${t.y}`}
                    fill="none"
                    stroke={ACCENT[c.accent].line}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    markerEnd={ACCENT[c.accent].marker}
                  />
                  <circle cx={t.x} cy={t.y} r="3" fill={ACCENT[c.accent].dot} />
                </g>
              );
            })}
          </svg>

          {/* Center: live vertical timeline */}
          <div className="absolute top-6" style={{ left: 332, width: 296 }}>
            <ol aria-label="Project history (anatomy)" className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              {EVENTS.map((e, i) => {
                const loading = isLoading(i);
                const active = i === selected;
                return (
                  <li key={e.title}>
                    <button
                      type="button"
                      onClick={() => setSelected(i)}
                      aria-pressed={active}
                      className={`grid w-full grid-cols-[86px_28px_1fr] items-start gap-2 rounded-xl px-2 py-3 text-left transition ${
                        active ? "bg-teal-50 ring-1 ring-inset ring-teal-600/30" : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="pt-0.5">
                        <TimelineOppositeContent datetime={e.datetime}>
                          {e.timeShort}
                          <br />
                          <span className="text-slate-400">{e.timeSub}</span>
                        </TimelineOppositeContent>
                      </span>
                      <span className="relative flex justify-center pt-0.5">
                        <TimelineDot
                          loading={loading}
                          label={loading ? `${e.title} (in progress)` : `${e.title} (finished)`}
                        >
                          {!loading && (
                            <svg viewBox="0 0 10 10" className="size-2.5" aria-hidden="true">
                              <path
                                d="M1.5 5.2 4 7.5 8.5 2.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </TimelineDot>
                        {i < last ? (
                          <TimelineConnector filled={i < last - 1 || completed} />
                        ) : (
                          <span
                            data-part="connector-end"
                            aria-hidden="true"
                            className="absolute left-1/2 top-5 -translate-x-1/2"
                          >
                            <span className="block h-3.5 w-0.5 rounded-full bg-transparent" />
                            <span className="-ml-[3px] block size-2 rounded-full border-2 border-dashed border-slate-300 bg-white" />
                          </span>
                        )}
                      </span>
                      <span>
                        <span
                          className={`block text-[13px] font-semibold ${
                            loading ? "text-slate-400" : "text-slate-900"
                          }`}
                        >
                          {e.title}
                          {loading && (
                            <span className="ml-2 rounded-full bg-teal-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide text-teal-700 ring-1 ring-inset ring-teal-600/20">
                              in progress
                            </span>
                          )}
                        </span>
                        <span className={`mt-0.5 block text-xs leading-snug ${loading ? "text-slate-400" : "text-slate-500"}`}>
                          {e.detail}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {CALLOUTS.map((c) => (
            <div
              key={c.id}
              className={`absolute z-10 ${targets[c.id] ? "" : "opacity-30"}`}
              style={{
                top: c.slot - 20,
                left: c.side === "left" ? 0 : undefined,
                right: c.side === "left" ? undefined : 0,
                width: PILL_W,
              }}
            >
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <p className="flex items-center gap-2">
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${ACCENT[c.accent].badge}`}
                  >
                    {c.num}
                  </span>
                  <span className="truncate font-mono text-[11px] font-semibold text-slate-900">
                    {c.title}
                  </span>
                </p>
                <p className="mt-1 pl-7 text-[11px] leading-snug text-slate-500">{c.caption}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-3 w-fit text-center text-xs text-slate-400">
          Live diagram — click any event and the labels chase your selection. The connector visibly
          stops at the last dot (dashed end-cap).
        </p>
      </div>

      <div className="mx-auto mt-4 flex w-fit flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setCompleted((v) => !v)}
          className="rounded-full bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          {completed ? "Reset to in-progress" : "Complete in-progress → turn dot solid"}
        </button>
        <p className="font-mono text-[11px] text-slate-500">
          loading: {completed ? "false" : "true"}
        </p>
      </div>
    </div>
  );
}
