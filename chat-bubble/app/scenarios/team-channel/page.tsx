"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Msg = { id: number; author: string; initials: string; color: string; text: string; time: string; mine?: boolean };

const SEED: Msg[] = [
  { id: 1, author: "Dana", initials: "D", color: "bg-amber-100 text-amber-800", text: "Morning standup 🌅 — drop your update!", time: "09:00" },
  { id: 2, author: "Marcus", initials: "M", color: "bg-sky-100 text-sky-800", text: "Yesterday: finished checkout API + wrote 12 tests", time: "09:02" },
  { id: 3, author: "Marcus", initials: "M", color: "bg-sky-100 text-sky-800", text: "Today: rate-limiting middleware, then review Dana's PR", time: "09:02" },
  { id: 4, author: "Marcus", initials: "M", color: "bg-sky-100 text-sky-800", text: "Blockers: none, but staging is slow 🐌", time: "09:03" },
  { id: 5, author: "Aisha", initials: "A", color: "bg-rose-100 text-rose-800", text: "Shipped the new onboarding illustrations — preview in Figma, would love eyes on the empty-state one specifically", time: "09:07" },
  { id: 6, author: "You", initials: "Y", color: "bg-teal-700 text-white", text: "Nice! Reviewed — left two nits, otherwise LGTM ✅", time: "09:12", mine: true },
  { id: 7, author: "You", initials: "Y", color: "bg-teal-700 text-white", text: "My update: landing page copy is in, wiring the waitlist form today", time: "09:12", mine: true },
  { id: 8, author: "Leo", initials: "L", color: "bg-emerald-100 text-emerald-800", text: "Deploys are green again — staging slowness was a runaway cron, killed it", time: "09:15" },
];

export default function TeamChannelPage() {
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [input, setInput] = useState("");
  const idRef = useRef(100);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((m) => [
      ...m,
      {
        id: idRef.current++,
        author: "You",
        initials: "Y",
        color: "bg-teal-700 text-white",
        text: clean,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        mine: true,
      },
    ]);
    setInput("");
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="rounded hover:text-teal-700 hover:underline">Hub</Link>
        <span>/</span>
        <span className="font-semibold text-slate-700">Team channel</span>
        <span className="ml-auto flex gap-2">
          <Link href="/scenarios/order-tracking" className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium shadow-sm hover:border-teal-600">Next: Orders →</Link>
        </span>
      </nav>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-sm font-semibold text-slate-900">#launch-pad <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">4 members</span></p>
            <div className="mt-2 flex items-center gap-1.5">
              {[["D", "bg-amber-100 text-amber-800"], ["M", "bg-sky-100 text-sky-800"], ["A", "bg-rose-100 text-rose-800"], ["L", "bg-emerald-100 text-emerald-800"]].map(([l, c]) => (
                <span key={l} className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${c}`}>{l}</span>
              ))}
              <span className="ml-1 text-xs text-slate-500">Dana · Marcus · Aisha · Leo + you</span>
            </div>
          </div>

          <div role="log" aria-live="polite" aria-label="Team standup in launch-pad channel" className="h-[440px] space-y-4 overflow-y-auto bg-slate-50/60 px-5 py-5">
            <div className="flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-500">Today</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            {messages.map((m, i) => {
              const prevSame = messages[i - 1]?.author === m.author;
              const nextSame = messages[i + 1]?.author === m.author;
              const showName = !prevSame;
              const isLast = !nextSame;
              const isMe = !!m.mine;
              return (
                <div key={m.id} className={`flex items-end gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}>
                  {!isMe && (
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${isLast ? m.color : "invisible"}`} aria-hidden={!isLast}>
                      {m.initials}
                    </span>
                  )}
                  <div className={`min-w-0 max-w-[75%] ${isMe ? "flex flex-col items-end" : ""}`}>
                    {showName && (
                      <p className={`mb-1 text-xs font-semibold ${isMe ? "text-teal-800" : "text-slate-500"}`}>
                        {m.author} <span className="font-normal text-slate-400">· chat-header</span>
                      </p>
                    )}
                    <div
                      className={`px-4 py-2.5 text-[14px] leading-relaxed shadow-sm rounded-2xl ${
                        isMe
                          ? `bg-teal-700 text-white ${isLast ? "rounded-br-md" : ""}`
                          : `bg-white text-slate-900 ring-1 ring-slate-200 ${isLast ? "rounded-bl-md" : ""}`
                      }`}
                      style={{ width: m.text.length > 90 ? "100%" : undefined }}
                    >
                      {m.text}
                    </div>
                    {isLast && (
                      <p className="mt-1 px-1 text-[11px] text-slate-400">
                        {m.time}{isMe ? " · Sent" : ""}
                      </p>
                    )}
                  </div>
                  {isMe && (
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-700 text-[11px] font-bold text-white ${isLast ? "" : "invisible"}`} aria-hidden={!isLast}>
                      Y
                    </span>
                  )}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <form className="border-t border-slate-100 bg-white px-4 py-3" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <div className="flex items-center gap-2">
              <label htmlFor="team-input" className="sr-only">Message launch-pad</label>
              <input
                id="team-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message #launch-pad…"
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:bg-white focus:outline-none"
              />
              <button type="submit" disabled={!input.trim()} className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-800 disabled:bg-slate-200 disabled:text-slate-400">
                Send
              </button>
            </div>
            <p className="mt-1.5 px-1 text-[11px] text-slate-400">
              Grouping demo: post twice in a row — your name shows once, the tail only on your last bubble.
            </p>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Why it fits here</p>
            <h1 className="mt-1 text-lg font-bold text-slate-900">Group standup</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              In a busy channel, ten back-to-back messages blur together. Grouping (name only on
              first, tail only on last, avatar only on last) turns a wall of bubbles into readable
              turns. Varied widths keep long updates scannable — and nobody needs read receipts on
              every “👍”.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">What this variant shows</p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li>· Consecutive-message grouping with <code className="font-mono text-[12px] text-teal-800">chat-header</code> once per run</li>
              <li>· Date divider (“Today”) splitting the log</li>
              <li>· Narrow vs wide bubbles by message length</li>
              <li>· No read receipts on received — time only</li>
            </ul>
          </div>
          <div className="grid gap-2">
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 shadow-sm hover:border-teal-600 hover:text-teal-800">← Back to hub</Link>
            <Link href="/scenarios/order-tracking" className="rounded-xl bg-teal-700 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-teal-800">Next scenario: Order tracking →</Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
