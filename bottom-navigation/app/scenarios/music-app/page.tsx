"use client";

import { useMemo, useState } from "react";
import { BottomNav, PhoneFrame, type NavTabDef } from "@/components/bottom-nav";
import { ScenarioShell } from "@/components/scenario-shell";
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  SparkleIcon,
} from "@/components/icons";

interface Album {
  id: string;
  title: string;
  artist: string;
  hue: number;
  isNew?: boolean;
}

const ALBUMS: Album[] = [
  { id: "a1", title: "Neon Harbor", artist: "Glasswing", hue: 168, isNew: true },
  { id: "a2", title: "Paper Suns", artist: "Maya Cole", hue: 36, isNew: true },
  { id: "a3", title: "Low Orbit", artist: "Cassette Club", hue: 210, isNew: true },
  { id: "a4", title: "Fern & Static", artist: "Alder", hue: 120, isNew: true },
  { id: "a5", title: "Half Light", artist: "June Park", hue: 280, isNew: true },
  { id: "a6", title: "Copper Sky", artist: "The Meridians", hue: 18 },
  { id: "a7", title: "Tide Tables", artist: "Salt Air", hue: 195 },
  { id: "a8", title: "Velvet Engine", artist: "Nocturne", hue: 340 },
  { id: "a9", title: "Maple Fire", artist: "Alder", hue: 28 },
  { id: "a10", title: "Quiet Arcs", artist: "Mono Field", hue: 150 },
  { id: "a11", title: "Honey Phase", artist: "Glasswing", hue: 48 },
  { id: "a12", title: "Night Bus", artist: "Cassette Club", hue: 230 },
];

function Tile({ album, size = "md" }: { album: Album; size?: "md" | "sm" }) {
  return (
    <div
      aria-hidden="true"
      className={`grid place-items-center rounded-xl ${
        size === "md" ? "aspect-square text-3xl" : "size-11 shrink-0 text-lg"
      } font-bold text-white/95`}
      style={{
        background: `linear-gradient(135deg, hsl(${album.hue} 45% 45%), hsl(${
          (album.hue + 40) % 360
        } 50% 32%))`,
      }}
    >
      {album.title[0]}
    </div>
  );
}

function ScrollCol({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-scroll h-full overflow-y-auto px-4 pb-40 pt-3">
      {children}
    </div>
  );
}

