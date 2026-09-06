"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import TokenField, { type Token } from "@/components/TokenField";
import { Card, Eyebrow, Num, PageHeader, ScenarioNav } from "@/components/chrome";

/* ─────────────────────────────────────────────
   Hub data
   ───────────────────────────────────────────── */

const CONTACTS = [
  { label: "Ada Lovelace", sub: "ada@analytical.engine" },
  { label: "Grace Hopper", sub: "grace@navy.mil" },
  { label: "Alan Turing", sub: "alan@bletchley.uk" },
  { label: "Katherine Johnson", sub: "katherine@nasa.gov" },
  { label: "Linus Torvalds", sub: "linus@kernel.org" },
  { label: "Margaret Hamilton", sub: "margaret@apollo.nasa.gov" },
];

const INTRO = [
  {
    step: "Type",
    desc: "The field starts as plain text with a blinking caret. As you type, a completion menu offers matching people or tags.",
  },
  {
    step: "Tokenize",
    desc: "Press Enter, Tab, or a separator like a comma — the word snaps into a rounded capsule. It is now one value, not text.",
  },
  {
    step: "Select & delete",
    desc: "Click a capsule to highlight it, then Delete removes the whole recipient at once. Double-click drops it back to text for editing.",
  },
] as const;

const PARTS = [
  {
    n: 1,
    name: "Token capsule",
    symbol: "NSTokenField.TokenStyle",
    fragment: "an NSTokenField.TokenStyle token capsule wrapping one recognized value inside the field",
    see: "The little rounded bubble around each recipient — a name with an × at its edge. Each bubble is exactly one value: you can see where Ada ends and Grace begins, and removing one never damages the others.",
    how: "When you commit text, the field mints a token object — a small record holding the display string plus the represented object underneath (the real contact, not just the name). State is the list of these records that the component remembers between clicks. Render means drawing the screen again: one pill per record. Think of a coin sorter: loose words go in, stamped coins come out.",
  },
  {
    n: 2,
    name: "Selected token",
    symbol: "NSTokenField",
    fragment: "the selected NSTokenField token with its native highlight, ready for keyboard deletion or editing",
    see: "Click any pill above and it turns solid blue — that is the selected token. It is armed: Delete removes the whole pill, Enter drops it back into editable text, arrow keys walk the highlight pill to pill. Click it above and watch this label follow it.",
    how: "Selection is one remembered value: selectedId, the id of the highlighted pill (or nothing). Clicking a pill fires an event — a message saying “this was clicked” — that stores its id; React re-draws with that pill in the highlight style. Backspace with an empty input first selects the last pill, and only deletes on the second press — the same two-step safety as the native field. For screen readers each pill is a button announcing “press Delete to remove”.",
  },
  {
    n: 3,
    name: "Text entry & caret",
    symbol: "NSTokenField",
    fragment: "the editable text run after the last token, with the insertion caret, where new input is typed",
    see: "The empty space after the pills, with its blinking caret, is still a normal text box. Type there — plain characters appear until you commit them. Backspace with text present deletes characters; with the box empty it selects a pill instead.",
    how: "The field is a hybrid: rendered pills plus one real <input> at the end holding the uncommitted draft (another piece of state). Typing a separator character — comma or semicolon, the tokenizing characters — is intercepted and converted into a commit, exactly like NSTokenField's character set. Pasted text containing separators is split the same way, so ten pasted addresses become ten pills. Analogy: the input is a loading dock; separators are the forklift that crates each word onto a pallet.",
  },
  {
    n: 4,
    name: "Completion menu",
    symbol: "NSTokenFieldDelegate",
    fragment: "token completion suggestions offered by the delegate while typing an unfinished value",
    see: "Type “gr” in the diagram field and a menu drops down with Grace Hopper. Arrow keys move, Enter accepts, Tab accepts, Escape dismisses. The menu only shows people not already added — it never suggests a duplicate.",
    how: "On every keystroke the component asks its suggestion list for matches — standing in for the delegate method that vends completions on macOS. Props are the settings handed in from outside: here, the address book and whether completions are enabled. The popup is a listbox wired to the input with aria-expanded and aria-controls, so assistive tech announces it as suggestions for the current word, not a new page.",
  },
  {
    n: 5,
    name: "Represented value & validity",
    symbol: "NSTokenFieldDelegate",
    fragment: "the represented object behind each capsule, plus delegate validation that flags unrecognized values",
    see: "A pill shows a friendly name, but it stands for a full contact (name + address) — hover the To field in the mail scenario to see the address surface. Type gibberish like “zzz” and press Enter: the pill turns red with a ! because no contact matches, yet it stays put so nothing you typed is silently lost.",
    how: "Display string versus represented object is the core idea: the label is what you see, the object is what the app keeps (id, email, role). A validate function — the delegate's thumbs-up or thumbs-down — decides whether a value is acceptable; failures render in the error style and shake once instead of vanishing. In the team-invite scenario each pill additionally carries a role badge, proving one capsule can ferry a whole record, not just a word.",
  },
] as const;

