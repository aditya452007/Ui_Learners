"use client";

import Link from "next/link";
import { useState } from "react";
import { GripDots, ScenarioNav, WhyFits } from "../../ScenarioNav";

type Col = "todo" | "doing" | "done";
type Card = { id: string; title: string; tag: string; points: number };

const COLS: { id: Col; title: string; hint: string }[] = [
  { id: "todo", title: "To do", hint: "New work lands here" },
  { id: "doing", title: "Doing", hint: "One thing at a time" },
  { id: "done", title: "Done", hint: "Ship it" },
];

const INITIAL: Record<Col, Card[]> = {
  todo: [
    { id: "c1", title: "Design empty-state illustration", tag: "Design", points: 3 },
    { id: "c2", title: "Write migration guide", tag: "Docs", points: 5 },
    { id: "c3", title: "Fix date-picker locale bug", tag: "Eng", points: 2 },
    { id: "c4", title: "Interview 3 trial users", tag: "Research", points: 3 },
  ],
  doing: [
    { id: "c5", title: "Rebuild pricing page", tag: "Eng", points: 8 },
    { id: "c6", title: "Draft launch email", tag: "Growth", points: 2 },
  ],
  done: [{ id: "c7", title: "Ship command palette", tag: "Eng", points: 5 }],
};

function InsertionLine() {
  return (
    <div className="dnd-insertion flex items-center gap-1.5 px-1" aria-hidden="true">
      <span className="size-2 rounded-full bg-blue-600" />
      <span className="h-[3px] flex-1 rounded-full bg-blue-600" />
    </div>
  );
}

