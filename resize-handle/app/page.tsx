import Anatomy from "./components/Anatomy";
import { Code, Kicker } from "./components/shared";

const introCards = [
  {
    n: "01",
    title: "The textarea",
    copy: "The field that hosts the grip. A plain textarea has no grip and can never be resized — the grip only appears when you switch it on.",
  },
  {
    n: "02",
    title: "The resize property",
    copy: "The switch that turns the grip on — and picks its axis. resize: vertical means up/down only; resize: both frees the corner entirely.",
  },
  {
    n: "03",
    title: "The grip",
    copy: "The pixel you grab: the ribbed diagonal corner the browser draws for free at the bottom-right, restyleable with ::-webkit-resizer.",
  },
];

const scenarioCards = [
  {
    href: "/scenarios/notes-editor",
    title: "Notes editor",
    copy: "A writing app with a brand-styled indigo grip, vertical-only discipline, live word count and a reset-height button.",
    chip: "resize: vertical · styled ::-webkit-resizer",
  },
  {
    href: "/scenarios/query-console",
    title: "Query console",
    copy: "A SQL editor that resizes on both axes with min/max bounds on each, plus presets that snap the field to a known size.",
    chip: "resize: both · bounds on both axes",
  },
  {
    href: "/scenarios/feedback-form",
    title: "Feedback form",
    copy: "A support form where the grip is a policy decision: flip a toggle between resize: vertical and resize: none and watch the field obey.",
    chip: "resize: none vs vertical · live toggle",
  },
];

function NumberBadge({ n }: { n: number }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-mono text-sm font-semibold text-white">
      {n}
    </span>
  );
}

