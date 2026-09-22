"use client";

import { useState } from "react";
import { BottomNav, PhoneFrame, type NavTabDef } from "@/components/bottom-nav";
import { ScenarioShell } from "@/components/scenario-shell";
import {
  HomeIcon,
  SearchIcon,
  ReceiptIcon,
  UserIcon,
} from "@/components/icons";

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  time: string;
  rating: string;
  fee: string;
  hue: number;
}

const RESTAURANTS: Restaurant[] = [
  { id: "r1", name: "Ember & Oak", cuisine: "Wood-fired · Bowls", time: "15–25 min", rating: "4.8", fee: "$1.49", hue: 18 },
  { id: "r2", name: "Verde Taqueria", cuisine: "Mexican · Tacos", time: "10–20 min", rating: "4.7", fee: "Free", hue: 140 },
  { id: "r3", name: "Kiln Pizza", cuisine: "Italian · Pizza", time: "20–30 min", rating: "4.9", fee: "$0.99", hue: 36 },
  { id: "r4", name: "Miso Lane", cuisine: "Japanese · Ramen", time: "15–25 min", rating: "4.6", fee: "$1.99", hue: 200 },
  { id: "r5", name: "Golden Falafel", cuisine: "Levantine · Wraps", time: "10–15 min", rating: "4.8", fee: "Free", hue: 48 },
  { id: "r6", name: "Stack & Syrup", cuisine: "Brunch · All day", time: "20–35 min", rating: "4.5", fee: "$2.49", hue: 340 },
];

interface Order {
  id: string;
  restaurant: string;
  items: string;
  eta: string;
}

const INITIAL_ORDERS: Order[] = [
  { id: "o1", restaurant: "Kiln Pizza", items: "1× Margherita · 1× Garlic knots", eta: "Arriving in ~12 min" },
  { id: "o2", restaurant: "Verde Taqueria", items: "3× Baja tacos · Lime rice", eta: "Arriving in ~25 min" },
];

function ScrollCol({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-scroll h-full overflow-y-auto px-4 pb-32 pt-3">
      {children}
    </div>
  );
}

