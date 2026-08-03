"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ScrollSpyNav } from "./scrollspy";

const W = 900;
const H = 620;
const PILL_W = 244;
const PILL_EDGE = PILL_W + 8;

type Accent = "indigo" | "slate";

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
};

const SECTIONS = [
  { id: "what", label: "What it is" },
  { id: "where", label: "Where it lives" },
  { id: "track", label: "How it tracks" },
  { id: "tabs", label: "Spy vs. tabs" },
  { id: "states", label: "States & edges" },
];

const CALLOUTS: {
  id: string;
  num: number;
  side: "left" | "right";
  slot: number;
  title: string;
  caption: string;
  accent: Accent;
}[] = [
  {
    id: "rail",
    num: 1,
    side: "left",
    slot: 76,
    title: "<nav>",
    caption:
      "The On-this-page rail — a labeled <nav> of fragment links, kept beside the article with position: sticky.",
    accent: "slate",
  },
  {
    id: "current",
    num: 2,
    side: "left",
    slot: 330,
    title: 'aria-current="location"',
    caption:
      "The current-section indicator — exactly one link carries it, plus the sliding accent bar. Watch it chase the section in view.",
    accent: "indigo",
  },
  {
    id: "target",
    num: 3,
    side: "right",
    slot: 240,
    title: "IntersectionObserver.observe()",
    caption:
      "The section anchor target — a real heading whose id matches a rail href. The observer watches it; the line stays glued to it as you scroll.",
    accent: "indigo",
  },
];

export function Anatomy() {
  const [active, setActive] = useState(SECTIONS[0].id);
  const [targets, setTargets] = useState<Record<string, { x: number; y: number } | null>>({});
  const boxRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    const b = box.getBoundingClientRect();
    const pt = (el: Element | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2 };
    };
    setTargets({
      rail: pt(box.querySelector('[data-part="rail"]')),
      current: pt(box.querySelector('[data-part="bar"]')),
      target: pt(document.getElementById(active)),
    });
  }, [active]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const onScroll = () => measure();
    const onResize = () => measure();
    scrollEl?.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      scrollEl?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
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
            {(["indigo", "slate"] as Accent[]).map((a) => (
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

        <div
          ref={scrollRef}
          className="scroll-smooth absolute inset-x-6 top-16 bottom-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]"
        >
          <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-slate-100 bg-white/90 px-5 py-3 backdrop-blur">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-emerald-400" />
            </span>
            <p className="font-mono text-[11px] text-slate-400">docs — scrollspy anatomy</p>
            <span className="ml-auto rounded-full bg-indigo-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-indigo-600">
              scroll me
            </span>
          </div>

          <div className="flex gap-10 px-8 py-7">
            <article className="max-w-[430px] flex-1">
              {SECTIONS.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-16">
                  <h2 className="text-base font-bold tracking-tight text-slate-900">
                    {s.label}
                  </h2>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
                    A scrollspy is a contents list that knows where you are. It does not
                    change the document — it only lights up the link for the section
                    currently on screen, so a long page always answers &ldquo;where am
                    I?&rdquo; without you having to ask.
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-500">
                    The magic is a browser API called IntersectionObserver: it watches a
                    heading and calls back the moment that heading crosses into the
                    activation zone. The callback is what moves the accent bar.
                  </p>
                  <div className="mt-3 h-px bg-slate-100" />
                </section>
              ))}
              <p className="pt-2 text-[13px] leading-relaxed text-slate-500">
                That&apos;s the end — the observer has been firing the whole way down.
              </p>
            </article>

            <aside className="sticky top-14 h-fit w-44 shrink-0">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                On this page
              </p>
              <ScrollSpyNav
                sections={SECTIONS}
                ariaLabel="On this page (anatomy demo)"
                root={scrollRef.current}
                onActiveChange={setActive}
              />
            </aside>
          </div>
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
        Live diagram — scroll the article (or click a link) and the bar, the target line and the
        labels chase you.
      </p>
    </div>
  );
}
