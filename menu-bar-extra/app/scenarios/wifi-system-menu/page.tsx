"use client";

import { useState } from "react";
import {
  BluetoothIcon,
  BatteryIcon,
  ControlCenterIcon,
  Desktop,
  MenuBar,
  MenuLabel,
  MenuItem,
  MenuSeparator,
  StatusItem,
  StatusMenu,
  ScenarioNav,
  WifiIcon,
} from "@/components/macos";

export default function WifiSystemMenuPage() {
  const [openId, setOpenId] = useState<string | null>("wifi");
  const [toast, setToast] = useState<string | null>(null);

  const openSettings = () => {
    setToast("Network Settings would open here");
    window.setTimeout(() => setToast(null), 2000);
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <ScenarioNav current="wifi" />

      <header className="mt-8 mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#007AFF]">
          Scenario 1 of 3
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Wi-Fi System Menu
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          The classic variant — an icon-only template item whose attached{" "}
          <code className="font-mono text-[11px] bg-slate-100 rounded-md px-1.5 py-0.5">
            NSStatusItem.menu
          </code>{" "}
          lists networks, settings and shortcuts.
        </p>
      </header>

      <Desktop>
        <MenuBar appName="Finder" right={
          <>
            <StatusItem id="bt" openId={openId} onOpenChange={setOpenId} label="Bluetooth">
              <BluetoothIcon className="h-[15px] w-[15px]" />
            </StatusItem>
            <StatusItem id="battery" openId={openId} onOpenChange={setOpenId} label="Battery">
              <BatteryIcon className="h-[13px] w-[23px]" />
            </StatusItem>
            <StatusItem id="cc" openId={openId} onOpenChange={setOpenId} label="Control Center">
              <ControlCenterIcon className="h-[15px] w-[15px]" />
            </StatusItem>
            <StatusItem id="wifi" openId={openId} onOpenChange={setOpenId} label="Wi-Fi"
              surface={
                <StatusMenu className="group/menu min-w-[260px]">
                  <MenuLabel>Wi-Fi</MenuLabel>
                  <MenuItem checked>HomeNet 5G</MenuItem>
                  <MenuItem>CoffeeShop_Guest</MenuItem>
                  <MenuSeparator />
                  <MenuItem disabled chevron>Other Networks…</MenuItem>
                  <MenuItem shortcut="⌘," onClick={openSettings}>Network Settings…</MenuItem>
                  <MenuSeparator />
                  <MenuItem>Turn Wi-Fi Off</MenuItem>
                </StatusMenu>
              }>
              <WifiIcon className="h-[15px] w-[15px]" />
            </StatusItem>
          </>
        } />

        <div className="py-10 text-center">
          <p className="text-sm text-slate-500">Click the Wi-Fi icon in the menu bar</p>
          {toast && (
            <p className="mx-auto mt-3 inline-block rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm transition-opacity duration-150">
              {toast}
            </p>
          )}
        </div>
      </Desktop>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold tracking-tight text-slate-900">Why it fits here</h2>
        <p className="mt-2 text-slate-600">
          Switching networks takes one click on a familiar icon — no trip through System Settings.
          The icon doubles as glanceable status: you can tell Wi-Fi is on before you even open the
          menu. The whole interaction keeps your hands on the mouse for under a second.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Builder note: this variant demonstrates a real attached menu — section labels, a checkmark
          marking the current choice, dimmed disabled entries, right-aligned keyboard shortcuts and
          a chevron hinting at a submenu.
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold tracking-tight text-slate-900">What to notice</h2>
        <ul className="mt-2 space-y-1.5 text-slate-600 list-disc pl-5">
          <li>The pale rounded highlight stays on the icon while the menu is open, and vanishes the moment the menu closes.</li>
          <li>The checkmark marks the active network — the same pattern radio groups use to show the selected option.</li>
          <li>The dimmed item is disabled: present so you know the feature exists, but not clickable.</li>
        </ul>
      </section>

      <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <a href="/" className="transition-colors duration-150 hover:text-slate-900">← Hub</a>
        <div className="flex gap-4">
          <span className="text-slate-400">Next:</span>
          <a href="/scenarios/focus-timer-popover" className="transition-colors duration-150 hover:text-slate-900">Focus-timer popover →</a>
          <a href="/scenarios/vpn-live-item" className="transition-colors duration-150 hover:text-slate-900">VPN live item →</a>
        </div>
      </footer>
    </main>
  );
}
