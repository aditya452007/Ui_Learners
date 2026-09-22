"use client";

import { useEffect, useRef, useState } from "react";
import { ScenarioNav } from "../../components/nav";

interface FeedEvent {
  id: string;
  kind: "commit" | "comment" | "deploy";
  actor: string;
  initials: string;
  color: string;
  text: string;
  detail: string;
  datetime: string;
  relative: string;
  loading?: boolean;
}

const SEED_TODAY: FeedEvent[] = [
  {
    id: "deploy-418",
    kind: "deploy",
    actor: "Mara K.",
    initials: "MK",
    color: "bg-teal-700",
    text: "deployed staging → production",
    detail: "release v4.2-rc.3 · 0 errors in canary",
    datetime: "2026-09-22T09:41:00",
    relative: "12m ago",
  },
  {
    id: "comment-91",
    kind: "comment",
    actor: "Jonas P.",
    initials: "JP",
    color: "bg-slate-500",
    text: "commented on “Offline conflict UI”",
    detail: "“Can we keep the banner until sync lands? Otherwise LGTM.”",
    datetime: "2026-09-22T09:05:00",
    relative: "48m ago",
  },
  {
    id: "commit-a91f",
    kind: "commit",
    actor: "Ava R.",
    initials: "AR",
    color: "bg-teal-600",
    text: "pushed 3 commits to main",
    detail: "a91f2c4 “fix: retry sync with backoff” + 2 more",
    datetime: "2026-09-22T08:12:00",
    relative: "1h ago",
  },
];

const SEED_YESTERDAY: FeedEvent[] = [
  {
    id: "deploy-417",
    kind: "deploy",
    actor: "Mara K.",
    initials: "MK",
    color: "bg-teal-700",
    text: "deployed feature flags cleanup",
    detail: "removed 14 stale flags · −2.1 kb bundle",
    datetime: "2026-09-21T16:20:00",
    relative: "yesterday",
  },
  {
    id: "commit-77bd",
    kind: "commit",
    actor: "Theo L.",
    initials: "TL",
    color: "bg-slate-500",
    text: "merged PR #482 “dashboard filters”",
    detail: "+412 −96 · reviewed by Ava",
    datetime: "2026-09-21T11:02:00",
    relative: "yesterday",
  },
];

const KIND_ICON: Record<FeedEvent["kind"], string> = {
  commit: "⎇",
  comment: "💬",
  deploy: "▲",
};

const ROTATION: Omit<FeedEvent, "id" | "datetime" | "relative" | "loading">[] = [
  {
    kind: "commit",
    actor: "Ava R.",
    initials: "AR",
    color: "bg-teal-600",
    text: "pushed 2 commits to main",
    detail: "“feat: offline queue UI” · CI green",
  },
  {
    kind: "comment",
    actor: "Theo L.",
    initials: "TL",
    color: "bg-slate-500",
    text: "commented on “release checklist”",
    detail: "“Canary looks clean — ship it.”",
  },
  {
    kind: "deploy",
    actor: "Mara K.",
    initials: "MK",
    color: "bg-teal-700",
    text: "deployed canary → 25% traffic",
    detail: "no elevated errors after 10 min",
  },
];

function toISO(d: Date) {
  return d.toISOString();
}

