"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DemoNav } from "@/components/nav";
import { Sheet, SurfaceHeader } from "@/components/overlay";

type Place = {
  id: string;
  name: string;
  cuisine: string;
  price: 1 | 2 | 3;
  rating: number;
  time: string;
  open: boolean;
};

const PLACES: Place[] = [
  { id: "r1", name: "Miso & Ember", cuisine: "Japanese", price: 2, rating: 4.8, time: "15–25 min", open: true },
  { id: "r2", name: "Taco Brisa", cuisine: "Mexican", price: 1, rating: 4.6, time: "10–20 min", open: true },
  { id: "r3", name: "Forno Antico", cuisine: "Italian", price: 2, rating: 4.7, time: "20–30 min", open: true },
  { id: "r4", name: "Green Thali House", cuisine: "Indian", price: 1, rating: 4.5, time: "25–35 min", open: false },
  { id: "r5", name: "Le Petit Croque", cuisine: "French", price: 3, rating: 4.9, time: "30–40 min", open: true },
  { id: "r6", name: "Saigon Smoke", cuisine: "Vietnamese", price: 1, rating: 4.4, time: "15–25 min", open: true },
  { id: "r7", name: "Osteria Nove", cuisine: "Italian", price: 3, rating: 4.3, time: "25–35 min", open: true },
  { id: "r8", name: "Casa Verde Taqueria", cuisine: "Mexican", price: 2, rating: 4.2, time: "10–15 min", open: true },
];

const CUISINES = ["Japanese", "Mexican", "Italian", "Indian", "French", "Vietnamese"];
const SORTS = ["Recommended", "Fastest", "Top rated", "Cheapest"] as const;

type Filters = {
  cuisines: string[];
  maxPrice: number | null;
  minRating: number;
  openNow: boolean;
  sort: (typeof SORTS)[number];
};

const DEFAULT_FILTERS: Filters = {
  cuisines: [],
  maxPrice: null,
  minRating: 0,
  openNow: false,
  sort: "Recommended",
};

function activeCount(f: Filters) {
  return (
    f.cuisines.length +
    (f.maxPrice !== null ? 1 : 0) +
    (f.minRating > 0 ? 1 : 0) +
    (f.openNow ? 1 : 0)
  );
}

