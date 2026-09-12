"use client";

import { useState } from "react";
import { ScenarioNav } from "../../components/scenario-nav";

const DAYS: { day: string; sub: string; messages: { who: string; text: string; time: string; mine?: boolean }[] }[] = [
  {
    day: "Monday, Sep 7",
    sub: "12 messages",
    messages: [
      { who: "Priya", text: "Kickoff notes are in the doc — brand refresh ships with the marketing site.", time: "09:12" },
      { who: "You", text: "Got it. I'll take the pricing page and the sticky sub-nav.", time: "09:18", mine: true },
      { who: "Marco", text: "Ledger table prototype is ready for review, 64 rows with the sticky thead.", time: "09:41" },
      { who: "Aisha", text: "Love it. Can we also pin the invoice column on narrow screens?", time: "10:02" },
      { who: "Priya", text: "Yes — sticky left: 0 on the first column, with a divider shadow.", time: "10:15" },
    ],
  },
  {
    day: "Tuesday, Sep 8",
    sub: "8 messages",
    messages: [
      { who: "Marco", text: "Date dividers are now sticky. Watch them hand off as you scroll.", time: "11:03" },
      { who: "You", text: "The handoff is the best part — B shoves A off the threshold line.", time: "11:07", mine: true },
      { who: "Aisha", text: "Edge case: a single-message day still needs its divider to stick.", time: "11:29" },
      { who: "Priya", text: "Noted. Also the dividers must stop at the panel bottom, not follow us out.", time: "11:44" },
    ],
  },
  {
    day: "Wednesday, Sep 9",
    sub: "15 messages",
    messages: [
      { who: "You", text: "Fixed buy bar is live on the product page — viewport-pinned, dismissible.", time: "08:52", mine: true },
      { who: "Marco", text: "Careful: the promo banner has a transform. It will trap the fixed bar.", time: "09:01" },
      { who: "Aisha", text: "Reproduced it! Toggle 'transformed ancestor' on scenario 3 to see the bug.", time: "09:20" },
      { who: "Priya", text: "That's the lesson: fixed ignores scroll containers, but not transforms.", time: "09:33" },
      { who: "You", text: "Shipping the explainer with all three demos linked. Lab session done.", time: "09:58", mine: true },
    ],
  },
  {
    day: "Thursday, Sep 10",
    sub: "4 messages",
    messages: [
      { who: "Priya", text: "Retro at 2pm — bring one sticky bug and one fixed win.", time: "10:12" },
      { who: "Marco", text: "Mine: forgot the opaque background, rows showed through the header.", time: "10:26" },
    ],
  },
];

