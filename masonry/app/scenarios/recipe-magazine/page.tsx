"use client";

import { useMemo, useState } from "react";
import Masonry, { useNativeMasonry } from "@/components/masonry";
import BrickArt from "@/components/art";
import { Footer, PageHeader, ScenarioNav, Shell, WhyCard } from "@/components/chrome";
import { RECIPES } from "@/lib/bricks";

const CATS = ["All", "Weeknight", "Project", "Baking", "No-cook"];

export default function RecipeMagazine() {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const support = useNativeMasonry();

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RECIPES.filter(
      (r) =>
        (cat === "All" || r.tag === cat) &&
        (q === "" ||
          r.title.toLowerCase().includes(q) ||
          (r.blurb ?? "").toLowerCase().includes(q)),
    );
  }, [cat, query]);

  return (
    <div className="flex min-h-full flex-col">
      <Shell>
        <ScenarioNav active="/scenarios/recipe-magazine" />
        <div className="mt-8">
          <PageHeader
            eyebrow="Scenario 2 · Editorial feed"
            title="The Sunday Table — recipe index"
            lede="A food magazine where every recipe needs a different amount of words: a 10-minute salad gets one line, the lentil soup everyone emails about gets four. Cards must never split — a photo in one column with its ingredients stranded in the next would be unreadable."
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface p-3 shadow-[0_1px_2px_rgba(28,25,23,0.05)]">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes — try “soup” or “bread”…"
            aria-label="Search recipes"
            className="min-w-[220px] flex-1 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-[14px] text-stone-800 outline-none transition-all placeholder:text-stone-400 focus:border-[#b91c1c] focus:bg-white focus:ring-2 focus:ring-[#b91c1c]/15"
          />
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by collection">
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
                className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  cat === c
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 font-mono text-[11px] text-stone-400" aria-live="polite">
          {items.length} recipe{items.length === 1 ? "" : "s"} ·{" "}
          {support === true
            ? "native grid lanes active — rows read left to right"
            : "columns fallback active — order flows down each column"}
        </p>

        <div className="mt-3">
          {items.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-stone-300 bg-surface px-6 py-20 text-center">
              <div>
                <p className="text-[15px] font-semibold text-stone-700">No recipes match</p>
                <p className="mt-1 text-[13px] text-stone-500">
                  “{query}” isn&apos;t on the menu — try “soup”, “bread” or “salad”.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCat("All");
                  }}
                  className="mt-4 rounded-lg bg-stone-900 px-4 py-2 text-[13px] font-semibold text-white hover:bg-stone-700"
                >
                  Clear search
                </button>
              </div>
            </div>
          ) : (
            <Masonry
              items={items}
              cols={3}
              gap={20}
              engine="native"
              keyOf={(r) => r.id}
              animateNew
              renderItem={(r) => (
                <article className="overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-[0_1px_3px_rgba(28,25,23,0.08)] transition-shadow hover:shadow-[0_8px_24px_rgba(28,25,23,0.12)]">
                  <BrickArt brick={r} rounded="rounded-none" />
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-[#b91c1c]/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#7f1d1d]">
                        {r.tag}
                      </span>
                      <span className="font-mono text-[11px] text-stone-400">{r.meta}</span>
                    </div>
                    <h3 className="mt-2.5 font-serif text-[19px] font-semibold leading-6 text-stone-900">
                      {r.title}
                    </h3>
                    <p className="mt-1.5 text-[13.5px] leading-6 text-stone-600">{r.blurb}</p>
                    <button
                      type="button"
                      className="mt-3 text-[13px] font-semibold text-[#b91c1c] hover:underline"
                    >
                      Cook this →
                    </button>
                  </div>
                </article>
              )}
            />
          )}
        </div>

        <div className="mt-6">
          <WhyCard>
            Editorial content is uneven by nature — one-line salads next to four-line essays — so
            fixed rows would leave craters of whitespace. This page runs the native grid-lanes
            engine with the columns fallback wired in: where lanes exist, recipes keep true
            left-to-right reading order; everywhere else the fallback pours down each column and
            break-inside: avoid guarantees no recipe is ever torn across columns. Search and
            filters re-pour the wall live, and the ragged bottom edge is the honest sign that no
            space was wasted.
          </WhyCard>
        </div>
      </Shell>
      <Footer />
    </div>
  );
}
