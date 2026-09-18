"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { GripDots, ScenarioNav, WhyFits } from "../../ScenarioNav";

type Doc = { id: string; name: string; kind: string; size: string; color: string };
type AlbumId = "portfolio" | "review" | "archive";

const INBOX: Doc[] = [
  { id: "d1", name: "Harbor sunrise.jpg", kind: "JPG", size: "4.2 MB", color: "#0ea5e9" },
  { id: "d2", name: "Client contract.pdf", kind: "PDF", size: "1.1 MB", color: "#ef4444" },
  { id: "d3", name: "Studio portrait.png", kind: "PNG", size: "8.7 MB", color: "#8b5cf6" },
  { id: "d4", name: "Site visit notes.md", kind: "MD", size: "12 KB", color: "#10b981" },
  { id: "d5", name: "Invoice March.pdf", kind: "PDF", size: "96 KB", color: "#f59e0b" },
];

const ALBUMS: { id: AlbumId; title: string; hint: string }[] = [
  { id: "portfolio", title: "Portfolio", hint: "Whole region accepts" },
  { id: "review", title: "Needs review", hint: "Top half ★ · bottom half later" },
  { id: "archive", title: "Archive", hint: "Whole region accepts" },
];

function FileTile({ doc, dim }: { doc: Doc; dim?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-10 shrink-0 place-items-center rounded-lg font-mono text-[10px] font-bold text-white ${dim ? "opacity-70" : ""}`}
      style={{ backgroundColor: doc.color }}
    >
      {doc.kind}
    </span>
  );
}

export default function FileDropzonePage() {
  const [inbox, setInbox] = useState<Doc[]>(INBOX);
  const [albums, setAlbums] = useState<Record<AlbumId, Doc[]>>({
    portfolio: [],
    review: [],
    archive: [],
  });
  const [osFiles, setOsFiles] = useState<{ name: string; size: number }[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overAlbum, setOverAlbum] = useState<AlbumId | null>(null);
  const [splitHalf, setSplitHalf] = useState<"top" | "bottom" | null>(null);
  const [osOver, setOsOver] = useState(false);
  const [live, setLive] = useState(
    "Inbox holds 5 unsorted files. Drag one onto an album — the whole album lights up; Needs review even splits into two halves."
  );
  const osInput = useRef<HTMLInputElement>(null);

  const findDoc = (id: string): Doc | null =>
    inbox.find((d) => d.id === id) ??
    albums.portfolio.find((d) => d.id === id) ??
    albums.review.find((d) => d.id === id) ??
    albums.archive.find((d) => d.id === id) ??
    null;

  const start = (e: React.DragEvent, doc: Doc) => {
    setDragId(doc.id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", doc.id);
    const el = document.createElement("div");
    el.className = "dnd-ghost";
    el.innerHTML = `<div style="display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #e7e5e4;font:600 12px system-ui;color:#1c1917;padding:7px 12px;border-radius:10px;box-shadow:0 10px 26px rgba(0,0,0,.22);white-space:nowrap"><span style="display:grid;place-items:center;width:22px;height:22px;border-radius:6px;background:${doc.color};color:#fff;font:700 9px system-ui">${doc.kind}</span>${doc.name}</div>`;
    document.body.appendChild(el);
    try {
      e.dataTransfer.setDragImage(el, 18, 18);
    } catch {
      /* noop */
    }
    window.setTimeout(() => el.remove(), 0);
    setLive(
      `Picked up ${doc.name}. Albums Portfolio, Needs review and Archive are available. Release over one to file it.`
    );
  };

  const albumOver = (e: React.DragEvent, id: AlbumId) => {
    if (!dragId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverAlbum(id);
    if (id === "review") {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setSplitHalf(e.clientY < rect.top + rect.height / 2 ? "top" : "bottom");
    } else {
      setSplitHalf(null);
    }
  };

  const albumDrop = (e: React.DragEvent, id: AlbumId) => {
    e.preventDefault();
    const docId = e.dataTransfer.getData("text/plain") || dragId;
    const doc = docId ? findDoc(docId) : null;
    if (!doc) return;
    setInbox((prev) => prev.filter((d) => d.id !== doc.id));
    setAlbums((prev) => {
      const clean: Record<AlbumId, Doc[]> = {
        portfolio: prev.portfolio.filter((d) => d.id !== doc.id),
        review: prev.review.filter((d) => d.id !== doc.id),
        archive: prev.archive.filter((d) => d.id !== doc.id),
      };
      const halfNote =
        id === "review" ? (splitHalf === "top" ? " (starred half)" : " (later half)") : "";
      clean[id] = [...clean[id], doc];
      setLive(`${doc.name} filed under ${ALBUMS.find((a) => a.id === id)?.title}${halfNote}.`);
      return clean;
    });
    setDragId(null);
    setOverAlbum(null);
    setSplitHalf(null);
  };

  const sendBack = (doc: Doc) => {
    setAlbums((prev) => ({
      portfolio: prev.portfolio.filter((d) => d.id !== doc.id),
      review: prev.review.filter((d) => d.id !== doc.id),
      archive: prev.archive.filter((d) => d.id !== doc.id),
    }));
    setInbox((prev) => (prev.some((d) => d.id === doc.id) ? prev : [...prev, doc]));
    setLive(`${doc.name} returned to the inbox.`);
  };

  const onOsOver = (e: React.DragEvent) => {
    if (Array.from(e.dataTransfer.types).includes("Files")) {
      e.preventDefault();
      setOsOver(true);
    }
  };

  const onOsDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setOsOver(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length === 0) return;
    setOsFiles((prev) => [
      ...prev,
      ...files.map((f) => ({ name: f.name, size: f.size })),
    ]);
    setLive(
      `${files.length} file${files.length > 1 ? "s" : ""} received from the operating system: ${files.map((f) => f.name).join(", ")}.`
    );
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <ScenarioNav current="/scenarios/file-dropzone/" />
        <header className="max-w-2xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-blue-700">
            Scenario 2 · drop-target highlight · split zone + OS files
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Photographer&apos;s file triage
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
            An unsorted inbox on the left, three albums on the right. Drag a
            file and each valid album washes blue — “Needs review” goes one step
            further and splits into a top ★ half and a bottom half. The dashed
            zone accepts real files dragged in from your computer.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          {/* inbox */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
            <h2 className="flex items-baseline justify-between text-[15px] font-semibold text-stone-900">
              Unsorted inbox
              <span className="font-mono text-[11px] font-normal text-stone-400">
                {inbox.length} remaining
              </span>
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {inbox.map((doc) => (
                <li
                  key={doc.id}
                  draggable
                  onDragStart={(e) => start(e, doc)}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverAlbum(null);
                    setSplitHalf(null);
                  }}
                  className={`flex items-center gap-2 rounded-xl border bg-[#fafaf9] p-2.5 transition-all hover:border-blue-600/40 hover:bg-white hover:shadow-md ${
                    dragId === doc.id ? "dnd-dragging border-blue-600" : "border-stone-200"
                  }`}
                >
                  <GripDots />
                  <FileTile doc={doc} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-stone-900">
                      {doc.name}
                    </span>
                    <span className="font-mono text-[10.5px] text-stone-400">
                      {doc.kind} · {doc.size}
                    </span>
                  </span>
                </li>
              ))}
              {inbox.length === 0 && (
                <li className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-3 py-8 text-center text-[13px] text-stone-400">
                  Inbox zero. Lovely — use “return” on any album file to practise
                  again.
                </li>
              )}
            </ul>
            <p className="mt-3 font-mono text-[10.5px] text-stone-300">
              ghost: file chip via setDragImage() · original fades at source
            </p>
          </section>

          {/* albums */}
          <section className="flex flex-col gap-3">
            {ALBUMS.map((album) => {
              const items = albums[album.id];
              const hot = overAlbum === album.id && dragId !== null;
              return (
                <div
                  key={album.id}
                  onDragOver={(e) => albumOver(e, album.id)}
                  onDragLeave={() => {
                    setOverAlbum((cur) => (cur === album.id ? null : cur));
                    setSplitHalf(null);
                  }}
                  onDrop={(e) => albumDrop(e, album.id)}
                  className={`relative overflow-hidden rounded-2xl border p-4 transition-all ${
                    hot
                      ? "border-blue-600 bg-blue-50/70 shadow-[0_0_0_2px_#2563eb33]"
                      : "border-stone-200 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)]"
                  }`}
                >
                  <header className="flex items-baseline justify-between">
                    <h3 className="text-[14px] font-semibold text-stone-900">
                      {album.title}
                      <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 font-mono text-[11px] text-stone-500">
                        {items.length}
                      </span>
                    </h3>
                    <p className="text-[11px] text-stone-400">{album.hint}</p>
                  </header>

                  {album.id === "review" && (
                    <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[10.5px]">
                      <span
                        className={`rounded-lg border px-2 py-1.5 text-center transition-colors ${
                          hot && splitHalf === "top"
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-stone-200 bg-stone-50 text-stone-500"
                        }`}
                      >
                        ★ top half
                      </span>
                      <span
                        className={`rounded-lg border px-2 py-1.5 text-center transition-colors ${
                          hot && splitHalf === "bottom"
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-stone-200 bg-stone-50 text-stone-500"
                        }`}
                      >
                        bottom half
                      </span>
                    </div>
                  )}

                  {items.length === 0 ? (
                    <p
                      className={`mt-2 rounded-xl border border-dashed px-3 py-4 text-center text-[12.5px] transition-colors ${
                        hot
                          ? "border-blue-600 bg-white/80 text-blue-800"
                          : "border-stone-300 bg-stone-50 text-stone-400"
                      }`}
                    >
                      {hot ? "Release to file it here." : "Drop files here."}
                    </p>
                  ) : (
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {items.map((doc) => (
                        <li
                          key={doc.id}
                          draggable
                          onDragStart={(e) => start(e, doc)}
                          onDragEnd={() => {
                            setDragId(null);
                            setOverAlbum(null);
                            setSplitHalf(null);
                          }}
                          className="flex items-center gap-2 rounded-lg border border-stone-200 bg-[#fafaf9] px-2.5 py-1.5"
                        >
                          <FileTile doc={doc} dim />
                          <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-stone-700">
                            {doc.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => sendBack(doc)}
                            className="shrink-0 rounded-md px-2 py-1 text-[11.5px] font-medium text-stone-400 hover:bg-white hover:text-blue-700 hover:shadow-sm"
                          >
                            Return
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </section>
        </div>

        {/* OS dropzone */}
        <section
          onDragOver={onOsOver}
          onDragLeave={() => setOsOver(false)}
          onDrop={onOsDrop}
          className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
            osOver
              ? "border-blue-600 bg-blue-50 shadow-[0_0_0_4px_#2563eb22]"
              : "border-stone-300 bg-white"
          }`}
        >
          <p className="text-[15px] font-semibold text-stone-900">
            {osOver ? "Release to upload." : "Drag files in from your computer"}
          </p>
          <p className="mx-auto mt-1 max-w-xl text-[13px] leading-relaxed text-stone-500">
            This is the same ondragover handshake, but the payload is{" "}
            <code className="rounded bg-stone-100 px-1 font-mono text-[12px]">
              dataTransfer.files
            </code>{" "}
            from the OS instead of an app card. No ghost here — your OS draws
            its own.
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => osInput.current?.click()}
              className="rounded-lg bg-stone-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-stone-700"
            >
              Or browse files
            </button>
            <input
              ref={osInput}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (!files.length) return;
                setOsFiles((prev) => [
                  ...prev,
                  ...files.map((f) => ({ name: f.name, size: f.size })),
                ]);
                setLive(`${files.length} file(s) added with the picker.`);
                e.target.value = "";
              }}
            />
            {osFiles.length > 0 && (
              <button
                type="button"
                onClick={() => setOsFiles([])}
                className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-[13px] font-medium text-stone-600 hover:border-red-300 hover:text-red-600"
              >
                Clear uploads
              </button>
            )}
          </div>
          {osFiles.length > 0 && (
            <ul className="mx-auto mt-4 grid max-w-2xl gap-1.5 text-left">
              {osFiles.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center justify-between rounded-lg border border-stone-200 bg-[#fafaf9] px-3 py-2 text-[12.5px]"
                >
                  <span className="truncate font-medium text-stone-800">{f.name}</span>
                  <span className="ml-3 shrink-0 font-mono text-[11px] text-stone-400">
                    {(f.size / 1024).toFixed(1)} KB
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
          <div
            role="status"
            aria-live="polite"
            className="rounded-2xl bg-stone-900 px-5 py-4 text-[13.5px] leading-relaxed text-stone-100"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone-400">
              Live region — pick-up, destination, result
            </span>
            <p className="mt-1">{live}</p>
          </div>
          <WhyFits>
            Triage is a <em>destination</em> problem: five loose files, three
            right homes. Lighting up the whole album says “valid”, while the
            split half on “Needs review” previews a precise sub-choice without
            a second dialog — one gesture files and prioritises, which is why
            mail apps, photo tools and drive sidebars all highlight targets
            instead of showing lines.
          </WhyFits>
        </div>

        <div className="flex flex-wrap gap-2 text-[13px]">
          <Link
            href="/scenarios/task-board/"
            className="rounded-full border border-stone-200 bg-white px-3 py-1.5 font-medium text-stone-600 hover:border-blue-600/40 hover:text-blue-700"
          >
            ← Task board
          </Link>
          <Link
            href="/scenarios/dashboard-canvas/"
            className="rounded-full bg-stone-900 px-3 py-1.5 font-medium text-white hover:bg-stone-700"
          >
            Next: Dashboard canvas →
          </Link>
        </div>
      </div>
    </main>
  );
}
