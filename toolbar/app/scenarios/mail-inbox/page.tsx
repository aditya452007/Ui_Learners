"use client";

import { useMemo, useState } from "react";
import UnifiedToolbar, {
  TButton,
  TSearch,
  type DisplayMode,
  type ToolbarItem,
} from "@/components/toolbar";
import {
  BackLink,
  ConfigChips,
  PageHeader,
  ScenarioNav,
  WhyFit,
} from "@/components/chrome";

type Msg = {
  id: number;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  flagged: boolean;
};

const SEED: Msg[] = [
  { id: 1, from: "Mara Jensen", subject: "Canyon shoot selects", preview: "Kept 24 frames — the warm light wins, see attached contact sheet…", time: "09:41", unread: true, flagged: false },
  { id: 2, from: "Dev Okafor", subject: "Gift-wrap toggle is live", preview: "Behind the feature flag, staging only. Try it with a test order…", time: "08:15", unread: true, flagged: false },
  { id: 3, from: "Priya Nair", subject: "Copy pass done", preview: "Cut fourteen adjectives, kept every noun. Draft v3 attached…", time: "Yesterday", unread: false, flagged: true },
  { id: 4, from: "Field Notes", subject: "Your order shipped", preview: "Three Expedition notebooks are on their way to Portland…", time: "Yesterday", unread: false, flagged: false },
  { id: 5, from: "Tomás Rivera", subject: "Q3 numbers, one chart", preview: "Revenue +12%, churn under 2%. The chart fits on a napkin…", time: "Tuesday", unread: false, flagged: false },
  { id: 6, from: "Support", subject: "Ticket #4182 resolved", preview: "The engraving preview now matches the proof. Thanks for flagging…", time: "Monday", unread: false, flagged: false },
];

