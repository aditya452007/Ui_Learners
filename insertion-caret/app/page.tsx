"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

const ALT_NAMES = [
  "insertion point",
  "text caret",
  "text cursor",
  "typing caret",
];

const ANATOMY_PARTS = [
  {
    id: "caret",
    label: "Insertion Caret",
    code: "caret-color",
    userDesc:
      "The thin blinking vertical line. It marks exactly where your next keystroke will land — like a finger holding your place in a book.",
    builderDesc:
      "CSS controls this via caret-color. The browser draws a 1–2 px wide rectangle and toggles its opacity on a ~530ms cycle. On macOS AppKit this maps to NSTextView.insertionPointColor.",
  },
  {
    id: "text-context",
    label: "Text Context",
    code: "contenteditable / value",
    userDesc:
      "The characters around the caret. They give the line meaning — without text, the caret is just a blinking line on an empty page.",
    builderDesc:
      "The caret lives inside a text node. When you type, the browser inserts a character at the caret's offset and re-renders. The caret advances one character width to the right.",
  },
  {
    id: "focus-ring",
    label: "Focus Ring",
    code: "outline / box-shadow",
    userDesc:
      "The subtle glow around the text area when you click into it. It confirms: \"this field is active, start typing here.\"",
    builderDesc:
      "When an element receives focus (:focus), browsers can draw an outline or you add a box-shadow. This is separate from the caret — it tells the user the entire field is ready, while the caret shows the exact position.",
  },
  {
    id: "blink-timing",
    label: "Blink Animation",
    code: "animation: caret-blink",
    userDesc:
      "The on-off pulse that makes the caret impossible to miss. It draws your eye to the exact spot without covering any text.",
    builderDesc:
      "The blink is a CSS animation toggling opacity between 1 and 0. The browser's default is ~530ms on/off. You can customize timing, easing, or disable it with caret-color: transparent.",
  },
];

function CaretDemo() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState("Type here to see the caret in action…");

  return (
    <div className="relative">
      <div
        className={`
          relative rounded-2xl border transition-all duration-300
          ${isFocused
            ? "border-violet-500/50 shadow-[0_0_30px_rgba(139,92,246,0.15)]"
            : "border-white/10"
          }
        `}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={4}
          className="
            w-full resize-none rounded-2xl bg-white/[0.03] px-6 py-5
            font-mono text-lg leading-relaxed text-white/90
            caret-custom placeholder:text-white/30
            transition-colors duration-200
          "
          placeholder="Click here and start typing…"
          spellCheck={false}
        />
        {/* Focus indicator dot */}
        <div
          className={`
            absolute top-4 right-4 h-2 w-2 rounded-full transition-all duration-300
            ${isFocused ? "bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.6)]" : "bg-white/20"}
          `}
        />
      </div>
      <p className="mt-3 text-center text-xs text-white/30">
        Click into the field — watch the violet caret blink between characters
      </p>
    </div>
  );
}

function AnatomyDiagram() {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-3xl">
      {/* The live component */}
      <div className="relative">
        <div className="anatomy-glow rounded-3xl border border-white/10 bg-white/[0.02] p-8">
          <div className="relative">
            <textarea
              ref={textareaRef}
              defaultValue="The insertion caret lives here"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              rows={2}
              className="
                w-full resize-none rounded-xl border border-white/10 bg-white/[0.03]
                px-5 py-4 font-mono text-xl leading-relaxed text-white/90
                caret-custom transition-all duration-300
              "
              style={{
                outline: isFocused ? "2px solid rgba(139, 92, 246, 0.3)" : "none",
                outlineOffset: "2px",
              }}
              spellCheck={false}
            />

            {/* SVG leader lines overlay */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 800 120"
              preserveAspectRatio="none"
            >
              {/* Line from "Insertion Caret" label to the caret area */}
              <line x1="400" y1="0" x2="400" y2="42" className="leader-line" />
              {/* Line from "Focus Ring" label to the border */}
              <line x1="700" y1="0" x2="700" y2="42" className="leader-line" />
            </svg>

            {/* Callout labels */}
            <div className="pointer-events-auto absolute -top-10 left-1/2 -translate-x-1/2">
              <span className="callout-pill inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-violet-300">
                <span className="inline-block h-3 w-0.5 animate-pulse rounded-full bg-violet-400" />
                insertion caret
              </span>
            </div>

            <div className="pointer-events-auto absolute -top-10 right-4">
              <span className="callout-pill inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-violet-300">
                focus ring
              </span>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-white/40">
            Click into the field — the violet line is the insertion caret
          </p>
        </div>
      </div>
    </div>
  );
}

