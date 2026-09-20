"use client";

import Link from "next/link";
import { useState } from "react";

/* ── demo content: a returns-policy accordion for a fictional outdoor shop ── */

type DemoItem = { q: string; a: string; tag: string };

const DEMO_ITEMS: DemoItem[] = [
  {
    q: "How long do I have to return something?",
    a: "You have 60 days from delivery. Gear just needs to be clean and in resellable condition — we even take back boots with trail dust on them, as long as the tread isn't worn through. Refunds land 3–5 business days after our warehouse scans the return.",
    tag: "Returns",
  },
  {
    q: "Do you offer free return shipping?",
    a: "Yes, for orders over $75 — a prepaid label is printed right from your order page. Under $75, the label costs $4.95 and is deducted from your refund. Exchanges ship out free in both directions, always.",
    tag: "Shipping",
  },
  {
    q: "What if my item arrives damaged?",
    a: "Send a photo within 14 days and we ship a replacement immediately — you don't wait for the damaged one to come back. If the item is sold out, you choose between a full refund and store credit plus 10% for the trouble.",
    tag: "Damaged",
  },
  {
    q: "Can I exchange for a different size?",
    a: "Yes. Open the exchange panel from your order, pick the new size, and the replacement ships before your return arrives. If the new size costs more, you pay the difference at checkout; if less, we refund it automatically.",
    tag: "Exchanges",
  },
];

/* ── the three named parts ── */

type Part = {
  id: "trigger" | "indicator" | "panel";
  n: number;
  name: string;
  symbol: string;
  fragment: string;
  see: string;
  how: string;
};

const PARTS: Part[] = [
  {
    id: "trigger",
    n: 1,
    name: "Disclosure trigger",
    symbol: "<summary>",
    fragment: "the <summary> disclosure trigger spanning the accordion heading row",
    see: "The question row you click — the whole row is one big tap target, not a tiny icon. It tells you “there is more hiding behind me, click to see it.” That is why it spans the full width: on a phone, a thumb can land anywhere on the row.",
    how: "A <summary> element is special: the browser (not your code) makes it clickable and keyboard-operable for free — Tab reaches it, Enter or Space toggles it. Props are settings you hand a component when you use it; state is what it remembers between clicks. Here there is no React state at all for opening — the <details> parent remembers open vs. closed by itself, like a spring-loaded cupboard door that stays where you leave it.",
  },
  {
    id: "indicator",
    n: 2,
    name: "Disclosure indicator",
    symbol: "<summary>::marker",
    fragment:
      "the <summary>::marker disclosure indicator rotating between the closed and open states",
    see: "The little chevron (or plus) at the row's edge that turns when the row opens. It is a promise about the future: chevron-down means “content will appear below,” chevron-up means “click again to put it away.” Without it, users can't tell a heading from a button.",
    how: "Browsers render a default triangle via ::marker — we hide it (list-style: none plus ::marker { content: \"\" }) and draw our own icon so it matches the design. The rotation is pure CSS: details[open] flips the icon 180°, or turns a plus into a minus. No JavaScript measures anything; the icon simply reacts to the parent's open attribute, like a windsock reacting to wind.",
  },
  {
    id: "panel",
    n: 3,
    name: "Disclosure panel",
    symbol: "<details>",
    fragment: "the <details> disclosure panel revealed directly beneath its summary heading",
    see: "The answer area that slides open under the question and physically pushes every row below it further down the page. Nothing overlaps, nothing pops over anything — the page simply grows. That push-down is the accordion's signature: content stays in reading order, so you never lose your place.",
    how: "<details> is the wrapper that owns the open state — when open, everything after its <summary> shows; when closed, it hides. To animate it we wrap the answer in a div that transitions grid-template-rows from 0fr to 1fr (a CSS trick that animates height without measuring pixels). Crucially, we add no aria-expanded here: the browser already exposes open/closed to screen readers, and a redundant attribute would be like two people shouting the same announcement.",
  },
];

/* ── small building blocks ── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
      {children}
    </p>
  );
}

function Seg<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex rounded-full border border-stone-200 bg-white p-1 shadow-sm"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all ${
            value === o.value
              ? "bg-stone-900 text-white shadow"
              : "text-stone-500 hover:text-stone-900"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-teal-700 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Plus({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-6 shrink-0 place-items-center rounded-full bg-teal-700 text-white transition-transform duration-300 ${
        open ? "rotate-45" : ""
      }`}
    >
      <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
        <path
          d="M6 1v10M1 6h10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function NumPill({
  n,
  active,
  onClick,
  label,
}: {
  n: number;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={label}
      aria-label={`Highlight part ${n}: ${label}`}
      aria-pressed={active}
      className={`pointer-events-auto grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold shadow-md ring-2 ring-white transition-transform hover:scale-110 ${
        active ? "scale-110 bg-stone-900 text-white" : "bg-teal-700 text-white"
      }`}
    >
      {n}
    </button>
  );
}

/* ── page ── */

