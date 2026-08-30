"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

type Person = {
  id: string;
  name: string;
  role: string;
  email: string;
  tz: string;
  status: "online" | "away" | "offline";
  avatar: string;
};

type Node = {
  id: string;
  label: string;
  kind: "branch" | "team" | "person";
  count?: string;
  person?: Person;
  children?: Node[];
};

const PEOPLE: Record<string, Person> = {
  alice: { id: "alice", name: "Alice Chen", role: "Staff Designer", email: "alice@acme.inc", tz: "SF · GMT-7", status: "online", avatar: "AC" },
  ben: { id: "ben", name: "Ben Smith", role: "Product Designer", email: "ben@acme.inc", tz: "NY · GMT-4", status: "online", avatar: "BS" },
  clara: { id: "clara", name: "Clara Diaz", role: "Design Manager", email: "clara@acme.inc", tz: "LDN · GMT+1", status: "away", avatar: "CD" },
  dan: { id: "dan", name: "Dan Park", role: "UX Researcher", email: "dan@acme.inc", tz: "SF · GMT-7", status: "online", avatar: "DP" },
  emma: { id: "emma", name: "Emma Liu", role: "Brand Designer", email: "emma@acme.inc", tz: "SG · GMT+8", status: "offline", avatar: "EL" },
  frank: { id: "frank", name: "Frank Kim", role: "Platform Lead", email: "frank@acme.inc", tz: "SF · GMT-7", status: "online", avatar: "FK" },
  grace: { id: "grace", name: "Grace Patel", role: "Backend Engineer", email: "grace@acme.inc", tz: "NY · GMT-4", status: "away", avatar: "GP" },
  henry: { id: "henry", name: "Henry Wu", role: "SRE", email: "henry@acme.inc", tz: "LDN · GMT+1", status: "online", avatar: "HW" },
  iris: { id: "iris", name: "Iris Novak", role: "Growth PM", email: "iris@acme.inc", tz: "SF · GMT-7", status: "online", avatar: "IN" },
  jack: { id: "jack", name: "Jack Rivera", role: "Data Engineer", email: "jack@acme.inc", tz: "NY · GMT-4", status: "offline", avatar: "JR" },
  karen: { id: "karen", name: "Karen Okafor", role: "Sales Lead", email: "karen@acme.inc", tz: "LDN · GMT+1", status: "online", avatar: "KO" },
};

const ORG: Node[] = [
  {
    id: "product",
    label: "Product",
    kind: "branch",
    count: "14",
    children: [
      {
        id: "design",
        label: "Design",
        kind: "team",
        count: "5",
        children: [
          { id: "alice", label: "Alice Chen", kind: "person", person: PEOPLE.alice },
          { id: "ben", label: "Ben Smith", kind: "person", person: PEOPLE.ben },
          { id: "clara", label: "Clara Diaz", kind: "person", person: PEOPLE.clara },
          { id: "dan", label: "Dan Park", kind: "person", person: PEOPLE.dan },
          { id: "emma", label: "Emma Liu", kind: "person", person: PEOPLE.emma },
        ],
      },
      {
        id: "research",
        label: "Research",
        kind: "team",
        count: "3",
        children: [
          { id: "dan-r", label: "Dan Park", kind: "person", person: PEOPLE.dan },
          { id: "iris-r", label: "Iris Novak", kind: "person", person: PEOPLE.iris },
        ],
      },
      { id: "pm", label: "Product Mgmt", kind: "team", count: "4", children: [{ id: "iris", label: "Iris Novak", kind: "person", person: PEOPLE.iris }] },
    ],
  },
  {
    id: "engineering",
    label: "Engineering",
    kind: "branch",
    count: "22",
    children: [
      {
        id: "platform",
        label: "Platform",
        kind: "team",
        count: "8",
        children: [
          { id: "frank", label: "Frank Kim", kind: "person", person: PEOPLE.frank },
          { id: "grace", label: "Grace Patel", kind: "person", person: PEOPLE.grace },
          { id: "henry", label: "Henry Wu", kind: "person", person: PEOPLE.henry },
          { id: "jack", label: "Jack Rivera", kind: "person", person: PEOPLE.jack },
        ],
      },
      { id: "growth", label: "Growth", kind: "team", count: "6", children: [{ id: "jack-g", label: "Jack Rivera", kind: "person", person: PEOPLE.jack }] },
      { id: "infra", label: "Infrastructure", kind: "team", count: "5", children: [{ id: "henry-i", label: "Henry Wu", kind: "person", person: PEOPLE.henry }] },
    ],
  },
  {
    id: "gtm",
    label: "Go-to-Market",
    kind: "branch",
    count: "12",
    children: [
      { id: "sales", label: "Sales", kind: "team", count: "6", children: [{ id: "karen", label: "Karen Okafor", kind: "person", person: PEOPLE.karen }] },
      { id: "marketing", label: "Marketing", kind: "team", count: "6", children: [] },
    ],
  },
];

