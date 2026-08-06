"use client";

import { useState } from "react";
import Link from "next/link";
import type { CSSProperties } from "react";

const CODE_HEADER = "<header>";
const CODE_NAV = '<nav aria-label="Main">';
const CODE_CURRENT = 'aria-current="page"';
const CODE_SELECTOR = '[aria-current="page"]';

const NAV_ITEMS: readonly string[] = ["Overview", "Build", "Pricing", "Docs"];

interface CustomProperties extends CSSProperties {
  "--i": string;
}

const trackStyle = (index: number): CustomProperties => ({ "--i": String(index) });

interface AnatomyPart {
  number: string;
  code: string;
  name: string;
  see: string;
  build: string;
}

const PARTS: readonly AnatomyPart[] = [
  {
    number: "1",
    code: CODE_HEADER,
    name: "Site Header — the banner",
    see: "The whole strip across the top keeps you oriented. Brand, links and actions sit in one predictable, persistent place, so you always know where you are on the site and where to go next without hunting around.",
    build: "<header> is a semantic tag — it tells the browser and screen readers that this strip is the page banner, a landmark (a named region a visitor can jump straight to, like the front door you enter through). Any state — values the component remembers between clicks — that changes inside it makes React re-render, meaning draw the screen again, to reflect the change.",
  },
  {
    number: "2",
    code: CODE_NAV,
    name: "Navigation region — just the links",
    see: "The destinations. Grouped like this, scanning where you can go takes one glance, and the actions — sign in, start free — are kept apart from the places. Your eye never has to separate them yourself.",
    build: "<nav> wraps only the destination links; aria-label=\"Main\" gives the group a plain-language name a screen reader can announce, like a label beside a door. A page can hold several navs (main versus footer), so naming them tells assistive tech exactly which doors are which. The brand and action buttons stay outside <nav> on purpose — the region is purely 'where you can go.'",
  },
  {
    number: "3",
    code: CODE_CURRENT,
    name: "Current-page link — this is where I am",
    see: "Exactly one link stays highlighted — a pill, underline or bold — so the page never makes you ask 'where am I?'. Click a link and the cue moves with you instead of going stale.",
    build: "The component keeps the active index in state — a value it remembers between clicks. The active link alone receives the aria-current attribute, and it is styled through the CSS attribute selector [aria-current=\"page\"] — Tailwind writes it as aria-[current=page]:... So one attribute drives both the visible pill and the screen-reader 'current page' announcement, instead of a hand-toggled class that can drift out of date.",
  },
];

interface Scenario {
  name: string;
  href: string;
  blurb: string;
}

const SCENARIOS: readonly Scenario[] = [
  {
    name: "Marketing site",
    href: "/scenarios/marketing-site",
    blurb: "A sticky glass header with a pill highlight and a staggered mobile menu.",
  },
  {
    name: "SaaS dashboard",
    href: "/scenarios/dashboard-app",
    blurb: "Compact top bar: sliding tab underline, expanding search, animated menus.",
  },
  {
    name: "Editorial magazine",
    href: "/scenarios/editorial-magazine",
    blurb: "Minimal serif masthead that hides on scroll and opens a full-screen menu.",
  },
];

const CODE_SNIPPET = `<div>
    <a href="/">Brand</a>
    <nav aria-label="Main">
      <a href="/docs" aria-current="page">Docs</a>
      <a href="/pricing">Pricing</a>
    </nav>
    <button type="button">Sign in</button>
</div>`;

const CODE_TOGGLE_HABIT = `// the toggle-class habit
link.classList.add("active");

.active {
  color: #4f46e5;
  font-weight: 600;
}`;

const CODE_ATTR_WAY = `<a href="/docs" aria-current="page">Docs</a>

[aria-current="page"] {
  color: #4f46e5;
  font-weight: 600;
}`;

const SHADOW =
  "0 1px 2px rgba(0,0,0,0.04), 0 16px 40px -20px rgba(28,25,23,0.18)";

function CodeChip({ value }: { value: string }) {
  return (
    <span className="inline-flex max-w-full items-center font-mono text-[12.5px] text-indigo-700">
      <span className="rounded-md border border-indigo-200/60 bg-indigo-50 px-1.5 py-0.5">
        {value}
      </span>
    </span>
  );
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div>
      {label ? (
        <div className="mb-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" aria-hidden />
          <span className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
            {label}
          </span>
        </div>
      ) : null}
      <pre className="overflow-x-auto rounded-xl bg-stone-900 p-5 font-mono text-[13px] leading-relaxed text-stone-100 shadow-md">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function AnatomyLabel({
  number,
  code,
  name,
}: {
  number: string;
  code: string;
  name: string;
}) {
  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap rounded-xl border border-stone-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-600 text-xs font-semibold text-white shadow-md">
        {number}
      </span>
      <div className="text-left text-[12px] leading-snug">
        <p className="font-semibold text-stone-900">{name}</p>
        <p className="font-mono text-[10.5px] text-indigo-700">{code}</p>
      </div>
    </div>
  );
}

