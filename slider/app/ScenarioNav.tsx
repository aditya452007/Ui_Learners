import Link from "next/link";

const LINKS = [
  { href: "/", label: "Hub" },
  { href: "/scenarios/volume-control/", label: "Volume" },
  { href: "/scenarios/playback-speed/", label: "Playback speed" },
  { href: "/scenarios/brightness-control/", label: "Brightness" },
];

export function ScenarioNav({ current }: { current: string }) {
  return (
    <nav
      aria-label="Showcase navigation"
      className="flex flex-wrap items-center gap-1.5 rounded-xl border border-stone-200 bg-white p-1.5"
    >
      {LINKS.map((l) => {
        const active = l.href === current;
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
              active
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
