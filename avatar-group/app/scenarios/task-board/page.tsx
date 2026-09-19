"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AvatarGroup } from "../../components/AvatarGroup";
import { ScenarioNav } from "../../components/ScenarioNav";
import { TEAM, type Person } from "../../data";

const NEXT_NAV = [
  { href: "/", label: "← Learning hub" },
  { href: "/scenarios/live-doc", label: "Next: Live document →" },
];

export default function TaskBoardPage() {
  const [assignees, setAssignees] = useState<Person[]>(TEAM.slice(0, 7));
  const [max, setMax] = useState(4);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [status, setStatus] = useState("In progress");

  const hidden = useMemo(
    () => assignees.slice(Math.max(0, max)),
    [assignees, max]
  );
  const pool = useMemo(
    () => TEAM.filter((t) => !assignees.some((a) => a.id === t.id)),
    [assignees]
  );

  function remove(id: string) {
    setAssignees((a) => a.filter((m) => m.id !== id));
  }
  function add(p: Person) {
    setAssignees((a) => [...a, p]);
    setOverflowOpen(false);
  }

  return (
    <div className="min-h-full">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <ScenarioNav current="/scenarios/task-board" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f766e]">
            Scenario 1 · Project tool
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
            Task board assignees
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] text-stone-600">
            A Linear-style task card. Five engineers own this ticket but the
            card only has room for four faces — the group collapses the rest
            into +N.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* task card */}
          <div className="rounded-2xl bg-white p-6 ring-1 ring-stone-200 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.15)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#f0fdfa] px-2.5 py-1 text-xs font-semibold text-[#0f766e] ring-1 ring-[#ccfbf1]">
                DES-214
              </span>
              <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                Design
              </span>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-100">
                High priority
              </span>
            </div>
            <h2 className="mt-3 text-xl font-bold text-stone-900">
              Redesign the onboarding flow
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
              Empty states, progress, and the invite step. Maya owns design,
              Leo and Sam split the build, Priya runs the usability round.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-stone-50 px-4 py-3.5 ring-1 ring-stone-100">
              <div className="relative">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Assignees · {assignees.length}
                </p>
                <AvatarGroup
                  members={assignees}
                  max={max}
                  size={34}
                  overlap={-10}
                  ringColor="#ffffff"
                  onOverflowClick={() => setOverflowOpen((o) => !o)}
                />
                {overflowOpen && (
                  <>
                    <button
                      aria-label="Close overflow list"
                      className="fixed inset-0 z-10 cursor-default"
                      onClick={() => setOverflowOpen(false)}
                    />
                    <div className="animate-pop-in absolute left-0 top-full z-20 mt-2 w-64 rounded-xl bg-white p-2 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.3)] ring-1 ring-stone-200">
                      <p className="px-2.5 pb-1.5 pt-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                        {hidden.length} more on this task
                      </p>
                      {hidden.map((h) => (
                        <div
                          key={h.id}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-stone-50"
                        >
                          <span
                            className="grid h-8 w-8 flex-none place-items-center rounded-full text-[11px] font-bold"
                            style={{ background: h.tint, color: h.ink }}
                          >
                            {h.initials}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-stone-800">
                              {h.name}
                            </span>
                            <span className="block truncate text-xs text-stone-400">
                              {h.role}
                            </span>
                          </span>
                          <button
                            onClick={() => remove(h.id)}
                            className="rounded-full px-2 py-1 text-xs font-medium text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-stone-500">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-lg bg-white px-2.5 py-1.5 text-sm font-medium text-stone-700 ring-1 ring-stone-200 focus:outline-2 focus:outline-[#0f766e]"
                >
                  <option>Backlog</option>
                  <option>In progress</option>
                  <option>In review</option>
                  <option>Done</option>
                </select>
              </div>
            </div>

            {/* assignee manager */}
            <div className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Manage assignees
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {assignees.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => remove(a.id)}
                    title={`Remove ${a.name}`}
                    className="group rounded-full bg-stone-100 py-1 pl-1 pr-2.5 text-xs font-medium text-stone-600 ring-1 ring-stone-200 transition-all hover:bg-red-50 hover:text-red-700 hover:ring-red-200"
                  >
                    <span
                      className="mr-1.5 inline-grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold"
                      style={{ background: a.tint, color: a.ink }}
                    >
                      {a.initials}
                    </span>
                    {a.name.split(" ")[0]} <span className="opacity-50">×</span>
                  </button>
                ))}
              </div>
              {pool.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {pool.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => add(p)}
                      className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[#0f766e] ring-1 ring-stone-200 transition-all hover:ring-[#0f766e]"
                    >
                      + {p.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* controls */}
          <aside className="h-fit rounded-2xl bg-white p-5 ring-1 ring-stone-200 shadow-[0_2px_10px_-4px_rgb(0_0_0/0.08)]">
            <h3 className="font-semibold text-stone-900">Group config</h3>
            <p className="mt-1 font-mono text-[11px] text-stone-400">
              size 34 · overlap −10 · ring #fff
            </p>
            <label className="mt-4 block">
              <span className="mb-1.5 flex justify-between text-xs font-semibold text-stone-700">
                Max visible{" "}
                <span className="font-mono text-[#0f766e]">{max}</span>
              </span>
              <input
                type="range"
                min={1}
                max={assignees.length + 1}
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="control-range"
              />
            </label>
            <p className="mt-3 rounded-xl bg-stone-50 p-3 text-[13px] leading-relaxed text-stone-500 ring-1 ring-stone-100">
              Drag max to 1 and the whole team collapses into a single{" "}
              <span className="font-mono font-semibold text-stone-700">
                +{assignees.length - 1}
              </span>{" "}
              — the card never grows, the count does the work.
            </p>
            <div className="mt-4 rounded-xl bg-[#f0fdfa] p-3.5 ring-1 ring-[#ccfbf1]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#0f766e]">
                Why it fits here
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
                Task cards are 300px wide and teams are not. The group keeps
                ownership visible without reflowing the card, and the +N
                popover preserves access to everyone hidden. Faster scanning,
                zero layout cost.
              </p>
            </div>
          </aside>
        </div>

        <nav className="mt-8 flex flex-wrap gap-2 border-t border-stone-200 pt-6">
          {NEXT_NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-600 ring-1 ring-stone-200 transition-all hover:text-[#0f766e] hover:ring-[#0f766e]"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}
