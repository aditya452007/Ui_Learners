"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BatteryIcon,
  ClockIcon,
  Desktop,
  MenuBar,
   ScenarioNav,
   StatusItem,
  WifiIcon,
} from "@/components/macos";

const SESSION_SECONDS = 25 * 60;
const RING_SIZE = 120;
const RING_STROKE = 8;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type TimerStatus = "idle" | "running" | "paused";

const MODE_LABELS: Record<TimerStatus, string> = {
  running: "Focusing 25 min",
  paused: "Paused",
  idle: "Break 5 min",
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function FlowStatusItem({
  openId,
  onOpenChange,
}: {
  openId: string | null;
  onOpenChange: (id: string | null) => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(14 * 60 + 37);
  const [status, setStatus] = useState<TimerStatus>("running");
  const [sessionsDone, setSessionsDone] = useState(2);

  useEffect(() => {
    if (status !== "running") return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [status]);

  useEffect(() => {
    if (secondsLeft === 0 && status === "running") {
      setStatus("idle");
      setSessionsDone((n) => Math.min(4, n + 1));
    }
  }, [secondsLeft, status]);

  const progress =
    RING_CIRCUMFERENCE * (1 - Math.min(1, secondsLeft / SESSION_SECONDS));
  const btn =
    "rounded-lg border bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors duration-150";
  const remainingLabel = formatTime(secondsLeft);

  return (
    <StatusItem
      id="flow"
      openId={openId}
      onOpenChange={onOpenChange}
      label="Flow focus timer"
      surface={
        <div className="relative w-[300px] rounded-xl border border-black/[0.08] bg-white/95 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="absolute -top-1 right-8 h-3 w-3 rotate-45 border-l border-t border-black/[0.08] bg-white/95" />
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-sm font-bold tracking-tight text-slate-900">Focus Session</span>
            <span className="text-xs text-slate-400">{MODE_LABELS[status]}</span>
          </div>
          <div className="flex justify-center py-1">
            <svg
              width={RING_SIZE}
              height={RING_SIZE}
              role="img"
              aria-label={`Focus timer, ${remainingLabel} remaining`}
            >
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={RING_STROKE}
              />
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                fill="none"
                stroke="#007AFF"
                strokeWidth={RING_STROKE}
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={progress}
                transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
              <text
                x={RING_SIZE / 2}
                y={RING_SIZE / 2}
                dominantBaseline="central"
                textAnchor="middle"
                className="fill-slate-900 text-2xl font-semibold tabular-nums"
              >
                {remainingLabel}
              </text>
            </svg>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            {status === "running" ? (
              <button type="button" onClick={() => setStatus("paused")} className={`${btn} border-slate-200`}>
                Pause
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStatus("running")}
                className={`${btn} border-transparent bg-[#007AFF] text-white hover:bg-[#0069d9]`}
              >
                Start
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setSecondsLeft(SESSION_SECONDS);
              }}
              className={`${btn} border-slate-200`}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setSecondsLeft((s) => Math.max(0, s - 300))}
              className={`${btn} border-slate-200`}
            >
              +5:00
            </button>
          </div>
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`size-2 rounded-full ${
                  i < sessionsDone ? "bg-[#007AFF]" : "bg-slate-200"
                }`}
              />
            ))}
            <span className="ml-1.5 text-[11px] text-slate-400">
              {sessionsDone >= 4 ? "All done today" : `${4 - sessionsDone} to go today`}
            </span>
          </div>
        </div>
      }
    >
      <ClockIcon
        className={`h-[15px] w-[15px] transition-opacity duration-150 ${
          status === "paused" ? "opacity-40" : ""
        }`}
      />
    </StatusItem>
  );
}

export default function Page() {
  const [openId, setOpenId] = useState<string | null>("flow");

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <ScenarioNav current="timer" />
      <header className="mt-8">
        <p className="text-xs font-semibold tracking-widest text-[#007AFF]">SCENARIO 2 OF 3</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Focus-Timer Popover</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          A third-party app living entirely in the menu bar &mdash; icon in, rich popover out.
        </p>
      </header>

      <section className="mt-10">
        <Desktop>
          <MenuBar
            appName="Flow"
            right={
              <>
                <StatusItem id="wifi" openId={openId} onOpenChange={setOpenId}>
                  <WifiIcon className="h-[15px] w-[15px]" />
                </StatusItem>
                <StatusItem id="battery" openId={openId} onOpenChange={setOpenId}>
                  <BatteryIcon className="h-[13px] w-[24px]" />
                </StatusItem>
                <FlowStatusItem openId={openId} onOpenChange={setOpenId} />
              </>
            }
          />
          <div className="mx-auto my-8 max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold tracking-tight text-slate-900">Deep Work</p>
                <p className="text-xs text-slate-400">Q3 planning doc</p>
              </div>
              <span className="rounded-full border border-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                Today
              </span>
            </div>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "Draft pricing narrative", done: true },
                { label: "Review funnel metrics", done: false },
              ].map((task) => (
                <li key={task.label} className="flex items-center gap-2.5">
                  <span
                    className={`grid size-4 place-items-center rounded border transition-colors duration-150 ${
                      task.done ? "border-[#007AFF] bg-[#007AFF]" : "border-slate-300 bg-white"
                    }`}
                  >
                    {task.done && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-2.5 w-2.5"
                        aria-hidden="true"
                      >
                        <path d="M4.5 12.8 9.5 18 19.5 6.5" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-sm ${task.done ? "text-slate-400" : "text-slate-600"}`}>
                    {task.label}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-slate-100 pt-3 text-center text-[11px] text-slate-400">
              Click the clock icon in the menu bar
            </p>
          </div>
        </Desktop>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold tracking-tight text-slate-900">Why it fits here</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Flow has no dock icon and no window &mdash; the whole app is one menu bar icon. The
            popover gives you full controls without breaking your focus, and the ring plus countdown
            make progress glanceable in half a second. Builder note: menus list{" "}
            <span className="font-medium text-slate-600">actions</span>, popovers host{" "}
            <span className="font-medium text-slate-600">widgets</span> &mdash; different surface for
            a different job.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold tracking-tight text-slate-900">What to notice</h2>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate-500">
            <li className="flex gap-2">
              <span className="text-[#007AFF]">&bull;</span>
              The highlight stays on the icon while its popover floats &mdash; you always know which
              item owns the panel.
            </li>
            <li className="flex gap-2">
              <span className="text-[#007AFF]">&bull;</span>
              The countdown keeps ticking inside the surface &mdash; state lives in React, the
              popover just renders it.
            </li>
            <li className="flex gap-2">
              <span className="text-[#007AFF]">&bull;</span>
              Pause the timer and the icon itself dims &mdash; the status item communicates state
              even when closed.
            </li>
          </ul>
        </div>
      </section>

      <footer className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200 pt-5 text-sm">
        <Link
          href="/scenarios/wifi-system-menu"
          className="font-medium text-slate-500 transition-colors duration-150 hover:text-slate-900"
        >
          Wi-Fi system menu
        </Link>
        <Link
          href="/scenarios/vpn-live-item"
          className="font-medium text-slate-500 transition-colors duration-150 hover:text-slate-900"
        >
          VPN live item
        </Link>
        <Link
          href="/"
          className="ml-auto font-medium text-slate-500 transition-colors duration-150 hover:text-slate-900"
        >
          Overview
        </Link>
      </footer>
    </main>
  );
}
