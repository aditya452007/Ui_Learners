"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Combobox, { type ComboOption } from "../../components/combobox";

const AIRPORTS: ComboOption[] = [
  { id: "LAX", label: "Los Angeles", sub: "United States · West Coast", badge: "LAX" },
  { id: "SFO", label: "San Francisco", sub: "United States · Bay Area", badge: "SFO" },
  { id: "SAN", label: "San Diego", sub: "United States · Southern California", badge: "SAN" },
  { id: "SEA", label: "Seattle", sub: "United States · Pacific Northwest", badge: "SEA" },
  { id: "DEN", label: "Denver", sub: "United States · Mountain", badge: "DEN" },
  { id: "AUS", label: "Austin", sub: "United States · Texas", badge: "AUS" },
  { id: "ORD", label: "Chicago O'Hare", sub: "United States · Midwest", badge: "ORD" },
  { id: "JFK", label: "New York JFK", sub: "United States · East Coast", badge: "JFK" },
  { id: "BOS", label: "Boston", sub: "United States · New England", badge: "BOS" },
  { id: "MIA", label: "Miami", sub: "United States · Florida", badge: "MIA" },
  { id: "YVR", label: "Vancouver", sub: "Canada · British Columbia", badge: "YVR" },
  { id: "YYZ", label: "Toronto", sub: "Canada · Ontario", badge: "YYZ" },
  { id: "MEX", label: "Mexico City", sub: "Mexico · Central", badge: "MEX" },
  { id: "CUN", label: "Cancún", sub: "Mexico · Yucatán", badge: "CUN" },
  { id: "LHR", label: "London Heathrow", sub: "United Kingdom · London", badge: "LHR" },
  { id: "CDG", label: "Paris Charles de Gaulle", sub: "France · Paris", badge: "CDG" },
  { id: "AMS", label: "Amsterdam", sub: "Netherlands · Schiphol", badge: "AMS" },
  { id: "FRA", label: "Frankfurt", sub: "Germany · Main hub", badge: "FRA" },
  { id: "MAD", label: "Madrid", sub: "Spain · Barajas", badge: "MAD" },
  { id: "FCO", label: "Rome", sub: "Italy · Fiumicino", badge: "FCO" },
  { id: "HND", label: "Tokyo Haneda", sub: "Japan · Tokyo", badge: "HND" },
  { id: "ICN", label: "Seoul Incheon", sub: "South Korea · Seoul", badge: "ICN" },
  { id: "SIN", label: "Singapore", sub: "Singapore · Changi", badge: "SIN" },
  { id: "SYD", label: "Sydney", sub: "Australia · New South Wales", badge: "SYD" },
];

const NAV = [
  { href: "/", label: "Hub" },
  { href: "/scenarios/flight-search", label: "Flight search" },
  { href: "/scenarios/recipe-builder", label: "Recipe builder" },
  { href: "/scenarios/team-assign", label: "Team assign" },
];

export default function Page() {
  const [to, setTo] = useState<ComboOption | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const flights = useMemo(() => {
    if (!to) return [];
    const seed = to.id.charCodeAt(0) + to.id.charCodeAt(1);
    return [0, 1, 2].map((i) => ({
      id: `${to.id}-${i}`,
      time: `${7 + ((seed + i * 3) % 12)}:${i === 1 ? "35" : "05"} → ${10 + ((seed + i * 5) % 11)}:${i === 2 ? "50" : "20"}`,
      airline: ["Alaska", "Delta", "United"][i % 3],
      stops: i === 0 ? "Nonstop" : i === 1 ? "1 stop" : "Nonstop",
      price: 189 + ((seed * (i + 3)) % 320),
    }));
  }, [to]);

  function onSearch() {
    if (!to) {
      setError("Please choose an airport from the list — typing alone isn't a ticket.");
      setSearched(false);
      return;
    }
    setError(null);
    setSearched(true);
  }

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
                  n.href === "/scenarios/flight-search"
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
          Scenario 1 · Strict selection
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Flight search — pick a real airport</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-text-muted">
          Skyhop booking flow. The destination must be a real airport — there is no flight to
          “somewhere”. That makes it <span className="font-medium text-foreground">strict mode</span>:
          free text never commits; only a row from the listbox counts.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          {/* booking card */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">Book a flight</h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald-800">
                24 airports · IATA codes
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1.5 block text-sm font-semibold text-stone-900">From</p>
                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface-alt px-3 py-3">
                  <span className="grid size-7 place-items-center rounded-full bg-foreground text-[11px] font-bold text-white">SF</span>
                  <span>
                    <span className="block text-sm font-semibold leading-none">San Francisco</span>
                    <span className="mt-0.5 block font-mono text-[11px] text-text-muted">SFO · fixed origin</span>
                  </span>
                </div>
              </div>
              <Combobox
                label="To — destination"
                placeholder="Type a city — try “san”…"
                options={AIRPORTS}
                value={to}
                onSelect={(o) => {
                  setTo(o);
                  setError(null);
                  setSearched(false);
                }}
                emptyText="No airport matches. Check the spelling or try the city name."
                hint="Strict: Enter only commits a highlighted airport row."
              />
            </div>

            {error && (
              <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-700">
                {error}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onSearch}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-[0.98]"
              >
                Search flights
              </button>
              {to && (
                <button
                  type="button"
                  onClick={() => {
                    setTo(null);
                    setSearched(false);
                  }}
                  className="rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium transition hover:border-accent hover:text-accent"
                >
                  Clear destination
                </button>
              )}
              <span className="font-mono text-xs text-text-faint">type “san” → San Diego + San Francisco area… actually try “lon”, “tok”, “y”</span>
            </div>
          </div>

          {/* results */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-sm font-bold">Results</h2>
            {!to && !searched ? (
              <div className="mt-4 rounded-xl border border-dashed border-border-strong bg-surface-alt/60 p-6 text-center">
                <p className="text-sm font-semibold">No destination yet</p>
                <p className="mt-1 text-[13px] leading-relaxed text-text-muted">
                  Open the field and type. “y” finds Sydney + New York; “xyz” shows the empty state.
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <div className="flex items-center gap-3 rounded-xl bg-accent-light p-4">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent font-mono text-sm font-bold text-white">
                    {to?.badge}
                  </span>
                  <div>
                    <p className="text-sm font-bold">SFO → {to?.badge} · {to?.label}</p>
                    <p className="text-xs text-text-muted">{to?.sub} · {flights.length} flights found</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-2">
                  {flights.map((f) => (
                    <li key={f.id} className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{f.time}</p>
                        <p className="text-xs text-text-muted">{f.airline} · {f.stops}</p>
                      </div>
                      <p className="text-sm font-bold">${f.price}</p>
                      <span className="rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-white">Select</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-5 rounded-xl bg-surface-alt p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Why a combobox fits here</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
                24 airports don&apos;t fit a select without endless scrolling. Typing two letters beats
                scrolling — fewer errors (IATA badge disambiguates San José vs San Juan… well, “san”),
                faster booking, and the empty state teaches spelling instead of failing silently.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-sm font-medium text-accent">← Back to anatomy hub</Link>
          <Link
            href="/scenarios/recipe-builder"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:border-accent hover:text-accent"
          >
            Next: recipe builder (free-form) →
          </Link>
        </div>
      </main>
    </div>
  );
}
