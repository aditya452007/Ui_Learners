"use client";

import { useRef } from "react";
import { ScrollSpyNav, type ScrollSection } from "../../components/scrollspy";
import { ScenarioNav } from "../../components/scenario-nav";

const SECTIONS: ScrollSection[] = [
  { id: "overview", label: "Overview" },
  { id: "reach", label: "Reach" },
  { id: "engagement", label: "Engagement" },
  { id: "conversions", label: "Conversions" },
  { id: "budget", label: "Budget" },
  { id: "settings", label: "Settings" },
];

const NAV_ITEMS = ["Dashboard", "Campaigns", "Audience", "Reports", "Settings"];

const STATS = [
  { label: "Impressions", value: "2.41M", delta: "+12.4%", up: true },
  { label: "Clicks", value: "118,402", delta: "+8.1%", up: true },
  { label: "CTR", value: "4.91%", delta: "-0.3pt", up: false },
  { label: "Spend", value: "$17,840", delta: "+5.2%", up: true },
];

const REACH = [
  { channel: "Instagram", value: "842K", pct: 100, best: true },
  { channel: "TikTok", value: "618K", pct: 73, best: false },
  { channel: "Search", value: "512K", pct: 61, best: false },
  { channel: "Email", value: "296K", pct: 35, best: false },
  { channel: "Display", value: "187K", pct: 22, best: false },
];

const CREATIVES = [
  { name: "Summer Drop — 16:9", impressions: "412K", ctr: "5.8%", status: "live" },
  { name: "UGC Reel — Testimonial", impressions: "338K", ctr: "6.2%", status: "live" },
  { name: "Static Carousel A", impressions: "196K", ctr: "3.1%", status: "paused" },
  { name: "Product GIF #4", impressions: "121K", ctr: "2.7%", status: "paused" },
];

const CONVERSIONS = [
  { day: "Mon", v: 42 },
  { day: "Tue", v: 58 },
  { day: "Wed", v: 51 },
  { day: "Thu", v: 96 },
  { day: "Fri", v: 74 },
  { day: "Sat", v: 63 },
  { day: "Sun", v: 47 },
];

const MAX_CONV = Math.max(...CONVERSIONS.map((c) => c.v));

