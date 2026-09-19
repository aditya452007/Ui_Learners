"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AvatarGroup } from "./components/AvatarGroup";
import { ScenarioNav } from "./components/ScenarioNav";
import { TEAM } from "./data";

type PartId = "stack" | "ring" | "fallback" | "overflow";

const PARTS: {
  id: PartId;
  n: number;
  name: string;
  symbol: string;
  see: string;
  how: string;
}[] = [
  {
    id: "stack",
    n: 1,
    name: "Avatar stack (the overlap)",
    symbol: "margin-inline-start: -10px",
    see: "The row of circles sliding over each other like shingles on a roof. The overlap is the whole point — it turns a long list of faces into one compact pile that says “a group did this” at a glance.",
    how: "Every avatar after the first is pulled back with a negative margin-inline-start (a prop you could call spacing or overlap), so the circles paint on top of each other. z-index decides which face wins where they cross — first-on-top by default. Like stacking coins slightly offset so you can still count them.",
  },
  {
    id: "ring",
    n: 2,
    name: "Separation ring",
    symbol: "border · groupBorderColor",
    see: "The thin light rim around each face that stops photos blending into one another. Without it two dark photos melt together; with it every member stays countable, even where circles cross.",
    how: "Each avatar wears a 2px border painted in the color of the surface behind the group (Ant Design exposes this as the groupBorderColor token). It is not a focus ring — it never moves, it just matches the card. Flip the “ring” switch below to see faces smear together without it.",
  },
  {
    id: "fallback",
    n: 3,
    name: "Fallback initials",
    symbol: "AvatarFallback",
    see: "The tinted circle with someone's initials — Priya's soft-orange “PN” above. It appears whenever a member has no photo or their photo fails to load, so nobody ever renders as a broken image.",
    how: "Inside each avatar the code asks: did an image load? If yes it paints the <img>; if no it renders AvatarFallback (shadcn/ui's name, Chakra calls it Avatar.Fallback) with initials on a flat tint. Ray's photo URL in this demo is broken on purpose — watch him fall back to “RK”. Like a name badge handed out when the photo booth is closed.",
  },
  {
    id: "overflow",
    n: 4,
    name: "Overflow avatar (+N)",
    symbol: "AvatarGroupCount · max · total",
    see: "The last circle that says +4 instead of showing another face. It fills a member slot and counts the people who did not fit, so a team of nine still fits in the width of four.",
    how: "The group takes max (how many slots) and total (how many people exist). Visible faces are members.slice(0, max) and the last circle renders total − max as +N — MUI generates it from max and total, shadcn/ui ships it as AvatarGroupCount. Drag the “visible” slider below and watch +N count up and down. It is not a badge; it occupies a real slot in the stack.",
  },
];

const API_CHIPS = [
  "MUI AvatarGroup",
  "max · total",
  "renderSurplus",
  "AvatarGroupCount",
  "margin-inline-start",
  "stacking · z-index",
  "Avatar.Group",
  "Facepile",
  "AvatarFallback",
];

