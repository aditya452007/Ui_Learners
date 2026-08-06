"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const NAV_LINKS = ["Stories", "Longform", "Field Notes", "About"] as const;

const ARTICLES = [
  {
    kicker: "TYPE · FIELD NOTE",
    title: "A quiet weight",
    dek: "Setting a headline so small it has to be right.",
    bg: "from-indigo-500 via-indigo-600 to-stone-800",
  },
  {
    kicker: "SYSTEMS",
    title: "Margins as a method",
    dek: "The same forty-eight points of air, every evening since 2013.",
    bg: "from-stone-600 via-stone-700 to-stone-900",
  },
  {
    kicker: "DIARY",
    title: "Nine grids, one page",
    dek: "A week spent moving the same story around a sheet.",
    bg: "from-indigo-400 via-indigo-600 to-indigo-900",
  },
  {
    kicker: "OBJECTS",
    title: "The pocket-pen diary",
    dek: "Hard nib for thinking, soft nib for the notes after.",
    bg: "from-stone-800 via-stone-900 to-indigo-950",
  },
] as const;

export default function EditorialMagazinePage() {
  const [headerVisible, setHeaderVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState<string>("Stories");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (menuOpen) {
        setHeaderVisible(true);
        lastScrollY.current = y;
        return;
      }
      if (y < 18) {
        setHeaderVisible(true);
      } else if (y > lastScrollY.current + 4) {
        setHeaderVisible(false);
      } else if (y < lastScrollY.current - 4) {
        setHeaderVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const headerCls = `fixed inset-x-0 top-0 z-50 h-14 border-b backdrop-blur-xl transition-all duration-500 ease-out ${
    menuOpen
      ? "translate-y-0 border-stone-800/60 bg-stone-950"
      : headerVisible
        ? "translate-y-0 border-stone-200/50 bg-white/90"
        : "-translate-y-full border-stone-200/50 bg-white/90"
  }`;

  const brandCls = `font-serif text-lg md:text-xl tracking-tight transition-colors ${
    menuOpen ? "text-white" : "text-stone-900"
  }`;

  const navLinkCls = `group relative flex flex-col items-center text-sm transition-colors aria-[current=page]:font-semibold ${
    menuOpen
      ? "text-stone-400 hover:text-stone-100 aria-[current=page]:text-white"
      : "text-stone-500 hover:text-stone-900 aria-[current=page]:text-stone-900"
  }`;

  return (
    <>
      <header className={headerCls}>
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-6 px-6">
          <span className="flex items-baseline gap-3">
            <span className={brandCls}>The Ledger</span>
            <span
              className={`font-mono text-[10px] tracking-[0.18em] uppercase ${
                menuOpen ? "text-stone-500" : "text-stone-400"
              }`}
            >
              Est. 2019
            </span>
          </span>

          <div className="mx-auto hidden md:flex items-center gap-8">
            <nav aria-label="Main">
              <ul className="flex items-center gap-8">
                {NAV_LINKS.map((label) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => setActivePage(label)}
                      aria-current={activePage === label ? "page" : undefined}
                      className={navLinkCls}
                    >
                      {label}
                      <span className="mt-1 h-1 w-1 rounded-full bg-indigo-500 opacity-0 transition-opacity duration-200 group-aria-[current=page]:opacity-100" />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Search the archive"
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                menuOpen
                  ? "text-stone-400 hover:bg-white/10 hover:text-white"
                  : "text-stone-500 hover:bg-stone-900/5 hover:text-stone-900"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4.5 4.5" />
              </svg>
            </button>

            {menuOpen && (
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            )}

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors md:hidden ${
                menuOpen
                  ? "text-stone-200 hover:bg-white/10"
                  : "text-stone-700 hover:bg-stone-900/5"
              }`}
            >
              <span
                className={`absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 rounded-full bg-current transition-all duration-300 ${
                  menuOpen ? "-translate-y-1/2 rotate-45" : "-translate-y-[6px]"
                }`}
              />
              <span
                className={`absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 rounded-full bg-current transition-all duration-300 ${
                  menuOpen ? "-translate-y-1/2 -rotate-45" : "translate-y-[6px]"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <style>{`
        @keyframes ledger-rise {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed inset-0 z-40 overflow-y-auto bg-stone-950 text-stone-100 transition-opacity duration-500 ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {menuOpen && (
          <div className="mx-auto max-w-5xl px-6 pt-14 pb-16">
            <div className="grid gap-12 md:grid-cols-[1fr_240px] md:gap-16">
              <nav aria-label="Sections" className="py-10 md:py-16">
                <ul className="flex flex-col gap-2">
                  {NAV_LINKS.map((label, i) => (
                    <li key={label}>
                      <button
                        type="button"
                        onClick={() => {
                          setActivePage(label);
                          setMenuOpen(false);
                        }}
                        aria-current={activePage === label ? "page" : undefined}
                        className={`group flex items-baseline gap-4 text-left ${
                          activePage === label
                            ? "text-indigo-400"
                            : "text-white hover:text-indigo-300"
                        }`}
                        style={{
                          animation: `ledger-rise 0.5s ease-out ${
                            340 + i * 70
                          }ms both`,
                        }}
                      >
                        <span className="font-mono text-[11px] tracking-[0.2em] text-stone-500">
                          {`0${i + 1}`}
                        </span>
                        <span className="font-serif text-4xl font-medium tracking-tight md:text-6xl">
                          {label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <aside
                className="md:pt-16"
                style={{
                  animation: `ledger-rise 0.5s ease-out ${
                    340 + NAV_LINKS.length * 70 + 140
                  }ms both`,
                }}
              >
                <div className="flex flex-col gap-6 border-t border-stone-800 pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.22em] text-stone-500 uppercase">
                      Latest issue
                    </p>
                    <p className="mt-2 font-serif text-xl text-stone-100">
                      {`Issue 07 · September`}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    {["Subscriptions", "Letters", "Masthead"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setMenuOpen(false)}
                        className="text-sm text-stone-400 transition-colors hover:text-white"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>

      <main id="top" className="mx-auto max-w-5xl px-6 pt-28 pb-20">
        <section
          aria-label="About this demo"
          className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(28,25,23,0.18)]"
        >
          <p className="font-mono text-[11px] tracking-[0.2em] text-indigo-600 uppercase">
            The component · site header
          </p>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-stone-600">
            This fixed header is the component: scroll down and it tucks itself
            away; scroll up and it reappears. Open the menu for a full-screen
            take. The active link carries{" "}
            <code className="rounded-md border border-indigo-200/60 bg-indigo-50 px-1.5 py-0.5 font-mono text-[12.5px] text-indigo-700">
              aria-current=&quot;page&quot;
            </code>
            , and the dot under it is styled from that very attribute.
          </p>
        </section>

        <header className="mt-16">
          <p className="font-mono text-[11px] tracking-[0.22em] text-stone-400 uppercase">
            {`Issue 07 · September 2026 · $6`}
          </p>
          <h1 className="mt-4 font-serif text-6xl leading-none tracking-tight text-stone-900 md:text-8xl">
            The Ledger
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-stone-600">
            An occasional journal of design, craft and the quiet decisions
            behind the things people use every day.
          </p>
          <div className="mt-8 border-t border-stone-300" />
        </header>

        <section className="mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-14">
          <div className="flex flex-col justify-center">
            <p className="font-mono text-[11px] tracking-[0.22em] text-indigo-600 uppercase">
              The lead · gesture &amp; form
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.08] tracking-tight text-stone-900 md:text-5xl">
              The Notebook Behind the Hand: how gesture design taught fingers a
              new alphabet
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-stone-600">
              The swipe was never invented; it was transcribed. This piece
              follows the sketchbooks where a two-finger drag, a heaved menu and
              a reluctant underline became the choreography of the modern
              mobile.
            </p>
            <div className="mt-8 flex items-center gap-4 text-sm text-stone-500">
              <span className="font-serif text-stone-900">Mara Chen</span>
              <span className="h-1 w-1 rounded-full bg-stone-300" />
              <span className="font-mono text-[11px] tracking-wider">
                {`9 MIN READ`}
              </span>
            </div>
          </div>

          <figure className="poster overflow-hidden rounded-2xl bg-linear-to-br from-indigo-500 via-indigo-700 to-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(28,25,23,0.18)]">
            <div className="relative flex h-[420px] items-end p-6">
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6 font-mono text-[10px] tracking-[0.28em] text-white/50 uppercase">
                <span>Plate 04</span>
                <span>Hands</span>
              </div>
              <figcaption className="relative border-l border-white/25 pl-4 font-mono text-[11.5px] leading-relaxed text-white/80">
                {`A clay study of the gesture that became the swipe.`}
              </figcaption>
            </div>
          </figure>
        </section>

        <section aria-label="Articles from this issue" className="mt-20">
          <div className="flex items-baseline justify-between">
            <h3 className="font-serif text-3xl tracking-tight text-stone-900">
              From this issue
            </h3>
            <p className="font-mono text-[10px] tracking-[0.22em] text-stone-400 uppercase">
              {`Four to carry`}
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {ARTICLES.map((article) => (
              <article
                key={article.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(28,25,23,0.18)]"
              >
                <div
                  className={`aspect-[4/3] overflow-hidden rounded-t-2xl bg-linear-to-br ${article.bg} transition-transform duration-500 group-hover:scale-105`}
                />
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-indigo-600 uppercase">
                    {article.kicker}
                  </p>
                  <h4 className="mt-3 font-serif text-xl leading-snug tracking-tight text-stone-900">
                    {article.title}
                  </h4>
                  <p className="mt-2 text-[13px] leading-relaxed text-stone-500">
                    {article.dek}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-label="Why it works here"
          className="mt-20 border-y border-stone-200/70 py-12"
        >
          <p className="font-mono text-[11px] tracking-[0.22em] text-indigo-600 uppercase">
            Why it works here — editorial
          </p>
          <p className="mt-5 max-w-3xl font-serif text-2xl leading-snug tracking-tight text-stone-900 md:text-3xl">
            Article headers in publishing live light: thin header, quiet hairline,
            one honest job — never fight the column of text. Reading is scroll,
            so the header hides going down and calls itself back the instant you
            nudge upward, leaving the whole page to the story. The active
            destination is still a real signal: the link carries{" "}
            <span className="rounded-md border border-indigo-200/60 bg-indigo-50 px-1.5 py-0.5 font-mono text-[13px] text-indigo-700">
              aria-current=&quot;page&quot;
            </span>{" "}
            and the small indigo dot underneath is painted from the very same
            attribute — one source of truth, zero extra classes.
          </p>
        </section>

        <section aria-label="The markup" className="mt-20">
          <p className="font-mono text-[11px] tracking-[0.22em] text-indigo-600 uppercase">
            See the markup
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-stone-900 p-5 font-mono text-[13px] leading-relaxed text-stone-100">
            {`
   <header>
     <a href="/">The Ledger</a>
     <nav aria-label="Main">
        <a href="/stories" aria-current="page">Stories</a>
        <a href="/essays">Essays</a>
     </nav>
     <button aria-label="Menu"> ... </button>
   </header>
 `}
          </pre>

          <ul className="mt-6 space-y-4">
            <li className="flex gap-4 text-[14px] leading-relaxed text-stone-600">
              <span className="shrink-0 font-mono text-[12.5px] text-indigo-700">
                {`<header>`}
              </span>
              <span>
                The outer shell — one per page, it crowds the brand, the nav and
                the controls into a single coat near the top of the reading area.
              </span>
            </li>
            <li className="flex gap-4 text-[14px] leading-relaxed text-stone-600">
              <span className="shrink-0 font-mono text-[12.5px] text-indigo-700">
                {`aria-current="page"`}
              </span>
              <span>
                Marks the one destination you are on. Screen-readers announce it,
                and the indigo dot below the label is painted from the very same
                attribute.
              </span>
            </li>
            <li className="flex gap-4 text-[14px] leading-relaxed text-stone-600">
              <span className="shrink-0 font-mono text-[12.5px] text-indigo-700">
                {`aria-label="Main"`}
              </span>
              <span>
                Names this landmark so a screen-reader user can jump straight to
                it, even when the visual list is hidden behind the menu.
              </span>
            </li>
          </ul>
        </section>

        <footer className="mt-24 border-t border-stone-200/70 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="font-serif text-2xl tracking-tight text-stone-900">
                The Ledger
              </p>
              <p className="mt-1 font-mono text-[10.5px] tracking-[0.22em] text-stone-400 uppercase">
                {`End of issue 07 · Set in Geist & a face from the archives`}
              </p>
            </div>
            <nav
              aria-label="Session"
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40 hover:bg-indigo-500"
              >
                <span aria-hidden="true">←</span>
                Learning hub
              </Link>
              <Link
                href="/scenarios/dashboard-app"
                className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/40 hover:border-stone-300 hover:text-stone-900"
              >
                <span aria-hidden="true">←</span>
                {`Prev: dashboard-app`}
              </Link>
            </nav>
          </div>
        </footer>
      </main>
    </>
  );
}