"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

/* ─────────────────────────────────────────────────────────────
   Tabs — an accessible tab implementation matching the
   NameThatUi contract:

     role="tablist"  → the row of peer labels (one keyboard unit)
     role="tab"      → each label, exactly one aria-selected="true"
     role="tabpanel" → the shared region below, linked with
                       aria-controls / aria-labelledby

   Behavior: roving tabindex (only the active tab is Tabbable),
   Left/Right/Home/End move + select (automatic activation), and
   switching swaps the shared panel without navigating away.
   ───────────────────────────────────────────────────────────── */

export type TabDef = {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  disabledReason?: string;
};

export type TabsVariant = "underline" | "boxed" | "pills";
export type TabsHighlight = "tablist" | "indicator" | null;

export function tabId(prefix: string, id: string) {
  return `${prefix}-tab-${id}`;
}

export function panelId(prefix: string, id: string) {
  return `${prefix}-panel-${id}`;
}

const ROW: Record<TabsVariant, string> = {
  underline: "gap-1 border-b border-stone-200",
  boxed: "gap-1.5 rounded-xl border border-stone-200 bg-stone-100/70 p-1.5",
  pills: "gap-1.5 rounded-full border border-stone-200 bg-stone-100/70 p-1.5",
};

function tabClasses(
  variant: TabsVariant,
  active: boolean,
  disabled: boolean,
  highlightIndicator: boolean,
): string {
  const base =
    "relative flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e] disabled:cursor-not-allowed disabled:opacity-40";
  if (variant === "underline") {
    return `${base} -mb-px px-4 pb-3 pt-2 font-medium ${
      active ? "text-stone-900" : "text-stone-500 hover:text-stone-800"
    } ${disabled ? "" : ""}`;
  }
  if (variant === "boxed") {
    return `${base} rounded-lg border px-4 py-2 font-medium ${
      active
        ? "border-[#0f766e]/40 bg-white text-stone-900 shadow-sm shadow-[inset_0_2px_0_#0f766e]"
        : "border-transparent text-stone-500 hover:bg-white hover:text-stone-800"
    } ${highlightIndicator && active ? "ring-2 ring-[#0f766e] ring-offset-1" : ""}`;
  }
  return `${base} rounded-full px-4 py-2 font-medium ${
    active
      ? "bg-stone-900 text-white shadow-sm"
      : "text-stone-500 hover:bg-white hover:text-stone-800"
  } ${highlightIndicator && active ? "ring-2 ring-[#0f766e] ring-offset-2" : ""}`;
}

