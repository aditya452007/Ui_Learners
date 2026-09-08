"use client";

import Link from "next/link";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Masonry, {
  ENGINE_LABEL,
  useNativeMasonry,
  type Engine,
  type JsOrder,
} from "@/components/masonry";
import BrickArt from "@/components/art";
import { Code, Eyebrow, Footer, PageHeader, ScenarioNav, Shell } from "@/components/chrome";
import {
  EXTRA_BRICKS,
  HUB_BRICKS,
  shortestColumn,
  splitBalanced,
  units,
  type Brick,
} from "@/lib/bricks";

/* ── the five named parts ── */

type PartId = "column" | "brick" | "gap" | "edge" | "ratio";

type Part = {
  id: PartId;
  n: number;
  name: string;
  symbol: string;
  fragment: string;
  see: string;
  how: string;
  tryIt: string;
};

const PARTS: Part[] = [
  {
    id: "column",
    n: 1,
    name: "Packed column",
    symbol: "columns / grid track",
    fragment:
      "one packed column of the masonry wall: items stack top-to-bottom with a fixed column gap, each new item joining the currently shortest column",
    see: "Look at any vertical strip of the wall: cards stack straight down and nothing lines up sideways with the next strip. That independence is the whole trick — each column packs on its own, so tall and short cards slot together like bricks instead of leaving row-sized holes.",
    how: "The wall is split into vertical tracks — with CSS columns they are anonymous column boxes, with grid lanes they are real grid tracks. Think of a newspaper page: text pours down one column, then the next. Press “Drop a brick” with the JS engine on: the code totals each column's height and appends the brick to the shortest one, exactly like stacking boxes on the lowest pile.",
    tryIt: "Hover the wall — the dotted bands show the invisible tracks. Change the column count and watch every brick re-pour.",
  },
  {
    id: "brick",
    n: 2,
    name: "Brick card",
    symbol: "masonry item · break-inside: avoid",
    fragment: "every card break-inside: avoid",
    see: "Each card is one unbreakable brick: its picture and caption always travel together. A card is never sliced in half with its top in one column and its caption stranded in the next — that would look broken, and in a shop it could hide the price.",
    how: "Every card carries the CSS rule break-inside: avoid, which tells the multi-column fallback “do not split me across columns — move me whole to the next one”. Props are the settings you hand a component when you use it (title, picture, price); the card renders — draws itself on screen — as one sealed box. Click pill ②: the ring traces a single unbroken brick.",
    tryIt: "Toggle the column count to 2, then 4. Cards jump columns whole — none ever tears.",
  },
  {
    id: "gap",
    n: 3,
    name: "Column gap",
    symbol: "column-gap / gap",
    fragment: "items stack top-to-bottom with a fixed column gap",
    see: "The even breathing room between strips. It never changes, no matter how chaotic the card heights get — that one constant rhythm is what makes an uneven wall still feel tidy and scannable.",
    how: "One setting — column-gap in the CSS engines, gap in the JS flexbox stacks — sets every gutter at once, and the same value doubles as the vertical space between bricks. Drag the gap slider: every gutter and every row-space updates together, because they are all the same variable (--m-gap). It is like grout between tiles: one width, everywhere.",
    tryIt: "Drag the gap from 8 to 28 and watch gutters and row spaces move as one.",
  },
  {
    id: "edge",
    n: 4,
    name: "Staggered bottom edge",
    symbol: "no row lines",
    fragment: "cards pack like bricks with no row lines and a staggered bottom edge",
    see: "The bottom of the wall is deliberately ragged — each column ends at a different height. That stagger is the proof there are no rows: a normal grid would force every row to the tallest card and leave gaps. Here, nothing stretches and nothing waits.",
    how: "Because columns pack independently, their totals simply differ — the dashed lines trace the live-measured bottom of each column, and the chip reports how far apart they are. State is what the component remembers between clicks (the brick list); each new brick re-renders — redraws — the wall and the stagger shifts. Drop three bricks and watch the shortest column change hands.",
    tryIt: "Select pill ④, then drop bricks: the dashed bottoms chase the real layout.",
  },
  {
    id: "ratio",
    n: 5,
    name: "Reserved aspect ratio",
    symbol: "aspect-ratio",
    fragment: "Reserve image aspect ratios so cards don't jump while loading",
    see: "Every picture's box is booked before the picture arrives. Press “Simulate slow images”: the art turns to grey placeholders, yet not a single card moves — neighbours stay put because each box already has its exact shape saved.",
    how: "Each brick declares aspect-ratio: width / height, so the browser paints a correctly-shaped empty box on the very first render — before any image bytes exist. Without it, late images shove content down (layout shift, measured as CLS). It is like reserving seats with name cards: the chairs are placed before the guests arrive, so nobody shuffles.",
    tryIt: "Hit “Simulate slow images” and compare: boxes hold, layout frozen, zero jumping.",
  },
];

