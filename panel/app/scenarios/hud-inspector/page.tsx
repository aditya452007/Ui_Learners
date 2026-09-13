"use client";

import { useEffect, useState } from "react";
import FloatingPanel from "@/components/FloatingPanel";
import { BackLink, ConfigChips, Eyebrow, ScenarioNav, WhyFit } from "@/components/chrome";

type Grade = { exposure: number; temp: number; sat: number; con: number; vig: number };

const DEFAULTS: Grade = { exposure: 0, temp: 0, sat: 100, con: 100, vig: 35 };

const PRESETS: { name: string; value: Grade }[] = [
  { name: "Reset", value: DEFAULTS },
  { name: "Noir", value: { exposure: -18, temp: -30, sat: 0, con: 150, vig: 70 } },
  { name: "Golden", value: { exposure: 14, temp: 65, sat: 125, con: 95, vig: 30 } },
  { name: "Cold Open", value: { exposure: -6, temp: -70, sat: 85, con: 115, vig: 45 } },
];

function fmtTC(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  const f = Math.floor((sec % 1) * 24).toString().padStart(2, "0");
  return `00:${m}:${s}:${f}`;
}

function HudSlider({
  label,
  value,
  min,
  max,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between text-[11px]">
        <span className="font-medium text-white/70">{label}</span>
        <span className="font-mono text-white/50">{display}</span>
      </span>
      <input
        type="range"
        data-nodrag
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="hud-range w-full"
      />
    </label>
  );
}

