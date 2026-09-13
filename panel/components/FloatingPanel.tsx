"use client";

import { useRef, useState, type ReactNode } from "react";

type Props = {
  title: string;
  hud?: boolean;
  initialX?: number;
  initialY?: number;
  width?: number;
  zIndex?: number;
  hidden?: boolean;
  glow?: boolean;
  onPointerDownPanel?: () => void;
  onClose?: () => void;
  children: ReactNode;
  footer?: ReactNode;
  overlay?: ReactNode;
  labelledby?: string;
};

/**
 * A web approximation of NSPanel: a small auxiliary window with its own
 * mini title bar. Draggable by its header, floats above the "document"
 * when given a higher z-index (NSWindow.Level.floating), and can wear
 * the dark translucent HUD chrome (NSWindow.StyleMask.hudWindow).
 */
export default function FloatingPanel({
  title,
  hud = false,
  initialX = 0,
  initialY = 0,
  width = 264,
  zIndex = 30,
  hidden = false,
  glow = false,
  onPointerDownPanel,
  onClose,
  children,
  footer,
  overlay,
  labelledby,
}: Props) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const drag = useRef<{ dx: number; dy: number; el: HTMLElement | null } | null>(null);

  function onHeaderPointerDown(e: React.PointerEvent<HTMLElement>) {
    if ((e.target as HTMLElement).closest("[data-nodrag]")) return;
    const el = (e.currentTarget as HTMLElement).parentElement;
    if (!el) return;
    drag.current = {
      dx: e.clientX - pos.x,
      dy: e.clientY - pos.y,
      el,
    };
    el.setPointerCapture(e.pointerId);
  }

  function onHeaderPointerMove(e: React.PointerEvent<HTMLElement>) {
    const d = drag.current;
    if (!d || !d.el) return;
    const stage = d.el.parentElement;
    const stageRect = stage?.getBoundingClientRect();
    const elRect = d.el.getBoundingClientRect();
    let nx = e.clientX - d.dx;
    let ny = e.clientY - d.dy;
    if (stageRect) {
      nx = Math.max(-elRect.width + 90, Math.min(nx, stageRect.width - 90));
      ny = Math.max(0, Math.min(ny, stageRect.height - 60));
    }
    setPos({ x: nx, y: ny });
  }

  function endDrag() {
    drag.current = null;
  }

  return (
    <div
      role="dialog"
      aria-label={labelledby ?? title}
      onPointerDown={onPointerDownPanel}
      className={`absolute transition-opacity duration-200 ${
        hidden ? "pointer-events-none scale-[0.97] opacity-0" : "opacity-100"
      } ${glow ? "rounded-xl ring-2 ring-[#0071e3]/70 ring-offset-2 ring-offset-transparent" : ""}`}
      style={{ left: pos.x, top: pos.y, width, zIndex }}
    >
      <div
        className={`overflow-hidden rounded-xl backdrop-blur-xl ${
          hud
            ? "border border-white/15 bg-[#2e2e32]/90 text-stone-100 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
            : "border border-stone-300/80 bg-white/92 text-stone-800 shadow-[0_20px_50px_rgba(0,0,0,0.22)]"
        }`}
      >
        {/* mini title bar — the drag region */}
        <header
          onPointerDown={onHeaderPointerDown}
          onPointerMove={onHeaderPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={`flex cursor-grab touch-none items-center gap-2 px-3 py-2 active:cursor-grabbing ${
            hud ? "border-b border-white/10" : "border-b border-stone-200"
          }`}
        >
          {onClose ? (
            <button
              type="button"
              data-nodrag
              onClick={onClose}
              aria-label={`Close ${title}`}
              title="Close panel"
              className={`group grid size-3 place-items-center rounded-full ${
                hud ? "bg-[#ff5f57]" : "bg-[#ff5f57]"
              }`}
            >
              <span
                aria-hidden
                className="text-[8px] font-bold leading-none text-black/50 opacity-0 transition-opacity group-hover:opacity-100"
              >
                ×
              </span>
            </button>
          ) : (
            <span aria-hidden className={`size-2 rounded-full ${hud ? "bg-white/25" : "bg-stone-300"}`} />
          )}
          <p
            className={`flex-1 select-none truncate text-center text-[12px] font-semibold tracking-wide ${
              hud ? "text-stone-200" : "text-stone-600"
            }`}
          >
            {title}
          </p>
          <span aria-hidden className={`text-[10px] ${hud ? "text-white/30" : "text-stone-300"}`}>
            ⋮⋮
          </span>
        </header>

        <div className="px-3 py-3">{children}</div>

        {footer && (
          <div
            className={`flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] leading-tight ${
              hud ? "border-t border-white/10 text-white/45" : "border-t border-stone-200 text-stone-400"
            }`}
          >
            {footer}
          </div>
        )}
      </div>

      {overlay && <div className="pointer-events-none absolute inset-0">{overlay}</div>}
    </div>
  );
}