function DeltaChip({ delta, up }: { delta: string; up: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
        up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
      }`}
    >
      <svg viewBox="0 0 8 8" className={`h-2 w-2 ${up ? "" : "rotate-180"}`} aria-hidden="true">
        <path d="M4 1l3 5H1l3-5z" fill="currentColor" />
      </svg>
      {delta}
    </span>
  );
}

function SectionCard({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 id={`${id}-title`} className="text-base font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mt-0.5 text-xs text-slate-500">{note}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function CampaignDashboardPage() {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          Scenario 3 of 3 — app
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Campaign dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          This page doesn't scroll — the panel does. The On-this-page rail and the observer root
          are both the inner panel.
        </p>
      </header>

      <div className="mt-8 flex h-[72vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 px-4 pb-4 pt-5">
            <span className="grid size-7 place-items-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
              A
            </span>
            <span className="text-sm font-bold tracking-tight text-slate-900">AdCanvas</span>
          </div>
          <nav aria-label="Product" className="px-3">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = item === "Campaigns";
                return (
                  <li key={item}>
                    <button
                      type="button"
                      aria-current={active ? "page" : undefined}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200 ${
                        active
                          ? "bg-white font-semibold text-indigo-700 shadow-sm"
                          : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
                      }`}
                    >
                      {item}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-auto flex items-center gap-2.5 border-t border-slate-200 px-4 py-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-900 text-[11px] font-bold text-white">
              MK
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-900">Maya Kim</p>
              <p className="text-[10px] text-slate-400">Media buyer</p>
            </div>
          </div>
        </aside>

        <div
          ref={panelRef}
          className="flex-1 overflow-y-auto scroll-smooth [scrollbar-width:thin]"
        >
          <div className="mx-auto max-w-4xl px-8 py-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Campaigns
                </p>
                <h2 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900">
                  Summer Drop — Always-On
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                  Last 7 days
                </span>
                <button
                  type="button"
                  className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-indigo-500"
                >
                  Export
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_200px]">
              <div className="space-y-6">
                <SectionCard
                  id="overview"
                  title="Overview"
                  note="How the campaign is doing at a glance"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {STATS.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          {s.label}
                        </p>
                        <p className="mt-1.5 font-mono text-2xl font-semibold tracking-tight text-slate-900">
                          {s.value}
                        </p>
                        <p className="mt-1.5">
                          <DeltaChip delta={s.delta} up={s.up} />
                        </p>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  id="reach"
                  title="Reach"
                  note="Unique people reached by channel — last 28 days"
                >
                  <ul className="space-y-3.5">
                    {REACH.map((r) => (
                      <li key={r.channel} className="grid grid-cols-[88px_1fr_52px] items-center gap-3">
                        <span className="truncate text-xs font-medium text-slate-600">
                          {r.channel}
                        </span>
                        <div className="h-2.5 rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200/50">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              r.best ? "bg-indigo-600" : "bg-slate-200"
                            }`}
                            style={{ width: `${r.pct}%` }}
                          />
                        </div>
                        <span className="text-right font-mono text-xs font-semibold text-slate-700">
                          {r.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[10px] text-slate-400">
                    Best channel: Instagram — the fill turns indigo.
                  </p>
                </SectionCard>

                <SectionCard
                  id="engagement"
                  title="Engagement"
                  note="Top creatives by impressions — live vs. paused"
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left">
                        <th className="pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Creative
                        </th>
                        <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Impressions
                        </th>
                        <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          CTR
                        </th>
                        <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {CREATIVES.map((c) => (
                        <tr key={c.name} className="border-b border-slate-100 last:border-0">
                          <td className="py-2.5 pr-3 text-xs font-medium text-slate-800">{c.name}</td>
                          <td className="py-2.5 text-right font-mono text-xs text-slate-600">
                            {c.impressions}
                          </td>
                          <td className="py-2.5 text-right font-mono text-xs text-slate-600">
                            {c.ctr}
                          </td>
                          <td className="py-2.5 text-right">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                c.status === "live"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${
                                  c.status === "live" ? "bg-emerald-500" : "bg-amber-500"
                                }`}
                              />
                              {c.status === "live" ? "Live" : "Paused"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </SectionCard>

                <SectionCard
                  id="conversions"
                  title="Conversions"
                  note="Purchases by day of week — last 28 days"
                >
                  <div className="flex h-40 items-end gap-2">
                    {CONVERSIONS.map((c) => {
                      const best = c.v === MAX_CONV;
                      return (
                        <div
                          key={c.day}
                          className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                        >
                          <span className="font-mono text-[10px] font-semibold text-slate-400">
                            {c.v}
                          </span>
                          <div
                            className={`w-full max-w-9 rounded-t-md transition-colors duration-200 group-hover:brightness-110 ${
                              best ? "bg-indigo-600" : "bg-indigo-200"
                            }`}
                            style={{ height: `${(c.v / MAX_CONV) * 100}%` }}
                          />
                          <span className="text-[10px] font-medium text-slate-500">{c.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>

                <SectionCard
                  id="budget"
                  title="Budget"
                  note="May budget — spend pacing vs. allocation"
                >
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="font-mono text-2xl font-semibold tracking-tight text-slate-900">
                        $17,840
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        spent of{" "}
                        <span className="font-mono font-semibold text-slate-700">$24,000</span>{" "}
                        allocated
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-lg font-semibold tracking-tight text-indigo-600">
                        $6,160
                      </p>
                      <p className="text-xs text-slate-500">remaining</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2.5 rounded-full bg-slate-100">
                    <div className="h-full w-[74%] rounded-full bg-indigo-600" />
                  </div>
                  <div className="mt-3 flex justify-between text-[10px] font-medium text-slate-400">
                    <span>Pacing at 74% — on track</span>
                    <span>Month ends in 9 days</span>
                  </div>
                  <label className="mt-5 flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                    <span className="text-xs font-medium text-slate-700">
                      Auto-optimize budget
                      <span className="block text-[10px] font-normal text-slate-400">
                        Shift spend toward the best-performing creatives each day
                      </span>
                    </span>
                    <span className="relative inline-flex shrink-0 items-center">
                      <input type="checkbox" defaultChecked className="peer sr-only" />
                      <span className="h-6 w-11 rounded-full bg-slate-200 transition-colors duration-200 peer-checked:bg-indigo-600" />
                      <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
                    </span>
                  </label>
                </SectionCard>

                <SectionCard
                  id="settings"
                  title="Settings"
                  note="Campaign basics — name, schedule, and status"
                >
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="campaign-name"
                        className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                      >
                        Campaign name
                      </label>
                      <input
                        id="campaign-name"
                        defaultValue="Summer Drop — Always-On"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="campaign-start"
                          className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                        >
                          Start date
                        </label>
                        <input
                          id="campaign-start"
                          type="date"
                          defaultValue="2026-05-01"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="campaign-end"
                          className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                        >
                          End date
                        </label>
                        <input
                          id="campaign-end"
                          type="date"
                          defaultValue="2026-05-31"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="campaign-status"
                        className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                      >
                        Status
                      </label>
                      <div className="relative">
                        <select
                          id="campaign-status"
                          defaultValue="live"
                          className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="live">Live</option>
                          <option value="paused">Paused</option>
                          <option value="archived">Archived</option>
                        </select>
                        <svg
                          viewBox="0 0 16 16"
                          className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                          aria-hidden="true"
                        >
                          <path
                            d="M4 6l4 4 4-4"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </div>

              <aside className="sticky top-8 h-fit self-start">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  On this page
                </p>
                <div className="mt-2 rounded-xl border border-slate-200/70 bg-slate-50/60 p-2">
                  <ScrollSpyNav
                    sections={SECTIONS}
                    ariaLabel="On this page"
                    root={panelRef.current}
                    rootMargin="0px 0px -35% 0px"
                  />
                </div>
                <p className="mt-2 px-1 text-[10px] leading-relaxed text-slate-400">
                  Rooted in the panel, not the window.
                </p>
              </aside>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600">
            Why it fits here
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Long product pages — settings, dashboards, campaign reports — inside fixed app shells
            need in-page orientation. The rail works exactly like a docs rail, but scoped to the
            panel that actually scrolls. Because the panel is short, the activation zone covers
            more of it: the rootMargin is shallower ({`-35%`} vs. {`-55%`} on the window cases).
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600">
            What this variant exercises
          </p>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-600">
            <li>
              <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-600">
                root
              </code>{" "}
              — the observer watches the inner scroll container, not the window.
            </li>
            <li>
              Short container → shallow{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-600">
                rootMargin: 0px 0px -35% 0px
              </code>
              .
            </li>
            <li>
              <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-600">
                scroll-smooth
              </code>{" "}
              must live on the container — the global smooth behavior doesn't reach inner
              scrollers.
            </li>
            <li>Sticky rail inside a scrolling panel — anchored, never fixed.</li>
            <li>Rail coexisting with app chrome (sidebar, top bar) without conflict.</li>
          </ul>
        </div>
      </section>

      <ScenarioNav prev={{ href: "/scenarios/field-guide", label: "Field guide article" }} />
    </main>
  );
}
