"use client";

import { useState } from "react";
import Link from "next/link";
import TokenField, { type Token } from "@/components/TokenField";
import { Card, Eyebrow, ScenarioNav } from "@/components/chrome";

const DIRECTORY = [
  { label: "Ada Lovelace", sub: "ada@analytical.engine" },
  { label: "Grace Hopper", sub: "grace@navy.mil" },
  { label: "Alan Turing", sub: "alan@bletchley.uk" },
  { label: "Katherine Johnson", sub: "katherine@nasa.gov" },
  { label: "Margaret Hamilton", sub: "margaret@apollo.nasa.gov" },
  { label: "Barbara Liskov", sub: "barbara@mit.edu" },
  { label: "Tim Berners-Lee", sub: "tim@w3.org" },
];

const ROLES = ["Viewer", "Editor", "Admin"] as const;
type Role = (typeof ROLES)[number];

const EMAIL_RE = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;

function isKnown(v: string) {
  if (EMAIL_RE.test(v)) return true;
  return DIRECTORY.some(
    (d) => d.label.toLowerCase() === v.toLowerCase() || d.sub.toLowerCase() === v.toLowerCase()
  );
}

export default function TeamInviteScenario() {
  const [tokens, setTokens] = useState<Token[]>([
    { id: "i1", label: "Grace Hopper", sub: "grace@navy.mil", badge: "Admin" },
    { id: "i2", label: "Alan Turing", sub: "alan@bletchley.uk", badge: "Editor" },
  ]);
  const [invited, setInvited] = useState(false);

  const setRole = (id: string, role: Role) => {
    setTokens((ts) => ts.map((t) => (t.id === id ? { ...t, badge: role } : t)));
    setInvited(false);
  };

  const admins = tokens.filter((t) => t.badge === "Admin" && !t.invalid).length;
  const invalid = tokens.filter((t) => t.invalid);
  const canInvite = tokens.length > 0 && invalid.length === 0;

  return (
    <div className="min-h-full bg-stone-50">
      <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-8 sm:px-8">
        <ScenarioNav current="/scenarios/team-invite" />

        <div className="mt-8">
          <Eyebrow>Scenario 3 · Team invite</Eyebrow>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            One pill, a whole record
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-7 text-stone-600">
            In project settings, inviting someone means choosing <em>who</em> plus <em>what they may do</em>.
            Each capsule carries a represented object — person + role — with the role editable right on the pill.
          </p>
        </div>

        <Card className="mt-6 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-semibold text-stone-900">Invite to “Apollo Docs”</h2>
              <p className="mt-0.5 text-[13px] text-stone-500">
                {tokens.length} seat{tokens.length === 1 ? "" : "s"} · {admins} admin{admins === 1 ? "" : "s"} · 12 seats left on the plan
              </p>
            </div>
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-[12px] font-semibold text-green-800">
              Pro workspace
            </span>
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-stone-400">
              Members to invite
            </label>
            <TokenField
              key={tokens.map((t) => `${t.id}:${t.badge}`).join("|")}
              initialTokens={tokens}
              suggestions={DIRECTORY}
              placeholder="Type a name or email…"
              tokenStyle="rounded"
              validate={isKnown}
              onChange={(next) =>
                setTokens((prev) =>
                  next.map((t) => {
                    const old = prev.find((p) => p.id === t.id);
                    if (old?.badge) return { ...t, badge: old.badge };
                    const isNew = !prev.some((p) => p.id === t.id);
                    return isNew ? { ...t, badge: "Viewer" as Role } : t;
                  })
                )
              }
              ariaLabel="Members to invite"
            />
            <p className="mt-1 text-xs text-stone-500">
              New pills default to <strong>Viewer</strong>. Unknown addresses turn red — double-click to fix.
            </p>
          </div>

          {/* per-token role editors = the represented object, exposed */}
          <div className="mt-4">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-stone-400">
              Roles — stored on each token
            </p>
            <ul className="mt-2 divide-y divide-stone-100 rounded-xl border border-stone-200">
              {tokens.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white"
                  >
                    {t.label.split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-stone-900">{t.label}</span>
                    <span className="block truncate font-mono text-[11.5px] text-stone-500">
                      {t.sub ?? (EMAIL_RE.test(t.label) ? t.label : "unrecognized")}
                      {t.invalid ? " · invalid" : ""}
                    </span>
                  </span>
                  <div role="group" aria-label={`Role for ${t.label}`} className="flex overflow-hidden rounded-full ring-1 ring-inset ring-stone-200">
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(t.id, r)}
                        aria-pressed={t.badge === r}
                        className={`px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                          t.badge === r ? "bg-stone-900 text-white" : "bg-white text-stone-500 hover:bg-stone-50"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
              {tokens.length === 0 && (
                <li className="px-4 py-3 text-[13px] text-stone-400">
                  Nobody yet — add someone above and their role row appears here.
                </li>
              )}
            </ul>
          </div>

          <div className="mt-4 flex items-center gap-3 border-t border-stone-100 pt-4">
            <button
              type="button"
              disabled={!canInvite}
              onClick={() => setInvited(true)}
              className={`rounded-full px-5 py-2 text-[14px] font-semibold transition-all ${
                canInvite
                  ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-[0.98]"
                  : "cursor-not-allowed bg-stone-100 text-stone-400"
              }`}
            >
              Send {tokens.length} invite{tokens.length === 1 ? "" : "s"}
            </button>
            <p className="text-xs text-stone-500">
              {invalid.length > 0
                ? "Fix the red pills first."
                : "Invites go out with the role shown on each pill."}
            </p>
          </div>

          {invited && (
            <div role="status" className="token-pop mt-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[13.5px] text-green-900">
              ✓ Invited {tokens.map((t) => `${t.label} (${t.badge ?? "Viewer"})`).join(", ")} — they join as soon as they accept.
            </div>
          )}
        </Card>

        <Card className="mt-4 p-5">
          <h2 className="text-[14px] font-semibold text-stone-900">The represented object, in plain JSON</h2>
          <p className="mt-1 text-[13px] leading-6 text-stone-600">
            The app never stores “blue text”. It stores a record per pill — this is what an admin tool, an
            audit log, or the API receives:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-stone-900 p-4 font-mono text-[12px] leading-5 text-stone-100">
{`[${tokens.map((t) => `\n  { name: "${t.label}", role: "${t.badge ?? "Viewer"}" }`).join(",")}${tokens.length ? "\n" : ""}]`}
          </pre>
        </Card>

        <Card className="mt-4 border-blue-100 bg-blue-50/60 p-5">
          <h2 className="text-[14px] font-semibold text-stone-900">Why a token field fits here</h2>
          <p className="mt-1 text-[13.5px] leading-6 text-stone-700">
            Inviting is batch work: several people, each with a permission, reviewed before sending. Pills
            keep the batch visible and individually fixable, role badges surface the permission without
            opening a dialog per person, and validation stops a typo'd address from silently becoming a dead
            invite. The user gains a reviewable outbox instead of a fragile comma-separated string.
          </p>
        </Card>

        <div className="mt-6 flex justify-between">
          <Link href="/scenarios/tagging" className="text-[13.5px] font-medium text-stone-500 hover:text-stone-900">
            ← Note tagging
          </Link>
          <Link href="/" className="text-[13.5px] font-semibold text-blue-700 hover:underline">
            Back to hub →
          </Link>
        </div>
      </div>
    </div>
  );
}
