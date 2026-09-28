"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Material, Wallpaper } from "../../components/materials";

/* ------------------------------------------------------------------ */

const SEGMENTS = 16;

function Segments({ value }: { value: number }) {
  const filled = Math.round((value / 100) * SEGMENTS);
  return (
    <div className="flex gap-1" role="img" aria-label={`${value} percent`}>
      {Array.from({ length: SEGMENTS }).map((_, i) => (
        <span
          key={i}
          className={`h-2.5 w-1.5 rounded-[3px] ${i < filled ? "bg-white" : "bg-white/25"}`}
        />
      ))}
    </div>
  );
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true" className="fill-white">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      {muted ? (
        <path d="m16 9 5 6m0-6-5 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      ) : (
        <>
          <path d="M16 8.5a5 5 0 0 1 0 7M18.2 6a8.4 8.4 0 0 1 0 12" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </>
      )}
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true" className="fill-white">
      <circle cx="12" cy="12" r="4.2" />
      <g stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */

export default function HudScenario() {
  const [volume, setVolume] = useState(62);
  const [muted, setMuted] = useState(false);
  const [brightness, setBrightness] = useState(80);
  const [hud, setHud] = useState<"volume" | "brightness" | null>(null);
  const timer = useRef<number | null>(null);

  function flash(which: "volume" | "brightness") {
    setHud(which);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setHud(null), 1600);
  }

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <nav className="flex items-center justify-between text-xs font-semibold">
        <Link href="/" className="text-[#0071e3] hover:underline">
          ← Hub
        </Link>
        <span className="flex gap-3 text-[#86868b]">
          <Link href="/scenarios/menu-bar" className="hover:text-[#0071e3] hover:underline">
            ← 2 · Menu bar
          </Link>
          <span className="text-[#1d1d1f]">3 · HUD</span>
        </span>
      </nav>

      <header className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3]">
          Scenario 3 · Bezel
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#1d1d1f]">
          Volume / brightness HUD
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6e6e73]">
          <strong className="font-semibold text-[#3a3a3c]">Why glass fits here:</strong> an
          on-screen display interrupts a movie, a call, a game — it must be glanceable and then
          gone. <code className="font-mono text-[12px]">Material.hudWindow</code> stays dark in
          every appearance so it reads over bright footage, and vibrant white glyphs carry the
          value in one look.
        </p>
      </header>

      {/* the stage */}
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-[#e5e5ea] shadow-sm" style={{ height: 440 }}>
        <Wallpaper name="dune" />
        <div className="absolute inset-0 grid place-items-center p-6">
          <div className="vy-window-shadow w-full max-w-[560px] overflow-hidden rounded-xl bg-[#1e1e20]">
            <div className="flex items-center gap-2 bg-black/40 px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
              <span className="size-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
              <span className="ml-2 text-xs font-medium text-white/70">coastline-drive.mp4</span>
            </div>
            <div className="relative grid h-44 place-items-center">
              <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.14)" />
                <path d="M26 21.5v21l17-10.5z" fill="#fff" />
              </svg>
              <p className="absolute bottom-3 text-[11px] text-white/60">paused — drag a slider below to summon the bezel</p>
            </div>
          </div>
        </div>

        {/* the bezel */}
        <div
          aria-live="polite"
          className={`absolute inset-0 grid place-items-center transition-all duration-300 ${
            hud ? "pointer-events-none opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95"
          }`}
        >
          <Material kind="hud" appearance="dark" label={`${hud} level`} className="flex w-52 flex-col items-center gap-3 rounded-2xl px-6 py-5">
            {hud === "brightness" ? <SunIcon /> : <SpeakerIcon muted={muted || volume === 0} />}
            <Segments value={hud === "brightness" ? brightness : muted ? 0 : volume} />
          </Material>
        </div>

        {/* control strip */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4">
          <Material kind="hud" appearance="dark" label="Display controls" className="flex w-full max-w-[520px] items-center gap-4 rounded-2xl px-5 py-3">
            <button
              type="button"
              onClick={() => {
                setMuted(!muted);
                flash("volume");
              }}
              aria-pressed={muted}
              aria-label={muted ? "Unmute" : "Mute"}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 transition hover:bg-white/25"
            >
              <span className="scale-[0.55]"><SpeakerIcon muted={muted} /></span>
            </button>
            <label className="flex flex-1 items-center gap-2 text-xs font-semibold text-white/80">
              Volume
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (muted) setMuted(false);
                  flash("volume");
                }}
                className="vy-range"
                aria-label="Volume"
              />
            </label>
            <label className="flex flex-1 items-center gap-2 text-xs font-semibold text-white/80">
              Brightness
              <input
                type="range"
                min={0}
                max={100}
                value={brightness}
                onChange={(e) => {
                  setBrightness(Number(e.target.value));
                  flash("brightness");
                }}
                className="vy-range"
                aria-label="Brightness"
              />
            </label>
          </Material>
        </div>
      </div>

      <p className="mt-2 text-xs text-[#6e6e73]" aria-live="polite">
        Volume {muted ? "muted" : `${volume}%`} · Brightness {brightness}% — the bezel flashes on
        every change and fades after a moment, like the real OSD.
      </p>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-[#e5e5ea] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3]">Edge handling</p>
          <p className="mt-1 text-xs leading-relaxed text-[#6e6e73]">
            Dragging volume to zero — or hitting mute — swaps the glyph to the muted speaker while
            the segment bar empties. Rapid drags re-arm the fade timer instead of stacking bezels,
            and the glyph region is a live region so screen readers hear the value.
          </p>
        </div>
        <div className="rounded-2xl border border-[#e5e5ea] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3]">Try it</p>
          <p className="mt-1 text-xs leading-relaxed text-[#6e6e73]">
            Sweep the brightness slider and watch the 16 segments chase your thumb. The bezel
            ignores light and dark mode alike — that deliberate darkness is what makes a HUD a HUD.
          </p>
        </div>
      </div>
    </main>
  );
}
