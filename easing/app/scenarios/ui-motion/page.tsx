"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function Nav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold text-white">~</span>
          <span className="text-sm font-bold tracking-tight">Easing Lab <span className="font-normal text-slate-500">· UI motion</span></span>
        </Link>
        <nav className="ml-auto flex flex-wrap items-center gap-2 text-sm">
          <Link href="/" className="rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:border-teal-700 hover:text-teal-800">Hub</Link>
          <Link href="/scenarios/enter-exit" className="rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:border-teal-700 hover:text-teal-800">Enter / Exit</Link>
          <Link href="/scenarios/ui-motion" className="rounded-full bg-teal-700 px-3 py-1.5 font-semibold text-white">UI motion</Link>
          <Link href="/scenarios/curve-studio" className="rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:border-teal-700 hover:text-teal-800">Curve studio</Link>
        </nav>
      </div>
    </header>
  );
}

const STANDARD = "cubic-bezier(0.4, 0, 0.2, 1)";
const INOUT = "cubic-bezier(0.42, 0, 0.58, 1)";

const PHOTOS = [
  { id: 0, place: "Santorini, Greece", note: "White lanes, blue domes — day 1", bg: "from-sky-100 to-sky-300", emoji: "🏝️" },
  { id: 1, place: "Kyoto, Japan", note: "Temple at dawn — day 2", bg: "from-rose-100 to-rose-300", emoji: "⛩️" },
  { id: 2, place: "Banff, Canada", note: "Lake Louise canoe — day 3", bg: "from-emerald-100 to-emerald-300", emoji: "🏔️" },
  { id: 3, place: "Marrakech, Morocco", note: "Souks + rooftop mint tea", bg: "from-amber-100 to-amber-300", emoji: "🕌" },
];

const START_DAYS = [
  { id: "d1", title: "Day 1 — Arrival + old town walk", meta: "3 stops · 2.1 km" },
  { id: "d2", title: "Day 2 — Museum + cooking class", meta: "2 stops · tickets booked" },
  { id: "d3", title: "Day 3 — Day trip to the coast", meta: "bus 8:10 · back by 19:00" },
  { id: "d4", title: "Day 4 — Free morning, fly home", meta: "checkout 11:00" },
];

