"use client";

import { useMemo, useState } from "react";
import MacWindow, {
  SideItem,
  SideLabel,
  ToolbarButton,
  ToolbarSearch,
  ToolbarSegment,
  ToolbarSpacer,
} from "@/components/MacWindow";
import { BackLink, ConfigChips, PageHeader, ScenarioNav, WhyFit } from "@/components/chrome";

type Entry = { name: string; kind: "folder" | "file"; detail: string; size: string };

const TREE: Record<string, Entry[]> = {
  Projects: [
    { name: "Studio", kind: "folder", detail: "12 items", size: "—" },
    { name: "Client work", kind: "folder", detail: "8 items", size: "—" },
    { name: "Brand brief.pdf", kind: "file", detail: "PDF document", size: "4.2 MB" },
    { name: "Launch checklist.txt", kind: "file", detail: "Plain text", size: "6 KB" },
  ],
  Studio: [
    { name: "Homepage mock.fig", kind: "file", detail: "Design file", size: "18 MB" },
    { name: "Icons", kind: "folder", detail: "48 items", size: "—" },
    { name: "Copy deck.txt", kind: "file", detail: "Plain text", size: "22 KB" },
  ],
  "Client work": [
    { name: "Acme rebrand", kind: "folder", detail: "5 items", size: "—" },
    { name: "Invoice Q3.pdf", kind: "file", detail: "PDF document", size: "88 KB" },
  ],
};

