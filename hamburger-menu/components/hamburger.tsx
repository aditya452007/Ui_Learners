"use client";

import { useEffect, useRef, useCallback } from "react";

export function HamburgerButton({
  open,
  onToggle,
  controlsId,
  label = "Open navigation menu",
  className = "",
  buttonRef,
}: {
  open: boolean;
  onToggle: () => void;
  controlsId: string;
  label?: string;
  className?: string;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      type="button"
      aria-expanded={open}
      aria-controls={controlsId}
      aria-label={open ? "Close navigation menu" : label}
      onClick={onToggle}
      className={`relative grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-foreground shadow-sm transition-colors hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${className}`}
    >
      <span className="relative block h-3.5 w-[18px]">
        {/* 3 lines — morph to X when open */}
        <span
          className="hamburger-line absolute left-0 top-0 block h-0.5 w-full rounded-full bg-current"
          style={
            open
              ? { transform: "translateY(6px) rotate(45deg)" }
              : { transform: "translateY(0) rotate(0)" }
          }
        />
        <span
          className="hamburger-line absolute left-0 top-[6px] block h-0.5 w-full rounded-full bg-current"
          style={
            open
              ? { opacity: 0, transform: "scaleX(0.2)" }
              : { opacity: 1, transform: "scaleX(1)" }
          }
        />
        <span
          className="hamburger-line absolute left-0 top-[12px] block h-0.5 w-full rounded-full bg-current"
          style={
            open
              ? { transform: "translateY(-6px) rotate(-45deg)" }
              : { transform: "translateY(0) rotate(0)" }
          }
        />
      </span>
    </button>
  );
}

// Generic drawer shell — handles scrim, Escape, scroll lock, focus return
export function NavDrawerShell({
  open,
  onClose,
  controlsId,
  buttonRef,
  children,
  widthClass = "w-[320px]",
  label = "Navigation",
}: {
  open: boolean;
  onClose: () => void;
  controlsId: string;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  children: React.ReactNode;
  widthClass?: string;
  label?: string;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Scroll lock + remember focus
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      // focus first focusable inside drawer after animation
      const t = window.setTimeout(() => {
        const el = drawerRef.current?.querySelector<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        el?.focus();
      }, 180);
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = prev;
      };
    } else {
      document.body.style.overflow = "";
      // return focus to trigger
      const btn = buttonRef.current;
      if (btn && previouslyFocused.current !== btn) {
        // small delay so animation doesn't jank focus
        window.requestAnimationFrame(() => btn.focus());
      }
    }
  }, [open, buttonRef]);

  // Escape + focus trap
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab" && open && drawerRef.current) {
        const focusable = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [open, onClose]
  );

  // Close on Escape at document level too (when focus outside drawer)
  useEffect(() => {
    if (!open) return;
    const onDocKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onDocKey);
    return () => document.removeEventListener("keydown", onDocKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-30 flex">
      {/* Scrim */}
      <div
        ref={scrimRef}
        aria-hidden="true"
        onClick={onClose}
        className="animate-scrim-in absolute inset-0 bg-stone-900/40 backdrop-blur-[1px]"
      />
      {/* Drawer */}
      <div
        ref={drawerRef}
        id={controlsId}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className={`animate-drawer-in relative flex h-full ${widthClass} max-w-[86vw] flex-col overflow-hidden border-r border-border bg-surface shadow-2xl`}
      >
        {children}
      </div>
    </div>
  );
}

export function DrawerHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold tracking-tight">{title}</p>
        {subtitle && (
          <p className="mt-0.5 truncate text-xs text-text-muted">{subtitle}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close navigation"
        className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface-alt text-text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
          <path
            d="M4 4l8 8M12 4l-8 8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
