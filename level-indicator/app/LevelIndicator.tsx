"use client";

import { useState } from "react";

export type LevelStyle =
  | "continuousCapacity"
  | "discreteCapacity"
  | "rating"
  | "relevancy";

export const ZONE_COLORS = {
  normal: "#16a34a",
  warning: "#d97706",
  critical: "#dc2626",
} as const;

export type Zone = keyof typeof ZONE_COLORS;

export function zoneFor(
  value: number,
  warningValue: number,
  criticalValue: number
): Zone {
  if (value >= criticalValue) return "critical";
  if (value >= warningValue) return "warning";
  return "normal";
}

export function zoneLabel(zone: Zone) {
  return zone === "critical"
    ? "critical"
    : zone === "warning"
      ? "warning"
      : "normal";
}

export interface LevelIndicatorProps {
  levelStyle?: LevelStyle;
  min?: number;
  max?: number;
  value: number;
  warningValue?: number;
  criticalValue?: number;
  /** Segments for .discreteCapacity */
  segments?: number;
  /** Symbols for .rating */
  maxRating?: number;
  /** Blocks for .relevancy */
  relevancyLevels?: number;
  interactive?: boolean;
  onChange?: (v: number) => void;
  ariaLabel?: string;
  showThresholds?: boolean;
  size?: "sm" | "md" | "lg";
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function Star({
  filled,
  dim,
  size,
}: {
  filled: boolean;
  dim?: boolean;
  size: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className="transition-all"
      style={{
        opacity: dim ? 0.45 : 1,
        filter: filled
          ? "drop-shadow(0 1px 2px rgba(217,119,6,0.35))"
          : "none",
      }}
    >
      <path
        d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.45l-5.8 3.05 1.1-6.47L2.6 9.45l6.5-.95L12 2.6z"
        fill={filled ? "#f59e0b" : "#e7e5e4"}
        stroke={filled ? "#b45309" : "#a8a29e"}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LevelIndicator({
  levelStyle = "continuousCapacity",
  min = 0,
  max = 100,
  value,
  warningValue = 70,
  criticalValue = 90,
  segments = 10,
  maxRating = 5,
  relevancyLevels = 5,
  interactive = false,
  onChange,
  ariaLabel = "Level indicator",
  showThresholds = false,
  size = "md",
}: LevelIndicatorProps) {
  const [hover, setHover] = useState<number | null>(null);
  const v = clamp(value, min, max);
  const norm = (v - min) / (max - min);
  const zone = zoneFor(v, warningValue, criticalValue);
  const color = ZONE_COLORS[zone];

  const barH =
    levelStyle === "continuousCapacity"
      ? size === "lg"
        ? 22
        : size === "sm"
          ? 12
          : 16
      : 14;

  if (levelStyle === "rating") {
    const shown = hover ?? Math.round(v);
    return (
      <div
        role={interactive ? "radiogroup" : "img"}
        aria-label={
          interactive
            ? ariaLabel
            : `${ariaLabel}: ${Math.round(v)} of ${maxRating} stars`
        }
        className="flex items-center gap-1"
        onMouseLeave={() => setHover(null)}
      >
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;
          const filled = starValue <= shown;
          if (!interactive) {
            return <Star key={i} filled={filled} size={size === "lg" ? 30 : size === "sm" ? 18 : 24} />;
          }
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={Math.round(v) === starValue}
              aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
              onMouseEnter={() => setHover(starValue)}
              onFocus={() => setHover(starValue)}
              onBlur={() => setHover(null)}
              onClick={() => onChange?.(starValue === Math.round(v) ? 0 : starValue)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                  e.preventDefault();
                  onChange?.(clamp(Math.round(v) + 1, 0, maxRating));
                }
                if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                  e.preventDefault();
                  onChange?.(clamp(Math.round(v) - 1, 0, maxRating));
                }
              }}
              className="rounded-md p-0.5 outline-none transition-transform hover:scale-115 focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2"
            >
              <Star filled={filled} size={size === "lg" ? 30 : size === "sm" ? 18 : 24} />
            </button>
          );
        })}
      </div>
    );
  }

  if (levelStyle === "relevancy") {
    const filledCount = Math.round(norm * relevancyLevels);
    return (
      <div
        role="meter"
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Number(v.toFixed(1))}
        aria-valuetext={`${filledCount} of ${relevancyLevels} relevance blocks`}
        className="flex items-end gap-[3px]"
        title={`${filledCount}/${relevancyLevels} relevance`}
      >
        {Array.from({ length: relevancyLevels }, (_, i) => {
          const filled = i < filledCount;
          const h = 6 + (i / Math.max(relevancyLevels - 1, 1)) * 12;
          return (
            <span
              key={i}
              style={{
                width: size === "sm" ? 5 : 7,
                height: h,
                borderRadius: 1.5,
                backgroundColor: filled ? "#0071e3" : "#e7e5e4",
                boxShadow: filled
                  ? "inset 0 0 0 0.5px rgba(0,113,227,0.5)"
                  : "inset 0 0 0 0.5px rgba(0,0,0,0.08)",
              }}
            />
          );
        })}
      </div>
    );
  }

  if (levelStyle === "discreteCapacity") {
    const filledCount = Math.round(norm * segments);
    return (
      <div
        role="meter"
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Number(v.toFixed(1))}
        aria-valuetext={`${Number(v.toFixed(1))} of ${max}, ${zone} zone`}
        className="flex items-center gap-[3px]"
      >
        {Array.from({ length: segments }, (_, i) => {
          const filled = i < filledCount;
          // Each segment's zone is decided by where its top edge sits,
          // so segments past the thresholds take warning/critical colors.
          const segTop = min + ((i + 1) / segments) * (max - min);
          const segZone = zoneFor(segTop, warningValue, criticalValue);
          return (
            <span
              key={i}
              style={{
                width: size === "sm" ? 12 : 18,
                height: barH,
                borderRadius: 3,
                backgroundColor: filled ? ZONE_COLORS[segZone] : "#eceae8",
                boxShadow: filled
                  ? "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 0 0 0.5px rgba(0,0,0,0.18)"
                  : "inset 0 0 0 1px rgba(0,0,0,0.07)",
                opacity: filled ? 1 : 1,
              }}
            />
          );
        })}
      </div>
    );
  }

  // continuousCapacity (default)
  const pct = norm * 100;
  const warnPct = ((clamp(warningValue, min, max) - min) / (max - min)) * 100;
  const critPct = ((clamp(criticalValue, min, max) - min) / (max - min)) * 100;
  return (
    <div
      role="meter"
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Number(v.toFixed(1))}
      aria-valuetext={`${Number(v.toFixed(1))} of ${max}, ${zone} zone`}
      className="relative w-full"
      style={{ height: barH + (showThresholds ? 14 : 0) }}
    >
      <div
        className="relative w-full overflow-visible rounded-full"
        style={{
          height: barH,
          backgroundColor: "#eceae8",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.14), inset 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0) 55%)",
            boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.15)",
            transition: "width 180ms ease, background-color 180ms ease",
          }}
        />
        {showThresholds && (
          <>
            <span
              aria-hidden="true"
              className="absolute top-[-3px]"
              style={{
                left: `${warnPct}%`,
                width: 2,
                height: barH + 6,
                backgroundColor: "#78350f",
                borderRadius: 1,
                transform: "translateX(-50%)",
              }}
            />
            <span
              aria-hidden="true"
              className="absolute top-[-3px]"
              style={{
                left: `${critPct}%`,
                width: 2,
                height: barH + 6,
                backgroundColor: "#7f1d1d",
                borderRadius: 1,
                transform: "translateX(-50%)",
              }}
            />
          </>
        )}
      </div>
      {showThresholds && (
        <div className="relative mt-1 h-3 font-mono text-[10px] text-stone-500" aria-hidden="true">
          <span
            className="absolute -translate-x-1/2 rounded bg-amber-100 px-1 py-px text-amber-800 ring-1 ring-amber-300/60"
            style={{ left: `${warnPct}%` }}
          >
            ⚠ {warningValue}
          </span>
          <span
            className="absolute -translate-x-1/2 rounded bg-red-100 px-1 py-px text-red-800 ring-1 ring-red-300/60"
            style={{ left: `${critPct}%` }}
          >
            ● {criticalValue}
          </span>
        </div>
      )}
    </div>
  );
}
