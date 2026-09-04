"use client";

import { useMemo, useState } from "react";
import MacWindow, {
  SideItem,
  SideLabel,
  ToolbarButton,
  ToolbarSearch,
  ToolbarSegment,
  ToolbarSpacer,
  type MacWindowTab,
} from "@/components/MacWindow";
import { BackLink, ConfigChips, PageHeader, ScenarioNav, WhyFit } from "@/components/chrome";

type Doc = { id: string; title: string; folder: string; body: string; dirty?: boolean };

const STARTER: Doc[] = [
  {
    id: "launch",
    title: "Launch announcement",
    folder: "Drafts",
    body: "We're opening the viewer refresh to everyone on Tuesday.\n\nStart with the headline: what changed, who it's for, and where to click first. One idea per paragraph — readers skim, so let them.",
  },
  {
    id: "migration",
    title: "Migration guide",
    folder: "Drafts",
    body: "Step one: export your workspace before Thursday.\n\nEverything carries over automatically except pinned filters. If a filter goes missing, re-pin it from the sidebar — it takes ten seconds.",
    dirty: true,
  },
  {
    id: "retro",
    title: "Sprint retro",
    folder: "Archive",
    body: "What went well: the staging previews caught three bugs before release.\n\nWhat didn't: review requests sat idle on Friday. Next sprint we rotate the reviewer role daily.",
  },
];

let n = 0;

