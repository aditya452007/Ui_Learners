"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import MacWindow, {
  SideItem,
  SideLabel,
  ToolbarButton,
  ToolbarSegment,
  ToolbarSpacer,
  type MacWindowTab,
} from "@/components/MacWindow";
import { ApiChips, Eyebrow, PageHeader } from "@/components/chrome";

/* ── the nine named parts ── */

type Part = {
  id: string;
  name: string;
  symbol: string;
  fragment: string;
  see: string;
  how: string;
};

const PARTS: Part[] = [
  {
    id: "titlebar",
    name: "Title bar",
    symbol: "NSWindow.titleVisibility",
    fragment: "the top chrome containing the title, traffic lights, and optional unified toolbar",
    see: "The strip across the top of the window — like the header on a letter. It tells you which app and document you're looking at, and it carries the traffic lights and toolbar so every window brings its own controls.",
    how: "This chrome belongs to the window itself (NSWindow), not to your content. Props are the settings you hand a component when you use it: the titleVisibility setting keeps the bar while hiding its text. Flip “Title text” off below — state is the component's memory of that switch, and React re-renders, meaning it redraws the screen, with the text gone but the bar still standing.",
  },
  {
    id: "drag",
    name: "Window drag region",
    symbol: "NSWindow.isMovableByWindowBackground",
    fragment: "an unobstructed title-bar area that moves the NSWindow when dragged",
    see: "Any empty stretch of the top chrome is a handle: grab it and the whole window follows your cursor. You never need to aim at the title text — the blank space beside it grips just as well.",
    how: "A mouse press on the background starts a move; as the pointer travels, the window's position values update and React redraws it at the new spot — like sliding a sheet of paper. The real setting, isMovableByWindowBackground, can even make filled areas draggable. Try dragging the hub window from a gap between two buttons.",
  },
  {
    id: "title",
    name: "Window title",
    symbol: "NSWindow.title",
    fragment: "the document or screen name positioned in the title-bar chrome",
    see: "The document's name, centered at the top. It answers “what am I looking at?” at a glance — and in this demo, clicking it lets you rename the document right where it sits, no dialog needed.",
    how: "The title is a short text value (a string) handed to the window and drawn centered. This window passes editableTitle, so clicking swaps the text for an input box: the click event flips a state flag, and pressing Enter reports the new name upward through the onTitleChange callback — a function the parent hands down so the child can send news back up.",
  },
  {
    id: "unified",
    name: "Unified toolbar",
    symbol: "NSWindow.ToolbarStyle.unified",
    fragment: "sharing the title bar's single row instead of sitting in a separate strip",
    see: "Title and action buttons share one slim row — the macOS look most people picture. One calm strip instead of two stacked ones, so the document starts higher up the screen.",
    how: "One horizontal flexbox row — a layout mode that lines children up side by side — holds traffic lights, title, and buttons together. Flip the style switch to Expanded and the same items render in a second row instead: one setting, two layouts, like choosing between one shelf and two.",
  },
  {
    id: "toolbar-item",
    name: "Toolbar item",
    symbol: "NSToolbarItem",
    fragment: "placed with macOS toolbar spacing, validation, and overflow behavior",
    see: "Each button in the toolbar is one item — and so are the invisible gaps. The wide gap before Share is a flexible-space item shoving everything after it to the right edge.",
    how: "Every item is a tiny component receiving an icon, a label, and what-to-do-when-clicked (its onClick callback). Validation just means an item can be disabled — greyed out while its action makes no sense. Gaps are empty divs with a flex-1 style that says “swallow all leftover space”. Bold and Italic above are pressed right now; click them.",
  },
  {
    id: "accessory",
    name: "Title-bar accessory",
    symbol: "NSTitlebarAccessoryViewController",
    fragment: "a custom control strip attached to an edge of the NSWindow title bar, separate from NSToolbar",
    see: "The thin extra strip under the toolbar — here, zoom controls for the page. It looks built-in, but it's custom: the app's own mini-panel pinned to the title bar's edge.",
    how: "An accessory is a separate slot from the toolbar, drawn in its own bordered strip — which is why it survives toolbar customization and overflow menus. Think of toolbar items as rented shelves the system may rearrange, and the accessory as a poster taped to the window: yours, exactly where you put it. Toggle it off and the window simply skips that strip.",
  },
  {
    id: "separator",
    name: "Title-bar separator",
    symbol: "NSWindow.titlebarSeparatorStyle",
    fragment: "the native hairline between the title-bar or toolbar chrome and window content",
    see: "The faint hairline where chrome ends and your document begins. You barely notice it — that's the job: a quiet boundary so the toolbar never visually melts into the text.",
    how: "It's a one-pixel div — or nothing at all. The style setting picks line, shadow, or none. Media apps often choose none so photos bleed edge-to-edge beneath the chrome (see the viewer scenario). Toggle it and watch the boundary appear and vanish.",
  },
  {
    id: "tabs",
    name: "Window tabs",
    symbol: "NSWindowTabGroup",
    fragment: "a tab strip in the window frame that groups separate NSWindow documents, not an in-content NSTabView",
    see: "Tabs in the frame itself, grouping whole documents — three reports riding in one window. Press + for a fresh document tab; closing a tab closes that document.",
    how: "The window keeps a list of tabs and remembers which one is active (state again). Clicking a tab swaps everything below — document and all. Don't confuse these with a tab view inside your content, which only swaps panels within one document: frame tabs group windows, content tabs group panels.",
  },
  {
    id: "resize",
    name: "Resize edge / corner",
    symbol: "NSWindow.StyleMask.resizable",
    fragment: "the draggable window-frame boundary, including the bottom-right size-grip area",
    see: "The window's edges — plus the little grip etched in the bottom-right corner — are handles. Grab the corner and pull: the surface stretches. Hit the minimum and it simply stops.",
    how: "Slim strips along the right and bottom edges wear resize cursors, and the corner shows the classic grip. Dragging updates the window's width and height values, clamped — limited — between a minimum and maximum. The resizable style-mask flag is the master switch: turn it off and the handles vanish. Try the corner now; it stops at 380 × 280.",
  },
];

