import Link from "next/link";
import type { ReactNode } from "react";

/* ---------- primitives ---------- */

export function NumPill({ n, active }: { n: number; active?: boolean }) {
  return (
    <span
      className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold tabular-nums ring-2 ring-white transition ${
        active ? "bg-teal-700 text-white" : "bg-stone-900 text-white"
      }`}
    >
      {n}
    </span>
  );
}

export function Token({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-teal-800/10 bg-teal-50 px-1.5 py-0.5 font-mono text-[11px] font-medium text-teal-800">
      {children}
    </code>
  );
}

export function StatePill({ on, onLabel = "On", offLabel = "Off" }: { on: boolean; onLabel?: string; offLabel?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums transition ${
        on ? "bg-teal-700 text-white" : "bg-stone-200/70 text-stone-600"
      }`}
    >
      <span className={`size-1.5 rounded-full ${on ? "bg-white" : "bg-stone-400"}`} />
      {on ? onLabel : offLabel}
    </span>
  );
}

/* ---------- native controls, intentionally styled ---------- */

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  disabledNote,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  disabledNote?: string;
}) {
  return (
    <label
      className={`flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 transition ${
        disabled ? "opacity-70" : "hover:border-teal-700/40 hover:shadow-sm"
      }`}
    >
      <input
        type="checkbox"
        role="switch"
        aria-checked={checked}
        className="switch-input sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch-track" aria-hidden="true">
        <span className="switch-thumb" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        {description && <span className="mt-0.5 block text-[13px] leading-snug text-text-muted">{description}</span>}
        {disabled && disabledNote && (
          <span className="mt-0.5 block text-[13px] font-medium text-amber-700">{disabledNote}</span>
        )}
      </span>
      <StatePill on={checked} />
    </label>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled,
  disabledNote,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  disabledNote?: string;
}) {
  return (
    <label
      className={`flex items-start gap-3 rounded-xl border border-border bg-white px-4 py-3 transition ${
        disabled ? "opacity-70" : "hover:border-teal-700/40 hover:shadow-sm"
      }`}
    >
      <input
        type="checkbox"
        className="checkbox-input sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="checkbox-box mt-0.5" aria-hidden="true">
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="white" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
          <path className="checkmark-path" d="M3 8.5 6.5 12 13 4.5" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        {description && <span className="mt-0.5 block text-[13px] leading-snug text-text-muted">{description}</span>}
        {disabled && disabledNote && (
          <span className="mt-0.5 block text-[13px] font-medium text-amber-700">{disabledNote}</span>
        )}
      </span>
    </label>
  );
}

export function Radio({
  name,
  value,
  checked,
  onChange,
  label,
  description,
  badge,
  disabled,
  disabledNote,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (next: string) => void;
  label: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
  disabledNote?: string;
}) {
  return (
    <label
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition ${
        checked
          ? "border-teal-700 bg-teal-50/50 shadow-sm"
          : "border-border bg-white hover:border-teal-700/40 hover:shadow-sm"
      } ${disabled ? "opacity-70" : ""}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        className="radio-input sr-only"
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
      />
      <span className="radio-circle mt-0.5" aria-hidden="true">
        <span className="radio-dot" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{label}</span>
          {badge && (
            <span className="rounded-full bg-stone-900 px-2 py-0.5 text-[11px] font-semibold text-white">{badge}</span>
          )}
        </span>
        {description && <span className="mt-0.5 block text-[13px] leading-snug text-text-muted">{description}</span>}
        {disabled && disabledNote && (
          <span className="mt-0.5 block text-[13px] font-medium text-amber-700">{disabledNote}</span>
        )}
      </span>
    </label>
  );
}

/* ---------- chrome ---------- */

export function TopBar() {
  return (
    <div className="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid size-7 place-items-center rounded-lg bg-stone-900 text-white">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.6}>
                <rect x="1" y="2" width="10" height="5" rx="2.5" />
                <circle cx="8.5" cy="4.5" r="1.4" fill="currentColor" stroke="none" />
                <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
                <circle cx="10" cy="12" r="3" />
                <circle cx="10" cy="12" r="1" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight">NameThatUi</span>
            <span className="hidden text-sm text-text-faint sm:inline">· Learning Lab</span>
          </Link>
        </div>
        <nav className="flex items-center gap-2 text-xs font-medium">
          <Link
            href="/scenarios/notification-settings"
            className="hidden rounded-full border border-border bg-surface px-3 py-1.5 transition hover:border-accent hover:text-accent sm:inline-flex"
          >
            Settings
          </Link>
          <Link
            href="/scenarios/checkout-delivery"
            className="hidden rounded-full border border-border bg-surface px-3 py-1.5 transition hover:border-accent hover:text-accent sm:inline-flex"
          >
            Checkout
          </Link>
          <Link
            href="/scenarios/signup-preferences"
            className="rounded-full bg-stone-900 px-3 py-1.5 text-white transition hover:bg-teal-700"
          >
            Preferences →
          </Link>
        </nav>
      </div>
    </div>
  );
}

export function ScenarioNav({ prev, next }: { prev?: { href: string; label: string }; next?: { href: string; label: string } }) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
      <Link
        href="/"
        className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:border-accent hover:text-accent"
      >
        ← Learning hub
      </Link>
      <div className="flex flex-wrap gap-2 text-sm">
        {prev && (
          <Link
            href={prev.href}
            className="rounded-full border border-border bg-surface px-4 py-2 font-medium transition hover:border-accent hover:text-accent"
          >
            ← {prev.label}
          </Link>
        )}
        {next && (
          <Link
            href={next.href}
            className="rounded-full bg-stone-900 px-4 py-2 font-medium text-white transition hover:bg-teal-700"
          >
            {next.label} →
          </Link>
        )}
      </div>
    </div>
  );
}
