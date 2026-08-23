"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  AppleMark,
  BatteryIcon,
  BluetoothIcon,
  ControlCenterIcon,
  Desktop,
  MenuBar,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  ScenarioNav,
  SearchIcon,
  StatusItem,
  StatusMenu,
  WifiIcon,
} from "@/components/macos";
import type { BarAppearance } from "@/components/macos";

const API_CHIPS = [
  "NSStatusItem",
  "MenuBarExtra (macOS 13+)",
  "NSStatusBar.system.statusItem(withLength:)",
  "NSStatusBarButton.isHighlighted",
  "NSImage.isTemplate",
];

function Pill({ n }: { n: number }) {
  return (
    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#007AFF] text-xs font-bold text-white">
      {n}
    </span>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700">
      {children}
    </span>
  );
}

function MiniBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-9 w-full items-center justify-between rounded-lg border border-black/5 bg-white/70 px-2.5 shadow-sm backdrop-blur">
      {children}
    </div>
  );
}

export default function Home() {
  const [diagramOpen, setDiagramOpen] = useState(false);
  const [appearance, setAppearance] = useState<BarAppearance>("light");
  const [openId, setOpenId] = useState<string | null>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!diagramOpen) return;
    const onDown = (e: MouseEvent) => {
      if (diagramRef.current && !diagramRef.current.contains(e.target as Node)) setDiagramOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDiagramOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [diagramOpen]);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="flex flex-col gap-16">
        <header className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#007AFF]">
            macOS pattern — web approximation
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Menu Bar Extra</h1>
          <p className="text-base text-slate-500">
            Also called: <span className="font-medium text-slate-600">status item</span>,{" "}
            <span className="font-medium text-slate-600">menu bar icon</span>,{" "}
            <span className="font-medium text-slate-600">status bar item</span>,{" "}
            <span className="font-medium text-slate-600">tray icon</span> (Windows term). This page
            rebuilds the native AppKit / SwiftUI construct as a web approximation so every moving
            part is inspectable.
          </p>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {API_CHIPS.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        </header>

        <section className="flex flex-col gap-5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">What am I looking at</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-150 hover:shadow-md">
              <div className="flex items-center gap-2.5">
                <Pill n={1} />
                <h3 className="text-sm font-semibold text-slate-900">Trigger</h3>
              </div>
              <div className="grid h-[76px] place-items-center rounded-xl border border-slate-100 bg-slate-50 p-3">
                <MiniBar>
                  <span className="h-1.5 w-8 rounded-full bg-slate-300" />
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-slate-300" />
                    <span className="size-2 rounded-full bg-slate-300" />
                    <span className="grid size-5 place-items-center rounded-md bg-[#007AFF]/10">
                      <WifiIcon className="h-3 w-3 text-[#007AFF]" />
                    </span>
                  </span>
                </MiniBar>
              </div>
              <p className="text-sm leading-6 text-slate-500">
                The small icon living at the right end of the menu bar, next to the clock. One
                click, and its menu appears.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-150 hover:shadow-md">
              <div className="flex items-center gap-2.5">
                <Pill n={2} />
                <h3 className="text-sm font-semibold text-slate-900">Highlighted state</h3>
              </div>
              <div className="grid h-[76px] place-items-center rounded-xl border border-slate-100 bg-slate-50 p-3">
                <MiniBar>
                  <span className="h-1.5 w-8 rounded-full bg-slate-300" />
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-slate-300" />
                    <span className="rounded-md bg-slate-900/[0.11] px-1.5 py-1">
                      <span className="block size-2.5 rounded-full bg-slate-700" />
                    </span>
                    <span className="size-2 rounded-full bg-slate-300" />
                  </span>
                </MiniBar>
              </div>
              <p className="text-sm leading-6 text-slate-500">
                While the menu is open, a pale rounded backdrop stays lit behind the icon — like a
                porch light left on while the door is open.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-150 hover:shadow-md">
              <div className="flex items-center gap-2.5">
                <Pill n={3} />
                <h3 className="text-sm font-semibold text-slate-900">Attached menu / popover</h3>
              </div>
              <div className="grid h-[76px] place-items-center rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="w-full max-w-[150px] rounded-lg border border-black/5 bg-white p-1 shadow-sm">
                  <div className="flex items-center gap-1.5 rounded px-1.5 py-1">
                    <CheckIconSmall />
                    <span className="h-1.5 flex-1 rounded-full bg-slate-200" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded px-1.5 py-1">
                    <span className="size-2" />
                    <span className="h-1.5 flex-1 rounded-full bg-[#007AFF]/40" />
                  </div>
                  <div className="mx-1.5 my-0.5 h-px bg-black/[0.08]" />
                  <div className="flex items-center gap-1.5 rounded px-1.5 py-1">
                    <span className="size-2" />
                    <span className="h-1.5 w-2/3 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-500">
                The floating panel that drops down directly beneath the trigger, closing the moment
                you click elsewhere or press Escape.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#007AFF]">
              Live anatomy
            </p>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              An enlarged status item, taken apart
            </h2>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="relative h-[340px] min-w-[820px] w-[820px]">
              <div className="absolute top-10 left-0 h-[228px] w-[600px] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-100 via-slate-50 to-indigo-100 shadow-xl shadow-slate-300/40">
                <div className="flex h-12 items-center gap-4 border-b border-black/10 bg-white/70 px-4 text-zinc-800 backdrop-blur-xl select-none">
                  <AppleMark className="h-5 w-5 shrink-0" />
                  <span className="text-[15px] font-semibold">Finder</span>
                  <span className="flex items-center gap-4 text-sm opacity-70">
                    <span>File</span>
                    <span>Edit</span>
                    <span>View</span>
                    <span>Window</span>
                    <span>Help</span>
                  </span>
                  <div className="ml-auto flex items-center gap-4">
                    <BatteryIcon className="w-7" />
                    <BluetoothIcon className="h-5 w-5" />
                    <div ref={diagramRef} className="relative">
                      <button
                        type="button"
                        aria-expanded={diagramOpen}
                        aria-label="Wi-Fi status item"
                        onClick={() => setDiagramOpen(!diagramOpen)}
                        className={`flex h-9 cursor-default items-center rounded-lg px-2 transition-colors duration-150 ${
                          diagramOpen
                            ? "bg-zinc-900/[0.11]"
                            : "hover:bg-zinc-900/[0.06]"
                        }`}
                      >
                        <WifiIcon className="h-5 w-5" />
                      </button>
                      {diagramOpen && (
                        <div className="absolute top-[calc(100%+10px)] right-0 z-20">
                          <StatusMenu className="min-w-[232px]">
                            <MenuLabel>Wi-Fi</MenuLabel>
                            <MenuItem checked>HomeNet 5G</MenuItem>
                            <MenuItem>Office Guest</MenuItem>
                            <MenuItem chevron>Other Networks…</MenuItem>
                            <MenuSeparator />
                            <MenuItem disabled>Turn Wi-Fi Off</MenuItem>
                          </StatusMenu>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="h-[180px] bg-gradient-to-br from-sky-200 via-slate-100 to-indigo-200" />
              </div>

              <svg
                viewBox="0 0 820 340"
                className="pointer-events-none absolute inset-0 z-10 h-full w-full"
                aria-hidden="true"
              >
                <line x1="630" y1="64" x2="582" y2="64" stroke="#cbd5e1" strokeWidth="1.5" />
                <circle cx="580" cy="64" r="2.5" fill="#cbd5e1" />
                <polyline
                  points={diagramOpen ? "630,144 616,144 616,80 590,80" : "630,144 616,144 616,80"}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeDasharray={diagramOpen ? undefined : "4 4"}
                  opacity={diagramOpen ? 1 : 0.45}
                />
                {diagramOpen && <circle cx="588" cy="80" r="2.5" fill="#cbd5e1" />}
                <polyline
                  points={
                    diagramOpen ? "630,224 622,224 622,150 594,150" : "630,224 622,224 622,150"
                  }
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeDasharray={diagramOpen ? undefined : "4 4"}
                  opacity={diagramOpen ? 1 : 0.45}
                />
                {diagramOpen && <circle cx="592" cy="150" r="2.5" fill="#cbd5e1" />}
              </svg>

              <div className="absolute top-4 left-[630px] z-10 w-[184px]">
                <div className="flex items-start gap-2.5">
                  <Pill n={1} />
                  <h3 className="pt-1 text-sm leading-6 font-semibold text-slate-900">
                    Template icon
                  </h3>
                </div>
                <p className="mt-1.5 pl-[34px] text-xs leading-5 text-slate-500">
                  One flat-color drawing; macOS tints it to match the bar it sits on.
                </p>
              </div>

              <div className="absolute top-[112px] left-[630px] z-10 w-[184px]">
                <div className="flex items-start gap-2.5">
                  <Pill n={2} />
                  <h3 className="pt-1 text-sm leading-6 font-semibold text-slate-900">
                    Highlighted state
                  </h3>
                </div>
                <p
                  className={`mt-1.5 pl-[34px] text-xs leading-5 font-medium ${
                    diagramOpen ? "text-[#007AFF]" : "text-slate-400"
                  }`}
                >
                  {diagramOpen ? "Visible while open" : "Hidden — nothing is open yet"}
                </p>
                <p className={`mt-0.5 pl-[34px] text-xs leading-5 ${diagramOpen ? "text-slate-500" : "text-slate-400"}`}>
                  Pale capsule behind the icon for as long as its menu is open.
                </p>
              </div>

              <div className="absolute top-[218px] left-[630px] z-10 w-[184px]">
                <div className="flex items-start gap-2.5">
                  <Pill n={3} />
                  <h3 className="pt-1 text-sm leading-6 font-semibold text-slate-900">
                    Attached menu / popover
                  </h3>
                </div>
                <p
                  className={`mt-1.5 pl-[34px] text-xs leading-5 font-medium ${
                    diagramOpen ? "text-[#007AFF]" : "text-slate-400"
                  }`}
                >
                  {diagramOpen ? "Visible while open" : "Hidden — nothing is open yet"}
                </p>
                <p className={`mt-0.5 pl-[34px] text-xs leading-5 ${diagramOpen ? "text-slate-500" : "text-slate-400"}`}>
                  Panel drops down straight beneath the trigger.
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm leading-6 text-slate-500">
            Click the Wi-Fi icon in the replica above — callouts 2 and 3 wake up together, because
            both exist only while something is open. Then try the real-size demo below and press
            the moon/sun toggle in its corner: every icon recolors instantly against the darker
            bar. That automatic recoloring is exactly what{" "}
            <Chip>NSImage.isTemplate</Chip> buys you.
          </p>
        </section>

        <section className="flex flex-col gap-5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">The three parts, explained twice</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2.5">
                <Pill n={1} />
                <h3 className="text-sm font-semibold text-slate-900">Template icon</h3>
                <Chip>NSImage.isTemplate</Chip>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  What you see
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  The Wi-Fi fan, battery, and Bluetooth marks are single-color drawings. macOS
                  quietly recolors them — near-black on a light bar, white on a dark one — so they
                  always stay legible. Think of a sticker that changes color to match whatever wall
                  you stick it on.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  How it works
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  The image carries one flag, isTemplate — a property, meaning a setting you hand
                  the image when you create it (&ldquo;this is a shape, not a painting&rdquo;).
                  When it is on, macOS ignores the file&rsquo;s own colors and redraws the shape in
                  whichever shade fits the current menu bar. You never write recoloring code.
                </p>
              </div>
            </article>

            <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2.5">
                <Pill n={2} />
                <h3 className="text-sm font-semibold text-slate-900">Highlighted state</h3>
                <Chip>NSStatusBarButton.isHighlighted</Chip>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  What you see
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  Click the icon and a soft rounded rectangle lights up behind it, like a porch
                  light switching on while the door is open. It stays lit until the menu closes,
                  showing exactly which status item owns the panel below.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  How it works
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  While the menu is open, the button&rsquo;s isHighlighted value is true — state,
                  a value the component remembers between clicks. When that value changes, the app
                  renders the button again — render means drawing the screen again — this time with
                  the pale background. Here the web version compares one shared{" "}
                  <Chip>openId</Chip> against each item&rsquo;s id.
                </p>
              </div>
            </article>

            <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2.5">
                <Pill n={3} />
                <h3 className="text-sm font-semibold text-slate-900">Attached menu / popover</h3>
                <Chip>NSStatusItem.menu</Chip>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  What you see
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  The moment you click, a floating notepad of options drops down straight beneath
                  the icon — your networks, toggles, or actions — and vanishes the instant you
                  click elsewhere or press Escape.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  How it works
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  You hand the status item its panel as a prop — settings you hand a component when
                  you use it. A click is an event, something the user does, like a click: it flips
                  state to this item&rsquo;s id, and React renders the surface beneath the button.
                  Clicking outside resets that value, so the panel stops rendering.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#007AFF]">
              Real size
            </p>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              The same pattern at native scale
            </h2>
          </div>
          <p className="text-sm leading-6 text-slate-500">
            Click any status item below and watch the pale highlight hold while its surface is
            open; click elsewhere or press Escape to close. Only Wi-Fi has an attached menu here —
            then flip the moon/sun toggle and watch every template icon recolor itself.
          </p>
          <Desktop>
            <MenuBar appearance={appearance} onAppearanceChange={setAppearance} right={<>
              <StatusItem
                id="wifi"
                openId={openId}
                onOpenChange={setOpenId}
                label="Wi-Fi"
                surface={
                  <StatusMenu>
                    <MenuLabel>Wi-Fi</MenuLabel>
                    <MenuItem checked>HomeNet 5G</MenuItem>
                    <MenuItem>Office Guest</MenuItem>
                    <MenuSeparator />
                    <MenuItem chevron>Network Settings…</MenuItem>
                  </StatusMenu>
                }
              >
                <WifiIcon className="h-[15px] w-[15px]" />
              </StatusItem>
              <StatusItem id="battery" openId={openId} onOpenChange={setOpenId} label="Battery 82 percent">
                <BatteryIcon className="w-[26px]" />
                <span className="text-[13px] tabular-nums">82%</span>
              </StatusItem>
              <StatusItem id="bluetooth" openId={openId} onOpenChange={setOpenId} label="Bluetooth">
                <BluetoothIcon className="h-[14px] w-[14px]" />
              </StatusItem>
              <StatusItem id="search" openId={openId} onOpenChange={setOpenId} label="Spotlight search">
                <SearchIcon className="h-[14px] w-[14px]" />
              </StatusItem>
              <StatusItem id="cc" openId={openId} onOpenChange={setOpenId} label="Control Center">
                <ControlCenterIcon className="h-[15px] w-[15px]" />
              </StatusItem>
              </>
              }
            >
          </MenuBar>
            <div className="h-[200px] bg-gradient-to-br from-sky-100 via-slate-50 to-indigo-200" />
          </Desktop>
          <p className="text-xs text-slate-400">
            Surface note: only the Wi-Fi item passes a <Chip>surface</Chip>, so only it opens a
            panel — but every item still shows its hover and highlight states.
          </p>
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#007AFF]">
              Scenarios
            </p>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Where real products use it
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                href: "/scenarios/wifi-system-menu",
                title: "Wi-Fi system menu",
                hook: "The classic network list — checkmarks, separators, shortcuts, and a disabled item.",
              },
              {
                href: "/scenarios/focus-timer-popover",
                title: "Focus-timer popover",
                hook: "A richer popover surface with a live countdown ticking while the highlight holds.",
              },
              {
                href: "/scenarios/vpn-live-item",
                title: "VPN live item",
                hook: "The icon itself updates — its text swaps between OFF and CONNECTED as state changes.",
              },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <span className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">{s.title}</span>
                  <ChevronGlyph />
                </span>
                <span className="text-sm leading-6 text-slate-500">{s.hook}</span>
              </Link>
            ))}
          </div>
        </section>

        <ScenarioNav current="hub" />
      </div>
    </main>
  );
}

function CheckIconSmall() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" className="size-2 shrink-0" aria-hidden="true">
      <path d="M4.5 12.8 9.5 18 19.5 6.5" />
    </svg>
  );
}

function ChevronGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-slate-300 transition-colors duration-150 group-hover:text-[#007AFF]" aria-hidden="true">
      <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
    </svg>
  );
}
