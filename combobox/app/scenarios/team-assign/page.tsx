"use client";

import Link from "next/link";
import { useState } from "react";
import Combobox, { type ComboOption } from "../../components/combobox";

const TEAM: ComboOption[] = [
  { id: "maya", label: "Maya Kim", sub: "Design · online now", avatar: "MK", avatarColor: "#4f46e5" },
  { id: "alex", label: "Alex Stone", sub: "Engineering · online now", avatar: "AS", avatarColor: "#0d9488" },
  { id: "jon", label: "Jon Lee", sub: "Engineering · in a meeting", avatar: "JL", avatarColor: "#d97706", disabled: true, disabledReason: "busy" },
  { id: "sara", label: "Sara Mova", sub: "Product · online now", avatar: "SM", avatarColor: "#db2777" },
  { id: "tom", label: "Tom Reid", sub: "Support · offline", avatar: "TR", avatarColor: "#78716c", disabled: true, disabledReason: "offline" },
  { id: "priya", label: "Priya Nair", sub: "Data · online now", avatar: "PN", avatarColor: "#059669" },
];

const NAV = [
  { href: "/", label: "Hub" },
  { href: "/scenarios/flight-search", label: "Flight search" },
  { href: "/scenarios/recipe-builder", label: "Recipe builder" },
  { href: "/scenarios/team-assign", label: "Team assign" },
];

export default function Page() {
  const [assignee, setAssignee] = useState<ComboOption | null>(TEAM[0]);
  const [activity, setActivity] = useState<string[]>(["Sara moved this from Backlog → In progress"]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            ← Combobox Lab
          </Link>
          <nav className="flex items-center gap-1 text-xs font-medium">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-full px-3 py-1.5 transition ${
                  n.href === "/scenarios/team-assign"
                    ? "bg-foreground text-white"
                    : "text-text-muted hover:bg-surface-alt hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Scenario 3 · Rich rows + disabled options
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Task assignee — compact, rich, honest</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-text-muted">
          Northwind project tool. The assignee field is <span className="font-medium text-foreground">compact</span>,
          shows <span className="font-medium text-foreground">avatars and roles</span>, and disables people
          you shouldn&apos;t pick right now — busy or offline — instead of letting you assign into a void.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          {/* task card */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-stone-100 px-2 py-1 font-mono text-[11px] font-semibold text-stone-600">LIN-204</span>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">In progress</span>
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-700">High priority</span>
              <span className="ml-auto font-mono text-[11px] text-text-faint">due Fri</span>
            </div>
            <h2 className="mt-3 text-lg font-bold tracking-tight">Redesign pricing page teardown</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-text-muted">
              Rebuild the comparison table, verify annual/monthly math, and hand off motion specs to engineering.
            </p>

            <div className="mt-5 max-w-sm">
              <Combobox
                label="Assignee"
                size="sm"
                placeholder="Search teammates…"
                options={TEAM}
                value={assignee}
                onSelect={(o) => {
                  if (!o) return;
                  setAssignee(o);
                  setActivity((a) => [`Assigned to ${o.label} (${o.sub})`, ...a].slice(0, 4));
                }}
                emptyText="No teammate matches that name."
                hint="Disabled rows are skipped by arrow keys and can't be clicked."
              />
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-surface-alt/60 p-4">
              {assignee ? (
                <>
                  <span
                    className="grid size-9 place-items-center rounded-full text-xs font-bold text-white"
                    style={{ background: assignee.avatarColor }}
                  >
                    {assignee.avatar}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{assignee.label}</p>
                    <p className="truncate text-xs text-text-muted">{assignee.sub}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                    Responsible
                  </span>
                </>
              ) : (
                <p className="text-sm text-text-muted">Unassigned — pick someone above.</p>
              )}
            </div>
          </div>

          {/* side */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="text-sm font-bold">Activity</h2>
              <ul className="mt-3 space-y-2">
                {activity.map((a, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-text-muted">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-xl border border-dashed border-border-strong p-4 text-[13px] leading-relaxed text-text-muted">
                <span className="font-semibold text-foreground">Try the edges: </span>
                type “o” — Jon and Tom stay visible but dimmed. Arrow through the list: the highlight
                jumps straight over them. Clicking them does nothing; Enter never commits them.
              </div>
            </div>
            <div className="rounded-xl bg-surface-alt p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Why a combobox fits here</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
                Twelve teammates don&apos;t need a page — they need a field. Avatars make scanning instant,
                disabled states prevent mis-assignment before it happens, and the selected checkmark
                survives reopening so you can confirm at a glance. Clearer ownership, fewer pings.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Link href="/scenarios/recipe-builder" className="text-sm font-medium text-accent">← Recipe builder (free-form)</Link>
          <Link
            href="/"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:border-accent hover:text-accent"
          >
            Back to anatomy hub →
          </Link>
        </div>
      </main>
    </div>
  );
}