export default function UiMotionPage() {
  const [index, setIndex] = useState(0);
  const [order, setOrder] = useState(START_DAYS);
  const [flash, setFlash] = useState<string | null>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const firstTops = useRef(new Map<string, number>());

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + PHOTOS.length) % PHOTOS.length);

  const move = (id: string, dir: -1 | 1) => {
    // FIRST: record positions
    firstTops.current.clear();
    itemRefs.current.forEach((el, key) => firstTops.current.set(key, el.getBoundingClientRect().top));
    const idx = order.findIndex((d) => d.id === id);
    const j = idx + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[idx], next[j]] = [next[j], next[idx]];
    setOrder(next);
    setFlash(id);
    window.setTimeout(() => setFlash(null), 600);
  };

  // LAST + INVERT + PLAY (FLIP)
  useEffect(() => {
    if (firstTops.current.size === 0) return;
    itemRefs.current.forEach((el, key) => {
      const first = firstTops.current.get(key);
      if (first === undefined) return;
      const last = el.getBoundingClientRect().top;
      const dy = first - last;
      if (dy !== 0) {
        el.style.transition = "none";
        el.style.transform = `translateY(${dy}px)`;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            el.style.transition = `transform 240ms ${INOUT}`;
            el.style.transform = "translateY(0px)";
          })
        );
      }
    });
    firstTops.current.clear();
  }, [order]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Nav />
      <main className="mx-auto max-w-6xl px-6 pb-20">
        <section className="pt-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Scenario 2 · ui motion</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Wanderly — carousel + reorderable itinerary</h1>
          <p className="mt-3 max-w-3xl rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm leading-relaxed text-teal-950">
            <strong>Why it fits here:</strong> carousels and reordering are <em>symmetric UI
            moves</em> — the element travels from A to B and could travel back, so the motion
            should be balanced both ways. The carousel glides on the standard curve (280ms) and
            the itinerary reorders with a FLIP animation on ease-in-out (240ms). Durations are
            locked in the 150–300ms sweet spot: fast enough to feel instant, slow enough to follow.
          </p>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Carousel */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold">Photo carousel</h2>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 font-mono text-[11px] font-bold text-teal-800">standard · 280ms</span>
            </div>
            <p className="mt-1 font-mono text-xs text-slate-500">transition: transform 280ms {STANDARD}</p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <div
                className="flex"
                style={{
                  transform: `translateX(-${index * 100}%)`,
                  transition: `transform 280ms ${STANDARD}`,
                }}
              >
                {PHOTOS.map((p) => (
                  <div key={p.id} className={`w-full shrink-0 bg-gradient-to-br ${p.bg} p-8`} style={{ minWidth: "100%" }}>
                    <p className="text-5xl">{p.emoji}</p>
                    <p className="mt-4 text-xl font-extrabold text-slate-900">{p.place}</p>
                    <p className="text-sm text-slate-700">{p.note}</p>
                    <div className="mt-4 flex gap-2">
                      <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold">4.9 ★ · 2k saves</span>
                      <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold">Best in May</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <button onClick={() => go(-1)} aria-label="Previous photo" className="h-10 w-10 rounded-xl border border-slate-200 text-lg font-bold transition hover:border-teal-700 hover:text-teal-800">‹</button>
                <button onClick={() => go(1)} aria-label="Next photo" className="h-10 w-10 rounded-xl bg-teal-700 text-lg font-bold text-white transition hover:bg-teal-800">›</button>
              </div>
              <div className="flex gap-1.5">
                {PHOTOS.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to ${p.place}`}
                    className={`h-2.5 rounded-full transition-all ${i === index ? "w-7 bg-teal-700" : "w-2.5 bg-slate-200 hover:bg-slate-300"}`}
                  />
                ))}
              </div>
              <p className="font-mono text-xs text-slate-500">{index + 1} / {PHOTOS.length}</p>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Standard starts quickly (responsive to your tap) then spends most of its time
              decelerating into place — no abrupt halt. Spam the arrows: it stays smooth because
              280ms is short enough to interrupt cleanly.
            </p>
          </section>

          {/* Reorder list */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold">Itinerary days — reorder</h2>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 font-mono text-[11px] font-bold text-teal-800">ease-in-out · 240ms FLIP</span>
            </div>
            <p className="mt-1 font-mono text-xs text-slate-500">FLIP: first → last → invert → play · 240ms {INOUT}</p>
            <ul className="mt-4 space-y-2">
              {order.map((d, i) => (
                <li key={d.id}>
                  <div
                    ref={(el) => {
                      if (el) itemRefs.current.set(d.id, el);
                      else itemRefs.current.delete(d.id);
                    }}
                    className={`flex items-center gap-3 rounded-2xl border p-3 transition-colors ${flash === d.id ? "border-teal-600 bg-teal-50" : "border-slate-200 bg-slate-50"}`}
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sm font-extrabold text-slate-500 shadow-sm">{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{d.title}</p>
                      <p className="text-xs text-slate-500">{d.meta}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => move(d.id, -1)} disabled={i === 0} aria-label={`Move ${d.title} up`} className="h-7 w-7 rounded-lg border border-slate-200 bg-white text-sm font-bold transition hover:border-teal-700 disabled:opacity-30">↑</button>
                      <button onClick={() => move(d.id, 1)} disabled={i === order.length - 1} aria-label={`Move ${d.title} down`} className="h-7 w-7 rounded-lg border border-slate-200 bg-white text-sm font-bold transition hover:border-teal-700 disabled:opacity-30">↓</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              FLIP measures each row&apos;s position <em>before</em> the reorder, then animates the
              difference — so rows glide to their new slots instead of teleporting. ease-in-out is
              symmetric (gentle start <em>and</em> gentle end), which reads as “rearranging”, not
              “arriving”.
            </p>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-sm font-bold text-white">The “UI moves” rule — locked durations</h2>
          <div className="mt-3 grid gap-3 font-mono text-xs sm:grid-cols-2">
            <pre className="rounded-xl bg-slate-950 p-3 leading-relaxed text-teal-100">.carousel-track &#123;
  transition: transform 280ms {STANDARD};
&#125;</pre>
            <pre className="rounded-xl bg-slate-950 p-3 leading-relaxed text-teal-100">.day-row &#123;
  transition: transform 240ms {INOUT};
  /* FLIP: JS sets translateY(delta) → 0 */
&#125;</pre>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-300">
            Both sit in the 150–300ms sweet spot on purpose — the scenario fixes duration so you feel
            the <em>curve</em> difference, not a speed difference. Shorter would feel jumpy, longer
            would make reordering feel like wading through syrup.
          </p>
        </section>

        <div className="mt-6 flex gap-3">
          <Link href="/" className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm transition hover:border-teal-700">← Hub</Link>
          <Link href="/scenarios/curve-studio" className="rounded-2xl bg-teal-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800">Next: Curve studio →</Link>
        </div>
      </main>
    </div>
  );
}
