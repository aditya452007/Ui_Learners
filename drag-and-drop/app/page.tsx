"use client";

import Link from "next/link";
import { useState } from "react";
import { GripDots, ScenarioNav } from "./ScenarioNav";

type Col = "today" | "later";
type PartId = "grip" | "resize" | "line" | "highlight" | "ghost";

type Item = { id: string; title: string; tag: string };

const INITIAL_TODAY: Item[] = [
  { id: "t1", title: "Write launch notes", tag: "Writing" },
  { id: "t2", title: "Review pricing page", tag: "Design" },
  { id: "t3", title: "Book user interviews", tag: "Research" },
];

const INITIAL_LATER: Item[] = [
  { id: "l1", title: "Update onboarding email", tag: "Growth" },
  { id: "l2", title: "Archive old exports", tag: "Cleanup" },
];

const PARTS: {
  id: PartId;
  n: number;
  name: string;
  symbol: string;
  fragment: string;
  see: string;
  how: string;
}[] = [
  {
    id: "grip",
    n: 1,
    name: "Drag handle (grip)",
    symbol: 'draggable="true"',
    fragment:
      "a drag handle or grip on the draggable item (HTML draggable=\"true\"): a compact 3×3 dot matrix that clearly marks where to grab",
    see: "The patch of nine tiny dots on the left of every card. It says “grab here” the way a suitcase handle says pull — the rest of the card is content, the dots are the handle. Hover it and the cursor turns into a grabbing hand.",
    how: "Each card has the attribute draggable=\"true\" (an HTML setting that tells the browser this element may be dragged). When you press on the grip and move, the browser fires a dragstart event — something the user did — and the card becomes the thing being carried. Like picking up a mug by its handle instead of its rim: the dots mark the safe place to lift. Props here just means settings you hand the component; state is what it remembers between drags.",
  },
  {
    id: "resize",
    n: 2,
    name: "Selection resize handles",
    symbol: "pointer events",
    fragment:
      "selection resize handles using pointer events: small square controls on the selected object's corners and edges that resize it without acting as drag handles",
    see: "The eight little squares ringing the blue note card below the lists. Click the note once and they appear; drag any square and the note stretches from that side. They never move the note — they only reshape it, which is exactly how photo corners and slide boxes behave.",
    how: "These squares are not draggable at all — they listen for pointer events (press, move, release signals that work for mouse, touch and pen alike). When you press a corner, the code remembers the starting size, then on every pointermove adds how far you travelled to the width and height, and re-renders — draws the screen again — with the new size. Like pulling the corner of a sticker: the sticker stays on the same spot on the laptop, it just gets bigger.",
  },
  {
    id: "line",
    n: 3,
    name: "Drop indicator (insertion line)",
    symbol: "ondragover",
    fragment:
      "a drop indicator during ondragover: a clearly visible insertion line between items at the exact position where the dragged item will land",
    see: "The bright blue line with a dot that appears between two cards while you drag. It answers “exactly here” — release now and the card slides into that gap, pushing the others aside. No line, no promise: if you do not see it, dropping does nothing.",
    how: "While you drag over a gap, the browser fires ondragover events many times a second. Our handler calls preventDefault() — which literally gives permission to drop — and remembers which gap you are over as state. React then draws the line at that gap. Think of it like the blinking text cursor: it shows where the next thing will land before you commit.",
  },
  {
    id: "highlight",
    n: 4,
    name: "Drop-target highlight",
    symbol: "ondragover",
    fragment:
      "a drop-target highlight during ondragover: tint the whole valid destination or its precise split zone before the item is dropped",
    see: "The whole “Later” column washing light blue while your dragged card hovers over it. Where the insertion line says “this exact gap”, the wash says “this whole neighborhood accepts your card”. Invalid places stay grey, so you never guess.",
    how: "Same ondragover handler, second job: it also records which column you are over, and the column re-renders with a tinted background and ring when it matches. It is one if-statement picking a class name — no animation library. Like a mailbox slot glowing when your letter is close enough to post.",
  },
  {
    id: "ghost",
    n: 5,
    name: "Drag preview (ghost)",
    symbol: "DataTransfer.setDragImage()",
    fragment:
      "a drag preview or ghost (DataTransfer.setDragImage()): a lightweight translucent image of the dragged item that follows the pointer without obscuring the drop cues",
    see: "The small translucent copy of the card that sticks to your pointer mid-drag. The original card fades to a pale outline where it started, so you always know what is moving and where it came from. Toggle “custom ghost” off below and compare: the browser default is chunkier and hides the insertion line.",
    how: "On dragstart we call DataTransfer.setDragImage(element, x, y) — a browser API (a built-in tool the page can call) that says “follow the pointer with this picture, offset by x/y pixels”. We build a tiny lightweight card, hand it over, then delete it a moment later; the browser keeps showing its snapshot. Like holding a photocopy while the original stays on the desk — the copy is what your hand carries.",
  },
];

