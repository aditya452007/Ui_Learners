"use client";

import { useState } from "react";
import Link from "next/link";

type ShapeKey =
  | "arrow"
  | "ibeam"
  | "hand"
  | "crosshair"
  | "ew"
  | "ns"
  | "nwse"
  | "nesw"
  | "move"
  | "copy"
  | "notAllowed"
  | "grab"
  | "grabbing"
  | "zoom"
  | "help"
  | "vtext";

const ARROW_PATH =
  "M0 0 L0 22 L5.5 17.5 L8.5 21.5 L11 19 L8 15.5 L14 15 Z";

const filled = (d: string, c: string) =>
  `<path d="${d}" fill="white" stroke="white" stroke-width="4" stroke-linejoin="round"/><path d="${d}" fill="${c}" stroke="#292524" stroke-width="1.2" stroke-linejoin="round"/>`;

const stroked = (d: string, c: string, w = 3.2) =>
  `<path d="${d}" stroke="white" stroke-width="${w + 3.6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

const svgWrap = (inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">${inner}</svg>`;

const IB = (c: string) =>
  svgWrap(
    filled("M15 5.5 L17 5.5 L17 26.5 L15 26.5 Z", c) +
      filled("M13 2 L19 2 L19 5 L13 5 Z", c) +
      filled("M13 27 L19 27 L19 30 L13 30 Z", c)
  );

interface CursorDef {
  name: string;
  color: string;
  cssKw: string;
  appkit: string;
  meaning: string;
  svg: string;
  hot: [number, number];
  css: string;
}

