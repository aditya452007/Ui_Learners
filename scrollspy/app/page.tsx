import Link from "next/link";
import { Anatomy } from "./components/anatomy";

function MiniCard({
  title,
  code,
  caption,
  visual,
}: {
  title: string;
  code: string;
  caption: string;
  visual: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
          {code}
        </code>
      </div>
      <div className="my-4 flex items-center justify-center">{visual}</div>
      <p className="mt-auto text-xs leading-relaxed text-slate-500">{caption}</p>
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  note,
}: {
  kicker: string;
  title: string;
  note: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">{kicker}</p>
      <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{note}</p>
    </div>
  );
}

function Explain({
  num,
  name,
  code,
  see,
  work,
}: {
  num: string;
  name: string;
  code: string;
  see: string;
  work: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
          {num}
        </span>
        <p className="text-sm font-semibold text-slate-900">{name}</p>
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
          {code}
        </code>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-indigo-50/70 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
            What you see
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{see}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-200/70">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            How it works
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{work}</p>
        </div>
      </div>
    </div>
  );
}

function WildCard({
  href,
  kicker,
  title,
  text,
}: {
  href: string;
  kicker: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600">{kicker}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{text}</p>
      <p className="mt-3 text-xs font-semibold text-indigo-600 group-hover:underline">
        Open the demo →
      </p>
    </Link>
  );
}

function miniRail() {
  return (
    <div className="w-40 rounded-lg border border-slate-200 bg-slate-50 p-1.5">
      {["Intro", "Setup", "Usage", "API"].map((l, i) => (
        <p
          key={l}
          className={`rounded px-2 py-0.5 text-left text-[10px] font-medium ${
            i === 1 ? "bg-white font-semibold text-indigo-700 shadow-sm" : "text-slate-400"
          }`}
        >
          {l}
        </p>
      ))}
    </div>
  );
}

function miniWatch() {
  return (
    <div className="relative h-14 w-40 rounded-lg border border-slate-200 bg-slate-50 p-2">
      <div className="absolute left-1/2 top-1/2 h-8 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-indigo-300" />
      <div className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600" />
      <p className="absolute bottom-1 right-2 font-mono text-[8px] text-slate-400">rootMargin</p>
    </div>
  );
}

