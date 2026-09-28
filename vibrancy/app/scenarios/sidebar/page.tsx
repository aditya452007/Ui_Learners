"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Material,
  Switch,
  TrafficLights,
  WALLPAPERS,
  Wallpaper,
  appearanceOf,
  fg,
  rule,
  type WallpaperName,
} from "../../components/materials";

/* ------------------------------------------------------------------ */
/* Tiny stroke icons for the sidebar — Finder favors simple glyphs     */
/* ------------------------------------------------------------------ */

function Glyph({ d, color }: { d: string; color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS: Record<string, { d: string; color: string }> = {
  recents: { d: "M8 4.5V8l2.5 1.8M14.5 8A6.5 6.5 0 1 1 8 1.5c2 0 3.7.9 4.9 2.3M12.9 1.6v2.2h-2.2", color: "#0071e3" },
  apps: { d: "M2.5 2.5h4.6v4.6H2.5zM8.9 2.5h4.6v4.6H8.9zM2.5 8.9h4.6v4.6H2.5zM8.9 8.9h4.6v4.6H8.9z", color: "#5856d6" },
  desktop: { d: "M2.5 3.5h11v7h-11zM6 13.5h4M8 10.5v3", color: "#0071e3" },
  downloads: { d: "M8 2v8M4.8 7.2 8 10.4l3.2-3.2M2.5 13.5h11", color: "#34c759" },
  documents: { d: "M4 1.8h5.2L12.5 5v9.2H4zM9 2v3.2h3.3", color: "#ff9f0a" },
  cloud: { d: "M4.8 12.5h6.4a2.8 2.8 0 0 0 .5-5.5A3.8 3.8 0 0 0 4.4 8 2.6 2.6 0 0 0 4.8 12.5Z", color: "#86868b" },
  drive: { d: "M2.5 6h11v5h-11zM5 6V4h6v2", color: "#86868b" },
};

const FAVORITES = ["recents", "apps", "desktop", "downloads", "documents"];
const LOCATIONS = ["cloud", "drive"];
const NAMES: Record<string, string> = {
  recents: "Recents",
  apps: "Applications",
  desktop: "Desktop",
  downloads: "Downloads",
  documents: "Documents",
  cloud: "iCloud Drive",
  drive: "Macintosh HD",
};

const FILES: Record<string, string[]> = {
  recents: ["Trail map.pdf", "Hike photos", "Budget 2026.numbers", "Invoice-1042.pdf", "Playlist.m3u", "Notes.txt"],
  apps: ["Safari", "Mail", "Maps", "Photos", "Music", "Calendar"],
  desktop: ["Screenshot.png", "Todo.txt", "Deck.key", "Contract.pdf"],
  downloads: ["Installer.dmg", "Fonts.zip", "Wallpaper.heic", "Receipt.pdf", "Update.pkg"],
  documents: ["Novel draft.pages", "Taxes 2025", "Recipes", "Contract.pdf"],
  cloud: ["Shared album", "Backup", "Work docs"],
  drive: ["Applications", "Library", "System", "Users"],
};

/* ------------------------------------------------------------------ */

export default function SidebarScenario() {
  const [wallpaper, setWallpaper] = useState<WallpaperName>("meadow");
  const [translucent, setTranslucent] = useState(true);
  const [active, setActive] = useState("recents");

  const appearance = appearanceOf(wallpaper);
  const opaqueSide = appearance === "dark" ? "#2c2c2e" : "#f5f5f7";
  const opaqueBar = appearance === "dark" ? "#3a3a3c" : "#fafafa";

  function Row({ id, group }: { id: string; group: string }) {
    const sel = active === id;
    const icon = ICONS[id];
    return (
      <button
        key={`${group}-${id}`}
        type="button"
        onClick={() => setActive(id)}
        aria-pressed={sel}
        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-[13px] transition ${
          sel
            ? translucent
              ? "bg-[#0071e3] font-semibold text-white shadow"
              : "bg-[#c7c7cc] font-semibold text-[#1d1d1f]"
            : `font-normal ${translucent ? fg(appearance, true, "primary") : appearance === "dark" ? "text-white/90" : "text-[#1d1d1f]"} hover:bg-black/5`
        }`}
      >
        {id === "cloud" || id === "drive" ? (
          <Glyph d={icon.d} color={sel && translucent ? "#ffffff" : icon.color} />
        ) : (
          <Glyph d={icon.d} color={sel && translucent ? "#ffffff" : icon.color} />
        )}
        <span className="truncate">{NAMES[id]}</span>
      </button>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <nav className="flex items-center justify-between text-xs font-semibold">
        <Link href="/" className="text-[#0071e3] hover:underline">
          ← Hub
        </Link>
        <span className="flex gap-3 text-[#86868b]">
          <span className="text-[#1d1d1f]">1 · Sidebar</span>
          <Link href="/scenarios/menu-bar" className="hover:text-[#0071e3] hover:underline">
            2 · Menu bar →
          </Link>
        </span>
      </nav>

      <header className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3]">
          Scenario 1 · Navigation
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#1d1d1f]">
          Finder-style translucent sidebar
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6e6e73]">
          <strong className="font-semibold text-[#3a3a3c]">Why glass fits here:</strong> a sidebar
          is chrome, not content — it should feel lighter than the documents beside it. A{" "}
          <code className="font-mono text-[12px]">Material.sidebar</code> borrows the wallpaper so
          the rail recedes, while the vibrant selection pill keeps “where am I?” unmissable.
        </p>
      </header>

      {/* controls */}
      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-[#e5e5ea] bg-white px-4 py-3 shadow-sm">
        <span className="text-xs font-semibold text-[#6e6e73]">Wallpaper</span>
        {WALLPAPERS.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => setWallpaper(w.id)}
            aria-pressed={wallpaper === w.id}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              wallpaper === w.id ? "bg-[#1d1d1f] text-white shadow" : "bg-[#f5f5f7] text-[#515154] hover:bg-[#e9e9ee]"
            }`}
          >
            {w.name}
          </button>
        ))}
        <Switch label="Translucent chrome" symbol="NSVisualEffectView" checked={translucent} onChange={setTranslucent} />
      </div>

      {/* the window */}
      <div className="relative mt-3 overflow-hidden rounded-2xl border border-[#e5e5ea] shadow-sm" style={{ height: 460 }}>
        <Wallpaper name={wallpaper} />
        <div className="absolute inset-0 grid place-items-center p-6">
          <div className="vy-window-shadow flex h-full max-h-[400px] w-full max-w-[720px] flex-col overflow-hidden rounded-xl">
            {/* titlebar */}
            {translucent ? (
              <Material kind="titlebar" appearance={appearance} className="flex items-center gap-3 rounded-t-xl px-4 py-2.5">
                <TrafficLights />
                <span className={`text-[13px] font-semibold ${fg(appearance, true, "primary")}`}>{NAMES[active]}</span>
                <span className={`ml-auto rounded-md px-2 py-1 text-xs ${appearance === "dark" ? "bg-black/25 text-white/60" : "bg-black/5 text-black/45"}`}>
                  ⌕ Search
                </span>
              </Material>
            ) : (
              <div className="flex items-center gap-3 px-4 py-2.5" style={{ background: opaqueBar }}>
                <TrafficLights />
                <span className={`text-[13px] font-semibold ${appearance === "dark" ? "text-white/90" : "text-[#1d1d1f]"}`}>{NAMES[active]}</span>
                <span className={`ml-auto rounded-md px-2 py-1 text-xs ${appearance === "dark" ? "bg-black/25 text-white/60" : "bg-black/5 text-black/45"}`}>
                  ⌕ Search
                </span>
              </div>
            )}
            <div className="flex min-h-0 flex-1">
              {/* sidebar */}
              {translucent ? (
                <Material kind="sidebar" appearance={appearance} className="hidden w-52 shrink-0 flex-col gap-0.5 overflow-y-auto rounded-bl-xl p-2 sm:flex">
                  <p className={`px-2 pb-1 pt-1 text-[11px] font-semibold ${fg(appearance, true, "tertiary")}`}>Favorites</p>
                  {FAVORITES.map((id) => (
                    <Row key={id} id={id} group="fav" />
                  ))}
                  <p className={`px-2 pb-1 pt-3 text-[11px] font-semibold ${fg(appearance, true, "tertiary")}`}>Locations</p>
                  {LOCATIONS.map((id) => (
                    <Row key={id} id={id} group="loc" />
                  ))}
                  <p className={`px-2 pb-1 pt-3 text-[11px] font-semibold ${fg(appearance, true, "tertiary")}`}>Tags</p>
                  <div className="flex gap-2 px-2 pb-2">
                    {["#ff9f0a", "#34c759", "#0071e3", "#ff453a"].map((c) => (
                      <span key={c} className="size-3.5 rounded-full" style={{ background: c }} aria-hidden="true" />
                    ))}
                  </div>
                </Material>
              ) : (
                <div className="hidden w-52 shrink-0 flex-col gap-0.5 overflow-y-auto p-2 sm:flex" style={{ background: opaqueSide }}>
                  <p className={`px-2 pb-1 pt-1 text-[11px] font-semibold ${appearance === "dark" ? "text-white/40" : "text-black/35"}`}>Favorites</p>
                  {FAVORITES.map((id) => (
                    <Row key={id} id={id} group="fav" />
                  ))}
                  <p className={`px-2 pb-1 pt-3 text-[11px] font-semibold ${appearance === "dark" ? "text-white/40" : "text-black/35"}`}>Locations</p>
                  {LOCATIONS.map((id) => (
                    <Row key={id} id={id} group="loc" />
                  ))}
                </div>
              )}
              {/* content — deliberately opaque */}
              <div className={`min-w-0 flex-1 overflow-y-auto p-4 ${appearance === "dark" ? "bg-[#1e1e20] text-white/90" : "bg-white"}`}>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {(FILES[active] ?? []).map((f) => (
                    <div
                      key={f}
                      className={`flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center transition ${appearance === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                    >
                      <svg width="30" height="30" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M4 1.8h5.2L12.5 5v9.2H4zM9 2v3.2h3.3" fill={appearance === "dark" ? "#48484a" : "#e9e9ee"} stroke={appearance === "dark" ? "#636366" : "#c7c7cc"} strokeWidth="1" />
                      </svg>
                      <span className={`w-full truncate text-[11px] ${appearance === "dark" ? "text-white/85" : "text-[#3a3a3c]"}`}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-[#e5e5ea] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3]">Edge handling</p>
          <p className="mt-1 text-xs leading-relaxed text-[#6e6e73]">
            Kill the translucency and two things die with it: the wallpaper tint in the rail, and
            the glow of the selection pill (it drops to flat gray). Content stays opaque either
            way — only chrome gets glass, so documents remain calm and readable.
          </p>
        </div>
        <div className="rounded-2xl border border-[#e5e5ea] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3]">Try it</p>
          <p className="mt-1 text-xs leading-relaxed text-[#6e6e73]">
            Click through Favorites and Locations — the file grid follows the vibrant pill. Then
            switch the wallpaper to Dusk: the sidebar flips to its dark recipe automatically,
            because materials follow appearance, not the other way round.
          </p>
        </div>
      </div>
    </main>
  );
}
