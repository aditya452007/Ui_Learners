"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

export type BarAppearance = "light" | "dark";

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function formatMacClock(d: Date) {
  const date = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = d
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    .toUpperCase();
  return `${date}  ${time}`;
}

export function MacClock({ className = "" }: { className?: string }) {
  const mounted = useMounted();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className={`tabular-nums ${className}`}>
      {now ? formatMacClock(now) : "Fri Aug 22  9:41 AM"}
    </span>
  );
}

const barStyle: Record<BarAppearance, { bar: string; hl: CSSProperties }> = {
  light: {
    bar: "bg-white/55 text-zinc-800 border-b border-black/[0.07]",
    hl: { "--hl-hover": "rgba(0,0,0,0.06)", "--hl-open": "rgba(0,0,0,0.11)" } as CSSProperties,
  },
  dark: {
    bar: "bg-black/45 text-white border-b border-white/10",
    hl: { "--hl-hover": "rgba(255,255,255,0.16)", "--hl-open": "rgba(255,255,255,0.32)" } as CSSProperties,
  },
};

export function Desktop({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-100 via-slate-50 to-indigo-100 shadow-xl shadow-slate-300/40 ${className}`}
    >
      {children}
    </div>
  );
}

export function MenuBar({
  appearance = "light",
  onAppearanceChange,
  right,
  appName = "Finder",
}: {
  appearance?: BarAppearance;
  onAppearanceChange?: (a: BarAppearance) => void;
  right: ReactNode;
  appName?: string;
}) {
  const s = barStyle[appearance];
  return (
    <div
      className={`group/bar flex h-7 items-center gap-1 px-2.5 text-[13px] leading-none backdrop-blur-xl select-none ${s.bar}`}
      style={s.hl}
      data-bar={appearance}
    >
      <AppleMark className="mx-1.5 h-[15px] w-[15px] shrink-0" />
      <span className="hidden font-semibold sm:inline">{appName}</span>
      <span className="ml-2 hidden items-center gap-4 opacity-80 md:flex">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Window</span>
        <span>Help</span>
      </span>
      <div className="ml-auto flex items-center gap-0.5">
        {right}
        <MacClock className="px-1.5" />
        {onAppearanceChange && (
          <button
            type="button"
            aria-label={appearance === "light" ? "Switch menu bar to dark appearance" : "Switch menu bar to light appearance"}
            title="Toggle menu bar appearance — watch template icons recolor"
            onClick={() => onAppearanceChange(appearance === "light" ? "dark" : "light")}
            className="grid size-6 place-items-center rounded-md transition-colors duration-100 hover:bg-(--hl-hover)"
          >
            {appearance === "light" ? (
              <MoonIcon className="h-[14px] w-[14px]" />
            ) : (
              <SunIcon className="h-[14px] w-[14px]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function StatusItem({
  id,
  openId,
  onOpenChange,
  children,
  surface,
  label,
}: {
  id: string;
  openId: string | null;
  onOpenChange: (id: string | null) => void;
  children: ReactNode;
  surface?: ReactNode;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const open = openId === id;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOpenChange(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup={surface ? "menu" : undefined}
        aria-expanded={surface ? open : undefined}
        aria-label={label}
        data-open={open || undefined}
        onClick={() => onOpenChange(open ? null : id)}
        className="flex h-6 cursor-default items-center gap-1.5 rounded-md px-2 transition-colors duration-75 hover:bg-(--hl-hover) data-[open]:bg-(--hl-open)"
      >
        {children}
      </button>
      {open && surface && (
        <div className="absolute right-0 top-[calc(100%+9px)] z-50">{surface}</div>
      )}
    </div>
  );
}

export function StatusMenu({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="menu"
      className={`group/menu min-w-[220px] rounded-lg border border-black/[0.08] bg-white/90 p-1 text-slate-800 shadow-2xl shadow-black/25 backdrop-blur-2xl ${className}`}
    >
      {children}
    </div>
  );
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-2.5 pt-1.5 pb-1 text-[10.5px] font-semibold tracking-wide text-slate-400 uppercase">
      {children}
    </div>
  );
}

export function MenuSeparator() {
  return <div className="mx-2 my-1 h-px bg-black/[0.08]" />;
}

export function MenuItem({
  children,
  shortcut,
  checked = false,
  disabled = false,
  danger = false,
  chevron = false,
  onClick,
}: {
  children: ReactNode;
  shortcut?: string;
  checked?: boolean;
  disabled?: boolean;
  danger?: boolean;
  chevron?: boolean;
  onClick?: () => void;
}) {
  const tone = disabled
    ? "text-slate-400"
    : danger
      ? "text-red-600 hover:bg-red-500 hover:text-white"
      : "hover:bg-[#007AFF] hover:text-white";
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full cursor-default items-center gap-1 rounded-[6px] px-2 py-[5px] text-left text-[13px] leading-5 whitespace-nowrap transition-colors duration-75 ${tone}`}
    >
      <span className="w-3.5 shrink-0">
        {checked && <CheckIcon className="h-3 w-3" />}
      </span>
      <span className={`flex-1 truncate ${disabled ? "" : ""}`}>{children}</span>
      {shortcut && (
        <span className={`pl-4 text-[12px] tabular-nums ${disabled ? "opacity-60" : "opacity-55 group-hover/menu:opacity-90"}`}>
          {shortcut}
        </span>
      )}
      {chevron && <ChevronRightIcon className="h-3 w-3 shrink-0 opacity-60" />}
    </button>
  );
}

