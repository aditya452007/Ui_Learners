"use client";

import Link from "next/link";
import { useState } from "react";
import Combobox, { type ComboOption } from "./components/combobox";

const PARTS = [
  {
    n: 1,
    name: "Combobox input",
    token: 'role="combobox"',
    see: "The searchable field you type into. It looks like a text box with a magnifier and a chevron — click it, type a few letters, and the matches narrow underneath. Your cursor never leaves this box.",
    how: "A controlled <input> — controlled means its text comes from state, a value the component remembers between keystrokes. Every onChange (the event that fires per keystroke) updates inputValue state and React re-renders — draws the screen again — with a filtered list. It keeps DOM focus the whole time: focus is where the keyboard types. Like talking into a microphone that never leaves your hand.",
    fragment: 'the role="combobox" text input controlling the suggestions popup and retaining DOM focus',
  },
  {
    n: 2,
    name: "Listbox popup",
    token: 'role="listbox"',
    see: "The matching results anchored directly beneath the field. It opens as you type, closes on Escape or selection, and always lines up with the input edge — that anchoring is what makes it feel attached.",
    how: "A <ul role=\"listbox\"> rendered only while open state is true. The input points at it with aria-controls (the id of the popup), and aria-expanded flips true/false in sync so screen readers announce open vs closed. Think of a drawer under a till: the till (input) says “my drawer is open” and gives its exact drawer number.",
    fragment: 'the role="listbox" suggestions popup anchored directly beneath the combobox input',
  },
  {
    n: 3,
    name: "Active option",
    token: "aria-activedescendant",
    see: "The result highlighted as you press ArrowDown / ArrowUp — the indigo row. Enter will commit exactly this row. Hovering with the mouse moves it too; there is always at most one.",
    how: "activeId state holds the highlighted option's id (a string), starting at the first match. Arrow keys move it; the input advertises it via aria-activedescendant — literally “the active child” — set to that row's id, while DOM focus stays in the input. The row is scrolled into view with scrollIntoView({block:'nearest'}). Like a spotlight moving across a cast while the announcer never leaves the podium.",
    fragment: 'the aria-activedescendant active option, visibly highlighted while DOM focus remains in the combobox input',
  },
  {
    n: 4,
    name: "Selected-option checkmark",
    token: 'aria-selected="true"',
    see: "The checkmark next to the choice you already picked. Active is “what Enter would pick”; selected is “what you did pick”. Reopen the list and your last choice still carries its tick.",
    how: "value state holds the committed option (or null). The matching <li role=\"option\"> gets aria-selected=\"true\" and renders the tick icon. Active and selected are two separate states on purpose — one is a preview, one is a decision. Props are the settings you hand the component (options, value, onSelect); the checkmark is just rendering value back out.",
    fragment: 'the checkmark beside a role="option" with aria-selected="true" in the combobox listbox',
  },
] as const;

const HUB_OPTIONS: ComboOption[] = [
  { id: "apple", label: "Apple", sub: "Crisp · keeps 2 weeks", badge: "A–C" },
  { id: "banana", label: "Banana", sub: "Soft · best fresh", badge: "A–C" },
  { id: "blueberry", label: "Blueberry", sub: "Small · freezes well", badge: "A–C" },
  { id: "cherry", label: "Cherry", sub: "Sweet · short season", badge: "A–C" },
  { id: "grape", label: "Grape", sub: "Seedless · lunchbox", badge: "D–M" },
  { id: "mango", label: "Mango", sub: "Tropical · very juicy", badge: "D–M" },
  { id: "orange", label: "Orange", sub: "Citrus · vitamin C", badge: "N–Z" },
  { id: "strawberry", label: "Strawberry", sub: "Berry · short shelf life", badge: "N–Z" },
];

