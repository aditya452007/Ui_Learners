"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const API_CHIPS = [
  "position: sticky",
  "position: fixed",
  "top",
  "nearest scrolling container",
  "transformed containing block",
];

const SECTIONS = [
  {
    id: "a",
    label: "Section A · Getting started",
    color: "bg-teal-700",
    items: [
      "Sticky lives in normal layout first — it takes up space like any block.",
      "Scroll the panel below and watch header A ride up with the content…",
      "…until its top edge hits the dashed threshold line. Then it stops.",
      "Keep scrolling: the header is pinned, the list slides underneath it.",
    ],
  },
  {
    id: "b",
    label: "Section B · The handoff",
    color: "bg-amber-600",
    items: [
      "Header B scrolls up normally while A stays pinned above it.",
      "When B reaches the threshold it shoves A off — a clean handoff.",
      "This push-and-replace is the signature sticky motion.",
      "Fixed elements never do this: they never scroll, never get pushed.",
    ],
  },
  {
    id: "c",
    label: "Section C · Trapped inside",
    color: "bg-sky-700",
    items: [
      "Scroll to the very bottom: header C unpins and scrolls away.",
      "Sticky can never leave its scroll container — the panel is a cage.",
      "A fixed element has no cage: it ignores every scroll container.",
      "End of demo content. Scroll back up to watch it all reverse.",
    ],
  },
];

