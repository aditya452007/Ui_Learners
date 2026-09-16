"use client";

import { useState } from "react";
import { ScenarioNav, Switch, TopBar } from "../../components/ui";

type Channel = { key: string; label: string; description: string; disabled?: boolean; disabledNote?: string };

const CHANNELS: Channel[] = [
  { key: "push", label: "Push alerts", description: "Order updates and delivery pings, the second they happen." },
  { key: "email", label: "Email digest", description: "One calm summary every morning at 8:00. Never more." },
  { key: "sms", label: "SMS security codes", description: "Login codes by text message.", disabled: true, disabledNote: "Requires a verified phone number — add one in Profile first." },
  { key: "news", label: "Product news", description: "New features and seasonal collections, about twice a month." },
];

type LogEntry = { id: number; text: string; time: string };

let logId = 0;
const stamp = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" });

export default function NotificationSettingsPage() {
  const [channels, setChannels] = useState<Record<string, boolean>>({ push: true, email: true, sms: false, news: false });
  const [log, setLog] = useState<LogEntry[]>([
    { id: logId++, text: "Settings loaded — 2 of 4 channels on.", time: stamp() },
  ]);

  const onCount = CHANNELS.filter((c) => !c.disabled && channels[c.key]).length;
  const enabledCount = CHANNELS.filter((c) => !c.disabled).length;
  const allOn = CHANNELS.filter((c) => !c.disabled).every((c) => channels[c.key]);

  const push = (text: string) => setLog((l) => [{ id: logId++, text, time: stamp() }, ...l].slice(0, 8));

  const flip = (key: string, next: boolean, label: string) => {
    setChannels((c) => ({ ...c, [key]: next }));
    push(`${label} turned ${next ? "on" : "off"} — applied instantly.`);
  };

  const flipAll = (next: boolean) => {
    setChannels((c) => {
      const copy = { ...c };
      for (const ch of CHANNELS) if (!ch.disabled) copy[ch.key] = next;
      return copy;
    });
    push(next ? "Master switch on — all channels enabled at once." : "Master switch off — every channel silenced at once.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="mx-auto max-w-6xl px-6 pb-20">
        <header className="pb-6 pt-10">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-teal-700">
            Scenario 1 · Switch — applies immediately
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Nimbus notification settings</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-muted">
            There is no Save button on this page, and that is the point: every switch is a promise that the change
            takes effect the moment the thumb lands. Flip anything and watch the activity log prove it.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-teal-800/20 bg-teal-50/60 px-5 py-4">
              <div>
                <p className="text-[15px] font-semibold">All notifications</p>
                <p className="text-[13px] text-text-muted">
                  Master switch — {onCount} of {enabledCount} channels on.
                </p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  role="switch"
                  aria-checked={allOn}
                  aria-label="All notifications"
                  className="switch-input sr-only"
                  checked={allOn}
                  onChange={(e) => flipAll(e.target.checked)}
                />
                <span className="switch-track" aria-hidden="true">
                  <span className="switch-thumb" />
                </span>
              </label>
            </div>

            {CHANNELS.map((c) => (
              <Switch
                key={c.key}
                label={c.label}
                description={c.description}
                checked={!!channels[c.key]}
                disabled={c.disabled}
                disabledNote={c.disabledNote}
                onChange={(next) => flip(c.key, next, c.label)}
              />
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-surface p-5 shadow-sm lg:sticky lg:top-20">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Applied instantly</h2>
              <span className="rounded-full bg-teal-700 px-2.5 py-1 text-[11px] font-bold tabular-nums text-white">
                {onCount} on
              </span>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-text-muted">
              No drafts, no Save — each entry below fired the moment a thumb moved.
            </p>
            <ul className="mt-3 space-y-2" aria-live="polite">
              {log.map((e) => (
                <li key={e.id} className="animate-pop-in rounded-xl bg-surface-alt px-3 py-2.5 text-[13px] leading-snug">
                  <span className="block font-medium">{e.text}</span>
                  <span className="mt-0.5 block font-mono text-[11px] text-text-faint">{e.time}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Why a switch fits here</h2>
          <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-text-muted">
            Notification channels are independent binary settings the user expects to feel right away — silence the
            pings <em>now</em>, not after finding a Save button. The track fill plus the On/Off pill makes the state
            readable at a glance, and the disabled SMS row shows how a switch explains <em>why</em> it cannot move.
            A checkbox here would wrongly promise “staged until saved”; a radio would wrongly imply only one channel
            may be on.
          </p>
        </div>

        <ScenarioNav
          next={{ href: "/scenarios/checkout-delivery", label: "Scenario 2: Checkout" }}
        />
      </main>
    </div>
  );
}
