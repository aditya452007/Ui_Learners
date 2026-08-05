"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { ReactNode } from "react";

const slides = [
  {
    num: "01",
    title: "Campaign 01",
    sub: "Summer launch",
    gradient: "from-indigo-600 to-violet-600",
  },
  {
    num: "02",
    title: "Campaign 02",
    sub: "Field notes",
    gradient: "from-amber-500 to-rose-500",
  },
  {
    num: "03",
    title: "Campaign 03",
    sub: "Studio sessions",
    gradient: "from-emerald-600 to-teal-500",
  },
  {
    num: "04",
    title: "Campaign 04",
    sub: "Year in review",
    gradient: "from-sky-600 to-indigo-500",
  },
];

const scenarios = [
  {
    href: "/scenarios/store-hero",
    title: "Flagship hero",
    tag: "large format",
    desc: "The front-page banner that leads a store launch — big, cinematic, one message at a time.",
  },
  {
    href: "/scenarios/testimonials",
    title: "Trust wall",
    tag: "autoplay + pause",
    desc: "Customer quotes that rotate on their own, with a pause button for anyone who wants to read.",
  },
  {
    href: "/scenarios/recipes",
    title: "Trending row",
    tag: "multi-card peek",
    desc: "A row that peeks the next card past the edge, inviting you to swipe through the week's hits.",
  },
];