const API_CHIPS = [
  'draggable="true"',
  "ondragover",
  "ondrop",
  "DataTransfer.setDragImage()",
  "pointer events",
  "aria-live region",
  "no aria-grabbed",
];

function Num({ n, active }: { n: number; active?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white transition-colors ${
        active ? "bg-stone-900" : "bg-blue-600"
      }`}
    >
      {n}
    </span>
  );
}

function InsertionLine() {
  return (
    <div className="dnd-insertion flex items-center gap-1.5 px-1" aria-hidden="true">
      <span className="size-2 rounded-full bg-blue-600" />
      <span className="h-[3px] flex-1 rounded-full bg-blue-600" />
    </div>
  );
}

export default function Home() {
  const [today, setToday] = useState<Item[]>(INITIAL_TODAY);
  const [later, setLater] = useState<Item[]>(INITIAL_LATER);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<{ col: Col; index: number } | null>(null);
  const [ghostOn, setGhostOn] = useState(true);
  const [selected, setSelected] = useState<PartId>("grip");
  const [live, setLive] = useState(
    "Nothing picked up yet. Drag a card by its grip — or use the arrow buttons on any card."
  );
  const [noteW, setNoteW] = useState(264);
  const [noteH, setNoteH] = useState(128);
  const [noteSelected, setNoteSelected] = useState(true);

  const part = PARTS.find((p) => p.id === selected) ?? PARTS[0];
  const listOf = (c: Col) => (c === "today" ? today : later);

  const locate = (id: string): { col: Col; index: number; item: Item } | null => {
    const ti = today.findIndex((t) => t.id === id);
    if (ti >= 0) return { col: "today", index: ti, item: today[ti] };
    const li = later.findIndex((t) => t.id === id);
    if (li >= 0) return { col: "later", index: li, item: later[li] };
    return null;
  };

  const moveItem = (id: string, targetCol: Col, rawIndex: number, via: string) => {
    const src = locate(id);
    if (!src) return;
    const srcList = listOf(src.col).filter((t) => t.id !== id);
    const targetBase =
      src.col === targetCol ? srcList : listOf(targetCol).filter((t) => t.id !== id);
    const index = Math.max(0, Math.min(rawIndex, targetBase.length));
    const next = [...targetBase.slice(0, index), src.item, ...targetBase.slice(index)];
    if (targetCol === "today") {
      setToday(src.col === "today" ? next : next);
      if (src.col !== "today") {
        setToday(next);
        setLater(srcList);
      } else {
        setToday(next);
      }
    } else {
      if (src.col !== "later") {
        setLater(next);
        setToday(srcList);
      } else {
        setLater(next);
      }
    }
    const destName = targetCol === "today" ? "Today" : "Later";
    setLive(
      `${src.item.title} moved to ${destName}, position ${index + 1} of ${next.length} (${via}).`
    );
  };

  const handleDragStart = (
    e: React.DragEvent,
    item: Item,
    from: Col,
    index: number
  ) => {
    setDragId(item.id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", item.id);
    if (ghostOn) {
      const el = document.createElement("div");
      el.className = "dnd-ghost";
      el.innerHTML = `<div style="display:flex;align-items:center;gap:8px;background:#1c1917;color:#fff;font:600 13px system-ui;padding:9px 14px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.28);opacity:.92;white-space:nowrap">⠿ ${item.title}</div>`;
      document.body.appendChild(el);
      try {
        e.dataTransfer.setDragImage(el, 24, 20);
      } catch {
        /* older browsers ignore custom ghosts */
      }
      window.setTimeout(() => el.remove(), 0);
    }
    const dest = from === "today" ? "Today or Later" : "Later or Today";
    setLive(
      `Picked up ${item.title} from ${from === "today" ? "Today" : "Later"}, position ${index + 1}. Drag over ${dest}; the blue line shows where it will land.`
    );
  };

  const handleGapOver = (e: React.DragEvent, col: Col, index: number) => {
    if (!dragId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOver((prev) =>
      prev?.col === col && prev?.index === index ? prev : { col, index }
    );
  };

  const handleDrop = (e: React.DragEvent, col: Col, index: number) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || dragId;
    if (!id) return;
    moveItem(id, col, index, "drag and drop");
    setDragId(null);
    setOver(null);
  };

  const nudge = (id: string, dir: -1 | 1 | "left" | "right") => {
    const src = locate(id);
    if (!src) return;
    if (dir === "left" || dir === "right") {
      const target: Col = src.col === "today" ? "later" : "today";
      moveItem(id, target, listOf(target).length, "keyboard button");
      return;
    }
    moveItem(id, src.col, src.index + dir, "keyboard button");
  };

  const startResize = (
    e: React.PointerEvent,
    dir: { x: -1 | 0 | 1; y: -1 | 0 | 1 }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setNoteSelected(true);
    setSelected("resize");
    const sx = e.clientX;
    const sy = e.clientY;
    const sw = noteW;
    const sh = noteH;
    const onMove = (ev: PointerEvent) => {
      setNoteW(Math.max(184, Math.min(430, sw + dir.x * (ev.clientX - sx))));
      setNoteH(Math.max(96, Math.min(230, sh + dir.y * (ev.clientY - sy))));
    };
    const onUp = () => window.removeEventListener("pointermove", onMove);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  };

  const renderColumn = (col: Col, title: string, hint: string) => {
    const items = listOf(col);
    const active = dragId !== null && over?.col === col;
    return (
      <div
        onDragOver={(e) => handleGapOver(e, col, items.length)}
        onDrop={(e) => handleDrop(e, col, items.length)}
        className={`flex min-h-[248px] flex-1 flex-col rounded-xl border p-3 transition-colors ${
          active
            ? "border-blue-600 bg-blue-50/70 shadow-[0_0_0_2px_#2563eb33]"
            : "border-stone-200 bg-stone-50/60"
        } ${selected === "highlight" && dragId ? "ring-2 ring-blue-600 ring-offset-2 ring-offset-white" : ""}`}
      >
        <p className="flex items-center justify-between px-1 pb-1">
          <span className="text-[13px] font-semibold text-stone-800">{title}</span>
          <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[11px] text-stone-500 ring-1 ring-stone-200">
            {items.length}
          </span>
        </p>
        <p className="px-1 pb-2 text-[11px] text-stone-400">{hint}</p>

        {/* gap 0 */}
        <div
          onDragOver={(e) => handleGapOver(e, col, 0)}
          onDrop={(e) => handleDrop(e, col, 0)}
          className="min-h-[10px] rounded-md"
        >
          {dragId && over?.col === col && over.index === 0 && <InsertionLine />}
        </div>

        {items.map((item, i) => {
          const isDragging = dragId === item.id;
          const spotlightGrip = selected === "grip";
          return (
            <div key={item.id}>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, item, col, i)}
                onDragEnd={() => {
                  setDragId(null);
                  setOver(null);
                }}
                aria-label={`${item.title}. Press space on a move button to reorder with the keyboard.`}
                className={`group flex items-center gap-1 rounded-xl border bg-white px-1.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all hover:border-blue-600/40 hover:shadow-md ${
                  isDragging ? "dnd-dragging border-blue-600" : "border-stone-200"
                } ${spotlightGrip ? "ring-1 ring-blue-600/60" : ""}`}
              >
                <span className="flex items-center gap-1">
                  <GripDots />
                  <Num n={1} active={selected === "grip"} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-stone-900">
                    {item.title}
                  </span>
                  <span className="block font-mono text-[10px] text-stone-400">
                    {item.tag} · draggable=&quot;true&quot;
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-0.5 pr-1">
                  <button
                    type="button"
                    onClick={() => nudge(item.id, -1)}
                    aria-label={`Move ${item.title} up`}
                    title="Move up"
                    className="grid size-6 place-items-center rounded-md text-[13px] text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-800"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => nudge(item.id, 1)}
                    aria-label={`Move ${item.title} down`}
                    title="Move down"
                    className="grid size-6 place-items-center rounded-md text-[13px] text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-800"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => nudge(item.id, col === "today" ? "right" : "left")}
                    aria-label={`Send ${item.title} to ${col === "today" ? "Later" : "Today"}`}
                    title={col === "today" ? "Send to Later" : "Send to Today"}
                    className="grid size-6 place-items-center rounded-md text-[13px] text-stone-400 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    {col === "today" ? "→" : "←"}
                  </button>
                </span>
              </div>
              <div
                onDragOver={(e) => handleGapOver(e, col, i + 1)}
                onDrop={(e) => handleDrop(e, col, i + 1)}
                className="min-h-[10px] rounded-md"
              >
                {dragId && over?.col === col && over.index === i + 1 && (
                  <div
                    className={
                      selected === "line" ? "rounded-md ring-2 ring-blue-600 ring-offset-1" : ""
                    }
                  >
                    <InsertionLine />
                  </div>
                )}
                {!dragId && i === 0 && (
                  <p className="flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] text-stone-300">
                    <Num n={3} /> drop line appears here while dragging
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <p className="rounded-lg border border-dashed border-stone-300 bg-white/60 px-3 py-5 text-center text-[12px] text-stone-400">
            Empty — drop a card here.
          </p>
        )}
      </div>
    );
  };

  const handles: { id: string; style: React.CSSProperties; dir: { x: -1 | 0 | 1; y: -1 | 0 | 1 }; cursor: string }[] = [
    { id: "nw", style: { left: -6, top: -6 }, dir: { x: -1, y: -1 }, cursor: "nwse-resize" },
    { id: "n", style: { left: "50%", top: -6, marginLeft: -6 }, dir: { x: 0, y: -1 }, cursor: "ns-resize" },
    { id: "ne", style: { right: -6, top: -6 }, dir: { x: 1, y: -1 }, cursor: "nesw-resize" },
    { id: "e", style: { right: -6, top: "50%", marginTop: -6 }, dir: { x: 1, y: 0 }, cursor: "ew-resize" },
    { id: "se", style: { right: -6, bottom: -6 }, dir: { x: 1, y: 1 }, cursor: "nwse-resize" },
    { id: "s", style: { left: "50%", bottom: -6, marginLeft: -6 }, dir: { x: 0, y: 1 }, cursor: "ns-resize" },
    { id: "sw", style: { left: -6, bottom: -6 }, dir: { x: -1, y: 1 }, cursor: "nesw-resize" },
    { id: "w", style: { left: -6, top: "50%", marginTop: -6 }, dir: { x: -1, y: 0 }, cursor: "ew-resize" },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-10">
        <ScenarioNav current="/" />

        <header className="max-w-3xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-blue-700">
            Web · HTML draggable · ondragover · ondrop
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900">
            Drag &amp; Drop
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Also called: drag and drop, drag-and-drop interaction, direct
            manipulation, sortable drag
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-600">
            “Pick it up and put it there” is drag and drop —{" "}
            <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[13px] text-stone-800">
              draggable=&quot;true&quot;
            </code>
            . A grip says where to grab, a translucent{" "}
            <strong>ghost</strong> follows your pointer, and an{" "}
            <strong>insertion line</strong> or a{" "}
            <strong>highlighted target</strong> previews the landing before you
            let go. Drag a card below by its dot-grip and watch all five named
            parts work at once.
          </p>
        </header>

        <div className="flex flex-wrap gap-1.5">
          {API_CHIPS.map((c) => (
            <span
              key={c}
              className="rounded-full border border-stone-200 bg-white px-2.5 py-1 font-mono text-[11px] text-stone-600"
            >
              {c}
            </span>
          ))}
        </div>

        <section className="grid gap-3 sm:grid-cols-3">
          {[
            {
              t: "Grab → grip + ghost",
              d: "The 3×3 dots mark the handle; the ghost copy rides your pointer. The original fades so you never lose track of what is moving.",
              s: "parts ① + ⑤",
            },
            {
              t: "Aim → line + highlight",
              d: "The blue line promises the exact gap; the column wash promises the neighborhood. Both are drawn live during ondragover.",
              s: "parts ③ + ④",
            },
            {
              t: "Land → drop + announce",
              d: "Release (ondrop) moves the item and a live region speaks the result. Resize squares are separate: they reshape, never move.",
              s: "parts ② · ondrop · aria-live",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <p className="text-sm font-semibold text-stone-900">{c.t}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-stone-600">{c.d}</p>
              <p className="mt-2 font-mono text-[11px] text-stone-400">{c.s}</p>
            </div>
          ))}
        </section>

        {/* Live anatomy */}
        <section className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-blue-700">
              Live anatomy
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              Five named parts, one drag
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
              This is the real interaction, not a picture. Start dragging any
              card and the insertion line, the column highlight and the ghost
              all appear. Click the note to reveal its resize squares. Click any
              numbered pill to spotlight that part.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[13px] text-stone-700 transition-colors hover:border-blue-600/40">
              <input
                type="checkbox"
                checked={ghostOn}
                onChange={(e) => setGhostOn(e.target.checked)}
                className="size-4 accent-blue-600"
              />
              Custom ghost
              <span className="font-mono text-[11px] text-stone-400">
                setDragImage()
              </span>
            </label>
            <button
              type="button"
              onClick={() => {
                setToday(INITIAL_TODAY);
                setLater(INITIAL_LATER);
                setLive("Board reset to the starting order.");
              }}
              className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[13px] font-medium text-stone-600 transition-colors hover:border-blue-600/40 hover:text-blue-700"
            >
              Reset cards
            </button>
            <span className="font-mono text-[11px] text-stone-400">
              {dragId
                ? `dragging ${dragId} · over ${over ? `${over.col}[${over.index}]` : "—"}`
                : "not dragging — the line and wash only exist mid-drag"}
            </span>
          </div>

          <div className="grid gap-0 overflow-hidden rounded-2xl border border-stone-300/70 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)] lg:grid-cols-[1fr_288px]">
            <div className="flex flex-col gap-5 p-5 sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row">
                {renderColumn("today", "Today", "Sort here — watch the line")}
                {renderColumn("later", "Later", "Whole column lights up")}
              </div>

              {/* resize demo */}
              <div
                className={`rounded-xl border p-4 transition-shadow ${
                  selected === "resize"
                    ? "border-blue-600 shadow-[0_0_0_2px_#2563eb33]"
                    : "border-stone-200 bg-stone-50/60"
                }`}
              >
                <p className="flex items-center gap-2 text-[13px] font-semibold text-stone-800">
                  <Num n={2} active={selected === "resize"} />
                  Selected note — resize squares (pointer events, not drag)
                </p>
                <div className="mt-3 flex flex-wrap items-start gap-5">
                  <button
                    type="button"
                    onClick={() => {
                      setNoteSelected((v) => !v);
                      setSelected("resize");
                    }}
                    className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-[12px] font-medium text-stone-600 hover:border-blue-600/40 hover:text-blue-700"
                  >
                    {noteSelected ? "Deselect note" : "Select note"}
                  </button>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-stone-500">
                    <label className="flex items-center gap-1.5">
                      W
                      <input
                        type="range"
                        min={184}
                        max={430}
                        value={noteW}
                        onChange={(e) => setNoteW(Number(e.target.value))}
                        aria-label="Note width (keyboard resize)"
                        className="w-24 accent-blue-600"
                      />
                      {Math.round(noteW)}
                    </label>
                    <label className="flex items-center gap-1.5">
                      H
                      <input
                        type="range"
                        min={96}
                        max={230}
                        value={noteH}
                        onChange={(e) => setNoteH(Number(e.target.value))}
                        aria-label="Note height (keyboard resize)"
                        className="w-24 accent-blue-600"
                      />
                      {Math.round(noteH)}
                    </label>
                  </div>
                </div>
                <div className="mt-4 overflow-auto pb-3 pl-2 pr-6 pt-2">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Selected note. Drag a corner square to resize."
                    onClick={() => {
                      setNoteSelected(true);
                      setSelected("resize");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setNoteSelected((v) => !v);
                      }
                    }}
                    style={{ width: noteW, height: noteH }}
                    className={`relative rounded-xl border-2 bg-[#fffbeb] p-3.5 shadow-sm transition-colors ${
                      noteSelected ? "border-blue-600" : "border-amber-200"
                    }`}
                  >
                    <p className="text-[13px] font-semibold text-stone-900">
                      Sprint reminder
                    </p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-stone-500">
                      Drag a blue square to reshape me. Drag my grip to move me
                      — except I have no grip, so I cannot be dragged at all.
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-stone-400">
                      {Math.round(noteW)} × {Math.round(noteH)} · pointer events
                    </p>
                    {noteSelected &&
                      handles.map((h) => (
                        <span
                          key={h.id}
                          onPointerDown={(e) => startResize(e, h.dir)}
                          style={{ ...h.style, cursor: h.cursor }}
                          className="dnd-resize-handle"
                          aria-hidden="true"
                        />
                      ))}
                  </div>
                </div>
              </div>

              {/* ghost sample + live region */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div
                  className={`rounded-xl border p-3.5 transition-shadow ${
                    selected === "ghost"
                      ? "border-blue-600 shadow-[0_0_0_2px_#2563eb33]"
                      : "border-stone-200 bg-white"
                  }`}
                >
                  <p className="flex items-center gap-2 text-[13px] font-semibold text-stone-800">
                    <Num n={5} active={selected === "ghost"} />
                    Ghost sample
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-lg bg-white px-3 py-2 text-[12px] font-semibold text-stone-700 shadow-sm ring-1 ring-stone-200">
                      ⠿ Review pricing page
                    </span>
                    <span className="rounded-lg bg-stone-900 px-3 py-2 text-[12px] font-semibold text-white opacity-80 shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
                      ⠿ Review pricing page
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[10px] leading-relaxed text-stone-400">
                    left: resting card · right: the ghost that follows the
                    pointer (setDragImage)
                  </p>
                </div>
                <div className="rounded-xl bg-stone-900 p-3.5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone-400">
                    aria-live region · never aria-grabbed
                  </p>
                  <p role="status" aria-live="polite" className="mt-1.5 text-[13px] leading-relaxed text-stone-100">
                    {live}
                  </p>
                  <p className="mt-1.5 font-mono text-[10px] text-stone-500">
                    screen readers hear pick-up → destination → result
                  </p>
                </div>
              </div>
            </div>

            <aside className="flex flex-col gap-2 border-t border-stone-200 bg-stone-50/70 p-4 lg:border-l lg:border-t-0">
              <p className="px-2 pb-1 font-mono text-[11px] uppercase tracking-[0.14em] text-stone-400">
                Callouts — click to spotlight
              </p>
              {PARTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(selected === p.id ? "grip" : p.id)}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition ${
                    selected === p.id
                      ? "border-blue-600 bg-white shadow-sm"
                      : "border-transparent hover:border-stone-200 hover:bg-white"
                  }`}
                >
                  <Num n={p.n} active={selected === p.id} />
                  <span>
                    <span className="block text-[13px] font-semibold text-stone-900">
                      {p.name}
                    </span>
                    <span className="mt-1 block font-mono text-[11px] text-blue-700">
                      {p.symbol}
                    </span>
                  </span>
                </button>
              ))}
              <div className="rounded-2xl border border-stone-200 bg-white p-4 text-[13px] leading-relaxed text-stone-600">
                No{" "}
                <code className="rounded bg-stone-100 px-1 font-mono text-[12px] line-through">
                  aria-grabbed
                </code>{" "}
                anywhere — it is deprecated. Drag state and results are announced
                through the live region instead.
              </div>
            </aside>
          </div>

          {/* selected part explainer */}
          <div className="rounded-2xl border border-blue-600/25 bg-[#eff6ff] p-5">
            <p className="text-sm font-semibold text-stone-900">
              <span className="mr-2 inline-grid size-5 place-items-center rounded-full bg-blue-600 align-middle text-[11px] font-bold text-white">
                {part.n}
              </span>
              {part.name}{" "}
              <code className="ml-1 rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-blue-700">
                {part.symbol}
              </code>
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-white p-4 ring-1 ring-stone-200/60">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                  What you see
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-stone-700">
                  {part.see}
                </p>
              </div>
              <div className="rounded-xl bg-white p-4 ring-1 ring-stone-200/60">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                  How it works
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-stone-700">
                  {part.how}
                </p>
              </div>
            </div>
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-stone-500">
              “{part.fragment}”
            </p>
          </div>
        </section>

        {/* Every part */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-stone-900">
            Every named part, in plain words
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {PARTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p.id)}
                className={`rounded-xl border bg-white p-4 text-left transition-shadow hover:shadow-md ${
                  selected === p.id ? "border-stone-900 shadow-md" : "border-stone-200"
                }`}
              >
                <p className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                  <span
                    className={`grid size-5 place-items-center rounded-full text-[11px] font-bold text-white ${selected === p.id ? "bg-stone-900" : "bg-blue-600"}`}
                  >
                    {p.n}
                  </span>
                  {p.name}
                </p>
                <p className="mt-1 font-mono text-[11px] text-blue-700">{p.symbol}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-stone-600">
                  <strong className="font-semibold text-stone-800">What you see — </strong>
                  {p.see}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
                  <strong className="font-semibold text-stone-800">How it works — </strong>
                  {p.how}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* In code */}
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <h2 className="border-b border-stone-200 px-5 py-4 text-base font-semibold tracking-tight">
              The three permissions of HTML drag &amp; drop
            </h2>
            <ul className="divide-y divide-stone-100">
              {[
                {
                  q: "May this be carried?",
                  a: 'draggable="true" + ondragstart',
                  d: "Mark the item draggable, put its id into dataTransfer, build the ghost with setDragImage().",
                },
                {
                  q: "May it land here?",
                  a: "ondragover + preventDefault()",
                  d: "Without preventDefault the browser forbids the drop. Here is where the line and highlight are drawn.",
                },
                {
                  q: "It landed — now what?",
                  a: "ondrop moves state",
                  d: "Read the id back, splice it into the target list at the line's index, announce via the live region.",
                },
              ].map((r) => (
                <li key={r.a} className="flex items-start gap-3 px-5 py-3.5">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-600" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-stone-900">
                      {r.q} → <span className="font-mono text-[12px] text-blue-700">{r.a}</span>
                    </p>
                    <p className="text-[13px] text-stone-500">{r.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-900 text-stone-100 shadow-sm">
            <h2 className="border-b border-white/10 px-5 py-4 text-base font-semibold tracking-tight">
              In code — the whole handshake
            </h2>
            <div className="space-y-4 p-5 font-mono text-[12px] leading-relaxed">
              <div>
                <p className="mb-1 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-sky-300">
                  1 · Carry + ghost
                </p>
                <pre className="overflow-x-auto rounded-xl bg-white/5 p-3">{`<div draggable\n  onDragStart={(e) => {\n    e.dataTransfer.setData("text/plain", id);\n    e.dataTransfer.setDragImage(ghostEl, 24, 20);\n  }}>\n  <GripDots /> {title}\n</div>`}</pre>
              </div>
              <div>
                <p className="mb-1 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-sky-300">
                  2 · Preview the landing
                </p>
                <pre className="overflow-x-auto rounded-xl bg-white/5 p-3">{`<div\n  onDragOver={(e) => {\n    e.preventDefault(); // permission to drop\n    setOver({ col, index }); // draws line + wash\n  }}\n  onDrop={(e) => move(id, col, index)}>`}</pre>
              </div>
              <div>
                <p className="mb-1 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-sky-300">
                  3 · Announce, don&apos;t aria-grab
                </p>
                <pre className="overflow-x-auto rounded-xl bg-white/5 p-3">{`<div role="status" aria-live="polite">\n  {liveMessage} {/* picked up · moved · dropped */}\n</div>\n{/* resize squares: onPointerDown/Move/Up */}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Scenarios */}
        <section className="flex flex-col gap-3">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-blue-700">
            Where it belongs
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
            Three places drag &amp; drop earns its keep
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                href: "/scenarios/task-board/",
                tag: "insertion line · sortable",
                t: "Task board",
                d: "A three-column kanban where cards sort within and across lists — the insertion line does the talking, with keyboard arrows as backup.",
              },
              {
                href: "/scenarios/file-dropzone/",
                tag: "target highlight · split zone",
                t: "File triage",
                d: "An unsorted inbox dropped onto whole albums — plus a split top/bottom half and a real OS-file dropzone with a full-bleed wash.",
              },
              {
                href: "/scenarios/dashboard-canvas/",
                tag: "pointer drag · resize squares",
                t: "Dashboard canvas",
                d: "Free-form widgets dragged by their headers on pointer events and reshaped with eight resize squares — no HTML draggable at all.",
              },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-600/40 hover:shadow-md"
              >
                <p className="font-mono text-[11px] text-blue-700">{s.tag}</p>
                <p className="mt-1 text-[15px] font-semibold text-stone-900 group-hover:text-blue-700">
                  {s.t} →
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-stone-600">{s.d}</p>
              </Link>
            ))}
          </div>
          <p className="text-[13px] leading-relaxed text-stone-500">
            Keyboard note: every drag on this page has a button equivalent —
            arrow keys move cards, sliders resize the note, and the live region
            narrates each change. That is the accessible baseline the paste-ready
            prompt asks for: announce the picked-up item, the available
            destination, and the drop result.
          </p>
        </section>
      </div>
    </main>
  );
}
