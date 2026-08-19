"use client";

import Link from "next/link";
import { useState } from "react";

const HUB = "/";
const NEXT = "/scenarios/marketing-page";
const PREV = "/scenarios/document-editor";

const SECTIONS = [
  {
    label: "Appearance",
    controls: [
      { type: "switch", name: "Dark mode", default: false },
      { type: "switch", name: "Reduce motion", default: false },
      { type: "select", name: "Font size", options: ["Small", "Medium", "Large"] },
    ],
  },
  {
    label: "Notifications",
    controls: [
      { type: "switch", name: "Email alerts", default: true },
      { type: "switch", name: "Push notifications", default: false },
      { type: "switch", name: "Weekly digest", default: true },
    ],
  },
  {
    label: "Danger Zone",
    controls: [
      { type: "button", name: "Sign out", variant: "danger" },
      { type: "button", name: "Delete account", variant: "danger" },
    ],
  },
];

export default function SettingsPanelScenario() {
  const [switches, setSwitches] = useState<Record<string, boolean>>({
    "Dark mode": false,
    "Reduce motion": false,
    "Email alerts": true,
    "Push notifications": false,
    "Weekly digest": true,
  });

  const toggle = (name: string) =>
    setSwitches((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 flex-1">
      {/* Nav */}
      <nav className="flex items-center gap-3 text-sm text-text-muted mb-12">
        <Link href={HUB} className="hover:text-accent transition-colors">
          Anatomy
        </Link>
        <span>/</span>
        <Link href={PREV} className="hover:text-accent transition-colors">
          Document Editor
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Settings Panel</span>
        <span className="ml-auto">
          <Link href={NEXT} className="hover:text-accent transition-colors">
            Next: Marketing Page →
          </Link>
        </span>
      </nav>

      <header className="mb-12">
        <p className="text-sm font-semibold tracking-widest uppercase text-accent mb-3">
          Scenario 2
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Settings Panel
        </h1>
        <p className="text-text-muted max-w-xl">
          <code className="font-mono text-sm bg-surface-alt px-1.5 py-0.5 rounded">
            role="separator"
          </code>{" "}
          divides distinct groups of controls — each section is a different
          concern, separated by a semantic boundary.
        </p>
      </header>

      {/* Settings panel */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-sm">Preferences</h2>
        </div>

        <div className="p-6">
          {SECTIONS.map((section, i) => (
            <div key={i}>
              {i > 0 && (
                <div className="relative my-6">
                  {/* Semantic separator */}
                  <div
                    role="separator"
                    className="h-px bg-border-strong"
                  />
                  {/* Callout */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="callout-pill bg-accent/10 text-accent text-[0.65rem]">
                      role=&quot;separator&quot;
                    </span>
                  </div>
                </div>
              )}

              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
                {section.label}
              </h3>

              <div className="space-y-3">
                {section.controls.map((ctrl) => (
                  <div
                    key={ctrl.name}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm">{ctrl.name}</span>

                    {ctrl.type === "switch" && (
                      <button
                        onClick={() => toggle(ctrl.name)}
                        className={`relative w-10 h-6 rounded-full transition-colors ${
                          switches[ctrl.name]
                            ? "bg-accent"
                            : "bg-border-strong"
                        }`}
                        role="switch"
                        aria-checked={switches[ctrl.name]}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                            switches[ctrl.name]
                              ? "translate-x-4"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    )}

                    {ctrl.type === "select" && "options" in ctrl && ctrl.options && (
                      <select className="text-sm bg-surface-alt border border-border rounded-lg px-3 py-1.5 text-foreground">
                        {ctrl.options.map((opt: string) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    )}

                    {ctrl.type === "button" && "variant" in ctrl && (
                      <button
                        className={`text-sm font-medium px-4 py-1.5 rounded-lg border transition-colors ${
                          ctrl.variant === "danger"
                            ? "border-red-300 text-red-600 hover:bg-red-50"
                            : "border-border bg-surface-alt hover:bg-accent-light"
                        }`}
                      >
                        {ctrl.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why it fits */}
      <div className="mt-8 bg-accent/5 border border-accent/20 rounded-xl p-6">
        <h3 className="font-semibold text-sm mb-2">Why it fits here</h3>
        <p className="text-sm text-text-muted leading-relaxed">
          Settings panels stack multiple concerns (appearance, notifications,
          danger zone) on one page. A{" "}
          <code className="font-mono text-accent">role="separator"</code>{" "}
          tells assistive technology that these are distinct control groups,
          not just visual decoration. Without it, a screen reader would
          present all controls as one flat list.
        </p>
      </div>
    </main>
  );
}