const DEFS: Record<ShapeKey, CursorDef> = (() => {
  const def = (
    key: ShapeKey,
    name: string,
    color: string,
    cssKw: string,
    appkit: string,
    meaning: string,
    svg: string,
    hot: [number, number]
  ): CursorDef => ({
    name,
    color,
    cssKw,
    appkit,
    meaning,
    svg,
    hot,
    css: `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hot[0]} ${hot[1]}, auto`,
  });
  return {
    arrow: def(
      "arrow",
      "Arrow",
      "#2563eb",
      "default",
      "NSCursor.arrow",
      "The everyday default — point, click, select.",
      svgWrap(filled(ARROW_PATH, "#2563eb")),
      [0, 0]
    ),
    ibeam: def(
      "ibeam",
      "I-beam",
      "#7c3aed",
      "text",
      "NSCursor.iBeam",
      "Over editable text: 'type here'.",
      IB("#7c3aed"),
      [16, 16]
    ),
    hand: def(
      "hand",
      "Pointing hand",
      "#d97706",
      "pointer",
      "NSCursor.pointingHand",
      "Over links and buttons: 'click me'.",
      svgWrap(
        filled("M8 14 L19 14 L19 25 C19 26.9 17.8 28.4 16 28.4 L11 28.4 C9.2 28.4 8 26.9 8 25 Z", "#d97706") +
          filled("M12.5 5.5 L15.5 5.5 L15.5 15 L12.5 15 Z", "#d97706") +
          filled("M8 20 L5.5 20 L5.5 23.5 L8 23.5 Z", "#d97706")
      ),
      [14, 8]
    ),
    crosshair: def(
      "crosshair",
      "Crosshair",
      "#e11d48",
      "crosshair",
      "NSCursor.crosshair",
      "Over canvases: 'draw / pick a spot'.",
      svgWrap(
        `<circle cx="16" cy="16" r="2.6" fill="${"#e11d48"}" stroke="white" stroke-width="2"/>` +
          stroked("M16 3 L16 11 M16 21 L16 29 M3 16 L11 16 M21 16 L29 16", "#e11d48")
      ),
      [16, 16]
    ),
    ew: def(
      "ew",
      "Resize horizontal",
      "#0d9488",
      "ew-resize",
      "NSCursor.resizeLeftRight",
      "Drag to resize horizontally.",
      svgWrap(stroked("M5 16 L27 16 M9 11 L14 16 L9 21 M23 11 L18 16 L23 21", "#0d9488")),
      [16, 16]
    ),
    ns: def(
      "ns",
      "Resize vertical",
      "#059669",
      "ns-resize",
      "NSCursor.resizeUpDown",
      "Drag to resize vertically.",
      svgWrap(stroked("M16 5 L16 27 M11 9 L16 14 L21 9 M11 23 L16 18 L21 23", "#059669")),
      [16, 16]
    ),
    nwse: def(
      "nwse",
      "Resize diagonal",
      "#ea580c",
      "nwse-resize",
      "NSCursor.resizeUpLeftAndDownRight",
      "Drag a corner: resize both ways.",
      svgWrap(stroked("M7 7 L25 25 M13 7 L7 7 L7 13 M19 25 L25 25 L25 19", "#ea580c")),
      [16, 16]
    ),
    nesw: def(
      "nesw",
      "Resize other diagonal",
      "#0284c7",
      "nesw-resize",
      "NSCursor.resizeUpRightAndDownLeft",
      "The other corner direction.",
      svgWrap(stroked("M7 25 L25 7 M19 7 L25 7 L25 13 M13 25 L7 25 L7 19", "#0284c7")),
      [16, 16]
    ),
    move: def(
      "move",
      "Move",
      "#4f46e5",
      "move",
      "custom / NSCursor.openHand",
      "Drag to reposition.",
      svgWrap(
        stroked("M16 9 L16 3 M13 6 L16 3 L19 6 M16 23 L16 29 M13 26 L16 29 L19 26 M9 16 L3 16 M6 13 L3 16 L6 19 M23 16 L29 16 M26 13 L29 16 L26 19", "#4f46e5") +
          `<rect x="14" y="14" width="4" height="4" rx="1" fill="${"#4f46e5"}"/>`
      ),
      [16, 16]
    ),
    copy: def(
      "copy",
      "Copy / duplicate",
      "#db2777",
      "copy",
      "NSCursor.dragCopy",
      "Dragging will duplicate.",
      svgWrap(
        filled(ARROW_PATH, "#db2777") +
          `<circle cx="24.5" cy="24.5" r="6.5" fill="white" stroke="white" stroke-width="3"/><circle cx="24.5" cy="24.5" r="6.5" fill="none" stroke="${"#db2777"}" stroke-width="2"/><path d="M21.5 24.5 L27.5 24.5 M24.5 21.5 L24.5 27.5" stroke="${"#db2777"}" stroke-width="2.4" stroke-linecap="round"/>`
      ),
      [0, 0]
    ),
    notAllowed: def(
      "notAllowed",
      "Operation not allowed",
      "#dc2626",
      "not-allowed",
      "NSCursor.operationNotAllowed",
      "This action is not allowed here.",
      svgWrap(
        `<circle cx="16" cy="16" r="11.5" fill="white" stroke="white" stroke-width="4"/><circle cx="16" cy="16" r="11.5" fill="none" stroke="${"#dc2626"}" stroke-width="2.4"/>` +
          stroked("M7 7 L25 25", "#dc2626", 5)
      ),
      [16, 16]
    ),
    grab: def(
      "grab",
      "Grab",
      "#0891b2",
      "grab",
      "NSCursor.openHand",
      "Grab to pan the view.",
      svgWrap(
        filled("M8 13 L20 13 L20 24 C20 26.2 18.7 27.8 17 27.8 L11 27.8 C9.3 27.8 8 26.2 8 24 Z", "#0891b2") +
          filled("M9.5 6.5 L12 6.5 L12 15 L9.5 15 Z", "#0891b2") +
          filled("M13.5 5 L16 5 L16 15 L13.5 15 Z", "#0891b2") +
          filled("M17.5 6.5 L20 6.5 L20 15 L17.5 15 Z", "#0891b2") +
          filled("M8 19 L5.5 19 L5.5 23 L8 23 Z", "#0891b2")
      ),
      [14, 9]
    ),
    grabbing: def(
      "grabbing",
      "Grabbing",
      "#9333ea",
      "grabbing",
      "NSCursor.closedHand",
      "Panning in progress.",
      svgWrap(
        filled("M10 12 L22 12 L22 21 C22 24.2 20.2 26.8 17.3 26.8 L13.7 26.8 C10.8 26.8 9 24.2 9 21 L9 16.5 C9 13.8 9.5 12 10 12 Z", "#9333ea") +
          filled("M11 7.5 L13.5 7.5 L13.5 13 L11 13 Z", "#9333ea") +
          filled("M15 6.5 L17.5 6.5 L17.5 13 L15 13 Z", "#9333ea") +
          filled("M19 7.5 L21.5 7.5 L21.5 13 L19 13 Z", "#9333ea")
      ),
      [15, 10]
    ),
    zoom: def(
      "zoom",
      "Zoom in",
      "#65a30d",
      "zoom-in",
      "NSCursor.zoomIn",
      "Click to zoom in.",
      svgWrap(
        `<circle cx="13" cy="13" r="9" fill="white" stroke="white" stroke-width="4"/><circle cx="13" cy="13" r="9" fill="none" stroke="${"#65a30d"}" stroke-width="2.4"/>` +
          stroked("M20 20 L27 27", "#65a30d", 3.4) +
          stroked("M13 9.5 L13 16.5 M9.5 13 L16.5 13", "#65a30d", 2.2)
      ),
      [13, 13]
    ),
    help: def(
      "help",
      "Help",
      "#a21caf",
      "help",
      "— (no standard NSCursor)",
      "Extra help available.",
      svgWrap(
        `<circle cx="16" cy="16" r="11" fill="white" stroke="white" stroke-width="4"/><circle cx="16" cy="16" r="11" fill="none" stroke="${"#a21caf"}" stroke-width="2.6"/><text x="16" y="21" text-anchor="middle" font-size="15" font-family="Arial, sans-serif" font-weight="800" fill="${"#a21caf"}">?</text>`
      ),
      [16, 16]
    ),
    vtext: def(
      "vtext",
      "Vertical text",
      "#64748b",
      "vertical-text",
      "— (custom)",
      "Vertical text editing.",
      svgWrap(
        filled("M4 15 L28 15 L28 17 L4 17 Z", "#64748b") +
          filled("M2 12 L8 12 L8 15 L2 15 Z", "#64748b") +
          filled("M2 17 L8 17 L8 20 L2 20 Z", "#64748b") +
          filled("M24 12 L30 12 L30 15 L24 15 Z", "#64748b") +
          filled("M24 17 L30 17 L30 20 L24 20 Z", "#64748b")
      ),
      [16, 16]
    ),
  };
})();

