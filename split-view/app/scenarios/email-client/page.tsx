"use client";

import { useState, useCallback, useRef } from "react";

type Folder = {
  id: string;
  name: string;
  icon: string;
  count: number;
};

type Email = {
  id: number;
  from: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
  body: string;
  to: string;
};

const folders: Folder[] = [
  { id: "inbox", name: "Inbox", icon: "📥", count: 12 },
  { id: "sent", name: "Sent", icon: "📤", count: 45 },
  { id: "drafts", name: "Drafts", icon: "📝", count: 2 },
  { id: "trash", name: "Trash", icon: "🗑", count: 128 },
  { id: "archive", name: "Archive", icon: "📦", count: 1247 },
];

const emails: Email[] = [
  {
    id: 1,
    from: "Sarah Chen",
    subject: "Q3 Design Review — Updated Mockups",
    preview: "Hi team, I've updated the mockups based on last week's feedback...",
    date: "10:42 AM",
    unread: true,
    to: "you@company.com",
    body: `Hi team,

I've updated the mockups based on last week's feedback. The main changes are:

1. The navigation sidebar now uses a collapsible pattern instead of the fixed drawer — this gives more screen real estate on smaller displays.
2. The card grid uses a 4-column layout at desktop with a clean 2-column fallback on tablet.
3. I've added subtle entrance animations on the cards so the page doesn't feel static when it loads.

Please review before Thursday's stakeholder meeting. If you have any questions, drop a comment in the Figma file or ping me here.

Thanks,
Sarah`,
  },
  {
    id: 2,
    from: "GitHub",
    subject: "[name-that-ui] Pull request #47: Fix divider cursor",
    preview: "marcusdev requested your review on this pull request...",
    date: "9:15 AM",
    unread: true,
    to: "you@company.com",
    body: `marcusdev opened a pull request in name-that-ui/split-view

Fix divider cursor on Windows

The cursor was showing as "col-resize" on all platforms, but on Windows it should be the native resize cursor. This PR swaps to "ew-resize" which resolves the issue on Windows while keeping the correct behavior on macOS and Linux.

Changes:
- Updated cursor class in Divider component
- Added platform-specific cursor fallback in CSS
- Updated snapshot tests

Reviewers: @you`,
  },
  {
    id: 3,
    from: "Alex Rivera",
    subject: "Re: Coffee tomorrow?",
    preview: "Sure! How about 9:30 at the usual spot? I'll bring my laptop...",
    date: "Yesterday",
    unread: false,
    to: "you@company.com",
    body: `Hey!

Sure! How about 9:30 at the usual spot? I'll bring my laptop so we can go over the prototype if you want.

I've been thinking about the split view component — I think we should add keyboard shortcuts for resizing the panes. Something like Cmd+1 to collapse the left pane, Cmd+2 to reset, Cmd+3 to collapse the right.

Anyway, let's talk tomorrow. See you at 9:30!

Alex`,
  },
  {
    id: 4,
    from: "Notion",
    subject: "Your weekly digest is ready",
    preview: "You edited 8 pages, commented 3 times, and were mentioned in 2...",
    date: "Yesterday",
    unread: false,
    to: "you@company.com",
    body: `Your Weekly Digest — August 11–17, 2026

Activity Summary:
• Pages edited: 8
• Comments made: 3
• Mentions: 2
• Documents shared: 1

Trending in your workspace:
The "Split View Component" page was viewed 47 times this week — up 120% from last week.

Keep it up! Your team is staying productive.`,
  },
  {
    id: 5,
    from: "Jordan Patel",
    subject: "Accessibility audit findings",
    preview: "Hey, ran the axe scan on the split view. Found a few issues...",
    date: "Aug 15",
    unread: false,
    to: "you@company.com",
    body: `Hey,

Ran the axe accessibility scan on the split view component. Found a few issues we should fix before shipping:

1. The drag dividers aren't keyboard accessible — need tabindex and arrow key handlers.
2. Color contrast on the unread dot is 3.8:1, needs to be at least 4.5:1 for WCAG AA.
3. The folder list items should be wrapped in a nav landmark with an aria-label.

Nothing critical, but we should knock these out this sprint. I can pair with you on the keyboard nav stuff if you want.

Jordan`,
  },
  {
    id: 6,
    from: "Vercel",
    subject: "Deployment successful: split-view@main",
    preview: "Your deployment to https://split-view-xyz.vercel.app is live...",
    date: "Aug 14",
    unread: false,
    to: "you@company.com",
    body: `Deployment Successful

Project: split-view
Branch: main
Commit: a3f8c2d — "Add email client scenario"

Status: ✓ Ready
Preview: https://split-view-xyz.vercel.app

Performance:
• Build time: 24s
• First Load JS: 89.2 kB
• Total route size: 142 kB

All checks passed. No warnings.`,
  },
];

