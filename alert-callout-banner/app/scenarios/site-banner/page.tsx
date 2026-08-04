"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteBanner, type BannerTone } from "@/components/site-banner";
import { SiteNav } from "@/components/site-nav";
import { Card, SectionTitle } from "@/components/page-shell";
import { Segmented } from "@/components/segmented";

type LineStatus = "On time" | "Minor delays" | "Suspended";

interface LineRow {
  name: string;
  service: string;
  status: LineStatus;
  dot: string;
}

const LINES: LineRow[] = [
  { name: "Blue Line", service: "Weekday & weekend", status: "Minor delays", dot: "bg-blue-600" },
  { name: "Red Line", service: "24-hour", status: "Suspended", dot: "bg-red-600" },
  { name: "Green Line", service: "Weekday only", status: "On time", dot: "bg-green-600" },
  { name: "Orange Line", service: "Weekday peak", status: "On time", dot: "bg-orange-500" },
  { name: "Gold Line", service: "Weekend", status: "Minor delays", dot: "bg-yellow-500" },
];

const STATUS_STYLES: Record<LineStatus, string> = {
  "On time": "bg-emerald-50 text-emerald-700",
  "Minor delays": "bg-amber-50 text-amber-700",
  Suspended: "bg-red-50 text-red-700",
};

const NEWS: { date: string; title: string }[] = [
  {
    date: "Aug 3",
    title: "Tap-to-pay gates are live at Union Station and Market Square — no ticket required.",
  },
  {
    date: "Jul 28",
    title: "Night service on the Blue Line is extended through September.",
  },
  {
    date: "Jul 19",
    title: "The elevator at Alder is out of service; use the north entrance ramp.",
  },
];

const BANNER_COPY: Record<BannerTone, string> = {
  info: "Blue Line schedule changes Sunday, Aug 9 — trains run every 15 minutes.",
  warning:
    "Track work at Union Station — expect 10-minute delays on the Blue and Red lines this week.",
  emergency:
    "Red Line service suspended between Alder and Union — bus shuttles are running. Do not attempt to board trains.",
};

