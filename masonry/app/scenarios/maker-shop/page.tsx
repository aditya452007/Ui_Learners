"use client";

import { useMemo, useState } from "react";
import Masonry, { type JsOrder } from "@/components/masonry";
import BrickArt from "@/components/art";
import { Footer, PageHeader, ScenarioNav, Shell, WhyCard } from "@/components/chrome";
import { MORE_PRODUCTS, PRODUCTS, units, type Brick } from "@/lib/bricks";

const CAPTION = 96; // price + rating + title rows, in wall units

function Stars({ rating }: { rating?: string }) {
  if (!rating) return null;
  const value = parseFloat(rating);
  return (
    <span className="flex items-center gap-1" title={`${rating} out of 5`}>
      <span aria-hidden className="text-[12px] tracking-tight text-amber-500">
        {"★".repeat(Math.round(value))}
        <span className="text-stone-300">{"★".repeat(5 - Math.round(value))}</span>
      </span>
      <span className="font-mono text-[11px] text-stone-400">{rating}</span>
    </span>
  );
}

export default function MakerShop() {
  const [order, setOrder] = useState<JsOrder>("balanced");
  const [cols, setCols] = useState(4);
  const [showNumbers, setShowNumbers] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cart, setCart] = useState<Set<string>>(new Set());

  const items = useMemo(
    () => (loaded ? [...PRODUCTS, ...MORE_PRODUCTS] : PRODUCTS),
    [loaded],
  );
  const sizeOf = (b: Brick) => units(b, CAPTION);

  function loadMore() {
    setLoadingMore(true);
    // skeletons hold the exact reserved boxes for ~1s, then real cards swap in
    window.setTimeout(() => {
      setLoaded(true);
      setLoadingMore(false);
    }, 1100);
  }

  function toggleCart(id: string) {
    setCart((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex min-h-full flex-col">
      <Shell>
        <ScenarioNav active="/scenarios/maker-shop" />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <PageHeader
            eyebrow="Scenario 3 · Commerce grid"
            title="Kiln & Timber — handmade goods"
            lede="A marketplace where card order is money: bestsellers must read first. This wall uses the JS shortest-column engine, so the shop can choose between dense balanced packing and strict left-to-right sequence — and every tile reserves its shape while loading."
          />
          <button
            type="button"
            className="relative rounded-xl bg-stone-900 px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-stone-700"
            aria-label={`Basket, ${cart.size} items`}
          >
            Basket · {cart.size}
          </button>
        </div>

        {/* controls */}
        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface p-3 shadow-[0_1px_2px_rgba(28,25,23,0.05)]">
          <div role="group" aria-label="Packing order" className="flex rounded-lg border border-stone-200 bg-white p-1">
            {(
              [
                ["balanced", "Balanced (shortest column)"],
                ["sequence", "Sequence (left → right)"],
              ] as [JsOrder, string][]
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                aria-pressed={order === v}
                onClick={() => setOrder(v)}
                className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  order === v ? "bg-stone-900 text-white shadow-sm" : "text-stone-500 hover:bg-stone-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
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
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-stone-500">
            <input
              type="checkbox"
              checked={showNumbers}
              onChange={(e) => setShowNumbers(e.target.checked)}
              className="size-4 rounded accent-[#b91c1c]"
            />
            position numbers
          </label>
        </div>

        <p className="mt-3 font-mono text-[11px] text-stone-400" aria-live="polite">
          JS engine · {order === "balanced" ? "each product joins the shortest column" : "products fill left to right, row by row"} ·{" "}
          {items.length} products
        </p>

        <div className="mt-3">
          <Masonry
            items={items}
            cols={cols}
            gap={16}
            engine="js"
            jsOrder={order}
            size={sizeOf}
            keyOf={(p) => p.id}
            renderItem={(p, i) => (
              <article className="overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-[0_1px_3px_rgba(28,25,23,0.08)] transition-shadow hover:shadow-[0_8px_24px_rgba(28,25,23,0.12)]">
                <div className="relative">
                  <BrickArt brick={p} />
                  {showNumbers && (
                    <span
                      className="absolute left-2 top-2 rounded-md bg-stone-900/85 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white"
                      title="Position in catalogue order"
                    >
                      #{i + 1}
                    </span>
                  )}
                  {p.badge && (
                    <span className="absolute right-2 top-2 rounded-full bg-[#b91c1c] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-stone-400">{p.tag}</p>
                  <h3 className="mt-0.5 truncate text-[14px] font-semibold text-stone-800" title={p.title}>
                    {p.title}
                  </h3>
                  <div className="mt-1">
                    <Stars rating={p.rating} />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[15px] font-bold text-stone-900">{p.price}</span>
                    <button
                      type="button"
                      onClick={() => toggleCart(p.id)}
                      aria-pressed={cart.has(p.id)}
                      className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                        cart.has(p.id)
                          ? "bg-emerald-700 text-white hover:bg-emerald-800"
                          : "bg-stone-900 text-white hover:bg-stone-700"
                      }`}
                    >
                      {cart.has(p.id) ? "Added ✓" : "Add"}
                    </button>
                  </div>
                </div>
              </article>
            )}
          />

          {/* load-more with shape-holding skeletons */}
          {loadingMore && (
            <div className="mt-4" aria-hidden>
              <Masonry
                items={MORE_PRODUCTS}
                cols={cols}
                gap={16}
                engine="js"
                jsOrder={order}
                size={sizeOf}
                keyOf={(p) => `sk-${p.id}`}
                renderItem={(p) => (
                  <div className="overflow-hidden rounded-xl border border-stone-200/80 bg-white">
                    <div className="w-full animate-pulse bg-stone-200" style={{ aspectRatio: `${p.w} / ${p.h}` }} />
                    <div className="space-y-2 p-3">
                      <div className="h-3 w-2/3 animate-pulse rounded bg-stone-200" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-stone-200" />
                    </div>
                  </div>
                )}
              />
              <p className="mt-2 text-center font-mono text-[11px] text-stone-400">
                fetching more goods — note the boxes already have their final shape…
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          {!loaded && !loadingMore ? (
            <button
              type="button"
              onClick={loadMore}
              className="rounded-xl border border-stone-300 bg-white px-6 py-3 text-[14px] font-semibold text-stone-800 shadow-sm transition-all hover:border-stone-900 hover:shadow"
            >
              Load 4 more goods
            </button>
          ) : (
            !loadingMore && (
              <p className="font-mono text-[11px] text-stone-400">
                that&apos;s the whole shelf — {items.length} products, zero layout jumps
              </p>
            )
          )}
        </div>

        <div className="mt-6">
          <WhyCard>
            In a shop, position is revenue: the “balanced” mode packs bricks into the shortest
            column for the densest wall, while “sequence” keeps strict catalogue order row by row
            (the react-masonry-css trade-off) at the cost of slightly uneven columns — flip the
            switch with position numbers on and the difference is unmistakable. Load-more proves
            the second lesson from the prompt: skeleton placeholders reserve each tile&apos;s
            aspect ratio, so new stock fades in without shoving a single price off-screen.
          </WhyCard>
        </div>
      </Shell>
      <Footer />
    </div>
  );
}
