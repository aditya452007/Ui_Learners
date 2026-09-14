"use client";

import Link from "next/link";
import { useState } from "react";
import Combobox, { type ComboOption } from "../../components/combobox";

const STAPLES: ComboOption[] = [
  { id: "spaghetti", label: "Spaghetti", sub: "Pasta · 200 g per person" },
  { id: "penne", label: "Penne", sub: "Pasta · holds sauce well" },
  { id: "garlic", label: "Garlic", sub: "Aromatic · 2 cloves" },
  { id: "olive-oil", label: "Olive oil", sub: "Fat · extra virgin" },
  { id: "tomatoes", label: "Cherry tomatoes", sub: "Produce · 300 g" },
  { id: "basil", label: "Fresh basil", sub: "Herb · a handful" },
  { id: "parmesan", label: "Parmesan", sub: "Cheese · 40 g grated" },
  { id: "chili", label: "Chili flakes", sub: "Spice · a pinch" },
  { id: "lemon", label: "Lemon", sub: "Citrus · zest + juice" },
];

const NAV = [
  { href: "/", label: "Hub" },
  { href: "/scenarios/flight-search", label: "Flight search" },
  { href: "/scenarios/recipe-builder", label: "Recipe builder" },
  { href: "/scenarios/team-assign", label: "Team assign" },
];

export default function Page() {
  const [draft, setDraft] = useState<ComboOption | null>(null);
  const [items, setItems] = useState<string[]>(["Spaghetti", "Garlic", "Olive oil"]);

  function add(text: string) {
    const clean = text.trim();
    if (!clean) return;
    if (items.some((i) => i.toLowerCase() === clean.toLowerCase())) return;
    setItems((v) => [...v, clean]);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            ← Combobox Lab
          </Link>
          <nav className="flex items-center gap-1 text-xs font-medium">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-full px-3 py-1.5 transition ${
                  n.href === "/scenarios/recipe-builder"
                    ? "bg-foreground text-white"
                    : "text-text-muted hover:bg-surface-alt hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Scenario 2 · Free-form allowed
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Recipe builder — pantry plus anything</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-text-muted">
          Weeknight pasta in the Pantry app. Staples get suggestions, but creativity can&apos;t be a
          closed list — <span className="font-medium text-foreground">type anything and press Enter</span> to
          add it as a custom ingredient. That “Add …” row is the whole difference from strict mode.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold">Weeknight pasta</h2>
                <p className="text-xs text-text-muted">4 servings · 25 min · {items.length} ingredients</p>
              </div>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() => setItems([])}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition hover:border-red-300 hover:text-red-600"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="mt-5">
              <Combobox
                label="Add ingredient"
                placeholder="Type or pick — try “miso”…"
                options={STAPLES}
                value={draft}
                onSelect={(o) => {
                  if (o) {
                    add(o.label);
                    setDraft(null);
                  } else setDraft(null);
                }}
                allowCustom
                customLabel={(t) => `Add “${t}” as custom ingredient`}
                onCustom={(t) => {
                  add(t);
                  setDraft(null);
                }}
                emptyText="Nothing in staples matches — press Enter to add it anyway."
                hint="Free-form: the dashed “Add …” row appears whenever your text isn't a staple."
              />
            </div>

            <div className="mt-5">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">
                In the pot ({items.length})
              </p>
              {items.length === 0 ? (
                <div className="mt-2 rounded-xl border border-dashed border-border-strong bg-surface-alt/60 p-5 text-center text-[13px] text-text-muted">
                  Empty pot — add spaghetti back, or invent something with “miso”.
                </div>
              ) : (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {items.map((ing) => {
                    const isStaple = STAPLES.some((s) => s.label.toLowerCase() === ing.toLowerCase());
                    return (
                      <li
                        key={ing}
                        className={`inline-flex items-center gap-2 rounded-full border py-1.5 pl-3 pr-1.5 text-[13px] font-medium ${
                          isStaple ? "border-border bg-white" : "border-indigo-200 bg-accent-light text-indigo-900"
                        }`}
                      >
                        <span>{ing}</span>
                        {!isStaple && (
                          <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                            custom
                          </span>
                        )}
                        <button
                          type="button"
                          aria-label={`Remove ${ing}`}
                          onClick={() => setItems((v) => v.filter((x) => x !== ing))}
                          className="grid size-5 place-items-center rounded-full text-stone-400 transition hover:bg-stone-200 hover:text-stone-700"
                        >
                          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                            <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
                          </svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="text-sm font-bold">Try it</h2>
              <ol className="mt-3 space-y-2.5 text-[13px] leading-relaxed text-text-muted">
                <li><span className="font-semibold text-foreground">1. Pick a staple:</span> type “par”, ArrowDown once, Enter — Parmesan lands as a plain chip.</li>
                <li><span className="font-semibold text-foreground">2. Invent:</span> type “miso paste”, notice the dashed “Add …” row, press Enter — it lands with a <span className="rounded bg-indigo-600 px-1 font-mono text-[10px] text-white">custom</span> badge.</li>
                <li><span className="font-semibold text-foreground">3. No dead ends:</span> type “xyz” — strict mode would show “no matches”; here Enter still works.</li>
              </ol>
            </div>
            <div className="rounded-xl bg-surface-alt p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Why a combobox fits here</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
                A select would forbid creativity; a plain text field would forget the staples and
                invite typos (“parmasean”). The free-form combobox does both: fast picks for the
                common case, graceful custom input for the long tail — fewer errors, faster entry.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Link href="/scenarios/flight-search" className="text-sm font-medium text-accent">← Flight search (strict)</Link>
          <Link
            href="/scenarios/team-assign"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:border-accent hover:text-accent"
          >
            Next: team assign (rich rows) →
          </Link>
        </div>
      </main>
    </div>
  );
}
