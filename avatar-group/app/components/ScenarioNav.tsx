import Link from "next/link";

export const SCENARIOS = [
  { href: "/scenarios/task-board", title: "Task board", note: "Small · tight overlap · overflow popover" },
  { href: "/scenarios/live-doc", title: "Live document", note: "Presence dots · initials fallback" },
  { href: "/scenarios/event-rsvp", title: "Event RSVP", note: "Large · loose spacing · attendee sheet" },
];

export function ScenarioNav({ current }: { current?: string }) {
  return (
    <nav aria-label="Avatar Group demos" className="flex flex-wrap gap-2">
      <NavLink href="/" active={current === "/"} label="Learning hub" />
      {SCENARIOS.map((s) => (
        <NavLink
          key={s.href}
          href={s.href}
          active={current === s.href}
          label={s.title}
        />
      ))}
    </nav>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
        active
          ? "bg-[#0f766e] text-white shadow-[0_4px_12px_-4px_rgb(15_118_110/0.6)]"
          : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-[#0f766e] hover:text-[#0f766e]"
      }`}
    >
      {label}
    </Link>
  );
}
