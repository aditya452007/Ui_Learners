"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Status = "sent" | "delivered" | "read";

type Msg = {
  id: number;
  from: "me" | "agent";
  text: string;
  time: string;
  status?: Status;
};

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const AGENT_REPLIES = [
  "Thanks for reaching out — I can see your order on my side. Could you tell me what exactly arrived damaged?",
  "Got it, thank you. I've opened a replacement request — you'll get a prepaid return label by email in a minute.",
  "And good news: the replacement ships today, arriving Thursday. Anything else I can help with?",
];

export default function SupportChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, from: "me", text: "Hi! My headphones arrived with a cracked case 😕", time: "09:41", status: "read" },
    { id: 2, from: "agent", text: "Hi there, this is Priya from support. I'm sorry about that — let me sort it out right away.", time: "09:42" },
    { id: 3, from: "agent", text: "Could you share your order number? It looks like #8421 but I want to be sure.", time: "09:42" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [replyIdx, setReplyIdx] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(4);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean || typing) return;
    const id = idRef.current++;
    const mine: Msg = { id, from: "me", text: clean, time: now(), status: "sent" };
    setMessages((m) => [...m, mine]);
    setInput("");

    // sent -> delivered -> typing -> read + reply
    setTimeout(() => {
      setMessages((m) => m.map((x) => (x.id === id ? { ...x, status: "delivered" as Status } : x)));
    }, 600);

    setTimeout(() => setTyping(true), 1200);

    setTimeout(() => {
      setTyping(false);
      setMessages((m) => m.map((x) => (x.id === id ? { ...x, status: "read" as Status } : x)));
      setMessages((m) => [
        ...m,
        {
          id: idRef.current++,
          from: "agent",
          text: AGENT_REPLIES[Math.min(replyIdx, AGENT_REPLIES.length - 1)],
          time: now(),
        },
      ]);
      setReplyIdx((i) => i + 1);
    }, 2600);
  };

  const statusLabel = (s?: Status) =>
    s === "read" ? "Read ✓✓" : s === "delivered" ? "Delivered ✓✓" : "Sent ✓";

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="rounded hover:text-teal-700 hover:underline">Hub</Link>
        <span>/</span>
        <span className="font-semibold text-slate-700">Support chat</span>
        <span className="ml-auto flex gap-2">
          <Link href="/scenarios/team-channel" className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium shadow-sm hover:border-teal-600">Next: Team →</Link>
        </span>
      </nav>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* header */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
              P
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Priya · Support agent</p>
              <p className="text-xs text-emerald-600">{typing ? "typing…" : "online — replies instantly"}</p>
            </div>
            <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">Ticket #1042</span>
          </div>

          {/* log */}
          <div
            role="log"
            aria-live="polite"
            aria-label="Support conversation with Priya"
            className="h-[420px] space-y-3 overflow-y-auto bg-slate-50/60 px-5 py-5"
          >
            {messages.map((m, i) => {
              const isMe = m.from === "me";
              const lastOfGroup = messages[i + 1]?.from !== m.from;
              return (
                <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] ${isMe ? "items-end text-right" : "items-start"}`}>
                    {!isMe && (i === 0 || messages[i - 1]?.from !== "agent") && (
                      <p className="mb-1 ml-1 text-left text-xs font-semibold text-slate-500">Priya</p>
                    )}
                    <div
                      className={`px-4 py-2.5 text-[14px] leading-relaxed shadow-sm rounded-2xl ${
                        isMe
                          ? `bg-teal-700 text-white ${lastOfGroup ? "rounded-br-md" : ""}`
                          : `bg-slate-100 text-slate-900 ${lastOfGroup ? "rounded-bl-md" : ""}`
                      } text-left`}
                    >
                      {m.text}
                    </div>
                    <p className="mt-1 px-1 text-[11px] text-slate-400">
                      {m.time}
                      {isMe && lastOfGroup && (
                        <span className={m.status === "read" ? "font-semibold text-teal-700" : ""}>
                          {" "}· {statusLabel(m.status)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
            {typing && (
              <div className="flex justify-start">
                <div
                  role="status"
                  aria-label="Priya is typing"
                  className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200"
                >
                  <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* input */}
          <form
            className="border-t border-slate-100 bg-white px-4 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <div className="flex items-center gap-2">
              <label htmlFor="support-input" className="sr-only">Message Priya</label>
              <input
                id="support-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your reply…"
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                Send
              </button>
            </div>
            <p className="mt-1.5 px-1 text-[11px] text-slate-400">
              Demo: your message goes Sent → Delivered, Priya “types” after 1.2s, then it turns Read with her reply.
            </p>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Why it fits here</p>
            <h1 className="mt-1 text-lg font-bold text-slate-900">1:1 helpdesk</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Support chats live or die on trust: “did they get it, are they answering?” Receipts
              (sent / delivered / read) plus a typing indicator remove that anxiety. The customer
              keeps typing instead of opening a second ticket — faster resolution, fewer errors.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">What this variant shows</p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li>· <code className="font-mono text-[12px] text-teal-800">1:1</code> — no grouping, every own message keeps its tail</li>
              <li>· Status progression on <em>your latest</em> message only</li>
              <li>· Agent typing simulated with a 1.2s delay</li>
              <li>· Auto-scroll to bottom on every new message</li>
            </ul>
          </div>
          <div className="grid gap-2">
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 shadow-sm hover:border-teal-600 hover:text-teal-800">← Back to hub</Link>
            <Link href="/scenarios/team-channel" className="rounded-xl bg-teal-700 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-teal-800">Next scenario: Team channel →</Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
