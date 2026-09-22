"use client";

import Link from "next/link";
import { useState } from "react";
import { BottomNav, PhoneFrame, type NavTabDef } from "@/components/bottom-nav";
import {
  HomeIcon,
  SearchIcon,
  InboxIcon,
  UserIcon,
} from "@/components/icons";

/* ── the five named parts ── */

type PartId = "tabbar" | "tabitem" | "selected" | "badge" | "safearea";

interface Part {
  id: PartId;
  name: string;
  symbol: string;
  fragment: string;
  see: string;
  how: string;
}

const PARTS: Part[] = [
  {
    id: "tabbar",
    name: "Tab bar",
    symbol: "UITabBar",
    fragment:
      "the UITabBar fixed strip at the bottom edge holding 3–5 evenly spaced destinations",
    see: "The strip glued to the bottom edge of the screen — it never scrolls away, so your four front doors (Home, Search, Inbox, Profile) are always one tap away. It is translucent with a blur, so the page behind ghosts through like frosted glass. That persistence is the whole point: unlike a menu you must open, this navigation is always visible.",
    how: "Props are the settings you hand the component when you use it (here: the list of destinations and which one is active); state is the value it remembers between taps (here: the active tab id). The bar renders — draws on screen — one row from that destinations array, so adding a fifth tab is one more array entry, not new layout code. Think of it as the lobby directory of a building: always in the same place, listing every floor.",
  },
  {
    id: "tabitem",
    name: "Tab item",
    symbol: "Tab",
    fragment: "the Tab column — an icon stacked above a short one-word label",
    see: "One destination: a small icon sitting over a single short word. The whole column is one big tap target — you can hit the icon, the label, or the space around them and the same thing happens. Labels stay to one word (Home, not Home Page) so all four columns stay even and the bar stays slim.",
    how: "Each destination is a link (<a>) inside the <nav> landmark, laid out as a vertical flex column — icon on top, label below. A tap fires an event (a click the component listens for), which calls onChange with that tab's id and the screen above re-renders. Render means drawing the screen again, and here only the content region changes — the bar itself never moves. Like elevator buttons: one wide plate per floor, press anywhere on it.",
  },
  {
    id: "selected",
    name: "Selected tab",
    symbol: 'tabBarActiveTintColor · aria-current="page"',
    fragment:
      "the tabBarActiveTintColor tint on exactly one icon + label, muted gray on the rest",
    see: "Exactly one tab wears the teal accent on both its icon and its label — the rest sit in quiet gray. That single tint is your “you are here” marker: it never blinks out, so you always know which destination you are standing on. Tap another tab and watch the tint jump instantly, with no sliding animation — a swap, not a journey.",
    how: "One remembered id decides everything: the link whose id matches gets the accent class plus aria-current=\"page\" — the HTML attribute that tells screen readers “this is the page you're on” — while the others get the muted class and no attribute. A tint color (tabBarActiveTintColor) is a single setting that paints every selected tab, so the app can never show two selections at once. Think of a bookmark ribbon: exactly one page in the book holds it.",
  },
  {
    id: "badge",
    name: "Count badge",
    symbol: "tabBarBadge",
    fragment:
      "the tabBarBadge red count pinned top-right of the Inbox icon, never clipped",
    see: "The small red bubble with “3” pinned to the top-right corner of the Inbox icon. It answers “is anything waiting for me?” without opening anything — three unread messages. It floats half outside the icon and is never cut off, even though the bar is a tight glass strip. Open the Inbox and the count is what you'll find inside.",
    how: "The badge is a span absolutely positioned at the icon's top-right corner, rendered only when the count is above zero — count 0 means no bubble at all, which is itself a signal (“all caught up”). It lives inside the tab's tappable column, so tapping the bubble opens the Inbox like tapping the icon does. Never clipped because the bar keeps overflow visible: like a sticky note on a fridge door, it is allowed to poke past the edge.",
  },
  {
    id: "safearea",
    name: "Safe-area inset",
    symbol: "env(safe-area-inset-bottom)",
    fragment:
      "the env(safe-area-inset-bottom) padding below the items that clears the home indicator",
    see: "The extra breathing room below the icons — the hatched strip in this diagram. On an iPhone the icons stop above the home-indicator bar while the glass background runs all the way to the screen edge, so nothing looks cut off and nothing sits under your thumb's swipe zone. On phones without a home indicator this space collapses to zero and the bar simply gets slimmer.",
    how: "env(safe-area-inset-bottom) is a CSS function that asks the phone “how tall is your bottom obstruction?” and returns that many pixels — the component adds it as padding-bottom inside the bar. It only works when the page is allowed under the notch, which needs viewport-fit=cover in the viewport meta tag. Like leaving the bottom stair clear: the staircase (background) continues, but nobody stands on the step the door swings over.",
  },
];

