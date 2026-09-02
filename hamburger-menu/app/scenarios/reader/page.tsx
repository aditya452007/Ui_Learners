"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  HamburgerButton,
  NavDrawerShell,
  DrawerHeader,
} from "@/components/hamburger";

const SECTIONS = [
  {
    label: "Today",
    items: [
      { title: "The quiet cost of always-on navigation", meta: "Essay · 8 min", active: true },
      { title: "How drawer depth changes reading", meta: "Research · 5 min" },
      { title: "Sable & Thorn — a shop without a nav bar", meta: "Case study" },
    ],
  },
  {
    label: "Library",
    items: [
      { title: "All issues", meta: "84 editions" },
      { title: "Bookmarks", meta: "12 saved" },
      { title: "Highlights", meta: "47 notes" },
    ],
  },
  {
    label: "Follow",
    items: [
      { title: "Writers you follow", meta: "23" },
      { title: "Topics", meta: "Design · Culture · Tech" },
    ],
  },
];

const FEATURED = [
  { tag: "Essay", title: "Designing the space between chrome and content" },
  { tag: "Interview", title: "Maya Chen on editorial systems" },
  { tag: "Note", title: "Why the best nav is often invisible" },
];

export default function ReaderPage() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const drawerId = "reader-drawer";
  const [accent, setAccent] = useState<"teal" | "ink" | "amber">("teal");
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1500);
  }

  const accentMap = {
    teal: { bg: "bg-teal-700", light: "bg-teal-50", ring: "ring-teal-200", text: "text-teal-800" },
    ink: { bg: "bg-stone-900", light: "bg-stone-100", ring: "ring-stone-300", text: "text-stone-800" },
    amber: { bg: "bg-amber-600", light: "bg-amber-50", ring: "ring-amber-200", text: "text-amber-800" },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Scenario nav */}
      <div className="border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-foreground"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full border border-border bg-surface text-xs">
              ←
            </span>
            Anatomy hub
          </Link>
          <div className="hidden items-center gap-1 rounded-full border border-border bg-surface p-1 sm:flex">
            <Link
              href="/scenarios/storefront"
              className="rounded-full px-3 py-1 text-xs font-medium text-text-muted hover:text-foreground"
            >
              Storefront
            </Link>
            <Link
              href="/scenarios/dashboard"
              className="rounded-full px-3 py-1 text-xs font-medium text-text-muted hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/scenarios/reader"
              className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background"
            >
              Reader
            </Link>
          </div>
          <span className="hidden font-mono text-xs text-text-faint sm:inline">
            Scenario 3 · content-rich
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            Matter · Issue 34
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Reader drawer — navigation as an identity surface
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
            For a reading product the drawer isn&apos;t just links — it&apos;s
            the masthead, the library card, and the “continue reading” shelf you
            slide out without losing your line. Bigger type, grouped sections,
            and a profile header make it feel like a magazine&apos;s table of
            contents, not a menu.
          </p>
        </div>

        {/* Demo frame */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          {/* Top bar */}
          <div className="flex h-[58px] items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <HamburgerButton
                open={open}
                onToggle={() => setOpen((v) => !v)}
                controlsId={drawerId}
                buttonRef={btnRef}
              />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold tracking-tight">MATTER</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">
                  A journal about interfaces
                </p>
              </div>
              <span className="hidden rounded-full bg-surface-alt px-2.5 py-1 font-mono text-xs text-text-faint sm:inline">
                Issue 34 · Mar 2026
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => showToast("Subscribe — demo")}
                className={`hidden rounded-full px-4 py-2 text-xs font-semibold text-white sm:inline-flex ${accentMap[accent].bg}`}
              >
                Subscribe
              </button>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-stone-200 text-xs font-semibold text-stone-600">
                M
              </span>
            </div>
          </div>

          <div className="relative flex">
            {/* Article */}
            <article className="min-w-0 flex-1 bg-surface px-6 py-8 sm:px-8">
              <div className="mx-auto max-w-[640px]">
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
                  Essay · 8 min
                </p>
                <h2 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                  The quiet cost of always-on navigation
                </h2>
                <div className="mt-4 flex flex-wrap items-center gap-3 border-y border-border py-3 text-xs text-text-muted">
                  <span className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-stone-200" />
                    Maya Chen · 22 Mar 2026
                  </span>
                  <span className="hidden h-3 w-px bg-border sm:block" />
                  <span>1.2k bookmarks</span>
                  <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] sm:inline-flex">
                    <span className={`h-2 w-2 rounded-full ${accentMap[accent].bg} animate-pulse`} />
                    {open ? "drawer open" : "reading focus"}
                  </span>
                </div>

                <div className="prose prose-stone mt-6 max-w-none">
                  <p className="text-[15px] leading-relaxed text-text-muted">
                    Keep navigation visible at all times and you pay with
                    attention. Every page carries the weight of every other
                    page. The hamburger makes a trade: hide the map, lend the
                    pixels to the sentence, and trust that the reader will ask
                    for the map when they need it.
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
                    That trust is only earned if the drawer earns it. It has to
                    open fast, dim the page with a scrim that says “you can go
                    back”, lock the scroll so your line doesn&apos;t jump, and
                    return focus to the trigger when you close it.
                  </p>

                  <div className="mt-6 grid gap-3 rounded-xl border border-border bg-surface-muted p-4 sm:grid-cols-3">
                    {FEATURED.map((f) => (
                      <div
                        key={f.title}
                        className="rounded-lg bg-surface p-3 ring-1 ring-border"
                      >
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
                          {f.tag}
                        </p>
                        <p className="mt-1 text-xs font-semibold leading-snug">
                          {f.title}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-6 text-[15px] leading-relaxed text-text-muted">
                    The best drawers feel editorial — not a list of links but a
                    curated cover sheet. Profile, sections, featured pieces, and
                    a quiet footer of secondary links. That&apos;s what the
                    hamburger enables when you stop treating it as “hidden menu”
                    and start treating it as a second front door.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
                    <button
                      type="button"
                      onClick={() => setOpen(true)}
                      className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background hover:bg-stone-800"
                    >
                      Open table of contents
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("Shared")}
                      className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-muted hover:text-foreground"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Inline peek — desktop article meta rail */}
            <aside className="hidden w-[240px] shrink-0 border-l border-border bg-surface-muted p-4 lg:block">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-faint">
                In this issue
              </p>
              <div className="mt-3 space-y-2">
                {[
                  "The quiet cost…",
                  "How drawer depth changes reading",
                  "Shelf life — print to off-canvas",
                ].map((t, i) => (
                  <div
                    key={t}
                    className={`rounded-lg px-3 py-2 text-xs ${i === 0 ? "bg-surface font-medium shadow-sm ring-1 ring-border" : "text-text-muted"}`}
                  >
                    {t}
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-surface p-4 ring-1 ring-border">
                <p className="text-xs font-semibold">Continue reading</p>
                <p className="mt-1 text-xs leading-relaxed text-text-muted">
                  Pick up where you left off — page 3 of 12.
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                  <div className="h-full w-[26%] bg-foreground" />
                </div>
              </div>
            </aside>

            {/* Overlay drawer */}
            {open && (
              <div className="absolute inset-0 z-10">
                <NavDrawerShell
                  open={open}
                  onClose={() => setOpen(false)}
                  controlsId={drawerId}
                  buttonRef={btnRef}
                  widthClass="w-[360px]"
                  label="Matter table of contents"
                >
                  <DrawerHeader
                    title="Matter"
                    subtitle="Table of contents · Issue 34"
                    onClose={() => setOpen(false)}
                  />

                  <div className="flex-1 overflow-auto">
                    {/* Profile header — identity surface */}
                    <div className="border-b border-border bg-surface-muted p-4">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white ${accentMap[accent].bg}`}>
                          M
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">Maya Chen</p>
                          <p className="font-mono text-xs text-text-muted">
                            Reader · Annual · 12 issues left
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast("Manage plan — demo")}
                          className="ml-auto rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:bg-surface-muted"
                        >
                          Manage
                        </button>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="font-mono text-xs text-text-faint">Theme</span>
                        <div className="ml-auto flex gap-1 rounded-full border border-border bg-surface p-1">
                          {(["teal", "ink", "amber"] as const).map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setAccent(c)}
                              aria-pressed={accent === c}
                              className={`h-6 w-6 rounded-full ring-1 ring-inset transition-all ${accentMap[c].bg} ${accent === c ? "ring-2 ring-foreground ring-offset-1" : "ring-black/10"}`}
                              aria-label={`${c} accent`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sections — large typography */}
                    <div className="space-y-6 px-3 py-4">
                      {SECTIONS.map((sec) => (
                        <div key={sec.label}>
                          <p className="mb-2 px-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">
                            {sec.label}
                          </p>
                          <ul className="space-y-1">
                            {sec.items.map((it) => (
                              <li key={it.title}>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    showToast(`→ ${it.title}`);
                                    setOpen(false);
                                  }}
                                  className={`block rounded-xl px-3 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 ${it.active ? "bg-foreground text-background" : "hover:bg-surface-muted"}`}
                                >
                                  <p className={`text-sm font-medium leading-snug ${it.active ? "text-background" : "text-foreground"}`}>
                                    {it.title}
                                  </p>
                                  <p className={`mt-1 font-mono text-xs ${it.active ? "text-white/70" : "text-text-muted"}`}>
                                    {it.meta}
                                  </p>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="mx-3 rounded-xl border border-border bg-surface p-3">
                      <p className="text-xs font-semibold">Up next</p>
                      <div className="mt-2 flex gap-3">
                        <div className="h-16 w-20 shrink-0 rounded-lg bg-stone-100 ring-1 ring-border grid place-items-center font-mono text-[10px] text-text-faint">
                          Cover
                        </div>
                        <div>
                          <p className="text-xs font-medium leading-snug">
                            Shelf life — how print taught us to hide navigation
                          </p>
                          <p className="mt-1 font-mono text-[10px] text-text-muted">
                            6 min · with photos
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              showToast("Added to queue");
                              setOpen(false);
                            }}
                            className="mt-2 text-xs font-medium text-accent hover:text-accent-strong"
                          >
                            Add to queue →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border bg-surface p-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {["About", "Archive", "Help", "Privacy"].map((l) => (
                        <a
                          key={l}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            showToast(l);
                          }}
                          className="rounded-full border border-border bg-surface-muted px-3 py-1.5 font-medium text-text-muted hover:text-foreground"
                        >
                          {l}
                        </a>
                      ))}
                    </div>
                    <p className="mt-3 text-center font-mono text-[10px] text-text-faint">
                      Wider drawer (360px) · rich header · grouped sections
                    </p>
                  </div>
                </NavDrawerShell>
              </div>
            )}
          </div>

          <div className="border-t border-border bg-surface-muted px-6 py-3 font-mono text-xs text-text-faint">
            Width: 360px · large type · identity header · scrim + scroll lock · accent demo (tap dots in drawer)
          </div>
        </div>

        {/* Why fits */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-2">
            <h2 className="text-sm font-semibold">Why a hamburger fits here</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Readers open Matter to read, not to navigate. An always-visible
              sidebar competes with the line length; a top-hung tab bar truncates
              section names. The hamburger keeps the article immersive and offers
              the full table of contents as a slide — profile, issue map,
              bookmarks and featured shelf — on demand.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              <span className="font-medium text-foreground">You gain</span>{" "}
              focus without losing place: the scrim says “the article is paused
              underneath”, body-lock preserves your scroll position, and the
              drawer&apos;s generous type and imagery make browsing feel like
              lingering in a well-printed contents page, not hunting a menu.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="text-sm font-semibold">How this variant differs</h3>
            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-text-muted">
              <li className="flex gap-2">
                <span className="text-accent">·</span>
                <span>360px wide with editorial typography, not compact links.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">·</span>
                <span>Identity header (avatar + plan + accent picker) above nav.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">·</span>
                <span>Rich “up next” card with cover placeholder and queue action.</span>
              </li>
            </ul>
            <div className="mt-4 rounded-xl border border-border bg-surface-muted p-3">
              <p className="font-mono text-xs font-semibold text-text-muted">
                Try
              </p>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">
                Change accent inside the drawer — the Subscribe pill and dots
                react instantly. Then close with scrim or Esc and watch focus
                return to ☰.
              </p>
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