export default function MusicApp() {
  const [tab, setTab] = useState("home");
  const [played, setPlayed] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [premium, setPremium] = useState(false);

  const newDrops = useMemo(() => ALBUMS.filter((a) => a.isNew), []);
  const remaining = newDrops.filter((a) => !played.includes(a.id)).length;

  const tabs: NavTabDef[] = [
    { id: "home", label: "Home", icon: (a) => <HomeIcon active={a} /> },
    { id: "search", label: "Search", icon: () => <SearchIcon /> },
    {
      id: "library",
      label: "Library",
      icon: (a) => <LibraryIcon active={a} />,
      badge: remaining,
    },
    { id: "premium", label: "Premium", icon: () => <SparkleIcon /> },
  ];

  function togglePlayed(id: string) {
    setPlayed((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  const results = ALBUMS.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.artist.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <ScenarioShell
      kicker="scenario 1 · floating glass · count badge"
      title="Glass music app"
      context="Waveform, a music streaming app. The tab bar floats as a frosted-glass pill over a long scrolling album list — artwork visibly blurs beneath it. The Library badge counts 5 unplayed new drops."
      why="Music apps live in 4 equal zones (browse, find, collect, upgrade), so a persistent bar beats a hidden menu. The badge turns “new music Friday” into a number you can clear, and the floating glass keeps the bar feeling light over dense artwork."
      config={["floating glass", "badge 5 → 0", "blur over scroll"]}
      prev={{ href: "/", label: "Bottom Navigation hub" }}
      next={{ href: "/scenarios/food-delivery", label: "Food delivery orders" }}
    >
      <div className="demo-stage flex flex-col items-center gap-4 rounded-2xl border border-stone-300/70 p-6 sm:p-10">
        <PhoneFrame
          screenLabel={`Waveform screen: ${tab}`}
          bar={
            <BottomNav
              tabs={tabs}
              value={tab}
              onChange={setTab}
              variant="glass"
              ariaLabel="Waveform"
            />
          }
        >
          {tab === "home" && (
            <ScrollCol>
              <p className="text-xs font-medium text-stone-500">Good evening</p>
              <p className="text-lg font-bold text-stone-900">Jump back in</p>
              <div className="mt-2 grid grid-cols-2 gap-2.5">
                {ALBUMS.slice(0, 6).map((a) => (
                  <div key={a.id}>
                    <Tile album={a} />
                    <p className="mt-1 truncate text-xs font-semibold text-stone-800">
                      {a.title}
                    </p>
                    <p className="truncate text-[11px] text-stone-500">
                      {a.artist}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm font-bold text-stone-900">
                Made for you
              </p>
              {ALBUMS.slice(6).map((a) => (
                <div
                  key={a.id}
                  className="mt-2 flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-2.5"
                >
                  <Tile album={a} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-stone-800">
                      {a.title}
                    </p>
                    <p className="truncate text-[11px] text-stone-500">
                      {a.artist}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollCol>
          )}

          {tab === "search" && (
            <ScrollCol>
              <p className="text-lg font-bold text-stone-900">Search</p>
              <label className="mt-2 flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 focus-within:border-[#0d9488]/50">
                <span className="text-stone-400">
                  <SearchIcon />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Albums or artists…"
                  className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                />
              </label>
              <p className="mt-3 text-xs font-medium text-stone-500">
                {results.length} result{results.length === 1 ? "" : "s"}
              </p>
              {results.map((a) => (
                <div
                  key={a.id}
                  className="mt-2 flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-2.5"
                >
                  <Tile album={a} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-stone-800">
                      {a.title}
                    </p>
                    <p className="truncate text-[11px] text-stone-500">
                      {a.artist}
                    </p>
                  </div>
                  {a.isNew && !played.includes(a.id) && (
                    <span className="ml-auto shrink-0 rounded-full bg-[#0d9488]/10 px-2 py-0.5 text-[10px] font-bold text-[#0d9488]">
                      NEW
                    </span>
                  )}
                </div>
              ))}
            </ScrollCol>
          )}

          {tab === "library" && (
            <ScrollCol>
              <p className="text-lg font-bold text-stone-900">Library</p>
              <p className="text-xs text-stone-500">
                {remaining === 0
                  ? "All caught up — badge cleared"
                  : `${remaining} new drop${remaining === 1 ? "" : "s"} to play`}
              </p>
              {newDrops.map((a) => {
                const done = played.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => togglePlayed(a.id)}
                    aria-pressed={done}
                    className={`mt-2 flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors ${
                      done
                        ? "border-stone-200 bg-stone-50 opacity-70"
                        : "border-stone-200 bg-white hover:border-[#0d9488]/40"
                    }`}
                  >
                    <Tile album={a} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-stone-800">
                        {a.title}
                      </span>
                      <span className="block truncate text-[11px] text-stone-500">
                        {a.artist}
                      </span>
                    </span>
                    {done ? (
                      <span className="shrink-0 rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-600">
                        ✓ PLAYED
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-[#0d9488] px-2 py-0.5 text-[10px] font-bold text-white">
                        ▶ NEW
                      </span>
                    )}
                  </button>
                );
              })}
              {remaining > 0 && (
                <button
                  type="button"
                  onClick={() => setPlayed(newDrops.map((a) => a.id))}
                  className="mt-3 w-full rounded-xl bg-stone-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
                >
                  Mark all played
                </button>
              )}
            </ScrollCol>
          )}

          {tab === "premium" && (
            <ScrollCol>
              <div className="mt-1 rounded-2xl bg-stone-900 p-4 text-white">
                <span className="text-[#5eead4]">
                  <SparkleIcon />
                </span>
                <p className="mt-2 text-lg font-bold">
                  {premium ? "You're on Premium" : "Go Premium"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-white/70">
                  Offline listening, no ads, and early access to new drops.
                </p>
                <button
                  type="button"
                  onClick={() => setPremium((v) => !v)}
                  aria-pressed={premium}
                  className="mt-3 w-full rounded-xl bg-[#0d9488] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0f766e]"
                >
                  {premium ? "Manage plan" : "Try 1 month free"}
                </button>
              </div>
              {["Offline mode", "No interruptions", "Early drops"].map((f) => (
                <div
                  key={f}
                  className="mt-2 flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3"
                >
                  <span className="grid size-6 place-items-center rounded-full bg-[#0d9488]/10 text-xs font-bold text-[#0d9488]">
                    ✓
                  </span>
                  <p className="text-sm font-medium text-stone-800">{f}</p>
                </div>
              ))}
            </ScrollCol>
          )}
        </PhoneFrame>

        <p className="max-w-md text-center text-[13px] leading-relaxed text-stone-600">
          Scroll the Home list — artwork slides <em>beneath</em> the frosted
          bar. Then open Library and play the new drops: the badge counts down{" "}
          {remaining} → 0 and vanishes when you&apos;re caught up.
        </p>
      </div>
    </ScenarioShell>
  );
}
