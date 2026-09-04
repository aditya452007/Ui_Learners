"use client";

import { useCallback, useEffect, useState } from "react";
import MacWindow, {
  SideLabel,
  ToolbarButton,
  ToolbarSpacer,
} from "@/components/MacWindow";
import { BackLink, ConfigChips, PageHeader, ScenarioNav, WhyFit } from "@/components/chrome";

type Photo = { id: string; name: string; meta: string; variant: number };

const PHOTOS: Photo[] = [
  { id: "p1", name: "Ridgeline at noon", meta: "24 MP · f/8 · ISO 100", variant: 0 },
  { id: "p2", name: "Harbor crossing", meta: "24 MP · f/5.6 · ISO 200", variant: 1 },
  { id: "p3", name: "Dune evening", meta: "24 MP · f/11 · ISO 100", variant: 2 },
  { id: "p4", name: "Orchard rows", meta: "12 MP · f/4 · ISO 400", variant: 3 },
  { id: "p5", name: "Lake cabin", meta: "24 MP · f/7.1 · ISO 100", variant: 4 },
  { id: "p6", name: "City overlook", meta: "12 MP · f/2.8 · ISO 800", variant: 5 },
];

/* Flat, tasteful SVG “photos” — stand-ins so the demo needs no network. */
function PhotoArt({ variant, className = "" }: { variant: number; className?: string }) {
  const scenes = [
    <>
      <rect width="400" height="260" fill="#bfd9e8" />
      <circle cx="310" cy="62" r="30" fill="#f2c14e" />
      <polygon points="0,190 120,90 240,190" fill="#7a9e7e" />
      <polygon points="150,190 270,80 400,190" fill="#5b7f66" />
      <polygon points="120,90 150,118 132,132 108,116" fill="#eef3f0" />
      <rect y="190" width="400" height="70" fill="#4c6b54" />
    </>,
    <>
      <rect width="400" height="260" fill="#cfe0ea" />
      <rect y="150" width="400" height="110" fill="#3d6e8c" />
      <rect x="60" y="120" width="150" height="18" rx="4" fill="#8a4b3a" />
      <rect x="120" y="92" width="10" height="30" fill="#5c362b" />
      <polygon points="125,60 160,92 90,92" fill="#e9e2d4" />
      <ellipse cx="300" cy="205" rx="46" ry="7" fill="#ffffff" opacity="0.35" />
      <ellipse cx="120" cy="225" rx="60" ry="7" fill="#ffffff" opacity="0.25" />
      <circle cx="70" cy="52" r="20" fill="#f4f1e6" />
    </>,
    <>
      <rect width="400" height="260" fill="#f4d8b0" />
      <circle cx="200" cy="150" r="42" fill="#e07a5f" />
      <path d="M0,200 Q100,160 200,195 T400,185 V260 H0 Z" fill="#c9a06a" />
      <path d="M0,225 Q120,195 240,220 T400,215 V260 H0 Z" fill="#a67c4b" />
    </>,
    <>
      <rect width="400" height="260" fill="#d8e6cf" />
      <rect y="170" width="400" height="90" fill="#6a8f5f" />
      {[40, 110, 180, 250, 320].map((x) => (
        <g key={x}>
          <rect x={x} y={120} width="8" height="60" fill="#6b4a32" />
          <circle cx={x + 4} cy={108} r="26" fill="#4e7a45" />
        </g>
      ))}
    </>,
    <>
      <rect width="400" height="260" fill="#b9cdd6" />
      <polygon points="0,170 100,70 200,170" fill="#5f7683" />
      <polygon points="120,170 230,50 340,170" fill="#46585f" />
      <rect y="170" width="400" height="90" fill="#7fa3b5" />
      <rect x="255" y="185" width="70" height="40" fill="#7a5238" />
      <polygon points="250,185 290,165 330,185" fill="#54382a" />
      <rect x="318" y="170" width="6" height="18" fill="#54382a" />
    </>,
    <>
      <rect width="400" height="260" fill="#cfd8dc" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={18 + i * 62} y={60 + ((i * 37) % 50)} width="44" height={200 - ((i * 37) % 50)} fill={i % 2 ? "#546e7a" : "#78909c"} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) =>
        [0, 1, 2, 3].map((r) => (
          <rect key={`${i}-${r}`} x={24 + i * 62} y={70 + ((i * 37) % 50) + r * 22} width="32" height="10" fill="#eceff1" opacity="0.85" />
        ))
      )}
      <rect y="238" width="400" height="22" fill="#455a64" />
    </>,
  ];
  return (
    <svg viewBox="0 0 400 260" role="img" aria-label="Sample photo" className={className}>
      {scenes[variant % scenes.length]}
    </svg>
  );
}

