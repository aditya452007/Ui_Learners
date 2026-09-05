import Link from "next/link";

export function DemoNav({ current }: { current: string }) {
  const links = [
    { href: "/", label: "Hub" },
    { href: "/scenarios/delete-confirmation", label: "Delete confirmation" },
    { href: "/scenarios/inventory-editor", label: "Inventory drawer" },
    { href: "/scenarios/delivery-filters", label: "Delivery sheet" },
  ];
  return (
    <nav
      aria-label="Demo pages"
      className="flex flex-wrap items-center gap-1.5 rounded-full border border-border bg-surface p-1.5"
    >
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={current === l.href ? "page" : undefined}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            current === l.href
              ? "bg-foreground text-background"
              : "text-text-muted hover:bg-surface-alt hover:text-foreground"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