function AnatomyNav() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div
        className="pointer-events-auto relative grid w-[400px] grid-cols-4 gap-1"
        style={trackStyle(current)}
      >
        <div
          className="absolute z-20 flex -translate-x-1/2 flex-col items-center transition-all duration-300 ease-out"
          style={{ top: "-3.5rem", left: "calc((var(--i) + 0.5) * 25%)" }}
        >
          <AnatomyLabel
            number="3"
            code={CODE_CURRENT}
            name="Current-Page Link — follows the active route"
          />
          <div
            aria-hidden
            className="h-1 w-px border-l border-dashed border-stone-400"
          />
          <div
            aria-hidden
            className="h-2 w-2 -mt-px rotate-45 border-b border-r border-stone-400 bg-white"
          />
        </div>
        {NAV_ITEMS.map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => setCurrent(index)}
            aria-current={index === current ? "page" : undefined}
            className="h-10 cursor-pointer rounded-md text-sm font-medium text-stone-500 transition-all duration-200 hover:bg-stone-50 hover:text-stone-900 aria-[current=page]:bg-stone-100 aria-[current=page]:text-stone-900"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      {/* 1 — HERO */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-14 pt-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-indigo-600">
          NAME THAT UI · ANATOMY
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl">
          Site Header vs. Navigation Bar
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone-600">
          The whole strip across the top of a site — logo, links, search, sign-in —
          is the <em>site header</em>. The row of destination links inside it is
          the <em>navigation bar</em>. When someone says “the navbar” they usually
          mean both, but they are two nested pieces with two different jobs.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="text-sm text-stone-400">Also called:</span>
          {(["navbar", "topbar", "app bar", "main navigation", "page header"] as const).map(
            (label) => (
              <span
                key={label}
                className="rounded-full border border-stone-200 bg-white px-3 py-1 text-sm text-stone-500"
              >
                {label}
              </span>
            )
          )}
        </div>
      </section>

      {/* INTRO STRIP */}
      <section className="mx-auto max-w-5xl px-6 pt-10">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-stone-900">
            What am I looking at
          </h2>
          <div className="flex-1 h-px bg-stone-200" aria-hidden />
          <span className="text-xs font-mono text-stone-400">the three layers</span>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {/* Card 1 */}
          <article
            className="rounded-2xl border border-stone-200/70 bg-white p-5"
            style={{ boxShadow: SHADOW }}
          >
            <div className="rounded-lg border-2 border-dashed border-indigo-300 bg-white p-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-9 rounded bg-indigo-600/20" aria-hidden />
                <div className="ml-1 flex flex-1 items-center justify-center gap-1">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="h-1 w-3 rounded-full bg-stone-200" aria-hidden />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-3 w-7 rounded-full bg-stone-100" aria-hidden />
                  <span className="h-3 w-7 rounded-full bg-indigo-600/80" aria-hidden />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <CodeChip value={CODE_HEADER} />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              The banner — the full-width shell holding the brand, the links and
              the actions. A page-level landmark.
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-stone-400">
              Every website opens with that same strip at the top.
            </p>
          </article>

          {/* Card 2 */}
          <article
            className="rounded-2xl border border-stone-200/70 bg-white p-5"
            style={{ boxShadow: SHADOW }}
          >
            <div className="rounded-lg bg-white p-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-5 rounded bg-indigo-600/20" aria-hidden />
                <div className="ml-1 rounded-lg border-2 border-dashed border-indigo-300 px-1">
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-1 w-3 rounded-full bg-stone-200" aria-hidden />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-3 w-7 rounded-full bg-stone-100" aria-hidden />
                  <span className="h-3 w-7 rounded-full bg-indigo-600/80" aria-hidden />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <CodeChip value={CODE_NAV} />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              The Navigation Region — only the destination links, nothing else.
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-stone-400">
              A named group a screen reader can call out.
            </p>
          </article>

          {/* Card 3 */}
          <article
            className="rounded-2xl border border-stone-200/70 bg-white p-5"
            style={{ boxShadow: SHADOW }}
          >
            <div className="rounded-lg bg-white p-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-5 rounded bg-indigo-600/20" aria-hidden />
                <div className="ml-1 flex flex-1 items-center justify-center gap-1">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className={
                        d === 2
                          ? "h-1.5 w-4 rounded-full bg-indigo-200"
                          : "h-1 w-3 rounded-full bg-stone-200"
                      }
                      aria-hidden
                    />
                  ))}
                  <span className="h-1.5 w-4 rounded-full bg-indigo-600" aria-hidden />
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-3 w-7 rounded-full bg-stone-100" aria-hidden />
                  <span className="h-3 w-7 rounded-full bg-indigo-600/80" aria-hidden />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <CodeChip value={CODE_CURRENT} />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              The Current-Page Link — marked so browsers, screen readers and CSS
              all know which page you are on.
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-stone-400">
              One fact, spoken in several ways at once.
            </p>
          </article>
        </div>
      </section>

      {/* LIVE ANATOMY DIAGRAM */}
      <section className="mx-auto max-w-5xl px-6 pt-16">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-stone-900">
            Live anatomy
          </h2>
          <div className="h-px flex-1 bg-stone-200" aria-hidden />
          <span className="text-xs font-mono text-stone-400">click a link</span>
        </div>

        <div
          className="relative mt-6 rounded-2xl border border-stone-200/70 bg-white"
          style={{ boxShadow: SHADOW }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background:
                "radial-gradient(120% 90% at 50% -30%, rgba(79,70,229,0.09), transparent 60%)",
            }}
          />
          <div className="relative overflow-x-auto px-6 pb-24 pt-32">
            <div className="relative mx-auto min-w-[880px]">
              {/* PILL 1 — site header, top-left */}
              <div className="absolute left-0 top-[-104px] z-20">
                <AnatomyLabel
                  number="1"
                  code={CODE_HEADER}
                  name="Site Header — the whole banner strip"
                />
              </div>
              <div
                aria-hidden
                className="absolute left-[14px] top-[-60px] z-10 h-[40px] w-0 border-l border-dashed border-stone-400"
              />
              <div
                aria-hidden
                className="absolute left-0 top-[-18px] z-10 w-[150px] border-t border-dashed border-stone-400"
              />
              <div
                aria-hidden
                className="absolute left-0 top-[-18px] z-10 h-[12px] w-0 border-l border-dashed border-stone-400"
              />

              {/* PILL 2 — nav region, bottom */}
              <div
                className="absolute z-20"
                style={{ left: "calc(50% - 236px)", top: "5.5rem" }}
              >
                <div
                  aria-hidden
                  className="absolute left-[15px] top-[-30px] h-[26px] w-0 border-l border-dashed border-stone-400"
                />
                <AnatomyLabel
                  number="2"
                  code={CODE_NAV}
                  name="Navigation Region — just the links"
                />
              </div>

              {/* the realistic desktop header */}
              <div className="relative flex h-20 items-center border-b border-stone-200 bg-white/70 px-5">
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-2 rounded-lg"
                >
                  <span
                    aria-hidden
                    className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-sm"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                      <path d="M12 3c1.2 3.5 3.5 5.8 7 7-3.5 1.2-5.8 3.5-7 7-1.2-3.5-3.5-5.8-7-7 3.5-1.2 5.8-3.5 7-7Z" />
                    </svg>
                  </span>
                  <span className="text-[15px] font-semibold tracking-tight text-stone-900">
                    Aurora
                  </span>
                </button>

                {/* centered nav track — holds the live callout */}
                <AnatomyNav />

                <div className="ml-auto flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Search"
                    className="grid h-9 w-9 place-items-center rounded-full text-stone-500 transition-all duration-200 hover:bg-stone-100 hover:text-stone-900"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      className="h-4.5 w-4.5"
                      aria-hidden
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-3.2-3.2" />
                    </svg>
                  </button>
                  <span className="mx-1 h-5 w-px bg-stone-200" aria-hidden />
                  <button
                    type="button"
                    className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition-all duration-200 hover:bg-stone-100 hover:text-stone-900"
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500 active:scale-[0.98]"
                  >
                    Start free
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="relative px-6 pb-6 text-center text-sm text-stone-500">
            The component above is live — click a link and callout 3 chases the page
            you are standing on.
          </p>
        </div>
      </section>

      {/* LAYERED EXPLANATIONS */}
      <section className="mx-auto max-w-5xl px-6 pt-16">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-stone-900">
            Every part, explained twice
          </h2>
          <span className="h-px flex-1 bg-stone-200" aria-hidden />
          <span className="text-xs font-mono text-stone-400">two audiences</span>
        </div>

        <div className="mt-6 space-y-5">
          {PARTS.map((part) => (
            <article
              key={part.number}
              className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(28,25,23,0.18)] md:p-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-600 text-xs font-semibold text-white shadow-md">
                  {part.number}
                </span>
                <h3 className="text-base font-semibold tracking-tight text-stone-900">
                  {part.name}
                </h3>
                <CodeChip value={part.code} />
              </div>
              <div className="mt-5 grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-stone-400">
                    What you see · the person using the product
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">
                    {part.see}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-indigo-600">
                    How it works · the person building it
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">
                    {part.build}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* WHY NOT A CLASS */}
      <section className="mx-auto max-w-5xl px-6 pt-16">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-stone-900">
            Why not a class?
          </h2>
          <span className="h-px flex-1 bg-stone-200" aria-hidden />
          <span className="text-xs font-mono text-stone-400">one attribute</span>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(28,25,23,0.18)]">
            <h3 className="text-sm font-semibold text-stone-900">
              The toggle-class habit
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              An imperative script adds or removes a class like{" "}
              <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[12px] text-stone-700">
                active
              </code>{" "}
              and CSS dresses that class. Sync between JS and markup is your
              responsibility — and it drifts.
            </p>
            <div className="mt-5">
              <CodeBlock code={CODE_TOGGLE_HABIT} />
            </div>
          </article>

          <article className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(28,25,23,0.18)]">
            <h3 className="text-sm font-semibold text-stone-900">
              What this lab teaches
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Put{" "}
              <code className="rounded bg-stone-300/70 px-1 py-0.5 font-mono text-[12px] text-stone-700">
                aria-current=&quot;page&quot;
              </code>{" "}
              on the one live link, and the CSS attribute selector does the rest.
              Both the pill and the screen-reader announcement read the same fact.
            </p>
            <div className="mt-5">
              <CodeBlock code={CODE_ATTR_WAY} />
            </div>
          </article>
        </div>

        <div className="mt-5 rounded-2xl border-l-4 border-indigo-600 bg-indigo-50 p-6">
          <p className="text-sm font-semibold text-stone-900">
            Style the current state off the attribute, not off a class.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            The highlight and the announcement then come from one line of markup —
            nothing to keep in sync.
          </p>
        </div>
      </section>

      {/* THE ACTUAL CODE */}
      <section className="mx-auto max-w-5xl px-6 pt-16">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-stone-900">
            The actual code
          </h2>
          <span className="h-px flex-1 bg-stone-200" aria-hidden />
          <span className="text-xs font-mono text-stone-400">smallest honest fragment</span>
        </div>

        <div className="mt-6">
          <CodeBlock code={CODE_SNIPPET} />
        </div>

        <ul className="mt-6 space-y-2 text-sm leading-relaxed text-stone-600">
          <li className="flex items-start gap-2.5">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-stone-300" aria-hidden />
            <span>
              Page-level <CodeChip value={CODE_HEADER} /> = the banner landmark.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-stone-300" aria-hidden />
            <span>
              <CodeChip value={CODE_NAV} /> = only the destination links.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" aria-hidden />
            <span>
              Mark the page you are on with{" "}
              <CodeChip value={CODE_CURRENT} /> and style it via{" "}
              <CodeChip value={CODE_SELECTOR} /> — never a manual class.
            </span>
          </li>
        </ul>
      </section>

      {/* WHERE IT LIVES */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-stone-900">
            Where it lives
          </h2>
          <span className="h-px flex-1 bg-stone-200" aria-hidden />
          <span className="text-xs font-mono text-stone-400">three real homes</span>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {SCENARIOS.map((scenario) => (
            <Link
              key={scenario.href}
              href={scenario.href}
              className="group flex flex-col rounded-2xl border border-stone-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(28,25,23,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300"
            >
              <h3 className="text-sm font-semibold text-stone-900">
                {scenario.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {scenario.blurb}
              </p>
              <p className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] text-indigo-600 transition-colors duration-200 group-hover:text-indigo-500">
                go to demo →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* session nav footer */}
      <footer className="border-t border-stone-200/70 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 px-6">
          <span className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-stone-400 sm:flex">
            this session
          </span>
          <div className="flex flex-wrap items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600 shadow-sm">
            <Link
              href="/"
              aria-current="page"
              className="rounded-full bg-indigo-600 px-3 py-1 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500"
            >
              hub
            </Link>
            <span className="px-1 text-stone-300" aria-hidden>·</span>
            <span className="pr-1 text-stone-400">scenarios</span>
            {SCENARIOS.map((s, i) => (
              <span key={s.href} className="contents">
                {i > 0 ? (
                  <span className="px-0.5 text-stone-300" aria-hidden>→</span>
                ) : null}
                <Link
                  href={s.href}
                  className="rounded-full px-2.5 py-1 text-sm text-stone-500 transition-all duration-200 hover:bg-stone-100 hover:text-stone-900"
                >
                  {s.name.toLowerCase()}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}