export default function AccordionHub() {
  const [mode, setMode] = useState<"exclusive" | "multiple">("exclusive");
  const [indicator, setIndicator] = useState<"chevron" | "plus">("chevron");
  const [animate, setAnimate] = useState(true);
  const [openSet, setOpenSet] = useState<Set<number>>(new Set([0]));
  const [activePart, setActivePart] = useState<Part["id"] | null>(null);

  const togglePart = (id: Part["id"]) =>
    setActivePart((cur) => (cur === id ? null : id));

  const handleToggle = (i: number, el: HTMLDetailsElement) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (el.open) next.add(i);
      else next.delete(i);
      return next;
    });
  };

  const partActive = (id: Part["id"]) => activePart === id;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-10 sm:px-8">
      {/* header */}
      <header className="max-w-3xl">
        <Eyebrow>Web · Disclosure</Eyebrow>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          Accordion
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-stone-500">
          Also called:{" "}
          <span className="font-medium text-stone-700">
            disclosure, expandable sections, collapse, expander
          </span>
        </p>
        <p className="mt-4 text-[17px] leading-8 text-stone-600">
          A vertical stack of headings that disclose or hide their content. Opening a
          section expands it in place and pushes the rows below further down — with
          either <strong className="font-semibold text-stone-900">one</strong> or{" "}
          <strong className="font-semibold text-stone-900">several</strong> panels
          allowed open, depending on the pattern. Below is the real thing, built from
          native{" "}
          <code className="rounded bg-stone-900/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-stone-800">
            &lt;details&gt;
          </code>{" "}
          and{" "}
          <code className="rounded bg-stone-900/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-stone-800">
            &lt;summary&gt;
          </code>
          , with numbered pins marking every named part. Click the pins — or the rows.
        </p>
      </header>

      {/* what-am-I-looking-at strip */}
      <section aria-label="Structure at a glance" className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          {
            t: "Trigger row",
            s: "<summary>",
            d: "The clickable heading — one per section, full-width.",
          },
          {
            t: "Indicator",
            s: "::marker",
            d: "The chevron or plus that shows open vs. closed.",
          },
          {
            t: "Panel",
            s: "<details>",
            d: "The hidden answer that pushes content down.",
          },
        ].map((c, i) => (
          <div
            key={c.t}
            className="rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-stone-900">
              <span className="grid size-5 place-items-center rounded-full bg-teal-700 text-[11px] font-bold text-white">
                {i + 1}
              </span>
              {c.t}
            </p>
            <p className="mt-1 font-mono text-xs text-teal-700">{c.s}</p>
            <p className="mt-1 text-[13px] leading-6 text-stone-500">{c.d}</p>
          </div>
        ))}
      </section>

      {/* controls */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Seg
          ariaLabel="Open mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: "exclusive", label: "One open (name grouped)" },
            { value: "multiple", label: "Several open" },
          ]}
        />
        <Seg
          ariaLabel="Indicator style"
          value={indicator}
          onChange={setIndicator}
          options={[
            { value: "chevron", label: "Chevron" },
            { value: "plus", label: "Plus / minus" },
          ]}
        />
        <button
          type="button"
          role="switch"
          aria-checked={animate}
          onClick={() => setAnimate((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-[13px] font-medium text-stone-600 shadow-sm transition-colors hover:text-stone-900"
        >
          <span
            aria-hidden="true"
            className={`relative h-5 w-9 rounded-full transition-colors ${
              animate ? "bg-teal-700" : "bg-stone-300"
            }`}
          >
            <span
              className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all ${
                animate ? "left-[18px]" : "left-0.5"
              }`}
            />
          </span>
          Animate reveal
        </button>
      </div>

      {/* anatomy diagram */}
      <main className="mt-4 grid gap-5 lg:grid-cols-[1fr_370px]">
        {/* live component */}
        <section
          aria-label="Live accordion anatomy diagram"
          className={`rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] sm:p-7 ${
            animate ? "" : "acc-noanim"
          }`}
        >
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-bold text-stone-900">
              Returns &amp; exchanges
              <span className="ml-2 align-middle text-xs font-medium text-stone-400">
                Fern &amp; Field Supply Co.
              </span>
            </h2>
            <p className="shrink-0 font-mono text-xs text-stone-400" aria-live="polite">
              {openSet.size} of {DEMO_ITEMS.length} open
            </p>
          </div>
          <p className="mt-1 text-[13px] text-stone-500">
            {mode === "exclusive"
              ? "Grouped with one shared name — opening a row closes the others."
              : "Independent sections — open as many as you like."}{" "}
            Tab to a row, then press Enter.
          </p>

          <div key={mode} className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
            {DEMO_ITEMS.map((item, i) => {
              const open = openSet.has(i);
              return (
                <details
                  key={item.q}
                  name={mode === "exclusive" ? "hub-group" : undefined}
                  open={i === 0}
                  onToggle={(e) => handleToggle(i, e.currentTarget)}
                  className={`acc group ${i > 0 ? "border-t border-stone-200" : ""} ${
                    open ? "bg-teal-50/40" : "bg-white"
                  } transition-colors`}
                >
                  <summary
                    className={`acc-summary acc-focusable flex items-center gap-3 px-4 py-4 transition-colors hover:bg-stone-50 sm:px-5 ${
                      partActive("trigger") ? "bg-amber-50" : ""
                    }`}
                  >
                    <span className="hidden font-mono text-[11px] text-stone-300 sm:inline">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold text-stone-900">
                        {item.q}
                      </span>
                      <span className="mt-0.5 inline-block rounded-full bg-stone-100 px-2 py-px text-[11px] font-medium text-stone-500">
                        {item.tag}
                      </span>
                    </span>
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-1 py-1 ${
                        partActive("indicator") ? "bg-amber-100 ring-2 ring-amber-400" : ""
                      }`}
                    >
                      {indicator === "chevron" ? <Chevron open={open} /> : <Plus open={open} />}
                      <NumPill
                        n={2}
                        active={partActive("indicator")}
                        onClick={() => togglePart("indicator")}
                        label="Disclosure indicator"
                      />
                    </span>
                    <NumPill
                      n={1}
                      active={partActive("trigger")}
                      onClick={() => togglePart("trigger")}
                      label="Disclosure trigger"
                    />
                  </summary>
                  <div className="acc-panel">
                    <div>
                      <div
                        className={`relative mx-4 mb-4 rounded-xl border p-4 text-[14px] leading-7 text-stone-600 sm:mx-5 ${
                          partActive("panel")
                            ? "border-amber-400 bg-amber-50 ring-2 ring-amber-300"
                            : "border-stone-100 bg-stone-50"
                        }`}
                      >
                        <span className="pointer-events-none absolute -top-3 right-3 flex items-center gap-1 rounded-full bg-white py-0.5 pl-0.5 pr-2 shadow-md ring-1 ring-stone-200">
                          <NumPill
                            n={3}
                            active={partActive("panel")}
                            onClick={() => togglePart("panel")}
                            label="Disclosure panel"
                          />
                          <code className="font-mono text-[10px] text-stone-500">
                            &lt;details&gt;
                          </code>
                        </span>
                        {item.a}
                      </div>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>

          <p className="mt-3 font-mono text-[11px] leading-5 text-stone-400">
            {mode === "exclusive" ? (
              <>
                &lt;details <span className="text-teal-700">name="hub-group"</span>&gt; ×{" "}
                {DEMO_ITEMS.length} — the shared name makes the browser close the others.
              </>
            ) : (
              <>
                &lt;details&gt; × {DEMO_ITEMS.length} with no name — each keeps its own
                open state.
              </>
            )}
          </p>
        </section>

        {/* layered explanations */}
        <aside className="flex flex-col gap-3" aria-label="Anatomy explanations">
          {PARTS.map((p) => {
            const active = partActive(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePart(p.id)}
                aria-pressed={active}
                className={`rounded-2xl border bg-white p-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  active
                    ? "border-stone-900 ring-2 ring-stone-900/10"
                    : "border-stone-200"
                }`}
              >
                <p className="flex items-center gap-2">
                  <span
                    className={`grid size-6 place-items-center rounded-full text-xs font-bold text-white transition-colors ${
                      active ? "bg-stone-900" : "bg-teal-700"
                    }`}
                  >
                    {p.n}
                  </span>
                  <span className="text-[15px] font-bold text-stone-900">{p.name}</span>
                </p>
                <p className="mt-1 font-mono text-xs text-teal-700">{p.symbol}</p>
                <div className="mt-2 space-y-2 text-[13px] leading-6">
                  <p className="text-stone-600">
                    <span className="font-semibold text-stone-900">What you see — </span>
                    {p.see}
                  </p>
                  <p className="rounded-lg bg-stone-50 p-2.5 text-stone-600">
                    <span className="font-semibold text-stone-900">How it works — </span>
                    {p.how}
                  </p>
                  <p className="font-mono text-[11px] leading-5 text-stone-400">
                    “{p.fragment}”
                  </p>
                </div>
              </button>
            );
          })}
        </aside>
      </main>

      {/* code + rules */}
      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-950 text-stone-200 shadow-sm">
          <p className="border-b border-white/10 px-5 py-3 font-mono text-xs text-stone-400">
            the paste-ready pattern — native, no ARIA needed
          </p>
          <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-6">
            <code>
              <span className="text-stone-500">{"<!-- one open at a time -->"}</span>
              {"\n"}
              <span className="text-emerald-300">{"<details"}</span>{" "}
              <span className="text-amber-300">{'name="shipping"'}</span>
              <span className="text-emerald-300">{">"}</span>
              {"\n  "}
              <span className="text-emerald-300">{"<summary>"}</span>
              When will my order arrive?
              <span className="text-emerald-300">{"</summary>"}</span>
              {"\n  "}
              <span className="text-stone-500">{"<!-- panel: grid-rows 0fr → 1fr -->"}</span>
              {"\n  "}
              <span className="text-emerald-300">{"<div"}</span>{" "}
              <span className="text-amber-300">{'class="panel"'}</span>
              <span className="text-emerald-300">{">"}</span>
              …
              <span className="text-emerald-300">{"</div>"}</span>
              {"\n"}
              <span className="text-emerald-300">{"</details>"}</span>
            </code>
          </pre>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-6">
          <h2 className="text-base font-bold text-stone-900">Three rules that keep it native</h2>
          <ol className="mt-3 space-y-3 text-[14px] leading-7 text-stone-600">
            <li className="flex gap-2.5">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-teal-700" />
              <span>
                <strong className="font-semibold text-stone-900">Group with name.</strong>{" "}
                Give grouped <code className="font-mono text-[0.9em]">&lt;details&gt;</code>{" "}
                elements the same <code className="font-mono text-[0.9em]">name</code> when
                only one section may be open — the browser enforces exclusivity, like
                stations on a single radio preset.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-teal-700" />
              <span>
                <strong className="font-semibold text-stone-900">
                  Don&apos;t add aria-expanded to native disclosure.
                </strong>{" "}
                <code className="font-mono text-[0.9em]">&lt;summary&gt;</code> already
                reports expanded state. Adding it is redundant — save{" "}
                <code className="font-mono text-[0.9em]">aria-expanded</code> for a fully
                custom primitive (a <code className="font-mono text-[0.9em]">button</code>{" "}
                driving a <code className="font-mono text-[0.9em]">div</code>), as the
                course-curriculum scenario shows.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-teal-700" />
              <span>
                <strong className="font-semibold text-stone-900">
                  Keep keyboard behavior native.
                </strong>{" "}
                Never intercept Enter/Space on a summary or rebuild focus handling in
                JavaScript — screen-reader and keyboard users already get the real
                semantics, including announcing “expanded” and “collapsed”.
              </span>
            </li>
          </ol>
        </div>
      </section>

      {/* scenarios */}
      <section className="mt-10" aria-label="Scenarios">
        <Eyebrow>Where it belongs</Eyebrow>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-900">
          Three products, three configurations
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            {
              href: "/scenarios/faq",
              kicker: "Scenario 1 · exclusive",
              title: "Help-center FAQ",
              d: "One answer at a time via a shared name. Search filters the questions; opening one closes the rest so long answers never stack into a wall of text.",
            },
            {
              href: "/scenarios/product-details",
              kicker: "Scenario 2 · multiple",
              title: "Product details",
              d: "Independent sections with plus/minus indicators — shoppers compare shipping against returns side by side, both open at once.",
            },
            {
              href: "/scenarios/course-curriculum",
              kicker: "Scenario 3 · custom primitive",
              title: "Course curriculum",
              d: "A fully custom disclosure (button + aria-expanded) with progress, locked lessons, and expand-all — for when you need animation and controls native can't give you.",
            },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="acc-focusable group rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
                {s.kicker}
              </p>
              <p className="mt-1.5 text-lg font-bold text-stone-900 group-hover:underline">
                {s.title} →
              </p>
              <p className="mt-2 text-[14px] leading-7 text-stone-500">{s.d}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-10 border-t border-stone-200 pt-5 text-[13px] text-stone-400">
        <p>
          Accordion (Disclosure) · built from native{" "}
          <code className="font-mono">&lt;details&gt;</code> +{" "}
          <code className="font-mono">&lt;summary&gt;</code> · NameThatUi learning lab
        </p>
      </footer>
    </div>
  );
}
