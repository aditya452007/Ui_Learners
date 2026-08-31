"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

type FormatOpt = { id: string; label: string; ext: string };
const FORMATS: FormatOpt[] = [
  { id: "md", label: "Markdown", ext: "md" },
  { id: "txt", label: "Plain Text", ext: "txt" },
];

function stripExt(n: string) {
  const i = n.lastIndexOf(".");
  return i > 0 ? n.slice(0, i) : n;
}
function validate(name: string) {
  const b = stripExt(name) || name;
  if (!b.trim()) return "Provide a file name.";
  if (b.includes("/") || b.includes(":")) return 'Names cannot contain “:” or “/”.';
  if (b === "." || b === "..") return "Not a valid name.";
  return null;
}

const SIDEBAR = [
  { id: "icloud", label: "iCloud Drive", icon: "☁" },
  { id: "desktop", label: "Desktop", icon: "▭" },
  { id: "documents", label: "Documents", icon: "▭" },
  { id: "downloads", label: "Downloads", icon: "↓" },
];

const FILES_BASE: { name: string; kind: "folder" | "file"; modified: string }[] = [
  { name: "Notes", kind: "folder", modified: "Today" },
  { name: "Drafts", kind: "folder", modified: "Today" },
  { name: "meeting-2026-08-20.md", kind: "file", modified: "Aug 20" },
  { name: "ideas.txt", kind: "file", modified: "Aug 18" },
  { name: "reading-list.md", kind: "file", modified: "Aug 12" },
];

