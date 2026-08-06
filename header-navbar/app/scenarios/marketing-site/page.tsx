"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "docs", label: "Docs" },
  { id: "changelog", label: "Changelog" },
] as const;

type NavId = (typeof NAV_ITEMS)[number]["id"];

const cardShadow =
  "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(28,25,23,0.18)]";

const chipClass =
  "inline-block rounded-md border border-indigo-200/60 bg-indigo-50 px-1.5 py-0.5 font-mono text-[12.5px] text-indigo-700";

const buttonPrimary =
  "inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 h-9 text-sm font-medium text-white transition-all hover:bg-indigo-500 active:scale-[0.98] focus-visible:ring-2 ring-indigo-500/60 ring-offset-2";

const headerMarkup = `<header>
  <a href="/">Lumen</a>
  <nav aria-label="Main">
    <a href="/features" aria-current="page">Features</a>
    <a href="/pricing">Pricing</a>
  </nav>
  <button>Sign in</button>
</header>`;

function CodeChip({ children }: { children: string }) {
  return <code className={chipClass}>{children}</code>;
}

function IconBolt() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 12 12 17 22 12" />
      <polyline points="2 17 12 22 22 17" />
    </svg>
  );
}

function IconDroplet() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: IconBolt,
    title: "Rapid canvas",
    body: "An infinite board that redraws in single-digit milliseconds, so live sessions never stutter even with 200 people in the room.",
  },
  {
    icon: IconLayers,
    title: "Versioned comments",
    body: "Every note is anchored to a layer and a version, so feedback stays attached to the exact stroke it was written about.",
  },
  {
    icon: IconDroplet,
    title: "Design tokens",
    body: "Colors, type and spacing live once and flow to every frame, keeping brand decisions true across the whole library.",
  },
] as const;

