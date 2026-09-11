"use client";

import { useState } from "react";
import {
  Tabs,
  TabPanel,
  tabId,
  panelId,
  type TabDef,
} from "@/components/tabs";
import {
  BackLink,
  ConfigChips,
  PageHeader,
  ScenarioNav,
  WhyFit,
} from "@/components/chrome";

const TABS: TabDef[] = [
  { id: "description", label: "Description" },
  { id: "specs", label: "Specifications" },
  { id: "reviews", label: "Reviews", badge: 128 },
];

const REVIEWS = [
  {
    name: "Mara K.",
    date: "Aug 28, 2026",
    rating: 5,
    title: "Survived the Cascades",
    body: "Three days of rain and the pages stayed flat. The dot grid is faint enough for writing but present enough for sketching maps.",
    helpful: 41,
  },
  {
    name: "Devon A.",
    date: "Aug 19, 2026",
    rating: 5,
    title: "Lay-flat is the real deal",
    body: "Opens perfectly flat from page one — no cracked spine. Fountain pen with medium nib, zero bleed on the 100 gsm stock.",
    helpful: 27,
  },
  {
    name: "Priya S.",
    date: "Aug 02, 2026",
    rating: 4,
    title: "Great, wishes it had a pen loop",
    body: "Paper quality is excellent for the price. Docking one star because I had to buy a separate pen loop for the cover.",
    helpful: 12,
  },
];