function Pill({
  n,
  active,
  onClick,
  label,
}: {
  n: number;
  active?: boolean;
  onClick?: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Inspect part ${n}: ${label}`}
      aria-pressed={!!active}
      className={`grid size-6 shrink-0 place-items-center rounded-full text-[12px] font-bold shadow-md ring-2 ring-white transition-transform hover:scale-110 ${
        active ? "scale-110 bg-stone-900 text-white" : "bg-teal-700 text-white"
      }`}
    >
      {n}
    </button>
  );
}

type PartId = "threshold" | "container" | "fixed";

const PARTS: { id: PartId; n: number; name: string; symbol: string; see: string; how: string }[] = [
  {
    id: "threshold",
    n: 1,
    name: "Sticky threshold",
    symbol: "top",
    see: "The dashed teal line inside the panel. Drag the threshold slider and the line moves — the header always stops exactly on it. It answers “where does the header stop scrolling and stick?”.",
    how: "top is a CSS length, like top: 12px: it sets the inset from the container's top edge where a position: sticky element becomes pinned. State is the value this page remembers (the slider's number); when it changes, React re-draws — renders — the header style and the dashed line together. Think of it as a doorstop screwed to the panel: the header slides until it hits the stop.",
  },
  {
    id: "container",
    n: 2,
    name: "Sticky scroll container",
    symbol: "position: sticky",
    see: "The rounded panel with its own scrollbar — the cage the headers are trapped inside. Toggle its outline to see the boundary: no sticky header can ever render outside it, and when you reach the bottom the pinned header unpins and scrolls away.",
    how: "position: sticky means: lay out normally, then pin inside the nearest scrolling container — the closest ancestor that scrolls (here the panel with overflow-y: auto). Scroll events fire as you drag that panel; each one re-checks every header's position and flips it between scrolling and pinned. Like a fridge magnet that slides up the door but can't leave the fridge.",
  },
  {
    id: "fixed",
    n: 3,
    name: "Fixed anchor (the viewport)",
    symbol: "position: fixed",
    see: "The dark pill pinned to your browser's bottom-right corner — scroll this whole page and it doesn't move a pixel. It is removed from the page flow entirely and glued to the viewport (the browser window), not to any panel.",
    how: "position: fixed removes the element from normal flow — it takes up no space, like a sticky note held over the page — and anchors it to the viewport from the start. Gotcha: any ancestor with a transform, filter, or perspective becomes its containing block instead, and the 'viewport' pin silently breaks. Scenario 3 lets you flip that trap on and watch it happen.",
  },
];

export default function Home() {
  const [threshold, setThreshold] = useState(12);
  const [showThreshold, setShowThreshold] = useState(true);
  const [showContainer, setShowContainer] = useState(true);
  const [stacked, setStacked] = useState(true);
  const [showFixed, setShowFixed] = useState(true);
  const [selected, setSelected] = useState<PartId>("threshold");
  const [stuck, setStuck] = useState<string | null>(null);
  const [scrollPct, setScrollPct] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const headerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const visible = stacked ? SECTIONS : SECTIONS.slice(0, 1);
  const part = PARTS.find((p) => p.id === selected) ?? PARTS[0];

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const onScroll = () => {
      const max = panel.scrollHeight - panel.clientHeight;
      setScrollPct(max > 0 ? Math.round((panel.scrollTop / max) * 100) : 0);
      const cTop = panel.getBoundingClientRect().top;
      let current: string | null = null;
      for (const s of visible) {
        const el = headerRefs.current[s.id];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        // stuck when header's top is at/past the pin line but its section still owns the line
        if (r.top <= cTop + threshold + 1.5) current = s.id;
      }
      setStuck(current);
    };
    onScroll();
    panel.addEventListener("scroll", onScroll, { passive: true });
    return () => panel.removeEventListener("scroll", onScroll);
  }, [threshold, stacked, visible.length]);

  const resetDemo = () => {
    panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-10">
        {/* Header */}
        <header className="max-w-3xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-teal-700">
            NameThatUI lab · web · sticky-fixed
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900">
            Sticky vs. Fixed Positioning
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Also called: sticky header, fixed header, pinned element
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-600">
            “The header that stays while the panel scrolls” is{" "}
            <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[13px] text-stone-800">
              position: sticky
            </code>{" "}
            — it scrolls normally until it reaches its{" "}
            <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[13px] text-stone-800">
              top
            </code>{" "}
            inset, then pins inside its scroll container. “The button fixed in
            the corner” is{" "}
            <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[13px] text-stone-800">
              position: fixed
            </code>{" "}
            — ripped out of the page flow and glued to the viewport from the
            start. Scroll the panel below: the labels chase whichever header is
            pinned.
          </p>
        </header>

        <div className="flex flex-wrap gap-1.5">
          {API_CHIPS.map((c) => (
            <span
              key={c}
              className="rounded-full border border-stone-200 bg-white px-2.5 py-1 font-mono text-[11px] text-stone-600"
            >
              {c}
            </span>
          ))}
        </div>

        {/* What am I looking at */}
        <section className="grid gap-3 sm:grid-cols-3">
          {[
            {
              t: "Normal flow → scrolls away",
              d: "Default blocks ride up and vanish. Nothing pins, nothing follows. This is the baseline both patterns depart from.",
              s: "position: static · the default",
            },
            {
              t: "Sticky → scrolls, then pins",
              d: "Header A below scrolls with its section, stops on the dashed line, then gets pushed off by header B. Trapped in its panel.",
              s: "parts 1–2 · sticky + top",
            },
            {
              t: "Fixed → never scrolls",
              d: "The dark pill in your browser corner ignores every scrollbar on this page. Dismiss it, bring it back — it never joins the flow.",
              s: "part 3 · position: fixed",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <p className="text-sm font-semibold text-stone-900">{c.t}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-stone-600">{c.d}</p>
              <p className="mt-2 font-mono text-[11px] text-stone-400">{c.s}</p>
            </div>
          ))}
        </section>

        {/* Live anatomy */}
        <section className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-teal-700">
              Live anatomy
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              Two named parts, plus the lookalike
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
              This is the real component, not a picture. Scroll inside the panel
              — pill ① marks the threshold line, pill ② the cage, pill ③ the
              viewport-pinned badge. Click any pill to inspect that part.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2">
              <label htmlFor="top-slider" className="font-mono text-[11px] text-stone-500">
                top =
              </label>
              <input
                id="top-slider"
                type="range"
                min={0}
                max={48}
                step={4}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="h-1 w-32 accent-teal-700"
              />
              <span className="min-w-12 font-mono text-[11px] font-bold text-stone-900">
                {threshold}px
              </span>
            </div>
            <div
              role="group"
              aria-label="Header count"
              className="flex rounded-lg border border-stone-200 bg-white p-1"
            >
              {(
                [
                  { id: true, label: "3 stacked headers" },
                  { id: false, label: "1 header" },
                ] as const
              ).map((m) => (
                <button
                  key={m.label}
                  type="button"
                  aria-pressed={stacked === m.id}
                  onClick={() => setStacked(m.id)}
                  className={`rounded-md px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                    stacked === m.id
                      ? "bg-stone-900 text-white shadow-sm"
                      : "text-stone-500 hover:bg-stone-100"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {(
              [
                { v: showThreshold, s: setShowThreshold, l: "threshold line" },
                { v: showContainer, s: setShowContainer, l: "container outline" },
                { v: showFixed, s: setShowFixed, l: "fixed badge" },
              ] as const
            ).map((t) => (
              <button
                key={t.l}
                type="button"
                role="switch"
                aria-checked={t.v}
                onClick={() => t.s(!t.v)}
                className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 transition-colors hover:border-teal-700/40"
              >
                <span
                  className={`relative h-4 w-7 rounded-full transition-colors ${t.v ? "bg-teal-700" : "bg-stone-300"}`}
                >
                  <span
                    className={`absolute top-0.5 size-3 rounded-full bg-white shadow transition-all ${t.v ? "left-3.5" : "left-0.5"}`}
                  />
                </span>
                {t.l}
              </button>
            ))}
            <button
              type="button"
              onClick={resetDemo}
              className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 hover:border-teal-700/40 hover:text-teal-800"
            >
              Back to top
            </button>
          </div>

          <div
            className={`relative overflow-hidden rounded-2xl border bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition-colors sm:p-8 ${
              showContainer ? "border-teal-700/50" : "border-stone-300/70"
            }`}
          >
            {/* pill 2 — container label */}
            <div className="mb-3 flex items-center gap-2">
              <Pill n={2} label="Scroll container" active={selected === "container"} onClick={() => setSelected("container")} />
              <button
                type="button"
                onClick={() => setSelected("container")}
                className={`rounded-lg border px-2.5 py-1.5 text-left text-[12px] shadow-sm transition-colors ${
                  selected === "container"
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 bg-white text-stone-600 hover:border-teal-700/40"
                }`}
              >
                <span className="font-semibold">Sticky scroll container</span>{" "}
                <span className="font-mono text-[10px] opacity-70">position: sticky&apos;s cage · overflow-y: auto</span>
              </button>
              <span className="ml-auto hidden items-center gap-2 font-mono text-[11px] text-stone-400 sm:flex">
                panel scroll {scrollPct}%
                <span className="inline-block h-1.5 w-24 overflow-hidden rounded-full bg-stone-100">
                  <span className="block h-full rounded-full bg-teal-700 transition-all" style={{ width: `${scrollPct}%` }} />
                </span>
              </span>
            </div>

            {/* The scroll container */}
            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
              <div
                ref={panelRef}
                className={`thin-scroll relative h-[380px] overflow-y-auto rounded-xl border bg-[#fafaf9] ${
                  showContainer ? "border-teal-700/60 ring-1 ring-teal-700/30" : "border-stone-200"
                }`}
              >
                {/* threshold line overlay */}
                {showThreshold && (
                  <div
                    className="pointer-events-none sticky z-30 ml-12 mr-3"
                    style={{ top: threshold }}
                    aria-hidden
                  >
                    <div className="-translate-y-1/2">
                      <div className="flex items-center gap-2">
                        <Pill n={1} label="Threshold" active={selected === "threshold"} onClick={() => setSelected("threshold")} />
                        <div className="h-0 flex-1 border-t-2 border-dashed border-teal-600" />
                        <span className="rounded bg-teal-700 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                          top: {threshold}px
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {visible.map((s, si) => (
                  <div key={s.id}>
                    <div
                      ref={(el) => {
                        headerRefs.current[s.id] = el;
                      }}
                      style={{ top: threshold }}
                      className={`sticky z-20 flex items-center gap-2 border-y px-4 py-2.5 backdrop-blur ${
                        stuck === s.id
                          ? "border-teal-700/40 bg-white/95 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                          : "border-stone-200 bg-white/90"
                      } ${selected === "threshold" ? "ring-1 ring-inset ring-teal-700/30" : ""}`}
                    >
                      <span className={`size-2.5 rounded-full ${s.color}`} />
                      <p className="text-[13px] font-semibold text-stone-900">{s.label}</p>
                      <span
                        className={`ml-auto rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                          stuck === s.id ? "bg-teal-700 text-white" : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {stuck === s.id ? "● pinned" : "○ scrolling"}
                      </span>
                    </div>
                    <div className="space-y-2.5 px-4 py-4">
                      {s.items.map((line, i) => (
                        <p
                          key={i}
                          className={`rounded-lg border px-3 py-2.5 text-[13px] leading-relaxed ${
                            si === 0 && i === 0
                              ? "border-stone-300 bg-white font-medium text-stone-800"
                              : "border-stone-200/70 bg-white text-stone-600"
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                      <div className="flex gap-2 px-1 pb-1">
                        {[40, 65, 30].map((w, k) => (
                          <span key={k} className="h-1.5 rounded-full bg-stone-200" style={{ width: `${w}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <p className="border-t border-dashed border-stone-300 px-4 py-3 text-center font-mono text-[11px] text-stone-400">
                  — container ends here · sticky cannot pass this line —
                </p>
              </div>

              {/* side: fixed explainer miniature */}
              <div className="flex flex-col gap-3">
                <div className="rounded-xl border border-stone-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <Pill n={3} label="Fixed anchor" active={selected === "fixed"} onClick={() => setSelected("fixed")} />
                    <p className="text-[13px] font-semibold text-stone-900">Viewport miniature</p>
                  </div>
                  <div className="relative mt-3 h-44 overflow-hidden rounded-lg border border-stone-300 bg-[#fafaf9]">
                    <div className="space-y-1.5 p-2.5">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div key={i} className="h-1.5 rounded-full bg-stone-200" style={{ width: `${55 + ((i * 37) % 40)}%` }} />
                      ))}
                    </div>
                    <span className="absolute inset-x-0 top-0 border-b border-stone-200 bg-white/90 px-2 py-1 font-mono text-[9px] text-stone-400">
                      viewport — scrolls, badge doesn&apos;t
                    </span>
                    <span className="absolute bottom-2 right-2 rounded-full bg-stone-900 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg">
                      fixed ●
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-stone-500">
                    In the miniature, the dark dot is glued to the frame while
                    the grey lines scroll. The real thing is live on this page…
                  </p>
                </div>
                <div className="rounded-xl bg-stone-900 p-4 font-mono text-[11px] leading-relaxed text-stone-300">
                  <p>
                    <span className="text-stone-500">.sticky-h</span> {"{"}
                  </p>
                  <p className="pl-3">
                    position: <span className="text-teal-300">sticky</span>;
                  </p>
                  <p className="pl-3">
                    top: <span className="text-amber-300">{threshold}px</span>;
                  </p>
                  <p>{"}"}</p>
                  <p className="mt-2">
                    <span className="text-stone-500">.fixed-badge</span> {"{"}
                  </p>
                  <p className="pl-3">
                    position: <span className="text-teal-300">fixed</span>;
                  </p>
                  <p className="pl-3">
                    bottom: <span className="text-amber-300">16px</span>; right:{" "}
                    <span className="text-amber-300">16px</span>;
                  </p>
                  <p>{"}"}</p>
                </div>
              </div>
            </div>

            {/* selected part explainer */}
            <div className="mt-4 rounded-2xl border border-teal-700/25 bg-teal-50/60 p-5">
              <p className="text-sm font-semibold text-stone-900">
                <span className="mr-2 inline-grid size-5 place-items-center rounded-full bg-teal-700 align-middle text-[11px] font-bold text-white">
                  {part.n}
                </span>
                {part.name}{" "}
                <code className="ml-1 rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-teal-800">
                  {part.symbol}
                </code>
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-white p-4 ring-1 ring-stone-200/60">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                    What you see
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-stone-700">{part.see}</p>
                </div>
                <div className="rounded-xl bg-white p-4 ring-1 ring-stone-200/60">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                    How it works
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-stone-700">{part.how}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Every part reference */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-stone-900">
            Every named part, in plain words
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {PARTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p.id)}
                className={`rounded-xl border bg-white p-4 text-left transition-shadow hover:shadow-md ${
                  selected === p.id ? "border-stone-900 shadow-md" : "border-stone-200"
                }`}
              >
                <p className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                  <span
                    className={`grid size-5 place-items-center rounded-full text-[11px] font-bold text-white ${selected === p.id ? "bg-stone-900" : "bg-teal-700"}`}
                  >
                    {p.n}
                  </span>
                  {p.name}
                </p>
                <p className="mt-1 font-mono text-[11px] text-teal-800">{p.symbol}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-stone-600">
                  <strong className="font-semibold text-stone-800">What you see — </strong>
                  {p.see}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
                  <strong className="font-semibold text-stone-800">How it works — </strong>
                  {p.how}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Sticky vs fixed table */}
        <section className="flex flex-col gap-3">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-teal-700">
            Lookalike, different job
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
            Sticky vs. fixed, side by side
          </h2>
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="grid grid-cols-[1fr_1fr_1fr] text-xs sm:text-sm">
              <div className="border-b border-stone-100 bg-stone-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400 sm:py-3">
                Question
              </div>
              <div className="border-b border-l border-stone-100 bg-stone-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400 sm:py-3">
                Sticky
              </div>
              <div className="border-b border-l border-stone-100 bg-teal-50/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-teal-800 sm:py-3">
                Fixed
              </div>
              {[
                ["Where does it start?", "In normal flow — takes up space, scrolls with content", "Out of flow from the start — floats over the page"],
                ["What pins it?", "The top inset: it sticks when it reaches top inside its container", "The viewport (or transformed ancestor): anchored immediately"],
                ["What bounds it?", "Its nearest scrolling container — it can never leave the cage", "Nothing scrolls it — it ignores every scroll container"],
                ["What pushes it away?", "The next sticky header shoves it off (the handoff)", "Nothing — it never moves, never gets pushed"],
                ["Reach for it when…", "Table & section headers that must stay visible while their panel scrolls", "Viewport controls that must survive everything: buy bars, help buttons"],
              ].map(([q, a, b]) => (
                <div key={q} className="contents">
                  <div className="px-4 py-2.5 font-medium text-stone-700 sm:py-3">{q}</div>
                  <div className="border-l border-stone-100 px-4 py-2.5 text-stone-500 sm:py-3">{a}</div>
                  <div className="border-l border-stone-100 bg-teal-50/60 px-4 py-2.5 font-medium text-stone-700 sm:py-3">
                    {b}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gotchas */}
        <section className="grid gap-3 sm:grid-cols-3">
          {[
            {
              t: "Sticky needs a top value",
              d: "position: sticky with no top (or bottom/left/right) does nothing — there is no threshold to stick at. Always pair them: sticky + top: 0 at minimum.",
            },
            {
              t: "Sticky needs room to travel",
              d: "If the header is as tall as its container, or an ancestor clips with overflow: hidden, there is nowhere to stick. The cage must be taller than the magnet.",
            },
            {
              t: "Fixed breaks inside transforms",
              d: "Any ancestor with transform, filter, or perspective hijacks fixed positioning — the element pins to that ancestor instead of the viewport. Scenario 3 reproduces the bug live.",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-stone-900">⚠ {c.t}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-stone-600">{c.d}</p>
            </div>
          ))}
        </section>

        {/* Scenarios */}
        <section className="flex flex-col gap-3">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-teal-700">
            Where it belongs
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
            Three places pinning earns its keep
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                href: "/scenarios/data-table",
                tag: "sticky · top: 0 · thead",
                t: "Expense ledger table",
                d: "The canonical sticky: a thead pinned to a scrolling card so 60 rows never lose their column labels.",
              },
              {
                href: "/scenarios/grouped-feed",
                tag: "sticky · stacked day dividers",
                t: "Team chat history",
                d: "Date dividers that stick, hand off, and stop at the panel's end — the cage made visible.",
              },
              {
                href: "/scenarios/fixed-controls",
                tag: "fixed · viewport buy bar",
                t: "Product page buy bar",
                d: "A buy bar + help button glued to the viewport, next to a sticky sub-nav that knows its place.",
              },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-teal-700/40 hover:shadow-md"
              >
                <p className="font-mono text-[11px] text-teal-800">{s.tag}</p>
                <p className="mt-1 text-[15px] font-semibold text-stone-900 group-hover:text-teal-800">
                  {s.t} →
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-stone-600">{s.d}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Real fixed demo badge — part 3, live on the viewport */}
      {showFixed && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-stone-700 bg-stone-900 py-2 pl-3 pr-2 text-white shadow-xl">
          <span className="size-2 animate-pulse rounded-full bg-teal-400" />
          <p className="text-xs font-semibold">
            fixed badge <span className="font-mono font-normal text-stone-400">· position: fixed</span>
          </p>
          <span className="hidden font-mono text-[10px] text-stone-400 sm:inline">
            scroll — I stay
          </span>
          <button
            type="button"
            onClick={() => setShowFixed(false)}
            aria-label="Dismiss fixed badge demo"
            className="grid size-6 place-items-center rounded-full bg-white/10 text-xs transition-colors hover:bg-white/20"
          >
            ✕
          </button>
        </div>
      )}
    </main>
  );
}
