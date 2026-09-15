"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { NumPill, Skeleton, Spinner, Token, TopBar } from "./components/ui";

const PARTS = [
  {
    n: 1,
    name: "Skeleton block",
    token: "Skeleton",
    seeClean:
      "The grey shape standing in for a card or image. You see the page's boxes and picture slots before the real content arrives, so nothing jumps around when it finally loads. It tells you: content is coming, and here is exactly where it will sit.",
    how: "A <div> sized to the final content's exact geometry (same width and height), marked inside a region with aria-busy=\"true\" — aria-busy tells assistive tech this area is still updating. State (a value the component remembers, here loading true/false) decides skeleton vs. real content. Like reserving a seat with a jacket: the seat size never changes, only who sits in it.",
    fragment:
      "a shadcn/ui Skeleton block matching the final content's exact geometry to prevent layout shift",
  },
  {
    n: 2,
    name: "Skeleton text line",
    token: "Skeleton",
    seeClean:
      "The fake grey lines where headlines and paragraphs will appear. Their varied, natural widths mimic real copy — a long line, a medium line, a short last line — so your eye already reads the rhythm of the page before a single word arrives.",
    how: "More Skeleton blocks, but short and thin (height ~12px) with ragged widths like 92%, 78%, 54% to imitate wrapped text. They are aria-hidden — hidden from screen readers — because fake lines are visual only; the busy region announcement covers it. Think of ruled practice paper: the lines show where writing goes without being writing.",
    fragment:
      "a shadcn/ui Skeleton text line with varied natural widths matching the eventual copy layout",
  },
  {
    n: 3,
    name: "Shimmer sweep",
    token: "@keyframes",
    seeClean:
      "The soft glow gliding across the grey shapes. It is the difference between “frozen” and “working” — movement says the app hasn't stalled, it's still fetching. Subtle on purpose: it should soothe, never flash.",
    how: "A CSS @keyframes animation — @keyframes is a named recipe of motion over time — sliding a translucent white gradient from left to right across each skeleton, looping while aria-busy stays true. When loading flips to false, the animation unmounts with the skeleton. Props (settings you hand the component, like shimmer={false}) can disable it; always honor prefers-reduced-motion. Like a lighthouse beam sweeping: itself carries no cargo, it just says the harbour is open.",
    fragment:
      "a subtle CSS @keyframes shimmer sweep traveling across the skeleton blocks while aria-busy remains true",
  },
  {
    n: 4,
    name: "Spinner track and arc",
    token: 'role="status"',
    seeClean:
      "The faint circle with one darker segment spinning around it. It promises nothing about shape — just “hold on, something is happening somewhere.” You meet it on buttons, overlays, and full-page waits where there is no card to preview.",
    how: "An SVG circle (the quiet track) plus one arc segment rotated by @keyframes spin, wrapped in role=\"status\" — a live-region role that politely announces “Loading…” to screen readers without stealing focus. Use it when the wait is detached from layout (submitting, saving). Like a spinning airport radar: it doesn't show the plane, only that the sky is being watched.",
    fragment:
      "a role=\"status\" indeterminate spinner with a quiet circular track and one contrasting rotating arc",
  },
] as const;

const LOADING_MS = 2600;

