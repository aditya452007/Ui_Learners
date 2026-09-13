"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BackLink, ConfigChips, Eyebrow, ScenarioNav, WhyFit } from "@/components/chrome";

type Item = { id: string; group: string; glyph: string; title: string; hint: string };

const ITEMS: Item[] = [
  { id: "new-note", group: "Actions", glyph: "✎", title: "New note", hint: "Create a blank note" },
  { id: "export", group: "Actions", glyph: "⤴", title: "Export as PDF", hint: "Current note → PDF" },
  { id: "sidebar", group: "Actions", glyph: "◧", title: "Toggle sidebar", hint: "Show or hide folders" },
  { id: "share", group: "Actions", glyph: "◯", title: "Share note…", hint: "Invite Mara to edit" },
  { id: "q3", group: "Files", glyph: "◫", title: "Q3 planning", hint: "Edited 2h ago" },
  { id: "bergen", group: "Files", glyph: "◫", title: "Trip to Bergen", hint: "Edited yesterday" },
  { id: "reading", group: "Files", glyph: "◫", title: "Reading list", hint: "Edited last week" },
  { id: "mara", group: "People", glyph: "●", title: "Mara Chen", hint: "mara@studio.no" },
  { id: "jonas", group: "People", glyph: "●", title: "Jonas Weber", hint: "jonas@studio.no" },
];

const NOTES = ["Q3 planning", "Trip to Bergen", "Reading list", "Inbox"];

