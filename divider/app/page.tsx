"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/scenarios/document-editor", label: "Document Editor" },
  { href: "/scenarios/settings-panel", label: "Settings Panel" },
  { href: "/scenarios/marketing-page", label: "Marketing Page" },
];

const PARTS = [
  {
    id: "hr",
    number: 1,
    label: "Thematic Break (<hr>)",
    whatYouSee:
      'A horizontal line that signals a real change of topic — like a scene change in a film. When you scroll past it, you know the content shifted.',
    howItWorks:
      "HTML gives this a semantic element called <hr> (horizontal rule). Screen readers announce it as a \"thematic break\" so users who can't see the line still know the topic changed.",
  },
  {
    id: "separator",
    number: 2,
    label: 'Semantic Separator (role="separator")',
    whatYouSee:
      "A thin line between two groups of buttons or controls — like a fence between two yards. It doesn't mark a topic change; it just says \"these controls are different groups.\"",
    howItWorks:
      'When the line divides controls (not content), use role="separator". Add aria-orientation="vertical" for vertical lines. It tells assistive tech "this is a boundary between interactive groups."',
  },
  {
    id: "css-border",
    number: 3,
    label: "Decorative CSS Border",
    whatYouSee:
      "A subtle line that looks nice but means nothing structural — like a pinstripe on a suit. It's pure styling, not content or control boundaries.",
    howItWorks:
      "Use a CSS border (border-block-start, border-top, etc.) with no <hr> or role. It conveys zero structure — just visual rhythm. Screen readers ignore it entirely.",
  },
  {
    id: "macos",
    number: 4,
    label: "macOS Divider / Separator",
    whatYouSee:
      "In macOS apps, the same idea appears as a thin line between view regions (SwiftUI Divider) or between groups of menu commands (NSMenuItem separator). Same concept, native styling.",
    howItWorks:
      "SwiftUI's Divider() draws a horizontal or vertical line. NSMenuItem.separator() inserts a gap between command groups in menus. These are the native macOS equivalents of the web patterns above.",
  },
];

const STRUCTURE_CARDS = [
  { emoji: "━", title: "Semantic", desc: "<hr> — marks a topic shift" },
  { emoji: "│", title: "Structural", desc: 'role="separator" — divides controls' },
  { emoji: "~", title: "Decorative", desc: "CSS border — pure styling" },
];

