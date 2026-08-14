"use client";

import { useRef, useState } from "react";
import Link from "next/link";

type CursorKey =
  | "text"
  | "hand"
  | "notAllowed"
  | "col"
  | "move"
  | "help"
  | "copy"
  | "arrow";

const ARROW =
  "M0 0 L0 22 L5.5 17.5 L8.5 21.5 L11 19 L8 15.5 L14 15 Z";

const filled = (d: string, c: string) =>
  `<path d="${d}" fill="white" stroke="white" stroke-width="4" stroke-linejoin="round"/><path d="${d}" fill="${c}" stroke="#292524" stroke-width="1.2" stroke-linejoin="round"/>`;

const stroked = (d: string, c: string, w = 3.2) =>
  `<path d="${d}" stroke="white" stroke-width="${w + 3.6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

const wrap = (inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">${inner}</svg>`;

interface CursorDef {
  name: string;
  color: string;
  cssKw: string;
  appkit: string;
  userWhy: string;
  builderLine: string;
  css: string;
}

const CURSORS: Record<CursorKey, CursorDef> = {
  text: {
    name: "I-beam",
    color: "#7c3aed",
    cssKw: "text",
    appkit: "NSCursor.iBeam",
    userWhy: "This region is editable — click here to place your cursor and type.",
    builderLine:
      "The browser shows it over any element with contenteditable or inside a form field. You rarely set it yourself.",
    css: `url("data:image/svg+xml,${encodeURIComponent(
      wrap(filled("M15 5.5 L17 5.5 L17 26.5 L15 26.5 Z", "#7c3aed") + filled("M13 2 L19 2 L19 5 L13 5 Z", "#7c3aed") + filled("M13 27 L19 27 L19 30 L13 30 Z", "#7c3aed"))
    )}") 16 16, auto`,
  },
  hand: {
    name: "Pointing hand",
    color: "#d97706",
    cssKw: "pointer",
    appkit: "NSCursor.pointingHand",
    userWhy: "A link — clicking will take you somewhere.",
    builderLine:
      "cursor: pointer on any clickable element. The hand is a promise; make sure the element is really interactive.",
    css: `url("data:image/svg+xml,${encodeURIComponent(
      wrap(filled("M8 14 L19 14 L19 25 C19 26.9 17.8 28.4 16 28.4 L11 28.4 C9.2 28.4 8 26.9 8 25 Z", "#d97706") + filled("M12.5 5.5 L15.5 5.5 L15.5 15 L12.5 15 Z", "#d97706") + filled("M8 20 L5.5 20 L5.5 23.5 L8 23.5 Z", "#d97706"))
    )}") 14 8, auto`,
  },
  notAllowed: {
    name: "Operation not allowed",
    color: "#dc2626",
    cssKw: "not-allowed",
    appkit: "NSCursor.operationNotAllowed",
    userWhy: "This button is disabled — clicking here will do nothing.",
    builderLine:
      "Put cursor: not-allowed on disabled controls. Pair it with the disabled attribute so the shape and the behavior agree.",
    css: `url("data:image/svg+xml,${encodeURIComponent(
      wrap(`<circle cx="16" cy="16" r="11.5" fill="white" stroke="white" stroke-width="4"/><circle cx="16" cy="16" r="11.5" fill="none" stroke="#dc2626" stroke-width="2.4"/>` + stroked("M7 7 L25 25", "#dc2626", 5))
    )}") 16 16, auto`,
  },
  col: {
    name: "Resize column",
    color: "#0284c7",
    cssKw: "col-resize",
    appkit: "NSCursor.resizeLeftRight",
    userWhy: "This border can be dragged — resize the column to fit the content you care about.",
    builderLine:
      "cursor: col-resize on table column borders. The shape tells the user a drag will work before they try it.",
    css: `url("data:image/svg+xml,${encodeURIComponent(
      wrap(stroked("M5 16 L27 16 M9 11 L14 16 L9 21 M23 11 L18 16 L23 21", "#0284c7"))
    )}") 16 16, auto`,
  },
  move: {
    name: "Move",
    color: "#4f46e5",
    cssKw: "move",
    appkit: "custom / NSCursor.openHand",
    userWhy: "This card can be repositioned — grab it and drag.",
    builderLine:
      "cursor: move on draggable elements. Keep the shape for the whole drag so the user knows it is still grabby.",
    css: `url("data:image/svg+xml,${encodeURIComponent(
      wrap(stroked("M16 9 L16 3 M13 6 L16 3 L19 6 M16 23 L16 29 M13 26 L16 29 L19 26 M9 16 L3 16 M6 13 L3 16 L6 19 M23 16 L29 16 M26 13 L29 16 L26 19", "#4f46e5") + `<rect x="14" y="14" width="4" height="4" rx="1" fill="#4f46e5"/>`)
    )}") 16 16, auto`,
  },
  help: {
    name: "Help",
    color: "#a21caf",
    cssKw: "help",
    appkit: "— (no standard NSCursor)",
    userWhy: "More information is available here.",
    builderLine:
      "cursor: help over '?' affordances. Classic on Windows; macOS has no standard help cursor, so it is a web habit.",
    css: `url("data:image/svg+xml,${encodeURIComponent(
      wrap(`<circle cx="16" cy="16" r="11" fill="white" stroke="white" stroke-width="4"/><circle cx="16" cy="16" r="11" fill="none" stroke="#a21caf" stroke-width="2.6"/><text x="16" y="21" text-anchor="middle" font-size="15" font-family="Arial, sans-serif" font-weight="800" fill="#a21caf">?</text>`)
    )}") 16 16, auto`,
  },
  copy: {
    name: "Copy / duplicate",
    color: "#db2777",
    cssKw: "copy",
    appkit: "NSCursor.dragCopy",
    userWhy: "Dragging this will copy it, not move it — the plus badge is the promise.",
    builderLine:
      "The plus badge appears in drag-and-drop when the drop target declares a copy effect. On the web you set cursor: copy while dragging.",
    css: `url("data:image/svg+xml,${encodeURIComponent(
      wrap(filled(ARROW, "#db2777") + `<circle cx="24.5" cy="24.5" r="6.5" fill="white" stroke="white" stroke-width="3"/><circle cx="24.5" cy="24.5" r="6.5" fill="none" stroke="#db2777" stroke-width="2"/><path d="M21.5 24.5 L27.5 24.5 M24.5 21.5 L24.5 27.5" stroke="#db2777" stroke-width="2.4" stroke-linecap="round"/>`)
    )}") 0 0, auto`,
  },
  arrow: {
    name: "Arrow",
    color: "#64748b",
    cssKw: "default",
    appkit: "NSCursor.arrow",
    userWhy: "Nothing special here — the everyday pointer.",
    builderLine:
      "The default. Zones that do nothing special should simply leave the cursor alone.",
    css: `url("data:image/svg+xml,${encodeURIComponent(wrap(filled(ARROW, "#64748b")))}") 0 0, auto`,
  },
};