const SHAPE_ORDER: ShapeKey[] = [
  "arrow",
  "ibeam",
  "hand",
  "crosshair",
  "ew",
  "ns",
  "nwse",
  "nesw",
  "move",
  "copy",
  "notAllowed",
  "grab",
  "grabbing",
  "zoom",
  "help",
  "vtext",
];

const TRAILS: { d: string; x: number; y: number }[] = [
  { d: "M18 74 C 50 70, 70 40, 100 34 S 150 60, 180 30", x: 18, y: 74 },
  { d: "M20 30 C 60 20, 90 70, 130 62 S 170 30, 182 52", x: 20, y: 30 },
  { d: "M16 50 C 45 80, 90 20, 130 30 S 160 70, 184 40", x: 16, y: 50 },
  { d: "M22 60 C 55 30, 100 70, 140 40 S 160 24, 180 58", x: 22, y: 60 },
];

const DURATIONS = [3.2, 3.8, 3.0, 4.2];

const PARTS = [
  {
    id: "tip",
    label: "Tip",
    code: "hotspot / pointer position",
    userDesc:
      "The sharp point of the arrow. Everything you click lands here — it is the part of the cursor that actually 'presses' the button, like a finger pressing a key.",
    builderDesc:
      "The tip is where the system reads the pointer position. The exact pixel is called the hotspot and every cursor carries its own pair of coordinates (NSCursor sets it via NSImage.hotSpot). In CSS you set it inside the url: url(cursor.svg) x y.",
  },
  {
    id: "hotspot",
    label: "Hotspot",
    code: "NSCursor.hotSpot / url(...) x y",
    userDesc:
      "The invisible single pixel that decides what you are pointing at. A giant cursor and a tiny one behave identically — only the hotspot counts.",
    builderDesc:
      "The hotspot is a coordinate pair stored with the cursor image. The browser hit-tests which element sits under that one pixel, and the CSS cursor value of that element is what you see. That is why a cursor can change shape instantly as you cross an element's edge.",
  },
  {
    id: "body",
    label: "Body & shadow",
    code: "vector fill + drop shadow",
    userDesc:
      "The arrow's mass and its soft shadow. The shadow makes the pointer look like it floats above the content — 'I am the user's hand, not part of the page'.",
    builderDesc:
      "The body is just a filled vector path (one <path> element). The shadow is the same path drawn again, offset a pixel and made translucent. Both are baked into the cursor image — there is no real 3D or depth at runtime.",
  },
  {
    id: "crossbars",
    label: "I-beam crossbars",
    code: "CSS: text",
    userDesc:
      "The two little caps at top and bottom of the text cursor. Their only job is to make the thin line easy to spot between letters, so you never lose where you are about to type.",
    builderDesc:
      "An I-beam is three rectangles drawn together: a tall thin stem plus two wide caps. CSS ships the whole shape for free with cursor: text — you never draw it yourself. It appears over any region an element marks as text-editable.",
  },
  {
    id: "stem",
    label: "I-beam stem",
    code: "CSS: text / caret",
    userDesc:
      "The thin vertical line that sits between two characters. It shows exactly where your next typed character will appear — the mouse's answer to the blinking caret you see while typing.",
    builderDesc:
      "The stem is a tall thin rect whose center is the hotspot. When you click, the browser moves the insertion caret (the blinking line) to that spot — see the Insertion Caret session for that half of the pair. The cursor and the caret are two separate things that work together.",
  },
  {
    id: "finger",
    label: "Pointing finger",
    code: "CSS: pointer",
    userDesc:
      "The hand that promises a click. The moment it appears, users know the thing below is interactive — a link, a button, a row in a list.",
    builderDesc:
      "cursor: pointer is the single most important cursor in web UI: it is the standard promise of clickability. AppKit names it NSCursor.pointingHand. Note the hand is decorative — real link semantics must come from a real <a href>, so the keyboard and screen readers work too.",
  },
  {
    id: "slash",
    label: "Slash — not allowed",
    code: "CSS: not-allowed",
    userDesc:
      "The no-entry sign. Drag something where it cannot go and the pointer turns into a circle with a diagonal slash — 'this action is not allowed here'.",
    builderDesc:
      "CSS: cursor: not-allowed; AppKit: NSCursor.operationNotAllowed. It appears most often during drag-and-drop: the drop target decides to reject the payload and tells the browser to show this shape. You set it on elements that are disabled or on drop zones that refuse a drag.",
  },
];

