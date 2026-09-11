"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import {
  Tabs,
  TabPanel,
  tabId,
  panelId,
  type TabDef,
  type TabsVariant,
} from "@/components/tabs";
import { ApiChips, Eyebrow, PageHeader } from "@/components/chrome";

/* ── the three named parts ── */

type Part = {
  id: "tablist" | "indicator" | "panel";
  name: string;
  symbol: string;
  fragment: string;
  see: string;
  how: string;
};

const PARTS: Part[] = [
  {
    id: "tablist",
    name: "Tab list",
    symbol: 'role="tablist"',
    fragment:
      'the role="tablist" row containing the peer tab labels as one keyboard-navigation unit',
    see: "The whole row of labels — Overview, Specifications, Reviews — acting as one control. It tells you these views are peers: three windows onto the same thing, and exactly one of them is open. That is why tabs suit closely related views, never a step-by-step workflow.",
    how: "A div with role=\"tablist\" groups the buttons and owns the arrow-key handler: when you press Right Arrow, it finds the next enabled tab and moves focus there. Props are the settings you hand the component when you use it (here: the tab definitions); state is the value it remembers between clicks (here: which tab id is selected). Only the selected tab keeps tabindex=\"0\" — the rest sit at -1 — so Tab jumps past the row in one stop instead of three. Think of it like one TV remote for three channels, not three remotes.",
  },
  {
    id: "indicator",
    name: "Active-tab indicator",
    symbol: 'aria-selected="true"',
    fragment:
      'the active-tab indicator under the role="tab" with aria-selected="true", moving smoothly between labels',
    see: "The short teal line parked under the selected label. It is the persistent “you are here” marker: unlike a hover highlight that vanishes, it stays put so you always know which view you are looking at. Watch it glide when you switch tabs — the glide itself teaches that the views live side by side.",
    how: "The selected button carries aria-selected=\"true\" (the rest carry \"false\"), which is how screen readers announce “selected”. A span is absolutely positioned under that button: on every selection the component measures the button's offsetLeft and offsetWidth and slides the span there with a CSS transition — a smooth property change over 300ms. When you switch the style control to boxed or pills below, the sliding line disappears and the selected tab's own background becomes the indicator instead. Same job, different outfit.",
  },
  {
    id: "panel",
    name: "Tab panel",
    symbol: 'role="tabpanel"',
    fragment:
      'the role="tabpanel" content region linked to its selected tab by aria-labelledby',
    see: "The shared content area below the labels — the only thing that changes when you switch. Everything around it stays put, so switching feels instant and weightless: no page reload, no scroll jump, no lost place. Only one panel is ever visible; the others wait offstage.",
    how: "Each panel is a div with role=\"tabpanel\", an id, and aria-labelledby pointing at its tab's id — like a name tag tied to its owner with string — while the tab points back with aria-controls. Clicking a tab only flips which panel is hidden: hidden panels stay mounted (in the page's memory) so anything typed into a form survives the round trip. Render means drawing the screen again, and here React re-draws just the panel region. The panel also has tabindex=\"0\" so keyboard users can Tab into it and scroll it.",
  },
];

/* ── demo content ── */

const DEMO_TABS: TabDef[] = [
  { id: "overview", label: "Overview" },
  { id: "specs", label: "Specifications" },
  { id: "reviews", label: "Reviews", badge: 128 },
];

const RATING_BARS: [string, number][] = [
  ["5", 78],
  ["4", 32],
  ["3", 11],
  ["2", 4],
  ["1", 3],
];

/* ── small building blocks ── */

function Badge({
  n,
  style,
  selected,
  onSelect,
  label,
}: {
  n: number;
  style: CSSProperties;
  selected: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      title={label}
      aria-label={`Show ${label} in the inspector`}
      style={style}
      className={`pointer-events-auto grid size-5 place-items-center rounded-full text-[11px] font-bold shadow-md ring-2 ring-white transition-transform hover:scale-125 ${
        selected ? "scale-125 bg-stone-900 text-white" : "bg-[#0f766e] text-white"
      }`}
    >
      {n}
    </button>
  );
}

