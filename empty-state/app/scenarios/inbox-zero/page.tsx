"use client";

import Link from "next/link";
import { useState } from "react";

type Note = { id: number; title: string; body: string; time: string; unread: boolean; kind: "mention" | "update" | "system" };
const SEED: Note[] = [
  { id: 1, title: "Maya mentioned you in Brand refresh", body: "“Can you review the new palette before Thursday?”", time: "2m ago", unread: true, kind: "mention" },
  { id: 2, title: "Linear shipped: Roadmap timeline", body: "A new timeline view is now available for all workspaces.", time: "1h ago", unread: true, kind: "update" },
  { id: 3, title: "Weekly digest ready", body: "You completed 12 tasks and closed 3 projects this week.", time: "Yesterday", unread: false, kind: "system" },
  { id: 4, title: "Alex assigned you a task", body: "“Finalize Q4 hiring rubric” — due tomorrow.", time: "Yesterday", unread: true, kind: "mention" },
];

export default function InboxZeroScenario() {
  const [items, setItems] = useState<Note[]>(SEED);
  const [filter, setFilter] = useState<"all" | "mention" | "update">("all");
  const [toast, setToast] = useState<string | null>(null);

  const filtered = filter === "all" ? items : items.filter((n) => n.kind === filter);
  const unread = items.filter((n) => n.unread).length;
  const isEmpty = filtered.length === 0;

  function dismiss(id: number) {
    setItems((a) => a.filter((n) => n.id !== id));
  }
  function clearAll() {
    setItems([]);
    setToast("All notifications cleared — enjoy the quiet.");
    window.setTimeout(() => setToast(null), 2500);
  }
  function restore() {
    setItems(SEED);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
      <nav className="mb-8 flex items-center gap-3 text-sm text-text-muted">
        <Link href="/" className="hover:text-accent transition-colors">
          ← Anatomy
        </Link>
        <span className="text-border-strong">/</span>
        <span className="font-medium text-foreground">Inbox zero</span>
        <span className="ml-auto hidden gap-2 sm:inline-flex">
          <Link href="/scenarios/first-project" className="rounded-full border border-border px-3 py-1 hover:border-accent hover:text-accent transition-colors">
            Back to first project →
          </Link>
        </span>
      </nav>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 4.5 7 7.5 12 4.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="2" y="4" width="10" height="7" rx="1.5" stroke="white" strokeWidth="1.3" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold">Inbox</h1>
              <p className="text-xs text-text-muted">{isEmpty ? "No notifications" : `${unread} unread · ${filtered.length} total`}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button onClick={clearAll} className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-text-muted hover:border-foreground hover:text-foreground">
                Mark all as read
              </button>
            )}
            <button onClick={() => (items.length ? clearAll() : restore())} className="rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-white hover:bg-black">
              {items.length ? "Clear inbox" : "Restore demo"}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="border-r border-border bg-surface-alt/40 p-4">
            <div className="space-y-1">
              {[
                { k: "all", label: "All", count: items.length },
                { k: "mention", label: "Mentions", count: items.filter((n) => n.kind === "mention").length },
                { k: "update", label: "Updates", count: items.filter((n) => n.kind === "update").length },
              ].map((t) => (
                <button
                  key={t.k}
                  onClick={() => setFilter(t.k as typeof filter)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${filter === t.k ? "bg-white font-medium text-foreground shadow-sm border border-border" : "text-text-muted hover:text-foreground"}`}
                >
                  <span>{t.label}</span>
                  <span className={`rounded-full px-2 py-0.5 font-mono text-xs ${filter === t.k ? "bg-foreground text-white" : "bg-white text-text-faint border border-border"}`}>{t.count}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-border bg-white p-4">
              <p className="text-xs font-semibold">Tip</p>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">Switch to “Mentions” then clear everything — you’ll see the empty state inside a filter, not just for the whole inbox.</p>
            </div>
          </aside>

          {/* Content */}
          <div className="min-h-[520px] bg-[#fcfcfc] p-6 sm:p-10">
            {!isEmpty ? (
              <div className="mx-auto max-w-[560px] space-y-3">
                {filtered.map((n) => (
                  <div key={n.id} className={`group flex gap-3 rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-all ${n.unread ? "border-emerald-200" : "border-border"}`}>
                    <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-emerald-500" : "bg-border"}`} aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-tight">{n.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-text-muted">{n.body}</p>
                      <p className="mt-2 font-mono text-xs text-text-faint">{n.time}</p>
                    </div>
                    <button
                      onClick={() => dismiss(n.id)}
                      className="self-start rounded-full border border-transparent p-1 text-text-faint hover:border-border hover:bg-surface-alt hover:text-foreground"
                      aria-label={`Dismiss ${n.title}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M4 4 10 10M10 4 4 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                ))}
                {toast && (
                  <p role="status" className="text-center text-sm font-medium text-emerald-700">
                    {toast}
                  </p>
                )}
              </div>
            ) : (
              <section aria-labelledby="empty-inbox-title" className="mx-auto flex max-w-[420px] flex-col items-center rounded-2xl border border-border bg-white px-8 py-12 text-center shadow-sm">
                <div aria-hidden="true" className="relative mb-6 grid h-[84px] w-[84px] place-items-center">
                  <div className="absolute inset-0 rounded-2xl bg-emerald-50" />
                  {/* celebration */}
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="relative" aria-hidden="true">
                    <rect x="10" y="14" width="28" height="20" rx="3" stroke="#16a34a" strokeWidth="1.5" fill="white" />
                    <path d="M10 18h28" stroke="#e7e5e4" strokeWidth="1.1" />
                    <circle cx="24" cy="26" r="7" stroke="#16a34a" strokeWidth="1.4" fill="#ecfdf5" />
                    <path d="M20.5 26 23 28.5 27.5 23" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    {/* confetti */}
                    <path d="M8 10 9.5 12M38 9 36.5 11M40 18l-2 1M7 20l2 1" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                    <circle cx="10" cy="8" r="1.2" fill="#facc15" />
                    <circle cx="38" cy="12" r="1" fill="#4f46e5" />
                    <circle cx="40" cy="28" r="1.1" fill="#fb7185" />
                  </svg>
                </div>
                <h2 id="empty-inbox-title" className="text-[15px] font-semibold tracking-tight">
                  All caught up
                </h2>
                <p className="mt-2 max-w-[300px] text-sm leading-relaxed text-text-muted">
                  {filter !== "all" ? (
                    <>
                      No {filter} notifications. Everything in this filter is cleared — try another tab.
                    </>
                  ) : (
                    "You’ve cleared every notification. New updates will appear here — enjoy the quiet."
                  )}
                </p>
                <button
                  onClick={() => setToast("Template gallery would open here — pick a workflow to start.")}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black active:scale-[0.98] transition-all"
                >
                  Explore templates
                </button>
                <div className="mt-4 flex items-center justify-center gap-3 text-xs">
                  <button onClick={restore} className="font-medium text-accent hover:underline">
                    Restore demo data
                  </button>
                  <span className="text-border-strong">·</span>
                  <a href="#" onClick={(e) => { e.preventDefault(); setToast("Invite flow would open here."); window.setTimeout(() => setToast(null), 2000); }} className="text-text-muted hover:text-foreground">
                    Invite teammates
                  </a>
                </div>
                {toast && (
                  <p role="status" className="mt-4 text-sm font-medium text-emerald-700">
                    {toast}
                  </p>
                )}
                <p className="mt-6 font-mono text-xs text-text-faint">cleared state · celebratory, not apologetic</p>
              </section>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
        <h3 className="text-sm font-semibold text-emerald-900">Why it fits here</h3>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900/70">
          This is the “after you’ve cleared everything” empty state — a success state, not a failure. The tone shifts from “nothing here yet” to “all done — well done”. The same <code className="font-mono text-emerald-900">&lt;section&gt;</code> + illustration + heading + button skeleton is reused, but the copy celebrates and the action suggests what to do next (“Explore templates”, “Invite teammates”) rather than fixing a problem. Filtering to “Mentions” then emptying shows how an empty state can be scoped to a tab, not just the whole view.
        </p>
      </div>

      <div className="mt-4 flex justify-between text-sm">
        <Link href="/scenarios/search-no-results" className="text-text-muted hover:text-foreground">
          ← Catalog search
        </Link>
        <Link href="/" className="font-medium text-accent hover:underline">
          Back to anatomy →
        </Link>
      </div>
    </main>
  );
}