/* ── hub demo tabs ── */

const HUB_TABS: NavTabDef[] = [
  { id: "home", label: "Home", icon: (a) => <HomeIcon active={a} /> },
  { id: "search", label: "Search", icon: () => <SearchIcon /> },
  {
    id: "inbox",
    label: "Inbox",
    icon: (a) => <InboxIcon active={a} />,
    badge: 3,
  },
  { id: "profile", label: "Profile", icon: (a) => <UserIcon active={a} /> },
];

const TAB_INDEX: Record<string, number> = {
  home: 0,
  search: 1,
  inbox: 2,
  profile: 3,
};

function Pill({
  n,
  selected,
  onSelect,
  label,
  className = "",
  style,
}: {
  n: number;
  selected: boolean;
  onSelect: () => void;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      title={label}
      aria-label={`Inspect part ${n}: ${label}`}
      style={style}
      className={`absolute z-40 grid size-6 place-items-center rounded-full text-xs font-bold shadow-md ring-2 ring-white transition-transform hover:scale-125 ${
        selected ? "scale-125 bg-stone-900 text-white" : "bg-[#0d9488] text-white"
      } ${className}`}
    >
      {n}
    </button>
  );
}

/* ── tiny phone screens (instant swap, no animation) ── */

function ScreenShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-scroll h-full overflow-y-auto px-4 pb-36 pt-3">
      {children}
    </div>
  );
}

