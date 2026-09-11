"use client";

import { useState } from "react";
import { Slider } from "../../Slider";
import { ScenarioNav } from "../../ScenarioNav";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const LABELS = SPEEDS.map((s) => `${s}×`);
const LESSON_SECONDS = 12 * 60 + 34; // 12:34

function fmt(total: number) {
  const m = Math.floor(total / 60);
  const s = Math.round(total % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function PlaybackSpeedPage() {
  const [idx, setIdx] = useState(2); // 1×
  const speed = SPEEDS[idx];
  const adjusted = LESSON_SECONDS / speed;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <ScenarioNav current="/scenarios/playback-speed/" />
        <header className="max-w-2xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#0071e3]">
            Scenario 2 · discrete · allowsTickMarkValuesOnly = true
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Playback speed with snapping ticks
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
            Skillshare-style lesson player. Speed is not a continuum — the
            player only understands six rates — so the knob{" "}
            <em>clicks between stops</em> exactly like the Key Repeat slider in
            System Settings.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
            {/* fake video */}
            <div className="relative overflow-hidden rounded-xl bg-stone-900">
              <div className="flex aspect-video flex-col justify-between p-5">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white">
                    Lesson 4 · Colour theory
                  </span>
                  <span className="ml-auto rounded-full bg-[#0071e3] px-2.5 py-1 font-mono text-[11px] font-bold text-white">
                    {speed}×
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">
                      Warm vs. cool light
                    </p>
                    <p className="font-mono text-[12px] text-white/60">
                      {fmt(adjusted)} at {speed}× · was {fmt(LESSON_SECONDS)}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Play preview"
                    className="grid size-12 place-items-center rounded-full bg-white text-lg text-stone-900 shadow-lg transition-transform hover:scale-105"
                  >
                    ▶
                  </button>
                </div>
              </div>
              {/* progress */}
              <div className="h-1 bg-white/15">
                <div className="h-full w-[64%] bg-white" />
              </div>
            </div>

            {/* stop chips */}
            <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Speed presets">
              {SPEEDS.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={i === idx}
                  onClick={() => setIdx(i)}
                  className={`rounded-lg px-3 py-1.5 font-mono text-[12px] transition-colors ${
                    i === idx
                      ? "bg-stone-900 text-white shadow-sm"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {s}×
                </button>
              ))}
            </div>

            {/* The slider itself */}
            <div className="mt-3 rounded-xl bg-[#fafaf9] p-5 ring-1 ring-stone-200/60">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-[13px] font-semibold text-stone-800">
                  Playback speed
                </label>
                <span className="rounded-full bg-[#0071e3]/10 px-2.5 py-1 font-mono text-[12px] font-bold text-[#0071e3]">
                  {speed}× selected
                </span>
              </div>
              <Slider
                min={0}
                max={SPEEDS.length - 1}
                step={1}
                value={idx}
                onChange={(v) => setIdx(Math.round(v))}
                tickMarks={SPEEDS.length}
                allowsTickMarkValuesOnly
                isContinuous
                ariaLabel="Playback speed"
                tickLabels={LABELS}
              />
              <p className="mt-4 text-[12px] leading-relaxed text-stone-500">
                Drag anywhere — the knob snaps to the nearest tick on release
                and mid-drag. The chips above and the slider below are two
                views of the same state: pick either one.
              </p>
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ["Lesson length", fmt(LESSON_SECONDS)],
                ["At current speed", fmt(adjusted)],
                ["You save", idx >= 2 ? `−${fmt(LESSON_SECONDS - adjusted)}` : "+extra detail"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-[#fafaf9] p-3 ring-1 ring-stone-200/60">
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-stone-400">
                    {k}
                  </dt>
                  <dd className="mt-0.5 font-mono text-[14px] font-bold text-stone-900">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <aside className="flex flex-col gap-3">
            <div className="rounded-2xl border border-[#0071e3]/25 bg-[#f0f7ff] p-5">
              <p className="text-sm font-semibold text-stone-900">
                Why a slider fits here
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-stone-700">
                Speed <em>looks</em> continuous but the decoder only offers six
                real rates — a free slider would promise values that do not
                exist. Tick marks make the legal stops visible, and{" "}
                <code className="rounded bg-white px-1 font-mono text-[12px]">
                  allowsTickMarkValuesOnly
                </code>{" "}
                enforces them, so every landing is a playable rate with its
                time saving shown honestly.
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-stone-700">
                What the user gains: <strong>fewer errors, faster choice</strong> —
                no “1.13×” dead ends, and the 12-minute lesson visibly shrinks
                to 6:17 at 2× before committing.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">Try this</p>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-stone-600">
                <li>Drag halfway between 1× and 1.25× — watch it snap.</li>
                <li>Focus the knob and tap arrow keys to step tick by tick.</li>
                <li>Compare the “you save” readout at 0.5× vs 2×.</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5 font-mono text-[11px] leading-relaxed text-stone-500">
              NSSlider · numberOfTickMarks = 6<br />
              tickMarkPosition = .below · allowsTickMarkValuesOnly = true
              <br />
              min 0 · max 5 · step 1
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
