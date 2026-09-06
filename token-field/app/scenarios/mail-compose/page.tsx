"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import TokenField, { type Token } from "@/components/TokenField";
import { Card, Eyebrow, ScenarioNav } from "@/components/chrome";

const DIRECTORY = [
  { label: "Ada Lovelace", sub: "ada@analytical.engine" },
  { label: "Grace Hopper", sub: "grace@navy.mil" },
  { label: "Alan Turing", sub: "alan@bletchley.uk" },
  { label: "Katherine Johnson", sub: "katherine@nasa.gov" },
  { label: "Margaret Hamilton", sub: "margaret@apollo.nasa.gov" },
  { label: "Linus Torvalds", sub: "linus@kernel.org" },
  { label: "Barbara Liskov", sub: "barbara@mit.edu" },
  { label: "Tim Berners-Lee", sub: "tim@w3.org" },
];

const EMAIL_RE = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;

function resolveAddress(t: Token): string {
  if (t.sub) return t.sub;
  const hit = DIRECTORY.find((d) => d.label.toLowerCase() === t.label.toLowerCase());
  if (hit) return hit.sub;
  return EMAIL_RE.test(t.label) ? t.label : "— not a valid address —";
}

export default function MailComposeScenario() {
  const [to, setTo] = useState<Token[]>([
    { id: "m1", label: "Ada Lovelace", sub: "ada@analytical.engine" },
  ]);
  const [cc, setCc] = useState<Token[]>([]);
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState("Q3 launch — review slot");
  const [sent, setSent] = useState(false);

  const invalid = useMemo(() => [...to, ...cc].filter((t) => t.invalid), [to, cc]);
  const validCount = to.length + cc.length - invalid.length;
  const canSend = to.length > 0 && invalid.length === 0 && subject.trim().length > 0;

  return (
    <div className="min-h-full bg-stone-50">
      <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-8 sm:px-8">
        <ScenarioNav current="/scenarios/mail-compose" />

        <div className="mt-8">
          <Eyebrow>Scenario 1 · Mail compose</Eyebrow>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Recipients that behave like objects
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-7 text-stone-600">
            The classic home of the token field: the <strong>To</strong> line of a compose window.
            Each recipient becomes one capsule you can select, re-edit, or delete as a unit.
          </p>
        </div>

        <Card className="mt-6 overflow-hidden">
          {/* fake window chrome */}
          <div className="flex items-center gap-1.5 border-b border-stone-100 bg-stone-50/70 px-5 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-[12.5px] font-medium text-stone-500">New message — Mercury Mail</span>
          </div>

          <div className="space-y-4 p-5 sm:p-6">
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-[12px] font-semibold uppercase tracking-wider text-stone-400">
                  To
                </label>
                {!showCc && (
                  <button
                    type="button"
                    onClick={() => setShowCc(true)}
                    className="text-[12.5px] font-medium text-blue-700 hover:underline"
                  >
                    + Cc
                  </button>
                )}
              </div>
              <TokenField
                initialTokens={to}
                suggestions={DIRECTORY}
                placeholder="Add recipients — type a name or paste addresses…"
                validate={(v) => {
                  if (EMAIL_RE.test(v)) return true;
                  return DIRECTORY.some(
                    (d) =>
                      d.label.toLowerCase() === v.toLowerCase() ||
                      d.sub.toLowerCase() === v.toLowerCase()
                  );
                }}
                onChange={(t) => {
                  setTo(t);
                  setSent(false);
                }}
                ariaLabel="To recipients"
              />
            </div>

            {showCc && (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-[12px] font-semibold uppercase tracking-wider text-stone-400">
                    Cc
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCc(false);
                      setCc([]);
                    }}
                    className="text-[12.5px] font-medium text-stone-400 hover:text-stone-600"
                  >
                    Remove Cc
                  </button>
                </div>
                <TokenField
                  initialTokens={cc}
                  suggestions={DIRECTORY}
                  placeholder="Cc…"
                  size="sm"
                  validate={(v) => {
                    if (EMAIL_RE.test(v)) return true;
                    return DIRECTORY.some(
                      (d) =>
                        d.label.toLowerCase() === v.toLowerCase() ||
                        d.sub.toLowerCase() === v.toLowerCase()
                    );
                  }}
                  onChange={(t) => {
                    setCc(t);
                    setSent(false);
                  }}
                  ariaLabel="Cc recipients"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="subject"
                className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-stone-400"
              >
                Subject
              </label>
              <input
                id="subject"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setSent(false);
                }}
                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-[14px] text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Subject"
              />
            </div>

            <div>
              <label
                htmlFor="body"
                className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-stone-400"
              >
                Message
              </label>
              <textarea
                id="body"
                rows={4}
                defaultValue="Hi all — could you review the launch checklist before Friday? The prototype link is inside the doc."
                className="w-full resize-y rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-[14px] leading-6 text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {invalid.length > 0 && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-6 text-red-800">
                <strong>{invalid.length} address{invalid.length === 1 ? "" : "es"} need{invalid.length === 1 ? "s" : ""} attention:</strong>{" "}
                {invalid.map((t) => `“${t.label}”`).join(", ")} — double-click the red pill to fix the
                spelling, or delete it.
              </div>
            )}

            <div className="flex items-center gap-3 border-t border-stone-100 pt-4">
              <button
                type="button"
                disabled={!canSend}
                onClick={() => setSent(true)}
                className={`rounded-full px-5 py-2 text-[14px] font-semibold transition-all ${
                  canSend
                    ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-[0.98]"
                    : "cursor-not-allowed bg-stone-100 text-stone-400"
                }`}
              >
                Send to {validCount} recipient{validCount === 1 ? "" : "s"}
              </button>
              <p className="text-xs text-stone-500">
                {to.length === 0
                  ? "Add at least one recipient to enable Send."
                  : invalid.length > 0
                    ? "Fix the red pills first — nothing is silently dropped."
                    : "Every pill resolves to a real address (hover the list below)."}
              </p>
            </div>

            {sent && (
              <div role="status" className="token-pop rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[13.5px] text-green-900">
                ✓ Queued — your message will go to {to.map((t) => resolveAddress(t)).join(", ")}
                {cc.length > 0 && <> (cc: {cc.map((t) => resolveAddress(t)).join(", ")})</>}.
              </div>
            )}
          </div>
        </Card>

        {/* resolution preview = represented objects */}
        <Card className="mt-4 p-5">
          <h2 className="text-[14px] font-semibold text-stone-900">What each pill actually stands for</h2>
          <p className="mt-1 text-[13px] leading-6 text-stone-600">
            The capsule shows a friendly name; the app keeps the full contact underneath (the represented
            object). Try pasting <code className="rounded bg-stone-100 px-1 font-mono text-[12px]">tim@w3.org, grace@navy.mil, nope-not-an-email</code> into
            To — the first two resolve, the third turns red.
          </p>
          <ul className="mt-3 divide-y divide-stone-100 rounded-xl border border-stone-200">
            {[...to, ...cc].map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-2 text-[13px]">
                <span className="font-medium text-stone-900">{t.label}</span>
                <span className={`font-mono text-[12px] ${t.invalid ? "text-red-600" : "text-stone-500"}`}>
                  {resolveAddress(t)}
                </span>
              </li>
            ))}
            {to.length + cc.length === 0 && (
              <li className="px-4 py-3 text-[13px] text-stone-400">No recipients yet.</li>
            )}
          </ul>
        </Card>

        <Card className="mt-4 border-blue-100 bg-blue-50/60 p-5">
          <h2 className="text-[14px] font-semibold text-stone-900">Why a token field fits here</h2>
          <p className="mt-1 text-[13.5px] leading-6 text-stone-700">
            Recipients are a <em>list of things</em>, not a sentence — plain text invites “did I miss a
            comma?” errors. Capsules make count, validity, and identity visible at a glance, completions
            prevent misspelled addresses, and bulk paste turns a forwarded list into ten pills in one
            gesture. The user gains speed plus confidence that Send reaches exactly who they see.
          </p>
        </Card>

        <div className="mt-6 flex justify-between">
          <Link href="/" className="text-[13.5px] font-medium text-stone-500 hover:text-stone-900">
            ← Learning hub
          </Link>
          <Link href="/scenarios/tagging" className="text-[13.5px] font-semibold text-blue-700 hover:underline">
            Next: Note tagging →
          </Link>
        </div>
      </div>
    </div>
  );
}
