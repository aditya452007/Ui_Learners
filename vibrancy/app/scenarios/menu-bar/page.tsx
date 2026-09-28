"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Material,
  WALLPAPERS,
  Wallpaper,
  fg,
  rule,
  type WallpaperName,
} from "../../components/materials";

/* ------------------------------------------------------------------ */

interface Item {
  label: string;
  shortcut?: string;
  disabled?: boolean;
  checked?: boolean;
  danger?: boolean;
}

const MENUS: Record<string, Item[]> = {
  File: [
    { label: "New Folder", shortcut: "⇧⌘N" },
    { label: "New Smart Folder" },
    { label: "Open", shortcut: "⌘O" },
    { label: "separator", shortcut: "" },
    { label: "Close Window", shortcut: "⌘W", checked: true },
    { label: "Eject “Backup”", shortcut: "⌘E", disabled: true },
    { label: "separator", shortcut: "" },
    { label: "Move to Trash", shortcut: "⌘⌫", danger: true },
  ],
  Edit: [
    { label: "Undo", shortcut: "⌘Z", disabled: true },
    { label: "separator", shortcut: "" },
    { label: "Cut", shortcut: "⌘X" },
    { label: "Copy", shortcut: "⌘C" },
    { label: "Paste", shortcut: "⌘V" },
  ],
  View: [
    { label: "as Icons", shortcut: "⌘1" },
    { label: "as List", shortcut: "⌘2", checked: true },
    { label: "as Gallery", shortcut: "⌘4" },
    { label: "separator", shortcut: "" },
    { label: "Show Sidebar", shortcut: "⌃⌘S" },
  ],
};

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 5000);
    return () => window.clearInterval(t);
  }, []);
  const date = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return (
    <span className="text-[13px] font-medium text-[#1d1d1f]">
      {date} <span className="tabular-nums">{time}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */

export default function MenuBarScenario() {
  const [wallpaper, setWallpaper] = useState<WallpaperName>("meadow");
  const [open, setOpen] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [lastPick, setLastPick] = useState<string | null>(null);

  function pick(menu: string, item: Item) {
    if (item.disabled || item.label === "separator") return;
    setLastPick(`${menu} → ${item.label}`);
    setOpen(null);
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <nav className="flex items-center justify-between text-xs font-semibold">
        <Link href="/" className="text-[#0071e3] hover:underline">
          ← Hub
        </Link>
        <span className="flex gap-3 text-[#86868b]">
          <Link href="/scenarios/sidebar" className="hover:text-[#0071e3] hover:underline">
            ← 1 · Sidebar
          </Link>
          <span className="text-[#1d1d1f]">2 · Menu bar</span>
          <Link href="/scenarios/hud" className="hover:text-[#0071e3] hover:underline">
            3 · HUD →
          </Link>
        </span>
      </nav>

      <header className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3]">
          Scenario 2 · Menus
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#1d1d1f]">
          Menu bar + dropdown menu
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6e6e73]">
          <strong className="font-semibold text-[#3a3a3c]">Why glass fits here:</strong> menus are
          guests — they appear over whatever you were doing and must not hide it. A{" "}
          <code className="font-mono text-[12px]">Material.menu</code> dropdown blurs the work
          underneath instead of covering it, so context survives the interruption.
        </p>
      </header>

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
        <span className="ml-auto text-xs text-[#86868b]" aria-live="polite">
          {lastPick ? (
            <>You picked <strong className="font-semibold text-[#1d1d1f]">{lastPick}</strong></>
          ) : (
            "Click a menu title to open it"
          )}
        </span>
      </div>

      {/* the desktop */}
      <div className="relative mt-3 overflow-hidden rounded-2xl border border-[#e5e5ea] shadow-sm" style={{ height: 430 }}>
        <Wallpaper name={wallpaper} />

        {/* menu bar */}
        <Material kind="titlebar" appearance="light" label="Menu bar" className="absolute inset-x-0 top-0 z-20 flex items-center gap-1 rounded-none px-4 py-1.5">
          <span className="mr-1 text-[15px] font-bold text-[#1d1d1f]" aria-label="Apple menu"></span>
          <span className="px-2 py-0.5 text-[13px] font-bold text-[#1d1d1f]">Finder</span>
          {Object.keys(MENUS).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setOpen(open === m ? null : m);
                setHover(null);
              }}
              aria-expanded={open === m}
              aria-haspopup="menu"
              className={`rounded-md px-2.5 py-0.5 text-[13px] transition ${
                open === m ? "bg-black/10 font-medium text-[#1d1d1f]" : "text-[#1d1d1f] hover:bg-black/5"
              }`}
            >
              {m}
            </button>
          ))}
          <span className="ml-auto flex items-center gap-3">
            <span className="hidden text-[13px] text-[#1d1d1f] sm:inline" aria-label="Battery 82 percent">82%</span>
            <svg width="22" height="12" viewBox="0 0 22 12" aria-hidden="true">
              <rect x="0.5" y="0.5" width="18" height="11" rx="3" fill="none" stroke="#1d1d1f" opacity="0.5" />
              <rect x="2.5" y="2.5" width="13" height="7" rx="1.5" fill="#1d1d1f" />
              <rect x="20" y="4" width="2" height="4" rx="1" fill="#1d1d1f" opacity="0.5" />
            </svg>
            <Clock />
          </span>
        </Material>

        {/* click-away layer */}
        {open && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(null)}
            className="absolute inset-0 z-10 cursor-default bg-transparent"
          />
        )}

        {/* dropdown */}
        {open && (
          <div className="absolute left-4 top-10 z-20" style={{ marginLeft: open === "File" ? 52 : open === "Edit" ? 100 : 148 }}>
            <Material
              kind="menu"
              appearance="light"
              label={`${open} menu`}
              className="w-64 overflow-hidden rounded-xl p-1.5"
            >
              <div role="menu" aria-label={open}>
                {MENUS[open].map((item, i) =>
                  item.label === "separator" ? (
                    <div key={`sep-${i}`} className={`mx-2 my-1 h-px ${rule("light", true)}`} role="separator" aria-hidden="true" />
                  ) : (
                    <button
                      key={item.label}
                      type="button"
                      role="menuitem"
                      disabled={item.disabled}
                      onMouseEnter={() => setHover(item.label)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(item.label)}
                      onClick={() => pick(open, item)}
                      className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1 text-left text-[13px] transition ${
                        item.disabled
                          ? `cursor-default ${fg("light", true, "tertiary")}`
                          : hover === item.label
                            ? "bg-[#0071e3] text-white shadow"
                            : item.danger
                              ? "text-[#c8102e]"
                              : fg("light", true, "primary")
                      }`}
                    >
                      <span className={`w-4 text-center ${hover === item.label ? "text-white" : fg("light", true, "secondary")}`} aria-hidden="true">
                        {item.checked ? "✓" : ""}
                      </span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.shortcut && (
                        <span className={`font-mono text-[11px] ${hover === item.label && !item.disabled ? "text-white/85" : fg("light", true, "tertiary")}`}>
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                  )
                )}
              </div>
            </Material>
          </div>
        )}

        {/* a document window to blur through */}
        <div className="absolute inset-x-8 top-24 rounded-xl bg-white/90 p-5 shadow-lg sm:inset-x-16">
          <p className="text-sm font-semibold text-[#1d1d1f]">Q3 hiking schedule.txt</p>
          <div className="mt-3 space-y-2.5">
            {[100, 92, 97, 84, 95].map((w, i) => (
              <div key={i} className="h-2.5 rounded-full bg-[#e9e9ee]" style={{ width: `${w}%` }} />
            ))}
          </div>
          <p className="mt-4 text-xs text-[#86868b]">Open the File menu — the document blurs behind the glass instead of vanishing.</p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-[#e5e5ea] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3]">Edge handling</p>
          <p className="mt-1 text-xs leading-relaxed text-[#6e6e73]">
            Only one menu opens at a time; clicking anywhere else dismisses it. “Eject” and “Undo”
            render disabled in tertiary tone — visible but unclickable, exactly how AppKit dims
            unavailable commands. Hovered rows go vibrant blue with white text.
          </p>
        </div>
        <div className="rounded-2xl border border-[#e5e5ea] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3]">Try it</p>
          <p className="mt-1 text-xs leading-relaxed text-[#6e6e73]">
            Open each menu and compare widths, shortcuts and the ✓ on the active view mode. The
            live clock keeps ticking on the right — the desktop stays alive behind every material.
          </p>
        </div>
      </div>
    </main>
  );
}
