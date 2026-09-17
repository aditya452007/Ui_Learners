"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  LevelIndicator,
  ZONE_COLORS,
  zoneFor,
  zoneLabel,
} from "./LevelIndicator";
import { ScenarioNav } from "./ScenarioNav";

type PartId = "filled" | "warning" | "critical" | "rating";

const PARTS: {
  id: PartId;
  n: number;
  name: string;
  symbol: string;
  see: string;
  how: string;
}[] = [
  {
    id: "filled",
    n: 1,
    name: "Filled level",
    symbol: "NSLevelIndicator.doubleValue",
    see: "The colored amount inside the little meter — how full the glass is. Empty means the bottom of the range, full means the top. It never moves on its own; it only reports a number something else already knows, like free space on a disk.",
    how: "When you use the component you hand it a number called doubleValue, plus the range it lives in (minValue and maxValue — props, meaning settings you pass in when you use it). React turns that into a width: (value − min) ÷ (max − min) × 100. When the number changes, React re-renders — draws the screen again — with the new width. Like water in a measuring cup: the cup is the range, the water line is doubleValue.",
  },
  {
    id: "warning",
    n: 2,
    name: "Warning threshold",
    symbol: "NSLevelIndicator.warningValue",
    see: "The point where the meter changes to its warning color — green tips into amber. It answers “getting full, start paying attention” before anything is actually wrong. In the diagram below it is the amber tick labelled ⚠.",
    how: "warningValue is a second number you configure, somewhere inside the range. On every render the component asks: is doubleValue at or past warningValue? If yes, it paints the fill amber instead of green. No animation framework, just an if-statement that picks a color. Like the low-fuel light in a car: the tank sensor crosses a line and the same dashboard lamp changes meaning.",
  },
  {
    id: "critical",
    n: 3,
    name: "Critical threshold",
    symbol: "NSLevelIndicator.criticalValue",
    see: "The point where the bar turns critical — amber tips into red. It answers “act now, this is nearly exhausted.” In the diagram it is the red tick labelled ●. It always wins over the warning color when both apply.",
    how: "criticalValue is a third number, higher than warningValue, and its check runs second so it overrules the warning color — order matters here. The logic is: red if value ≥ critical, else amber if value ≥ warning, else green. State is the value the component remembers between clicks; these thresholds are props that stay fixed while state moves. Like a fire alarm with two stages: the first bell says be aware, the second says leave.",
  },
  {
    id: "rating",
    n: 4,
    name: "Rating symbol",
    symbol: "NSLevelIndicator.Style.rating",
    see: "Each star in the rating row. Stars fill from the left up to the current rating — three gold stars means 3 out of 5. Unlike the bar above, this style has no warning colors: every symbol is either on or off.",
    how: "Style is the prop that picks which meter you get: .continuousCapacity draws one smooth bar, .discreteCapacity draws blocks, .rating repeats one symbol maxRating times (here 5), and .relevancy draws tiny match-strength blocks. Each star is a button, so clicking star 4 sets the rating to 4 — an event (something the user did) updates state, and state re-draws which stars are gold. Like handing out stickers: the row is the sheet, the rating is how many you stuck down.",
  },
];

const API_CHIPS = [
  "NSLevelIndicator",
  "NSLevelIndicator.Style",
  "doubleValue",
  "minValue · maxValue",
  "warningValue",
  "criticalValue",
  ".continuousCapacity",
  ".discreteCapacity",
  ".rating",
  ".relevancy",
  "SwiftUI Gauge",
];