export default function HudInspector() {
  const [grade, setGrade] = useState<Grade>(DEFAULTS);
  const [hudOpen, setHudOpen] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [playhead, setPlayhead] = useState(12.4);
  const [panelStart] = useState(() =>
    typeof window === "undefined"
      ? { x: 560, y: 40 }
      : { x: window.innerWidth < 760 ? 12 : Math.min(660, Math.round(window.innerWidth * 0.52)), y: 40 },
  );

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setPlayhead((p) => (p >= 96 ? 0 : p + 0.24));
    }, 100);
    return () => window.clearInterval(id);
  }, [playing]);

  const set = (k: keyof Grade) => (v: number) => setGrade((g) => ({ ...g, [k]: v }));

  const warm = Math.max(0, grade.temp) / 100;
  const cool = Math.max(0, -grade.temp) / 100;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <BackLink />
        <div>
          <Eyebrow>Scenario 2 · HUD chrome</Eyebrow>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">Color HUD over a viewer</h1>
          <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-stone-600">
            Lumen, a tiny color-grading app. The inspector wears the dark translucent{" "}
            <code className="rounded bg-stone-100 px-1 font-mono text-[13px]">hudWindow</code> chrome —
            drag a slider and the footage grades live. Focus any slider and nudge with ← → keys:
            the panel takes key status only because a control needs it (
            <code className="rounded bg-stone-100 px-1 font-mono text-[13px]">becomesKeyOnlyIfNeeded</code>).
          </p>
        </div>
        <ConfigChips items={["StyleMask.hudWindow", "becomesKeyOnlyIfNeeded", "live utility sliders", "closable · re-openable"]} />
        <WhyFit>
          Graders judge color against the image — every glance away to a side panel breaks that judgment.
          A HUD floats directly over the viewer in dark translucent chrome that visually disappears against
          footage, so the eye never leaves the frame. Try the presets, then drag the panel off the picture:
          notice how much harder the same sliders are to judge against grey.
        </WhyFit>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setHudOpen((v) => !v)}
            className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-[13px] font-medium text-stone-700 transition-colors hover:border-stone-300"
          >
            {hudOpen ? "Window ▸ Hide Color HUD" : "Window ▸ Show Color HUD"}
          </button>
          <span className="font-mono text-[11px] text-stone-400">panels reopen without consequence — nothing to lose</span>
        </div>

        <div className="desktop-dots-dark relative min-h-[620px] overflow-hidden rounded-2xl border border-stone-800 p-4 sm:p-8">
          {/* viewer document window */}
          <div className="relative w-full max-w-[680px]" style={{ zIndex: 10 }}>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1c1c1e] shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="size-3 rounded-full bg-[#ff5f57]" />
                  <span className="size-3 rounded-full bg-[#febc2e]" />
                  <span className="size-3 rounded-full bg-[#28c840]" />
                </span>
                <p className="flex-1 text-center text-[12px] font-semibold text-stone-300">M2_0417.mov — Lumen</p>
                <span className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                  <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" /> key
                </span>
              </div>

              {/* preview frame */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <svg
                  viewBox="0 0 640 360"
                  preserveAspectRatio="xMidYMid slice"
                  className="absolute inset-0 h-full w-full"
                  style={{
                    filter: `brightness(${1 + grade.exposure / 150}) contrast(${grade.con / 100}) saturate(${grade.sat / 100})`,
                  }}
                  aria-label="Graded preview frame"
                  role="img"
                >
                  <defs>
                    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2b3a67" />
                      <stop offset="55%" stopColor="#e08e45" />
                      <stop offset="75%" stopColor="#f4d35e" />
                    </linearGradient>
                  </defs>
                  <rect width="640" height="270" fill="url(#sky)" />
                  <circle cx="430" cy="215" r="42" fill="#fff3d6" opacity="0.95" />
                  <polygon points="0,270 140,150 280,270" fill="#3a3a44" />
                  <polygon points="180,270 340,130 500,270" fill="#2c2c34" />
                  <polygon points="400,270 540,170 680,270" fill="#3a3a44" />
                  <rect y="268" width="640" height="92" fill="#22222a" />
                  <rect y="268" width="640" height="6" fill="#f4d35e" opacity="0.5" />
                </svg>
                <div className="pointer-events-none absolute inset-0 bg-amber-500" style={{ opacity: warm * 0.28 }} />
                <div className="pointer-events-none absolute inset-0 bg-sky-500" style={{ opacity: cool * 0.3 }} />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.85) 100%)",
                    opacity: grade.vig / 100,
                  }}
                />
                <p className="absolute left-3 top-2.5 font-mono text-[11px] text-white/85 drop-shadow">
                  {fmtTC(playhead)} {playing ? "▶" : "❚❚"}
                </p>
              </div>

              {/* transport */}
              <div className="flex items-center gap-3 border-t border-white/10 px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => setPlaying((v) => !v)}
                  aria-label={playing ? "Pause" : "Play"}
                  className="grid size-8 place-items-center rounded-full bg-white text-sm text-stone-900 transition-transform hover:scale-105"
                >
                  <span aria-hidden>{playing ? "❚❚" : "▶"}</span>
                </button>
                <input
                  type="range"
                  min={0}
                  max={96}
                  step={0.1}
                  value={playhead}
                  onChange={(e) => setPlayhead(Number(e.target.value))}
                  aria-label="Timeline scrubber"
                  className="hud-range flex-1"
                />
                <span className="font-mono text-[11px] text-white/60">00:01:36</span>
              </div>
            </div>
          </div>

          {/* HUD panel */}
          {hudOpen && (
            <FloatingPanel
              title="Color"
              hud
              initialX={panelStart.x}
              initialY={panelStart.y}
              width={280}
              zIndex={30}
              onClose={() => setHudOpen(false)}
              footer={<span>hudWindow · vibrancy · Lumen</span>}
            >
              <div className="flex flex-col gap-3">
                <HudSlider label="Exposure" value={grade.exposure} min={-100} max={100} display={grade.exposure > 0 ? `+${grade.exposure}` : `${grade.exposure}`} onChange={set("exposure")} />
                <HudSlider label="Temperature" value={grade.temp} min={-100} max={100} display={grade.temp > 0 ? `+${grade.temp} warm` : grade.temp < 0 ? `${grade.temp} cool` : "0"} onChange={set("temp")} />
                <HudSlider label="Saturation" value={grade.sat} min={0} max={200} display={`${grade.sat}%`} onChange={set("sat")} />
                <HudSlider label="Contrast" value={grade.con} min={0} max={200} display={`${grade.con}%`} onChange={set("con")} />
                <HudSlider label="Vignette" value={grade.vig} min={0} max={100} display={`${grade.vig}%`} onChange={set("vig")} />
                <div className="grid grid-cols-4 gap-1 pt-1" role="group" aria-label="Grade presets">
                  {PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      data-nodrag
                      onClick={() => setGrade(p.value)}
                      className="rounded-lg px-1 py-1.5 text-[11px] font-medium text-stone-200 transition-colors hover:bg-white/10"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] leading-relaxed text-white/45">
                  Tab to a slider, then use ← → — the panel becomes key only while a control needs the keyboard.
                </p>
              </div>
            </FloatingPanel>
          )}
        </div>

        <ScenarioNav
          prev={{ href: "/scenarios/tools-palette", label: "Tools palette" }}
          next={{ href: "/scenarios/spotlight-launcher", label: "Command launcher" }}
        />
      </div>
    </main>
  );
}
