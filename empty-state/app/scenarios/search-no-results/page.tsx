"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Item = { id: number; name: string; sku: string; category: "Hardware" | "Software" | "Services"; stock: "In stock" | "Low stock" | "Out of stock" };
const ALL: Item[] = [
  { id: 1, name: "Studio Display 27″ — Nano-texture", sku: "APL-027-NT", category: "Hardware", stock: "In stock" },
  { id: 2, name: "Magic Keyboard with Touch ID", sku: "APL-MK-TID", category: "Hardware", stock: "Low stock" },
  { id: 3, name: "Figma Professional — 12 seats", sku: "SaaS-FIG-PRO", category: "Software", stock: "In stock" },
  { id: 4, name: "Notion AI addon", sku: "SaaS-NTN-AI", category: "Software", stock: "In stock" },
  { id: 5, name: "On-site setup & calibration", sku: "SVC-SET-CAL", category: "Services", stock: "In stock" },
  { id: 6, name: "Extended warranty — 3 years", sku: "SVC-WAR-3Y", category: "Services", stock: "In stock" },
  { id: 7, name: "Thunderbolt 4 Dock — 12 ports", sku: "HW-TB4-DOCK", category: "Hardware", stock: "Out of stock" },
  { id: 8, name: "Linear annual — team plan", sku: "SaaS-LIN-TEAM", category: "Software", stock: "In stock" },
];

