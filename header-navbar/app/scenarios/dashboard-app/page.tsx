"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Menu = "workspaces" | "notifications" | "user" | null;

const TABS = ["Overview", "Reports", "Alerts", "Settings"] as const;
type Tab = (typeof TABS)[number];

const WORKSPACES = [
  { name: "Orbit Analytics", initials: "OA", tone: "bg-stone-800 text-white" },
  { name: "Nimbus Labs", initials: "NL", tone: "bg-indigo-600 text-white" },
  { name: "Peachwood Studio", initials: "PS", tone: "bg-stone-200 text-stone-700" },
] as const;

const NOTIFICATIONS = [
  {
    title: "New alert",
    message: "Live views spiked 3x on the pricing page",
    time: "4m",
    unread: true,
    dot: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Deploy succeeded",
    message: "orbit-web v1.4.2 is live in production",
    time: "32m",
    unread: true,
    dot: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Teammate replied",
    message: "Mara replied to “Q3 cohort funnel”",
    time: "1h",
    unread: false,
    dot: "bg-violet-100 text-violet-600",
  },
  {
    title: "CI build passed",
    message: "launch-app #412 — all checks green",
    time: "3h",
    unread: false,
    dot: "bg-stone-100 text-stone-500",
  },
  {
    title: "Invoice due",
    message: "Orbit Pro invoice #2991 in 5 days",
    time: "5h",
    unread: false,
    dot: "bg-amber-100 text-amber-600",
  },
];

const STATS = [
  { label: "Revenue", value: "$128.4k", delta: "+12.1%", up: true },
  { label: "Sessions", value: "84,103", delta: "+4.7%", up: true },
  { label: "Conversion", value: "3.42%", delta: "-0.2%", up: false },
  { label: "Churn", value: "1.02%", delta: "-0.1%", up: false },
];

const CHART = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 78 },
  { month: "Mar", value: 38 },
  { month: "Apr", value: 74 },
  { month: "May", value: 66 },
  { month: "Jun", value: 88 },
  { month: "Jul", value: 52 },
  { month: "Aug", value: 95 },
  { month: "Sep", value: 71 },
  { month: "Oct", value: 44 },
  { month: "Nov", value: 61 },
  { month: "Dec", value: 112 },
];

const ACTIVITY = [
  { name: "MK", title: "Mara Kessler commented on “Q3 retention report”", time: "4m ago", tone: "bg-indigo-100 text-indigo-700" },
  { name: "DP", title: "Deploy finished — orbit-web 1.4.2 shipped", time: "32m ago", tone: "bg-emerald-100 text-emerald-700" },
  { name: "JW", title: "Jordan Wei approved invoice #2991", time: "1h ago", tone: "bg-violet-100 text-violet-700" },
  { name: "NP", title: "Nova Park joined the Analytics workspace", time: "3h ago", tone: "bg-amber-100 text-amber-700" },
  { name: "SY", title: "System: daily backup completed successfully", time: "5h ago", tone: "bg-stone-200 text-stone-600" },
];

const codeMarkup = `<header role="banner">
  <a class="brand" href="/">
    <img src="/orbit.svg" alt="Orbit" />
  </a>

  <nav aria-label="Primary">
    <a href="/reports" aria-current="page">Reports</a>
    <a href="/settings">Settings</a>
  </nav>

  <span class="workspace" aria-haspopup="menu">Acme · Manage</span>
</header>`;

