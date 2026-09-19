"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AvatarGroup } from "../../components/AvatarGroup";
import { ScenarioNav } from "../../components/ScenarioNav";
import { TEAM } from "../../data";

// Warm card surface — the ring MUST match this, not white.
// That is the groupBorderColor lesson.
const CARD_BG = "#fffbeb";

export default function EventRsvpPage() {
  const [going, setGoing] = useState<string[]>(TEAM.slice(0, 7).map((t) => t.id));
  const [rsvpd, setRsvpd] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useState("");

  const goingPeople = useMemo(
    () => TEAM.filter((t) => going.includes(t.id)),
    [going]
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return goingPeople;
    return goingPeople.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.role ?? "").toLowerCase().includes(q)
    );
  }, [goingPeople, query]);

  function toggleRsvp() {
    if (rsvpd) {
      setGoing((g) => g.filter((id) => id !== "you"));
      setRsvpd(false);
    } else {
      if (!going.includes("you")) setGoing((g) => [...g, "you"]);
      setRsvpd(true);
    }
  }

  const you = {
    id: "you",
    name: "You",
    role: "Guest",
    initials: "YO",
    tint: "#0f766e",
    ink: "#ffffff",
  };
  const membersWithYou = useMemo(() => {
    const base = [...goingPeople];
    if (going.includes("you") && !base.some((p) => p.id === "you"))
      base.push(you);
    return base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goingPeople, going]);

  return (
    <div className="min-h-full">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <ScenarioNav current="/scenarios/event-rsvp" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f766e]">
            Scenario 3 · Social / events
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
            Event guest list
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] text-stone-600">
            A supper-club invite. Big friendly faces on a warm card — and the
            separation ring is tinted to match the card, not the page.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div
          className="overflow-hidden rounded-3xl ring-1 ring-amber-200/70 shadow-[0_16px_40px_-16px_rgb(0_0_0/0.2)]"
          style={{ background: CARD_BG }}
        >
          <div className="grid md:grid-cols-[1fr_320px]">
            <div className="p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                Sat · 7pm · Kreuzberg
              </p>
              <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-stone-900">
                Design Systems Supper Club
              </h2>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-stone-600">
                Twelve seats, one long table, zero slide decks. Bring a
                component you love and a story about one you deleted.
              </p>

              {/* the group on a tinted surface */}
              <div className="mt-6">
                <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  {membersWithYou.length} going
                </p>
                <AvatarGroup
                  members={membersWithYou}
                  max={6}
                  size={50}
                  overlap={-14}
                  ringColor={CARD_BG}
                  onOverflowClick={() => setSheetOpen(true)}
                />
                <p className="mt-2.5 font-mono text-[11px] text-stone-400">
                  size 50 · overlap −14 · ring {CARD_BG} (matches card)
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <button
                  onClick={toggleRsvp}
                  aria-pressed={rsvpd}
                  className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                    rsvpd
                      ? "bg-stone-900 text-white hover:bg-stone-700"
                      : "bg-[#0f766e] text-white shadow-[0_6px_16px_-6px_rgb(15_118_110/0.7)] hover:bg-[#115e59]"
                  }`}
                >
                  {rsvpd ? "✓ You're in — withdraw" : "RSVP · save my seat"}
                </button>
                <button
                  onClick={() => setSheetOpen(true)}
                  className="rounded-full bg-white/70 px-5 py-2.5 text-sm font-semibold text-stone-700 ring-1 ring-amber-200 transition-all hover:ring-stone-400"
                >
                  See all {membersWithYou.length}
                </button>
              </div>
            </div>
            <div
              className="border-t border-amber-200/60 p-6 md:border-l md:border-t-0"
              style={{ background: "rgb(255 255 255 / 0.55)" }}
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Details
              </p>
              <ul className="mt-2 space-y-2.5 text-sm text-stone-600">
                <li>🍽️ 3 courses · dietary options at RSVP</li>
                <li>📍 Torstraße 101 — buzzer “Atelier”</li>
                <li>🎟️ 12 seats · {12 - membersWithYou.length} left</li>
              </ul>
              <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-amber-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#0f766e]">
                  Ring-color lesson
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
                  The rim around each face is the card color (
                  <span className="font-mono">{CARD_BG}</span>), not white. A
                  white ring on a cream card would glow like a sticker — the
                  token must always equal the surface behind the group.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-[#f0fdfa] p-5 ring-1 ring-[#ccfbf1]">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0f766e]">
            Why it fits here
          </p>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-stone-600">
            Nobody reads a nine-name list to decide if a dinner sounds fun —
            they scan faces for friends. Large loose circles maximize
            recognition, +N compresses the long tail, and the sheet behind +N
            carries search and full names for the curious. Config here: large
            50px, loose −14px, overflow opens a searchable sheet.
          </p>
        </div>

        {/* attendee sheet */}
        {sheetOpen && (
          <div
            className="animate-fade-in fixed inset-0 z-40 bg-stone-900/40 p-4 backdrop-blur-[2px]"
            onClick={() => setSheetOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="All attendees"
              onClick={(e) => e.stopPropagation()}
              className="animate-pop-in mx-auto mt-16 max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-stone-200"
            >
              <div className="border-b border-stone-100 px-5 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-stone-900">
                    All attendees · {membersWithYou.length}
                  </h3>
                  <button
                    onClick={() => setSheetOpen(false)}
                    aria-label="Close attendee list"
                    className="rounded-full px-2.5 py-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                  >
                    ✕
                  </button>
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search names or roles…"
                  autoFocus
                  className="mt-3 w-full rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-800 ring-1 ring-stone-200 placeholder:text-stone-300 focus:outline-2 focus:outline-[#0f766e]"
                />
              </div>
              <ul className="max-h-80 overflow-y-auto p-2">
                {filtered.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-stone-50"
                  >
                    <span
                      className="grid h-10 w-10 flex-none place-items-center rounded-full text-xs font-bold"
                      style={{
                        background: (p as { tint?: string }).tint ?? "#f5f5f4",
                        color: (p as { ink?: string }).ink ?? "#57534e",
                      }}
                    >
                      {p.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-stone-800">
                        {p.name}
                      </span>
                      <span className="block truncate text-xs text-stone-400">
                        {(p as { role?: string }).role ?? "Guest"}
                      </span>
                    </span>
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700 ring-1 ring-green-100">
                      Going
                    </span>
                  </li>
                ))}
                {filtered.length === 0 && (
                  <li className="px-4 py-8 text-center text-sm text-stone-400">
                    No one matches “{query}”.
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        <nav className="mt-8 flex flex-wrap gap-2 border-t border-stone-200 pt-6">
          <Link
            href="/scenarios/live-doc"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-600 ring-1 ring-stone-200 hover:text-[#0f766e] hover:ring-[#0f766e]"
          >
            ← Live document
          </Link>
          <Link
            href="/"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-600 ring-1 ring-stone-200 hover:text-[#0f766e] hover:ring-[#0f766e]"
          >
            Learning hub →
          </Link>
        </nav>
      </main>
    </div>
  );
}
