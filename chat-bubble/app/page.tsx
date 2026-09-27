"use client";

import Link from "next/link";
import { useState } from "react";

type PartId = 1 | 2 | 3 | 4 | null;

const PART_META: Record<
  number,
  { code: string; title: string; what: string; how: string }
> = {
  1: {
    code: "chat-bubble",
    title: "Message bubble",
    what: "The rounded container that holds one message. Its side tells you instantly who is talking — left is them, right is you — and its colour separates your words from theirs at a glance.",
    how: "Props are the settings you hand the component, like side=\"sent\" or tone=\"neutral\". State is what it remembers, such as whether this bubble is selected. When you click a bubble, an onClick event fires and React re-renders (redraws the screen), adding a highlight ring — like sticking a flag on a mailbox so you can find it again.",
  },
  2: {
    code: "bubble tail",
    title: "Bubble tail",
    what: "The slightly pointed corner on the speaker's side. It works like the tail of a comic speech bubble — it points back toward the person talking, so a fast scroll still reads clearly.",
    how: "There is no extra element: the tail is just one corner with a smaller border-radius (e.g. rounded-bl-md instead of rounded-bl-2xl). When grouped mode is on, only the last bubble in a run keeps its tail — when you toggle grouping off, every bubble gets its tail back because each one re-renders as a standalone message.",
  },
  3: {
    code: "<MessageStatus /> + <MessageTimestamp />",
    title: "Status + timestamp",
    what: "The small grey line under your latest message — “Read · 10:06”. It answers “did they see it?” without you having to ask, and the time tells you how fresh the conversation is.",
    how: "Timestamp is a prop (a plain string like \"10:06\") rendered in a <time> element. Status is state that moves sent → delivered → read as fake network events arrive. aria-live=\"polite\" on the message list tells screen readers to announce new messages calmly, the way a polite assistant waits for a pause before speaking.",
  },
  4: {
    code: "<TypingIndicator />",
    title: "Typing indicator",
    what: "Three dots that bounce while the other person is typing. It holds your attention for a second and signals “a reply is coming — stay here” instead of leaving you staring at silence.",
    how: "It is a tiny component with three <span> dots animated by a CSS @keyframes rule (a repeating bounce). When showTyping state is true it renders; when false it unmounts (is removed from the screen). It has aria-label=\"Maya is typing\" so screen readers announce it, and under prefers-reduced-motion the bounce turns off — like switching a flashing sign to a steady one.",
  },
};

