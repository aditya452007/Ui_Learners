"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AvatarGroup } from "../../components/AvatarGroup";
import { ScenarioNav } from "../../components/ScenarioNav";
import { TEAM, type Person } from "../../data";

const SCRIPT: { join?: Person; leave?: string }[] = [
  { join: TEAM[6] },
  { leave: "leo" },
  { join: TEAM[1] },
  { join: TEAM[8] },
];

export default function LiveDocPage() {
  const [present, setPresent] = useState<Person[]>(() =>
    TEAM.slice(0, 4).map((p, i) => ({
      ...p,
      presence: (i < 3 ? "live" : "idle") as Person["presence"],
    }))
  );
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [feed, setFeed] = useState<string[]>([
    "Maya started editing · Introduction",
    "Sam is viewing · Pricing table",
  ]);
  const [invite, setInvite] = useState("");

  useEffect(() => {
    if (!auto) return;
    if (step >= SCRIPT.length) return;
    const t = setTimeout(() => {
      const ev = SCRIPT[step];
      if (ev.join && !present.some((p) => p.id === ev.join!.id)) {
        setPresent((p) => [...p, { ...ev.join!, presence: "live" }]);
        setFeed((f) => [`${ev.join!.name} joined the doc`, ...f].slice(0, 5));
      }
      if (ev.leave) {
        setPresent((p) => p.filter((m) => m.id !== ev.leave));
        const gone = TEAM.find((t) => t.id === ev.leave);
        if (gone)
          setFeed((f) => [`${gone.name} left the doc`, ...f].slice(0, 5));
      }
      setStep((s) => s + 1);
    }, 2600);
    return () => clearTimeout(t);
  }, [auto, step, present]);

  function invitePerson() {
    const name = invite.trim();
    if (!name) return;
    const initials = name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    setPresent((p) => [
      ...p,
      { id: `guest-${Date.now()}`, name, initials, tint: "#e0e7ff", ink: "#3730a3", presence: "live" },
    ]);
    setFeed((f) => [`${name} joined via invite link`, ...f].slice(0, 5));
    setInvite("");
  }

  return (
    <div className="min-h-full">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <ScenarioNav current="/scenarios/live-doc" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f766e]">
            Scenario 2 · Collaboration
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
            Live document presence
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] text-stone-600">
            A docs-style header showing who is in the file right now — green
            presence dots, tinted initials for guests with no photo, live
            join/leave.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* doc window */}
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.15)]">
          {/* toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-stone-50/60 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#0f766e] text-sm font-bold text-white">
                D
              </span>
              <div>
                <p className="text-sm font-semibold text-stone-900">
                  Q3 launch plan
                </p>
                <p className="text-xs text-stone-400">
                  {present.length} viewing now · saved 2m ago
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AvatarGroup
                members={present}
                max={5}
                size={36}
                overlap={-12}
                ringColor="#ffffff"
                label="People currently viewing"
              />
              <button className="rounded-full bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_12px_-4px_rgb(15_118_110/0.6)] transition-all hover:bg-[#115e59]">
                Share
              </button>
            </div>
          </div>
          {/* body */}
          <div className="grid md:grid-cols-[1fr_280px]">
            <div className="px-7 py-6">
              <p className="font-mono text-[11px] uppercase tracking-widest text-stone-300">
                Document · Introduction
              </p>
              <h2 className="mt-2 text-2xl font-bold text-stone-900">
                Launching the new onboarding
              </h2>
              <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-stone-600">
                <p>
                  <span className="rounded bg-amber-100 px-1 font-medium text-amber-900">
                    Maya
                  </span>{" "}
                  is rewriting this paragraph — the highlighted name is a live
                  cursor, the pile in the toolbar is the full cast.
                </p>
                <p>
                  Guests without a photo get a tinted initials circle instead
                  of a grey silhouette, so{" "}
                  <span className="rounded bg-indigo-100 px-1 font-medium text-indigo-900">
                    Priya (PN)
                  </span>{" "}
                  is just as recognizable as anyone with a headshot.
                </p>
                <p className="rounded-xl bg-stone-50 p-4 text-sm ring-1 ring-stone-100">
                  Pricing table, rollout dates, and the FAQ live below. Watch
                  the toolbar: people join and leave every few seconds while
                  auto-play is on.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setAuto((a) => !a)}
                  aria-pressed={auto}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    auto
                      ? "bg-stone-900 text-white"
                      : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-stone-400"
                  }`}
                >
                  {auto ? "❚❚ Pause live simulation" : "▶ Replay join / leave"}
                </button>
                {step >= SCRIPT.length && (
                  <button
                    onClick={() => {
                      setPresent(
                        TEAM.slice(0, 4).map((p, i) => ({
                          ...p,
                          presence: (i < 3 ? "live" : "idle") as Person["presence"],
                        }))
                      );
                      setStep(0);
                      setAuto(true);
                    }}
                    className="rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-600 ring-1 ring-stone-200 hover:text-[#0f766e] hover:ring-[#0f766e]"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
            <aside className="border-t border-stone-100 bg-stone-50/50 px-5 py-5 md:border-l md:border-t-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Activity
              </p>
              <ul className="mt-2 space-y-2">
                {feed.map((f, i) => (
                  <li
                    key={`${f}-${i}`}
                    className={`rounded-lg px-3 py-2 text-[13px] ring-1 ${
                      i === 0
                        ? "animate-fade-in bg-white font-medium text-stone-700 ring-stone-200"
                        : "text-stone-400 ring-transparent"
                    }`}
                  >
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-green-500 align-middle" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Invite by name
                </p>
                <div className="mt-1.5 flex gap-1.5">
                  <input
                    value={invite}
                    onChange={(e) => setInvite(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") invitePerson();
                    }}
                    placeholder="Ada Lovelace"
                    className="min-w-0 flex-1 rounded-lg bg-white px-3 py-2 text-sm text-stone-800 ring-1 ring-stone-200 placeholder:text-stone-300 focus:outline-2 focus:outline-[#0f766e]"
                  />
                  <button
                    onClick={invitePerson}
                    className="flex-none rounded-lg bg-stone-900 px-3 py-2 text-sm font-semibold text-white hover:bg-stone-700"
                  >
                    Add
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-stone-400">
                  No photo needed — invites land as initials instantly.
                </p>
              </div>
            </aside>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-[#f0fdfa] p-5 ring-1 ring-[#ccfbf1]">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0f766e]">
            Why it fits here
          </p>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-stone-600">
            Presence is ambient information — you need the cast, not a roster.
            The stack compresses five viewers into the width of two, presence
            dots answer “who's active” without a sidebar, and initials fallback
            means invited guests are recognizable before they ever upload a
            photo. Config here: medium 36px, presence extension, max 5.
          </p>
        </div>

        <nav className="mt-8 flex flex-wrap gap-2 border-t border-stone-200 pt-6">
          <Link
            href="/scenarios/task-board"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-600 ring-1 ring-stone-200 hover:text-[#0f766e] hover:ring-[#0f766e]"
          >
            ← Task board
          </Link>
          <Link
            href="/scenarios/event-rsvp"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-600 ring-1 ring-stone-200 hover:text-[#0f766e] hover:ring-[#0f766e]"
          >
            Next: Event RSVP →
          </Link>
        </nav>
      </main>
    </div>
  );
}