function FoodTile({ hue, letter }: { hue: number; letter: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-12 shrink-0 place-items-center rounded-xl text-lg font-bold text-white/95"
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 50% 50%), hsl(${(hue + 40) % 360} 55% 35%))`,
      }}
    >
      {letter}
    </span>
  );
}

export default function FoodDelivery() {
  const [tab, setTab] = useState("home");
  const [activeOrders, setActiveOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState("");

  const tabs: NavTabDef[] = [
    { id: "home", label: "Home", icon: (a) => <HomeIcon active={a} /> },
    { id: "search", label: "Search", icon: () => <SearchIcon /> },
    {
      id: "orders",
      label: "Orders",
      icon: (a) => <ReceiptIcon active={a} />,
      badge: activeOrders.length,
    },
    { id: "account", label: "Account", icon: (a) => <UserIcon active={a} /> },
  ];

  function pickUp(id: string) {
    const order = activeOrders.find((o) => o.id === id);
    if (!order) return;
    setActiveOrders((os) => os.filter((o) => o.id !== id));
    setPastOrders((ps) => [order, ...ps]);
  }

  const results = RESTAURANTS.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <ScenarioShell
      kicker="scenario 2 · full-bleed · live badge"
      title="Food delivery orders"
      context="Dashbite, a food delivery app. The bar is full-bleed — edge to edge, no float — and the Orders badge is live inventory: 2 active deliveries waiting for pickup."
      why="Delivery is a waiting game: the badge answers “how many orders still need me?” at a glance. Tapping Orders swaps instantly to the status list (no push animation to sit through), and picking an order up drops the count in real time — the badge never lies."
      config={["full-bleed bar", "live badge 2 → 0", "instant screen swap"]}
      prev={{ href: "/scenarios/music-app", label: "Glass music app" }}
      next={{ href: "/scenarios/fitness-tracker", label: "Material 3 fitness" }}
    >
      <div className="demo-stage flex flex-col items-center gap-4 rounded-2xl border border-stone-300/70 p-6 sm:p-10">
        <PhoneFrame
          screenLabel={`Dashbite screen: ${tab}`}
          bar={
            <BottomNav
              tabs={tabs}
              value={tab}
              onChange={setTab}
              variant="fullbleed"
              ariaLabel="Dashbite"
            />
          }
        >
          {tab === "home" && (
            <ScrollCol>
              <p className="text-xs font-medium text-stone-500">
                Delivering to · Home
              </p>
              <p className="text-lg font-bold text-stone-900">
                What&apos;s for dinner?
              </p>
              {RESTAURANTS.map((r) => (
                <div
                  key={r.id}
                  className="mt-2 flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3"
                >
                  <FoodTile hue={r.hue} letter={r.name[0]} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-stone-900">
                      {r.name}
                    </p>
                    <p className="truncate text-[11px] text-stone-500">
                      ★ {r.rating} · {r.cuisine}
                    </p>
                    <p className="text-[11px] font-medium text-[#0d9488]">
                      {r.time} · {r.fee} fee
                    </p>
                  </div>
                </div>
              ))}
            </ScrollCol>
          )}

          {tab === "search" && (
            <ScrollCol>
              <p className="text-lg font-bold text-stone-900">Search</p>
              <label className="mt-2 flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 focus-within:border-[#0d9488]/50">
                <span className="text-stone-400">
                  <SearchIcon />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cuisine or restaurant…"
                  className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                />
              </label>
              {results.length === 0 && (
                <p className="mt-4 rounded-xl bg-stone-50 p-4 text-center text-[13px] text-stone-500">
                  No matches for “{query}”. Try “pizza” or “ramen”.
                </p>
              )}
              {results.map((r) => (
                <div
                  key={r.id}
                  className="mt-2 flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3"
                >
                  <FoodTile hue={r.hue} letter={r.name[0]} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-stone-900">
                      {r.name}
                    </p>
                    <p className="truncate text-[11px] text-stone-500">
                      {r.cuisine} · {r.time}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollCol>
          )}

          {tab === "orders" && (
            <ScrollCol>
              <p className="text-lg font-bold text-stone-900">Orders</p>
              <p className="text-xs text-stone-500">
                {activeOrders.length === 0
                  ? "Nothing on the way — badge cleared"
                  : `${activeOrders.length} active deliver${
                      activeOrders.length === 1 ? "y" : "ies"
                    }`}
              </p>
              {activeOrders.map((o) => (
                <div
                  key={o.id}
                  className="mt-2 rounded-2xl border border-[#0d9488]/30 bg-white p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0d9488] opacity-60" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-[#0d9488]" />
                    </span>
                    <p className="text-sm font-bold text-stone-900">
                      {o.restaurant}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-stone-500">{o.items}</p>
                  <p className="mt-0.5 text-xs font-semibold text-[#0d9488]">
                    {o.eta}
                  </p>
                  <button
                    type="button"
                    onClick={() => pickUp(o.id)}
                    className="mt-2.5 w-full rounded-xl bg-stone-900 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-stone-700"
                  >
                    Mark picked up
                  </button>
                </div>
              ))}
              {pastOrders.length > 0 && (
                <>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
                    Past
                  </p>
                  {pastOrders.map((o) => (
                    <div
                      key={o.id}
                      className="mt-2 flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-3 opacity-70"
                    >
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-stone-200 text-[11px] font-bold text-stone-600">
                        ✓
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-stone-700">
                          {o.restaurant}
                        </p>
                        <p className="truncate text-[11px] text-stone-500">
                          Picked up · {o.items}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </ScrollCol>
          )}

          {tab === "account" && (
            <ScrollCol>
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-[#0d9488] text-lg font-bold text-white">
                  S
                </span>
                <div>
                  <p className="text-base font-bold text-stone-900">
                    Sam Rivera
                  </p>
                  <p className="text-xs text-stone-500">DashPass member</p>
                </div>
              </div>
              {[
                ["Addresses", "Home · Work"],
                ["Payment", "···· 4242"],
                ["Order history", `${pastOrders.length + 14} orders`],
                ["Help", "Chat with support"],
              ].map(([t, d]) => (
                <div
                  key={t}
                  className="mt-2 flex items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-800">{t}</p>
                    <p className="text-[11px] text-stone-500">{d}</p>
                  </div>
                  <span className="text-stone-300" aria-hidden="true">
                    ›
                  </span>
                </div>
              ))}
            </ScrollCol>
          )}
        </PhoneFrame>

        <p className="max-w-md text-center text-[13px] leading-relaxed text-stone-600">
          Open <strong>Orders</strong> and tap “Mark picked up” — the badge
          drops {activeOrders.length} → 0 live and disappears. Each tab swaps
          to completely different content with zero slide animation.
        </p>
      </div>
    </ScenarioShell>
  );
}
