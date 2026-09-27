"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type BubbleKind = "text" | "order-card" | "photo" | "chips";

type Msg = {
  id: number;
  from: "courier" | "me";
  kind: BubbleKind;
  text?: string;
  time: string;
};

const QUICK_REPLIES = ["Where's my package?", "Leave at the door", "Thanks! 🙏"];

export default function OrderTrackingPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, from: "courier", kind: "text", text: "Hi! This is Ravi, your courier for order #8421 📦 — I'm 3 stops away.", time: "14:02" },
    {
      id: 2, from: "courier", kind: "order-card", time: "14:02",
      text: "Order #8421 · Ceramic pour-over set · Qty 1 · $68.00 · Arriving today",
    },
    { id: 3, from: "me", kind: "text", text: "Great, thanks! Gate code is 4410 if you need it.", time: "14:05" },
    { id: 4, from: "courier", kind: "photo", time: "14:21", text: "Proof of delivery — left by the front door" },
    { id: 5, from: "courier", kind: "text", text: "Delivered ✅ — package is at your door. Enjoy your coffee!", time: "14:22" },
  ]);
  const [input, setInput] = useState("");
  const [usedChips, setUsedChips] = useState<string[]>([]);
  const idRef = useRef(10);
  const bottomRef = useRef<HTMLDivElement>(null);
  const delivered = true; // conversation is closed

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendChip = (chip: string) => {
    if (delivered || usedChips.includes(chip)) return;
    setUsedChips((u) => [...u, chip]);
    setMessages((m) => [
      ...m,
      { id: idRef.current++, from: "me", kind: "text", text: chip, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
  };

  const renderBubble = (m: Msg, isLastInGroup: boolean, isMineLast: boolean) => {
    if (m.kind === "order-card") {
      return (
        <div className="max-w-[75%] overflow-hidden rounded-2xl rounded-bl-md bg-white shadow-sm ring-1 ring-slate-200">
          <div className="bg-teal-700 px-4 py-2.5 text-white">
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Order #8421</p>
            <p className="text-sm font-semibold">Ceramic pour-over set</p>
          </div>
          <div className="px-4 py-3 text-sm text-slate-600">
            <div className="flex justify-between text-[13px]"><span>Qty 1</span><span className="font-semibold text-slate-900">$68.00</span></div>
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-teal-50 px-2.5 py-2 text-[12px] font-medium text-teal-800">
              <span className="h-2 w-2 rounded-full bg-teal-600" /> Out for delivery — arriving today
            </div>
          </div>
        </div>
      );
    }
    if (m.kind === "photo") {
      return (
        <div className="max-w-[75%] overflow-hidden rounded-2xl rounded-bl-md bg-white shadow-sm ring-1 ring-slate-200">
          {/* CSS-only parcel photo placeholder */}
          <div className="relative flex h-36 items-end bg-gradient-to-br from-amber-100 via-orange-50 to-slate-200 p-3" role="img" aria-label="Photo of parcel by a front door">
            <div className="absolute left-8 top-6 h-16 w-20 rounded-md bg-amber-200 shadow-md ring-1 ring-amber-300">
              <div className="mx-auto mt-0 h-full w-3 bg-amber-300/70" />
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-slate-600 shadow-sm">#8421</span>
            </div>
            <div className="absolute right-6 top-4 h-24 w-1.5 rounded bg-slate-400/60" />
            <span className="rounded-md bg-black/55 px-2 py-1 text-[11px] font-medium text-white">Front door · 14:21</span>
          </div>
          <p className="px-4 py-2.5 text-[13px] text-slate-600">{m.text}</p>
        </div>
      );
    }
    const mine = m.from === "me";
    return (
      <div
        className={`max-w-[75%] px-4 py-2.5 text-[14px] leading-relaxed shadow-sm rounded-2xl ${
          mine ? `bg-teal-700 text-white ${isLastInGroup ? "rounded-br-md" : ""}` : `bg-slate-100 text-slate-900 ${isLastInGroup ? "rounded-bl-md" : ""}`
        }`}
      >
        {m.text}
      </div>
    );
  };

  const myLastId = [...messages].reverse().find((m) => m.from === "me")?.id;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="rounded hover:text-teal-700 hover:underline">Hub</Link>
        <span>/</span>
        <span className="font-semibold text-slate-700">Order tracking</span>
        <span className="ml-auto flex gap-2">
          <Link href="/scenarios/support-chat" className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium shadow-sm hover:border-teal-600">Next: Support →</Link>
        </span>
      </nav>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">R</span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Ravi · Courier</p>
              <p className="text-xs text-slate-500">Order #8421 · Ceramic pour-over set</p>
            </div>
            <span className="ml-auto rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">✓ Delivered</span>
          </div>

          <div role="log" aria-live="polite" aria-label="Order delivery chat for order 8421" className="h-[460px] space-y-4 overflow-y-auto bg-slate-50/60 px-5 py-5">
            {messages.map((m, i) => {
              const mine = m.from === "me";
              const nextSame = messages[i + 1]?.from === m.from;
              const prevSame = messages[i - 1]?.from === m.from;
              const isLastInGroup = !nextSame;
              const showName = !mine && !prevSame;
              return (
                <div key={m.id} className={`flex items-end gap-2.5 ${mine ? "justify-end" : "justify-start"}`}>
                  {!mine && (
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-800 ${isLastInGroup ? "" : "invisible"}`} aria-hidden={!isLastInGroup}>R</span>
                  )}
                  <div className={`min-w-0 ${mine ? "flex flex-col items-end" : ""}`}>
                    {showName && <p className="mb-1 ml-1 text-xs font-semibold text-slate-500">Ravi <span className="font-normal text-slate-400">· courier</span></p>}
                    {renderBubble(m, isLastInGroup, m.id === myLastId)}
                    {isLastInGroup && (
                      <p className="mt-1 px-1 text-[11px] text-slate-400">
                        {m.time}
                        {mine && m.id === myLastId && <span> · Delivered</span>}
                      </p>
                    )}
                  </div>
                  {mine && <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-700 text-[11px] font-bold text-white">Y</span>}
                </div>
              );
            })}

            {/* quick replies */}
            <div className="flex flex-wrap gap-2 pl-9" aria-label="Quick replies">
              {QUICK_REPLIES.map((c) => {
                const used = usedChips.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    disabled={delivered || used}
                    onClick={() => sendChip(c)}
                    className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium shadow-sm transition-all ${
                      used
                        ? "border-teal-700 bg-teal-50 text-teal-800"
                        : delivered
                          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                          : "border-teal-700/40 bg-white text-teal-800 hover:bg-teal-700 hover:text-white"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-slate-100 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <label htmlFor="order-input" className="sr-only">Message courier</label>
              <input
                id="order-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={delivered ? "Chat closed — order delivered ✓" : "Message Ravi…"}
                disabled={delivered}
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              />
              <button type="button" disabled={delivered} className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-800 disabled:bg-slate-200 disabled:text-slate-400">
                Send
              </button>
            </div>
            <p className="mt-1.5 rounded-lg bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-500">
              {delivered
                ? "This chat is closed — status line appears only under your latest message, and the input is disabled after delivery. Reopen the demo by editing the code."
                : "Quick-reply chips send instantly — try one."}
            </p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Why it fits here</p>
            <h1 className="mt-1 text-lg font-bold text-slate-900">Store order chat</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Delivery chats are scans, not reads: buyers want the order card, the doorstep photo
              and one-tap replies — not paragraphs. Rich bubbles (card + photo + chips) answer
              “where&apos;s my stuff?” in seconds, and closing the input after delivery prevents
              messages nobody will read.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">What this variant shows</p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li>· Order-card bubble with live status strip</li>
              <li>· Photo bubble (proof of delivery)</li>
              <li>· Quick-reply chips + <code className="font-mono text-[12px] text-teal-800">MessageTimestamp</code> per group</li>
              <li>· Status only under own latest; input disabled after delivery</li>
            </ul>
          </div>
          <div className="grid gap-2">
            <Link href="/" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 shadow-sm hover:border-teal-600 hover:text-teal-800">← Back to hub</Link>
            <Link href="/scenarios/support-chat" className="rounded-xl bg-teal-700 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-teal-800">Next scenario: Support chat →</Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
