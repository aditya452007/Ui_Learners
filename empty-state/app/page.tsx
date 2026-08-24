"use client";

import Link from "next/link";
import { useState } from "react";

// ──────────────────────────────────────────────────────────────
//  Types & data
// ──────────────────────────────────────────────────────────────

type Variant = "first-use" | "no-results" | "cleared";

const VARIANTS: Record<Variant, { label: string; title: string; desc: string; action: string; icon: "folder" | "search" | "inbox" }> = {
  "first-use": {
    label: "First use",
    title: "No projects yet",
    desc: "Create your first project to get started — it only takes a few seconds.",
    action: "New project",
    icon: "folder",
  },
  "no-results": {
    label: "No results",
    title: 'No results for “Q3 offsite”',
    desc: "Try adjusting your search or filters to find what you’re looking for.",
    action: "Clear filters",
    icon: "search",
  },
  cleared: {
    label: "Cleared",
    title: "All caught up",
    desc: "You’ve cleared every notification. New updates will appear here.",
    action: "Explore templates",
    icon: "inbox",
  },
};

const PARTS = [
  {
    n: 1,
    name: "Labelled section",
    token: '<section aria-labelledby>',
    see: "The empty state isn’t just blank space — it fully replaces the list or grid that would be here. A clear heading tells you at a glance why the view is empty.",
    how: 'The wrapper is a <section> with aria-labelledby pointing at the heading’s id. Screen readers announce it as a named region, so even without seeing the layout you know “this section is called ‘No projects yet’”. Think of it as a labelled empty shelf.',
  },
  {
    n: 2,
    name: "State illustration",
    token: 'aria-hidden="true"',
    see: "A soft, quiet picture — an open folder, a magnifying glass, an empty tray — that reinforces what’s missing. It’s decorative, never the explanation; you could remove it and still understand.",
    how: 'The illustration has aria-hidden="true" so assistive tech skips it entirely. The real meaning lives in the text. It’s like a book cover illustration: it sets the mood, but the title tells you what the book is about.',
  },
  {
    n: 3,
    name: "Message — heading + description",
    token: "<h2> + <p>",
    see: "One short heading that names the state (“No projects yet”) followed by one line that explains why and what you can do next. No blame, no jargon — just the facts.",
    how: "A heading (h2 or h3) gives the section its accessible name; the paragraph underneath adds context. React simply renders these as text — no special logic. Keeping it to two lines is a design choice that prevents the empty state from becoming its own puzzle.",
  },
  {
    n: 4,
    name: "Recovery action",
    token: "<button> · role=\"status\"",
    see: "The one button that gets you out of here — “New project”, “Clear filters”, “Explore templates”. Only one primary action so the next step is obvious.",
    how: 'A plain <button> with an onClick handler. For searches that filter live, wrap the whole message in role="status" so the announcement (“No results for Q3 offsite”) is spoken without moving focus. State is just whether the list is empty — if (items.length === 0) show this, otherwise show the list.',
  },
] as const;

const INTRO = [
  {
    step: "A named container",
    desc: "<section> with aria-labelledby replaces the list — not blank space, a designed state.",
  },
  {
    step: "A quiet explanation",
    desc: "Illustration + one-line heading + one-line why — clear enough to act on in a single glance.",
  },
  {
    step: "One way out",
    desc: "A single primary button resolves it. For live search, role=status whispers the update.",
  },
] as const;

