"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

// ──────────────────────────────────────────────
// helpers
// ──────────────────────────────────────────────

type FormatOpt = { id: string; label: string; ext: string; desc: string };
const FORMATS: FormatOpt[] = [
  { id: "png", label: "PNG", ext: "png", desc: "Portable Network Graphics" },
  { id: "jpeg", label: "JPEG", ext: "jpg", desc: "Joint Photographic Experts Group" },
  { id: "pdf", label: "PDF", ext: "pdf", desc: "Portable Document Format" },
  { id: "svg", label: "SVG", ext: "svg", desc: "Scalable Vector Graphics" },
  { id: "tiff", label: "TIFF", ext: "tiff", desc: "Tagged Image File Format" },
];

type SidebarItem = { id: string; label: string; icon: string; count?: number };
const SIDEBAR_GROUPS: { title: string; items: SidebarItem[] }[] = [
  {
    title: "Favorites",
    items: [
      { id: "recents", label: "Recents", icon: "◷" },
      { id: "desktop", label: "Desktop", icon: "▭" },
      { id: "documents", label: "Documents", icon: "▭" },
      { id: "downloads", label: "Downloads", icon: "↓" },
      { id: "applications", label: "Applications", icon: "⧉" },
    ],
  },
  {
    title: "iCloud",
    items: [{ id: "icloud-drive", label: "iCloud Drive", icon: "☁" }],
  },
  {
    title: "Locations",
    items: [
      { id: "macintosh", label: "Macintosh HD", icon: "⬢" },
      { id: "external", label: "Studio SSD", icon: "⬢" },
    ],
  },
];

const FILES: { name: string; kind: "folder" | "file"; modified: string; size?: string }[] = [
  { name: "Exports", kind: "folder", modified: "Today" },
  { name: "Archive 2025", kind: "folder", modified: "Yesterday" },
  { name: "Drafts", kind: "folder", modified: "Aug 28" },
  { name: "poster-final.pdf", kind: "file", modified: "Aug 20", size: "4.2 MB" },
  { name: "poster-v2.png", kind: "file", modified: "Aug 18", size: "1.8 MB" },
  { name: "mood-board.jpg", kind: "file", modified: "Aug 12", size: "3.1 MB" },
  { name: "logo-v3.svg", kind: "file", modified: "Aug 10", size: "42 KB" },
  { name: "presentation.key", kind: "file", modified: "Aug 05", size: "12 MB" },
];

function validChars(name: string) {
  // macOS disallows ":" and "/" in filenames, and disallows empty or "."-only
  if (!name.trim()) return "Name can't be empty.";
  if (name.includes("/") || name.includes(":")) return '":" and "/" are not allowed in names.';
  if (name.trim() === "." || name.trim() === "..") return '"." is not a valid name.';
  if (name.length > 255) return "Name is too long (max 255 characters).";
  return null;
}
function stripExt(name: string) {
  const dot = name.lastIndexOf(".");
  if (dot > 0) return name.slice(0, dot);
  return name;
}