function Pill({
  n,
  active,
  onClick,
  label,
  style,
}: {
  n: number;
  active: boolean;
  onClick: () => void;
  label: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Inspect part ${n}: ${label}`}
      aria-pressed={active}
      style={style}
      className={`pointer-events-auto z-20 grid size-6 shrink-0 place-items-center rounded-full text-[12px] font-bold shadow-md ring-2 ring-white transition-transform hover:scale-110 ${
        active ? "scale-110 bg-stone-900 text-white" : "bg-[#0071e3] text-white"
      }`}
    >
      {n}
    </button>
  );
}

function RangeRow({
  label,
  symbol,
  value,
  min,
  max,
  onChange,
  accent,
}: {
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  accent: string;
}) {
  return (
    <label className="flex flex-1 flex-col gap-1.5 rounded-xl border border-stone-200 bg-white p-3">
      <span className="flex items-baseline justify-between">
        <span className="text-[13px] font-semibold text-stone-800">{label}</span>
        <span className="font-mono text-[12px] font-bold text-stone-900">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={symbol}
        className="w-full"
        style={{ accentColor: accent }}
      />
      <span className="font-mono text-[11px] text-stone-400">{symbol}</span>
    </label>
  );
}

export default function Home() {
  const [value, setValue] = useState(78);
  const [warning, setWarning] = useState(70);
  const [critical, setCritical] = useState(90);
  const [selected, setSelected] = useState<PartId>("filled");

  const zone = zoneFor(value, warning, critical);
  const part = PARTS.find((p) => p.id === selected) ?? PARTS[0];

  const pct = ((value - 0) / 100) * 100;
  const warnPct = warning;
  const critPct = critical;

  const ratingValue = useMemo(
    () => Math.max(0, Math.min(5, Math.round(value / 20))),
    [value]
  );

  const setW = (w: number) => {
    const nw = Math.max(0, Math.min(100, w));
    setWarning(nw);
    if (nw >= critical) setCritical(Math.min(100, nw + 5));
  };
  const setC = (c: number) => {
    const nc = Math.max(0, Math.min(100, c));
    setCritical(nc);
    if (nc <= warning) setWarning(Math.max(0, nc - 5));
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-10">
        <ScenarioNav current="/" />

        {/* Header */}
        <header className="max-w-3xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#0071e3]">
            macOS · NSLevelIndicator / SwiftUI Gauge — web approximation
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900">
            Level Indicator
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Also called: level meter, capacity indicator, rating indicator,
            relevancy indicator
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-600">
            “The little meter that shows how full something is” is a level
            indicator —{" "}
            <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[13px] text-stone-800">
              NSLevelIndicator
            </code>
            . It shows a <strong>value inside a known range</strong>, not the
            progress of an ongoing task: disk space used, stars earned, how
            strongly a search result matches. Pick the style that matches the
            meaning —{" "}
            <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[13px] text-stone-800">
              .continuousCapacity
            </code>{" "}
            or{" "}
            <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[13px] text-stone-800">
              .discreteCapacity
            </code>{" "}
            for a bounded level,{" "}
            <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[13px] text-stone-800">
              .rating
            </code>{" "}
            for stars,{" "}
            <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[13px] text-stone-800">
              .relevancy
            </code>{" "}
            for match strength — and the capacity fill re-colors itself as the
            value crosses{" "}
            <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[13px] text-stone-800">
              warningValue
            </code>{" "}
            and{" "}
            <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[13px] text-stone-800">
              criticalValue
            </code>
            . Drag the sliders below: one number drives every meter on this
            page.
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
              t: "Fill → how much of the range",
              d: "One smooth bar, a row of blocks, or a row of stars. The fill answers “where inside the known limits?” — not “how far along a job?”.",
              s: "part ① · doubleValue",
            },
            {
              t: "Thresholds → when the color flips",
              d: "Two ticks on the bar. Cross the amber one and the fill warns you; cross the red one and it insists. Ratings skip this entirely.",
              s: "parts ②–③ · warningValue · criticalValue",
            },
            {
              t: "Symbols → stars and match blocks",
              d: "Same component, different style: stars for opinions (3 of 5), tiny rising blocks for how strongly a result matches.",
              s: "part ④ · Style.rating · .relevancy",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <p className="text-sm font-semibold text-stone-900">{c.t}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
                {c.d}
              </p>
              <p className="mt-2 font-mono text-[11px] text-stone-400">{c.s}</p>
            </div>
          ))}
        </section>

        {/* Live anatomy */}
        <section className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#0071e3]">
              Live anatomy
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              One value, four named parts
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
              This is the real component, not a picture. Move the doubleValue
              slider and the fill, the zone color, the stars and the relevancy
              blocks all chase it. Click any numbered pill to inspect that
              part.
            </p>
          </div>

          {/* controls */}
          <div className="flex flex-col gap-2.5 lg:flex-row">
            <RangeRow
              label="Filled level"
              symbol="NSLevelIndicator.doubleValue"
              value={value}
              min={0}
              max={100}
              onChange={setValue}
              accent={ZONE_COLORS[zone]}
            />
            <RangeRow
              label="Warning at"
              symbol="NSLevelIndicator.warningValue"
              value={warning}
              min={0}
              max={100}
              onChange={setW}
              accent="#d97706"
            />
            <RangeRow
              label="Critical at"
              symbol="NSLevelIndicator.criticalValue"
              value={critical}
              min={0}
              max={100}
              onChange={setC}
              accent="#dc2626"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "Normal · 42", v: 42 },
              { label: "Warning · 78", v: 78 },
              { label: "Critical · 95", v: 95 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setValue(p.v)}
                aria-pressed={value === p.v}
                className={`rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors ${
                  value === p.v
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 bg-white text-stone-600 hover:border-[#0071e3]/40 hover:text-[#0071e3]"
                }`}
              >
                {p.label}
              </button>
            ))}
            <span className="font-mono text-[11px] text-stone-400">
              try crossing the ⚠ and ● ticks and watch the fill re-color
            </span>
          </div>

          {/* diagram */}
          <div className="relative overflow-hidden rounded-2xl border border-stone-300/70 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] sm:p-10">
            <div className="mx-auto w-full max-w-2xl rounded-2xl border border-stone-200 bg-[#fafaf9] p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  NSLevelIndicator · .continuousCapacity
                </p>
                <p className="font-mono text-[13px] text-stone-500">
                  doubleValue ={" "}
                  <span className="font-bold text-stone-900">{value}</span>
                  <span className="text-stone-400"> / 0–100</span>
                </p>
              </div>

              <div className="relative mt-16 px-1 pb-2 pt-8">
                {/* pill 1 rides with the fill edge */}
                <div
                  className="pointer-events-none absolute top-0 z-10 hidden sm:block"
                  style={{
                    left: `calc(${pct}% )`,
                    transform: `translateX(${pct > 72 ? "-110%" : "10%"})`,
                    maxWidth: 240,
                  }}
                >
                  <div className="pointer-events-auto flex items-start gap-2">
                    <Pill
                      n={1}
                      label="Filled level"
                      active={selected === "filled"}
                      onClick={() => setSelected("filled")}
                    />
                    <button
                      type="button"
                      onClick={() => setSelected("filled")}
                      className={`rounded-lg border px-2.5 py-1.5 text-left text-[12px] leading-snug shadow-sm transition-colors ${
                        selected === "filled"
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-200 bg-white text-stone-600 hover:border-[#0071e3]/40"
                      }`}
                    >
                      <span className="font-semibold">Filled level</span>
                      <span className="block font-mono text-[10px] opacity-70">
                        doubleValue
                      </span>
                    </button>
                  </div>
                  <div className="ml-3 mt-1 w-px bg-stone-300" style={{ height: 26 }} />
                </div>

                {/* pill 2 at warning tick */}
                <div
                  className="pointer-events-none absolute top-0 z-10 hidden sm:block"
                  style={{
                    left: `${warnPct}%`,
                    transform: `translateX(${warnPct > 60 ? "-110%" : warnPct < 25 ? "12%" : "-50%"})`,
                    marginTop: 52,
                    maxWidth: 240,
                  }}
                >
                  <div className="pointer-events-auto flex items-center gap-2">
                    <Pill
                      n={2}
                      label="Warning threshold"
                      active={selected === "warning"}
                      onClick={() => setSelected("warning")}
                    />
                    <button
                      type="button"
                      onClick={() => setSelected("warning")}
                      className={`whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-left text-[12px] leading-snug shadow-sm transition-colors ${
                        selected === "warning"
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-400"
                      }`}
                    >
                      <span className="font-semibold">Warning ⚠ {warning}</span>
                      <span className="block font-mono text-[10px] opacity-70">
                        warningValue
                      </span>
                    </button>
                  </div>
                </div>

                {/* pill 3 at critical tick */}
                <div
                  className="pointer-events-none absolute top-0 z-10 hidden sm:block"
                  style={{
                    left: `${critPct}%`,
                    transform: "translateX(-50%)",
                    marginTop: 102,
                    maxWidth: 240,
                  }}
                >
                  <div className="pointer-events-auto flex items-center gap-2">
                    <Pill
                      n={3}
                      label="Critical threshold"
                      active={selected === "critical"}
                      onClick={() => setSelected("critical")}
                    />
                    <button
                      type="button"
                      onClick={() => setSelected("critical")}
                      className={`whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-left text-[12px] leading-snug shadow-sm transition-colors ${
                        selected === "critical"
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-red-200 bg-red-50 text-red-900 hover:border-red-400"
                      }`}
                    >
                      <span className="font-semibold">Critical ● {critical}</span>
                      <span className="block font-mono text-[10px] opacity-70">
                        criticalValue
                      </span>
                    </button>
                  </div>
                </div>

                <div
                  className={`rounded-xl p-4 pt-2 transition-shadow ${
                    selected === "filled" ||
                    selected === "warning" ||
                    selected === "critical"
                      ? "shadow-[0_0_0_2px_#0071e3]"
                      : ""
                  }`}
                >
                  <LevelIndicator
                    levelStyle="continuousCapacity"
                    min={0}
                    max={100}
                    value={value}
                    warningValue={warning}
                    criticalValue={critical}
                    showThresholds
                    size="lg"
                    ariaLabel="Anatomy capacity meter"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[10px] text-stone-400">
                    <span>minValue 0</span>
                    <span>maxValue 100</span>
                  </div>
                </div>

                {/* discrete + rating + relevancy, same value */}
                <div className="mt-6 grid gap-3 rounded-xl border border-stone-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-semibold text-stone-800">
                        .discreteCapacity — same value, cut into blocks
                      </p>
                      <p className="font-mono text-[10px] text-stone-400">
                        segments = 12 · each block colors by its own zone
                      </p>
                    </div>
                    <LevelIndicator
                      levelStyle="discreteCapacity"
                      min={0}
                      max={100}
                      value={value}
                      warningValue={warning}
                      criticalValue={critical}
                      segments={12}
                      size="sm"
                      ariaLabel="Anatomy discrete meter"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="sm:hidden" />
                      <div className="hidden sm:block">
                        <Pill
                          n={4}
                          label="Rating symbol"
                          active={selected === "rating"}
                          onClick={() => setSelected("rating")}
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => setSelected("rating")}
                          className="text-left text-[12px] font-semibold text-stone-800 hover:text-[#0071e3]"
                        >
                          <span className="sm:hidden">④ </span>.rating — one
                          symbol, repeated × 5
                        </button>
                        <p className="font-mono text-[10px] text-stone-400">
                          Style.rating · {ratingValue} of 5 ← doubleValue ÷ 20
                        </p>
                      </div>
                    </div>
                    <div
                      className={`rounded-lg p-1 transition-shadow ${
                        selected === "rating"
                          ? "shadow-[0_0_0_2px_#0071e3]"
                          : ""
                      }`}
                    >
                      <LevelIndicator
                        levelStyle="rating"
                        min={0}
                        max={5}
                        value={ratingValue}
                        maxRating={5}
                        size="sm"
                        ariaLabel="Anatomy rating"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-3">
                    <div>
                      <p className="text-[12px] font-semibold text-stone-800">
                        .relevancy — same value as match strength
                      </p>
                      <p className="font-mono text-[10px] text-stone-400">
                        compact meter · no thresholds, just 0–5 blocks
                      </p>
                    </div>
                    <LevelIndicator
                      levelStyle="relevancy"
                      min={0}
                      max={100}
                      value={value}
                      relevancyLevels={5}
                      ariaLabel="Anatomy relevancy"
                    />
                  </div>
                </div>

                {/* zone badge */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-3 py-1 font-mono text-[11px] font-bold text-white"
                    style={{ backgroundColor: ZONE_COLORS[zone] }}
                  >
                    zone = {zoneLabel(zone)}
                  </span>
                  <span className="font-mono text-[11px] text-stone-500">
                    {value} {value >= critical ? "≥" : "<"} critical({critical})
                    {" · "}
                    {value} {value >= warning ? "≥" : "<"} warning({warning})
                  </span>
                </div>
              </div>

              {/* mobile fallback labels */}
              <div className="mt-4 grid gap-2 sm:hidden">
                {PARTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelected(p.id)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-[13px] ${
                      selected === p.id
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-white text-stone-700"
                    }`}
                  >
                    <span className="grid size-5 place-items-center rounded-full bg-[#0071e3] text-[11px] font-bold text-white">
                      {p.n}
                    </span>
                    {p.name}
                  </button>
                ))}
              </div>

              {/* readout */}
              <div className="mt-6 rounded-lg bg-stone-900 px-4 py-3 font-mono text-[11px] leading-relaxed text-stone-300">
                <p>
                  <span className="text-stone-500">indicator.</span>doubleValue
                  = <span className="text-amber-300">{value}</span>{" "}
                  <span className="text-stone-500">· minValue = 0 · maxValue = 100</span>
                </p>
                <p>
                  <span className="text-stone-500">indicator.</span>warningValue
                  = <span className="text-amber-300">{warning}</span>{" "}
                  <span className="text-stone-500">·</span>{" "}
                  <span className="text-stone-500">indicator.</span>
                  criticalValue = <span className="text-red-300">{critical}</span>
                </p>
                <p>
                  <span className="text-stone-500">style = </span>
                  <span className="text-sky-300">
                    .continuousCapacity / .discreteCapacity / .rating /
                    .relevancy
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* selected part explainer */}
          <div className="rounded-2xl border border-[#0071e3]/25 bg-[#f0f7ff] p-5">
            <p className="text-sm font-semibold text-stone-900">
              <span className="mr-2 inline-grid size-5 place-items-center rounded-full bg-[#0071e3] align-middle text-[11px] font-bold text-white">
                {part.n}
              </span>
              {part.name}{" "}
              <code className="ml-1 rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-[#0071e3]">
                {part.symbol}
              </code>
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-white p-4 ring-1 ring-stone-200/60">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                  What you see
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-stone-700">
                  {part.see}
                </p>
              </div>
              <div className="rounded-xl bg-white p-4 ring-1 ring-stone-200/60">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                  How it works
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-stone-700">
                  {part.how}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* All parts reference */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-stone-900">
            Every named part, in plain words
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {PARTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p.id)}
                className={`rounded-xl border bg-white p-4 text-left transition-shadow hover:shadow-md ${
                  selected === p.id
                    ? "border-stone-900 shadow-md"
                    : "border-stone-200"
                }`}
              >
                <p className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                  <span
                    className={`grid size-5 place-items-center rounded-full text-[11px] font-bold text-white ${selected === p.id ? "bg-stone-900" : "bg-[#0071e3]"}`}
                  >
                    {p.n}
                  </span>
                  {p.name}
                </p>
                <p className="mt-1 font-mono text-[11px] text-[#0071e3]">
                  {p.symbol}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-stone-600">
                  <strong className="font-semibold text-stone-800">
                    What you see —{" "}
                  </strong>
                  {p.see}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
                  <strong className="font-semibold text-stone-800">
                    How it works —{" "}
                  </strong>
                  {p.how}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Scenarios */}
        <section className="flex flex-col gap-3">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#0071e3]">
            Where it belongs
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
            Three places a level indicator earns its keep
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                href: "/scenarios/storage-manager/",
                tag: ".discreteCapacity · thresholds on",
                t: "Storage manager",
                d: "A Finder-style disk panel: 16 blocks fill as you add files, flipping amber then red at warningValue and criticalValue.",
              },
              {
                href: "/scenarios/movie-ratings/",
                tag: ".rating · 5 symbols",
                t: "Movie ratings",
                d: "A catalog where every film gets a row of clickable stars — the symbol-based style, no thresholds at all.",
              },
              {
                href: "/scenarios/mail-search/",
                tag: ".relevancy · match strength",
                t: "Mail search relevance",
                d: "Search results ranked by tiny rising-block meters — the compact style that says “how strong a match is”.",
              },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#0071e3]/40 hover:shadow-md"
              >
                <p className="font-mono text-[11px] text-[#0071e3]">{s.tag}</p>
                <p className="mt-1 text-[15px] font-semibold text-stone-900 group-hover:text-[#0071e3]">
                  {s.t} →
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
                  {s.d}
                </p>
              </Link>
            ))}
          </div>
          <p className="text-[13px] text-stone-500">
            A note on fidelity: macOS NSLevelIndicator is a native AppKit
            control, and SwiftUI&apos;s nearest general equivalent is Gauge.
            This hub rebuilds its look and behaviour — bounded fill from
            doubleValue, native-style amber/red threshold coloring, repeated
            rating symbols, compact relevancy blocks — with plain divs, SVG
            and ARIA meters so you can feel each API symbol do its job.
          </p>
        </section>
      </div>
    </main>
  );
}
