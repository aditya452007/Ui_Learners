"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

type FormatOpt = { id: string; label: string; ext: string; desc: string };
const FORMATS: FormatOpt[] = [
  { id: "zip", label: "ZIP Archive", ext: "zip", desc: "Compatible everywhere" },
  { id: "tar", label: "Tarball", ext: "tar.gz", desc: "Unix, preserves permissions" },
  { id: "dmg", label: "Disk Image", ext: "dmg", desc: "macOS mountable" },
];

function stripExt(n: string) {
  // handle tar.gz double ext
  if (n.toLowerCase().endsWith(".tar.gz")) return n.slice(0, -7);
  const i = n.lastIndexOf(".");
  return i > 0 ? n.slice(0, i) : n;
}
function makeFileName(base: string, fmt: FormatOpt) {
  const clean = stripExt(base) || "Untitled";
  return `${clean}.${fmt.ext}`;
}
function validate(name: string) {
  const b = stripExt(name) || name;
  if (!b.trim()) return "Name required.";
  if (b.includes("/") || b.includes(":")) return 'Cannot contain “:” or “/”.';
  return null;
}

type Node = { name: string; kind: "folder" | "file"; size?: string; modified: string; children?: Node[] };

const TREE: Node[] = [
  {
    name: "Projects",
    kind: "folder",
    modified: "",
    children: [
      {
        name: "Studio Archive",
        kind: "folder",
        modified: "",
        children: [
          { name: "2024-Archive.zip", kind: "file", size: "2.1 GB", modified: "Dec 12" },
          { name: "2025-Q1.tar.gz", kind: "file", size: "890 MB", modified: "Mar 03" },
        ],
      },
      { name: "Brand", kind: "folder", modified: "", children: [{ name: "brand-v4.zip", kind: "file", size: "420 MB", modified: "Aug 10" }] },
      { name: "Experiments", kind: "folder", modified: "", children: [] },
    ],
  },
  { name: "Backups", kind: "folder", modified: "", children: [{ name: "vault.zip", kind: "file", size: "4.4 GB", modified: "Aug 15" }] },
];

const FLAT_FILES: { name: string; kind: "folder" | "file"; size?: string; modified: string }[] = [
  { name: "2024-Archive.zip", kind: "file", size: "2.1 GB", modified: "Dec 12" },
  { name: "2025-Q1.tar.gz", kind: "file", size: "890 MB", modified: "Mar 03" },
  { name: "brand-v4.zip", kind: "file", size: "420 MB", modified: "Aug 10" },
  { name: "Studio Archive", kind: "folder", modified: "Today" },
  { name: "Brand", kind: "folder", modified: "Aug 22" },
  { name: "Experiments", kind: "folder", modified: "Today" },
];

const SIDEBAR_GROUPS = [
  { title: "Favorites", items: ["Recents", "Desktop", "Documents", "Downloads"] },
  { title: "Locations", items: ["Macintosh HD", "Studio SSD", "Time Machine"] },
  { title: "Tags", items: ["Work", "Archive", "Shared"] },
];