export default function DeliveryFiltersPage() {
  const [applied, setApplied] = useState<Filters>(DEFAULT_FILTERS);
  const [draft, setDraft] = useState<Filters>(DEFAULT_FILTERS);
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    let list = PLACES.filter((p) => {
      if (applied.cuisines.length > 0 && !applied.cuisines.includes(p.cuisine)) return false;
      if (applied.maxPrice !== null && p.price > applied.maxPrice) return false;
      if (p.rating < applied.minRating) return false;
      if (applied.openNow && !p.open) return false;
      return true;
    });
    if (applied.sort === "Fastest")
      list = [...list].sort((a, b) => parseInt(a.time) - parseInt(b.time));
    else if (applied.sort === "Top rated") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (applied.sort === "Cheapest") list = [...list].sort((a, b) => a.price - b.price);
    return list;
  }, [applied]);

  const count = activeCount(applied);
  const draftCount = useMemo(() => {
    return PLACES.filter((p) => {
      if (draft.cuisines.length > 0 && !draft.cuisines.includes(p.cuisine)) return false;
      if (draft.maxPrice !== null && p.price > draft.maxPrice) return false;
      if (p.rating < draft.minRating) return false;
      if (draft.openNow && !p.open) return false;
      return true;
    }).length;
  }, [draft]);

  function openSheet() {
    setDraft(applied);
    setOpen(true);
  }

  function toggleCuisine(c: string) {
    setDraft((d) => ({
      ...d,
      cuisines: d.cuisines.includes(c)
        ? d.cuisines.filter((x) => x !== c)
        : [...d.cuisines, c],
    }));
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Scenario 3 · Bottom sheet
        </p>
        <DemoNav current="/scenarios/delivery-filters" />
      </div>

      <header className="mb-8">
        <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Midtown delivery — filter sheet
        </h1>
        <p className="max-w-2xl leading-relaxed text-text-muted">
          A food-delivery storefront on a phone-sized errand: eight kitchens,
          one thumb. The sheet rises from the bottom with a grab handle —
          cuisine chips, price, rating, and sort in one compact tray with a
          sticky Apply footer.
        </p>
      </header>

      {/* Storefront */}
      <div className="mx-auto max-w-xl">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold">Dinner near Midtown</h2>
            <p className="text-sm text-text-muted" aria-live="polite">
              {results.length} of {PLACES.length} kitchens
              {count > 0 && ` · ${count} filter${count > 1 ? "s" : ""} on`}
            </p>
          </div>
          <button
            type="button"
            onClick={openSheet}
            aria-haspopup="dialog"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
              <path
                d="M2 4.5h12M4.5 8h7M7 11.5h2"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            Filters{count > 0 && ` (${count})`}
          </button>
        </div>

        {count > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {applied.cuisines.map((c) => (
              <span key={c} className="rounded-full bg-accent-light px-2.5 py-1 text-[11px] font-semibold text-accent">
                {c}
              </span>
            ))}
            {applied.maxPrice !== null && (
              <span className="rounded-full bg-accent-light px-2.5 py-1 text-[11px] font-semibold text-accent">
                {"$".repeat(applied.maxPrice)} & under
              </span>
            )}
            {applied.minRating > 0 && (
              <span className="rounded-full bg-accent-light px-2.5 py-1 text-[11px] font-semibold text-accent">
                ★ {applied.minRating}+
              </span>
            )}
            {applied.openNow && (
              <span className="rounded-full bg-accent-light px-2.5 py-1 text-[11px] font-semibold text-accent">
                Open now
              </span>
            )}
            <button
              type="button"
              onClick={() => setApplied(DEFAULT_FILTERS)}
              className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-text-muted underline hover:text-foreground"
            >
              Clear all
            </button>
          </div>
        )}

        <ul className="mt-4 space-y-3">
          {results.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-shadow hover:shadow-md"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-surface-alt text-lg ring-1 ring-border" aria-hidden="true">
                {p.cuisine === "Japanese" ? "🍱" : p.cuisine === "Mexican" ? "🌮" : p.cuisine === "Italian" ? "🍝" : p.cuisine === "Indian" ? "🍛" : p.cuisine === "French" ? "🥐" : "🍜"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {p.name}{" "}
                  {!p.open && (
                    <span className="ml-1 rounded-full bg-surface-alt px-2 py-0.5 text-[10px] font-semibold text-text-muted ring-1 ring-border">
                      Closed
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {p.cuisine} · {"$".repeat(p.price)} · ★ {p.rating} · {p.time}
                </p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-muted hover:text-foreground"
              >
                View
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border-strong px-6 py-10 text-center">
              <p className="text-sm font-semibold">No kitchens match</p>
              <p className="mt-1 text-[13px] text-text-muted">
                Loosen a filter or two — the sheet is one tap away.
              </p>
              <button
                type="button"
                onClick={() => setApplied(DEFAULT_FILTERS)}
                className="mt-3 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Clear all filters
              </button>
            </li>
          )}
        </ul>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold">Why a sheet fits here</h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
            Compact, thumb-reach, dismissible in one swipe of Esc or scrim:
            the user gains fast faceted search without leaving the list or
            losing scroll position. Chips multi-select, price caps, a minimum
            rating, and one sticky Apply keep the whole errand under ten
            seconds — a centered modal would feel heavy, a side drawer
            unreachable on a phone.
          </p>
          <p className="mt-3 rounded-lg bg-surface-alt px-3 py-2 font-mono text-[11px] leading-relaxed text-text-muted">
            {'<section role="dialog" aria-modal="true">'} · fixed bottom + handle + scrim
          </p>
        </div>
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} describedBy="filters-desc">
        <div className="max-h-[80vh] overflow-y-auto p-6 pt-2">
          <SurfaceHeader
            title="Filters"
            description={`${draftCount} of ${PLACES.length} kitchens match`}
            onClose={() => setOpen(false)}
          />
          <p id="filters-desc" className="mt-2 text-[13px] text-text-muted">
            Bottom-sheet pattern: quick picks, live count, one sticky Apply.
            Esc or the scrim backs out without applying.
          </p>

          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Cuisine
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {CUISINES.map((c, i) => {
              const on = draft.cuisines.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  data-autofocus={i === 0 ? true : undefined}
                  aria-pressed={on}
                  onClick={() => toggleCuisine(c)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    on
                      ? "border-accent bg-accent text-white"
                      : "border-border text-text-muted hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Max price
          </h3>
          <div
            role="group"
            aria-label="Maximum price"
            className="mt-2 inline-flex rounded-full border border-border bg-surface-alt p-0.5"
          >
            {[
              { label: "Any", value: null },
              { label: "$", value: 1 },
              { label: "$$", value: 2 },
            ].map((o) => (
              <button
                key={o.label}
                type="button"
                aria-pressed={draft.maxPrice === o.value}
                onClick={() => setDraft((d) => ({ ...d, maxPrice: o.value as number | null }))}
                className={`rounded-full px-4 py-1.5 font-mono text-xs font-semibold transition-colors ${
                  draft.maxPrice === o.value
                    ? "bg-foreground text-background"
                    : "text-text-muted hover:text-foreground"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Minimum rating
          </h3>
          <div role="group" aria-label="Minimum rating" className="mt-2 flex gap-2">
            {[0, 4.3, 4.5, 4.7].map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={draft.minRating === r}
                onClick={() => setDraft((d) => ({ ...d, minRating: r }))}
                className={`flex-1 rounded-lg border px-2 py-2 font-mono text-xs font-semibold transition-colors ${
                  draft.minRating === r
                    ? "border-accent/50 bg-accent-light text-accent"
                    : "border-border text-text-muted hover:text-foreground"
                }`}
              >
                {r === 0 ? "Any" : `★ ${r}+`}
              </button>
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={draft.openNow}
              onClick={() => setDraft((d) => ({ ...d, openNow: !d.openNow }))}
              className={`flex flex-1 items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${
                draft.openNow ? "border-accent/40 bg-accent-light/60" : "border-border"
              }`}
            >
              <span className="font-semibold">Open now</span>
              <span
                aria-hidden="true"
                className={`relative h-5 w-9 rounded-full transition-colors ${draft.openNow ? "bg-accent" : "bg-border-strong"}`}
              >
                <span
                  className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all ${draft.openNow ? "left-[18px]" : "left-0.5"}`}
                />
              </span>
            </button>
          </div>

          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Sort by
          </h3>
          <div role="radiogroup" aria-label="Sort by" className="mt-2 grid grid-cols-2 gap-2">
            {SORTS.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={draft.sort === s}
                onClick={() => setDraft((d) => ({ ...d, sort: s }))}
                className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                  draft.sort === s
                    ? "border-accent/50 bg-accent-light text-accent"
                    : "border-border text-text-muted hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="sticky bottom-0 -mx-6 mt-6 flex gap-2 border-t border-border bg-surface px-6 py-4">
            <button
              type="button"
              onClick={() => setDraft(DEFAULT_FILTERS)}
              className="flex-1 rounded-lg border border-border px-3.5 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-alt hover:text-foreground"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                setApplied(draft);
                setOpen(false);
              }}
              className="flex-[2] rounded-lg bg-accent px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Show {draftCount} kitchen{draftCount === 1 ? "" : "s"}
            </button>
          </div>
        </div>
      </Sheet>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <Link href="/scenarios/inventory-editor" className="text-sm font-medium text-accent hover:underline">
          ← Prev: inventory drawer
        </Link>
        <Link href="/" className="text-sm font-medium text-accent hover:underline">
          Back to hub ↑
        </Link>
      </div>
    </main>
  );
}