export function Tabs({
  tabs,
  value,
  onChange,
  variant = "underline",
  ariaLabel,
  idPrefix,
  highlight = null,
  badges,
}: {
  tabs: TabDef[];
  value: string;
  onChange: (id: string) => void;
  variant?: TabsVariant;
  ariaLabel: string;
  /** unique prefix so tab/panel ids never collide between demos */
  idPrefix: string;
  highlight?: TabsHighlight;
  /** anatomy pills rendered by the hub — they chase the live layout */
  badges?: { tablist?: ReactNode; indicator?: ReactNode };
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef(new Map<string, HTMLButtonElement | null>());
  const [geom, setGeom] = useState({ left: 0, width: 0, ready: false });
  const [scroll, setScroll] = useState(0);

  const measure = useCallback(() => {
    const scroller = scrollRef.current;
    const el = btnRefs.current.get(value);
    if (!scroller || !el) return;
    setGeom({
      left: el.offsetLeft,
      width: el.offsetWidth,
      ready: el.offsetWidth > 0,
    });
    setScroll(scroller.scrollLeft);
  }, [value, tabs, variant]);

  /* re-measure after paint, on resize, on strip size change, on scroll */
  useEffect(() => {
    measure();
    const scroller = scrollRef.current;
    const strip = stripRef.current;
    if (typeof ResizeObserver !== "undefined" && strip) {
      const ro = new ResizeObserver(() => measure());
      ro.observe(strip);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure]);

  /* keep the active tab in view inside scrollable rows */
  useEffect(() => {
    btnRefs.current.get(value)?.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, [value]);

  const enabled = tabs.filter((t) => !t.disabled).map((t) => t.id);

  function focusTab(id: string) {
    btnRefs.current.get(id)?.focus();
  }

  function onKeyDown(e: KeyboardEvent) {
    const i = enabled.indexOf(value);
    let next: string | null = null;
    if (e.key === "ArrowRight") next = enabled[(i + 1) % enabled.length] ?? null;
    else if (e.key === "ArrowLeft")
      next = enabled[(i - 1 + enabled.length) % enabled.length] ?? null;
    else if (e.key === "Home") next = enabled[0] ?? null;
    else if (e.key === "End") next = enabled[enabled.length - 1] ?? null;
    if (next) {
      e.preventDefault();
      onChange(next); // automatic activation: moving selects
      focusTab(next);
    }
  }

  const badgeLeft = geom.left - scroll + geom.width / 2;

  return (
    <div className={`relative ${badges ? "pt-9" : ""}`}>
      {badges?.tablist && (
        <div className="pointer-events-none absolute right-2 top-0">
          <div className="pointer-events-auto">{badges.tablist}</div>
        </div>
      )}
      {badges?.indicator && geom.ready && (
        <div
          aria-hidden={false}
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2"
          style={{ left: badgeLeft }}
        >
          <div className="pointer-events-auto flex flex-col items-center">
            {badges.indicator}
            <span className="mt-1 block h-3.5 w-px bg-stone-400" />
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        onScroll={(e) => setScroll(e.currentTarget.scrollLeft)}
        className={`tab-scroll flex overflow-x-auto ${
          highlight === "tablist"
            ? "rounded-lg ring-2 ring-[#0f766e] ring-offset-2"
            : ""
        } ${ROW[variant]}`}
      >
        <div ref={stripRef} className="relative flex min-w-full gap-1">
          {tabs.map((t) => {
            const active = t.id === value;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  btnRefs.current.set(t.id, el);
                }}
                type="button"
                role="tab"
                id={tabId(idPrefix, t.id)}
                aria-selected={active}
                aria-controls={panelId(idPrefix, t.id)}
                tabIndex={active ? 0 : -1}
                disabled={t.disabled}
                title={t.disabled ? t.disabledReason : undefined}
                onClick={() => onChange(t.id)}
                className={tabClasses(
                  variant,
                  active,
                  !!t.disabled,
                  highlight === "indicator",
                )}
              >
                {t.icon && (
                  <span aria-hidden className="text-[15px] leading-none">
                    {t.icon}
                  </span>
                )}
                {t.label}
                {t.badge !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none ${
                      active
                        ? variant === "pills"
                          ? "bg-white/20 text-white"
                          : "bg-[#0f766e] text-white"
                        : "bg-stone-200/80 text-stone-500"
                    }`}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
          {variant === "underline" && (
            <span
              aria-hidden
              style={{
                left: geom.left,
                width: geom.width,
                opacity: geom.ready ? 1 : 0,
              }}
              className={`absolute bottom-0 h-[2.5px] rounded-full bg-[#0f766e] transition-all duration-300 ease-out ${
                highlight === "indicator"
                  ? "shadow-[0_0_0_3px_rgba(15,118,110,0.35)]"
                  : ""
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function TabPanel({
  id,
  labelledBy,
  hidden,
  badge,
  className = "",
  children,
}: {
  id: string;
  labelledBy: string;
  /** inactive panels stay mounted but hidden — form input survives */
  hidden: boolean;
  badge?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      {badge && (
        <div className="absolute -top-3 right-4 z-10">{badge}</div>
      )}
      <div
        role="tabpanel"
        id={id}
        aria-labelledby={labelledBy}
        tabIndex={0}
        hidden={hidden}
        className={`rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e] ${hidden ? "" : "tab-panel-enter"} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
