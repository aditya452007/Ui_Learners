"use client";

import { useMemo, useState } from "react";
import { LevelIndicator, zoneFor, zoneLabel } from "../../LevelIndicator";
import { ScenarioNav } from "../../ScenarioNav";

const CAPACITY = 512; // GB
const WARNING = Math.round(CAPACITY * 0.75); // 384
const CRITICAL = Math.round(CAPACITY * 0.9); // 461

const CATEGORIES = [
  { name: "System", gb: 42, color: "#8e8e93" },
  { name: "Applications", gb: 68, color: "#0071e3" },
  { name: "Photos", gb: 121, color: "#34c759" },
  { name: "Movies", gb: 54, color: "#af52de" },
  { name: "Documents", gb: 38, color: "#ff9500" },
  { name: "Downloads", gb: 17, color: "#ffd60a" },
] as const;

const EXTRA_FILES = [
  { name: "Family-trip-4K.mov", gb: 18 },
  { name: "Xcode-archives.zip", gb: 26 },
  { name: "Lightroom-catalog.lrcat", gb: 11 },
  { name: "Game-update.pkg", gb: 34 },
];

export default function StoragePage() {
  const [added, setAdded] = useState<number[]>([0, 1]);
  const [copying, setCopying] = useState<number | null>(null);

  const baseUsed = CATEGORIES.reduce((a, c) => a + c.gb, 0);
  const addedGb = added.reduce((a, i) => a + EXTRA_FILES[i].gb, 0);
  const used = baseUsed + addedGb;
  const free = Math.max(0, CAPACITY - used);
  const zone = zoneFor(used, WARNING, CRITICAL);

  const status = useMemo(() => {
    if (used >= CRITICAL)
      return {
        title: "Disk is critically full",
        body: "macOS needs breathing room for virtual memory and updates. Free up space before the next install fails — empty Downloads or move the 4K video off-disk.",
      };
    if (used >= WARNING)
      return {
        title: "Disk is getting full",
        body: "You have crossed warningValue: the meter turned amber. Things still work, but this is the moment to archive a project, not the moment to download a 30 GB game.",
      };
    return {
      title: "Plenty of room",
      body: "Below warningValue the meter stays green. Copy freely — the indicator is just quietly reporting doubleValue against a 512 GB range.",
    };
  }, [used]);

  const toggleFile = (i: number) => {
    setCopying(i);
    window.setTimeout(() => {
      setAdded((prev) =>
        prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
      );
      setCopying(null);
    }, 450);
  };

  const cleanUp = () => {
    // remove the largest added file, like an "Optimise Storage" button
    if (added.length === 0) return;
    const largest = [...added].sort(
      (a, b) => EXTRA_FILES[b].gb - EXTRA_FILES[a].gb
    )[0];
    setAdded((prev) => prev.filter((x) => x !== largest));
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <ScenarioNav current="/scenarios/storage-manager/" />
        <header className="max-w-2xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#0071e3]">
            Scenario 1 · .discreteCapacity + .continuousCapacity · thresholds on
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Storage manager in a Finder-style disk panel
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
            Macintosh HD, 512 GB. The same used-space number drives a smooth
            bar and a 16-block meter; both flip amber at 384 GB and red at
            461 GB.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          {/* disk card */}
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-xl bg-stone-900 text-white">
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.6}>
                  <rect x="3" y="4" width="18" height="12" rx="2" />
                  <path d="M9 20h6M12 16v4" />
                </svg>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-stone-900">Macintosh HD</p>
                <p className="font-mono text-[12px] text-stone-500">
                  {used} of {CAPACITY} GB used · {free} GB free
                </p>
              </div>
              <span
                className={`ml-auto rounded-full px-3 py-1 font-mono text-[11px] font-bold text-white ${
                  zone === "critical"
                    ? "bg-red-600"
                    : zone === "warning"
                      ? "bg-amber-600"
                      : "bg-green-600"
                }`}
              >
                {zoneLabel(zone)}
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <div>
                <p className="mb-1.5 font-mono text-[11px] text-stone-400">
                  .continuousCapacity · showThresholds
                </p>
                <LevelIndicator
                  levelStyle="continuousCapacity"
                  min={0}
                  max={CAPACITY}
                  value={used}
                  warningValue={WARNING}
                  criticalValue={CRITICAL}
                  showThresholds
                  size="lg"
                  ariaLabel="Disk space used"
                />
              </div>
              <div>
                <p className="mb-1.5 font-mono text-[11px] text-stone-400">
                  .discreteCapacity · segments = 16
                </p>
                <LevelIndicator
                  levelStyle="discreteCapacity"
                  min={0}
                  max={CAPACITY}
                  value={used}
                  warningValue={WARNING}
                  criticalValue={CRITICAL}
                  segments={16}
                  ariaLabel="Disk space used, segmented"
                />
              </div>
            </div>

            {/* category strip */}
            <div
              className="mt-5 flex h-4 w-full overflow-hidden rounded-full ring-1 ring-stone-200"
              aria-hidden="true"
            >
              {CATEGORIES.map((c) => (
                <span
                  key={c.name}
                  title={`${c.name}: ${c.gb} GB`}
                  style={{
                    width: `${(c.gb / CAPACITY) * 100}%`,
                    backgroundColor: c.color,
                  }}
                />
              ))}
              {added.map((i) => (
                <span
                  key={i}
                  title={`${EXTRA_FILES[i].name}: ${EXTRA_FILES[i].gb} GB`}
                  style={{
                    width: `${(EXTRA_FILES[i].gb / CAPACITY) * 100}%`,
                    backgroundColor: "#1c1917",
                  }}
                />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
              {CATEGORIES.map((c) => (
                <p key={c.name} className="flex items-center gap-1.5 text-[12px] text-stone-600">
                  <span
                    className="size-2.5 rounded-sm"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.name}
                  <span className="ml-auto font-mono text-[11px] text-stone-400">
                    {c.gb} GB
                  </span>
                </p>
              ))}
            </div>

            <div
              className={`mt-5 rounded-xl border p-4 ${
                zone === "critical"
                  ? "border-red-200 bg-red-50"
                  : zone === "warning"
                    ? "border-amber-200 bg-amber-50"
                    : "border-green-200 bg-green-50"
              }`}
              role="status"
            >
              <p
                className={`text-sm font-semibold ${
                  zone === "critical"
                    ? "text-red-900"
                    : zone === "warning"
                      ? "text-amber-900"
                      : "text-green-900"
                }`}
              >
                {status.title}
              </p>
              <p
                className={`mt-1 text-[13px] leading-relaxed ${
                  zone === "critical"
                    ? "text-red-800"
                    : zone === "warning"
                      ? "text-amber-800"
                      : "text-green-800"
                }`}
              >
                {status.body}
              </p>
              {added.length > 0 && (
                <button
                  type="button"
                  onClick={cleanUp}
                  className="mt-3 rounded-lg bg-stone-900 px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-stone-700"
                >
                  Optimise: remove largest added file
                </button>
              )}
            </div>
          </section>

          {/* copy simulator */}
          <section className="flex flex-col gap-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <p className="text-sm font-semibold text-stone-900">
                Copy files onto the disk
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
                Each toggle changes doubleValue — the meter above is read-only
                and just reports it. Add enough and you will cross ⚠ {WARNING}{" "}
                GB, then ● {CRITICAL} GB.
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {EXTRA_FILES.map((f, i) => {
                  const on = added.includes(i);
                  const busy = copying === i;
                  return (
                    <li
                      key={f.name}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                        on ? "border-stone-900 bg-stone-50" : "border-stone-200 bg-white"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-stone-900">
                          {f.name}
                        </p>
                        <p className="font-mono text-[11px] text-stone-500">
                          {f.gb} GB · {on ? "on disk" : "not copied"}
                          {busy ? " · copying…" : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => toggleFile(i)}
                        aria-pressed={on}
                        className={`shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors disabled:opacity-50 ${
                          on
                            ? "border border-stone-300 bg-white text-stone-700 hover:border-red-300 hover:text-red-600"
                            : "bg-[#0071e3] text-white hover:bg-[#0063c9]"
                        }`}
                      >
                        {busy ? "…" : on ? "Remove" : "Copy"}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 font-mono text-[11px] leading-relaxed text-stone-400">
                warningValue = {WARNING} · criticalValue = {CRITICAL} ·
                doubleValue = {used}
              </p>
            </div>
            <div className="rounded-2xl border border-[#0071e3]/25 bg-[#f0f7ff] p-5">
              <p className="text-sm font-semibold text-stone-900">Why it fits here</p>
              <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
                Free space is a <em>level inside a fixed range</em>, not a task
                running to completion — the textbook case for a capacity
                indicator. Threshold coloring turns a number the user would
                ignore into a glanceable warning, which means fewer failed
                installs and faster clean-ups.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
