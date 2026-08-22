"use client";

import Link from "next/link";
import { useState } from "react";
import { ToastCard, type ToastItem } from "@/components/toast";

const DURATIONS = [
  { label: "3s", value: 3000 },
  { label: "5s", value: 5000 },
  { label: "sticky", value: 0 },
] as const;

const PARTS = [
  {
    n: 1,
    name: "Toast viewport",
    token: "Toaster",
    see: "The fixed corner where every little message appears and stacks — bottom-right here, whichever corner the product chooses. Because it never moves, your eyes learn exactly where to glance after any action.",
    how: "One fixed-position container rendered once at the app root — shadcn/ui calls it <Toaster>. Each toast is appended to a list held in state (values the component remembers between clicks), and React redraws the stack. The wrapper is pointer-events-none, so clicks pass through the empty gaps.",
  },
  {
    n: 2,
    name: "Status message",
    token: 'role="status"',
    see: "The short confirmation itself: “Saved”, “Copied”, “Added to cart”. It appears without demanding anything — no OK to click, nothing blocked. Screen-reader users hear it announced politely at the next pause.",
    how: 'role="status" turns the toast into a polite live region (aria-live="polite" is implied). When React inserts the node, assistive tech announces it even though keyboard focus never moved — like a waiter refilling your glass without interrupting the conversation.',
  },
  {
    n: 3,
    name: "Toast action",
    token: "ToastAction",
    see: "One button for the one thing you might want back — Undo, or View cart. A single action keeps the decision instant; two would turn a glance into a task.",
    how: "The action is just data on the toast: { label, onClick }. The card renders a button from it and dismisses itself after the click. Because the offer lives inside the toast, it expires when the toast does — undo windows end naturally.",
  },
  {
    n: 4,
    name: "Auto-dismiss timer",
    token: "duration · pause on hover",
    see: "The thin bar draining along the bottom. Nonessential news leaves by itself after a few seconds — but hover the toast, or Tab onto it, and the countdown freezes so you never lose a message mid-read.",
    how: "A setTimeout schedules the removal. Whenever hover or focus sets paused to true, the remaining milliseconds are banked in a ref (a value that survives re-renders) and the timer restarts with what's left. The visible bar is a CSS animation whose animation-play-state pauses in sync.",
  },
] as const;

const INTRO_CARDS = [
  {
    step: "You act",
    desc: "Save, delete, add to cart — the toast never appears out of nowhere; it always answers something you just did.",
  },
  {
    step: "The corner speaks",
    desc: "A small card slides into the viewport and is announced politely — confirmation without interruption.",
  },
  {
    step: "It leaves",
    desc: "The timer drains and the toast exits by itself. Hover to freeze it; act on Undo before it goes.",
  },
] as const;

