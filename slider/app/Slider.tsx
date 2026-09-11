"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  /** Number of tick stops, e.g. 5. Renders little lines below the track. */
  tickMarks?: number;
  /** When true the knob snaps to tick stops (NSSlider.allowsTickMarkValuesOnly). */
  allowsTickMarkValuesOnly?: boolean;
  /** When true the value updates while dragging; when false it commits on release. */
  isContinuous?: boolean;
  disabled?: boolean;
  accentColor?: string;
  trackColor?: string;
  ariaLabel?: string;
  tickLabels?: string[];
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function roundToStep(v: number, step: number, min: number) {
  if (!step || step <= 0) return v;
  return Math.round((v - min) / step) * step + min;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  tickMarks = 0,
  allowsTickMarkValuesOnly = false,
  isContinuous = true,
  disabled = false,
  accentColor = "#0071e3",
  trackColor = "#e4e4e7",
  ariaLabel = "Slider",
  tickLabels,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);
  // Preview value used while dragging when isContinuous === false
  const [preview, setPreview] = useState<number | null>(null);
  const draggingRef = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const snapStep =
    allowsTickMarkValuesOnly && tickMarks > 1
      ? (max - min) / (tickMarks - 1)
      : step;

  const valueFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return clamp(value, min, max);
      const rect = el.getBoundingClientRect();
      const t = clamp((clientX - rect.left) / rect.width, 0, 1);
      let v = min + t * (max - min);
      if (allowsTickMarkValuesOnly && tickMarks > 1) {
        const tickStep = (max - min) / (tickMarks - 1);
        v = min + Math.round((v - min) / tickStep) * tickStep;
      } else {
        v = roundToStep(v, step, min);
      }
      // avoid float dust like 0.30000004
      const decimals = snapStep < 1 ? 2 : 0;
      v = Number(v.toFixed(decimals));
      return clamp(v, min, max);
    },
    [min, max, step, tickMarks, allowsTickMarkValuesOnly, snapStep, value]
  );

  const shown = preview ?? clamp(value, min, max);
  const pct = ((shown - min) / (max - min)) * 100;

  // Global pointer listeners so dragging survives leaving the track
  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const v = valueFromClientX(e.clientX);
      if (isContinuous) onChangeRef.current(v);
      else setPreview(v);
    };
    const up = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const v = valueFromClientX(e.clientX);
      draggingRef.current = false;
      setDragging(false);
      if (!isContinuous) {
        setPreview(null);
        onChangeRef.current(v);
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, isContinuous, valueFromClientX]);

  const beginDrag = (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    draggingRef.current = true;
    setDragging(true);
    const v = valueFromClientX(e.clientX);
    if (isContinuous) onChange(v);
    else setPreview(v);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const base = preview ?? clamp(value, min, max);
    let next: number | null = null;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = clamp(base + snapStep, min, max);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = clamp(base - snapStep, min, max);
        break;
      case "Home":
        next = min;
        break;
      case "End":
        next = max;
        break;
      case "PageUp":
        next = clamp(base + snapStep * 4, min, max);
        break;
      case "PageDown":
        next = clamp(base - snapStep * 4, min, max);
        break;
      default:
        return;
    }
    e.preventDefault();
    const decimals = snapStep < 1 ? 2 : 0;
    next = Number(next.toFixed(decimals));
    onChange(next);
  };

  const ticks = tickMarks > 1 ? Array.from({ length: tickMarks }, (_, i) => min + ((max - min) * i) / (tickMarks - 1)) : [];

  return (
    <div className="w-full select-none" style={{ touchAction: "none" }}>
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Number(shown.toFixed(2))}
        aria-valuetext={tickLabels ? tickLabels[Math.round(((shown - min) / (max - min)) * (tickMarks - 1))] ?? `${shown}` : `${shown}`}
        aria-disabled={disabled}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`relative w-full rounded-lg py-3 outline-none ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        } ${focused && !disabled ? "" : ""}`}
        style={
          focused && !disabled
            ? { boxShadow: `0 0 0 3px ${accentColor}33`, borderRadius: 12 }
            : undefined
        }
      >
        {/* Track */}
        <div
          ref={trackRef}
          onPointerDown={beginDrag}
          className="relative h-[6px] w-full rounded-full"
          style={{ backgroundColor: trackColor }}
        >
          {/* Filled track */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${pct}%`, backgroundColor: accentColor }}
          />
          {/* Knob */}
          <div
            onPointerDown={beginDrag}
            className="absolute top-1/2 z-10 rounded-full bg-white"
            style={{
              left: `${pct}%`,
              width: 22,
              height: 22,
              transform: `translate(-50%, -50%) scale(${dragging || focused ? 1.12 : 1})`,
              boxShadow:
                dragging || focused
                  ? `0 0 0 5px ${accentColor}26, 0 2px 8px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(0,0,0,0.06)`
                  : "0 1px 5px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(0,0,0,0.06)",
              border: `0.5px solid rgba(0,0,0,0.12)`,
              cursor: disabled ? "not-allowed" : dragging ? "grabbing" : "grab",
              transition: dragging ? "none" : "transform 120ms ease, box-shadow 120ms ease",
            }}
          />
        </div>

        {/* Tick marks below */}
        {ticks.length > 0 && (
          <div className="relative mt-[7px] h-[14px] w-full" aria-hidden="true">
            {ticks.map((t, i) => {
              const left = ((t - min) / (max - min)) * 100;
              const active = shown >= t - 1e-9;
              return (
                <div
                  key={i}
                  className="absolute top-0"
                  style={{ left: `${left}%`, transform: "translateX(-50%)" }}
                >
                  <div
                    style={{
                      width: 2,
                      height: active ? 8 : 6,
                      borderRadius: 1,
                      backgroundColor: active ? accentColor : "#c7c7cc",
                      opacity: active ? 0.9 : 0.9,
                    }}
                  />
                </div>
              );
            })}
            {tickLabels && (
              <div className="relative mt-[10px] h-4 w-full">
                {tickLabels.map((label, i) => {
                  const left = tickLabels.length > 1 ? (i / (tickLabels.length - 1)) * 100 : 50;
                  return (
                    <span
                      key={i}
                      className="absolute -translate-x-1/2 font-mono text-[10px] text-stone-500"
                      style={{ left: `${left}%` }}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