const NAV = [
  { href: "/", label: "Hub" },
  { href: "/scenarios/text-editor/", label: "Aurora Editor" },
  { href: "/scenarios/design-tool/", label: "Canvas Studio" },
  { href: "/scenarios/web-builder/", label: "Hover Inspector" },
];

function Inspector({ current }: { current: CursorKey | null }) {
  const d = current ? CURSORS[current] : null;
  return (
    <aside className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-100 px-5 py-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stone-400">Hover Inspector</p>
        <h2 className="mt-0.5 text-sm font-bold text-stone-800">Live cursor readout</h2>
      </div>
      {d ? (
        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full ring-2 ring-white" style={{ backgroundColor: d.color }} />
            <p className="text-lg font-extrabold text-stone-900">{d.name}</p>
          </div>
          <p className="mt-1 text-sm text-stone-600">{d.userWhy}</p>
          <div className="mt-4 space-y-2 rounded-xl bg-stone-50 p-3 font-mono text-xs">
            <p className="text-stone-500">
              CSS <span className="ml-1 text-stone-800">cursor: {d.cssKw}</span>
            </p>
            <p className="text-stone-500">
              AppKit <span className="ml-1 text-stone-800">{d.appkit}</span>
            </p>
          </div>
          <div className="mt-3 rounded-xl bg-violet-50 p-3 text-xs leading-relaxed text-violet-900">
            <span className="font-bold">For the builder: </span>
            {d.builderLine}
          </div>
        </div>
      ) : (
        <div className="px-5 py-10 text-center">
          <svg width="34" height="34" viewBox="0 0 32 32" className="mx-auto" dangerouslySetInnerHTML={{ __html: CURSORS.arrow.css.includes("url") ? "" : "" }} />
          <div className="mx-auto w-fit" style={{ cursor: CURSORS.arrow.css }}>
            <svg width="30" height="30" viewBox="0 0 32 32" dangerouslySetInnerHTML={{ __html: filled(ARROW, "#d6d3d1") }} />
          </div>
          <p className="mt-3 text-sm text-stone-400">Move your pointer over the page →</p>
        </div>
      )}
    </aside>
  );
}

