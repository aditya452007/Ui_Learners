"use client";

import { useState } from "react";
import type { MouseEvent } from "react";

export type TrafficLightType = "close" | "minimize" | "zoom";

interface TrafficLightsProps {
  /** Unsaved changes: dark dot inside the red button when the group is NOT hovered */
  isDirty?: boolean;
  /** Full-screen state: swaps the green hover glyph to an exit/compress glyph */
  isFullscreen?: boolean;
  onClose?: (e?: MouseEvent) => void;
  onMinimize?: (e?: MouseEvent) => void;
  /** Receives the click event so callers can check e.altKey for Option-click Zoom */
  onZoom?: (e?: MouseEvent) => void;
  /** Show hover glyphs on group hover (default: true) */
  showHoverSymbols?: boolean;
  className?: string;
}

const BUTTON_SIZE = 12;
const BUTTON_GAP = 8;

/** Native macOS fills + darker hairline edge */
const BUTTON_STYLE: Record<TrafficLightType, { bg: string; border: string }> = {
  close: { bg: "#FF5F57", border: "rgba(190, 40, 30, 0.55)" },
  minimize: { bg: "#FEBC2E", border: "rgba(186, 130, 20, 0.6)" },
  zoom: { bg: "#28CA42", border: "rgba(20, 130, 40, 0.55)" },
};

/** Real glyphs are dark, not white */
const GLYPH_COLOR = "rgba(0, 0, 0, 0.55)";
const DIRTY_DOT_COLOR = "rgba(90, 10, 10, 0.75)";

function Glyph({ type, isFullscreen }: { type: TrafficLightType; isFullscreen: boolean }) {
  if (type === "close") {
    return (
      <svg width={7} height={7} viewBox="0 0 8 8" fill="none" aria-hidden="true">
        <path
          d="M1.5 1.5l5 5M6.5 1.5l-5 5"
          stroke={GLYPH_COLOR}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (type === "minimize") {
    return (
      <svg width={7} height={7} viewBox="0 0 8 8" fill="none" aria-hidden="true">
        <path d="M1.5 4h5" stroke={GLYPH_COLOR} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  // zoom: expand arrows normally, compress arrows when already fullscreen
  if (!isFullscreen) {
    return (
      <svg width={8} height={8} viewBox="0 0 8 8" fill="none" aria-hidden="true">
        <path
          d="M4.8 1H7v2.2M7 1L4.4 3.6M3.2 7H1V4.8M1 7l2.6-2.6"
          stroke={GLYPH_COLOR}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width={8} height={8} viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <path
        d="M3.2 1H1v2.2M1 1l2.6 2.6M4.8 7H7V4.8M7 7L4.4 4.4"
        stroke={GLYPH_COLOR}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrafficLightButton({
  type,
  showGlyph,
  showDirtyDot,
  isFullscreen,
  onClick,
  onHover,
  label,
}: {
  type: TrafficLightType;
  showGlyph: boolean;
  showDirtyDot: boolean;
  isFullscreen: boolean;
  onClick: (e: MouseEvent) => void;
  onHover: (t: TrafficLightType | null) => void;
  label: string;
}) {
  const style = BUTTON_STYLE[type];
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => onHover(type)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(type)}
      onBlur={() => onHover(null)}
      className="flex items-center justify-center rounded-full p-0 transition-[filter] duration-100 hover:brightness-110 active:brightness-95"
      style={{
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        backgroundColor: style.bg,
        border: `0.5px solid ${style.border}`,
        boxShadow: "inset 0 0 1px rgba(255,255,255,0.35)",
        cursor: "pointer",
      }}
      aria-label={label}
    >
      {showGlyph ? (
        <Glyph type={type} isFullscreen={isFullscreen} />
      ) : showDirtyDot ? (
        <span
          aria-hidden="true"
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            backgroundColor: DIRTY_DOT_COLOR,
          }}
        />
      ) : null}
    </button>
  );
}

export default function TrafficLights({
  isDirty = false,
  isFullscreen = false,
  onClose,
  onMinimize,
  onZoom,
  showHoverSymbols = true,
  className = "",
}: TrafficLightsProps) {
  const [, setHoveredButton] = useState<TrafficLightType | null>(null);
  const [groupHovered, setGroupHovered] = useState(false);

  const glyphsVisible = showHoverSymbols && groupHovered;

  return (
    <div
      className={`flex items-center ${className}`}
      style={{ gap: BUTTON_GAP }}
      onMouseEnter={() => setGroupHovered(true)}
      onMouseLeave={() => {
        setGroupHovered(false);
        setHoveredButton(null);
      }}
      role="group"
      aria-label="Window controls"
    >
      <TrafficLightButton
        type="close"
        label={isDirty ? "Close window (unsaved changes)" : "Close window"}
        showGlyph={glyphsVisible}
        showDirtyDot={isDirty && !glyphsVisible}
        isFullscreen={isFullscreen}
        onClick={(e) => onClose?.(e)}
        onHover={setHoveredButton}
      />
      <TrafficLightButton
        type="minimize"
        label="Minimize window to Dock"
        showGlyph={glyphsVisible}
        showDirtyDot={false}
        isFullscreen={isFullscreen}
        onClick={(e) => onMinimize?.(e)}
        onHover={setHoveredButton}
      />
      <TrafficLightButton
        type="zoom"
        label={isFullscreen ? "Exit full screen" : "Enter full screen (Option-click to zoom)"}
        showGlyph={glyphsVisible}
        showDirtyDot={false}
        isFullscreen={isFullscreen}
        onClick={(e) => onZoom?.(e)}
        onHover={setHoveredButton}
      />
    </div>
  );
}