export default function Page() {
  const [phase, setPhase] = useState<"loading" | "loaded">("loading");
  const [shimmer, setShimmer] = useState(true);
  const [active, setActive] = useState<number | null>(null);
  const [cycle, setCycle] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const replay = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setPhase("loading");
    setCycle((c) => c + 1);
    timer.current = setTimeout(() => setPhase("loaded"), LOADING_MS);
  }, []);

  useEffect(() => {
    timer.current = setTimeout(() => setPhase("loaded"), LOADING_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [cycle]);

  const loading = phase === "loading";
  const hl = (n: number) =>
    active === n ? "ring-2 ring-teal-600 ring-offset-2 ring-offset-white" : "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />

      <main className="mx-auto max-w-6xl px-6 pb-20">
        {/* hero */}
        <header className="pb-8 pt-12">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-teal-700">
            Web · Loading feedback
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Skeleton vs. Spinner
          </h1>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-text-muted">
            Also called:{" "}
            <span className="font-medium text-foreground">
              skeleton screen, placeholder loader, loading spinner, throbber
            </span>
            . A <strong className="font-semibold">skeleton</strong> previews the
            geometry of content that hasn&apos;t arrived — reducing layout shift
            and making a predictable page feel faster. A{" "}
            <strong className="font-semibold">spinner</strong> communicates an
            indeterminate wait when the eventual shape is unknown or the
            operation is detached from a layout. Neither should remain after
            the result or error state is available.
          </p>

          {/* intro strip */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              {
                t: "Skeleton previews shape",
                d: "Grey blocks in the exact size of the coming card, image and text. Layout never shifts.",
                icon: (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6}>
                    <rect x="2" y="2" width="16" height="8" rx="2" />
                    <rect x="2" y="12" width="11" height="2.4" rx="1.2" />
                    <rect x="2" y="15.6" width="7" height="2.4" rx="1.2" />
                  </svg>
                ),
              },
              {
                t: "Spinner signals wait",
                d: "A quiet track + one rotating arc. No shape promised — just “something is happening.”",
                icon: (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <circle cx="10" cy="10" r="7" opacity={0.3} />
                    <path d="M17 10a7 7 0 0 0-7-7" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                t: "Neither stays",
                d: "Both are replaced the moment content — or an error — is ready. Loaders never linger.",
                icon: (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6}>
                    <path d="M4 10.5 8.5 15 16 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
            ].map((c) => (
              <div
                key={c.t}
                className="rounded-2xl border border-border bg-surface p-4 shadow-[0_1px_2px_rgba(28,25,23,0.05)]"
              >
                <div className="flex items-center gap-2 text-teal-800">
                  {c.icon}
                  <p className="text-[13px] font-semibold">{c.t}</p>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">{c.d}</p>
              </div>
            ))}
          </div>

          {/* paste-ready prompt */}
          <div className="mt-4 rounded-2xl border border-teal-800/15 bg-teal-50/60 p-4">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-800">
              Paste-ready prompt
            </p>
            <p className="mt-1.5 font-mono text-[12.5px] leading-relaxed text-teal-950">
              Mark the loading region aria-busy=&quot;true&quot; and use a
              skeleton when the final card layout is known, preserving its
              geometry while data arrives. Use a spinner with role=&quot;status&quot;
              when the wait has no meaningful content shape, and replace either
              indicator when loading completes.
            </p>
          </div>
        </header>

        {/* anatomy diagram */}
        <section
          aria-label="Live anatomy diagram"
          className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_8px_30px_rgba(28,25,23,0.06)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-alt/60 px-6 py-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Live anatomy — a card that loads
              </h2>
              <p className="mt-0.5 text-[13px] text-text-muted">
                {loading ? (
                  <span aria-live="polite">
                    Loading… watch the grey shapes hold the layout still.
                  </span>
                ) : (
                  <span aria-live="polite">
                    Loaded — same geometry, real content. No jump.
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={replay}
                className="rounded-full bg-stone-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-teal-700"
              >
                ↺ Replay loading
              </button>
              <button
                onClick={() => setShimmer((s) => !s)}
                aria-pressed={shimmer}
                className={`rounded-full border px-4 py-2 text-[13px] font-medium transition ${
                  shimmer
                    ? "border-teal-700 bg-teal-50 text-teal-800"
                    : "border-border bg-surface text-text-muted hover:text-foreground"
                }`}
              >
                Shimmer {shimmer ? "on" : "off"}
              </button>
              <span
                className={`rounded-full px-3 py-1.5 font-mono text-[11px] ${
                  loading
                    ? "bg-amber-100 text-amber-900"
                    : "bg-teal-100 text-teal-900"
                }`}
              >
                {loading ? 'aria-busy="true"' : 'aria-busy="false"'}
              </span>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
            {/* skeleton / loaded card */}
            <div className="border-b border-border p-6 lg:border-b-0 lg:border-r">
              <div
                aria-busy={loading}
                aria-label="Article preview"
                className="mx-auto max-w-sm"
              >
                {loading ? (
                  <div key={cycle} className="animate-fade-in">
                    {/* image block — part 1 */}
                    <div
                      onMouseEnter={() => setActive(1)}
                      onMouseLeave={() => setActive(null)}
                      className="relative"
                    >
                      <div className="flex items-center gap-2 pb-2">
                        <NumPill n={1} active={active === 1} />
                        <span className="text-[13px] font-semibold">
                          Skeleton block
                        </span>
                        <Token>Skeleton</Token>
                      </div>
                      <Skeleton
                        shimmer={shimmer}
                        label="image placeholder"
                        className={`h-44 w-full rounded-xl ${hl(1)}`}
                      />
                      <div className="pointer-events-none absolute right-3 top-10 hidden items-center gap-1.5 rounded-full bg-stone-900/85 py-1 pl-1.5 pr-2.5 text-[11px] font-medium text-white sm:flex">
                        <span className="size-1.5 rounded-full bg-teal-300" />
                        exact image geometry
                      </div>
                    </div>

                    {/* text lines — part 2 */}
                    <div
                      onMouseEnter={() => setActive(2)}
                      onMouseLeave={() => setActive(null)}
                      className="pt-4"
                    >
                      <div className="flex items-center gap-2 pb-2">
                        <NumPill n={2} active={active === 2} />
                        <span className="text-[13px] font-semibold">
                          Skeleton text lines
                        </span>
                        <Token>Skeleton</Token>
                      </div>
                      <div className={`space-y-2.5 rounded-xl ${hl(2)}`}>
                        <Skeleton shimmer={shimmer} className="h-4 w-[92%]" />
                        <Skeleton shimmer={shimmer} className="h-4 w-[78%]" />
                        <div className="flex items-center gap-3 pt-1">
                          <Skeleton
                            shimmer={shimmer}
                            className="size-9 shrink-0 rounded-full"
                          />
                          <Skeleton shimmer={shimmer} className="h-3.5 w-[54%]" />
                        </div>
                      </div>
                    </div>

                    {/* shimmer — part 3 */}
                    <div
                      onMouseEnter={() => setActive(3)}
                      onMouseLeave={() => setActive(null)}
                      className={`mt-4 flex items-center gap-3 rounded-xl border border-dashed px-3 py-2.5 text-[12.5px] ${active === 3 ? "border-teal-600 bg-teal-50" : "border-border bg-surface-alt/70"}`}
                    >
                      <NumPill n={3} active={active === 3} />
                      <div>
                        <span className="font-semibold">Shimmer sweep </span>
                        <Token>@keyframes</Token>
                        <p className="mt-0.5 text-text-muted">
                          {shimmer
                            ? "Glow travelling left → right across every block."
                            : "Shimmer off — blocks fall back to a gentle pulse."}
                        </p>
                      </div>
                      <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-teal-800">
                        <span
                          className={`size-2 rounded-full ${shimmer ? "animate-pulse bg-teal-600" : "bg-stone-300"}`}
                        />
                        {shimmer ? "sweeping" : "paused"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pop-in">
                    <div className="flex items-center gap-2 pb-2">
                      <span className="grid size-6 place-items-center rounded-full bg-teal-700 text-[11px] font-bold text-white ring-2 ring-white">
                        ✓
                      </span>
                      <span className="text-[13px] font-semibold">
                        Loaded — geometry preserved
                      </span>
                      <span className="rounded-full bg-teal-100 px-2 py-0.5 font-mono text-[11px] text-teal-900">
                        0px shift
                      </span>
                    </div>
                    {/* same h-44 as skeleton image, same card width */}
                    <div className="flex h-44 w-full items-end overflow-hidden rounded-xl bg-gradient-to-br from-teal-800 via-teal-600 to-teal-400 p-4">
                      <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                        Fjords · 8 min read
                      </span>
                    </div>
                    <div className="space-y-2.5 pt-4">
                      <p className="h-4 text-[15px] font-semibold leading-4">
                        Kayaking the quiet side of Geirangerfjord
                      </p>
                      <p className="h-4 text-[13px] leading-4 text-text-muted">
                        Mist, still water, and a morning without engines.
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-stone-900 text-[12px] font-semibold text-white">
                          MK
                        </span>
                        <p className="text-[12.5px] text-text-muted">
                          Marit Knudsen · yesterday
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={replay}
                      className="mt-4 w-full rounded-xl border border-border py-2 text-[13px] font-medium transition hover:border-accent hover:text-accent"
                    >
                      Load it again to compare
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* spinner panel — part 4 */}
            <div className="bg-surface-alt/40 p-6">
              <div
                onMouseEnter={() => setActive(4)}
                onMouseLeave={() => setActive(null)}
                className="mx-auto flex h-full max-w-sm flex-col"
              >
                <div className="flex items-center gap-2">
                  <NumPill n={4} active={active === 4} />
                  <span className="text-[13px] font-semibold">
                    Spinner track and arc
                  </span>
                  <Token>role=&quot;status&quot;</Token>
                </div>
                <div
                  className={`mt-3 flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-surface px-6 py-10 text-center ${hl(4)}`}
                >
                  <div className="relative">
                    <Spinner size={64} label="Saving your trip…" />
                    <span className="pointer-events-none absolute -right-24 top-1/2 hidden -translate-y-1/2 items-center gap-2 xl:flex">
                      <span className="h-px w-10 bg-stone-300" />
                      <span className="rounded-full bg-stone-900 px-2 py-0.5 text-[10.5px] font-medium text-white">
                        arc
                      </span>
                    </span>
                    <span className="pointer-events-none absolute -left-24 top-1/2 hidden -translate-y-1/2 items-center gap-2 xl:flex">
                      <span className="rounded-full bg-stone-900 px-2 py-0.5 text-[10.5px] font-medium text-white">
                        track
                      </span>
                      <span className="h-px w-10 bg-stone-300" />
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Saving your trip…</p>
                    <p className="mx-auto mt-1 max-w-[26ch] text-[12.5px] leading-relaxed text-text-muted">
                      No card to preview here — the wait is detached from any
                      layout, so a spinner is honest.
                    </p>
                  </div>
                  <div className="flex items-end gap-5 rounded-xl bg-surface-alt/70 px-5 py-3">
                    <span className="flex flex-col items-center gap-1.5">
                      <Spinner size={16} label="Loading small" />
                      <span className="font-mono text-[10.5px] text-text-muted">16</span>
                    </span>
                    <span className="flex flex-col items-center gap-1.5">
                      <Spinner size={24} label="Loading medium" />
                      <span className="font-mono text-[10.5px] text-text-muted">24</span>
                    </span>
                    <span className="flex flex-col items-center gap-1.5">
                      <Spinner size={40} label="Loading large" />
                      <span className="font-mono text-[10.5px] text-text-muted">40</span>
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-text-faint">
                    track: stone-200 · arc: teal-700 · 0.9s linear spin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* layered explanations */}
        <section className="pt-12" aria-label="What each part means">
          <h2 className="text-xl font-semibold tracking-tight">
            Every part, in two languages
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-text-muted">
            <em>What you see</em> is for the person using the product.{" "}
            <em>How it works</em> is for you, the builder — every term defined,
            with an everyday analogy. Hover a card to light up its part above.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {PARTS.map((p) => (
              <article
                key={p.n}
                onMouseEnter={() => setActive(p.n)}
                onMouseLeave={() => setActive(null)}
                className={`rounded-2xl border bg-surface p-5 transition ${
                  active === p.n
                    ? "border-teal-600 shadow-[0_8px_24px_rgba(15,118,110,0.12)]"
                    : "border-border shadow-[0_1px_2px_rgba(28,25,23,0.05)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <NumPill n={p.n} active={active === p.n} />
                  <h3 className="text-[15px] font-semibold">{p.name}</h3>
                  <Token>{p.token}</Token>
                </div>
                <div className="mt-3 space-y-2.5 text-[13px] leading-relaxed">
                  <p>
                    <span className="font-semibold text-teal-800">
                      What you see —{" "}
                    </span>
                    <span className="text-foreground/90">
                      {p.seeClean ?? (p as { see?: string }).see}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">How it works — </span>
                    <span className="text-text-muted">{p.how}</span>
                  </p>
                  <p className="rounded-lg bg-surface-alt/80 px-3 py-2 font-mono text-[11.5px] leading-relaxed text-text-muted">
                    <span className="font-semibold text-foreground">
                      Prompt fragment:{" "}
                    </span>
                    {p.fragment}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* decision guide */}
        <section className="pt-12" aria-label="When to use which">
          <h2 className="text-xl font-semibold tracking-tight">
            Skeleton or spinner? Decide in one glance
          </h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface">
            {[
              {
                q: "You know the final layout (a card, a list, a profile)?",
                a: "Skeleton",
                why: "Preserve geometry with aria-busy=\"true\". Page feels faster, zero layout shift.",
                good: true,
              },
              {
                q: "The wait has no shape (saving, paying, sending)?",
                a: "Spinner",
                why: "role=\"status\" announces politely. Don't invent fake geometry — it's dishonest.",
                good: true,
              },
              {
                q: "Content or an error arrived?",
                a: "Neither",
                why: "Replace the indicator immediately. A loader that outlives its data is a bug.",
                good: false,
              },
            ].map((r) => (
              <div
                key={r.q}
                className="grid gap-2 border-b border-border px-5 py-4 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <p className="text-sm font-medium">{r.q}</p>
                  <p className="mt-0.5 text-[13px] text-text-muted">{r.why}</p>
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-[12.5px] font-semibold ${
                    r.a === "Skeleton"
                      ? "bg-teal-700 text-white"
                      : r.a === "Spinner"
                        ? "bg-stone-900 text-white"
                        : "bg-stone-200 text-stone-700"
                  }`}
                >
                  → {r.a}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                Skeleton region
              </p>
              <pre className="mt-2 overflow-x-auto rounded-xl bg-stone-950 p-3.5 font-mono text-[12px] leading-relaxed text-stone-100">
{`<section aria-busy="true" aria-label="Articles">
  <div className="skeleton h-44" />
  <div className="skeleton h-4 w-11/12" />
  <div className="skeleton h-4 w-3/4" />
</section>`}
              </pre>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                Spinner status
              </p>
              <pre className="mt-2 overflow-x-auto rounded-xl bg-stone-950 p-3.5 font-mono text-[12px] leading-relaxed text-stone-100">
{`<span role="status" aria-label="Saving…">
  <svg><!-- track circle + spinning arc --></svg>
  <span className="sr-only">Saving…</span>
</span>`}
              </pre>
            </div>
          </div>
        </section>

        {/* scenarios */}
        <section className="pt-12" aria-label="Scenarios">
          <h2 className="text-xl font-semibold tracking-tight">
            See it in three real products
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              {
                href: "/scenarios/feed",
                tag: "Skeleton · known layout",
                t: "Magazine feed",
                d: "Article cards hold their exact geometry while stories load. Flip to spinner mode to feel the layout-shift cost.",
              },
              {
                href: "/scenarios/checkout",
                tag: "Spinner · detached action",
                t: "Checkout payment",
                d: "Pay has no card to preview — an inline spinner takes over the button, then yields to success.",
              },
              {
                href: "/scenarios/dashboard",
                tag: "Both · chooses correctly",
                t: "Analytics dashboard",
                d: "Skeletons for KPI cards, a spinner for refresh, an error state that evicts both. With a decision log.",
              },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(28,25,23,0.05)] transition hover:-translate-y-0.5 hover:border-teal-600 hover:shadow-[0_12px_30px_rgba(15,118,110,0.12)]"
              >
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-teal-700">
                  {s.tag}
                </p>
                <p className="mt-1.5 text-[15px] font-semibold group-hover:text-teal-800">
                  {s.t} →
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-text-muted">
                  {s.d}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-border pt-6 text-[12.5px] text-text-faint">
          <p>
            Built hand-rolled — no component library. Skeletons are sized{" "}
            <code className="font-mono">div</code>s with a{" "}
            <code className="font-mono">@keyframes</code> sweep; the spinner is
            an SVG track + arc with{" "}
            <code className="font-mono">role=&quot;status&quot;</code>. Motion
            pauses under <code className="font-mono">prefers-reduced-motion</code>.
          </p>
        </footer>
      </main>
    </div>
  );
}
