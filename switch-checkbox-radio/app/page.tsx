"use client";

import Link from "next/link";
import { useState } from "react";
import { NumPill, ScenarioNav, Token, TopBar } from "./components/ui";

const PARTS = [
  {
    n: 1,
    name: "Switch thumb",
    token: 'role="switch"',
    see: "The little white circle that slides left and right inside the pill. Its position is the whole message: parked left means off, slid right means on. You can read it from across the room without reading a single word.",
    how: "Underneath, this is an <input type=\"checkbox\"> with role=\"switch\" — role tells assistive tech to announce it as a switch instead of a checkbox. A boolean state (a true/false value the component remembers between clicks) decides the position; when it flips, CSS slides the circle with transform. Like a light-switch rocker: the plastic nub is either up or down, and the room changes instantly.",
    fragment: "the circular thumb inside a role=\"switch\" control, sliding to the checked side when on",
  },
  {
    n: 2,
    name: "Switch track",
    token: 'role="switch"',
    see: "The rounded pill behind the moving circle. It fills with color when the setting is on and drains back to grey when it is off, so the background shouts the state while the thumb whispers it. Grey means resting, teal means live.",
    how: "The track is a <span> sitting right after the input, so CSS can restyle it with the :checked + sibling selector — the plus means “the element immediately after a checked input.” No JavaScript draws the color; render (drawing the screen again from state) just re-applies the checked class. Like a runway that only lights up when a plane is landing.",
    fragment: "the capsule-shaped track behind a role=\"switch\" thumb, changing fill with the checked state",
  },
  {
    n: 3,
    name: "Checkbox checkmark",
    token: '<input type="checkbox">',
    see: "The tick that appears inside the square box. Each box minds its own business: ticking “Extra legroom” never unticks “Priority boarding.” And nothing happens yet — the ticks are just a shortlist waiting for you to press Save.",
    how: "A plain <input type=\"checkbox\"> with no role override, so screen readers announce “checked / not checked.” Each box owns independent state, which is why several can be on at once — unlike radios, nothing links them. The tick is an SVG path that draws itself with a stroke animation when checked flips true. Like ticking items on a packing list: the list doesn't pack itself until you zip the bag (press Save).",
    fragment: "the native checkmark inside a checked <input type=\"checkbox\">",
  },
  {
    n: 4,
    name: "Radio selection dot",
    token: '<input type="radio">',
    see: "The filled dot inside the chosen circle. There is one dot for the whole group — pick Aisle and the Window dot vanishes. The circles are the question, the single dot is your answer.",
    how: "Every circle in the group shares the same name attribute (name=\"seat\"), and the browser itself enforces “exactly one”: checking one input clears the others, no code needed. Arrow keys move between options in the group; screen readers announce “selected, 2 of 3.” The dot scales in with a springy transition when its input becomes :checked. Like the preset buttons on an old car radio — that is literally where the name comes from: push one in, the rest pop out.",
    fragment: "the centered selection dot inside the checked <input type=\"radio\"> of a same-name group",
  },
] as const;