export default function Home() {
  const [activePart, setActivePart] = useState<string | null>(null);

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 flex-1">
      {/* Header */}
      <header className="mb-16">
        <p className="text-sm font-semibold tracking-widest uppercase text-accent mb-3">
          NameThatUI — Anatomy
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Divider vs. Separator vs. Rule
        </h1>
        <p className="text-lg text-text-muted max-w-2xl">
          Also called: separator, rule, horizontal rule, visual divider. The
          same thin line can mean completely different things depending on
          whether it carries meaning.
        </p>
      </header>

      {/* Intro strip — three structure cards */}
      <section className="mb-20">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-text-muted mb-5">
          What am I looking at?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STRUCTURE_CARDS.map((card) => (
            <div
              key={card.title}
              className="bg-surface border border-border rounded-xl p-5 flex items-start gap-4"
            >
              <span className="text-2xl text-accent font-bold leading-none mt-0.5">
                {card.emoji}
              </span>
              <div>
                <h3 className="font-semibold text-sm mb-1">{card.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Anatomy Diagram */}
      <section className="mb-20">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-text-muted mb-8">
          Anatomy — every part, named
        </h2>

        <div className="bg-surface border border-border rounded-2xl p-8 sm:p-12 relative">
          {/* The live divider demos with callout labels */}
          <div className="space-y-10">
            {/* Part 1: Thematic Break */}
            <div className="relative group">
              <div className="flex items-center gap-4 mb-3">
                <span className="callout-pill bg-accent text-white">
                  <span>{PARTS[0].number}</span>
                </span>
                <span className="text-sm font-semibold">{PARTS[0].label}</span>
              </div>
              <div className="pl-8 relative">
                <p className="text-sm text-text-muted mb-4 leading-relaxed">
                  Section one: the sky is blue and the ocean is deep. We are
                  talking about nature.
                </p>
                <hr
                  className="border-none h-px bg-gradient-to-r from-transparent via-border-strong to-transparent cursor-pointer hover:via-accent transition-colors"
                  role="separator"
                />
                <p className="text-sm text-text-muted mt-4 leading-relaxed">
                  Section two: the stock market rallied today on strong earnings
                  reports. A completely different topic.
                </p>
              </div>
            </div>

            {/* Part 2: Semantic Separator */}
            <div className="relative group">
              <div className="flex items-center gap-4 mb-3">
                <span className="callout-pill bg-accent text-white">
                  <span>{PARTS[1].number}</span>
                </span>
                <span className="text-sm font-semibold">{PARTS[1].label}</span>
              </div>
              <div className="pl-8">
                <div className="flex items-center gap-4">
                  <button className="px-4 py-2 text-sm font-medium bg-surface-alt border border-border rounded-lg hover:bg-accent-light transition-colors">
                    Bold
                  </button>
                  <button className="px-4 py-2 text-sm font-medium bg-surface-alt border border-border rounded-lg hover:bg-accent-light transition-colors">
                    Italic
                  </button>
                  <div
                    role="separator"
                    aria-orientation="vertical"
                    className="h-6 w-px bg-border-strong"
                  />
                  <button className="px-4 py-2 text-sm font-medium bg-surface-alt border border-border rounded-lg hover:bg-accent-light transition-colors">
                    Copy
                  </button>
                  <button className="px-4 py-2 text-sm font-medium bg-surface-alt border border-border rounded-lg hover:bg-accent-light transition-colors">
                    Paste
                  </button>
                </div>
              </div>
            </div>

            {/* Part 3: Decorative CSS Border */}
            <div className="relative group">
              <div className="flex items-center gap-4 mb-3">
                <span className="callout-pill bg-accent text-white">
                  <span>{PARTS[2].number}</span>
                </span>
                <span className="text-sm font-semibold">{PARTS[2].label}</span>
              </div>
              <div className="pl-8">
                <div className="bg-surface-alt rounded-xl p-6 border-t-2 border-accent/30">
                  <p className="text-sm font-medium mb-1">Pricing</p>
                  <p className="text-sm text-text-muted">
                    This card uses a CSS border-top for decoration — no semantic
                    meaning at all.
                  </p>
                </div>
              </div>
            </div>

            {/* Part 4: macOS Divider */}
            <div className="relative group">
              <div className="flex items-center gap-4 mb-3">
                <span className="callout-pill bg-accent text-white">
                  <span>{PARTS[3].number}</span>
                </span>
                <span className="text-sm font-semibold">{PARTS[3].label}</span>
              </div>
              <div className="pl-8">
                <div className="bg-surface-alt rounded-xl p-5 border border-border max-w-sm">
                  <p className="text-sm font-medium mb-3">File</p>
                  <div className="h-px bg-border-strong mb-3" />
                  <p className="text-sm text-text-muted">New Window</p>
                  <p className="text-sm text-text-muted">Open…</p>
                  <div className="h-px bg-border-strong my-3" />
                  <p className="text-sm text-text-muted">Save</p>
                  <p className="text-sm text-text-muted">Export…</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layered Explanations */}
      <section className="mb-20">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-text-muted mb-8">
          Layered explanations — every part
        </h2>
        <div className="space-y-6">
          {PARTS.map((part) => (
            <div
              key={part.id}
              className="bg-surface border border-border rounded-xl p-6 sm:p-8 hover:border-accent/40 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="callout-pill bg-accent/10 text-accent">
                  <span>{part.number}</span>
                </span>
                <h3 className="font-semibold text-sm">{part.label}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                    What you see
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {part.whatYouSee}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                    How it works
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {part.howItWorks}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Code Reference */}
      <section className="mb-20">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-text-muted mb-8">
          In code
        </h2>
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                HTML
              </p>
              <code className="block text-sm font-mono bg-surface-alt rounded-lg px-4 py-3 text-foreground/80">
                {"<hr>"}
              </code>
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                ARIA
              </p>
              <code className="block text-sm font-mono bg-surface-alt rounded-lg px-4 py-3 text-foreground/80">
                {'role="separator"'}
              </code>
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                CSS
              </p>
              <code className="block text-sm font-mono bg-surface-alt rounded-lg px-4 py-3 text-foreground/80">
                border-block-start
              </code>
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                SwiftUI / AppKit
              </p>
              <code className="block text-sm font-mono bg-surface-alt rounded-lg px-4 py-3 text-foreground/80">
                {"Divider() / NSMenuItem.separator()"}
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Scenario Nav */}
      <section>
        <h2 className="text-sm font-semibold tracking-widest uppercase text-text-muted mb-8">
          See it in the wild — three scenarios
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group block bg-surface border border-border rounded-xl p-6 hover:border-accent hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-sm mb-2 group-hover:text-accent transition-colors">
                {link.label}
              </h3>
              <p className="text-sm text-text-muted">
                {link.href === "/scenarios/document-editor" &&
                  "Semantic <hr> between content sections with different topics."}
                {link.href === "/scenarios/settings-panel" &&
                  'role="separator" dividing groups of controls.'}
                {link.href === "/scenarios/marketing-page" &&
                  "CSS border decorative lines for visual rhythm."}
              </p>
              <span className="inline-block mt-4 text-sm font-medium text-accent">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