function Segmented({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: number;
  options: readonly { label: string; value: number }[];
  onChange: (v: number) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex rounded-full border border-border bg-surface p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.label}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full px-3 py-1 font-mono text-xs transition-colors ${
            value === o.value
              ? "bg-foreground text-background"
              : "text-text-muted hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [demo, setDemo] = useState<ToastItem | null>(null);
  const [duration, setDuration] = useState<number>(5000);
  const [showAction, setShowAction] = useState(true);
  const [note, setNote] = useState<string | null>(null);

  function fire() {
    setNote(null);
    setDemo({
      id: Date.now(),
      exiting: false,
      title: "Document saved",
      description: "All changes synced to acme.docs · just now",
      status: "success",
      duration,
      action: showAction
        ? {
            label: "Undo",
            onClick: () => setNote("Undo clicked — change rolled back."),
          }
        : undefined,
    });
  }

  function dismissDemo(id: number) {
    setDemo((d) => (d && d.id === id ? { ...d, exiting: true } : d));
    window.setTimeout(() => setDemo(null), 200);
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
      {/* Header */}
      <header className="mb-14">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Namethatui — Anatomy · Web
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Toast (Snackbar)
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-text-muted">
          A compact, non-modal status message that slides into a screen corner
          after an action and dismisses itself. It confirms transient outcomes —
          saved, copied, added — without ever interrupting the workflow.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">
          Also called:{" "}
          <span className="text-foreground">
            snackbar · status toast · in-app notification · confirmation popup ·
            temporary message · bottom notification
          </span>
        </p>
      </header>

      {/* Intro strip */}
      <section className="mb-20">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-text-muted">
          What am I looking at?
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {INTRO_CARDS.map((c, i) => (
            <div
              key={c.step}
              className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5"
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
      <section className="mb-20">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted">
          Anatomy — every part, named
        </h2>
        <p className="mb-8 text-sm text-text-muted">
          Fire the toast, then hover it — the numbered labels chase the config,
          and the timer freezes under your cursor.
        </p>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
          {/* Controls */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={fire}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]"
            >
              Trigger save
            </button>
            <Segmented
              ariaLabel="Auto-dismiss duration"
              value={duration}
              options={DURATIONS}
              onChange={(v) => {
                setDuration(v);
                setDemo(null);
              }}
            />
            <button
              type="button"
              aria-pressed={showAction}
              onClick={() => {
                setShowAction((v) => !v);
                setDemo(null);
              }}
              className={`rounded-full border px-3 py-1 font-mono text-xs transition ${
                showAction
                  ? "border-accent/30 bg-accent-light text-accent"
                  : "border-border text-text-muted hover:text-foreground"
              }`}
            >
              ToastAction
            </button>
          </div>

          <p className="mb-6 font-mono text-xs text-text-faint">
            {`<Toaster corner="bottom-right" />  ·  `}
            {`<Toast duration={${duration}}`}
            {showAction ? " action={…}" : ""}
            {` />`}
          </p>

          {/* Stage */}
          <div
            className="relative h-[430px] overflow-visible rounded-xl"
            style={{
              backgroundImage:
                "radial-gradient(circle, #e7e5e4 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            {/* Mock document */}
            <div className="absolute top-8 left-6 w-72 rounded-xl border border-border bg-surface shadow-md sm:left-10 sm:w-80">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                <span className="ml-2 font-mono text-[10px] text-text-faint">
                  q3-planning.doc
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border px-4 py-2">
                <span className="font-mono text-[11px] text-text-muted">
                  File · Edit · View
                </span>
                <button
                  type="button"
                  onClick={fire}
                  className="rounded-md bg-accent-light px-2.5 py-1 text-[11px] font-semibold text-accent transition-colors hover:bg-indigo-100"
                >
                  Save
                </button>
              </div>
              <div className="space-y-3 p-5">
                <div className="h-3.5 w-2/3 rounded bg-foreground/80" />
                <div className="h-2 w-full rounded bg-surface-alt ring-1 ring-border" />
                <div className="h-2 w-11/12 rounded bg-surface-alt ring-1 ring-border" />
                <div className="h-2 w-full rounded bg-surface-alt ring-1 ring-border" />
                <div className="h-2 w-4/5 rounded bg-surface-alt ring-1 ring-border" />
                <div className="h-2 w-full rounded bg-surface-alt ring-1 ring-border" />
                <div className="h-2 w-2/3 rounded bg-surface-alt ring-1 ring-border" />
              </div>
            </div>

            {/* Viewport zone */}
            <div
              aria-hidden="true"
              className="absolute right-0 bottom-0 left-0 h-36 rounded-tr-xl border-t-2 border-l-2 border-dashed border-accent/40"
            >
              <div className="absolute -top-3 right-5 flex items-center gap-1.5">
                <span
                  className="grid h-5 w-5 place-items-center rounded-full font-mono text-[10px]"
                  style={{ backgroundColor: "#1c1917", color: "#fafaf9" }}
                >
                  1
                </span>
                <span className="callout-pill border border-border bg-surface font-mono text-[10px] text-text-muted">
                  Toaster · viewport
                </span>
              </div>
            </div>

            {/* Live toast + callouts */}
            {demo && (
              <div className="absolute right-6 bottom-16 w-[340px] max-w-[calc(100%-3rem)] sm:right-10">
                {/* 2 — status message */}
                <div
                  aria-hidden="true"
                  className="absolute -top-2 left-8 z-10 -translate-y-full"
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className="grid h-5 w-5 place-items-center rounded-full font-mono text-[10px]"
                      style={{ backgroundColor: "#1c1917", color: "#fafaf9" }}
                    >
                      2
                    </span>
                    <span className="callout-pill border border-border bg-surface font-mono text-[10px] text-text-muted">
                      role=&quot;status&quot;
                    </span>
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className="leader-line bottom-full left-8 h-2 w-px bg-border-strong"
                />

                {/* 4 — timer */}
                {duration > 0 && (
                  <>
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-2 left-10 z-10 translate-y-full"
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className="grid h-5 w-5 place-items-center rounded-full font-mono text-[10px]"
                          style={{ backgroundColor: "#1c1917", color: "#fafaf9" }}
                        >
                          4
                        </span>
                        <span className="callout-pill border border-border bg-surface font-mono text-[10px] text-text-muted">
                          duration={duration} · pauses on hover
                        </span>
                      </span>
                    </div>
                    <div
                      aria-hidden="true"
                      className="leader-line top-full left-10 h-2 w-px bg-border-strong"
                    />
                  </>
                )}

                {/* 3 — action */}
                {showAction && (
                  <>
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-2 right-10 z-10 translate-y-full"
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className="grid h-5 w-5 place-items-center rounded-full font-mono text-[10px]"
                          style={{ backgroundColor: "#1c1917", color: "#fafaf9" }}
                        >
                          3
                        </span>
                        <span className="callout-pill border border-border bg-surface font-mono text-[10px] text-text-muted">
                          ToastAction
                        </span>
                      </span>
                    </div>
                    <div
                      aria-hidden="true"
                      className="leader-line top-full right-10 h-2 w-px bg-border-strong"
                    />
                  </>
                )}

                <ToastCard key={demo.id} toast={demo} dismiss={dismissDemo} />
              </div>
            )}

            {!demo && (
              <div className="absolute right-6 bottom-16 flex items-center gap-2 rounded-xl border border-dashed border-border-strong px-4 py-3 text-sm text-text-faint sm:right-10">
                The toast will land in this corner — press “Trigger save”.
              </div>
            )}
          </div>

          <p className="mt-5 text-center font-mono text-xs text-text-faint">
            Hover the toast (or Tab to it) — the countdown freezes. Esc dismisses it.
          </p>
          {note && (
            <p className="mt-2 text-center font-mono text-xs text-accent">{note}</p>
          )}
        </div>
      </section>

      {/* Layered explanations */}
      <section className="mb-20">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted">
          The four parts, in plain words
        </h2>
        <p className="mb-8 text-sm text-text-muted">
          Every named part, explained twice: for the person using the product,
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
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                  <span
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-full font-mono text-[10px]"
                    style={{ backgroundColor: "#1c1917", color: "#fafaf9" }}
                  >
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
      <section className="mb-20">
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
                role=&quot;status&quot;
              </code>
            </div>
            <div className="border-b border-border p-6 sm:border-b-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Live region
              </p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">
                aria-live=&quot;polite&quot;
              </code>
            </div>
            <div className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                shadcn/ui
              </p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">
                {"<Toaster />"}
              </code>
            </div>
            <div className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Sonner
              </p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">
                toast()
              </code>
            </div>
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
              href: "/scenarios/docs-autosave",
              title: "Docs autosave",
              desc: "Pure status message — background saves confirmed, no action, 3s.",
            },
            {
              href: "/scenarios/file-manager-undo",
              title: "File manager undo",
              desc: "Optimistic delete with a ToastAction Undo and a 7s window.",
            },
            {
              href: "/scenarios/checkout-cart",
              title: "Checkout cart",
              desc: "Stacking confirmations plus one sticky error that never auto-dismisses.",
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
              <p className="text-sm leading-relaxed text-text-muted">{s.desc}</p>
              <span className="mt-4 inline-block text-sm font-medium text-accent">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