export default function SearchNoResultsScenario() {
  const [query, setQuery] = useState("Q3 offsite");
  const [category, setCategory] = useState<string | null>("Hardware");
  const [stock, setStock] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return ALL.filter((it) => {
      const q = query.trim().toLowerCase();
      const matchesQ = !q || it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q);
      const matchesCat = !category || it.category === category;
      const matchesStock = !stock || it.stock === stock;
      return matchesQ && matchesCat && matchesStock;
    });
  }, [query, category, stock]);

  const hasFilters = !!query.trim() || !!category || !!stock;
  const isEmpty = filtered.length === 0;

  function clearAll() {
    setQuery("");
    setCategory(null);
    setStock(null);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
      <nav className="mb-8 flex items-center gap-3 text-sm text-text-muted">
        <Link href="/" className="hover:text-accent transition-colors">
          ← Anatomy
        </Link>
        <span className="text-border-strong">/</span>
        <span className="font-medium text-foreground">Catalog search</span>
        <span className="ml-auto hidden gap-2 sm:inline-flex">
          <Link href="/scenarios/inbox-zero" className="rounded-full border border-border px-3 py-1 hover:border-accent hover:text-accent transition-colors">
            Next: Inbox zero →
          </Link>
        </span>
      </nav>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h1 className="text-sm font-semibold">Acme Store — Catalog</h1>
            <p className="mt-1 text-xs text-text-muted">{isEmpty ? "0 results" : `${filtered.length} of ${ALL.length} products`} · {hasFilters ? "filtered" : "all items"}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" aria-hidden="true">
                <circle cx="6" cy="6" r="4.2" stroke="currentColor" strokeWidth="1.3" />
                <path d="M9.2 9.2 12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products or SKU"
                className="w-[220px] rounded-full border border-border bg-surface-alt py-2 pl-9 pr-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-light sm:w-[260px]"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded-full text-text-faint hover:bg-white hover:text-foreground"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface-alt/60 px-6 py-3">
          <span className="mr-1 font-mono text-xs font-semibold uppercase tracking-widest text-text-faint">Filters</span>
          {(["Hardware", "Software", "Services"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory((v) => (v === c ? null : c))}
              aria-pressed={category === c}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${category === c ? "border-foreground bg-foreground text-white" : "border-border bg-white text-text-muted hover:border-border-strong hover:text-foreground"}`}
            >
              {c}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
          {(["In stock", "Low stock"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStock((v) => (v === s ? null : s))}
              aria-pressed={stock === s}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${stock === s ? "border-foreground bg-foreground text-white" : "border-border bg-white text-text-muted hover:border-border-strong hover:text-foreground"}`}
            >
              {s}
            </button>
          ))}
          {hasFilters && (
            <button onClick={clearAll} className="ml-auto text-xs font-medium text-accent hover:underline">
              Clear all
            </button>
          )}
        </div>

        {/* Content */}
        <div className="min-h-[520px] bg-[#fcfcfc] p-6 sm:p-8">
          {/* Live region note — visually hidden but announced */}
          <p className="sr-only" role="status" aria-live="polite">
            {isEmpty ? (query ? `No results for “${query}”` : "No results with current filters") : `Showing ${filtered.length} results`}
          </p>

          {!isEmpty ? (
            <div className="mx-auto max-w-3xl">
              <div className="overflow-hidden rounded-xl border border-border bg-white">
                <div className="grid grid-cols-[1fr_110px_110px] gap-4 border-b border-border bg-surface-alt px-4 py-2 font-mono text-xs uppercase tracking-widest text-text-faint">
                  <span>Product</span>
                  <span>Category</span>
                  <span>Availability</span>
                </div>
                {filtered.map((it) => (
                  <div key={it.id} className="grid grid-cols-[1fr_110px_110px] items-center gap-4 border-b border-border px-4 py-3 last:border-0 hover:bg-surface-alt/50">
                    <div>
                      <p className="text-sm font-medium leading-tight">{it.name}</p>
                      <p className="font-mono text-xs text-text-faint">{it.sku}</p>
                    </div>
                    <span className="inline-flex w-fit rounded-full bg-surface-alt px-2.5 py-1 text-xs font-medium text-text-muted">{it.category}</span>
                    <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${it.stock === "In stock" ? "bg-emerald-50 text-emerald-700" : it.stock === "Low stock" ? "bg-amber-50 text-amber-700" : "bg-zinc-100 text-zinc-600"}`}>{it.stock}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center font-mono text-xs text-text-faint">Try typing “Q3 offsite” with “Hardware” active — you’ll hit the empty state.</p>
            </div>
          ) : (
            <section
              aria-labelledby="empty-search-title"
              role="status"
              className="mx-auto flex max-w-[440px] flex-col items-center rounded-2xl border border-border bg-white px-8 py-12 text-center shadow-sm"
            >
              <div aria-hidden="true" className="relative mb-6 grid h-[72px] w-[72px] place-items-center">
                <div className="absolute inset-0 rounded-2xl bg-amber-50" />
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="relative" aria-hidden="true">
                  <circle cx="18.5" cy="18.5" r="9.5" stroke="#d97706" strokeWidth="1.6" fill="white" />
                  <path d="M25.2 25.2 33 33" stroke="#d97706" strokeWidth="1.7" strokeLinecap="round" />
                  <path d="M14 15h9M14 19h6" stroke="#e7e5e4" strokeWidth="1.1" strokeLinecap="round" />
                  <circle cx="18" cy="26" r="1.4" fill="#f59e0b" />
                </svg>
              </div>
              <h2 id="empty-search-title" className="text-[15px] font-semibold tracking-tight">
                {query.trim() ? `No results for “${query.trim()}”` : "No matching products"}
              </h2>
              <p className="mt-2 max-w-[300px] text-sm leading-relaxed text-text-muted">
                {category || stock ? (
                  <>
                    No <span className="font-medium text-foreground">{[category, stock].filter(Boolean).join(" · ")}</span> items match. Try widening your filters.
                  </>
                ) : (
                  "Try adjusting your search or filters to find what you’re looking for."
                )}
              </p>
              <button
                onClick={clearAll}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black active:scale-[0.98] transition-all"
              >
                Clear filters
              </button>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {["Hardware", "Software", "Services"].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCategory(c);
                      setQuery("");
                    }}
                    className="rounded-full border border-border bg-surface-alt px-3 py-1 text-xs font-medium text-text-muted hover:border-accent/30 hover:text-accent"
                  >
                    Show {c}
                  </button>
                ))}
              </div>
              <p className="mt-6 font-mono text-xs text-text-faint">role=&quot;status&quot; announces without moving focus</p>
            </section>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 p-5">
        <h3 className="text-sm font-semibold text-amber-900">Why it fits here</h3>
        <p className="mt-2 text-sm leading-relaxed text-amber-900/70">
          This is the “no results” variant — the most demanding empty state to get right. The list exists, but the current query + filters removed everything. The heading repeats the query (“No results for ‘Q3 offsite’”) so you know what failed, the explanation suggests the fix, and the primary action clears all filters in one tap. Behind the scenes the section uses <code className="font-mono text-amber-900">role=&quot;status&quot;</code> so screen readers announce the change while your cursor stays in the search field. Secondary chips offer single-click escape hatches.
        </p>
      </div>

      <div className="mt-4 flex justify-between text-sm">
        <Link href="/scenarios/first-project" className="text-text-muted hover:text-foreground">
          ← Project workspace
        </Link>
        <Link href="/scenarios/inbox-zero" className="font-medium text-accent hover:underline">
          Next: Inbox zero →
        </Link>
      </div>
    </main>
  );
}
