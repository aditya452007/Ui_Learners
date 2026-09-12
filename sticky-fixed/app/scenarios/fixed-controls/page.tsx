"use client";

import { useEffect, useRef, useState } from "react";
import { ScenarioNav } from "../../components/scenario-nav";

const SPECS: [string, string][] = [
  ["Capacity", "28 L · fits a 16″ laptop in a suspended sleeve"],
  ["Weight", "1.1 kg · recycled 900D shell, PFC-free DWR"],
  ["Carry", "Padded straps + load lifters · sternum + hip belt"],
  ["Access", "Full clamshell zip · side bottle + hidden passport pocket"],
  ["Warranty", "Lifetime repairs — send it back, we stitch it"],
];

const REVIEWS = [
  { who: "Mara K.", stars: 5, text: "Carried it through three airports and a downpour. Laptop stayed bone dry, straps never dug in." },
  { who: "Devon A.", stars: 5, text: "The clamshell opening is the killer feature — packs like a suitcase, carries like a backpack." },
  { who: "June P.", stars: 4, text: "Wish the hip belt pockets were bigger, but the bottle pocket swallows a 1L Nalgene whole." },
];

export default function FixedControlsPage() {
  const [buyBar, setBuyBar] = useState(true);
  const [helpFab, setHelpFab] = useState(true);
  const [trap, setTrap] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [bag, setBag] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const heroSentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroSentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const addToBag = () => {
    setBag((b) => b + 1);
    setToast("Added to bag — Trailhead 28L, Moss.");
  };

  const page = (
    <div>
      {/* sticky sub-nav: the contrast */}
      <div className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-1 overflow-x-auto px-4 py-2">
          {["Overview", "Specs", "Reviews", "Shipping"].map((l, i) => (
            <a
              key={l}
              href={`#fixed-${l.toLowerCase()}`}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                i === 0 ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {l}
            </a>
          ))}
          <span className="ml-auto hidden rounded-full bg-teal-50 px-2.5 py-1 font-mono text-[10px] font-bold text-teal-800 ring-1 ring-inset ring-teal-700/20 sm:inline">
            sticky sub-nav · top: 0
          </span>
        </div>
      </div>

      {/* hero */}
      <div className="mx-auto w-full max-w-3xl px-4 pt-8">
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="grid sm:grid-cols-2">
            <div className="flex min-h-56 flex-col justify-between bg-stone-900 p-6 text-white">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-teal-300">
                  Trailhead 28L · Moss
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  The bag that packs like a suitcase.
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-stone-300">
                  Clamshell access, a suspended laptop sleeve, and a shell that
                  shrugs off weather. Rated 4.8 by 2,314 hikers and commuters.
                </p>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold">$189</span>
                <span className="text-sm text-stone-400 line-through">$229</span>
                <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[11px] font-bold text-teal-200">
                  Launch price
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-2 bg-[#f5f4f2] p-6">
              {["Full clamshell zip — no more digging", "Suspended 16″ laptop sleeve", "1L side bottle pocket", "Lifetime repair warranty"].map((f) => (
                <p key={f} className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-[13px] text-stone-700">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-teal-700 text-[10px] font-bold text-white">✓</span>
                  {f}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div ref={heroSentinel} aria-hidden className="h-px" />
      </div>

      {/* long content */}
      <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8">
        <section id="fixed-overview" className="scroll-mt-16 rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-stone-900">Overview</h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Most product pages bury the buy button under a kilometre of
            storytelling — specs, reviews, shipping tables — and hope you scroll
            back up. This page doesn&apos;t. The moment the hero leaves the
            screen, a buy bar pins itself to the viewport: price, colour, and
            add-to-bag, always one tap away. Keep scrolling — the bar ignores
            every section, every container, every scrollbar but the
            window&apos;s own.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Right above it floats the help button: same deal, pinned to the
            viewport&apos;s corner. Contrast both with the sub-nav at the top of
            this column — that one is sticky, so it stops dead at the footer
            while the fixed pair sail on.
          </p>
        </section>
        <section id="fixed-specs" className="scroll-mt-16 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <h2 className="px-6 pt-5 text-lg font-semibold text-stone-900">Specs</h2>
          <dl className="mt-2 divide-y divide-stone-100">
            {SPECS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[140px_1fr] gap-3 px-6 py-3 text-sm">
                <dt className="font-semibold text-stone-900">{k}</dt>
                <dd className="text-stone-600">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section id="fixed-reviews" className="scroll-mt-16 rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-stone-900">Reviews</h2>
          <div className="mt-3 space-y-3">
            {REVIEWS.map((r) => (
              <figure key={r.who} className="rounded-xl border border-stone-200 bg-[#fafaf9] p-4">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-full bg-stone-900 text-xs font-bold text-white">
                    {r.who[0]}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-stone-900">{r.who}</p>
                    <p className="text-xs text-amber-500">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</p>
                  </div>
                </div>
                <blockquote className="mt-2 text-[13px] leading-relaxed text-stone-600">“{r.text}”</blockquote>
              </figure>
            ))}
          </div>
        </section>
        <section id="fixed-shipping" className="scroll-mt-16 rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-stone-900">Shipping &amp; returns</h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Free carbon-neutral shipping over $75 · 60-day trail-tested returns ·
            lifetime repairs. Notice the sticky sub-nav stops here at the
            footer boundary — while the fixed buy bar (if enabled) keeps
            floating. That difference is the whole lesson.
          </p>
        </section>
        <div className="rounded-2xl border border-stone-300 bg-stone-900 p-5 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone-400">Footer boundary</p>
          <p className="mt-1 text-sm text-stone-200">Sticky stops here · fixed sails on</p>
        </div>
        <div className="h-10" />
      </div>
    </div>
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-6">
        <ScenarioNav
          current="/scenarios/fixed-controls"
          note="Scenario 3 · Product page — fixed buy bar + help button anchored to the viewport, beside a sticky sub-nav that stops at the footer. Flip on the transform trap to watch fixed break live."
        />
        <header className="max-w-3xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-teal-700">
            Scenario 3 · viewport controls · position: fixed
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Trailhead 28L product page
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            A long backpack page with three kinds of pinning at once.{" "}
            <strong>Why fixed fits here:</strong> buying and getting help are
            relevant in <em>every</em> section — specs, reviews, shipping — so
            those controls must survive all scrolling, independent of every
            container. The sub-nav is sticky instead: section navigation belongs
            to this column, so it politely stops at the footer.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            role="switch"
            aria-checked={buyBar}
            onClick={() => setBuyBar((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 hover:border-teal-700/40"
          >
            <span className={`relative h-4 w-7 rounded-full transition-colors ${buyBar ? "bg-teal-700" : "bg-stone-300"}`}>
              <span className={`absolute top-0.5 size-3 rounded-full bg-white shadow transition-all ${buyBar ? "left-3.5" : "left-0.5"}`} />
            </span>
            fixed buy bar
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={helpFab}
            onClick={() => setHelpFab((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 hover:border-teal-700/40"
          >
            <span className={`relative h-4 w-7 rounded-full transition-colors ${helpFab ? "bg-teal-700" : "bg-stone-300"}`}>
              <span className={`absolute top-0.5 size-3 rounded-full bg-white shadow transition-all ${helpFab ? "left-3.5" : "left-0.5"}`} />
            </span>
            fixed help button
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={trap}
            onClick={() => setTrap((v) => !v)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              trap ? "border-red-300 bg-red-50 text-red-800" : "border-stone-200 bg-white text-stone-600 hover:border-teal-700/40"
            }`}
          >
            <span className={`relative h-4 w-7 rounded-full transition-colors ${trap ? "bg-red-600" : "bg-stone-300"}`}>
              <span className={`absolute top-0.5 size-3 rounded-full bg-white shadow transition-all ${trap ? "left-3.5" : "left-0.5"}`} />
            </span>
            ⚠ transformed ancestor trap
          </button>
          <span className="rounded-full bg-stone-900 px-2.5 py-1 font-mono text-[11px] font-bold text-white">
            bag: {bag}
          </span>
        </div>

        {trap && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-[13px] leading-relaxed text-red-900">
            <p className="font-semibold">⚠ Trap armed: the page is wrapped in <code className="font-mono text-[12px]">transform: translateZ(0)</code>.</p>
            <p className="mt-1">
              Watch the buy bar and help button: they stop behaving like viewport pins and scroll away with the page instead.
              That&apos;s the spec — a transformed ancestor becomes the containing block for fixed descendants. Remove the
              transform (toggle off) and viewport pinning is restored.
            </p>
          </div>
        )}

        <div
          className={`overflow-hidden rounded-2xl border bg-[#fafaf9] ${
            trap ? "border-red-300 ring-1 ring-red-300/50" : "border-stone-200"
          }`}
          style={trap ? { transform: "translateZ(0)" } : undefined}
        >
          {page}
        </div>

        {/* fixed buy bar — the star */}
        {buyBar && pastHero && (
          <div
            className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white/95 shadow-[0_-4px_24px_rgba(0,0,0,0.10)] backdrop-blur"
            role="region"
            aria-label="Quick buy bar"
          >
            <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-stone-900 text-sm font-bold text-white">
                T
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-stone-900">Trailhead 28L · Moss</p>
                <p className="font-mono text-[11px] text-stone-500">
                  $189 <span className="line-through">$229</span> · fixed · bottom: 0
                </p>
              </div>
              <button
                type="button"
                onClick={addToBag}
                className="ml-auto shrink-0 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-800 active:scale-95"
              >
                Add to bag
              </button>
            </div>
          </div>
        )}

        {/* fixed help fab */}
        {helpFab && (
          <button
            type="button"
            onClick={() => setToast("Support chat opens here — fixed to the viewport, always in reach.")}
            aria-label="Open help chat"
            className={`fixed z-50 grid size-12 place-items-center rounded-full bg-stone-900 text-lg text-white shadow-xl transition-all hover:scale-105 ${
              buyBar && pastHero ? "bottom-20 right-4" : "bottom-4 right-4"
            }`}
          >
            ?
          </button>
        )}

        {toast && (
          <div role="status" className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-xl">
            {toast}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-sm font-semibold text-stone-900">What you gain</p>
            <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
              The buy action is never more than one tap away — no scroll-hunting
              back to the hero. Conversion-critical controls (buy, help, player
              bars) are exactly what fixed positioning is for: relevant
              everywhere, owned by no section.
            </p>
          </div>
          <div className="rounded-xl bg-stone-900 p-4 font-mono text-[11px] leading-relaxed text-stone-300">
            <p><span className="text-stone-500">.buy-bar</span> {"{"}</p>
            <p className="pl-3">position: <span className="text-teal-300">fixed</span>;</p>
            <p className="pl-3">bottom: <span className="text-amber-300">0</span>; left: <span className="text-amber-300">0</span>; right: <span className="text-amber-300">0</span>;</p>
            <p>{"}"}</p>
            <p className="mt-2"><span className="text-stone-500">.sub-nav</span> {"{"} position: <span className="text-teal-300">sticky</span>; top: <span className="text-amber-300">0</span>; {"}"}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