export default function Page() {
  const [name, setName] = useState("Summer Poster");
  const [isExpanded, setIsExpanded] = useState(true);
  const [format, setFormat] = useState<FormatOpt>(FORMATS[0]);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [sidebarSel, setSidebarSel] = useState("documents");
  const [path, setPath] = useState(["Documents", "Studio", "Exports"]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [whereOpen, setWhereOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(["client-review"]);
  const [tagInput, setTagInput] = useState("");
  const [savedToast, setSavedToast] = useState<string | null>(null);

  // keep extension in sync when format changes — like NSSavePanel does
  const nameWithExt = useMemo(() => {
    const base = stripExt(name) || "Untitled";
    return `${base}.${format.ext}`;
  }, [name, format.ext]);

  // duplicates detection
  const duplicate = useMemo(
    () => FILES.some((f) => f.kind === "file" && f.name.toLowerCase() === nameWithExt.toLowerCase()),
    [nameWithExt]
  );
  const error = validChars(stripExt(name) || name);

  useEffect(() => {
    if (savedToast) {
      const t = setTimeout(() => setSavedToast(null), 2800);
      return () => clearTimeout(t);
    }
  }, [savedToast]);

  function handleSave() {
    if (error) return;
    setSavedToast(`Saved “${nameWithExt}” to ${path.join(" › ")} as ${format.label}`);
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      {/* header */}
      <header className="mb-12 max-w-3xl">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0a84ff]">macOS · Web approximation · NSSavePanel</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Save Panel</h1>
        <p className="mt-2 font-mono text-sm text-text-faint">Also called: save dialog · save-as panel · file save picker · NSSavePanel</p>
        <p className="mt-6 text-lg leading-relaxed text-text-muted">
          The sheet that slides down when you save. You name the file, pick where it lives, and choose its format. Its compact bar can
          unfold into a full Finder browser — same dialog, two densities. AppKit&apos;s native is{" "}
          <code className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-sm">NSSavePanel</code>; SwiftUI uses{" "}
          <code className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-sm">View.fileExporter</code>.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">
          If you called it “the little arrow that makes the save window bigger” or “the format dropdown in Save As” — this is it. Don&apos;t
          rebuild it from custom controls.
        </p>
      </header>

      {/* intro strip */}
      <section className="mb-16">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-text-muted">What am I looking at?</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: "Name it", desc: "The Save As field at the top — the one thing every save needs. Type, and the extension follows the format." },
            { step: "Choose where", desc: "Collapsed: a Where dropdown. Expanded: a Finder sidebar + file list with breadcrumbs, New Folder, and search." },
            { step: "Pick format", desc: "The Format pop-up beneath the name — constrained by allowedContentTypes. One choice = one UTI = one extension." },
          ].map((c, i) => (
            <div key={c.step} className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eff6ff] font-mono text-xs font-bold text-[#0a84ff]">
                {i + 1}
              </span>
              <div>
                <h3 className="mb-1 text-sm font-semibold leading-tight">{c.step}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* anatomy */}
      <section className="mb-16">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted">Anatomy — every part, named</h2>
        <p className="mb-6 text-sm text-text-muted">
          The live Save Panel below is the real control. Type a name, flip the disclosure arrow, change the format — the numbered pills stay
          pinned to the actual parts. Try collapsing it to see how much chrome disappears.
        </p>

        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-8">
          {/* controls row */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#0a84ff] shadow-[0_0_0_4px_rgba(10,132,255,0.12)]" />
              <span className="font-mono text-xs text-text-muted">NSSavePanel.nameFieldStringValue</span>
              <span className="font-mono text-xs font-medium text-foreground truncate max-w-[150px]">“{stripExt(name) || "—"}”</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5">
              <span className={`h-2 w-2 rounded-full ${isExpanded ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span className="font-mono text-xs text-text-muted">isExpanded</span>
              <span className="font-mono text-xs font-semibold">{isExpanded ? "true" : "false"}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5">
              <span className="font-mono text-xs text-text-muted">allowedContentTypes</span>
              <span className="font-mono text-xs font-medium text-foreground">[{format.label}]</span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 font-mono text-xs text-text-faint">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> live
            </span>
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="ml-auto rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text-muted hover:text-foreground hover:border-border-strong transition-colors"
            >
              {isExpanded ? "Collapse" : "Expand"} ▾
            </button>
          </div>

          <p className="mb-5 font-mono text-xs leading-relaxed text-text-faint">
            {"<NSSavePanel>"} · nameFieldStringValue = “{nameWithExt}” · isExpanded = {isExpanded ? "true" : "false"} · allowedContentTypes = [
            {FORMATS.map((f) => f.id).join(", ")}] → {format.ext}
          </p>

          {/* stage — parent window with sheet */}
          <div
            className="relative overflow-visible rounded-xl border border-border bg-[#fcfcfa] p-3 sm:p-8"
            style={{ backgroundImage: "radial-gradient(circle, #e7e5e4 1px, transparent 1px)", backgroundSize: "20px 20px" }}
          >
            {/* outer dashed label — the panel */}
            <div className="absolute inset-3 rounded-xl border-2 border-dashed border-[#0a84ff]/20 pointer-events-none" aria-hidden="true">
              <div className="absolute -top-3 left-6 flex items-center gap-1.5 bg-[#fcfcfa] px-1.5">
                <span className="rounded-full bg-white border border-[#0a84ff]/20 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest uppercase text-[#0a84ff] shadow-sm">
                  NSSavePanel · sheet
                </span>
              </div>
            </div>

            {/* fake parent window */}
            <div className="relative mx-auto max-w-[680px]">
              {/* window chrome behind sheet */}
              <div className="overflow-hidden rounded-xl border border-[#d6d3d1] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.10)]">
                <div className="flex h-8 items-center justify-between border-b border-border bg-[#f5f5f4] px-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
                    <span className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#d9a01d]" />
                    <span className="h-3 w-3 rounded-full bg-[#28c840] border border-[#1fac2e]" />
                  </div>
                  <span className="text-xs font-medium text-text-muted hidden sm:inline">Untitled · Studio — Editing</span>
                  <span className="text-[11px] font-mono text-text-faint">◐ 100%</span>
                </div>
                {/* canvas placeholder */}
                <div className="relative bg-[#fafaf9] h-[420px] sm:h-[460px] overflow-hidden">
                  {/* dim overlay when sheet is modal */}
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />

                  {/* poster canvas faintly visible */}
                  <div className="absolute inset-0 grid place-items-center p-8 opacity-40 pointer-events-none">
                    <div className="w-[88%] max-w-[420px] rounded-xl border border-border bg-white shadow-sm p-6">
                      <div className="h-32 rounded-lg bg-gradient-to-br from-orange-100 via-pink-100 to-blue-100 border border-border" />
                      <div className="mt-4 space-y-2">
                        <div className="h-3 w-3/4 rounded bg-zinc-200" />
                        <div className="h-3 w-1/2 rounded bg-zinc-200" />
                      </div>
                    </div>
                  </div>

                  {/* ── THE SAVE PANEL SHEET ── */}
                  <div className="absolute inset-x-3 top-0 sm:inset-x-6">
                    <div className="mx-auto max-w-[620px] overflow-hidden rounded-b-xl rounded-t-none sm:rounded-xl sm:mt-0 border border-[#c9c7c5] bg-[#ececec] shadow-[0_12px_40px_rgba(0,0,0,0.18),0_1px_0_rgba(255,255,255,0.6)_inset] mt-0">
                      {/* sheet handle / title */}
                      <div className="relative bg-gradient-to-b from-[#f6f6f6] to-[#ececec] border-b border-[#d6d3d1] px-6 py-3">
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-1 w-9 rounded-full bg-black/10" aria-hidden />
                        <div className="flex items-center justify-center gap-2 pt-1">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                            <rect x="2" y="3" width="12" height="10" rx="1.5" fill="white" stroke="#d6d3d1" strokeWidth="1.1" />
                            <path d="M5 7h6M5 9h4" stroke="#a8a29e" strokeWidth="1.2" strokeLinecap="round" />
                          </svg>
                          <h3 className="text-[13px] font-semibold text-[#1c1917]">Save</h3>
                        </div>
                      </div>

                      {/* top form */}
                      <div className="bg-[#ececec] px-5 sm:px-6 py-4 sm:py-5">
                        <div className="space-y-3">
                          {/* Save As row with disclosure */}
                          <div className="flex items-center gap-3">
                            <label className="w-[68px] shrink-0 text-right text-[13px] font-medium text-[#3f3f46]">Save As:</label>
                            <div className="relative flex-1 flex items-center gap-2">
                              {/* ── callout 1 anchor ── */}
                              <div className="relative flex-1">
                                <input
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  placeholder="Untitled"
                                  aria-label="Save As name field"
                                  className={`w-full rounded-md border bg-white px-3 py-[7px] text-[13px] shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_0_0_1px_rgba(0,0,0,0.04)] outline-none placeholder:text-zinc-400 ${
                                    error ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200" : "border-[#c9c7c5] focus:border-[#0a84ff] focus:ring-[3px] focus:ring-[#0a84ff]/20"
                                  }`}
                                />
                                {/* inline extension pill when not focused? show as part of field chrome */}
                              </div>

                              {/* disclosure expansion button — anatomy 2 */}
                              <button
                                onClick={() => setIsExpanded((v) => !v)}
                                aria-label={isExpanded ? "Collapse file browser" : "Expand file browser"}
                                aria-expanded={isExpanded}
                                className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-[#c9c7c5] bg-gradient-to-b from-white to-[#f5f5f4] shadow-sm hover:from-white hover:to-white active:from-[#f5f5f4] active:to-[#ececec] transition-colors"
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                  aria-hidden
                                >
                                  <path d="M3 4.5 6 7.5 9 4.5" stroke="#57534e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          {/* validation line under name field */}
                          {(error || duplicate) && (
                            <div className="flex gap-3">
                              <span className="w-[68px] shrink-0" aria-hidden />
                              <div className="flex-1">
                                {error ? (
                                  <p className="text-xs text-red-600 flex items-center gap-1.5">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                                      <circle cx="6" cy="6" r="5" stroke="#dc2626" strokeWidth="1.1" />
                                      <path d="M6 3.5v3M6 8.2h.01" stroke="#dc2626" strokeWidth="1.3" strokeLinecap="round" />
                                    </svg>
                                    {error}
                                  </p>
                                ) : duplicate ? (
                                  <p className="text-xs text-amber-700 flex items-center gap-1.5">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                                      <path d="M6 2.5 10.2 9.5H1.8L6 2.5Z" stroke="#b45309" strokeWidth="1.1" strokeLinejoin="round" />
                                      <path d="M6 5v2.2M6 8.6h.01" stroke="#b45309" strokeWidth="1.3" strokeLinecap="round" />
                                    </svg>
                                    “{nameWithExt}” already exists in this folder. Replacing it will overwrite its contents.
                                  </p>
                                ) : null}
                              </div>
                              <span className="w-7 shrink-0" aria-hidden />
                            </div>
                          )}

                          {/* Tags row */}
                          <div className="flex items-center gap-3">
                            <label className="w-[68px] shrink-0 text-right text-[13px] font-medium text-[#3f3f46]">Tags:</label>
                            <div className="flex-1 flex items-center gap-1.5 rounded-md border border-[#c9c7c5] bg-white px-2 py-1.5 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]">
                              <div className="flex flex-wrap items-center gap-1 flex-1">
                                {tags.map((t) => (
                                  <span key={t} className="inline-flex items-center gap-1 rounded-full bg-[#0a84ff] px-2 py-0.5 text-xs font-medium text-white">
                                    <span className="h-2 w-2 rounded-full bg-white/90" />
                                    {t}
                                    <button
                                      onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                                      className="ml-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-white/20 hover:bg-white/30"
                                      aria-label={`Remove tag ${t}`}
                                    >
                                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                        <path d="M1.5 1.5 6.5 6.5M6.5 1.5 1.5 6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                                      </svg>
                                    </button>
                                  </span>
                                ))}
                                <input
                                  value={tagInput}
                                  onChange={(e) => setTagInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && tagInput.trim()) {
                                      e.preventDefault();
                                      const v = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
                                      if (!tags.includes(v)) setTags((p) => [...p, v]);
                                      setTagInput("");
                                    }
                                  }}
                                  placeholder={tags.length ? "" : "No Tags"}
                                  className="min-w-[90px] flex-1 bg-transparent text-[13px] outline-none placeholder:text-zinc-400"
                                />
                              </div>
                              <span className="text-zinc-300">▾</span>
                            </div>
                            <span className="w-7 shrink-0" aria-hidden />
                          </div>

                          {/* Where row */}
                          <div className="flex items-center gap-3">
                            <label className="w-[68px] shrink-0 text-right text-[13px] font-medium text-[#3f3f46]">Where:</label>
                            <div className="relative flex-1">
                              <button
                                onClick={() => isExpanded ? null : setWhereOpen((v) => !v)}
                                className="flex w-full items-center gap-2 rounded-md border border-[#c9c7c5] bg-white px-3 py-[7px] text-left shadow-sm hover:bg-[#fafaf9] focus:outline-none focus:border-[#0a84ff] focus:ring-[3px] focus:ring-[#0a84ff]/20"
                              >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
                                  <path d="M2 4.5A1.2 1.2 0 0 1 3.2 3.3h2.6L7 4.5H11.8A1.2 1.2 0 0 1 13 5.7V10A1.2 1.2 0 0 1 11.8 11.2H3.2A1.2 1.2 0 0 1 2 10V4.5Z" fill="#0a84ff" fillOpacity="0.12" stroke="#0a84ff" strokeWidth="1" />
                                </svg>
                                <span className="flex-1 truncate text-[13px] text-[#1c1917]">{path.join(" › ")}</span>
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden className="shrink-0 text-zinc-400">
                                  <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                              {whereOpen && !isExpanded && (
                                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-lg border border-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                                  {SIDEBAR_GROUPS.flatMap((g) => g.items).map((it) => (
                                    <button
                                      key={it.id}
                                      onClick={() => {
                                        setWhereOpen(false);
                                        setSidebarSel(it.id);
                                        setPath([it.label]);
                                      }}
                                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f5f5f4] ${sidebarSel === it.id ? "bg-[#0a84ff] text-white hover:bg-[#0a84ff]" : "text-zinc-800"}`}
                                    >
                                      <span className="text-xs">{it.icon}</span> {it.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <span className="w-7 shrink-0" aria-hidden />
                          </div>

                          {/* Format pop-up — anatomy 3 */}
                          <div className="flex items-center gap-3">
                            <label className="w-[68px] shrink-0 text-right text-[13px] font-medium text-[#3f3f46]">Format:</label>
                            <div className="relative flex-1">
                              <button
                                onClick={() => setShowFormatMenu((v) => !v)}
                                aria-haspopup="listbox"
                                aria-expanded={showFormatMenu}
                                className="flex w-full items-center gap-2 rounded-md border border-[#c9c7c5] bg-gradient-to-b from-white to-[#fafaf9] px-3 py-[7px] text-left shadow-sm hover:from-white hover:to-white focus:outline-none focus:border-[#0a84ff] focus:ring-[3px] focus:ring-[#0a84ff]/20"
                              >
                                <span className="flex-1 text-[13px] text-[#1c1917]">
                                  {format.label} <span className="text-text-faint font-mono text-xs">· .{format.ext} · {format.desc}</span>
                                </span>
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden className="shrink-0 text-zinc-500">
                                  <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                              {showFormatMenu && (
                                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-lg border border-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                                  <div className="max-h-[220px] overflow-auto py-1">
                                    {FORMATS.map((f) => (
                                      <button
                                        key={f.id}
                                        onClick={() => {
                                          setFormat(f);
                                          setShowFormatMenu(false);
                                        }}
                                        className={`flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-[#f5f5f4] ${format.id === f.id ? "bg-[#0a84ff] text-white hover:bg-[#0a84ff]" : ""}`}
                                      >
                                        <span className={`text-sm font-medium ${format.id === f.id ? "text-white" : "text-zinc-900"}`}>{f.label}</span>
                                        <span className={`font-mono text-xs ${format.id === f.id ? "text-white/80" : "text-text-faint"}`}> .{f.ext}</span>
                                        <span className={`ml-auto hidden sm:inline text-xs ${format.id === f.id ? "text-white/80" : "text-text-muted"}`}>{f.desc}</span>
                                        {format.id === f.id && <span className="ml-auto sm:ml-2 text-white">✓</span>}
                                      </button>
                                    ))}
                                  </div>
                                  <div className="border-t border-border bg-[#fafaf9] px-3 py-2">
                                    <p className="font-mono text-[10px] leading-relaxed text-text-faint">
                                      NSSavePanel.allowedContentTypes = [{FORMATS.map((f) => `UTType.${f.id}`).join(", ")}]
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                            <span className="w-7 shrink-0" aria-hidden />
                          </div>
                        </div>
                      </div>

                      {/* expanded browser */}
                      <div
                        className={`grid transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="overflow-hidden">
                          <div className="border-y border-[#d6d3d1] bg-white flex h-[300px]">
                            {/* sidebar */}
                            <aside className="hidden sm:flex w-[168px] shrink-0 flex-col border-r border-[#e7e5e4] bg-[#f5f5f4] overflow-hidden">
                              <div className="flex-1 overflow-y-auto col-scroll py-2">
                                {SIDEBAR_GROUPS.map((group) => (
                                  <div key={group.title} className="mb-3 px-2">
                                    <p className="px-2 mb-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">{group.title}</p>
                                    {group.items.map((it) => (
                                      <button
                                        key={it.id}
                                        onClick={() => {
                                          setSidebarSel(it.id);
                                          setPath([it.label, "Studio", "Exports"]);
                                        }}
                                        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] ${sidebarSel === it.id ? "bg-[#0a84ff] text-white" : "text-zinc-700 hover:bg-black/5"}`}
                                      >
                                        <span className={`grid h-5 w-5 place-items-center rounded text-[11px] ${sidebarSel === it.id ? "bg-white/20 text-white" : "bg-white border border-border text-text-muted"}`}>
                                          {it.icon}
                                        </span>
                                        <span className="truncate text-xs font-[450]">{it.label}</span>
                                      </button>
                                    ))}
                                  </div>
                                ))}
                                <div className="mx-2 mt-2 rounded-lg border border-dashed border-border bg-white p-2">
                                  <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Finder sidebar</p>
                                  <p className="mt-1 text-xs leading-relaxed text-text-muted">The source list inside the expanded browser. Not a prop — NSSavePanel builds it from the file system.</p>
                                </div>
                              </div>
                            </aside>

                            {/* file list */}
                            <div className="flex flex-1 flex-col min-w-0 bg-white">
                              {/* path bar + controls */}
                              <div className="flex h-8 items-center gap-2 border-b border-[#e7e5e4] bg-[#fafaf9] px-3">
                                <div className="flex items-center gap-1">
                                  <button className="grid h-6 w-6 place-items-center rounded-md border border-border bg-white text-text-muted hover:text-foreground">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                      <path d="M7.5 2.5 3.5 6l4 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </button>
                                  <button className="grid h-6 w-6 place-items-center rounded-md border border-border bg-white text-text-faint">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                      <path d="M4.5 2.5 8.5 6l-4 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </button>
                                </div>
                                <div className="hidden sm:flex items-center gap-1 text-xs text-text-muted">
                                  {path.map((seg, i) => (
                                    <span key={seg} className="flex items-center gap-1">
                                      {i > 0 && <span className="text-text-faint">›</span>}
                                      <button
                                        onClick={() => setPath(path.slice(0, i + 1))}
                                        className={`rounded px-1.5 py-0.5 hover:bg-black/5 ${i === path.length - 1 ? "font-semibold text-foreground bg-white border border-border" : ""}`}
                                      >
                                        {seg}
                                      </button>
                                    </span>
                                  ))}
                                </div>
                                <span className="sm:hidden text-xs font-medium text-foreground truncate">{path[path.length - 1]}</span>
                                <div className="ml-auto hidden sm:flex items-center gap-1">
                                  <span className="rounded-md bg-white border border-border px-1.5 py-1 font-mono text-[10px] text-text-muted">◧</span>
                                  <span className="rounded-md bg-white border border-border px-1.5 py-1 font-mono text-[10px] text-text-muted">≡</span>
                                  <span className="rounded-md bg-[#0a84ff] px-1.5 py-1 font-mono text-[10px] font-semibold text-white">▦</span>
                                </div>
                                {/* search */}
                                <label className="ml-auto sm:ml-2 flex items-center gap-1.5 rounded-full border border-border bg-white px-2 py-1 focus-within:border-[#0a84ff] focus-within:ring-2 focus-within:ring-[#0a84ff]/20">
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                                    <circle cx="5" cy="5" r="3.2" stroke="#a8a29e" strokeWidth="1.1" />
                                    <path d="M7.5 7.5 9.5 9.5" stroke="#a8a29e" strokeWidth="1.1" strokeLinecap="round" />
                                  </svg>
                                  <input placeholder="Search" className="w-[70px] bg-transparent text-xs outline-none placeholder:text-text-faint" />
                                </label>
                              </div>

                              {/* column headers */}
                              <div className="flex items-center gap-2 border-b border-[#e7e5e4] bg-white px-3 py-1.5 text-[11px] font-medium text-text-faint">
                                <span className="flex-1">Name</span>
                                <span className="hidden sm:inline w-20 text-right">Size</span>
                                <span className="hidden sm:inline w-20 text-right">Modified</span>
                              </div>

                              {/* rows */}
                              <div className="flex-1 overflow-y-auto col-scroll divide-y divide-[#f5f5f4]">
                                {FILES.map((f) => {
                                  const isFolder = f.kind === "folder";
                                  const isSelected = selectedFile === f.name;
                                  const isDuplicateRow = !isFolder && f.name.toLowerCase() === nameWithExt.toLowerCase();
                                  return (
                                    <button
                                      key={f.name}
                                      onClick={() => {
                                        if (isFolder) setPath([...path, f.name]);
                                        else setSelectedFile(f.name);
                                      }}
                                      onDoubleClick={() => {
                                        if (isFolder) setPath([...path, f.name]);
                                      }}
                                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] hover:bg-[#f5f5f4] ${isSelected ? "bg-[#0a84ff] text-white hover:bg-[#0a84ff]" : ""} ${isDuplicateRow && !isSelected ? "bg-amber-50" : ""}`}
                                    >
                                      <span
                                        className={`grid h-6 w-6 place-items-center rounded ${isSelected ? "bg-white/20 text-white" : isFolder ? "bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/15" : "bg-white border border-border text-text-muted"}`}
                                      >
                                        {isFolder ? (
                                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M1.5 4.2A1 1 0 0 1 2.5 3.2h2L5.6 4.2H9.5A1 1 0 0 1 10.5 5.2V8.5A1 1 0 0 1 9.5 9.5H2.5A1 1 0 0 1 1.5 8.5V4.2Z" fill={isSelected ? "white" : "#0a84ff"} fillOpacity={isSelected ? 0.95 : 0.15} stroke={isSelected ? "white" : "#0a84ff"} strokeWidth="0.9" />
                                          </svg>
                                        ) : (
                                          <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                                            <path d="M3 1.5h3.2L8 3.3V10A1 1 0 0 1 7 11H3A1 1 0 0 1 2 10V2.5A1 1 0 0 1 3 1.5Z" fill={isSelected ? "white" : "#fafaf9"} stroke={isSelected ? "white" : "#d6d3d1"} strokeWidth="0.9" />
                                          </svg>
                                        )}
                                      </span>
                                      <span className={`flex-1 truncate ${isSelected ? "text-white font-medium" : "text-zinc-800"} ${isDuplicateRow && !isSelected ? "font-medium" : ""}`}>{f.name}</span>
                                      {isDuplicateRow && !isSelected && <span className="hidden sm:inline rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-700">will replace</span>}
                                      <span className={`hidden sm:inline w-20 text-right font-mono text-xs ${isSelected ? "text-white/70" : "text-text-faint"}`}>{f.size ?? "—"}</span>
                                      <span className={`hidden sm:inline w-20 text-right text-xs ${isSelected ? "text-white/70" : "text-text-muted"}`}>{f.modified}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* bottom bar */}
                              <div className="flex h-9 items-center justify-between border-t border-[#e7e5e4] bg-[#fafaf9] px-3">
                                <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-text-muted hover:text-foreground hover:border-border-strong">
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M6 2.5v7M2.5 6h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                  </svg>
                                  New Folder
                                </button>
                                <span className="font-mono text-[11px] text-text-faint hidden sm:inline">{FILES.length} items · {path.join("/")}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* footer actions */}
                      <div className="flex items-center justify-between gap-3 bg-[#ececec] px-6 py-3">
                        <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          Sandbox access granted on Save
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                          <button className="rounded-md border border-[#c9c7c5] bg-white px-4 py-1.5 text-[13px] font-medium text-[#1c1917] shadow-sm hover:bg-[#fafaf9] active:bg-[#f5f5f4]">Cancel</button>
                          <button
                            onClick={handleSave}
                            disabled={!!error || !stripExt(name).trim()}
                            className="rounded-md bg-[#0a84ff] px-5 py-1.5 text-[13px] font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_1px_2px_rgba(0,0,0,0.12)] hover:bg-[#0066cc] active:bg-[#0058b0] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0a84ff]"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* window bottom — traffic-light area illusion complete */}

                {/* toast */}
                {savedToast && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
                    <div className="rounded-full bg-[#1c1917] px-4 py-2 text-xs font-medium text-white shadow-lg flex items-center gap-2">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15">✓</span>
                      {savedToast}
                    </div>
                  </div>
                )}
              </div>

              {/* callouts — desktop absolute, mobile stacked */}
              {/* 1 name field */}
              <div className="pointer-events-none absolute -right-2 top-[74px] hidden lg:flex items-center gap-1.5 z-10" aria-hidden>
                <span className="h-px w-7 bg-[#d6d3d1]" />
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0a84ff] font-mono text-[10px] font-bold text-white">1</span>
                <span className="rounded-full border border-[#0a84ff]/20 bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-[#0a84ff] shadow-sm">
                  name field · nameFieldStringValue
                </span>
              </div>
              {/* 2 disclosure */}
              <div className="pointer-events-none absolute right-10 top-[74px] hidden lg:flex flex-col items-center gap-1 translate-x-[132px] z-10" aria-hidden>
                <div className="flex items-center gap-1.5">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1c1917] font-mono text-[10px] font-bold text-white">2</span>
                  <span className="rounded-full border border-border bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-text-muted shadow-sm">disclosure · isExpanded</span>
                </div>
                <span className="h-3 w-px bg-[#d6d3d1]" />
              </div>
              {/* 3 format pop-up */}
              <div className="pointer-events-none absolute -left-2 bottom-[148px] hidden lg:flex items-center gap-1.5 z-10" aria-hidden>
                <span className="rounded-full border border-border bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-text-muted shadow-sm">format pop-up · allowedContentTypes</span>
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1c1917] font-mono text-[10px] font-bold text-white">3</span>
                <span className="h-px w-7 bg-[#d6d3d1]" />
              </div>
            </div>

            <p className="mt-4 text-center text-xs leading-relaxed text-text-faint">
              Sheet is modal: the dimmed canvas behind it is inert until you Cancel or Save. Try typing <span className="font-mono bg-white border border-border rounded px-1">:</span> to trigger
              validation, or toggle the disclosure arrow to collapse the Finder browser.
            </p>
          </div>

          {/* mini legend */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-surface-alt px-4 py-3 flex items-start gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#0a84ff] font-mono text-[10px] font-bold text-white">1</span>
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Name field · nameFieldStringValue</p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">Editable box above the browser. Reads/writes the proposal; Save validates before closing.</p>
              </div>
            </div>
            <div className="rounded-xl bg-surface-alt px-4 py-3 flex items-start gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1c1917] font-mono text-[10px] font-bold text-white">2</span>
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Disclosure · isExpanded</p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">Small chevron that reveals the full Finder browser. Compact = Where dropdown; expanded = sidebar + list.</p>
              </div>
            </div>
            <div className="rounded-xl bg-surface-alt px-4 py-3 flex items-start gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1c1917] font-mono text-[10px] font-bold text-white">3</span>
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Format pop-up · allowedContentTypes</p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">Native type picker. One entry per UTI; picking updates the filename extension automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* layered explanations */}
      <section className="mb-16">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted">The three parts, in plain words</h2>
        <p className="mb-6 text-sm text-text-muted">Every named part, explained twice: for the person using the product, and for the person building it.</p>
        <div className="overflow-hidden rounded-2xl border border-border bg-border">
          {[
            {
              n: 1,
              name: "Name field — NSSavePanel.nameFieldStringValue",
              token: "nameFieldStringValue",
              see: "The text box labelled “Save As:” at the very top. It holds the filename you’re proposing. You click, type, and the extension at the end quietly follows whichever format you picked below — you never have to remember to type “.png”.",
              how: "In AppKit, read and write via NSSavePanel.nameFieldStringValue (a String). In SwiftUI’s fileExporter you supply defaultFilename, and the system fills this field. Think of state as the panel’s memory: const [name, setName] = useState(\"Untitled\"). Every keystroke fires onChange → setName → re-render, so the input always shows the current value. Validation (no \":\" or \"/\") happens before the panel will let you Save — same check we show inline.",
            },
            {
              n: 2,
              name: "Disclosure expansion button — NSSavePanel.isExpanded",
              token: "isExpanded",
              see: "The little chevron in a square next to Save As. One click and the dialog grows: a Finder sidebar and file list slide open below the form. Click again and it collapses back to just Save As / Where / Format. Same save, two densities — quick vs. precise.",
              how: "A boolean stored as panel.isExpanded. In React: const [isExpanded, setIsExpanded] = useState(true). Clicking the button does setIsExpanded(v => !v). The browser area is conditionally rendered: {isExpanded && <FinderBrowser/>}, with a CSS grid-rows animation for the slide. In AppKit you can set isExpanded before showing the panel to control the initial density; beginSheetModal animates the height change exactly like our grid transition.",
            },
            {
              n: 3,
              name: "Format pop-up — NSSavePanel.allowedContentTypes",
              token: "allowedContentTypes",
              see: "The row labelled “Format:” near the bottom. It’s a dropdown of file types the app can actually write — PNG, PDF, SVG… Choosing one swaps the extension on your filename instantly. It prevents “I saved as .jpg but it’s really a PNG” mistakes.",
              how: "An array of UTIs, e.g. [UTType.png, UTType.pdf]. In React we model it as FormatOpt[] = [{label: \"PNG\", ext: \"png\"} …]. Selecting a row does setFormat(f) and derives nameWithExt = stripExt(name) + \".\" + f.ext — no second input needed. The panel’s allowedContentTypes prop controls which rows appear; if you pass one type the pop-up hides entirely. In SwiftUI that’s the contentType parameter of fileExporter.",
            },
          ].map((part, i) => (
            <div key={part.n} className={`grid md:grid-cols-2 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="bg-surface p-5 sm:p-6">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#0a84ff]">What you see</p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-foreground font-mono text-[10px] text-white">{part.n}</span>
                  {part.name}
                  <code className="hidden sm:inline font-mono text-[10px] font-normal text-text-faint">{part.token}</code>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{part.see}</p>
              </div>
              <div className="border-t border-border bg-surface p-5 md:border-t-0 md:border-l sm:p-6">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#0a84ff]">How it works</p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{part.how}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* in code */}
      <section className="mb-16">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-text-muted">In code — the AppKit names</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="grid sm:grid-cols-3 sm:divide-x sm:divide-border">
            <div className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Name field</p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">NSSavePanel.nameFieldStringValue</code>
              <p className="mt-2 text-xs leading-relaxed text-text-faint">The editable filename box above the browser. Read before showing to set a proposal; read after Save to get the final name.</p>
            </div>
            <div className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Disclosure</p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">NSSavePanel.isExpanded</code>
              <p className="mt-2 text-xs leading-relaxed text-text-faint">Boolean that reveals or hides the Finder-style browser. beginSheetModal animates the height.</p>
            </div>
            <div className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Format pop-up</p>
              <code className="block rounded-lg bg-surface-alt px-4 py-3 font-mono text-sm">NSSavePanel.allowedContentTypes</code>
              <p className="mt-2 text-xs leading-relaxed text-text-faint">[UTType] array. Drives the pop-up rows and which extensions the panel will accept.</p>
            </div>
          </div>
          <div className="border-t border-border bg-[#fafaf9] px-6 py-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-faint mb-2">Paste-ready prompt</p>
            <code className="block rounded-lg bg-white border border-border px-4 py-3 font-mono text-xs leading-relaxed text-text-muted">
              Present the standard Save Panel with NSSavePanel (SwiftUI: View.fileExporter), including its editable name field
              (NSSavePanel.nameFieldStringValue), disclosure button for the expanded file browser (NSSavePanel.isExpanded),
              allowed-content-type format pop-up (NSSavePanel.allowedContentTypes), and Finder-style sidebar. Do not rebuild the system save
              dialog from custom controls.
            </code>
          </div>
        </div>
      </section>

      {/* sheet nuance */}
      <section className="mb-16 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 flex gap-3">
        <span className="text-amber-600 mt-0.5 shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M9 3.2 15.4 14.2H2.6L9 3.2Z" stroke="#b45309" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M9 7.2v3M9 11.6h.01" stroke="#b45309" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-amber-900">It’s a sheet, not a window.</p>
          <p className="text-sm leading-relaxed text-amber-900/80 mt-1">
            On macOS the Save Panel is presented with <code className="rounded bg-white border border-amber-200 px-1 py-0.5 font-mono text-xs">beginSheetModal(for:)</code> — it
            slides down from the window’s title bar and dims the document behind it. The document is inert until you Save or Cancel. Our dimmed
            canvas recreates that modality. In SwiftUI the same attachment behavior comes free with{" "}
            <code className="rounded bg-white border border-amber-200 px-1 py-0.5 font-mono text-xs">.fileExporter</code>.
          </p>
        </div>
      </section>

      {/* scenarios */}
      <section>
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-text-muted">See it in the wild — three scenarios</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              href: "/scenarios/poster-export",
              title: "Poster Export",
              desc: "Design tool with five formats (PNG → TIFF). Extension sync, duplicate warning, and tag editing — the format-heavy variant.",
              badge: "Format-heavy",
            },
            {
              href: "/scenarios/document-save",
              title: "Document Save",
              desc: "Minimal markdown editor. Starts collapsed; disclosure is the star. Two formats, New Folder, and overwrite confirmation.",
              badge: "Collapsed-first",
            },
            {
              href: "/scenarios/archive-project",
              title: "Archive Project",
              desc: "Developer archive with deep sidebar + search, list view, and archive-type pop-up. The location-heavy variant.",
              badge: "Location-heavy",
            },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group block rounded-xl border border-border bg-surface p-6 transition-all hover:border-[#0a84ff]/30 hover:shadow-md"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-full bg-[#eff6ff] border border-[#0a84ff]/10 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest uppercase text-[#0a84ff]">
                  {s.badge}
                </span>
              </div>
              <h3 className="mb-2 text-sm font-semibold transition-colors group-hover:text-[#0a84ff]">{s.title}</h3>
              <p className="text-sm leading-relaxed text-text-muted">{s.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#0a84ff]">
                Explore <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-border pt-6 text-xs leading-relaxed text-text-faint">
        <p>
          Web approximations can’t reproduce sandbox entitlements or the real file system, but they can honor the contract: a single name field
          that is the source of truth, a disclosure that toggles chrome without losing state, and a format pop-up derived from allowed types that
          owns the extension. Keep all three and the feel stays honest.
        </p>
      </footer>
    </main>
  );
}