export default function GroupedFeedPage() {
  const [sticky, setSticky] = useState(true);
  const [compact, setCompact] = useState(false);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-6">
        <ScenarioNav
          current="/scenarios/grouped-feed"
          note="Scenario 2 · Team chat history — stacked sticky date dividers inside one scroll panel. Scroll slowly and watch each divider pin, hand off, then stop at the panel's end."
        />
        <header className="max-w-3xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-teal-700">
            Scenario 2 · section headers · stacked position: sticky
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Team chat history
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Four days of project chat in a fixed-height panel.{" "}
            <strong>Why sticky fits here:</strong> the reader always needs to
            know <em>which day</em> the visible messages belong to — a date
            divider pinned to the panel top answers that without stealing
            screen space. When the next day arrives it pushes the old divider
            off: the handoff. And every divider is trapped in the panel — scroll
            past the card and they leave with it, unlike a fixed element.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            role="switch"
            aria-checked={sticky}
            onClick={() => setSticky((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 hover:border-teal-700/40"
          >
            <span className={`relative h-4 w-7 rounded-full transition-colors ${sticky ? "bg-teal-700" : "bg-stone-300"}`}>
              <span className={`absolute top-0.5 size-3 rounded-full bg-white shadow transition-all ${sticky ? "left-3.5" : "left-0.5"}`} />
            </span>
            sticky dividers {sticky ? "on" : "off"}
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={compact}
            onClick={() => setCompact((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 hover:border-teal-700/40"
          >
            <span className={`relative h-4 w-7 rounded-full transition-colors ${compact ? "bg-teal-700" : "bg-stone-300"}`}>
              <span className={`absolute top-0.5 size-3 rounded-full bg-white shadow transition-all ${compact ? "left-3.5" : "left-0.5"}`} />
            </span>
            compact bubbles
          </button>
          <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-bold ${sticky ? "bg-teal-700 text-white" : "bg-stone-200 text-stone-600"}`}>
            {sticky ? "dividers sticky · top: 8px" : "dividers static — dates scroll away"}
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3 border-b border-stone-200 bg-stone-50 px-5 py-3">
              <span className="grid size-9 place-items-center rounded-full bg-teal-700 text-sm font-bold text-white">
                S
              </span>
              <div>
                <p className="text-sm font-semibold text-stone-900">studio-refresh · project chat</p>
                <p className="font-mono text-[11px] text-stone-500">4 people · panel h-[480px] overflow-auto</p>
              </div>
              <span className="ml-auto hidden rounded-full bg-white px-2.5 py-1 font-mono text-[11px] text-stone-500 ring-1 ring-inset ring-stone-200 sm:inline">
                scroll inside ↓
              </span>
            </div>
            <div className="thin-scroll relative h-[480px] overflow-y-auto bg-[#fafaf9] px-4 py-3">
              {DAYS.map((d) => (
                <div key={d.day}>
                  <div
                    style={sticky ? { top: 8 } : undefined}
                    className={`${sticky ? "sticky z-10" : ""} flex items-center gap-2 py-1.5`}
                  >
                    <span className="mx-auto flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-[11px] font-semibold text-stone-700 shadow-sm">
                      <span className="size-1.5 rounded-full bg-teal-700" />
                      {d.day}
                      <span className="font-mono font-normal text-stone-400">{d.sub}</span>
                    </span>
                  </div>
                  <div className={compact ? "space-y-1" : "space-y-2.5"}>
                    {d.messages.map((m, i) => (
                      <div key={i} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl border px-3.5 ${
                            compact ? "py-1.5" : "py-2.5"
                          } text-[13px] leading-relaxed shadow-sm ${
                            m.mine
                              ? "rounded-br-md border-teal-800 bg-teal-700 text-white"
                              : "rounded-bl-md border-stone-200 bg-white text-stone-700"
                          }`}
                        >
                          {!m.mine && (
                            <p className={`text-[11px] font-semibold ${"text-teal-800"}`}>
                              {m.who} <span className="font-mono font-normal text-stone-400">{m.time}</span>
                            </p>
                          )}
                          <p>{m.text}</p>
                          {m.mine && (
                            <p className="mt-0.5 text-right font-mono text-[10px] text-teal-100/80">{m.time}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <p className="mt-4 rounded-xl border border-dashed border-stone-300 bg-white px-4 py-3 text-center text-xs text-stone-500">
                You&apos;re all caught up — dividers stop here. Sticky never leaves its container.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <p className="text-sm font-semibold text-stone-900">What you gain</p>
              <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
                Orientation for free: mid-scroll you always know which day
                you&apos;re reading, with zero extra taps. Toggle stickiness off
                and the same panel becomes disorienting — dates vanish upward
                and every message floats in time.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <p className="text-sm font-semibold text-stone-900">Try this</p>
              <ol className="mt-1 list-decimal space-y-1 pl-5 text-[13px] leading-relaxed text-stone-600">
                <li>Scroll slowly past Tuesday into Wednesday — watch the handoff.</li>
                <li>Jump to the bottom: the last divider unpins at the panel end.</li>
                <li>Scroll the whole page — dividers leave with the card. Fixed wouldn&apos;t.</li>
              </ol>
            </div>
            <div className="rounded-xl bg-stone-900 p-4 font-mono text-[11px] leading-relaxed text-stone-300">
              <p><span className="text-stone-500">.day-divider</span> {"{"}</p>
              <p className="pl-3">position: <span className="text-teal-300">sticky</span>;</p>
              <p className="pl-3">top: <span className="text-amber-300">8px</span>;</p>
              <p className="pl-3">z-index: <span className="text-amber-300">10</span>;</p>
              <p>{"}"}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
