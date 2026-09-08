"use client";

import { useMemo, useState } from "react";
import Masonry from "@/components/masonry";
import BrickArt from "@/components/art";
import { Footer, PageHeader, ScenarioNav, Shell, WhyCard } from "@/components/chrome";
import { BOARD_ITEMS } from "@/lib/bricks";

const TAGS = ["All", "Interior", "Seascape", "Desert", "Alpine", "Garden", "Abstract", "Print"];

export default function InspirationBoard() {
  const [tag, setTag] = useState("All");
  const [cols, setCols] = useState(4);
  const [saved, setSaved] = useState<Set<string>>(new Set(["b3"]));
  const [savedOnly, setSavedOnly] = useState(false);

  const items = useMemo(
    () =>
      BOARD_ITEMS.filter(
        (b) =>
          (tag === "All" || b.tag === tag) && (!savedOnly || saved.has(b.id)),
      ),
    [tag, savedOnly, saved],
  );

  function toggleSave(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex min-h-full flex-col">
      <Shell>
        <ScenarioNav active="/scenarios/inspiration-board" />
        <div className="mt-8">
          <PageHeader
            eyebrow="Scenario 1 · Photo discovery"
            title="Atelier Nord — project moodboard"
            lede="A design studio collecting references for a hotel lobby: stone, fog, olive trees. Every image keeps its native shape — cropping them to uniform squares would destroy exactly what the designers are studying."
          />
        </div>

        {/* toolbar */}
        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface p-3 shadow-[0_1px_2px_rgba(28,25,23,0.05)]">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by mood">
            {TAGS.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tag === t}
                onClick={() => setTag(t)}
                className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  tag === t
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <label className="flex items-center gap-2 text-[13px] text-stone-500">
              Columns
              <input
                type="range"
                min={2}
                max={5}
                value={cols}
                onChange={(e) => setCols(Number(e.target.value))}
                className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-stone-200 accent-[#b91c1c]"
              />
              <span className="w-4 font-mono text-[12px] text-stone-700">{cols}</span>
            </label>
            <button
              type="button"
              aria-pressed={savedOnly}
              onClick={() => setSavedOnly((v) => !v)}
              className={`rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                savedOnly ? "bg-[#b91c1c] text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Saved ({saved.size})
            </button>
          </div>
        </div>

        <p className="mt-3 font-mono text-[11px] text-stone-400" aria-live="polite">
          {items.length} pin{items.length === 1 ? "" : "s"} · CSS columns engine · order flows down
          each column
        </p>

        {/* the wall */}
        <div className="mt-3">
          {items.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-stone-300 bg-surface px-6 py-20 text-center">
              <div>
                <p className="text-[15px] font-semibold text-stone-700">Nothing pinned here yet</p>
                <p className="mt-1 text-[13px] text-stone-500">
                  {savedOnly
                    ? "Save some pins first, then come back to your shortlist."
                    : "Try a different mood — the wall re-pours instantly."}
                </p>
                {savedOnly && (
                  <button
                    type="button"
                    onClick={() => setSavedOnly(false)}
                    className="mt-4 rounded-lg bg-stone-900 px-4 py-2 text-[13px] font-semibold text-white hover:bg-stone-700"
                  >
                    Show everything
                  </button>
                )}
              </div>
            </div>
          ) : (
            <Masonry
              items={items}
              cols={cols}
              gap={16}
              engine="columns"
              keyOf={(b) => b.id}
              animateNew
              renderItem={(b) => (
                <figure className="group relative overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_rgba(28,25,23,0.10)]">
                  <BrickArt brick={b} />
                  <button
                    type="button"
                    onClick={() => toggleSave(b.id)}
                    aria-pressed={saved.has(b.id)}
                    aria-label={saved.has(b.id) ? `Unsave ${b.title}` : `Save ${b.title}`}
                    className={`absolute right-2.5 top-2.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold shadow-md transition-all ${
                      saved.has(b.id)
                        ? "bg-stone-900 text-white opacity-100"
                        : "bg-white/95 text-stone-800 opacity-0 hover:bg-white group-hover:opacity-100 focus-visible:opacity-100"
                    }`}
                  >
                    {saved.has(b.id) ? "Saved" : "Save"}
                  </button>
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-stone-950/70 to-transparent px-3 pb-2.5 pt-8 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="truncate text-[13px] font-medium text-white">{b.title}</span>
                    <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur-sm">
                      {b.tag}
                    </span>
                  </figcaption>
                </figure>
              )}
            />
          )}
        </div>

        <div className="mt-6">
          <WhyCard>
            A moodboard is the purest masonry use-case: dozens of images with unrelated aspect
            ratios, browsed for feel rather than read in order — so the CSS-columns fallback is
            perfect and its down-each-column ordering costs nothing. Uniform rows would force
            crops and kill the reference value; here every pin keeps its shape, the wall stays
            dense, and saving filters the set without a single layout jump.
          </WhyCard>
        </div>
      </Shell>
      <Footer />
    </div>
  );
}