export default function DocumentEditor() {
  const [docs, setDocs] = useState<Doc[]>(STARTER);
  const [activeId, setActiveId] = useState("launch");
  const [sideOpen, setSideOpen] = useState(true);
  const [folder, setFolder] = useState("All");
  const [mode, setMode] = useState<"edit" | "review">("edit");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const active = docs.find((d) => d.id === activeId) ?? docs[0];
  const tabs: MacWindowTab[] = docs.map((d) => ({ id: d.id, title: d.title, dirty: d.dirty }));

  const visible = useMemo(() => {
    return docs.filter(
      (d) =>
        (folder === "All" || d.folder === folder) &&
        d.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [docs, folder, query]);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  }

  function updateBody(id: string, body: string) {
    setDocs((ds) => ds.map((d) => (d.id === id ? { ...d, body, dirty: true } : d)));
  }

  function rename(id: string, title: string) {
    setDocs((ds) => ds.map((d) => (d.id === id ? { ...d, title } : d)));
  }

  function closeTab(id: string) {
    setDocs((ds) => {
      const next = ds.filter((d) => d.id !== id);
      if (activeId === id && next.length) setActiveId(next[0].id);
      return next;
    });
  }

  function newTab() {
    n += 1;
    const doc: Doc = {
      id: `untitled-${Date.now()}`,
      title: `Untitled ${docs.length + 1}`,
      folder: "Drafts",
      body: "",
    };
    setDocs((ds) => [...ds, doc]);
    setActiveId(doc.id);
  }

  const words = active.body.trim() ? active.body.trim().split(/\s+/).length : 0;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader
          eyebrow="Scenario 1 · unified toolbar + window tabs"
          title="Document editor"
          alsoCalled="Pages-style writing app"
          lede={
            <p>
              A writer juggling three documents in one window. The toolbar stays slim and unified,
              the title renames the file in place, and frame tabs group whole documents — each tab
              below is a separate file with its own unsaved-dot.
            </p>
          }
        />
        <ConfigChips
          items={[
            "ToolbarStyle.unified",
            "NSWindow.title (editable)",
            "NSWindowTabGroup ×3",
            "no accessory",
            "separator: line",
          ]}
        />
        <WhyFit>
          Writers switch documents constantly, and separate windows for each draft become clutter.
          Frame tabs keep every draft one click away inside a single frame; the unified toolbar
          keeps formatting near the title without stealing vertical space; renaming in the title
          bar skips the “Save As” dialog for quick title fixes.
        </WhyFit>

        <div className="desktop-dots relative flex min-h-[620px] items-center justify-center overflow-hidden rounded-2xl border border-stone-300/70 p-6 sm:p-10">
          <MacWindow
            title={active.title}
            proxyIcon="✎"
            editableTitle
            onTitleChange={(t) => rename(active.id, t)}
            toolbarStyle="unified"
            toolbarLeading={
              <ToolbarButton icon="◧" label="Sidebar" pressed={sideOpen} onClick={() => setSideOpen((v) => !v)} />
            }
            toolbarTrailing={
              <div className="flex items-center gap-1">
                <ToolbarButton icon="+" label="New" onClick={newTab} />
                <ToolbarButton icon="⤴" label="Share" onClick={() => flash("Share link copied")} />
              </div>
            }
            tabs={tabs}
            activeTabId={activeId}
            onTabChange={setActiveId}
            onTabClose={closeTab}
            onNewTab={newTab}
            initialWidth={680}
            initialHeight={480}
            minWidth={440}
            minHeight={340}
            sidebar={
              sideOpen ? (
                <>
                  <div data-nodrag className="px-1 pb-1">
                    <ToolbarSearch value={query} onChange={setQuery} placeholder="Filter drafts" />
                  </div>
                  <SideLabel>Library</SideLabel>
                  {["All", "Drafts", "Archive"].map((f) => (
                    <SideItem key={f} icon={f === "All" ? "▦" : "▭"} label={f} selected={folder === f} onClick={() => setFolder(f)} />
                  ))}
                  <SideLabel>Documents</SideLabel>
                  {visible.map((d) => (
                    <SideItem
                      key={d.id}
                      icon="✎"
                      label={`${d.title}${d.dirty ? " •" : ""}`}
                      selected={d.id === activeId}
                      onClick={() => setActiveId(d.id)}
                    />
                  ))}
                  {visible.length === 0 && (
                    <p className="px-2 py-1 text-xs text-stone-400">No matches.</p>
                  )}
                </>
              ) : undefined
            }
            statusBar={
              <>
                <span>{words} words</span>
                <span className="flex-1" />
                <span>{active.dirty ? "Edited — unsaved changes" : "Saved"}</span>
              </>
            }
          >
            <div className="mx-auto max-w-xl px-8 py-7">
              <div data-nodrag className="mb-4 flex items-center gap-2">
                <ToolbarSegment
                  options={["edit", "review"] as const}
                  value={mode}
                  onChange={setMode}
                  labels={{ edit: "Edit", review: "Review" }}
                />
                <ToolbarSpacer />
                <span className="text-[11px] text-stone-400">{active.folder}</span>
              </div>
              {mode === "edit" ? (
                <textarea
                  value={active.body}
                  onChange={(e) => updateBody(active.id, e.target.value)}
                  placeholder="Start writing…"
                  aria-label={`${active.title} body`}
                  rows={12}
                  className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-stone-800 outline-none placeholder:text-stone-300"
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {active.body.split("\n\n").filter(Boolean).map((para, i) => (
                    <div key={i} className="rounded-lg border border-stone-200 bg-stone-50/70 px-4 py-3">
                      <p className="text-[15px] leading-relaxed text-stone-700">{para}</p>
                      <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-stone-400">
                        Paragraph {i + 1} · no issues
                      </p>
                    </div>
                  ))}
                  {active.body.trim() === "" && (
                    <p className="text-sm text-stone-400">Nothing to review yet — switch back to Edit.</p>
                  )}
                </div>
              )}
            </div>
          </MacWindow>

          {toast && (
            <div className="absolute bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-4 py-2 text-xs font-medium text-white shadow-lg">
              {toast}
            </div>
          )}
        </div>

        <div className="grid gap-3 text-[13px] leading-relaxed text-stone-600 md:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white p-4"><span className="font-semibold text-stone-800">Type in the page</span> — the tab grows an unsaved dot and the status bar flips to “Edited”.</div>
          <div className="rounded-xl border border-stone-200 bg-white p-4"><span className="font-semibold text-stone-800">Click the title</span> — rename the file inline; sidebar, tab, and title all update together.</div>
          <div className="rounded-xl border border-stone-200 bg-white p-4"><span className="font-semibold text-stone-800">Press + in the tab strip</span> — a fourth document joins the group; close one and only that file goes away.</div>
        </div>

        <ScenarioNav
          prev={{ href: "/", label: "Anatomy hub" }}
          next={{ href: "/scenarios/media-viewer", label: "Media viewer" }}
        />
      </div>
    </main>
  );
}
