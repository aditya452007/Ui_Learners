"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Recipe = {
  name: string;
  tagline: string;
  time: string;
  gradient: string;
  chips: string[];
  ingredients: string[];
  method: string[];
};

const recipes: Recipe[] = [
  {
    name: "Citrus chicken",
    tagline: "Zesty roast with preserved lemon",
    time: "25 min",
    gradient: "from-amber-400 to-orange-500",
    chips: ["Serves 2", "High protein", "Weeknight"],
    ingredients: ["Chicken thighs", "Preserved lemon", "Oregano", "Olive oil"],
    method: [
      "Crisp the thighs skin-side down in a cold pan.",
      "Scatter preserved lemon and oregano over the top.",
      "Roast at 200°C until the skin shatters.",
    ],
  },
  {
    name: "Green shakshuka",
    tagline: "Eggs poached in herby tomato",
    time: "30 min",
    gradient: "from-emerald-500 to-teal-400",
    chips: ["Serves 4", "Vegetarian", "One pan"],
    ingredients: ["Eggs", "Cherry tomatoes", "Baby spinach", "Cumin"],
    method: [
      "Sweat onions, then stir in tomatoes and spinach.",
      "Make wells and crack in the eggs.",
      "Cover and simmer until whites set, yolks runny.",
    ],
  },
  {
    name: "Berry pavlova",
    tagline: "Cloud of meringue, summer berries",
    time: "45 min",
    gradient: "from-rose-500 to-pink-400",
    chips: ["Serves 6", "Vegetarian", "Dessert"],
    ingredients: ["Egg whites", "Caster sugar", "Summer berries", "Double cream"],
    method: [
      "Whisk egg whites with sugar to stiff, glossy peaks.",
      "Spread into a nest and bake low and slow.",
      "Cool fully, then crown with cream and berries.",
    ],
  },
  {
    name: "Sea-salt focaccia",
    tagline: "Pillowy bread, flaky salt",
    time: "2 hr",
    gradient: "from-sky-500 to-indigo-400",
    chips: ["Serves 8", "Vegan", "Bread"],
    ingredients: ["Strong flour", "Instant yeast", "Olive oil", "Sea salt"],
    method: [
      "Mix a slack dough and stretch it every 20 minutes.",
      "Dimple the risen dough with oiled fingers.",
      "Bake hot until deep gold, finish with flaky salt.",
    ],
  },
  {
    name: "Root-veg curry",
    tagline: "Slow-cooked, deeply golden",
    time: "40 min",
    gradient: "from-violet-500 to-fuchsia-400",
    chips: ["Serves 4", "Vegan", "One pot"],
    ingredients: ["Sweet potato", "Coconut milk", "Curry paste", "Fresh lime"],
    method: [
      "Sizzle curry paste until it smells toasted.",
      "Add cubed root veg and coat in the paste.",
      "Pour in coconut milk and simmer until tender.",
    ],
  },
  {
    name: "Herb gnocchi",
    tagline: "Ridged pillows, brown butter",
    time: "35 min",
    gradient: "from-lime-500 to-emerald-400",
    chips: ["Serves 3", "Vegetarian", "Comfort"],
    ingredients: ["Floury potatoes", "Plain flour", "Sage", "Brown butter"],
    method: [
      "Rice potatoes with flour and a pinch of salt.",
      "Roll into ropes and cut pillows, fork-ridged.",
      "Brown in butter with sage until crisp.",
    ],
  },
];

const arrowBase =
  "flex size-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition-colors hover:border-indigo-200 hover:text-indigo-600 disabled:pointer-events-none disabled:opacity-30";