export default function SiteBannerScenario() {
  const [tone, setTone] = useState<BannerTone>("info");
  const [visible, setVisible] = useState(true);

  function changeTone(next: BannerTone) {
    setTone(next);
    setVisible(true);
  }

  const bannerAction =
    tone === "info" ? (
      <a href="#">View schedule</a>
    ) : tone === "warning" ? (
      <a href="#">Plan your trip</a>
    ) : (
      <span className="flex flex-wrap items-center gap-x-3">
        <a href="#" className="whitespace-nowrap">
          Get shuttle map
        </a>
        <a href="#lines" className="whitespace-nowrap">
          See line status
        </a>
      </span>
    );

  return (
    <div className="min-h-screen bg-paper text-ink">
      {visible && (
        <div className="sticky top-0 z-50">
          <SiteBanner
            tone={tone}
            onClose={tone === "emergency" ? undefined : () => setVisible(false)}
            closeLabel={
              tone === "info" ? "Dismiss schedule notice" : "Dismiss track work notice"
            }
            action={bannerAction}
          >
            {BANNER_COPY[tone]}
          </SiteBanner>
        </div>
      )}

      <SiteNav current="banner" />

      <header role="banner" className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M3.4 14.7 4.3 5.2a1.7 1.7 0 0 1 1.7-1.5h8a1.7 1.7 0 0 1 1.7 1.5l.9 9.5" />
                <path d="M3.4 14.7h13.2" />
                <path d="M6.8 8.4h6.4" />
                <path d="M6.8 11h6.4" />
                <circle cx="7" cy="16.6" r="1.1" fill="currentColor" stroke="none" />
                <circle cx="13" cy="16.6" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <span>
              <span className="block text-[15px] font-semibold tracking-tight text-ink">
                Metro Rail
              </span>
              <span className="block font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
                Port Alder Transit
              </span>
            </span>
          </Link>
          <nav aria-label="Site" className="flex items-center gap-1">
            {["Rider info", "Routes", "Fares", "Alerts"].map((label) => (
              <a
                key={label}
                href="#"
                className="rounded-full px-3 py-1.5 text-sm text-muted transition hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-14">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          Metro Rail · Alerts
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Service advisory
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
          When the network has to tell every rider something at once — a schedule change, track work,
          a suspended line — it pins a full-width banner above the header. It is visible before any
          scroll, and its tone says how urgent it is. Run it the way a real transit site would: pick a
          tone, dismiss it, hide it, restore it.
        </p>

        <Card className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                Banner tone
              </span>
              <Segmented
                value={tone}
                options={["info", "warning", "emergency"] as const}
                onChange={changeTone}
                ariaLabel="Banner tone"
              />
            </div>
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                visible
                  ? "border-line bg-surface text-ink hover:border-line-strong hover:bg-paper"
                  : "border-accent/30 bg-accent-soft text-accent-ink hover:bg-accent-soft/70"
              }`}
            >
              {visible ? "Hide banner" : "Show banner"}
            </button>
          </div>
          <p className="mt-5 border-t border-line pt-4 font-mono text-[11px] leading-relaxed text-faint">
            liveRegion=&quot;none&quot; — all three messages exist on page load, so no live region is needed; a
            banner inserted later would take role=&quot;status&quot; (polite) or role=&quot;alert&quot; (urgent).
          </p>
          {tone === "emergency" && (
            <p className="mt-2 font-mono text-[11px] leading-relaxed text-red-700/80">
              Emergency tone — onClose is omitted, so no dismiss button renders: an emergency may not
              be safely hidden.
            </p>
          )}
        </Card>

        <section id="lines" className="mt-12">
          <SectionTitle note="Live status for the five major lines, refreshed every 90 seconds.">
            Lines & status
          </SectionTitle>
          <Card className="overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                  <th scope="col" className="px-5 py-3 font-medium">
                    Line
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Service
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {LINES.map((line) => (
                  <tr
                    key={line.name}
                    className="border-b border-line last:border-0 transition hover:bg-paper/60"
                  >
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-2.5 font-medium text-ink">
                        <span
                          aria-hidden="true"
                          className={`h-2.5 w-2.5 rounded-full ${line.dot}`}
                        />
                        {line.name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted">{line.service}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[line.status]}`}
                      >
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-current opacity-60"
                        />
                        {line.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>

        <section className="mt-12">
          <SectionTitle note="Bulletins from the service desk.">Latest news</SectionTitle>
          <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
            {NEWS.map((item) => (
              <div key={item.date} className="flex items-baseline gap-4 px-5 py-4">
                <span className="w-14 shrink-0 font-mono text-xs font-medium text-faint">
                  {item.date}
                </span>
                <p className="text-sm leading-relaxed text-ink">{item.title}</p>
              </div>
            ))}
          </div>
        </section>

        <Card className="mt-12">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
            Trap
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink">
            role=&quot;banner&quot; is not the announcement banner
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            role=&quot;banner&quot; is the ARIA landmark for the site header — the masthead at the top of this
            page is a real {"<header>"} carrying that role. The announcement strip across the very top
            is plain markup; it must not take the banner role. When such a strip is inserted after
            load, give it role=&quot;status&quot; (polite) or role=&quot;alert&quot; (urgent) instead.
          </p>
          <div className="mt-4 space-y-1.5 rounded-xl border border-line bg-paper p-4 font-mono text-xs leading-relaxed">
            <p>
              <span className="text-accent-ink">{"<header role=\"banner\">"}</span>
              <span className="text-faint"> — the masthead: the page&apos;s landmark (see it above)</span>
            </p>
            <p>
              <span className="text-accent-ink">{"<div>"}</span>
              <span className="text-faint"> — the announcement strip: plain markup, no banner role</span>
            </p>
          </div>
        </Card>

        <Card className="mt-6">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
            Why it fits here
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink">
            Disruptions are site-wide and time-sensitive
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            A transit disruption affects every rider, so the message belongs at the very top — a
            full-width bar that is visible before any scroll and can&apos;t be lost inside the page flow.
            The tone tells riders how urgent it is at a glance: blue for a plan-ahead change, amber
            for delays, red for do-not-ride. And dismissal is a privilege, not a right — an emergency
            stays until the network clears it.
          </p>
        </Card>

        <nav
          aria-label="Scenario navigation"
          className="mt-14 flex items-center justify-between gap-4 border-t border-line pt-6"
        >
          <Link
            href="/scenarios/docs-callouts"
            className="text-sm text-muted transition hover:text-ink"
          >
            ← Docs callouts
          </Link>
          <Link href="/" className="text-sm font-medium text-accent-ink transition hover:underline">
            Anatomy hub
          </Link>
          <Link
            href="/scenarios/account-settings"
            className="text-sm text-muted transition hover:text-ink"
          >
            Account settings →
          </Link>
        </nav>
      </main>
    </div>
  );
}