export default function MarketingSitePage() {
  const [current, setCurrent] = useState<NavId>("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const select = (id: NavId) => {
    setCurrent(id);
    setOpen(false);
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: NavId) => {
    e.preventDefault();
    select(id);
  };

  return (
    <div className="flex min-h-screen flex-col font-sans text-stone-900">
      <header
        className={`fixed inset-x-0 top-0 z-50 h-16 transition-all duration-300 ${
          scrolled
            ? "border-b border-stone-200/70 bg-white/75 shadow-[0_8px_30px_-12px_rgba(28,25,23,0.15)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="group flex items-center gap-2.5"
            aria-label="Lumen homepage"
          >
            <span className="relative block h-8 w-8 overflow-hidden rounded-lg bg-gradient-to-br from-indigo-400 via-indigo-600 to-indigo-800 shadow-[0_4px_12px_-4px_rgba(79,70,229,0.5)] transition-transform duration-300 group-hover:scale-105">
              <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-white/90" />
            </span>
            <span className="text-[17px] font-semibold tracking-tight text-stone-900">
              Lumen
            </span>
          </a>

          <nav
            aria-label="Main"
            className="hidden items-center gap-1 md:flex"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = current === item.id;
              return (
                <a
                  key={item.id}
                  href="#"
                  onClick={(e) => handleClick(e, item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className="group relative flex h-9 items-center rounded-full px-4 text-sm text-stone-500 transition-colors duration-200 hover:text-stone-900 aria-[current=page]:bg-indigo-50 aria-[current=page]:text-stone-900"
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 origin-center bg-indigo-600 transition-all duration-300 group-hover:w-1/2"
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(false)}
              className="hidden h-9 items-center rounded-full px-4 text-sm font-medium text-stone-600 transition-all hover:bg-stone-100 hover:text-stone-900 focus-visible:ring-2 ring-indigo-500/60 ring-offset-2 sm:inline-flex"
            >
              Sign in
            </button>
            <button className={`${buttonPrimary} hidden lg:inline-flex`}>
              Start free
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 focus-visible:ring-2 ring-indigo-500/60 ring-offset-2 md:hidden"
            >
              <span className="flex h-3.5 w-4 flex-col justify-center gap-[5px]">
                <span
                  className={`block h-0.5 w-full rounded-full bg-stone-700 transition-all duration-300 ${
                    open ? "translate-y-[3px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-full rounded-full bg-stone-700 transition-all duration-300 ${
                    open ? "-translate-y-[3px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={`absolute left-4 right-4 top-16 mx-auto max-w-md rounded-2xl border border-stone-200/70 bg-white p-3 shadow-xl transition-all duration-300 ${
            open
              ? "visible translate-y-0 scale-100 opacity-100"
              : "pointer-events-none invisible translate-y-1 scale-[0.98] opacity-0"
          }`}
        >
          <div className="flex flex-col">
            {NAV_ITEMS.map((item, i) => {
              const isActive = current === item.id;
              return (
                <a
                  key={item.id}
                  href="#"
                  onClick={(e) => handleClick(e, item.id)}
                  aria-current={isActive ? "page" : undefined}
                  style={{
                    transitionDelay: open ? `${i * 50}ms` : "0ms",
                  }}
                  className={`flex h-11 items-center justify-between rounded-lg px-4 text-sm transition-all duration-300 ${
                    open
                      ? "translate-y-0 opacity-100"
                      : "translate-y-1 opacity-0"
                  } ${
                    isActive
                      ? "bg-indigo-50 font-medium text-stone-900"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  {item.label}
                  {isActive ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  ) : null}
                </a>
              );
            })}
          </div>
          <div className="my-2 h-px bg-stone-200/70" />
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setOpen(false)}
              className="h-10 w-full rounded-full text-sm font-medium text-stone-600 transition-all hover:bg-stone-100 hover:text-stone-900"
            >
              Sign in
            </button>
            <button
              onClick={() => setOpen(false)}
              className={`${buttonPrimary} w-full`}
            >
              Start free
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-28">
        <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-stone-400">
          This fixed header is the component — scroll the page and it turns to
          frosted glass. Click a link and the pill highlight follows via{" "}
          <code className="font-mono text-[12.5px]">aria-current="page"</code>.
        </p>

        <section className="relative mt-14 overflow-hidden rounded-3xl bg-stone-950">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-48 left-1/2 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-indigo-500/25 blur-[130px]" />
          </div>
          <div className="relative px-6 py-24 sm:px-16 sm:py-32">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300">
              Lumen Hyper Deploy 2026
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl">
              Build the interface your team already{" "}
              <em className="font-serif italic text-indigo-300">
                dreams about
              </em>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-400 sm:text-lg">
              One canvas for product, brand and engineering — design ships as
              component-ready tokens, so the hand-off that used to take days
              happens in a single commit.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button className={buttonPrimary}>Start free with Lumen</button>
              <button className="inline-flex h-9 items-center rounded-full border border-white/15 px-5 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white active:scale-[0.98] focus-visible:ring-2 ring-indigo-500/60 ring-offset-2 ring-offset-stone-950">
                Watch the film
              </button>
            </div>
            <p className="mt-12 font-mono text-[12.5px] text-stone-500">
              Scroll — the fixed header above clears to frosted glass the moment
              you move.
            </p>
          </div>
        </section>

        <section className={`mt-20 rounded-2xl border border-stone-200/70 bg-white p-8 sm:p-10 ${cardShadow}`}>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
            Why the sticky glass header works here
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-stone-600">
            On a marketing site the header is the salesperson that never leaves
            the room: the primary CTA (<CodeChip>Start free</CodeChip>) and the
            deep links to docs and pricing must be reachable from any scroll
            position. Frosted glass keeps that promise while letting the page
            body slide visibly beneath the surface — so the header stays
            present without shouting. As you work through the page the{" "}
            <CodeChip>aria-current="page"</CodeChip> pill rings whichever
            section you have selected, exactly like the browser highlights it.
          </p>
        </section>

        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
              Everything your team ships with
            </h2>
            <p className="hidden text-sm text-stone-400 sm:block">
              Three reasons teams move their whole pipeline to Lumen
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-stone-200/70 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
                  <feature.icon />
                </span>
                <h3 className="mt-5 text-[17px] font-semibold text-stone-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {feature.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-stone-200/70 bg-white p-6 text-center">
            <p className="font-mono text-2xl font-semibold text-stone-900">
              99.9%
            </p>
            <p className="mt-1 text-sm text-stone-400">uptime, year-round</p>
          </div>
          <div className="rounded-2xl border border-stone-200/70 bg-white p-6 text-center">
            <p className="font-mono text-2xl font-semibold text-stone-900">
              40k
            </p>
            <p className="mt-1 text-sm text-stone-400">teams ship on it</p>
          </div>
          <div className="rounded-2xl border border-stone-200/70 bg-white p-6 text-center">
            <p className="font-mono text-2xl font-semibold text-stone-900">
              SOC 2
            </p>
            <p className="mt-1 text-sm text-stone-400">Type II, audited</p>
          </div>
        </section>

        <section className="mt-20 rounded-2xl border border-stone-200/70 bg-white">
          <div className="flex flex-col gap-2 border-b border-stone-200/70 px-8 py-6">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-stone-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-stone-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-200" />
            </div>
            <p className="text-sm font-medium text-stone-700">
              The header, in three lines of structure
            </p>
          </div>
          <div className="px-6 py-6">
            <pre className="overflow-x-auto rounded-xl bg-stone-950 p-6 font-mono text-[12.5px] leading-relaxed text-stone-200">
              <code>{headerMarkup}</code>
            </pre>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-stone-600">
              <li className="flex gap-3">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                <span>
                  <CodeChip>{"<header>"}</CodeChip> is a{" "}
                  <em>banner</em> landmark — assistive tech lets users jump to
                  it with a single shortcut.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                <span>
                  Inside it a <CodeChip>nav</CodeChip> holds{" "}
                  <em>links only</em> — forms, buttons and search live outside
                  the navigation landmark.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                <span>
                  You style the current page with{" "}
                  <CodeChip>aria-current="page"</CodeChip>, not a class — the
                  state is announced to screen readers and the pill to eyes.
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-20 rounded-3xl bg-indigo-50 p-10 text-center sm:p-16">
          <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
            Ready to ship faster?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-stone-600">
            Bring your first board online in minutes — no credit card, no
            meeting required.
          </p>
          <button className={`${buttonPrimary} mt-8`}>Start free</button>
        </section>
      </main>

      <footer className="px-6 pb-16">
        <nav
          aria-label="Session"
          className="mx-auto flex w-fit items-center gap-1 rounded-full border border-stone-200/70 bg-white/70 p-1 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(28,25,23,0.18)] backdrop-blur-xl"
        >
          <Link
            href="/"
            className="inline-flex h-8 items-center rounded-full px-4 text-sm font-medium text-stone-600 transition-all hover:bg-stone-100 hover:text-stone-900"
          >
            ← Learning hub
          </Link>
          <span className="h-4 w-px bg-stone-200" aria-hidden="true" />
          <Link
            href="/scenarios/dashboard-app"
            className="inline-flex h-8 items-center rounded-full px-4 text-sm font-medium text-stone-600 transition-all hover:bg-stone-100 hover:text-stone-900"
          >
            Next: dashboard-app →
          </Link>
        </nav>
      </footer>
    </div>
  );
}