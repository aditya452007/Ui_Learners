"use client";

import { useState } from "react";
import UnifiedToolbar, {
  TButton,
  TDivider,
  TSearch,
  TSegment,
  type DisplayMode,
  type SeparatorStyle,
  type ToolbarItem,
} from "@/components/toolbar";
import {
  BackLink,
  ConfigChips,
  PageHeader,
  ScenarioNav,
  WhyFit,
} from "@/components/chrome";

type View = "days" | "all";

const PHOTOS = [
  { id: 1, tint: "#a8a29e", caption: "Canyon overlook", day: "Saturday" },
  { id: 2, tint: "#78716c", caption: "Trailhead, 7am", day: "Saturday" },
  { id: 3, tint: "#b8b2a7", caption: "River bend", day: "Saturday" },
  { id: 4, tint: "#8a9a8b", caption: "Pine ridge", day: "Saturday" },
  { id: 5, tint: "#6b7280", caption: "Old town roofs", day: "Friday" },
  { id: 6, tint: "#9aa3ad", caption: "Harbor fog", day: "Friday" },
  { id: 7, tint: "#7d8a99", caption: "Cliff path", day: "Friday" },
  { id: 8, tint: "#a39e93", caption: "Dune lines", day: "Thursday" },
  { id: 9, tint: "#8b8fa3", caption: "Evening lake", day: "Thursday" },
  { id: 10, tint: "#97897f", caption: "Cabin porch", day: "Thursday" },
  { id: 11, tint: "#7a8b99", caption: "Glacier pass", day: "Thursday" },
  { id: 12, tint: "#8f9b8e", caption: "Meadow", day: "Thursday" },
];

const OPTIONAL = [
  { id: "sidebar", label: "Sidebar", palette: "Library sidebar — browse Years, Places, People" },
  { id: "slideshow", label: "Slideshow", palette: "Play slideshow — full-screen, with music" },
  { id: "viewseg", label: "View switcher", palette: "Days / All toggle — regroup the photo grid" },
  { id: "share", label: "Share", palette: "Share sheet — send, AirDrop, or print" },
  { id: "search", label: "Search field", palette: "Search photos — captions, places, dates" },
] as const;

