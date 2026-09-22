"use client";

import { useState } from "react";
import { ScenarioNav } from "../../components/nav";

interface Release {
  version: string;
  kind: "minor" | "patch";
  title: string;
  datetime: string;
  dateShort: string;
  notes: string[];
  rollout?: number; // percent, present while in progress
}

const RELEASES: Release[] = [
  {
    version: "v4.2",
    kind: "minor",
    title: "Automations 2.0",
    datetime: "2026-09-18T09:00",
    dateShort: "Sep 18",
    notes: ["Multi-step rules with delays and branches", "New trigger: deal stage changed", "50% faster rule evaluation"],
    rollout: 68,
  },
  {
    version: "v4.1",
    kind: "minor",
    title: "Shared dashboards",
    datetime: "2026-08-27T10:00",
    dateShort: "Aug 27",
    notes: ["Invite-only links with expiry", "Comment threads on any widget"],
  },
  {
    version: "v4.0.3",
    kind: "patch",
    title: "Sync & speed fixes",
    datetime: "2026-08-09T14:00",
    dateShort: "Aug 9",
    notes: ["Fixed calendar sync duplicating all-day events", "List views render ~30% faster"],
  },
  {
    version: "v4.0",
    kind: "minor",
    title: "Offline mode",
    datetime: "2026-07-21T09:00",
    dateShort: "Jul 21",
    notes: ["Work without a connection, sync on return", "Conflict review screen for overlapping edits"],
  },
  {
    version: "v3.9.2",
    kind: "patch",
    title: "Security patch",
    datetime: "2026-07-02T16:00",
    dateShort: "Jul 2",
    notes: ["Patched session-refresh edge case", "No action needed for workspaces"],
  },
];

type Filter = "all" | "minor" | "patch";

