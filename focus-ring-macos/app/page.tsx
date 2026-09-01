"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";

// ────────────────────────────────────────────────────────
// types
// ────────────────────────────────────────────────────────
type RingMode = "default" | "none" | "custom";
type CtrlId = "name" | "role" | "format" | "save" | "notify" | "stepper";

export default function Page() {
  const [active, setActive] = useState<CtrlId>("name");
  const [fullAccess, setFullAccess] = useState(true);
  const [ringMode, setRingMode] = useState<RingMode>("default");
  const [role, setRole] = useState("Designer");
  const [format, setFormat] = useState("PNG");
  const [showFormat, setShowFormat] = useState(false);
  const [notify, setNotify] = useState(true);
  const [quantity, setQuantity] = useState(2);
  const [nameVal, setNameVal] = useState("Summer Poster");
  const hostRef = useRef<HTMLDivElement>(null);

  const ORDER: CtrlId[] = ["name", "role", "format", "save", "notify", "stepper"];
  const focusable = useCallback(
    (id: CtrlId) => {
      if (ringMode === "none") return false;
      if (!fullAccess) return id === "name";
      return true;
    },
    [fullAccess, ringMode]
  );

  const move = useCallback(
    (dir: 1 | -1) => {
      const avail = ORDER.filter(focusable);
      if (avail.length === 0) return;
      const idx = avail.indexOf(active);
      const next = avail[(idx + dir + avail.length) % avail.length];
      setActive(next);
    },
    [active, focusable]
  );

  // keyboard Tab capture inside host
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        move(e.shiftKey ? -1 : 1);
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [move]);

  // auto-focus host for keyboard demo
  useEffect(() => {
    hostRef.current?.focus();
  }, []);

  const ringClass = (id: CtrlId) => {
    if (active !== id) return "";
    if (!focusable(id)) return "";
    if (ringMode === "custom") return "ring-1 ring-zinc-900";
    return "macos-ring";
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      {/* ── header ── */}
      <header className="mb-12 max-w-3xl">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0a84ff]">
          macOS · Web approximation · NSFocusRingType
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Focus Ring</h1>
        <p className="mt-2 font-mono text-sm text-text-faint">
          Also called: keyboard focus indicator · focus halo · first responder ring
        </p>
        <p className="mt-6 text-lg leading-relaxed text-text-muted">
          The soft blue glow that says <span className="font-medium text-foreground">“your typing will land here.”</span>{" "}
          One control in a window is the <em>first responder</em> — AppKit draws the ring around it. Text fields
          take focus by default;{" "}
          <span className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-sm">Full Keyboard Access</span> lets Tab
          move the ring through buttons, pop-ups, and checkboxes too.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">
          If you called it “the blue outline when I Tab to a button” — this is it. AppKit controls it with{" "}
          <code className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-xs">NSView.focusRingType</code> and{" "}
          <code className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-xs">NSWindow.makeFirstResponder(_:)</code>
          ; SwiftUI with <code className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-xs">View.focusable(_:)</code> +{" "}
          <code className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-xs">FocusState</code>. Leave breathing room —
          the ring lives <em>outside</em> the control.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0a84ff]/20 bg-[#eff6ff] px-3 py-1.5 font-mono text-xs font-medium text-[#0a84ff]">
            <span className="h-2 w-2 rounded-full bg-[#0a84ff] shadow-[0_0_0_4px_rgba(10,132,255,0.18)]" />
            NSWindow.firstResponder
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text-muted">
            focusRingType = .default
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text-muted">
            SwiftUI · FocusState
          </span>
        </div>
      </header>

      {/* ── intro strip ── */}
      <section className="mb-16">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-text-muted">What am I looking at?</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              k: "The ring",
              desc: "Not a border. A soft halo that floats 2 px outside the control, in the system accent (usually blue). You see it only on the focused control.",
            },
            {
              k: "Who gets it",
              desc: "Text fields always. Buttons / pop-ups / checkboxes only when Full Keyboard Access is on — or when the control opts in.",
            },
            {
              k: "Why it matters",
              desc: "Without it, keyboard and VoiceOver users are blind. With it, Tab → Space/Enter is predictable. Clip it and you break accessibility.",
            },
          ].map((c, i) => (
            <div key={c.k} className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eff6ff] font-mono text-xs font-bold text-[#0a84ff]">
                {i + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold">{c.k}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── anatomy — live diagram ── */}
      <section className="mb-16">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted">Anatomy — every part, named</h2>
        <p className="mb-6 text-sm text-text-muted">
          A live macOS-style sheet with six controls. Click any control <em>or</em> press{" "}
          <kbd className="rounded border border-border bg-white px-1.5 py-0.5 font-mono text-xs">Tab</kbd> /{" "}
          <kbd className="rounded border border-border bg-white px-1.5 py-0.5 font-mono text-xs">Shift+Tab</kbd> to move the
          first responder — the blue ring follows. Toggle Full Keyboard Access to see who drops out.
        </p>

        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-8">
          {/* controls strip */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0a84ff] shadow-[0_0_0_5px_rgba(10,132,255,0.15)]" />
              <span className="font-mono text-xs text-text-muted">firstResponder</span>
              <span className="font-mono text-xs font-semibold text-foreground">{active}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5">
              <span className={`h-2 w-2 rounded-full ${fullAccess ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span className="font-mono text-xs text-text-muted">Full Keyboard Access</span>
              <span className="font-mono text-xs font-bold">{fullAccess ? "On" : "Off"}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5">
              <span className="font-mono text-xs text-text-muted">focusRingType</span>
              <span className="font-mono text-xs font-medium text-foreground">.{ringMode}</span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 font-mono text-xs text-text-faint">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> live
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <button
                onClick={() => move(-1)}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium hover:bg-surface-alt"
              >
                ⇧ Tab
              </button>
              <button
                onClick={() => move(1)}
                className="rounded-full bg-[#0a84ff] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0066cc]"
              >
                Tab →
              </button>
            </div>
          </div>

          <p className="mb-5 font-mono text-xs leading-relaxed text-text-faint">
            {"<NSWindow>"} · firstResponder = {active} · NSView.focusRingType = .{ringMode} · View.focusable({fullAccess ? "true" : "name only"}) · SwiftUI FocusState
          </p>

          {/* ── stage ── */}
          <div
            className="relative overflow-visible rounded-xl border border-border bg-[#fcfcfa] p-4 sm:p-10"
            style={{
              backgroundImage: "radial-gradient(circle, #e7e5e4 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            <div className="pointer-events-none absolute inset-3 rounded-xl border-2 border-dashed border-[#0a84ff]/15" aria-hidden>
              <div className="absolute -top-3 left-6 bg-[#fcfcfa] px-2">
                <span className="rounded-full border border-[#0a84ff]/20 bg-white px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#0a84ff] shadow-sm">
                  NSWindow · focus ring stage
                </span>
              </div>
            </div>

            {/* toggles above window */}
            <div className="relative z-20 mx-auto mb-6 flex max-w-[640px] flex-wrap items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 shadow-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={fullAccess}
                  onChange={(e) => setFullAccess(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-border accent-[#0a84ff]"
                />
                <span className="text-xs font-medium">Full Keyboard Access</span>
                <span className="font-mono text-[11px] text-text-faint">↹ through all controls</span>
              </label>

              <div className="inline-flex overflow-hidden rounded-full border border-border bg-white p-1 shadow-sm">
                {(["default", "none", "custom"] as RingMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setRingMode(m)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${ringMode === m ? "bg-[#1c1917] text-white" : "text-text-muted hover:text-foreground"}`}
                  >
                    .{m}
                  </button>
                ))}
              </div>
            </div>

            {/* mac window */}
            <div
              ref={hostRef}
              tabIndex={0}
              aria-label="Focus ring playground — press Tab to move focus"
              className="relative mx-auto max-w-[640px] overflow-visible rounded-xl border border-[#d6d3d1] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.10)] outline-none"
            >
              <div className="flex h-8 items-center justify-between border-b border-border bg-[#f5f5f4] px-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full border border-[#e0443e] bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full border border-[#d9a01d] bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full border border-[#1fac2e] bg-[#28c840]" />
                </div>
                <span className="hidden text-xs font-medium text-text-muted sm:inline">Export — Project “Summer”</span>
                <span className="font-mono text-[11px] text-text-faint">100%</span>
              </div>

              {/* window contents — leave 12px breathing room so ring not clipped */}
              <div className="p-6 sm:p-7">
                {/* grid so ring has margin */}
                <div className="grid gap-6">
                  {/* row 1: name + role */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* name field — always focusable */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
                        Save As
                        <span className="rounded bg-[#eff6ff] px-1 py-0.5 font-mono text-[10px] font-semibold text-[#0a84ff]">NSTextField</span>
                      </label>
                      <div className="p-1.5 -m-1.5">
                        <input
                          value={nameVal}
                          onChange={(e) => setNameVal(e.target.value)}
                          onFocus={() => setActive("name")}
                          placeholder="Untitled"
                          aria-label="Name"
                          className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition-shadow ${ringClass("name") ? ringClass("name") + " border-[#0a84ff]" : active === "name" && ringMode === "custom" ? "border-zinc-900 ring-1 ring-zinc-900" : "border-border focus:border-border-strong"} ${ringMode === "none" && active === "name" ? "border-amber-300 bg-amber-50" : ""}`}
                        />
                      </div>
                      <p className="font-mono text-[11px] text-text-faint">focusRingType .default · always focusable</p>
                    </div>

                    {/* role popup */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
                        Role
                        <span className="rounded bg-surface-alt px-1 py-0.5 font-mono text-[10px] font-semibold text-text-muted">NSPopUpButton</span>
                      </label>
                      <div className="p-1.5 -m-1.5">
                        <button
                          onClick={() => {
                            setActive("role");
                            document.getElementById("role-menu")?.classList.toggle("hidden");
                          }}
                          onFocus={() => setActive("role")}
                          aria-haspopup="listbox"
                          className={`flex w-full items-center justify-between rounded-md border bg-gradient-to-b from-white to-[#fafaf9] px-3 py-2 text-left text-sm shadow-sm ${!fullAccess ? "opacity-50 cursor-not-allowed" : ""} ${ringClass("role") ? ringClass("role") + " border-[#0a84ff]" : active === "role" && ringMode === "custom" ? "border-zinc-900 ring-1 ring-zinc-900" : "border-border"}`}
                          disabled={!fullAccess && active !== "role"}
                        >
                          <span>{role}</span>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden className="text-zinc-500">
                            <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                      <p className="font-mono text-[11px] text-text-faint">{fullAccess ? "focusable when Full Keyboard Access is on" : "skipped — Full Keyboard Access off"}</p>
                    </div>
                  </div>

                  {/* row 2: format + stepper + notify */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    {/* format segmented */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-muted">Format</label>
                      <div className="p-1.5 -m-1.5">
                        <div
                          tabIndex={fullAccess ? 0 : -1}
                          onFocus={() => setActive("format")}
                          onClick={() => setActive("format")}
                          role="radiogroup"
                          aria-label="Format"
                          className={`inline-flex overflow-hidden rounded-full border bg-white p-1 ${ringClass("format") ? ringClass("format") + " border-[#0a84ff]" : active === "format" && ringMode === "custom" ? "border-zinc-900 ring-1 ring-zinc-900" : "border-border"}`}
                        >
                          {["PNG", "PDF", "SVG"].map((f) => (
                            <button
                              key={f}
                              onClick={() => setFormat(f)}
                              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${format === f ? "bg-[#1c1917] text-white" : "text-text-muted hover:text-foreground"}`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="font-mono text-[11px] text-text-faint">segmented · loupe</p>
                    </div>

                    {/* stepper */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-muted">Copies</label>
                      <div className="p-1.5 -m-1.5">
                        <div
                          tabIndex={fullAccess ? 0 : -1}
                          onFocus={() => setActive("stepper")}
                          onClick={() => setActive("stepper")}
                          className={`inline-flex items-center overflow-hidden rounded-md border bg-white shadow-sm ${ringClass("stepper") ? ringClass("stepper") + " border-[#0a84ff]" : active === "stepper" && ringMode === "custom" ? "border-zinc-900 ring-1 ring-zinc-900" : "border-border"}`}
                        >
                          <span className="px-3 py-2 text-sm font-medium tabular-nums">{quantity}</span>
                          <div className="flex flex-col border-l border-border">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuantity((q) => Math.min(10, q + 1));
                                setActive("stepper");
                              }}
                              className="grid h-5 w-7 place-items-center bg-gradient-to-b from-white to-[#fafaf9] hover:to-white border-b border-border"
                              aria-label="Increase"
                            >
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <path d="M4 1.5v5M1.5 4h5" stroke="#57534e" strokeWidth="1.2" strokeLinecap="round" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuantity((q) => Math.max(1, q - 1));
                                setActive("stepper");
                              }}
                              className="grid h-5 w-7 place-items-center bg-gradient-to-b from-white to-[#fafaf9] hover:to-white"
                              aria-label="Decrease"
                            >
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <path d="M1.5 4h5" stroke="#57534e" strokeWidth="1.2" strokeLinecap="round" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="font-mono text-[11px] text-text-faint">NSStepper · retains ring</p>
                    </div>

                    {/* notify checkbox */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-muted">Options</label>
                      <div className="p-1.5 -m-1.5">
                        <label
                          tabIndex={fullAccess ? 0 : -1}
                          onFocus={() => setActive("notify")}
                          onClick={() => setActive("notify")}
                          className={`flex items-center gap-2 rounded-md border bg-white px-3 py-2 ${ringClass("notify") ? ringClass("notify") + " border-[#0a84ff]" : active === "notify" && ringMode === "custom" ? "border-zinc-900 ring-1 ring-zinc-900" : "border-border"}`}
                        >
                          <input
                            type="checkbox"
                            checked={notify}
                            onChange={(e) => setNotify(e.target.checked)}
                            onFocus={() => setActive("notify")}
                            className="h-4 w-4 rounded border-border accent-[#0a84ff]"
                          />
                          <span className="text-sm">Notify after export</span>
                        </label>
                      </div>
                      <p className="font-mono text-[11px] text-text-faint">NSButton · checkbox</p>
                    </div>
                  </div>

                  {/* Save button row — primary action */}
                  <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
                    <p className="hidden text-xs text-text-faint sm:block">
                      Press <kbd className="rounded border border-border bg-white px-1 py-0.5 font-mono text-[11px]">Space</kbd> to activate the focused control
                    </p>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onFocus={() => setActive("save")}
                        onClick={() => setActive("save")}
                        className={`rounded-md border bg-white px-4 py-1.5 text-sm font-medium shadow-sm ${!fullAccess ? "opacity-50" : ""} ${ringClass("save") ? ringClass("save") + " border-[#0a84ff]" : active === "save" && ringMode === "custom" ? "border-zinc-900 ring-1 ring-zinc-900" : "border-border"}`}
                        disabled={!fullAccess && active !== "save"}
                      >
                        Cancel
                      </button>
                      <button
                        onFocus={() => setActive("save")}
                        onClick={() => setActive("save")}
                        className={`rounded-md bg-[#0a84ff] px-5 py-1.5 text-sm font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.2)_inset] ${ringClass("save") ? ringClass("save") : active === "save" && ringMode === "custom" ? "ring-1 ring-zinc-900 ring-offset-2" : ""} ${!fullAccess ? "opacity-60" : "hover:bg-[#0066cc]"}`}
                        disabled={!fullAccess && active !== "save"}
                      >
                        Export
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* spacing hint */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-0 sm:block">
                <div className="absolute -bottom-6 left-6 right-6 flex items-center justify-center gap-2">
                  <span className="h-px flex-1 bg-[#0a84ff]/20" />
                  <span className="rounded-full border border-[#0a84ff]/20 bg-white px-2 py-1 font-mono text-[10px] font-medium text-[#0a84ff]">8 px padding — ring breathing room</span>
                  <span className="h-px flex-1 bg-[#0a84ff]/20" />
                </div>
              </div>
            </div>

            {/* desktop callouts */}
            <div className="pointer-events-none absolute -right-2 top-20 hidden items-center gap-1.5 lg:flex" aria-hidden>
              <span className="h-px w-6 bg-[#d6d3d1]" />
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0a84ff] font-mono text-[10px] font-bold text-white">1</span>
              <span className="rounded-full border border-[#0a84ff]/20 bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-[#0a84ff] shadow-sm">the ring · accent halo</span>
            </div>
            <div className="pointer-events-none absolute -left-2 top-[52%] hidden items-center gap-1.5 lg:flex" aria-hidden>
              <span className="rounded-full border border-border bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-text-muted shadow-sm">first responder · who has the ring</span>
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1c1917] font-mono text-[10px] font-bold text-white">2</span>
              <span className="h-px w-6 bg-[#d6d3d1]" />
            </div>
            <div className="pointer-events-none absolute -right-2 bottom-14 hidden items-center gap-1.5 lg:flex" aria-hidden>
              <span className="h-px w-6 bg-[#d6d3d1]" />
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1c1917] font-mono text-[10px] font-bold text-white">3</span>
              <span className="rounded-full border border-border bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-text-muted shadow-sm">Full Keyboard Access</span>
            </div>

            <p className="relative mt-8 text-center font-mono text-xs leading-relaxed text-text-faint">
              Tip: focus the card above (click it), then press{" "}
              <kbd className="rounded border border-border bg-white px-1 py-0.5">Tab</kbd> — the ring jumps. Turn off Full
              Keyboard Access and only the field keeps the ring. Switch to <span className="font-semibold">.none</span> to see
              the ring vanish — keyboard users are stranded. <span className="font-semibold">.custom</span> shows the common
              mistake: replacing the halo with a hard border.
            </p>
          </div>

          {/* legend + do/don't */}
          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            <div className="rounded-xl bg-[#eff6ff] border border-[#0a84ff]/15 px-4 py-3 flex items-start gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#0a84ff] font-mono text-[10px] font-bold text-white">✓</span>
              <div>
                <p className="text-sm font-semibold text-[#0a4ea3]">Do — leave padding</p>
                <p className="mt-1 text-xs leading-relaxed text-[#3a6eab]">The ring lives outside. Give containers 6–8 px padding or it gets clipped.</p>
              </div>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-500 font-mono text-[10px] font-bold text-white">!</span>
              <div>
                <p className="text-sm font-semibold text-amber-900">Don’t — use a hard border</p>
                <p className="mt-1 text-xs leading-relaxed text-amber-800">Swapping the halo for a 1 px border fails contrast and looks like an error.</p>
              </div>
            </div>
            <div className="rounded-xl bg-white border border-border px-4 py-3 flex items-start gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#1c1917] font-mono text-[10px] font-bold text-white">⌥</span>
              <div>
                <p className="text-sm font-semibold">AppKit mapping</p>
                <p className="mt-1 font-mono text-[11px] leading-relaxed text-text-muted">
                  NSView.focusRingType = .default · .none · .exterior
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── layered explanations ── */}
      <section className="mb-16">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted">Every part, in two languages</h2>
        <p className="mb-6 text-sm text-text-muted">Left: what you feel using it. Right: how you build it (plain words, no jargon left undefined).</p>

        <div className="overflow-hidden rounded-2xl border border-border bg-border">
          {[
            {
              n: 1,
              tag: "THE RING",
              title: "Focus ring — the accent halo",
              token: "NSFocusRingType · :focus-visible",
              see: "A soft blue glow that sits a hair outside the edge of the focused control. It never appears on two things at once — it tracks the single ‘active’ control.",
              how: "In AppKit, AppKit itself paints it if NSView.focusRingType is .default (or .exterior for an outside-only ring). You don’t draw it — you keep space for it and don’t override it with your own border. Think of it like a spotlight: the window knows which actor is on stage (firstResponder) and the lighting crew (AppKit) adds the glow. On the web we mimic it with box-shadow: 0 0 0 1px #0a84ff + 0 0 0 4px rgba(10,132,255,.22) on :focus-visible — keyboard focus only, not mouse clicks.",
            },
            {
              n: 2,
              tag: "FIRST RESPONDER",
              title: "First responder — who gets the typing",
              token: "NSWindow.firstResponder · document.activeElement",
              see: "Whichever control wears the ring will receive your keystrokes. Type and letters go there; press Space and the button fires. The ring is the promise.",
              how: "AppKit tracks NSWindow.firstResponder. You move it with window.makeFirstResponder(view) — Tab does this automatically. On the web the twin is document.activeElement + element.focus(). In React you don’t move DOM focus by hand unless you must; you let the browser handle Tab and you style the result with :focus-visible. In SwiftUI you declare @FocusState var focusedField: Field? and attach .focused($focusedField, equals: .name).",
            },
            {
              n: 3,
              tag: "FULL KEYBOARD ACCESS",
              title: "Full Keyboard Access — Tab beyond fields",
              token: "View.focusable · tabindex",
              see: "By default only text fields grab focus. Flip Full Keyboard Access on and Tab hops to buttons, pop-ups, checkboxes — every control. Off: Tab skips them. That little on/off changes the whole path.",
              how: "In AppKit this is the System Settings → Keyboard → Full Keyboard Access toggle. Controls that are focusable when it’s on implement acceptsFirstResponder. On the web you control it per element: <button> is focusable by default, <div> is not unless you add tabIndex={0}. SwiftUI’s View.focusable(true/false) is the same switch. Demo trick above: we filter the Tab order when the toggle is off so only the text field remains. Real users depend on this — never remove Tab stops from actionable controls.",
            },
            {
              n: 4,
              tag: "FOCUS RING TYPE",
              title: "focusRingType — when the ring shows",
              token: "NSView.focusRingType · outline: none (danger)",
              see: "Three choices: default (ring appears when focused) · none (never — looks broken) · exterior (ring tightly outside). Using none by accident is the #1 accessibility bug: the focus is there but invisible.",
              how: "In AppKit: view.focusRingType = .none hides the halo. On the web the equal mistake is * { outline: none } without a replacement — keyboard users vanish. The fix is to only hide the ring for mouse: :focus:not(:focus-visible) { outline: none } and for keyboard: :focus-visible { box-shadow: … }. Demo’s .none button simply skips painting the ring to show how lost you feel; .custom shows the other mistake — swapping the airy halo for a hard 1px border that fails contrast.",
            },
            {
              n: 5,
              tag: "BREATHING ROOM",
              title: "Layout breathing room — don’t clip",
              token: "overflow / padding — AppKit leaves space",
              see: "Because the ring lives outside, a tight container chops it. You’ll see a half-moon instead of a full halo. macOS guidelines say: give the ring 4–6 px clearance.",
              how: "In AppKit, Apple’s docs literally say ‘leave enough space in your layout’. In CSS the twin problem is a parent with overflow: hidden or overflow: auto that crops box-shadow. Fix: add padding to the parent and negative margin to the scroll area, or use outline (which can’t be clipped in some browsers) — but outline can’t do rounded corners nicely. Our fix class .noclip-ring does padding: 6px; margin: -6px with overflow: visible. Try it in Scenario 3 — it’s the whole lesson there.",
            },
          ].map((part, i) => (
            <div key={part.n} className={`grid md:grid-cols-2 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="bg-surface p-5 sm:p-6">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0a84ff]">{part.tag}</p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-foreground font-mono text-[10px] text-white">{part.n}</span>
                  {part.title}
                </p>
                <code className="mt-1 block font-mono text-[11px] tracking-tight text-text-faint">{part.token}</code>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  <span className="font-semibold text-foreground">What you see:</span> {part.see}
                </p>
              </div>
              <div className="border-t border-border bg-[#fcfcfb] p-5 sm:p-6 md:border-t-0 md:border-l">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-text-faint">How it works — plain words</p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{part.how}</p>
                {part.n === 1 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <code className="rounded bg-white border border-border px-1.5 py-0.5 font-mono text-[11px]">NSView.focusRingType = .default</code>
                    <code className="rounded bg-white border border-border px-1.5 py-0.5 font-mono text-[11px]">:focus-visible {"{ box-shadow }"}</code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AppKit vs Web cheatsheet */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold">AppKit ↔ Web mapping</h3>
            <dl className="mt-3 space-y-2 font-mono text-xs">
              <div className="flex justify-between gap-2">
                <dt className="text-text-faint">firstResponder</dt>
                <dd className="font-medium text-foreground">document.activeElement</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-text-faint">makeFirstResponder(_:)</dt>
                <dd className="font-medium text-foreground">el.focus()</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-text-faint">focusRingType</dt>
                <dd className="font-medium text-foreground">:focus-visible</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-text-faint">View.focusable</dt>
                <dd className="font-medium text-foreground">tabIndex</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-text-faint">FocusState</dt>
                <dd className="font-medium text-foreground">:focus-within + state</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold">When to show the ring</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-muted">
              <li className="flex gap-2">
                <span className="text-emerald-600">✓</span> Tab / Shift+Tab moves it — always visible.
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600">✓</span> Arrow keys inside groups (segmented, toolbar).
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-400">·</span> Mouse click: web hides it (<code className="font-mono text-xs">:focus-visible</code>), macOS may still flash it briefly.
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">✗</span> Never show nothing. If focus exists, ring must show.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-[#0a84ff]/20 bg-[#eff6ff] p-5">
            <h3 className="text-sm font-semibold text-[#0a4ea3]">High-contrast check</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#3a6eab]">
              macOS accent ring meets WCAG 3:1 against white at 1 px solid + an outer wash. Lone light-gray rings fail.
              Test against both light and dark backgrounds.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="h-6 w-6 rounded-md border border-[#0a84ff] shadow-[0_0_0_3px_rgba(10,132,255,0.18)] bg-white" />
              <span className="font-mono text-xs text-[#0a4ea3]">#0a84ff on white — pass</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── scenarios nav ── */}
      <section className="mb-16">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted">See it in real products</h2>
        <p className="mb-6 text-sm text-text-muted">
          Three live places the ring makes or breaks the experience. Each one stresses something the hub can’t — form
          validation, a dense toolbar, and a macOS Settings pane.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              href: "/scenarios/keyboard-form",
              k: "01",
              title: "Checkout form",
              desc: "Web form where :focus-visible separates mouse from keyboard — and where killing outlines locks users out.",
              pill: ":focus-visible · a11y",
              accent: "from-[#eff6ff] to-white",
            },
            {
              href: "/scenarios/system-settings",
              k: "02",
              title: "System Settings",
              desc: "macOS Appearance pane replica — segmented controls, sliders, checkboxes, Tab groups exactly as AppKit handles them.",
              pill: "AppKit · FocusState",
              accent: "from-[#f5f5f4] to-white",
            },
            {
              href: "/scenarios/toolbar-grid",
              k: "03",
              title: "Toolbar + grid",
              desc: "When the ring is clipped by overflow — and how 6 px of breathing room fixes it without touching the control.",
              pill: "layout · overflow",
              accent: "from-[#fefce8] to-white",
            },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-all hover:border-[#0a84ff]/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${s.accent} opacity-60`} aria-hidden />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white border border-border font-mono text-xs font-bold shadow-sm">
                    {s.k}
                  </span>
                  <span className="rounded-full border border-border bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-text-muted">{s.pill}</span>
                </div>
                <h3 className="mt-4 text-sm font-semibold tracking-tight group-hover:text-[#0a84ff]">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:text-[#0a84ff]">
                  Open scenario <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── footer ── */}
      <footer className="border-t border-border pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs text-text-faint">
            Built as a web approximation of AppKit’s focus ring — the glow itself is native; we recreate the rules so you can feel them with a keyboard.
          </p>
          <Link href="/" className="font-mono text-xs font-semibold text-text-muted hover:text-foreground">
            back to hub ↑
          </Link>
        </div>
      </footer>
    </main>
  );
}
