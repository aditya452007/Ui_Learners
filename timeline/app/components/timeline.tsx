import type { ReactNode } from "react";

/**
 * Hand-rolled Timeline primitives. Names mirror Chakra / MUI / Ant Design
 * vocabulary on purpose: <TimelineDot />, <TimelineConnector />,
 * <TimelineOppositeContent>, and the `loading` in-progress flag.
 */

export function TimelineDot({
  loading = false,
  children,
  label,
  tone = "done",
}: {
  loading?: boolean;
  children?: ReactNode;
  label: string;
  tone?: "done" | "muted";
}) {
  if (loading) {
    return (
      <span className="relative grid size-5 shrink-0 place-items-center" data-part="dot" aria-label={label}>
        <span className="tl-ping-ring absolute inset-0 rounded-full bg-teal-500/50" aria-hidden="true" />
        <span className="relative grid size-5 place-items-center rounded-full border-2 border-teal-600 bg-white">
          <span className="size-1.5 animate-pulse rounded-full bg-teal-600" />
        </span>
      </span>
    );
  }
  return (
    <span
      data-part="dot"
      aria-label={label}
      className={`grid size-5 shrink-0 place-items-center rounded-full text-[9px] font-bold text-white ${
        tone === "done" ? "bg-teal-700" : "bg-slate-300"
      }`}
    >
      {children}
    </span>
  );
}

export function TimelineConnector({ hidden = false, filled = true }: { hidden?: boolean; filled?: boolean }) {
  if (hidden) return null;
  return (
    <span
      data-part="connector"
      aria-hidden="true"
      className={`absolute left-1/2 top-5 h-[calc(100%-1.25rem+14px)] w-0.5 -translate-x-1/2 rounded-full ${
        filled ? "bg-teal-600/60" : "bg-slate-200"
      }`}
    />
  );
}

export function TimelineOppositeContent({
  datetime,
  children,
}: {
  datetime: string;
  children: ReactNode;
}) {
  return (
    <time
      dateTime={datetime}
      data-part="time"
      className="block text-right font-mono text-[11px] leading-snug text-slate-500"
    >
      {children}
    </time>
  );
}