function PartCard({
  part,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  part: (typeof ANATOMY_PARTS)[number];
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`
        group relative rounded-2xl border p-5 transition-all duration-300
        ${isHovered
          ? "border-violet-500/40 bg-violet-500/[0.06]"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
        }
      `}
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-xs font-bold text-violet-400">
          {index + 1}
        </span>
        <div>
          <h3 className="text-sm font-semibold text-white/90">{part.label}</h3>
          <code className="font-mono text-xs text-violet-400/70">{part.code}</code>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-white/[0.03] p-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">
            What you see
          </p>
          <p className="text-sm leading-relaxed text-white/60">{part.userDesc}</p>
        </div>
        <div className="rounded-xl bg-violet-500/[0.04] p-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-violet-400/50">
            How it works
          </p>
          <p className="text-sm leading-relaxed text-white/60">{part.builderDesc}</p>
        </div>
      </div>
    </div>
  );
}

export default function InsertionCaretPage() {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      {/* Hero */}
      <header className="mb-16 text-center animate-slide-in">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300">
          <span className="inline-block h-3 w-0.5 animate-pulse rounded-full bg-violet-400" />
          macOS / Web Component
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Insertion Caret
        </h1>
        <p className="mx-auto mb-4 max-w-lg text-lg text-white/50">
          The blinking vertical line at the zero-length selectedRange where the
          next typed character appears.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {ALT_NAMES.map((name) => (
            <span
              key={name}
              className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs text-white/40"
            >
              {name}
            </span>
          ))}
        </div>
      </header>

      {/* What am I looking at — intro strip */}
      <section className="mb-16 animate-slide-in stagger-1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: "│",
              title: "The Line",
              desc: "A 1–2 px wide vertical bar drawn between two characters.",
            },
            {
              icon: "◉",
              title: "The Position",
              desc: "Zero-length selection — no range highlighted, just a single point.",
            },
            {
              icon: "⟳",
              title: "The Pulse",
              desc: "Toggles visibility ~530ms to catch your eye without hiding text.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center"
            >
              <div className="mb-2 text-2xl text-violet-400">{card.icon}</div>
              <h3 className="mb-1 text-sm font-semibold text-white/80">
                {card.title}
              </h3>
              <p className="text-xs leading-relaxed text-white/40">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live anatomy diagram */}
      <section className="mb-16 animate-slide-in stagger-2">
        <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-white/30">
          Anatomy
        </h2>
        <AnatomyDiagram />
      </section>

      {/* Interactive demo */}
      <section className="mb-16 animate-slide-in stagger-3">
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-white/30">
          Try it
        </h2>
        <CaretDemo />
      </section>

      {/* Part-by-part explanations */}
      <section className="mb-16 animate-slide-in stagger-4">
        <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-white/30">
          Every part, explained
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {ANATOMY_PARTS.map((part, i) => (
            <PartCard
              key={part.id}
              part={part}
              index={i}
              isHovered={hoveredPart === part.id}
              onHover={() => setHoveredPart(part.id)}
              onLeave={() => setHoveredPart(null)}
            />
          ))}
        </div>
      </section>

      {/* Caret customization showcase */}
      <section className="mb-16 animate-slide-in stagger-5">
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-white/30">
          Customize the caret
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { color: "violet", label: "Default", css: "caret-color: #8b5cf6" },
            { color: "green", label: "Terminal", css: "caret-color: #22c55e" },
            { color: "amber", label: "Warm", css: "caret-color: #f59e0b" },
            { color: "rose", label: "Alert", css: "caret-color: #f43f5e" },
            { color: "cyan", label: "Cool", css: "caret-color: #06b6d4" },
            { color: "white", label: "Classic", css: "caret-color: #ffffff" },
          ].map((c) => (
            <div
              key={c.color}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <input
                type="text"
                defaultValue="Tap to focus this field"
                className={`w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-sm text-white/80 caret-${c.color} transition-colors focus:border-violet-500/30`}
                spellCheck={false}
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-white/50">{c.label}</span>
                <code className="font-mono text-[10px] text-violet-400/60">
                  {c.css}
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <nav className="flex flex-wrap items-center justify-center gap-3 border-t border-white/[0.06] pt-8">
        <Link
          href="/scenarios/code-editor"
          className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 text-sm text-white/60 transition-all hover:border-violet-500/30 hover:text-white/80"
        >
          Code Editor →
        </Link>
        <Link
          href="/scenarios/chat-composer"
          className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 text-sm text-white/60 transition-all hover:border-violet-500/30 hover:text-white/80"
        >
          Chat Composer →
        </Link>
        <Link
          href="/scenarios/multi-field-form"
          className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 text-sm text-white/60 transition-all hover:border-violet-500/30 hover:text-white/80"
        >
          Multi-Field Form →
        </Link>
      </nav>
    </main>
  );
}