export default function EmailClientPage() {
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [folderWidth, setFolderWidth] = useState(200);
  const [listWidth, setListWidth] = useState(350);
  const [folderCollapsed, setFolderCollapsed] = useState(false);
  const dragRef = useRef<"folder" | "list" | null>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleDragStart = useCallback(
    (pane: "folder" | "list") => (e: React.MouseEvent) => {
      e.preventDefault();
      dragRef.current = pane;
      startXRef.current = e.clientX;
      if (pane === "folder") {
        startWidthRef.current = folderWidth;
      } else {
        startWidthRef.current = listWidth;
      }

      const handleMouseMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startXRef.current;
        if (dragRef.current === "folder") {
          const next = Math.min(Math.max(startWidthRef.current + dx, 0), 320);
          setFolderWidth(next);
          if (next < 40) setFolderCollapsed(true);
          else setFolderCollapsed(false);
        } else {
          setListWidth(Math.max(startWidthRef.current + dx, 200));
        }
      };

      const handleMouseUp = () => {
        dragRef.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [folderWidth, listWidth],
  );

  const toggleFolder = () => {
    if (folderCollapsed) {
      setFolderCollapsed(false);
      setFolderWidth(200);
    } else {
      setFolderCollapsed(true);
      setFolderWidth(0);
    }
  };

  const currentEmail = emails[selectedIndex];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleFolder}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500"
            title={folderCollapsed ? "Show folders" : "Hide folders"}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {folderCollapsed ? (
                <>
                  <line x1="3" y1="4" x2="15" y2="4" />
                  <line x1="3" y1="9" x2="15" y2="9" />
                  <line x1="3" y1="14" x2="15" y2="14" />
                </>
              ) : (
                <>
                  <line x1="12" y1="4" x2="3" y2="4" />
                  <line x1="12" y1="9" x2="3" y2="9" />
                  <line x1="12" y1="14" x2="3" y2="14" />
                </>
              )}
            </svg>
          </button>
          <h1 className="text-sm font-semibold text-gray-900 tracking-tight">
            {folders.find((f) => f.id === selectedFolder)?.name}
          </h1>
        </div>
        <span className="text-xs text-gray-400 font-mono">Email Client — Three-Pane Split View</span>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {folderWidth > 0 && (
          <>
            <aside
              className="flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden"
              style={{ width: folderWidth }}
            >
              <nav className="flex-1 overflow-y-auto py-2">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm transition-colors ${
                      selectedFolder === folder.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-base leading-none">{folder.icon}</span>
                    <span className="flex-1 truncate">{folder.name}</span>
                    <span
                      className={`text-xs tabular-nums ${
                        selectedFolder === folder.id ? "text-blue-500" : "text-gray-400"
                      }`}
                    >
                      {folder.count.toLocaleString()}
                    </span>
                  </button>
                ))}
              </nav>
            </aside>
            <div
              className="w-1 flex-shrink-0 cursor-col-resize hover:bg-blue-200 active:bg-blue-300 transition-colors relative group"
              onMouseDown={handleDragStart("folder")}
            >
              <div className="absolute inset-y-0 -left-1 -right-1" />
            </div>
          </>
        )}

        <section
          className="flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden"
          style={{ width: listWidth }}
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {emails.length} messages
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {emails.map((email, i) => (
              <button
                key={email.id}
                onClick={() => setSelectedIndex(i)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors ${
                  i === selectedIndex
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {email.unread && (
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  )}
                  <div className={`flex-1 min-w-0 ${!email.unread ? "pl-[18px]" : ""}`}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={`text-sm truncate ${
                          email.unread ? "font-semibold text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {email.from}
                      </span>
                      <span className="text-xs text-gray-400 flex-shrink-0 tabular-nums">
                        {email.date}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate mt-0.5 ${
                        email.unread ? "font-medium text-gray-800" : "text-gray-500"
                      }`}
                    >
                      {email.subject}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{email.preview}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <div
          className="w-1 flex-shrink-0 cursor-col-resize hover:bg-blue-200 active:bg-blue-300 transition-colors relative group"
          onMouseDown={handleDragStart("list")}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </div>

        <main className="flex-1 bg-white overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-8">
            <div className="border-b border-gray-100 pb-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentEmail.subject}
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                  {currentEmail.from.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-gray-900">{currentEmail.from}</span>
                    <span className="text-xs text-gray-400">{currentEmail.date}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    To: {currentEmail.to}
                  </div>
                </div>
              </div>
            </div>
            <div className="prose prose-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {currentEmail.body}
            </div>
          </div>
        </main>
      </div>

      <footer className="flex items-center justify-between px-6 py-2 bg-white border-t border-gray-200 text-xs text-gray-400">
        <a
          href="/scenarios/code-editor"
          className="hover:text-blue-600 transition-colors"
        >
          ← Code Editor
        </a>
        <a
          href="/scenarios/dashboard-builder"
          className="hover:text-blue-600 transition-colors"
        >
          Dashboard Builder →
        </a>
      </footer>
    </div>
  );
}
