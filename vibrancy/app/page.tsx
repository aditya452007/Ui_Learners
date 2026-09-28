"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MATERIALS,
  Material,
  Switch,
  WALLPAPERS,
  Wallpaper,
  appearanceOf,
  fg,
  rule,
  type Appearance,
  type MaterialKind,
  type WallpaperName,
} from "./components/materials";

/* ------------------------------------------------------------------ */

type Blend = "behind" | "within";
type Spot = 1 | 2 | null;

function Explain({
  num,
  name,
  code,
  see,
  work,
  active,
  onEnter,
  onLeave,
}: {
  num: string;
  name: string;
  code: string;
  see: string;
  work: string;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
        active ? "border-[#0071e3]/60 shadow-md" : "border-[#e5e5ea]"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#0071e3] text-[10px] font-bold text-white">
          {num}
        </span>
        <p className="text-sm font-semibold text-[#1d1d1f]">{name}</p>
        <code className="rounded bg-[#f5f5f7] px-1.5 py-0.5 font-mono text-[10px] text-[#6e6e73]">
          {code}
        </code>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-[#0071e3]/5 p-3 ring-1 ring-inset ring-[#0071e3]/10">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#0071e3]">
            What you see
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#515154]">{see}</p>
        </div>
        <div className="rounded-xl bg-[#f5f5f7] p-3 ring-1 ring-inset ring-black/5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#86868b]">
            How it works
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#515154]">{work}</p>
        </div>
      </div>
    </div>
  );
}

function WildCard({
  href,
  kicker,
  title,
  text,
}: {
  href: string;
  kicker: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-[#e5e5ea] bg-white p-5 shadow-sm transition hover:border-[#0071e3]/40 hover:shadow-md"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#0071e3]">{kicker}</p>
      <p className="mt-1 text-sm font-semibold text-[#1d1d1f]">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-[#6e6e73]">{text}</p>
      <p className="mt-3 text-xs font-semibold text-[#0071e3] group-hover:underline">
        Open the demo →
      </p>
    </Link>
  );
}

/* ------------------------------------------------------------------ */

export default function Home() {
  const [kind, setKind] = useState<MaterialKind>("sidebar");
  const [wallpaper, setWallpaper] = useState<WallpaperName>("meadow");
  const [blend, setBlend] = useState<Blend>("behind");
  const [vibrant, setVibrant] = useState(true);
  const [spot, setSpot] = useState<Spot>(null);

  const appearance: Appearance = appearanceOf(wallpaper);
  /* The HUD bezel stays dark in both appearances — sunglasses don't care. */
  const ink: Appearance = kind === "hud" ? "dark" : appearance;
  const active = MATERIALS.find((m) => m.id === kind)!;

  function reset() {
    setKind("sidebar");
    setWallpaper("meadow");
    setBlend("behind");
    setVibrant(true);
  }

  const seg = ["Day", "Week", "Month"];
  const [segVal, setSegVal] = useState("Week");

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3]">
          NameThatUI · macOS component — web approximation
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#1d1d1f]">
          Visual Effect Material (Vibrancy)
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6e6e73]">
          Also called: <strong className="font-semibold text-[#3a3a3c]">visual effect material</strong>,{" "}
          <strong className="font-semibold text-[#3a3a3c]">frosted glass</strong>, translucent
          material, blur material. The frosted-glass background behind Mac sidebars, menus and
          panels — it borrows color from the wallpaper instead of painting its own. This page
          rebuilds <code className="font-mono text-[12px]">NSVisualEffectView</code> with CSS{" "}
          <code className="font-mono text-[12px]">backdrop-filter</code>; the ideas transfer
          one-to-one to AppKit and SwiftUI.
        </p>
      </header>

      {/* ---------- what am I looking at ---------- */}
      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          {
            t: "① The frosted surface",
            d: "A blur + tint + saturation layer. It has almost no color of its own — change the wallpaper and the glass changes with it.",
          },
          {
            t: "② What's behind it",
            d: "Blending decides the backdrop: the desktop wallpaper (behind-window) or the window's own content (within-window).",
          },
          {
            t: "③ The glowing text",
            d: "Labels and controls drawn luminous over the glass, brightening or deepening so they stay readable on any tint.",
          },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-[#e5e5ea] bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-[#1d1d1f]">{c.t}</p>
            <p className="mt-1 text-xs leading-relaxed text-[#6e6e73]">{c.d}</p>
          </div>
        ))}
      </section>

      {/* ---------- live anatomy ---------- */}
      <section className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3]">Live anatomy</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-[#1d1d1f]">
          Real glass — swap the wallpaper and watch it adapt
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-[#6e6e73]">
          This is a working material, not a picture. Change the wallpaper and label{" "}
          <strong className="font-semibold text-[#3a3a3c]">1</strong> follows the tint. Flip
          vibrancy off and label <strong className="font-semibold text-[#3a3a3c]">2</strong> goes
          flat gray. Hover a label to spotlight its layer.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            {
              n: 1 as Spot,
              title: "Material layer",
              live: `${active.symbol} · blur + saturate · ${blend === "behind" ? "behind-window" : "within-window"}`,
            },
            {
              n: 2 as Spot,
              title: "Vibrant foreground",
              live: vibrant
                ? "allowsVibrancy on — luminous, legible"
                : "allowsVibrancy off — flat gray, harder to read",
            },
          ].map((p) => (
            <button
              key={p.n}
              type="button"
              onMouseEnter={() => setSpot(p.n)}
              onMouseLeave={() => setSpot(null)}
              onFocus={() => setSpot(p.n)}
              onBlur={() => setSpot(null)}
              onClick={() => setSpot(spot === p.n ? null : p.n)}
              className={`relative rounded-xl border bg-white px-3 pb-3 pt-2.5 text-left shadow-sm transition ${
                spot === p.n ? "border-[#0071e3]/60 shadow-md" : "border-[#e5e5ea]"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="grid size-5 place-items-center rounded-full bg-[#0071e3] text-[10px] font-bold text-white">
                  {p.n}
                </span>
                <span className="text-xs font-semibold text-[#1d1d1f]">{p.title}</span>
              </span>
              <span className="mt-1 block font-mono text-[11px] leading-snug text-[#0071e3]">{p.live}</span>
              <span
                aria-hidden="true"
                className={`mx-auto mt-2 block h-3 w-px ${spot === p.n ? "bg-[#0071e3]" : "bg-[#d2d2d7]"}`}
              />
            </button>
          ))}
        </div>

        {/* the desktop stage */}
        <div className="relative mt-1 overflow-hidden rounded-2xl border border-[#e5e5ea] shadow-sm" style={{ height: 400 }}>
          {blend === "behind" ? (
            <Wallpaper name={wallpaper} />
          ) : (
            <div className="absolute inset-0 bg-white p-8" aria-label="Opaque window content backdrop">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                Opaque window content — BlendingMode.withinWindow
              </p>
              <div className="mt-4 space-y-3">
                {[92, 100, 78, 88, 70].map((w, i) => (
                  <div key={i} className="h-3 rounded-full bg-[#e9e9ee]" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          )}

          <div className="absolute inset-0 grid place-items-center p-6">
            <Material
              kind={kind}
              appearance={appearance}
              label={`${active.name} material demo`}
              className={`w-full max-w-[430px] rounded-2xl p-5 transition ${
                spot === 1 ? "outline outline-2 outline-offset-4 outline-[#0071e3]" : ""
              }`}
            >
              <div className={spot === 2 ? "rounded-xl outline outline-2 outline-offset-4 outline-[#0071e3]" : ""}>
                <p className={`text-[15px] font-semibold ${fg(ink, vibrant, "primary")}`}>
                  Saturday hiking club
                </p>
                <p className={`mt-0.5 text-xs ${fg(ink, vibrant, "secondary")}`}>
                  8 members going · starts 9:00 AM at the trailhead
                </p>
                <div className={`mt-4 flex items-center gap-2 rounded-xl p-1 ${ink === "dark" ? "bg-black/25" : "bg-black/5"}`}>
                  {seg.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSegVal(s)}
                      aria-pressed={segVal === s}
                      className={`flex-1 rounded-lg px-2 py-1 text-xs font-semibold transition ${
                        segVal === s
                          ? vibrant
                            ? "bg-[#0071e3] text-white shadow"
                            : "bg-[#8e8e93] text-white shadow"
                          : `${fg(ink, vibrant, "secondary")} hover:opacity-70`
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className={`mt-2 w-full rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    vibrant ? "bg-[#0071e3] text-white hover:bg-[#0077ed]" : "bg-[#c7c7cc] text-[#3a3a3c]"
                  }`}
                >
                  Join the hike
                </button>
                <div className={`my-3 h-px ${rule(ink, vibrant)}`} aria-hidden="true" />
                <p className={`text-[11px] ${fg(ink, vibrant, "tertiary")}`}>
                  Materials borrow their color — this caption tints {wallpaper === "dusk" ? "dark" : "light"} with the {wallpaper} backdrop.
                </p>
              </div>
            </Material>
          </div>
        </div>

        {/* controls */}
        <div className="mt-3 rounded-2xl border border-[#e5e5ea] bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold text-[#6e6e73]">Material <code className="font-mono text-[11px]">NSVisualEffectView.Material</code></p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {MATERIALS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setKind(m.id)}
                aria-pressed={kind === m.id}
                title={m.blurb}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  kind === m.id
                    ? "bg-[#0071e3] text-white shadow"
                    : "bg-[#f5f5f7] text-[#515154] hover:bg-[#e9e9ee]"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#6e6e73]">Wallpaper</span>
            {WALLPAPERS.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setWallpaper(w.id)}
                aria-pressed={wallpaper === w.id}
                title={w.note}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  wallpaper === w.id
                    ? "bg-[#1d1d1f] text-white shadow"
                    : "bg-[#f5f5f7] text-[#515154] hover:bg-[#e9e9ee]"
                }`}
              >
                {w.name}
              </button>
            ))}
            <span className="mx-1 hidden h-5 w-px bg-[#e5e5ea] sm:block" aria-hidden="true" />
            <div className="flex gap-1 rounded-xl bg-[#f5f5f7] p-1" role="group" aria-label="Blending mode">
              {([["behind", "Behind window"], ["within", "Within window"]] as [Blend, string][]).map(([b, t]) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBlend(b)}
                  aria-pressed={blend === b}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    blend === b ? "bg-white text-[#0071e3] shadow-sm" : "text-[#6e6e73] hover:text-[#1d1d1f]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <Switch label="Vibrancy" symbol="allowsVibrancy" checked={vibrant} onChange={setVibrant} />
            <button
              type="button"
              onClick={reset}
              className="ml-auto rounded-lg bg-[#0071e3] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0077ed]"
            >
              Reset demo
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-[#6e6e73]">
          Tip: pick the HUD material on any wallpaper — it stays dark while the others flip with
          the appearance. Then toggle vibrancy off to see what the glass looks like with “dead” text.
        </p>
      </section>

      {/* ---------- layered explanations ---------- */}
      <section className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3]">
          Every part, in plain words
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-[#1d1d1f]">
          What you see · how it works
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-[#6e6e73]">
          Left: the end-user view. Right: the builder view. <em>Props</em> are settings you hand a
          component. <em>State</em> is what it remembers between clicks. <em>Render</em> means
          drawing the screen again.
        </p>
        <div className="mt-4 grid gap-3">
          <Explain
            num="1"
            name="Material layer"
            code="NSVisualEffectView.Material"
            see="The frosted glass itself: softened shapes glowing through from behind, a milky tint on top, and edges that catch the light. Swap the desktop picture and every sidebar, menu and panel in the system retints instantly — the glass owns almost no color of its own."
            work="A backdrop-filter recipe with three ingredients: blur (softens what's behind, like a steamed shower door), saturation boost (keeps colors juicy instead of washed out), and a translucent tint (milkiness for light materials, smoke for dark ones). You pick the recipe by purpose — .sidebar for rails, .menu for menus — and the system tunes it for light vs. dark appearance. Never hard-code one blur + opacity: that’s a snapshot, while a material is alive."
            active={spot === 1}
            onEnter={() => setSpot(1)}
            onLeave={() => setSpot(null)}
          />
          <Explain
            num="2"
            name="Vibrant foreground"
            code="NSVisualEffectView.allowsVibrancy"
            see="The text and controls floating on the glass look lit from within: crisp white on a dark bezel, deep ink on a light sidebar, with selections glowing blue. Turn it off and the same words sink into flat gray — readable, but lifeless."
            work="Vibrancy is a drawing mode for foregrounds, switched on with allowsVibrancy — think of it as permission to glow. Standard controls (labels, buttons, checkboxes) enable it themselves, blending their pixels with the blurred backdrop so contrast survives any wallpaper. That’s why the prompt says: let standard controls supply vibrancy automatically instead of faking text with a fixed gray color."
            active={spot === 2}
            onEnter={() => setSpot(2)}
            onLeave={() => setSpot(null)}
          />
        </div>
      </section>

      {/* ---------- choosing a material ---------- */}
      <section className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3]">
          Choose by purpose, not by looks
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-[#1d1d1f]">
          Which material goes where
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MATERIALS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setKind(m.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              title="Load this material in the anatomy demo"
              className="rounded-2xl border border-[#e5e5ea] bg-white p-4 text-left shadow-sm transition hover:border-[#0071e3]/40 hover:shadow-md"
            >
              <p className="text-sm font-semibold text-[#1d1d1f]">{m.name}</p>
              <code className="mt-1 inline-block rounded bg-[#f5f5f7] px-1.5 py-0.5 font-mono text-[10px] text-[#6e6e73]">
                {m.symbol}
              </code>
              <p className="mt-1 text-xs text-[#6e6e73]">{m.blurb}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ---------- in code + not ---------- */}
      <section className="mt-10 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-[#e5e5ea] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3]">In code</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              "NSVisualEffectView",
              "Material.sidebar",
              "BlendingMode.behindWindow",
              "allowsVibrancy",
              "SwiftUI Material.regular",
              "Material.ultraThin",
            ].map((c) => (
              <code key={c} className="rounded-lg bg-[#f5f5f7] px-2 py-1 font-mono text-[11px] text-[#515154]">
                {c}
              </code>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#6e6e73]">
            AppKit: an <code className="font-mono text-[11px]">NSVisualEffectView</code> configured
            with a semantic <code className="font-mono text-[11px]">Material</code> and a{" "}
            <code className="font-mono text-[11px]">BlendingMode</code>. SwiftUI: a{" "}
            <code className="font-mono text-[11px]">Material</code> value from ultraThin to thick.
            Here, <code className="font-mono text-[11px]">backdrop-filter: blur() saturate()</code>{" "}
            plus a translucent tint plays the same role.
          </p>
        </div>
        <div className="rounded-2xl border border-[#e5e5ea] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3]">
            What it is not
          </p>
          <ul className="mt-2 space-y-2 text-xs leading-relaxed text-[#6e6e73]">
            <li>
              <strong className="font-semibold text-[#3a3a3c]">Not a fixed blur + opacity.</strong>{" "}
              A PNG-style frost is frozen; a material re-tints live when the wallpaper or appearance changes.
            </li>
            <li>
              <strong className="font-semibold text-[#3a3a3c]">Not plain transparency.</strong>{" "}
              Glass boosts saturation and adds tint — a sheer overlay alone looks washed out, never milky.
            </li>
            <li>
              <strong className="font-semibold text-[#3a3a3c]">Not a shadow trick.</strong> Depth
              comes from the blurred world behind the surface, not from a drop shadow on top of it.
            </li>
          </ul>
        </div>
      </section>

      {/* ---------- scenarios ---------- */}
      <section className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3]">
          Where it belongs
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-[#1d1d1f]">
          Three places glass earns its keep
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <WildCard
            href="/scenarios/sidebar"
            kicker="Scenario 1 · Navigation"
            title="Translucent app sidebar"
            text="A Finder-style window: sidebar material over wallpaper, vibrant selection, and a switch that kills the translucency to prove its worth."
          />
          <WildCard
            href="/scenarios/menu-bar"
            kicker="Scenario 2 · Menus"
            title="Menu bar + dropdown menu"
            text="Bar and menu materials on a live desktop: open menus, hover highlights, a disabled item, and a clock that keeps ticking."
          />
          <WildCard
            href="/scenarios/hud"
            kicker="Scenario 3 · Bezel"
            title="Volume / brightness HUD"
            text="The dark always-on-top bezel: drag sliders, watch it flash with vibrant glyphs, then fade — macOS OSD, rebuilt."
          />
        </div>
      </section>

      <footer className="mt-10 border-t border-[#e5e5ea] pt-4 text-xs text-[#86868b]">
        A web approximation of a native pattern: CSS backdrop-filter stands in for
        NSVisualEffectView. No libraries — one recipe map, two layers, three wallpapers.
      </footer>
    </main>
  );
}
