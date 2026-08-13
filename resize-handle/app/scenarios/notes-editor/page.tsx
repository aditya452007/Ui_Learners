"use client";

import { useEffect, useRef, useState } from "react";
import { Code, Kicker, ScenarioNav, WhyNote } from "../../components/shared";

const NOTES = [
  {
    title: "Onboarding flow — draft",
    date: "Edited 2m ago",
    snippet: "Step 1: welcome screen should feel…",
    active: true,
  },
  {
    title: "Q3 retro notes",
    date: "Edited yesterday",
    snippet: "Ship faster, review slower. One owner per…",
  },
  {
    title: "Reading list",
    date: "Edited Aug 4",
    snippet: "The Design of Everyday Things — revisit ch. 4…",
  },
];

const DEFAULT_TEXT = `Step 1 — the welcome screen

I keep going back and forth on the headline. "Meet your team's second brain" feels too startup-y, but "Notes that write themselves" is a promise we can't keep.

Anyway — the onboarding flow ships with three screens max, and every copy decision goes through you before it touches the codebase.

Drag the grip in the bottom-right corner to make room for more of these ramblings. Vertical only, so the card stays tidy.`;

export default function NotesEditor() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [saveState, setSaveState] = useState<"saved" | "saving">("saved");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const first = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setSaveState("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaveState("saved"), 900);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [text]);

  const resetHeight = () => {
    if (taRef.current) taRef.current.style.height = "240px";
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <Kicker>Scenario 1 of 3 · Notes app</Kicker>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-900">
        Notes editor
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
        A writing surface where the grip is styled to match the product — an
        indigo ribbed corner — and where <Code>resize: vertical</Code> keeps
        the card layout perfectly still while the writing room grows and
        shrinks.
      </p>

      <div className="mt-8">
        <WhyNote>
          Notes apps live and die on comfort: a draft that can&apos;t make room
          for itself is a draft you stop writing. The grip is the user&apos;s
          escape hatch — styled indigo to feel native to the brand, and
          vertical-only so the notes list beside it never reflows. The min/max
          bounds stop one note from ballooning off screen.
        </WhyNote>
      </div>

      <div className="mt-8 flex flex-col gap-4 md:flex-row">
        <aside className="w-full md:w-56">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
            Notes
          </p>
          <div className="mt-3 space-y-2">
            {NOTES.map((n) => (
              <div
                key={n.title}
                className={
                  n.active
                    ? "rounded-xl border border-indigo-200 bg-white p-3 shadow-sm"
                    : "rounded-xl border border-stone-200 bg-white/60 p-3"
                }
              >
                <p className="text-sm font-semibold text-stone-900">{n.title}</p>
                <p className="mt-0.5 truncate text-xs text-stone-500">{n.snippet}</p>
                <p className="mt-1 font-mono text-[10px] text-stone-400">{n.date}</p>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1 rounded-2xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_32px_-20px_rgba(0,0,0,0.16)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-3.5">
            <p className="text-sm font-semibold text-stone-900">
              Onboarding flow — draft
            </p>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 font-mono text-[11px] text-stone-500">
                {words} words · {chars} chars
              </span>
              <span
                className={
                  saveState === "saved"
                    ? "flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-[11px] text-emerald-700"
                    : "flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-mono text-[11px] text-amber-700"
                }
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${saveState === "saved" ? "bg-emerald-500" : "animate-pulse bg-amber-500"}`}
                />
                {saveState === "saved" ? "Autosaved just now" : "Saving…"}
              </span>
            </div>
          </div>

          <textarea
            ref={taRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ height: 240, minHeight: 140, maxHeight: 400 }}
            className="grip-indigo block w-full resize-y rounded-none border-0 bg-transparent p-5 text-sm leading-6 text-stone-800 outline-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 px-5 py-3">
            <p className="text-xs text-stone-500">
              Tip: drag the ribbed corner (bottom-right) to make room for
              longer drafts. It only grows <em>down</em>.
            </p>
            <button
              onClick={resetHeight}
              className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:border-indigo-200 hover:text-indigo-600"
            >
              Reset to default height
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          The grip styling, hand-built
        </p>
        <p className="mt-1.5 text-sm leading-6 text-stone-600">
          WebKit/Blink browsers (Chrome, Edge, Safari) let you restyle the grip
          pixel with <Code>::-webkit-resizer</Code> — here it becomes indigo
          ribs with a pale outline. Firefox ignores it and keeps its native
          grip; the resize behaviour is identical.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-stone-900 p-4 font-mono text-xs leading-5 text-stone-200">
          {`.grip-indigo::-webkit-resizer {
  background: repeating-linear-gradient(
    135deg, transparent 0 4px, #818cf8 4px 6px
  );
  border-left: 1px solid #c7d2fe;
  border-top: 1px solid #c7d2fe;
  border-radius: 0 0 10px 0;
}`}
        </pre>
      </div>

      <ScenarioNav
        nextHref="/scenarios/query-console"
        nextLabel="Query console"
      />
    </main>
  );
}
