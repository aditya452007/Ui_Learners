"use client";

import { useEffect, useState } from "react";
import {
  BatteryIcon,
  ControlCenterIcon,
  Desktop,
  MenuBar,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  ScenarioNav,
  ShieldIcon,
  StatusItem,
  StatusMenu,
  WifiIcon,
} from "@/components/macos";

const SERVERS = ["Amsterdam", "Frankfurt", "Tokyo", "New York"] as const;

export default function VpnLiveItemPage() {
  const [openId, setOpenId] = useState<string | null>("packet");
  const [connected, setConnected] = useState(true);
  const [server, setServer] = useState<string>("Amsterdam");
  const [latency, setLatency] = useState(23);

  useEffect(() => {
    const t = setInterval(() => {
      setLatency((l) =>
        Math.min(80, Math.max(12, l + Math.round((Math.random() * 2 - 1) * 9)))
      );
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const pickServer = (s: string) => {
    setServer(s);
    setConnected(true);
  };

  const dot = (
    <span
      className={`inline-block size-2 shrink-0 rounded-full ${
        connected ? "bg-emerald-500 ring-2 ring-emerald-500/20" : "bg-slate-400"
      }`}
    />
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <ScenarioNav current="vpn" />

      <header className="mt-8 mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#007AFF]">
          Scenario 3 of 3
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          VPN Live Item
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-6 text-slate-600">
          The variable-width text variant — the item itself is the readout,
          updating in place.
        </p>
      </header>

      <Desktop>
        <MenuBar appName="Safari" right={
          <>
            <StatusItem
              id="packet"
              openId={openId}
              onOpenChange={setOpenId}
              label="Packet VPN"
              surface={
                <StatusMenu className="min-w-[240px]">
                  <MenuLabel>Packet VPN</MenuLabel>
                  <div className="flex items-center gap-2 rounded-[6px] px-2 py-[5px] text-[13px] text-slate-500">
                    {dot}
                    <span>
                      {connected ? `Connected — ${server}` : "Not connected"}
                    </span>
                  </div>
                  <MenuSeparator />
                  <MenuLabel>Servers</MenuLabel>
                  {SERVERS.map((s) => (
                    <MenuItem
                      key={s}
                      checked={s === server}
                      onClick={() => pickServer(s)}
                    >
                      {s}
                    </MenuItem>
                  ))}
                  <MenuSeparator />
                  {connected ? (
                    <MenuItem danger onClick={() => setConnected(false)}>
                      Disconnect
                    </MenuItem>
                  ) : (
                    <MenuItem onClick={() => setConnected(true)}>
                      Connect
                    </MenuItem>
                  )}
                  <MenuSeparator />
                  <MenuItem disabled shortcut="⌘,">Preferences…</MenuItem>
                </StatusMenu>
              }
            >
              {dot}
              <span className="font-medium">Packet</span>
              <span className="text-slate-500 tabular-nums">{latency} ms</span>
            </StatusItem>
            <StatusItem id="deco-wifi" openId={openId} onOpenChange={setOpenId} label="Wi-Fi">
              <WifiIcon className="h-[15px] w-[15px]" />
            </StatusItem>
            <StatusItem id="deco-battery" openId={openId} onOpenChange={setOpenId} label="Battery">
              <BatteryIcon className="h-[13px] w-[22px]" />
            </StatusItem>
            <StatusItem id="deco-control" openId={openId} onOpenChange={setOpenId} label="Control Center">
              <ControlCenterIcon className="h-[15px] w-[15px]" />
            </StatusItem>
          </>
        } />

        <div className="p-6 sm:p-10">
          <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldIcon className={`h-[18px] w-[18px] ${connected ? "text-emerald-500" : "text-slate-400"}`} />
                <h2 className="text-[15px] font-bold tracking-tight text-slate-900">
                  Packet VPN
                </h2>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-150 ${
                  connected
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {connected ? "Protected" : "Unprotected"}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-sm">
              <div>
                <dt className="text-xs text-slate-400">Today</dt>
                <dd className="mt-0.5 font-semibold text-slate-700 tabular-nums">
                  {connected ? "4h 12m" : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Downloaded</dt>
                <dd className="mt-0.5 font-semibold text-slate-700 tabular-nums">
                  {connected ? "1.2 GB" : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Server</dt>
                <dd className="mt-0.5 font-semibold text-slate-700">
                  {connected ? server : "None"}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Click Packet in the menu bar — watch the milliseconds tick.
            </p>
          </div>
        </div>
      </Desktop>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold tracking-tight text-slate-900">
            Why it fits here
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            VPN state is something you glance at constantly, so Packet puts the
            answer right in the menu bar: one look tells you if you are protected
            and how fast the tunnel feels. The live latency readout doubles as a
            health signal — a sudden jump warns you before pages crawl. And
            connect or switch server happens one click away, without ever
            opening an app window.
          </p>
          <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-6 text-slate-500">
            Builder note: <code className="rounded bg-slate-50 px-1 py-0.5 font-mono text-[12px]">statusItem(withLength:)</code> sizes
            the item to its content, so text items grow and shrink live — React
            re-renders the label and the width follows.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold tracking-tight text-slate-900">
            What to notice
          </h3>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
            <li className="flex gap-2">
              <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-[#007AFF]" />
              The item is text, not an icon — its length changes as the numbers
              tick up and down.
            </li>
            <li className="flex gap-2">
              <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-[#007AFF]" />
              The dot recolors with connection state. Template icons normally
              recolor themselves; here color is deliberate data, not decoration.
            </li>
            <li className="flex gap-2">
              <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-[#007AFF]" />
              The highlighted background stays pinned while the menu is open,
              even as the label behind it keeps updating.
            </li>
          </ul>
        </div>
      </section>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 text-sm">
        <a href="/scenarios/wifi-system-menu" className="font-medium text-slate-600 transition-colors duration-150 hover:text-slate-900">
          ← Wi-Fi system menu
        </a>
        <a href="/scenarios/focus-timer-popover" className="font-medium text-slate-600 transition-colors duration-150 hover:text-slate-900">
          Focus-timer popover →
        </a>
        <a href="/" className="font-medium text-[#007AFF] transition-colors duration-150 hover:text-blue-700">
          Overview
        </a>
      </footer>
    </main>
  );
}