export default function DocumentSaveScenario() {
  const [docText] = useState(`# Summer offsite notes

- Venue: Harbor Loft — booked for Aug 28
- Catering: confirm vegan options
- Talks: 3 lightning, 1 workshop

> Next: share agenda with team`);

  const [name, setName] = useState("Offsite notes");
  const [format, setFormat] = useState<FormatOpt>(FORMATS[0]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [where, setWhere] = useState("iCloud Drive");
  const [sidebarSel, setSidebarSel] = useState("icloud");
  const [path, setPath] = useState(["iCloud Drive"]);
  const [files, setFiles] = useState(FILES_BASE);
  const [showWhereMenu, setShowWhereMenu] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [confirm, setConfirm] = useState(false);

  const fileName = `${stripExt(name) || "Untitled"}.${format.ext}`;
  const error = validate(name);
  const duplicate = useMemo(() => files.some((f) => f.kind === "file" && f.name.toLowerCase() === fileName.toLowerCase()), [files, fileName]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2800);
      return () => clearTimeout(t);
    }
  }, [toast]);

  function handleSave() {
    if (error) return;
    if (duplicate && !confirm) {
      setConfirm(true);
      return;
    }
    setToast(`Saved “${fileName}” to ${where}`);
    setConfirm(false);
    setPanelOpen(false);
    setTimeout(() => setPanelOpen(true), 500);
  }

  function createFolder() {
    const n = newFolderName.trim();
    if (!n) return;
    if (n.includes("/") || n.includes(":")) return;
    if (files.some((f) => f.name === n)) return;
    setFiles((p) => [{ name: n, kind: "folder", modified: "Today" }, ...p]);
    setNewFolderName("");
    setShowNewFolder(false);
    setPath([...path, n]);
    setWhere([...path, n].join(" › "));
  }

  return (
    <div className="min-h-screen bg-[#fcfcfa]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 font-medium text-text-muted hover:text-foreground hover:border-border-strong transition-colors">
            ← Anatomy
          </Link>
          <span className="text-text-faint">/</span>
          <span className="font-mono text-xs tracking-widest uppercase text-text-faint">Scenario 2 · Document Save · Collapsed-first</span>
          <div className="ml-auto flex gap-2">
            <Link href="/scenarios/archive-project" className="rounded-full bg-[#0a84ff] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0066cc] transition-colors">
              Next: Archive →
            </Link>
          </div>
        </div>

        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight">Document Save — the minimal save, with a reveal</h1>
          <p className="mt-3 text-lg leading-relaxed text-text-muted">
            A quiet markdown editor. <strong>⌘S</strong> opens the Save Panel collapsed — just name, where, and format. The disclosure arrow is
            the whole lesson: same dialog, two densities.
          </p>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-faint mb-1">Why collapsed first</p>
            <p className="text-sm leading-relaxed text-text-muted">Most saves go to the same place. Showing only “Where” as a dropdown keeps the sheet small and fast.</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-faint mb-1">What varies</p>
            <p className="text-sm leading-relaxed text-text-muted">Only two allowedContentTypes (Markdown / Text). Disclosure toggles to reveal the Finder browser, New Folder, and duplicate handling.</p>
          </div>
          <div className="rounded-xl border border-[#0a84ff]/20 bg-[#eff6ff] p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0a84ff] mb-1">What user gains</p>
            <p className="text-sm leading-relaxed text-text-muted">One keystroke to save quickly; one click to browse precisely — without learning two different dialogs.</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#d6d3d1] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <div className="flex h-[52px] items-center gap-3 border-b border-border bg-[#fafaf9] px-4">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#d9a01d]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840] border border-[#1fac2e]" />
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Unsaved
            </span>
            <span className="text-sm font-medium">Offsite notes — PlainText</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-text-faint">Auto-saved</span>
              <button onClick={() => setPanelOpen(true)} className="rounded-full bg-[#1c1917] px-4 py-1.5 text-xs font-semibold text-white hover:bg-black">
                Save…
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.35fr_0.9fr] gap-0">
            {/* Editor + sheet */}
            <div className="relative bg-[#fcfcfa] min-h-[560px] border-r border-border overflow-hidden">
              {/* editor */}
              <div className="p-6 sm:p-8">
                <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between border-b border-border bg-[#fafaf9] px-4 py-2">
                    <span className="font-mono text-xs text-text-muted">offsite-notes.md — Markdown · 248 words</span>
                    <span className="font-mono text-xs text-text-faint">UTF-8</span>
                  </div>
                  <pre className="p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap text-zinc-800">{docText}</pre>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-text-muted">
                  <span className="rounded-full border border-border bg-white px-3 py-1">#offsite</span>
                  <span className="rounded-full border border-border bg-white px-3 py-1">#planning</span>
                  <span className="rounded-full bg-[#0a84ff] text-white px-3 py-1">⌘S to save</span>
                </div>
              </div>

              {!panelOpen && (
                <button onClick={() => setPanelOpen(true)} className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[#1c1917] px-4 py-2 text-xs font-semibold text-white shadow-lg">
                  Re-open Save Panel
                </button>
              )}

              {/* sheet */}
              <div className={`absolute inset-x-3 top-0 sm:inset-x-6 transition-all duration-300 ${panelOpen ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0 pointer-events-none"}`}>
                <div className="mx-auto max-w-[540px] overflow-hidden rounded-b-xl border border-[#c9c7c5] bg-[#ececec] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                  <div className="bg-gradient-to-b from-[#f6f6f6] to-[#ececec] border-b border-[#d6d3d1] px-5 py-2.5 text-center">
                    <p className="text-[13px] font-semibold">Save</p>
                    <p className="text-xs text-text-muted">Compact first — click the arrow to browse</p>
                  </div>

                  <div className="px-5 py-4 space-y-3 bg-[#ececec]">
                    <div className="flex items-center gap-3">
                      <label className="w-[68px] shrink-0 text-right text-[13px] font-medium text-[#3f3f46]">Save As:</label>
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Untitled"
                          className={`w-full rounded-md border bg-white px-3 py-[7px] text-[13px] outline-none ${error ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200" : "border-[#c9c7c5] focus:border-[#0a84ff] focus:ring-[3px] focus:ring-[#0a84ff]/20"}`}
                        />
                        <button
                          onClick={() => setIsExpanded((v) => !v)}
                          className="grid h-7 w-7 place-items-center rounded-md border border-[#c9c7c5] bg-white shadow-sm hover:bg-[#fafaf9]"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                            <path d="M3 4.5 6 7.5 9 4.5" stroke="#57534e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {error && (
                      <div className="flex gap-3">
                        <span className="w-[68px] shrink-0" />
                        <p className="text-xs text-red-600">{error}</p>
                        <span className="w-7 shrink-0" />
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <label className="w-[68px] shrink-0 text-right text-[13px] font-medium text-[#3f3f46]">Where:</label>
                      <div className="relative flex-1">
                        <button onClick={() => setShowWhereMenu((v) => !v)} className="flex w-full items-center gap-2 rounded-md border border-[#c9c7c5] bg-white px-3 py-[7px] text-left">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0"><path d="M2 4.5A1.2 1.2 0 0 1 3.2 3.3h2.6L7 4.5H11.8A1.2 1.2 0 0 1 13 5.7V10A1.2 1.2 0 0 1 11.8 11.2H3.2A1.2 1.2 0 0 1 2 10V4.5Z" fill="#0a84ff" fillOpacity=".12" stroke="#0a84ff" strokeWidth="1" /></svg>
                          <span className="flex-1 truncate text-[13px]">{where}</span>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0 text-zinc-400"><path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        {showWhereMenu && (
                          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-lg border border-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                            {SIDEBAR.map((s) => (
                              <button key={s.id} onClick={() => { setSidebarSel(s.id); setWhere(s.label); setPath([s.label]); setShowWhereMenu(false); }} className={`flex w-full px-3 py-2 text-left text-sm hover:bg-[#f5f5f4] ${sidebarSel === s.id ? "bg-[#0a84ff] text-white" : ""}`}>{s.label}</button>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="w-7 shrink-0" />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="w-[68px] shrink-0 text-right text-[13px] font-medium text-[#3f3f46]">Format:</label>
                      <div className="relative flex-1">
                        <button onClick={() => setShowFormatMenu((v) => !v)} className="flex w-full items-center gap-2 rounded-md border border-[#c9c7c5] bg-gradient-to-b from-white to-[#fafaf9] px-3 py-[7px] text-left shadow-sm">
                          <span className="flex-1 text-[13px]">
                            {format.label} <span className="font-mono text-xs text-text-faint">· .{format.ext}</span>
                          </span>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0 text-zinc-500"><path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        {showFormatMenu && (
                          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-lg border border-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                            {FORMATS.map((f) => (
                              <button key={f.id} onClick={() => { setFormat(f); setShowFormatMenu(false); }} className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-[#f5f5f4] ${format.id === f.id ? "bg-[#0a84ff] text-white" : ""}`}>
                                <span className={`text-sm ${format.id === f.id ? "text-white font-medium" : "text-zinc-900"}`}>{f.label}</span>
                                <span className={`font-mono text-xs ${format.id === f.id ? "text-white/80" : "text-text-faint"}`}> .{f.ext}</span>
                                {format.id === f.id && <span className="ml-auto text-white">✓</span>}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="w-7 shrink-0" />
                    </div>

                    {/* expanded area with animation */}
                    <div className={`grid transition-all duration-300 ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <div className="overflow-hidden rounded-lg border border-[#d6d3d1] bg-white flex h-[260px]">
                          <aside className="hidden sm:flex w-[148px] flex-col border-r border-[#e7e5e4] bg-[#f5f5f4] p-2">
                            <p className="px-2 mb-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Favorites</p>
                            {SIDEBAR.map((s) => (
                              <button key={s.id} onClick={() => { setSidebarSel(s.id); setWhere(s.label); setPath([s.label]); }} className={`rounded-md px-2 py-1.5 text-left text-xs ${sidebarSel === s.id ? "bg-[#0a84ff] text-white" : "text-zinc-700 hover:bg-black/5"}`}>{s.label}</button>
                            ))}
                          </aside>
                          <div className="flex flex-1 flex-col min-w-0">
                            <div className="flex h-7 items-center gap-2 border-b border-[#e7e5e4] bg-[#fafaf9] px-2">
                              <span className="text-xs text-text-muted truncate">{path.join(" › ")}</span>
                              <span className="ml-auto font-mono text-[11px] text-text-faint">{files.length} items</span>
                            </div>
                            {!showNewFolder ? (
                              <div className="flex-1 overflow-y-auto divide-y divide-[#f5f5f4]">
                                {files.map((f) => {
                                  const dup = f.kind === "file" && f.name.toLowerCase() === fileName.toLowerCase();
                                  const sel = selected === f.name;
                                  return (
                                    <button key={f.name} onClick={() => f.kind === "folder" ? (setPath([...path, f.name]), setWhere([...path, f.name].join(" › "))) : setSelected(f.name)} className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] ${sel ? "bg-[#0a84ff] text-white" : dup ? "bg-amber-50" : "hover:bg-[#f5f5f4]"}`}>
                                      <span className={`h-5 w-5 grid place-items-center rounded text-[10px] ${f.kind === "folder" ? "bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/15" : sel ? "bg-white/20 text-white" : "bg-white border border-border text-text-muted"}`}>{f.kind === "folder" ? "▭" : "⬚"}</span>
                                      <span className="flex-1 truncate">{f.name}</span>
                                      {dup && !sel && <span className="rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-700">will replace</span>}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="flex-1 grid place-items-center p-6 text-center">
                                <div className="w-full max-w-[280px] rounded-xl border border-border bg-[#fafaf9] p-4">
                                  <h4 className="text-sm font-semibold">New Folder</h4>
                                  <input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") createFolder(); if (e.key === "Escape") setShowNewFolder(false); }} placeholder="Untitled folder" autoFocus className="mt-3 w-full rounded-md border border-border bg-white px-3 py-1.5 text-sm outline-none focus:border-[#0a84ff] focus:ring-2 focus:ring-[#0a84ff]/20" />
                                  <div className="mt-3 flex justify-end gap-2">
                                    <button onClick={() => setShowNewFolder(false)} className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium">Cancel</button>
                                    <button onClick={createFolder} className="rounded-full bg-[#0a84ff] px-3 py-1.5 text-xs font-semibold text-white">Create</button>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="flex h-8 items-center justify-between border-t border-[#e7e5e4] bg-[#fafaf9] px-2">
                              <button onClick={() => setShowNewFolder(true)} className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium">New Folder</button>
                              <span className="text-[11px] font-mono text-text-faint hidden sm:inline">{path.join("/")}</span>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-center font-mono text-[10px] text-text-faint">Disclosure toggled — same Save, Finder-level control when you need it</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-[#ececec] px-5 py-3 border-t border-[#d6d3d1]">
                    <span className="hidden sm:inline text-xs text-text-muted">{isExpanded ? "Expanded · Finder sidebar + list" : "Collapsed · Where is a dropdown"}</span>
                    <div className="flex items-center gap-2 ml-auto">
                      <button onClick={() => setPanelOpen(false)} className="rounded-md border border-[#c9c7c5] bg-white px-4 py-1.5 text-[13px] font-medium shadow-sm">Cancel</button>
                      <button onClick={handleSave} disabled={!!error || !stripExt(name).trim()} className="rounded-md bg-[#0a84ff] px-5 py-1.5 text-[13px] font-semibold text-white shadow-sm disabled:opacity-40">{duplicate ? "Replace" : "Save"}</button>
                    </div>
                  </div>
                </div>
              </div>

              {confirm && (
                <div className="absolute inset-0 z-10 grid place-items-center bg-black/25 backdrop-blur-[1px] p-4">
                  <div className="w-full max-w-[360px] rounded-xl border border-border bg-white shadow-xl p-5">
                    <h3 className="text-sm font-semibold">Replace “{fileName}”?</h3>
                    <p className="text-xs leading-relaxed text-text-muted mt-1">A file named “{fileName}” already exists in “{where}”. Do you want to replace it?</p>
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

            {/* collapsed vs expanded explainer */}
            <div className="bg-white p-6 border-t lg:border-t-0 border-border">
              <h3 className="text-sm font-semibold">isExpanded — two densities, one truth</h3>
              <p className="text-sm leading-relaxed text-text-muted mt-2">
                <strong>Collapsed (now {isExpanded ? "off" : "on"})</strong> is for speed: Save As, Where dropdown, Format.{" "}
                <strong>Expanded</strong> is for precision: sidebar, file list, breadcrumbs, New Folder, and search — but the name field never
                moves. Validation and overwrite checks run the same either way.
              </p>

              <div className="mt-5 grid gap-3">
                <button
                  onClick={() => setIsExpanded((v) => !v)}
                  className="flex items-center justify-between rounded-xl border border-border bg-[#fafaf9] px-4 py-3 hover:border-[#0a84ff]/30 hover:bg-white transition-colors"
                >
                  <div className="text-left">
                    <p className="text-sm font-semibold">Toggle disclosure</p>
                    <p className="text-xs text-text-muted">Simulates clicking the chevron next to Save As</p>
                  </div>
                  <span className={`grid h-8 w-8 place-items-center rounded-full border shadow-sm ${isExpanded ? "bg-[#0a84ff] text-white border-[#0a84ff]" : "bg-white text-text-muted border-border"}`}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={isExpanded ? "rotate-180" : ""}>
                      <path d="M3.5 5 7 8.5 10.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-semibold text-amber-900">Try the flow</p>
                  <ol className="mt-1.5 space-y-1 list-decimal list-inside text-xs leading-relaxed text-amber-900/80">
                    <li>
                      With panel collapsed, change <span className="font-mono bg-white border border-amber-200 rounded px-1">Where</span> — it’s a
                      dropdown.
                    </li>
                    <li>Click the chevron to expand — Where becomes a path bar, sidebar appears, New Folder works.</li>
                    <li>Rename to <span className="font-mono bg-white border border-amber-200 rounded px-1">reading-list</span> → see “will replace” highlight before you Save.</li>
                  </ol>
                </div>

                <div className="rounded-xl bg-white border border-border p-4">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">allowedContentTypes</p>
                  <div className="mt-2 flex gap-2">
                    {FORMATS.map((f) => (
                      <span key={f.id} className={`flex-1 rounded-lg border px-3 py-2 text-center ${format.id === f.id ? "bg-[#0a84ff] text-white border-[#0a84ff]" : "bg-[#fafaf9] text-text-muted border-border"}`}>
                        <span className="block text-sm font-semibold">{f.label}</span>
                        <span className="font-mono text-xs opacity-80">.{f.ext}</span>
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 font-mono text-[11px] text-text-faint">Only two UTIs — pop-up still appears, but with just two rows. One UTI would hide it.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <Link href="/scenarios/poster-export" className="text-text-muted hover:text-[#0a84ff]">
            ← Poster Export
          </Link>
          <Link href="/scenarios/archive-project" className="text-[#0a84ff] font-medium hover:underline">
            Next: Archive Project →
          </Link>
        </div>
      </div>
    </div>
  );
}
