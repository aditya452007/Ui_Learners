"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  HamburgerButton,
  NavDrawerShell,
  DrawerHeader,
} from "@/components/hamburger";

const NAV = [
  {
    label: "Workspace",
    items: [
      { name: "Overview", icon: "◈", active: true },
      { name: "Projects", icon: "⬢", badge: "12" },
      { name: "Tasks", icon: "☰", badge: "5" },
      { name: "Calendar", icon: "▭" },
    ],
  },
  {
    label: "Data",
    items: [
      { name: "Analytics", icon: "◐" },
      { name: "Reports", icon: "≡" },
      { name: "Team", icon: "◎", badge: "3" },
    ],
  },
];

export default function DashboardPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const drawerId = "dashboard-drawer";
  const [active, setActive] = useState("Overview");
  const [toast, setToast] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1400);
  }

  const NavList = ({ collapsed }: { collapsed?: boolean }) => (
    <div className="space-y-6">
      {NAV.map((group) => (
        <div key={group.label}>
          {!collapsed && (
            <p className="mb-2 px-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">
              {group.label}
            </p>
          )}
          <ul className="space-y-1">
            {group.items.map((it) => (
              <li key={it.name}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActive(it.name);
                    showToast(`→ ${it.name}`);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 ${
                    active === it.name
                      ? "bg-foreground text-background"
                      : "text-text-muted hover:bg-surface-muted hover:text-foreground"
                  }`}
                  title={collapsed ? it.name : undefined}
                >
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-lg text-xs ${
                      active === it.name
                        ? "bg-white/15 text-white"
                        : "bg-surface-alt ring-1 ring-border"
                    }`}
                  >
                    {it.icon}
                  </span>
                  {!collapsed && <span className="flex-1">{it.name}</span>}
                  {!collapsed && it.badge && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                        active === it.name
                          ? "bg-white text-foreground"
                          : "bg-accent text-white"
                      }`}
                    >
                      {it.badge}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Scenario nav */}
      <div className="border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-foreground"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full border border-border bg-surface text-xs">
              ←
            </span>
            Anatomy hub
          </Link>
          <div className="hidden items-center gap-1 rounded-full border border-border bg-surface p-1 sm:flex">
            <Link
              href="/scenarios/storefront"
              className="rounded-full px-3 py-1 text-xs font-medium text-text-muted hover:text-foreground"
            >
              Storefront
            </Link>
            <Link
              href="/scenarios/dashboard"
              className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background"
            >
              Dashboard
            </Link>
            <Link
              href="/scenarios/reader"
              className="rounded-full px-3 py-1 text-xs font-medium text-text-muted hover:text-foreground"
            >
              Reader
            </Link>
          </div>
          <span className="hidden font-mono text-xs text-text-faint sm:inline">
            Scenario 2 · adaptive shell
          </span>
        </div>
      </div>

      {/* Real dashboard shell */}
      <div className="mx-auto max-w-[1280px]">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b border-border bg-surface px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger only on < lg */}
            <div className="lg:hidden">
              <HamburgerButton
                open={mobileOpen}
                onToggle={() => setMobileOpen((v) => !v)}
                controlsId={drawerId}
                buttonRef={btnRef}
              />
            </div>
            {/* Collapse toggle for desktop */}
            <button
              type="button"
              onClick={() => setDesktopCollapsed((v) => !v)}
              className="hidden h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-text-muted hover:text-foreground lg:grid"
              aria-label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                <path
                  d="M5 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={desktopCollapsed ? "" : "rotate-180"}
                />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-foreground text-xs font-bold text-background">
                ◆
              </span>
              <span className="hidden text-sm font-semibold sm:inline">
                Orien
              </span>
              <span className="hidden rounded-full bg-surface-alt px-2 py-1 font-mono text-[10px] text-text-faint sm:inline">
                Workspace
              </span>
            </div>

            <div className="ml-4 hidden items-center gap-1 rounded-full border border-border bg-surface-muted p-1 lg:flex">
              <span className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium shadow-sm">
                {active}
              </span>
              <span className="px-2 text-xs text-text-faint">·</span>
              <span className="px-2 text-xs text-text-muted">Q4 Planning</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1.5 text-xs text-text-faint lg:flex">
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                <circle cx="7" cy="7" r="4.3" stroke="currentColor" strokeWidth="1.2" />
                <path d="M10.2 10.2L12.8 12.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Search…
              <span className="ml-2 rounded bg-surface px-1 py-0.5 font-mono text-[10px]">⌘K</span>
            </div>
            <span className="hidden h-8 w-8 place-items-center rounded-full bg-accent text-xs font-bold text-white lg:grid">
              A
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-stone-200 text-xs font-semibold text-stone-600 lg:hidden">
              A
            </span>
          </div>
        </div>

        <div className="flex">
          {/* Persistent sidebar — desktop only */}
          <aside
            className={`hidden shrink-0 flex-col border-r border-border bg-surface lg:flex ${desktopCollapsed ? "w-[72px]" : "w-[260px]"}`}
            aria-label="Sidebar navigation"
          >
            <div className="flex-1 overflow-auto px-3 py-4">
              <NavList collapsed={desktopCollapsed} />
              {!desktopCollapsed && (
                <div className="mt-6 rounded-xl border border-border bg-surface-muted p-4">
                  <p className="text-xs font-semibold">Upgrade to Pro</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted">
                    Unlock analytics and team seats for this workspace.
                  </p>
                  <button
                    type="button"
                    onClick={() => showToast("Billing — demo")}
                    className="mt-3 w-full rounded-full bg-accent px-3 py-2 text-xs font-semibold text-white hover:bg-accent-strong"
                  >
                    View plans
                  </button>
                </div>
              )}
            </div>
            <div className="border-t border-border p-3">
              <div
                className={`flex items-center gap-3 rounded-xl bg-surface-muted px-2.5 py-2 ring-1 ring-border ${desktopCollapsed ? "justify-center" : ""}`}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-xs font-bold text-background">
                  A
                </span>
                {!desktopCollapsed && (
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">Alex Rivera</p>
                    <p className="truncate font-mono text-[10px] text-text-muted">
                      alex@orien.co
                    </p>
                  </div>
                )}
              </div>
              <p className="mt-2 hidden text-center font-mono text-[10px] text-text-faint lg:block">
                {desktopCollapsed ? "Collapsed" : "Persistent · no scrim"}
              </p>
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 flex-1 bg-surface-muted">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    {active} — Q4 overview
                  </h1>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-text-muted">
                    This scenario shows the hamburger&apos;s responsive twin:
                    on phones it opens an overlay drawer with a scrim; on
                    desktop the same navigation lives permanently beside the
                    content. Resize the window to feel the switch.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs ${
                      mobileOpen
                        ? "border-accent bg-accent-light text-accent"
                        : "border-border bg-surface text-text-muted"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${mobileOpen ? "bg-accent animate-pulse" : "bg-text-faint"}`}
                    />
                    mobile: {mobileOpen ? "drawer open · scroll locked" : "drawer closed"}
                  </span>
                  <span className="hidden rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text-muted lg:inline-flex">
                    desktop: {desktopCollapsed ? "collapsed · 72px" : "expanded · 260px"}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Active projects", value: "12", change: "+3 this week" },
                  { label: "Open tasks", value: "47", change: "5 overdue" },
                  { label: "Team online", value: "8/12", change: "2 away" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-border bg-surface p-5 shadow-sm"
                  >
                    <p className="font-mono text-xs uppercase tracking-widest text-text-faint">
                      {s.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-text-muted">{s.change}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-border bg-surface p-5 shadow-sm lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Recent projects</h3>
                    <button
                      type="button"
                      onClick={() => showToast("All projects")}
                      className="text-xs font-medium text-accent hover:text-accent-strong"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      { name: "Brand refresh 2026", status: "In review", prog: 78 },
                      { name: "Pricing — Q4", status: "Active", prog: 42 },
                      { name: "Help centre revamp", status: "Draft", prog: 18 },
                    ].map((p) => (
                      <div
                        key={p.name}
                        className="flex items-center gap-4 rounded-xl border border-border bg-surface-muted px-4 py-3"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface text-xs ring-1 ring-border">
                          ◈
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {p.name}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                              <span
                                className="block h-full bg-foreground"
                                style={{ width: `${p.prog}%` }}
                              />
                            </span>
                            <span className="font-mono text-xs text-text-faint">
                              {p.prog}%
                            </span>
                          </div>
                        </div>
                        <span className="hidden rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-muted sm:inline">
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                    <h3 className="text-sm font-semibold">How this variant differs</h3>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-muted">
                      <li className="flex gap-2">
                        <span className="text-accent">·</span>
                        <span>
                          <strong className="font-medium text-foreground">
                            Overlay on mobile
                          </strong>{" "}
                          — scrim, Escape + tap to close, body-lock and focus
                          return exactly like the anatomy.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent">·</span>
                        <span>
                          <strong className="font-medium text-foreground">
                            Persistent on desktop
                          </strong>{" "}
                          — same{" "}
                          <code className="rounded bg-surface-alt px-1 font-mono text-xs">
                            &lt;nav&gt;
                          </code>{" "}
                          but no scrim, always visible, collapsible to icons.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent">·</span>
                        <span>
                          Try resizing: drag the window past 1024px and watch ☰
                          disappear as the sidebar locks in.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-accent/20 bg-accent-light p-4">
                    <p className="text-xs font-semibold text-accent">
                      Why a hamburger fits here
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-accent-strong">
                      Dashboards need persistent wayfinding on desktop but
                      full-width tables on phones. The hamburger lets the same
                      nav list live in two postures — overlay with scrim on
                      small screens, docked rail on large — so users never
                      relearn the hierarchy when they switch devices.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-dashed border-border bg-surface px-4 py-3 font-mono text-xs text-text-faint">
                Width threshold: 1024px (lg) · hamburger visible{" "}
                {isMobile ? "now (mobile)" : "hidden (desktop)"} · drawer id
                &quot;{drawerId}&quot; · aria-expanded=&quot;
                {String(mobileOpen)}&quot;
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <NavDrawerShell
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            controlsId={drawerId}
            buttonRef={btnRef}
            widthClass="w-[300px]"
            label="Dashboard navigation"
          >
            <DrawerHeader
              title="Orien"
              subtitle="Workspace navigation"
              onClose={() => setMobileOpen(false)}
            />
            <div className="flex-1 overflow-auto px-3 py-4">
              <NavList />
              <div className="mt-6 rounded-xl bg-surface-muted p-4 ring-1 ring-border">
                <p className="text-xs font-semibold">Quick capture</p>
                <button
                  type="button"
                  onClick={() => {
                    showToast("New task created");
                    setMobileOpen(false);
                  }}
                  className="mt-3 w-full rounded-full bg-foreground px-3 py-2 text-xs font-semibold text-background"
                >
                  + New project
                </button>
              </div>
            </div>
            <div className="border-t border-border bg-surface-muted px-3 py-3">
              <p className="text-center font-mono text-[10px] text-text-faint">
                Tap scrim or press Esc to close — focus returns to ☰
              </p>
            </div>
          </NavDrawerShell>
        </div>
      )}

      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