function Seg<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex flex-wrap rounded-lg border border-stone-200 bg-white p-1"
    >
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className={`rounded-md px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
            value === o
              ? "bg-stone-900 text-white shadow-sm"
              : "text-stone-500 hover:bg-stone-100"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="rounded-md border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[11px] text-stone-600 shadow-[0_1px_0_#d6d3d1]">
      {children}
    </kbd>
  );
}

/* ── hub page ── */

const VARIANTS = ["underline", "boxed", "pills"] as const;

export default function Home() {
  const [value, setValue] = useState("overview");
  const [variant, setVariant] = useState<TabsVariant>("underline");
  const [selected, setSelected] = useState<Part["id"]>("tablist");

  const part = PARTS.find((p) => p.id === selected) ?? PARTS[0];

  const highlight =
    selected === "tablist" || selected === "indicator"
      ? selected
      : null;

  function focusTabList() {
    document.getElementById(tabId("anatomy", value))?.focus();
  }

  const overlay = {
    tablist: (
      <Badge
        n={1}
        label="Tab list"
        style={{}}
        selected={selected === "tablist"}
        onSelect={() => setSelected("tablist")}
      />
    ),
    indicator: (
      <Badge
        n={2}
        label="Active-tab indicator"
        style={{}}
        selected={selected === "indicator"}
        onSelect={() => setSelected("indicator")}
      />
    ),
  };

  const panelBadge = (
    <Badge
      n={3}
      label="Tab panel"
      style={{}}
      selected={selected === "panel"}
      onSelect={() => setSelected("panel")}
    />
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-12">
        <PageHeader
          eyebrow='web · role="tablist" / role="tab" / role="tabpanel"'
          title="Tabs"
          alsoCalled="tabbed interface, tab list, tab bar"
          lede={
            <p>
              The row of labels that switches the panel below — peer views
              sharing one region, with exactly one tab and panel active at a
              time. The selected label stays visibly marked, often with an
              underline, and keyboard users travel the row with arrow keys.
              Reach for tabs when views are{" "}
              <em>closely related alternatives</em>, never for a sequential
              workflow. This page builds one from real buttons and ARIA, so
              you can click it, arrow through it, and take it apart.
            </p>
          }
        />
        <ApiChips
          items={[
            'role="tablist"',
            'role="tab"',
            'role="tabpanel"',
            'aria-selected="true"',
            "aria-controls",
            "aria-labelledby",
            "Tabs (Radix)",
          ]}
        />

        {/* what-am-I-looking-at strip */}
        <section className="grid gap-3 sm:grid-cols-3">
          {[
            {
              t: "Tab list → pick a view",
              d: "One row of peer labels. Click — or arrow — to choose which view is showing.",
              s: "part 1 · role=tablist",
            },
            {
              t: "Indicator → you are here",
              d: "The teal line (or filled pill) parked on the selected label. It never blinks out.",
              s: "part 2 · aria-selected",
            },
            {
              t: "Panel → the view itself",
              d: "The shared region below. Only it changes; the rest of the page stands still.",
              s: "part 3 · role=tabpanel",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-xl border border-stone-200 bg-white p-4"
            >
              <p className="text-sm font-semibold text-stone-900">{c.t}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
                {c.d}
              </p>
              <p className="mt-2 font-mono text-[11px] text-stone-400">{c.s}</p>
            </div>
          ))}
        </section>

        {/* ── live anatomy diagram ── */}
        <section id="diagram" className="flex scroll-mt-6 flex-col gap-4">
          <div>
            <Eyebrow>Live anatomy</Eyebrow>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              One tab set, three named parts
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
              This is the real component, not a picture. Click the tabs, or
              focus the row and use your arrow keys — the indicator (and pill
              ②) chases the selection. Click any numbered pill to inspect
              that part.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-500">Style</span>
              <Seg
                options={VARIANTS}
                value={variant}
                onChange={setVariant}
                ariaLabel="Tab style"
              />
            </div>
            <button
              type="button"
              onClick={focusTabList}
              className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 transition-colors hover:border-[#0f766e]/40 hover:text-[#0f766e]"
            >
              Focus the tab list, then use <Kbd>←</Kbd> <Kbd>→</Kbd>{" "}
              <Kbd>Home</Kbd> <Kbd>End</Kbd>
            </button>
          </div>

          <div className="demo-stage relative flex min-h-[480px] items-start justify-center overflow-hidden rounded-2xl border border-stone-300/70 p-6 sm:p-10">
            <div className="w-full max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                Trailhead Notebook · $24
              </p>
              <div className="mt-3">
                <Tabs
                  tabs={DEMO_TABS}
                  value={value}
                  onChange={setValue}
                  variant={variant}
                  ariaLabel="Product information"
                  idPrefix="anatomy"
                  highlight={highlight}
                  badges={overlay}
                />
              </div>

              <div className="mt-4">
                <TabPanel
                  id={panelId("anatomy", "overview")}
                  labelledBy={tabId("anatomy", "overview")}
                  hidden={value !== "overview"}
                  badge={panelBadge}
                  className={
                    selected === "panel"
                      ? "ring-2 ring-[#0f766e] ring-offset-2"
                      : ""
                  }
                >
                  <div className="flex flex-col gap-4 rounded-xl bg-stone-50 p-5 sm:flex-row">
                    <div className="grid w-full shrink-0 place-items-center rounded-lg bg-[#0f766e] p-6 text-white sm:w-36">
                      <div className="text-center">
                        <p className="font-serif text-3xl font-bold">Tn</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] opacity-80">
                          dot grid
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-stone-900">
                        A notebook that survives the backpack
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-stone-600">
                        192 pages of 100&nbsp;gsm dot-grid paper, a lay-flat
                        binding, and a cover that shrugs off rain. Designed
                        for field sketches, trip logs, and margin doodles.
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {["Lay-flat binding", "Numbered pages", "2 ribbon markers"].map(
                          (f) => (
                            <li
                              key={f}
                              className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-stone-600 ring-1 ring-stone-200"
                            >
                              {f}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel
                  id={panelId("anatomy", "specs")}
                  labelledBy={tabId("anatomy", "specs")}
                  hidden={value !== "specs"}
                  badge={panelBadge}
                  className={
                    selected === "panel"
                      ? "ring-2 ring-[#0f766e] ring-offset-2"
                      : ""
                  }
                >
                  <dl className="overflow-hidden rounded-xl border border-stone-200">
                    {[
                      ["Pages", "192 · 100 gsm dot grid"],
                      ["Size", "A5 · 148 × 210 mm"],
                      ["Binding", "Lay-flat thread-sewn"],
                      ["Cover", "Recycled kraft, water-resistant"],
                      ["Weight", "320 g"],
                    ].map(([k, v], i) => (
                      <div
                        key={k}
                        className={`grid grid-cols-3 gap-2 px-4 py-2.5 text-sm ${i % 2 ? "bg-white" : "bg-stone-50"}`}
                      >
                        <dt className="font-medium text-stone-500">{k}</dt>
                        <dd className="col-span-2 text-stone-800">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </TabPanel>

                <TabPanel
                  id={panelId("anatomy", "reviews")}
                  labelledBy={tabId("anatomy", "reviews")}
                  hidden={value !== "reviews"}
                  badge={panelBadge}
                  className={
                    selected === "panel"
                      ? "ring-2 ring-[#0f766e] ring-offset-2"
                      : ""
                  }
                >
                  <div className="rounded-xl bg-stone-50 p-5">
                    <div className="flex items-center gap-3">
                      <p className="text-3xl font-semibold text-stone-900">
                        4.6
                      </p>
                      <div className="flex-1">
                        {RATING_BARS.map(([star, n]) => (
                          <div
                            key={star}
                            className="flex items-center gap-2 text-[11px] text-stone-500"
                          >
                            <span className="w-3 font-mono">{star}</span>
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200">
                              <div
                                className="h-full rounded-full bg-[#0f766e]"
                                style={{ width: `${n}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-stone-500">128 reviews</p>
                    </div>
                    <blockquote className="mt-3 rounded-lg bg-white p-3 text-sm leading-relaxed text-stone-700 ring-1 ring-stone-200">
                      “Took it through three days of rain in the Cascades.
                      Pages stayed flat, ink never bled.” — Mara
                    </blockquote>
                  </div>
                </TabPanel>
              </div>

              {/* live ARIA readout */}
              <div className="mt-4 rounded-lg bg-stone-900 px-4 py-3 font-mono text-[11px] leading-relaxed text-stone-300">
                {DEMO_TABS.map((t) => (
                  <p key={t.id}>
                    <span className="text-stone-500">#anatomy-tab-{t.id}</span>{" "}
                    aria-selected=
                    <span
                      className={
                        t.id === value ? "text-teal-300" : "text-stone-500"
                      }
                    >
                      {t.id === value ? '"true"' : '"false"'}
                    </span>{" "}
                    tabindex=
                    <span
                      className={
                        t.id === value ? "text-teal-300" : "text-stone-500"
                      }
                    >
                      {t.id === value ? '"0"' : '"-1"'}
                    </span>
                  </p>
                ))}
                <p className="mt-1 text-stone-500">
                  ← live: switch tabs and watch the attributes move
                </p>
              </div>
            </div>
          </div>

          {variant !== "underline" && selected === "indicator" && (
            <div className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800">
              The sliding line only exists in the underline style — in{" "}
              {variant} mode the selected tab&apos;s background is the
              indicator. Switch Style back to underline to see the line.
            </div>
          )}

          {/* inspector */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-[#0f766e] text-sm font-bold text-white">
                {PARTS.indexOf(part) + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-stone-900">
                  {part.name}
                </h3>
                <code className="font-mono text-xs text-stone-500">
                  {part.symbol}
                </code>
              </div>
              <div className="ml-auto flex gap-1.5">
                {PARTS.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelected(p.id)}
                    aria-label={`Inspect ${p.name}`}
                    className={`grid size-7 place-items-center rounded-full text-xs font-bold transition-colors ${
                      p.id === selected
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-stone-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
                  What you see
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-700">
                  {part.see}
                </p>
              </div>
              <div className="rounded-xl bg-[#e6f3f1]/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0f766e]">
                  How it works
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-700">
                  {part.how}
                </p>
              </div>
            </div>
            <p className="mt-3 rounded-lg bg-stone-900 px-3 py-2 font-mono text-[11px] leading-relaxed text-stone-200">
              <span className="text-stone-500">prompt fragment → </span>
              {part.fragment}
            </p>
          </div>
        </section>

        {/* ── full anatomy index ── */}
        <section className="flex flex-col gap-4">
          <div>
            <Eyebrow>Anatomy index</Eyebrow>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              Every part, in words
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {PARTS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelected(p.id);
                  document
                    .getElementById("diagram")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`rounded-xl border p-5 text-left transition-all ${
                  selected === p.id
                    ? "border-[#0f766e]/50 bg-[#e6f3f1]/40 shadow-sm"
                    : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`grid size-6 place-items-center rounded-full text-xs font-bold text-white ${selected === p.id ? "bg-stone-900" : "bg-[#0f766e]"}`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[15px] font-semibold text-stone-900">
                    {p.name}
                  </span>
                </div>
                <code className="mt-1.5 block font-mono text-[11px] text-stone-500">
                  {p.symbol}
                </code>
                <p className="mt-2.5 text-[13px] leading-relaxed text-stone-600">
                  <span className="font-semibold text-stone-700">
                    What you see —{" "}
                  </span>
                  {p.see}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                  <span className="font-semibold text-stone-700">
                    How it works —{" "}
                  </span>
                  {p.how}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* ── easy to confuse ── */}
        <section className="flex flex-col gap-4">
          <div>
            <Eyebrow>Don&apos;t mix these up</Eyebrow>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              Three classic confusions
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">
                Tabs ≠ Accordion
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                Tabs swap one shared region — only one view exists on screen
                at a time. An accordion stacks sections in place, and several
                can stay open together. If the user needs to compare two
                sections side by side, you wanted an accordion, not tabs.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">
                Tabs ≠ Steps
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                Tabs are peers with no order — any tab can be first. Steps
                are a sequence with progress: shipping address before payment,
                always. Never build a checkout or onboarding flow out of
                tabs; users will skip ahead and the order breaks.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">
                Tabs ≠ Segmented control
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                They can look alike, but a segmented control picks one value
                inside a form (day / week / month), while tabs switch whole
                views with a tablist–tabpanel contract and arrow-key travel.
                Same clothes, different job.
              </p>
            </div>
          </div>
        </section>

        {/* ── scenarios ── */}
        <section className="flex flex-col gap-4">
          <div>
            <Eyebrow>Where it belongs</Eyebrow>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              Three tab sets, three jobs
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
              Same tablist machinery, different configuration. Each scenario
              exercises something the others don&apos;t.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                href: "/scenarios/product-details",
                t: "Product details",
                d: "A shop page for the Trailhead Notebook: underline tabs with a review-count badge and three rich panels.",
                c: ["underline", "badge counts", "rich panels"],
              },
              {
                href: "/scenarios/account-settings",
                t: "Account settings",
                d: "A SaaS settings screen: boxed tabs with icons, each panel a working form that keeps what you type.",
                c: ["boxed", "icons", "form panels"],
              },
              {
                href: "/scenarios/analytics-dashboard",
                t: "Analytics dashboard",
                d: "Seven views in a scrollable pill row — with a locked Exports tab and skeleton loading on every switch.",
                c: ["scrollable", "disabled tab", "lazy loading"],
              },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#0f766e]/40 hover:shadow-md"
              >
                <p className="text-[15px] font-semibold text-stone-900 group-hover:text-[#0f766e]">
                  {s.t}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                  {s.d}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.c.map((x) => (
                    <span
                      key={x}
                      className="rounded-full bg-stone-100 px-2.5 py-0.5 font-mono text-[11px] text-stone-600"
                    >
                      {x}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm font-medium text-[#0f766e]">
                  Open scenario <span aria-hidden>→</span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="border-t border-stone-200 pt-6 text-[13px] leading-relaxed text-stone-500">
          <p>
            Built from plain buttons and ARIA — no component library. The same
            contract ({'role="tablist"'}, {'aria-selected="true"'},{" "}
            {'role="tabpanel"'}) is what Radix&apos;s{" "}
            <code className="font-mono text-xs">Tabs</code> renders under the
            hood.
          </p>
        </footer>
      </div>
    </main>
  );
}