/* ─────────────────────────────────────────────
   Live anatomy figure — its own tiny token field
   so callout 2 can chase the live selection.
   ───────────────────────────────────────────── */

function initials(label: string) {
  return label
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function AnatomyDemo({
  tokenStyle,
  completionsOn,
}: {
  tokenStyle: "rounded" | "default" | "none";
  completionsOn: boolean;
}) {
  const [tokens, setTokens] = useState<Token[]>([
    { id: "a", label: "Ada Lovelace", sub: "ada@analytical.engine" },
    { id: "g", label: "Grace Hopper", sub: "grace@navy.mil" },
    { id: "z", label: "zzz", invalid: true },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>("g");
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    const q = draft.trim().toLowerCase();
    if (!completionsOn || !q) return [];
    const taken = new Set(tokens.map((t) => t.label.toLowerCase()));
    return CONTACTS.filter(
      (c) =>
        !taken.has(c.label.toLowerCase()) &&
        (c.label.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q))
    ).slice(0, 3);
  }, [draft, tokens, completionsOn]);

  const radius =
    tokenStyle === "rounded" ? "rounded-full" : tokenStyle === "default" ? "rounded-md" : "rounded-[3px]";

  const commit = (raw: string, sub?: string) => {
    const v = raw.trim().replace(/[,;]+$/, "");
    if (!v) return;
    setTokens((t) => [...t, { id: `n-${Date.now()}`, label: v, sub, invalid: v === "zzz" }]);
    setDraft("");
  };

  return (
    <div className="relative">
      {/* floating callout badges */}
      <div className="pointer-events-none absolute -top-3 left-6 z-10 flex items-center gap-1.5">
        <Num n={1} />
        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-stone-500 shadow-sm ring-1 ring-stone-200">
          token capsule · TokenStyle
        </span>
      </div>
      {selectedId && (
        <div className="pointer-events-none absolute -top-3 right-6 z-10 flex items-center gap-1.5">
          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
            selected token
          </span>
          <Num n={2} />
        </div>
      )}

      <div
        onClick={() => inputRef.current?.focus()}
        className="flex min-h-[64px] cursor-text flex-wrap items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 pb-6 pt-6 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
      >
        {tokens.map((t) => {
          const sel = t.id === selectedId;
          return (
            <span
              key={t.id}
              role="button"
              tabIndex={0}
              aria-pressed={sel}
              aria-label={`Token ${t.label}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(sel ? null : t.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Delete" || e.key === "Backspace") {
                  e.preventDefault();
                  setTokens((x) => x.filter((y) => y.id !== t.id));
                  if (sel) setSelectedId(null);
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (sel) {
                    setTokens((x) => x.filter((y) => y.id !== t.id));
                    setDraft(t.label);
                    setSelectedId(null);
                  } else setSelectedId(t.id);
                }
              }}
              className={`relative inline-flex cursor-default items-center gap-1.5 border py-1 pl-2 pr-1.5 text-[13.5px] font-medium outline-none transition-all ${radius} ${
                sel
                  ? t.invalid
                    ? "border-red-600 bg-red-600 text-white ring-2 ring-red-200"
                    : "border-blue-700 bg-blue-600 text-white ring-2 ring-blue-200"
                  : t.invalid
                    ? "border-red-300 bg-red-50 text-red-800"
                    : "border-stone-300 bg-stone-100 text-stone-800 hover:border-stone-400"
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                  sel ? "bg-white/25 text-white" : "bg-blue-600 text-white"
                }`}
              >
                {t.invalid ? "!" : initials(t.label)}
              </span>
              <span className="leading-5">{t.label}</span>
              <span
                role="button"
                tabIndex={-1}
                aria-label={`Remove ${t.label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setTokens((x) => x.filter((y) => y.id !== t.id));
                  if (sel) setSelectedId(null);
                }}
                className="flex h-4 w-4 items-center justify-center rounded-full text-[11px] hover:bg-black/15"
              >
                ×
              </span>
            </span>
          );
        })}
        <span className="relative inline-flex min-w-[110px] flex-1 items-center">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setSelectedId(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (matches[0] && draft.trim()) commit(matches[0].label, matches[0].sub);
                else commit(draft);
              } else if ((e.key === "Backspace" || e.key === "Delete") && draft === "") {
                e.preventDefault();
                if (selectedId) {
                  setTokens((x) => x.filter((y) => y.id !== selectedId));
                  setSelectedId(null);
                } else if (tokens.length > 0) {
                  setSelectedId(tokens[tokens.length - 1].id);
                }
              } else if ([",", ";"].includes(e.key)) {
                e.preventDefault();
                commit(draft);
              }
            }}
            placeholder="Type “gr”, Enter…"
            aria-label="Diagram input — type to tokenize"
            className="w-full bg-transparent px-1 py-1 text-[13.5px] text-stone-900 outline-none placeholder:text-stone-400"
          />
          {/* caret callout */}
          <span className="pointer-events-none absolute -bottom-5 left-1 flex items-center gap-1">
            <Num n={3} tone="ink" />
            <span className="text-[11px] font-medium text-stone-500">caret + draft text</span>
          </span>
        </span>
      </div>

      {/* completion menu */}
      <div className="relative mt-2 min-h-[86px]">
        {matches.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg shadow-stone-900/5">
            <div className="flex items-center gap-1.5 border-b border-stone-100 px-3 py-1.5">
              <Num n={4} />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                completion menu — click to accept
              </p>
            </div>
            {matches.map((m) => (
              <button
                key={m.label}
                type="button"
                onClick={() => commit(m.label, m.sub)}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-blue-50"
              >
                <span
                  aria-hidden="true"
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white"
                >
                  {initials(m.label)}
                </span>
                <span className="text-[13.5px] font-medium text-stone-900">{m.label}</span>
                <span className="truncate text-xs text-stone-500">{m.sub}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 rounded-xl border border-dashed border-stone-200 bg-stone-50 px-3 py-2.5">
            <Num n={4} />
            <p className="text-xs text-stone-500">
              Completion menu appears here while you type — try “gr”, “ka”, or “li” in the field above.
            </p>
          </div>
        )}
        <div className="mt-2 flex items-center gap-1.5 px-1">
          <Num n={5} tone="red" />
          <p className="text-xs text-stone-500">
            <span className="font-semibold text-stone-700">“zzz”</span> shows the invalid style — display
            text kept, represented object missing. Comma / Enter are the tokenizing separators.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Page
   ───────────────────────────────────────────── */

const SCENARIOS = [
  {
    href: "/scenarios/mail-compose",
    n: "Scenario 1",
    title: "Mail compose — recipients",
    desc: "To / Cc fields with an address-book, invalid-address styling, and paste-ten-addresses-at-once handling.",
    tags: ["completions", "validation", "paste"],
  },
  {
    href: "/scenarios/tagging",
    n: "Scenario 2",
    title: "Note tagging — labels",
    desc: "Free-form lowercase tags with a 5-tag limit, duplicate blocking, and tinted capsules per topic.",
    tags: ["custom values", "limits", "normalization"],
  },
  {
    href: "/scenarios/team-invite",
    n: "Scenario 3",
    title: "Team invite — roles",
    desc: "Each capsule carries a represented object: a person plus an editable role badge (Viewer / Editor / Admin).",
    tags: ["represented objects", "per-token data"],
  },
];

export default function TokenFieldHub() {
  const [tokenStyle, setTokenStyle] = useState<"rounded" | "default" | "none">("rounded");
  const [completionsOn, setCompletionsOn] = useState(true);
  const [liveTokens, setLiveTokens] = useState<Token[]>([
    { id: "live-1", label: "design-system" },
    { id: "live-2", label: "q3-launch" },
  ]);

  return (
    <div className="min-h-full bg-stone-50">
      <div className="mx-auto w-full max-w-5xl px-5 pb-20 pt-8 sm:px-8">
        <ScenarioNav current="/" />

        <div className="mt-8">
          <PageHeader
            eyebrow="macOS · NSTokenField — web approximation"
            title="Token Field"
            alsoCalled="token input, recipient field, tag input, pill input"
            lede="A token field converts recognized pieces of typed text into discrete rounded tokens — like recipients in a mail compose window. Each token represents one value and can be selected, edited, or removed without treating the whole field as plain text. On the Mac this is NSTokenField; below is how the pattern behaves, rebuilt for the web."
          />
        </div>

        {/* intro strip */}
        <section aria-label="What am I looking at" className="mt-8 grid gap-3 sm:grid-cols-3">
          {INTRO.map((c, i) => (
            <div key={c.step} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-stone-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-[12px] font-bold text-white">
                  {i + 1}
                </span>
                {c.step}
              </p>
              <p className="mt-2 text-[13px] leading-6 text-stone-600">{c.desc}</p>
            </div>
          ))}
        </section>

        {/* live anatomy */}
        <section aria-label="Live anatomy diagram" className="mt-6">
          <Card className="p-5 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Live anatomy diagram</Eyebrow>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">
                  Click the pills — label <span className="font-mono text-[15px]">2</span> chases your selection
                </h2>
                <p className="mt-1 max-w-xl text-[13.5px] leading-6 text-stone-600">
                  This is the real control, not a picture. Click a capsule to select it, press Delete to
                  remove it, double-click to edit it, type to summon completions.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div
                  role="group"
                  aria-label="Token style"
                  className="flex overflow-hidden rounded-full ring-1 ring-inset ring-stone-200"
                >
                  {(["rounded", "default", "none"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTokenStyle(s)}
                      aria-pressed={tokenStyle === s}
                      className={`px-3 py-1.5 font-mono text-[12px] transition-colors ${
                        tokenStyle === s ? "bg-stone-900 text-white" : "bg-white text-stone-500 hover:bg-stone-50"
                      }`}
                    >
                      {s === "rounded" ? "TokenStyle.rounded" : s === "default" ? "TokenStyle.default" : "TokenStyle.none"}
                    </button>
                  ))}
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-stone-600">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={completionsOn}
                    onClick={() => setCompletionsOn((v) => !v)}
                    className={`relative h-5 w-9 rounded-full transition-colors ${completionsOn ? "bg-blue-600" : "bg-stone-300"}`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${completionsOn ? "left-[18px]" : "left-0.5"}`}
                    />
                  </button>
                  Completions
                </label>
              </div>
            </div>

            <div className="mt-8">
              <AnatomyDemo tokenStyle={tokenStyle} completionsOn={completionsOn} />
            </div>
          </Card>
        </section>

        {/* layered explanations */}
        <section aria-label="Every named part, explained" className="mt-6">
          <h2 className="text-xl font-semibold tracking-tight text-stone-900">Every named part, explained</h2>
          <p className="mt-1 text-[13.5px] text-stone-600">
            Left column: what the person <em>using</em> the product experiences. Right column: how it works,
            for the person <em>building</em> it — every technical term defined.
          </p>
          <div className="mt-4 grid gap-3">
            {PARTS.map((p) => (
              <Card key={p.n} className="overflow-hidden">
                <div className="flex items-start gap-3 border-b border-stone-100 px-5 pt-4">
                  <Num n={p.n} tone={p.n === 5 ? "red" : p.n === 2 ? "blue" : "ink"} />
                  <div className="pb-3">
                    <h3 className="text-[15px] font-semibold text-stone-900">{p.name}</h3>
                    <p className="mt-0.5 font-mono text-[12px] text-stone-500">
                      {p.symbol} <span className="text-stone-400">· “{p.fragment}”</span>
                    </p>
                  </div>
                </div>
                <div className="grid gap-0 sm:grid-cols-2">
                  <div className="px-5 py-4 sm:border-r sm:border-stone-100">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                      What you see
                    </p>
                    <p className="mt-1.5 text-[13.5px] leading-6 text-stone-700">{p.see}</p>
                  </div>
                  <div className="bg-stone-50/70 px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                      How it works
                    </p>
                    <p className="mt-1.5 text-[13.5px] leading-6 text-stone-700">{p.how}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* try the real thing */}
        <section aria-label="Try the real thing" className="mt-6">
          <Card className="p-5 sm:p-7">
            <Eyebrow>Hands on</Eyebrow>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">
              Try the real thing — keyboard included
            </h2>
            <p className="mt-1 max-w-2xl text-[13.5px] leading-6 text-stone-600">
              Fully working field. Type a topic and press <kbd className="rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 font-mono text-[11px]">Enter</kbd> or{" "}
              <kbd className="rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 font-mono text-[11px]">,</kbd>.
              Paste “research, prototype, launch” to mint three at once. Empty the box and press{" "}
              <kbd className="rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 font-mono text-[11px]">⌫</kbd> twice
              to select-then-delete the last pill.
            </p>
            <div className="mt-4">
              <TokenField
                initialTokens={[
                  { id: "t1", label: "design-system" },
                  { id: "t2", label: "q3-launch" },
                ]}
                suggestions={[
                  { label: "research" },
                  { label: "prototype" },
                  { label: "launch" },
                  { label: "design-system" },
                  { label: "accessibility" },
                  { label: "field-notes" },
                ]}
                placeholder="Add a topic…"
                onChange={setLiveTokens}
              />
            </div>
            <p className="mt-2 font-mono text-[12px] text-stone-500">
              tokens = [{liveTokens.map((t) => `“${t.label}”`).join(", ") || "—"}]
            </p>
          </Card>
        </section>

        {/* scenarios */}
        <section aria-label="Where it belongs" className="mt-6">
          <h2 className="text-xl font-semibold tracking-tight text-stone-900">Where it belongs — three products</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {SCENARIOS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">{s.n}</p>
                <h3 className="mt-1 text-[15px] font-semibold text-stone-900 group-hover:text-blue-800">
                  {s.title} →
                </h3>
                <p className="mt-1.5 text-[13px] leading-6 text-stone-600">{s.desc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-stone-100 px-2 py-0.5 font-mono text-[11px] text-stone-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-10 border-t border-stone-200 pt-4 text-xs leading-5 text-stone-400">
          Web approximation of AppKit <span className="font-mono">NSTokenField</span> (macOS). Native
          tokenizing characters, represented objects, and delegate completions are mirrored with a plain
          input, pill buttons, and a suggestion listbox — no extra dependencies.
        </footer>
      </div>
    </div>
  );
}
