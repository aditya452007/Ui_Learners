"use client";

import { useEffect, useState } from "react";

const PLANES = [
  { key: "far", label: "far plane", ratio: 0.25, bar: "bg-rose-400" },
  { key: "mid", label: "mid plane", ratio: 0.55, bar: "bg-teal-300" },
  { key: "near", label: "near plane", ratio: 0.8, bar: "bg-indigo-300" },
  { key: "content", label: "content", ratio: 1, bar: "bg-white/70" },
];

export default function ScrollHud() {
  const [px, setPx] = useState(0);
  const [race, setRace] = useState(0); // 0..1 through the lab race window

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const vh = window.innerHeight / 100;
      const start = 290 * vh; // lab race window — keep in sync with globals.css
      const len = 80 * vh;
      const y = window.scrollY;
      setPx(y);
      setRace(Math.min(1, Math.max(0, (y - start) / len)));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-50 w-64 rounded-xl border border-white/10 bg-black/75 p-4 font-mono text-[11px] text-white/80 backdrop-blur">
      <p className="mb-3 flex items-baseline justify-between text-white/60">
        <span>scroll-linked speeds</span>
        <span>{px.toLocaleString()}px</span>
      </p>

      {PLANES.map((plane) => (
        <div key={plane.key} className="mb-2 flex items-center gap-2">
          <span className="w-14 shrink-0">{plane.label}</span>
          <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className={`absolute inset-y-0 left-0 ${plane.bar}`}
              style={{ width: `${plane.ratio * 100}%` }}
            />
            <div
              className="absolute inset-y-[-2px] w-px bg-white/90"
              style={{ left: `${race * 100}%` }}
            />
          </div>
          <span className="w-9 shrink-0 text-right text-white/50">
            {Math.round(plane.ratio * 100)}%
          </span>
        </div>
      ))}

      <p className="mt-2 border-t border-white/10 pt-2 leading-relaxed text-white/40">
        how fast each plane appears to move vs. your scroll · the white line is
        the lab race progress
      </p>
    </div>
  );
}
