import Link from "next/link";
import { Anatomy } from "./components/anatomy";

function PartCard({
  num,
  title,
  caption,
  visual,
}: {
  num: string;
  title: string;
  caption: string;
  visual: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="grid size-5 place-items-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
          {num}
        </span>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
      </div>
      <div className="my-4 flex min-h-14 items-center justify-center">{visual}</div>
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
      <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">{kicker}</p>
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
      <div className="flex flex-wrap items-center gap-2">
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
          {num}
        </span>
        <p className="text-sm font-semibold text-slate-900">{name}</p>
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
          {code}
        </code>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-teal-50/70 p-3 ring-1 ring-inset ring-teal-700/10">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-700">
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
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-600/40 hover:shadow-md"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-700">{kicker}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{text}</p>
      <p className="mt-3 text-xs font-semibold text-teal-700 group-hover:underline">
        Open the demo →
      </p>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Timeline</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Also called:{" "}
          <span className="font-medium text-slate-700">
            vertical timeline, activity timeline, activity feed, event history, changelog timeline,
            history log
          </span>
          . A vertical <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-700">{"<ol>"}</code>{" "}
          of what already happened — oldest at the top, newest at the bottom. Each item gets a dot
          on a shared line, a timestamp across the line, and the line stops dead at the last dot.
        </p>
      </header>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <PartCard
          num="1"
          title="The dot — one circle per event"
          caption="Solid means finished, hollow + pulsing means still happening. It can hold a tiny icon."
          visual={
            <span className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-teal-700 text-white">
                <svg viewBox="0 0 10 10" className="size-3" aria-hidden="true">
                  <path d="M1.5 5.2 4 7.5 8.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="relative grid size-6 place-items-center">
                <span className="tl-ping-ring absolute inset-0 rounded-full bg-teal-500/50" aria-hidden="true" />
                <span className="relative grid size-6 place-items-center rounded-full border-2 border-teal-600 bg-white">
                  <span className="size-1.5 animate-pulse rounded-full bg-teal-600" />
                </span>
              </span>
              <span className="grid size-6 place-items-center rounded-full bg-teal-700 text-[10px] font-bold text-white">3</span>
            </span>
          }
        />
        <PartCard
          num="2"
          title="The connector — dot to dot"
          caption="Each item owns the short segment below its dot. The last item owns nothing — the line ends."
          visual={
            <span className="flex items-center" aria-hidden="true">
              <span className="grid size-6 place-items-center rounded-full bg-teal-700 text-[10px] font-bold text-white">1</span>
              <span className="mx-0 flex w-10 flex-col items-center">
                <span className="h-6 w-0.5 rounded-full bg-teal-600/60" />
              </span>
              <span className="grid size-6 place-items-center rounded-full bg-teal-700 text-[10px] font-bold text-white">2</span>
              <span className="mx-0 flex w-10 flex-col items-center">
                <span className="h-6 w-0.5 rounded-full bg-slate-200" />
              </span>
              <span className="relative grid size-6 place-items-center">
                <span className="relative grid size-6 place-items-center rounded-full border-2 border-teal-600 bg-white">
                  <span className="size-1.5 animate-pulse rounded-full bg-teal-600" />
                </span>
              </span>
            </span>
          }
        />
        <PartCard
          num="3"
          title="Opposite time — the when"
          caption="A fixed-width column across the line: a <time datetime> right-aligned back toward the dots."
          visual={
            <span className="flex items-center gap-3">
              <span className="text-right font-mono text-[11px] leading-tight text-slate-500">
                Feb 18
                <br />
                <span className="text-slate-400">09:00</span>
              </span>
              <span className="grid size-6 place-items-center rounded-full bg-teal-700 text-white">
                <svg viewBox="0 0 10 10" className="size-3" aria-hidden="true">
                  <path d="M1.5 5.2 4 7.5 8.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-xs font-semibold text-slate-700">Public launch</span>
            </span>
          }
        />
      </section>

      <section className="mt-14">
        <SectionHeading
          kicker="Anatomy"
          title="Every part, named"
          note="A real, working timeline — five project events, the last one still in progress. Click any row."
        />
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm">
          <Anatomy />
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading
          kicker="Explained"
          title="Every part, for two readers"
          note="One line for the person using a product, one for the person building it — no React knowledge assumed."
        />
        <div className="mt-6 grid gap-4">
          <Explain
            num="1"
            name="Timeline dot"
            code="<TimelineDot /> · Timeline.Indicator"
            see="A small circle sitting exactly on the vertical line — one per event. A filled circle says “this is banked and done”; it can also hold a tiny icon (a check, a box, a truck) so you recognise the kind of event without reading."
            work="A prop is a setting you hand the component when you use it (like ticking options on an order form); state is a value the component remembers between clicks (like a light switch staying on); render means drawing the screen again; an event is something the browser tells React about, such as a click. The dot is a <span> centred on the line whose look is derived from those ideas: finished items render a solid circle (with an optional icon child, like a light switched fully on), while the in-progress item renders a hollow one. Think of beads on a string — one bead per story beat."
          />
          <Explain
            num="2"
            name="Timeline connector"
            code="<TimelineConnector />"
            see="The thin vertical thread joining one dot to the next. Your eye slides down it and reads the story in order — and where the thread ends, the story ends: there is deliberately no line dangling below the last dot."
            work="When you click a dot, nothing is stored on the line itself: each list item renders its own short segment beneath its dot, so the line is really five small segments stacked, not one long rule. The last item simply renders no segment (connector omitted after last event). It is pure decoration, so it carries aria-hidden and screen readers skip it — like the string between beads, felt but never announced."
          />
          <Explain
            num="3"
            name="Opposite content"
            code="<TimelineOppositeContent> · <time dateTime>"
            see="The timestamp sitting across the line from the story — “Feb 18 · 09:00”. It is right-aligned so every date leans in toward the dots, and keeping when separate from what lets you scan down either column: times on the left, story on the right."
            work="A fixed-width column (every row reserves the same width, like the date margin in a diary) holding a real <time dateTime='2026-02-18T09:00'> element: the dateTime prop is the machine-readable timestamp computers and screen readers use, while the visible text is the human-friendly version. Right-aligning it toward the dots is a one-line style rule, and because the column width is fixed, the dots stay in a perfectly straight line no matter how long a date is."
          />
          <Explain
            num="4"
            name="In-progress item"
            code="loading: true (Ant Design)"
            see="The newest event looks unfinished on purpose: a hollow ring with a soft expanding pulse, and its title in muted grey. It says “this is happening right now, check back” — and the moment it finishes, the ring fills solid like all the others."
            work="A single boolean state value — loading, true or false, like a kettle still boiling — drives three things at once: the dot renders hollow with a pulsing ring instead of solid, the title and detail render in muted grey, and an “in progress” pill appears. Pressing “Complete in-progress” flips that one value to false; React re-renders (redraws the screen) and the dot, text, and pill all update together, so they can never disagree. Try it in the diagram above."
          />
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          kicker="Contrast"
          title="Timeline vs its lookalikes"
          note="Four patterns that all draw dots on a line — only one of them looks backward."
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-teal-700/25 bg-teal-50/60 p-4 shadow-sm">
            <p className="text-xs font-bold text-teal-800">Timeline — the past record</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">“What already happened, in order.” Dots are finished history; the line stops at now.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-900">Steps — the future stages</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">“Where you are in a process.” Numbered stages ahead of you, <code className="font-mono text-[10px]">aria-current=&quot;step&quot;</code> on the present one.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-900">Scrubber — the video playhead</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">“Where you are in media.” One draggable thumb on a duration bar; moving it seeks, it records nothing.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-900">Calendar — the hour grid</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">“What occupies each slot.” Events placed on a time grid you can book; a timeline only narrates.</p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading
          kicker="In the wild"
          title="Three places Timeline belongs"
          note="Each scenario is a live, working variant — a different layout, a different dot language, a different loading story."
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <WildCard
            href="/scenarios/order-tracking"
            kicker="Scenario 1 — tracker"
            title="Parcel tracking"
            text="The linear shipment story: icon dots, colour per status, a pulsing out-for-delivery stop, and an Advance button."
          />
          <WildCard
            href="/scenarios/product-changelog"
            kicker="Scenario 2 — changelog"
            title="SaaS changelog"
            text="The zigzag release history: alternating sides on desktop, version pills, expandable notes, Minor/Patch filter."
          />
          <WildCard
            href="/scenarios/team-activity"
            kicker="Scenario 3 — live feed"
            title="Team activity feed"
            text="The living log: avatar dots, relative times, day groups — and a Simulate button that prepends a live event."
          />
        </div>
      </section>

      <footer className="mt-16 border-t border-slate-200 pt-6 text-xs leading-relaxed text-slate-400">
        Anatomy names follow Chakra UI (Timeline.Indicator), MUI Lab (TimelineDot, TimelineConnector,
        TimelineOppositeContent, position=&quot;alternate&quot;) and Ant Design (Timeline.Item, the{" "}
        <span className="font-mono">loading</span> flag). Semantic rule throughout: a vertical{" "}
        <span className="font-mono">{"<ol>"}</span> in chronological order, timestamps as{" "}
        <span className="font-mono">{"<time dateTime>"}</span>, solid dots for finished and a
        hollow pulsing dot for the in-progress tail — with the connector stopping at the last dot.
      </footer>
    </main>
  );
}