function HubScreens({ tab }: { tab: string }) {
  if (tab === "search") {
    return (
      <ScreenShell>
        <p className="text-lg font-bold text-stone-900">Search</p>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5">
          <span className="text-stone-400">
            <SearchIcon />
          </span>
          <span className="text-sm text-stone-400">Try “headphones”…</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["All", "Recent", "People", "Tags"].map((c, i) => (
            <span
              key={c}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                i === 0
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              {c}
            </span>
          ))}
        </div>
        {["Acoustic covers", "Maya's playlist", "Studio monitors"].map((r) => (
          <div
            key={r}
            className="mt-2 flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3"
          >
            <span className="grid size-9 place-items-center rounded-lg bg-[#0d9488]/10 text-sm font-bold text-[#0d9488]">
              {r[0]}
            </span>
            <p className="text-sm font-medium text-stone-800">{r}</p>
          </div>
        ))}
      </ScreenShell>
    );
  }
  if (tab === "inbox") {
    return (
      <ScreenShell>
        <p className="text-lg font-bold text-stone-900">Inbox</p>
        <p className="text-xs text-stone-500">3 unread — matches the badge</p>
        {[
          ["Order shipped", "Your headphones are on the way", true],
          ["Maya mentioned you", "“this playlist is so you”", true],
          ["Weekly digest", "5 new drops from artists you follow", true],
        ].map(([t, d]) => (
          <div
            key={t as string}
            className="mt-2 flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-3"
          >
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-red-500" />
            <div>
              <p className="text-sm font-semibold text-stone-900">{t}</p>
              <p className="text-xs text-stone-500">{d}</p>
            </div>
          </div>
        ))}
      </ScreenShell>
    );
  }
  if (tab === "profile") {
    return (
      <ScreenShell>
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-full bg-stone-900 text-lg font-bold text-white">
            J
          </span>
          <div>
            <p className="text-base font-bold text-stone-900">June Park</p>
            <p className="text-xs text-stone-500">june@example.com</p>
          </div>
        </div>
        {["Edit profile", "Notifications", "Privacy", "Log out"].map((r) => (
          <div
            key={r}
            className="mt-2 flex items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2.5"
          >
            <p className="text-sm font-medium text-stone-800">{r}</p>
            <span className="text-stone-300" aria-hidden="true">
              ›
            </span>
          </div>
        ))}
      </ScreenShell>
    );
  }
  return (
    <ScreenShell>
      <p className="text-xs font-medium text-stone-500">Good morning</p>
      <p className="text-lg font-bold text-stone-900">Home</p>
      <div className="mt-2 rounded-2xl bg-stone-900 p-4 text-white">
        <p className="text-xs uppercase tracking-[0.14em] text-white/60">
          Today
        </p>
        <p className="mt-1 text-xl font-bold">3 things need you</p>
        <p className="mt-0.5 text-xs text-white/70">
          2 orders · 1 message — check the badge below
        </p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {[
          ["New drops", "12"],
          ["Top mixes", "8"],
        ].map(([t, n]) => (
          <div
            key={t}
            className="rounded-2xl border border-stone-200 bg-white p-3"
          >
            <p className="text-xl font-bold text-[#0d9488]">{n}</p>
            <p className="text-xs font-medium text-stone-600">{t}</p>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

/* ── hub page ── */

export default function Home() {
  const [tab, setTab] = useState("home");
  const [selected, setSelected] = useState<PartId>("tabbar");

  const part = PARTS.find((p) => p.id === selected) ?? PARTS[0];
  const partIndex = PARTS.indexOf(part);

  const spotlightTab =
    selected === "selected" ? tab : selected === "tabitem" ? "search" : null;

  // dot ③ chases the selected tab so it always sits on the tint
  const selIdx = TAB_INDEX[tab] ?? 0;
  const selLeft = `${(selIdx / 4) * 100 + 12.5}%`;

  function pick(id: PartId) {
    setSelected(id);
    if (id === "selected") setTab("home");
    if (id === "badge") setTab("home");
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-12">
        {/* header */}
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#0d9488]">
            mobile · UITabBar / Tab / tabBarBadge
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
            Bottom Navigation
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-500">
            Also called:{" "}
            <span className="font-medium text-stone-700">
              tab bar, bottom tab bar, bottom nav, bottom tabs, bottom
              navigation bar, navigation bar (Material 3), mobile nav bar
            </span>
            . A fixed strip at the bottom edge with 3–5 evenly spaced,
            equally important destinations. Exactly one is tinted, a badge
            counts what&apos;s waiting, and tapping swaps the screen above
            instantly — no push animation, no back stack.
          </p>
        </header>

        {/* API chips */}
        <div className="flex flex-wrap gap-1.5" aria-label="API vocabulary">
          {[
            "UITabBar",
            "Tab",
            "tabBarActiveTintColor",
            "tabBarBadge",
            "env(safe-area-inset-bottom)",
            'aria-current="page"',
            "<nav>",
            "viewport-fit=cover",
          ].map((c) => (
            <span
              key={c}
              className="rounded-full border border-stone-200 bg-white px-2.5 py-1 font-mono text-[11px] text-stone-600"
            >
              {c}
            </span>
          ))}
        </div>

        {/* what-am-I-looking-at strip */}
        <section className="grid gap-3 sm:grid-cols-3">
          {[
            {
              t: "Destinations → four equal doors",
              d: "Home, Search, Inbox, Profile. No hierarchy, no order — four peers sharing one strip, each one tap away.",
              s: "parts 1–2 · UITabBar + Tab",
            },
            {
              t: "Selection → one tint, instant swap",
              d: "Exactly one tab wears teal. Tapping another swaps the whole screen above at once — no slide, no push.",
              s: "part 3 · tabBarActiveTintColor",
            },
            {
              t: "Badge + safe-area → waiting & clearing",
              d: "The red 3 counts unread Inbox items; the hatched strip below keeps icons clear of the home indicator.",
              s: "parts 4–5 · tabBarBadge + env()",
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
        <section className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#0d9488]">
              Live anatomy
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              One tab bar, five named parts
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
              This is the real component, not a picture. Tap the tabs — the
              screen above swaps instantly and pill ③ chases the tint. Tap any
              numbered pill to inspect that part.
            </p>
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-[1fr_300px]">
            <div className="demo-stage relative flex justify-center overflow-hidden rounded-2xl border border-stone-300/70 p-6 sm:p-10">
              <div className="relative">
                <PhoneFrame
                  screenLabel={`Hub demo screen: ${tab}`}
                  bar={
                    <BottomNav
                      tabs={HUB_TABS}
                      value={tab}
                      onChange={setTab}
                      variant="glass"
                      simulateSafeArea
                      spotlight={{
                        bar: selected === "tabbar",
                        tabId: spotlightTab,
                        badge: selected === "badge",
                        safe: selected === "safearea",
                      }}
                    />
                  }
                >
                  <HubScreens tab={tab} />
                </PhoneFrame>

                {/* numbered callouts riding on the phone */}
                <Pill
                  n={1}
                  label="Tab bar"
                  selected={selected === "tabbar"}
                  onSelect={() => pick("tabbar")}
                  className="left-0"
                  style={{ bottom: 64 }}
                />
                <Pill
                  n={2}
                  label="Tab item"
                  selected={selected === "tabitem"}
                  onSelect={() => pick("tabitem")}
                  className="-translate-x-1/2"
                  style={{ left: "37.5%", bottom: 118 }}
                />
                <Pill
                  n={3}
                  label="Selected tab"
                  selected={selected === "selected"}
                  onSelect={() => pick("selected")}
                  className="-translate-x-1/2"
                  style={{ left: selLeft, bottom: 118 }}
                />
                <Pill
                  n={4}
                  label="Count badge"
                  selected={selected === "badge"}
                  onSelect={() => pick("badge")}
                  style={{ left: "62.5%", bottom: 132, marginLeft: 14 }}
                />
                <Pill
                  n={5}
                  label="Safe-area inset"
                  selected={selected === "safearea"}
                  onSelect={() => pick("safearea")}
                  className="right-1"
                  style={{ bottom: 22 }}
                />
              </div>
            </div>

            {/* callout list */}
            <ol className="flex flex-col gap-2">
              {PARTS.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => pick(p.id)}
                    aria-pressed={selected === p.id}
                    className={`w-full rounded-xl border p-3.5 text-left transition-all ${
                      selected === p.id
                        ? "border-[#0d9488]/50 bg-[#e6f5f3]/50 shadow-sm"
                        : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`grid size-5 place-items-center rounded-full text-[11px] font-bold text-white ${
                          selected === p.id ? "bg-stone-900" : "bg-[#0d9488]"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-stone-900">
                        {p.name}
                      </span>
                    </span>
                    <code className="mt-1 block font-mono text-[11px] text-stone-500">
                      {p.symbol}
                    </code>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* inspector */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-[#0d9488] text-sm font-bold text-white">
                {partIndex + 1}
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
                    onClick={() => pick(p.id)}
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
              <div className="rounded-xl bg-[#e6f5f3]/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0d9488]">
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
            {/* live web-contract readout */}
            <div className="mt-3 rounded-lg bg-stone-900 px-4 py-3 font-mono text-[11px] leading-relaxed text-stone-300">
              {HUB_TABS.map((t) => (
                <p key={t.id}>
                  <span className="text-stone-500">&lt;a href=&quot;#{t.id}&quot;</span>{" "}
                  aria-current=
                  <span
                    className={
                      t.id === tab ? "text-teal-300" : "text-stone-500"
                    }
                  >
                    {t.id === tab ? '"page"' : "—"}
                  </span>
                  <span className="text-stone-500">&gt;{t.label}&lt;/a&gt;</span>
                </p>
              ))}
              <p className="mt-1 text-stone-500">
                ← live: tap tabs and watch aria-current move · bar padded with
                env(safe-area-inset-bottom)
              </p>
            </div>
          </div>
        </section>

        {/* ── full anatomy index ── */}
        <section className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#0d9488]">
              Anatomy index
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              Every part, in words
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {PARTS.map((p, i) => (
              <div
                key={p.id}
                className="rounded-xl border border-stone-200 bg-white p-5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid size-6 place-items-center rounded-full bg-[#0d9488] text-xs font-bold text-white">
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
              </div>
            ))}
          </div>
        </section>

        {/* ── easy to confuse ── */}
        <section className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#0d9488]">
              Don&apos;t mix these up
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              Three classic confusions
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">
                Bottom nav ≠ Tabs
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                Tabs sit at the top and switch views of the <em>same</em>{" "}
                screen (peer panels sharing one region, with arrow-key
                travel). Bottom nav switches top-level <em>destinations</em> —
                whole screens with no shared region — using links and
                aria-current, not a tablist.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">
                Bottom nav ≠ Hamburger menu
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                A hamburger hides navigation behind a tap; bottom nav keeps
                3–5 destinations permanently visible. If a destination matters
                enough to live behind a hamburger, it probably deserves a tab
                — and if you need more than five, you need the hamburger
                instead.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-stone-900">
                Badge ≠ Notification center
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
                The badge is a hint, not the message: a number that says
                “something waits in Inbox”, never what it is. Tapping the tab
                must reveal exactly what the badge counted — if opening Inbox
                shows nothing new, the badge was lying.
              </p>
            </div>
          </div>
        </section>

        {/* ── scenarios ── */}
        <section className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#0d9488]">
              Where it belongs
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              Three tab bars, three jobs
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
              Same bottom-nav contract, different configuration. Each scenario
              exercises something the others don&apos;t.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                href: "/scenarios/music-app",
                t: "Glass music app",
                d: "A streaming app with a floating frosted bar over a long scrolling album list — and a Library badge that counts down as you play new drops.",
                c: ["floating glass", "count badge", "blur over scroll"],
              },
              {
                href: "/scenarios/food-delivery",
                t: "Food delivery orders",
                d: "Full-bleed bar where the Orders badge is live inventory: pick up an order and the count drops 2 → 1 → gone.",
                c: ["full-bleed", "live badge", "instant swap"],
              },
              {
                href: "/scenarios/fitness-tracker",
                t: "Material 3 fitness",
                d: "M3 pill indicator, a numberless dot badge for new insights, and a minimize-on-scroll toggle for the bar itself.",
                c: ["M3 pill", "dot badge", "minimize toggle"],
              },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#0d9488]/40 hover:shadow-md"
              >
                <p className="text-[15px] font-semibold text-stone-900 group-hover:text-[#0d9488]">
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
                <p className="mt-3 text-sm font-medium text-[#0d9488]">
                  Open scenario <span aria-hidden>→</span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="border-t border-stone-200 pt-6 text-[13px] leading-relaxed text-stone-500">
          <p>
            Built from plain links and ARIA — no component library. The web
            contract is a <code className="font-mono text-xs">{"<nav>"}</code>{" "}
            of links with{" "}
            <code className="font-mono text-xs">aria-current=&quot;page&quot;</code>{" "}
            on the active one, padded with{" "}
            <code className="font-mono text-xs">
              env(safe-area-inset-bottom)
            </code>{" "}
            under a{" "}
            <code className="font-mono text-xs">viewport-fit=cover</code> meta
            tag.
          </p>
        </footer>
      </div>
    </main>
  );
}
