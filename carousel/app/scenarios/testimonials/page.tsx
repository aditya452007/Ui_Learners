"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SLIDE_COUNT = 5;

const TESTIMONIALS = [
  {
    quote:
      "We went from slack-posting decisions to a single source of truth in two weeks.",
    name: "Maya Chen",
    role: "Head of Product, Northwind Labs",
    initials: "MC",
  },
  {
    quote:
      "The roadmap stopped living in twelve spreadsheets and started living in one place the whole company opens every day.",
    name: "Daniel Okafor",
    role: "Principal PM, Atlas Commerce",
    initials: "DO",
  },
  {
    quote:
      "Design, engineering and marketing finally argue in the same thread instead of three different tools.",
    name: "Sofia Reyes",
    role: "VP Product, Harbour",
    initials: "SR",
  },
  {
    quote:
      "I killed my weekly status meeting — the team reads the workspace, so the meeting only answers what actually needs discussing.",
    name: "Jonas Lindqvist",
    role: "Engineering Lead, Fjord Systems",
    initials: "JL",
  },
  {
    quote:
      "New PMs used to spend their first month hunting for context. Now onboarding is an afternoon of browsing.",
    name: "Priya Raman",
    role: "Product Ops Lead, Brightline",
    initials: "PR",
  },
];

export default function TestimonialsPage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<boolean>(true);
  const [active, setActive] = useState<number>(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const index = Math.round(track.scrollLeft / track.clientWidth);
      setActive(Math.min(Math.max(index, 0), SLIDE_COUNT - 1));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const next =
        (Math.round(track.scrollLeft / track.clientWidth) + 1) % SLIDE_COUNT;
      track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
    }, 5000);
    return () => window.clearInterval(id);
  }, [playing]);

  const jumpTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
    setActive(index);
  };

  return (
    <main className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-14">
        <header className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-indigo-600">
            Scenario 02 · Trust wall
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Testimonials on a landing page
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-stone-500 sm:text-base">
            One voice at a time, on a gentle timer — with a pause button the
            visitor always sees.
          </p>
        </header>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-stone-500">
          <Link href="/" className="transition-colors hover:text-indigo-600">
            ← Hub
          </Link>
          <Link
            href="/scenarios/store-hero"
            className="transition-colors hover:text-indigo-600"
          >
            Store hero
          </Link>
          <Link
            href="/scenarios/recipes"
            className="transition-colors hover:text-indigo-600"
          >
            Recipe row
          </Link>
        </nav>

        <section className="space-y-10">
          <div className="flex items-center justify-between border-b border-stone-200 pb-5">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-500 text-xs font-bold text-white">
                L
              </span>
              <span className="text-sm font-semibold tracking-tight">
                Lumen
              </span>
            </div>
            <div className="hidden items-center gap-8 text-sm text-stone-500 sm:flex">
              <span className="transition-colors hover:text-stone-900">
                Product
              </span>
              <span className="transition-colors hover:text-stone-900">
                Pricing
              </span>
              <span className="transition-colors hover:text-stone-900">
                Customers
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Loved by <span className="text-indigo-600">4,000+</span> product
              teams
            </p>
          </div>

          <div className="mx-auto w-full max-w-2xl space-y-6">
            <section
              role="region"
              aria-roledescription="carousel"
              aria-label="What teams say about Lumen"
            >
              <div
                ref={trackRef}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {TESTIMONIALS.map((testimonial, i) => (
                  <div
                    key={testimonial.name}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${SLIDE_COUNT}`}
                    className="w-full shrink-0 snap-center"
                  >
                    <figure className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-10 text-center shadow-sm">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="mx-auto size-10 text-stone-200"
                      >
                        <path d="M10 7H6a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-4a3 3 0 0 0-3-3Zm-1 7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v4Zm12-7h-4a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-4a3 3 0 0 0-3-3Zm-1 7a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v4Z" />
                      </svg>
                      <blockquote className="text-lg leading-relaxed text-stone-700 sm:text-xl">
                        {testimonial.quote}
                      </blockquote>
                      <figcaption className="mt-8 flex flex-col items-center">
                        <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white">
                          {testimonial.initials}
                        </span>
                        <span className="mt-3 text-sm font-medium">
                          {testimonial.name}
                        </span>
                        <span className="mt-0.5 text-xs text-stone-500">
                          {testimonial.role}
                        </span>
                      </figcaption>
                    </figure>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pause rotation" : "Play rotation"}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:border-indigo-200 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                >
                  {playing ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="size-4"
                    >
                      <rect x="6" y="5" width="4" height="14" rx="1" />
                      <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="size-4"
                    >
                      <path d="M8 5v14l11-7Z" />
                    </svg>
                  )}
                  {playing ? "Pause rotation" : "Play rotation"}
                </button>
              </div>

              <div
                role="tablist"
                aria-label="Testimonials"
                className="mt-5 flex items-center justify-center gap-2"
              >
                {TESTIMONIALS.map((testimonial, i) => (
                  <button
                    key={testimonial.name}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    aria-label={`Go to testimonial ${i + 1}`}
                    onClick={() => jumpTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === active
                        ? "w-6 bg-indigo-600"
                        : "w-2 bg-stone-300 hover:bg-stone-400"
                    }`}
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-white px-6 py-5 text-center shadow-sm">
              <p className="text-lg font-semibold">4.9 / 5</p>
              <p className="mt-1 text-xs text-stone-500">average rating</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white px-6 py-5 text-center shadow-sm">
              <p className="text-lg font-semibold">2 weeks</p>
              <p className="mt-1 text-xs text-stone-500">to adopt</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white px-6 py-5 text-center shadow-sm">
              <p className="text-lg font-semibold">96%</p>
              <p className="mt-1 text-xs text-stone-500">retention</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
            <h2 className="font-mono text-xs uppercase tracking-widest text-indigo-600">
              Why it fits here
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-stone-600">
              A testimonial wall must feel effortless — the timer moves the
              story along without demanding a single click, while the visible
              pause control respects a visitor who wants to read at their own
              pace. Showing one voice at a time keeps each story undistracted,
              with no competing quotes on screen.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
            <h2 className="font-mono text-xs uppercase tracking-widest text-indigo-600">
              What you can configure
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-stone-600">
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-600" />
                <span>
                  <strong className="font-medium text-stone-900">
                    Rotation interval
                  </strong>{" "}
                  — how long each quote stays before sliding to the next (5
                  seconds here).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-600" />
                <span>
                  <strong className="font-medium text-stone-900">
                    Wrap-around vs stop-at-end
                  </strong>{" "}
                  — whether the last slide loops back to the first or comes to
                  a stop.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-600" />
                <span>
                  <strong className="font-medium text-stone-900">
                    Pause on hover
                  </strong>{" "}
                  — letting a reader freeze the rotation by resting the cursor
                  on the carousel.
                </span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
