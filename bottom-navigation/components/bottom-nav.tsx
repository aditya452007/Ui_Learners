"use client";

import type { ReactNode } from "react";

/* ── Shared hand-built bottom navigation ──────────────────────────────
   Web contract: a <nav> landmark of links. Exactly one link carries
   aria-current="page". Tapping swaps the screen above instantly —
   no push animation, no route slide. The bar's background runs to the
   screen edge while env(safe-area-inset-bottom) padding keeps the icons
   clear of the home indicator (needs viewport-fit=cover). */

export type BottomNavVariant = "glass" | "fullbleed" | "m3";

export interface NavTabDef {
  id: string;
  label: string;
  icon: (active: boolean) => ReactNode;
  /** Red count bubble pinned to the icon. Rendered only when > 0. */
  badge?: number;
  /** Small dot (no number) — the "something new" sibling of a count. */
  dot?: boolean;
}

export interface NavSpotlight {
  /** Ring the whole bar (anatomy part 1). */
  bar?: boolean;
  /** Ring one tab column (parts 2 / 3). */
  tabId?: string | null;
  /** Ring the count badge itself (part 4). */
  badge?: boolean;
  /** Ring the safe-area strip (part 5). */
  safe?: boolean;
}

interface BottomNavProps {
  tabs: NavTabDef[];
  value: string;
  onChange: (id: string) => void;
  variant?: BottomNavVariant;
  ariaLabel?: string;
  spotlight?: NavSpotlight;
  /** Hub diagram only: paint the safe-area padding as a hatched strip so
      learners can see it. Real usage keeps it transparent env() padding. */
  simulateSafeArea?: boolean;
  /** M3 demo only: collapse to icon-only (tabBarMinimizeBehavior idea). */
  compact?: boolean;
}

const ACCENT = "text-[#0d9488]";
const MUTED = "text-stone-400";

function CountBadge({ n, ring }: { n: number; ring?: boolean }) {
  if (n <= 0) return null;
  return (
    <span
      className={`absolute -right-2.5 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm ${
        ring ? "ring-2 ring-stone-900 ring-offset-1" : ""
      }`}
    >
      {n > 99 ? "99+" : n}
    </span>
  );
}

function DotBadge({ ring }: { ring?: boolean }) {
  return (
    <span
      className={`absolute -right-1 -top-0.5 size-2.5 rounded-full bg-red-500 shadow-sm ring-2 ring-white ${
        ring ? "outline outline-2 outline-stone-900" : ""
      }`}
    />
  );
}

export function BottomNav({
  tabs,
  value,
  onChange,
  variant = "glass",
  ariaLabel = "Primary",
  spotlight,
  simulateSafeArea = false,
  compact = false,
}: BottomNavProps) {
  const isGlass = variant === "glass";
  const isM3 = variant === "m3";

  return (
    <nav
      aria-label={ariaLabel}
      className={[
        "bottom-nav-safe absolute inset-x-0 bottom-0 z-30 overflow-visible",
        isGlass ? "px-3 pb-3" : "px-0 pb-0",
        spotlight?.bar ? "rounded-2xl ring-2 ring-stone-900 ring-offset-2" : "",
      ].join(" ")}
    >
      <div
        className={[
          "overflow-visible",
          isGlass
            ? "rounded-[1.75rem] border border-white/60 bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.14)] backdrop-blur-xl"
            : "border-t border-stone-200 bg-white/95 backdrop-blur-xl",
          isM3 ? "bg-[#fbf9f7]/95" : "",
        ].join(" ")}
      >
        <ul className="flex items-stretch">
          {tabs.map((t) => {
            const active = t.id === value;
            const showBadge = (t.badge ?? 0) > 0;
            const ringTab = spotlight?.tabId === t.id;
            const ringBadge = spotlight?.badge && showBadge;
            return (
              <li key={t.id} className="min-w-0 flex-1">
                <a
                  href={`#${t.id}`}
                  aria-current={active ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onChange(t.id);
                  }}
                  className={[
                    "group flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 transition-colors",
                    isGlass ? "py-2" : "py-2",
                    ringTab ? "rounded-xl ring-2 ring-stone-900 ring-offset-1" : "",
                    active ? ACCENT : `${MUTED} hover:text-stone-600`,
                  ].join(" ")}
                >
                  <span
                    className={[
                      "relative inline-flex",
                      isM3
                        ? `rounded-full px-5 py-0.5 transition-colors ${
                            active ? "bg-[#0d9488]/15" : "bg-transparent"
                          }`
                        : "",
                    ].join(" ")}
                  >
                    {t.icon(active)}
                    <CountBadge n={t.badge ?? 0} ring={ringBadge} />
                    {t.dot && !showBadge ? <DotBadge /> : null}
                  </span>
                  {!compact ? (
                    <span
                      className={`text-[11px] font-medium leading-none tracking-tight ${
                        active ? "" : ""
                      }`}
                    >
                      {t.label}
                    </span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Safe-area inset. In production this is transparent env() padding
            (see .bottom-nav-safe). The hub paints it hatched so you can see it. */}
        {simulateSafeArea ? (
          <div
            className={`safe-hatch flex min-h-[20px] items-center justify-center rounded-b-[1.75rem] ${
              spotlight?.safe ? "ring-2 ring-inset ring-stone-900" : ""
            }`}
          >
            <span className="my-1 h-1 w-24 rounded-full bg-stone-900/70" />
          </div>
        ) : null}
      </div>
    </nav>
  );
}

/* ── Phone frame shared by the hub + scenarios ── */

export function PhoneFrame({
  children,
  bar,
  screenLabel,
}: {
  children: ReactNode;
  bar: ReactNode;
  screenLabel: string;
}) {
  return (
    <div className="relative w-full max-w-[320px] overflow-hidden rounded-[2.5rem] border border-stone-300/80 bg-stone-950 p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]">
      <div className="relative flex h-[560px] flex-col overflow-hidden rounded-[2rem] bg-white">
        {/* status bar */}
        <div className="relative z-20 flex items-center justify-between bg-white/80 px-6 pb-1 pt-3 backdrop-blur">
          <span className="text-xs font-semibold text-stone-900">9:41</span>
          <span className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-stone-950" />
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <span className="flex items-end gap-[2px]">
              <span className="h-1.5 w-[3px] rounded-sm bg-stone-900" />
              <span className="h-2 w-[3px] rounded-sm bg-stone-900" />
              <span className="h-2.5 w-[3px] rounded-sm bg-stone-900" />
            </span>
            <span className="h-2.5 w-5 rounded-[4px] border border-stone-400 p-[1px]">
              <span className="block h-full w-3/4 rounded-[2px] bg-stone-900" />
            </span>
          </span>
        </div>
        {/* screen */}
        <div className="relative min-h-0 flex-1" aria-live="polite" aria-label={screenLabel}>
          {children}
        </div>
        {bar}
      </div>
    </div>
  );
}