function Stars({ n }: { n: number }) {
  return (
    <span aria-label={`${n} out of 5 stars`} className="text-sm tracking-tight">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? "text-amber-500" : "text-stone-300"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ProductDetails() {
  const [value, setValue] = useState("description");
  const [qty, setQty] = useState(1);
  const [sort, setSort] = useState("Most helpful");
  const [voted, setVoted] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2000);
  }

  function vote(i: number) {
    setVoted((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  const sorted = [...REVIEWS].sort((a, b) =>
    sort === "Highest rated" ? b.rating - a.rating : b.helpful - a.helpful,
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <BackLink />
        <PageHeader
          eyebrow="scenario 1 · commerce"
          title="Product details"
          alsoCalled="Description / Specifications / Reviews"
          lede={
            <p>
              A shop page for the Trailhead Notebook. Shoppers arrive with
              different questions — “what is it?”, “will my pen work?”, “do
              other people love it?” — and underline tabs let each question
              have a full, rich answer without a mile-long scroll.
            </p>
          }
        />
        <ConfigChips
          items={[
            "variant: underline",
            "badge: review count",
            "3 rich panels",
            "auto arrow-key travel",
          ]}
        />

        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          {/* product header stays put while panels swap */}
          <div className="flex flex-col gap-5 border-b border-stone-100 p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="grid w-full shrink-0 place-items-center rounded-xl bg-[#0f766e] p-8 text-white sm:w-44">
              <div className="text-center">
                <p className="font-serif text-5xl font-bold">Tn</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.2em] opacity-80">
                  dot grid · A5
                </p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-400">
                Field series · No. 04
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
                Trailhead Notebook
              </h2>
              <div className="mt-1.5 flex items-center gap-2">
                <Stars n={5} />
                <span className="text-sm text-stone-500">
                  4.6 · 128 reviews
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="text-2xl font-semibold text-stone-900">
                  $24
                  <span className="ml-2 align-middle text-sm font-normal text-stone-400 line-through">
                    $29
                  </span>
                </p>
                <div className="flex items-center rounded-lg border border-stone-200">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-stone-500 transition-colors hover:text-stone-900"
                  >
                    −
                  </button>
                  <span
                    aria-live="polite"
                    className="w-8 text-center text-sm font-semibold"
                  >
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => Math.min(9, q + 1))}
                    className="px-3 py-2 text-stone-500 transition-colors hover:text-stone-900"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    flash(`${qty} × Trailhead Notebook added to cart`)
                  }
                  className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0f766e]"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 pt-4 sm:px-8">
            <Tabs
              tabs={TABS}
              value={value}
              onChange={setValue}
              variant="underline"
              ariaLabel="Product information"
              idPrefix="product"
            />
          </div>

          <div className="p-6 sm:p-8 sm:pt-5">
            <TabPanel
              id={panelId("product", "description")}
              labelledBy={tabId("product", "description")}
              hidden={value !== "description"}
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
                <div className="text-[15px] leading-relaxed text-stone-600">
                  <p>
                    The Trailhead is the notebook we take on every trip:
                    thread-sewn so it opens flat from the first page to the
                    last, with 100&nbsp;gsm paper that takes fountain pens
                    without bleeding through.
                  </p>
                  <p className="mt-3">
                    Every copy funds one kilometer of trail maintenance
                    through our parks partners. The kraft cover scuffs
                    gracefully — each mark is a trip you actually took.
                  </p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {[
                      ["192", "numbered pages"],
                      ["100 gsm", "bleed-proof paper"],
                      ["1 km", "trail funded"],
                    ].map(([n, l]) => (
                      <div
                        key={l}
                        className="rounded-xl bg-stone-50 px-4 py-3 text-center ring-1 ring-stone-100"
                      >
                        <p className="text-xl font-semibold text-stone-900">
                          {n}
                        </p>
                        <p className="text-xs text-stone-500">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <aside className="h-fit rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm">
                  <p className="font-semibold text-stone-900">Good to know</p>
                  <ul className="mt-2 flex flex-col gap-2 text-stone-600">
                    <li>✓ Free shipping over $35</li>
                    <li>✓ 60-day field-test returns</li>
                    <li>✓ Ships plastic-free in 48h</li>
                  </ul>
                </aside>
              </div>
            </TabPanel>

            <TabPanel
              id={panelId("product", "specs")}
              labelledBy={tabId("product", "specs")}
              hidden={value !== "specs"}
            >
              <div className="grid gap-6 lg:grid-cols-2">
                {[
                  {
                    h: "Paper",
                    rows: [
                      ["Stock", "100 gsm, FSC-certified"],
                      ["Ruling", "5 mm dot grid"],
                      ["Opacity", "No show-through to 0.7 mm"],
                    ],
                  },
                  {
                    h: "Build",
                    rows: [
                      ["Binding", "Lay-flat thread-sewn"],
                      ["Cover", "Recycled kraft, water-resistant"],
                      ["Extras", "2 ribbon markers, back pocket"],
                    ],
                  },
                ].map((g) => (
                  <div key={g.h}>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
                      {g.h}
                    </p>
                    <dl className="mt-2 overflow-hidden rounded-xl border border-stone-200">
                      {g.rows.map(([k, v], i) => (
                        <div
                          key={k}
                          className={`grid grid-cols-2 gap-2 px-4 py-2.5 text-sm ${i % 2 ? "bg-white" : "bg-stone-50"}`}
                        >
                          <dt className="font-medium text-stone-500">{k}</dt>
                          <dd className="text-stone-800">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </TabPanel>

            <TabPanel
              id={panelId("product", "reviews")}
              labelledBy={tabId("product", "reviews")}
              hidden={value !== "reviews"}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-stone-600">
                  Showing <span className="font-semibold">3 of 128</span>{" "}
                  reviews
                </p>
                <label className="flex items-center gap-2 text-sm text-stone-600">
                  Sort by
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-sm font-medium text-stone-800"
                  >
                    {["Most helpful", "Highest rated"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-3 flex flex-col gap-3">
                {sorted.map((r, i) => (
                  <article
                    key={r.name}
                    className="rounded-xl border border-stone-200 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="grid size-8 place-items-center rounded-full bg-[#e6f3f1] text-xs font-bold text-[#0f766e]">
                        {r.name[0]}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-stone-900">
                          {r.name}
                        </p>
                        <p className="text-xs text-stone-400">{r.date}</p>
                      </div>
                      <span className="ml-auto">
                        <Stars n={r.rating} />
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-stone-900">
                      {r.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-stone-600">
                      {r.body}
                    </p>
                    <button
                      type="button"
                      aria-pressed={voted.has(i)}
                      onClick={() => vote(i)}
                      className={`mt-2.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        voted.has(i)
                          ? "border-[#0f766e]/50 bg-[#e6f3f1] text-[#0f766e]"
                          : "border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-800"
                      }`}
                    >
                      Helpful ({r.helpful + (voted.has(i) ? 1 : 0)})
                    </button>
                  </article>
                ))}
              </div>
            </TabPanel>
          </div>

          {toast && (
            <div
              role="status"
              className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-4 py-2 text-xs font-medium text-white shadow-lg"
            >
              {toast}
            </div>
          )}
        </section>

        <WhyFit>
          <p>
            Shoppers compare alternatives, not steps — description, specs,
            and reviews are peers answering different questions. Underline
            tabs keep the buy box always visible while the long-form content
            swaps underneath, and the review-count badge tells scanners
            exactly where the social proof lives.
          </p>
        </WhyFit>

        <ScenarioNav
          prev={{ href: "/", label: "Anatomy hub" }}
          next={{ href: "/scenarios/account-settings", label: "Account settings" }}
        />
      </div>
    </main>
  );
}
