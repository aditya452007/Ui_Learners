"use client";

import { useEffect, useRef, useState } from "react";
import { useToasts, ToastViewport } from "@/components/toast";
import { ScenarioNav } from "@/components/scenario-nav";

type SaveState = "ready" | "saving" | "saved";

export default function DocsAutosavePage() {
  const { toasts, push, dismiss } = useToasts();
  const [text, setText] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("ready");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const fireSavedToast = () => {
    push({
      title: "All changes saved to Drive",
      description: "Just now · Q3 planning notes",
      status: "success",
      duration: 3000,
    });
  };

  const handleChange = (value: string) => {
    setText(value);
    setSaveState("saving");
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setSaveState("saved");
      fireSavedToast();
    }, 1200);
  };

  const saveNow = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setSaveState("saved");
    fireSavedToast();
  };

  const statusLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "saved"
        ? "Saved to Drive"
        : "Ready";

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <ScenarioNav current="docs-autosave" />

        <header className="mb-10">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            Scenario · Passive confirmation
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Docs autosave
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-muted">
            The pure status-message toast. You never ask to save — the app saves
            while you think, and a quiet toast confirms it without stealing your
            cursor, your focus, or your flow.
          </p>
        </header>

        {/* Dotted canvas + document */}
        <section
          aria-label="Document editor demo"
          className="rounded-2xl border border-border bg-surface-alt p-4 sm:p-8"
          style={{
            backgroundImage:
              "radial-gradient(circle, #e7e5e4 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          <div className="rounded-xl border border-border bg-surface shadow-lg shadow-stone-900/5">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3 sm:px-6">
              <span className="mr-1 grid h-7 w-7 place-items-center rounded-md bg-accent text-sm font-bold text-white">
                N
              </span>
              <button
                type="button"
                className="rounded-md px-2.5 py-1.5 text-[13px] font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-foreground"
              >
                File
              </button>
              <button
                type="button"
                className="rounded-md px-2.5 py-1.5 text-[13px] font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-foreground"
              >
                Edit
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-foreground"
              >
                <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                  <path
                    d="M11.5 6.5a3 3 0 10-5.9.7M4.5 9.5a3 3 0 105.9-.7M6 13h4M8 7v6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                Share
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-foreground"
              >
                <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                  <path
                    d="M13.5 8a5.5 5.5 0 11-2.2-4.4L13.5 3l-.5 2.9c.3.7.5 1.4.5 2.1z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
                Comment
              </button>

              <span className="ml-auto flex items-center gap-2">
                <span
                  className={`hidden items-center gap-1.5 text-xs font-medium sm:flex ${
                    saveState === "saving"
                      ? "text-warning"
                      : saveState === "saved"
                        ? "text-success"
                        : "text-text-faint"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      saveState === "saving"
                        ? "bg-warning"
                        : saveState === "saved"
                          ? "bg-success"
                          : "bg-border-strong"
                    }`}
                  />
                  {statusLabel}
                </span>
                <button
                  type="button"
                  onClick={saveNow}
                  className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                    <path
                      d="M8 2.5v7m0 0l2.5-2.5M8 9.5L5.5 7M3.5 11v1.5a1 1 0 001 1h7a1 1 0 001-1V11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Save now
                </button>
              </span>
            </div>

            {/* Document body */}
            <div className="px-6 py-8 sm:px-14 sm:py-10">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Q3 planning notes{" "}
                <span className="ml-1 align-middle rounded-full bg-warning/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-warning uppercase">
                  Draft
                </span>
              </h2>
              <p className="mt-1 mb-6 text-xs text-text-faint">
                Edited just now by you · Private to Notably team
              </p>

              <label htmlFor="doc-input" className="sr-only">
                Start typing — the app autosaves after you pause
              </label>
              <textarea
                id="doc-input"
                value={text}
                onChange={(e) => handleChange(e.target.value)}
                rows={3}
                placeholder="Start writing here — pause for a moment and watch the app save for you…"
                className="w-full resize-none rounded-lg border border-transparent bg-transparent px-1 py-1 text-[15px] leading-relaxed text-foreground placeholder:text-text-faint hover:border-border focus:border-accent/40 focus:bg-surface-alt/50 focus:outline-none"
              />

              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-foreground">
                <h3 className="pt-2 text-base font-semibold text-foreground">
                  Goals for Q3
                </h3>
                <p>
                  Our headline goal this quarter is shipping the collaborative
                  editor to general availability. That means realtime cursors,
                  comment threads, and version history all leaving beta together
                  — no partial rollouts that confuse teams mid-document.
                </p>
                <p>
                  Secondary bets: offline mode behind a flag, template gallery
                  v2, and cutting median document load time from 1.8s to under
                  900ms. The performance work unblocks mobile, where bounce
                  rates are still our worst metric.
                </p>
                <h3 className="pt-2 text-base font-semibold text-foreground">
                  Risks &amp; open questions
                </h3>
                <p>
                  Staffing is the honest risk — two backend engineers are
                  shared with the platform team until September. If the realtime
                  sync rewrite slips more than two weeks, we cut the template
                  gallery first and protect the editor date. Everything else is
                  negotiable; the launch date is not.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-text-faint">
            Type in the first line, then stop — after ~1.2s of idle the app
            “saves” and a toast confirms it. Or press{" "}
            <span className="font-semibold text-text-muted">Save now</span>.
          </p>
        </section>

        {/* Why a toast here */}
        <section className="mt-10 grid gap-6 md:grid-cols-5">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:col-span-3">
            <div className="flex items-start gap-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-light text-accent">
                <svg viewBox="0 0 16 16" fill="none" className="h-4.5 w-4.5" aria-hidden="true">
                  <path
                    d="M8 2v3m0 6v3M2 8h3m6 0h3M4 4l2 2m4 4l2 2m0-8l-2 2m-4 4l-2 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Why a toast here?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  Autosave happens in the background, constantly — interrupting
                  it with a modal or dialog would be absurd, like a librarian
                  stopping you every time she reshelved a book. The toast
                  confirms the save without stealing focus or keystrokes, and
                  because it carries{" "}
                  <code className="font-mono text-[12px] text-accent">
                    role=&quot;status&quot;
                  </code>
                  , screen readers hear “all changes saved” politely instead of
                  having their cursor yanked away mid-sentence.
                </p>
              </div>
            </div>
          </div>

          {/* Spec strip */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:col-span-2">
            <h2 className="text-xs font-semibold tracking-[0.14em] text-text-faint uppercase">
              This variant&apos;s config
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {[
                'role="status"',
                "no action",
                "duration=3000",
                "fires on idle",
              ].map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-border bg-surface-alt px-3 py-1 font-mono text-xs text-text-muted"
                >
                  {chip}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-text-faint">
              Success status, zero interaction required. The timer bar is the
              only urgency this toast is allowed to have.
            </p>
          </div>
        </section>
      </main>

      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
