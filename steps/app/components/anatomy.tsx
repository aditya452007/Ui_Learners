"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Steps } from "./steps";

const W = 900;
const H = 600;
const PILL_W = 244;
const PILL_EDGE = PILL_W + 8;

type Accent = "indigo" | "slate" | "white" | "red";

const ACCENT: Record<Accent, { badge: string; line: string; dot: string; marker: string }> = {
  indigo: {
    badge: "bg-indigo-600 text-white",
    line: "#4f46e5",
    dot: "#4f46e5",
    marker: "url(#arr-indigo)",
  },
  slate: {
    badge: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
    line: "#94a3b8",
    dot: "#94a3b8",
    marker: "url(#arr-slate)",
  },
  white: {
    badge: "bg-white text-indigo-700 ring-1 ring-indigo-400",
    line: "#6366f1",
    dot: "#6366f1",
    marker: "url(#arr-white)",
  },
  red: {
    badge: "bg-red-600 text-white",
    line: "#ef4444",
    dot: "#ef4444",
    marker: "url(#arr-red)",
  },
};

const ITEMS = ["Cart", "Shipping", "Payment", "Confirmation"];

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
    id: "ol",
    num: 1,
    side: "left",
    slot: 90,
    title: "<ol>",
    caption:
      "An ordered list — the stages have real sequence, so assistive tech can announce “step 3 of 4”.",
    accent: "slate",
  },
  {
    id: "indicator",
    num: 2,
    side: "left",
    slot: 235,
    title: "Steps.Indicator",
    caption: "The numbered circle (Material UI: StepIcon) — one compact circle per stage holding the stage number.",
    accent: "indigo",
  },
  {
    id: "completed",
    num: 3,
    side: "left",
    slot: 380,
    title: "Steps.Status — complete",
    caption: "Finished stages swap the number for a checkmark while keeping their label.",
    accent: "indigo",
  },
  {
    id: "current",
    num: 4,
    side: "left",
    slot: 520,
    title: 'aria-current="step"',
    caption: "The one stage you are on — every other stage is derived from it.",
    accent: "white",
  },
  {
    id: "connector",
    num: 5,
    side: "right",
    slot: 100,
    title: "StepConnector",
    caption: "The line between the circles (Steps.Separator) — tinted behind you, muted ahead.",
    accent: "slate",
  },
  {
    id: "label",
    num: 6,
    side: "right",
    slot: 245,
    title: "StepLabel",
    caption: "The short caption under each number (Steps.Title) — Shipping, Payment…",
    accent: "slate",
  },
  {
    id: "index",
    num: 7,
    side: "right",
    slot: 400,
    title: "activeStep={2}",
    caption: "One zero-based index drives complete, current and upcoming — you cannot paint the steps out of sync.",
    accent: "indigo",
  },
];

export function Anatomy() {
  const [current, setCurrent] = useState(2);
  const [targets, setTargets] = useState<Record<string, { x: number; y: number } | null>>({});
  const boxRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    const b = box.getBoundingClientRect();
    const pt = (el: Element | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2 };
    };
    const circles = Array.from(box.querySelectorAll<HTMLElement>('[data-part="circle"]'));
    const conns = Array.from(box.querySelectorAll<HTMLElement>('[data-part="connector"]'));
    const labels = Array.from(box.querySelectorAll<HTMLElement>('[data-part="label"]'));
    const ol = box.querySelector<HTMLElement>('[data-part="ol"]');
    const olRect = ol?.getBoundingClientRect();
    const last = ITEMS.length - 1;
    setTargets({
      ol: olRect ? { x: olRect.left - b.left + 10, y: olRect.top - b.top + olRect.height / 2 } : null,
      indicator: pt(circles[Math.min(current + 1, last)] ?? null),
      connector: pt(conns[Math.min(current, last - 1)] ?? null),
      completed: current > 0 ? pt(circles[current - 1] ?? null) : null,
      current: pt(circles[current] ?? null),
      label: pt(labels[current] ?? null),
      index: olRect ? { x: olRect.left - b.left + olRect.width / 2, y: olRect.bottom - b.top + 16 } : null,
    });
  }, [current]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const onR = () => measure();
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, [measure]);

  return (
    <div className="overflow-x-auto pb-2">
      <div ref={boxRef} className="relative mx-auto" style={{ width: W, height: H }}>
        <svg
          className="pointer-events-none absolute inset-0"
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
        >
          <defs>
            {(["indigo", "slate", "white", "red"] as Accent[]).map((a) => (
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

        <div className="absolute left-40 right-40 top-9">
          <Steps
            items={ITEMS}
            current={current}
            onStepClick={setCurrent}
            size="lg"
            ariaLabel="Checkout progress (anatomy)"
          />
        </div>

        {CALLOUTS.map((c) => (
          <div
            key={c.id}
            className={`absolute z-10 ${targets[c.id] ? "" : "opacity-30"}`}
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
        Live diagram — click any circle and the labels chase you.
      </p>
    </div>
  );
}
