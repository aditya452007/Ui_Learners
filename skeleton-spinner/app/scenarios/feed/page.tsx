"use client";

import { useEffect, useRef, useState } from "react";
import { ScenarioNav, Skeleton, Spinner, TopBar } from "../../components/ui";

type Article = {
  id: string;
  tag: string;
  title: string;
  excerpt: string;
  author: string;
  time: string;
  gradient: string;
  initials: string;
};

const ARTICLES: Article[] = [
  {
    id: "a1",
    tag: "Fjords",
    title: "Kayaking the quiet side of Geirangerfjord",
    excerpt: "Mist, still water, and a morning without engines.",
    author: "Marit Knudsen",
    time: "8 min read",
    gradient: "from-teal-800 via-teal-600 to-teal-400",
    initials: "MK",
  },
  {
    id: "a2",
    tag: "Baking",
    title: "The 6 a.m. cardamom bun run in Grünerløkka",
    excerpt: "Oslo's bakeries compete before the trams wake up.",
    author: "Jonas Dahl",
    time: "5 min read",
    gradient: "from-amber-700 via-amber-500 to-yellow-400",
    initials: "JD",
  },
  {
    id: "a3",
    tag: "Design",
    title: "Why Bergen's new library has no signs",
    excerpt: "Wayfinding by light, wood, and 400 windows.",
    author: "Priya Nair",
    time: "11 min read",
    gradient: "from-stone-700 via-stone-500 to-stone-300",
    initials: "PN",
  },
  {
    id: "a4",
    tag: "Trains",
    title: "Oslo → Bodø: 18 hours on the Nordland line",
    excerpt: "Reindeer, aurora, and the world's slowest good time.",
    author: "Elias Berg",
    time: "14 min read",
    gradient: "from-sky-800 via-sky-600 to-sky-300",
    initials: "EB",
  },
  {
    id: "a5",
    tag: "Coffee",
    title: "Tromsø roasts through the polar night",
    excerpt: "How darkness became a flavour profile.",
    author: "Sofia Lima",
    time: "6 min read",
    gradient: "from-orange-900 via-orange-600 to-amber-400",
    initials: "SL",
  },
  {
    id: "a6",
    tag: "Sauna",
    title: "A field guide to floating saunas",
    excerpt: "Twelve docks, one plunge, zero regrets.",
    author: "Anders Moe",
    time: "9 min read",
    gradient: "from-cyan-800 via-cyan-600 to-teal-300",
    initials: "AM",
  },
];

function SkeletonCard() {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="space-y-2.5 p-4">
        <Skeleton className="h-4 w-[88%]" />
        <Skeleton className="h-3.5 w-[64%]" />
        <div className="flex items-center gap-2.5 pt-1.5">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </article>
  );
}

function ArticleCard({ a }: { a: Article }) {
  return (
    <article className="animate-pop-in overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(28,25,23,0.10)]">
      <div
        className={`flex h-40 items-start justify-between bg-gradient-to-br p-3 ${a.gradient}`}
      >
        <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
          {a.tag}
        </span>
        <span className="rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
          {a.time}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-[15px] font-semibold leading-snug">{a.title}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-text-muted">
          {a.excerpt}
        </p>
        <div className="flex items-center gap-2.5 pt-3">
          <span className="grid size-8 place-items-center rounded-full bg-stone-900 text-[11px] font-semibold text-white">
            {a.initials}
          </span>
          <span className="text-[12.5px] text-text-muted">{a.author}</span>
        </div>
      </div>
    </article>
  );
}