export default function MailInbox() {
  const [msgs, setMsgs] = useState<Msg[]>(SEED);
  const [checked, setChecked] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<DisplayMode>("icon-text");
  const [winWidth, setWinWidth] = useState(580);
  const [toast, setToast] = useState<string | null>(null);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  }

  const anyChecked = checked.length > 0;

  function act(what: string, fn: (m: Msg[]) => Msg[]) {
    if (!anyChecked) return;
    setMsgs(fn);
    flash(`${what} — ${checked.length} message${checked.length > 1 ? "s" : ""}`);
    setChecked([]);
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return msgs;
    return msgs.filter((m) =>
      `${m.from} ${m.subject} ${m.preview}`.toLowerCase().includes(q),
    );
  }, [msgs, query]);

  const btn = (
    id: string,
    icon: string,
    label: string,
    priority: number,
    widths: ToolbarItem["widths"],
    onClick: () => void,
    disabled = false,
  ): ToolbarItem => ({
    id,
    label,
    icon,
    priority,
    widths,
    onAction: onClick,
    render: (m) => (
      <TButton icon={icon} label={label} mode={m} disabled={disabled} onClick={onClick} />
    ),
  });

  const items: ToolbarItem[] = [
    btn("compose", "✎", "Compose", 40, { "icon-text": 62, icon: 42, text: 70 }, () =>
      flash("New message window opened"),
    ),
    btn("archive", "🗄", "Archive", 70, { "icon-text": 62, icon: 42, text: 64 }, () =>
      act("Archived", (ms) => ms.filter((m) => !checked.includes(m.id))),
      !anyChecked,
    ),
    btn("delete", "🗑", "Delete", 65, { "icon-text": 58, icon: 42, text: 60 }, () =>
      act("Deleted", (ms) => ms.filter((m) => !checked.includes(m.id))),
      !anyChecked,
    ),
    btn("junk", "⊘", "Junk", 50, { "icon-text": 54, icon: 42, text: 52 }, () =>
      act("Marked as junk", (ms) => ms.filter((m) => !checked.includes(m.id))),
      !anyChecked,
    ),
    btn("flag", "⚑", "Flag", 55, { "icon-text": 54, icon: 42, text: 52 }, () =>
      act("Flagged", (ms) => ms.map((m) => (checked.includes(m.id) ? { ...m, flagged: true } : m))),
      !anyChecked,
    ),
    {
      id: "flex",
      label: "",
      icon: "",
      priority: 1000,
      flexible: true,
      widths: { "icon-text": 0, icon: 0, text: 0 },
      render: () => null,
    },
    {
      id: "search",
      label: "Search",
      icon: "⌕",
      priority: 100,
      control: true,
      widths: { "icon-text": 136, icon: 136, text: 136 },
      render: () => <TSearch value={query} onChange={setQuery} placeholder="Search mail" />,
    },
  ];

  function toggleCheck(id: number) {
    setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <BackLink />
        <PageHeader
          eyebrow="Scenario 2 · mail inbox"
          title="Mail-style action bar"
          alsoCalled="seven items · visibility priorities · search field item"
          lede={
            <p>
              A mailbox carries more verbs than fit, so priorities decide who survives a
              narrow window. Select a message to arm Archive, Delete, Junk, and Flag —
              with nothing selected they validate to disabled. Then drag the width slider
              and watch Junk (50) overflow before Archive (70).
            </p>
          }
        />
        <ConfigChips
          items={[
            "display: icon-text ⇄ icon",
            "priorities 40…100",
            "search field item",
            "validation on selection",
            "separator: line",
          ]}
        />

        <div className="flex flex-wrap items-center gap-2.5">
          <label className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600">
            Width
            <input
              type="range"
              min={460}
              max={760}
              step={10}
              value={winWidth}
              onChange={(e) => setWinWidth(Number(e.target.value))}
              aria-label="Window width"
              className="w-36 accent-[#0071e3]"
            />
            <span className="w-12 font-mono text-[11px] text-stone-500">{winWidth}px</span>
          </label>
          <div role="group" aria-label="Display mode" className="flex rounded-lg border border-stone-200 bg-white p-1">
            {(["icon-text", "icon"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={`rounded-md px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                  mode === m ? "bg-stone-900 text-white" : "text-stone-500 hover:bg-stone-100"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              ["Compose", 40],
              ["Junk", 50],
              ["Flag", 55],
              ["Delete", 65],
              ["Archive", 70],
              ["Search", 100],
            ].map(([label, p]) => (
              <span
                key={label as string}
                className="rounded-full bg-stone-100 px-2.5 py-1 font-mono text-[11px] text-stone-500"
                title={`${label} overflows at priority ${p} — low numbers go first`}
              >
                {label} · p{p}
              </span>
            ))}
          </div>
        </div>

        <div className="desktop-dots relative flex min-h-[480px] items-center justify-center overflow-hidden rounded-2xl border border-stone-300/70 p-6 sm:p-10">
          <UnifiedToolbar
            title="Inbox"
            proxyIcon="✉️"
            items={items}
            displayMode={mode}
            separator="line"
            width={winWidth}
            contentHeight={320}
            statusBar={
              <>
                <span>
                  {visible.length} of {msgs.length} messages
                  {anyChecked ? ` · ${checked.length} selected` : ""}
                  {query ? ` · matching “${query}”` : ""}
                </span>
                <span className="flex-1" />
                <span>Updated 09:41</span>
              </>
            }
          >
            <ul className="divide-y divide-stone-100">
              {visible.map((m) => {
                const isChecked = checked.includes(m.id);
                return (
                  <li key={m.id}>
                    <label
                      className={`flex cursor-pointer items-start gap-3 px-5 py-3 transition-colors ${
                        isChecked ? "bg-[#e8f1fd]/60" : "hover:bg-stone-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCheck(m.id)}
                        aria-label={`Select ${m.subject}`}
                        className="mt-1 size-3.5 accent-[#0071e3]"
                      />
                      <span
                        aria-hidden
                        className={`mt-[7px] size-2 shrink-0 rounded-full ${m.unread ? "bg-[#0071e3]" : "bg-transparent"}`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-2">
                          <span className={`truncate text-sm ${m.unread ? "font-semibold text-stone-900" : "font-medium text-stone-700"}`}>
                            {m.from}
                          </span>
                          {m.flagged && (
                            <span className="shrink-0 text-xs text-orange-500" title="Flagged">
                              ⚑
                            </span>
                          )}
                          <span className="ml-auto shrink-0 text-xs text-stone-400">{m.time}</span>
                        </span>
                        <span className={`block truncate text-[13px] ${m.unread ? "font-medium text-stone-800" : "text-stone-600"}`}>
                          {m.subject}
                        </span>
                        <span className="block truncate text-[13px] text-stone-400">{m.preview}</span>
                      </span>
                    </label>
                  </li>
                );
              })}
              {visible.length === 0 && (
                <li className="px-5 py-10 text-center text-sm text-stone-400">
                  {msgs.length === 0
                    ? "Inbox Zero — nicely done. Compose something new with ✎ above."
                    : `No messages match “${query}”. The search field up there is a toolbar item, not page chrome.`}
                </li>
              )}
            </ul>
          </UnifiedToolbar>

          {toast && (
            <div className="absolute bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-4 py-2 text-xs font-medium text-white shadow-lg">
              {toast}
            </div>
          )}
        </div>

        <WhyFit>
          <p>
            An inbox is a triage desk: the five verbs people reach for dozens of times a day
            must live one click away, labels included, with search riding along in the same
            row. Priorities keep the promise honest on narrow windows — Compose (40) and
            Junk (50) yield first, Archive (70) and Search (100) hold the row — and the »
            menu means no verb is ever truly gone.
          </p>
        </WhyFit>

        <ScenarioNav
          prev={{ href: "/scenarios/document-editor", label: "Document editor" }}
          next={{ href: "/scenarios/photo-browser", label: "Photo browser" }}
        />
      </div>
    </main>
  );
}
