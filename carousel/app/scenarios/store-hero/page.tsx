"use client";

import { useEffect, useRef, useState } from "react";

type Campaign = {
  headline: string;
  sub: string;
  tag: string;
  gradient: string;
};

const CAMPAIGNS: Campaign[] = [
  {
    headline: "The Quiet Morning Edit",
    sub: "Slow mornings start with wool, clay and good light.",
    tag: "SS26 · Campaign 01",
    gradient: "from-stone-900 to-stone-700",
  },
  {
    headline: "Summer Living",
    sub: "Linens and ceramics for the long bright season.",
    tag: "SS26 · Campaign 02",
    gradient: "from-rose-500 to-amber-400",
  },
  {
    headline: "Slow Kitchen",
    sub: "Stoneware that holds a week of good food.",
    tag: "SS26 · Campaign 03",
    gradient: "from-teal-600 to-emerald-400",
  },
  {
    headline: "Evening Light",
    sub: "Brass, glass and warm corners for late hours.",
    tag: "SS26 · Campaign 04",
    gradient: "from-indigo-600 to-violet-500",
  },
];

const PRODUCTS = [
  { name: "Stoneware bowl", price: "$48", gradient: "from-stone-300 to-stone-500" },
  { name: "Linen throw", price: "$120", gradient: "from-amber-200 to-rose-300" },
  { name: "Brass lamp", price: "$90", gradient: "from-yellow-400 to-amber-600" },
];

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function Spark() {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className="h-24 w-24 opacity-15">
      <path d="M24 4c.9 9.6 4.4 14.6 14 15.6-9.6 1-13.1 6-14 15.6-.9-9.6-4.4-14.6-14-15.6 9.6-1 13.1-6 14-15.6z" />
      <path d="M40 28c.4 4.6 2.1 7 6.6 7.5-4.5.5-6.2 2.9-6.6 7.5-.4-4.6-2.1-7-6.6-7.5 4.5-.5 6.2-2.9 6.6-7.5z" />
    </svg>
  );
}

export default function StoreHeroPage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number>(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      setActive(Math.round(track.scrollLeft / track.clientWidth));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSlide = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  };

  const goPrev = () => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: -track.clientWidth, behavior: "smooth" });
  };

  const goNext = () => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: track.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-14">
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-indigo-600">
            Scenario 01 · Store Hero
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Flagship hero</h1>
          <p className="max-w-2xl text-stone-600">
            The homepage banner of a premium store — four campaigns, one at a time, paged with
            arrows and dots.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-stone-500">
          <a href="/" className="transition-colors hover:text-indigo-600">
            ← Hub
          </a>
          <a href="/scenarios/testimonials" className="transition-colors hover:text-indigo-600">
            Testimonials
          </a>
          <a href="/scenarios/recipes" className="transition-colors hover:text-indigo-600">
            Recipe row
          </a>
        </nav>

        <div className="space-y-6">
          <header className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
              <span className="text-sm font-semibold tracking-tight">Aster &amp; Co.</span>
              <span className="hidden text-xs text-stone-400 sm:inline">
                curated objects for calm homes
              </span>
            </div>
            <nav className="flex items-center gap-6 text-sm">
              <span className="font-medium text-stone-900">Home</span>
              <span className="text-stone-500">Shop</span>
              <span className="text-stone-500">Journal</span>
            </nav>
          </header>

          <section
            role="region"
            aria-roledescription="carousel"
            aria-label="Aster & Co. seasonal campaigns"
            className="relative"
          >
            <div
              ref={trackRef}
              className="flex snap-x snap-mandatory scroll-smooth overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {CAMPAIGNS.map((campaign, index) => (
                <article
                  key={campaign.tag}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${CAMPAIGNS.length}`}
                  className={`relative h-[440px] w-full shrink-0 snap-center overflow-hidden rounded-3xl shadow-xl sm:h-[520px] bg-gradient-to-br ${campaign.gradient}`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                  <div className="pointer-events-none absolute right-8 top-8 text-white">
                    <Spark />
                  </div>
                  <div className="absolute inset-0 flex items-end p-8 sm:p-12">
                    <div className="max-w-xl space-y-5">
                      <p className="font-mono text-xs uppercase tracking-widest text-white/70">
                        {campaign.tag}
                      </p>
                      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                        {campaign.headline}
                      </h2>
                      <p className="text-white/80">{campaign.sub}</p>
                      <button
                        type="button"
                        className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-900 shadow-lg transition-colors hover:bg-stone-100"
                      >
                        Shop the edit
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              aria-label="Previous slide"
              onClick={goPrev}
              disabled={active === 0}
              className="absolute left-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-900 shadow-lg transition-opacity hover:bg-stone-100 disabled:opacity-30"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={goNext}
              disabled={active === CAMPAIGNS.length - 1}
              className="absolute right-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-900 shadow-lg transition-opacity hover:bg-stone-100 disabled:opacity-30"
            >
              <ChevronRight />
            </button>

            <div
              role="tablist"
              aria-label="Choose campaign"
              className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2"
            >
              {CAMPAIGNS.map((campaign, index) => (
                <button
                  key={campaign.tag}
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => scrollToSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    active === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>

            <div className="absolute bottom-5 right-5 z-10 rounded-full bg-white/20 px-3 py-1 font-mono text-xs text-white backdrop-blur">
              {active + 1} / {CAMPAIGNS.length}
            </div>
          </section>

          <section aria-label="What's in the shop" className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest text-stone-400">
              What&apos;s in the shop
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {PRODUCTS.map((product) => (
                <div
                  key={product.name}
                  className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                >
                  <div
                    className={`h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br ${product.gradient}`}
                  />
                  <div>
                    <p className="text-sm font-semibold tracking-tight">{product.name}</p>
                    <p className="font-mono text-sm text-stone-500">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="font-mono text-xs uppercase tracking-widest text-indigo-600">
            Why it fits here
          </p>
          <p className="mt-3 leading-relaxed text-stone-700">
            The hero must say one thing at a time — the carousel swaps the entire stage per
            campaign, so each launch gets its own full moment. Arrows give deliberate pacing:
            unlike auto-rotation, the visitor decides how long the hero stays. And the dots show
            at a glance that more campaigns exist, inviting a click instead of demanding one.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="font-mono text-xs uppercase tracking-widest text-indigo-600">
            What you can configure
          </p>
          <ul className="mt-3 space-y-2 font-mono text-xs text-stone-600">
            <li className="flex gap-2">
              <span className="text-indigo-600">·</span>
              <span>slide count — a seasonal hero runs four, a sale teaser may run two</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-600">·</span>
              <span>gradient art vs imagery — flat art stays fast; photos add mood but load heavier</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-600">·</span>
              <span>arrows on the sides vs counter chip — both help, but crowded heroes may keep one</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
