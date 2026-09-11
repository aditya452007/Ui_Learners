"use client";

import { useState } from "react";
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

const inputCls =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20";

export default function AccountSettings() {
  const [value, setValue] = useState("profile");
  const [toast, setToast] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  /* profile form */
  const [name, setName] = useState("June Park");
  const [email, setEmail] = useState("june@trailhead.shop");
  const [role, setRole] = useState("Store owner");
  const [bio, setBio] = useState(
    "Running a small outdoor-goods shop. I live in the orders tab.",
  );

  /* billing */
  const [plan, setPlan] = useState("Studio");

  /* notifications */
  const [prefs, setPrefs] = useState({
    orderAlerts: true,
    weeklyDigest: true,
    productNews: false,
    smsBackup: false,
  });

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2000);
  }

  function saveProfile() {
    setSavedAt(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    );
    flash("Profile saved");
  }

  function toggle(key: keyof typeof prefs) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  const enabledCount = Object.values(prefs).filter(Boolean).length;
  const tabs: TabDef[] = [
    { id: "profile", label: "Profile", icon: "◉" },
    { id: "billing", label: "Billing", icon: "▭" },
    {
      id: "notifications",
      label: "Notifications",
      icon: "♪",
      badge: enabledCount,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <BackLink />
        <PageHeader
          eyebrow="scenario 2 · saas settings"
          title="Account settings"
          alsoCalled="Profile / Billing / Notifications"
          lede={
            <p>
              Three boxed sections of one settings screen. Try this: type
              something in Profile, switch to Billing, then come back — your
              draft is still there, because hidden panels stay mounted.
              Each section is a peer, so tabs (not a wizard) are the right
              shape.
            </p>
          }
        />
        <ConfigChips
          items={[
            "variant: boxed",
            "icons per tab",
            "badge: live channel count",
            "panels keep form state",
          ]}
        />

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-stone-900">
              Workspace settings
            </h2>
            {savedAt ? (
              <p className="text-xs text-stone-500">
                Profile saved at {savedAt}
              </p>
            ) : (
              <p className="text-xs text-stone-400">
                Unsaved changes stay put while you browse tabs
              </p>
            )}
          </div>

          <div className="mt-4">
            <Tabs
              tabs={tabs}
              value={value}
              onChange={setValue}
              variant="boxed"
              ariaLabel="Account settings sections"
              idPrefix="settings"
            />
          </div>

          <div className="mt-5">
            <TabPanel
              id={panelId("settings", "profile")}
              labelledBy={tabId("settings", "profile")}
              hidden={value !== "profile"}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium text-stone-700">
                    Display name
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium text-stone-700">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium text-stone-700">Role</span>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={inputCls}
                  >
                    {["Store owner", "Manager", "Support agent"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                  <span className="font-medium text-stone-700">Bio</span>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className={`${inputCls} resize-none`}
                  />
                </label>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={saveProfile}
                  className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0f766e]"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={() => flash("Preview opens in a new view")}
                  className="rounded-lg border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:border-stone-300"
                >
                  Preview storefront
                </button>
              </div>
            </TabPanel>

            <TabPanel
              id={panelId("settings", "billing")}
              labelledBy={tabId("settings", "billing")}
              hidden={value !== "billing"}
            >
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Starter", "$12", "100 orders / mo"],
                  ["Studio", "$29", "1,000 orders / mo"],
                  ["Scale", "$79", "Unlimited orders"],
                ].map(([p, price, cap]) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={plan === p}
                    onClick={() => {
                      setPlan(p);
                      flash(`Plan switched to ${p} (demo — no charge)`);
                    }}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      plan === p
                        ? "border-[#0f766e]/50 bg-[#e6f3f1]/50 shadow-sm"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <p className="text-sm font-semibold text-stone-900">{p}</p>
                    <p className="mt-0.5 text-xl font-semibold text-stone-900">
                      {price}
                      <span className="text-xs font-normal text-stone-400">
                        /mo
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-stone-500">{cap}</p>
                    {plan === p && (
                      <p className="mt-2 inline-block rounded-full bg-[#0f766e] px-2 py-0.5 text-[11px] font-semibold text-white">
                        Current plan
                      </p>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-stone-200">
                <p className="border-b border-stone-100 bg-stone-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
                  Recent invoices
                </p>
                {[
                  ["Aug 2026", "Studio · $29.00", "Paid"],
                  ["Jul 2026", "Studio · $29.00", "Paid"],
                  ["Jun 2026", "Starter · $12.00", "Paid"],
                ].map(([d, what, s]) => (
                  <div
                    key={d}
                    className="flex items-center gap-3 border-b border-stone-100 px-4 py-2.5 text-sm last:border-0"
                  >
                    <span className="font-medium text-stone-800">{d}</span>
                    <span className="text-stone-500">{what}</span>
                    <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      {s}
                    </span>
                    <button
                      type="button"
                      onClick={() => flash(`Invoice ${d} downloading (demo)`)}
                      className="text-xs font-medium text-[#0f766e] hover:underline"
                    >
                      PDF
                    </button>
                  </div>
                ))}
              </div>
            </TabPanel>

            <TabPanel
              id={panelId("settings", "notifications")}
              labelledBy={tabId("settings", "notifications")}
              hidden={value !== "notifications"}
            >
              <div className="flex flex-col gap-2">
                {(
                  [
                    ["orderAlerts", "Order alerts", "A push the moment an order lands."],
                    ["weeklyDigest", "Weekly digest", "Sales, returns, and top products every Monday."],
                    ["productNews", "Product news", "New components and seasonal drops, monthly."],
                    ["smsBackup", "SMS backup", "Text me if email bounces twice."],
                  ] as [keyof typeof prefs, string, string][]
                ).map(([key, title, desc]) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 rounded-xl border border-stone-200 p-4"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-stone-900">
                        {title}
                      </p>
                      <p className="text-[13px] text-stone-500">{desc}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={prefs[key]}
                      aria-label={title}
                      onClick={() => toggle(key)}
                      className="flex items-center rounded-full transition-colors"
                    >
                      <span
                        aria-hidden
                        className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors ${prefs[key] ? "bg-[#0f766e]" : "bg-stone-300"}`}
                      >
                        <span
                          className={`absolute top-[3px] size-4 rounded-full bg-white shadow transition-all ${prefs[key] ? "left-[21px]" : "left-[3px]"}`}
                        />
                      </span>
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-stone-400">
                The badge on the Notifications tab counts enabled channels
                above — flip switches and the count follows.
              </p>
            </TabPanel>
          </div>

          {toast && (
            <div
              role="status"
              className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-4 py-2 text-xs font-medium text-white shadow-lg"
            >
              {toast}
            </div>
          )}
        </section>

        <WhyFit>
          <p>
            Settings sections are independent peers — no order, no progress,
            just “which drawer do I open?”. Boxed tabs give each section a
            chunkier target that reads as navigation rather than text
            decoration, icons speed up scanning, and because panels never
            unmount, half-filled forms survive exploration.
          </p>
        </WhyFit>

        <ScenarioNav
          prev={{ href: "/scenarios/product-details", label: "Product details" }}
          next={{ href: "/scenarios/analytics-dashboard", label: "Analytics dashboard" }}
        />
      </div>
    </main>
  );
}