function ExplainRow({
  n,
  title,
  chip,
  see,
  works,
}: {
  n: number;
  title: string;
  chip: string;
  see: React.ReactNode;
  works: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <NumberBadge n={n} />
        <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
        <span className="rounded-full border border-stone-200 bg-white px-2.5 py-0.5 font-mono text-[11px] text-stone-500">
          {chip}
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
            What you see
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-700">{see}</p>
        </div>
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-600">
            How it works
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-700">{works}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header>
        <Kicker>namethatui · web component</Kicker>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-900">
          Resize Handle
        </h1>
        <p className="mt-2 font-mono text-sm text-stone-500">
          Also called: size grip, resize grip, gripper, resizer, drag corner
        </p>
        <p className="mt-6 max-w-2xl text-base leading-7 text-stone-600">
          The ribbed diagonal corner at the bottom-right of a resizable field —
          the three small diagonal lines on a <Code>&lt;textarea&gt;</Code>.
          Drag it and the field grows; a few lines of CSS decide whether it
          exists, which way it moves, and where it has to stop.
        </p>
      </header>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {introCards.map((c) => (
          <div
            key={c.n}
            className="rounded-2xl border border-stone-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <p className="font-mono text-xs font-semibold text-indigo-600">{c.n}</p>
            <h2 className="mt-2 text-base font-semibold text-stone-900">{c.title}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{c.copy}</p>
          </div>
        ))}
      </section>

      <section className="mt-20">
        <Kicker>Anatomy — drag the grip</Kicker>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-900">
          One field, three named parts
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Grab the ribbed corner and drag. The height readout, the ruler below
          the field and the leader lines all chase the drag — and the field
          never leaves the 120–420px band, because the browser clamps it there.
          The width never moves: this field is <Code>resize: vertical</Code>.
        </p>
        <div className="mt-8">
          <Anatomy />
        </div>
      </section>

      <section className="mt-20 space-y-14">
        <Kicker>Layered explanations</Kicker>
        <ExplainRow
          n={1}
          title="The size grip"
          chip="::-webkit-resizer"
          see={
            <>
              The three little diagonal lines in the bottom-right corner. It is
              a handle: press it, drag, and the field grows or shrinks under
              your cursor. It appears only on resizable fields — the browser
              draws it for free, you never build it.
            </>
          }
          works={
            <>
              The browser draws the grip because the CSS <Code>resize</Code>{" "}
              property is switched on. In WebKit/Blink browsers (Chrome, Edge,
              Safari) you can restyle that exact pixel art with the{" "}
              <Code>::-webkit-resizer</Code> pseudo-element — a small extra
              element the browser invents for you, styled with CSS like any
              real element. Firefox keeps its own native grip, and the field
              still resizes there too.
            </>
          }
        />
        <ExplainRow
          n={2}
          title="The resize property — the switch"
          chip="resize: vertical"
          see={
            <>
              This one line of CSS is the on/off switch for the whole feature.
              Vertical means the grip is allowed to move up and down only —
              drag sideways all you like, the width never changes.
            </>
          }
          works={
            <>
              <Code>resize</Code> is a CSS property — a setting handed to the
              element, like a prop you pass a component. Its values are{" "}
              <Code>none</Code>, <Code>vertical</Code>, <Code>horizontal</Code>{" "}
              and <Code>both</Code>. The browser reads the setting when it
              renders (draws the screen) and only shows the grip when the value
              isn&apos;t <Code>none</Code>. While you drag, it lets only the
              chosen axis change, then re-renders the field at the new size.
            </>
          }
        />
        <ExplainRow
          n={3}
          title="The min/max height bounds"
          chip="min-height / max-height"
          see={
            <>
              Try to drag below 120px — the field refuses and stops. Drag past
              420px — it stops again. Bounds keep a resizable field inside a
              range the page layout can survive.
            </>
          }
          works={
            <>
              <Code>min-height</Code> and <Code>max-height</Code> are CSS
              settings the browser enforces. While you drag, it calculates the
              size you are asking for, clamps it — clamps means &quot;forces it
              back inside the allowed range&quot; — and only then draws. That
              is why the readout below the field always sits between 120 and
              420.
            </>
          }
        />
      </section>

      <section className="mt-20 rounded-2xl border border-stone-200 bg-white p-8">
        <Kicker>Contrast — same field, three personalities</Kicker>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-900">
          Grip vs. auto-grow vs. locked
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900">
                <Code>field-sizing: content</Code> — grows with its text
              </h3>
              <span className="font-mono text-[11px] text-stone-400">no grip</span>
            </div>
            <textarea
              placeholder="Type in here — the field grows as you type…"
              className="h-24 w-full resize-none rounded-xl border border-stone-200 bg-stone-50/60 p-3 text-sm leading-5 text-stone-700 outline-none transition-[border-color] placeholder:text-stone-400 focus:border-indigo-300 [field-sizing:content]"
            />
            <p className="mt-2 text-xs leading-5 text-stone-500">
              The content decides the size: type and it expands up to its max.
              No grip, no dragging — a behavior, not a handle.
            </p>
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900">
                <Code>resize: none</Code> — locked by design
              </h3>
              <span className="font-mono text-[11px] text-stone-400">no grip</span>
            </div>
            <textarea
              defaultValue="Fixed height, fixed width, exactly as the designer placed it. Nothing about this field can move — which is the whole point in forms and cards."
              className="h-24 w-full resize-none rounded-xl border border-stone-200 bg-stone-50/60 p-3 text-sm leading-5 text-stone-700 outline-none transition-[border-color] focus:border-indigo-300"
            />
            <p className="mt-2 text-xs leading-5 text-stone-500">
              The designer decides the size. Removing the grip is a deliberate
              choice — see the feedback-form scenario for a live toggle.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <Kicker>Where it lives in the wild</Kicker>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-900">
          Three scenarios, three configurations
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {scenarioCards.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              <span className="font-mono text-xs font-semibold text-indigo-600">
                {s.chip}
              </span>
              <h3 className="mt-3 text-base font-semibold text-stone-900">
                {s.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-stone-600">{s.copy}</p>
              <span className="mt-4 text-sm font-medium text-indigo-600 transition-colors group-hover:text-indigo-500">
                Open scenario →
              </span>
            </a>
          ))}
        </div>
      </section>

      <footer className="mt-20 border-t border-stone-200 pt-6">
        <p className="font-mono text-xs text-stone-400">
          Built from the namethatui catalog — web component · resize handle
        </p>
      </footer>
    </main>
  );
}