export default function ArchiveProjectScenario() {
  const [name, setName] = useState("Studio Workspace 2025-Q3");
  const [format, setFormat] = useState<FormatOpt>(FORMATS[0]);
  const [isExpanded] = useState(true); // location-heavy: always expanded in this scenario (isExpanded = true)
  const [path, setPath] = useState(["Macintosh HD", "Projects", "Studio Archive"]);
  const [where, setWhere] = useState("Macintosh HD › Projects › Studio Archive");
  const [sidebarSel, setSidebarSel] = useState("Macintosh HD");
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "column">("list");
  const [files, setFiles] = useState(FLAT_FILES);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [confirm, setConfirm] = useState(false);

  const fileName = makeFileName(name, format);
  const error = validate(name);
  const duplicate = useMemo(() => files.some((f) => f.kind === "file" && f.name.toLowerCase() === fileName.toLowerCase()), [files, fileName]);
  const filtered = useMemo(() => {
    if (!search) return files;
    return files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
  }, [files, search]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2600);
      return () => clearTimeout(t);
    }
  }, [toast]);

  function handleSave() {
    if (error) return;
    if (duplicate && !confirm) {
      setConfirm(true);
      return;
    }
    setToast(`Archived “${fileName}” to ${where} · ${format.label}`);
    setConfirm(false);
    setPanelOpen(false);
    setTimeout(() => setPanelOpen(true), 600);
  }

  function createFolder() {
    const n = newFolderName.trim();
    if (!n || n.includes("/") || n.includes(":")) return;
    if (files.some((f) => f.name === n)) return;
    setFiles((p) => [{ name: n, kind: "folder", modified: "Today" }, ...p]);
    setPath([...path, n]);
    setWhere([...path, n].join(" › "));
    setShowNewFolder(false);
    setNewFolderName("");
  }

  return (
    <div className="min-h-screen bg-[#fcfcfa]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 font-medium text-text-muted hover:text-foreground hover:border-border-strong transition-colors">
            ← Anatomy
          </Link>
          <span className="text-text-faint">/</span>
          <span className="font-mono text-xs tracking-widest uppercase text-text-faint">Scenario 3 · Archive Project · Location-heavy</span>
          <div className="ml-auto flex gap-2">
            <Link href="/scenarios/poster-export" className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text-muted hover:border-border-strong hover:text-foreground">Poster →</Link>
          </div>
        </div>

        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight">Archive Project — deep browsing, archive formats</h1>
          <p className="mt-3 text-lg leading-relaxed text-text-muted">
            A developer archives a workspace. The Save Panel opens <strong>already expanded</strong> (isExpanded = true) — the sidebar and path
            bar are the point. The format chooses the archive container.
          </p>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-faint mb-1">Why expanded here</p>
            <p className="text-sm leading-relaxed text-text-muted">Archives need precise placement — Projects › Studio Archive vs. Backups. The Finder browser prevents “where did it go?”.</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-faint mb-1">What varies</p>
            <p className="text-sm leading-relaxed text-text-muted">Deep sidebar (Favorites + Locations + Tags), searchable list/column toggle, and archive-specific allowedContentTypes.</p>
          </div>
          <div className="rounded-xl border border-[#0a84ff]/20 bg-[#eff6ff] p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0a84ff] mb-1">What user gains</p>
            <p className="text-sm leading-relaxed text-text-muted">Visible path, “will replace” safety, and a New Folder flow — without leaving the sheet.</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#d6d3d1] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <div className="flex h-[52px] items-center gap-3 border-b border-border bg-[#f5f5f4] px-4">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#d9a01d]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840] border border-[#1fac2e]" />
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-white border border-border px-2.5 py-1 text-xs font-mono">◧ Workspace · 128 items</span>
            <span className="text-sm font-medium">Studio Workspace</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-text-faint">Last backup: 3 hours ago</span>
              <button onClick={() => setPanelOpen(true)} className="rounded-full bg-[#0a84ff] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0066cc]">Archive…</button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-0">
            {/* Main app + sheet */}
            <div className="relative bg-[#fcfcfa] min-h-[620px] overflow-hidden">
              {/* project tree faint */}
              <div className="absolute inset-0 p-6 opacity-50 pointer-events-none">
                <div className="rounded-xl border border-border bg-white shadow-sm p-4">
                  <p className="font-mono text-xs font-semibold tracking-widest uppercase text-text-faint">Workspace · 3 targets · 42 files</p>
                  <div className="mt-3 grid gap-2 font-mono text-xs">
                    <div className="flex items-center gap-2"><span className="text-[#0a84ff]">▭</span> StudioApp.xcworkspace <span className="ml-auto text-text-faint">Today</span></div>
                    <div className="flex items-center gap-2"><span className="text-text-faint">⬚</span> Package.swift <span className="ml-auto text-text-faint">Aug 18</span></div>
                    <div className="flex items-center gap-2"><span className="text-[#0a84ff]">▭</span> Sources <span className="ml-auto text-text-faint">Aug 12</span></div>
                  </div>
                </div>
              </div>

              {!panelOpen && (
                <button onClick={() => setPanelOpen(true)} className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[#1c1917] px-4 py-2 text-xs font-semibold text-white shadow-lg">
                  Re-open Save Panel
                </button>
              )}

              {/* sheet — always expanded */}
              <div className={`absolute inset-x-3 top-0 sm:inset-x-4 transition-all duration-300 ${panelOpen ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0 pointer-events-none"}`}>
                <div className="mx-auto max-w-[640px] overflow-hidden rounded-b-xl border border-[#c9c7c5] bg-[#ececec] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                  <div className="bg-gradient-to-b from-[#f6f6f6] to-[#ececec] border-b border-[#d6d3d1] px-5 py-2.5 text-center">
                    <p className="text-[13px] font-semibold">Archive Workspace</p>
                    <p className="text-xs text-text-muted">isExpanded = true — Finder browser visible on open</p>
                  </div>

                  <div className="px-5 py-4 space-y-3 bg-[#ececec]">
                    <div className="flex items-center gap-3">
                      <label className="w-[68px] shrink-0 text-right text-[13px] font-medium text-[#3f3f46]">Save As:</label>
                      <div className="flex-1 flex items-center gap-2">
                        <input value={name} onChange={(e) => setName(e.target.value)} className={`w-full rounded-md border bg-white px-3 py-[7px] text-[13px] outline-none ${error ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200" : "border-[#c9c7c5] focus:border-[#0a84ff] focus:ring-[3px] focus:ring-[#0a84ff]/20"}`} />
                        <span className="grid h-7 w-7 place-items-center rounded-md border border-[#c9c7c5] bg-zinc-100 text-zinc-400 cursor-not-allowed" title="isExpanded is locked true in this scenario">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="rotate-180">
                            <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    {error && (
                      <div className="flex gap-3">
                        <span className="w-[68px] shrink-0" />
                        <p className="text-xs text-red-600">{error}</p>
                        <span className="w-7 shrink-0" />
                      </div>
                    )}
                    {duplicate && !error && (
                      <div className="flex gap-3">
                        <span className="w-[68px] shrink-0" />
                        <p className="text-xs text-amber-700 flex items-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2.5 10.2 9.5H1.8L6 2.5Z" stroke="#b45309" strokeWidth="1.1" strokeLinejoin="round" /></svg>
                          “{fileName}” already exists here. Replacing it will overwrite the archive.
                        </p>
                        <span className="w-7 shrink-0" />
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <label className="w-[68px] shrink-0 text-right text-[13px] font-medium text-[#3f3f46]">Format:</label>
                      <div className="relative flex-1">
                        <button onClick={() => setShowFormatMenu((v) => !v)} className="flex w-full items-center gap-2 rounded-md border border-[#c9c7c5] bg-gradient-to-b from-white to-[#fafaf9] px-3 py-[7px] text-left shadow-sm">
                          <span className="flex-1 text-[13px]">
                            {format.label} <span className="font-mono text-xs text-text-faint">· .{format.ext} · {format.desc}</span>
                          </span>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0 text-zinc-500"><path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        {showFormatMenu && (
                          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-lg border border-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                            {FORMATS.map((f) => (
                              <button key={f.id} onClick={() => { setFormat(f); setShowFormatMenu(false); }} className={`flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-[#f5f5f4] ${format.id === f.id ? "bg-[#0a84ff] text-white hover:bg-[#0a84ff]" : ""}`}>
                                <span className={`text-sm font-medium ${format.id === f.id ? "text-white" : "text-zinc-900"}`}>{f.label}</span>
                                <span className={`font-mono text-xs ${format.id === f.id ? "text-white/80" : "text-text-faint"}`}> .{f.ext}</span>
                                <span className={`hidden sm:inline text-xs ${format.id === f.id ? "text-white/70" : "text-text-muted"}`}>{f.desc}</span>
                                {format.id === f.id && <span className="ml-auto text-white">✓</span>}
                              </button>
                            ))}
                            <div className="border-t border-border bg-[#fafaf9] px-3 py-2"><p className="font-mono text-[10px] text-text-faint">allowedContentTypes = [.zip, .tar.gz, .dmg] · extension follows choice</p></div>
                          </div>
                        )}
                      </div>
                      <span className="w-7 shrink-0" />
                    </div>

                    {/* expanded browser — always visible */}
                    <div className="overflow-hidden rounded-lg border border-[#d6d3d1] bg-white flex h-[340px]">
                      <aside className="hidden sm:flex w-[160px] shrink-0 flex-col border-r border-[#e7e5e4] bg-[#f5f5f4] overflow-hidden">
                        <div className="flex-1 overflow-y-auto col-scroll py-2">
                          {SIDEBAR_GROUPS.map((g) => (
                            <div key={g.title} className="mb-3 px-2">
                              <p className="px-2 mb-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">{g.title}</p>
                              {g.items.map((it) => (
                                <button key={it} onClick={() => { setSidebarSel(it); setPath([it, "Projects", "Studio Archive"]); setWhere([it, "Projects", "Studio Archive"].join(" › ")); }} className={`flex w-full rounded-md px-2 py-1.5 text-left text-xs ${sidebarSel === it ? "bg-[#0a84ff] text-white" : "text-zinc-700 hover:bg-black/5"}`}>
                                  {it}
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      </aside>

                      <div className="flex flex-1 flex-col min-w-0">
                        <div className="flex h-8 items-center gap-2 border-b border-[#e7e5e4] bg-[#fafaf9] px-2">
                          <div className="flex items-center gap-1">
                            <button className="grid h-6 w-6 place-items-center rounded-md border border-border bg-white text-text-muted">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2.5 3.5 6l4 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                            <button className="grid h-6 w-6 place-items-center rounded-md border border-border bg-white text-text-faint">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5 8.5 6l-4 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                          </div>
                          <div className="hidden sm:flex items-center gap-1 text-xs text-text-muted">
                            {path.map((seg, i) => (
                              <span key={seg} className="flex items-center gap-1">
                                {i > 0 && <span className="text-text-faint">›</span>}
                                <button onClick={() => { const n = path.slice(0, i + 1); setPath(n); setWhere(n.join(" › ")); }} className={`rounded px-1.5 py-0.5 hover:bg-black/5 ${i === path.length - 1 ? "font-semibold text-foreground bg-white border border-border" : ""}`}>{seg}</button>
                              </span>
                            ))}
                          </div>
                          <span className="sm:hidden text-xs font-medium truncate">{path[path.length - 1]}</span>
                          <div className="ml-auto hidden sm:flex items-center gap-1">
                            <button onClick={() => setView("list")} className={`rounded-md border px-1.5 py-1 font-mono text-[10px] ${view === "list" ? "bg-[#0a84ff] text-white border-[#0a84ff]" : "bg-white border-border text-text-muted"}`}>≡</button>
                            <button onClick={() => setView("column")} className={`rounded-md border px-1.5 py-1 font-mono text-[10px] ${view === "column" ? "bg-[#0a84ff] text-white border-[#0a84ff]" : "bg-white border-border text-text-muted"}`}>▦</button>
                          </div>
                          <label className="ml-2 flex items-center gap-1.5 rounded-full border border-border bg-white px-2 py-1 focus-within:border-[#0a84ff] focus-within:ring-2 focus-within:ring-[#0a84ff]/20">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="3.2" stroke="#a8a29e" strokeWidth="1.1" /><path d="M7.5 7.5 9.5 9.5" stroke="#a8a29e" strokeWidth="1.1" strokeLinecap="round" /></svg>
                            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="w-[70px] bg-transparent text-xs outline-none placeholder:text-text-faint" />
                          </label>
                        </div>

                        <div className="flex items-center border-b border-[#e7e5e4] bg-white px-3 py-1.5 text-[11px] font-medium text-text-faint">
                          <span className="flex-1">Name</span>
                          <span className="hidden sm:inline w-20 text-right">Size</span>
                          <span className="hidden sm:inline w-24 text-right">Modified</span>
                        </div>

                        {!showNewFolder ? (
                          <div className="flex-1 overflow-y-auto col-scroll divide-y divide-[#f5f5f4]">
                            {filtered.length === 0 ? (
                              <div className="grid place-items-center h-32 p-6 text-center">
                                <p className="text-sm text-text-faint">No matches for “{search}”</p>
                                <button onClick={() => setSearch("")} className="mt-2 text-xs font-medium text-[#0a84ff] hover:underline">Clear search</button>
                              </div>
                            ) : (
                              filtered.map((f) => {
                                const dup = f.kind === "file" && f.name.toLowerCase() === fileName.toLowerCase();
                                const sel = selected === f.name;
                                return (
                                  <button key={f.name} onClick={() => f.kind === "folder" ? (setPath([...path, f.name]), setWhere([...path, f.name].join(" › "))) : setSelected(f.name)} className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] ${sel ? "bg-[#0a84ff] text-white" : dup ? "bg-amber-50" : "hover:bg-[#f5f5f4]"}`}>
                                    <span className={`grid h-6 w-6 place-items-center rounded text-[10px] ${f.kind === "folder" ? "bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/15" : sel ? "bg-white/20 text-white" : "bg-white border border-border text-text-muted"}`}>{f.kind === "folder" ? "▭" : "⬚"}</span>
                                    <span className="flex-1 truncate">{f.name}</span>
                                    {dup && !sel && <span className="rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-700">will replace</span>}
                                    <span className={`hidden sm:inline w-20 text-right font-mono text-xs ${sel ? "text-white/70" : "text-text-faint"}`}>{f.size ?? "—"}</span>
                                    <span className={`hidden sm:inline w-24 text-right text-xs ${sel ? "text-white/70" : "text-text-muted"}`}>{f.modified}</span>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        ) : (
                          <div className="flex-1 grid place-items-center p-6">
                            <div className="w-full max-w-[280px] rounded-xl border border-border bg-[#fafaf9] p-4">
                              <h4 className="text-sm font-semibold">New Folder</h4>
                              <p className="text-xs text-text-muted mt-1">Creates inside “{path[path.length - 1]}”</p>
                              <input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") createFolder(); if (e.key === "Escape") setShowNewFolder(false); }} placeholder="Untitled folder" autoFocus className="mt-3 w-full rounded-md border border-border bg-white px-3 py-1.5 text-sm outline-none focus:border-[#0a84ff] focus:ring-2 focus:ring-[#0a84ff]/20" />
                              <div className="mt-3 flex justify-end gap-2">
                                <button onClick={() => setShowNewFolder(false)} className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium">Cancel</button>
                                <button onClick={createFolder} className="rounded-full bg-[#0a84ff] px-3 py-1.5 text-xs font-semibold text-white">Create</button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex h-8 items-center justify-between border-t border-[#e7e5e4] bg-[#fafaf9] px-2">
                          <button onClick={() => setShowNewFolder(true)} className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium hover:bg-[#fafaf9]">New Folder</button>
                          <span className="font-mono text-[11px] text-text-faint hidden sm:inline">{path.join("/")}</span>
                          <span className="text-[11px] text-text-faint">{filtered.length} items{search ? ` · filtered` : ""}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-[#ececec] px-5 py-3 border-t border-[#d6d3d1]">
                    <span className="hidden sm:inline text-xs text-text-muted">Sandbox access granted on Save</span>
                    <div className="flex items-center gap-2 ml-auto">
                      <button onClick={() => setPanelOpen(false)} className="rounded-md border border-[#c9c7c5] bg-white px-4 py-1.5 text-[13px] font-medium shadow-sm">Cancel</button>
                      <button onClick={handleSave} disabled={!!error || !stripExt(name).trim()} className="rounded-md bg-[#0a84ff] px-5 py-1.5 text-[13px] font-semibold text-white shadow-sm disabled:opacity-40">{duplicate ? "Replace" : "Save Archive"}</button>
                    </div>
                  </div>
                </div>
              </div>

              {confirm && (
                <div className="absolute inset-0 z-10 grid place-items-center bg-black/25 backdrop-blur-[1px] p-4">
                  <div className="w-full max-w-[360px] rounded-xl border border-border bg-white shadow-xl p-5">
                    <h3 className="text-sm font-semibold">Replace “{fileName}”?</h3>
                    <p className="text-xs leading-relaxed text-text-muted mt-1">An archive with the same name already exists in “{where}”. Replacing it will overwrite the existing file.</p>
                    <div className="flex justify-end gap-2 mt-4">
                      <button onClick={() => setConfirm(false)} className="rounded-full border border-border bg-white px-4 py-1.5 text-xs font-medium">Cancel</button>
                      <button onClick={handleSave} className="rounded-full bg-[#0a84ff] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0066cc]">Replace</button>
                    </div>
                  </div>
                </div>
              )}
              {toast && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
                  <div className="rounded-full bg-[#1c1917] px-4 py-2 text-xs font-medium text-white shadow-lg flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-white/15">✓</span>{toast}</div>
                </div>
              )}
            </div>

            {/* right rail */}
            <div className="bg-white p-6 border-t lg:border-t-0 lg:border-l border-border">
              <h3 className="text-sm font-semibold">Location is the decision</h3>
              <p className="text-sm leading-relaxed text-text-muted mt-2">
                In this tool the <em>where</em> matters more than the name. Recents lie, folders branch, and search must be live. The save panel
                keeps all three visible without leaving the sheet.
              </p>

              <div className="mt-5 rounded-xl border border-border bg-[#fafaf9] p-4">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Try deep browsing</p>
                <ol className="mt-2 space-y-1.5 text-xs leading-relaxed text-text-muted list-decimal list-inside">
                  <li>Click a folder (e.g. “Brand”) — path updates, Where follows.</li>
                  <li>Search “2024” — list filters, “will replace” stays honest.</li>
                  <li>Change Format to .dmg — filename updates to “{makeFileName(name, FORMATS[2])}”.</li>
                  <li>Click New Folder → create “2025-Q3” inline.</li>
                </ol>
              </div>

              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-semibold text-amber-900">Why isExpanded is locked</p>
                <p className="text-xs leading-relaxed text-amber-900/80 mt-1">For archives the app sets isExpanded = true before showing the sheet. The disclosure chevron is disabled — the workflow demands the browser.</p>
              </div>

              <div className="mt-4 space-y-2">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">allowedContentTypes</p>
                {FORMATS.map((f) => (
                  <div key={f.id} className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${format.id === f.id ? "bg-[#0a84ff] border-[#0a84ff] text-white" : "bg-white border-border"}`}>
                    <span className={`text-sm font-semibold ${format.id === f.id ? "text-white" : "text-zinc-900"}`}>{f.label}</span>
                    <span className={`font-mono text-xs ${format.id === f.id ? "text-white/80" : "text-text-faint"}`}> .{f.ext}</span>
                    <span className={`ml-auto text-xs hidden xl:inline ${format.id === f.id ? "text-white/70" : "text-text-muted"}`}>{f.desc}</span>
                    {format.id === f.id && <span className="ml-auto xl:ml-2 text-white text-xs">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <Link href="/scenarios/document-save" className="text-text-muted hover:text-[#0a84ff]">
            ← Document Save
          </Link>
          <Link href="/" className="text-text-muted hover:text-[#0a84ff]">
            Back to anatomy ↑
          </Link>
        </div>
      </div>
    </div>
  );
}
