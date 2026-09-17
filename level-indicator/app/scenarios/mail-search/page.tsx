"use client";

import { useMemo, useState } from "react";
import { LevelIndicator } from "../../LevelIndicator";
import { ScenarioNav } from "../../ScenarioNav";

const MESSAGES = [
  {
    id: 1,
    from: "Marina Kessler",
    subject: "Harbor Lights premiere tickets",
    body: "I saved us two seats for the Harbor Lights premiere on Friday — the comedy with the lighthouse crew. Doors at 7, bring the lantern poster for signatures.",
    date: "Sep 14",
  },
  {
    id: 2,
    from: "Build notifications",
    subject: "Nightly build #4821 passed",
    body: "All 1,204 tests green. The ferry-schedule service deployed to staging without warnings. Artifacts expire in 30 days.",
    date: "Sep 13",
  },
  {
    id: 3,
    from: "A. Okafor",
    subject: "Slow Ferry Home — rough cut review",
    body: "The documentary rough cut is ready. The harbor crossing at dawn is the strongest scene; the lantern festival footage still needs color work.",
    date: "Sep 12",
  },
  {
    id: 4,
    from: "The Field Notes",
    subject: "Paper Lanterns tour merch numbers",
    body: "Poster sales doubled after the harbor show. Please confirm the ferry cargo booking for the remaining lantern stock before Friday.",
    date: "Sep 10",
  },
  {
    id: 5,
    from: "Dentist office",
    subject: "Reminder: cleaning on Tuesday",
    body: "Just a reminder of your appointment. Reply to reschedule. Please arrive 10 minutes early with your insurance card.",
    date: "Sep 9",
  },
  {
    id: 6,
    from: "Glasswing Nursery",
    subject: "Your orchid order shipped",
    body: "The glasswing orchids left the greenhouse this morning. Keep them out of direct lantern light for the first week — morning sun only.",
    date: "Sep 7",
  },
];

function scoreMessage(
  m: (typeof MESSAGES)[number],
  tokens: string[]
): { blocks: number; hits: string[] } {
  if (tokens.length === 0) return { blocks: 0, hits: [] };
  let score = 0;
  const hits: string[] = [];
  const subj = m.subject.toLowerCase();
  const from = m.from.toLowerCase();
  const body = m.body.toLowerCase();
  for (const t of tokens) {
    if (subj.includes(t)) {
      score += 3;
      hits.push(`subject matches “${t}”`);
    }
    if (from.includes(t)) {
      score += 2;
      hits.push(`sender matches “${t}”`);
    }
    const occurrences = body.split(t).length - 1;
    if (occurrences > 0) {
      score += Math.min(occurrences, 3);
      hits.push(
        occurrences === 1
          ? `body mentions “${t}” once`
          : `body mentions “${t}” ${Math.min(occurrences, 3)}×`
      );
    }
  }
  // 8+ points ≈ full 5 blocks
  const blocks = Math.max(0, Math.min(5, Math.round((score / 8) * 5)));
  return { blocks, hits };
}

