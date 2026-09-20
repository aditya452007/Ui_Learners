"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Faq = { q: string; a: string; topic: string };

const FAQS: Faq[] = [
  {
    q: "How do I reset my password?",
    a: "Go to Settings → Security → Change password. We'll email you a one-time link that expires after 30 minutes. If you signed up with Google or Apple, manage the password there instead — we never see it.",
    topic: "Account",
  },
  {
    q: "Can I change my delivery address after ordering?",
    a: "Yes, within 2 hours of checkout — open the order and choose “Edit address”. After the warehouse picks the parcel (usually same-day before 4pm), the address is locked and you'll need to contact the carrier directly.",
    topic: "Orders",
  },
  {
    q: "Which plans include offline mode?",
    a: "Plus and Team plans include full offline sync for up to 30 days. The free plan caches your 20 most recent items. Offline changes merge automatically when you reconnect — conflicts keep both versions so nothing is lost.",
    topic: "Billing",
  },
  {
    q: "How do refunds work on annual billing?",
    a: "Cancel within the first 30 days for a full refund, no questions asked. After that, annual plans are refunded pro-rata for unused full months. Monthly plans simply stop at the end of the current cycle.",
    topic: "Billing",
  },
  {
    q: "Is my data encrypted?",
    a: "Yes — AES-256 at rest and TLS 1.3 in transit, with EU or US data residency of your choice on Team plans. We publish an annual SOC 2 Type II report; ask support and we'll send the latest one.",
    topic: "Security",
  },
  {
    q: "How do I invite my team?",
    a: "Open Members → Invite, enter work emails, and pick Admin or Member. Invites expire after 7 days. Guests (free, view-only) can be added on Plus and above without using a paid seat.",
    topic: "Account",
  },
];

const TOPICS = ["All", "Account", "Orders", "Billing", "Security"] as const;

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

export default function FaqScenario() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("All");
  // remount key resets native open state whenever the visible set changes
  const [epoch, setEpoch] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter(
      (f) =>
        (topic === "All" || f.topic === topic) &&
        (!q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
    );
  }, [query, topic]);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-10 sm:px-8">
      <ScenarioNav prev={["/scenarios/course-curriculum", "Course curriculum"]} next={["/scenarios/product-details", "Product details"]} />
      <header className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
          Scenario 1 · exclusive · one open at a time
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Trailhead Help Center
        </h1>
        <p className="mt-2 text-[15px] leading-7 text-stone-500">
          Why it fits here: support pages are skimmed, not read. Questions stay a compact
          scan-list and each answer pushes the rest down in reading order — and because
          answers are long, only one stays open so the page never becomes a wall of text.
          Users gain faster scanning and fewer lost places.
        </p>
      </header>

      {/* search + topic filter */}
      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <label htmlFor="faq-search" className="text-[13px] font-semibold text-stone-700">
          Search answers
        </label>
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setEpoch((n) => n + 1);
          }}
          placeholder="Try “refund” or “offline”…"
          className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-[15px] text-stone-900 placeholder:text-stone-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
        />
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={topic === t}
              onClick={() => {
                setTopic(t);
                setEpoch((n) => n + 1);
              }}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all ${
                topic === t
                  ? "bg-teal-700 text-white shadow"
                  : "border border-stone-200 bg-white text-stone-500 hover:text-stone-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* exclusive accordion */}
      {results.length > 0 ? (
        <div key={epoch} className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)]">
          {results.map((f, i) => (
            <details
              key={f.q}
              name="faq-group"
              open={i === 0}
              className={`acc group ${i > 0 ? "border-t border-stone-200" : ""}`}
            >
              <summary className="acc-summary acc-focusable flex items-center gap-3 px-5 py-4 hover:bg-stone-50">
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-stone-900">{f.q}</span>
                  <span className="mt-1 inline-block rounded-full bg-teal-50 px-2 py-px text-[11px] font-semibold text-teal-700">
                    {f.topic}
                  </span>
                </span>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-stone-400 transition-transform duration-300 group-open:rotate-180">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <div className="acc-panel">
                <div>
                  <p className="mx-5 mb-4 rounded-xl bg-stone-50 p-4 text-[14px] leading-7 text-stone-600">
                    {f.a}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <p className="text-lg font-bold text-stone-900">No answers match “{query}”</p>
          <p className="mt-1 text-[14px] text-stone-500">
            Try fewer words — or ask us directly below.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTopic("All");
              setEpoch((n) => n + 1);
            }}
            className="mt-4 rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            Clear search
          </button>
        </div>
      )}

      <p className="mt-3 font-mono text-[11px] leading-5 text-stone-400">
        every row: &lt;details <span className="text-teal-700">name="faq-group"</span>&gt; —
        native exclusivity, Tab + Enter to toggle, no aria-expanded anywhere.
      </p>

      <aside className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-stone-900 p-5 text-white">
        <div>
          <p className="font-bold">Still stuck?</p>
          <p className="text-[13px] text-stone-300">Median reply time: 2h 14m on weekdays.</p>
        </div>
        <span className="rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold">
          Contact support
        </span>
      </aside>
    </div>
  );
}