export default function Page() {
  const [current, setCurrent] = useState<CursorKey | null>(null);
  const [colPct, setColPct] = useState(38);
  const [cardPos, setCardPos] = useState({ x: 0, y: 0 });
  const [helpOpen, setHelpOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ kind: "col" | "card" | "copy"; startX: number; startY: number; base: number; cardStart: { x: number; y: number }; armed: boolean } | null>(null);

  const zone = (k: CursorKey) => ({
    onPointerEnter: () => setCurrent(k),
    onPointerLeave: () => setCurrent(null),
    style: { cursor: CURSORS[k].css },
  });

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    if (d.kind === "copy" && !d.armed && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 6) {
      d.armed = true;
    }
    if (d.kind === "col" && tableRef.current) {
      const rect = tableRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setColPct(Math.min(72, Math.max(15, pct)));
    }
    if (d.kind === "card" && frameRef.current) {
      const rect = frameRef.current.getBoundingClientRect();
      setCardPos({
        x: Math.min(140, Math.max(-140, d.cardStart.x + (e.clientX - d.startX))),
        y: Math.min(90, Math.max(-90, d.cardStart.y + (e.clientY - d.startY))),
      });
    }
  };

  const endDrag = () => {
    if (dragRef.current?.kind === "copy" && dragRef.current.armed) {
      setToast("Recipe duplicated into your cart ✓");
      setTimeout(() => setToast(null), 2500);
    }
    dragRef.current = null;
  };

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-14">
        <nav className="flex flex-wrap items-center gap-2 text-xs">
          {NAV.map((n, i) => (
            <span key={n.href} className="flex items-center gap-2">
              {i > 0 && <span className="text-stone-300">/</span>}
              <Link href={n.href} className="rounded-md px-2 py-1 font-medium text-stone-500 transition hover:bg-white hover:text-emerald-700 hover:shadow-sm">
                {n.label}
              </Link>
            </span>
          ))}
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-stone-400">
              macOS NSCursor · approximated on the web with CSS cursor + SVG data URIs
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-900">Hover Inspector</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-500">
              Every cursor you meet has a name, a CSS keyword, an AppKit equivalent, and a reason. Explore the shop
              page below — the panel on the right reads out the current one in real time.
            </p>

            <div
              ref={frameRef}
              className="relative mt-6 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
            >
              <div className="flex items-center justify-between border-b border-stone-100 px-6 py-3">
                <p className="text-sm font-extrabold tracking-tight text-stone-900">
                  Alder &amp; Ember <span className="font-normal text-stone-400">Roastery</span>
                </p>
                <div className="flex gap-4 text-xs font-medium text-stone-500">
                  <span {...zone("hand")}>Our story</span>
                  <span {...zone("hand")}>Brew guides</span>
                  <span {...zone("hand")}>Subscribe</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-2">
                  <h2 className="text-xl font-bold text-stone-900">Slow coffee, fast mornings</h2>
                  <button
                    {...zone("help")}
                    onClick={() => setHelpOpen((v) => !v)}
                    className="relative mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 font-mono text-[11px] font-bold text-stone-500 transition hover:bg-stone-200"
                    aria-label="Help"
                  >
                    ?
                    {helpOpen && (
                      <span className="absolute left-6 top-0 z-10 w-56 rounded-xl border border-stone-200 bg-white p-3 text-left text-xs leading-relaxed text-stone-600 shadow-lg">
                        The <code className="font-mono text-fuchsia-700">help</code> cursor promises extra
                        information. On classic systems it was the question-mark cursor — here it is a hint
                        that this little button explains something.
                      </span>
                    )}
                  </button>
                </div>
                <p {...zone("text")} className="mt-2 max-w-lg text-sm leading-relaxed text-stone-500">
                  We roast in small batches, and we think your morning deserves better than a brown liquid of
                  unknown origin. Click into this paragraph — the I-beam marks every editable spot on the page.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    {...zone("notAllowed")}
                    disabled
                    className="cursor-not-allowed rounded-full bg-stone-200 px-4 py-2 text-xs font-semibold text-stone-400"
                  >
                    Add to cart — sold out
                  </button>
                  <span
                    {...zone("copy")}
                    onPointerDown={(e) => {
                      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                      dragRef.current = { kind: "copy", startX: e.clientX, startY: e.clientY, base: 0, cardStart: { x: 0, y: 0 }, armed: false };
                    }}
                    className="inline-flex cursor-copy items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-300"
                  >
                    <svg width="11" height="11" viewBox="0 0 32 32" dangerouslySetInnerHTML={{ __html: filled(ARROW, "#db2777") }} />
                    Drag this recipe to your cart
                  </span>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-stone-400">Brew guides</p>
                  <div ref={tableRef} className="mt-2 overflow-hidden rounded-xl border border-stone-200">
                    <div className="flex text-left text-xs font-bold text-stone-500">
                      <div style={{ width: `${colPct}%` }} className="px-3 py-2">
                        Method
                      </div>
                      <div className="w-px shrink-0 bg-stone-200" {...zone("col")} onPointerDown={(e) => {
                        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                        dragRef.current = { kind: "col", startX: e.clientX, startY: e.clientY, base: colPct, cardStart: { x: 0, y: 0 }, armed: false };
                      }} />
                      <div className="flex-1 px-3 py-2">Ratio / Time</div>
                    </div>
                    {[
                      ["V60", "1:15 · 3:00"],
                      ["AeroPress", "1:12 · 2:00"],
                      ["French press", "1:16 · 4:00"],
                    ].map((row) => (
                      <div key={row[0]} className="flex border-t border-stone-100 text-sm text-stone-700">
                        <div style={{ width: `${colPct}%` }} className="truncate px-3 py-2">
                          {row[0]}
                        </div>
                        <div className="w-px shrink-0 bg-stone-200" {...zone("col")} />
                        <div className="flex-1 px-3 py-2 font-mono text-xs text-stone-500">{row[1]}</div>
                      </div>
                    ))}
                    <div className="border-t border-stone-100 px-3 py-2 font-mono text-[10px] text-stone-400">
                      Grab the divider between columns — it really resizes.
                    </div>
                  </div>
                </div>

                <div
                  {...zone("move")}
                  onPointerDown={(e) => {
                    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                    dragRef.current = { kind: "card", startX: e.clientX, startY: e.clientY, base: 0, cardStart: cardPos, armed: false };
                  }}
                  className="mt-6 inline-block cursor-move select-none rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 shadow-sm"
                  style={{ transform: `translate(${cardPos.x}px, ${cardPos.y}px)` }}
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-stone-400">Tasting notes</p>
                  <p className="mt-1 text-sm text-stone-600">
                    Stone fruit, brown sugar, and a finish that lasts exactly as long as a good idea should.
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-stone-400">This card is draggable — the move cursor says so.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm font-bold text-emerald-900">Why it fits here</p>
              <p className="mt-1 text-sm leading-relaxed text-emerald-800">
                On a content page the cursor is the user's only constant companion — the shape is a micro-promise
                about what each pixel does. Text says &ldquo;edit me&rdquo;, the hand says &ldquo;click me&rdquo;,
                the slash says &ldquo;save your click&rdquo;. An inspector like this trains the eye to read those
                promises, which is exactly how a designer or builder learns to place them deliberately — fewer
                dead zones, fewer misleading hands.
              </p>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <Inspector current={current} />
            {toast && (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-800 shadow-sm">
                {toast}
              </div>
            )}
          </div>
        </div>

        <footer className="mt-16 border-t border-stone-200 pt-6 text-xs text-stone-400">
          Scenario 3 of 3 — see also{" "}
          <Link href="/scenarios/text-editor/" className="font-medium text-emerald-700 hover:underline">
            Aurora Editor
          </Link>{" "}
          and{" "}
          <Link href="/scenarios/design-tool/" className="font-medium text-emerald-700 hover:underline">
            Canvas Studio
          </Link>{" "}
          · back to the <Link href="/" className="font-medium text-emerald-700 hover:underline">hub</Link>
        </footer>
      </div>
    </main>
  );
}
