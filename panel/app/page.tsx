"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import FloatingPanel from "@/components/FloatingPanel";
import { ApiChips, Eyebrow, PageHeader } from "@/components/chrome";

/* ── the six named parts ── */

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
    id: "floating",
    name: "Floating window level",
    symbol: "NSWindow.Level.floating",
    fragment: "an NSPanel at NSWindow.Level.floating, remaining above its related document windows",
    see: "The helper window that refuses to sink. Drag the document-wide demo below — no wait, you can't: the panel is the one that moves, and it always stays on top of the document, even when you click the document. That “always above” is the whole point of a tool palette.",
    how: "Every window sits on a level — think of levels as transparent shelves stacked above the screen. Normal documents live on the bottom shelf; a panel on the floating shelf hovers above them. Flip “Floating level” off below and the panel drops to the document shelf, so the document slides over it. One setting, two shelves.",
  },
  {
    id: "hud",
    name: "HUD chrome",
    symbol: "NSWindow.StyleMask.hudWindow",
    fragment: "the dark translucent NSWindow.StyleMask.hudWindow chrome around an auxiliary NSPanel",
    see: "The dark, see-through frame — like sunglasses for a window. Video editors and music apps use it because a black translucent box disappears against dark footage, keeping your eyes on the work while the controls stay close.",
    how: "Chrome is everything the system draws around your content: border, background, title bar. The hudWindow style-mask — a style-mask is just a set of on/off flags describing a window's look — swaps the light frame for a dark translucent one with a blur effect (vibrancy) behind it. Toggle “HUD chrome” and watch the same panel change costumes; the tools inside never notice.",
  },
  {
    id: "nonactivating",
    name: "Non-activating behavior",
    symbol: "NSWindow.StyleMask.nonactivatingPanel",
    fragment: "the nonactivatingPanel style so showing it does not activate the app or steal focus unnecessarily",
    see: "Click the panel and the document behind it stays lit — its green “key” dot never blinks out. That is the Spotlight trick: a launcher or palette you can use without yanking your place out of the document you were typing in.",
    how: "Normally clicking a window makes it key — key means “this window owns the keyboard now”. The nonactivatingPanel flag tells the system: let clicks through to the buttons, but leave key status where it was. Turn the switch off, click the panel, and watch the document's key dot go dark: the panel stole focus the ordinary way.",
  },
  {
    id: "utility",
    name: "Utility body",
    symbol: "NSPanel",
    fragment: "an auxiliary NSPanel holding tools and controls, never a primary document",
    see: "The working part: a handful of tools, a size slider, nothing else. A panel never holds your document — it holds the things you do to your document. Small on purpose: it should feel like a remote control, not a second TV.",
    how: "NSPanel is a subclass of NSWindow — subclass means “everything a window can do, plus extras”. Its content is plain controls (buttons, sliders, fields) wired to act on the document window, like a remote changing the channel. Click the tools in the demo panel: they select, but the document below is what they would operate on.",
  },
  {
    id: "hide",
    name: "Hide on deactivate",
    symbol: "NSPanel.hidesOnDeactivate",
    fragment: "a panel that hides when its app becomes inactive and returns with it",
    see: "Press “⌘Tab away” and the panel melts away with its app instead of hovering over someone else's windows. Come back and it returns exactly where you left it. Helpers should never photobomb another app.",
    how: "Deactivating means your app is no longer the front app — you ⌘Tabbed to a browser, say. Panels tagged hidesOnDeactivate listen for that moment and order themselves out (orderOut), then order back in on return. Try it: with the switch on, the panel vanishes; with it off, it rudely stays floating over the “other app”.",
  },
  {
    id: "keyonly",
    name: "Key only if needed",
    symbol: "NSPanel.becomesKeyOnlyIfNeeded",
    fragment: "a panel with becomesKeyOnlyIfNeeded, taking keyboard focus only for fields that need it",
    see: "The little search box in the panel. It accepts typing — because a text field genuinely needs the keyboard — while the rest of the panel never begs for focus. Click a tool button and no focus ring steals your typing from the document.",
    how: "Becoming key is a privilege the system usually grants on click. becomesKeyOnlyIfNeeded makes the panel polite: it asks for key status only when the click lands somewhere keyboard-needy, like a text field. Flip the switch off and the search box locks with a “panel refused key” note — click it all you like, no caret appears.",
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

const TOOLS = [
  { id: "select", glyph: "➤", label: "Select" },
  { id: "brush", glyph: "✎", label: "Brush" },
  { id: "shapes", glyph: "◫", label: "Shapes" },
  { id: "type", glyph: "T", label: "Type" },
];

/* ── hub page ── */

export default function Home() {
  const [hud, setHud] = useState(false);
  const [floating, setFloating] = useState(true);
  const [nonactivating, setNonactivating] = useState(true);
  const [hideOnDeactivate, setHideOnDeactivate] = useState(true);
  const [keyOnly, setKeyOnly] = useState(true);
  const [appActive, setAppActive] = useState(true);
  const [docKey, setDocKey] = useState(true);
  const [selected, setSelected] = useState("floating");
  const [tool, setTool] = useState("brush");
  const [size, setSize] = useState(12);
  const [query, setQuery] = useState("");

  const [panelStart] = useState(() =>
    typeof window === "undefined"
      ? { x: 480, y: 64 }
      : { x: window.innerWidth < 700 ? 20 : Math.min(600, Math.round(window.innerWidth * 0.42)), y: 64 },
  );

  const part = PARTS.find((p) => p.id === selected) ?? PARTS[0];
  const docLit = docKey && appActive;
  const panelVisible = appActive || !hideOnDeactivate;

  function touchPanel() {
    if (!appActive) return;
    if (!nonactivating) setDocKey(false);
  }

  function touchDoc() {
    if (!appActive) return;
    setDocKey(true);
  }

  const status = !appActive
    ? "App inactive — you ⌘Tabbed away. The document is dimmed."
    : docLit
      ? nonactivating
        ? "Document is key ● — click the panel: with nonactivatingPanel on, the document stays lit."
        : "Document is key ● — but non-activating is OFF, so clicking the panel will steal key status."
      : "Panel took key ○ — the document went dim. Click the document to hand key status back.";

  const overlay = (
    <>
      <Badge n={1} label="Floating window level" style={{ left: -10, top: -10 }} selected={selected === "floating"} onSelect={() => setSelected("floating")} />
      <Badge n={2} label="HUD chrome" style={{ right: -10, top: 96 }} selected={selected === "hud"} onSelect={() => setSelected("hud")} />
      <Badge n={3} label="Non-activating behavior" style={{ left: 108, top: -10 }} selected={selected === "nonactivating"} onSelect={() => setSelected("nonactivating")} />
      <Badge n={4} label="Utility body" style={{ left: -10, top: 66 }} selected={selected === "utility"} onSelect={() => setSelected("utility")} />
      <Badge n={5} label="Hide on deactivate" style={{ left: -10, bottom: -10 }} selected={selected === "hide"} onSelect={() => setSelected("hide")} />
      <Badge n={6} label="Key only if needed" style={{ right: -10, top: 158 }} selected={selected === "keyonly"} onSelect={() => setSelected("keyonly")} />
    </>
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-12">
        <PageHeader
          eyebrow="macOS · NSPanel — web approximation"
          title="Panel (Floating Window / HUD)"
          alsoCalled="floating panel · utility panel · HUD window · heads-up display"
          lede={
            <>
              <p>
                A panel is an auxiliary window for tools, controls, or transient information —
                never a primary document. It floats above its document, can hide when its app
                goes inactive, and can wear the dark translucent HUD look. Real panels are
                AppKit&apos;s <code className="rounded bg-stone-100 px-1 font-mono text-[13px]">NSPanel</code>;
                this page rebuilds one out of web parts so you can drag it, re-skin it, and
                steal its focus — every numbered pill maps to a real API symbol.
              </p>
            </>
          }
        />
        <ApiChips
          items={[
            "NSPanel",
            "NSWindow.Level.floating",
            "NSWindow.StyleMask.hudWindow",
            "NSWindow.StyleMask.nonactivatingPanel",
            "NSPanel.becomesKeyOnlyIfNeeded",
            "NSPanel.hidesOnDeactivate",
          ]}
        />

        {/* what-am-I-looking-at strip */}
        <section className="grid gap-3 sm:grid-cols-3">
          {[
            { t: "Document window", d: "The main surface — your report, canvas, or timeline. It owns key status; everything else assists it.", s: "the big white window" },
            { t: "Floating panel", d: "The helper that hovers: tools and sliders acting on the document, always one shelf above it.", s: "parts 1 · 4" },
            { t: "Special modes", d: "HUD chrome for dark work, non-activating for launchers, hide-on-deactivate for good manners.", s: "parts 2 · 3 · 5 · 6" },
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
              One panel, six named parts
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
              Drag the panel by its title bar. Click the document, then the panel, and watch the
              key dot. ⌘Tab away with the button. Click any numbered pill to inspect that part.
            </p>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            <Switch label="HUD chrome" symbol="StyleMask.hudWindow" checked={hud} onChange={setHud} />
            <Switch label="Floating level" symbol="Level.floating" checked={floating} onChange={setFloating} />
            <Switch label="Non-activating" symbol="nonactivatingPanel" checked={nonactivating} onChange={setNonactivating} />
            <Switch label="Hide on deactivate" symbol="hidesOnDeactivate" checked={hideOnDeactivate} onChange={setHideOnDeactivate} />
            <Switch label="Key only if needed" symbol="becomesKeyOnlyIfNeeded" checked={keyOnly} onChange={setKeyOnly} />
            <button
              type="button"
              onClick={() => setAppActive((v) => !v)}
              className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors ${
                appActive
                  ? "border-stone-200 bg-white hover:border-stone-300"
                  : "border-amber-300 bg-amber-50 hover:border-amber-400"
              }`}
            >
              <span aria-hidden className="text-lg leading-none">{appActive ? "⌘" : "↩"}</span>
              <span>
                <span className="block text-[13px] font-medium leading-tight text-stone-800">
                  {appActive ? "⌘Tab away (deactivate app)" : "Return to app"}
                </span>
                <span className="block font-mono text-[10px] leading-tight text-stone-400">
                  NSApplication.deactivate
                </span>
              </span>
            </button>
          </div>

          <div className="desktop-dots relative min-h-[560px] overflow-hidden rounded-2xl border border-stone-300/70 p-4 sm:p-8">
            {!appActive && (
              <div className="absolute inset-x-0 top-0 z-50 flex justify-center pt-3">
                <p className="rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-800 shadow">
                  Another app is frontmost — this app&apos;s windows are dimmed
                </p>
              </div>
            )}

            {/* the document window */}
            <div
              onPointerDown={touchDoc}
              className={`absolute left-4 top-14 w-[calc(100%-2rem)] transition-all duration-200 sm:left-8 sm:top-16 sm:w-[56%] ${
                appActive ? "" : "saturate-50"
              }`}
              style={{ zIndex: floating ? 10 : 40 }}
            >
              <div
                className={`overflow-hidden rounded-xl border bg-white transition-all duration-200 ${
                  docLit ? "border-stone-300 shadow-[0_16px_44px_rgba(0,0,0,0.16)]" : "border-stone-200 opacity-80 shadow-md"
                }`}
              >
                <div className="flex items-center gap-2 border-b border-stone-200 bg-stone-50 px-3 py-2">
                  <span className="flex gap-1.5" aria-hidden>
                    <span className="size-3 rounded-full bg-[#ff5f57]" />
                    <span className="size-3 rounded-full bg-[#febc2e]" />
                    <span className="size-3 rounded-full bg-[#28c840]" />
                  </span>
                  <p className="flex-1 text-center text-[12px] font-semibold text-stone-600">Quarterly Report</p>
                  <span
                    className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] ${
                      docLit ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-400"
                    }`}
                    title={docLit ? "This window is key — it owns the keyboard" : "This window is not key"}
                  >
                    <span aria-hidden className={`size-1.5 rounded-full ${docLit ? "bg-emerald-500" : "bg-stone-300"}`} />
                    {docLit ? "key" : "not key"}
                  </span>
                </div>
                <div className="flex flex-col gap-2.5 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">Document · click me to take key status</p>
                  <p className="max-w-md text-sm font-medium leading-relaxed text-stone-800">
                    Q3 beat the plan on every headline number. Select the Brush in the floating
                    panel, then click back here — with non-activating on, this window never lost key.
                  </p>
                  <div className="flex items-end gap-1.5 pt-1" aria-hidden>
                    {[38, 62, 45, 78, 55, 90, 70].map((h, i) => (
                      <div key={i} className="w-8 rounded-t bg-[#0071e3]/70" style={{ height: h }} />
                    ))}
                  </div>
                  <p className="font-mono text-[11px] text-stone-400">3 sections · 248 words · Saved 09:41</p>
                </div>
              </div>
            </div>

            {/* the panel itself */}
            <FloatingPanel
              title="Tools"
              hud={hud}
              initialX={panelStart.x}
              initialY={panelStart.y}
              width={264}
              zIndex={floating ? 40 : 5}
              hidden={!panelVisible}
              onPointerDownPanel={touchPanel}
              overlay={overlay}
            >
              <div className="flex flex-col gap-2.5">
                <div className="grid grid-cols-4 gap-1" role="group" aria-label="Tools">
                  {TOOLS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      data-nodrag
                      onClick={() => setTool(t.id)}
                      title={t.label}
                      aria-label={t.label}
                      aria-pressed={tool === t.id}
                      className={`grid aspect-square place-items-center rounded-lg text-base transition-colors ${
                        tool === t.id
                          ? hud
                            ? "bg-white text-stone-900"
                            : "bg-stone-900 text-white"
                          : hud
                            ? "text-stone-200 hover:bg-white/10"
                            : "text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      <span aria-hidden className={t.id === "type" ? "font-serif font-bold" : ""}>{t.glyph}</span>
                    </button>
                  ))}
                </div>
                <label className={`block text-[11px] font-medium ${hud ? "text-white/60" : "text-stone-500"}`}>
                  <span className="mb-1 flex justify-between">
                    <span>Brush size</span>
                    <span className="font-mono">{size}px</span>
                  </span>
                  <input
                    type="range"
                    data-nodrag
                    min={2}
                    max={32}
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className={`w-full ${hud ? "hud-range" : "light-range"}`}
                  />
                </label>
                <div>
                  <input
                    type="search"
                    data-nodrag
                    value={query}
                    disabled={!keyOnly}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={keyOnly ? "Search tools…" : "panel refused key…"}
                    aria-label="Search tools"
                    className={`w-full rounded-lg px-2.5 py-1.5 text-[13px] outline-none transition-colors ${
                      hud
                        ? "bg-white/10 text-stone-100 placeholder:text-white/35 focus:bg-white/15"
                        : "bg-stone-100 text-stone-800 placeholder:text-stone-400 focus:bg-stone-200/70 disabled:bg-stone-50 disabled:text-stone-300"
                    }`}
                  />
                  {query && keyOnly && (
                    <p className={`mt-1 text-[11px] ${hud ? "text-white/55" : "text-stone-500"}`}>
                      Filtering for “{query}” — the panel went key just for this field.
                    </p>
                  )}
                </div>
              </div>
            </FloatingPanel>

            <div className="absolute inset-x-0 bottom-0 z-50 border-t border-stone-300/60 bg-white/85 px-4 py-2.5 backdrop-blur">
              <p className="text-center text-xs leading-relaxed text-stone-600">
                <span className="font-mono text-[11px] text-stone-400">status → </span>
                {status}
              </p>
            </div>
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
              <p className="text-sm font-semibold text-stone-900">Panel ≠ document window</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                A window holds your work; a panel holds tools that act on your work. If closing
                it would lose a file, it was never a panel — panels are closable, losable, and
                re-openable from a menu without consequence.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">Panel ≠ popover</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                A popover points at the thing it edits and dismisses when you click away. A panel
                persists, floats free, and survives clicks elsewhere — it is furniture, not a speech
                bubble. The launcher scenario shows the transient end of the family.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">HUD ≠ dark mode</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                HUD chrome is a translucent utility material for tool surfaces over dark work —
                footage, canvas, stage. It is not a theme: a HUD panel can float inside a
                light-mode app, and this very page does exactly that when you flip the switch.
              </p>
            </div>
          </div>
        </section>

        {/* ── scenarios ── */}
        <section className="flex flex-col gap-4">
          <div>
            <Eyebrow>Where it belongs</Eyebrow>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">Three panels, three jobs</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
              Same NSPanel, three personalities. Each scenario configures the panel for a real
              product — and each one exercises something the others don&apos;t.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { href: "/scenarios/tools-palette", t: "Tools palette", d: "A PixelForge-style paint app: a light utility panel with live tools over a canvas you can actually draw on.", c: ["utility panel", "floating", "paint me"] },
              { href: "/scenarios/hud-inspector", t: "Color HUD", d: "A video-grading inspector in dark translucent HUD chrome, grading a live preview frame as you drag.", c: ["hudWindow", "sliders", "presets"] },
              { href: "/scenarios/spotlight-launcher", t: "Command launcher", d: "A Spotlight-style ⌘K launcher that opens without activating the app — keyboard-first and transient.", c: ["nonactivating", "⌘K", "transient"] },
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
            Web approximation for learning — real <code className="font-mono text-xs">NSPanel</code> behavior
            (window levels, key/main status, vibrancy, ⌘Tab deactivation) is enforced by macOS across
            real apps; here it is simulated with z-index, focus state, and staged demos inside one page.
          </p>
        </footer>
      </div>
    </main>
  );
}
