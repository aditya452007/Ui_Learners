"use client";

import Link from "next/link";
import { useState } from "react";
import { DemoNav } from "@/components/nav";
import { Drawer, NativeModal, Sheet, SurfaceHeader } from "@/components/overlay";

/* ── the five named parts ── */

type Part = {
  id: string;
  n: number;
  name: string;
  symbol: string;
  fragment: string;
  see: string;
  how: string;
};

const PARTS: Part[] = [
  {
    id: "surface",
    n: 1,
    name: "Modal surface",
    symbol: "<dialog>",
    fragment: "the <dialog> modal surface centered in the top layer above its backdrop",
    see: "The actual floating box in the middle — the card with the title, the text, and the buttons. Everything else on the page dims so this one short decision owns the screen for a moment.",
    how: "A <dialog> element is a built-in browser popup box. Opening it with showModal() lifts it into the top layer — a special always-on-top plane above everything, even sticky headers — makes the page behind inert (visible but unclickable, like a paused video), and hands you Escape-to-close for free. Think of a spotlight on a stage: one actor lit, the rest dark.",
  },
  {
    id: "scrim",
    n: 2,
    name: "Scrim",
    symbol: "<dialog>::backdrop",
    fragment: "the <dialog>::backdrop scrim covering and dimming the page behind the modal surface",
    see: "The dark see-through veil stretched over the page. It says “the page is paused — deal with this first”, and clicking it usually backs out of the overlay.",
    how: "For a native dialog the scrim is ::backdrop — a pseudo-element, meaning a styleable shadow layer the browser paints behind any top-layer box. You tint it with plain CSS. For hand-built drawers and sheets it is just a fixed full-screen div sitting behind the panel. Only add one when the surface is actually modal: a non-modal drawer skips the scrim so the page stays usable. Like frosted glass slid over a paused game.",
  },
  {
    id: "dismiss",
    n: 3,
    name: "Explicit dismissal",
    symbol: "HTMLDialogElement.close() · Escape",
    fragment: "a visible close control plus Escape and scrim-click dismissal on every modal surface",
    see: "The × in the corner, the Escape key, and a click on the dark surround — three exits, at least one always visible. An overlay never traps you; every one announces how to leave.",
    how: "The × button calls close(). Escape fires the dialog's cancel and close events — free with showModal(), hand-wired with a key listener for div-based panels. A scrim click just checks whether the click landed on the backdrop rather than the card. The demo logs which exit fired, so press each one: like three doors out of one room, each with a little bell.",
  },
  {
    id: "focus",
    n: 4,
    name: "Managed focus",
    symbol: 'role="dialog" · aria-modal="true" · autofocus',
    fragment: "focus moved into the surface on open, trapped while modal, and returned to the trigger on close",
    see: "When the overlay opens, your cursor jumps straight to its first field or button. Pressing Tab cycles inside the card and never leaks out to the dimmed page. Close it and you land back on the button that opened it.",
    how: "State is the values a component remembers between clicks — here it remembers the trigger element. On open we focus the element marked data-autofocus (“start here”); a Tab handler wraps the last field back to the first so keyboard users can't fall behind the veil; on close we call .focus() on the remembered trigger. role=\"dialog\" with aria-modal=\"true\" tells screen readers the rest of the page is inert. Like a librarian who walks you to a desk, keeps you there, then walks you back.",
  },
  {
    id: "placement",
    n: 5,
    name: "Placement — modal vs. drawer vs. sheet",
    symbol: "Radix Dialog · shadcn/ui Sheet",
    fragment: "a centered modal for short decisions, a side drawer for contextual editing, a bottom sheet for compact mobile actions",
    see: "One job — do something without leaving the page — in three shapes. Centered box for a short decision. Side panel that keeps the list peeking through while you edit. Bottom tray inside thumb reach for quick phone actions.",
    how: "Center means <dialog> plus showModal(). Side and bottom mean fixed-position panels — pinned to the right edge or the bottom edge — carrying role=\"dialog\"; they only become modal when you add the scrim and the focus trap from part 4. Props are the settings you hand a component: the same panel with modal={true} blocks the page, with modal={false} lets it stay live. Pick by context: decide → modal, edit-while-looking → drawer, quick phone actions → sheet. Same family, three addresses.",
  },
];

type Variant = "modal" | "drawer" | "sheet";

