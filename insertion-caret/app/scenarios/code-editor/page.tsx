"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const CODE_LINES = [
  "function greet(name) {",
  '  const msg = `Hello, ${"${"}name${"}"}!`;',
  "  console.log(msg);",
  "  return msg;",
  "}",
];

function LineNumbers({ count }: { count: number }) {
  return (
    <div className="select-none pr-4 text-right text-sm leading-relaxed text-white/20">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
}

export default function CodeEditorScenario() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [code, setCode] = useState(CODE_LINES.join("\n"));
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);
  const [isFocused, setIsFocused] = useState(false);

  const updateCursorPosition = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const textBefore = ta.value.substring(0, pos);
    const lines = textBefore.split("\n");
    setCursorLine(lines.length);
    setCursorCol(lines[lines.length - 1].length + 1);
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      {/* Nav */}
      <nav className="mb-10 flex items-center gap-3 text-sm">
        <Link
          href="/"
          className="text-white/40 transition-colors hover:text-white/70"
        >
          ← Hub
        </Link>
        <span className="text-white/10">/</span>
        <span className="text-violet-400">Code Editor</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
          Scenario: Code Editor
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-white/50">
          In a code editor, the insertion caret is the developer&apos;s primary
          navigation tool. A custom green caret on a dark background evokes the
          classic terminal feel — high contrast, zero distraction.
        </p>
      </header>

      {/* Editor */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1117] shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.03] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-red-500/60" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
          <span className="h-3 w-3 rounded-full bg-green-500/60" />
          <span className="ml-3 text-xs text-white/30">greet.js — editor</span>
        </div>

        {/* Code area */}
        <div className="flex">
          <div className="flex-shrink-0 border-r border-white/[0.06] bg-white/[0.01] px-3 py-4">
            <LineNumbers count={code.split("\n").length} />
          </div>

          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyUp={updateCursorPosition}
              onClick={updateCursorPosition}
              onFocus={() => {
                setIsFocused(true);
                updateCursorPosition();
              }}
              onBlur={() => setIsFocused(false)}
              rows={code.split("\n").length}
              spellCheck={false}
              className="
                w-full resize-none bg-transparent px-4 py-4 font-mono text-sm
                leading-relaxed text-green-300 caret-green placeholder:text-white/20
                focus:outline-none
              "
            />

            {/* Syntax highlight overlay (decorative) */}
            <div className="pointer-events-none absolute inset-0 px-4 py-4 font-mono text-sm leading-relaxed text-green-300/0">
              {code}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.02] px-4 py-2 text-xs text-white/30">
          <div className="flex items-center gap-4">
            <span>
              Ln {cursorLine}, Col {cursorCol}
            </span>
            <span>JavaScript</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${isFocused ? "bg-green-400" : "bg-white/20"}`}
            />
            <span>{isFocused ? "ACTIVE" : "IDLE"}</span>
          </div>
        </div>
      </div>

      {/* Why it fits */}
      <section className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-violet-400/70">
          Why it fits here
        </h2>
        <p className="text-sm leading-relaxed text-white/50">
          A code editor relies on precise character-level navigation. The green
          caret on a dark background maximizes contrast and reduces eye strain
          during long coding sessions. The status bar showing line/column
          position reinforces the caret&apos;s role as the anchor point for every
          edit operation.
        </p>
      </section>

      {/* Footer nav */}
      <nav className="mt-10 flex items-center justify-between border-t border-white/[0.06] pt-6">
        <Link
          href="/"
          className="text-sm text-white/40 transition-colors hover:text-white/70"
        >
          ← Back to Hub
        </Link>
        <Link
          href="/scenarios/chat-composer"
          className="text-sm text-violet-400 transition-colors hover:text-violet-300"
        >
          Next: Chat Composer →
        </Link>
      </nav>
    </main>
  );
}
