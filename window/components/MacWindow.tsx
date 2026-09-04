"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/* ─────────────────────────────────────────────────────────────
   MacWindow — a web approximation of AppKit's NSWindow chrome.
   Real macOS draws this in the window server; here we rebuild the
   same anatomy (title bar, drag region, unified toolbar, accessory,
   separator, window tabs, resize edges) with divs + mouse events
   so learners can grab, resize, and reconfigure it.
   ───────────────────────────────────────────────────────────── */

export type MacWindowTab = { id: string; title: string; dirty?: boolean };

export type MacWindowProps = {
  title: string;
  proxyIcon?: ReactNode;
  /** NSWindow.titleVisibility — bar stays, text can hide */
  titleVisible?: boolean;
  editableTitle?: boolean;
  onTitleChange?: (next: string) => void;
  /** NSWindow.ToolbarStyle.unified vs a separate toolbar strip */
  toolbarStyle?: "unified" | "expanded";
  toolbarLeading?: ReactNode;
  toolbarTrailing?: ReactNode;
  /** second row, only used when toolbarStyle === "expanded" */
  toolbarRow?: ReactNode;
  /** NSTitlebarAccessoryViewController slot */
  accessory?: ReactNode;
  /** NSWindow.titlebarSeparatorStyle */
  showSeparator?: boolean;
  /** NSWindowTabGroup */
  tabs?: MacWindowTab[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
  onTabClose?: (id: string) => void;
  onNewTab?: () => void;
  showTabBar?: boolean;
  /** NSWindow.StyleMask.resizable */
  resizable?: boolean;
  draggable?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  initialWidth?: number;
  initialHeight?: number;
  /** key (focused) vs inactive window */
  active?: boolean;
  onActivate?: () => void;
  allowClose?: boolean;
  allowMinimize?: boolean;
  allowZoom?: boolean;
  sidebar?: ReactNode;
  statusBar?: ReactNode;
  children: ReactNode;
  /** window-relative overlay (anatomy badges) — tracks drag + resize */
  overlay?: ReactNode;
  /** id of the anatomy part to outline, e.g. "titlebar", "separator" */
  highlight?: string | null;
  className?: string;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

/* ── traffic lights: their own standard controls, not window chrome ── */

function Light({
  label,
  glyph,
  color,
  border,
  dim,
  disabled,
  onPress,
}: {
  label: string;
  glyph: string;
  color: string;
  border: string;
  dim: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-nodrag
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onPress();
      }}
      className="grid size-[13px] place-items-center rounded-full border disabled:cursor-default"
      style={{
        background: dim ? "#d9d9de" : color,
        borderColor: dim ? "#c4c4ca" : border,
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4)",
      }}
    >
      <span className="text-[8px] font-bold leading-none text-black/50 opacity-0 transition-opacity group-hover/lights:opacity-100">
        {glyph}
      </span>
    </button>
  );
}

/* ── toolbar primitives (NSToolbarItem stand-ins) ── */

export function ToolbarButton({
  icon,
  label,
  onClick,
  pressed,
  disabled,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  pressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      data-nodrag
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={`flex w-[46px] shrink-0 flex-col items-center gap-[3px] rounded-md py-1 text-[10px] leading-none transition-colors disabled:opacity-40 ${
        pressed
          ? "bg-black/10 text-stone-900"
          : "text-stone-600 hover:bg-black/[0.06]"
      }`}
    >
      <span className="text-[15px] leading-none">{icon}</span>
      <span className="max-w-full truncate">{label}</span>
    </button>
  );
}

export function ToolbarSpacer() {
  /* intentionally NOT data-nodrag: gaps stay grabbable, like macOS */
  return <div className="min-w-2 flex-1" aria-hidden />;
}

export function ToolbarSearch({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div
      data-nodrag
      className="flex h-7 w-36 items-center gap-1.5 rounded-md bg-black/[0.06] px-2 text-stone-600 focus-within:bg-white focus-within:shadow-sm focus-within:ring-1 focus-within:ring-[#0071e3]/50 sm:w-40"
    >
      <span aria-hidden className="text-xs leading-none">
        ⌕
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent text-xs text-stone-800 outline-none placeholder:text-stone-400"
      />
    </div>
  );
}

export function ToolbarSegment<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labels: Record<T, ReactNode>;
}) {
  return (
    <div
      data-nodrag
      role="group"
      className="flex shrink-0 rounded-md bg-black/[0.08] p-[2px]"
    >
      {options.map((o) => (
        <button
          key={o}
          type="button"
          data-nodrag
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className={`rounded-[5px] px-2.5 py-1 text-xs leading-none transition-all ${
            value === o
              ? "bg-white text-stone-900 shadow-sm"
              : "text-stone-500 hover:text-stone-700"
          }`}
        >
          {labels[o]}
        </button>
      ))}
    </div>
  );
}