export type ScenarioKey = "hub" | "wifi" | "timer" | "vpn";

const SCENARIOS: { key: ScenarioKey; href: string; label: string }[] = [
  { key: "hub", href: "/", label: "Overview" },
  { key: "wifi", href: "/scenarios/wifi-system-menu", label: "Wi-Fi system menu" },
  { key: "timer", href: "/scenarios/focus-timer-popover", label: "Focus-timer popover" },
  { key: "vpn", href: "/scenarios/vpn-live-item", label: "VPN live item" },
];

export function ScenarioNav({ current }: { current: ScenarioKey }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5">
      {SCENARIOS.map((s) => (
        <Link
          key={s.key}
          href={s.href}
          aria-current={current === s.key ? "page" : undefined}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150 ${
            current === s.key
              ? "border-transparent bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
          }`}
        >
          {s.label}
        </Link>
      ))}
    </nav>
  );
}

type IconProps = { className?: string };

export function AppleMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.05 12.54c-.03-2.89 2.36-4.27 2.47-4.34-1.35-1.97-3.44-2.24-4.18-2.27-1.78-.18-3.47 1.05-4.37 1.05-.9 0-2.29-1.02-3.77-1-1.94.03-3.72 1.13-4.72 2.86-2.01 3.49-.51 8.66 1.45 11.49.96 1.39 2.1 2.94 3.6 2.88 1.45-.06 2-.93 3.75-.93s2.25.93 3.78.9c1.56-.03 2.55-1.41 3.5-2.81 1.1-1.61 1.56-3.17 1.58-3.25-.04-.02-3.06-1.17-3.09-4.58z" />
      <path d="M14.84 4.06c.8-.97 1.34-2.32 1.19-3.66-1.15.05-2.55.77-3.38 1.74-.74.86-1.39 2.23-1.22 3.55 1.29.1 2.61-.65 3.41-1.63z" />
    </svg>
  );
}

export function WifiIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M1.9 8.9a16 16 0 0 1 20.2 0" />
      <path d="M5.2 12.6a11 11 0 0 1 13.6 0" />
      <path d="M8.5 16.2a6 6 0 0 1 7 0" />
      <circle cx="12" cy="19.6" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 1.9" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 21.5s7.8-3.6 7.8-9.4V5.2L12 2.3 4.2 5.2v6.9c0 5.8 7.8 9.4 7.8 9.4z" />
    </svg>
  );
}

export function BatteryIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 28 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className} aria-hidden="true">
      <rect x="1.5" y="2.5" width="21" height="11" rx="3.2" />
      <path d="M25.2 6v4" opacity="0.5" />
    </svg>
  );
}

export function BluetoothIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6.5 7l11 10L12 22V2l5.5 5-11 10" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="7" />
      <path d="M15.8 15.8 21 21" />
    </svg>
  );
}

export function ControlCenterIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M3 7.5h18M3 16.5h18" />
      <circle cx="9" cy="7.5" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="16.5" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a7 7 0 0 0 9.7 9.7z" />
    </svg>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M18.7 5.3l-1.5 1.5M6.8 17.2l-1.5 1.5" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4.5 12.8 9.5 18 19.5 6.5" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
    </svg>
  );
}