function Pill({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-stone-200">
      <span className="flex size-6 items-center justify-center rounded-full border-2 border-stone-200 bg-white text-xs font-semibold text-stone-700">
        {n}
      </span>
      <span className="font-mono text-[11px] text-stone-500">{children}</span>
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState<number>(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  };

  const scrollPrev = () => {
    const track = trackRef.current;
    if (!track || active === 0) return;
    track.scrollBy({ left: -track.clientWidth, behavior: "smooth" });
  };

  const scrollNext = () => {
    const track = trackRef.current;
    if (!track || active === slides.length - 1) return;
    track.scrollBy({ left: track.clientWidth, behavior: "smooth" });
  };

  const scrollToSlide = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="space-y-16">
          <header className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-indigo-600">
              NAMETHATUI · WEB COMPONENT
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Carousel
            </h1>
            <p className="mt-3 text-stone-500">
              Also called: slider, content slider, slideshow, image slider,
              swiper
            </p>
            <p className="mt-2 text-stone-500">
              A strip of slides you page through one at a time with arrow
              buttons or the little dots.
            </p>
          </header>

          <section>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-stone-100 font-mono text-xs font-semibold text-stone-500">
                    1
                  </span>
                  <h3 className="font-semibold tracking-tight">The track</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  The horizontal strip that holds every slide.
                </p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-stone-100 font-mono text-xs font-semibold text-stone-500">
                    2
                  </span>
                  <h3 className="font-semibold tracking-tight">The slide</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  One full-width panel — exactly one visible at a time.
                </p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-stone-100 font-mono text-xs font-semibold text-stone-500">
                    3
                  </span>
                  <h3 className="font-semibold tracking-tight">The controls</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  Arrows page the track; the dots jump to a slide.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="relative pt-14 pb-16">
              <section
                role="region"
                aria-roledescription="carousel"
                aria-label="Anatomy of a carousel"
                className="relative"
              >
                <div
                  ref={trackRef}
                  onScroll={handleScroll}
                  className="flex h-[380px] overflow-x-auto snap-x snap-mandatory scroll-smooth rounded-3xl shadow-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {slides.map((s, i) => (
                    <div
                      key={s.num}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${i + 1} of 4`}
                      className={`relative w-full shrink-0 snap-center bg-gradient-to-br ${s.gradient}`}
                    >
                      <div className="absolute -top-16 -right-16 size-56 rounded-full bg-white/10 blur-2xl" />
                      <div className="absolute -bottom-20 -left-10 size-48 rounded-full bg-black/10 blur-2xl" />
                      <div className="relative flex h-full flex-col justify-between p-8">
                        <span className="w-fit rounded-full bg-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white">
                          Slide {s.num}
                        </span>
                        <div>
                          <div className="text-5xl font-bold tracking-tight text-white">
                            {s.num}
                          </div>
                          <h3 className="mt-1 text-xl font-semibold text-white">
                            {s.title}
                          </h3>
                          <p className="text-sm text-white/80">{s.sub}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute top-5 left-5 rounded-full bg-black/20 px-3 py-1 font-mono text-xs text-white backdrop-blur">
                  {active + 1} / 4
                </div>

                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={scrollPrev}
                  disabled={active === 0}
                  className="absolute top-1/2 left-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition-all hover:border-stone-300 hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-30"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={scrollNext}
                  disabled={active === slides.length - 1}
                  className="absolute top-1/2 right-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition-all hover:border-stone-300 hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-30"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>

                <div className="pointer-events-none absolute top-1/2 right-14 flex -translate-y-1/2 items-center">
                  <Pill n={2}>Previous / Next controls</Pill>
                  <div className="h-px w-10 bg-stone-300" />
                </div>
              </section>

              <p
                aria-live="polite"
                className="mt-5 text-center font-mono text-xs text-stone-500"
              >
                active slide: {active + 1} of 4 — role=&quot;group&quot;{" "}
                aria-roledescription=&quot;slide&quot;
              </p>

              <div
                role="tablist"
                aria-label="Slide picker"
                className="mt-5 flex items-center justify-center gap-2.5"
              >
                {slides.map((s, i) => (
                  <button
                    key={s.num}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => scrollToSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === active
                        ? "w-6 bg-indigo-600"
                        : "w-2 bg-stone-300 hover:bg-stone-400"
                    }`}
                  />
                ))}
              </div>

              <div className="absolute top-0 right-8 flex flex-col items-center">
                <Pill n={1}>Slide · {active + 1} of 4</Pill>
                <div className="h-5 w-px bg-stone-300" />
              </div>

              <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center">
                <div className="h-7 w-px bg-stone-300" />
                <Pill n={3}>Slide picker · the dots</Pill>
              </div>
            </div>
          </section>

          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-indigo-600">
              Layered explanations
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Anatomy, explained for two readers
            </h2>
            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-full border-2 border-stone-200 bg-white text-xs font-semibold text-stone-700">
                    1
                  </span>
                  <h3 className="font-semibold tracking-tight">Slide</h3>
                  <span className="ml-auto font-mono text-[11px] text-stone-400">
                    aria-roledescription=&quot;slide&quot;
                  </span>
                </div>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-stone-400">
                      What you see
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      One panel at a time, like pages in a magazine — a photo,
                      card or message filling the whole strip. You only ever
                      concentrate on a single slide, so nothing fights for your
                      attention. Paging through feels calm and predictable:
                      exactly one new view per gesture.
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-stone-400">
                      How it works
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      Each slide is a panel exactly as wide as the track,
                      lined up side by side — like pages glued into one long
                      folded strip. CSS scroll-snap makes the strip settle on a
                      slide after you scroll, like a lock clicking into place,
                      with no JavaScript needed to stop in the right spot. The
                      &quot;2 of 4&quot; label is an ARIA attribute — extra
                      text handed to screen readers so they announce your
                      position.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-full border-2 border-stone-200 bg-white text-xs font-semibold text-stone-700">
                    2
                  </span>
                  <h3 className="font-semibold tracking-tight">
                    Previous / Next controls
                  </h3>
                  <span className="ml-auto font-mono text-[11px] text-stone-400">
                    scrollBy(&plusmn;1 slide)
                  </span>
                </div>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-stone-400">
                      What you see
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      Two arrow buttons that move exactly one slide per click,
                      so you always know where you are. At the ends the arrows
                      grey out — a quiet signal that there is nowhere else to
                      go.
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-stone-400">
                      How it works
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      Clicking a button fires an event — a message that
                      something happened. A handler, a function that responds
                      to that message, asks the strip to scroll by exactly one
                      slide width. React remembers which slide is showing in
                      state — values the component keeps between clicks — and
                      when state says you are at the first or last slide, that
                      button renders, gets drawn, as disabled.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-full border-2 border-stone-200 bg-white text-xs font-semibold text-stone-700">
                    3
                  </span>
                  <h3 className="font-semibold tracking-tight">
                    Slide picker (the dots)
                  </h3>
                  <span className="ml-auto font-mono text-[11px] text-stone-400">
                    role=&quot;tablist&quot;
                  </span>
                </div>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-stone-400">
                      What you see
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      One small dot per slide, lined up under the carousel. The
                      filled dot marks where you are; clicking any other dot
                      jumps straight to that slide — a shortcut that beats
                      clicking &quot;next&quot; seven times.
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-stone-400">
                      How it works
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      The dots are a tablist — a row of buttons the
                      accessibility layer understands like the tabs of a
                      folder. Each button remembers its index, its number
                      position in the row, and clicking asks the strip to
                      scroll to that slide. The active dot carries
                      aria-selected=&quot;true&quot;, so screen readers
                      announce it, and the accent color fills it in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-indigo-600">
              Accessibility
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              The ARIA anatomy
            </h2>
            <div className="mt-6 space-y-2 rounded-2xl bg-stone-900 p-6 font-mono text-xs leading-relaxed text-stone-100 shadow-sm">
              <div>
                <span className="text-stone-500">{"<section "}</span>
                <span className="text-indigo-300">role</span>
                <span className="text-stone-400">="region" </span>
                <span className="text-indigo-300">aria-roledescription</span>
                <span className="text-stone-400">="carousel" </span>
                <span className="text-indigo-300">aria-label</span>
                <span className="text-stone-400">="Anatomy of a carousel"</span>
              </div>
              <div className="pl-4">
                <span className="text-stone-500">{"<div "}</span>
                <span className="text-indigo-300">role</span>
                <span className="text-stone-400">="group" </span>
                <span className="text-indigo-300">aria-roledescription</span>
                <span className="text-stone-400">="slide" </span>
                <span className="text-indigo-300">aria-label</span>
                <span className="text-stone-400">="2 of 4"</span>
              </div>
              <div className="pl-4">
                <span className="text-stone-500">{"<div "}</span>
                <span className="text-indigo-300">role</span>
                <span className="text-stone-400">="tablist"</span>
              </div>
              <div className="pl-8">
                <span className="text-stone-500">{"<button "}</span>
                <span className="text-indigo-300">role</span>
                <span className="text-stone-400">="tab" </span>
                <span className="text-indigo-300">aria-selected</span>
                <span className="text-stone-400">="true"</span>
              </div>
            </div>
          </section>

          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-indigo-600">
              Scenarios
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              See it in the wild →
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {scenarios.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group block rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
                >
                  <p className="font-mono text-[11px] uppercase tracking-widest text-indigo-600">
                    {s.tag}
                  </p>
                  <h3 className="mt-2 font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone-500">
                    {s.desc}
                  </p>
                  <p className="mt-4 font-mono text-xs text-indigo-600 transition-transform group-hover:translate-x-0.5">
                    →
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
