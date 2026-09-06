"use client";

import { useState } from "react";
import Link from "next/link";
import TokenField, { type Token } from "@/components/TokenField";
import { Card, Eyebrow, ScenarioNav } from "@/components/chrome";

const SUGGESTED = ["research", "prototype", "launch", "accessibility", "field-notes", "q3-launch", "design-system"];

const TINTS: Record<string, string> = {
  research: "border-violet-300 bg-violet-50 text-violet-900",
  prototype: "border-amber-300 bg-amber-50 text-amber-900",
  launch: "border-green-300 bg-green-50 text-green-900",
  accessibility: "border-sky-300 bg-sky-50 text-sky-900",
  "field-notes": "border-rose-300 bg-rose-50 text-rose-900",
};

const MAX = 5;

function tintFor(t: Token) {
  return TINTS[t.label] ?? "border-stone-300 bg-stone-100 text-stone-800";
}

export default function TaggingScenario() {
  const [tokens, setTokens] = useState<Token[]>([{ id: "g1", label: "research" }]);
  const remaining = MAX - tokens.length;

  const addSuggested = (label: string) => {
    if (tokens.some((t) => t.label === label) || tokens.length >= MAX) return;
    setTokens((t) => [...t, { id: `s-${Date.now()}-${label}`, label }]);
  };

  return (
    <div className="min-h-full bg-stone-50">
      <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-8 sm:px-8">
        <ScenarioNav current="/scenarios/tagging" />

        <div className="mt-8">
          <Eyebrow>Scenario 2 · Note tagging</Eyebrow>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Labels you invent as you type
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-7 text-stone-600">
            No address book here — tags are free-form words the writer makes up. The field normalizes them
            (lowercase, dashes instead of spaces) so “Q3 Launch” and “q3-launch” become one tag.
          </p>
        </div>

        <Card className="mt-6 overflow-hidden">
          <div className="border-b border-stone-100 px-5 pb-4 pt-5 sm:px-6">
            <div className="flex items-center gap-2 text-[12px] font-medium text-stone-400">
              <span>Field notes</span>
              <span aria-hidden="true">/</span>
              <span>Q3 launch</span>
              <span aria-hidden="true">·</span>
              <span>Edited just now</span>
            </div>
            <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-stone-900">
              Launch checklist walkthrough
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-stone-600">
              Watched three first-time users try the invite flow. Two stumbled on the role picker — the word
              “Viewer” reads as read-only preview, but testers expected commenting. Rename candidate:
              “Commenter”. Follow up with support transcripts before Friday.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-stone-400">
                Tags
              </label>
              <span
                aria-live="polite"
                className={`rounded-full px-2.5 py-0.5 font-mono text-[12px] font-semibold ${
                  remaining === 0 ? "bg-red-100 text-red-700" : "bg-stone-100 text-stone-600"
                }`}
              >
                {remaining} of {MAX} left
              </span>
            </div>
            <TokenField
              initialTokens={tokens}
              suggestions={SUGGESTED.filter(
                (s) => !tokens.some((t) => t.label === s)
              ).map((label) => ({ label }))}
              placeholder="Add a tag — try “User Interviews”…"
              allowCustom
              maxTokens={MAX}
              tokenStyle="default"
              tintFor={tintFor}
              normalize={(v) =>
                v.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 24) || v.toLowerCase()
              }
              validate={(v) => v.length >= 2 && v.length <= 24}
              onChange={setTokens}
              ariaLabel="Note tags"
            />

            <div className="mt-3">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-stone-400">
                Suggested — click to add
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SUGGESTED.map((s) => {
                  const taken = tokens.some((t) => t.label === s);
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={taken || remaining === 0}
                      onClick={() => addSuggested(s)}
                      className={`rounded-full border px-3 py-1 text-[12.5px] font-medium transition-all ${
                        taken
                          ? "cursor-default border-stone-200 bg-stone-50 text-stone-300 line-through"
                          : remaining === 0
                            ? "cursor-not-allowed border-stone-200 bg-stone-50 text-stone-300"
                            : "border-stone-300 bg-white text-stone-600 hover:border-blue-400 hover:text-blue-700 active:scale-[0.97]"
                      }`}
                    >
                      #{s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3 ring-1 ring-inset ring-stone-200/70">
              <p className="text-[13px] text-stone-600">
                Filtering the notebook by{" "}
                <span className="font-mono text-[12.5px] font-semibold text-stone-900">
                  {tokens.length > 0 ? tokens.map((t) => `#${t.label}`).join(" + ") : "—"}
                </span>
              </p>
              <p className="font-mono text-[12px] text-stone-400">
                {tokens.length === 0 ? "0 notes" : `${2 + tokens.length * 3} notes`}
              </p>
            </div>
          </div>
        </Card>

        <Card className="mt-4 p-5">
          <h2 className="text-[14px] font-semibold text-stone-900">Try the normalization</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[13.5px] leading-6 text-stone-600">
            <li>Type <code className="rounded bg-stone-100 px-1 font-mono text-[12px]">User Interviews</code> + Enter → becomes <code className="rounded bg-stone-100 px-1 font-mono text-[12px]">user-interviews</code>.</li>
            <li>Add <code className="rounded bg-stone-100 px-1 font-mono text-[12px]">research</code> again → blocked as a duplicate, with a note.</li>
            <li>Fill all {MAX} slots, then try a sixth → the limit message appears instead of a pill.</li>
            <li>One-letter tags turn red — the delegate insists on at least two characters.</li>
          </ul>
        </Card>

        <Card className="mt-4 border-blue-100 bg-blue-50/60 p-5">
          <h2 className="text-[14px] font-semibold text-stone-900">Why a token field fits here</h2>
          <p className="mt-1 text-[13.5px] leading-6 text-stone-700">
            Tags must be <em>discrete, countable, and deduped</em> — three things comma-separated text hides.
            Capsules show the writer exactly what will be saved, normalization quietly prevents near-duplicate
            tags (“Q3 Launch” vs “q3-launch”), and the visible limit keeps tag taxonomies small enough to
            browse. The user gains a notebook that stays searchable instead of rotting into 40 spellings of
            the same idea.
          </p>
        </Card>

        <div className="mt-6 flex justify-between">
          <Link href="/scenarios/mail-compose" className="text-[13.5px] font-medium text-stone-500 hover:text-stone-900">
            ← Mail compose
          </Link>
          <Link href="/scenarios/team-invite" className="text-[13.5px] font-semibold text-blue-700 hover:underline">
            Next: Team invite →
          </Link>
        </div>
      </div>
    </div>
  );
}
