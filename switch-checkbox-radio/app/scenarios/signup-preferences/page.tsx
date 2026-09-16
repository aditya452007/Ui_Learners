"use client";

import { useEffect, useRef, useState } from "react";
import { ScenarioNav, TopBar } from "../../components/ui";

type Topic = {
  key: string;
  label: string;
  description: string;
  disabled?: boolean;
  disabledNote?: string;
};

const TOPICS: Topic[] = [
  { key: "launch", label: "Launch notes", description: "New features, every other Tuesday." },
  { key: "design", label: "Design breakdowns", description: "How real interfaces are built, monthly." },
  { key: "data", label: "Data stories", description: "Charts and findings worth your coffee break." },
  { key: "events", label: "Events near Portland", description: "Meetups and workshops within 25 miles." },
  { key: "jobs", label: "Job board", description: "Junior-friendly openings, weekly." },
  { key: "investor", label: "Investor brief", description: "Quarterly numbers and forecasts.", disabled: true, disabledNote: "Pro plan only — upgrade to tick this box." },
] as Topic[];

type Key = string;

export default function SignupPreferencesPage() {
  const [draft, setDraft] = useState<Record<Key, boolean>>({
    launch: true,
    design: false,
    data: true,
    events: false,
    jobs: false,
    investor: false,
  });
  const [saved, setSaved] = useState(draft);
  const [toast, setToast] = useState<string | null>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const enabled = TOPICS.filter((t) => !t.disabled);
  const draftCount = enabled.filter((t) => draft[t.key]).length;
  const allChecked = enabled.every((t) => draft[t.key]);
  const someChecked = enabled.some((t) => draft[t.key]);
  const dirty = TOPICS.some((t) => draft[t.key] !== saved[t.key]);
  const savedCount = enabled.filter((t) => saved[t.key]).length;

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = !allChecked && someChecked;
  }, [allChecked, someChecked]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(id);
  }, [toast]);

  const toggleAll = (next: boolean) =>
    setDraft((d) => {
      const copy = { ...d };
      for (const t of enabled) copy[t.key] = next;
      return copy;
    });

  const save = () => {
    setSaved(draft);
    setToast(`Preferences saved — ${draftCount} of ${enabled.length} topics on.`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="mx-auto max-w-6xl px-6 pb-20">
        <header className="pb-6 pt-10">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-teal-700">
            Scenario 3 · Checkbox — staged until saved
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Loop newsletter signup</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-muted">
            Tick any combination — nothing subscribes you yet. The checkboxes only stage a shortlist;{" "}
            <strong className="font-semibold">Save preferences</strong> applies it. Untick everything and save to
            unsubscribe with the same control.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  aria-label="Select all topics"
                  className="checkbox-input sr-only"
                  checked={allChecked}
                  onChange={(e) => toggleAll(e.target.checked)}
                />
                <span className="checkbox-box" aria-hidden="true">
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="white" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                    <path className="checkmark-path" d="M3 8.5 6.5 12 13 4.5" />
                  </svg>
                  <span className="indeterminate-bar" />
                </span>
                <span className="text-sm font-semibold">
                  Select all{" "}
                  <span className="ml-1 font-normal tabular-nums text-text-muted">
                    {draftCount} of {enabled.length}
                  </span>
                </span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAll(false)}
                  className="rounded-full border border-border bg-white px-3.5 py-1.5 text-[13px] font-medium transition hover:border-teal-700 hover:text-teal-800"
                >
                  Clear
                </button>
                <button
                  onClick={save}
                  disabled={!dirty}
                  className="rounded-full bg-stone-900 px-4 py-1.5 text-[13px] font-semibold text-white transition enabled:hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Save preferences
                </button>
              </div>
            </div>

            <div className="grid gap-2 pt-4 sm:grid-cols-2">
              {TOPICS.map((t) => (
                <label
                  key={t.key}
                  className={`relative flex items-start gap-3 rounded-xl border px-4 py-3 transition ${
                    draft[t.key] && !t.disabled
                      ? "border-teal-700/60 bg-teal-50/40"
                      : "border-border bg-white hover:border-teal-700/40 hover:shadow-sm"
                  } ${t.disabled ? "opacity-70" : ""}`}
                >
                  <input
                    type="checkbox"
                    className="checkbox-input sr-only"
                    checked={draft[t.key]}
                    disabled={t.disabled}
                    onChange={(e) => setDraft({ ...draft, [t.key]: e.target.checked })}
                  />
                  <span className="checkbox-box mt-0.5" aria-hidden="true">
                    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="white" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                      <path className="checkmark-path" d="M3 8.5 6.5 12 13 4.5" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{t.label}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-text-muted">{t.description}</span>
                    {"disabledNote" in t && t.disabled && (
                      <span className="mt-0.5 block text-[13px] font-medium text-amber-700">{t.disabledNote}</span>
                    )}
                  </span>
                  {dirty && draft[t.key] !== saved[t.key] && (
                    <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                      {draft[t.key] ? "+ adds" : "− removes"}
                    </span>
                  )}
                </label>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2" aria-live="polite">
              {toast && (
                <p role="status" className="animate-pop-in w-full rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-medium text-white">
                  {toast}
                </p>
              )}
            </div>
          </div>

          <aside className="h-fit space-y-3 lg:sticky lg:top-20">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Draft vs. saved</h2>
                {dirty ? (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                    Unsaved changes
                  </span>
                ) : (
                  <span className="rounded-full bg-teal-700/10 px-2.5 py-1 text-[11px] font-bold text-teal-800">
                    All saved
                  </span>
                )}
              </div>
              <dl className="mt-3 space-y-2 text-[13px] tabular-nums">
                <div className="flex justify-between">
                  <dt className="text-text-muted">Staged (draft)</dt>
                  <dd className="font-semibold">
                    {draftCount} of {enabled.length}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-muted">Actually subscribed</dt>
                  <dd className="font-semibold">
                    {savedCount} of {enabled.length}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 rounded-xl bg-surface-alt px-3 py-2.5 text-[13px] leading-relaxed text-text-muted">
                {dirty
                  ? "Your ticks changed the draft only — the subscription list still shows the last save."
                  : "Draft matches the subscription list. Tick something to stage a new change."}
              </p>
              <button
                onClick={() => setDraft(saved)}
                disabled={!dirty}
                className="mt-3 w-full rounded-full border border-border bg-white px-4 py-2 text-[13px] font-semibold transition enabled:hover:border-teal-700 enabled:hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Discard draft
              </button>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h2 className="text-sm font-semibold">Notice the select-all box</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-text-muted">
                Tick some — not all — topics and it shows a <strong className="font-semibold">dash</strong> instead of
                a tick. That is the <em>indeterminate</em> state: neither on nor off, just “partly.” It is set with
                JavaScript (<code className="font-mono text-[12px]">input.indeterminate = true</code>), not HTML.
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Why checkboxes fit here</h2>
          <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-text-muted">
            Newsletter topics are independent — loving Data stories says nothing about Events — so several boxes may
            be ticked at once, which rules out radios. And subscribing is a commitment the user reviews before it
            counts, so the ticks stage a draft until Save, which rules out switches. The per-topic “+ adds / −
            removes” flags plus the draft-vs-saved panel make the deferred model visible instead of mysterious.
          </p>
        </div>

        <ScenarioNav prev={{ href: "/scenarios/checkout-delivery", label: "Scenario 2: Checkout" }} />
      </main>
    </div>
  );
}
