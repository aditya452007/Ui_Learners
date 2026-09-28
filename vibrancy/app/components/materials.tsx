import type { CSSProperties, ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Web approximation of NSVisualEffectView.                            */
/* A real NSVisualEffectView blurs + re-tints whatever is behind the   */
/* window and lets standard controls draw "vibrant" (luminous,         */
/* wallpaper-aware) foregrounds. Here: backdrop-filter + translucent   */
/* tint = the material layer; alpha-tuned text = the vibrant           */
/* foreground.                                                         */
/* ------------------------------------------------------------------ */

export type MaterialKind =
  | "sidebar"
  | "titlebar"
  | "menu"
  | "popover"
  | "hud"
  | "windowBackground";

export type Appearance = "light" | "dark";

interface Recipe {
  background: string;
  blur: number;
  saturate: number;
  border: string;
  shadow: string;
}

const RECIPES: Record<MaterialKind, { light: Recipe; dark: Recipe }> = {
  sidebar: {
    light: {
      background: "rgba(242, 243, 245, 0.72)",
      blur: 30,
      saturate: 1.7,
      border: "rgba(0, 0, 0, 0.08)",
      shadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
    },
    dark: {
      background: "rgba(32, 33, 37, 0.72)",
      blur: 30,
      saturate: 1.7,
      border: "rgba(255, 255, 255, 0.12)",
      shadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
    },
  },
  titlebar: {
    light: {
      background: "rgba(250, 250, 250, 0.64)",
      blur: 26,
      saturate: 1.8,
      border: "rgba(0, 0, 0, 0.08)",
      shadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
    },
    dark: {
      background: "rgba(40, 41, 46, 0.64)",
      blur: 26,
      saturate: 1.8,
      border: "rgba(255, 255, 255, 0.12)",
      shadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
    },
  },
  menu: {
    light: {
      background: "rgba(255, 255, 255, 0.7)",
      blur: 34,
      saturate: 1.9,
      border: "rgba(0, 0, 0, 0.1)",
      shadow: "inset 0 1px 0 rgba(255,255,255,0.65), 0 12px 40px rgba(0,0,0,0.18)",
    },
    dark: {
      background: "rgba(46, 47, 52, 0.7)",
      blur: 34,
      saturate: 1.9,
      border: "rgba(255, 255, 255, 0.14)",
      shadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 12px 40px rgba(0,0,0,0.4)",
    },
  },
  popover: {
    light: {
      background: "rgba(255, 255, 255, 0.76)",
      blur: 44,
      saturate: 2.0,
      border: "rgba(0, 0, 0, 0.1)",
      shadow: "inset 0 1px 0 rgba(255,255,255,0.7), 0 16px 48px rgba(0,0,0,0.2)",
    },
    dark: {
      background: "rgba(50, 51, 56, 0.76)",
      blur: 44,
      saturate: 2.0,
      border: "rgba(255, 255, 255, 0.14)",
      shadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 16px 48px rgba(0,0,0,0.45)",
    },
  },
  hud: {
    /* The HUD is dark in both appearances — sunglasses for a window. */
    light: {
      background: "rgba(28, 29, 31, 0.72)",
      blur: 32,
      saturate: 1.5,
      border: "rgba(255, 255, 255, 0.16)",
      shadow: "inset 0 1px 0 rgba(255,255,255,0.14), 0 16px 48px rgba(0,0,0,0.35)",
    },
    dark: {
      background: "rgba(20, 21, 23, 0.75)",
      blur: 32,
      saturate: 1.5,
      border: "rgba(255, 255, 255, 0.16)",
      shadow: "inset 0 1px 0 rgba(255,255,255,0.14), 0 16px 48px rgba(0,0,0,0.5)",
    },
  },
  windowBackground: {
    light: {
      background: "rgba(236, 236, 238, 0.85)",
      blur: 40,
      saturate: 1.6,
      border: "rgba(0, 0, 0, 0.08)",
      shadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
    },
    dark: {
      background: "rgba(28, 29, 33, 0.85)",
      blur: 40,
      saturate: 1.6,
      border: "rgba(255, 255, 255, 0.12)",
      shadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
    },
  },
};

export const MATERIALS: { id: MaterialKind; name: string; symbol: string; blurb: string }[] = [
  { id: "sidebar", name: "Sidebar", symbol: "Material.sidebar", blurb: "navigation rails — Finder, Mail" },
  { id: "titlebar", name: "Titlebar", symbol: "Material.titlebar", blurb: "unified title + toolbar" },
  { id: "menu", name: "Menu", symbol: "Material.menu", blurb: "dropdown menus" },
  { id: "popover", name: "Popover", symbol: "Material.popover", blurb: "floating attached panels" },
  { id: "hud", name: "HUD", symbol: "Material.hudWindow", blurb: "dark bezels — volume, color pickers" },
  { id: "windowBackground", name: "Window", symbol: "Material.windowBackground", blurb: "standard window backs" },
];

/* ------------------------------------------------------------------ */
/* Material — the frosted surface itself                               */
/* ------------------------------------------------------------------ */

export function Material({
  kind,
  appearance,
  className = "",
  style,
  children,
  label,
}: {
  kind: MaterialKind;
  appearance: Appearance;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  label?: string;
}) {
  const r = RECIPES[kind][appearance];
  const filter = `blur(${r.blur}px) saturate(${r.saturate})`;
  return (
    <div
      role="presentation"
      aria-label={label}
      data-material={kind}
      className={className}
      style={{
        background: r.background,
        backdropFilter: filter,
        WebkitBackdropFilter: filter,
        border: `1px solid ${r.border}`,
        boxShadow: r.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Vibrant foreground — text tones that stay legible over glass.       */
/* vibrant=false renders the same words in flat grays: the "before".   */
/* ------------------------------------------------------------------ */

export type Tone = "primary" | "secondary" | "tertiary";

export function fg(appearance: Appearance, vibrant: boolean, tone: Tone): string {
  if (!vibrant) {
    return tone === "primary"
      ? "text-[#6e6e73]"
      : tone === "secondary"
        ? "text-[#8e8e93]"
        : "text-[#aeaeb2]";
  }
  if (appearance === "dark") {
    return tone === "primary"
      ? "text-white/95"
      : tone === "secondary"
        ? "text-white/60"
        : "text-white/40";
  }
  return tone === "primary"
    ? "text-[#1d1d1f]"
    : tone === "secondary"
      ? "text-black/55"
      : "text-black/35";
}

export function rule(appearance: Appearance, vibrant: boolean): string {
  if (!vibrant) return "bg-[#c7c7cc]";
  return appearance === "dark" ? "bg-white/20" : "bg-black/10";
}

/* ------------------------------------------------------------------ */
/* Wallpaper — stands in for the user's desktop picture                */
/* ------------------------------------------------------------------ */

export type WallpaperName = "meadow" | "dune" | "dusk";

export const WALLPAPERS: { id: WallpaperName; name: string; note: string }[] = [
  { id: "meadow", name: "Meadow", note: "cool light — greens bleed through" },
  { id: "dune", name: "Dune", note: "warm light — sand tints the glass" },
  { id: "dusk", name: "Dusk", note: "dark — materials flip to dark mode" },
];

export function appearanceOf(wallpaper: WallpaperName): Appearance {
  return wallpaper === "dusk" ? "dark" : "light";
}

export function Wallpaper({
  name,
  className = "",
  children,
}: {
  name: WallpaperName;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`wp wp-grain wp-${name} ${className}`} aria-hidden={children ? undefined : true}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Window chrome bits                                                 */
/* ------------------------------------------------------------------ */

export function TrafficLights() {
  return (
    <span className="inline-flex items-center gap-2" aria-hidden="true">
      <span className="size-3 rounded-full bg-[#ff5f57] ring-1 ring-inset ring-black/15" />
      <span className="size-3 rounded-full bg-[#febc2e] ring-1 ring-inset ring-black/15" />
      <span className="size-3 rounded-full bg-[#28c840] ring-1 ring-inset ring-black/15" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Apple-style switch with an API-symbol caption                       */
/* ------------------------------------------------------------------ */

export function Switch({
  label,
  symbol,
  checked,
  onChange,
}: {
  label: string;
  symbol: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5 rounded-xl border border-[#d2d2d7] bg-white px-3 py-2 text-left transition hover:border-[#b0b0b5]"
    >
      <span aria-hidden="true" data-on={checked} className="vy-switch">
        <span />
      </span>
      <span>
        <span className="block text-[13px] font-medium leading-tight text-[#1d1d1f]">{label}</span>
        <span className="block font-mono text-[10px] leading-tight text-[#86868b]">{symbol}</span>
      </span>
    </button>
  );
}
