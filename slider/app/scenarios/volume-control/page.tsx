"use client";

import { useState } from "react";
import { Slider } from "../../Slider";
import { ScenarioNav } from "../../ScenarioNav";

const TRACKS = [
  { title: "Glasswing Morning", artist: "Marina Kessler", len: "3:42" },
  { title: "Paper Lanterns", artist: "The Field Notes", len: "4:05" },
  { title: "Slow Ferry Home", artist: "A. Okafor", len: "2:58" },
];

export default function VolumePage() {
  const [volume, setVolume] = useState(62);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);

  const effective = muted ? 0 : volume;
  const bars = 24;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <ScenarioNav current="/scenarios/volume-control/" />
        <header className="max-w-2xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#0071e3]">
            Scenario 1 · continuous · isContinuous = true
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Volume control in a media player
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
            Drift FM — a tiny desktop player. No tick marks here: volume is a
            true continuum from 0 to 100, and the level updates{" "}
            <em>while you drag</em>, not on release.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Player card */}
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-4">
              <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-stone-900 text-white">
                <span className="font-serif text-2xl font-bold">D</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-stone-900">
                  {TRACKS[1].title}
                </p>
                <p className="text-[13px] text-stone-500">
                  {TRACKS[1].artist} · {TRACKS[1].len}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause" : "Play"}
                className="ml-auto grid size-11 place-items-center rounded-full bg-[#0071e3] text-lg text-white shadow-md transition-transform hover:scale-105"
              >
                {playing ? "❚❚" : "▶"}
              </button>
            </div>

            {/* fake progress */}
            <div className="mt-5">
              <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
                <div className="h-full w-[38%] rounded-full bg-stone-400" />
              </div>
              <div className="mt-1 flex justify-between font-mono text-[11px] text-stone-400">
                <span>1:24</span>
                <span>4:05</span>
              </div>
            </div>

            {/* visualizer reacts live */}
            <div
              className="mt-4 flex h-16 items-end gap-1 rounded-xl bg-[#fafaf9] p-3 ring-1 ring-stone-200/60"
              aria-hidden="true"
            >
              {Array.from({ length: bars }, (_, i) => {
                const wave =
                  Math.abs(Math.sin(i * 0.9)) * 0.7 +
                  Math.abs(Math.sin(i * 0.37 + 1)) * 0.3;
                const h = 6 + wave * (effective / 100) * 44;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-full bg-[#0071e3] transition-all duration-150"
                    style={{ height: h, opacity: 0.35 + (effective / 100) * 0.65 }}
                  />
                );
              })}
            </div>

            {/* The slider itself */}
            <div className="mt-5 rounded-xl bg-[#fafaf9] p-5 ring-1 ring-stone-200/60">
              <div className="mb-3 flex items-center justify-between">
                <label
                  htmlFor="volume-slider"
                  className="text-[13px] font-semibold text-stone-800"
                >
                  Volume
                </label>
                <span className="font-mono text-[12px] text-stone-500">
                  {muted ? "muted" : `${volume}`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? "Unmute" : "Mute"}
                  aria-pressed={muted}
                  className="grid size-9 shrink-0 place-items-center rounded-lg border border-stone-200 bg-white text-[15px] transition-colors hover:border-[#0071e3]/40"
                >
                  {muted ? "🔇" : effective < 33 ? "🔈" : effective < 70 ? "🔉" : "🔊"}
                </button>
                <div className="flex-1" id="volume-slider">
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={muted ? 0 : volume}
                    onChange={(v) => {
                      setVolume(v);
                      if (v > 0) setMuted(false);
                    }}
                    isContinuous
                    ariaLabel="Volume"
                  />
                </div>
                <span className="w-10 shrink-0 text-right font-mono text-[12px] font-bold text-stone-900">
                  {muted ? 0 : volume}
                </span>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-stone-500">
                Click the track to jump, drag for fine control, or focus the
                knob and nudge with <kbd className="rounded border border-stone-300 bg-white px-1 font-mono text-[10px]">←</kbd>{" "}
                <kbd className="rounded border border-stone-300 bg-white px-1 font-mono text-[10px]">→</kbd>.
                Unmuting restores your last level.
              </p>
            </div>

            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                Up next
              </p>
              <ul className="mt-2 divide-y divide-stone-100">
                {TRACKS.filter((_, i) => i !== 1).map((t) => (
                  <li key={t.title} className="flex items-center gap-3 py-2">
                    <span className="grid size-9 place-items-center rounded-lg bg-stone-100 text-[13px] text-stone-500">
                      ♪
                    </span>
                    <span className="text-[13px] font-medium text-stone-800">
                      {t.title}
                    </span>
                    <span className="ml-auto font-mono text-[11px] text-stone-400">
                      {t.len}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Why it fits */}
          <aside className="flex flex-col gap-3">
            <div className="rounded-2xl border border-[#0071e3]/25 bg-[#f0f7ff] p-5">
              <p className="text-sm font-semibold text-stone-900">
                Why a slider fits here
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-stone-700">
                Volume is a <em>continuous quantity with instant feedback</em>:
                you want to hear the change while your finger is still down,
                and any of 101 levels is valid. A stepper would take 60 clicks;
                a text field would break the listening flow. The slider maps
                finger position to loudness one-to-one, and{" "}
                <code className="rounded bg-white px-1 font-mono text-[12px]">
                  isContinuous = true
                </code>{" "}
                means the bars, the icon, and the number all move mid-drag.
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-stone-700">
                What the user gains: <strong>faster tuning with zero errors</strong> —
                overshoot, then ease back, all by feel, with mute as a safe
                harbour that never loses the last level.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">
                Try this
              </p>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-stone-600">
                <li>Drag slowly from 0 to 100 — the bars grow with you.</li>
                <li>Click halfway along the grey groove to jump.</li>
                <li>Hit mute, drag, then unmute — your level returns.</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5 font-mono text-[11px] leading-relaxed text-stone-500">
              NSSlider · SliderType.linear
              <br />
              numberOfTickMarks = 0 · isContinuous = true
              <br />
              min 0 · max 100 · step 1
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
