"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const MESSAGES = [
  { sender: "Alice", text: "Hey! Did you see the new design system?", time: "10:32 AM" },
  { sender: "You", text: "Yes! The carets are gorgeous now 💜", time: "10:33 AM" },
  { sender: "Alice", text: "I know right? The violet one is my favorite", time: "10:33 AM" },
];

function ChatBubble({
  message,
  isOwn,
}: {
  message: (typeof MESSAGES)[number];
  isOwn: boolean;
}) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-xs rounded-2xl px-4 py-3
          ${isOwn
            ? "rounded-br-md bg-violet-600/80 text-white"
            : "rounded-bl-md bg-white/[0.06] text-white/80"
          }
        `}
      >
        <p className="text-sm">{message.text}</p>
        <p className="mt-1 text-[10px] opacity-50">{message.time}</p>
      </div>
    </div>
  );
}

export default function ChatComposerScenario() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(MESSAGES);
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    setMessages((prev) => [...prev, { sender: "You", text: input, time }]);
    setInput("");
    setCharCount(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      {/* Nav */}
      <nav className="mb-10 flex items-center gap-3 text-sm">
        <Link
          href="/"
          className="text-white/40 transition-colors hover:text-white/70"
        >
          ← Hub
        </Link>
        <span className="text-white/10">/</span>
        <span className="text-violet-400">Chat Composer</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
          Scenario: Chat Composer
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-white/50">
          In a messaging app, the caret is a subtle but constant presence. A
          violet caret matches the brand accent — it feels like part of the
          conversation, not a system artifact.
        </p>
      </header>

      {/* Chat window */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0a14] shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.03] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600/30 text-xs font-bold text-violet-300">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">Alice</p>
              <p className="text-[10px] text-green-400">● Online</p>
            </div>
          </div>
          <span className="text-xs text-white/30">Design Chat</span>
        </div>

        {/* Messages */}
        <div className="h-72 space-y-3 overflow-y-auto p-4">
          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg} isOwn={msg.sender === "You"} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <div className="border-t border-white/[0.06] bg-white/[0.02] p-4">
          <div
            className={`
              flex items-end gap-3 rounded-xl border transition-all duration-300
              ${isFocused
                ? "border-violet-500/30 bg-white/[0.04] shadow-[0_0_20px_rgba(139,92,246,0.08)]"
                : "border-white/[0.06] bg-white/[0.02]"
              }
            `}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setCharCount(e.target.value.length);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type a message…"
              className="
                max-h-24 flex-1 resize-none bg-transparent px-4 py-3
                text-sm text-white/90 caret-violet placeholder:text-white/25
                focus:outline-none
              "
              style={{ minHeight: "44px" }}
              spellCheck={false}
            />

            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`
                mb-1 rounded-lg px-4 py-2 text-xs font-medium transition-all
                ${input.trim()
                  ? "bg-violet-600 text-white hover:bg-violet-500"
                  : "bg-white/[0.05] text-white/20"
                }
              `}
            >
              Send
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between px-1">
            <p className="text-[10px] text-white/20">
              Press Enter to send · Shift+Enter for new line
            </p>
            <p className="text-[10px] text-white/20">
              {charCount > 0 && `${charCount} chars`}
            </p>
          </div>
        </div>
      </div>

      {/* Why it fits */}
      <section className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-violet-400/70">
          Why it fits here
        </h2>
        <p className="text-sm leading-relaxed text-white/50">
          The chat composer shows how a branded caret reinforces identity. The
          violet blink matches the app&apos;s accent color, making the input
          feel cohesive rather than generic. The auto-expanding textarea
          demonstrates how the caret adapts to dynamic content heights.
        </p>
      </section>

      {/* Footer nav */}
      <nav className="mt-10 flex items-center justify-between border-t border-white/[0.06] pt-6">
        <Link
          href="/scenarios/code-editor"
          className="text-sm text-white/40 transition-colors hover:text-white/70"
        >
          ← Code Editor
        </Link>
        <Link
          href="/scenarios/multi-field-form"
          className="text-sm text-violet-400 transition-colors hover:text-violet-300"
        >
          Next: Multi-Field Form →
        </Link>
      </nav>
    </main>
  );
}