/* ── the window ── */

export default function MacWindow({
  title,
  proxyIcon,
  titleVisible = true,
  editableTitle = false,
  onTitleChange,
  toolbarStyle = "unified",
  toolbarLeading,
  toolbarTrailing,
  toolbarRow,
  accessory,
  showSeparator = true,
  tabs = [],
  activeTabId,
  onTabChange,
  onTabClose,
  onNewTab,
  showTabBar = true,
  resizable = true,
  draggable = true,
  minWidth = 380,
  minHeight = 280,
  maxWidth = 1200,
  maxHeight = 900,
  initialWidth = 640,
  initialHeight = 440,
  active = true,
  onActivate,
  allowClose = true,
  allowMinimize = true,
  allowZoom = true,
  sidebar,
  statusBar,
  children,
  overlay,
  highlight = null,
  className = "",
}: MacWindowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: initialWidth, h: initialHeight });
  const [zoomed, setZoomed] = useState(false);
  const [closed, setClosed] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const dragState = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const resizeState = useRef<{ sx: number; sy: number; ow: number; oh: number; dir: "se" | "e" | "s" } | null>(null);

  const tabBarVisible = showTabBar && tabs.length > 0;
  const chromeBg = active ? "bg-[#e9e9ee]" : "bg-[#f1f1f4]";

  const H = (id: string) =>
    highlight === id
      ? "outline outline-2 -outline-offset-2 outline-[#0071e3]"
      : "";

  function beginDrag(e: React.MouseEvent) {
    if (!draggable || zoomed || closed || minimized) return;
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest("[data-nodrag]")) return;
    dragState.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
    const move = (ev: MouseEvent) => {
      const d = dragState.current;
      if (!d) return;
      setPos({
        x: clamp(d.ox + ev.clientX - d.sx, -320, 320),
        y: clamp(d.oy + ev.clientY - d.sy, -90, 220),
      });
    };
    const up = () => {
      dragState.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }

  function beginResize(dir: "se" | "e" | "s") {
    return (e: React.MouseEvent) => {
      if (!resizable || zoomed) return;
      if (e.button !== 0) return;
      e.stopPropagation();
      resizeState.current = { sx: e.clientX, sy: e.clientY, ow: size.w, oh: size.h, dir };
      const move = (ev: MouseEvent) => {
        const r = resizeState.current;
        if (!r) return;
        const dx = ev.clientX - r.sx;
        const dy = ev.clientY - r.sy;
        setSize({
          w: r.dir === "s" ? r.ow : clamp(r.ow + dx, minWidth, maxWidth),
          h: r.dir === "e" ? r.oh : clamp(r.oh + dy, minHeight, maxHeight),
        });
      };
      const up = () => {
        resizeState.current = null;
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    };
  }

  function toggleZoom() {
    if (!allowZoom) return;
    setZoomed((z) => !z);
  }

  function commitTitle() {
    setEditingTitle(false);
    const next = draftTitle.trim();
    if (next && next !== title) onTitleChange?.(next);
    else setDraftTitle(title);
  }

  const rootStyle: CSSProperties = zoomed
    ? { width: "100%", height: "100%", transform: "none" }
    : {
        width: size.w,
        height: size.h,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        maxWidth: "100%",
        maxHeight: "100%",
      };

  if (closed) {
    return (
      <div
        className={`flex w-72 flex-col items-center gap-2 rounded-xl border border-dashed border-stone-300 bg-white/70 px-6 py-8 text-center ${className}`}
        onMouseDownCapture={onActivate}
      >
        <span className="grid size-10 place-items-center rounded-lg bg-stone-100 text-lg text-stone-400">
          ▭
        </span>
        <p className="text-sm font-medium text-stone-600">
          “{title}” is closed
        </p>
        <p className="text-xs text-stone-400">
          The red traffic light closed this window. The app is still running.
        </p>
        <button
          type="button"
          onClick={() => setClosed(false)}
          className="mt-1 rounded-md bg-[#0071e3] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0062c4]"
        >
          Reopen window
        </button>
      </div>
    );
  }

  if (minimized) {
    return (
      <div
        className={`flex w-72 items-center gap-3 rounded-xl border border-black/10 bg-white/80 px-4 py-3 shadow-lg backdrop-blur ${className}`}
        onMouseDownCapture={onActivate}
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#0071e3]/10 text-base text-[#0071e3]">
          {proxyIcon ?? "▭"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-stone-700">{title}</p>
          <p className="text-[11px] text-stone-400">Minimized to the Dock</p>
        </div>
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="shrink-0 rounded-md border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-50"
        >
          Restore
        </button>
      </div>
    );
  }

  const titleNode = (
    <div className="flex min-w-0 items-center gap-1.5">
      {proxyIcon && <span className="shrink-0 text-sm leading-none text-stone-500">{proxyIcon}</span>}
      {titleVisible ? (
        editingTitle ? (
          <input
            data-nodrag
            autoFocus
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTitle();
              if (e.key === "Escape") {
                setDraftTitle(title);
                setEditingTitle(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Rename window"
            className="w-44 rounded border border-[#0071e3] bg-white px-1 py-px text-center text-[13px] font-medium text-stone-800 outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (editableTitle) {
                setDraftTitle(title);
                setEditingTitle(true);
              }
            }}
            title={editableTitle ? "Click to rename" : title}
            className={`truncate text-[13px] font-medium leading-tight ${
              active ? "text-stone-800" : "text-stone-400"
            } ${editableTitle ? "cursor-text rounded px-1 hover:bg-black/[0.05]" : "cursor-default"}`}
          >
            {title}
          </button>
        )
      ) : (
        <span className="text-[11px] tracking-wide text-stone-400">— title hidden —</span>
      )}
    </div>
  );

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label={`${title} window`}
      data-macwindow
      onMouseDownCapture={onActivate}
      style={rootStyle}
      className={`relative flex shrink-0 select-none flex-col overflow-hidden rounded-xl border border-black/15 bg-white text-left ${
        active
          ? "shadow-[0_28px_70px_-12px_rgba(0,0,0,0.35)]"
          : "shadow-[0_10px_30px_-12px_rgba(0,0,0,0.22)]"
      } ${className}`}
    >
      {/* ── row 1: title bar (+ unified toolbar when styled so) ── */}
      <div
        onMouseDown={beginDrag}
        onDoubleClick={toggleZoom}
        title={draggable && !zoomed ? "Drag to move — double-click to zoom" : undefined}
        className={`relative flex h-12 shrink-0 items-center gap-2 px-3 ${chromeBg} ${
          draggable && !zoomed ? "cursor-grab active:cursor-grabbing" : ""
        } ${H("titlebar")} ${H("unified")}`}
      >
        <div className="group/lights flex shrink-0 items-center gap-2" aria-label="Window controls">
          <Light label="Close window" glyph="✕" color="#ff5f57" border="#e0443e" dim={!active} disabled={!allowClose} onPress={() => setClosed(true)} />
          <Light label="Minimize window" glyph="–" color="#febc2e" border="#dea123" dim={!active} disabled={!allowMinimize} onPress={() => setMinimized(true)} />
          <Light label="Zoom window" glyph="+" color="#28c840" border="#1aab29" dim={!active} disabled={!allowZoom} onPress={toggleZoom} />
        </div>

        {toolbarStyle === "unified" && <div className="flex shrink-0 items-center gap-1">{toolbarLeading}</div>}

        {/* centered title */}
        <div className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${H("title")}`}>
          <div className="pointer-events-auto">{titleNode}</div>
        </div>

        {toolbarStyle === "unified" ? (
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <div className={H("toolbar-item")}>{toolbarTrailing}</div>
          </div>
        ) : (
          <div className="ml-auto w-[52px] shrink-0" aria-hidden />
        )}

        {highlight === "drag" && (
          <div className="pointer-events-none absolute bottom-1.5 left-[29%] right-[27%] top-1.5 rounded-md border-2 border-dashed border-[#0071e3] bg-[#0071e3]/10" />
        )}
      </div>

      {/* ── row 2: separate toolbar strip (expanded style only) ── */}
      {toolbarStyle === "expanded" && (
        <div
          onMouseDown={beginDrag}
          className={`flex h-10 shrink-0 items-center gap-1 border-t border-black/[0.06] px-3 ${chromeBg} ${H("unified")}`}
        >
          {toolbarLeading}
          <div className={H("toolbar-item")}>{toolbarRow ?? toolbarTrailing}</div>
        </div>
      )}

      {/* ── title-bar accessory (custom strip, NOT part of NSToolbar) ── */}
      {accessory && (
        <div className={`flex h-9 shrink-0 items-center gap-2 border-y border-black/[0.07] bg-black/[0.035] px-3 ${H("accessory")}`}>
          {accessory}
        </div>
      )}

      {/* ── window tabs: frame-level, group whole documents ── */}
      {tabBarVisible && (
        <div className={`flex h-9 shrink-0 items-center gap-1 overflow-x-auto px-3 mac-scroll ${active ? "bg-[#dedee4]" : "bg-[#e7e7eb]"} ${H("tabs")}`}>
          <div role="tablist" aria-label="Window tabs" className="flex items-center gap-1">
            {tabs.map((t) => {
              const isActive = t.id === (activeTabId ?? tabs[0]?.id);
              return (
                <div
                  key={t.id}
                  role="tab"
                  aria-selected={isActive}
                  data-nodrag
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabChange?.(t.id);
                  }}
                  className={`group/tab flex h-7 cursor-default items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 text-xs transition-colors ${
                    isActive
                      ? "border-black/10 bg-white text-stone-800 shadow-sm"
                      : "border-transparent text-stone-500 hover:bg-black/[0.05]"
                  }`}
                >
                  {t.dirty && <span className="size-1.5 rounded-full bg-stone-400" aria-label="Unsaved changes" />}
                  <span className="max-w-28 truncate">{t.title}</span>
                  {onTabClose && tabs.length > 1 && (
                    <button
                      type="button"
                      data-nodrag
                      aria-label={`Close ${t.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTabClose(t.id);
                      }}
                      className="grid size-4 place-items-center rounded text-[10px] leading-none text-stone-400 opacity-0 transition-opacity hover:bg-black/10 hover:text-stone-700 group-hover/tab:opacity-100"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {onNewTab && (
            <button
              type="button"
              data-nodrag
              aria-label="New tab"
              onClick={(e) => {
                e.stopPropagation();
                onNewTab();
              }}
              className="grid size-6 shrink-0 place-items-center rounded-md text-sm leading-none text-stone-500 transition-colors hover:bg-black/[0.06]"
            >
              +
            </button>
          )}
        </div>
      )}

      {/* ── title-bar separator ── */}
      {showSeparator ? (
        <div
          aria-hidden
          className={`${highlight === "separator" ? "h-[3px] bg-[#0071e3]" : "h-px bg-black/10"} shrink-0`}
        />
      ) : (
        highlight === "separator" && (
          <div aria-hidden className="flex h-[3px] shrink-0 items-center bg-[#0071e3]/15">
            <div className="h-[2px] w-full border-t-2 border-dashed border-[#0071e3]/70" />
          </div>
        )
      )}

      {/* ── content ── */}
      <div className="flex min-h-0 flex-1">
        {sidebar && (
          <aside className="hidden w-44 shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-black/[0.07] bg-[#f5f5f7] p-2 mac-scroll sm:flex">
            {sidebar}
          </aside>
        )}
        <div className="min-w-0 flex-1 overflow-auto bg-white mac-scroll">{children}</div>
      </div>

      {statusBar && (
        <div className="flex h-7 shrink-0 items-center gap-2 border-t border-black/[0.07] bg-[#f5f5f7] px-3 text-[11px] text-stone-500">
          {statusBar}
        </div>
      )}

      {/* ── resize edges + corner ── */}
      {resizable && !zoomed && (
        <>
          <div
            data-nodrag
            onMouseDown={beginResize("e")}
            aria-hidden
            className="absolute bottom-5 right-0 top-0 w-1.5 cursor-ew-resize"
          />
          <div
            data-nodrag
            onMouseDown={beginResize("s")}
            aria-hidden
            className="absolute bottom-0 left-0 right-5 h-1.5 cursor-ns-resize"
          />
          <div
            data-nodrag
            onMouseDown={beginResize("se")}
            title={resizable ? `Drag to resize (min ${minWidth}×${minHeight})` : undefined}
            aria-label="Resize window"
            className={`absolute bottom-0 right-0 grid size-5 cursor-nwse-resize place-items-center rounded-tl-md ${
              highlight === "resize" ? "bg-[#0071e3]/20 outline outline-2 -outline-offset-2 outline-[#0071e3]" : ""
            }`}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden className="text-stone-400">
              <path d="M10 1 L1 10 M10 5 L5 10 M10 9 L9 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>
        </>
      )}

      {/* window-relative overlay: anatomy badges track drag + resize for free */}
      {overlay && <div className="pointer-events-none absolute inset-0 z-30">{overlay}</div>}
    </div>
  );
}

/* Small sidebar helpers so scenarios stay tidy */
export function SideLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-2 pb-0.5 pt-2 text-[11px] font-semibold text-stone-400">{children}</p>
  );
}

export function SideItem({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] transition-colors ${
        selected ? "bg-black/[0.07] font-medium text-stone-800" : "text-stone-600 hover:bg-black/[0.04]"
      }`}
    >
      <span className="w-4 text-center text-[13px] leading-none text-stone-500">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}