export default function ChangelogPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["v4.2"]));
  const [rolledOut, setRolledOut] = useState(false);

  const visible = RELEASES.filter((r) => filter === "all" || r.kind === filter);
  const last = visible.length - 1;

  const toggle = (v: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });

  const isLoading = (r: Release, i: number) => i === 0 && r.rollout !== undefined && !rolledOut && filter !== "patch";

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <ScenarioNav
        prev={{ href: "/scenarios/order-tracking", label: "Tracking" }}
        next={{ href: "/scenarios/team-activity", label: "Activity" }}
      />

      <header className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Scenario 2 — alternate changelog</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Acme SaaS changelog</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Release history, newest first. On desktop the story zigzags (MUI{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px]">position=&quot;alternate&quot;</code>{" "}
          idea) — time and story swap sides each row; on mobile it collapses to one side. The top
          release is still <span className="font-semibold text-slate-700">rolling out</span>.
        </p>
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="flex rounded-full border border-slate-200 bg-white p-1 shadow-sm" role="group" aria-label="Filter releases">
          {(["all", "minor", "patch"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                filter === f ? "bg-teal-700 text-white shadow-sm" : "text-slate-500 hover:text-teal-800"
              }`}
            >
              {f === "all" ? "All" : `${f}s`}
            </button>
          ))}
        </div>
        <p className="font-mono text-[11px] text-slate-400">
          {visible.length} of {RELEASES.length} releases
        </p>
        {!rolledOut && filter !== "patch" && (
          <button
            type="button"
            onClick={() => setRolledOut(true)}
            className="ml-auto rounded-full border border-teal-700/30 bg-teal-50 px-3.5 py-1.5 text-xs font-semibold text-teal-800 transition hover:bg-teal-100"
          >
            Finish rollout → v4.2 goes solid
          </button>
        )}
      </div>

      <ol aria-label="Product changelog" className="mt-6">
        {visible.map((r, i) => {
          const loading = isLoading(r, i);
          const open = expanded.has(r.version);
          const leftSide = i % 2 === 0; // desktop zigzag: story left on even rows
          const card = (
            <div
              className={`rounded-2xl border bg-white p-4 shadow-sm transition ${
                loading ? "border-amber-600/25 ring-1 ring-inset ring-amber-600/15" : "border-slate-200"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${
                    loading ? "bg-amber-100 text-amber-800" : "bg-teal-700 text-white"
                  }`}
                >
                  {r.version}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    r.kind === "minor" ? "bg-slate-100 text-slate-600" : "bg-slate-50 text-slate-400 ring-1 ring-inset ring-slate-200"
                  }`}
                >
                  {r.kind}
                </span>
                {loading && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 ring-1 ring-inset ring-amber-600/25">
                    rolling out · {r.rollout}% of workspaces
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => toggle(r.version)}
                aria-expanded={open}
                className="mt-2 flex w-full items-center justify-between gap-2 text-left"
              >
                <span className={`text-sm font-bold ${loading ? "text-slate-500" : "text-slate-900"}`}>{r.title}</span>
                <span className={`text-xs font-bold text-teal-700 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true">
                  ▾
                </span>
              </button>
              {loading && !rolledOut && (
                <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-amber-100" role="progressbar" aria-valuenow={r.rollout} aria-valuemin={0} aria-valuemax={100} aria-label={`${r.version} rollout progress`}>
                  <span className="block h-full rounded-full bg-amber-500 transition-all" style={{ width: `${r.rollout}%` }} />
                </span>
              )}
              {open && (
                <ul className="mt-2 space-y-1 border-t border-slate-100 pt-2">
                  {r.notes.map((n) => (
                    <li key={n} className="flex gap-2 text-xs leading-relaxed text-slate-500">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-teal-600" aria-hidden="true" />
                      {n}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
          const stamp = (
            <time dateTime={r.datetime} className={`block font-mono text-[11px] leading-snug text-slate-500 ${leftSide ? "md:text-right" : "md:text-left"} max-md:text-left`}>
              {r.dateShort}
              <br />
              <span className="text-slate-400">{r.kind === "minor" ? "minor release" : "patch"}</span>
            </time>
          );
          return (
            <li key={r.version} className="grid grid-cols-[28px_1fr] gap-3 md:grid-cols-[1fr_48px_1fr] md:gap-0">
              {/* mobile spine */}
              <span className="relative flex justify-center pt-4 md:hidden" aria-hidden="true">
                <span className={`size-4 shrink-0 rounded-full ${loading ? "border-2 border-amber-600 bg-white" : "bg-teal-700"}`} />
                {i < last && <span className="absolute left-1/2 top-8 h-[calc(100%-1rem)] w-0.5 -translate-x-1/2 bg-slate-200" />}
              </span>
              <span className="pb-4 md:hidden">{card}</span>

              {/* desktop zigzag */}
              <span className={`hidden pb-5 pl-1 pr-6 md:block ${leftSide ? "" : "row-start-1"}`}>
                {leftSide ? card : stamp}
              </span>
              <span className="relative hidden justify-center pt-5 md:flex" aria-hidden="true">
                {loading ? (
                  <span className="relative grid size-5 place-items-center">
                    <span className="tl-ping-ring absolute inset-0 rounded-full bg-amber-500/50" />
                    <span className="relative size-5 rounded-full border-2 border-amber-600 bg-white" />
                  </span>
                ) : (
                  <span className="size-5 rounded-full bg-teal-700 ring-4 ring-teal-700/10" />
                )}
                {i < last && (
                  <span className="absolute left-1/2 top-10 h-[calc(100%-1.5rem)] w-0.5 -translate-x-1/2 rounded-full bg-slate-200" />
                )}
                {i === last && (
                  <span className="absolute left-1/2 top-10 -translate-x-1/2">
                    <span className="block size-2 rounded-full border-2 border-dashed border-slate-300 bg-white" />
                  </span>
                )}
              </span>
              <span className={`hidden pb-5 pl-6 pr-1 md:block ${leftSide ? "" : "row-start-1"}`}>
                {leftSide ? stamp : card}
              </span>
            </li>
          );
        })}
      </ol>
      {visible.length === 0 && (
        <p className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
          No releases under this filter.
        </p>
      )}

      <aside className="mt-6 rounded-2xl border border-teal-700/20 bg-teal-50/60 p-4 shadow-sm">
        <p className="text-xs font-bold text-teal-800">Why a timeline fits here</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          A changelog is history with a heartbeat: users ask “what changed since I last looked, and is
          the newest thing safe yet?” Alternating sides gives long release notes room to breathe,
          version pills make scanning by number instant, expandable notes keep the page short, and the
          rolling-out pulse on v4.2 honestly says “still landing” instead of pretending it is done.
        </p>
      </aside>
    </main>
  );
}
