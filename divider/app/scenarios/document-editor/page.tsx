"use client";

import Link from "next/link";
import { useState } from "react";

const HUB = "/";
const NEXT = "/scenarios/settings-panel";

const SECTIONS = [
  {
    topic: "Introduction",
    content:
      "Every great story starts with a question. What if the tools we use every day could disappear into the background, leaving only the work that matters?",
  },
  {
    topic: "The Problem",
    content:
      "Most writing apps force you to think about formatting instead of ideas. Bold, italic, headers — the chrome gets in the way of the craft.",
  },
  {
    topic: "The Solution",
    content:
      "A truly minimal editor fades to nothing. You type, you think, you publish. The interface is invisible until you need it.",
  },
];

export default function DocumentEditorScenario() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 flex-1">
      {/* Nav */}
      <nav className="flex items-center gap-3 text-sm text-text-muted mb-12">
        <Link href={HUB} className="hover:text-accent transition-colors">
          Anatomy
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Document Editor</span>
        <span className="ml-auto">
          <Link href={NEXT} className="hover:text-accent transition-colors">
            Next: Settings Panel →
          </Link>
        </span>
      </nav>

      <header className="mb-12">
        <p className="text-sm font-semibold tracking-widest uppercase text-accent mb-3">
          Scenario 1
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Document Editor
        </h1>
        <p className="text-text-muted max-w-xl">
          The <code className="font-mono text-sm bg-surface-alt px-1.5 py-0.5 rounded">&lt;hr&gt;</code> element marks a real change of topic between content
          sections — a semantic line that screen readers announce.
        </p>
      </header>

      {/* Editor preview */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-surface-alt">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs font-mono text-text-muted ml-3">
            untitled.md
          </span>
        </div>

        {/* Content with semantic <hr> breaks */}
        <div className="p-8 sm:p-12">
          {SECTIONS.map((section, i) => (
            <div key={i}>
              {i > 0 && (
                <div className="relative my-8">
                  {/* The semantic <hr> */}
                  <hr
                    className="border-none h-px bg-gradient-to-r from-transparent via-border-strong to-transparent"
                  />
                  {/* Callout label */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="callout-pill bg-accent/10 text-accent text-[0.65rem]">
                      &lt;hr&gt; semantic break
                    </span>
                  </div>
                </div>
              )}
              <div
                className={`cursor-pointer rounded-lg p-4 -mx-4 transition-colors ${
                  activeSection === i
                    ? "bg-accent/5 border border-accent/20"
                    : "hover:bg-surface-alt border border-transparent"
                }`}
                onClick={() => setActiveSection(i)}
              >
                <h2 className="text-lg font-semibold mb-2">{section.topic}</h2>
                <p className="text-sm text-text-muted leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why it fits */}
      <div className="mt-8 bg-accent/5 border border-accent/20 rounded-xl p-6">
        <h3 className="font-semibold text-sm mb-2">Why it fits here</h3>
        <p className="text-sm text-text-muted leading-relaxed">
          When content shifts topics — from introduction to problem to solution —
          an <code className="font-mono text-accent">&lt;hr&gt;</code> tells
          both sighted users and screen readers that a real thematic boundary
          exists. It&apos;s not just a line; it&apos;s a paragraph break at the
          document level.
        </p>
      </div>
    </main>
  );
}