export default function SpotlightLauncher() {
  const [open, setOpen] = useState(true);
  const [nonactivating, setNonactivating] = useState(true);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [ran, setRan] = useState<string[]>([]);
  const [note, setNote] = useState(NOTES[0]);
  const [body, setBody] = useState(
    "Launch is Thursday. Mara owns the announcement post, Jonas owns the migration guide, and the icon debate stays parked until icons exist.",
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<number | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter(
      (i) => i.title.toLowerCase().includes(q) || i.group.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open ]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function flash(msg: string) {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }

  function run(item: Item) {
    setRan((r) => [item.title, ...r.filter((x) => x !== item.title)].slice(0, 4));
    setOpen(false);
    flash(`Ran “${item.title}” — the notes app never lost its place`);
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) run(item);
    }
  }

  const docKey = !open || nonactivating;
  let lastGroup = "";

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <BackLink />
        <div>
          <Eyebrow>Scenario 3 · Non-activating panel</Eyebrow>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">Command launcher that never steals focus</h1>
          <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-stone-600">
            Quicksilver-style launcher over a notes app. The panel uses{" "}
            <code className="rounded bg-stone-100 px-1 font-mono text-[13px]">nonactivatingPanel</code>:
            it appears, takes your keystrokes, and dismisses — while the document underneath keeps key
            status. Press <kbd className="rounded border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-xs">⌘K</kbd> to
            summon or dismiss it.
          </p>
        </div>
        <ConfigChips items={["StyleMask.nonactivatingPanel", "transient · Esc dismisses", "keyboard-first ↑↓ ↵", "NSPanel · utility"]} />
        <WhyFit>
          A launcher exists for a five-second errand: jump somewhere, run something, get back. If summoning
          it ripped focus out of your sentence, every errand would cost you your place. Non-activating panels
          make the round-trip free — compare the two modes below: with the switch on, the editor&apos;s key
          dot and caret survive the launcher; with it off, the document visibly loses key on every summon.
        </WhyFit>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg bg-stone-900 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-stone-700"
          >
            {open ? "Dismiss launcher (esc)" : "Summon launcher (⌘K)"}
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={nonactivating}
            onClick={() => setNonactivating((v) => !v)}
            className="flex items-center gap-2.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-left transition-colors hover:border-stone-300"
          >
            <span aria-hidden className={`relative h-[22px] w-9 shrink-0 rounded-full transition-colors ${nonactivating ? "bg-[#0071e3]" : "bg-stone-300"}`}>
              <span className={`absolute top-[3px] size-4 rounded-full bg-white shadow transition-all ${nonactivating ? "left-[18px]" : "left-[3px]"}`} />
            </span>
            <span>
              <span className="block text-[13px] font-medium leading-tight text-stone-800">Non-activating</span>
              <span className="block font-mono text-[10px] leading-tight text-stone-400">nonactivatingPanel</span>
            </span>
          </button>
        </div>

        <div className="desktop-dots relative min-h-[620px] overflow-hidden rounded-2xl border border-stone-300/70 p-4 sm:p-8">
          {/* notes document window */}
          <div className="relative mx-auto w-full max-w-[720px]" style={{ zIndex: 10 }}>
            <div
              className={`flex min-h-[420px] overflow-hidden rounded-xl border bg-white transition-all ${
                docKey ? "border-stone-300 shadow-[0_16px_44px_rgba(0,0,0,0.16)]" : "border-stone-200 opacity-75 shadow-md saturate-50"
              }`}
            >
              <aside className="hidden w-44 shrink-0 flex-col border-r border-stone-200 bg-stone-50 sm:flex">
                <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Notes</p>
                {NOTES.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNote(n)}
                    className={`mx-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors ${
                      note === n ? "bg-stone-200/70 font-medium text-stone-900" : "text-stone-600 hover:bg-stone-200/40"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                {ran.length > 0 && (
                  <>
                    <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Ran via launcher</p>
                    {ran.map((r) => (
                      <p key={r} className="mx-2 truncate rounded-lg bg-[#e8f1fd]/70 px-2.5 py-1.5 text-[12px] text-stone-700">✓ {r}</p>
                    ))}
                  </>
                )}
              </aside>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-2 border-b border-stone-200 px-3 py-2">
                  <span className="flex gap-1.5" aria-hidden>
                    <span className="size-3 rounded-full bg-[#ff5f57]" />
                    <span className="size-3 rounded-full bg-[#febc2e]" />
                    <span className="size-3 rounded-full bg-[#28c840]" />
                  </span>
                  <p className="flex-1 truncate text-center text-[12px] font-semibold text-stone-600">{note}</p>
                  <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] ${docKey ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-400"}`}>
                    <span aria-hidden className={`size-1.5 rounded-full ${docKey ? "bg-emerald-500" : "bg-stone-300"}`} />
                    {docKey ? "key" : "not key"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <p className="text-lg font-semibold text-stone-900">{note}</p>
                  <div className="relative">
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={6}
                      aria-label="Note body"
                      className="w-full resize-none rounded-lg border border-transparent p-1 text-sm leading-relaxed text-stone-700 outline-none focus:border-[#0071e3]/40 focus:bg-[#e8f1fd]/30"
                    />
                    {docKey && open && nonactivating && (
                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-700">
                        <span aria-hidden className="caret-blink inline-block h-3.5 w-[2px] bg-emerald-600" />
                        Simulated caret — on macOS your typing position survives the launcher
                      </p>
                    )}
                  </div>
                  <p className="mt-auto font-mono text-[11px] text-stone-400">342 words · edited just now · synced</p>
                </div>
              </div>
            </div>
          </div>

          {/* launcher panel */}
          {open && (
            <div
              role="dialog"
              aria-label="Command launcher"
              className="launcher-in absolute left-1/2 top-16 z-40 w-[min(560px,calc(100%-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-stone-300/70 bg-white/95 shadow-[0_32px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl"
            >
              <div className="flex items-center gap-2.5 border-b border-stone-200 px-4 py-3">
                <span aria-hidden className="text-stone-400">⌘</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder="Type a command or search…"
                  aria-label="Launcher search"
                  aria-expanded="true"
                  aria-controls="launcher-list"
                  aria-activedescendant={results[active]?.id}
                  role="combobox"
                  autoComplete="off"
                  className="flex-1 bg-transparent text-[15px] text-stone-900 outline-none placeholder:text-stone-400"
                />
                <kbd className="rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 font-mono text-[10px] text-stone-400">esc</kbd>
              </div>
              <ul id="launcher-list" role="listbox" aria-label="Results" className="mac-scroll max-h-72 overflow-y-auto p-2">
                {results.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-stone-500">
                    No matches for “{query}” — try “note”, “export”, or “mara”.
                  </li>
                )}
                {results.map((item, i) => {
                  const header = item.group !== lastGroup ? item.group : null;
                  lastGroup = item.group;
                  return (
                    <li key={item.id}>
                      {header && (
                        <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">{header}</p>
                      )}
                      <button
                        id={item.id}
                        type="button"
                        role="option"
                        aria-selected={i === active}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => run(item)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                          i === active ? "bg-[#0071e3] text-white" : "text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        <span aria-hidden className={`grid size-7 shrink-0 place-items-center rounded-md text-sm ${i === active ? "bg-white/20" : "bg-stone-100 text-stone-500"}`}>
                          {item.glyph}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{item.title}</span>
                          <span className={`block truncate text-xs ${i === active ? "text-white/75" : "text-stone-400"}`}>{item.hint}</span>
                        </span>
                        {i === active && <span aria-hidden className="font-mono text-xs text-white/75">↵</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center gap-4 border-t border-stone-200 bg-stone-50 px-4 py-2 font-mono text-[10px] text-stone-400">
                <span>↑↓ navigate</span>
                <span>↵ run</span>
                <span>esc dismiss</span>
                <span className="flex-1" />
                <span>{nonactivating ? "nonactivatingPanel · app stays key" : "ordinary panel · app loses key"}</span>
              </div>
            </div>
          )}

          {toast && (
            <div className="toast-up absolute bottom-5 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-stone-900 px-4 py-2 text-xs font-medium text-white shadow-lg">
              {toast}
            </div>
          )}
        </div>

        <ScenarioNav
          prev={{ href: "/scenarios/hud-inspector", label: "Color HUD" }}
          next={{ href: "/", label: "Anatomy hub" }}
        />
      </div>
    </main>
  );
}