export default function Home() {
  const [max, setMax] = useState(5);
  const [overlap, setOverlap] = useState(-12);
  const [size, setSize] = useState(56);
  const [ring, setRing] = useState(true);
  const [reverse, setReverse] = useState(false);
  const [active, setActive] = useState<PartId | null>(null);

  const hiddenCount = useMemo(
    () => Math.max(0, TEAM.length - max),
    [max]
  );

  return (
    <div className="min-h-full">
      {/* header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f766e]">
            NameThatUi · Web component
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-stone-900">
            Avatar Group
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Also called:{" "}
            <span className="font-medium text-stone-700">
              facepile · avatar stack · stacked avatars · grouped avatars ·
              avatar pile
            </span>
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-600">
            The overlapping circles of profile pictures. A row of Avatar
            circles pulled over each other with a negative margin, each wearing
            a ring in the surface color so the faces never blend together. When
            there are more people than slots, the last circle stops being a
            face and becomes an overflow avatar counting the rest.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {API_CHIPS.map((c) => (
              <span
                key={c}
                className="rounded-full bg-stone-100 px-2.5 py-1 font-mono text-[11px] text-stone-600 ring-1 ring-stone-200"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="mt-6">
            <ScenarioNav current="/" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* intro strip */}
        <section aria-label="What am I looking at" className="grid gap-3 sm:grid-cols-3">
          {[
            {
              t: "Members",
              d: "One circle per person — photo when there is one, tinted initials when there isn't.",
              icon: "●◍●",
            },
            {
              t: "Stack",
              d: "Negative margin pulls each circle over the last; z-index picks the winner.",
              icon: "◍⃝●",
            },
            {
              t: "Overflow",
              d: "+N counts everyone past max so nine people fit in five slots.",
              icon: "+4",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-2xl bg-white p-5 ring-1 ring-stone-200 shadow-[0_2px_10px_-4px_rgb(0_0_0/0.08)]"
            >
              <p className="font-mono text-lg text-[#0f766e]">{c.icon}</p>
              <h2 className="mt-1 font-semibold text-stone-900">{c.t}</h2>
              <p className="mt-1 text-sm leading-relaxed text-stone-500">
                {c.d}
              </p>
            </div>
          ))}
        </section>

        {/* anatomy diagram */}
        <section
          aria-label="Live anatomy diagram"
          className="mt-8 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.15)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 px-6 py-4">
            <h2 className="font-semibold text-stone-900">
              Anatomy diagram — hover a part, watch it light up
            </h2>
            <p className="font-mono text-xs text-stone-400">
              {TEAM.length} members · showing {Math.min(max, TEAM.length)} +{" "}
              {hiddenCount > 0 ? `+${hiddenCount}` : "no overflow"}
            </p>
          </div>

          {/* stage */}
          <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
            <div className="relative flex min-h-[300px] flex-col items-center justify-center gap-6 bg-[#fafaf9] px-6 py-12">
              {/* numbered pills row */}
              <div className="flex flex-wrap justify-center gap-2">
                {PARTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onMouseEnter={() => setActive(p.id)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(p.id)}
                    onBlur={() => setActive(null)}
                    onClick={() => setActive(active === p.id ? null : p.id)}
                    aria-pressed={active === p.id}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      active === p.id
                        ? "bg-[#0f766e] text-white shadow-[0_4px_12px_-4px_rgb(15_118_110/0.6)]"
                        : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-[#0f766e]"
                    }`}
                  >
                    <span
                      className={`grid h-5 w-5 place-items-center rounded-full text-[11px] ${
                        active === p.id
                          ? "bg-white/20 text-white"
                          : "bg-[#0f766e]/10 text-[#0f766e]"
                      }`}
                    >
                      {p.n}
                    </span>
                    {p.name}
                  </button>
                ))}
              </div>

              {/* the live group */}
              <div
                className="rounded-2xl bg-white px-10 py-8 shadow-[0_4px_20px_-8px_rgb(0_0_0/0.12)] ring-1 ring-stone-200"
                onMouseLeave={() => {
                  if (active === "stack") setActive(null);
                }}
              >
                <AvatarGroup
                  members={TEAM}
                  max={max}
                  size={size}
                  overlap={overlap}
                  ringColor={ring ? "#ffffff" : "transparent"}
                  reverseStack={reverse}
                  spotlight={active}
                />
                <p className="mt-4 text-center font-mono text-[11px] text-stone-400">
                  margin-inline-start: {overlap}px · z-index:{" "}
                  {reverse ? "last on top" : "first on top"} · ring:{" "}
                  {ring ? "2px #fff" : "off"}
                </p>
              </div>

              {/* controls */}
              <div className="grid w-full max-w-xl gap-4 rounded-2xl bg-white p-5 ring-1 ring-stone-200">
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block">
                    <span className="mb-1.5 flex justify-between text-xs font-semibold text-stone-700">
                      Visible <span className="font-mono text-[#0f766e]">{max}</span>
                    </span>
                    <input
                      type="range"
                      min={2}
                      max={8}
                      value={max}
                      onChange={(e) => setMax(Number(e.target.value))}
                      className="control-range"
                      aria-label="Visible avatars before overflow"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 flex justify-between text-xs font-semibold text-stone-700">
                      Overlap{" "}
                      <span className="font-mono text-[#0f766e]">{overlap}px</span>
                    </span>
                    <input
                      type="range"
                      min={-20}
                      max={-4}
                      value={overlap}
                      onChange={(e) => setOverlap(Number(e.target.value))}
                      className="control-range"
                      aria-label="Overlap amount"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 flex justify-between text-xs font-semibold text-stone-700">
                      Size <span className="font-mono text-[#0f766e]">{size}px</span>
                    </span>
                    <input
                      type="range"
                      min={36}
                      max={68}
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="control-range"
                      aria-label="Avatar size"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Toggle
                    on={ring}
                    onClick={() => setRing(!ring)}
                    label={`Separation ring ${ring ? "on" : "off"}`}
                  />
                  <Toggle
                    on={reverse}
                    onClick={() => setReverse(!reverse)}
                    label={reverse ? "Stacking: last on top" : "Stacking: first on top"}
                  />
                </div>
              </div>
            </div>

            {/* side legend */}
            <aside className="border-t border-stone-100 bg-white lg:border-l lg:border-t-0">
              {PARTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onMouseEnter={() => setActive(p.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(p.id)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(active === p.id ? null : p.id)}
                  className={`flex w-full items-start gap-3 border-b border-stone-100 px-5 py-4 text-left transition-colors last:border-0 ${
                    active === p.id ? "bg-[#f0fdfa]" : "hover:bg-stone-50"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full text-xs font-bold ${
                      active === p.id
                        ? "bg-[#0f766e] text-white"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {p.n}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-stone-900">
                      {p.name}
                    </span>
                    <span className="mt-0.5 block font-mono text-[11px] text-[#0f766e]">
                      {p.symbol}
                    </span>
                  </span>
                </button>
              ))}
            </aside>
          </div>
        </section>

        {/* layered explanations */}
        <section aria-label="What each part does" className="mt-8 grid gap-4 md:grid-cols-2">
          {PARTS.map((p) => (
            <article
              key={p.id}
              onMouseEnter={() => setActive(p.id)}
              onMouseLeave={() => setActive(null)}
              className={`rounded-2xl bg-white p-6 ring-1 transition-shadow ${
                active === p.id
                  ? "shadow-[0_8px_24px_-10px_rgb(15_118_110/0.4)] ring-[#0f766e]"
                  : "shadow-[0_2px_10px_-4px_rgb(0_0_0/0.08)] ring-stone-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#0f766e] text-sm font-bold text-white">
                  {p.n}
                </span>
                <div>
                  <h3 className="font-semibold text-stone-900">{p.name}</h3>
                  <p className="font-mono text-[11px] text-[#0f766e]">{p.symbol}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-xl bg-stone-50 p-3.5 ring-1 ring-stone-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    What you see
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600">
                    {p.see}
                  </p>
                </div>
                <div className="rounded-xl bg-[#f0fdfa] p-3.5 ring-1 ring-[#ccfbf1]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0f766e]">
                    How it works
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600">
                    {p.how}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* code strip */}
        <section aria-label="The CSS trick" className="mt-8 overflow-hidden rounded-2xl bg-[#1c1917] text-stone-200 shadow-lg">
          <div className="flex items-center justify-between px-6 py-3.5">
            <p className="text-sm font-semibold text-white">
              The whole trick is three declarations
            </p>
            <p className="font-mono text-[11px] text-stone-400">AvatarGroup.css</p>
          </div>
          <pre className="overflow-x-auto border-t border-white/10 px-6 py-5 font-mono text-[12.5px] leading-relaxed">
{`.avatar-stack > *:not(:first-child) {
  margin-inline-start: -12px; /* ① the overlap */
}
.avatar-stack > * {
  border: 2px solid #fff;     /* ② the separation ring */
  z-index: …;                 /* ③ deterministic stacking */
}
/* +N overflow: members.slice(0, max), rest counted */`}
          </pre>
        </section>

        {/* scenarios */}
        <section aria-label="Scenarios" className="mt-8">
          <h2 className="text-xl font-bold text-stone-900">
            See it in three real products
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Same component, three different configurations — size, spacing,
            overflow behavior, and surface each change to fit the context.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              {
                href: "/scenarios/task-board",
                title: "Task board assignees",
                d: "Small 32px circles, tight −10px overlap, tooltips + overflow popover on a task card.",
                tag: "Small · interactive max",
              },
              {
                href: "/scenarios/live-doc",
                title: "Live document presence",
                d: "Who's in the doc right now — green presence dots, initials fallback, join/leave live.",
                tag: "Presence · fallback",
              },
              {
                href: "/scenarios/event-rsvp",
                title: "Event guest list",
                d: "Large 48px faces on a warm card, looser spacing, +N opens a searchable attendee sheet.",
                tag: "Large · sheet overflow",
              },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-2xl bg-white p-6 ring-1 ring-stone-200 shadow-[0_2px_10px_-4px_rgb(0_0_0/0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgb(0_0_0/0.2)] hover:ring-[#0f766e]"
              >
                <p className="font-mono text-[11px] text-[#0f766e]">{s.tag}</p>
                <h3 className="mt-1 font-semibold text-stone-900 group-hover:text-[#0f766e]">
                  {s.title} →
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
                  {s.d}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-10 border-t border-stone-200 py-6 text-sm text-stone-400">
          <p>
            Built by hand — no component library. Overlap via{" "}
            <span className="font-mono">margin-inline-start</span>, ring via{" "}
            <span className="font-mono">border</span>, order via{" "}
            <span className="font-mono">z-index</span>. Photos from
            i.pravatar.cc with initials fallback if they fail.
          </p>
        </footer>
      </main>
    </div>
  );
}

function Toggle({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
        on
          ? "bg-[#0f766e] text-white"
          : "bg-stone-100 text-stone-500 ring-1 ring-stone-200 hover:text-stone-700"
      }`}
    >
      {label}
    </button>
  );
}
