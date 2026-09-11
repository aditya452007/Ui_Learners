"use client";

import { useState } from "react";
import { Slider } from "../../Slider";
import { ScenarioNav } from "../../ScenarioNav";

export default function BrightnessPage() {
  const [brightness, setBrightness] = useState(58);
  const [committed, setCommitted] = useState(58);
  const [compare, setCompare] = useState(false);

  // Map 0..100 to a CSS brightness + warmth shift
  const b = brightness / 100; // 0..1
  const filter = `brightness(${0.55 + b * 0.9}) saturate(${0.85 + b * 0.45})`;
  const sunOpacity = 0.15 + b * 0.75;
  const glowSize = 60 + b * 120;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <ScenarioNav current="/scenarios/brightness-control/" />
        <header className="max-w-2xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#0071e3]">
            Scenario 3 · continuous with live preview · min / max edges
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Brightness in a photo editor
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
            “Golden Hour” edit in a darkroom-style panel. The whole scene
            re-lights as you drag — the blue lead <em>is</em> the preview
            meter, from clipped shadows at 0 to glowing highlights at 100.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
            {/* Preview scene (pure CSS, no assets) */}
            <div className="relative overflow-hidden rounded-xl" style={{ filter }}>
              <div
                className="relative aspect-[16/9] w-full"
                style={{
                  background:
                    "linear-gradient(180deg, #87a8c8 0%, #c9b896 46%, #5d6b4a 62%, #2f3a2a 100%)",
                }}
              >
                {/* sun */}
                <div
                  className="absolute left-[62%] top-[30%] rounded-full bg-[#fff7d6] transition-all duration-150"
                  style={{
                    width: 54,
                    height: 54,
                    opacity: sunOpacity,
                    boxShadow: `0 0 ${glowSize}px ${glowSize / 3}px rgba(255, 236, 170, ${0.35 + b * 0.5})`,
                  }}
                />
                {/* mountains */}
                <div
                  className="absolute inset-x-0 bottom-[26%] h-[34%] bg-[#3d4a3a]"
                  style={{ clipPath: "polygon(0 100%, 0 55%, 18% 18%, 34% 60%, 52% 28%, 70% 62%, 86% 30%, 100% 58%, 100% 100%)" }}
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-[30%] bg-[#232b20]"
                  style={{ clipPath: "polygon(0 100%, 0 40%, 25% 70%, 48% 35%, 72% 68%, 100% 45%, 100% 100%)" }}
                />
                {/* lake reflection */}
                <div className="absolute inset-x-[8%] bottom-[4%] h-[16%] rounded-[50%] bg-[#ffe9a8] opacity-40 blur-[2px]" />
                {compare && (
                  <div className="absolute inset-0 grid place-items-center bg-stone-900/55">
                    <span className="rounded-full bg-white px-3 py-1 font-mono text-[12px] font-bold text-stone-900">
                      before · {committed}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-stone-400">
              <span>GOLDEN-HOUR.RAW · 24 MP</span>
              <span>
                exposure {brightness > 75 ? "· highlights clipping" : brightness < 25 ? "· shadows clipping" : "· balanced"}
              </span>
            </div>

            {/* The slider itself */}
            <div className="mt-3 rounded-xl bg-[#fafaf9] p-5 ring-1 ring-stone-200/60">
              <div className="mb-3 flex items-center justify-between">
                <label className="text-[13px] font-semibold text-stone-800">
                  Brightness
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onPointerDown={() => setCompare(true)}
                    onPointerUp={() => setCompare(false)}
                    onPointerLeave={() => setCompare(false)}
                    className="rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-[12px] font-medium text-stone-600 transition-colors hover:border-[#0071e3]/40 hover:text-[#0071e3]"
                  >
                    hold to compare
                  </button>
                  <span className="w-10 text-right font-mono text-[13px] font-bold text-stone-900">
                    {brightness}
                  </span>
                </div>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={brightness}
                onChange={(v) => {
                  setBrightness(v);
                  setCommitted(v);
                }}
                isContinuous
                ariaLabel="Photo brightness"
              />
              <div className="mt-2 flex justify-between font-mono text-[10px] text-stone-400">
                <span>0 · deep shadow</span>
                <span>50 · as shot</span>
                <span>100 · full glow</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[
                  ["Dawn", 28],
                  ["As shot", 50],
                  ["Golden", 68],
                  ["Noon", 88],
                ].map(([label, v]) => (
                  <button
                    key={label as string}
                    type="button"
                    onClick={() => {
                      setBrightness(v as number);
                      setCommitted(v as number);
                    }}
                    aria-pressed={brightness === v}
                    className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                      brightness === v
                        ? "bg-stone-900 text-white shadow-sm"
                        : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-[#0071e3]/40"
                    }`}
                  >
                    {label} · {v}
                  </button>
                ))}
              </div>
            </div>

            {/* edge handling demo */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#fafaf9] p-3 ring-1 ring-stone-200/60">
                <p className="text-[12px] font-semibold text-stone-800">At min (0)</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-stone-500">
                  Shadows crush to black — the knob stops dead, the lead empties. Clamped, never negative.
                </p>
              </div>
              <div className="rounded-xl bg-[#fafaf9] p-3 ring-1 ring-stone-200/60">
                <p className="text-[12px] font-semibold text-stone-800">At max (100)</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-stone-500">
                  Sun blooms, warning shows “clipping”. The track ends: there is nowhere brighter to go.
                </p>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-3">
            <div className="rounded-2xl border border-[#0071e3]/25 bg-[#f0f7ff] p-5">
              <p className="text-sm font-semibold text-stone-900">
                Why a slider fits here
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-stone-700">
                Brightness is <em>judged by eye, not by number</em>: nobody
                knows they want “68” until they see it. A slider keeps the
                hand on the control and the eye on the photo, with{" "}
                <code className="rounded bg-white px-1 font-mono text-[12px]">
                  isContinuous = true
                </code>{" "}
                re-lighting every pixel mid-drag. Presets help you start;
                dragging helps you finish.
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-stone-700">
                What the user gains: <strong>fewer undo cycles</strong> —
                you sweep through the whole range once and stop where it
                sings, instead of typing numbers, waiting, and guessing again.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">Try this</p>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-stone-600">
                <li>Sweep 0 → 100 slowly and watch the sun bloom.</li>
                <li>Hold “compare” to flash the before state.</li>
                <li>Jump with one click on the track, then fine-tune with arrow keys.</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5 font-mono text-[11px] leading-relaxed text-stone-500">
              NSSlider · SliderType.linear
              <br />
              numberOfTickMarks = 0 · isContinuous = true
              <br />
              min 0 · max 100 · clamped edges
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
