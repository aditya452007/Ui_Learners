"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

type FormatOpt = { id: string; label: string; ext: string; desc: string; est: string };
const FORMATS: FormatOpt[] = [
  { id: "png", label: "PNG", ext: "png", desc: "Lossless, transparency", est: "4.2 MB" },
  { id: "jpeg", label: "JPEG", ext: "jpg", desc: "Photo, smallest", est: "1.1 MB" },
  { id: "pdf", label: "PDF", ext: "pdf", desc: "Vector + print", est: "2.8 MB" },
  { id: "svg", label: "SVG", ext: "svg", desc: "Infinite scale", est: "86 KB" },
  { id: "tiff", label: "TIFF", ext: "tiff", desc: "Print master", est: "18 MB" },
];

function stripExt(n: string) {
  const i = n.lastIndexOf(".");
  return i > 0 ? n.slice(0, i) : n;
}
function validate(name: string) {
  const base = stripExt(name) || name;
  if (!base.trim()) return "Name can't be empty.";
  if (base.includes("/") || base.includes(":")) return '":" and "/" are not allowed.';
  if (base.trim() === "." || base.trim() === "..") return '"." is not valid.';
  if (base.length > 80) return "Name is too long.";
  return null;
}

const SIDEBAR = [
  { id: "recents", label: "Recents" },
  { id: "desktop", label: "Desktop" },
  { id: "documents", label: "Documents" },
  { id: "downloads", label: "Downloads" },
  { id: "studio-exports", label: "Studio Exports" },
];

const EXISTING: { name: string; kind: "folder" | "file"; size?: string; modified: string }[] = [
  { name: "Exports", kind: "folder", modified: "Today" },
  { name: "Archive 2025", kind: "folder", modified: "Yesterday" },
  { name: "Brand pack", kind: "folder", modified: "Aug 22" },
  { name: "summer-poster.png", kind: "file", size: "3.9 MB", modified: "Aug 20" },
  { name: "summer-poster.pdf", kind: "file", size: "2.7 MB", modified: "Aug 20" },
  { name: "summer-poster.jpg", kind: "file", size: "1.0 MB", modified: "Aug 18" },
  { name: "logo-final.svg", kind: "file", size: "38 KB", modified: "Aug 12" },
];