export default function TeamActivityPage() {
  const [live, setLive] = useState<FeedEvent[]>([]);
  const [simCount, setSimCount] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const simulate = () => {
    const template = ROTATION[simCount % ROTATION.length];
    const id = `live-${Date.now()}-${simCount}`;
    const now = new Date();
    const item: FeedEvent = {
      ...template,
      id,
      datetime: toISO(now),
      relative: "just now",
      loading: true,
    };
    setLive((prev) => [item, ...prev]);
    setSimCount((c) => c + 1);
    const t = setTimeout(() => {
      setLive((prev) => prev.map((e) => (e.id === id ? { ...e, loading: false } : e)));
    }, 3000);
    timers.current.push(t);
  };

  const today = [...live, ...SEED_TODAY];
  const groups: { label: string; sub: string; items: FeedEvent[] }[] = [
    { label: "Today", sub: "Tue, Sep 22", items: today },
    { label: "Yesterday", sub: "Mon, Sep 21", items: SEED_YESTERDAY },
  ];

  const renderRow = (e: FeedEvent, i: number, last: boolean) => (
    <li key={e.id} className="grid grid-cols-[64px_40px_1fr] items-stretch gap-1 sm:grid-cols-[84px_44px_1fr]">
      <time
        dateTime={e.datetime}
        title={e.datetime}
        className="block pt-3 text-right font-mono text-[11px] leading-snug text-slate-500"
      >
        {e.relative}
      </time>
      <span className="relative flex justify-center pt-2" aria-hidden="true">
        {e.loading ? (
          <span className="relative grid size-9 place-items-center">
            <span className="tl-ping-ring absolute inset-0 rounded-full bg-teal-500/50" />
            <span className="relative grid size-9 place-items-center rounded-full border-2 border-dashed border-teal-600 bg-white text-[10px] font-bold text-teal-700">
              {e.initials}
            </span>
          </span>
        ) : (
          <span className={`grid size-9 place-items-center rounded-full text-[11px] font-bold text-white ${e.color}`} title={e.actor}>
            {e.initials}
          </span>
        )}
        {!last && <span className="absolute left-1/2 top-12 h-[calc(100%-2.5rem)] w-0.5 -translate-x-1/2 rounded-full bg-slate-200" />}
      </span>
      <span className={`mb-1 rounded-xl border px-3 py-2.5 transition ${e.loading ? "border-teal-600/25 bg-teal-50/60" : "border-slate-200 bg-white shadow-sm"}`}>
        <span className={`block text-[13px] ${e.loading ? "text-slate-400" : "text-slate-800"}`}>
          <span className="font-bold text-slate-900">{e.actor}</span> {e.text}
          {e.loading && (
            <span className="ml-2 rounded-full bg-teal-100 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-teal-800">
              syncing…
            </span>
          )}
        </span>
        <span className={`mt-0.5 block truncate text-xs ${e.loading ? "text-slate-400" : "text-slate-500"}`}>{e.detail}</span>
        <span className="mt-1 block font-mono text-[10px] text-slate-400">
          {KIND_ICON[e.kind]} {e.kind}
        </span>
      </span>
    </li>
  );

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <ScenarioNav prev={{ href: "/scenarios/product-changelog", label: "Changelog" }} />

      <header className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Scenario 3 — live feed</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Team activity</h1>
        <p className="mt-1 text-sm text-slate-500">
          Acme web app · 6 people online. Dots are <span className="font-semibold text-slate-700">avatars</span>,
          times are relative (“2m ago”) with the full{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px]">{"<time dateTime>"}</code>{" "}
          on hover. Press the button to fake a live event: it lands hollow + pulsing, then goes solid after ~3s.
        </p>
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-teal-600" />
          </span>
          Live · connected
        </span>
        <button
          type="button"
          onClick={simulate}
          className="ml-auto rounded-full bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          ⚡ Simulate live event
        </button>
      </div>

      {groups.map((g) => (
        <section key={g.label} aria-label={g.label} className="mt-6">
          <div className="mb-2 flex items-baseline gap-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700">{g.label}</h2>
            <p className="font-mono text-[11px] text-slate-400">{g.sub}</p>
            <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
            <p className="font-mono text-[11px] text-slate-400">{g.items.length} events</p>
          </div>
          <ol aria-label={`${g.label} activity`} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3 shadow-sm">
            {g.items.map((e, i) => renderRow(e, i, i === g.items.length - 1))}
          </ol>
        </section>
      ))}

      <aside className="mt-6 rounded-2xl border border-teal-700/20 bg-teal-50/60 p-4 shadow-sm">
        <p className="text-xs font-bold text-teal-800">Why a timeline fits here</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          An activity feed is a changelog written by people: newest first, forever growing, read in
          glances. Avatar dots answer “who” before a word is read, relative times (“2m ago”) match how
          humans think about fresh events while the full timestamp stays one hover away, day headers
          chunk the scroll — and the hollow syncing state tells the truth about events that have
          arrived but not landed yet.
        </p>
      </aside>
    </main>
  );
}
