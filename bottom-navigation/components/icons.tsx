import type { ReactNode } from "react";

/* Hand-drawn 24px stroke icons (1.8px, round caps) — no icon library needed. */

function Base({
  children,
  filled,
}: {
  children: ReactNode;
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-6"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function HomeIcon({ active }: { active?: boolean }) {
  return (
    <Base filled={active}>
      {active ? (
        <path d="M12 3.5 3.8 10.2c-.4.3-.5.9-.2 1.3.3.4.9.5 1.3.2V20a1 1 0 0 0 1 1H10a1 1 0 0 0 1-1v-4.5a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1V20a1 1 0 0 0 1 1h4.1a1 1 0 0 0 1-1v-8.3c.4.3 1 .2 1.3-.2.3-.4.2-1-.2-1.3L12 3.5Z" />
      ) : (
        <>
          <path d="m4.5 10.5 7.5-6.5 7.5 6.5" />
          <path d="M6 9.5V19a1 1 0 0 0 1 1h3.5v-5h3v5H17a1 1 0 0 0 1-1V9.5" />
        </>
      )}
    </Base>
  );
}

export function SearchIcon() {
  return (
    <Base>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </Base>
  );
}

export function InboxIcon({ active }: { active?: boolean }) {
  return (
    <Base filled={active}>
      {active ? (
        <path d="M3.5 5.5h17a.5.5 0 0 1 .5.5v12a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V6a.5.5 0 0 1 .5-.5Zm1.7 2L12 12.7 18.8 7.5" />
      ) : (
        <>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
          <path d="m5 7.5 7 5.2 7-5.2" />
        </>
      )}
    </Base>
  );
}

export function UserIcon({ active }: { active?: boolean }) {
  return (
    <Base filled={active}>
      {active ? (
        <>
          <circle cx="12" cy="8" r="3.6" />
          <path d="M5 19.5c.8-3.3 3.6-5 7-5s6.2 1.7 7 5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z" />
        </>
      ) : (
        <>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5.5 19.5c.8-3.2 3.4-4.8 6.5-4.8s5.7 1.6 6.5 4.8" />
        </>
      )}
    </Base>
  );
}

export function LibraryIcon({ active }: { active?: boolean }) {
  return (
    <Base filled={active}>
      {active ? (
        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H9l2 3h7.5A1.5 1.5 0 0 1 20 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Z" />
      ) : (
        <>
          <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5H9l2 3h7.5A1.5 1.5 0 0 1 20 9.5V18a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18V6.5Z" />
          <path d="M4 6.5V5" />
        </>
      )}
    </Base>
  );
}

export function SparkleIcon() {
  return (
    <Base>
      <path d="M12 4c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5Z" />
      <path d="M18.5 3.5v3M17 5h3" />
    </Base>
  );
}

export function ReceiptIcon({ active }: { active?: boolean }) {
  return (
    <Base filled={active}>
      {active ? (
        <path d="M6 3.5h12A.5.5 0 0 1 18.5 4v16l-2.3-1.4-2.2 1.4-2-1.4-2 1.4-2.2-1.4L5.5 20V4a.5.5 0 0 1 .5-.5Zm4 5.5h4m-4 3h4" />
      ) : (
        <>
          <path d="M6 3.5h12V20l-2.3-1.4L13.5 20l-1.5-1-1.5 1-2.2-1.4L6 20V3.5Z" />
          <path d="M9.5 8.5h5M9.5 12h5" />
        </>
      )}
    </Base>
  );
}

export function DumbbellIcon() {
  return (
    <Base>
      <path d="M7 8v8M4.5 10v4M17 8v8M19.5 10v4M7 12h10" />
      <path d="M7 9.5h.01M7 14.5h.01" />
    </Base>
  );
}

export function ChartIcon({ active }: { active?: boolean }) {
  return (
    <Base filled={active}>
      {active ? (
        <path d="M4 4h2.5v13.5H18A1.5 1.5 0 0 0 19.5 16V4H18v11.5H6.5V4H4Z" />
      ) : (
        <>
          <path d="M4 4v13.5A1.5 1.5 0 0 0 5.5 19H20" />
          <path d="M8.5 15v-4M12.5 15V7.5M16.5 15v-6" />
        </>
      )}
    </Base>
  );
}

export function GearIcon() {
  return (
    <Base>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.8v2.6M12 18.6v2.6M4.2 7.2l2.2 1.3M17.6 15.5l2.2 1.3M4.2 16.8l2.2-1.3M17.6 8.5l2.2-1.3M2.8 12h2.6M18.6 12h2.6" />
    </Base>
  );
}

export function BellIcon() {
  return (
    <Base>
      <path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10" />
      <path d="M10 19a2.2 2.2 0 0 0 4 0" />
    </Base>
  );
}

export function StarIcon() {
  return (
    <Base>
      <path d="m12 4 2.3 4.9 5.2.6-3.9 3.6 1 5.2-4.6-2.6-4.6 2.6 1-5.2L4.5 9.5l5.2-.6L12 4Z" />
    </Base>
  );
}