export default function RecipesScenario() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const syncState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.querySelectorAll('[role="group"]'));
    const trackRect = track.getBoundingClientRect();
    const viewCenter = trackRect.left + track.clientWidth / 2;
    let best = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    slides.forEach((slide, i) => {
      const el = slide as HTMLElement;
      const center = el.getBoundingClientRect().left + el.offsetWidth / 2;
      const dist = Math.abs(center - viewCenter);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > 2);
    setCanNext(track.scrollLeft < maxScroll - 2);
  }, []);

  useEffect(() => {
    syncState();
    window.addEventListener("resize", syncState);
    return () => window.removeEventListener("resize", syncState);
  }, [syncState]);

  const cardStep = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const slides = track.querySelectorAll('[role="group"]');
    if (slides.length < 2) return 0;
    const a = (slides[0] as HTMLElement).getBoundingClientRect();
    const b = (slides[1] as HTMLElement).getBoundingClientRect();
    return b.left - a.left;
  };

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    const step = cardStep();
    if (!track || step === 0) return;
    track.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  const scrollToCard = (i: number) => {
    const track = trackRef.current;
    const step = cardStep();
    if (!track || step === 0) return;
    const first = track.querySelector('[role="group"]') as HTMLElement | null;
    const cardWidth = first?.clientWidth ?? step;
    const desired = Math.max(0, i * step - (track.clientWidth - cardWidth) / 2);
    track.scrollTo({ left: desired, behavior: "smooth" });
  };

  const recipe = recipes[selected];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <header className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </span>
            <span className="text-lg font-semibold tracking-tight">Pan &amp; Co.</span>
          </div>
          <div className="hidden items-center gap-6 text-sm text-stone-500 sm:flex">
            <span className="transition-colors hover:text-stone-700">Discover</span>
            <span className="transition-colors hover:text-stone-700">My kitchen</span>
            <span className="transition-colors hover:text-stone-700">Weekly plan</span>
          </div>
        </header>

        <p className="mt-12 font-mono text-xs uppercase tracking-widest text-indigo-600">
          Scenario 03 · Trending row
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Recipe cards, a peek at a time
        </h1>
        <p className="mt-3 max-w-2xl text-stone-500">
          Three cards in view, the next one peeking from the edge — paging moves one card, and
          tapping a card loads it.
        </p>

        <nav className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-stone-500">
          <a href="/" className="transition-colors hover:text-indigo-600">
            ← Hub
          </a>
          <a href="/scenarios/store-hero" className="transition-colors hover:text-indigo-600">
            Store hero
          </a>
          <a href="/scenarios/testimonials" className="transition-colors hover:text-indigo-600">
            Testimonials
          </a>
        </nav>

        <section
          role="region"
          aria-roledescription="carousel"
          aria-label="Trending recipes this week"
          className="mt-14"
        >
          <div className="flex items-center gap-3">
            <p className="font-mono text-xs uppercase tracking-widest text-stone-400">
              Trending this week · 6 recipes
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Previous slide"
              className={arrowBase}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <div
              ref={trackRef}
              onScroll={syncState}
              className="flex flex-1 gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {recipes.map((r, i) => (
                <div
                  key={r.name}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${recipes.length}`}
                  className="w-[85%] shrink-0 snap-center sm:w-[45%] lg:w-[31%]"
                >
                  <button
                    type="button"
                    aria-pressed={selected === i}
                    onClick={() => setSelected(i)}
                    className={`w-full rounded-3xl border bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ${
                      selected === i ? "border-indigo-600 ring-2 ring-indigo-600" : "border-stone-200"
                    }`}
                  >
                    <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${r.gradient}`}>
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-xs text-stone-700 shadow-sm">
                        {r.time}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="absolute -bottom-3 -right-3 h-24 w-24 text-white/25"
                        aria-hidden="true"
                      >
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                      </svg>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-stone-900">{r.name}</h3>
                      <p className="mt-0.5 text-sm text-stone-500">{r.tagline}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {r.chips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Next slide"
              className={arrowBase}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          <div
            role="tablist"
            aria-label="Recipe slides"
            className="mt-6 flex items-center justify-center gap-2"
          >
            {recipes.map((r, i) => (
              <button
                key={r.name}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={`Go to recipe ${i + 1}`}
                onClick={() => scrollToCard(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  active === i ? "w-6 bg-indigo-600" : "w-2 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>

          <div
            aria-live="polite"
            className="mt-8 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-xl">
                <p className="font-mono text-xs uppercase tracking-widest text-indigo-600">
                  Now cooking
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
                  {recipe.name}
                </h3>
                <p className="mt-1.5 text-stone-500">{recipe.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {recipe.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`relative h-20 w-28 shrink-0 rounded-2xl bg-gradient-to-br ${recipe.gradient}`}>
                <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 font-mono text-xs text-stone-700 shadow-sm">
                  {recipe.time}
                </span>
              </div>
            </div>
            <div className="mt-8 grid gap-8 border-t border-stone-100 pt-6 sm:grid-cols-2">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-stone-400">
                  Method
                </p>
                <ol className="mt-4 space-y-4">
                  {recipe.method.map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="pt-0.5 font-mono text-xs text-indigo-600">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-stone-600">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-stone-400">
                  Ingredients
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {recipe.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-sm text-stone-600"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-8 border-t border-stone-100 pt-4 font-mono text-xs text-stone-400">
              Recipe {selected + 1} of {recipes.length}
            </p>
          </div>
        </section>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-widest text-indigo-600">
              Why it fits here
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Browsing recipes means scanning many dishes quickly, so the row keeps everything on
              one screen. The peek of the next card signals that more exist and invites a swipe,
              while one-card paging keeps your place instead of jumping whole pages. Selecting a
              card loads its details inline, so you can compare several dishes without ever
              leaving the page.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-widest text-indigo-600">
              What you can configure
            </p>
            <ul className="mt-3 space-y-2.5 text-sm text-stone-600">
              <li className="flex gap-2">
                <span className="text-indigo-600">·</span>
                <span>
                  Cards per view — the slide widths (85% / 45% / 31%) decide how many cards peek
                  out.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-600">·</span>
                <span>
                  Peek vs full-bleed — keeping the next card visible invites swiping; a full-bleed
                  row hides it.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-600">·</span>
                <span>
                  Selection vs plain link — here a card is a picker that updates the panel; a link
                  variant would navigate away.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
