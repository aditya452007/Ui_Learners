import Link from "next/link";

const LINKS = [
  { href: "/", label: "Hub" },
  { href: "/scenarios/storage-manager/", label: "1 · Storage" },
  { href: "/scenarios/movie-ratings/", label: "2 · Ratings" },
  { href: "/scenarios/mail-search/", label: "3 · Search" },
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
                : "border-stone-200 bg-white text-stone-600 hover:border-[#0071e3]/50 hover:text-[#0071e3]"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
