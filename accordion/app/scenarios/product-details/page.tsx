"use client";

import Link from "next/link";
import { useState } from "react";

type Section = { title: string; meta: string; body: string[] };

const SECTIONS: Section[] = [
  {
    title: "Details & materials",
    meta: "4 highlights",
    body: [
      "Merino-wool upper ( responsibly sourced, ZQ-certified ) with a recycled ripstop heel counter.",
      "Sugarcane EVA midsole — 214 g in size 42, 8 mm drop, machine-washable at 30°C.",
      "Fits true to size; wide feet should go half a size up. Model wears 42.",
    ],
  },
  {
    title: "Shipping & returns",
    meta: "Free over $75",
    body: [
      "Ships in 1–2 business days from Portland, OR. Free 2-day shipping on orders over $75, flat $4.95 below.",
      "60-day free returns — worn outside is fine, as long as the tread isn't worn through. Exchanges ship before your return arrives.",
    ],
  },
  {
    title: "Warranty",
    meta: "2 years",
    body: [
      "Two-year craftsmanship warranty covers sole separation, stitching failure, and eyelet defects.",
      "Start a claim from your order page with one photo — replacements ship within 48 hours, no return needed for claims under $120.",
    ],
  },
  {
    title: "What runners say",
    meta: "4.8 · 2,314 reviews",
    body: [
      "“Third pair. The wool means no smell even after a marathon week.” — Dana K., verified buyer",
      "“Sizing is honest and the exchange for half-size up took two days.” — Marcus T., verified buyer",
    ],
  },
];

function ScenarioNav({ prev, next }: { prev?: [string, string]; next?: [string, string] }) {
  return (
    <nav aria-label="Scenario navigation" className="flex flex-wrap items-center gap-2 text-[13px]">
      <Link href="/" className="acc-focusable rounded-full border border-stone-200 bg-white px-3.5 py-1.5 font-medium text-stone-600 shadow-sm hover:text-stone-900">
        ← Learning hub
      </Link>
      {prev && (
        <Link href={prev[0]} className="acc-focusable rounded-full border border-stone-200 bg-white px-3.5 py-1.5 font-medium text-stone-600 shadow-sm hover:text-stone-900">
          ← {prev[1]}
        </Link>
      )}
      {next && (
        <Link href={next[0]} className="acc-focusable rounded-full bg-stone-900 px-3.5 py-1.5 font-medium text-white shadow-sm hover:bg-stone-700">
          {next[1]} →
        </Link>
      )}
    </nav>
  );
}

export default function ProductDetailsScenario() {
  const [size, setSize] = useState("42");
  const [openCount, setOpenCount] = useState(2);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-20 pt-10 sm:px-8">
      <ScenarioNav prev={["/scenarios/faq", "Help-center FAQ"]} next={["/scenarios/course-curriculum", "Course curriculum"]} />
      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
          Scenario 2 · multiple · several open at once
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Aurora Wool Runner — product page
        </h1>
        <p className="mt-2 text-[15px] leading-7 text-stone-500">
          Why it fits here: shoppers compare facts side by side — shipping terms against
          warranty, materials against reviews. Independent sections (no shared name) let
          several stay open at once, so users gain comparison without scrolling up and
          down to re-open panels.
        </p>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* product context */}
        <section aria-label="Product summary" className="h-fit rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)]">
          <div className="flex items-center justify-center rounded-2xl bg-stone-100 py-12" aria-hidden="true">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <ellipse cx="60" cy="98" rx="34" ry="7" fill="#d6d3d1" />
              <path d="M28 78c0-14 8-22 18-28 8-5 14-12 16-22l4-8c2-4 8-4 9 1l3 12c8 3 13 10 14 19l2 14c6 1 9 4 9 8v2c0 3-2 5-5 5H33c-3 0-5-1-5-3z" fill="#0f766e" />
              <path d="M28 78c10 4 22 6 34 6 14 0 26-2 36-4l1 6H33c-3 0-5-3-5-8z" fill="#134e4a" />
              <circle cx="52" cy="60" r="2.4" fill="#fff" />
              <circle cx="60" cy="56" r="2.4" fill="#fff" />
              <circle cx="68" cy="52" r="2.4" fill="#fff" />
            </svg>
          </div>
          <div className="mt-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Aurora Wool Runner</h2>
              <p className="mt-1 text-[13px] text-stone-500">
                ★★★★★ <span className="font-semibold text-stone-700">4.8</span> · 2,314 reviews · Fern &amp; Field
              </p>
            </div>
            <p className="text-xl font-bold text-stone-900">$148</p>
          </div>
          <div className="mt-4">
            <p id="size-label" className="text-[13px] font-semibold text-stone-700">
              Size (EU) — <span className="font-normal text-stone-500">true to size</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="size-label">
              {["40", "41", "42", "43", "44", "45"].map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={size === s}
                  onClick={() => setSize(s)}
                  className={`min-w-11 rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                    size === s
                      ? "border-stone-900 bg-stone-900 text-white shadow"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="mt-5 w-full rounded-xl bg-teal-700 py-3 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-teal-800">
            Add to cart — size {size}
          </button>
          <p className="mt-2 text-center text-[12px] text-stone-400">
            Free 60-day returns · 2-year warranty
          </p>
        </section>

        {/* multi-open accordion */}
        <section aria-label="Product information sections">
          <p className="mb-2 font-mono text-[11px] text-stone-400" aria-live="polite">
            {openCount} section{openCount === 1 ? "" : "s"} open — independent, no shared name
          </p>
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)]">
            {SECTIONS.map((s, i) => (
              <details
                key={s.title}
                open={i < 2}
                onToggle={(e) => setOpenCount((c) => c + (e.currentTarget.open ? 1 : -1))}
                className={`acc group ${i > 0 ? "border-t border-stone-200" : ""}`}
              >
                <summary className="acc-summary acc-focusable flex items-center gap-3 px-5 py-4 hover:bg-stone-50">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-stone-900">{s.title}</span>
                    <span className="text-[12px] text-stone-400">{s.meta}</span>
                  </span>
                  <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full border border-stone-300 text-stone-600 transition-all duration-300 group-open:rotate-45 group-open:border-teal-700 group-open:bg-teal-700 group-open:text-white">
                    <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <div className="acc-panel">
                  <div>
                    <ul className="mx-5 mb-4 space-y-2 rounded-xl bg-stone-50 p-4">
                      {s.body.map((line) => (
                        <li key={line} className="flex gap-2.5 text-[14px] leading-7 text-stone-600">
                          <span className="mt-[11px] size-1.5 shrink-0 rounded-full bg-teal-700" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            ))}
          </div>
          <p className="mt-3 font-mono text-[11px] leading-5 text-stone-400">
            plain &lt;details&gt; with no name — plus rotates 45° into a minus via
            details[open]; keyboard and semantics stay 100% native.
          </p>
        </section>
      </div>
    </div>
  );
}