function miniMark() {
  return (
    <div className="relative w-40 rounded-lg border border-slate-200 bg-slate-50 p-1.5">
      <span className="absolute left-0 top-1.5 h-[calc(100%-12px)] w-[3px] rounded-full bg-indigo-600" />
      {["Overview", "Anatomy", "States"].map((l, i) => (
        <p
          key={l}
          className={`pl-2 text-left text-[10px] font-medium ${
            i === 1 ? "font-semibold text-indigo-700" : "text-slate-400"
          }`}
        >
          {l}
        </p>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          NameThatUi lab · web #43 of 44
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Scrollspy</h1>
        <p className="mt-1 text-sm text-slate-500">
          Also called: scroll-linked navigation · current-section navigation · active table of
          contents · On this page navigation · in-page navigation
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          The contents list down the side that follows where you are in the article. It looks like
          tabs, but it isn&apos;t: tabs swap one shared panel when you activate them, while a
          scrollspy leaves the whole document in place and only reflects where you already are.
          Sticky positioning keeps the rail beside the article; the scrollspy is what changes its
          current item.
        </p>
      </header>

      <section className="mt-10">
        <SectionHeading
          kicker="Anatomy at a glance"
          title="Three parts, one idea"
          note="A rail of links, a browser API watching the headings, and one link marked as the section being read."
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <MiniCard
            title="The rail"
            code="<nav>"
            caption={'A labeled <nav> of same-document fragment links (href="#section-id"), kept in view with position: sticky.'}
            visual={miniRail()}
          />
          <MiniCard
            title="The watch"
            code="IntersectionObserver"
            caption="A browser API observes every section anchor target and reports when it crosses into the activation zone — offset by rootMargin."
            visual={miniWatch()}
          />
          <MiniCard
            title="The mark"
            code='aria-current="location"'
            caption="Exactly one link carries the current-section marker — the accent bar and stronger label — and it moves as you scroll."
            visual={miniMark()}
          />
        </div>
      </section>

      <section className="mt-12">
        <SectionHeading
          kicker="Live anatomy"
          title="Every named part, labelled"
          note="This is the real component. Scroll the article inside the diagram — the bar, the target line and the labels chase the section in view."
        />
        <div className="mt-4">
          <Anatomy />
        </div>
      </section>

      <section className="mt-12">
        <SectionHeading
          kicker="Part by part"
          title="What you see · how it works"
          note="Two layers for every named part: plain words for the person using the product, then simple technical terms for the builder."
        />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Explain
            num="1"
            name="On-this-page rail"
            code="<nav>"
            see="The little contents list that stays beside the article while you read. Every item is a real link — click it and you jump straight to that part. It never covers the text; it just rides along next to it."
            work={'A <nav> is HTML\'s landmark for a group of links — assistive tech can jump straight to it. The links point at real heading ids (href="#section-id"), and position: sticky pins the rail next to the content while the page scrolls underneath it. Props are settings you hand a component; here the setting is the list of section ids and labels.'}
          />
          <Explain
            num="2"
            name="Current-section indicator"
            code='aria-current="location"'
            see="One entry stands out — an accent bar plus a bolder label — and it slides to the next entry the moment the article brings that section on screen. It tells you where you are without you having to look up at the heading."
            work={'The nav keeps a single piece of state: the id of the active section. State is a value the component remembers between renders — like a bookmark you keep moving. Exactly one link renders aria-current="location", which screen readers announce as “current location”. The bar is one absolutely-positioned element measured from the DOM and slid with a CSS transform, so it glides at 60fps.'}
          />
          <Explain
            num="3"
            name="Section anchor target"
            code="IntersectionObserver.observe()"
            see="The headings the side list is watching — each one has a tiny invisible anchor at the top. You never see the machinery; you only see its effect on the rail."
            work="IntersectionObserver is a browser API: you register elements with observer.observe(target) and it calls you back whenever one enters or leaves a zone you define. It replaces the old scroll-event math and runs off-screen efficiently. Each heading's id must exactly match the rail's href fragment — one character off and the link breaks."
          />
          <Explain
            num="4"
            name="Activation zone"
            code="rootMargin"
            see="The switch between sections doesn't happen at the exact middle of the screen. If there's a sticky header at the top, the boundary sits below it — so the section you're actually reading, not the one hiding under the header, is the one that lights up."
            work={'rootMargin is a string that grows or shrinks the area the observer watches — think of it as insetting the frame of a camera. "0px 0px -55% 0px" shaves the bottom 55% off the zone, so a section becomes current when it crosses into the upper 45% of the viewport, clear of any sticky header.'}
          />
        </div>
      </section>

      <section className="mt-12">
        <SectionHeading
          kicker="Lookalike, different job"
          title="Scrollspy vs. tabs"
          note="The prompt warns: it looks like tabs, but it isn't. Here is the difference, side by side."
        />
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_1fr_1fr] text-xs sm:text-sm">
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:py-3">
              Question
            </div>
            <div className="border-b border-l border-slate-100 bg-slate-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:py-3">
              Tabs
            </div>
            <div className="border-b border-l border-slate-100 bg-indigo-50/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 sm:py-3">
              Scrollspy
            </div>
            {[
              ["What happens to the content?", "One shared panel swaps on click", "The whole document stays; nothing swaps"],
              ["What does a click do?", "Switches which panel is shown", "Jumps to the section the link names"],
              ["Who decides what is current?", "The user, by clicking", "The scroll position, via the observer"],
              ["Where does it live?", "Usually at the top of the content", "A rail beside the article, often sticky"],
              ["What marks the current item?", "The active tab's style", 'aria-current="location" plus the accent bar'],
            ].map(([q, a, b]) => (
              <div key={q} className="contents">
                <div className="px-4 py-2.5 font-medium text-slate-700 sm:py-3">{q}</div>
                <div className="border-l border-slate-100 px-4 py-2.5 text-slate-500 sm:py-3">{a}</div>
                <div className="border-l border-slate-100 bg-indigo-50/60 px-4 py-2.5 font-medium text-slate-700 sm:py-3">
                  {b}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <SectionHeading
          kicker="Where it belongs"
          title="Three real products, one pattern"
          note="Three scenario pages — each uses the scrollspy in a different mode, so you see the extensibility, not three reskins."
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <WildCard
            href="/scenarios/api-docs"
            kicker="Scenario 1 · reference"
            title="API documentation"
            text="The canonical home: a long reference page with a right-hand On-this-page rail, a sticky header to offset, and dense code to scroll through."
          />
          <WildCard
            href="/scenarios/field-guide"
            kicker="Scenario 2 · long-form"
            title="Field guide article"
            text="A magazine-length story where the contents live as pills in a sticky header — the scrollspy re-oriented horizontally, with a reading progress bar."
          />
          <WildCard
            href="/scenarios/campaign-dashboard"
            kicker="Scenario 3 · app"
            title="Campaign dashboard"
            text="A sectioned analytics dashboard where the rail sits inside its own scrollable panel — IntersectionObserver with a custom root, not the window."
          />
        </div>
      </section>
    </main>
  );
}