function TrendChip({ delta, up }: { delta: string; up: boolean }) {
  const arrow = up ? (
    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="currentColor" aria-hidden="true">
      <path d="M6 2l4 4H7v4H5V6H2z" />
    </svg>
  ) : (
    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="currentColor" aria-hidden="true">
      <path d="M6 10L2 6h3V2h2v4h3z" />
    </svg>
  );
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
        up ? "bg-indigo-50 text-indigo-600" : "bg-rose-50 text-rose-600"
      }`}
    >
      {arrow}
      {delta}
    </span>
  );
}

function MenuPanel({
  open,
  className,
  children,
}: {
  open: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      const t = window.setTimeout(() => setMounted(false), 180);
      return () => window.clearTimeout(t);
    }
    setMounted(true);
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      role="menu"
      className={`absolute origin-top rounded-xl border border-stone-200/60 bg-white p-2 shadow-xl transition-all duration-200 ease-out ${
        visible ? "translate-y-0 scale-100 opacity-100" : "-translate-y-2 scale-95 opacity-0"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function MenuRow({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${className}`}
    >
      {children}
    </button>
  );
}

export default function DashboardScenario() {
  const [menu, setMenu] = useState<Menu>(null);
  const [active, setActive] = useState<Tab>("Reports");
  const [workspace, setWorkspace] = useState("Orbit Analytics");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [bar, setBar] = useState({ left: 0, width: 0 });

  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const openMenu = (m: Menu) => {
    setMenu(m);
    setSearchOpen(false);
  };

  useEffect(() => {
    const measure = () => {
      const idx = TABS.indexOf(active);
      const el = tabRefs.current[idx];
      if (!el) return;
      setBar({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    const t = window.setTimeout(measure, 300);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest?.("[data-menu]")) return;
      setMenu(null);
      setSearchOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setSearchOpen(false);
        searchRef.current?.blur();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-stone-200/60 bg-white/90 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-full max-w-6xl items-center gap-1.5 px-4 sm:px-6">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-2 rounded-lg px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
            aria-label="Orbit home"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
                <ellipse cx="12" cy="12" rx="10" ry="4.5" />
              </svg>
            </span>
            <span className="hidden text-[15px] font-semibold tracking-tight text-stone-900 sm:inline">
              Orbit
            </span>
          </a>

          <span className="mx-1 hidden h-6 w-px bg-stone-200 sm:block" aria-hidden="true" />

          <div data-menu="workspaces" className="relative">
            <button
              type="button"
              onClick={() => openMenu(menu === "workspaces" ? null : "workspaces")}
              aria-haspopup="menu"
              aria-expanded={menu === "workspaces"}
              className="group flex h-9 items-center gap-1.5 rounded-full px-2.5 text-left transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
            >
              <span className="grid h-5 w-5 place-items-center rounded-md bg-stone-800 text-[9px] font-semibold text-white">
                {WORKSPACES.find((w) => w.name === workspace)?.initials}
              </span>
              <span className="hidden max-w-[9rem] truncate text-[13px] font-medium text-stone-700 md:inline">
                {workspace}
              </span>
              <svg
                viewBox="0 0 12 12"
                className={`h-3 w-3 text-stone-400 transition-transform duration-200 ${menu === "workspaces" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M2.5 4.5L6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <MenuPanel open={menu === "workspaces"} className="left-0 top-full mt-2 w-60">
              <p className="px-3 pb-1 pt-1 text-[11px] font-medium uppercase tracking-wide text-stone-400">
                Workspaces
              </p>
              {WORKSPACES.map((w) => {
                const selected = w.name === workspace;
                return (
                  <MenuRow
                    key={w.name}
                    onClick={() => {
                      setWorkspace(w.name);
                      openMenu(null);
                    }}
                    className={selected ? "bg-indigo-50/60 text-indigo-700" : ""}
                  >
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md text-[10px] font-semibold ${w.tone}`}>
                      {w.initials}
                    </span>
                    <span className="flex-1 truncate">{w.name}</span>
                    {selected && (
                      <svg viewBox="0 0 16 16" className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </MenuRow>
                );
              })}
              <div className="my-1.5 h-px bg-stone-100" aria-hidden="true" />
              <MenuRow onClick={() => openMenu(null)}>
                <svg viewBox="0 0 16 16" className="h-4 w-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M8 3.5v9M3.5 8h9" strokeLinecap="round" />
                </svg>
                <span className="text-stone-700">New workspace</span>
              </MenuRow>
            </MenuPanel>
          </div>

          <nav aria-label="Primary" className="relative ml-2 hidden items-end self-stretch md:flex">
            {TABS.map((tab, i) => (
              <a
                key={tab}
                href="#"
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(tab);
                }}
                aria-current={active === tab ? "page" : undefined}
                className={`flex h-14 w-[88px] items-center justify-center whitespace-nowrap text-[13px] font-medium transition-all duration-200 aria-[current=page]:text-indigo-600 sm:w-[96px] ${
                  active === tab
                    ? "text-indigo-600"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {tab}
              </a>
            ))}
            <span
              aria-hidden="true"
              className="absolute bottom-[3px] left-0 h-[3px] rounded-full bg-indigo-600 transition-all duration-300 ease-out"
              style={{ left: bar.left, width: bar.width }}
            />
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <form
              data-menu="search"
              className={`flex h-9 items-center overflow-hidden rounded-full transition-all duration-300 ease-out ${
                searchOpen
                  ? "w-40 bg-white ring-1 ring-stone-200 sm:w-56"
                  : "w-9 bg-stone-100/80 hover:bg-stone-200/70"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  if (searchOpen) {
                    setSearchOpen(false);
                    setQuery("");
                  } else {
                    setMenu(null);
                    setSearchOpen(true);
                    requestAnimationFrame(() => searchRef.current?.focus());
                  }
                }}
                aria-label={searchOpen ? "Collapse search" : "Open search"}
                className="grid h-9 w-9 shrink-0 place-items-center text-stone-500 transition-colors hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
              >
                {searchOpen ? (
                  <svg viewBox="0 0 16 16" className="h-4 w-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M3 3l11 11M14 3L3 14" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="9" cy="9" r="5.5" />
                    <path d="M13.5 13.5L17 17" strokeLinecap="round" />
                  </svg>
                )}
              </button>
              {searchOpen && (
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  placeholder="Search reports, teams, alerts…"
                  aria-label="Search Orbit"
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={(e) => {
                    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                    setSearchOpen(false);
                  }}
                  className="h-full w-full bg-transparent pr-4 text-[13px] text-stone-900 placeholder:text-stone-400 focus:outline-none"
                />
              )}
            </form>

            <div data-menu="notifications" className="relative">
              <button
                type="button"
                onClick={() => openMenu(menu === "notifications" ? null : "notifications")}
                aria-haspopup="menu"
                aria-expanded={menu === "notifications"}
                aria-label="Notifications"
                className="relative grid h-9 w-9 place-items-center rounded-full text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
              >
                <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <path d="M16 13.5V8.75A6 6 0 004 8.75v4.75l-1 1.5h14z" strokeLinejoin="round" />
                  <path d="M8 17a2.2 2.2 0 004 0" />
                </svg>
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold leading-none text-white ring-1 ring-white">
                  2
                </span>
              </button>

              <MenuPanel open={menu === "notifications"} className="right-0 top-full mt-2 w-[min(22rem,calc(100vw-2rem))]">
                <div className="flex items-center justify-between px-3 pb-2 pt-1.5">
                  <p className="text-[13px] font-semibold text-stone-900">Notifications</p>
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10.5px] font-medium text-indigo-600">
                    2 unread
                  </span>
                </div>
                <div className="divide-y divide-stone-100">
                  {NOTIFICATIONS.map((n, i) => (
                    <button
                      key={n.title}
                      type="button"
                      onClick={() => openMenu(null)}
                      className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition-all duration-200 ease-out hover:bg-stone-50 ${
                        menu === "notifications"
                          ? "translate-y-0 opacity-100"
                          : "translate-y-1 opacity-0"
                      }`}
                      style={{ transitionDelay: menu === "notifications" ? `${i * 30}ms` : "0ms" }}
                    >
                      <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${n.dot}`}>
                        {n.title[0]}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="text-[13px] font-medium text-stone-800">{n.title}</span>
                          {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" aria-hidden="true" />}
                        </span>
                        <span className="block truncate text-[12px] text-stone-500">{n.message}</span>
                      </span>
                      <span className="shrink-0 text-[11px] tabular-nums text-stone-400">{n.time}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => openMenu(null)}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-center text-[12.5px] font-medium text-indigo-600 transition-colors hover:bg-indigo-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                >
                  Mark all as read
                </button>
              </MenuPanel>
            </div>

            <div data-menu="user" className="relative">
              <button
                type="button"
                onClick={() => openMenu(menu === "user" ? null : "user")}
                aria-haspopup="menu"
                aria-expanded={menu === "user"}
                aria-label="Account menu"
                className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[11px] font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
              >
                DC
              </button>

              <MenuPanel open={menu === "user"} className="right-0 top-full mt-2 w-60">
                <div className="px-3 pb-2 pt-1.5">
                  <p className="text-[13.5px] font-semibold text-stone-900">Dana Okane</p>
                  <p className="truncate text-[12px] text-stone-400">dana@orbit.dev</p>
                </div>
                <div className="mb-1.5 mt-0.5 h-px bg-stone-100" aria-hidden="true" />
                <MenuRow onClick={() => openMenu(null)}>
                  <svg viewBox="0 0 16 16" className="h-4 w-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <circle cx="8" cy="5" r="2.4" />
                    <path d="M3 13.5c.6-2.4 2.6-3.5 5-3.5s4.4 1.1 5 3.5" strokeLinecap="round" />
                    <path d="M12 6.5l2-1.4-1-2.1-2 .9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Account settings
                </MenuRow>
                <MenuRow onClick={() => openMenu(null)}>
                  <svg viewBox="0 0 16 16" className="h-4 w-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <rect x="2.5" y="4.5" width="11" height="7" rx="1.5" />
                    <path d="M2.5 7h11" />
                  </svg>
                  Billing
                </MenuRow>
                <div className="mb-1.5 mt-1.5 h-px bg-stone-100" aria-hidden="true" />
                <MenuRow onClick={() => openMenu(null)} className="text-rose-600 hover:text-rose-600 hover:bg-rose-50">
                  <svg viewBox="0 0 16 16" className="h-4 w-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M6.5 3.5L13 7l-3 1.5M13 7L3.5 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Sign out
                </MenuRow>
              </MenuPanel>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
        <p className="mx-auto mb-12 max-w-3xl rounded-2xl border border-dashed border-stone-200 bg-white/70 px-5 py-3.5 text-center text-[12.5px] leading-relaxed text-stone-400">
          The dark bar above is the whole component. Hover it, click the workspace name, the bell and the
          avatar to open the menus, and try the round search button. The nav state is simulated: the link
          that wins is the one carrying{" "}
          <code className="font-mono text-[12.5px] text-indigo-700">aria-current={"\"page\""}</code> — the
          indigo underline slides to whatever you click.
        </p>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
              Good afternoon, Dana Okane
            </h1>
            <p className="mt-1 text-sm text-stone-400">{today}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="h-9 rounded-full px-4 text-sm text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40">
              Export
            </button>
            <button
              type="button"
              className="h-9 rounded-full bg-indigo-600 px-5 text-sm font-medium text-white transition-all hover:bg-indigo-500 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
            >
              New report
            </button>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(28,25,23,0.18)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <p className="text-[12.5px] font-medium text-stone-400">{s.label}</p>
              <div className="mt-2 flex items-baseline gap-2.5">
                <p className="text-[26px] font-semibold tracking-tight text-stone-900">{s.value}</p>
                <TrendChip delta={s.delta} up={s.up} />
              </div>
            </div>
          ))}
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(28,25,23,0.18)] lg:col-span-3">
            <div className="mb-6 flex items-baseline justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-stone-900">Sessions this month</h2>
                <p className="mt-0.5 text-[12.5px] text-stone-400">Weekly sessions across all workspace projects</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-600">
                +4.7%
              </span>
            </div>
            <div className="flex h-44 items-end gap-1.5 sm:h-52 sm:gap-2.5" aria-hidden="true">
              {CHART.map(({ month, value }) => (
                <div key={month} className="group flex flex-1 flex-col gap-2" title={`${value}k sessions in ${month}`}>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-indigo-500/85 to-indigo-400/85 transition-colors duration-200 group-hover:to-indigo-500"
                    style={{ height: `${Math.round((value / 112) * 100)}%` }}
                  />
                  <span className="hidden text-center text-[10px] text-stone-400 sm:block">{month.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(28,25,23,0.18)] lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-[15px] font-semibold text-stone-900">Recent activity</h2>
              <p className="mt-0.5 text-[12.5px] text-stone-400">What changed in your workspace</p>
            </div>
            <ol className="divide-y divide-stone-100">
              {ACTIVITY.map((a) => (
                <li key={a.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${a.tone}`}>
                    {a.name}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-[13px] text-stone-600">{a.title}</p>
                  <span className="shrink-0 text-[11px] tabular-nums text-stone-400">{a.time}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="text-[15px] font-semibold text-stone-900">How it is labeled</h2>
            <span className="text-[12px] text-stone-400">the markup behind the top bar</span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-stone-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(28,25,23,0.18)]">
            <div className="flex items-center gap-1.5 border-b border-stone-200/70 bg-stone-50 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-300" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" aria-hidden="true" />
              <span className="ml-2 font-mono text-[11px] text-stone-400">header-navbar · app.tsx</span>
            </div>
            <pre className="overflow-x-auto bg-stone-900 px-5 py-4 font-mono text-[12.5px] leading-6 text-stone-200">
              <code>{codeMarkup}</code>
            </pre>
          </div>
          <ul className="mt-4 space-y-2 text-[13px] leading-relaxed text-stone-500">
            <li>
              <code className="font-mono text-[12.5px] text-indigo-700 bg-indigo-50 border border-indigo-200/60 rounded-md px-1.5 py-0.5">banner</code>{" "}
              is the topmost landmark — one per page — holding the brand and the workspace controls.
            </li>
            <li>
              <code className="font-mono text-[12.5px] text-indigo-700 bg-indigo-50 border border-indigo-200/60 rounded-md px-1.5 py-0.5">nav</code>{" "}
              labels only the page’s destinations; the search and the menus live outside it, in the banner.
            </li>
            <li>
              <code className="font-mono text-[12.5px] text-indigo-700 bg-indigo-50 border border-indigo-200/60 rounded-md px-1.5 py-0.5">aria-current="page"</code>{" "}
              flags the single active link; the sliding indigo bar is styled from that measurement, then animates to it.
            </li>
          </ul>
        </section>

        <nav
          aria-label="Scenario navigation"
          className="mt-14 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 text-sm text-stone-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-px hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
          >
            <span aria-hidden="true">←</span> Learning hub
          </Link>
          <Link
            href="/scenarios/editorial-magazine"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 text-sm text-stone-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-px hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
          >
            Next: editorial-magazine <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}