export default function TaskBoardPage() {
  const [board, setBoard] = useState<Record<Col, Card[]>>(INITIAL);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<{ col: Col; index: number } | null>(null);
  const [live, setLive] = useState(
    "Sprint board loaded. Drag cards by the dot grip, or use the arrow buttons on any card."
  );

  const locate = (id: string): { col: Col; index: number; card: Card } | null => {
    for (const c of COLS) {
      const i = board[c.id].findIndex((t) => t.id === id);
      if (i >= 0) return { col: c.id, index: i, card: board[c.id][i] };
    }
    return null;
  };

  const move = (id: string, target: Col, rawIndex: number, via: string) => {
    const src = locate(id);
    if (!src) return;
    setBoard((prev) => {
      const without: Record<Col, Card[]> = {
        todo: prev.todo.filter((t) => t.id !== id),
        doing: prev.doing.filter((t) => t.id !== id),
        done: prev.done.filter((t) => t.id !== id),
      };
      const base = without[target];
      const index = Math.max(0, Math.min(rawIndex, base.length));
      without[target] = [...base.slice(0, index), src.card, ...base.slice(index)];
      return without;
    });
    const colName = COLS.find((c) => c.id === target)?.title ?? target;
    setLive(
      `${src.card.title} moved to ${colName}, position ${Math.min(rawIndex + 1, board[target].length + 1)} (${via}).`
    );
  };

  const start = (e: React.DragEvent, card: Card, from: Col, index: number) => {
    setDragId(card.id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", card.id);
    const el = document.createElement("div");
    el.className = "dnd-ghost";
    el.innerHTML = `<div style="display:flex;align-items:center;gap:8px;background:#1c1917;color:#fff;font:600 13px system-ui;padding:9px 14px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.28);white-space:nowrap">⠿ ${card.title} · ${card.points}pt</div>`;
    document.body.appendChild(el);
    try {
      e.dataTransfer.setDragImage(el, 24, 20);
    } catch {
      /* noop */
    }
    window.setTimeout(() => el.remove(), 0);
    setLive(
      `Picked up ${card.title}, ${card.points} points, from ${from}, position ${index + 1}. Drop it on a blue line inside any column.`
    );
  };

  const gapOver = (e: React.DragEvent, col: Col, index: number) => {
    if (!dragId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOver((p) => (p?.col === col && p?.index === index ? p : { col, index }));
  };

  const drop = (e: React.DragEvent, col: Col, index: number) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || dragId;
    if (!id) return;
    move(id, col, index, "drag and drop");
    setDragId(null);
    setOver(null);
  };

  const total = COLS.reduce((a, c) => a + board[c.id].length, 0);
  const donePts = board.done.reduce((a, c) => a + c.points, 0);
  const allPts = COLS.reduce(
    (a, c) => a + board[c.id].reduce((x, t) => x + t.points, 0),
    0
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <ScenarioNav current="/scenarios/task-board/" />
        <header className="max-w-2xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-blue-700">
            Scenario 1 · sortable · insertion line leads
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Sprint task board at a small startup
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
            Three lists, one shared order. Cards sort inside a column or travel
            across columns — the blue insertion line always shows the exact gap
            before you release. Every card also carries arrow buttons, so the
            keyboard path moves the same state.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-stone-900 px-3 py-1.5 font-mono text-[11px] font-bold text-white">
            {board.done.length}/{total} done · {donePts}/{allPts} pts
          </span>
          <button
            type="button"
            onClick={() => {
              setBoard(INITIAL);
              setLive("Board reset to the starting sprint.");
            }}
            className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[13px] font-medium text-stone-600 hover:border-blue-600/40 hover:text-blue-700"
          >
            Reset sprint
          </button>
          <span className="font-mono text-[11px] text-stone-400">
            {dragId ? `carrying ${dragId}…` : "grab a grip to start"}
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {COLS.map((col) => {
            const items = board[col.id];
            const active = dragId !== null && over?.col === col.id;
            return (
              <section
                key={col.id}
                aria-label={`${col.title} column`}
                onDragOver={(e) => gapOver(e, col.id, items.length)}
                onDrop={(e) => drop(e, col.id, items.length)}
                className={`flex min-h-[380px] flex-col rounded-2xl border p-3 transition-colors ${
                  active
                    ? "border-blue-600 bg-blue-50/60 shadow-[0_0_0_2px_#2563eb22]"
                    : "border-stone-200 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)]"
                }`}
              >
                <header className="flex items-baseline justify-between px-1.5 pb-1">
                  <h2 className="text-[14px] font-semibold text-stone-900">
                    {col.title}
                    <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 font-mono text-[11px] text-stone-500">
                      {items.length}
                    </span>
                  </h2>
                  <p className="text-[11px] text-stone-400">{col.hint}</p>
                </header>

                <div
                  onDragOver={(e) => gapOver(e, col.id, 0)}
                  onDrop={(e) => drop(e, col.id, 0)}
                  className="min-h-[12px]"
                >
                  {dragId && over?.col === col.id && over.index === 0 && <InsertionLine />}
                </div>

                {items.map((card, i) => (
                  <div key={card.id}>
                    <article
                      draggable
                      onDragStart={(e) => start(e, card, col.id, i)}
                      onDragEnd={() => {
                        setDragId(null);
                        setOver(null);
                      }}
                      className={`flex items-center gap-1 rounded-xl border bg-[#fafaf9] px-1.5 py-2.5 transition-all hover:border-blue-600/40 hover:bg-white hover:shadow-md ${
                        dragId === card.id
                          ? "dnd-dragging border-blue-600"
                          : "border-stone-200"
                      }`}
                    >
                      <GripDots />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-semibold text-stone-900">
                          {card.title}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[10.5px] text-stone-400">
                          <span className="rounded bg-white px-1.5 py-px ring-1 ring-stone-200">
                            {card.tag}
                          </span>
                          {card.points} pt
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center pr-1">
                        <button
                          type="button"
                          onClick={() => move(card.id, col.id, i - 1, "keyboard button")}
                          aria-label={`Move ${card.title} up`}
                          className="grid size-6 place-items-center rounded-md text-stone-400 hover:bg-stone-200/60 hover:text-stone-800"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => move(card.id, col.id, i + 1, "keyboard button")}
                          aria-label={`Move ${card.title} down`}
                          className="grid size-6 place-items-center rounded-md text-stone-400 hover:bg-stone-200/60 hover:text-stone-800"
                        >
                          ↓
                        </button>
                        {col.id !== "done" && (
                          <button
                            type="button"
                            onClick={() =>
                              move(
                                card.id,
                                col.id === "todo" ? "doing" : "done",
                                999,
                                "keyboard button"
                              )
                            }
                            aria-label={`Advance ${card.title} to next column`}
                            className="grid size-6 place-items-center rounded-md text-stone-400 hover:bg-blue-50 hover:text-blue-700"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </article>
                    <div
                      onDragOver={(e) => gapOver(e, col.id, i + 1)}
                      onDrop={(e) => drop(e, col.id, i + 1)}
                      className="min-h-[12px]"
                    >
                      {dragId && over?.col === col.id && over.index === i + 1 && (
                        <InsertionLine />
                      )}
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-3 py-6 text-center text-[12px] text-stone-400">
                    Empty — the line will appear here mid-drag.
                  </p>
                )}
                <p className="mt-auto px-1.5 pt-2 font-mono text-[10.5px] text-stone-300">
                  ondragover → line · ondrop → reorder
                </p>
              </section>
            );
          })}
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
          <div
            role="status"
            aria-live="polite"
            className="rounded-2xl bg-stone-900 px-5 py-4 text-[13.5px] leading-relaxed text-stone-100"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone-400">
              Live region — what a screen reader hears
            </span>
            <p className="mt-1">{live}</p>
          </div>
          <WhyFits>
            A sprint board is sorting made visible: order <em>is</em> the data.
            The insertion line removes the classic fear (“where will it land?”)
            so re-prioritising feels safe, and because the drop writes the same
            state the arrow buttons write, mouse and keyboard users end up with
            the identical board — fewer errors, faster stand-ups.
          </WhyFits>
        </div>

        <div className="flex flex-wrap gap-2 text-[13px]">
          <Link
            href="/"
            className="rounded-full border border-stone-200 bg-white px-3 py-1.5 font-medium text-stone-600 hover:border-blue-600/40 hover:text-blue-700"
          >
            ← Hub
          </Link>
          <Link
            href="/scenarios/file-dropzone/"
            className="rounded-full bg-stone-900 px-3 py-1.5 font-medium text-white hover:bg-stone-700"
          >
            Next: File triage →
          </Link>
        </div>
      </div>
    </main>
  );
}
