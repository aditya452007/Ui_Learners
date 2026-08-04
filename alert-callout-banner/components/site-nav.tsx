import Link from "next/link";

export type PageKey = "hub" | "settings" | "docs" | "banner";

export const NAV_LINKS: { key: PageKey; label: string; href: string }[] = [
  { key: "hub", label: "Anatomy", href: "/" },
  { key: "settings", label: "Settings alerts", href: "/scenarios/account-settings" },
  { key: "docs", label: "Docs callouts", href: "/scenarios/docs-callouts" },
  { key: "banner", label: "Site banner", href: "/scenarios/site-banner" },
];

export function SiteNav({ current }: { current: PageKey }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          <span className="font-mono text-xs font-medium tracking-tight text-ink">
            ALERT · CALLOUT · BANNER
          </span>
        </Link>
        <div className="flex items-center gap-1 overflow-x-auto">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              aria-current={link.key === current ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                link.key === current
                  ? "bg-accent-soft text-accent-ink"
                  : "text-muted hover:bg-surface hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
