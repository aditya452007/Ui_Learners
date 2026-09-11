"use client";

import Link from "next/link";
import { useState } from "react";
import { Slider } from "./Slider";

type PartId = "knob" | "filled" | "track" | "ticks";

const PARTS: {
  id: PartId;
  n: number;
  name: string;
  symbol: string;
  see: string;
  how: string;
}[] = [
  {
    id: "knob",
    n: 1,
    name: "Knob (thumb)",
    symbol: "NSSlider.knobThickness",
    see: "The round white dot you grab and drag. It is the only thing you touch — everything else just reports where the dot sits. On the web the same dot is called a thumb.",
    how: "When you press the knob and move, a pointer-move event fires again and again, and each time React updates state — the value the component remembers between drags — then re-renders, which means drawing the screen again with the knob in its new spot. Props are the settings you hand the component when you use it (here: min, max, step). Think of the knob like a fridge magnet you slide along a rail.",
  },
  {
    id: "filled",
    n: 2,
    name: "Filled track",
    symbol: "Slider + .tint",
    see: "The blue part of the line from the left edge up to the knob. It answers “how far along am I?” at a glance — empty means minimum, full means maximum, half means halfway.",
    how: "This is not a second control, it is a div whose width is set to a percentage: (value − min) ÷ (max − min) × 100. When state changes, React re-draws that width, so the blue lead chases the knob. In SwiftUI you get the same lead by adding .tint to a Slider; here we paint it by hand. Like the poured part of a measuring cup.",
  },
  {
    id: "track",
    n: 3,
    name: "Track",
    symbol: "NSSlider.SliderType.linear",
    see: "The full grey groove the dot travels along, end to end. It shows the whole range before you touch anything — the left end is the minimum, the right end is the maximum.",
    how: "The track is a clickable div that owns the drag math: when you click anywhere on it, the component measures where you clicked inside its box and converts that position into a value. Linear means the value changes evenly along the line. Think of it as the ruler; the knob is the finger pointing at a number on it.",
  },
  {
    id: "ticks",
    n: 4,
    name: "Tick marks",
    symbol: "NSSlider.numberOfTickMarks · tickMarkPosition = .below",
    see: "The little lines under the groove — the Key Repeat slider in System Settings is the classic example. They mark the only legal stops; with snapping on, the knob clicks between them instead of gliding.",
    how: "Give the slider numberOfTickMarks (say 5) and it draws 5 stops below the track — tickMarkPosition = .below. Turn on allowsTickMarkValuesOnly and every drag value is rounded to the nearest stop, so the knob snaps. Below, flip the mode to “Snapping ticks” and feel it. Like frets on a guitar neck: the string can only ring on a fret.",
  },
];

const API_CHIPS = [
  "NSSlider",
  "Slider(value:in:step:)",
  "numberOfTickMarks",
  "allowsTickMarkValuesOnly",
  "tickMarkPosition = .below",
  "isContinuous",
  "knobThickness",
  "SliderType.linear",
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

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="rounded-md border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[11px] text-stone-600 shadow-[0_1px_0_#d6d3d1]">
      {children}
    </kbd>
  );
}