export default function PhotoBrowser() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    sidebar: true,
    slideshow: true,
    viewseg: true,
    share: true,
    search: true,
  });
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [mode, setMode] = useState<DisplayMode>("icon-text");
  const [sep, setSep] = useState<SeparatorStyle>("automatic");
  const [view, setView] = useState<View>("days");
  const [query, setQuery] = useState("");
  const [favs, setFavs] = useState<number[]>([2, 9]);
  const [toast, setToast] = useState<string | null>(null);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  }

  function toggle(id: string) {
    setEnabled((e) => ({ ...e, [id]: !e[id] }));
  }

  const items: ToolbarItem[] = [
    ...(enabled.sidebar
      ? [
          {
            id: "sidebar",
            label: "Sidebar",
            icon: "◧",
            priority: 90,
            widths: { "icon-text": 54, icon: 42, text: 62 },
            onAction: () => flash("Library sidebar toggled"),
            render: (m: DisplayMode) => (
              <TButton icon="◧" label="Sidebar" mode={m} onClick={() => flash("Library sidebar toggled")} />
            ),
          } satisfies ToolbarItem,
        ]
      : []),
    ...(enabled.slideshow
      ? [
          {
            id: "slideshow",
            label: "Slideshow",
            icon: "▶",
            priority: 45,
            widths: { "icon-text": 66, icon: 42, text: 74 },
            onAction: () => flash("Slideshow playing — press Esc to stop"),
            render: (m: DisplayMode) => (
              <TButton icon="▶" label="Slideshow" mode={m} onClick={() => flash("Slideshow playing — press Esc to stop")} />
            ),
          } satisfies ToolbarItem,
        ]
      : []),
    ...(enabled.viewseg
      ? [
          {
            id: "viewseg",
            label: "View",
            icon: "▦",
            priority: 85,
            control: true,
            widths: { "icon-text": 118, icon: 118, text: 118 },
            render: () => (
              <TSegment
                options={["days", "all"] as const}
                value={view}
                onChange={setView}
                ariaLabel="Photo grouping"
                labels={{ days: "Days", all: "All" }}
              />
            ),
          } satisfies ToolbarItem,
        ]
      : []),
    {
      id: "div",
      label: "",
      icon: "",
      priority: 55,
      widths: { "icon-text": 14, icon: 14, text: 14 },
      render: () => <TDivider />,
    },
    ...(enabled.share
      ? [
          {
            id: "share",
            label: "Share",
            icon: "⤴",
            priority: 80,
            widths: { "icon-text": 54, icon: 42, text: 56 },
            onAction: () => flash(favs.length ? `Sharing ${favs.length} favorite${favs.length > 1 ? "s" : ""}` : "Nothing favorited yet — ♥ a photo first"),
            render: (m: DisplayMode) => (
              <TButton icon="⤴" label="Share" mode={m} onClick={() => flash(favs.length ? `Sharing ${favs.length} favorite${favs.length > 1 ? "s" : ""}` : "Nothing favorited yet — ♥ a photo first")} />
            ),
          } satisfies ToolbarItem,
        ]
      : []),
    {
      id: "flex",
      label: "",
      icon: "",
      priority: 1000,
      flexible: true,
      widths: { "icon-text": 0, icon: 0, text: 0 },
      render: () => null,
    },
    ...(enabled.search
      ? [
          {
            id: "search",
            label: "Search",
            icon: "⌕",
            priority: 100,
            control: true,
            widths: { "icon-text": 136, icon: 136, text: 136 },
            render: () => <TSearch value={query} onChange={setQuery} placeholder="Search photos" />,
          } satisfies ToolbarItem,
        ]
      : []),
  ];

  const q = query.trim().toLowerCase();
  const filtered = q
    ? PHOTOS.filter((p) => `${p.caption} ${p.day}`.toLowerCase().includes(q))
    : PHOTOS;
  const days = ["Saturday", "Friday", "Thursday"];

  function toggleFav(id: number) {
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  const grid = (list: typeof PHOTOS) => (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {list.map((p) => {
        const fav = favs.includes(p.id);
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => toggleFav(p.id)}
            aria-pressed={fav}
            title={`${p.caption} — click to ${fav ? "unfavorite" : "favorite"}`}
            className="group relative aspect-square overflow-hidden rounded-lg text-white"
            style={{ backgroundColor: p.tint }}
          >
            <span aria-hidden className="absolute inset-0 grid place-items-center text-2xl opacity-70">
              ▲
            </span>
            <span
              className={`absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full text-xs transition-all ${
                fav ? "bg-white text-red-500 opacity-100" : "bg-black/30 opacity-0 group-hover:opacity-100"
              }`}
            >
              ♥
            </span>
            <span className="absolute inset-x-0 bottom-0 bg-black/35 px-1.5 py-1 text-left text-[10px] leading-tight">
              {p.caption}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <BackLink />
        <PageHeader
          eyebrow="Scenario 3 · photo browser"
          title="Photos-style library"
          alsoCalled="customizable toolbar · separator lab · control group item"
          lede={
            <p>
              A media window where the toolbar is personal: the Customize palette below
              adds and removes items live, switches icon-and-text modes, and cycles all
              four separator styles. Scroll the grid with Automatic selected — the
              hairline draws itself only once photos slide underneath.
            </p>
          }
        />
        <ConfigChips
          items={[
            "customization palette",
            "palette labels ≠ item labels",
            "separator: automatic (try all four)",
            "segment group item",
            "flexible space",
          ]}
        />

        <div className="desktop-dots relative flex min-h-[520px] flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-stone-300/70 p-6 sm:p-10">
          <UnifiedToolbar
            title="Library"
            proxyIcon="🖼"
            items={items}
            displayMode={mode}
            separator={sep}
            width={680}
            contentHeight={320}
            statusBar={
              <>
                <span>
                  {filtered.length} photos{favs.length ? ` · ${favs.length} ♥` : ""}
                  {q ? ` · matching “${query}”` : ""}
                </span>
                <span className="flex-1" />
                <span className="font-mono">
                  {sep} · {mode}
                </span>
              </>
            }
          >
            <div className="flex gap-5 px-5 py-5">
              {enabled.sidebar && (
                <aside className="hidden w-36 shrink-0 flex-col gap-0.5 sm:flex">
                  {["Library", "Favorites", "Years", "Places", "People"].map((s, i) => (
                    <span
                      key={s}
                      className={`rounded-md px-2 py-1 text-[13px] ${i === 0 ? "bg-black/[0.07] font-medium text-stone-800" : "text-stone-600"}`}
                    >
                      {s}
                      {s === "Favorites" && favs.length > 0 && (
                        <span className="ml-1.5 rounded-full bg-stone-200 px-1.5 text-[11px] text-stone-600">
                          {favs.length}
                        </span>
                      )}
                    </span>
                  ))}
                </aside>
              )}
              <div className="min-w-0 flex-1">
                {view === "days" && !q ? (
                  <div className="flex flex-col gap-5">
                    {days.map((d) => {
                      const list = filtered.filter((p) => p.day === d);
                      if (!list.length) return null;
                      return (
                        <section key={d}>
                          <p className="mb-2 text-[13px] font-semibold text-stone-800">{d}</p>
                          {grid(list)}
                        </section>
                      );
                    })}
                  </div>
                ) : (
                  grid(filtered)
                )}
                {filtered.length === 0 && (
                  <p className="py-10 text-center text-sm text-stone-400">
                    No photos match “{query}”.
                  </p>
                )}
              </div>
            </div>
          </UnifiedToolbar>

          {/* ── customization palette ── */}
          <div className="w-full max-w-[680px] rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-stone-900">Customize toolbar</p>
                <p className="text-xs text-stone-500">
                  The palette shows a longer <span className="font-mono text-[11px]">paletteLabel</span> per
                  item — the toolbar keeps the short <span className="font-mono text-[11px]">label</span>.
                </p>
              </div>
              <button
                type="button"
                aria-expanded={paletteOpen}
                onClick={() => setPaletteOpen((v) => !v)}
                className="shrink-0 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-[#0071e3]/40 hover:text-[#0071e3]"
              >
                {paletteOpen ? "Hide palette" : "Customize…"}
              </button>
            </div>
            {paletteOpen && (
              <div className="mt-4 grid gap-5 md:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-stone-400">Items</p>
                  {OPTIONAL.map((o) => (
                    <label
                      key={o.id}
                      className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 hover:bg-stone-50"
                    >
                      <input
                        type="checkbox"
                        checked={!!enabled[o.id]}
                        onChange={() => toggle(o.id)}
                        className="mt-0.5 size-3.5 accent-[#0071e3]"
                      />
                      <span>
                        <span className="block text-[13px] font-medium text-stone-800">{o.label}</span>
                        <span className="block text-xs leading-snug text-stone-500">{o.palette}</span>
                      </span>
                    </label>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-stone-400">Display mode</p>
                  {(["icon-text", "icon", "text"] as const).map((m) => (
                    <label key={m} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-stone-50">
                      <input
                        type="radio"
                        name="tb-mode"
                        checked={mode === m}
                        onChange={() => setMode(m)}
                        className="size-3.5 accent-[#0071e3]"
                      />
                      <span className="font-mono text-[13px] text-stone-700">{m}</span>
                    </label>
                  ))}
                  <p className="px-2 text-xs leading-snug text-stone-400">
                    Icon-and-text is friendliest; icon-only is compact; text-only aids clarity at small sizes.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
                    titlebarSeparatorStyle
                  </p>
                  {(["automatic", "line", "shadow", "none"] as const).map((s) => (
                    <label key={s} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-stone-50">
                      <input
                        type="radio"
                        name="tb-sep"
                        checked={sep === s}
                        onChange={() => setSep(s)}
                        className="size-3.5 accent-[#0071e3]"
                      />
                      <span className="font-mono text-[13px] text-stone-700">{s}</span>
                    </label>
                  ))}
                  <p className="px-2 text-xs leading-snug text-stone-400">
                    Automatic draws the line only after you scroll the grid above.
                  </p>
                </div>
              </div>
            )}
          </div>

          {toast && (
            <div className="absolute bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-4 py-2 text-xs font-medium text-white shadow-lg">
              {toast}
            </div>
          )}
        </div>

        <WhyFit>
          <p>
            A photo library is browsed, not operated — so its toolbar must get out of the
            way: edge-to-edge photos under a separator of none, or a calm automatic line
            that appears only while scrolling. Customization respects that taste differs —
            a slideshow lover pins Slideshow, a minimalist removes everything but search —
            and the palette&apos;s longer labels explain each choice without cluttering the row.
          </p>
        </WhyFit>

        <ScenarioNav
          prev={{ href: "/scenarios/mail-inbox", label: "Mail inbox" }}
          next={{ href: "/", label: "Anatomy hub" }}
        />
      </div>
    </main>
  );
}