export default function MediaViewer() {
  const [idx, setIdx] = useState(0);
  const [favs, setFavs] = useState<string[]>(["p2"]);
  const [zoom, setZoom] = useState(100);
  const [rot, setRot] = useState(0);
  const [infoOpen, setInfoOpen] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const photo = PHOTOS[idx];
  const isFav = favs.includes(photo.id);

  const step = useCallback(
    (dir: 1 | -1) => setIdx((i) => Math.min(PHOTOS.length - 1, Math.max(0, i + dir))),
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader
          eyebrow="Scenario 2 · hidden title + title-bar accessory"
          title="Media viewer"
          alsoCalled="Preview-style photo window"
          lede={
            <p>
              A photo window where the picture matters more than the chrome. The title text is
              hidden, the separator is gone so the image breathes, and a custom accessory strip
              carries zoom and position. Use the arrow keys — the chrome never gets in the way.
            </p>
          }
        />
        <ConfigChips
          items={[
            "titleVisibility: hidden",
            "separator: none",
            "NSTitlebarAccessoryViewController",
            "no window tabs",
            "arrow-key navigation",
          ]}
        />
        <WhyFit>
          Viewers are looked <em>through</em>, not <em>at</em> — every pixel of chrome competes
          with the photo. Hiding the title text and removing the separator lets the image sit
          directly under the toolbar, while the accessory keeps view-only controls (zoom,
          position) visibly separate from the document itself.
        </WhyFit>

        <div className="desktop-dots relative flex min-h-[640px] items-center justify-center overflow-hidden rounded-2xl border border-stone-300/70 p-6 sm:p-10">
          <MacWindow
            title={photo.name}
            proxyIcon="◍"
            titleVisible={false}
            toolbarStyle="unified"
            toolbarLeading={
              <div className="flex items-center gap-1">
                <ToolbarButton icon="‹" label="Prev" disabled={idx === 0} onClick={() => step(-1)} />
                <ToolbarButton icon="›" label="Next" disabled={idx === PHOTOS.length - 1} onClick={() => step(1)} />
              </div>
            }
            toolbarTrailing={
              <div className="flex items-center gap-1">
                <ToolbarButton
                  icon={<span className={isFav ? "text-red-500" : ""}>♥</span>}
                  label="Favorite"
                  pressed={isFav}
                  onClick={() =>
                    setFavs((f) => (isFav ? f.filter((x) => x !== photo.id) : [...f, photo.id]))
                  }
                />
                <ToolbarButton icon="↻" label="Rotate" onClick={() => setRot((r) => (r + 90) % 360)} />
                <ToolbarButton icon="ⓘ" label="Info" pressed={infoOpen} onClick={() => setInfoOpen((v) => !v)} />
                <ToolbarButton icon="⤴" label="Share" onClick={() => flash("Export dialog would open here")} />
              </div>
            }
            accessory={
              <div data-nodrag className="flex w-full items-center gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-stone-400">Accessory</span>
                <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(50, z - 25))} className="grid size-6 place-items-center rounded-md text-sm text-stone-600 hover:bg-black/[0.06]">−</button>
                <span className="w-12 text-center font-mono text-[11px] text-stone-600">{zoom}%</span>
                <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(200, z + 25))} className="grid size-6 place-items-center rounded-md text-sm text-stone-600 hover:bg-black/[0.06]">+</button>
                <div className="flex-1" />
                <span className="text-[11px] tabular-nums text-stone-500">{idx + 1} of {PHOTOS.length}</span>
              </div>
            }
            showSeparator={false}
            tabs={[]}
            initialWidth={700}
            initialHeight={520}
            minWidth={440}
            minHeight={380}
            sidebar={
              infoOpen ? (
                <>
                  <SideLabel>Info</SideLabel>
                  <div className="flex flex-col gap-2 px-2 py-1 text-[12px]">
                    <div><p className="font-semibold text-stone-700">{photo.name}</p><p className="text-stone-400">{photo.meta}</p></div>
                    {[["Favorite", isFav ? "Yes" : "No"], ["Rotation", `${rot}°`], ["Zoom", `${zoom}%`]].map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-black/[0.05] pb-1.5">
                        <span className="text-stone-400">{k}</span>
                        <span className="font-medium text-stone-600">{v}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : undefined
            }
          >
            <div className="flex h-full flex-col bg-[#e4e4e7]">
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-6">
                <div
                  className="overflow-hidden rounded-lg shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4)] transition-transform duration-200"
                  style={{ transform: `scale(${zoom / 100}) rotate(${rot}deg)`, maxWidth: "100%" }}
                >
                  <PhotoArt variant={photo.variant} className="block max-h-[320px] w-auto" />
                </div>
              </div>
              <div className="shrink-0 border-t border-black/10 bg-[#ececee] px-4 pb-3 pt-2">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                  In-content filmstrip — swaps the photo inside this one window (not window tabs)
                </p>
                <div className="flex gap-2 overflow-x-auto mac-scroll">
                  {PHOTOS.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setIdx(i)}
                      aria-label={`Show ${p.name}`}
                      aria-current={i === idx}
                      className={`relative shrink-0 overflow-hidden rounded-md transition-all ${
                        i === idx ? "outline outline-2 outline-[#0071e3]" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <PhotoArt variant={p.variant} className="block h-12 w-20 object-cover" />
                      {favs.includes(p.id) && (
                        <span className="absolute right-1 top-0.5 text-[10px] text-red-500">♥</span>
                      )}
                    </button>
                  ))}
                  <ToolbarSpacer />
                </div>
              </div>
            </div>
          </MacWindow>

          {toast && (
            <div className="absolute bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-4 py-2 text-xs font-medium text-white shadow-lg">
              {toast}
            </div>
          )}
        </div>

        <div className="grid gap-3 text-[13px] leading-relaxed text-stone-600 md:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white p-4"><span className="font-semibold text-stone-800">Notice the missing lines</span> — no title text, no hairline. The photo starts the instant the chrome ends.</div>
          <div className="rounded-xl border border-stone-200 bg-white p-4"><span className="font-semibold text-stone-800">Rotate and zoom freely</span> — they&apos;re view settings in the accessory, so the file itself is never touched.</div>
          <div className="rounded-xl border border-stone-200 bg-white p-4"><span className="font-semibold text-stone-800">Compare the two tab kinds</span> — the filmstrip below swaps pictures inside one window; frame tabs (scenario 1) would group whole windows.</div>
        </div>

        <ScenarioNav
          prev={{ href: "/scenarios/document-editor", label: "Document editor" }}
          next={{ href: "/scenarios/project-browser", label: "Project browser" }}
        />
      </div>
    </main>
  );
}
