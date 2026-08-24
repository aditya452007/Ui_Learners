"use client";

import Link from "next/link";
import { useState } from "react";

type Project = { id: number; name: string; updated: string; color: string };

const STARTERS: Pick<Project, "name" | "color">[] = [
  { name: "Brand refresh — Q4", color: "#4f46e5" },
  { name: "Website redesign", color: "#0ea5e9" },
  { name: "Mobile research", color: "#16a34a" },
];

export default function FirstProjectScenario() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState("");

  function createProject(name?: string) {
    const title = (name ?? draft).trim() || "Untitled project";
    setProjects((p) => [...p, { id: Date.now(), name: title, updated: "Just now", color: "#4f46e5" }]);
    setDraft("");
    setShowCreate(false);
  }

  function remove(id: number) {
    setProjects((p) => p.filter((x) => x.id !== id));
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
      {/* Top nav */}
      <nav className="mb-8 flex items-center gap-3 text-sm text-text-muted">
        <Link href="/" className="hover:text-accent transition-colors">
          ← Anatomy
        </Link>
        <span className="text-border-strong">/</span>
        <span className="font-medium text-foreground">Project workspace</span>
        <span className="ml-auto hidden gap-2 sm:inline-flex">
          <Link href="/scenarios/search-no-results" className="rounded-full border border-border px-3 py-1 hover:border-accent hover:text-accent transition-colors">
            Next: Catalog search →
          </Link>
        </span>
      </nav>

      {/* App shell */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-white">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="3" width="12" height="10" rx="2" stroke="white" strokeWidth="1.3" />
                <path d="M2 6h12" stroke="white" strokeWidth="1.1" />
              </svg>
            </div>
            <span className="text-sm font-semibold">Linear • Projects</span>
            <span className="hidden rounded-full bg-surface-alt px-2.5 py-1 font-mono text-xs text-text-muted sm:inline-block">{projects.length} projects</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white hover:bg-black transition-colors"
            >
              New project
            </button>
            <Link href="/" className="hidden text-sm text-text-muted hover:text-foreground sm:block">
              Docs
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <aside className="hidden border-r border-border bg-surface-alt/50 p-4 md:block">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-text-faint">Workspace</p>
            <div className="space-y-1">
              {["Projects", "Tasks", "Docs", "Settings"].map((item, i) => (
                <div
                  key={item}
                  className={`rounded-lg px-3 py-2 text-sm ${i === 0 ? "bg-white font-medium text-foreground shadow-sm border border-border" : "text-text-muted"}`}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-dashed border-border bg-white p-3">
              <p className="text-xs font-semibold">Upgrade to Pro</p>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">Get unlimited projects and version history.</p>
            </div>
          </aside>

          {/* Main */}
          <div className="min-h-[520px] bg-[#fcfcfc] p-6 sm:p-10">
            {projects.length === 0 ? (
              <section
                aria-labelledby="empty-project-title"
                className="mx-auto flex max-w-[420px] flex-col items-center rounded-2xl border border-border bg-white px-8 py-12 text-center shadow-sm"
              >
                {/* illustration */}
                <div aria-hidden="true" className="relative mb-6 grid h-[84px] w-[84px] place-items-center">
                  <div className="absolute inset-0 rounded-2xl bg-accent-light" />
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="relative" aria-hidden="true">
                    <path d="M10 13a3 3 0 0 1 3-3h8l3 3H35a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V13Z" stroke="#4f46e5" strokeWidth="1.5" fill="white" />
                    <path d="M14 19h20M14 23h14" stroke="#e7e5e4" strokeWidth="1.1" strokeLinecap="round" />
                    <circle cx="32" cy="27" r="8" fill="#4f46e5" />
                    <path d="M28 27h8M32 23v8" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <h2 id="empty-project-title" className="text-[15px] font-semibold tracking-tight">
                  No projects yet
                </h2>
                <p className="mt-2 max-w-[300px] text-sm leading-relaxed text-text-muted">
                  Create your first project to organise tasks, docs and timelines — it only takes a few seconds.
                </p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black active:scale-[0.98] transition-all"
                >
                  New project
                </button>
                <div className="mt-4 flex items-center justify-center gap-3 text-xs">
                  <button onClick={() => createProject("Starter — Brand refresh")} className="font-medium text-accent hover:underline">
                    Try a starter →
                  </button>
                  <span className="text-border-strong">·</span>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-text-muted hover:text-foreground">
                    Import from template
                  </a>
                </div>
                <p className="mt-6 font-mono text-xs text-text-faint">aria-labelledby · aria-hidden illustration · single primary action</p>
              </section>
            ) : (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Your projects</h2>
                  <button onClick={() => setProjects([])} className="text-xs text-text-muted hover:text-foreground">
                    Clear all
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {projects.map((p) => (
                    <div key={p.id} className="group rounded-xl border border-border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="h-9 w-9 rounded-lg grid place-items-center text-white text-sm font-bold" style={{ background: p.color }}>
                            {p.name.slice(0, 1).toUpperCase()}
                          </span>
                          <div>
                            <p className="text-sm font-semibold leading-none">{p.name}</p>
                            <p className="mt-1 font-mono text-xs text-text-faint">{p.updated}</p>
                          </div>
                        </div>
                        <button onClick={() => remove(p.id)} className="rounded-full p-1 text-text-faint hover:bg-surface-alt hover:text-foreground" aria-label={`Delete ${p.name}`}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path d="M3 3.5 11 11M11 3.5 3 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
                        <div className="h-full w-2/3 rounded-full bg-foreground/15" />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowCreate(true)}
                    className="grid min-h-[102px] place-items-center rounded-xl border-2 border-dashed border-border bg-white/60 text-sm font-medium text-text-muted hover:border-accent/30 hover:text-accent transition-colors"
                  >
                    + New project
                  </button>
                </div>
                <div className="mt-6 rounded-xl bg-accent-light/50 px-4 py-3 text-xs leading-relaxed text-text-muted">
                  Empty state → populated grid in one click. Remove every project to see the empty state again — it’s the same <code className="font-mono text-foreground">&lt;section&gt;</code> returning when <code className="font-mono text-foreground">projects.length === 0</code>.
                </div>
              </div>
            )}

            {/* Create dialog */}
            {showCreate && (
              <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4 backdrop-blur-[2px]" onClick={() => setShowCreate(false)}>
                <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-xl">
                  <h3 className="text-sm font-semibold">Create project</h3>
                  <p className="mt-1 text-sm text-text-muted">A name is enough to start — you can add details later.</p>
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") createProject();
                      if (e.key === "Escape") setShowCreate(false);
                    }}
                    placeholder="e.g. Q4 launch plan"
                    className="mt-4 w-full rounded-xl border border-border bg-surface-alt px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {STARTERS.map((s) => (
                      <button key={s.name} onClick={() => createProject(s.name)} className="rounded-full border border-border bg-surface px-3 py-1 text-xs hover:border-accent/30 hover:text-accent">
                        {s.name}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <button onClick={() => setShowCreate(false)} className="rounded-full px-4 py-2 text-sm font-medium text-text-muted hover:text-foreground">
                      Cancel
                    </button>
                    <button onClick={() => createProject()} className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white hover:bg-black">
                      Create
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-accent/15 bg-accent-light/40 p-5">
        <h3 className="text-sm font-semibold">Why it fits here</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          First-use is the most common empty state — the user has just signed up and there is nothing to list. A warm illustration, a single encouraging sentence, and one obvious button (“New project”) turns a dead end into an invitation. No blame, no empty table headers — just the next step. The secondary “Try a starter” lowers the barrier for users who don’t know what to type yet.
        </p>
      </div>

      <div className="mt-4 flex justify-between text-sm">
        <Link href="/" className="text-text-muted hover:text-foreground">
          ← Back to anatomy
        </Link>
        <Link href="/scenarios/search-no-results" className="font-medium text-accent hover:underline">
          Next: Catalog search →
        </Link>
      </div>
    </main>
  );
}
