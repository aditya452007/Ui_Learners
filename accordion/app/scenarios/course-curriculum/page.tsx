"use client";

import Link from "next/link";
import { useId, useState } from "react";

type Lesson = { title: string; length: string; locked?: boolean };
type Module = { title: string; meta: string; lessons: Lesson[] };

const MODULES: Module[] = [
  {
    title: "1 · Foundations",
    meta: "4 lessons · 42 min",
    lessons: [
      { title: "What a design system actually is", length: "8:12" },
      { title: "Tokens: color, type, space", length: "11:47" },
      { title: "Anatomy of a button", length: "9:31" },
      { title: "Your first component audit", length: "12:40" },
    ],
  },
  {
    title: "2 · Patterns in the wild",
    meta: "5 lessons · 58 min",
    lessons: [
      { title: "Disclosure: accordions, tabs, dialogs", length: "13:05" },
      { title: "Forms that forgive", length: "10:22" },
      { title: "Empty states & error states", length: "9:58" },
      { title: "Motion with manners", length: "12:14" },
      { title: "Case study: checkout teardown", length: "12:33" },
    ],
  },
  {
    title: "3 · Shipping & governance",
    meta: "3 lessons · 35 min",
    lessons: [
      { title: "Versioning without tears", length: "10:44" },
      { title: "Docs people actually read", length: "11:19" },
      { title: "Capstone: ship your system", length: "12:57", locked: true },
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

function ModuleCard({
  module,
  mIndex,
  forceOpen,
  done,
  onToggleLesson,
}: {
  module: Module;
  mIndex: number;
  forceOpen: boolean | null;
  done: Set<string>;
  onToggleLesson: (key: string) => void;
}) {
  const [open, setOpen] = useState(mIndex === 0);
  const baseId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const btnId = `${baseId}-btn`;
  const panelId = `${baseId}-panel`;
  const isOpen = forceOpen ?? open;
  const doneCount = module.lessons.filter((_, l) => done.has(`${mIndex}-${l}`)).length;

  return (
    <div className={`overflow-hidden rounded-2xl border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors ${isOpen ? "border-teal-700/40" : "border-stone-200"}`}>
      {/* THE CUSTOM PRIMITIVE: button + aria-expanded + region. No <details> here. */}
      <button
        type="button"
        id={btnId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="acc-focusable flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-stone-50"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-stone-900 text-sm font-bold text-white">
          {mIndex + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold text-stone-900">
            {module.title}
          </span>
          <span className="text-[12px] text-stone-400">
            {module.meta} · {doneCount}/{module.lessons.length} done
          </span>
        </span>
        <span className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-stone-100" role="img" aria-label={`${doneCount} of ${module.lessons.length} lessons complete`}>
          <span
            className="block h-full rounded-full bg-teal-600 transition-all duration-300"
            style={{ width: `${(doneCount / module.lessons.length) * 100}%` }}
          />
        </span>
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={`shrink-0 text-teal-700 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        data-open={isOpen}
        className="custom-panel"
        hidden={!isOpen && forceOpen === null ? undefined : !isOpen}
      >
        <div>
          <ol className="mx-4 mb-4 space-y-1 rounded-xl bg-stone-50 p-2">
            {module.lessons.map((lesson, l) => {
              const key = `${mIndex}-${l}`;
              const isDone = done.has(key);
              return (
                <li key={key}>
                  <button
                    type="button"
                    disabled={lesson.locked}
                    onClick={() => onToggleLesson(key)}
                    aria-pressed={isDone}
                    title={lesson.locked ? "Finish earlier lessons to unlock" : isDone ? "Mark as not done" : "Mark as done"}
                    className={`acc-focusable flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] transition-colors ${
                      lesson.locked
                        ? "cursor-not-allowed opacity-50"
                        : isDone
                          ? "text-stone-400 hover:bg-white"
                          : "text-stone-700 hover:bg-white"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`grid size-5 shrink-0 place-items-center rounded-full border text-[11px] font-bold ${
                        isDone
                          ? "border-teal-700 bg-teal-700 text-white"
                          : "border-stone-300 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    <span className={`min-w-0 flex-1 truncate ${isDone ? "line-through" : ""}`}>
                      {lesson.title}
                    </span>
                    {lesson.locked ? (
                      <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[11px] font-semibold text-stone-500">
                        🔒 Locked
                      </span>
                    ) : (
                      <span className="font-mono text-[12px] text-stone-400">{lesson.length}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default function CurriculumScenario() {
  const [forceOpen, setForceOpen] = useState<boolean | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set(["0-0", "0-1"]));

  const toggleLesson = (key: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const total = MODULES.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-10 sm:px-8">
      <ScenarioNav prev={["/scenarios/product-details", "Product details"]} next={["/scenarios/faq", "Help-center FAQ"]} />
      <header className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
          Scenario 3 · custom primitive · button + aria-expanded
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Design Systems 101 — curriculum
        </h1>
        <p className="mt-2 text-[15px] leading-7 text-stone-500">
          Why it fits here — and why it&apos;s custom: a syllabus needs things native{" "}
          <code className="font-mono text-[0.85em]">&lt;details&gt;</code> can&apos;t do:
          Expand-all / Collapse-all buttons, per-module progress bars, and locked lessons.
          So each module is a <code className="font-mono text-[0.85em]">button</code> driving
          a region — and <em>here</em> <code className="font-mono text-[0.85em]">aria-expanded</code>{" "}
          is required, because no browser semantics announce the state for us.
        </p>
      </header>

      {/* course context */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-stone-900 p-5 text-white">
        <div>
          <p className="font-bold">
            {done.size} of {total} lessons complete ({Math.round((done.size / total) * 100)}%)
          </p>
          <div className="mt-2 h-2 w-56 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-teal-400 transition-all duration-300"
              style={{ width: `${(done.size / total) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setForceOpen((v) => (v === true ? null : true))}
            className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-stone-900 hover:bg-stone-200"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={() => setForceOpen((v) => (v === false ? null : false))}
            className="rounded-full border border-white/30 px-4 py-2 text-[13px] font-semibold text-white hover:bg-white/10"
          >
            Collapse all
          </button>
        </div>
      </div>
      {forceOpen !== null && (
        <button
          type="button"
          onClick={() => setForceOpen(null)}
          className="mt-2 text-[13px] font-medium text-teal-700 hover:underline"
        >
          Release manual control — let each module remember its own state
        </button>
      )}

      <div className="mt-4 space-y-3">
        {MODULES.map((m, i) => (
          <ModuleCard
            key={m.title}
            module={m}
            mIndex={i}
            forceOpen={forceOpen}
            done={done}
            onToggleLesson={toggleLesson}
          />
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-5 text-[14px] leading-7 text-stone-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <p className="font-bold text-stone-900">Native vs. custom — the one-line rule</p>
        <p className="mt-1">
          Native <code className="font-mono text-[0.9em]">&lt;details&gt;</code>: never add{" "}
          <code className="font-mono text-[0.9em]">aria-expanded</code> — the browser already
          announces open/closed. Custom <code className="font-mono text-[0.9em]">button</code> +
          region (like above): always add{" "}
          <code className="font-mono text-[0.9em]">aria-expanded</code>, wire{" "}
          <code className="font-mono text-[0.9em]">aria-controls</code> to the panel&apos;s id,
          and give the panel <code className="font-mono text-[0.9em]">role=&quot;region&quot;</code> with{" "}
          <code className="font-mono text-[0.9em]">aria-labelledby</code> pointing back. Same
          contract, different owner.
        </p>
      </div>
    </div>
  );
}