export default function Page() {
  const [notifOn, setNotifOn] = useState(true);
  const [extras, setExtras] = useState({ legroom: true, boarding: false });
  const [seat, setSeat] = useState("aisle");
  const [active, setActive] = useState<number | null>(null);

  const extrasCount = (extras.legroom ? 1 : 0) + (extras.boarding ? 1 : 0);
  const hl = (n: number) =>
    active === n ? "ring-2 ring-teal-600 ring-offset-2 ring-offset-white" : "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />

      <main className="mx-auto max-w-6xl px-6 pb-20">
        {/* hero */}
        <header className="pb-8 pt-12">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-teal-700">
            Web · Form choice
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Switch vs. Checkbox vs. Radio
          </h1>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-text-muted">
            Also called:{" "}
            <span className="font-medium text-foreground">
              toggle switch, check box, radio button, option button
            </span>
            . A <strong className="font-semibold">switch</strong> controls one binary setting and applies it{" "}
            <em>immediately</em> — like turning notifications on. A{" "}
            <strong className="font-semibold">checkbox</strong> is an independent choice that may wait for Save;
            several can be on. <strong className="font-semibold">Radio buttons</strong> share one name, and
            choosing one clears the others — exactly one wins.
          </p>

          {/* intro strip */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              {
                t: "Switch → acts now",
                d: "One on/off setting. Flip it and the product changes instantly — no Save button anywhere.",
                icon: (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6}>
                    <rect x="1" y="5" width="18" height="10" rx="5" />
                    <circle cx="14" cy="10" r="3" fill="currentColor" stroke="none" />
                  </svg>
                ),
              },
              {
                t: "Checkbox → stages",
                d: "Independent yes/no values. Tick several, then Save or Submit applies them together.",
                icon: (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6}>
                    <rect x="2" y="2" width="16" height="16" rx="4" />
                    <path d="M6.5 10.5 9 13l4.5-6" />
                  </svg>
                ),
              },
              {
                t: "Radio → picks one",
                d: "A named group where only one circle holds the dot. Picking one clears the rest.",
                icon: (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6}>
                    <circle cx="10" cy="10" r="8" />
                    <circle cx="10" cy="10" r="3" fill="currentColor" stroke="none" />
                  </svg>
                ),
              },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <div className="grid size-8 place-items-center rounded-lg bg-teal-700/10 text-teal-800">{c.icon}</div>
                <p className="mt-3 text-sm font-semibold">{c.t}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-text-muted">{c.d}</p>
              </div>
            ))}
          </div>
        </header>

        {/* live anatomy */}
        <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-6 py-4">
            <h2 className="text-base font-semibold tracking-tight">Live anatomy — click everything</h2>
            <p className="font-mono text-[11px] text-text-faint">
              {notifOn ? "switch: on · applied" : "switch: off · applied"} · checkboxes: {extrasCount} of 2 staged · radio: {seat}
            </p>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
            {/* controls */}
            <div className="space-y-6 p-6 sm:p-8">
              {/* switch row */}
              <div className="flex items-start gap-3">
                <div className="flex shrink-0 flex-col items-center gap-1 pt-1">
                  <button onClick={() => setActive(active === 1 ? null : 1)} aria-label="Highlight switch thumb">
                    <NumPill n={1} active={active === 1} />
                  </button>
                  <button onClick={() => setActive(active === 2 ? null : 2)} aria-label="Highlight switch track">
                    <NumPill n={2} active={active === 2} />
                  </button>
                </div>
                <div className="hidden w-6 shrink-0 pt-5 sm:block" aria-hidden="true">
                  <div className="h-px w-full bg-stone-300" />
                </div>
                <label className="flex flex-1 items-center gap-4 rounded-2xl border border-border bg-background px-5 py-4 transition hover:border-teal-700/40 hover:shadow-sm">
                  <input
                    type="checkbox"
                    role="switch"
                    aria-checked={notifOn}
                    className="switch-input sr-only"
                    checked={notifOn}
                    onChange={(e) => setNotifOn(e.target.checked)}
                  />
                  <span className={`switch-track scale-110 ${hl(2)} ${active === 1 ? "part-spotlight" : ""}`} aria-hidden="true">
                    <span className={`switch-thumb ${hl(1)}`} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold">Email notifications</span>
                    <span className="mt-0.5 block text-[13px] text-text-muted">
                      Flip it — the setting applies the instant the thumb lands. No Save button.
                    </span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ${
                      notifOn ? "bg-teal-700 text-white" : "bg-stone-200/70 text-stone-600"
                    }`}
                  >
                    {notifOn ? "On" : "Off"}
                  </span>
                </label>
              </div>

              {/* checkbox rows */}
              <div className="flex items-start gap-3">
                <div className="flex shrink-0 flex-col items-center gap-1 pt-8">
                  <button onClick={() => setActive(active === 3 ? null : 3)} aria-label="Highlight checkbox checkmark">
                    <NumPill n={3} active={active === 3} />
                  </button>
                </div>
                <div className="hidden w-6 shrink-0 pt-12 sm:block" aria-hidden="true">
                  <div className="h-px w-full bg-stone-300" />
                </div>
                <div className="flex-1 rounded-2xl border border-border bg-background p-4">
                  <p className="px-1 pb-3 text-[13px] font-medium text-text-muted">
                    Flight extras — tick <em>several</em>. Nothing is booked until you press Save.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(
                      [
                        { key: "legroom", label: "Extra legroom" },
                        { key: "boarding", label: "Priority boarding" },
                      ] as const
                    ).map((o) => (
                      <label
                        key={o.key}
                        className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 transition hover:border-teal-700/40 hover:shadow-sm"
                      >
                        <input
                          type="checkbox"
                          className="checkbox-input sr-only"
                          checked={extras[o.key]}
                          onChange={(e) => setExtras({ ...extras, [o.key]: e.target.checked })}
                        />
                        <span className={`checkbox-box ${hl(3)}`} aria-hidden="true">
                          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="white" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                            <path className="checkmark-path" d="M3 8.5 6.5 12 13 4.5" />
                          </svg>
                        </span>
                        <span className="text-sm font-semibold">{o.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* radio row */}
              <div className="flex items-start gap-3">
                <div className="flex shrink-0 flex-col items-center gap-1 pt-8">
                  <button onClick={() => setActive(active === 4 ? null : 4)} aria-label="Highlight radio selection dot">
                    <NumPill n={4} active={active === 4} />
                  </button>
                </div>
                <div className="hidden w-6 shrink-0 pt-12 sm:block" aria-hidden="true">
                  <div className="h-px w-full bg-stone-300" />
                </div>
                <fieldset className="flex-1 rounded-2xl border border-border bg-background p-4">
                  <legend className="px-1 text-[13px] font-medium text-text-muted">
                    Seat — pick <em>exactly one</em>. Watch the dot jump.
                  </legend>
                  <div className="grid gap-2 pt-1 sm:grid-cols-3">
                    {(
                      [
                        { v: "window", label: "Window" },
                        { v: "aisle", label: "Aisle" },
                        { v: "middle", label: "Middle" },
                      ] as const
                    ).map((o) => (
                      <label
                        key={o.v}
                        className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-semibold transition ${
                          seat === o.v
                            ? "border-teal-700 bg-teal-50/60 shadow-sm"
                            : "border-border bg-white hover:border-teal-700/40 hover:shadow-sm"
                        }`}
                      >
                        <input
                          type="radio"
                          name="seat"
                          value={o.v}
                          className="radio-input sr-only"
                          checked={seat === o.v}
                          onChange={() => setSeat(o.v)}
                        />
                        <span className={`radio-circle ${hl(4)}`} aria-hidden="true">
                          <span className="radio-dot" />
                        </span>
                        {o.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <p className="rounded-xl bg-surface-alt px-4 py-3 text-[13px] leading-relaxed text-text-muted">
                <span className="font-semibold text-foreground">Feel the difference:</span> the switch applies the
                moment you flip it · the checkboxes only stage a shortlist ({extrasCount} of 2) · the radio dot can
                only ever live in one circle. Keyboard: <kbd className="rounded border border-border bg-white px-1 font-mono text-[11px]">Tab</kbd> to
                reach a control, <kbd className="rounded border border-border bg-white px-1 font-mono text-[11px]">Space</kbd> to
                flip it, <kbd className="rounded border border-border bg-white px-1 font-mono text-[11px]">←</kbd>
                <kbd className="rounded border border-border bg-white px-1 font-mono text-[11px]">→</kbd> to move between radios.
              </p>
            </div>

            {/* callouts */}
            <aside className="space-y-2 border-t border-border bg-surface-alt/60 p-4 lg:border-l lg:border-t-0">
              <p className="px-2 pb-1 font-mono text-[11px] uppercase tracking-[0.14em] text-text-faint">
                Callouts — click to spotlight
              </p>
              {PARTS.map((p) => (
                <button
                  key={p.n}
                  onClick={() => setActive(active === p.n ? null : p.n)}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition ${
                    active === p.n
                      ? "border-teal-700 bg-white shadow-sm"
                      : "border-transparent hover:border-border hover:bg-white"
                  }`}
                >
                  <NumPill n={p.n} active={active === p.n} />
                  <span>
                    <span className="block text-[13px] font-semibold">{p.name}</span>
                    <span className="mt-1 block">
                      <Token>{p.token}</Token>
                    </span>
                  </span>
                </button>
              ))}
              <div className="rounded-2xl border border-border bg-white p-4 text-[13px] leading-relaxed text-text-muted">
                Every control here is a <strong className="text-foreground">real native input</strong> with a visible,
                clickable <code className="font-mono text-[12px]">&lt;label&gt;</code> — screen readers announce the
                checked state for free.
              </div>
            </aside>
          </div>
        </section>

        {/* layered explanations */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Every part, in two languages</h2>
          <p className="mt-1 text-sm text-text-muted">
            <span className="font-medium text-foreground">What you see</span> is for the person using the product.{" "}
            <span className="font-medium text-foreground">How it works</span> is for you, the builder — every term
            defined, no prior React assumed.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {PARTS.map((p) => (
              <article
                key={p.n}
                id={`part-${p.n}`}
                onMouseEnter={() => setActive(p.n)}
                className={`rounded-2xl border bg-surface p-5 shadow-sm transition ${
                  active === p.n ? "border-teal-700" : "border-border"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <NumPill n={p.n} active={active === p.n} />
                  <h3 className="text-[15px] font-semibold">{p.name}</h3>
                  <Token>{p.token}</Token>
                </div>
                <p className="mt-2 font-mono text-[11px] leading-relaxed text-text-faint">“{p.fragment}”</p>
                <div className="mt-3 grid gap-3">
                  <div className="rounded-xl bg-surface-alt p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-teal-800">What you see</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-stone-700">{p.see}</p>
                  </div>
                  <div className="rounded-xl border border-teal-800/15 bg-teal-50/60 p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-teal-800">How it works</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-stone-700">{p.how}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* rules + code */}
        <section className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <h2 className="border-b border-border px-5 py-4 text-base font-semibold tracking-tight">
              Which one do I need?
            </h2>
            <ul className="divide-y divide-border">
              {[
                { q: "Takes effect the instant it's flipped?", a: "Switch", d: "One binary setting · immediate · no Save button", on: true },
                { q: "Several can be on, applied together later?", a: "Checkbox", d: "Independent values · waits for Save / Submit", on: extrasCount > 0 },
                { q: "Exactly one option may win?", a: "Radio (same name)", d: "Named group · choosing one clears the others", on: true },
              ].map((r) => (
                <li key={r.a} className="flex items-center gap-3 px-5 py-3.5">
                  <span className={`size-2 shrink-0 rounded-full ${r.on ? "bg-teal-600" : "bg-stone-300"}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {r.q} → <span className="text-teal-800">{r.a}</span>
                    </p>
                    <p className="text-[13px] text-text-muted">{r.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-stone-900 text-stone-100 shadow-sm">
            <h2 className="border-b border-white/10 px-5 py-4 text-base font-semibold tracking-tight">
              In code — three native inputs
            </h2>
            <div className="space-y-4 p-5 font-mono text-[12px] leading-relaxed">
              <div>
                <p className="mb-1 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-teal-300">Switch — immediate</p>
                <pre className="overflow-x-auto rounded-xl bg-white/5 p-3">{`<label>\n  <input type="checkbox" role="switch"\n    checked={on} onChange={apply} />\n  Email notifications\n</label>`}</pre>
              </div>
              <div>
                <p className="mb-1 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-teal-300">Checkbox — staged</p>
                <pre className="overflow-x-auto rounded-xl bg-white/5 p-3">{`<label>\n  <input type="checkbox"\n    checked={ticked} onChange={stage} />\n  Extra legroom\n</label>\n{/* applied later by <button>Save</button> */}`}</pre>
              </div>
              <div>
                <p className="mb-1 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-teal-300">Radio — exactly one</p>
                <pre className="overflow-x-auto rounded-xl bg-white/5 p-3">{`{["window","aisle","middle"].map(s => (\n  <label key={s}>\n    <input type="radio" name="seat"\n      checked={seat === s} />\n    {s}\n  </label>\n))}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* scenarios */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">See them at work — three real products</h2>
          <p className="mt-1 text-sm text-text-muted">
            Each scenario isolates one control in the context where it belongs, configured the way that product needs it.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              {
                href: "/scenarios/notification-settings",
                tag: "Switch · immediate",
                t: "Notification settings",
                d: "A settings screen where every flip applies instantly — with a live activity log proving no Save was pressed.",
              },
              {
                href: "/scenarios/checkout-delivery",
                tag: "Radio · exactly one",
                t: "Checkout delivery",
                d: "Two same-name radio groups (speed + payment) where picking one clears the rest and the total follows.",
              },
              {
                href: "/scenarios/signup-preferences",
                tag: "Checkbox · staged",
                t: "Newsletter preferences",
                d: "Six independent topics with select-all, an indeterminate state, and a Save button that stages the draft.",
              },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-700/50 hover:shadow-md"
              >
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-teal-700">{s.tag}</p>
                <p className="mt-2 text-[15px] font-semibold group-hover:text-teal-800">{s.t} →</p>
                <p className="mt-1 text-[13px] leading-relaxed text-text-muted">{s.d}</p>
              </Link>
            ))}
          </div>
        </section>

        <ScenarioNav
          next={{ href: "/scenarios/notification-settings", label: "Scenario 1: Settings" }}
        />
      </main>
    </div>
  );
}