const VARIANT_META: Record<Variant, { title: string; blurb: string; code: string }> = {
  modal: {
    title: "Centered modal",
    blurb: "A short decision. The page goes fully inert behind it.",
    code: "<dialog>  ·  showModal()  →  top layer + inert + ::backdrop + Esc",
  },
  drawer: {
    title: "Side drawer",
    blurb: "Contextual editing. The list stays visible at the edge.",
    code: '<aside role="dialog" aria-modal="true">  ·  fixed right + scrim + focus trap',
  },
  sheet: {
    title: "Bottom sheet",
    blurb: "Compact actions. Thumb-reach on phones.",
    code: '<section role="dialog" aria-modal="true">  ·  fixed bottom + grab handle + scrim',
  },
};

function Num({ n, dark = false }: { n: number; dark?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-5 shrink-0 place-items-center rounded-full font-mono text-[10px] font-bold shadow-md ring-2 ring-white ${
        dark ? "bg-stone-900 text-white" : "bg-accent text-white"
      }`}
    >
      {n}
    </span>
  );
}

export default function Home() {
  const [variant, setVariant] = useState<Variant>("modal");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [drawerModal, setDrawerModal] = useState(true);
  const [closeReason, setCloseReason] = useState<string | null>(null);
  const [selected, setSelected] = useState("surface");
  const [confirmNote, setConfirmNote] = useState<string | null>(null);

  const part = PARTS.find((p) => p.id === selected) ?? PARTS[0];
  const meta = VARIANT_META[variant];
  const scrimOn = variant === "modal" || variant === "sheet" || drawerModal;

  function open() {
    setConfirmNote(null);
    setCloseReason(null);
    setOverlayOpen(true);
  }

  function closed(reason: string) {
    setOverlayOpen(false);
    setCloseReason(reason);
  }

  function switchVariant(v: Variant) {
    setVariant(v);
    setOverlayOpen(false);
    setCloseReason(null);
    setConfirmNote(null);
  }

  const reasonLabel: Record<string, string> = {
    escape: "Escape key",
    scrim: "scrim click",
    "close-button": "× button",
    action: "action button",
  };

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Namethatui — Anatomy · Web
        </p>
        <DemoNav current="/" />
      </div>

      {/* Header */}
      <header className="mb-10">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Modal Dialog vs. Drawer vs. Sheet
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-text-muted">
          A modal dialog is centered, blocks the underlying interface, and suits
          a short decision or focused task. A drawer slides from a side edge
          and preserves more visual context for browsing or editing. A sheet is
          edge-attached too, most often rising from the bottom for compact
          actions or mobile layouts.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">
          Also called:{" "}
          <span className="text-foreground">
            modal · side panel · slide-over · bottom sheet
          </span>
        </p>
      </header>

      {/* Intro strip */}
      <section className="mb-16">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-text-muted">
          What am I looking at?
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "Decide → modal",
              desc: "Centered and blocking. Rename, confirm, delete — one short question, answered, gone.",
            },
            {
              step: "Edit in context → drawer",
              desc: "Pinned to the side. The list stays visible at the edge while you tweak the selected row.",
            },
            {
              step: "Act fast → sheet",
              desc: "Rising from the bottom. Filters and share actions inside thumb reach on phones.",
            },
          ].map((c, i) => (
            <div
              key={c.step}
              className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-light font-mono text-xs font-bold text-accent">
                {i + 1}
              </span>
              <div>
                <h3 className="mb-1 text-sm font-semibold">{c.step}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Anatomy */}
      <section className="mb-16">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted">
          Anatomy — every part, named
        </h2>
        <p className="mb-8 text-sm text-text-muted">
          Pick a shape, open it, then fire each exit. The numbered labels ride
          on the live overlay — Tab is trapped inside while it is modal.
        </p>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
          {/* Controls */}
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <div
              role="group"
              aria-label="Overlay shape"
              className="inline-flex rounded-full border border-border bg-surface-alt p-0.5"
            >
              {(["modal", "drawer", "sheet"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={variant === v}
                  onClick={() => switchVariant(v)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    variant === v
                      ? "bg-foreground text-background"
                      : "text-text-muted hover:text-foreground"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            {variant === "drawer" && (
              <button
                type="button"
                role="switch"
                aria-checked={drawerModal}
                onClick={() => {
                  setDrawerModal((m) => !m);
                  setOverlayOpen(false);
                  setCloseReason(null);
                }}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition ${
                  drawerModal
                    ? "border-accent/30 bg-accent-light text-accent"
                    : "border-border text-text-muted hover:text-foreground"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`relative h-4 w-7 rounded-full transition-colors ${drawerModal ? "bg-accent" : "bg-border-strong"}`}
                >
                  <span
                    className={`absolute top-0.5 size-3 rounded-full bg-white shadow transition-all ${drawerModal ? "left-3.5" : "left-0.5"}`}
                  />
                </span>
                modal + scrim
              </button>
            )}
            <button
              type="button"
              onClick={open}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]"
            >
              Open {meta.title.toLowerCase()}
            </button>
          </div>

          <p className="mb-6 font-mono text-xs text-text-faint">{meta.code}</p>

          {/* Stage: the page behind the overlay */}
          <div className="dot-grid relative overflow-hidden rounded-xl border border-border p-6 sm:p-8">
            <div className="max-w-md rounded-xl border border-border bg-surface shadow-md">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                <span className="ml-2 font-mono text-[10px] text-text-faint">
                  acme.app/settings
                </span>
              </div>
              <div className="space-y-2.5 p-5">
                <div className="h-3.5 w-1/2 rounded bg-foreground/80" />
                <div className="h-2 w-full rounded bg-surface-alt ring-1 ring-border" />
                <div className="h-2 w-11/12 rounded bg-surface-alt ring-1 ring-border" />
                <div className="h-2 w-4/5 rounded bg-surface-alt ring-1 ring-border" />
                <button
                  type="button"
                  onClick={open}
                  className="mt-2 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  {variant === "modal"
                    ? "Delete workspace…"
                    : variant === "drawer"
                      ? "Edit member…"
                      : "Open filters…"}
                </button>
              </div>
            </div>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-text-muted">
              {meta.blurb}{" "}
              {overlayOpen
                ? "It is open right now — the rest of this page is inert. Press Esc, click the dark surround, or use the ×."
                : "Open it and watch the page behind go quiet."}{" "}
              Tab cycles inside while modal; closing returns focus here.
            </p>
            {(closeReason || confirmNote) && (
              <p className="mt-2 font-mono text-xs text-accent" role="status">
                {confirmNote ??
                  `last closed via: ${reasonLabel[closeReason ?? ""] ?? closeReason}`}
              </p>
            )}
          </div>

          <p className="mt-5 text-center font-mono text-xs text-text-faint">
            {variant === "modal"
              ? "Native <dialog> + showModal() — top layer, inert background, ::backdrop, free Escape."
              : scrimOn
                ? "Hand-built panel — fixed position + scrim + trapped focus, because it is modal."
                : "Non-modal drawer — same panel, no scrim, no trap. The page stays clickable."}
          </p>
        </div>
      </section>

      {/* Live overlays */}
      <NativeModal
        open={variant === "modal" && overlayOpen}
        onClose={(r) => closed(r)}
        describedBy="hub-modal-desc"
      >
        <div className="relative">
          <div className="absolute -top-3 left-4 -translate-y-full">
            <span className="callout-pill border border-border bg-surface font-mono text-text-muted">
              <Num n={1} /> {"<dialog>"} surface · top layer
            </span>
          </div>
          <div className="leader-line -top-0 left-10 h-3 w-px bg-border-strong" aria-hidden="true" />
          <SurfaceHeader
            title="Delete this workspace?"
            description="This is the live anatomy specimen. It blocks everything until you answer."
            onClose={() => closed("close-button")}
          />
          <div className="absolute top-0 right-12 -translate-y-2">
            <span className="callout-pill border border-border bg-surface font-mono text-text-muted">
              <Num n={3} /> × · Esc · scrim
            </span>
          </div>
          <p id="hub-modal-desc" className="mt-4 text-sm leading-relaxed text-text-muted">
            Six projects and 14 members will lose access. This is the kind of
            short, consequential decision a centered modal exists for.
          </p>
          <div className="relative mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => closed("close-button")}
              className="rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-text-muted hover:bg-surface-alt hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              data-autofocus
              onClick={() => {
                setConfirmNote("Confirmed — workspace deleted (demo). Closed via action button.");
                setOverlayOpen(false);
              }}
              className="rounded-lg bg-danger px-3.5 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-danger/50 focus-visible:outline-none"
            >
              Delete workspace
            </button>
            <div className="absolute -bottom-2 right-2 translate-y-full pt-2">
              <span className="callout-pill border border-border bg-surface font-mono text-text-muted">
                <Num n={4} /> focus starts here · Tab trapped
              </span>
            </div>
          </div>
        </div>
      </NativeModal>

      <Drawer
        open={variant === "drawer" && overlayOpen}
        onClose={(r) => closed(r)}
        modal={drawerModal}
        describedBy="hub-drawer-desc"
      >
        <div className="relative flex h-full flex-col p-6">
          <div className="absolute -top-1 left-4 -translate-y-full">
            <span className="callout-pill border border-border bg-surface font-mono text-text-muted">
              <Num n={1} /> drawer panel · fixed right
            </span>
          </div>
          <SurfaceHeader
            title="Edit member"
            description="Same family as the modal — pinned to the side so the list stays visible."
            onClose={() => closed("close-button")}
          />
          <div className="absolute top-5 right-14">
            <span className="callout-pill border border-border bg-surface font-mono text-text-muted">
              <Num n={3} /> × · Esc{drawerModal ? " · scrim" : ""}
            </span>
          </div>
          <p id="hub-drawer-desc" className="mt-4 text-sm leading-relaxed text-text-muted">
            Editing in context: the members list peeks through{" "}
            {drawerModal ? "the dimmed edge" : "because there is no scrim"} while
            you work.
          </p>
          <label className="mt-5 block text-xs font-semibold text-text-muted">
            Display name
            <input
              data-autofocus
              defaultValue="Mara Chen"
              className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
            />
          </label>
          <label className="mt-3 block text-xs font-semibold text-text-muted">
            Role
            <select
              className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
              defaultValue="Admin"
            >
              <option>Admin</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
          </label>
          <div className="relative mt-auto flex gap-2 pt-6">
            <button
              type="button"
              onClick={() => closed("close-button")}
              className="flex-1 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-text-muted hover:bg-surface-alt hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmNote("Saved — member updated (demo). Closed via action button.");
                setOverlayOpen(false);
              }}
              className="flex-1 rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Save changes
            </button>
            <div className="absolute -bottom-2 left-2 translate-y-full pt-2">
              <span className="callout-pill border border-border bg-surface font-mono text-text-muted">
                <Num n={4} /> {drawerModal ? "Tab trapped · focus returns" : "no trap — page stays live"}
              </span>
            </div>
          </div>
        </div>
      </Drawer>

      <Sheet
        open={variant === "sheet" && overlayOpen}
        onClose={(r) => closed(r)}
        describedBy="hub-sheet-desc"
      >
        <div className="relative p-6 pt-3">
          <div className="absolute -top-7 left-4 -translate-y-full">
            <span className="callout-pill border border-border bg-surface font-mono text-text-muted">
              <Num n={1} /> sheet tray · fixed bottom
            </span>
          </div>
          <SurfaceHeader
            title="Filter results"
            description="Compact actions, thumb-reach height, grab handle on top."
            onClose={() => closed("close-button")}
          />
          <div className="absolute top-8 right-14">
            <span className="callout-pill border border-border bg-surface font-mono text-text-muted">
              <Num n={3} /> × · Esc · scrim
            </span>
          </div>
          <p id="hub-sheet-desc" className="mt-3 text-sm leading-relaxed text-text-muted">
            The sheet pattern: a couple of quick picks and one big Apply.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Open now", "Top rated", "Under $20", "Nearby"].map((chip, i) => (
              <button
                key={chip}
                type="button"
                data-autofocus={i === 0 ? true : undefined}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  i === 0
                    ? "border-accent/40 bg-accent-light text-accent"
                    : "border-border text-text-muted hover:text-foreground"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
          <div className="relative mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => closed("close-button")}
              className="flex-1 rounded-lg border border-border px-3.5 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-alt hover:text-foreground"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmNote("Applied — 2 filters active (demo). Closed via action button.");
                setOverlayOpen(false);
              }}
              className="flex-1 rounded-lg bg-accent px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Show results
            </button>
            <div className="absolute -bottom-2 left-2 translate-y-full pt-2">
              <span className="callout-pill border border-border bg-surface font-mono text-text-muted">
                <Num n={4} /> focus lands on first chip
              </span>
            </div>
          </div>
        </div>
      </Sheet>

      {/* Scrim callout */}
      {overlayOpen && scrimOn && (
        <div className="fixed bottom-4 left-4 z-[60]" aria-hidden="true">
          <span className="callout-pill border border-border bg-surface font-mono text-text-muted shadow-lg">
            <Num n={2} /> ::backdrop scrim — page dimmed + inert
          </span>
        </div>
      )}
      {overlayOpen && !scrimOn && (
        <div className="fixed bottom-4 left-4 z-[60]" aria-hidden="true">
          <span className="callout-pill border border-dashed border-warning bg-surface font-mono text-text-muted shadow-lg">
            <Num n={2} dark /> no scrim — non-modal, page stays live
          </span>
        </div>
      )}
      {overlayOpen && (
        <button
          type="button"
          onClick={() => setSelected("placement")}
          className="fixed right-4 bottom-4 z-[60] rounded-full bg-foreground px-3 py-1.5 font-mono text-[11px] text-background shadow-lg"
        >
          <Num n={5} /> {meta.title} — why this shape?
        </button>
      )}

      {/* Layered explanations */}
      <section className="mb-16">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted">
          The five parts, in plain words
        </h2>
        <p className="mb-8 text-sm text-text-muted">
          Every named part, explained twice: for the person using the product,
          and for the person building it.
        </p>
        <div className="overflow-hidden rounded-2xl border border-border">
          {PARTS.map((p, i) => (
            <div
              key={p.id}
              className={`grid md:grid-cols-2 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <div className="bg-surface p-5 sm:p-6">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent">
                  What you see
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold">
                  <Num n={p.n} />
                  {p.name}
                  <code className="font-mono text-[10px] font-normal text-text-faint">
                    {p.symbol}
                  </code>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{p.see}</p>
              </div>
              <div className="border-t border-border bg-surface-alt/50 p-5 sm:p-6 md:border-t-0 md:border-l">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent">
                  How it works
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{p.how}</p>
                <p className="mt-3 rounded-lg bg-foreground px-3 py-2 font-mono text-[11px] leading-relaxed text-background/90">
                  <span className="opacity-50">prompt fragment → </span>
                  {p.fragment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Part picker */}
      <section className="mb-16">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-text-muted">
          Inspect a part
        </h2>
        <div className="flex flex-wrap gap-2">
          {PARTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p.id)}
              aria-pressed={selected === p.id}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                selected === p.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-text-muted hover:text-foreground"
              }`}
            >
              <Num n={p.n} dark={selected === p.id} />
              {p.name}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-faint">
              What you see
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{part.see}</p>
          </div>
          <div className="rounded-xl border border-accent/25 bg-accent-light/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
              How it works
            </p>
            <p className="mt-1.5 text-sm leading-relaxed">{part.how}</p>
          </div>
        </div>
      </section>

      {/* In code */}
      <section className="mb-16">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-text-muted">
          In code
        </h2>
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="grid sm:grid-cols-2 sm:divide-x sm:divide-border">
            <div className="border-b border-border p-6 sm:border-b-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                HTML
              </p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">
                {"<dialog>"}
              </code>
              <code className="mt-2 block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">
                showModal()
              </code>
            </div>
            <div className="border-b border-border p-6 sm:border-b-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                ARIA
              </p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">
                role=&quot;dialog&quot;
              </code>
            </div>
            <div className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Radix
              </p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">
                Dialog
              </code>
            </div>
            <div className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                shadcn/ui
              </p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">
                Sheet
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Confusions */}
      <section className="mb-16">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-text-muted">
          Don&apos;t mix these up
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Decision ≠ editing ≠ quick actions",
              d: "Centered modal for one short question. Drawer when the user must keep seeing the list. Sheet for compact, thumb-reach phone picks. Same family, different jobs.",
            },
            {
              t: "::backdrop ≠ hand-rolled scrim",
              d: "Native dialogs get a free ::backdrop pseudo-element. Div-based drawers and sheets fake it with a fixed div — and only when modal. Toggle “modal + scrim” off above to feel the difference.",
            },
            {
              t: "Modal ≠ non-modal drawer",
              d: "The same side panel behaves two ways: modal blocks with scrim + focus trap; non-modal docks beside live content. Manner, not shape, makes it modal.",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm font-semibold">{c.t}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">{c.d}</p>
            </div>
          ))}
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
              href: "/scenarios/delete-confirmation",
              title: "Delete confirmation",
              desc: "Native <dialog> showModal for a destructive settings decision — type-to-confirm, three exits, focus returned.",
            },
            {
              href: "/scenarios/inventory-editor",
              title: "Inventory drawer",
              desc: "Right slide-over editing a product row while the table peeks through — plus a non-modal mode.",
            },
            {
              href: "/scenarios/delivery-filters",
              title: "Delivery sheet",
              desc: "Bottom tray with grab handle filtering restaurants — compact chips, sticky Apply, live counts.",
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

      <footer className="mt-14 border-t border-border pt-6 text-[13px] leading-relaxed text-text-muted">
        <p>
          Built with a real <code className="font-mono text-xs">{"<dialog>"}</code>{" "}
          for the modal (top layer, inert background,{" "}
          <code className="font-mono text-xs">::backdrop</code>, Escape) and
          hand-rolled <code className="font-mono text-xs">role=&quot;dialog&quot;</code>{" "}
          panels for the drawer and sheet — scrim and focus trap included only
          when modal.
        </p>
      </footer>
    </main>
  );
}
