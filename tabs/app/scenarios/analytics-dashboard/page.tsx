"use client";

import { useEffect, useRef, useState } from "react";
import {
  Tabs,
  TabPanel,
  tabId,
  panelId,
  type TabDef,
} from "@/components/tabs";
import {
  BackLink,
  ConfigChips,
  PageHeader,
  ScenarioNav,
  WhyFit,
} from "@/components/chrome";

const TABS: TabDef[] = [
  { id: "overview", label: "Overview" },
  { id: "traffic", label: "Traffic" },
  { id: "conversions", label: "Conversions" },
  { id: "audience", label: "Audience" },
  { id: "revenue", label: "Revenue" },
  { id: "experiments", label: "Experiments", badge: 2 },
  {
    id: "exports",
    label: "Exports",
    disabled: true,
    disabledReason: "Exports need a Scale plan — upgrade to unlock",
  },
];

type ViewData = {
  stats: [string, string, string][];
  bars: number[];
  note: string;
};

const DATA: Record<string, ViewData> = {
  overview: {
    stats: [
      ["Sessions", "48,210", "+12.4%"],
      ["Conversion", "3.8%", "+0.4 pts"],
      ["Revenue", "$86,400", "+9.1%"],
    ],
    bars: [42, 58, 51, 66, 74, 69, 88],
    note: "Back-to-school weekend drove the Sunday spike — the year's highest single-day revenue.",
  },
  traffic: {
    stats: [
      ["Organic", "21,304", "+8.2%"],
      ["Direct", "11,980", "+3.1%"],
      ["Referral", "6,412", "−1.4%"],
    ],
    bars: [30, 44, 39, 52, 48, 61, 57],
    note: "Referral dip traces to a partner newsletter sent a day late. Organic search carried the week.",
  },
  conversions: {
    stats: [
      ["Checkout rate", "3.8%", "+0.4 pts"],
      ["Cart adds", "9,114", "+6.7%"],
      ["Abandons", "61%", "−2.1 pts"],
    ],
    bars: [22, 28, 35, 33, 44, 52, 61],
    note: "The one-page checkout test keeps winning — abandons down two weeks running.",
  },
  audience: {
    stats: [
      ["New visitors", "31,002", "+14.9%"],
      ["Returning", "17,208", "+5.5%"],
      ["Subscribers", "4,890", "+211"],
    ],
    bars: [55, 48, 62, 58, 70, 66, 79],
    note: "New-visitor share is the highest since launch. The gift-guide post did the heavy lifting.",
  },
  revenue: {
    stats: [
      ["Gross", "$86,400", "+9.1%"],
      ["Refunds", "$1,204", "−0.3 pts"],
      ["Avg. order", "$58.20", "+$2.10"],
    ],
    bars: [38, 46, 41, 55, 62, 71, 84],
    note: "Average order value keeps climbing as notebook + pen bundles catch on.",
  },
  experiments: {
    stats: [
      ["Running", "2", "checkout, pricing"],
      ["Won (30d)", "5", "+2 this week"],
      ["Avg. lift", "+4.2%", "per winning test"],
    ],
    bars: [12, 24, 19, 33, 28, 41, 47],
    note: "Two tests need a decision: one-page checkout (+6.1%) and bundle pricing (+3.8%).",
  },
  exports: { stats: [], bars: [], note: "" },
};

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function Skeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-stone-100 p-4">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton mt-2 h-7 w-28 rounded" />
          </div>
        ))}
      </div>
      <div className="skeleton h-36 rounded-xl" />
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [value, setValue] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState<Set<string>>(new Set(["overview"]));
  const timer = useRef<number | null>(null);

  /* simulated fetch: skeleton on first visit to each view */
  useEffect(() => {
    if (loaded.has(value)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    timer.current = window.setTimeout(() => {
      setLoaded((prev) => new Set(prev).add(value));
      setLoading(false);
    }, 650);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [value, loaded]);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <BackLink />
        <PageHeader
          eyebrow="scenario 3 · data dashboard"
          title="Analytics dashboard"
          alsoCalled="Overview / Traffic / … / Exports"
          lede={
            <p>
              Seven views, one narrow row. The pill tablist scrolls
              horizontally on small screens and auto-scrolls the active tab
              into view; the locked Exports tab shows how disabled tabs
              explain themselves instead of just going dead.
            </p>
          }
        />
        <ConfigChips
          items={[
            "variant: pills",
            "7 tabs, scrollable row",
            "disabled: Exports (Pro)",
            "skeleton on first visit",
            "arrow keys skip disabled",
          ]}
        />

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-stone-900">
                Trailhead Shop
              </h2>
              <p className="text-xs text-stone-400">
                Last 7 days · updated 12 min ago
              </p>
            </div>
            <p className="rounded-full bg-stone-100 px-3 py-1 font-mono text-[11px] text-stone-500">
              arrow keys travel the row — Exports is skipped
            </p>
          </div>

          <div className="mt-4">
            <Tabs
              tabs={TABS}
              value={value}
              onChange={setValue}
              variant="pills"
              ariaLabel="Analytics views"
              idPrefix="analytics"
            />
          </div>

          <div className="mt-5" aria-live="polite">
            {TABS.filter((t) => !t.disabled).map((t) => (
              <TabPanel
                key={t.id}
                id={panelId("analytics", t.id)}
                labelledBy={tabId("analytics", t.id)}
                hidden={value !== t.id}
              >
                {loading || !loaded.has(t.id) ? (
                  <Skeleton />
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {DATA[t.id].stats.map(([label, n, delta]) => (
                        <div
                          key={label}
                          className="rounded-xl border border-stone-200 p-4"
                        >
                          <p className="text-xs font-medium uppercase tracking-[0.1em] text-stone-400">
                            {label}
                          </p>
                          <div className="mt-1 flex items-baseline gap-2">
                            <p className="text-2xl font-semibold text-stone-900">
                              {n}
                            </p>
                            <p
                              className={`text-xs font-semibold ${delta.startsWith("−") ? "text-rose-600" : "text-emerald-600"}`}
                            >
                              {delta}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border border-stone-200 p-4">
                      <div className="flex h-36 items-end gap-2">
                        {DATA[t.id].bars.map((h, i) => (
                          <div
                            key={i}
                            className="flex flex-1 flex-col items-center gap-1.5"
                          >
                            <div
                              className={`w-full rounded-t-md ${i === DATA[t.id].bars.length - 1 ? "bg-[#0f766e]" : "bg-[#0f766e]/25"}`}
                              style={{ height: `${h}%` }}
                              title={`${DAYS[i]}: ${h}`}
                            />
                            <span className="font-mono text-[10px] text-stone-400">
                              {DAYS[i]}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 border-t border-stone-100 pt-3 text-[13px] leading-relaxed text-stone-600">
                        {DATA[t.id].note}
                      </p>
                    </div>
                  </div>
                )}
              </TabPanel>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-stone-50 px-4 py-3 text-[13px] text-stone-600 ring-1 ring-stone-200/70">
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="size-4 shrink-0 fill-none stroke-stone-400 stroke-[1.5]"
            >
              <rect x="3" y="7" width="10" height="6.5" rx="1.5" />
              <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
            </svg>
            <p>
              <span className="font-semibold text-stone-800">Exports</span>{" "}
              stays visible but disabled — hover it for the reason. Disabled
              tabs teach the rule instead of hiding the feature.
            </p>
          </div>
        </section>

        <WhyFit>
          <p>
            A dashboard is seven peer answers to “how is the shop doing?” —
            no sequence, no funnel, so tabs beat steps or wizards. The
            scrollable pill row survives narrow screens, the skeleton makes
            each switch feel fetched rather than frozen, and keeping the
            locked tab visible advertises the upgrade without punishing
            discovery.
          </p>
        </WhyFit>

        <ScenarioNav
          prev={{ href: "/scenarios/account-settings", label: "Account settings" }}
          next={{ href: "/scenarios/product-details", label: "Product details" }}
        />
      </div>
    </main>
  );
}
