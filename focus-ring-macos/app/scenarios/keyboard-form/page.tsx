"use client";

import Link from "next/link";
import { useState } from "react";

type RingMode = "good" | "broken" | "custom";

export default function KeyboardFormPage() {
  const [mode, setMode] = useState<RingMode>("good");
  const [focused, setFocused] = useState<string | null>(null);
  const [values, setValues] = useState({
    name: "Alex Rivera",
    email: "alex@studio.work",
    address: "421 Larkin St, Apt 3B",
    zip: "94102",
    city: "San Francisco",
    card: "",
    save: false,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const fieldClass = (id: string, base = "") => {
    const isFocused = focused === id;
    if (mode === "broken") return `border-border bg-white ${base} ${isFocused ? "border-zinc-400" : ""}`;
    if (mode === "custom") {
      // hard border mistake
      return `border-border bg-white ${base} ${isFocused ? "!border-zinc-900 ring-1 ring-zinc-900" : ""}`;
    }
    // good — macOS ring on focus-visible
    return `border-border bg-white ${base} ${isFocused ? "macos-ring !border-[#0a84ff]" : "focus-within:border-[#0a84ff]/40"}`;
  };

  const labelMismatches = mode === "broken" ? "No visible focus — Tab is invisible." : mode === "custom" ? "Hard 1px border — low contrast." : "macOS halo · :focus-visible";

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      {/* nav */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs">
        <Link href="/" className="rounded-full border border-border bg-white px-3 py-1 hover:border-border-strong">
          ← Hub
        </Link>
        <span className="text-text-faint">/</span>
        <span className="rounded-full bg-[#1c1917] px-3 py-1 font-semibold text-white">01 · Checkout form</span>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-text-muted">
          <span className="h-2 w-2 rounded-full bg-[#0a84ff]" /> :focus-visible
        </span>
        <div className="ml-auto flex gap-1.5">
          <Link href="/scenarios/system-settings" className="rounded-full border border-border bg-white px-3 py-1 hover:border-border-strong">
            Next: Settings →
          </Link>
        </div>
      </nav>

      <header className="mb-8 max-w-3xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0a84ff]">Scenario 01 · Web checkout</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">The form that reveals your outlet blind spot</h1>
        <p className="mt-3 text-base leading-relaxed text-text-muted">
          A real checkout — the kind you ship every week. Try it twice: once with{" "}
          <span className="font-medium text-foreground">Tab only</span>, no mouse; once with a mouse. The correct ring
          appears for keyboard, stays quiet for clicks. Flip to “broken” and watch keyboard users go blind.
        </p>
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          <span className="font-semibold">Why it fits here:</span> Forms are the #1 place focus rings are killed with{" "}
          <code className="rounded bg-white px-1 font-mono text-xs">* {"{"} outline: none {"}"}</code>. This scenario
          proves the cost: fewer errors for sighted mouse users — zero orientation for everyone else. Good{" "}
          <code className="font-mono text-xs">:focus-visible</code> gives both.
        </p>
      </header>

      {/* mode switcher */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex overflow-hidden rounded-full border border-border bg-white p-1 shadow-sm">
          {(
            [
              ["good", "✓ Good — halo"],
              ["broken", "✗ Broken — none"],
              ["custom", "⚠ Custom — border"],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              onClick={() => setMode(v as RingMode)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${mode === v ? "bg-[#1c1917] text-white" : "text-text-muted hover:text-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 font-mono text-xs text-text-muted">
          <span className={`h-2 w-2 rounded-full ${mode === "good" ? "bg-emerald-500" : mode === "broken" ? "bg-red-500" : "bg-amber-500"}`} />
          {labelMismatches}
        </span>
        <span className="font-mono text-xs text-text-faint hidden sm:inline">Press Tab to test — watch the ring</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
        {/* ── the checkout form ── */}
        <div className="rounded-2xl border border-border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* header */}
          <div className="border-b border-border bg-[#fcfcfa] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#1c1917] text-white text-sm font-bold">A</div>
              <div>
                <p className="text-sm font-semibold">Acme Supply — Checkout</p>
                <p className="text-xs text-text-muted">Free shipping over $75 · 2-year warranty</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex rounded-full border border-border bg-white px-2.5 py-1 font-mono text-xs text-text-muted">
              Step 2 of 3 · Shipping & payment
            </span>
          </div>

          <form
            className="p-6"
            onSubmit={(e) => {
              e.preventDefault();
              alert(`Order placed for ${values.name} — ${values.email}`);
            }}
          >
            <div className="grid gap-5">
              {/* name + email */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-text-muted">Full name</span>
                  <div className={`rounded-md border px-3 py-2 shadow-sm transition-shadow ${fieldClass("name")}`}>
                    <input
                      value={values.name}
                      onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                      onFocus={() => setFocused("name")}
                      onBlur={() => {
                        setFocused(null);
                        setTouched((t) => ({ ...t, name: true }));
                      }}
                      placeholder="Alex Rivera"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-text-faint"
                      autoComplete="name"
                    />
                  </div>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-text-muted">Email</span>
                  <div className={`rounded-md border px-3 py-2 shadow-sm transition-shadow ${fieldClass("email")}`}>
                    <input
                      value={values.email}
                      onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                      onFocus={() => setFocused("email")}
                      onBlur={() => {
                        setFocused(null);
                        setTouched((t) => ({ ...t, email: true }));
                      }}
                      placeholder="alex@studio.work"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-text-faint"
                      autoComplete="email"
                    />
                  </div>
                  {touched.email && !values.email.includes("@") && values.email.length > 0 && (
                    <p className="text-xs text-red-600">Include an “@” in the email address.</p>
                  )}
                </label>
              </div>

              {/* address */}
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-text-muted">Street address</span>
                <div className={`rounded-md border px-3 py-2 shadow-sm transition-shadow ${fieldClass("address")}`}>
                  <input
                    value={values.address}
                    onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))}
                    onFocus={() => setFocused("address")}
                    onBlur={() => setFocused(null)}
                    placeholder="421 Larkin St, Apt 3B"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-text-faint"
                  />
                </div>
              </label>

              <div className="grid gap-4 sm:grid-cols-[1fr_1fr_0.9fr]">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-text-muted">City</span>
                  <div className={`rounded-md border px-3 py-2 shadow-sm transition-shadow ${fieldClass("city")}`}>
                    <input
                      value={values.city}
                      onChange={(e) => setValues((v) => ({ ...v, city: e.target.value }))}
                      onFocus={() => setFocused("city")}
                      onBlur={() => setFocused(null)}
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-text-muted">ZIP</span>
                  <div className={`rounded-md border px-3 py-2 shadow-sm transition-shadow ${fieldClass("zip")}`}>
                    <input
                      value={values.zip}
                      onChange={(e) => setValues((v) => ({ ...v, zip: e.target.value }))}
                      onFocus={() => setFocused("zip")}
                      onBlur={() => setFocused(null)}
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-text-muted">Shipping</span>
                  <div className={`rounded-md border p-1 flex gap-1 bg-[#fafaf9] ${fieldClass("ship", " !p-1")}`}>
                    <button
                      type="button"
                      onFocus={() => setFocused("ship")}
                      onBlur={() => setFocused(null)}
                      className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium ${fieldClass("ship") === fieldClass("ship") ? "" : ""} ${focused === "ship" ? "bg-white shadow-sm border border-border" : "text-text-muted"}`}
                    >
                      Standard
                    </button>
                    <button
                      type="button"
                      onFocus={() => setFocused("ship")}
                      onBlur={() => setFocused(null)}
                      className="flex-1 rounded-md bg-[#1c1917] px-2 py-1.5 text-xs font-semibold text-white"
                    >
                      Express
                    </button>
                  </div>
                </label>
              </div>

              {/* card */}
              <label className="block space-y-1.5">
                <span className="flex items-center gap-2 text-xs font-medium text-text-muted">
                  Card number <span className="font-mono text-[11px] text-text-faint">— ring must survive input mask</span>
                </span>
                <div className={`flex items-center gap-2 rounded-md border px-3 py-2 shadow-sm transition-shadow ${fieldClass("card")}`}>
                  <span className="text-text-faint">◈</span>
                  <input
                    value={values.card}
                    onChange={(e) => setValues((v) => ({ ...v, card: e.target.value.replace(/\D/g, "").slice(0, 16) }))}
                    onFocus={() => setFocused("card")}
                    onBlur={() => setFocused(null)}
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                    className="flex-1 bg-transparent text-sm tracking-widest outline-none placeholder:text-text-faint"
                  />
                  <span className="hidden sm:inline font-mono text-xs text-text-faint">Visa · MC · Amex</span>
                </div>
              </label>

              {/* checkbox + actions */}
              <label className={`flex items-center gap-3 rounded-md border px-3 py-3 transition-shadow ${fieldClass("save")}`}>
                <input
                  type="checkbox"
                  checked={values.save}
                  onChange={(e) => setValues((v) => ({ ...v, save: e.target.checked }))}
                  onFocus={() => setFocused("save")}
                  onBlur={() => setFocused(null)}
                  className="h-4 w-4 rounded border-border accent-[#0a84ff]"
                />
                <span className="text-sm">Save this address for next time</span>
                <span className="ml-auto hidden sm:inline font-mono text-xs text-text-faint">Space to toggle</span>
              </label>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-5">
                <p className="text-xs text-text-faint text-center sm:text-left">
                  Press <kbd className="rounded border border-border bg-white px-1 py-0.5 font-mono text-[11px]">Tab</kbd>{" "}
                  through the whole form — ring follows.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onFocus={() => setFocused("cancel")}
                    onBlur={() => setFocused(null)}
                    className={`rounded-md border bg-white px-4 py-2 text-sm font-medium shadow-sm ${fieldClass("cancel")}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onFocus={() => setFocused("pay")}
                    onBlur={() => setFocused(null)}
                    className={`rounded-md bg-[#0a84ff] px-6 py-2 text-sm font-semibold text-white shadow ${fieldClass("pay") ? fieldClass("pay") + " !bg-[#0a84ff]" : "hover:bg-[#0066cc]"}`}
                  >
                    Pay $129
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* focus readout */}
          <div className="border-t border-border bg-[#fcfcfa] px-6 py-3 flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-text-faint">Tab order →</span>
            {["name", "email", "address", "city", "zip", "card", "save", "cancel", "pay"].map((id) => (
              <span
                key={id}
                className={`rounded-full border px-2 py-1 ${focused === id ? "bg-[#0a84ff] text-white border-[#0a84ff]" : "bg-white border-border text-text-muted"}`}
              >
                {id}
              </span>
            ))}
            <span className="ml-auto hidden sm:inline text-text-faint">active: {focused ?? "—"}</span>
          </div>
        </div>

        {/* right: explain */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold">How to test this (30 seconds)</h3>
            <ol className="mt-3 space-y-2 text-sm leading-relaxed text-text-muted list-decimal pl-4">
              <li>
                Click the form background, then hit <kbd className="rounded border border-border bg-white px-1 py-0.5 font-mono text-xs">Tab</kbd>{" "}
                five times. Ring glides field → field → checkbox → buttons.
              </li>
              <li>
                Now click inside a field with your mouse. In <span className="font-semibold">Good</span> mode the halo stays
                subtle — no ring fight on mouse users.
              </li>
              <li>
                Switch to <span className="font-semibold">Broken — none</span> and Tab again: you literally cannot tell where
                you are. That’s what <code className="font-mono text-xs">outline: none</code> does.
              </li>
            </ol>
            <div className="mt-4 grid gap-2">
              <div className="rounded-xl bg-[#eff6ff] border border-[#0a84ff]/15 p-3">
                <p className="font-mono text-[11px] font-semibold text-[#0a84ff]">CSS that does it right</p>
                <pre className="mt-1 overflow-x-auto font-mono text-xs leading-relaxed text-[#1e3a5f]">{`/* keyboard only */
:where(:focus-visible){
  box-shadow: 0 0 0 1px #0a84ff,
              0 0 0 4px rgba(10,132,255,.22);
  border-color: #0a84ff;
}
/* mouse — no ring */
:where(:focus:not(:focus-visible)){
  outline: none;
  box-shadow: none;
}`}</pre>
              </div>
              <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                <p className="font-mono text-[11px] font-semibold text-red-700">Don’t do this</p>
                <pre className="mt-1 font-mono text-xs text-red-900">* {`{ outline: none; }`}  /* kills ring for everyone */</pre>
                <pre className="mt-1 font-mono text-xs text-red-900">input:focus {`{ border: 1px solid black; }`} /* fails 3:1 */</pre>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold">What you gain here</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              A form a keyboard-only user can fly through — Tab, type, Space to toggle save, Enter to pay — without ever
              wondering “where am I?”. Mouse users see a clean page with no distracting rings on click; keyboard users
              get a confident halo at every stop. Same component, two input modes, zero trade-offs.
            </p>
            <div className="mt-3 flex items-center gap-2 font-mono text-xs text-text-faint">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> WCAG 2.4.7 Focus Visible · 2.4.11 Focus Appearance
            </div>
          </div>

          <div className="rounded-xl border border-border bg-[#1c1917] p-4 text-white">
            <p className="font-mono text-xs font-semibold tracking-widest text-white/60">BUILDER NOTE · Analogies</p>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              <span className="font-semibold text-white">Props</span> = settings you hand the input (placeholder, value).
              <span className="font-semibold text-white"> State</span> = what the form remembers (the current text).
              <span className="font-semibold text-white"> Focus</span> = which element the browser has “picked up” — like
              holding a pen over one box. <code className="font-mono text-xs">:focus-visible</code> is the browser asking:
              “did the user arrive here via keyboard? Then show the ring.”
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