export default function PosterExportScenario() {
  const [name, setName] = useState("Summer Poster");
  const [format, setFormat] = useState<FormatOpt>(FORMATS[0]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [where, setWhere] = useState("Documents › Studio › Exports");
  const [sidebarSel, setSidebarSel] = useState("studio-exports");
  const [path, setPath] = useState(["Documents", "Studio", "Exports"]);
  const [tags, setTags] = useState<string[]>(["client-review", "summer-26"]);
  const [tagInput, setTagInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [whereMenuOpen, setWhereMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [recentSaves, setRecentSaves] = useState<string[]>(["summer-poster.png", "brand-sheet.pdf"]);

  const base = stripExt(name) || "Untitled";
  const fileName = `${base}.${format.ext}`;
  const error = validate(name);
  const duplicate = useMemo(() => EXISTING.some((f) => f.kind === "file" && f.name.toLowerCase() === fileName.toLowerCase()), [fileName]);
  const sizeEst = format.est;

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2800);
      return () => clearTimeout(t);
    }
  }, [toast]);

  function attemptSave() {
    if (error) return;
    if (duplicate && !confirmOverwrite) {
      setConfirmOverwrite(true);
      return;
    }
    setRecentSaves((p) => [fileName, ...p.filter((x) => x !== fileName)].slice(0, 6));
    setToast(`Exported “${fileName}” to ${where} · ${format.label} · ${sizeEst}`);
    setConfirmOverwrite(false);
    setPanelOpen(false);
    setTimeout(() => setPanelOpen(true), 600);
  }

  return (
    <div className="min-h-screen bg-[#fcfcfa]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 font-medium text-text-muted hover:text-foreground hover:border-border-strong transition-colors">
            ← Anatomy
          </Link>
          <span className="text-text-faint">/</span>
          <span className="font-mono text-xs tracking-widest uppercase text-text-faint">Scenario 1 · Poster Export · Format-heavy</span>
          <div className="ml-auto flex gap-2">
            <Link href="/scenarios/document-save" className="rounded-full bg-[#0a84ff] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0066cc] transition-colors">
              Next: Document →
            </Link>
          </div>
        </div>

        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight">Poster Export — five formats, one name field</h1>
          <p className="mt-3 text-lg leading-relaxed text-text-muted">
            A design studio finishes a poster. <strong>File → Export</strong> opens the Save Panel as a sheet. The name stays the source of truth;
            picking a format only swaps the extension — the user never retypes it.
          </p>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-faint mb-1">Why Save Panel here</p>
            <p className="text-sm leading-relaxed text-text-muted">Export is still “save with a name and place” — not a share sheet. The format chooses the UTI, so allowedContentTypes is the gatekeeper.</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-faint mb-1">What varies</p>
            <p className="text-sm leading-relaxed text-text-muted">Five allowedContentTypes (PNG → TIFF). The panel shows a rich pop-up and a duplicate-replace warning.</p>
          </div>
          <div className="rounded-xl border border-[#0a84ff]/20 bg-[#eff6ff] p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0a84ff] mb-1">What user gains</p>
            <p className="text-sm leading-relaxed text-text-muted">One field, zero surprises: type once, flip formats, see the file size estimate change, and catch “will replace” before overwriting.</p>
          </div>
        </div>

        {/* Demo chrome: Studio app + sheet */}
        <div className="overflow-hidden rounded-2xl border border-[#d6d3d1] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          {/* App toolbar */}
          <div className="flex h-[52px] items-center gap-3 border-b border-border bg-[#f5f5f4] px-4">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#d9a01d]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840] border border-[#1fac2e]" />
            </div>
            <div className="hidden sm:flex items-center gap-2 ml-2 text-xs font-medium text-text-muted">
              <span className="rounded-md bg-white border border-border px-2.5 py-1">File</span>
              <span>Edit</span>
              <span>View</span>
              <span className="text-foreground font-semibold">Export</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 ml-4 text-xs">
              <span className="rounded-full bg-white border border-border px-2.5 py-1 font-mono text-[11px] text-text-muted">Summer Poster · 300 dpi · CMYK</span>
            </div>
            <div className="flex-1 flex justify-end items-center gap-2">
              <span className="hidden sm:inline text-xs text-text-faint">Auto-saved 2 min ago</span>
              <button
                onClick={() => setPanelOpen(true)}
                className="rounded-full bg-[#0a84ff] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0066cc] shadow-sm"
              >
                Export…
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-0">
            {/* Canvas + sheet overlay */}
            <div className="relative bg-[#fafaf9] min-h-[540px] overflow-hidden">
              {/* poster canvas */}
              <div className="absolute inset-0 grid place-items-center p-6">
                <div className="w-full max-w-[420px] rounded-xl border border-border bg-white shadow-sm overflow-hidden">
                  <div className="h-44 bg-gradient-to-br from-orange-200 via-pink-200 to-indigo-200 relative">
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-full px-2.5 py-1 text-[11px] font-semibold">STUDIO SUMMER ’26</div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm font-semibold">Summer Poster</p>
                    <p className="text-xs text-text-muted mt-1">A1 · 300 dpi · Export will honor bleed and crop marks.</p>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-[#f5f5f4] p-2 text-center"><p className="font-mono text-[10px] text-text-faint">Size</p><p className="text-xs font-medium">594 × 841</p></div>
                      <div className="rounded-lg bg-[#f5f5f4] p-2 text-center"><p className="font-mono text-[10px] text-text-faint">Colors</p><p className="text-xs font-medium">CMYK</p></div>
                      <div className="rounded-lg bg-[#f5f5f4] p-2 text-center"><p className="font-mono text-[10px] text-text-faint">Est.</p><p className="text-xs font-medium">{sizeEst}</p></div>
                    </div>
                  </div>
                </div>
              </div>

              {!panelOpen && (
                <button
                  onClick={() => setPanelOpen(true)}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[#1c1917] px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-black"
                >
                  Re-open Save Panel
                </button>
              )}

              {/* sheet */}
              <div className={`absolute inset-x-3 top-0 sm:inset-x-4 transition-all duration-300 ${panelOpen ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0 pointer-events-none"}`}>
                <div className="mx-auto max-w-[560px] overflow-hidden rounded-b-xl border border-[#c9c7c5] bg-[#ececec] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                  <div className="bg-gradient-to-b from-[#f6f6f6] to-[#ececec] border-b border-[#d6d3d1] px-5 py-2.5 text-center">
                    <p className="text-[13px] font-semibold">Export “Summer Poster”</p>
                    <p className="text-xs text-text-muted">Sheet slides from Studio’s title bar — document is inert until you Save</p>
                  </div>

                  <div className="px-5 py-4 space-y-3 bg-[#ececec]">
                    <div className="flex items-center gap-3">
                      <label className="w-[68px] shrink-0 text-right text-[13px] font-medium text-[#3f3f46]">Save As:</label>
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full rounded-md border bg-white px-3 py-[7px] text-[13px] outline-none ${error ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200" : "border-[#c9c7c5] focus:border-[#0a84ff] focus:ring-[3px] focus:ring-[#0a84ff]/20"}`}
                        />
                        <button
                          onClick={() => setIsExpanded((v) => !v)}
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                          className="grid h-7 w-7 place-items-center rounded-md border border-[#c9c7c5] bg-white shadow-sm"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`${isExpanded ? "rotate-180" : ""}`}>
                            <path d="M3 4.5 6 7.5 9 4.5" stroke="#57534e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {(error || duplicate) && (
                      <div className="flex gap-3">
                        <span className="w-[68px] shrink-0" />
                        <p className={`text-xs flex items-center gap-1.5 ${error ? "text-red-600" : "text-amber-700"}`}>{error ? error : `“${fileName}” exists. Saving will replace it.`}</p>
                        <span className="w-7 shrink-0" />
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <label className="w-[68px] shrink-0 text-right text-[13px] font-medium text-[#3f3f46]">Tags:</label>
                      <div className="flex-1 flex items-center gap-1.5 rounded-md border border-[#c9c7c5] bg-white px-2 py-1.5">
                        <div className="flex flex-wrap gap-1 flex-1">
                          {tags.map((t) => (
                            <span key={t} className="inline-flex items-center gap-1 rounded-full bg-[#0a84ff] px-2 py-0.5 text-xs font-medium text-white">
                              <span className="h-2 w-2 rounded-full bg-white" />
                              {t}
                              <button onClick={() => setTags((p) => p.filter((x) => x !== t))} className="grid h-3.5 w-3.5 place-items-center rounded-full bg-white/20 hover:bg-white/30">
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 1.5 6.5 6.5M6.5 1.5 1.5 6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" /></svg>
                              </button>
                            </span>
                          ))}
                          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && tagInput.trim()) { const v = tagInput.trim().toLowerCase().replace(/\s+/g, "-"); if (!tags.includes(v)) setTags((p) => [...p, v]); setTagInput(""); } }} placeholder={tags.length ? "" : "Add tags…"} className="min-w-[80px] flex-1 bg-transparent text-[13px] outline-none placeholder:text-zinc-400" />
                        </div>
                      </div>
                      <span className="w-7 shrink-0" />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="w-[68px] shrink-0 text-right text-[13px] font-medium text-[#3f3f46]">Where:</label>
                      <div className="relative flex-1">
                        <button onClick={() => setWhereMenuOpen((v) => !v)} className="flex w-full items-center gap-2 rounded-md border border-[#c9c7c5] bg-white px-3 py-[7px] text-left hover:bg-[#fafaf9]">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0"><path d="M2 4.5A1.2 1.2 0 0 1 3.2 3.3h2.6L7 4.5H11.8A1.2 1.2 0 0 1 13 5.7V10A1.2 1.2 0 0 1 11.8 11.2H3.2A1.2 1.2 0 0 1 2 10V4.5Z" fill="#0a84ff" fillOpacity=".12" stroke="#0a84ff" strokeWidth="1" /></svg>
                          <span className="flex-1 truncate text-[13px]">{where}</span>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0 text-zinc-400"><path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        {whereMenuOpen && (
                          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-lg border border-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                            {SIDEBAR.map((s) => (
                              <button key={s.id} onClick={() => { setSidebarSel(s.id); setWhere(s.label); setPath([s.label, "Studio", "Exports"]); setWhereMenuOpen(false); }} className={`flex w-full px-3 py-2 text-left text-sm hover:bg-[#f5f5f4] ${sidebarSel === s.id ? "bg-[#0a84ff] text-white" : ""}`}>{s.label}</button>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="w-7 shrink-0" />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="w-[68px] shrink-0 text-right text-[13px] font-medium text-[#3f3f46]">Format:</label>
                      <div className="relative flex-1">
                        <button onClick={() => setMenuOpen((v) => !v)} className="flex w-full items-center gap-2 rounded-md border border-[#c9c7c5] bg-gradient-to-b from-white to-[#fafaf9] px-3 py-[7px] text-left shadow-sm">
                          <span className="flex-1 text-[13px]">{format.label} <span className="text-text-faint font-mono text-xs">· .{format.ext} · {format.desc}</span> <span className="ml-2 hidden sm:inline rounded-full bg-[#eff6ff] border border-[#0a84ff]/10 px-2 py-0.5 font-mono text-[11px] text-[#0a84ff]">{sizeEst}</span></span>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0 text-zinc-500"><path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        {menuOpen && (
                          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-lg border border-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                            {FORMATS.map((f) => (
                              <button key={f.id} onClick={() => { setFormat(f); setMenuOpen(false); }} className={`flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-[#f5f5f4] ${format.id === f.id ? "bg-[#0a84ff] text-white hover:bg-[#0a84ff]" : ""}`}>
                                <span className={`text-sm font-medium ${format.id === f.id ? "text-white" : "text-zinc-900"}`}>{f.label}</span>
                                <span className={`font-mono text-xs ${format.id === f.id ? "text-white/80" : "text-text-faint"}`}> .{f.ext}</span>
                                <span className={`hidden sm:inline text-xs ${format.id === f.id ? "text-white/70" : "text-text-muted"}`}>{f.desc}</span>
                                <span className={`ml-auto font-mono text-xs ${format.id === f.id ? "text-white" : "text-text-faint"}`}>{f.est}</span>
                                {format.id === f.id && <span className="text-white">✓</span>}
                              </button>
                            ))}
                            <div className="border-t border-border bg-[#fafaf9] px-3 py-2"><p className="font-mono text-[10px] text-text-faint">allowedContentTypes · {FORMATS.length} UTIs · extension is owned by the choice</p></div>
                          </div>
                        )}
                      </div>
                      <span className="w-7 shrink-0" />
                    </div>

                    {isExpanded && (
                      <div className="pt-1">
                        <div className="overflow-hidden rounded-lg border border-[#d6d3d1] bg-white flex h-[220px]">
                          <aside className="hidden sm:flex w-[148px] flex-col border-r border-[#e7e5e4] bg-[#f5f5f4] p-2">
                            <p className="px-2 mb-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Favorites</p>
                            {SIDEBAR.map((s) => (
                              <button key={s.id} onClick={() => { setSidebarSel(s.id); setWhere(s.label); setPath([s.label, "Studio", "Exports"]); }} className={`rounded-md px-2 py-1.5 text-left text-xs ${sidebarSel === s.id ? "bg-[#0a84ff] text-white" : "text-zinc-700 hover:bg-black/5"}`}>{s.label}</button>
                            ))}
                            <div className="mt-auto rounded-lg border border-dashed border-border bg-white p-2">
                              <p className="font-mono text-[10px] leading-relaxed text-text-faint">Sidebar is Finder — not custom.</p>
                            </div>
                          </aside>
                          <div className="flex flex-1 flex-col min-w-0">
                            <div className="flex h-7 items-center gap-1 border-b border-[#e7e5e4] bg-[#fafaf9] px-2">
                              <span className="text-xs text-text-muted hidden sm:inline">{path.join(" › ")}</span>
                              <span className="sm:hidden text-xs font-medium truncate">{path[path.length - 1]}</span>
                              <span className="ml-auto font-mono text-[11px] text-text-faint">{EXISTING.length} items</span>
                            </div>
                            <div className="flex-1 overflow-y-auto divide-y divide-[#f5f5f4]">
                              {EXISTING.map((f) => {
                                const dup = f.kind === "file" && f.name.toLowerCase() === fileName.toLowerCase();
                                return (
                                  <div key={f.name} className={`flex items-center gap-2 px-3 py-2 text-[13px] ${dup ? "bg-amber-50" : "hover:bg-[#f5f5f4]"}`}>
                                    <span className={`h-5 w-5 grid place-items-center rounded text-[10px] ${f.kind === "folder" ? "bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/15" : "bg-white border border-border"}`}>{f.kind === "folder" ? "▭" : "⬚"}</span>
                                    <span className="flex-1 truncate text-zinc-800">{f.name}</span>
                                    {dup && <span className="rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-700">will replace</span>}
                                    <span className="hidden sm:inline font-mono text-xs text-text-faint w-16 text-right">{f.size ?? "—"}</span>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex h-8 items-center justify-between border-t border-[#e7e5e4] bg-[#fafaf9] px-2">
                              <button className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium">New Folder</button>
                              <span className="text-[11px] font-mono text-text-faint hidden sm:inline">{path.join("/")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 bg-[#ececec] px-5 py-3 border-t border-[#d6d3d1]">
                    <button onClick={() => setPanelOpen(false)} className="rounded-md border border-[#c9c7c5] bg-white px-4 py-1.5 text-[13px] font-medium shadow-sm hover:bg-[#fafaf9]">Cancel</button>
                    <button onClick={attemptSave} disabled={!!error || !base.trim()} className="rounded-md bg-[#0a84ff] px-5 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-[#0066cc] disabled:opacity-40">
                      {duplicate ? "Replace" : "Export"}
                    </button>
                  </div>
                </div>
              </div>

              {confirmOverwrite && (
                <div className="absolute inset-0 z-10 grid place-items-center bg-black/25 backdrop-blur-[1px] p-4">
                  <div className="w-full max-w-[360px] rounded-xl border border-border bg-white shadow-xl p-5">
                    <div className="flex gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-100 text-amber-700 shrink-0">⚠</div>
                      <div>
                        <h3 className="text-sm font-semibold">Replace “{fileName}”?</h3>
                        <p className="text-xs leading-relaxed text-text-muted mt-1">A file with the same name already exists in “{where}”. Replacing it will overwrite its contents.</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button onClick={() => setConfirmOverwrite(false)} className="rounded-full border border-border bg-white px-4 py-1.5 text-xs font-medium">Cancel</button>
                      <button onClick={attemptSave} className="rounded-full bg-[#0a84ff] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0066cc]">Replace</button>
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

            {/* right rail: recent saves */}
            <div className="border-t lg:border-t-0 lg:border-l border-border bg-white p-5">
              <h3 className="text-sm font-semibold">Recent exports</h3>
              <p className="text-xs text-text-muted mt-1">Saved via NSSavePanel — names come from nameFieldStringValue.</p>
              <div className="mt-4 space-y-2">
                {recentSaves.map((r) => (
                  <div key={r} className="flex items-center gap-3 rounded-lg border border-border bg-[#fafaf9] px-3 py-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-md bg-white border border-border text-text-muted text-xs">⬚</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{r}</p>
                      <p className="text-xs text-text-faint">{where} · {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {recentSaves.length === 0 && <p className="text-sm text-text-faint">No exports yet — click Export.</p>}
              </div>
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-semibold text-amber-900">Try the format sync</p>
                <p className="text-xs leading-relaxed text-amber-900/80 mt-1">Type “campaign” then flip Format to PDF — watch the extension follow. Now type “notes: final” to trigger validation.</p>
              </div>
              <div className="mt-4 rounded-xl bg-[#0a84ff]/10 border border-[#0a84ff]/15 p-3">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#0a84ff]">allowedContentTypes</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {FORMATS.map((f) => (
                    <span key={f.id} className={`rounded-full px-2.5 py-1 text-xs font-medium border ${format.id === f.id ? "bg-[#0a84ff] text-white border-[#0a84ff]" : "bg-white text-text-muted border-border"}`}>{f.label} · .{f.ext}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <Link href="/" className="text-text-muted hover:text-[#0a84ff]">← Back to anatomy</Link>
          <Link href="/scenarios/document-save" className="text-[#0a84ff] font-medium hover:underline">Next: Document Save →</Link>
        </div>
      </div>
    </div>
  );
}