function Illustration({ kind, active }: { kind: "folder" | "search" | "inbox"; active: boolean }) {
  const base = "mx-auto h-[84px] w-[84px] transition-all duration-500";
  // simple custom SVGs — muted, premium
  if (kind === "folder") {
    return (
      <div className={`${base} relative grid place-items-center`}>
        <div className={`absolute inset-0 rounded-2xl bg-accent-light transition-opacity ${active ? "opacity-100" : "opacity-60"}`} />
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true" className="relative">
          <path d="M10 14.5a3 3 0 0 1 3-3h10l3 3H39a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3v-18Z" stroke="#4f46e5" strokeWidth="1.6" fill="white" />
          <path d="M15 20h22" stroke="#e7e5e4" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M15 25h16" stroke="#e7e5e4" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="34.5" cy="29.5" r="5.5" stroke="#4f46e5" strokeWidth="1.4" fill="#eef2ff" />
          <path d="M37.5 32.5 40 35" stroke="#4f46e5" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  if (kind === "search") {
    return (
      <div className={`${base} relative grid place-items-center`}>
        <div className={`absolute inset-0 rounded-2xl bg-amber-50 transition-opacity ${active ? "opacity-100" : "opacity-60"}`} />
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true" className="relative">
          <circle cx="24" cy="24" r="11" stroke="#d97706" strokeWidth="1.6" fill="white" />
          <path d="M31.5 31.5 39 39" stroke="#d97706" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M19 22h10M19 26h7" stroke="#e7e5e4" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M28 17.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" fill="#fef3c7" stroke="#d97706" strokeWidth="1.1" />
        </svg>
      </div>
    );
  }
  return (
    <div className={`${base} relative grid place-items-center`}>
      <div className={`absolute inset-0 rounded-2xl bg-emerald-50 transition-opacity ${active ? "opacity-100" : "opacity-60"}`} />
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true" className="relative">
        <rect x="10" y="14" width="32" height="24" rx="3" stroke="#16a34a" strokeWidth="1.6" fill="white" />
        <path d="M10 18h32" stroke="#e7e5e4" strokeWidth="1.2" />
        <circle cx="26" cy="27" r="7" stroke="#16a34a" strokeWidth="1.4" fill="#ecfdf5" />
        <path d="M22.5 27.5 25 30l5-6" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
//  Page
// ──────────────────────────────────────────────────────────────

export default function Home() {
  const [variant, setVariant] = useState<Variant>("first-use");
  const [showIllustration, setShowIllustration] = useState(true);
  const v = VARIANTS[variant];
  const [flash, setFlash] = useState<string | null>(null);

  function handleAction() {
    setFlash(variant === "first-use" ? "Project creator opened — you’d land in a blank canvas." : variant === "no-results" ? "Filters cleared — results would repopulate." : "Template gallery would open here.");
    window.setTimeout(() => setFlash(null), 3000);
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
      {/* Header */}
      <header className="mb-14">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">NameThatUI — Anatomy · Web</p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Empty State</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-text-muted">
          A designed replacement for a content view when there is nothing to show — on first use, after filtering, or after everything is removed. It explains without blame and offers the single most useful next step.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">
          Also called: <span className="text-foreground">blank state · zero state · first-use state · no-results state</span>
        </p>
      </header>

      {/* Intro strip */}
      <section className="mb-20">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-text-muted">What am I looking at?</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {INTRO.map((c, i) => (
            <div key={c.step} className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-light font-mono text-xs font-bold text-accent">{i + 1}</span>
              <div>
                <h3 className="mb-1 text-sm font-semibold">{c.step}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Anatomy */}
      <section className="mb-20">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted">Anatomy — every part, named</h2>
        <p className="mb-8 text-sm text-text-muted">Switch the state to see how the same skeleton adapts — the labels chase the live component. Toggle the illustration to feel how much weight it carries.</p>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
          {/* Controls */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div role="group" aria-label="Empty state variant" className="inline-flex rounded-full border border-border bg-surface-alt p-0.5">
              {(Object.keys(VARIANTS) as Variant[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={variant === k}
                  onClick={() => setVariant(k)}
                  className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-medium transition-colors ${variant === k ? "bg-foreground text-white shadow-sm" : "text-text-muted hover:text-foreground"}`}
                >
                  {VARIANTS[k].label}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-pressed={showIllustration}
              onClick={() => setShowIllustration((v) => !v)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${showIllustration ? "border-accent/20 bg-accent-light text-accent" : "border-border text-text-muted hover:text-foreground"}`}
            >
              illustration {showIllustration ? "on" : "off"}
            </button>
            <span className="ml-auto hidden items-center gap-2 font-mono text-xs text-text-faint sm:inline-flex">
              <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_0_3px_rgba(22,163,74,0.12)]" />
              live preview
            </span>
          </div>

          <p className="mb-6 font-mono text-xs text-text-faint">
            {`<section aria-labelledby="empty-title" ${variant === "no-results" ? 'role="status"' : ""}> · `}
            {showIllustration ? `<Illustration aria-hidden /> · ` : ""}
            {`<button>${v.action}</button>`}
          </p>

          {/* Stage */}
          <div
            className="relative overflow-visible rounded-xl border border-border bg-[#fcfcfc] p-6 sm:p-12"
            style={{
              backgroundImage: "radial-gradient(circle, #e7e5e4 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          >
            {/* Dashed container label — Section */}
            <div className="absolute inset-3 rounded-xl border-2 border-dashed border-accent/30 sm:inset-6" aria-hidden="true">
              <div className="absolute -top-3 left-6 flex items-center gap-1.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-foreground font-mono text-[10px] leading-none text-white">1</span>
                <span className="callout-pill text-[10px] font-mono">section aria-labelledby</span>
              </div>
            </div>

            {/* The actual empty state */}
            <div className="relative mx-auto flex min-h-[360px] max-w-[380px] items-center justify-center py-8">
              <section
                aria-labelledby="empty-anatomy-title"
                role={variant === "no-results" ? "status" : undefined}
                aria-live={variant === "no-results" ? "polite" : undefined}
                className="relative w-full rounded-2xl border border-border bg-white px-8 py-10 text-center shadow-sm"
              >
                {/* 2 illustration */}
                {showIllustration && (
                  <>
                    <div className="relative">
                      <Illustration kind={v.icon} active />
                      {/* callout 2 */}
                      <div aria-hidden="true" className="absolute -right-2 -top-1 hidden translate-x-full sm:flex">
                        <div className="flex items-center gap-1.5">
                          <span className="h-px w-6 bg-border-strong" />
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-foreground font-mono text-[10px] text-white">2</span>
                          <span className="callout-pill text-[10px]">aria-hidden · illustration</span>
                        </div>
                      </div>
                      {/* leader line small */}
                      <div aria-hidden="true" className="absolute right-6 top-1/2 hidden h-px w-6 bg-border-strong sm:block translate-x-full" />
                    </div>
                    {/* mobile pill */}
                    <div className="mt-3 flex justify-center sm:hidden" aria-hidden="true">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="grid h-4 w-4 place-items-center rounded-full bg-foreground font-mono text-[9px] text-white">2</span>
                        <span className="font-mono text-[10px] text-text-faint">aria-hidden illustration</span>
                      </span>
                    </div>
                  </>
                )}

                {/* 3 message */}
                <div className="relative mt-6">
                  {/* leader + pill for message */}
                  <div aria-hidden="true" className="absolute -left-2 top-1/2 hidden -translate-x-full -translate-y-1/2 items-center gap-1.5 sm:flex">
                    <span className="callout-pill text-[10px]">heading + description</span>
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-foreground font-mono text-[10px] text-white">3</span>
                    <span className="h-px w-6 bg-border-strong" />
                  </div>
                  <h2 id="empty-anatomy-title" className="text-[15px] font-semibold tracking-tight text-foreground">
                    {v.title}
                  </h2>
                  <p className="mx-auto mt-2 max-w-[280px] text-sm leading-relaxed text-text-muted">{v.desc}</p>
                  <div className="mt-1 flex justify-center sm:hidden" aria-hidden="true">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="grid h-4 w-4 place-items-center rounded-full bg-foreground font-mono text-[9px] text-white">3</span>
                      <span className="font-mono text-[10px] text-text-faint">heading + description</span>
                    </span>
                  </div>
                </div>

                {/* 4 action */}
                <div className="relative mt-6">
                  <button
                    type="button"
                    onClick={handleAction}
                    className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-black active:scale-[0.98]"
                  >
                    {v.action}
                  </button>
                  {/* callout 4 */}
                  <div aria-hidden="true" className="absolute -right-2 top-1/2 hidden translate-x-full -translate-y-1/2 items-center gap-1.5 sm:flex">
                    <span className="h-px w-6 bg-border-strong" />
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-foreground font-mono text-[10px] text-white">4</span>
                    <span className="callout-pill text-[10px]">{"<button> recovery"}</span>
                  </div>
                  <div className="mt-3 flex justify-center sm:hidden" aria-hidden="true">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="grid h-4 w-4 place-items-center rounded-full bg-foreground font-mono text-[9px] text-white">4</span>
                      <span className="font-mono text-[10px] text-text-faint">{"<button> recovery action"}</span>
                    </span>
                  </div>
                  {variant === "no-results" && (
                    <p className="mt-3 font-mono text-[11px] text-text-faint">announced with role=&quot;status&quot; — no focus move</p>
                  )}
                </div>

                {/* outer pill 1 mobile duplicate */}
                <div className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 sm:flex" aria-hidden="true">
                  <span className="callout-pill border-dashed bg-white text-[10px] font-mono">labelled &lt;section&gt;</span>
                </div>
              </section>
            </div>

            {/* footer hint */}
            <p className="mt-2 text-center font-mono text-xs text-text-faint">Tap the action to see what it would do — then try “No results” to hear the role=&quot;status&quot; behaviour.</p>
            {flash && (
              <p role="status" className="mt-2 text-center text-sm font-medium text-accent">
                {flash}
              </p>
            )}
          </div>

          {/* small note */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-surface-alt px-4 py-3">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">First use</p>
              <p className="mt-1 text-sm leading-relaxed text-text-muted">No projects yet — invite creation. Warm, encouraging tone.</p>
            </div>
            <div className="rounded-xl bg-surface-alt px-4 py-3">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">No results</p>
              <p className="mt-1 text-sm leading-relaxed text-text-muted">Filter returned nothing — announce with role=status, offer clear.</p>
            </div>
            <div className="rounded-xl bg-surface-alt px-4 py-3">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Cleared</p>
              <p className="mt-1 text-sm leading-relaxed text-text-muted">All done / emptied — celebrate, suggest what to do next.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Layered explanations */}
      <section className="mb-20">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted">The four parts, in plain words</h2>
        <p className="mb-8 text-sm text-text-muted">Every named part, explained twice: for the person using the product, and for the person building it.</p>
        <div className="overflow-hidden rounded-2xl border border-border bg-border">
          {PARTS.map((part, i) => (
            <div key={part.n} className={`grid md:grid-cols-2 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="bg-surface p-5 sm:p-6">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent">What you see</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-foreground font-mono text-[10px] text-white">{part.n}</span>
                  {part.name}
                  <code className="font-mono text-[10px] font-normal text-text-faint">{part.token}</code>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{part.see}</p>
              </div>
              <div className="border-t border-border bg-surface p-5 md:border-t-0 md:border-l sm:p-6">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent">How it works</p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{part.how}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* In code */}
      <section className="mb-20">
        <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-text-muted">In code</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="grid sm:grid-cols-2 sm:divide-x sm:divide-border">
            <div className="border-b border-border p-6 sm:border-b-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">HTML</p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">&lt;section&gt;</code>
              <p className="mt-2 text-xs leading-relaxed text-text-faint">The empty state is a section that replaces the list — not an afterthought.</p>
            </div>
            <div className="border-b border-border p-6 sm:border-b-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">ARIA label</p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">aria-labelledby</code>
              <p className="mt-2 text-xs leading-relaxed text-text-faint">Points at the heading id so the region is named without extra text.</p>
            </div>
            <div className="border-b border-border p-6 sm:border-b-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Live region</p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">role=&quot;status&quot;</code>
              <p className="mt-2 text-xs leading-relaxed text-text-faint">For dynamic no-results: announces the message politely, focus stays where you typed.</p>
            </div>
            <div className="border-b border-border p-6 sm:border-b-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Illustration</p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">aria-hidden=&quot;true&quot;</code>
              <p className="mt-2 text-xs leading-relaxed text-text-faint">Decorative only — the heading carries the meaning, not the picture.</p>
            </div>
            <div className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Action</p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">{"<button>"}</code>
              <p className="mt-2 text-xs leading-relaxed text-text-faint">One primary recovery action that resolves why the view is empty.</p>
            </div>
            <div className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Prompt</p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-xs leading-relaxed">labelled &lt;section&gt; + icon + one-line why + one primary action · role=status for live results</code>
            </div>
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section>
        <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-text-muted">See it in the wild — three scenarios</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              href: "/scenarios/first-project",
              title: "Project workspace",
              desc: "First-use empty state — no projects yet. Gentle illustration, single “New project” CTA.",
            },
            {
              href: "/scenarios/search-no-results",
              title: "Catalog search",
              desc: "Live no-results with role=status, filter chips, and a clear-all recovery.",
            },
            {
              href: "/scenarios/inbox-zero",
              title: "Inbox zero",
              desc: "Post-clearance celebration — all caught up, with secondary browse actions.",
            },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group block rounded-xl border border-border bg-surface p-6 transition-all hover:border-accent hover:shadow-md"
            >
              <h3 className="mb-2 text-sm font-semibold transition-colors group-hover:text-accent">{s.title}</h3>
              <p className="text-sm leading-relaxed text-text-muted">{s.desc}</p>
              <span className="mt-4 inline-block text-sm font-medium text-accent">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer meta */}
      <footer className="mt-16 border-t border-border pt-6 text-xs leading-relaxed text-text-faint">
        <p>
          Empty state is a designed product state, not “nothing”. Keep it to one heading, one explanation, one action — and never blame the user for the emptiness.
        </p>
      </footer>
    </main>
  );
}