const ZONES: { label: string; hint: string; key: ShapeKey; klass: string }[] = [
  {
    label: "Type here",
    hint: "ibeam · text",
    key: "ibeam",
    klass: "rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium",
  },
  {
    label: "A link to click",
    hint: "hand · pointer",
    key: "hand",
    klass: "rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-sky-600 underline underline-offset-4",
  },
  {
    label: "Drag the divider",
    hint: "ew · ew-resize",
    key: "ew",
    klass: "rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium",
  },
  {
    label: "Disabled button",
    hint: "slash · not-allowed",
    key: "notAllowed",
    klass: "cursor-not-allowed rounded-xl border border-stone-200 bg-stone-100 px-4 py-3 text-sm font-medium text-stone-400",
  },
  {
    label: "Draw on the canvas",
    hint: "crosshair",
    key: "crosshair",
    klass: "rounded-xl border border-stone-300 border-dashed bg-white px-4 py-3 text-sm font-medium",
  },
  {
    label: "Drag me around",
    hint: "move",
    key: "move",
    klass: "rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium shadow-sm",
  },
];

function AnatomyDiagram() {
  const [selected, setSelected] = useState<string>("tip");
  const part = PARTS.find((p) => p.id === selected) ?? PARTS[0];

  const pills = [
    { id: "tip", n: 1, pos: "left-[10px] top-[16px]", line: "M152 40 L78 132", target: "left-[70px] top-[130px]" },
    { id: "hotspot", n: 2, pos: "left-[10px] top-[236px]", line: "M152 254 L78 134" },
    { id: "body", n: 3, pos: "left-[40px] top-[300px]", line: "M176 316 L150 208" },
    { id: "crossbars", n: 4, pos: "left-[290px] top-[36px]", line: "M424 56 L376 142" },
    { id: "stem", n: 5, pos: "left-[416px] top-[250px]", line: "M482 268 L388 200" },
    { id: "finger", n: 6, pos: "left-[520px] top-[12px]", line: "M656 32 L568 100" },
    { id: "slash", n: 7, pos: "left-[736px] top-[232px]", line: "M802 250 L692 246" },
  ];

  return (
    <div className="mt-4">
      <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="relative mx-auto h-[340px] w-[880px]">
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {pills.map((p) => (
              <g key={p.id}>
                <path d={p.line} stroke={selected === p.id ? "#7c3aed" : "#d6d3d1"} strokeWidth={selected === p.id ? 2 : 1.5} />
                <circle r="3" fill={selected === p.id ? "#7c3aed" : "#a8a29e"} />
              </g>
            ))}
          </svg>

          <div className="absolute left-[70px] top-[130px]" style={{ cursor: DEFS.arrow.css }}>
            <svg width="110" height="110" viewBox="0 0 32 32" dangerouslySetInnerHTML={{ __html: DEFS.arrow.svg }} />
          </div>
          <div className="absolute left-[330px] top-[140px]" style={{ cursor: DEFS.ibeam.css }}>
            <svg width="90" height="90" viewBox="0 0 32 32" dangerouslySetInnerHTML={{ __html: DEFS.ibeam.svg }} />
          </div>
          <div className="absolute left-[540px] top-[90px]" style={{ cursor: DEFS.hand.css }}>
            <svg width="80" height="80" viewBox="0 0 32 32" dangerouslySetInnerHTML={{ __html: DEFS.hand.svg }} />
          </div>
          <div className="absolute left-[600px] top-[200px]" style={{ cursor: DEFS.notAllowed.css }}>
            <svg width="100" height="100" viewBox="0 0 32 32" dangerouslySetInnerHTML={{ __html: DEFS.notAllowed.svg }} />
          </div>

          {pills.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`absolute ${p.pos} flex items-center gap-2 rounded-full border bg-white py-1 pl-1 pr-3 text-xs font-semibold shadow-sm transition-all hover:shadow-md ${
                selected === p.id ? "border-violet-400 ring-2 ring-violet-200" : "border-stone-200"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white ${
                  selected === p.id ? "bg-violet-500" : "bg-stone-400"
                }`}
              >
                {p.n}
              </span>
              {PARTS.find((x) => x.id === p.id)!.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="font-mono text-[11px] uppercase tracking-widest text-stone-400">What you see</p>
          <h4 className="mt-1 text-sm font-bold text-stone-800">
            {part.label} <span className="ml-1 font-mono text-xs font-normal text-stone-400">{part.code}</span>
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{part.userDesc}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-stone-900 p-5 shadow-sm">
          <p className="font-mono text-[11px] uppercase tracking-widest text-stone-500">How it works</p>
          <h4 className="mt-1 text-sm font-bold text-stone-100">For the builder</h4>
          <p className="mt-2 text-sm leading-relaxed text-stone-300">{part.builderDesc}</p>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <p className="font-mono text-xs uppercase tracking-widest text-stone-400">macOS component · web approximation</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-stone-900">Pointer (Cursor)</h1>
        <p className="mt-2 text-sm text-stone-500">
          Also called: <span className="font-medium text-stone-700">cursor, mouse pointer, mouse cursor</span> — and, in
          the words people actually use: &ldquo;the arrow turns into a hand over links&rdquo;, &ldquo;double-sided arrow
          when resizing&rdquo;, &ldquo;mouse becomes a no-entry sign&rdquo;.
        </p>
        <p className="mt-3 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          This entry is native macOS UI — AppKit sets these shapes with <code className="font-mono">NSCursor</code> and
          views claim screen regions with <code className="font-mono">NSView.addCursorRect(_:cursor:)</code>. On the web
          the same shapes come from the CSS <code className="font-mono">cursor</code> property — and, as shown below,
          the cursors here are hand-built multicolor SVGs fed through <code className="font-mono">url(data:image/svg+xml,…)</code>.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "One pointer, many shapes",
              d: "The pointer is one input device, but it wears a different costume in every context: an I-beam over text, a hand over a link, double arrows over a divider. The shape is a promise about what the next click or drag will do.",
            },
            {
              t: "Hotspot — the one true pixel",
              d: "Every cursor, however big, hits the screen at exactly one pixel: the hotspot. For the arrow it is the tip; for the I-beam, the center. That single pixel decides which element you are pointing at.",
            },
            {
              t: "Cursor rects & the stuck cursor",
              d: "On macOS, views claim regions (addCursorRect) and the system picks the shape. When a claim goes stale, the pointer gets stuck — the classic 'stuck as I-beam' bug. The web equivalent: a cursor style that never gets cleared.",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-stone-800">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{c.d}</p>
            </div>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold tracking-tight text-stone-900">Anatomy of the pointer</h2>
          <p className="mt-1 text-sm text-stone-500">
            Click a numbered pill to read its two-layer explanation — or hover the shapes and feel their real cursors.
          </p>
          <AnatomyDiagram />
        </section>

        <section className="mt-20">
          <h2 className="text-2xl font-extrabold tracking-tight text-stone-900">Every shape the pointer takes</h2>
          <p className="mt-1 max-w-2xl text-sm text-stone-500">
            16 hand-built cursors, one color each, each walking a mouse-trail of its own.{" "}
            <span className="font-medium text-stone-700">Hover a card to feel its real cursor</span> — the CSS
            <code className="mx-1 font-mono">cursor</code> property swaps in the SVG through a data URI.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SHAPE_ORDER.map((k, i) => {
              const d = DEFS[k];
              const trail = TRAILS[i % TRAILS.length];
              const dur = DURATIONS[i % DURATIONS.length];
              return (
                <div
                  key={k}
                  className="group rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  style={{ cursor: d.css }}
                >
                  <div className="relative h-[100px] w-[200px] overflow-hidden rounded-xl bg-stone-100">
                    <svg viewBox="0 0 200 100" className="absolute inset-0 h-full w-full">
                      <path d={trail.d} fill="none" stroke="#d6d3d1" strokeWidth={2} strokeDasharray="5 7" />
                      <circle cx={trail.x} cy={trail.y} r={3} fill="#a8a29e" />
                    </svg>
                    <div
                      className="absolute left-0 top-0"
                      style={{
                        transformOrigin: "0 0",
                        offsetPath: `path('${trail.d}')`,
                        animation: `pc-travel ${dur}s ease-in-out infinite alternate`,
                      }}
                    >
                      <svg width={26} height={26} viewBox="0 0 32 32" dangerouslySetInnerHTML={{ __html: d.svg }} />
                    </div>
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-stone-800">{d.name}</p>
                      <p className="text-xs text-stone-500">{d.meaning}</p>
                    </div>
                    <span
                      className="mt-0.5 h-3 w-3 shrink-0 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: d.color }}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="rounded-md bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] text-stone-600">
                      cursor: {d.cssKw}
                    </span>
                    <span className="rounded-md bg-violet-50 px-1.5 py-0.5 font-mono text-[10px] text-violet-700">
                      {d.appkit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold tracking-tight text-stone-900">Feel the real thing</h2>
          <p className="mt-1 text-sm text-stone-500">
            Six contexts, six promises. Move your pointer over each zone — the cursor you see is the very shape above,
            telling you what this spot is for.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {ZONES.map((z) => (
              <div key={z.label} className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
                <div className={z.klass} style={{ cursor: DEFS[z.key].css }}>
                  {z.label}
                </div>
                <p className="mt-2 font-mono text-[11px] text-stone-400">{z.hint}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-2xl font-extrabold tracking-tight text-stone-900">Where it lives</h2>
          <p className="mt-1 text-sm text-stone-500">
            Three real products, three different ways the pointer does its job.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                href: "/scenarios/text-editor/",
                t: "Aurora Editor",
                d: "Code editor: I-beams over code, draggable split divider, and a live 'stale cursor rect' bug to hunt.",
              },
              {
                href: "/scenarios/design-tool/",
                t: "Canvas Studio",
                d: "Design tool: crosshairs, grab-to-pan, resize handles, and Alt-drag duplication.",
              },
              {
                href: "/scenarios/web-builder/",
                t: "Hover Inspector",
                d: "A mock shop page plus a panel that reads out every cursor you meet in real time.",
              },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
              >
                <p className="text-sm font-bold text-violet-700 group-hover:underline">{s.t} →</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{s.d}</p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-20 border-t border-stone-200 pt-6 text-xs text-stone-400">
          NameThatUi · Pointer (Cursor) · macOS entry approximated on the web — CSS <code className="font-mono">cursor</code>{" "}
          with hand-built SVG data-URI cursors, the web equivalent of <code className="font-mono">NSCursor</code> +
          cursor rects.
        </footer>
      </div>
    </main>
  );
}
