"use client";

import { useState, type ReactNode } from "react";

/* ─────────────────────────────────────────────────────────────
   UnifiedToolbar — a web approximation of AppKit's NSToolbar in a
   unified title-bar style (NSWindow.ToolbarStyle.unified).

   Real macOS lays out, validates, and overflows NSToolbarItems in
   the window server. Here we rebuild the same behavior with divs:
   each item declares an approximate width + a visibilityPriority,
   and the toolbar hides low-priority items into the » overflow
   menu as the window narrows — exactly like the native control.
   ───────────────────────────────────────────────────────────── */

export type DisplayMode = "icon-text" | "icon" | "text";
export type SeparatorStyle = "automatic" | "line" | "shadow" | "none";
export type HighlightId = "title" | "item" | "label" | "overflow" | "separator" | null;

export type ToolbarItem = {
  id: string;
  /** NSToolbarItem.label — the action name, shown under/beside the icon */
  label: string;
  /** icon glyph shown in the toolbar and in the overflow menu */
  icon: ReactNode;
  /**
   * NSToolbarItem.visibilityPriority — low values overflow first.
   * Standard items use 0…100; flexible space never overflows.
   */
  priority: number;
  /** flexible space: swallows leftover room, never overflows */
  flexible?: boolean;
  /** approx. pixel width per display mode, used for overflow math */
  widths: { "icon-text": number; icon: number; text: number };
  /** complex controls (search, segments) render as-is inside the menu */
  control?: boolean;
  /** fires from the toolbar AND from the overflow menu row */
  onAction?: () => void;
  /** the item's control, drawn in the toolbar row */
  render: (mode: DisplayMode) => ReactNode;
};

/** Pure overflow engine — shared by the toolbar and the anatomy badges. */
export function splitItems(items: ToolbarItem[], mode: DisplayMode, width: number) {
  const FIXED_CHROME = 234; // traffic lights + centered title reserve + padding
  const CHEVRON = 34;
  const widthOf = (it: ToolbarItem) => (it.flexible ? 0 : it.widths[mode]);
  const rigid = items.filter((it) => !it.flexible);
  const total = rigid.reduce((s, it) => s + widthOf(it), 0);
  let available = width - FIXED_CHROME;
  if (total <= available) return { visible: items, hidden: [] as ToolbarItem[] };
  available -= CHEVRON;
  const byPriority = [...rigid].sort((a, b) => a.priority - b.priority);
  const hiddenIds = new Set<string>();
  let used = total;
  for (const it of byPriority) {
    if (used <= available) break;
    hiddenIds.add(it.id);
    used -= widthOf(it);
  }
  return {
    visible: items.filter((it) => !hiddenIds.has(it.id)),
    hidden: items.filter((it) => hiddenIds.has(it.id)),
  };
}

/* ── traffic lights: standard system controls, not toolbar items ── */

export function TrafficLights({ dim = false }: { dim?: boolean }) {
  const lights = [
    { label: "Close", color: "#ff5f57", border: "#e0443e", glyph: "✕" },
    { label: "Minimize", color: "#febc2e", border: "#dea123", glyph: "–" },
    { label: "Zoom", color: "#28c840", border: "#1aab29", glyph: "+" },
  ];
  return (
    <div className="group/lights flex shrink-0 items-center gap-2" aria-label="Window controls">
      {lights.map((l) => (
        <span
          key={l.label}
          title={l.label}
          className="grid size-[13px] place-items-center rounded-full border"
          style={{
            background: dim ? "#d9d9de" : l.color,
            borderColor: dim ? "#c4c4ca" : l.border,
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4)",
          }}
        >
          <span className="text-[8px] font-bold leading-none text-black/50 opacity-0 transition-opacity group-hover/lights:opacity-100">
            {l.glyph}
          </span>
        </span>
      ))}
    </div>
  );
}

/* ── toolbar primitives (NSToolbarItem stand-ins) ── */