export default function ProjectBrowser() {
  const [path, setPath] = useState<string[]>(["Projects"]);
  const [history, setHistory] = useState<string[][]>([["Projects"]]);
  const [hIndex, setHIndex] = useState(0);
  const [view, setView] = useState<"icons" | "list">("icons");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>("Brand brief.pdf");
  const [focus, setFocus] = useState<"main" | "info">("main");
  const [infoOpen, setInfoOpen] = useState(true);

  const current = path[path.length - 1];
  const entries = useMemo(() => {
    const list = TREE[current] ?? [];
    return list.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));
  }, [current, query]);

  function navigate(next: string[]) {
    setPath(next);
    setHistory((h) => [...h.slice(0, hIndex + 1), next]);
    setHIndex((i) => i + 1);
    setSelected(null);
  }

  function goBack() {
    if (hIndex === 0) return;
    setPath(history[hIndex - 1]);
    setHIndex((i) => i - 1);
    setSelected(null);
  }

  function goForward() {
    if (hIndex >= history.length - 1) return;
    setPath(history[hIndex + 1]);
    setHIndex((i) => i + 1);
    setSelected(null);
  }

  function openEntry(e: Entry) {
    if (e.kind === "folder") navigate([...path, e.name]);
    else setSelected(e.name);
  }

  const selEntry = entries.find((e) => e.name === selected) ?? null;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader
          eyebrow="Scenario 3 · expanded toolbar + resize limits + key window"
          title="Project browser"
          alsoCalled="Finder-style file window"
          lede={
            <p>
              A file browser that needs room: path, view switcher, and search don&apos;t fit in one
              row, so the toolbar gets its own strip. A second small Info window shows what
              “key window” means — click either window to bring it forward. Then drag a corner and
              feel the minimum size stop you.
            </p>
          }
        />
        <ConfigChips
          items={[
            "ToolbarStyle: expanded (2 rows)",
            "StyleMask.resizable + min 480×380",
            "isKeyWindow (click to focus)",
            "second NSWindow (inspector)",
            "separator: line",
          ]}
        />
        <WhyFit>
          Browsers carry navigation state — where you are, how you&apos;re looking, what&apos;s
          selected — and that state needs permanent chrome. The expanded toolbar gives the path
          and view controls a full row; a separate Info window (rather than a panel inside) can
          be moved, focused, and closed independently; resize limits keep the grid readable no
          matter how far you shrink it.
        </WhyFit>

        <div className="desktop-dots relative flex min-h-[660px] flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl border border-stone-300/70 p-6 sm:p-10">
          {/* main browser window */}
          <MacWindow
            title={current}
            proxyIcon="▭"
            toolbarStyle="expanded"
            toolbarLeading={
              <div className="flex items-center gap-1">
                <ToolbarButton icon="‹" label="Back" disabled={hIndex === 0} onClick={goBack} />
                <ToolbarButton icon="›" label="Fwd" disabled={hIndex >= history.length - 1} onClick={goForward} />
              </div>
            }
            toolbarRow={
              <>
                <div className="flex items-center gap-0.5 text-[13px]" data-nodrag>
                  {path.map((seg, i) => (
                    <span key={seg} className="flex items-center">
                      {i > 0 && <span className="px-0.5 text-stone-300">›</span>}
                      <button
                        type="button"
                        onClick={() => navigate(path.slice(0, i + 1))}
                        className={`rounded px-1 py-0.5 ${i === path.length - 1 ? "font-semibold text-stone-800" : "text-stone-500 hover:bg-black/[0.05]"}`}
                      >
                        {seg}
                      </button>
                    </span>
                  ))}
                </div>
                <ToolbarSpacer />
                <ToolbarSegment
                  options={["icons", "list"] as const}
                  value={view}
                  onChange={setView}
                  labels={{ icons: "▦", list: "☰" }}
                />
                <ToolbarSearch value={query} onChange={setQuery} placeholder="Filter files" />
              </>
            }
            tabs={[]}
            initialWidth={640}
            initialHeight={400}
            minWidth={480}
            minHeight={380}
            active={focus === "main"}
            onActivate={() => setFocus("main")}
            sidebar={
              <>
                <SideLabel>Favorites</SideLabel>
                <SideItem icon="◷" label="Recents" />
                <SideItem icon="▭" label="Projects" selected onClick={() => navigate(["Projects"])} />
                <SideItem icon="☁" label="Shared" />
                <SideLabel>Tags</SideLabel>
                <SideItem icon="●" label="Urgent" />
                <SideItem icon="●" label="Review" />
              </>
            }
            statusBar={
              <>
                <span>{entries.length} items</span>
                <span className="flex-1" />
                <span>128 GB available</span>
              </>
            }
          >
            {entries.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-10 text-center">
                <span className="text-3xl text-stone-300">⌀</span>
                <p className="text-sm font-medium text-stone-500">No matches for “{query}”</p>
                <button type="button" onClick={() => setQuery("")} className="text-[13px] font-medium text-[#0071e3] hover:underline">
                  Clear the filter
                </button>
              </div>
            ) : view === "icons" ? (
              <div className="grid grid-cols-3 gap-1 p-4 sm:grid-cols-4">
                {entries.map((e) => (
                  <button
                    key={e.name}
                    type="button"
                    onClick={() => setSelected(e.name)}
                    onDoubleClick={() => openEntry(e)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg px-2 py-3 text-center transition-colors ${
                      selected === e.name ? "bg-[#0071e3]/10 outline outline-1 outline-[#0071e3]/40" : "hover:bg-black/[0.04]"
                    }`}
                  >
                    <span className={`text-3xl leading-none ${e.kind === "folder" ? "text-[#64a8f5]" : "text-stone-300"}`}>
                      {e.kind === "folder" ? "◫" : "▤"}
                    </span>
                    <span className="w-full truncate text-xs text-stone-700">{e.name}</span>
                    <span className="text-[10px] text-stone-400">{e.detail}</span>
                  </button>
                ))}
              </div>
            ) : (
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-black/[0.07] text-[11px] uppercase tracking-wider text-stone-400">
                    <th className="px-4 py-2 font-semibold">Name</th>
                    <th className="px-4 py-2 font-semibold">Kind</th>
                    <th className="px-4 py-2 text-right font-semibold">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr
                      key={e.name}
                      onClick={() => setSelected(e.name)}
                      onDoubleClick={() => openEntry(e)}
                      className={`cursor-default border-b border-black/[0.04] last:border-0 ${selected === e.name ? "bg-[#0071e3]/10" : "hover:bg-black/[0.03]"}`}
                    >
                      <td className="px-4 py-2 text-stone-700">{e.kind === "folder" ? "◫ " : "▤ "}{e.name}</td>
                      <td className="px-4 py-2 text-stone-500">{e.detail}</td>
                      <td className="px-4 py-2 text-right tabular-nums text-stone-500">{e.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </MacWindow>

          {/* inspector: a second, independent window */}
          {infoOpen ? (
            <MacWindow
              title="Info"
              proxyIcon="ⓘ"
              toolbarStyle="unified"
              toolbarTrailing={
                <ToolbarButton icon="✕" label="Hide" onClick={() => setInfoOpen(false)} />
              }
              tabs={[]}
              showSeparator
              initialWidth={300}
              initialHeight={240}
              minWidth={260}
              minHeight={200}
              active={focus === "info"}
              onActivate={() => setFocus("info")}
              statusBar={<span>{focus === "info" ? "Key window" : "Click to focus"}</span>}
            >
              <div className="flex flex-col gap-2 px-4 py-4 text-[13px]">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-10 place-items-center rounded-lg bg-[#0071e3]/10 text-xl text-[#0071e3]">
                    {selEntry?.kind === "file" ? "▤" : "◫"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-stone-800">{selEntry?.name ?? "Nothing selected"}</p>
                    <p className="text-xs text-stone-400">{selEntry ? `${selEntry.detail} · ${selEntry.size}` : "Select a file above"}</p>
                  </div>
                </div>
                <div className="mt-1 rounded-lg bg-stone-50 p-3 text-xs leading-relaxed text-stone-500">
                  This is a <span className="font-semibold text-stone-700">second window</span>, not a
                  sidebar. Close it, move it, resize it — the browser keeps working. Click between
                  the two and watch the traffic lights fade on the one that loses focus.
                </div>
              </div>
            </MacWindow>
          ) : (
            <button
              type="button"
              onClick={() => { setInfoOpen(true); setFocus("info"); }}
              className="rounded-full border border-stone-300 bg-white/80 px-4 py-2 text-xs font-medium text-stone-600 shadow-sm backdrop-blur transition-colors hover:border-[#0071e3]/50 hover:text-[#0071e3]"
            >
              ⓘ Get Info — reopen the inspector window
            </button>
          )}

          <p className="rounded-full bg-stone-900/80 px-4 py-1.5 text-[11px] font-medium text-white backdrop-blur">
            {focus === "main" ? "Browser is the key window" : "Inspector is the key window"} · drag any corner — the browser stops at 480 × 380
          </p>
        </div>

        <div className="grid gap-3 text-[13px] leading-relaxed text-stone-600 md:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white p-4"><span className="font-semibold text-stone-800">Two rows, one reason</span> — back/forward ride with the title; path, view, and search get the full second row.</div>
          <div className="rounded-xl border border-stone-200 bg-white p-4"><span className="font-semibold text-stone-800">Click between windows</span> — the unfocused one dims its lights and shadow. That&apos;s key vs inactive, the focus ring of window management.</div>
          <div className="rounded-xl border border-stone-200 bg-white p-4"><span className="font-semibold text-stone-800">Shrink it hard</span> — the grid survives because the resize clamps at a minimum. Limits are a layout feature, not a restriction.</div>
        </div>

        <ScenarioNav
          prev={{ href: "/scenarios/media-viewer", label: "Media viewer" }}
          next={{ href: "/", label: "Anatomy hub" }}
        />
      </div>
    </main>
  );
}
