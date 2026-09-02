"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  HamburgerButton,
  NavDrawerShell,
  DrawerHeader,
} from "@/components/hamburger";

const PARTS = [
  {
    n: 1,
    name: "Hamburger button",
    token: 'aria-expanded · aria-controls',
    see: "Three stacked 2px lines — always at the bar's left edge. You tap it to open the whole navigation. When the drawer is open the lines rotate into an X, a tiny promise that tapping again closes it.",
    how: "A plain <button> with aria-expanded=\"true/false\" that matches the drawer's open state, plus aria-controls pointing at the drawer's id. When you click it, React flips a boolean in state (the component's memory). That boolean drives both the icon animation and whether the drawer renders. Think of state like a light switch — on means lines→X and drawer visible; off means three lines and drawer hidden.",
  },
  {
    n: 2,
    name: "Navigation drawer",
    token: 'Sheet side="left" · <nav>',
    see: "The side panel that slides in from the left and covers the page. It holds the real navigation — links grouped with headings, not just a dropdown. You can scroll inside it while the page behind stays frozen.",
    how: "An off-canvas <nav> panel docked to the left with transform: translateX(-100%) when closed and 0 when open, above the page content. shadcn/ui calls this <Sheet side=\"left\">, Material calls it NavigationDrawer. In React you conditionally render a div with role=\"dialog\"/aria-modal inside, trap Tab between its first and last focusable elements, and animate it with a springy cubic-bezier so it feels like a sheet of paper sliding over the page.",
  },
  {
    n: 3,
    name: "Scrim (backdrop)",
    token: "scrim · backdrop",
    see: "The dim veil over the page behind the drawer. It tells your eyes the page is paused and gives you a big, friendly target: tap anywhere on the shaded area and the drawer closes.",
    how: "A fixed-position sibling that covers the viewport with a translucent background (e.g. bg-stone-900/40). Clicking it calls the same close function as the X button. It fades in with opacity animation and, because it sits between page and drawer, it catches clicks so they don't leak to content underneath. Pressing Escape does the same thing via a keydown listener.",
  },
  {
    n: 4,
    name: "Scroll lock + focus return",
    token: "body scroll lock · focus trap",
    see: "While the drawer is open the page behind stops scrolling — you don't lose your place. When you close it, keyboard focus jumps back to the hamburger button so you can keep tabbing without getting lost.",
    how: "On open, an effect saves document.activeElement and sets document.body.style.overflow='hidden' (locking body scroll); on close it restores overflow and calls buttonRef.current.focus(). A keydown handler listens for Escape to close, and Tab is trapped between the drawer's first and last focusable nodes so keyboard users can't accidentally tab into the dimmed page. It's the polite-contract: what you opened, you return to.",
  },
] as const;

const INTRO_CARDS = [
  {
    step: "Hamburger button",
    desc: "Three 2px lines in a button at the bar's left edge — the trigger. aria-expanded tells assistive tech whether the drawer is open.",
  },
  {
    step: "Navigation drawer",
    desc: "An off-canvas <nav> panel (Sheet side=\"left\") that slides from the left above the page and locks body scroll.",
  },
  {
    step: "Scrim + close",
    desc: "A translucent backdrop. Tap it or press Escape to close; focus returns to the hamburger button.",
  },
] as const;

const DRAWER_LINKS = [
  {
    label: "Overview",
    icon: "◈",
    items: [
      { name: "Discover", badge: null },
      { name: "Following", badge: "12" },
      { name: "Bookmarks", badge: null },
    ],
  },
  {
    label: "Library",
    icon: "⬢",
    items: [
      { name: "Projects", badge: "8" },
      { name: "Archive", badge: null },
      { name: "Shared with me", badge: "3" },
    ],
  },
  {
    label: "Account",
    icon: "⬣",
    items: [
      { name: "Settings", badge: null },
      { name: "Help & feedback", badge: null },
    ],
  },
];