export default function Home() {
  const [value, setValue] = useState(38);
  const [mode, setMode] = useState<"continuous" | "ticks">("ticks");
  const [continuous, setContinuous] = useState(true);
  const [selected, setSelected] = useState<PartId>("knob");

  const snapping = mode === "ticks";
  const part = PARTS.find((p) => p.id === selected) ?? PARTS[0];
  const pct = ((value - 0) / (100 - 0)) * 100;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-10">
        {/* Header */}
        <header className="max-w-3xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#0071e3]">
            macOS · NSSlider / SwiftUI Slider — web approximation
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900">
            Slider
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Also called: slider control, seek bar, track bar, range control
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-600">
            “The dot you drag along a line” is a slider —{" "}
            <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[13px] text-stone-800">
              NSSlider
            </code>
            . The circle is the <strong>knob</strong>, the groove is the{" "}
            <strong>track</strong>, and the leading portion up to the knob is
            tinted with the accent color. A continuous slider picks any value
            in the range; give it tick marks and{" "}
            <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[13px] text-stone-800">
              allowsTickMarkValuesOnly
            </code>
            , and the knob snaps between fixed stops — the Key Repeat slider
            in System Settings is the classic tick-marked one. Drag it below:
            the labels chase the knob.
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
              t: "Track → the whole range",
              d: "The grey groove, end to end. Left is min, right is max. Click anywhere on it to jump.",
              s: "part 3 · SliderType.linear",
            },
            {
              t: "Filled track + knob → where you are",
              d: "Blue lead shows how far along the value sits; the white knob is the handle you drag.",
              s: "parts 1–2 · knobThickness + .tint",
            },
            {
              t: "Tick marks → the legal stops",
              d: "Little lines below the groove. With snapping on, the knob only lands on them.",
              s: "part 4 · numberOfTickMarks",
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
              One slider, four named parts
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
              This is the real component, not a picture. Drag the knob — or
              focus it and use your arrow keys — and pill ① rides along with
              it. Click any numbered pill to inspect that part.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div
              role="group"
              aria-label="Slider mode"
              className="flex rounded-lg border border-stone-200 bg-white p-1"
            >
              {(["continuous", "ticks"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={mode === m}
                  onClick={() => {
                    setMode(m);
                    if (m === "ticks") setValue(Math.round(value / 25) * 25);
                  }}
                  className={`rounded-md px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                    mode === m
                      ? "bg-stone-900 text-white shadow-sm"
                      : "text-stone-500 hover:bg-stone-100"
                  }`}
                >
                  {m === "continuous" ? "continuous" : "snapping ticks"}
                </button>
              ))}
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={continuous}
              onClick={() => setContinuous((c) => !c)}
              className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 transition-colors hover:border-[#0071e3]/40"
            >
              <span
                className={`relative h-4 w-7 rounded-full transition-colors ${continuous ? "bg-[#0071e3]" : "bg-stone-300"}`}
              >
                <span
                  className={`absolute top-0.5 size-3 rounded-full bg-white shadow transition-all ${continuous ? "left-3.5" : "left-0.5"}`}
                />
              </span>
              isContinuous = {continuous ? "true" : "false"}
            </button>
            <span className="font-mono text-[11px] text-stone-400">
              {!continuous && " — drag, value commits on release"}
            </span>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-stone-300/70 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] sm:p-10">
            <div className="mx-auto w-full max-w-2xl rounded-2xl border border-stone-200 bg-[#fafaf9] p-6 sm:p-10">
              <div className="flex items-baseline justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  System Settings · Key Repeat style
                </p>
                <p className="font-mono text-[13px] text-stone-500">
                  value ={" "}
                  <span className="font-bold text-stone-900">{value}</span>
                  <span className="text-stone-400"> / 0–100</span>
                </p>
              </div>

              {/* Annotated slider */}
              <div className="relative mt-14 px-2 pb-16 pt-10">
                {/* leader caption for knob (rides with value) */}
                <div
                  className="pointer-events-none absolute top-0 z-10 hidden sm:block"
                  style={{ left: `calc(${pct}% + 8px)`, transform: `translateX(${pct > 70 ? "-100%" : "0"})`, maxWidth: 220 }}
                >
                  <div className="pointer-events-auto flex items-start gap-2">
                    <Pill
                      n={1}
                      label="Knob"
                      active={selected === "knob"}
                      onClick={() => setSelected("knob")}
                    />
                    <button
                      type="button"
                      onClick={() => setSelected("knob")}
                      className={`rounded-lg border px-2.5 py-1.5 text-left text-[12px] leading-snug shadow-sm transition-colors ${
                        selected === "knob"
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-200 bg-white text-stone-600 hover:border-[#0071e3]/40"
                      }`}
                    >
                      <span className="font-semibold">Knob</span>
                      <span className="block font-mono text-[10px] opacity-70">
                        knobThickness
                      </span>
                    </button>
                  </div>
                  <div
                    className="ml-3 mt-1 w-px bg-stone-300"
                    style={{ height: 28 }}
                  />
                </div>

                {/* caption for filled track */}
                <div className="pointer-events-none absolute left-2 top-[74px] z-10 hidden sm:block">
                  <div className="pointer-events-auto flex items-center gap-2">
                    <Pill
                      n={2}
                      label="Filled track"
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
                      <span className="font-semibold">Filled track</span>
                      <span className="block font-mono text-[10px] opacity-70">
                        Slider + .tint
                      </span>
                    </button>
                  </div>
                </div>

                {/* caption for track */}
                <div className="pointer-events-none absolute right-2 top-[74px] z-10 hidden sm:block">
                  <div className="pointer-events-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelected("track")}
                      className={`rounded-lg border px-2.5 py-1.5 text-right text-[12px] leading-snug shadow-sm transition-colors ${
                        selected === "track"
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-200 bg-white text-stone-600 hover:border-[#0071e3]/40"
                      }`}
                    >
                      <span className="font-semibold">Track</span>
                      <span className="block font-mono text-[10px] opacity-70">
                        SliderType.linear
                      </span>
                    </button>
                    <Pill
                      n={3}
                      label="Track"
                      active={selected === "track"}
                      onClick={() => setSelected("track")}
                    />
                  </div>
                </div>

                <div
                  className={`rounded-xl p-4 transition-shadow ${
                    selected === "track" || selected === "filled"
                      ? "shadow-[0_0_0_2px_#0071e3]"
                      : ""
                  }`}
                >
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={value}
                    onChange={setValue}
                    tickMarks={snapping ? 5 : 0}
                    allowsTickMarkValuesOnly={snapping}
                    isContinuous={continuous}
                    ariaLabel="Anatomy slider"
                    tickLabels={snapping ? ["Slow", "", "", "", "Fast"] : undefined}
                  />
                </div>

                {/* caption for ticks */}
                {snapping ? (
                  <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2">
                    <div className="mx-auto mb-1 h-4 w-px bg-stone-300" />
                    <div className="flex items-center gap-2">
                      <Pill
                        n={4}
                        label="Tick marks"
                        active={selected === "ticks"}
                        onClick={() => setSelected("ticks")}
                      />
                      <button
                        type="button"
                        onClick={() => setSelected("ticks")}
                        className={`whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-left text-[12px] leading-snug shadow-sm transition-colors ${
                          selected === "ticks"
                            ? "border-stone-900 bg-stone-900 text-white"
                            : "border-stone-200 bg-white text-stone-600 hover:border-[#0071e3]/40"
                        }`}
                      >
                        <span className="font-semibold">Tick marks</span>
                        <span className="block font-mono text-[10px] opacity-70">
                          numberOfTickMarks · .below
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2">
                    <button
                      type="button"
                      onClick={() => setMode("ticks")}
                      className="rounded-lg border border-dashed border-stone-300 bg-white px-3 py-1.5 text-[12px] text-stone-500 transition-colors hover:border-[#0071e3]/50 hover:text-[#0071e3]"
                    >
                      ④ tick marks are off — switch to “snapping ticks” to see
                      them
                    </button>
                  </div>
                )}
              </div>

              {/* mobile fallback labels */}
              <div className="mt-2 grid gap-2 sm:hidden">
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
                  <span className="text-stone-500">NSSlider.</span>
                  numberOfTickMarks ={" "}
                  <span className="text-sky-300">
                    {snapping ? "5" : "0"}
                  </span>{" "}
                  <span className="text-stone-500">·</span>{" "}
                  allowsTickMarkValuesOnly ={" "}
                  <span className="text-sky-300">
                    {snapping ? "true" : "false"}
                  </span>
                </p>
                <p>
                  <span className="text-stone-500">NSSlider.</span>isContinuous
                  ={" "}
                  <span className="text-sky-300">
                    {continuous ? "true" : "false"}
                  </span>{" "}
                  <span className="text-stone-500">·</span> value ={" "}
                  <span className="text-amber-300">{value}</span>
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                <span>
                  Focus the knob, then use <Kbd>←</Kbd> <Kbd>→</Kbd>{" "}
                  <Kbd>Home</Kbd> <Kbd>End</Kbd>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .querySelector('[role="slider"]')
                      ?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                  className="rounded-md border border-stone-200 bg-white px-2 py-1 font-medium text-stone-600 hover:border-[#0071e3]/40 hover:text-[#0071e3]"
                >
                  Scroll knob into view
                </button>
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
            Three places a slider earns its keep
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                href: "/scenarios/volume-control/",
                tag: "continuous · isContinuous = true",
                t: "Volume control",
                d: "A media player volume slider with live feedback — no ticks, any value 0–100, updates while you drag.",
              },
              {
                href: "/scenarios/playback-speed/",
                tag: "discrete · snaps to 6 ticks",
                t: "Playback speed",
                d: "A video speed picker with six labelled stops — 0.5× to 2× — that clicks between ticks like Key Repeat.",
              },
              {
                href: "/scenarios/brightness-control/",
                tag: "continuous · live preview",
                t: "Brightness control",
                d: "A photo brightness slider where the whole scene re-lights as you drag — the filled track is the preview.",
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
            A note on fidelity: macOS NSSlider is a native AppKit control.
            This hub rebuilds its look and behaviour — linear track, round
            knob, tinted lead, below-ticks with snapping, continuous updates —
            with web pointer events and ARIA so you can feel each API symbol
            do its job.
          </p>
        </section>
      </div>
    </main>
  );
}
