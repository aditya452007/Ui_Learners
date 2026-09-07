"use client";

import { useState } from "react";
import UnifiedToolbar, {
  TButton,
  TDivider,
  TSegment,
  type ToolbarItem,
} from "@/components/toolbar";
import {
  BackLink,
  ConfigChips,
  PageHeader,
  ScenarioNav,
  WhyFit,
} from "@/components/chrome";

type View = "edit" | "review";

const PARAS = [
  "Quill & Co. ships its spring catalog with twelve new field notebooks, and this proposal asks for one thing: a launch page that reads like the paper feels.",
  "Every spread below pairs a product shot with a single honest sentence. No carousel, no popups — the toolbar stays quiet so the paper can talk.",
  "Mara owns photography, Dev owns the storefront, and Priya signs off on copy. Review mode (try it in the toolbar) pins each owner's notes to the margin.",
];

const NOTES = [
  "Mara: swap spread 2 for the canyon shoot — warmer light.",
  "Dev: checkout needs the gift-wrap toggle before Friday.",
  "Priya: “honest sentence” rule holds. Cut adjectives, keep nouns.",
];

export default function DocumentEditor() {
  const [title, setTitle] = useState("Launch Proposal");
  const [view, setView] = useState<View>("edit");
  const [sideOpen, setSideOpen] = useState(true);
  const [selPara, setSelPara] = useState<number | null>(0);
  const [comments, setComments] = useState<string[]>(NOTES.slice(0, 2));
  const [toast, setToast] = useState<string | null>(null);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  }

  const words = PARAS.join(" ").split(/\s+/).length;

  const items: ToolbarItem[] = [
    {
      id: "sidebar",
      label: "Sidebar",
      icon: "◧",
      priority: 90,
      widths: { "icon-text": 54, icon: 42, text: 62 },
      onAction: () => setSideOpen((v) => !v),
      render: (m) => (
        <TButton icon="◧" label="Sidebar" mode={m} pressed={sideOpen} onClick={() => setSideOpen((v) => !v)} />
      ),
    },
    {
      id: "view",
      label: "View",
      icon: "◫",
      priority: 85,
      control: true,
      widths: { "icon-text": 132, icon: 132, text: 132 },
      render: () => (
        <TSegment
          options={["edit", "review"] as const}
          value={view}
          onChange={setView}
          ariaLabel="View mode"
          labels={{ edit: "Edit", review: "Review" }}
        />
      ),
    },
    {
      id: "div",
      label: "",
      icon: "",
      priority: 55,
      widths: { "icon-text": 14, icon: 14, text: 14 },
      render: () => <TDivider />,
    },
    {
      id: "comment",
      label: "Comment",
      icon: "💬",
      priority: 75,
      widths: { "icon-text": 62, icon: 42, text: 70 },
      onAction: () => {
        if (selPara === null) return;
        setComments((c) => [...c, `Note on paragraph ${selPara + 1} — “tighten this.”`]);
        flash("Comment added to the margin");
      },
      render: (m) => (
        <TButton
          icon="💬"
          label="Comment"
          mode={m}
          disabled={selPara === null}
          onClick={() => {
            if (selPara === null) return;
            setComments((c) => [...c, `Note on paragraph ${selPara + 1} — “tighten this.”`]);
            flash("Comment added to the margin");
          }}
        />
      ),
    },
    {
      id: "share",
      label: "Share",
      icon: "⤴",
      priority: 80,
      widths: { "icon-text": 54, icon: 42, text: 56 },
      onAction: () => flash("Invite link copied — Priya can now review"),
      render: (m) => (
        <TButton icon="⤴" label="Share" mode={m} onClick={() => flash("Invite link copied — Priya can now review")} />
      ),
    },
    {
      id: "flex",
      label: "",
      icon: "",
      priority: 1000,
      flexible: true,
      widths: { "icon-text": 0, icon: 0, text: 0 },
      render: () => null,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <BackLink />
        <PageHeader
          eyebrow="Scenario 1 · document editor"
          title="Pages-style proposal writer"
          alsoCalled="inline title · validated format actions · line separator"
          lede={
            <p>
              A writing app where the document name lives inside the toolbar and actions
              enable themselves only when they make sense. Click a paragraph to select it —
              Comment wakes up. Click empty space to deselect — Comment sleeps again.
            </p>
          }
        />
        <ConfigChips
          items={[
            "ToolbarStyle.unified",
            "editable title",
            "segment group (Edit/Review)",
            "validation: Comment disabled",
            "separator: line",
          ]}
        />

        <div className="desktop-dots relative flex min-h-[480px] items-center justify-center overflow-hidden rounded-2xl border border-stone-300/70 p-6 sm:p-10">
          <UnifiedToolbar
            title={title}
            proxyIcon="📄"
            editableTitle
            onTitleChange={setTitle}
            items={items}
            displayMode="icon-text"
            separator="line"
            width={660}
            contentHeight={300}
            statusBar={
              <>
                <span>
                  {words} words · {comments.length} margin notes
                </span>
                <span className="flex-1" />
                <span>{view === "edit" ? "Editing" : "Reviewing"}</span>
              </>
            }
          >
            <div className="flex gap-6 px-7 py-6">
              <div className="min-w-0 flex-1">
                {sideOpen && (
                  <div className="mb-4 flex gap-1.5">
                    {["Outline", "Drafts", "Archive"].map((s, i) => (
                      <span
                        key={s}
                        className={`rounded-md px-2.5 py-1 text-xs ${i === 1 ? "bg-black/[0.07] font-medium text-stone-800" : "text-stone-500"}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex max-w-lg flex-col gap-1">
                  {PARAS.map((p, i) => {
                    const sel = selPara === i;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelPara(sel ? null : i)}
                        aria-pressed={sel}
                        className={`rounded-lg px-3 py-2.5 text-left text-[15px] leading-relaxed transition-colors ${
                          sel
                            ? "bg-[#e8f1fd] text-stone-900 outline outline-1 outline-[#0071e3]/40"
                            : "text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 max-w-lg text-xs leading-relaxed text-stone-400">
                  Click a paragraph to select it (enables Comment ↑). Click it again — or
                  press Escape — to deselect. Click the title to rename the proposal.
                </p>
              </div>
              {view === "review" && (
                <aside className="hidden w-52 shrink-0 flex-col gap-2 border-l border-stone-100 pl-4 sm:flex">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                    Margin · {comments.length}
                  </p>
                  {comments.map((c, i) => (
                    <div key={`${c}-${i}`} className="rounded-lg bg-amber-50 px-3 py-2 text-[13px] leading-snug text-stone-700 ring-1 ring-amber-200/60">
                      {c}
                    </div>
                  ))}
                </aside>
              )}
            </div>
          </UnifiedToolbar>

          {toast && (
            <div className="absolute bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-4 py-2 text-xs font-medium text-white shadow-lg">
              {toast}
            </div>
          )}
        </div>

        <WhyFit>
          <p>
            A document editor needs its name and its verbs in one glanceable strip: rename
            without a dialog, switch Edit/Review without a menu, comment the moment text is
            selected. The permanent line separator keeps chrome and manuscript apart at any
            scroll position, and validation (disabled Comment) teaches the rule — show the
            action, explain by greying — better than hiding it.
          </p>
        </WhyFit>

        <ScenarioNav
          prev={{ href: "/", label: "Anatomy hub" }}
          next={{ href: "/scenarios/mail-inbox", label: "Mail inbox" }}
        />
      </div>
    </main>
  );
}
