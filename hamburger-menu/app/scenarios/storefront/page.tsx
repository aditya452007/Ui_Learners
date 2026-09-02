"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  HamburgerButton,
  NavDrawerShell,
  DrawerHeader,
} from "@/components/hamburger";

const CATEGORIES = [
  {
    id: "women",
    label: "Women",
    count: 248,
    subs: ["New in", "Dresses", "Outerwear", "Knitwear", "Denim", "Sale"],
  },
  {
    id: "men",
    label: "Men",
    count: 183,
    subs: ["New in", "Tailoring", "Outerwear", "Footwear", "Accessories"],
  },
  {
    id: "accessories",
    label: "Accessories",
    count: 94,
    subs: ["Bags", "Jewellery", "Hats", "Scarves", "Belts"],
  },
];

const QUICK_LINKS = [
  { name: "Journal", href: "#" },
  { name: "Stores", href: "#" },
  { name: "Customer care", href: "#" },
];

export default function StorefrontPage() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const drawerId = "storefront-drawer";
  const [expanded, setExpanded] = useState<string>("women");
  const [cart, setCart] = useState(2);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1600);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Scenario nav */}
      <div className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur">
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
              className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background"
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
              className="rounded-full px-3 py-1 text-xs font-medium text-text-muted hover:text-foreground"
            >
              Reader
            </Link>
          </div>
          <span className="hidden font-mono text-xs text-text-faint sm:inline">
            Scenario 1 · mobile shop
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Context header */}
        <div className="mb-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            Sable & Thorn · Fall 2026
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Mobile storefront — hamburger as the store&apos;s front door
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
            On a fashion shop, screen width is precious. The hamburger keeps the
            product grid full-bleed and hides the full category tree until the
            shopper asks for it — exactly like a department-store map you unfold
            only when you need to.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[390px_1fr]">
          {/* Phone frame */}
          <div className="relative overflow-hidden rounded-[28px] border border-border bg-surface shadow-[0_12px_40px_rgba(28,25,23,0.12)]">
            {/* Phone notch */}
            <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground" />

            {/* Phone top bar */}
            <div className="relative flex h-[64px] items-end justify-between gap-3 border-b border-border bg-surface px-4 pb-3 pt-8">
              <HamburgerButton
                open={open}
                onToggle={() => setOpen((v) => !v)}
                controlsId={drawerId}
                buttonRef={btnRef}
                className="h-9 w-9 border-stone-200"
              />
              <span className="absolute left-1/2 top-9 -translate-x-1/2 text-sm font-semibold tracking-[0.12em]">
                SABLE & THORN
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Search"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface-alt text-text-muted"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                    <circle cx="7" cy="7" r="4.3" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M10.2 10.2L12.8 12.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => showToast("Bag opened")}
                  className="relative grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background"
                  aria-label="Shopping bag"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                    <path d="M4 6.5V5a4 4 0 018 0v1.5M3 6.5h10l-.6 6.2a1.2 1.2 0 01-1.2 1.1H4.8a1.2 1.2 0 01-1.2-1.1L3 6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                  {cart > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                      {cart}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Phone content — product grid */}
            <div className="h-[620px] overflow-auto bg-surface-muted">
              <div className="bg-surface px-4 py-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-foreground px-2.5 py-1 font-medium text-background">
                    Women
                  </span>
                  <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-text-muted">
                    Men
                  </span>
                  <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-text-muted">
                    Sale
                  </span>
                  <span className="ml-auto font-mono text-[11px] text-text-faint">
                    248 items
                  </span>
                </div>
              </div>

              {/* Promo */}
              <div className="mx-3 mt-3 rounded-xl bg-foreground px-4 py-3 text-background">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
                  Free shipping
                </p>
                <p className="text-sm font-medium">
                  On orders over £150 — ends Sunday
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3">
                {[
                  { name: "Wool wrap coat", price: "£289", tag: "New" },
                  { name: "Cashmere crew", price: "£145", tag: null },
                  { name: "Leather tote", price: "£198", tag: "Low stock" },
                  { name: "Wide-leg denim", price: "£118", tag: null },
                  { name: "Silk slip dress", price: "£210", tag: "Sale" },
                  { name: "Suede ankle boot", price: "£235", tag: null },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="overflow-hidden rounded-xl border border-border bg-surface"
                  >
                    <div className="relative aspect-[4/5] bg-stone-100">
                      <div className="absolute inset-0 grid place-items-center text-[10px] font-mono uppercase tracking-widest text-text-faint">
                        Image
                      </div>
                      {p.tag && (
                        <span className="absolute left-2 top-2 rounded-full bg-surface px-2 py-1 font-mono text-[10px] font-semibold shadow-sm">
                          {p.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="truncate text-xs font-medium">{p.name}</p>
                      <p className="mt-1 text-xs font-semibold">{p.price}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setCart((c) => c + 1);
                          showToast(`Added ${p.name} to bag`);
                        }}
                        className="mt-2 w-full rounded-full border border-foreground bg-surface px-2 py-1.5 text-xs font-semibold hover:bg-foreground hover:text-background transition-colors"
                      >
                        Add to bag
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-3 pb-6">
                <button
                  type="button"
                  onClick={() => showToast("Filters opened")}
                  className="w-full rounded-full border border-border bg-surface py-2.5 text-xs font-semibold text-text-muted"
                >
                  Filters · Size · Colour · Price
                </button>
              </div>
            </div>

            {/* Drawer inside phone frame */}
            {open && (
              <NavDrawerShell
                open={open}
                onClose={() => setOpen(false)}
                controlsId={drawerId}
                buttonRef={btnRef}
                widthClass="w-[320px]"
                label="Store navigation"
              >
                <DrawerHeader
                  title="Browse"
                  subtitle="Tap a category — esc or scrim to close"
                  onClose={() => setOpen(false)}
                />

                {/* Search inside drawer */}
                <div className="border-b border-border p-3">
                  <label className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-3 py-2.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
                    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 text-text-faint">
                      <circle cx="7" cy="7" r="4.3" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M10.2 10.2L12.8 12.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search coats, denim, bags…"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-text-faint"
                    />
                  </label>
                  <p className="mt-2 font-mono text-[10px] text-text-faint">
                    Try “wool” or “leather” — {search ? `filtering for “${search}”` : "live filter demo"}
                  </p>
                </div>

                <div className="flex-1 overflow-auto">
                  <nav aria-label="Store categories" className="p-2">
                    {CATEGORIES.map((cat) => {
                      const isOpen = expanded === cat.id;
                      return (
                        <div key={cat.id} className="rounded-xl border border-transparent has-[button[aria-expanded=true]]:border-border has-[button[aria-expanded=true]]:bg-surface-muted">
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() =>
                              setExpanded(isOpen ? "" : cat.id)
                            }
                            className="flex w-full items-center justify-between px-3 py-3 text-left"
                          >
                            <span className="flex items-center gap-3">
                              <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface border border-border text-xs">
                                {cat.label[0]}
                              </span>
                              <span className="text-sm font-semibold">
                                {cat.label}
                              </span>
                            </span>
                            <span className="flex items-center gap-2">
                              <span className="rounded-full bg-surface-alt px-2 py-1 font-mono text-[10px] text-text-muted ring-1 ring-border">
                                {cat.count}
                              </span>
                              <span
                                className={`grid h-6 w-6 place-items-center rounded-full bg-surface text-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                              >
                                <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
                                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            </span>
                          </button>
                          {isOpen && (
                            <ul className="mx-2 mb-2 space-y-0.5 rounded-xl bg-surface p-2">
                              {cat.subs
                                .filter((s) =>
                                  s.toLowerCase().includes(search.toLowerCase())
                                )
                                .map((sub) => (
                                  <li key={sub}>
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        showToast(`Browsing ${cat.label} › ${sub}`);
                                        setOpen(false);
                                      }}
                                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-surface-muted hover:text-foreground"
                                    >
                                      <span>{sub}</span>
                                      <span className="font-mono text-xs text-text-faint">→</span>
                                    </a>
                                  </li>
                                ))}
                              {cat.subs.filter((s) => s.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                                <li className="px-3 py-2 text-xs text-text-faint">
                                  No matches for “{search}”
                                </li>
                              )}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </nav>

                  <div className="mx-3 my-3 h-px bg-border" />

                  <div className="space-y-1 px-2">
                    {QUICK_LINKS.map((l) => (
                      <a
                        key={l.name}
                        href={l.href}
                        onClick={(e) => {
                          e.preventDefault();
                          showToast(l.name);
                          setOpen(false);
                        }}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-surface-muted"
                      >
                        {l.name}
                        <span className="text-text-faint">↗</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border bg-surface-muted p-3">
                  <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 ring-1 ring-border">
                    <div>
                      <p className="text-xs font-semibold">
                        {cart} items · £{(cart * 148).toFixed(0)}
                      </p>
                      <p className="font-mono text-[10px] text-text-muted">
                        Free shipping unlocked
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast("Checkout — demo")}
                      className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:bg-stone-800"
                    >
                      Checkout
                    </button>
                  </div>
                  <p className="mt-2 text-center font-mono text-[10px] text-text-faint">
                    Body scroll locked · scrim tap closes
                  </p>
                </div>
              </NavDrawerShell>
            )}

            {toast && (
              <div className="pointer-events-none absolute bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background shadow-lg">
                {toast}
              </div>
            )}
          </div>

          {/* Right — explanation */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="text-sm font-semibold">Why a hamburger fits here</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Shoppers come to buy, not to navigate. Hiding the full taxonomy
                behind a hamburger keeps the product grid edge-to-edge and
                reduces choice overload. When they do want to browse, the
                drawer reveals the whole store hierarchy — nested accordions,
                search, and a sticky checkout — without ever leaving the
                current scroll position.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                <span className="font-medium text-foreground">You gain</span>{" "}
                focus: product discovery stays immersive, yet wayfinding is one
                tap away. The scrim signals “store map is open”, body-scroll
                lock prevents losing your place in the grid, and returning focus
                to ☰ means keyboard shoppers never get stranded.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
                <span className="rounded-full bg-accent-light px-2.5 py-1 text-accent">
                  Sheet side=&quot;left&quot; · 320px
                </span>
                <span className="rounded-full border border-border bg-surface-alt px-2.5 py-1 text-text-muted">
                  nested accordion
                </span>
                <span className="rounded-full border border-border bg-surface-alt px-2.5 py-1 text-text-muted">
                  sticky footer CTA
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="text-sm font-semibold">Try it</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-text-muted">
                <li>
                  Tap <span className="font-medium text-foreground">☰</span>{" "}
                  — watch three lines morph to an X and the drawer slide over
                  the dimmed grid.
                </li>
                <li>
                  Open <strong>Women</strong> and use the drawer search to
                  filter sub-categories live.
                </li>
                <li>
                  Add a product to the bag, then close with{" "}
                  <span className="rounded bg-surface-alt px-1 font-mono text-xs">
                    Esc
                  </span>{" "}
                  or by tapping the scrim — focus snaps back to the hamburger.
                </li>
              </ul>
              <div className="mt-4 rounded-xl bg-surface-muted px-4 py-3">
                <p className="font-mono text-xs font-semibold text-accent">
                  Accessibility check
                </p>
                <p className="mt-1 font-mono text-xs leading-relaxed text-text-muted">
                  aria-expanded=&quot;{String(open)}&quot; · aria-controls=
                  &quot;{drawerId}&quot; · Tab is trapped inside while open.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