export default function Page() {
  const [hubValue, setHubValue] = useState<ComboOption | null>(
    HUB_OPTIONS.find((o) => o.id === "mango") ?? null
  );
  const [activePill, setActivePill] = useState<number | null>(null);
  const [hubOpen, setHubOpen] = useState(true);
  const [hubActive, setHubActive] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* top bar */}
      <div className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-7 place-items-center rounded-lg bg-foreground text-white">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx={7} cy={7} r={4} />
                <path d="M10 10 13 13" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight">NameThatUi</span>
            <span className="hidden text-sm text-text-faint sm:inline">· Learning Lab</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/scenarios/flight-search"
              className="hidden rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium transition hover:border-accent hover:text-accent sm:inline-flex"
            >
              Scenarios
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-white">
              Combobox · live
            </span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        {/* header */}
        <header className="pb-10 pt-10 sm:pt-14">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Web · Forms &amp; Search
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Combobox <span className="text-text-faint">(Autocomplete / Typeahead)</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-muted">
            An editable text field with a popup list of matching values. Typing narrows the
            choices, arrow keys move the highlight, Enter commits it — and unlike a plain
            select, it can search a long list or accept free-form input.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            Also called:{" "}
            <span className="font-medium text-foreground">
              autocomplete · typeahead · search select · editable dropdown
            </span>
            <span className="text-text-faint"> · “the input that suggests as you type”, “predictive dropdown”</span>
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['role="combobox"', 'role="listbox"', "aria-expanded", "aria-controls", "aria-activedescendant", "<datalist>"].map(
              (t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-foreground"
                >
                  {t}
                </span>
              )
            )}
          </div>
        </header>

        {/* intro strip */}
        <section className="mb-10 grid gap-3 sm:grid-cols-3">
          {[
            { k: "01 · Type", t: "Filter the list", d: "Every keystroke narrows the popup to matching values. No scrolling through 200 airports — type “san” and only San… remains." },
            { k: "02 · Navigate", t: "Arrow keys move", d: "ArrowDown / ArrowUp move one highlight. Focus never leaves the input — the highlight is announced, not focused." },
            { k: "03 · Commit", t: "Enter picks it", d: "Enter writes the highlighted row back into the field and closes the popup. Escape cancels and keeps your text." },
          ].map((c) => (
            <div key={c.k} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">{c.k}</p>
              <h3 className="mt-2 text-sm font-semibold">{c.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{c.d}</p>
            </div>
          ))}
        </section>

        {/* anatomy */}
        <section className="mb-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted">
              Anatomy · every part, named
            </h2>
            <p className="text-sm text-text-muted">
              Click the field · type · <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs">↑</kbd>
              <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs">↓</kbd> to move ·{" "}
              <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs">↵</kbd> to pick ·{" "}
              <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs">esc</kbd> to close
            </p>
          </div>

          <div className="relative mt-4 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(#e7e5e4_1px,transparent_1px)] [background-size:14px_14px] opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-alt/60" />
            </div>

            <div className="relative px-4 py-10 sm:px-10 sm:py-12">
              <div className="mx-auto max-w-xl">
                <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_16px_48px_rgba(0,0,0,0.10)]">
                  <div className="border-b border-border bg-surface-alt/60 px-5 py-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                      Snack box builder · step 1 of 3
                    </p>
                    <p className="mt-0.5 text-sm font-semibold">Pick your fruit</p>
                  </div>
                  <div className="min-h-[340px] p-5">
                    <Combobox
                      label="Favorite fruit"
                      placeholder="Type a fruit — try “berry”…"
                      options={HUB_OPTIONS}
                      value={hubValue}
                      onSelect={setHubValue}
                      highlight={activePill}
                      defaultOpen
                      onOpenChange={setHubOpen}
                      onActiveChange={setHubActive}
                      hint="Strict mode: you must pick from the list. Custom text won't commit here."
                    />
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] ${
                          hubOpen ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        <span className={`size-1.5 rounded-full ${hubOpen ? "bg-emerald-500" : "bg-stone-400"}`} />
                        aria-expanded=“{hubOpen ? "true" : "false"}”
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 font-mono text-[11px] text-stone-600">
                        aria-activedescendant=“{hubActive ?? "none"}”
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 font-mono text-[11px] text-stone-600">
                        selected=“{hubValue?.id ?? "none"}”
                      </span>
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-text-muted">
                      {hubValue ? (
                        <>Committed value: <span className="font-semibold text-foreground">{hubValue.label}</span> — reopen the list and it still carries the checkmark (part 4).</>
                      ) : (
                        <>No value committed yet — pick a row with Enter or a click.</>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-border bg-surface-alt/50 px-5 py-2.5">
                    <span className="font-mono text-[11px] text-text-faint">focus stays in the input · never moves to rows</span>
                    <button
                      type="button"
                      onClick={() => setHubValue(null)}
                      className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium transition hover:border-accent hover:text-accent"
                    >
                      Clear selection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* pills desktop */}
          <div className="mt-4 hidden gap-2 lg:flex lg:flex-wrap">
            {PARTS.map((p) => (
              <button
                key={p.n}
                onMouseEnter={() => setActivePill(p.n)}
                onMouseLeave={() => setActivePill(null)}
                onClick={() => setActivePill(activePill === p.n ? null : p.n)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-left shadow-sm transition ${
                  activePill === p.n ? "border-accent bg-accent text-white" : "border-border bg-surface hover:border-accent/40"
                }`}
              >
                <span className={`grid size-5 place-items-center rounded-full text-xs font-bold ${activePill === p.n ? "bg-white text-accent" : "bg-accent text-white"}`}>
                  {p.n}
                </span>
                <span className={`text-xs font-semibold ${activePill === p.n ? "text-white" : "text-foreground"}`}>{p.name}</span>
                <code className={`hidden font-mono text-xs xl:inline ${activePill === p.n ? "text-white/80" : "text-text-faint"}`}>{p.token}</code>
              </button>
            ))}
          </div>
          {/* pills mobile */}
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:hidden">
            {PARTS.map((p) => (
              <button
                key={p.n}
                onClick={() => setActivePill(activePill === p.n ? null : p.n)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  activePill === p.n ? "border-accent bg-accent-light" : "border-border bg-surface"
                }`}
              >
                <span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${activePill === p.n ? "bg-accent text-white" : "bg-foreground text-white"}`}>
                  {p.n}
                </span>
                <span className="text-sm font-semibold">{p.name}</span>
                <span className="ml-auto hidden font-mono text-xs text-text-muted sm:inline">{p.token}</span>
              </button>
            ))}
          </div>
        </section>

        {/* layered explanations */}
        <section className="mb-12">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-text-muted">
            Every part, in plain language
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {PARTS.map((p) => (
              <div
                key={p.n}
                onMouseEnter={() => setActivePill(p.n)}
                onMouseLeave={() => setActivePill(null)}
                className={`group rounded-2xl border p-6 transition ${
                  activePill === p.n ? "border-accent bg-accent-light shadow-sm" : "border-border bg-surface hover:border-border-strong"
                }`}
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className={`grid size-7 place-items-center rounded-full text-xs font-bold ${activePill === p.n ? "bg-accent text-white" : "bg-foreground text-white"}`}>
                    {p.n}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold leading-none">{p.name}</h3>
                    <p className="mt-1 font-mono text-xs text-accent">{p.token}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-wide text-text-muted">What you see</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground">{p.see}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${activePill === p.n ? "bg-white" : "bg-surface-alt group-hover:bg-white"}`}>
                    <p className="font-mono text-xs font-semibold uppercase tracking-wide text-text-muted">How it works</p>
                    <p className="mt-1 text-sm leading-relaxed text-text-muted">{p.how}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* in code */}
        <section className="mb-12">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-text-muted">In code</h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="p-6">
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">ARIA wiring</p>
                <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-[13px] leading-relaxed">
                  input role=“combobox” aria-expanded aria-controls → ul role=“listbox” → li role=“option”
                </code>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  aria-expanded and aria-controls stay in sync: expanded “true” exactly while the popup is rendered. Each row gets a stable id; the highlighted row&apos;s id is mirrored into aria-activedescendant.
                </p>
              </div>
              <div className="p-6">
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">Keyboard</p>
                <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-[13px]">↓ ↑ move · ↵ commit · esc dismiss</code>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  DOM focus never leaves the input — arrows only change activeId. Enter reads the active row and commits it; Escape closes without committing. Nothing autofocuses on mount.
                </p>
              </div>
              <div className="p-6">
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">Native shortcut</p>
                <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-[13px]">&lt;datalist&gt; — limited built-in</code>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  Pair an &lt;input list=“x”&gt; with a &lt;datalist id=“x”&gt; for free suggestions with zero JavaScript — but you get no active-highlight styling, no checkmarks, no disabled rows, no rich rows. This page hand-builds the full pattern instead.
                </p>
              </div>
              <div className="p-6">
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">State shape</p>
                <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-[13px]">inputValue · open · activeId · value</code>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  Four states, four jobs: what you typed, whether the popup shows, which row is highlighted, what you committed. Filtering derives from inputValue; the checkmark derives from value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* confusions */}
        <section className="mb-12">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
            <h3 className="text-sm font-bold">Combobox vs. its cousins — don&apos;t mix them</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-sm font-semibold">Combobox ≠ select</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
                  A select only picks from a closed list. A combobox adds an editable field: you can <em className="font-medium not-italic text-foreground">search</em> a huge list by typing, and some variants accept values not in the list at all.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-sm font-semibold">Combobox ≠ command palette</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
                  A palette launches heterogeneous actions from anywhere (⌘K). A combobox chooses <em className="font-medium not-italic text-foreground">one value for one field</em> and writes it back into that field.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-sm font-semibold">Combobox ≠ datalist</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
                  Datalist is the browser&apos;s 80% shortcut. Reach for a real combobox when you need keyboard highlight, selected checkmarks, disabled rows, avatars, or custom “Add …” rows.
                </p>
              </div>
            </div>
            <p className="mt-4 font-mono text-xs text-amber-800">Rule of thumb: select = pick one of few · combobox = find one of many · palette = do something anywhere.</p>
          </div>
        </section>

        {/* scenarios */}
        <section>
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-text-muted">
            See it in the wild — three scenarios
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { href: "/scenarios/flight-search", title: "Flight search", desc: "Booking flow: 24 airports, strict selection, empty state, clear button. The classic searchable dropdown.", accent: "Strict · must pick from list" },
              { href: "/scenarios/recipe-builder", title: "Recipe builder", desc: "Pantry app: free-form allowed — type anything and press Enter to add it as a custom ingredient chip.", accent: "Free-form · custom values" },
              { href: "/scenarios/team-assign", title: "Task assignee", desc: "Project tool: compact field with avatars, disabled offline members, rich rows with roles.", accent: "Rich rows · disabled options" },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-accent hover:shadow-md"
              >
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">{s.accent}</p>
                <h3 className="mt-2 text-sm font-semibold group-hover:text-accent">{s.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-muted">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Explore <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <p className="mt-10 text-center font-mono text-xs text-text-faint">
          Built with Next.js 16 · Tailwind v4 · no extra deps · focus stays in the input · no autofocus on mount
        </p>
      </main>
    </div>
  );
}