function Pill({
  n,
  active,
  onSelect,
  className = "",
}: {
  n: number;
  active: boolean;
  onSelect: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={`Highlight part ${n}: ${PART_META[n].title}`}
      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold shadow-sm ring-2 transition-all focus-visible:outline-teal-700 ${
        active
          ? "bg-teal-700 text-white ring-teal-700 scale-110"
          : "bg-white text-teal-800 ring-teal-700 hover:scale-105"
      } ${className}`}
    >
      {n}
    </button>
  );
}

export default function HubPage() {
  const [showTyping, setShowTyping] = useState(true);
  const [grouped, setGrouped] = useState(true);
  const [selected, setSelected] = useState<PartId>(1);

  const highlight = (n: number) => selected === n;

  const recvBubble = (isLast: boolean, isFirst: boolean, tailOn: boolean) =>
    `max-w-[75%] px-4 py-2.5 text-[14px] leading-relaxed shadow-sm transition-all cursor-pointer rounded-2xl bg-slate-100 text-slate-900 ${
      tailOn ? (isLast ? "rounded-bl-md" : "") : "rounded-bl-md"
    } ${highlight(1) ? "ring-2 ring-teal-600 ring-offset-2" : "hover:ring-1 hover:ring-teal-500 hover:ring-offset-1"}`;

  const sentBubble = (isLast: boolean, tailOn: boolean) =>
    `max-w-[75%] px-4 py-2.5 text-[14px] leading-relaxed shadow-sm transition-all cursor-pointer rounded-2xl bg-teal-700 text-white ${
      tailOn ? (isLast ? "rounded-br-md" : "") : "rounded-br-md"
    } ${highlight(1) ? "ring-2 ring-teal-900 ring-offset-2" : "hover:ring-1 hover:ring-teal-900 hover:ring-offset-1"}`;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Title */}
      <div className="max-w-3xl">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-teal-700/20 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-700" />
          Web component · Conversation UI
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Chat Bubble</h1>
        <p className="mt-2 text-sm text-slate-500">
          Also called:{" "}
          <span className="font-mono text-[13px] text-slate-600">
            message bubble · speech bubble · chat message · text bubble · conversation bubble ·
            messenger bubble
          </span>
        </p>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-600">
          The small rounded container that carries one message inside a conversation. Side, colour
          and shape tell you who said what — before you read a single word.
        </p>
      </div>

      {/* Intro strip */}
      <section aria-label="What am I looking at" className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            step: "1 · Row",
            title: "Message list is a log",
            body: "The whole conversation is a role=\"log\" list. New messages append at the bottom and screen readers announce them politely.",
            mono: 'role="log" aria-live="polite"',
          },
          {
            step: "2 · Bubble",
            title: "Bubble carries the words",
            body: "Left = received on slate, right = sent in teal. Width grows with the text, capped at 75% so lines stay readable.",
            mono: "max-w-[75%] · sent / received",
          },
          {
            step: "3 · Metadata",
            title: "Time + status close the loop",
            body: "Timestamps say when, status says whether it arrived. The footer under your latest message is the receipt.",
            mono: "<MessageTimestamp /> <MessageStatus />",
          },
        ].map((c) => (
          <div
            key={c.step}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">{c.step}</p>
            <h2 className="mt-1 text-[15px] font-semibold text-slate-900">{c.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.body}</p>
            <p className="mt-3 rounded-lg bg-slate-50 px-2.5 py-1.5 font-mono text-[11.5px] text-slate-600">
              {c.mono}
            </p>
          </div>
        ))}
      </section>

      {/* Controls */}
      <section className="mt-10 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Anatomy controls</span>
          <button
            type="button"
            onClick={() => setShowTyping((v) => !v)}
            aria-pressed={showTyping}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              showTyping
                ? "bg-teal-700 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Typing: {showTyping ? "on" : "off"}
          </button>
          <button
            type="button"
            onClick={() => setGrouped((v) => !v)}
            aria-pressed={grouped}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              grouped
                ? "bg-teal-700 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tails: {grouped ? "grouped" : "every bubble"}
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Tip: click any bubble, tail corner, status line or the typing dots to highlight its
          explanation below.
        </p>
      </section>

      {/* Anatomy diagram */}
      <section
        aria-label="Live anatomy diagram"
        className="mt-4 grid gap-6 lg:grid-cols-[1.35fr_1fr]"
      >
        {/* Chat panel */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
              M
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Maya + You</p>
              <p className="text-xs text-slate-500">Planning the Big Sur weekend · online</p>
            </div>
            <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              ● live demo
            </span>
          </div>

          <div
            role="log"
            aria-live="polite"
            aria-label="Weekend trip conversation between Maya and you"
            className="space-y-4 bg-slate-50/60 px-5 py-6"
          >
            {/* Maya group */}
            <div className="flex items-end gap-2.5">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-300 text-[11px] font-bold text-slate-700"
                title="chat-image: avatar for Maya"
              >
                M
              </span>
              <div className="relative min-w-0 flex-1">
                <p className="mb-1 ml-1 text-xs font-semibold text-slate-500">
                  Maya <span className="font-normal text-slate-400">· chat-header</span>
                </p>
                <div className="space-y-1.5">
                  <div className="relative w-fit max-w-full">
                    <div
                      className={recvBubble(false, true, grouped)}
                      onClick={() => setSelected(1)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setSelected(1)}
                    >
                      Hey! Are you still up for the coast trip this weekend? 🚗
                    </div>
                  </div>
                  <div className="relative w-fit max-w-full">
                    <div
                      className={recvBubble(true, false, grouped)}
                      onClick={() => setSelected(1)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setSelected(1)}
                    >
                      I found a cabin near Big Sur — sleeps 4, hot tub, $180/night
                    </div>
                    {/* Pill 1 + Pill 2 anchored to last Maya bubble */}
                    <Pill
                      n={1}
                      active={highlight(1)}
                      onSelect={() => setSelected(1)}
                      className="absolute -right-9 top-1/2 -translate-y-1/2"
                    />
                    <button
                      type="button"
                      onClick={() => setSelected(2)}
                      aria-pressed={highlight(2)}
                      aria-label="Highlight part 2: bubble tail"
                      title="Bubble tail — the tighter corner"
                      className={`absolute -bottom-1 left-0 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold shadow-sm ring-2 transition-all ${
                        highlight(2)
                          ? "bg-teal-700 text-white ring-teal-700 scale-110"
                          : "bg-white text-teal-800 ring-teal-700 hover:scale-105"
                      }`}
                    >
                      2
                    </button>
                  </div>
                </div>
                <p className="ml-1 mt-1 text-[11px] text-slate-400">10:03</p>
              </div>
            </div>

            {/* You group */}
            <div className="flex items-end justify-end gap-2.5">
              <div className="relative flex min-w-0 flex-1 flex-col items-end">
                <div className="w-fit max-w-full text-right">
                  <div
                    className={sentBubble(false, grouped)}
                    onClick={() => setSelected(1)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelected(1)}
                  >
                    Yes!! Send me the link
                  </div>
                </div>
                <div className="relative mt-1.5 w-fit max-w-full">
                  <div
                    className={sentBubble(true, grouped)}
                    onClick={() => setSelected(1)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelected(1)}
                  >
                    I can drive Friday after 5 — pickup at 5:30?
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(2)}
                    aria-pressed={highlight(2)}
                    aria-label="Highlight part 2: sent-side tail"
                    title="Tail on the sent side"
                    className={`absolute -bottom-1 right-0 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold shadow-sm ring-2 transition-all ${
                      highlight(2)
                        ? "bg-teal-700 text-white ring-teal-700 scale-110"
                        : "bg-white text-teal-800 ring-teal-700 hover:scale-105"
                    }`}
                  >
                    2
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(3)}
                  className={`mt-1.5 flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-[11px] transition-all ${
                    highlight(3)
                      ? "bg-teal-50 font-semibold text-teal-800 ring-2 ring-teal-600"
                      : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  }`}
                  aria-pressed={highlight(3)}
                >
                  <span className="relative flex items-center">
                    <Pill
                      n={3}
                      active={highlight(3)}
                      onSelect={() => setSelected(3)}
                      className="mr-1"
                    />
                  </span>
                  Read · 10:06 <span className="text-slate-300">· chat-footer</span>
                </button>
              </div>
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-700 text-[11px] font-bold text-white"
                title="chat-image: your avatar"
              >
                Y
              </span>
            </div>

            {/* Typing indicator */}
            {showTyping ? (
              <div className="flex items-end gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-300 text-[11px] font-bold text-slate-700">
                  M
                </span>
                <div className="relative">
                  <div
                    role="status"
                    aria-label="Maya is typing"
                    onClick={() => setSelected(4)}
                    onKeyDown={(e) => e.key === "Enter" && setSelected(4)}
                    tabIndex={0}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 transition-all ${
                      highlight(4)
                        ? "ring-2 ring-teal-600 ring-offset-2"
                        : "ring-slate-200 hover:ring-teal-500"
                    }`}
                  >
                    <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
                    <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
                    <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
                  </div>
                  <Pill
                    n={4}
                    active={highlight(4)}
                    onSelect={() => setSelected(4)}
                    className="absolute -right-9 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-center text-xs text-slate-400">
                Typing indicator hidden — toggle “Typing: on” above to bring back part 4.
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 bg-white px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-400">
                Message Maya… (demo — send in a scenario ↓)
              </div>
              <span className="rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white">
                Send
              </span>
            </div>
          </div>
        </div>

        {/* Leader-line legend */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Anatomy — 4 labelled parts
          </h2>
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSelected(n as 1 | 2 | 3 | 4)}
              aria-pressed={selected === n}
              className={`w-full rounded-2xl border p-4 text-left shadow-sm transition-all ${
                selected === n
                  ? "border-teal-700 bg-teal-50/60 ring-1 ring-teal-700"
                  : "border-slate-200 bg-white hover:border-teal-600/40 hover:shadow-md"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                    selected === n ? "bg-teal-700 text-white" : "bg-teal-700/10 text-teal-800"
                  }`}
                >
                  {n}
                </span>
                <span className="font-mono text-[12px] font-semibold text-teal-800">
                  {PART_META[n].code}
                </span>
              </span>
              <span className="mt-1 block text-sm font-semibold text-slate-900">
                {PART_META[n].title}
              </span>
              <span className="mt-1 block text-[13px] leading-relaxed text-slate-600">
                {PART_META[n].what.split(".")[0]}.
              </span>
            </button>
          ))}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-500 shadow-sm">
            <span className="font-semibold text-slate-700">How to read the lines:</span> pill{" "}
            <span className="font-bold text-teal-700">1</span> sits on a bubble,{" "}
            <span className="font-bold text-teal-700">2</span> on the tight tail corner,{" "}
            <span className="font-bold text-teal-700">3</span> on the Read · time footer,{" "}
            <span className="font-bold text-teal-700">4</span> on the bouncing dots. Clicking either
            end selects the same part.
          </div>
        </div>
      </section>

      {/* Layered explanations */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Every part, in two languages
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Left: what you feel as the user. Right: how you build it as a React beginner.
        </p>
        <div className="mt-6 space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <article
              key={n}
              id={`part-${n}`}
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
                selected === n ? "border-teal-700 ring-1 ring-teal-700" : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
                  {n}
                </span>
                <h3 className="text-[15px] font-semibold text-slate-900">
                  {PART_META[n].title}{" "}
                  <code className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[12px] font-normal text-teal-800">
                    {PART_META[n].code}
                  </code>
                </h3>
              </div>
              <div className="grid gap-0 md:grid-cols-2">
                <div className="px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    👀 What you see
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{PART_META[n].what}</p>
                </div>
                <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 md:border-l md:border-t-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    🛠 How it works
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{PART_META[n].how}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Lookalikes */}
      <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <h2 className="text-[15px] font-semibold text-slate-900">⚠️ Don&apos;t confuse it with…</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              Tooltip / Popover <span className="font-normal text-slate-400">vs chat bubble</span>
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              A tooltip appears when you hover a button and vanishes when you leave — it annotates
              the UI. A chat bubble lives permanently in the message log as conversation history.
              If it scrolls with the chat, it&apos;s a bubble; if it pops over a control, it&apos;s
              a tooltip.
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              Overflow “⋯” menu <span className="font-normal text-slate-400">vs typing dots</span>
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Three static dots on a button mean “more options — click me”. Three bouncing dots
              inside a bubble mean “someone is typing — wait”. Same shape, opposite job: one invites
              a click, the other asks for patience. Never make typing dots clickable as a menu.
            </p>
          </div>
        </div>
      </section>

      {/* Scenario cards */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          See it in three real products
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            {
              href: "/scenarios/support-chat",
              tag: "1:1 · receipts",
              title: "Support chat",
              body: "Helpdesk with live typing, sent → delivered → read progression and auto-scroll.",
            },
            {
              href: "/scenarios/team-channel",
              tag: "Group · grouping",
              title: "Team channel",
              body: "#launch-pad standup: tails only on last, name only on first, date dividers.",
            },
            {
              href: "/scenarios/order-tracking",
              tag: "Rich · cards",
              title: "Order tracking",
              body: "Courier chat with order cards, photo bubbles, quick replies and a closed state.",
            },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-700/40 hover:shadow-md"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                {s.tag}
              </p>
              <p className="mt-1 text-[16px] font-semibold text-slate-900 group-hover:text-teal-800">
                {s.title} →
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
