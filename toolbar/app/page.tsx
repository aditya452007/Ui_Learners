"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import UnifiedToolbar, {
  TButton,
  TDivider,
  TSearch,
  splitItems,
  type DisplayMode,
  type HighlightId,
  type SeparatorStyle,
  type ToolbarItem,
} from "@/components/toolbar";
import { ApiChips, Eyebrow, PageHeader } from "@/components/chrome";

/* ── the five named parts ── */

type Part = {
  id: Exclude<HighlightId, null>;
  name: string;
  symbol: string;
  fragment: string;
  see: string;
  how: string;
};

const PARTS: Part[] = [
  {
    id: "title",
    name: "Unified title",
    symbol: "NSWindow.ToolbarStyle.unified",
    fragment:
      "Keep the title inline with the actions (NSWindow.ToolbarStyle.unified)",
    see: "The document's name sits in the very same row as the buttons — one slim strip instead of a title bar plus a toolbar stacked on top. It answers “what am I looking at?” without costing a second row of screen space.",
    how: "A setting on the window (ToolbarStyle.unified) merges the title row and the toolbar row into one flexbox row — a layout that lines children up side by side. Click the title above: it swaps into an input box, because the title is just text state the window remembers. Type a new name and press Enter, and the parent is told through the onTitleChange callback — a function handed down so the child can send news back up.",
  },
  {
    id: "item",
    name: "Toolbar item",
    symbol: "NSToolbarItem",
    fragment:
      "a native toolbar item (NSToolbarItem): one action, field, group, or flexible space placed with standard macOS toolbar behavior",
    see: "Every button, the search field, the thin divider, even the invisible gap before Search is one toolbar item. Items get even macOS spacing for free, and grey themselves out when their action makes no sense — Deselect the “text selected” box below and watch Comment-style validation happen on Bold.",
    how: "Each item is a small component receiving an icon, a label, and what-to-do-when-clicked (its onClick callback). Props are the settings you hand a component when you use it. Validation just means the item can be disabled: Bold below is disabled while hasSelection is false — state is the component's memory of that checkbox, and React re-renders, meaning it redraws the screen, the moment it flips. Try the Share button: it fires its action and shows a toast.",
  },
  {
    id: "label",
    name: "Toolbar item label",
    symbol: "NSToolbarItem.label",
    fragment:
      "the toolbar item label (NSToolbarItem.label): the action name shown with the icon in icon-and-text display mode",
    see: "The tiny caption under each icon — “Share”, “Bold”, “Sidebar”. It tells you what the picture means, which is why icon-and-text is the friendliest mode for beginners. Switch the display mode to Icon only and the captions vanish; the buttons keep working exactly the same.",
    how: "The label is a short text value (a string) handed to the item alongside its icon. The display-mode setting decides whether the item draws icon + label, icon alone, or text alone — one setting, three layouts. The customization palette can show a different, longer palette label, so the short label stays put in the toolbar. Toggle the mode switch and watch caption ③ appear and disappear.",
  },
  {
    id: "overflow",
    name: "Overflow chevron",
    symbol: "NSToolbarItem.visibilityPriority",
    fragment:
      "the toolbar overflow chevron (NSToolbarItem.visibilityPriority): the trailing » control that collects toolbar items that no longer fit",
    see: "The » button at the right end appears only when the window gets too narrow for every item. Click it and the missing items are all there in a menu — nothing is lost, just parked. Drag the width slider left and watch New, then Italic, slide into the chevron.",
    how: "Every item carries a visibilityPriority number — low numbers overflow first. When the row runs out of room, the toolbar hides the lowest-priority items and parks them in the menu, highest priority surviving longest. It is like lifeboat seats with assigned boarding order: Search (priority 100) boards first and New (priority 30) first into the boats. Open the » menu and press an item — it fires the same action as if it were still in the row.",
  },
  {
    id: "separator",
    name: "Title-bar separator",
    symbol: "NSWindow.titlebarSeparatorStyle",
    fragment:
      "the title-bar separator style (NSWindow.titlebarSeparatorStyle): the automatic, line, shadow, or none boundary between unified toolbar chrome and window content",
    see: "The hairline where the chrome ends and your document begins — you barely notice it, and that is the job. Pick Automatic and the line only appears once you scroll; pick Shadow and the toolbar casts a soft drop shadow; pick None and photos bleed edge-to-edge beneath the chrome.",
    how: "It is a one-pixel div — or a shadow, or nothing at all. The separator-style setting picks between automatic, line, shadow, and none. Automatic listens to the content's scroll event: while scrollTop is 0 the divider stays transparent, and the first pixel of scrolling fades it in. Scroll the document inside the demo window with Automatic selected and watch the boundary draw itself.",
  },
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
      className={`pointer-events-auto absolute z-40 grid size-5 place-items-center rounded-full text-[11px] font-bold shadow-md ring-2 ring-white transition-transform hover:scale-125 ${
        selected ? "scale-125 bg-stone-900 text-white" : "bg-[#0071e3] text-white"
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

/* ── hub page ── */

const MODES = ["icon-text", "icon", "text"] as const;
const SEPS: SeparatorStyle[] = ["automatic", "line", "shadow", "none"];

export default function Home() {
  const [title, setTitle] = useState("Field Notes");
  const [mode, setMode] = useState<DisplayMode>("icon-text");
  const [sep, setSep] = useState<SeparatorStyle>("line");
  const [winWidth, setWinWidth] = useState(640);
  const [selected, setSelected] = useState<Exclude<HighlightId, null>>("title");
  const [search, setSearch] = useState("");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [sideOpen, setSideOpen] = useState(true);
  const [hasSelection, setHasSelection] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const part = PARTS.find((p) => p.id === selected) ?? PARTS[0];

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  }

  const markFor = (id: string): "item" | "label" | null =>
    id === "share" && selected === "item"
      ? "item"
      : id === "share" && selected === "label"
        ? "label"
        : null;

  const items: ToolbarItem[] = useMemo(
    () => [
      {
        id: "sidebar",
        label: "Sidebar",
        icon: "◧",
        priority: 90,
        widths: { "icon-text": 54, icon: 42, text: 62 },
        onAction: () => setSideOpen((v) => !v),
        render: (m) => (
          <TButton
            icon="◧"
            label="Sidebar"
            mode={m}
            pressed={sideOpen}
            onClick={() => setSideOpen((v) => !v)}
          />
        ),
      },
      {
        id: "new",
        label: "New",
        icon: "＋",
        priority: 30,
        widths: { "icon-text": 54, icon: 42, text: 48 },
        onAction: () => flash("New note created"),
        render: (m) => (
          <TButton icon="＋" label="New" mode={m} onClick={() => flash("New note created")} />
        ),
      },
      {
        id: "div",
        label: "",
        icon: "",
        priority: 55,
        widths: { "icon-text": 14, icon: 14, text: 14 },
        render: () => <TDivider />,
      },
      {
        id: "bold",
        label: "Bold",
        icon: <span className="font-serif font-bold">B</span>,
        priority: 70,
        widths: { "icon-text": 54, icon: 42, text: 48 },
        onAction: () => hasSelection && setBold((v) => !v),
        render: (m) => (
          <TButton
            icon={<span className="font-serif font-bold">B</span>}
            label="Bold"
            mode={m}
            pressed={bold}
            disabled={!hasSelection}
            onClick={() => setBold((v) => !v)}
          />
        ),
      },
      {
        id: "italic",
        label: "Italic",
        icon: <span className="font-serif italic">I</span>,
        priority: 60,
        widths: { "icon-text": 54, icon: 42, text: 48 },
        onAction: () => hasSelection && setItalic((v) => !v),
        render: (m) => (
          <TButton
            icon={<span className="font-serif italic">I</span>}
            label="Italic"
            mode={m}
            pressed={italic}
            disabled={!hasSelection}
            onClick={() => setItalic((v) => !v)}
          />
        ),
      },
      {
        id: "share",
        label: "Share",
        icon: "⤴",
        priority: 80,
        widths: { "icon-text": 54, icon: 42, text: 56 },
        onAction: () => flash("Link copied to clipboard"),
        render: (m) => (
          <TButton
            icon="⤴"
            label="Share"
            mode={m}
            mark={markFor("share")}
            onClick={() => flash("Link copied to clipboard")}
          />
        ),
      },
      {
        id: "flex",
        label: "",
        icon: "",
        priority: 1000,
        flexible: true,
        widths: { "icon-text": 0, icon: 0, text: 0 },
        render: () => null,
      },
      {
        id: "search",
        label: "Search",
        icon: "⌕",
        priority: 100,
        control: true,
        widths: { "icon-text": 136, icon: 136, text: 136 },
        render: () => <TSearch value={search} onChange={setSearch} placeholder="Search notes" />,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, search, bold, italic, sideOpen, hasSelection, selected],
  );

  const { visible, hidden } = splitItems(items, mode, winWidth);

  /* badge geometry chases the live layout */
  let shareX = 70;
  {
    let x = 12 + 52; // padding + traffic lights
    for (const it of visible) {
      if (it.flexible) break;
      if (it.id === "share") {
        shareX = x;
        break;
      }
      x += it.widths[mode] + 4;
    }
  }
  const shareVisible = visible.some((it) => it.id === "share");
  const showLabelBadge = shareVisible && mode === "icon-text";

  const overlay = (
    <>
      <Badge
        n={1}
        label="Unified title"
        style={{ left: "50%", marginLeft: 84, top: 6 }}
        selected={selected === "title"}
        onSelect={() => setSelected("title")}
      />
      {shareVisible && (
        <Badge
          n={2}
          label="Toolbar item"
          style={{ left: shareX + 40, top: 4 }}
          selected={selected === "item"}
          onSelect={() => setSelected("item")}
        />
      )}
      {showLabelBadge && (
        <Badge
          n={3}
          label="Toolbar item label"
          style={{ left: shareX + 40, top: 32 }}
          selected={selected === "label"}
          onSelect={() => setSelected("label")}
        />
      )}
      {hidden.length > 0 && (
        <Badge
          n={4}
          label="Overflow chevron"
          style={{ right: 8, top: 4 }}
          selected={selected === "overflow"}
          onSelect={() => setSelected("overflow")}
        />
      )}
      <Badge
        n={5}
        label="Title-bar separator"
        style={{ right: 44, top: 51 }}
        selected={selected === "separator"}
        onSelect={() => setSelected("separator")}
      />
    </>
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-12">
        <PageHeader
          eyebrow="macOS · NSToolbar / NSWindow.ToolbarStyle.unified — web approximation"
          title="Toolbar (Unified Title Bar)"
          alsoCalled="window toolbar · unified toolbar · title bar toolbar"
          lede={
            <p>
              The row of primary actions across the top of a Mac window — sharing one
              slim row with the window title in the unified style. Real toolbars are
              laid out by macOS itself (AppKit&apos;s{" "}
              <code className="rounded bg-stone-100 px-1 font-mono text-[13px]">NSToolbar</code>,
              or SwiftUI&apos;s{" "}
              <code className="rounded bg-stone-100 px-1 font-mono text-[13px]">
                View.toolbar(content:)
              </code>
              ). This page rebuilds one out of web parts so you can shrink it, overflow
              it, and take it apart — every numbered pill maps to a real API symbol.
            </p>
          }
        />
        <ApiChips
          items={[
            "NSToolbar",
            "NSToolbarItem",
            "NSToolbarItem.label",
            "NSToolbarItem.visibilityPriority",
            "NSWindow.ToolbarStyle.unified",
            "NSWindow.titlebarSeparatorStyle",
            "View.toolbar(content:)",
          ]}
        />

        {/* what-am-I-looking-at strip */}
        <section className="grid gap-3 sm:grid-cols-3">
          {[
            {
              t: "Items",
              d: "Buttons, fields, dividers, and flexible space — each one an NSToolbarItem with even system spacing.",
              s: "parts 2 · 3",
            },
            {
              t: "Unified row",
              d: "Traffic lights, items, and the document title share a single row — no second strip.",
              s: "part 1 · ToolbarStyle.unified",
            },
            {
              t: "Overflow + separator",
              d: "The » chevron parks items that no longer fit; the separator draws the line above your content.",
              s: "parts 4 · 5",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-stone-200 bg-white p-4">
              <p className="text-sm font-semibold text-stone-900">{c.t}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-stone-600">{c.d}</p>
              <p className="mt-2 font-mono text-[11px] text-stone-400">{c.s}</p>
            </div>
          ))}
        </section>

        {/* ── live anatomy diagram ── */}
        <section id="diagram" className="flex scroll-mt-6 flex-col gap-4">
          <div>
            <Eyebrow>Live anatomy</Eyebrow>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              One toolbar, five named parts
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
              Click the title to rename it. Drag the width slider to force the overflow
              chevron. Scroll the document to test the automatic separator. Click any
              numbered pill to inspect that part.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-500">Display</span>
              <Seg options={MODES} value={mode} onChange={setMode} ariaLabel="Display mode" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-500">Separator</span>
              <Seg options={SEPS} value={sep} onChange={setSep} ariaLabel="Separator style" />
            </div>
            <label className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600">
              Width
              <input
                type="range"
                min={460}
                max={760}
                step={10}
                value={winWidth}
                onChange={(e) => setWinWidth(Number(e.target.value))}
                aria-label="Window width"
                className="w-32 accent-[#0071e3]"
              />
              <span className="w-12 font-mono text-[11px] text-stone-500">{winWidth}px</span>
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={hasSelection}
              onClick={() => setHasSelection((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-left transition-colors hover:border-stone-300"
            >
              <span
                aria-hidden
                className={`relative h-[20px] w-8 shrink-0 rounded-full transition-colors ${hasSelection ? "bg-[#0071e3]" : "bg-stone-300"}`}
              >
                <span
                  className={`absolute top-[3px] size-3.5 rounded-full bg-white shadow transition-all ${hasSelection ? "left-[15px]" : "left-[3px]"}`}
                />
              </span>
              <span className="text-xs font-medium text-stone-600">text selected</span>
            </button>
          </div>

          <div className="desktop-dots relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-2xl border border-stone-300/70 p-6 sm:p-10">
            <UnifiedToolbar
              title={title}
              proxyIcon="📝"
              editableTitle
              onTitleChange={setTitle}
              items={items}
              displayMode={mode}
              separator={sep}
              width={winWidth}
              highlight={selected}
              overlay={overlay}
              statusBar={
                <>
                  <span>
                    {hidden.length > 0
                      ? `${hidden.length} item${hidden.length > 1 ? "s" : ""} parked in » (${hidden.map((h) => h.label || h.id).join(", ")})`
                      : "Every item fits — narrow the window to summon the » chevron"}
                  </span>
                  <span className="flex-1" />
                  <span className="font-mono">{mode}</span>
                </>
              }
            >
              <div className="px-7 py-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  {title} · edited just now
                </p>
                <p
                  className={`mt-2 max-w-md leading-relaxed text-stone-800 ${bold ? "font-semibold" : ""} ${italic ? "italic" : ""}`}
                >
                  {hasSelection
                    ? "This paragraph is “selected”, so Bold and Italic above are enabled — validation in action. Flip the “text selected” switch off and they grey out, exactly like a native toolbar."
                    : "Nothing is selected, so Bold and Italic above are disabled. Native toolbar items validate themselves: the action stays visible but refuses the click until it makes sense again."}
                </p>
                {search && (
                  <p className="mt-3 inline-block rounded-md bg-[#e8f1fd] px-2.5 py-1 text-[13px] text-stone-700">
                    Filtering for “<span className="font-medium">{search}</span>” — the search
                    field is a toolbar item too.
                  </p>
                )}
                <div className="mt-4 flex max-w-md flex-col gap-2">
                  {[
                    ["Tue 09:12", "Trailhead sketch — keep the unified row to one line on small windows."],
                    ["Tue 11:47", "Priority order decided: New overflows first (30), Search never does (100)."],
                    ["Wed 08:03", "Separator review: automatic feels calmer than a permanent line."],
                    ["Wed 14:29", "Rename-by-clicking-the-title tested well in hallway usability."],
                    ["Thu 10:15", "Overflow menu needs the same actions, not a second-class copy."],
                  ].map(([when, what]) => (
                    <div
                      key={when}
                      className="flex gap-3 rounded-lg border border-stone-100 bg-stone-50/60 px-3 py-2.5"
                    >
                      <span className="shrink-0 font-mono text-[11px] text-stone-400">{when}</span>
                      <p className="text-sm leading-relaxed text-stone-700">{what}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 max-w-md text-[13px] leading-relaxed text-stone-500">
                  Keep scrolling — with the separator set to Automatic, the hairline above
                  only draws itself once this content moves.
                </p>
              </div>
            </UnifiedToolbar>

            {toast && (
              <div className="absolute bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-4 py-2 text-xs font-medium text-white shadow-lg">
                {toast}
              </div>
            )}
          </div>

          {mode !== "icon-text" && (selected === "label") && (
            <div className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800">
              Labels are hidden in {mode} mode — switch Display back to icon-text to see part ③.
            </div>
          )}
          {!shareVisible && (selected === "item" || selected === "label") && (
            <div className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800">
              Share has overflowed into the » menu — widen the window to see it back in the row.
            </div>
          )}

          {/* inspector */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-[#0071e3] text-sm font-bold text-white">
                {PARTS.indexOf(part) + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-stone-900">{part.name}</h3>
                <code className="font-mono text-xs text-stone-500">{part.symbol}</code>
              </div>
              <div className="ml-auto flex gap-1.5">
                {PARTS.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelected(p.id)}
                    aria-label={`Inspect ${p.name}`}
                    className={`grid size-7 place-items-center rounded-full text-xs font-bold transition-colors ${
                      p.id === selected ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
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
                <p className="mt-1.5 text-sm leading-relaxed text-stone-700">{part.see}</p>
              </div>
              <div className="rounded-xl bg-[#e8f1fd]/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0071e3]">
                  How it works
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-700">{part.how}</p>
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
          <div className="grid gap-3 md:grid-cols-2">
            {PARTS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelected(p.id);
                  document.getElementById("diagram")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`rounded-xl border p-5 text-left transition-all ${
                  selected === p.id
                    ? "border-[#0071e3]/50 bg-[#e8f1fd]/40 shadow-sm"
                    : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`grid size-6 place-items-center rounded-full text-xs font-bold text-white ${selected === p.id ? "bg-stone-900" : "bg-[#0071e3]"}`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[15px] font-semibold text-stone-900">{p.name}</span>
                </div>
                <code className="mt-1.5 block font-mono text-[11px] text-stone-500">{p.symbol}</code>
                <p className="mt-2.5 text-[13px] leading-relaxed text-stone-600">
                  <span className="font-semibold text-stone-700">What you see — </span>
                  {p.see}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                  <span className="font-semibold text-stone-700">How it works — </span>
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
              <p className="text-sm font-semibold text-stone-900">Toolbar item ≠ title-bar accessory</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                Items are rented shelves: the system spaces them, validates them, and can sweep
                them into the » menu. An accessory is a poster taped to the window — custom,
                fixed, and immune to overflow. If it must never move, it isn&apos;t an item.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">Label ≠ palette label</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                The label is the short caption under the icon in the toolbar. The customization
                palette may show a longer, friendlier palette label for the same item — two names
                for one action, one terse, one explanatory.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">Separator ≠ content divider</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                The title-bar separator belongs to the window chrome and is styled with
                titlebarSeparatorStyle. A divider inside your content is yours to draw. Only the
                first one can be automatic, line, shadow, or none with a single setting.
              </p>
            </div>
          </div>
        </section>

        {/* ── scenarios ── */}
        <section className="flex flex-col gap-4">
          <div>
            <Eyebrow>Where it belongs</Eyebrow>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              Three toolbars, three jobs
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
              Same NSToolbar machinery, different configuration. Each scenario exercises
              something the others don&apos;t.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                href: "/scenarios/document-editor",
                t: "Document editor",
                d: "A Pages-style writing window: inline editable title, a format group with validation, and a share action.",
                c: ["editable title", "validation", "line separator"],
              },
              {
                href: "/scenarios/mail-inbox",
                t: "Mail inbox",
                d: "A Mail-style window with seven items in icon-and-text mode — narrow it and the » chevron earns its keep.",
                c: ["overflow menu", "priorities", "search item"],
              },
              {
                href: "/scenarios/photo-browser",
                t: "Photo browser",
                d: "A Photos-style window with a Customize palette, display-mode switching, and all four separator styles.",
                c: ["customization", "4 separators", "segment group"],
              },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#0071e3]/40 hover:shadow-md"
              >
                <p className="text-[15px] font-semibold text-stone-900 group-hover:text-[#0071e3]">
                  {s.t}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">{s.d}</p>
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
                <p className="mt-3 text-sm font-medium text-[#0071e3]">
                  Open scenario <span aria-hidden>→</span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="border-t border-stone-200 pt-6 text-[13px] leading-relaxed text-stone-500">
          <p>
            Web approximation for learning — real{" "}
            <code className="font-mono text-xs">NSToolbar</code> layout, validation, and
            customization are performed by macOS, with vibrancy, drag-to-reorder, and the
            system customization palette this demo only sketches.
          </p>
        </footer>
      </div>
    </main>
  );
}
