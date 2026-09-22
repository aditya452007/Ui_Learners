"use client";

import { useState } from "react";
import { BottomNav, PhoneFrame, type NavTabDef } from "@/components/bottom-nav";
import { ScenarioShell } from "@/components/scenario-shell";
import {
  HomeIcon,
  DumbbellIcon,
  ChartIcon,
  GearIcon,
} from "@/components/icons";

function ScrollCol({
  children,
  onScroll,
}: {
  children: React.ReactNode;
  onScroll?: (y: number) => void;
}) {
  return (
    <div
      className="phone-scroll h-full overflow-y-auto px-4 pb-32 pt-3"
      onScroll={
        onScroll ? (e) => onScroll(e.currentTarget.scrollTop) : undefined
      }
    >
      {children}
    </div>
  );
}

function Switch({
  on,
  onToggle,
  label,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        on ? "bg-[#0d9488]" : "bg-stone-300"
      }`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${
          on ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function Ring({
  pct,
  color,
  label,
  value,
}: {
  pct: number;
  color: string;
  label: string;
  value: string;
}) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 64 64" className="size-16 -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#e7e5e4" strokeWidth="7" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
        />
      </svg>
      <p className="-mt-9 text-sm font-bold text-stone-900">{value}</p>
      <p className="mt-4 text-[11px] font-medium text-stone-500">{label}</p>
    </div>
  );
}

const WORKOUTS = [
  { id: "w1", name: "Morning Run", meta: "5.2 km · 28 min", hue: 168 },
  { id: "w2", name: "Upper Body", meta: "12 exercises · 40 min", hue: 210 },
  { id: "w3", name: "Yoga Flow", meta: "20 min · Beginner", hue: 280 },
  { id: "w4", name: "Interval Sprints", meta: "8 × 400 m · 25 min", hue: 18 },
];

const WEEK = [
  ["M", 40],
  ["T", 65],
  ["W", 30],
  ["T", 80],
  ["F", 55],
  ["S", 95],
  ["S", 70],
] as const;

export default function FitnessTracker() {
  const [tab, setTab] = useState("home");
  const [seenProgress, setSeenProgress] = useState(false);
  const [minimize, setMinimize] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [queued, setQueued] = useState<string[]>([]);
  const [reminders, setReminders] = useState(true);
  const [metric, setMetric] = useState(true);

  const tabs: NavTabDef[] = [
    { id: "home", label: "Home", icon: (a) => <HomeIcon active={a} /> },
    { id: "workouts", label: "Workouts", icon: () => <DumbbellIcon /> },
    {
      id: "progress",
      label: "Progress",
      icon: (a) => <ChartIcon active={a} />,
      dot: !seenProgress,
    },
    { id: "settings", label: "Settings", icon: () => <GearIcon /> },
  ];

  function change(id: string) {
    setTab(id);
    if (id === "progress") setSeenProgress(true);
  }

  const compact = minimize && scrolled && tab === "home";

  return (
    <ScenarioShell
      kicker="scenario 3 · material 3 · dot badge + minimize"
      title="Material 3 fitness"
      context="Pulse, a fitness tracker styled on Material 3's NavigationBar: the active icon sits on a pill-shaped indicator. Progress carries a numberless dot badge — “new insights”, not a count."
      why="Fitness has exactly four peers (today, train, trends, tune), so bottom nav fits — and M3's pill makes selection readable at arm's length mid-workout. The dot badge contrasts the count badge: some news has no number. The minimize toggle shows how a bar can shrink on scroll without ever leaving."
      config={["M3 pill indicator", "dot badge (no number)", "minimize on scroll"]}
      prev={{ href: "/scenarios/food-delivery", label: "Food delivery orders" }}
      next={{ href: "/", label: "Bottom Navigation hub" }}
    >
      <div className="demo-stage flex flex-col items-center gap-4 rounded-2xl border border-stone-300/70 p-6 sm:p-10">
        {/* minimize toggle lives outside the phone, like a real setting */}
        <div className="flex w-full max-w-[320px] items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3">
          <div>
            <p className="text-[13px] font-semibold text-stone-900">
              Minimize bar on scroll
            </p>
            <p className="font-mono text-[11px] text-stone-500">
              tabBarMinimizeBehavior
            </p>
          </div>
          <Switch
            on={minimize}
            onToggle={() => {
              setMinimize((v) => !v);
              setScrolled(false);
            }}
            label="Minimize bar on scroll"
          />
        </div>

        <PhoneFrame
          screenLabel={`Pulse screen: ${tab}`}
          bar={
            <BottomNav
              tabs={tabs}
              value={tab}
              onChange={change}
              variant="m3"
              ariaLabel="Pulse"
              compact={compact}
            />
          }
        >
          {tab === "home" && (
            <ScrollCol onScroll={(y) => setScrolled(y > 60)}>
              <p className="text-xs font-medium text-stone-500">Tuesday</p>
              <p className="text-lg font-bold text-stone-900">Today</p>
              <div className="mt-2 flex justify-around rounded-2xl border border-stone-200 bg-white p-4">
                <Ring pct={72} color="#0d9488" label="Move" value="420" />
                <Ring pct={50} color="#d97706" label="Train" value="30" />
                <Ring pct={90} color="#2563eb" label="Stand" value="11" />
              </div>
              <p className="mt-4 text-sm font-bold text-stone-900">History</p>
              {[
                ["Morning Run", "5.2 km · yesterday"],
                ["Upper Body", "40 min · Monday"],
                ["Yoga Flow", "20 min · Sunday"],
                ["Evening Walk", "2.1 km · Sunday"],
                ["Interval Sprints", "25 min · Saturday"],
                ["Swim", "800 m · Friday"],
              ].map(([t, d]) => (
                <div
                  key={t}
                  className="mt-2 flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-2.5"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#0d9488]/10 text-[#0d9488]">
                    <DumbbellIcon />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-stone-800">{t}</p>
                    <p className="text-[11px] text-stone-500">{d}</p>
                  </div>
                </div>
              ))}
              {minimize && (
                <p className="mt-3 rounded-xl bg-[#e6f5f3] p-3 text-center text-[11px] font-medium text-[#0d9488]">
                  {scrolled
                    ? "Scrolled → bar collapsed to icons only. Scroll back up to expand."
                    : "Scroll down — the bar will collapse to icons only."}
                </p>
              )}
            </ScrollCol>
          )}

          {tab === "workouts" && (
            <ScrollCol>
              <p className="text-lg font-bold text-stone-900">Workouts</p>
              <p className="text-xs text-stone-500">Pick one to queue it up</p>
              {WORKOUTS.map((w) => {
                const q = queued.includes(w.id);
                return (
                  <div
                    key={w.id}
                    className="mt-2 flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3"
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-11 shrink-0 place-items-center rounded-xl text-white"
                      style={{
                        background: `linear-gradient(135deg, hsl(${w.hue} 50% 50%), hsl(${(w.hue + 40) % 360} 55% 35%))`,
                      }}
                    >
                      <DumbbellIcon />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-stone-900">
                        {w.name}
                      </p>
                      <p className="truncate text-[11px] text-stone-500">{w.meta}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setQueued((s) =>
                          q ? s.filter((x) => x !== w.id) : [...s, w.id],
                        )
                      }
                      aria-pressed={q}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                        q
                          ? "bg-[#0d9488]/10 text-[#0d9488]"
                          : "bg-stone-900 text-white hover:bg-stone-700"
                      }`}
                    >
                      {q ? "✓ Queued" : "Start"}
                    </button>
                  </div>
                );
              })}
            </ScrollCol>
          )}

          {tab === "progress" && (
            <ScrollCol>
              <p className="text-lg font-bold text-stone-900">Progress</p>
              <p className="text-xs text-stone-500">
                {seenProgress
                  ? "Insights seen — dot cleared"
                  : "Fresh insights below"}
              </p>
              <div className="mt-2 rounded-2xl border border-stone-200 bg-white p-4">
                <p className="text-xs font-semibold text-stone-500">
                  Active minutes · this week
                </p>
                <div className="mt-2 flex h-24 items-end justify-between gap-1.5">
                  {WEEK.map(([d, v], i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-full ${
                          i === 5 ? "bg-[#0d9488]" : "bg-[#0d9488]/25"
                        }`}
                        style={{ height: `${v}%`, minHeight: 8 }}
                      />
                      <span className="text-[10px] font-medium text-stone-400">
                        {d}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {[
                ["Recovery is trending up", "Resting HR down 4 bpm over 30 days."],
                ["Saturday is your peak", "You train 2× longer on Saturdays."],
              ].map(([t, d]) => (
                <div
                  key={t}
                  className="mt-2 rounded-2xl border border-[#0d9488]/30 bg-[#e6f5f3]/60 p-3"
                >
                  <p className="text-[13px] font-bold text-stone-900">
                    ✨ {t}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-600">{d}</p>
                </div>
              ))}
            </ScrollCol>
          )}

          {tab === "settings" && (
            <ScrollCol>
              <p className="text-lg font-bold text-stone-900">Settings</p>
              {(
                [
                  ["Workout reminders", reminders, () => setReminders((v) => !v)],
                  ["Metric units", metric, () => setMetric((v) => !v)],
                ] as [string, boolean, () => void][]
              ).map(([t, on, fn]) => (
                <div
                  key={t}
                  className="mt-2 flex items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-3"
                >
                  <p className="text-sm font-medium text-stone-800">{t}</p>
                  <Switch on={on} onToggle={fn} label={t} />
                </div>
              ))}
              {["Connected apps", "Privacy", "About Pulse"].map((t) => (
                <div
                  key={t}
                  className="mt-2 flex items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-3"
                >
                  <p className="text-sm font-medium text-stone-800">{t}</p>
                  <span className="text-stone-300" aria-hidden="true">
                    ›
                  </span>
                </div>
              ))}
            </ScrollCol>
          )}
        </PhoneFrame>

        <p className="max-w-md text-center text-[13px] leading-relaxed text-stone-600">
          Open <strong>Progress</strong> once — the numberless dot vanishes
          (some news has no count). Then flip the minimize switch and scroll
          Home: the M3 bar collapses to icons, but never leaves the screen.
        </p>
      </div>
    </ScenarioShell>
  );
}
