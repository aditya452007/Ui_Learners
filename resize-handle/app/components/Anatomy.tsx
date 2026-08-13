"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const MIN_H = 120;
const MAX_H = 420;

const SAMPLE = `The grip is the three little lines in the bottom-right corner of a resizable field.

Press and hold it, then drag down — the field grows. Drag up — it shrinks.

But it never gets shorter than 120px or taller than 420px: min-height and max-height stop you.

Width never changes either. This field is resize: vertical, so the grip only works up and down.`;

function Pill({
  n,
  label,
  style,
}: {
  n: number;
  label: ReactNode;
  style: CSSProperties;
}) {
  return (
    <div
      className="absolute z-10 flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-sm"
      style={style}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-mono text-xs font-semibold text-white">
        {n}
      </span>
      <span className="whitespace-nowrap text-xs font-medium text-stone-800">
        {label}
      </span>
    </div>
  );
}

export default function Anatomy() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [height, setHeight] = useState(260);
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(Math.round(entry.contentRect.height));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const startDrag = () => {
    setTouched(true);
    setDragging(true);
    const end = () => {
      setDragging(false);
      window.removeEventListener("pointerup", end);
    };
    window.addEventListener("pointerup", end);
  };

  const gripY = 48 + height;
  const rulerY = 48 + height + 20;
  const pct = ((height - MIN_H) / (MAX_H - MIN_H)) * 100;
  const atMin = height <= MIN_H;
  const atMax = height >= MAX_H;
  const state = atMin
    ? "at the min bound (120px)"
    : atMax
      ? "at the max bound (420px)"
      : "within bounds 120–420px";

  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-stone-50/80 p-8">
      <div className="dot-grid relative mx-auto h-[620px] w-[820px] rounded-xl">
        <textarea
          ref={ref}
          onPointerDown={startDrag}
          onBlur={() => setDragging(false)}
          defaultValue={SAMPLE}
          style={{ height: 260, minHeight: MIN_H, maxHeight: MAX_H }}
          className="absolute left-[180px] top-[48px] w-[460px] resize-y rounded-xl border border-stone-200 bg-white p-4 text-sm leading-6 text-stone-800 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-14px_rgba(0,0,0,0.14)] outline-none transition-[border-color,box-shadow] focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
        />

        {!touched && (
          <div
            className="absolute z-10 whitespace-nowrap font-mono text-xs font-medium text-indigo-600"
            style={{ left: 700, top: gripY + 2 }}
          >
            ← grab the grip
          </div>
        )}

        <div
          className="absolute h-2 w-2 rounded-full border-2 border-white bg-indigo-500"
          style={{ left: 644, top: gripY + 4 }}
        />
        <div
          className="absolute w-[2px] rounded-full bg-indigo-400/70"
          style={{ left: 648, top: gripY + 8, height: 520 - (gripY + 8) }}
        />

        <div className="absolute flex w-3 flex-col items-center" style={{ left: 616, top: 96 }}>
          <span className="h-0 w-0 border-x-[4px] border-b-[6px] border-x-transparent border-b-stone-400" />
          <span className="my-1 h-3 w-0.5 bg-stone-400" />
          <span className="h-0 w-0 border-x-[4px] border-t-[6px] border-x-transparent border-t-stone-400" />
        </div>
        <div
          className="absolute h-2 w-2 rounded-full border-2 border-white bg-indigo-500"
          style={{ left: 634, top: 109 }}
        />
        <div
          className="absolute h-[2px] rounded-full bg-indigo-400/70"
          style={{ left: 640, top: 112, width: 8 }}
        />

        <div
          className="absolute h-2 w-2 rounded-full border-2 border-white bg-indigo-500"
          style={{ left: 173, top: rulerY - 4 }}
        />
        <div
          className="absolute w-[2px] rounded-full bg-indigo-400/70"
          style={{ left: 177, top: rulerY, height: 520 - rulerY }}
        />

        <div className="absolute" style={{ left: 180, top: rulerY, width: 460 }}>
          <div className="relative h-1.5 w-full rounded-full bg-stone-200">
            <div
              className="absolute h-full rounded-full bg-gradient-to-r from-indigo-300 to-indigo-500"
              style={{ width: `${pct}%` }}
            />
            <div
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-indigo-600 shadow"
              style={{ left: `calc(${pct}% - 6px)` }}
            />
          </div>
        </div>
        <div
          className="absolute font-mono text-[10px] text-stone-400"
          style={{ left: 180, top: rulerY - 16 }}
        >
          120px
        </div>
        <div
          className="absolute font-mono text-[10px] text-stone-400"
          style={{ left: 640, top: rulerY - 16, transform: "translateX(-100%)" }}
        >
          420px
        </div>

        <Pill
          n={1}
          label="the size grip"
          style={{ left: 648, top: 520, transform: "translateX(-50%)" }}
        />
        <Pill
          n={2}
          label={
            <>
              the axis — <span className="font-mono text-[0.9em] text-indigo-700">resize: vertical</span>
            </>
          }
          style={{ left: 648, top: 92 }}
        />
        <Pill
          n={3}
          label="min/max height bounds 120–420px"
          style={{ left: 177, top: 520, transform: "translateX(-50%)" }}
        />

        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 shadow-sm">
          <span
            className={`h-2 w-2 rounded-full ${atMin || atMax ? "bg-amber-500" : "bg-emerald-500"}`}
          />
          <span className="whitespace-nowrap font-mono text-xs text-stone-700">
            height: {height}px · width: 460px · {state}
            {dragging && <span className="text-indigo-600"> · dragging…</span>}
          </span>
        </div>
      </div>
    </div>
  );
}