export default function MailSearchPage() {
  const [query, setQuery] = useState("harbor lantern");
  const [sort, setSort] = useState<"relevance" | "date">("relevance");

  const tokens = useMemo(
    () =>
      query
        .toLowerCase()
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 1),
    [query]
  );

  const ranked = useMemo(() => {
    const scored = MESSAGES.map((m) => ({
      ...m,
      ...scoreMessage(m, tokens),
    })).filter((m) => tokens.length === 0 || m.blocks > 0);
    if (sort === "relevance")
      scored.sort((a, b) => b.blocks - a.blocks || a.id - b.id);
    return scored;
  }, [tokens, sort]);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <ScenarioNav current="/scenarios/mail-search/" />
        <header className="max-w-2xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#0071e3]">
            Scenario 3 · Style.relevancy · compact match strength
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Search relevance in a mail app
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
            Drift Mail — type a query and every result grows a tiny rising-bar
            meter: more filled blocks, stronger match. Subject hits count most,
            sender next, body last.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative flex-1">
                <span className="sr-only">Search mail</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                >
                  ⌕
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try “harbor lantern” or “ferry”…"
                  className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-9 pr-9 text-[14px] text-stone-900 shadow-sm outline-none transition-colors placeholder:text-stone-400 focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/25"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full bg-stone-200 text-[11px] text-stone-600 hover:bg-stone-300"
                  >
                    ✕
                  </button>
                )}
              </label>
              <div
                role="group"
                aria-label="Sort results"
                className="flex shrink-0 rounded-lg border border-stone-200 bg-white p-1"
              >
                {(["relevance", "date"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={sort === s}
                    onClick={() => setSort(s)}
                    className={`rounded-md px-2.5 py-1.5 font-mono text-[11px] capitalize transition-colors ${
                      sort === s
                        ? "bg-stone-900 text-white shadow-sm"
                        : "text-stone-500 hover:bg-stone-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-2 font-mono text-[11px] text-stone-400" role="status">
              {tokens.length === 0
                ? "no query — showing everything, meters hidden"
                : `${ranked.length} of ${MESSAGES.length} match · sorted by ${sort}`}
            </p>

            {ranked.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-stone-300 bg-[#fafaf9] p-8 text-center">
                <p className="text-sm font-semibold text-stone-800">
                  No message reaches even one block
                </p>
                <p className="mx-auto mt-1 max-w-sm text-[13px] text-stone-500">
                  Relevancy is honest: when nothing matches, the list empties
                  instead of guessing. Try “ferry”, “lantern” or “build”.
                </p>
              </div>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {ranked.map((m) => (
                  <li
                    key={m.id}
                    className="flex gap-3 rounded-xl border border-stone-200 bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <p className="text-[14px] font-semibold text-stone-900">
                          {m.subject}
                        </p>
                        <span className="font-mono text-[11px] text-stone-400">
                          {m.from} · {m.date}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[13px] leading-relaxed text-stone-600">
                        {m.body}
                      </p>
                      {tokens.length > 0 && (
                        <p className="mt-1.5 font-mono text-[11px] text-stone-400">
                          {m.hits.slice(0, 2).join(" · ")}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <LevelIndicator
                        levelStyle="relevancy"
                        min={0}
                        max={5}
                        value={m.blocks}
                        relevancyLevels={5}
                        ariaLabel={`Relevance of ${m.subject}: ${m.blocks} of 5`}
                      />
                      <span className="font-mono text-[10px] text-stone-400">
                        {m.blocks}/5
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="flex flex-col gap-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <p className="text-sm font-semibold text-stone-900">
                How the meter is scored
              </p>
              <ul className="mt-2 flex flex-col gap-2 text-[13px] leading-relaxed text-stone-600">
                <li className="flex gap-2">
                  <span className="font-mono font-bold text-[#0071e3]">+3</span>
                  token appears in the subject — the strongest signal
                </li>
                <li className="flex gap-2">
                  <span className="font-mono font-bold text-[#0071e3]">+2</span>
                  token appears in the sender name
                </li>
                <li className="flex gap-2">
                  <span className="font-mono font-bold text-[#0071e3]">+1</span>
                  per body mention (up to 3) — the weakest signal
                </li>
              </ul>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#fafaf9] p-3 ring-1 ring-stone-200/60">
                <LevelIndicator
                  levelStyle="relevancy"
                  min={0}
                  max={5}
                  value={5}
                  relevancyLevels={5}
                  ariaLabel="Full relevance example"
                />
                <p className="font-mono text-[11px] text-stone-500">
                  8+ points = full house · sort by relevance floats these up
                </p>
              </div>
              <p className="mt-3 font-mono text-[11px] leading-relaxed text-stone-400">
                NSLevelIndicator.Style.relevancy · read-only · no
                warningValue/criticalValue — a whisper, not an alarm
              </p>
            </div>
            <div className="rounded-2xl border border-[#0071e3]/25 bg-[#f0f7ff] p-5">
              <p className="text-sm font-semibold text-stone-900">Why it fits here</p>
              <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
                A search hit is a <em>strength inside a fixed scale</em>, and
                the list needs the signal to stay tiny — a full bar per row
                would shout over the subjects. Five rising blocks rank results
                at a glance, so the best match gets the click first and the
                hunt ends sooner.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
