"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import Link from "next/link";

type CursorName = "ibeam" | "pointer" | "copy" | "ew" | "notAllowed" | "text";

type CursorDef = {
  svg: string;
  hot: [number, number];
  color: string;
  label: string;
  zone: string;
};

function cursorSvg(fill: string, stroke: string, parts: string[]): string {
  const halo = 'fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" d="';
  const top = `fill="${fill}" stroke="${stroke}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" d="`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">${parts
    .map((d) => `<path ${halo}${d}"/><path ${top}${d}"/>`)
    .join("")}</svg>`;
}

const ARROW = "M0 0 L0 31 L7.7 24.7 L12 29.6 L15.5 26.8 L11.3 21.8 L19.7 21.1 Z";

const CURSORS: Record<CursorName, CursorDef> = {
  ibeam: {
    svg: cursorSvg("#8b5cf6", "#5b21b6", [
      "M13.5 6 L18.5 6 L18.5 9 L17 9 L17 23 L18.5 23 L18.5 26 L13.5 26 L13.5 23 L15 23 L15 9 L13.5 9 Z",
    ]),
    hot: [16, 16],
    color: "#8b5cf6",
    label: "Violet",
    zone: "code pane — where you type",
  },
  pointer: {
    svg: cursorSvg("#0284c7", "#075985", [ARROW]),
    hot: [0, 0],
    color: "#0284c7",
    label: "Sky",
    zone: "tabs · file list · line numbers",
  },
  copy: {
    svg: cursorSvg("#16a34a", "#14532d", [
      ARROW,
      "M19.5 11 L26.5 11 L26.5 14 L19.5 14 Z",
      "M23 7.5 L26 7.5 L26 17.5 L23 17.5 Z",
    ]),
    hot: [0, 0],
    color: "#16a34a",
    label: "Green",
    zone: "tab drag-to-duplicate",
  },
  ew: {
    svg: cursorSvg("#0d9488", "#115e59", [
      "M11 8 L5 16 L11 24 Z",
      "M21 8 L27 16 L21 24 Z",
      "M7 16 L25 16",
    ]),
    hot: [16, 16],
    color: "#0d9488",
    label: "Teal",
    zone: "split divider (drag it)",
  },
  notAllowed: {
    svg: cursorSvg("#dc2626", "#7f1d1d", [
      "M16 4.5 a11.5 11.5 0 1 0 0 23 a11.5 11.5 0 1 0 0 -23",
      "M6.87 25.13 L9.13 22.87 L25.13 6.87 L22.87 9.13 Z",
    ]),
    hot: [16, 16],
    color: "#dc2626",
    label: "Red",
    zone: "read-only file",
  },
  text: {
    svg: cursorSvg("#d97706", "#92400e", [
      "M14.5 6.5 L17.5 6.5 L17.5 25.5 L14.5 25.5 Z",
    ]),
    hot: [16, 16],
    color: "#d97706",
    label: "Amber",
    zone: "current-line highlight",
  },
};

const cssOf = (n: CursorName) =>
  `url("data:image/svg+xml,${encodeURIComponent(CURSORS[n].svg)}") ${CURSORS[n].hot[0]} ${CURSORS[n].hot[1]}, auto`;
const imgOf = (n: CursorName) => `data:image/svg+xml,${encodeURIComponent(CURSORS[n].svg)}`;

const kw = "text-violet-600";
const str = "text-emerald-600";
const typ = "text-sky-600";
const com = "text-zinc-400 italic";
const fn = "text-sky-700";

const CODE: ReactNode[] = [
  <>import {"{ useState }"} from <span className={str}>"react"</span>;</>,
  <>import {"{ CURSORS }"} from <span className={str}>"./lib/cursors"</span>;</>,
  <></>,
  <>
    <span className={kw}>export</span> <span className={kw}>function</span>{" "}
    <span className={fn}>EditorPane</span>({"{ file }: { file: "}
    <span className={typ}>FileMeta</span>
    {" } }) {"}
  </>,
  <>
    {"  "}<span className={kw}>const</span> [line, setLine] = <span className={fn}>useState</span>(0);
  </>,
  <>
    {"  "}<span className={com}>// AppKit claims this region as an I-beam</span>
  </>,
  <>
    {"  "}<span className={kw}>const</span> style = {"{ cursor: "}
    <span className={typ}>CursorShape</span>
    {".ibeam };"}
  </>,
  <></>,
  <>
    {"  "}<span className={kw}>return</span> (
  </>,
  <>
    {"    "}&lt;pre <span className={fn}>onMouseMove</span>={"{"}hover{"}"}&gt;
  </>,
  <>{"  );"}</>,
  <>{`}`}</>,
];

const FILES: { name: string; readonly?: boolean }[] = [
  { name: "app.tsx" },
  { name: "components/editor.tsx" },
  { name: "lib/cursors.ts", readonly: true },
  { name: "styles.css" },
];

function Nav() {
  const base = "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-150";
  return (
    <nav className="flex flex-wrap items-center gap-2">
      <Link href="/" className={`${base} border-zinc-200 bg-white text-zinc-600 hover:border-sky-300 hover:text-sky-700`}>
        Learning hub
      </Link>
      <Link
        href="/scenarios/text-editor/"
        className={`${base} border-sky-300 bg-sky-600 text-white`}
        aria-current="page"
      >
        Text editor
      </Link>
      <Link href="/scenarios/design-tool/" className={`${base} border-zinc-200 bg-white text-zinc-600 hover:border-sky-300 hover:text-sky-700`}>
        Design tool
      </Link>
      <Link href="/scenarios/web-builder/" className={`${base} border-zinc-200 bg-white text-zinc-600 hover:border-sky-300 hover:text-sky-700`}>
        Web builder
      </Link>
    </nav>
  );
}

export default function TextEditorScenario() {
  const [stuck, setStuck] = useState(false);
  const [dup, setDup] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [leftPct, setLeftPct] = useState(30);
  const [currentLine, setCurrentLine] = useState(6);
  const frameRef = useRef<HTMLDivElement>(null);

  const getCursor = (n: CursorName) => (stuck ? cssOf("ibeam") : cssOf(n));

  const onDividerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onDividerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging || !frameRef.current) return;
    const r = frameRef.current.getBoundingClientRect();
    setLeftPct(Math.min(80, Math.max(20, ((e.clientX - r.left) / r.width) * 100)));
  };
  const onDividerUp = () => setDragging(false);

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-zinc-900">
      <style>{`@keyframes ae-pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.3 } } .ae-pulse { animation: ae-pulse 1.1s ease-in-out infinite } @keyframes ae-rise { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } } .ae-rise { animation: ae-rise 0.25s ease-out both }`}</style>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <p className="font-mono text-[11px] tracking-wide text-zinc-500">
          macOS pattern — <span className="text-zinc-700">NSCursor</span> · approximated on the web with CSS
          cursor + SVG data-URI shapes
        </p>
        <div className="mt-4">
          <Nav />
        </div>

        <header className="mt-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            Aurora Editor — <span className="text-sky-600">the cursor that changes shape</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Hover the mock editor: every surface claims its own cursor shape, so you know before you click
            what a click will do. Then flip the bug switch and watch one stale claim poison the whole window.
          </p>
        </header>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-3">
              <button
                role="switch"
                aria-checked={stuck}
                onClick={() => setStuck(!stuck)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                  stuck ? "bg-amber-500" : "bg-zinc-300"
                }`}
                style={stuck ? { cursor: cssOf("ibeam") } : undefined}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                    stuck ? "translate-x-5" : ""
                  }`}
                />
              </button>
              <div>
                <p className="text-sm font-medium">Simulate stale cursor rect</p>
                <p className="font-mono text-[11px] text-zinc-400">window.invalidateCursorRects(for:) never called</p>
              </div>
            </div>
            <button
              onClick={() => setStuck(false)}
              disabled={!stuck}
              className={`rounded-lg border px-4 py-2 font-mono text-xs font-medium transition-colors duration-150 ${
                stuck
                  ? "border-sky-600 bg-sky-600 text-white hover:bg-sky-500"
                  : "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400"
              }`}
              style={stuck ? { cursor: cssOf("ibeam") } : undefined}
            >
              invalidateCursorRects()
            </button>
          </div>
        </div>

        {stuck && (
          <div className="ae-rise mt-4 flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
            <span className="ae-pulse h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500" />
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Bug #4271 — cursor stuck as I-beam everywhere.</span>{" "}
              AppKit is still honoring the old region claim; the window never rebuilt its cursor rects. Press{" "}
              <code className="rounded bg-amber-100 px-1 font-mono text-[11px]">invalidateCursorRects()</code>{" "}
              (or flip the switch off) to force a rebuild.
            </p>
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg shadow-zinc-200/60">
          <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50/80 px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <p className="font-mono text-[11px] text-zinc-500">Aurora Editor — ~/src/app.tsx · TypeScript</p>
          </div>

          <div className="flex items-end gap-1 bg-zinc-50 px-3 pt-2">
            <button
              onClick={() => setCurrentLine(6)}
              className="rounded-t-lg border border-b-0 border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-900"
              style={{ cursor: getCursor("pointer") }}
            >
              app.tsx
            </button>
            <button
              onMouseDown={() => setDup(true)}
              onMouseUp={() => setDup(false)}
              onMouseLeave={() => setDup(false)}
              title="Drag to duplicate this tab"
              className="rounded-t-lg border border-b-0 border-zinc-200 bg-zinc-100 px-4 py-2 text-xs font-medium text-zinc-500 transition-colors duration-150 hover:text-zinc-800"
              style={{ cursor: dup ? getCursor("copy") : getCursor("pointer") }}
            >
              editor.tsx <span className="ml-1 font-mono text-[9px] text-zinc-400">⧉ drag</span>
            </button>
            <button
              className="mb-1 ml-1 flex h-6 w-6 items-center justify-center rounded-md text-sm text-zinc-400 transition-colors duration-150 hover:bg-zinc-200 hover:text-zinc-600"
              style={{ cursor: getCursor("pointer") }}
              aria-label="New file"
            >
              +
            </button>
          </div>

          <div ref={frameRef} className="flex h-[420px]">
            <aside
              className="flex min-w-0 flex-col overflow-hidden border-r border-zinc-200 bg-white"
              style={{ flexBasis: `${leftPct}%` }}
            >
              <div className="px-3 pt-3">
                <p className="font-mono text-[10px] font-semibold tracking-widest text-zinc-400">EXPLORER</p>
              </div>
              <div className="mt-1 flex-1 overflow-auto p-1.5">
                {FILES.map((f) => (
                  <button
                    key={f.name}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors duration-150 ${
                      f.readonly ? "bg-zinc-50 text-zinc-400" : "bg-sky-50/70 font-medium text-sky-900"
                    }`}
                    style={{ cursor: f.readonly ? getCursor("notAllowed") : getCursor("pointer") }}
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-[3px] ${f.readonly ? "bg-zinc-300" : "bg-sky-500"}`}
                    />
                    <span className="min-w-0 flex-1 truncate font-mono">{f.name}</span>
                    {f.readonly && (
                      <span className="shrink-0 rounded bg-zinc-200 px-1 font-mono text-[9px] text-zinc-500">
                        🔒 read-only
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-zinc-100 px-3 py-2">
                <p className="font-mono text-[10px] text-zinc-400">
                  Read-only files claim <span className="text-red-500">not-allowed</span>
                </p>
              </div>
            </aside>

            <div
              onPointerDown={onDividerDown}
              onPointerMove={onDividerMove}
              onPointerUp={onDividerUp}
              className="group relative w-1.5 shrink-0 bg-zinc-200 transition-colors duration-150 hover:bg-sky-400"
              style={{ cursor: dragging ? cssOf("ew") : getCursor("ew") }}
              title="Drag to resize the split"
            >
              <span className="absolute left-1/2 top-1/2 h-10 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded bg-zinc-300 transition-colors duration-150 group-hover:bg-white" />
            </div>

            <div className="flex min-w-0 flex-1 bg-white">
              <div className="select-none border-r border-zinc-100 py-3 text-right">
                {CODE.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentLine(i)}
                    className="block h-6 w-7 pr-2 text-center font-mono text-[11px] leading-6 text-zinc-400 transition-colors duration-150 hover:text-zinc-600"
                    style={{ cursor: getCursor("pointer") }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <pre
                className="min-w-0 flex-1 overflow-auto py-3 pl-2 pr-4 font-mono text-[13px] leading-6 text-zinc-800"
                style={{ cursor: getCursor("ibeam") }}
              >
                {CODE.map((line, i) => (
                  <div
                    key={i}
                    className={`-mx-2 rounded-sm px-2 ${
                      i === currentLine ? "bg-amber-100/70" : ""
                    }`}
                    style={i === currentLine ? { cursor: getCursor("text") } : undefined}
                  >
                    {line}
                  </div>
                ))}
              </pre>
            </div>
          </div>

          <div className="border-t border-zinc-200 bg-zinc-50/60 px-4 py-2.5">
            <p className="font-mono text-[11px] text-zinc-500">
              hover: tabs → arrow · code → <span className="text-violet-500">I-beam</span> · read-only file →{" "}
              <span className="text-red-500">⌀ not allowed</span> · press a tab to see the{" "}
              <span className="text-green-600">copy</span> cursor · drag the divider ↔ · click a line number
              to move the amber highlight (it claims the <span className="text-amber-600">text</span> cursor)
            </p>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">The six shapes on this page</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
            {(Object.keys(CURSORS) as CursorName[]).map((n) => (
              <div key={n} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3">
                <img
                  src={imgOf(n)}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-mono text-xs font-medium text-zinc-800">{n}</p>
                  <p className="truncate text-[11px] text-zinc-500">{CURSORS[n].zone}</p>
                </div>
                <div className="ml-auto shrink-0 text-right">
                  <p className="font-mono text-[10px] text-zinc-400">{CURSORS[n].label}</p>
                  <p className="font-mono text-[10px] text-zinc-300">hot {CURSORS[n].hot.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="font-mono text-[11px] font-semibold text-sky-600">1 · the claim</p>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              On macOS, a view claims a region with <code className="rounded bg-zinc-100 px-1 font-mono text-[11px]">NSView.addCursorRect(_:cursor:)</code>.
              The system draws that shape wherever the mouse sits inside the region — the shape follows the
              claim, not the pixels.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="font-mono text-[11px] font-semibold text-sky-600">2 · the stale-rect bug</p>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              AppKit caches those claims. If a region moves or changes without invalidation, the old shape
              lingers — the classic “cursor stuck” bug.{" "}
              <code className="rounded bg-zinc-100 px-1 font-mono text-[11px]">window.invalidateCursorRects(for:)</code>{" "}
              tells the window to re-ask every view.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="font-mono text-[11px] font-semibold text-sky-600">3 · the web equivalent</p>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              The web has no cursor cache — <code className="rounded bg-zinc-100 px-1 font-mono text-[11px]">cursor</code> is
              just a CSS style, and re-rendering replaces it instantly. The whole fix is “render the right
              style again”, which in React is one <code className="rounded bg-zinc-100 px-1 font-mono text-[11px]">setState</code>.
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-sky-100 bg-sky-50/60 p-5">
          <h2 className="text-sm font-semibold text-sky-900">Why it fits here</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-sky-900/80">
            An editor is a dense mix of typeable, clickable and draggable surfaces, and the cursor is the only
            affordance that previews what a surface will do before you commit to it. A changing shape means
            you never drag a tab when you meant to duplicate it, never try to edit a read-only file, and never
            resize a split by accident — fewer misclicks, fewer undo keystrokes, more flow.
          </p>
        </section>

        <div className="mt-10 border-t border-zinc-200 pt-6">
          <Nav />
        </div>
      </div>
    </div>
  );
}
