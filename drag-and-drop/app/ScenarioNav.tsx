import Link from "next/link";

const LINKS = [
  { href: "/", label: "Hub" },
  { href: "/scenarios/task-board/", label: "1 · Task board" },
  { href: "/scenarios/file-dropzone/", label: "2 · File triage" },
  { href: "/scenarios/dashboard-canvas/", label: "3 · Canvas" },
];

export function ScenarioNav({ current }: { current: string }) {
  return (
    <nav
      aria-label="Demo pages"
      className="flex flex-wrap items-center gap-2 text-[13px]"
    >
      {LINKS.map((l) => {
        const active =
          l.href === current || (l.href !== "/" && current.startsWith(l.href));
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full border px-3 py-1.5 font-medium transition-colors ${
              active
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-blue-600/50 hover:text-blue-700"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function GripDots({ label = "Drag handle" }: { label?: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className="grid shrink-0 cursor-grab grid-cols-3 gap-[2.5px] rounded-md p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600 active:cursor-grabbing"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} className="size-[3.5px] rounded-full bg-current" />
      ))}
    </span>
  );
}

export function WhyFits({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-blue-600/25 bg-[#eff6ff] p-5">
      <p className="text-sm font-semibold text-stone-900">Why it fits here</p>
      <p className="mt-1 text-[13px] leading-relaxed text-stone-600">
        {children}
      </p>
    </div>
  );
}
