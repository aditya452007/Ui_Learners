import Link from "next/link";

export function ScenarioNav({ current }: { current: string }) {
  const links = [
    { href: "/", label: "Anatomy" },
    { href: "/scenarios/file-browser", label: "Files" },
    { href: "/scenarios/canvas-board", label: "Canvas" },
    { href: "/scenarios/data-table", label: "Table" },
  ];
  return (
    <nav className="flex flex-wrap items-center gap-2 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur sm:px-6">
      {links.map((l) => {
        const active = l.href === current;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              active ? "bg-foreground text-white" : "border border-border bg-white text-foreground hover:bg-surface-alt"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
      <span className="ml-auto hidden font-mono text-xs text-text-faint sm:inline">Right-click is secondary click · Ctrl-click works too</span>
    </nav>
  );
}