export function TButton({
  icon,
  label,
  mode,
  onClick,
  pressed,
  disabled,
  mark,
}: {
  icon: ReactNode;
  label: string;
  mode: DisplayMode;
  onClick?: () => void;
  pressed?: boolean;
  disabled?: boolean;
  /** anatomy highlight: whole item vs. just its label caption */
  mark?: "item" | "label" | null;
}) {
  const iconOnly = mode === "icon";
  const textOnly = mode === "text";
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={`flex shrink-0 flex-col items-center justify-center gap-[3px] rounded-md py-1 text-[10px] leading-none transition-colors disabled:opacity-40 ${
        iconOnly ? "w-10" : textOnly ? "w-auto px-2.5" : "w-[52px]"
      } ${mark === "item" ? "outline outline-2 -outline-offset-2 outline-[#0071e3]" : ""} ${
        pressed ? "bg-black/10 text-stone-900" : "text-stone-600 hover:bg-black/[0.06]"
      }`}
    >
      {!textOnly && <span className="text-[15px] leading-none">{icon}</span>}
      {!iconOnly && (
        <span
          className={`max-w-full truncate rounded px-0.5 ${
            mark === "label" ? "outline outline-2 -outline-offset-1 outline-[#0071e3]" : ""
          }`}
        >
          {label}
        </span>
      )}
    </button>
  );
}

