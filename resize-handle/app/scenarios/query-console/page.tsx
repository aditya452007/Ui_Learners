"use client";

import { useEffect, useRef, useState } from "react";
import { Code, Kicker, ScenarioNav, WhyNote } from "../../components/shared";

const SQL = `-- Revenue by channel, last 30 days
SELECT
  channel,
  COUNT(*)           AS orders,
  ROUND(SUM(amount)) AS revenue
FROM orders
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY channel
ORDER BY revenue DESC;`;

const PRESETS = [
  { label: "Compact", w: 380, h: 160 },
  { label: "Standard", w: 520, h: 240 },
  { label: "Wide", w: 680, h: 340 },
];

const ROWS = [
  ["direct", "1,284", "$412,930"],
  ["organic search", "982", "$301,118"],
  ["partner", "411", "$128,552"],
  ["social", "298", "$74,021"],
  ["email", "176", "$52,304"],
];

export default function QueryConsole() {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [size, setSize] = useState({ w: 520, h: 240 });
  const [activePreset, setActivePreset] = useState("Standard");

  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ w: Math.round(width), h: Math.round(height) });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const applyPreset = (label: string, w: number, h: number) => {
    const el = taRef.current;
    if (!el) return;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    setActivePreset(label);
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <Kicker>Scenario 2 of 3 · Data tool</Kicker>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-900">
        Query console
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
        A SQL editor where <Code>resize: both</Code> frees both axes — a long
        query can widen, a tall result set can grow down — while min/max bounds
        on each axis keep the editor inside the card.
      </p>

      <div className="mt-8">
        <WhyNote>
          Analysts juggle long queries <em>and</em> wide result sets; a console
          that can&apos;t grow is a handcuff. Both-axis resize gives the field
          the same freedom the data has, and the bounds (260–680px wide,
          140–420px tall) stop a wild drag from shoving the Run button off
          screen. The presets snap the editor to known-good sizes when a
          &quot;just about right&quot; drag isn&apos;t worth the effort.
        </WhyNote>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_32px_-20px_rgba(0,0,0,0.16)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            <span className="ml-3 font-mono text-xs text-stone-500">
              sales_analytics.sql
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 font-mono text-[11px] text-stone-600">
              {size.w} × {size.h}px
            </span>
            <button className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-indigo-500">
              Run ▸
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-5 py-3">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            Presets
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.label, p.w, p.h)}
              className={
                activePreset === p.label
                  ? "rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-indigo-500"
                  : "rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-indigo-200 hover:text-indigo-600"
              }
            >
              {p.label}
            </button>
          ))}
          <span className="ml-auto hidden text-xs text-stone-400 sm:block">
            Drag the corner — both axes are free
          </span>
        </div>

        <div className="px-5 pb-5">
          <textarea
            ref={taRef}
            defaultValue={SQL}
            spellCheck={false}
            style={{ width: 520, height: 240, minWidth: 260, maxWidth: 680, minHeight: 140, maxHeight: 420 }}
            className="block resize-both rounded-xl border border-stone-200 bg-stone-50/70 p-4 font-mono text-[13px] leading-6 text-stone-800 outline-none transition-[border-color,box-shadow] focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Why both axes here
          </p>
          <p className="mt-1.5 text-sm leading-6 text-stone-600">
            Queries are written wide, results are read tall. A vertical-only
            grip (like the notes editor) can&apos;t widen a long SELECT chain —
            so the console opts into <Code>resize: both</Code> and lets the
            analyst shape the workspace.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Why bounds on both axes
          </p>
          <p className="mt-1.5 text-sm leading-6 text-stone-600">
            Horizontal freedom is layout danger: a field dragged to 2000px
            wide would shred the card. <Code>min-width/max-width</Code> and{" "}
            <Code>min-height/max-height</Code> clamp it — the readout chip
            always shows a size the layout can survive.
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-100 px-5 py-3">
          <p className="font-mono text-xs text-stone-500">
            Results · 5 rows · 18 ms
          </p>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-100 font-mono text-[11px] uppercase tracking-wider text-stone-400">
              <th className="px-5 py-2.5 font-medium">channel</th>
              <th className="px-5 py-2.5 font-medium">orders</th>
              <th className="px-5 py-2.5 font-medium">revenue</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r[0]} className="border-b border-stone-50 font-mono text-[13px] text-stone-700 last:border-0">
                <td className="px-5 py-2.5">{r[0]}</td>
                <td className="px-5 py-2.5">{r[1]}</td>
                <td className="px-5 py-2.5">${r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ScenarioNav
        nextHref="/scenarios/feedback-form"
        nextLabel="Feedback form"
      />
    </main>
  );
}