/* ── small building blocks ── */

function Switch({
  label,
  symbol,
  checked,
  onChange,
}: {
  label: string;
  symbol: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-left transition-colors hover:border-stone-300"
    >
      <span
        aria-hidden
        className={`relative h-[22px] w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-[#0071e3]" : "bg-stone-300"}`}
      >
        <span
          className={`absolute top-[3px] size-4 rounded-full bg-white shadow transition-all ${checked ? "left-[18px]" : "left-[3px]"}`}
        />
      </span>
      <span>
        <span className="block text-[13px] font-medium leading-tight text-stone-800">{label}</span>
        <span className="block font-mono text-[10px] leading-tight text-stone-400">{symbol}</span>
      </span>
    </button>
  );
}

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
      data-nodrag
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

/* ── hub page ── */

const HUB_TABS: MacWindowTab[] = [
  { id: "report", title: "Quarterly Report" },
  { id: "notes", title: "Meeting Notes" },
  { id: "outline", title: "Outline" },
];

export default function Home() {
  const [titleVisible, setTitleVisible] = useState(true);
  const [unified, setUnified] = useState(true);
  const [accessoryOn, setAccessoryOn] = useState(true);
  const [separatorOn, setSeparatorOn] = useState(true);
  const [tabsOn, setTabsOn] = useState(true);
  const [resizableOn, setResizableOn] = useState(true);
  const [winActive, setWinActive] = useState(true);
  const [selected, setSelected] = useState("titlebar");
  const [docTitle, setDocTitle] = useState("Quarterly Report");
  const [activeTab, setActiveTab] = useState("report");
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [sideOpen, setSideOpen] = useState(true);
  const [checks, setChecks] = useState<string[]>(["revenue"]);
  const [toast, setToast] = useState<string | null>(null);

  const part = PARTS.find((p) => p.id === selected) ?? PARTS[0];
  const partVisible =
    (selected !== "accessory" || accessoryOn) &&
    (selected !== "tabs" || tabsOn) &&
    (selected !== "separator" || separatorOn) &&
    (selected !== "resize" || resizableOn);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  }

  function toggleCheck(id: string) {
    setChecks((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  }

  /* badge geometry follows the current chrome configuration */
  const rowH = unified ? 48 : 88;
  const accH = accessoryOn ? 37 : 0;
  const tabsH = tabsOn ? 36 : 0;
  const itemTop = unified ? 14 : 56;

  const leading = (
    <ToolbarButton icon="◧" label="Sidebar" pressed={sideOpen} onClick={() => setSideOpen((v) => !v)} />
  );
  const trailing = (
    <div className="flex items-center gap-1">
      <ToolbarButton icon={<span className="font-serif font-bold">B</span>} label="Bold" pressed={bold} onClick={() => setBold((v) => !v)} />
      <ToolbarButton icon={<span className="font-serif italic">I</span>} label="Italic" pressed={italic} onClick={() => setItalic((v) => !v)} />
      <ToolbarButton icon="⤴" label="Share" onClick={() => flash("Link copied to clipboard")} />
    </div>
  );

  const overlay = (
    <>
      <Badge n={1} label="Title bar" style={{ left: 64, top: 14 }} selected={selected === "titlebar"} onSelect={() => setSelected("titlebar")} />
      <Badge n={2} label="Window drag region" style={{ left: "30%", top: 14 }} selected={selected === "drag"} onSelect={() => setSelected("drag")} />
      <Badge n={3} label="Window title" style={{ left: "50%", marginLeft: titleVisible ? 92 : 60, top: 14 }} selected={selected === "title"} onSelect={() => setSelected("title")} />
      <Badge n={4} label="Unified toolbar" style={{ right: unified ? 132 : 168, top: itemTop }} selected={selected === "unified"} onSelect={() => setSelected("unified")} />
      <Badge n={5} label="Toolbar item" style={{ right: unified ? 56 : 62, top: itemTop }} selected={selected === "toolbar-item"} onSelect={() => setSelected("toolbar-item")} />
      {accessoryOn && (
        <Badge n={6} label="Title-bar accessory" style={{ left: 152, top: rowH + 8 }} selected={selected === "accessory"} onSelect={() => setSelected("accessory")} />
      )}
      {tabsOn && (
        <Badge n={8} label="Window tabs" style={{ left: 66, top: rowH + accH + 8 }} selected={selected === "tabs"} onSelect={() => setSelected("tabs")} />
      )}
      {separatorOn && (
        <Badge n={7} label="Title-bar separator" style={{ right: 62, top: rowH + accH + tabsH - 11 }} selected={selected === "separator"} onSelect={() => setSelected("separator")} />
      )}
      {resizableOn && (
        <Badge n={9} label="Resize edge / corner" style={{ right: 30, bottom: 30 }} selected={selected === "resize"} onSelect={() => setSelected("resize")} />
      )}
    </>
  );

  const sidebar = sideOpen ? (
    <>
      <SideLabel>Sections</SideLabel>
      <SideItem icon="◫" label="Summary" selected={activeTab === "report"} onClick={() => setActiveTab("report")} />
      <SideItem icon="✎" label="Notes" selected={activeTab === "notes"} onClick={() => setActiveTab("notes")} />
      <SideItem icon="☰" label="Outline" selected={activeTab === "outline"} onClick={() => setActiveTab("outline")} />
      <SideLabel>Tags</SideLabel>
      <SideItem icon="●" label="Finance" />
      <SideItem icon="●" label="Q3" />
    </>
  ) : undefined;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-12">
        <PageHeader
          eyebrow="macOS · NSWindow / WindowGroup — web approximation"
          title="Mac Window"
          alsoCalled="app window · document window · NSWindow · window frame"
          lede={
            <>
              <p>
                The movable, usually resizable frame that holds one app surface — the whole box
                a Mac app lives in. Real Mac windows are drawn by macOS itself (AppKit's{" "}
                <code className="rounded bg-stone-100 px-1 font-mono text-[13px]">NSWindow</code>,
                or SwiftUI's <code className="rounded bg-stone-100 px-1 font-mono text-[13px]">WindowGroup</code>).
                This page rebuilds one out of web parts so you can grab it, stretch it, and take
                its chrome apart — every numbered pill below maps to a real API symbol.
              </p>
            </>
          }
        />
        <ApiChips
          items={[
            "NSWindow",
            "WindowGroup",
            "Window",
            "NSWindowController",
            "NSWindow.title",
            "NSWindow.ToolbarStyle.unified",
            "NSToolbarItem",
            "NSTitlebarAccessoryViewController",
            "NSWindowTabGroup",
            "NSWindow.StyleMask.resizable",
          ]}
        />

        {/* what-am-I-looking-at strip */}
        <section className="grid gap-3 sm:grid-cols-3">
          {[
            { t: "Frame", d: "Traffic lights, drag region, resize edges — the parts the system owns. They work the same in every app.", s: "parts 2 · 9" },
            { t: "Chrome", d: "Title, toolbar, accessory, tabs, separator — the configurable top strip this page dissects.", s: "parts 1 · 3 – 8" },
            { t: "Content", d: "Your app's surface underneath it all. The window moves, groups, and sizes it — never the reverse.", s: "sidebar · status bar" },
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
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <Eyebrow>Live anatomy</Eyebrow>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
                One window, nine named parts
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
                Drag it by the empty chrome. Stretch the corner. Double-click the title bar to
                zoom. Hover the traffic lights. Click any numbered pill to inspect that part.
              </p>
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            <Switch label="Title text" symbol="titleVisibility" checked={titleVisible} onChange={setTitleVisible} />
            <Switch label="Unified toolbar" symbol="ToolbarStyle.unified" checked={unified} onChange={setUnified} />
            <Switch label="Title-bar accessory" symbol="NSTitlebarAccessory…" checked={accessoryOn} onChange={setAccessoryOn} />
            <Switch label="Separator line" symbol="titlebarSeparatorStyle" checked={separatorOn} onChange={setSeparatorOn} />
            <Switch label="Window tabs" symbol="NSWindowTabGroup" checked={tabsOn} onChange={setTabsOn} />
            <Switch label="Resizable" symbol="StyleMask.resizable" checked={resizableOn} onChange={setResizableOn} />
            <Switch label="Key (active) window" symbol="isKeyWindow" checked={winActive} onChange={setWinActive} />
            <div className="flex items-center rounded-lg border border-dashed border-stone-300 px-3 py-2 text-[12px] leading-snug text-stone-500">
              Click the title to rename it — that&apos;s <span className="font-mono text-[11px]">&nbsp;NSWindow.title&nbsp;</span> being edited.
            </div>
          </div>

          <div className="desktop-dots relative flex min-h-[600px] items-center justify-center overflow-hidden rounded-2xl border border-stone-300/70 p-6 sm:p-10">
            <MacWindow
              title={docTitle}
              proxyIcon="◫"
              titleVisible={titleVisible}
              editableTitle
              onTitleChange={setDocTitle}
              toolbarStyle={unified ? "unified" : "expanded"}
              toolbarLeading={unified ? leading : undefined}
              toolbarTrailing={unified ? trailing : undefined}
              toolbarRow={
                <>
                  {leading}
                  <ToolbarSegment options={["edit", "review"] as const} value="edit" onChange={() => {}} labels={{ edit: "Edit", review: "Review" }} />
                  <ToolbarSpacer />
                  {trailing}
                </>
              }
              accessory={
                accessoryOn ? (
                  <div data-nodrag className="flex w-full items-center gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-stone-400">Accessory</span>
                    <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(80, z - 10))} className="grid size-6 place-items-center rounded-md text-sm text-stone-600 hover:bg-black/[0.06]">−</button>
                    <span className="w-11 text-center font-mono text-[11px] text-stone-600">{zoom}%</span>
                    <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(140, z + 10))} className="grid size-6 place-items-center rounded-md text-sm text-stone-600 hover:bg-black/[0.06]">+</button>
                    <div className="flex-1" />
                    <span className="text-[11px] text-stone-500">Page 1 of 4</span>
                  </div>
                ) : undefined
              }
              showSeparator={separatorOn}
              tabs={tabsOn ? HUB_TABS : []}
              activeTabId={activeTab}
              onTabChange={setActiveTab}
              resizable={resizableOn}
              active={winActive}
              onActivate={() => setWinActive(true)}
              initialWidth={620}
              initialHeight={430}
              minWidth={380}
              minHeight={280}
              sidebar={sidebar}
              statusBar={<><span>3 sections · 248 words</span><span className="flex-1" /><span>Saved 09:41</span></>}
              overlay={overlay}
              highlight={partVisible ? selected : null}
            >
              <DocBody tab={activeTab} zoom={zoom} bold={bold} italic={italic} checks={checks} onToggle={toggleCheck} />
            </MacWindow>

            {toast && (
              <div className="absolute bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-4 py-2 text-xs font-medium text-white shadow-lg">
                {toast}
              </div>
            )}
            {!partVisible && (
              <div className="absolute bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800 shadow">
                That part is toggled off — switch it back on to see it in the diagram.
              </div>
            )}
          </div>

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
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">What you see</p>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-700">{part.see}</p>
              </div>
              <div className="rounded-xl bg-[#e8f1fd]/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0071e3]">How it works</p>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-700">{part.how}</p>
              </div>
            </div>
            <p className="mt-3 rounded-lg bg-stone-900 px-3 py-2 font-mono text-[11px] leading-relaxed text-stone-200">
              <span className="text-stone-500">prompt fragment → </span>{part.fragment}
            </p>
          </div>
        </section>

        {/* ── full anatomy index ── */}
        <section className="flex flex-col gap-4">
          <div>
            <Eyebrow>Anatomy index</Eyebrow>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">Every part, in words</h2>
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
                  <span className={`grid size-6 place-items-center rounded-full text-xs font-bold text-white ${selected === p.id ? "bg-stone-900" : "bg-[#0071e3]"}`}>{i + 1}</span>
                  <span className="text-[15px] font-semibold text-stone-900">{p.name}</span>
                </div>
                <code className="mt-1.5 block font-mono text-[11px] text-stone-500">{p.symbol}</code>
                <p className="mt-2.5 text-[13px] leading-relaxed text-stone-600"><span className="font-semibold text-stone-700">What you see — </span>{p.see}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600"><span className="font-semibold text-stone-700">How it works — </span>{p.how}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ── easy to confuse ── */}
        <section className="flex flex-col gap-4">
          <div>
            <Eyebrow>Don&apos;t mix these up</Eyebrow>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">Three classic confusions</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">Drag region ≠ title text</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                The name is ink; the grip is the blank chrome around it. Press anywhere empty in
                the title bar — between buttons, beside the title — and it all moves the same.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">Window tabs ≠ tab views</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                Frame tabs group separate documents — closing one closes a file. An in-content tab
                view only swaps panels inside a single window. The media-viewer scenario shows an
                in-content filmstrip next to frame tabs so you can feel the difference.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">Traffic lights stand alone</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                Red, yellow, and green are standard system controls with fixed meanings — close,
                minimize, zoom — not toolbar items you design. Hover the hub window&apos;s lights
                to preview each one, then try them for real.
              </p>
            </div>
          </div>
        </section>

        {/* ── scenarios ── */}
        <section className="flex flex-col gap-4">
          <div>
            <Eyebrow>Where it belongs</Eyebrow>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">Three windows, three jobs</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
              Same frame, different chrome. Each scenario reconfigures the window for a real product —
              and each one exercises something the others don&apos;t.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { href: "/scenarios/document-editor", t: "Document editor", d: "A Pages-style writing app: unified toolbar, editable title, and frame tabs grouping three live documents.", c: ["unified", "tabs ×3", "editable title"] },
              { href: "/scenarios/media-viewer", t: "Media viewer", d: "A Preview-style photo window: hidden title text, no separator, and an accessory strip for zoom.", c: ["title hidden", "no separator", "accessory"] },
              { href: "/scenarios/project-browser", t: "Project browser", d: "A Finder-style browser with an expanded toolbar, resize limits, and a second inspector window.", c: ["expanded", "2 windows", "min size"] },
            ].map((s) => (
              <Link key={s.href} href={s.href} className="group rounded-xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#0071e3]/40 hover:shadow-md">
                <p className="text-[15px] font-semibold text-stone-900 group-hover:text-[#0071e3]">{s.t}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">{s.d}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.c.map((x) => (
                    <span key={x} className="rounded-full bg-stone-100 px-2.5 py-0.5 font-mono text-[11px] text-stone-600">{x}</span>
                  ))}
                </div>
                <p className="mt-3 text-sm font-medium text-[#0071e3]">Open scenario <span aria-hidden>→</span></p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="border-t border-stone-200 pt-6 text-[13px] leading-relaxed text-stone-500">
          <p>
            Web approximation for learning — real <code className="font-mono text-xs">NSWindow</code> chrome
            is drawn by macOS, with vibrancy, full-screen behavior, and window management this demo
            doesn&apos;t attempt. Traffic lights here close, minimize, and zoom the demo window only.
          </p>
        </footer>
      </div>
    </main>
  );
}

