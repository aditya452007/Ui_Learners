"use client";

import { useMemo, useState } from "react";
import { LevelIndicator } from "../../LevelIndicator";
import { ScenarioNav } from "../../ScenarioNav";

const MOVIES = [
  {
    id: "lanterns",
    title: "Paper Lanterns",
    year: 2024,
    genre: "Drama",
    blurb: "Two estranged sisters run a night market stall for one last summer.",
    critic: 4.2,
    tint: "bg-rose-100 text-rose-700",
    initial: "P",
  },
  {
    id: "ferry",
    title: "Slow Ferry Home",
    year: 2023,
    genre: "Documentary",
    blurb: "A year aboard the last passenger ferry on the northern route.",
    critic: 4.7,
    tint: "bg-sky-100 text-sky-700",
    initial: "S",
  },
  {
    id: "glasswing",
    title: "Glasswing Morning",
    year: 2025,
    genre: "Sci-fi",
    blurb: "A botanist discovers a greenhouse that grows yesterday's weather.",
    critic: 3.8,
    tint: "bg-emerald-100 text-emerald-700",
    initial: "G",
  },
  {
    id: "midnight",
    title: "Midnight Cartography",
    year: 2022,
    genre: "Mystery",
    blurb: "A mapmaker's atlas starts redrawing a city that was never built.",
    critic: 4.0,
    tint: "bg-indigo-100 text-indigo-700",
    initial: "M",
  },
  {
    id: "harbor",
    title: "Harbor Lights",
    year: 2024,
    genre: "Comedy",
    blurb: "A lighthouse crew competes to host the town's worst talent night.",
    critic: 3.4,
    tint: "bg-amber-100 text-amber-700",
    initial: "H",
  },
];

export default function RatingsPage() {
  const [mine, setMine] = useState<Record<string, number>>({
    lanterns: 4,
    ferry: 5,
    glasswing: 0,
    midnight: 3,
    harbor: 0,
  });
  const [announce, setAnnounce] = useState("");

  const rated = useMemo(
    () => MOVIES.filter((m) => (mine[m.id] ?? 0) > 0),
    [mine]
  );
  const avg =
    rated.length === 0
      ? 0
      : rated.reduce((a, m) => a + (mine[m.id] ?? 0), 0) / rated.length;

  const rate = (id: string, v: number, title: string) => {
    setMine((prev) => ({ ...prev, [id]: v }));
    setAnnounce(
      v === 0
        ? `Cleared your rating for ${title}.`
        : `Rated ${title} ${v} of 5 stars.`
    );
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <ScenarioNav current="/scenarios/movie-ratings/" />
        <header className="max-w-2xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#0071e3]">
            Scenario 2 · Style.rating · 5 symbols, no thresholds
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Movie ratings in a catalog app
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
            Reelbox — click a star to rate, click it again to clear. Each row
            is the symbol-based style: five repeated rating symbols, filled
            through the current value. Hover or arrow-key through them.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section
            aria-label="Movies to rate"
            className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] sm:p-6"
          >
            <div aria-live="polite" className="sr-only">
              {announce}
            </div>
            {MOVIES.map((m) => {
              const v = mine[m.id] ?? 0;
              return (
                <article
                  key={m.id}
                  className="flex gap-4 rounded-xl border border-stone-200 bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <div
                    className={`grid size-16 shrink-0 place-items-center rounded-xl font-serif text-2xl font-bold ${m.tint}`}
                    aria-hidden="true"
                  >
                    {m.initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h2 className="text-[15px] font-semibold text-stone-900">
                        {m.title}
                      </h2>
                      <span className="font-mono text-[11px] text-stone-400">
                        {m.year} · {m.genre} · critics {m.critic.toFixed(1)}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[13px] leading-relaxed text-stone-600">
                      {m.blurb}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <LevelIndicator
                        levelStyle="rating"
                        min={0}
                        max={5}
                        value={v}
                        maxRating={5}
                        interactive
                        onChange={(nv) => rate(m.id, nv, m.title)}
                        ariaLabel={`Your rating for ${m.title}`}
                      />
                      <span className="font-mono text-[11px] text-stone-500">
                        {v === 0 ? "unrated" : `${v} / 5`}
                      </span>
                      {v > 0 && (
                        <button
                          type="button"
                          onClick={() => rate(m.id, 0, m.title)}
                          className="rounded-md border border-stone-200 px-2 py-0.5 text-[12px] text-stone-500 transition-colors hover:border-red-300 hover:text-red-600"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="flex flex-col gap-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <p className="text-sm font-semibold text-stone-900">Your ballot</p>
              {rated.length === 0 ? (
                <p className="mt-2 text-[13px] leading-relaxed text-stone-600">
                  Nothing rated yet — the stars above are empty symbols waiting
                  for a value. Rate one film and this summary fills in.
                </p>
              ) : (
                <>
                  <div className="mt-3 flex items-center gap-3">
                    <LevelIndicator
                      levelStyle="rating"
                      min={0}
                      max={5}
                      value={Math.round(avg)}
                      maxRating={5}
                      ariaLabel={`Your average rating ${avg.toFixed(1)}`}
                    />
                    <p className="font-mono text-[13px] text-stone-600">
                      avg <span className="font-bold text-stone-900">{avg.toFixed(1)}</span>
                      {" · "}
                      {rated.length}/{MOVIES.length} rated
                    </p>
                  </div>
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {rated.map((m) => (
                      <li
                        key={m.id}
                        className="flex items-center gap-2 text-[13px] text-stone-600"
                      >
                        <span className="font-medium text-stone-900">{m.title}</span>
                        <span className="font-mono text-[11px] text-amber-600">
                          {"★".repeat(mine[m.id] ?? 0)}
                          <span className="text-stone-300">
                            {"★".repeat(5 - (mine[m.id] ?? 0))}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      setMine({});
                      setAnnounce("Cleared all ratings.");
                    }}
                    className="mt-4 rounded-lg border border-stone-200 px-3 py-1.5 text-[13px] font-medium text-stone-600 transition-colors hover:border-red-300 hover:text-red-600"
                  >
                    Clear all ratings
                  </button>
                </>
              )}
              <p className="mt-4 border-t border-stone-100 pt-3 font-mono text-[11px] leading-relaxed text-stone-400">
                NSLevelIndicator.Style.rating · maxValue = 5 · each symbol is a
                radio option · no warningValue here
              </p>
            </div>
            <div className="rounded-2xl border border-[#0071e3]/25 bg-[#f0f7ff] p-5">
              <p className="text-sm font-semibold text-stone-900">Why it fits here</p>
              <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
                An opinion is a <em>level on a tiny fixed scale</em> — 3 of 5,
                not 62%. Repeated symbols make the scale countable at a glance,
                and because every star is its own button the control is
                operable by mouse, touch and arrow keys, which keeps ratings
                fast and error-free.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