export function TSearch({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex h-7 w-32 items-center gap-1.5 rounded-md bg-black/[0.06] px-2 text-stone-600 focus-within:bg-white focus-within:shadow-sm focus-within:ring-1 focus-within:ring-[#0071e3]/50 sm:w-36">
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
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="grid size-4 shrink-0 place-items-center rounded-full bg-black/10 text-[10px] leading-none text-stone-500 hover:bg-black/20"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function TSegment<T extends string>({
  options,
  value,
  onChange,
  labels,
  ariaLabel,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labels: Record<T, ReactNode>;
  ariaLabel?: string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex shrink-0 rounded-md bg-black/[0.08] p-[2px]">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className={`rounded-[5px] px-2.5 py-1 text-xs leading-none transition-all ${
            value === o ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
          }`}
        >
          {labels[o]}
        </button>
      ))}
    </div>
  );
}

/** fixed divider between groups — a rigid, narrow item */
export function TDivider() {
  return <div aria-hidden className="h-6 w-px shrink-0 bg-black/10" />;
}

/* ── the unified window ── */

export default function UnifiedToolbar({
  title,
  proxyIcon,
  editableTitle,
  onTitleChange,
  items,
  displayMode,
  separator,
  width,
  active = true,
  contentHeight = 264,
  statusBar,
  highlight = null,
  overlay,
  children,
}: {
  title: string;
  proxyIcon?: ReactNode;
  editableTitle?: boolean;
  onTitleChange?: (next: string) => void;
  items: ToolbarItem[];
  displayMode: DisplayMode;
  separator: SeparatorStyle;
  /** window width in px — the overflow simulation input */
  width: number;
  active?: boolean;
  contentHeight?: number;
  statusBar?: ReactNode;
  highlight?: HighlightId;
  /** window-relative overlay (anatomy badges) */
  overlay?: ReactNode;
  children?: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);

  const { visible, hidden } = splitItems(items, displayMode, width);
  const chromeBg = active ? "bg-[#e9e9ee]" : "bg-[#f1f1f4]";

  function commitTitle() {
    setEditing(false);
    const next = draft.trim();
    if (next && next !== title) onTitleChange?.(next);
    else setDraft(title);
  }

  const showLine =
    separator === "line" || (separator === "automatic" && scrolled);
  const showShadow = separator === "shadow";

  return (
    <div
      role="dialog"
      aria-label={`${title} window`}
      style={{ width, maxWidth: "100%" }}
      className={`relative flex shrink-0 select-none flex-col overflow-hidden rounded-xl border border-black/15 bg-white text-left ${
        active
          ? "shadow-[0_28px_70px_-12px_rgba(0,0,0,0.35)]"
          : "shadow-[0_10px_30px_-12px_rgba(0,0,0,0.22)]"
      }`}
    >
      {/* ── the unified row: traffic lights + items + inline title ── */}
      <div
        className={`relative flex h-14 shrink-0 items-center gap-1 px-3 ${chromeBg} ${
          showShadow ? "z-10 shadow-[0_5px_14px_rgba(0,0,0,0.22)]" : ""
        } ${highlight === "item" ? "outline outline-2 -outline-offset-2 outline-[#0071e3]/60" : ""}`}
      >
        <TrafficLights dim={!active} />

        <div className="flex min-w-0 flex-1 items-center gap-1">
          {visible.map((it) =>
            it.flexible ? (
              <div key={it.id} className="min-w-2 flex-1" aria-hidden />
            ) : (
              <div key={it.id} className="flex shrink-0 items-center">
                {it.render(displayMode)}
              </div>
            ),
          )}
        </div>

        {/* centered inline title — shares the row, macOS unified style */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className={`pointer-events-auto flex min-w-0 items-center gap-1.5 rounded px-1 ${
              highlight === "title" ? "outline outline-2 -outline-offset-2 outline-[#0071e3]" : ""
            }`}
          >
            {proxyIcon && (
              <span className="shrink-0 text-sm leading-none text-stone-500">{proxyIcon}</span>
            )}
            {editing ? (
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitTitle();
                  if (e.key === "Escape") {
                    setDraft(title);
                    setEditing(false);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                aria-label="Rename document"
                className="w-36 rounded border border-[#0071e3] bg-white px-1 py-px text-center text-[13px] font-medium text-stone-800 outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (editableTitle) {
                    setDraft(title);
                    setEditing(true);
                  }
                }}
                title={editableTitle ? "Click to rename" : title}
                className={`max-w-36 truncate text-[13px] font-medium leading-tight sm:max-w-44 ${
                  active ? "text-stone-800" : "text-stone-400"
                } ${editableTitle ? "cursor-text rounded hover:bg-black/[0.05]" : "cursor-default"}`}
              >
                {title}
              </button>
            )}
          </div>
        </div>

        {/* ── overflow chevron » ── */}
        {hidden.length > 0 && (
          <div className="relative shrink-0">
            <button
              type="button"
              aria-label={`${hidden.length} more toolbar items`}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => setMenuOpen((v) => !v)}
              title="More toolbar items"
              className={`grid h-8 w-[30px] place-items-center rounded-md text-[15px] leading-none text-stone-600 transition-colors hover:bg-black/[0.06] ${
                highlight === "overflow" ? "outline outline-2 -outline-offset-2 outline-[#0071e3]" : ""
              }`}
            >
              »
            </button>
            {menuOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close overflow menu"
                  className="fixed inset-0 z-40 cursor-default bg-transparent"
                  onClick={() => setMenuOpen(false)}
                />
                <div
                  role="menu"
                  aria-label="Overflowed toolbar items"
                  className="absolute right-0 top-9 z-50 w-56 overflow-hidden rounded-lg border border-black/10 bg-white/95 py-1 shadow-xl backdrop-blur"
                >
                  <p className="px-3 pb-1 pt-1.5 font-mono text-[10px] uppercase tracking-wider text-stone-400">
                    {hidden.length} item{hidden.length > 1 ? "s" : ""} didn&apos;t fit
                  </p>
                  {hidden.map((it) =>
                    it.control ? (
                      <div key={it.id} className="flex items-center gap-2 px-3 py-1.5">
                        {it.render(displayMode)}
                      </div>
                    ) : (
                      <button
                        key={it.id}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false);
                          it.onAction?.();
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[13px] text-stone-700 transition-colors hover:bg-[#0071e3] hover:text-white"
                      >
                        <span className="w-5 text-center text-[14px] leading-none">{it.icon}</span>
                        <span className="flex-1 truncate">{it.label}</span>
                        <span className="font-mono text-[10px] opacity-50">p{it.priority}</span>
                      </button>
                    ),
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── title-bar separator (NSWindow.titlebarSeparatorStyle) ── */}
      {separator !== "none" &&
        (highlight === "separator" ? (
          <div aria-hidden className="h-[3px] shrink-0 bg-[#0071e3]" />
        ) : (
          <div
            aria-hidden
            className={`h-px shrink-0 transition-colors ${showLine ? "bg-black/10" : "bg-transparent"}`}
          />
        ))}
      {separator === "none" && highlight === "separator" && (
        <div aria-hidden className="flex h-[3px] shrink-0 items-center bg-[#0071e3]/15">
          <div className="h-[2px] w-full border-t-2 border-dashed border-[#0071e3]/70" />
        </div>
      )}

      {/* ── content (scrolling drives the automatic separator) ── */}
      <div
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 4)}
        style={{ height: contentHeight }}
        className="mac-scroll min-h-0 flex-1 overflow-auto bg-white"
      >
        {children}
      </div>

      {statusBar && (
        <div className="flex h-7 shrink-0 items-center gap-2 border-t border-black/[0.07] bg-[#f5f5f7] px-3 text-[11px] text-stone-500">
          {statusBar}
        </div>
      )}

      {overlay && <div className="pointer-events-none absolute inset-0 z-30">{overlay}</div>}
    </div>
  );
}
