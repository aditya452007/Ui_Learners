"use client";

import Link from "next/link";

const HUB = "/";
const PREV = "/scenarios/settings-panel";

const FEATURES = [
  {
    title: "Lightning Fast",
    desc: "Zero-config builds in under a second. No bundler overhead, no cold starts.",
  },
  {
    title: "Type Safe",
    desc: "End-to-end TypeScript with autocomplete in your editor. Catch bugs before they run.",
  },
  {
    title: "Edge Ready",
    desc: "Deploy to 300+ edge locations worldwide. Sub-50ms response times everywhere.",
  },
];

const TESTIMONIALS = [
  {
    quote: "This replaced three tools in our stack. Incredibly fast.",
    author: "Sarah Chen",
    role: "CTO, Acme Corp",
  },
  {
    quote: "The DX is unmatched. My team ships 2x faster now.",
    author: "Marcus Webb",
    role: "Lead Engineer, Startify",
  },
];

export default function MarketingPageScenario() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 flex-1">
      {/* Nav */}
      <nav className="flex items-center gap-3 text-sm text-text-muted mb-12">
        <Link href={HUB} className="hover:text-accent transition-colors">
          Anatomy
        </Link>
        <span>/</span>
        <Link href={PREV} className="hover:text-accent transition-colors">
          Settings Panel
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Marketing Page</span>
      </nav>

      <header className="mb-12">
        <p className="text-sm font-semibold tracking-widest uppercase text-accent mb-3">
          Scenario 3
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Marketing Page
        </h1>
        <p className="text-text-muted max-w-xl">
          Decorative CSS borders create visual rhythm without semantic meaning —
          pure styling that adds polish without structure.
        </p>
      </header>

      {/* Hero */}
      <section className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Build faster.
          <br />
          Ship smarter.
        </h2>
        <p className="text-lg text-text-muted max-w-lg mx-auto mb-8">
          The modern framework that gets out of your way. No config, no boilerplate,
          just your code running.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="px-6 py-3 text-sm font-semibold bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors">
            Get Started
          </button>
          <button className="px-6 py-3 text-sm font-semibold border border-border rounded-xl hover:border-accent hover:text-accent transition-colors">
            View Docs
          </button>
        </div>
      </section>

      {/* Decorative divider with callout */}
      <div className="relative mb-16">
        <div className="h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="callout-pill bg-accent/10 text-accent text-[0.65rem]">
            CSS border — decorative only
          </span>
        </div>
      </div>

      {/* Features with decorative dividers */}
      <section className="mb-16">
        <h3 className="text-sm font-semibold tracking-widest uppercase text-text-muted mb-8 text-center">
          Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <div key={i}>
              <div className="bg-surface border border-border rounded-xl p-6 h-full">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <span className="text-accent text-lg font-bold">
                    {i + 1}
                  </span>
                </div>
                <h4 className="font-semibold text-sm mb-2">{feature.title}</h4>
                <p className="text-sm text-text-muted leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Another decorative divider */}
      <div className="relative mb-16">
        <div className="h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
      </div>

      {/* Testimonials */}
      <section className="mb-16">
        <h3 className="text-sm font-semibold tracking-widest uppercase text-text-muted mb-8 text-center">
          What people say
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-xl p-6"
            >
              <p className="text-sm leading-relaxed mb-4 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent text-xs font-bold">
                    {t.author[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{t.author}</p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final decorative divider */}
      <div className="relative mb-16">
        <div className="h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
      </div>

      {/* CTA */}
      <section className="text-center">
        <h3 className="text-2xl font-bold mb-3">Ready to ship?</h3>
        <p className="text-text-muted mb-6">
          Start building in seconds. No account required.
        </p>
        <button className="px-8 py-3 text-sm font-semibold bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors">
          Start Project →
        </button>
      </section>

      {/* Why it fits */}
      <div className="mt-16 bg-accent/5 border border-accent/20 rounded-xl p-6">
        <h3 className="font-semibold text-sm mb-2">Why it fits here</h3>
        <p className="text-sm text-text-muted leading-relaxed">
          Marketing pages use decorative dividers to create visual rhythm
          between sections. These lines are pure CSS — no{" "}
          <code className="font-mono text-accent">&lt;hr&gt;</code>, no{" "}
          <code className="font-mono text-accent">role="separator"</code>. They
          exist for the eye, not for the machine. Screen readers skip them
          entirely, which is exactly right: they carry no meaning.
        </p>
      </div>
    </main>
  );
}
