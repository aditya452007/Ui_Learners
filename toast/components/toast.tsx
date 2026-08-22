"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ToastStatus = "info" | "success" | "error";

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastOptions = {
  title: string;
  description?: string;
  status?: ToastStatus;
  action?: ToastAction;
  /** ms until auto-dismiss. 0 = sticky, never auto-dismisses. Default 5000. */
  duration?: number;
};

export type ToastItem = ToastOptions & {
  id: number;
  exiting: boolean;
};

const MAX_STACK = 3;

/**
 * Owns the toast list. push() adds (oldest beyond 3 fall off),
 * dismiss() plays the exit animation, then removes.
 */
export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((ts) =>
      ts.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    window.setTimeout(() => {
      setToasts((ts) => ts.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const push = useCallback((opts: ToastOptions) => {
    const id = ++idRef.current;
    setToasts((ts) => [...ts, { ...opts, id, exiting: false }].slice(-MAX_STACK));
    return id;
  }, []);

  return { toasts, push, dismiss };
}

const STATUS_STYLES: Record<
  ToastStatus,
  { icon: React.ReactNode; iconBg: string }
> = {
  success: {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
        <path
          d="M3.5 8.5l3 3 6-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    iconBg: "bg-success",
  },
  info: {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
        <path
          d="M8 7v4.5M8 4.6v.2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    iconBg: "bg-accent",
  },
  error: {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
        <path
          d="M8 4.5v4.2M8 11.4v.2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    iconBg: "bg-danger",
  },
};

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * One toast card. role="status" makes screen readers announce it politely
 * without moving focus. The countdown pauses while hovered or keyboard-focused.
 */
export function ToastCard({
  toast,
  dismiss,
}: {
  toast: ToastItem;
  dismiss: (id: number) => void;
}) {
  const duration = toast.duration ?? 5000;
  const [paused, setPaused] = useState(false);
  const remainingRef = useRef(duration);

  useEffect(() => {
    if (duration === 0 || paused) return;
    const startedAt = Date.now();
    const timer = window.setTimeout(() => dismiss(toast.id), remainingRef.current);
    return () => {
      window.clearTimeout(timer);
      remainingRef.current = Math.max(
        0,
        remainingRef.current - (Date.now() - startedAt),
      );
    };
  }, [paused, duration, toast.id, dismiss]);

  const s = STATUS_STYLES[toast.status ?? "info"];

  return (
    <div
      role="status"
      aria-live="polite"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") dismiss(toast.id);
      }}
      className={`pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-xl border border-border bg-surface shadow-lg shadow-stone-900/10 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent/50 ${
        toast.exiting ? "translate-y-2 opacity-0" : "animate-toast-in"
      }`}
    >
      <div className="flex items-start gap-3 px-4 py-3.5 pr-10">
        <span
          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white ${s.iconBg}`}
        >
          {s.icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{toast.title}</p>
          {toast.description && (
            <p className="mt-0.5 text-[13px] leading-relaxed text-text-muted">
              {toast.description}
            </p>
          )}
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action?.onClick();
                dismiss(toast.id);
              }}
              className="mt-2 rounded-md px-2 py-1 text-xs font-semibold text-accent transition-colors hover:bg-accent-light focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => dismiss(toast.id)}
        className="absolute top-2.5 right-2.5 grid h-6 w-6 place-items-center rounded-md text-text-faint transition-colors hover:bg-surface-alt hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
      >
        <CloseIcon />
      </button>
      {duration > 0 && (
        <div
          aria-hidden="true"
          className="toast-timer-bar absolute bottom-0 left-0 h-0.75 w-full bg-border-strong"
          style={{
            animationDuration: `${duration}ms`,
            animationPlayState: paused ? "paused" : "running",
          }}
        />
      )}
    </div>
  );
}

/**
 * The viewport — one consistent corner where every toast stacks.
 * pointer-events-none on the wrapper so page clicks pass through the gaps.
 */
export function ToastViewport({
  toasts,
  dismiss,
  label = "Notifications",
}: {
  toasts: ToastItem[];
  dismiss: (id: number) => void;
  label?: string;
}) {
  return (
    <div
      role="region"
      aria-label={label}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-3 p-4 sm:items-end sm:p-6"
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} dismiss={dismiss} />
      ))}
    </div>
  );
}
