"use client";

import { useEffect, useState } from "react";
import {
  type Civil,
  type RangeSelection,
  buildWeeks,
  todayCivil,
  toKey,
} from "../lib/civil";
import { DatePicker } from "./date-picker";

const W = 880;
const H = 470;
const CAL_X = 280;
const CAL_Y = 72;
const PAD = 16;
const NAV_H = 36;
const WEEKDAY_H = 32;
const CELL = 40;
const PILL_W = 232;
const PILL_EDGE = PILL_W + 8;

type Accent = "start" | "middle" | "today" | "neutral";

const ACCENT: Record<
  Accent,
  { badge: string; line: string; dot: string; marker: string }
> = {
  start: {
    badge: "bg-indigo-600 text-white",
    line: "#4f46e5",
    dot: "#4f46e5",
    marker: "url(#arr-start)",
  },
  middle: {
    badge: "bg-indigo-100 text-indigo-900 ring-1 ring-inset ring-indigo-200",
    line: "#818cf8",
    dot: "#818cf8",
    marker: "url(#arr-middle)",
  },
  today: {
    badge: "bg-white text-indigo-700 ring-1 ring-indigo-400",
    line: "#6366f1",
    dot: "#6366f1",
    marker: "url(#arr-today)",
  },
  neutral: {
    badge: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
    line: "#94a3b8",
    dot: "#94a3b8",
    marker: "url(#arr-neutral)",
  },
};

type Callout = {
  id: string;
  num: number;
  side: "left" | "right";
  slot: number;
  title: string;
  caption: string;
  accent: Accent;
  target: { x: number; y: number } | null;
};

const cellEdge = (col: number, side: "left" | "right") =>
  CAL_X + PAD + col * CELL + (side === "left" ? 0 : CELL);
const cellRowY = (row: number) => CAL_Y + PAD + NAV_H + WEEKDAY_H + row * CELL + CELL / 2;

export function Anatomy() {
  const [selection, setSelection] = useState<RangeSelection>({ start: null, end: null });
  const [today, setToday] = useState<Civil | null>(null);
  const [view, setView] = useState<Civil>(() => todayCivil());
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const t = todayCivil();
    setToday(t);
    setView({ y: t.y, m: t.m, d: 1 });
    setSelection({
      start: toKey({ y: t.y, m: t.m, d: 20 }),
      end: toKey({ y: t.y, m: t.m, d: 28 }),
    });
  }, []);

  const cells = buildWeeks(view, 1);
  const indexOf = (key: string | null) => (key ? cells.findIndex((c) => c.key === key) : -1);
  const iS = indexOf(selection.start);
  const iE = indexOf(selection.end);
  const iMid = iS >= 0 && iE >= 0 ? Math.floor((iS + iE) / 2) : -1;

  const callouts: Callout[] = [
    {
      id: "prev",
      num: 1,
      side: "left",
      slot: 70,
      title: "button_previous",
      caption: "Chevron that steps the view back one month",
      accent: "neutral",
      target: { x: CAL_X + PAD + 18, y: CAL_Y + PAD + NAV_H / 2 },
    },
    {
      id: "next",
      num: 2,
      side: "right",
      slot: 120,
      title: "button_next",
      caption: "Chevron that steps the view forward one month",
      accent: "neutral",
      target: { x: CAL_X + 312 - PAD - 18, y: CAL_Y + PAD + NAV_H / 2 },
    },
    {
      id: "start",
      num: 3,
      side: "left",
      slot: 250,
      title: "range_start",
      caption: "Solid-filled endpoint — the first day you clicked",
      accent: "start",
      target: iS >= 0 ? { x: cellEdge(iS % 7, "left"), y: cellRowY(Math.floor(iS / 7)) } : null,
    },
    {
      id: "middle",
      num: 4,
      side: "right",
      slot: 200,
      title: "range_middle",
      caption: "The pale tinted stripe between the endpoints",
      accent: "middle",
      target:
        iMid >= 0
          ? { x: cellEdge(iMid % 7 + 1, "left"), y: cellRowY(Math.floor(iMid / 7)) }
          : null,
    },
    {
      id: "end",
      num: 5,
      side: "right",
      slot: 360,
      title: "range_end",
      caption: "Solid-filled endpoint — the second day you clicked",
      accent: "start",
      target:
        iE >= 0
          ? {
              x: cellEdge((iE % 7) + 1, "left"),
              y: cellRowY(Math.floor(iE / 7)) + CELL / 2,
            }
          : null,
    },
    {
      id: "today",
      num: 6,
      side: "left",
      slot: 415,
      title: "today",
      caption: "Outlined, not filled — marks today",
      accent: "today",
      target: (() => {
        if (!today) return null;
        const i = indexOf(toKey(today));
        return i >= 0 ? { x: cellEdge(i % 7, "left"), y: cellRowY(Math.floor(i / 7)) } : null;
      })(),
    },
    {
      id: "grid",
      num: 7,
      side: "right",
      slot: 280,
      title: 'role="grid"',
      caption: "Weekday header + 6×7 day grid — arrows move by day and week, PageUp/Down by month",
      accent: "neutral",
      target: { x: CAL_X + 312, y: CAL_Y + PAD + NAV_H + WEEKDAY_H / 2 },
    },
    {
      id: "trigger",
      num: 8,
      side: "right",
      slot: 40,
      title: "the trigger",
      caption: "The date field — clicking it opens the popover",
      accent: "neutral",
      target: { x: CAL_X + 312, y: 34 },
    },
  ];

  return (
    <div className="overflow-x-auto pb-2">
      <div className="relative mx-auto" style={{ width: W, height: H }}>
        <svg
          className="pointer-events-none absolute inset-0"
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
        >
          <defs>
            {(["start", "middle", "today", "neutral"] as Accent[]).map((a) => (
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
          {callouts
            .filter((c) => c.target)
            .map((c) => {
              const edgeX = c.side === "left" ? PILL_EDGE : W - PILL_EDGE;
              const { x: tx, y: ty } = c.target!;
              const dx = c.side === "left" ? tx - 4 : tx + 4;
              return (
                <g key={c.id}>
                  <polyline
                    points={`${edgeX},${c.slot} ${edgeX},${ty} ${dx},${ty}`}
                    fill="none"
                    stroke={ACCENT[c.accent].line}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    markerEnd={ACCENT[c.accent].marker}
                  />
                  <circle cx={tx} cy={ty} r="3" fill={ACCENT[c.accent].dot} />
                </g>
              );
            })}
        </svg>

        <div className="absolute" style={{ left: CAL_X, top: 8 }}>
          <DatePicker
            selection={selection}
            onSelectionChange={setSelection}
            onViewChange={setView}
            defaultOpen
            lockOpen
            autoFocus={false}
            placeholder="20 Jul — 28 Jul 2026"
            className="w-[312px]"
          />
        </div>

        {callouts.map((c) => (
          <div
            key={c.id}
            className={`absolute z-10 ${c.target ? "" : "opacity-30"}`}
            style={{
              top: c.slot - 18,
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
        Live diagram — click any day and the labels chase your selection.
      </p>
    </div>
  );
}
