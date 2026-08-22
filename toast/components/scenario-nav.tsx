import Link from "next/link";

const LINKS = [
  { href: "/", label: "Hub", key: "hub" },
  { href: "/scenarios/docs-autosave", label: "Docs autosave", key: "docs-autosave" },
  { href: "/scenarios/file-manager-undo", label: "File manager undo", key: "file-manager-undo" },
  { href: "/scenarios/checkout-cart", label: "Checkout cart", key: "checkout-cart" },
] as const;

export type ScenarioKey = (typeof LINKS)[number]["key"];

export function ScenarioNav({ current }: { current: ScenarioKey }) {
  return (
    <nav
      aria-label="Scenario pages"
      className="mb-10 flex flex-wrap items-center gap-2"
    >
      {LINKS.map((l) =>
        l.key === current ? (
          <span
            key={l.key}
            aria-current="page"
            className="rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background"
          >
            {l.label}
          </span>
        ) : (
          <Link
            key={l.key}
            href={l.href}
            className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-border-strong hover:text-foreground"
          >
            {l.label}
          </Link>
        ),
      )}
    </nav>
  );
}