function buildCols(tree: Node[], path: string[]) {
  const cols: Node[][] = [tree];
  let cur = tree;
  for (const id of path) {
    const n = cur.find((x) => x.id === id);
    if (n && (n.kind === "branch" || n.kind === "team") && n.children && n.children.length > 0) {
      cols.push(n.children);
      cur = n.children;
    } else break;
  }
  return cols;
}
function findNode(tree: Node[], id: string): Node | undefined {
  for (const n of tree) {
    if (n.id === id) return n;
    if (n.children) {
      const r = findNode(n.children, id);
      if (r) return r;
    }
  }
}

function StatusDot({ s }: { s: Person["status"] }) {
  const c = s === "online" ? "bg-emerald-500" : s === "away" ? "bg-amber-500" : "bg-zinc-300";
  return <span className={`h-2 w-2 rounded-full ${c} ring-2 ring-white`} />;
}

export default function TeamDirectory() {
  const [path, setPath] = useState<string[]>(["product", "design", "alice"]);
  const [query, setQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const cols = buildCols(ORG, path);
  const leafId = path[path.length - 1];
  const leaf = leafId ? findNode(ORG, leafId) : undefined;
  const isPerson = leaf?.kind === "person";
  const person = leaf?.person;
  const breadcrumb = path.map((id) => findNode(ORG, id)?.label ?? id);

  useEffect(() => {
    scrollRef.current?.scrollTo({ left: scrollRef.current.scrollWidth, behavior: "smooth" });
  }, [cols.length, leafId]);

  function selectAt(depth: number, n: Node) {
    if ((n.kind === "branch" || n.kind === "team") && n.children && n.children.length) setPath([...path.slice(0, depth), n.id]);
    else setPath([...path.slice(0, depth), n.id]);
  }

  return (
    <div className="min-h-screen bg-[#fcfcfa]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 font-medium text-text-muted hover:text-foreground">← Anatomy</Link>
          <span className="text-text-faint">/</span>
          <span className="font-mono text-xs tracking-widest uppercase text-text-faint">Scenario 3 · Team directory</span>
          <div className="ml-auto flex gap-2">
            <Link href="/scenarios/file-browser" className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text-muted">File browser</Link>
            <Link href="/scenarios/category-browser" className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text-muted">Category</Link>
          </div>
        </div>

        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight">Org chart as Miller columns</h1>
          <p className="mt-3 text-lg leading-relaxed text-text-muted">
            Company → division → team → person. The same spatial pattern makes a 200-person org feel navigable: you see the ancestry (Product › Design) while picking a person.
          </p>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-faint mb-1">Why column view here</p>
            <p className="text-sm leading-relaxed text-text-muted">Org depth is exactly 4 levels — perfect for Miller columns. No accordion, no endless expanding tree, just one column per level.</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-faint mb-1">Extensibility this time</p>
            <p className="text-sm leading-relaxed text-text-muted">Branches show member counts; leaves are profile cards with avatar, presence, timezone, and actions. Same NSBrowser, richer leaf.</p>
          </div>
          <div className="rounded-xl border border-[#0a84ff]/20 bg-[#eff6ff] p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0a84ff] mb-1">What user gains</p>
            <p className="text-sm leading-relaxed text-text-muted">Spatial orientation — “I’m three deep, I can jump to any ancestor by clicking its blue row” — plus quick presence scan.</p>
          </div>
        </div>

        {/* intranet window */}
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <div className="flex h-12 items-center justify-between border-b border-border bg-white px-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#1c1917] grid place-items-center text-white font-bold text-sm">◈</div>
              <span className="font-semibold">Acme Intranet</span>
              <span className="hidden sm:inline rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700">48 online</span>
            </div>
            <label className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-[#fafaf9] pl-3 pr-2 py-1.5 w-[260px] focus-within:border-[#0a84ff] focus-within:ring-2 focus-within:ring-[#0a84ff]/20">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="3.5" stroke="#a8a29e" strokeWidth="1.3"/><path d="M8.8 8.8 11.5 11.5" stroke="#a8a29e" strokeWidth="1.3" strokeLinecap="round"/></svg>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search people or teams" className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-faint" />
            </label>
          </div>

          <div className="flex items-center gap-2 border-b border-border bg-[#fafaf9] px-4 py-2 sm:hidden">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="flex-1 rounded-full border border-border bg-white px-3 py-1.5 text-sm outline-none" />
          </div>

          {/* columns */}
          <div ref={scrollRef} className="flex h-[420px] overflow-x-auto overflow-y-hidden bg-white">
            {cols.map((col, depth) => {
              const selId = path[depth];
              const filtered = query ? col.filter((n) => n.label.toLowerCase().includes(query.toLowerCase())) : col;
              return (
                <div key={depth} className="flex w-[220px] shrink-0 flex-col border-r border-border bg-white">
                  <div className="flex h-7 items-center justify-between bg-[#fafaf9] border-b border-border px-3">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint truncate">{depth === 0 ? "Acme Inc." : breadcrumb[depth - 1]}</span>
                    <span className="font-mono text-[10px] text-text-faint">{filtered.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {filtered.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-sm text-text-faint">No matches</p>
                        <p className="text-xs text-text-faint mt-1">Try a different search</p>
                      </div>
                    ) : (
                      filtered.map((n) => {
                        const isBranch = n.kind === "branch" || n.kind === "team";
                        const isLeaf = n.kind === "person";
                        const isSel = selId === n.id;
                        const hasChildren = isBranch && !!n.children && n.children.length > 0;
                        return (
                          <button
                            key={n.id}
                            onClick={() => selectAt(depth, n)}
                            className={`flex w-full items-center gap-2.5 px-3 py-2 text-left ${isSel ? "bg-[#0a84ff] text-white" : "hover:bg-zinc-50 text-[#1c1917]"} ${isLeaf ? "py-2.5" : ""}`}
                          >
                            {isLeaf && n.person ? (
                              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold relative ${isSel ? "bg-white text-[#0a84ff]" : "bg-zinc-100 text-zinc-700 border border-zinc-200"}`}>
                                {n.person.avatar}
                                <span className="absolute -bottom-0.5 -right-0.5">
                                  <StatusDot s={n.person.status} />
                                </span>
                              </span>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
                                {n.kind === "team" ? (
                                  <>
                                    <circle cx="8" cy="6" r="2.2" stroke={isSel ? "white" : "#a8a29e"} strokeWidth="1.1" />
                                    <path d="M4.5 11.5a3.5 3.5 0 0 1 7 0" stroke={isSel ? "white" : "#a8a29e"} strokeWidth="1.1" strokeLinecap="round" />
                                  </>
                                ) : (
                                  <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h3l1.2 1.5H12.5A1.5 1.5 0 0 1 14 7v4.5A1.5 1.5 0 0 1 12.5 13h-9A1.5 1.5 0 0 1 2 11.5v-6Z" fill={isSel ? "white" : "#0a84ff"} fillOpacity={isSel ? 0.95 : 0.1} stroke={isSel ? "white" : "#0a84ff"} strokeWidth="1.1" />
                                )}
                              </svg>
                            )}
                            <div className="flex-1 min-w-0 text-left">
                              <p className={`truncate text-[13px] leading-tight ${isSel ? "font-medium text-white" : "font-[450]"}`}>{n.label}</p>
                              {isLeaf && n.person ? (
                                <p className={`truncate text-xs ${isSel ? "text-white/70" : "text-text-muted"}`}>{n.person.role}</p>
                              ) : (
                                <p className={`font-mono text-[11px] ${isSel ? "text-white/70" : "text-text-faint"}`}>{n.count ? `${n.count} members` : ""}</p>
                              )}
                            </div>
                            {hasChildren ? (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`shrink-0 ${isSel ? "text-white/70" : "text-zinc-400"}`}><path d="M4.2 2.5 7.7 6 4.2 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            ) : isLeaf ? null : (
                              <span className={`font-mono text-[10px] ${isSel ? "text-white/60" : "text-text-faint"}`}>—</span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}

            {isPerson && person && (
              <div className="flex w-[320px] shrink-0 flex-col bg-[#fafaf9] border-r border-border">
                <div className="flex h-7 items-center bg-[#fafaf9] border-b border-border px-3">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Profile</span>
                  <span className="ml-auto font-mono text-[10px] text-text-faint">isLeaf · person</span>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="rounded-2xl border border-border bg-white p-5">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#1c1917] text-white font-semibold text-lg">{person.avatar}</div>
                        <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-white border border-border">
                          <span className={`h-2.5 w-2.5 rounded-full ${person.status === "online" ? "bg-emerald-500" : person.status === "away" ? "bg-amber-500" : "bg-zinc-300"}`} />
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold leading-tight">{person.name}</h3>
                        <p className="text-sm text-text-muted">{person.role}</p>
                        <p className="font-mono text-xs text-text-faint mt-1">{person.email}</p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-[#fafaf9] border border-border p-3">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Timezone</p>
                        <p className="text-sm font-medium mt-1">{person.tz}</p>
                      </div>
                      <div className="rounded-xl bg-[#fafaf9] border border-border p-3">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-text-faint">Status</p>
                        <p className="text-sm font-medium mt-1 capitalize">{person.status}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 rounded-full bg-[#0a84ff] py-2 text-sm font-semibold text-white hover:bg-[#0066cc]">Message</button>
                      <button className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50">View profile</button>
                    </div>
                    <p className="mt-3 text-xs text-text-faint text-center">Leaf — no ›, no next column. In code: NSBrowserCell.isLeaf == true.</p>
                    <div className="mt-4 flex items-center gap-2 rounded-full bg-[#eff6ff] border border-[#0a84ff]/15 px-3 py-2">
                      <span className="h-2 w-2 rounded-full bg-[#0a84ff]" />
                      <span className="text-xs font-mono text-[#0a84ff]">{breadcrumb.join(" › ")}</span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-white border border-border p-3">
                    <p className="font-mono text-xs font-semibold">Recent work</p>
                    <p className="text-sm text-text-muted mt-1 leading-relaxed">Shipped the new column-view tokens and updated the pricing page. 3 PRs merged this week.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex h-7 items-center justify-between border-t border-border bg-[#f5f5f4] px-3">
            <span className="font-mono text-xs text-text-muted truncate">{breadcrumb.join("  ›  ")}</span>
            <span className="font-mono text-[11px] text-text-faint">{cols.length} columns · {isPerson ? "person leaf" : "team branch"} selected</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <Link href="/" className="text-text-muted hover:text-[#0a84ff]">← Back to anatomy</Link>
          <div className="flex gap-3">
            <Link href="/scenarios/file-browser" className="text-text-muted hover:text-foreground">File browser</Link>
            <Link href="/scenarios/category-browser" className="text-text-muted hover:text-foreground">Category browser</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