/* ── small controls ── */

function Seg<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex flex-wrap rounded-lg border border-stone-200 bg-white p-1"
    >
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className={`rounded-md px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
            value === o
              ? "bg-stone-900 text-white shadow-sm"
              : "text-stone-500 hover:bg-stone-100"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex min-w-[150px] flex-1 items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 py-2">
      <span className="whitespace-nowrap text-[12px] font-medium text-stone-500">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-stone-200 accent-[#b91c1c]"
      />
      <span className="w-12 text-right font-mono text-[12px] text-stone-700">
        {value}
        {unit}
      </span>
    </label>
  );
}

function Pill({
  n,
  style,
  selected,
  onSelect,
  label,
}: {
  n: number;
  style: CSSProperties;
  selected: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      title={label}
      aria-label={`Highlight ${label}`}
      aria-pressed={selected}
      style={style}
      className={`absolute z-30 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[12px] font-bold shadow-md ring-2 ring-white transition-transform hover:scale-125 ${
        selected ? "scale-125 bg-stone-900 text-white" : "bg-[#b91c1c] text-white"
      }`}
    >
      {n}
    </button>
  );
}

/* ── hub page ── */

const ENGINES: Engine[] = ["columns", "native", "js"];
const ORDERS: JsOrder[] = ["balanced", "sequence"];
const FEATURED_ID = "h3";
const CAPTION = 30; // estimated caption-block height in wall units

export default function Home() {
  const [cols, setCols] = useState(3);
  const [gap, setGap] = useState(16);
  const [engine, setEngine] = useState<Engine>("columns");
  const [jsOrder, setJsOrder] = useState<JsOrder>("balanced");
  const [showOrder, setShowOrder] = useState(true);
  const [selected, setSelected] = useState<PartId>("column");
  const [bricks, setBricks] = useState<Brick[]>(HUB_BRICKS);
  const [extra, setExtra] = useState(0);
  const [pulseCol, setPulseCol] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const support = useNativeMasonry();
  const wallRef = useRef<HTMLDivElement>(null);
  const itemEls = useRef(new Map<string, HTMLElement>());
  const [ring, setRing] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [bottoms, setBottoms] = useState<number[]>([]);

  const part = PARTS.find((p) => p.id === selected) ?? PARTS[0];
  const sizeOf = useCallback((b: Brick) => units(b, CAPTION), []);

  /* live measurement: featured-brick ring + true per-column bottoms */
  const measure = useCallback(() => {
    const wall = wallRef.current;
    if (!wall) return;
    const wr = wall.getBoundingClientRect();
    const feat = itemEls.current.get(FEATURED_ID);
    if (feat) {
      const r = feat.getBoundingClientRect();
      setRing({ x: r.left - wr.left, y: r.top - wr.top, w: r.width, h: r.height });
    }
    const colBottoms = new Array<number>(cols).fill(0);
    itemEls.current.forEach((el) => {
      const r = el.getBoundingClientRect();
      const cx = r.left - wr.left + r.width / 2;
      const band = Math.min(cols - 1, Math.max(0, Math.floor((cx / wr.width) * cols)));
      colBottoms[band] = Math.max(colBottoms[band], r.bottom - wr.top);
    });
    setBottoms(colBottoms);
  }, [cols]);

  useLayoutEffect(() => {
    measure();
  }, [measure, bricks, cols, gap, engine, jsOrder, loading, selected, showOrder]);

  useLayoutEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  /* predicted stacks for the height meters (exact for JS-balanced) */
  const stacks = useMemo(
    () => splitBalanced(bricks, cols, sizeOf),
    [bricks, cols, sizeOf],
  );
  const heights = stacks.map((s) => s.reduce((a, b) => a + sizeOf(b), 0));
  const stagger = bottoms.length ? Math.max(...bottoms) - Math.min(...bottoms) : 0;

  function dropBrick() {
    const next = EXTRA_BRICKS[extra % EXTRA_BRICKS.length];
    const fresh: Brick = { ...next, id: `${next.id}-d${extra}` };
    if (engine === "js" && jsOrder === "balanced") {
      const target = shortestColumn(heights);
      setPulseCol(target);
      window.setTimeout(() => setPulseCol(null), 1000);
    } else {
      setPulseCol(null);
    }
    setExtra((e) => e + 1);
    setBricks((b) => [...b, fresh]);
  }

  function reset() {
    setBricks(HUB_BRICKS);
    setExtra(0);
    setPulseCol(null);
  }

  function simulateLoading() {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1600);
  }

  /* geometric band helpers (percent math that matches flex + multicol) */
  const band = (c: number): CSSProperties => ({
    left: `calc(${c} * ((100% - ${(cols - 1) * gap}px) / ${cols}) + ${c * gap}px)`,
    width: `calc((100% - ${(cols - 1) * gap}px) / ${cols})`,
  });
  const gutter = (g: number): CSSProperties => ({
    left: `calc(${g + 1} * ((100% - ${(cols - 1) * gap}px) / ${cols}) + ${g * gap}px)`,
    width: gap,
  });

  const wallPct = (px: number) => {
    const w = wallRef.current?.getBoundingClientRect().width ?? 1;
    return (px / w) * 100;
  };

  function renderBrick(b: Brick, i: number) {
    return (
      <div
        ref={(el) => {
          if (el) itemEls.current.set(b.id, el);
          else itemEls.current.delete(b.id);
        }}
        className="overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.06)]"
      >
        <div className="relative">
          {loading ? (
            <div
              className="w-full animate-pulse bg-stone-200"
              style={{ aspectRatio: `${b.w} / ${b.h}` }}
            />
          ) : (
            <BrickArt brick={b} />
          )}
          {showOrder && (
            <span className="absolute left-2 top-2 rounded-md bg-stone-900/85 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
              {i + 1}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 px-2.5 py-2">
          <p className="truncate text-[12px] font-medium text-stone-700">{b.title}</p>
          <p className="shrink-0 font-mono text-[10px] text-stone-400">
            {b.w}:{b.h}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <Shell>
        <ScenarioNav active="hub" />

        <div className="mt-8">
          <PageHeader
            eyebrow="NameThatUI · Web pattern"
            title="Masonry Layout (Pinterest Grid)"
            alsoCalled={["waterfall layout", "pinterest grid", "brick layout", "瀑布流 waterfall flow"]}
            lede="The Pinterest-style grid where every card keeps its own height. Each new item joins the shortest column, so cards pack like bricks — no row lines, no stretched cells, just a staggered bottom edge. Below is a live wall: flip the layout engine, drop bricks into the shortest column, and trace every named part."
          />
        </div>

        {/* intro strip */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            {
              t: "The wall",
              d: "One container holding cards of wildly different heights — photos, headlines, prices. It refuses to stretch anything.",
              art: (
                <div className="flex h-14 items-end gap-1.5">
                  {[38, 56, 30, 48, 40].map((h, i) => (
                    <div key={i} className="w-full rounded-t-md bg-stone-200" style={{ height: h }} />
                  ))}
                </div>
              ),
            },
            {
              t: "Packed columns",
              d: "The wall pours into vertical tracks. Each column packs top-to-bottom on its own — that independence is the whole trick.",
              art: (
                <div className="flex h-14 gap-1.5">
                  {[0, 1, 2].map((c) => (
                    <div
                      key={c}
                      className="w-full rounded-md border border-dashed border-[#b91c1c]/50 bg-[#b91c1c]/5"
                    />
                  ))}
                </div>
              ),
            },
            {
              t: "Bricks that keep their height",
              d: "Every card declares its shape up front (aspect-ratio) and never splits (break-inside: avoid). No jumps, no tears.",
              art: (
                <div className="flex h-14 items-stretch gap-1.5">
                  <div className="flex w-full flex-col items-center justify-center rounded-md bg-stone-900 font-mono text-[10px] text-white">
                    4:5
                  </div>
                  <div className="flex w-full flex-col items-center justify-center rounded-md bg-stone-300 font-mono text-[10px] text-stone-600">
                    4:3
                  </div>
                  <div className="flex w-full flex-col items-center justify-center rounded-md bg-stone-400 font-mono text-[10px] text-white">
                    4:6
                  </div>
                </div>
              ),
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-2xl border border-border bg-surface p-4 shadow-[0_1px_2px_rgba(28,25,23,0.05)]"
            >
              {c.art}
              <p className="mt-3 text-[14px] font-semibold text-stone-800">{c.t}</p>
              <p className="mt-1 text-[13px] leading-5 text-stone-500">{c.d}</p>
            </div>
          ))}
        </div>

        {/* ── live anatomy ── */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_2px_12px_rgba(28,25,23,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <Eyebrow>Live anatomy diagram</Eyebrow>
              <h2 className="mt-1 text-lg font-semibold text-stone-900">
                One wall, three engines — click the numbered pills
              </h2>
            </div>
            <span
              className={`rounded-full px-3 py-1 font-mono text-[11px] ${
                support
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-stone-100 text-stone-500 ring-1 ring-stone-200"
              }`}
              title="Whether this browser understands grid-template-rows: masonry"
            >
              {support === null
                ? "checking native masonry…"
                : support
                  ? "native grid lanes: active in this browser"
                  : "native grid lanes: not here — showing fallback"}
            </span>
          </div>

          {/* controls */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border bg-stone-50/60 px-5 py-3">
            <Seg options={ENGINES} value={engine} onChange={setEngine} ariaLabel="Layout engine" />
            {engine === "js" ? (
              <Seg options={ORDERS} value={jsOrder} onChange={setJsOrder} ariaLabel="JS ordering" />
            ) : (
              <span className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 font-mono text-[11px] text-stone-400">
                {engine === "columns" ? "order: down each column" : "order: across rows (where native)"}
              </span>
            )}
            <Slider label="Columns" value={cols} min={2} max={4} unit="" onChange={setCols} />
            <Slider label="Gap" value={gap} min={8} max={28} unit="px" onChange={setGap} />
            <button
              type="button"
              onClick={dropBrick}
              className="rounded-lg bg-[#b91c1c] px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#7f1d1d]"
            >
              Drop a brick ↓
            </button>
            <button
              type="button"
              onClick={simulateLoading}
              className="rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-[13px] font-medium text-stone-700 transition-colors hover:bg-stone-100"
            >
              Simulate slow images
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg px-3 py-2 font-mono text-[12px] text-stone-400 transition-colors hover:text-stone-700"
            >
              reset
            </button>
            <label className="ml-auto flex cursor-pointer items-center gap-2 text-[12px] font-medium text-stone-500">
              <input
                type="checkbox"
                checked={showOrder}
                onChange={(e) => setShowOrder(e.target.checked)}
                className="size-4 rounded accent-[#b91c1c]"
              />
              order badges
            </label>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
            {/* the wall */}
            <div className="relative p-5 sm:p-7">
              <div ref={wallRef} className="relative">
                {/* column-track bands */}
                {selected === "column" &&
                  Array.from({ length: cols }).map((_, c) => (
                    <div
                      key={c}
                      aria-hidden
                      className={`pointer-events-none absolute inset-y-0 z-10 rounded-lg border border-dashed transition-colors ${
                        pulseCol === c
                          ? "border-[#b91c1c] bg-[#b91c1c]/10"
                          : c === 1
                            ? "border-[#b91c1c]/70 bg-[#b91c1c]/[0.06]"
                            : "border-stone-300 bg-stone-900/[0.02]"
                      } ${pulseCol === c ? "pulse-ring" : ""}`}
                      style={band(c)}
                    />
                  ))}
                {/* gap shading */}
                {selected === "gap" &&
                  Array.from({ length: cols - 1 }).map((_, g) => (
                    <div
                      key={g}
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 z-10 rounded bg-[#b91c1c]/15 ring-1 ring-[#b91c1c]/40"
                      style={gutter(g)}
                    />
                  ))}
                {/* measured staggered bottoms */}
                {selected === "edge" &&
                  bottoms.map((b, c) => (
                    <div
                      key={c}
                      aria-hidden
                      className="pointer-events-none absolute z-10 border-t-2 border-dashed border-[#b91c1c]"
                      style={{ ...band(c), top: b + 6 }}
                    />
                  ))}
                {/* featured brick ring */}
                {(selected === "brick" || selected === "ratio") && ring && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute z-10 rounded-xl ring-[3px] ring-[#b91c1c] ring-offset-2"
                    style={{ left: ring.x, top: ring.y, width: ring.w, height: ring.h }}
                  />
                )}

                <Masonry
                  items={bricks}
                  cols={cols}
                  gap={gap}
                  engine={engine}
                  jsOrder={jsOrder}
                  size={sizeOf}
                  keyOf={(b) => b.id}
                  renderItem={renderBrick}
                />

                {/* numbered pills */}
                <Pill
                  n={1}
                  label="Packed column"
                  selected={selected === "column"}
                  onSelect={() => setSelected("column")}
                  style={{ left: `${((1 + 0.5) / cols) * 100}%`, top: -14 }}
                />
                {ring ? (
                  <>
                    <Pill
                      n={2}
                      label="Brick card"
                      selected={selected === "brick"}
                      onSelect={() => setSelected("brick")}
                      style={{ left: `${wallPct(ring.x + ring.w)}%`, top: ring.y + 28 }}
                    />
                    <Pill
                      n={5}
                      label="Reserved aspect ratio"
                      selected={selected === "ratio"}
                      onSelect={() => setSelected("ratio")}
                      style={{ left: `${wallPct(ring.x)}%`, top: ring.y + ring.h - 24 }}
                    />
                  </>
                ) : (
                  <>
                    <Pill n={2} label="Brick card" selected={selected === "brick"} onSelect={() => setSelected("brick")} style={{ left: "20%", top: "30%" }} />
                    <Pill n={5} label="Reserved aspect ratio" selected={selected === "ratio"} onSelect={() => setSelected("ratio")} style={{ left: "12%", top: "52%" }} />
                  </>
                )}
                <Pill
                  n={3}
                  label="Column gap"
                  selected={selected === "gap"}
                  onSelect={() => setSelected("gap")}
                  style={{ left: `${(1 / cols) * 100}%`, top: 64 }}
                />
                <Pill
                  n={4}
                  label="Staggered bottom edge"
                  selected={selected === "edge"}
                  onSelect={() => setSelected("edge")}
                  style={{ left: "92%", top: "96%" }}
                />
              </div>

              {/* column meters + order note */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {engine === "js" && jsOrder === "balanced" ? (
                  stacks.map((s, c) => (
                    <div
                      key={c}
                      className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 font-mono text-[11px] ${
                        pulseCol === c
                          ? "border-[#b91c1c] bg-[#b91c1c]/5 text-[#b91c1c]"
                          : "border-stone-200 bg-white text-stone-500"
                      }`}
                    >
                      <span>col {c + 1}</span>
                      <span className="inline-block h-1.5 w-16 overflow-hidden rounded-full bg-stone-100">
                        <span
                          className={`block h-full rounded-full ${pulseCol === c ? "bg-[#b91c1c]" : "bg-stone-400"}`}
                          style={{
                            width: `${Math.min(100, (heights[c] / Math.max(...heights, 1)) * 100)}%`,
                          }}
                        />
                      </span>
                      <span>{s.length} bricks</span>
                    </div>
                  ))
                ) : (
                  <p className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 font-mono text-[11px] text-stone-500">
                    {engine === "columns"
                      ? "fallback order runs DOWN each column — row 1 reads " +
                        Array.from({ length: cols }, (_, c) => c + 1).join(" · ")
                      : "native lanes keep grid row order — rows read left to right"}
                  </p>
                )}
                {selected === "edge" && bottoms.length > 0 && (
                  <p className="rounded-lg border border-[#b91c1c]/30 bg-[#b91c1c]/5 px-3 py-1.5 font-mono text-[11px] text-[#7f1d1d]">
                    column bottoms differ by {Math.round(stagger)}px — no row lines
                  </p>
                )}
              </div>
            </div>

            {/* inspector */}
            <aside className="border-t border-border bg-stone-50/70 p-5 lg:border-l lg:border-t-0">
              <div className="flex items-center gap-2">
                {PARTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelected(p.id)}
                    aria-pressed={selected === p.id}
                    className={`grid size-7 place-items-center rounded-full text-[12px] font-bold transition-colors ${
                      selected === p.id
                        ? "bg-stone-900 text-white"
                        : "bg-white text-stone-500 ring-1 ring-stone-200 hover:text-stone-900"
                    }`}
                  >
                    {p.n}
                  </button>
                ))}
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-stone-900">{part.name}</h3>
              <p className="mt-1">
                <Code>{part.symbol}</Code>
              </p>
              <p className="mt-2 border-l-2 border-[#b91c1c]/40 pl-3 font-mono text-[11px] leading-5 text-stone-500">
                {part.fragment}
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-border bg-white p-3.5">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-stone-400">
                    What you see
                  </p>
                  <p className="mt-1.5 text-[13px] leading-6 text-stone-600">{part.see}</p>
                </div>
                <div className="rounded-xl border border-border bg-white p-3.5">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-stone-400">
                    How it works
                  </p>
                  <p className="mt-1.5 text-[13px] leading-6 text-stone-600">{part.how}</p>
                </div>
                <p className="rounded-xl bg-stone-900 px-3.5 py-3 text-[12px] leading-5 text-stone-200">
                  <span className="font-semibold text-white">Try it: </span>
                  {part.tryIt}
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* engine comparison */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-stone-900">Three ways to build it — pick by ordering</h2>
          <p className="mt-1 max-w-3xl text-[14px] leading-6 text-stone-500">
            The paste-ready prompt stacks native CSS first with a multi-column fallback. The real
            decision is <em>reading order</em>: the fallback pours items down each column, so if
            strict left-to-right order matters you need the JS split instead.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              {
                t: "CSS columns — works everywhere",
                code: "columns: 3; column-gap: 16px;",
                rows: ["Order: down each column (1·4·7 / 2·5·8)", "Balance: browser evens column heights", "Needs break-inside: avoid on cards"],
              },
              {
                t: "Native grid lanes — Safari 26+",
                code: "@supports (grid-template-rows: masonry)",
                rows: ["Order: across rows, like normal grid", "Balance: true shortest-column packing", "Pair with the columns fallback above"],
              },
              {
                t: "JS split — when order matters",
                code: "react-masonry-css / hand-rolled",
                rows: ["Order: your choice — balanced or left-to-right", "Balance: you estimate heights up front", "Cost: a little code, full control"],
              },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-[14px] font-semibold text-stone-800">{c.t}</p>
                <p className="mt-2">
                  <Code>{c.code}</Code>
                </p>
                <ul className="mt-3 space-y-1.5">
                  {c.rows.map((r) => (
                    <li key={r} className="flex gap-2 text-[13px] leading-5 text-stone-600">
                      <span aria-hidden className="mt-1 size-1.5 shrink-0 rounded-full bg-[#b91c1c]" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* scenarios */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-stone-900">See it in real products</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              {
                href: "/scenarios/inspiration-board",
                t: "Inspiration board",
                d: "A Pinterest-style photo wall for a design studio: filter moods, save pins, and feel why variable heights beat cropped squares.",
              },
              {
                href: "/scenarios/recipe-magazine",
                t: "Recipe magazine",
                d: "Editorial cards with wildly uneven text. Break-inside keeps every recipe whole while search + filters re-pour the wall.",
              },
              {
                href: "/scenarios/maker-shop",
                t: "Maker shop",
                d: "Product cards where order = money. Flip between down-column and left-to-right packing, and watch skeletons hold their shape.",
              },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(28,25,23,0.10)]"
              >
                <p className="text-[15px] font-semibold text-stone-900 group-hover:text-[#b91c1c]">
                  {s.t} <span aria-hidden>→</span>
                </p>
                <p className="mt-1.5 text-[13px] leading-6 text-stone-500">{s.d}</p>
              </Link>
            ))}
          </div>
        </section>
      </Shell>
      <Footer />
    </div>
  );
}