export default function Home() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const drawerId = "anatomy-nav-drawer";
  const [announce, setAnnounce] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function toggle() {
    setOpen((v) => !v);
  }
  function close() {
    setOpen(false);
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
      {/* Header */}
      <header className="mb-14">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Namethatui — Anatomy · Web
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Hamburger Menu (Nav Drawer)
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-text-muted">
          The three stacked lines that open a side panel. The button is the
          trigger; the{" "}
          <span className="font-medium text-foreground">navigation drawer</span>{" "}
          is the off-canvas{" "}
          <code className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-sm">
            {"<nav>"}
          </code>{" "}
          that slides over the page above a scrim — body scroll locked, Escape
          and scrim-tap to close.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">
          Also called:{" "}
          <span className="text-foreground">
            navigation drawer · hamburger button · side menu · off-canvas menu
            · Sheet side=&quot;left&quot; · NavigationDrawer
          </span>
        </p>
      </header>

      {/* Intro strip */}
      <section className="mb-16">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-text-muted">
          What am I looking at?
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {INTRO_CARDS.map((c, i) => (
            <div
              key={c.step}
              className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-light font-mono text-xs font-bold text-accent">
                {i + 1}
              </span>
              <div>
                <h3 className="mb-1 text-sm font-semibold">{c.step}</h3>
                <p className="text-sm leading-relaxed text-text-muted">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Anatomy */}
      <section className="mb-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted">
              Anatomy — every part, named
            </h2>
            <p className="text-sm text-text-muted">
              Toggle the hamburger. The numbered labels chase the live parts —
              watch the lines become an X, the drawer slide, and the scrim fade.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span
              className={`rounded-full px-2.5 py-1 font-medium ${
                open
                  ? "bg-accent text-white"
                  : "border border-border bg-surface text-text-muted"
              }`}
            >
              aria-expanded=&quot;{String(open)}&quot;
            </span>
            <span
              className={`rounded-full px-2.5 py-1 ${
                open
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : "border border-border bg-surface text-text-faint"
              }`}
            >
              body scroll: {open ? "locked" : "free"}
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-muted px-5 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-strong active:scale-[0.98]"
              >
                {open ? "Close drawer" : "Open drawer"}
              </button>
              <span className="hidden font-mono text-xs text-text-faint sm:inline">
                or tap the hamburger at the bar&apos;s left edge · Esc to close
              </span>
            </div>
            <span className="font-mono text-xs text-text-faint">
              {"<button aria-expanded aria-controls=\"nav-drawer\"> · <nav> Sheet side=\"left\""}
            </span>
          </div>

          {/* Stage */}
          <div
            className="relative overflow-hidden bg-[#fbfaf8]"
            style={{ height: 560 }}
          >
            {/* Dotted bg */}
            <div
              className="absolute inset-0 opacity-[0.55]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #e7e5e4 1.1px, transparent 1.1px)",
                backgroundSize: "18px 18px",
              }}
            />

            {/* Mock browser frame */}
            <div className="absolute inset-4 overflow-hidden rounded-xl border border-border bg-surface shadow-[0_8px_30px_rgba(28,25,23,0.08)] sm:inset-6 flex flex-col">
              {/* Top bar — the habitat of the hamburger */}
              <div className="relative flex h-[52px] shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-3 sm:px-4">
                {/* Left: hamburger + wordmark */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <HamburgerButton
                      open={open}
                      onToggle={toggle}
                      controlsId={drawerId}
                      buttonRef={btnRef}
                    />
                    {/* 1 label */}
                    <div
                      aria-hidden="true"
                      className="absolute -top-1 left-12 z-10 hidden sm:flex items-center gap-1.5"
                    >
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-foreground font-mono text-[10px] text-background">
                        1
                      </span>
                      <span className="callout-pill border border-border bg-surface text-text-muted shadow-sm">
                        Hamburger button · aria-expanded
                      </span>
                    </div>
                    {/* Mobile label fallback */}
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 translate-y-full sm:hidden flex items-center gap-1"
                    >
                      <span className="grid h-4 w-4 place-items-center rounded-full bg-foreground font-mono text-[9px] text-background">
                        1
                      </span>
                      <span className="callout-pill border border-border bg-surface text-[10px] text-text-muted">
                        button
                      </span>
                    </div>
                  </div>

                  <div className="hidden items-center gap-2 sm:flex">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-foreground text-[11px] font-bold text-background">
                      ◆
                    </span>
                    <span className="text-sm font-semibold tracking-tight">
                      Orien
                    </span>
                    <span className="hidden rounded-full bg-surface-alt px-2 py-0.5 font-mono text-[10px] text-text-faint lg:inline">
                      orien.co
                    </span>
                  </div>
                </div>

                {/* Center — search (desktop) */}
                <div className="hidden flex-1 justify-center lg:flex">
                  <div className="flex w-[280px] items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1.5 text-xs text-text-faint">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      className="h-3.5 w-3.5"
                    >
                      <circle
                        cx="7"
                        cy="7"
                        r="4.5"
                        stroke="currentColor"
                        strokeWidth="1.3"
                      />
                      <path
                        d="M10.5 10.5L13 13"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                    Search docs, projects…
                    <span className="ml-auto rounded bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text-faint">
                      ⌘K
                    </span>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                  <span className="hidden h-7 items-center rounded-full border border-border bg-surface px-3 text-xs font-medium text-text-muted sm:inline-flex">
                    Sign in
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-stone-200 text-xs font-semibold text-stone-600">
                    A
                  </span>
                </div>
              </div>

              {/* Page content — scrollable mock */}
              <div className="relative flex-1 overflow-auto bg-surface-muted p-4 sm:p-6">
                <div className="mx-auto max-w-[560px] space-y-4">
                  {/* Hero */}
                  <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
                      Featured · Editorial
                    </p>
                    <h3 className="mt-1.5 text-lg font-semibold leading-tight">
                      Designing navigation that doesn&apos;t fight the page
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      The drawer keeps primary navigation off-canvas until you
                      ask for it — content gets the full stage, wayfinding stays
                      one tap away.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <span className="rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background">
                        Read story
                      </span>
                      <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-muted">
                        Save for later
                      </span>
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        k: "Projects",
                        v: "128",
                        d: "Active workspaces",
                      },
                      {
                        k: "Reading",
                        v: "34",
                        d: "Saved articles",
                      },
                      {
                        k: "Teams",
                        v: "6",
                        d: "Collaborators",
                      },
                      {
                        k: "Updates",
                        v: "12",
                        d: "This week",
                      },
                    ].map((c) => (
                      <div
                        key={c.k}
                        className="rounded-xl border border-border bg-surface p-4 shadow-sm"
                      >
                        <p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">
                          {c.k}
                        </p>
                        <p className="mt-1 text-xl font-bold">{c.v}</p>
                        <p className="text-xs text-text-muted">{c.d}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Recent activity</p>
                      <span className="font-mono text-xs text-text-faint">
                        View all
                      </span>
                    </div>
                    <div className="mt-3 space-y-2.5">
                      {[
                        ["Maya Chen edited", "Pricing — Q4", "3m ago"],
                        ["You created", "Brand refresh brief", "1h ago"],
                        ["Alex added", "Research notes", "yesterday"],
                      ].map(([a, b, t]) => (
                        <div
                          key={b}
                          className="flex items-center gap-3 rounded-lg bg-surface-muted px-3 py-2.5"
                        >
                          <span className="h-8 w-8 rounded-full bg-white ring-1 ring-border" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs">
                              <span className="font-medium">{a}</span>{" "}
                              <span className="text-text-muted">{b}</span>
                            </p>
                            <p className="font-mono text-[10px] text-text-faint">
                              {t}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fake long content to imply scroll */}
                  <div className="h-24 rounded-xl border border-dashed border-border bg-surface/60 p-4">
                    <div className="h-2 w-1/3 rounded bg-border" />
                    <div className="mt-2 h-2 w-full rounded bg-border/60" />
                    <div className="mt-1.5 h-2 w-5/6 rounded bg-border/60" />
                    <p className="mt-3 font-mono text-[10px] text-text-faint">
                      {open
                        ? "↕ Body scroll is locked while the drawer is open — try scrolling the page behind the scrim."
                        : "This page would normally scroll — open the drawer to see scroll lock in action."}
                    </p>
                  </div>
                </div>

                {/* Live-region announce for demo selection */}
                {announce && (
                  <p className="sr-only" role="status" aria-live="polite">
                    {announce}
                  </p>
                )}
              </div>

              {/* Scrim + Drawer overlay — positioned absolute inside frame */}
              {mounted && open && (
                <NavDrawerShell
                  open={open}
                  onClose={close}
                  controlsId={drawerId}
                  buttonRef={btnRef}
                  widthClass="w-[300px]"
                  label="Primary navigation"
                >
                  <DrawerHeader
                    title="Menu"
                    subtitle="orien.co — navigation drawer"
                    onClose={close}
                  />

                  {/* Drawer scroll area */}
                  <div className="flex-1 overflow-auto">
                    <nav
                      aria-label="Primary"
                      className="space-y-6 px-3 py-4"
                    >
                      {DRAWER_LINKS.map((group) => (
                        <div key={group.label}>
                          <p className="mb-2 flex items-center gap-2 px-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">
                            <span className="grid h-5 w-5 place-items-center rounded-md bg-surface-alt text-[10px]">
                              {group.icon}
                            </span>
                            {group.label}
                          </p>
                          <ul className="space-y-1">
                            {group.items.map((it) => (
                              <li key={it.name}>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setAnnounce(`Navigated to ${it.name}`);
                                    close();
                                    window.setTimeout(
                                      () => setAnnounce(""),
                                      1200
                                    );
                                  }}
                                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                                >
                                  <span>{it.name}</span>
                                  {it.badge && (
                                    <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                                      {it.badge}
                                    </span>
                                  )}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </nav>

                    <div className="mx-3 rounded-xl border border-border bg-surface-muted p-4">
                      <p className="text-xs font-semibold">
                        New in Orien 2.4
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-text-muted">
                        Nested drawers and command search — try ⌘K from the
                        drawer.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setAnnounce("Release notes opened");
                          close();
                        }}
                        className="mt-3 w-full rounded-full bg-foreground px-3 py-2 text-xs font-semibold text-background hover:bg-stone-800"
                      >
                        View notes
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-border bg-surface-muted px-3 py-3">
                    <div className="flex items-center gap-3 rounded-lg bg-surface px-3 py-2.5 ring-1 ring-border">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-bold text-white">
                        A
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold">
                          Alex Rivera
                        </p>
                        <p className="truncate font-mono text-[10px] text-text-muted">
                          alex@orien.co
                        </p>
                      </div>
                      <span className="ml-auto font-mono text-[10px] text-text-faint">
                        Pro
                      </span>
                    </div>
                    <p className="mt-2 text-center font-mono text-[10px] text-text-faint">
                      Tap scrim or press Esc to close · focus returns to ☰
                    </p>
                  </div>
                </NavDrawerShell>
              )}

              {/* 2 label — drawer edge (only when open) */}
              {open && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[300px] top-[68px] z-40 hidden -translate-x-full items-center gap-1.5 sm:flex"
                  style={{ marginLeft: "-8px" }}
                >
                  <span className="callout-pill border border-border bg-surface text-text-muted shadow-sm">
                    2 · Navigation drawer · Sheet side=&quot;left&quot;
                  </span>
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-foreground font-mono text-[10px] text-background shadow-sm">
                    2
                  </span>
                </div>
              )}
              {/* Leader line for 2 */}
              {open && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[300px] top-[78px] z-30 hidden h-px w-6 bg-foreground/30 sm:block"
                />
              )}

              {/* Scrim annotation when open */}
              {open && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-10 top-20 z-20 hidden items-center gap-1.5 sm:flex"
                >
                  <span className="h-px w-6 bg-white/70" />
                  <span className="callout-pill border border-white/30 bg-stone-900/80 text-white backdrop-blur">
                    3 · Scrim — tap to close
                  </span>
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-white font-mono text-[10px] text-stone-900">
                    3
                  </span>
                </div>
              )}

              {/* Scroll lock pill */}
              {open && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 shadow-sm sm:flex"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-amber-500 font-mono text-[10px] text-white">
                    4
                  </span>
                  <span className="font-mono text-xs font-medium text-amber-900">
                    body scroll locked · Esc closes · focus returns to ☰
                  </span>
                </div>
              )}
            </div>

            {/* Outside stage: floating hint for closed state */}
            {!open && (
              <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs text-text-muted shadow-sm sm:flex">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                Tap the hamburger — watch the three lines morph and the drawer
                glide in
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-muted px-5 py-3 font-mono text-xs text-text-faint">
            <span>
              Try keyboard: Tab to ☰, Enter to open, Tab inside drawer, Esc to
              close — focus snaps back.
            </span>
            <span className="hidden sm:inline">
              aria-controls=&quot;{drawerId}&quot; stays in sync with
              aria-expanded
            </span>
          </div>
        </div>
      </section>

      {/* Layered explanations */}
      <section className="mb-16">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted">
          The four parts, in plain words
        </h2>
        <p className="mb-8 text-sm text-text-muted">
          Each numbered part, explained twice: for the person using the product,
          and for the person building it.
        </p>
        <div className="overflow-hidden rounded-2xl border border-border bg-border">
          {PARTS.map((part, i) => (
            <div
              key={part.n}
              className={`grid md:grid-cols-2 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <div className="bg-surface p-5 sm:p-6">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent">
                  What you see
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-foreground font-mono text-[10px] text-background">
                    {part.n}
                  </span>
                  {part.name}
                  <code className="font-mono text-[10px] font-normal text-text-faint">
                    {part.token}
                  </code>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {part.see}
                </p>
              </div>
              <div className="border-t border-border bg-surface p-5 md:border-t-0 md:border-l sm:p-6">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent">
                  How it works
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {part.how}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* In code */}
      <section className="mb-16">
        <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-text-muted">
          In code
        </h2>
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="grid sm:grid-cols-2 sm:divide-x sm:divide-border">
            <div className="border-b border-border p-6 sm:border-b-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                ARIA
              </p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">
                aria-expanded + aria-controls
              </code>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                Button&apos;s contract — screen readers announce
                “expanded/collapsed”.
              </p>
            </div>
            <div className="border-b border-border p-6 sm:border-b-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                HTML
              </p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">
                {"<nav>  ·  <button aria-expanded>"}
              </code>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                Drawer content is navigation, not a generic div.
              </p>
            </div>
            <div className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                shadcn/ui
              </p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">
                {'<Sheet side="left">'}
              </code>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                The usual React building block for the panel.
              </p>
            </div>
            <div className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Material
              </p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">
                NavigationDrawer
              </code>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                Android/Material&apos;s name for the same off-canvas pattern.
              </p>
            </div>
          </div>
          <div className="border-t border-border bg-surface-muted px-6 py-4">
            <p className="font-mono text-xs leading-relaxed text-text-muted">
              Paste-ready:{" "}
              <span className="font-medium text-foreground">
                Build a hamburger menu:
              </span>{" "}
              a{" "}
              <code className="rounded bg-surface px-1 py-0.5">
                {'<button aria-expanded aria-controls>'}
              </code>{" "}
              drawing three stacked lines that toggles a navigation drawer — an
              off-canvas{" "}
              <code className="rounded bg-surface px-1 py-0.5">{"<nav>"}</code>{" "}
              panel sliding from the left over a scrim. Lock body scroll while
              open, close on Escape and scrim tap, keep aria-expanded in sync,
              return focus to the button on close.
            </p>
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section>
        <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-text-muted">
          See it in the wild — three scenarios
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              href: "/scenarios/storefront",
              title: "Storefront · mobile shop",
              desc: "Phone-sized shop drawer with nested categories, search, cart badges and a sticky checkout — the classic commerce hamburger.",
            },
            {
              href: "/scenarios/dashboard",
              title: "Dashboard · adaptive shell",
              desc: "Responsive admin: overlay drawer on mobile, collapsible persistent sidebar on desktop — same nav, two postures.",
            },
            {
              href: "/scenarios/reader",
              title: "Reader · content-rich",
              desc: "Magazine drawer with profile card, featured reads and theme controls — navigation as an identity surface.",
            },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group block rounded-xl border border-border bg-surface p-6 transition-all hover:border-accent hover:shadow-md"
            >
              <h3 className="mb-2 text-sm font-semibold transition-colors group-hover:text-accent">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-muted">
                {s.desc}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-accent">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-border pt-6 text-center font-mono text-xs text-text-faint">
        Built as a learning lab — one component, three contexts, every interaction hand-coded without component libraries.
      </footer>
    </main>
  );
}