export default function FeedPage() {
  const [loading, setLoading] = useState(true);
  const [speed, setSpeed] = useState<900 | 2600>(2600);
  const [mode, setMode] = useState<"skeleton" | "spinner">("skeleton");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reload = () => {
    if (timer.current) clearTimeout(timer.current);
    setLoading(true);
    timer.current = setTimeout(() => setLoading(false), speed);
  };

  useEffect(() => {
    timer.current = setTimeout(() => setLoading(false), speed);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, mode]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-teal-700">
          Scenario 1 · Skeleton · layout known
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Magazine feed that holds its shape
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
          <strong className="font-semibold text-foreground">Why it fits here:</strong>{" "}
          a feed&apos;s card geometry is fully known — image, headline, byline —
          so skeletons preserve it while stories load. Readers keep their scroll
          position, nothing jumps, and the page feels faster than it is.
        </p>

        {/* controls */}
        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface p-4">
          <button
            onClick={reload}
            className="rounded-full bg-stone-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-teal-700"
          >
            ↺ Reload feed
          </button>
          <div className="flex rounded-full border border-border p-0.5 text-[13px] font-medium">
            {(
              [
                { v: 900, l: "Fast (0.9s)" },
                { v: 2600, l: "Slow 3G (2.6s)" },
              ] as const
            ).map((s) => (
              <button
                key={s.v}
                onClick={() => setSpeed(s.v)}
                aria-pressed={speed === s.v}
                className={`rounded-full px-3.5 py-1.5 transition ${
                  speed === s.v
                    ? "bg-stone-900 text-white"
                    : "text-text-muted hover:text-foreground"
                }`}
              >
                {s.l}
              </button>
            ))}
          </div>
          <div className="flex rounded-full border border-border p-0.5 text-[13px] font-medium">
            <button
              onClick={() => setMode("skeleton")}
              aria-pressed={mode === "skeleton"}
              className={`rounded-full px-3.5 py-1.5 transition ${
                mode === "skeleton"
                  ? "bg-teal-700 text-white"
                  : "text-text-muted hover:text-foreground"
              }`}
            >
              ✓ Skeleton (correct)
            </button>
            <button
              onClick={() => setMode("spinner")}
              aria-pressed={mode === "spinner"}
              className={`rounded-full px-3.5 py-1.5 transition ${
                mode === "spinner"
                  ? "bg-amber-500 text-white"
                  : "text-text-muted hover:text-foreground"
              }`}
            >
              Spinner (watch it jump)
            </button>
          </div>
          <span
            className={`ml-auto rounded-full px-3 py-1.5 font-mono text-[11px] ${
              loading ? "bg-amber-100 text-amber-900" : "bg-teal-100 text-teal-900"
            }`}
            aria-live="polite"
          >
            {loading ? 'aria-busy="true" — loading…' : "loaded — 6 stories"}
          </span>
        </div>

        {mode === "spinner" && (
          <div className="mt-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-[13px] leading-relaxed text-amber-900">
            <strong>Compare mode:</strong> the whole grid collapses into one
            spinner. When stories arrive, everything below this point jumps.
            That jump is <em>cumulative layout shift</em> — exactly what
            skeletons prevent. Scroll down a little, hit reload, and feel it.
          </div>
        )}

        {/* content region */}
        <section
          aria-busy={loading}
          aria-label="Magazine articles"
          className="mt-5 min-h-[420px]"
        >
          {loading ? (
            mode === "skeleton" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ARTICLES.map((a) => (
                  <SkeletonCard key={a.id} />
                ))}
              </div>
            ) : (
              <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-surface py-24">
                <div className="flex flex-col items-center gap-3">
                  <Spinner size={48} label="Loading articles…" />
                  <p className="text-sm text-text-muted">
                    Loading articles… (no shape held)
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ARTICLES.map((a) => (
                <ArticleCard key={a.id} a={a} />
              ))}
            </div>
          )}
        </section>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-5 text-[13px] leading-relaxed text-text-muted">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]">
            What to notice
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              Skeleton cards use the <em>exact</em> heights of real cards
              (<code className="font-mono">h-40</code> image, same padding) — the
              footer below never moves.
            </li>
            <li>
              Text lines use ragged widths (88% / 64%) so they read as copy
              rhythm, not bars.
            </li>
            <li>
              Skeletons are <code className="font-mono">aria-hidden</code>; the
              grid&apos;s <code className="font-mono">aria-busy</code> carries
              the announcement. Fake lines are never read aloud.
            </li>
          </ul>
        </div>

        <ScenarioNav
          next={{ href: "/scenarios/checkout", label: "Checkout payment" }}
        />
      </main>
    </div>
  );
}
