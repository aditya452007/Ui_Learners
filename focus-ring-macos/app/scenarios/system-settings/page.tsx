"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

type Id =
  | "appearance"
  | "accent"
  | "highlight"
  | "sidebarSize"
  | "scrollBars"
  | "accentOrange"
  | "accentBlue"
  | "auto"
  | "toggleBlur";

const ACCENTS = [
  { id: "blue", label: "Blue", c: "#0a84ff" },
  { id: "purple", label: "Purple", c: "#af52de" },
  { id: "pink", label: "Pink", c: "#ff2d55" },
  { id: "red", label: "Red", c: "#ff3b30" },
  { id: "orange", label: "Orange", c: "#ff9500" },
  { id: "yellow", label: "Yellow", c: "#ffcc00" },
  { id: "green", label: "Green", c: "#30d158" },
  { id: "graphite", label: "Graphite", c: "#8e8e93" },
] as const;

export default function SystemSettingsPage() {
  const [active, setActive] = useState<Id>("appearance");
  const [accent, setAccent] = useState<string>("#0a84ff");
  const [appearance, setAppearance] = useState<"light" | "dark" | "auto">("light");
  const [sidebarSize, setSidebarSize] = useState<"small" | "medium" | "large">("medium");
  const [scrollBars, setScrollBars] = useState<"auto" | "always" | "whenScrolling">("auto");
  const [reduceMotion, setReduceMotion] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  const order: Id[] = ["appearance", "accent", "highlight", "sidebarSize", "scrollBars", "accentBlue", "auto", "toggleBlur"];
  const move = useCallback(
    (dir: 1 | -1) => {
      const idx = order.indexOf(active);
      setActive(order[(idx + dir + order.length) % order.length]);
    },
    [active]
  );

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        move(e.shiftKey ? -1 : 1);
      }
    };
    el.addEventListener("keydown", h);
    return () => el.removeEventListener("keydown", h);
  }, [move]);

  useEffect(() => {
    hostRef.current?.focus();
  }, []);

  const ring = (id: Id) => (active === id ? "macos-ring !border-[#0a84ff]" : "border-border");

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <nav className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs">
        <Link href="/" className="rounded-full border border-border bg-white px-3 py-1 hover:border-border-strong">
          ← Hub
        </Link>
        <span className="text-text-faint">/</span>
        <span className="rounded-full bg-[#1c1917] px-3 py-1 font-semibold text-white">02 · System Settings</span>
        <span className="hidden sm:inline-flex rounded-full border border-border bg-white px-3 py-1 text-text-muted">AppKit · FocusState</span>
        <div className="ml-auto flex gap-1.5">
          <Link href="/scenarios/keyboard-form" className="rounded-full border border-border bg-white px-3 py-1 hover:border-border-strong">
            ← Form
          </Link>
          <Link href="/scenarios/toolbar-grid" className="rounded-full border border-border bg-white px-3 py-1 hover:border-border-strong">
            Next: Toolbar →
          </Link>
        </div>
      </nav>

      <header className="mb-8 max-w-3xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0a84ff]">Scenario 02 · macOS System Settings</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">The pane where everything can be focused</h1>
        <p className="mt-3 text-base leading-relaxed text-text-muted">
          A replica of <span className="font-medium text-foreground">System Settings → Appearance</span> — segmented
          controls, color wells, pop-ups, toggles, sliders. On macOS this is the canonical focus-ring showcase: every
          control is reachable by Tab when{" "}
          <span className="rounded bg-white border border-border px-1 py-0.5 font-mono text-xs">Full Keyboard Access</span>{" "}
          is on. Watch the halo hop.
        </p>
        <p className="mt-3 rounded-xl border border-border bg-white px-4 py-3 text-sm leading-relaxed text-text-muted">
          <span className="font-semibold text-foreground">Why it fits here:</span> AppKit’s promise — any view can be
          <code className="mx-1 rounded bg-surface-alt px-1.5 py-0.5 font-mono text-xs">focusable</code> and the window
          owns one <code className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-xs">firstResponder</code>. SwiftUI
          mirrors it with <code className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-xs">FocusState</code>.
          This pane tests groups (segmented), picks (color well), and toggles in one place.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.95fr]">
        {/* ── window ── */}
        <div
          ref={hostRef}
          tabIndex={0}
          className="overflow-hidden rounded-2xl border border-[#d6d3d1] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] outline-none"
        >
          {/* traffic lights */}
          <div className="flex h-9 items-center gap-2 border-b border-border bg-[#f5f5f4] px-4">
            <span className="h-3 w-3 rounded-full border border-[#e0443e] bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full border border-[#d9a01d] bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full border border-[#1fac2e] bg-[#28c840]" />
            <span className="ml-2 hidden text-xs font-medium text-text-muted sm:inline">System Settings</span>
            <span className="ml-auto inline-flex gap-1">
              <button onClick={() => move(-1)} className="rounded-full border border-border bg-white px-2.5 py-1 text-xs font-medium">
                ⇧ Tab
              </button>
              <button onClick={() => move(1)} className="rounded-full bg-[#0a84ff] px-2.5 py-1 text-xs font-semibold text-white">
                Tab →
              </button>
            </span>
          </div>

          <div className="flex min-h-[520px]">
            {/* sidebar */}
            <aside className="hidden w-[210px] shrink-0 border-r border-border bg-[#f5f5f4] p-3 sm:block">
              <div className="relative mb-3">
                <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-faint">⌕</span>
                <input
                  placeholder="Search"
                  className="w-full rounded-md border border-border bg-white py-1.5 pl-7 pr-2 text-xs outline-none placeholder:text-text-faint"
                />
              </div>
              {[
                { g: "Settings", items: ["Appearance", "Accessibility", "Control Center"] },
                { g: "Network", items: ["Wi-Fi", "Bluetooth", "Network"] },
              ].map((sec) => (
                <div key={sec.g} className="mb-4">
                  <p className="px-2 mb-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">{sec.g}</p>
                  {sec.items.map((it) => (
                    <div
                      key={it}
                      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${it === "Appearance" ? "bg-[#0a84ff] text-white" : "text-text-muted"}`}
                    >
                      <span className={`grid h-6 w-6 place-items-center rounded-md text-[11px] ${it === "Appearance" ? "bg-white/20" : "bg-white border border-border"}`}>
                        {it[0]}
                      </span>
                      {it}
                    </div>
                  ))}
                </div>
              ))}
              <div className="rounded-lg border border-dashed border-border bg-white p-2">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">First responder</p>
                <p className="mt-1 font-mono text-xs font-medium text-[#0a84ff]">{active}</p>
                <p className="mt-1 text-xs leading-relaxed text-text-muted">One ring for the whole window — it jumps between groups.</p>
              </div>
            </aside>

            {/* main pane */}
            <div className="flex-1 bg-[#fcfcfa] p-4 sm:p-6">
              <h2 className="text-base font-semibold">Appearance</h2>
              <p className="text-xs text-text-muted">Customize the look of your Mac.</p>

              {/* appearance segmented */}
              <div className="mt-5 rounded-xl border border-border bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Appearance</p>
                    <p className="text-xs text-text-muted">Light, Dark, or Auto — ring follows selection.</p>
                  </div>
                  <div
                    onFocus={() => setActive("appearance")}
                    onClick={() => setActive("appearance")}
                    tabIndex={0}
                    className={`inline-flex overflow-hidden rounded-full border p-1 ${ring("appearance")}`}
                  >
                    {(["light", "dark", "auto"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setAppearance(v)}
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${appearance === v ? "bg-[#1c1917] text-white" : "text-text-muted hover:text-foreground"}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* accent + highlight */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className={`rounded-xl border bg-white p-4 ${ring("accent")}`}>
                  <p className="text-sm font-medium">Accent color</p>
                  <p className="text-xs text-text-muted">System accent used for the ring itself.</p>
                  <div
                    onFocus={() => setActive("accent")}
                    tabIndex={0}
                    className="mt-3 flex flex-wrap gap-1.5"
                  >
                    {ACCENTS.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => {
                          setAccent(a.c);
                          setActive("accent");
                        }}
                        aria-label={a.label}
                        className={`h-7 w-7 rounded-full border-2 shadow-sm transition-transform hover:scale-105 ${accent === a.c ? "border-[#1c1917] scale-110" : "border-white"}`}
                        style={{ background: a.c }}
                      />
                    ))}
                  </div>
                </div>

                <div
                  tabIndex={0}
                  onFocus={() => setActive("highlight")}
                  onClick={() => setActive("highlight")}
                  className={`rounded-xl border bg-white p-4 ${ring("highlight")}`}
                >
                  <p className="text-sm font-medium">Highlight color</p>
                  <p className="text-xs text-text-muted">Selection behind text.</p>
                  <button className="mt-3 flex w-full items-center justify-between rounded-md border border-border bg-gradient-to-b from-white to-[#fafaf9] px-3 py-2 text-left text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ background: accent }} /> Accent Color
                    </span>
                    <span className="text-zinc-400">▾</span>
                  </button>
                </div>
              </div>

              {/* sidebar size + scroll bars */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div
                  tabIndex={0}
                  onFocus={() => setActive("sidebarSize")}
                  onClick={() => setActive("sidebarSize")}
                  className={`rounded-xl border bg-white p-4 ${ring("sidebarSize")}`}
                >
                  <p className="text-sm font-medium">Sidebar icon size</p>
                  <div className="mt-3 inline-flex overflow-hidden rounded-full border border-border bg-[#fafaf9] p-1">
                    {(["small", "medium", "large"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSidebarSize(s)}
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${sidebarSize === s ? "bg-white shadow-sm border border-border" : "text-text-muted"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  tabIndex={0}
                  onFocus={() => setActive("scrollBars")}
                  onClick={() => setActive("scrollBars")}
                  className={`rounded-xl border bg-white p-4 ${ring("scrollBars")}`}
                >
                  <p className="text-sm font-medium">Show scroll bars</p>
                  <div className="mt-3 space-y-2">
                    {(
                      [
                        ["auto", "Automatically based on mouse or trackpad"],
                        ["always", "Always"],
                        ["whenScrolling", "When scrolling"],
                      ] as const
                    ).map(([v, label]) => (
                      <label key={v} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="scroll"
                          checked={scrollBars === v}
                          onChange={() => setScrollBars(v)}
                          className="h-4 w-4 accent-[#0a84ff]"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* toggles */}
              <div className="mt-4 flex flex-wrap gap-3">
                <label
                  tabIndex={0}
                  onFocus={() => setActive("auto")}
                  className={`flex items-center gap-2 rounded-full border bg-white px-3 py-2 ${ring("auto")}`}
                >
                  <input type="checkbox" checked={appearance === "auto"} onChange={() => setAppearance((v) => (v === "auto" ? "light" : "auto"))} className="h-4 w-4 rounded accent-[#0a84ff]" />
                  <span className="text-sm">Allow wallpaper tinting</span>
                </label>
                <label
                  tabIndex={0}
                  onFocus={() => setActive("toggleBlur")}
                  className={`flex items-center gap-2 rounded-full border bg-white px-3 py-2 ${ring("toggleBlur")}`}
                >
                  <input type="checkbox" checked={reduceMotion} onChange={(e) => setReduceMotion(e.target.checked)} className="h-4 w-4 rounded accent-[#0a84ff]" />
                  <span className="text-sm">Reduce motion</span>
                </label>
                <span
                  tabIndex={0}
                  onFocus={() => setActive("accentBlue")}
                  className={`inline-flex items-center gap-1.5 rounded-full border bg-[#eff6ff] px-3 py-2 text-xs font-medium text-[#0a4ea3] ${ring("accentBlue")}`}
                >
                  <span className="h-2 w-2 rounded-full bg-[#0a84ff]" /> Accent ring uses {accent}
                </span>
              </div>

              <p className="mt-4 font-mono text-xs text-text-faint">
                Tip: Tab cycles the whole pane. <span className="font-semibold">Shift+Tab</span> reverses. Blue vs graphite accents change the halo hue — the shape stays identical.
              </p>
            </div>
          </div>
        </div>

        {/* right: explain */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold">What AppKit is doing</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              The window holds one <code className="rounded bg-surface-alt px-1 py-0.5 font-mono text-xs">firstResponder</code>.
              Each control declares <code className="rounded bg-surface-alt px-1 py-0.5 font-mono text-xs">focusRingType</code>{" "}
              — almost always <code className="font-mono text-xs">.default</code>. When a control becomes first responder,
              AppKit paints the ring <em>outside</em> its frame. No control “owns” the ring; the window does.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="rounded-lg border border-border bg-white p-2">
                <p className="text-text-faint">AppKit</p>
                <p className="mt-1 font-medium">NSView.focusRingType</p>
                <p className="text-text-faint">.default · .none · .exterior</p>
              </div>
              <div className="rounded-lg border border-border bg-white p-2">
                <p className="text-text-faint">SwiftUI</p>
                <p className="mt-1 font-medium">.focusable + FocusState</p>
                <p className="text-text-faint">@FocusState var f: Field?</p>
              </div>
            </div>
            <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-[#fcfcfa] p-3 font-mono text-xs leading-relaxed">
              {`// AppKit
window.makeFirstResponder(colorWell)
view.focusRingType = .default

// SwiftUI
@FocusState var focused: Field?
ColorPicker("Accent", selection: $accent)
  .focused($focused, equals: .accent)
  .focusable(true)`}
            </pre>
          </div>

          <div className="rounded-2xl border border-[#0a84ff]/20 bg-[#eff6ff] p-5">
            <h3 className="text-sm font-semibold text-[#0a4ea3]">Group focus matters</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#3a6eab]">
              Segmented controls and radio groups take <em>one</em> Tab stop, then{" "}
              <kbd className="rounded border border-[#0a84ff]/20 bg-white px-1 py-0.5 font-mono text-xs">←</kbd>{" "}
              <kbd className="rounded border border-[#0a84ff]/20 bg-white px-1 py-0.5 font-mono text-xs">→</kbd> moves
              inside. That’s why the Appearance picker’s ring surrounds the whole capsule, not one pill — the group is the
              focusable.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5">
            <h3 className="text-sm font-semibold">What you gain here</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              A settings pane you can operate eyes-free: Tab to the right row, Space to toggle, arrows inside a group.
              That’s how power users — and VoiceOver users — change settings without hunting with a cursor. Kill the ring
              and the whole pane becomes a wall.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between font-mono text-xs">
        <Link href="/scenarios/keyboard-form" className="text-text-muted hover:text-foreground">
          ← 01 Checkout
        </Link>
        <Link href="/scenarios/toolbar-grid" className="font-semibold text-[#0a84ff] hover:text-[#0066cc]">
          03 Toolbar + grid →
        </Link>
      </div>
    </main>
  );
}