/* hub window document content */
function DocBody({
  tab,
  zoom,
  bold,
  italic,
  checks,
  onToggle,
}: {
  tab: string;
  zoom: number;
  bold: boolean;
  italic: boolean;
  checks: string[];
  onToggle: (id: string) => void;
}) {
  const items = [
    { id: "revenue", label: "Revenue grew 12% quarter over quarter" },
    { id: "churn", label: "Churn stayed under 2% for the third month" },
    { id: "hiring", label: "Support hiring plan approved for Q4" },
  ];
  return (
    <div className="px-8 py-6" style={{ fontSize: `${(zoom / 100) * 14}px` }}>
      {tab === "report" && (
        <div className="flex max-w-md flex-col gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">Summary</p>
          <p className={`leading-relaxed text-stone-800 ${bold ? "font-semibold" : ""} ${italic ? "italic" : ""}`}>
            Q3 beat the plan on every headline number. The toolbar&apos;s Bold and Italic buttons
            above are live toolbar items — they re-style this very paragraph.
          </p>
          <div className="flex flex-col gap-1.5 pt-1">
            {items.map((it) => (
              <label key={it.id} className="flex cursor-pointer items-start gap-2.5 rounded-lg px-1 py-1 text-stone-700 hover:bg-stone-50">
                <input
                  type="checkbox"
                  checked={checks.includes(it.id)}
                  onChange={() => onToggle(it.id)}
                  className="mt-1 size-3.5 accent-[#0071e3]"
                />
                <span className={checks.includes(it.id) ? "text-stone-400 line-through" : ""}>{it.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {tab === "notes" && (
        <div className="flex max-w-md flex-col gap-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">Meeting notes · Tue 09:30</p>
          {(["Decide launch date for the viewer refresh", "Mara to draft the migration guide", "Park the icon debate until icons exist"] as const).map((n, i) => (
            <div key={n} className="flex gap-3 rounded-lg border border-stone-100 bg-stone-50/60 px-3 py-2.5">
              <span className="font-mono text-stone-400">0{i + 1}</span>
              <p className="leading-relaxed text-stone-700">{n}</p>
            </div>
          ))}
        </div>
      )}
      {tab === "outline" && (
        <div className="flex max-w-md flex-col gap-1">
          {(["Context and goals", "What shipped in Q3", "Risks and open questions", "Q4 plan"] as const).map((n, i) => (
            <div key={n} className="flex items-center gap-3 border-b border-stone-100 py-2.5 last:border-0">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-stone-100 text-xs font-bold text-stone-500">{i + 1}</span>
              <p className="leading-relaxed text-stone-700">{n}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
