"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const ANATOMY_PARTS = [
  {
    id: 1,
    label: "Pane (NSSplitViewItem)",
    whatYouSee:
      "Each pane is an independent content region. The left pane typically holds navigation or a sidebar, while the right pane holds the main content — like a file list beside a file preview.",
    howItWorks:
      "A pane is a React component that receives a width value and renders its children at that width. Think of it like a drawer — you decide how wide each drawer is, and the contents fill the space. Each pane manages its own scrolling and layout independently of the others.",
  },
  {
    id: 2,
    label: "Split-view Divider (splitter)",
    whatYouSee:
      "The thin vertical line between two panes. Dragging it left or right changes the size of each pane — like pulling apart two curtains to reveal more of one side.",
    howItWorks:
      "The divider is a narrow HTML element with a 'col-resize' cursor. It listens for mouse-down events, then tracks mouse movement globally until mouse-up. The distance dragged is converted to a percentage and stored in React state — which triggers a re-render with the new pane widths.",
  },
  {
    id: 3,
    label: "Sidebar Collapse",
    whatYouSee:
      "A small button that hides the sidebar entirely. The main content expands to fill the full width. It's the difference between seeing your folder list and seeing just the document you're reading.",
    howItWorks:
      "A boolean state value (collapsed) toggles the sidebar between visible and hidden. When collapsed, the left pane's width animates to zero and the right pane takes 100%. This is achieved by swapping the width values in state — React re-renders and CSS transitions handle the smooth animation.",
  },
  {
    id: 4,
    label: "Tracking Separator",
    whatYouSee:
      "A thin horizontal line in the toolbar area that stays perfectly aligned above the divider. It visually connects the toolbar controls to the split view below, so the layout feels like one cohesive unit.",
    howItWorks:
      "The tracking separator is a styled div that reads the same width state as the left pane. It positions itself to end exactly where the divider sits. Think of it like a ruler's edge that moves with the divider — it tracks the same value and stays in sync without any extra logic.",
  },
];

export default function SplitViewPage() {
  const [leftWidth, setLeftWidth] = useState(280);
  const [collapsed, setCollapsed] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const MIN_PANE = 180;
  const MAX_PANE_RATIO = 0.6;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      startX.current = e.clientX;
      startWidth.current = collapsed ? 0 : leftWidth;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [collapsed, leftWidth]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const delta = e.clientX - startX.current;
      const maxW = containerWidth * MAX_PANE_RATIO;
      const newWidth = Math.max(MIN_PANE, Math.min(maxW, startWidth.current + delta));
      setLeftWidth(newWidth);
      if (collapsed) setCollapsed(false);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [collapsed]);

  return (
    <main className="min-h-screen bg-white">
      {/* Title section */}
      <section className="max-w-4xl mx-auto px-8 pt-16 pb-10">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
          Split View
        </h1>
        <p className="mt-3 text-base text-gray-400 font-mono">
          Also called: split pane, splitter view, multi-pane layout, navigation
          split view
        </p>
        <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl">
          A split view divides an interface into two or more independently sized
          regions separated by a draggable divider. It exists so users can
          control how much space each region gets — like resizing a file list
          beside a preview in Finder, or a terminal beside an editor in VS Code.
        </p>
      </section>

      {/* Structure strip */}
      <section className="max-w-4xl mx-auto px-8 pb-12">
        <div className="grid grid-cols-3 gap-4">
          {[
            { title: "Pane", desc: "Independent content region" },
            { title: "Divider", desc: "Draggable resize handle" },
            { title: "Collapse", desc: "Sidebar folds away" },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-gray-200 bg-gray-50/60 px-5 py-4"
            >
              <div className="text-sm font-medium text-gray-900">
                {card.title}
              </div>
              <div className="mt-1 text-sm text-gray-500">{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Live anatomy diagram */}
      <section className="max-w-4xl mx-auto px-8 pb-16">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">
          Anatomy
        </h2>

        <div className="relative border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden bg-gray-50/40">
          {/* Tracking separator — stays aligned above the divider */}
          <div className="relative h-10 border-b border-gray-200 bg-white flex items-center px-4">
            <div className="flex gap-3">
              <div className="w-16 h-5 rounded bg-gray-100" />
              <div className="w-10 h-5 rounded bg-gray-100" />
              <div className="w-12 h-5 rounded bg-gray-100" />
            </div>
            {/* The tracking line */}
            <div
              className="absolute bottom-0 h-[2px] bg-indigo-400 transition-none"
              style={{ left: 0, width: collapsed ? "0%" : leftWidth }}
            />
            {/* Callout ④ */}
            <div className="absolute -bottom-11 right-4 flex items-center gap-2 z-10">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-semibold shrink-0">
                4
              </span>
              <span className="text-xs text-indigo-600 font-medium whitespace-nowrap">
                Tracking Separator
              </span>
            </div>
          </div>

          {/* Split view body */}
          <div
            ref={containerRef}
            className="relative flex h-[500px]"
          >
            {/* Left pane */}
            <div
              className="shrink-0 bg-white border-r border-gray-200 overflow-y-auto transition-none"
              style={{ width: collapsed ? 0 : leftWidth }}
            >
              {!collapsed && (
                <div className="p-5 space-y-3">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Sidebar
                  </div>
                  {[
                    "Dashboard",
                    "Projects",
                    "Messages",
                    "Settings",
                    "Team",
                    "Analytics",
                    "Reports",
                    "Billing",
                    "Integrations",
                    "API Keys",
                  ].map((item, i) => (
                    <div
                      key={item}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        i === 0
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div
              onMouseDown={handleMouseDown}
              className="relative w-[5px] bg-gray-200 hover:bg-indigo-400 active:bg-indigo-500 cursor-col-resize shrink-0 z-20 transition-colors"
            >
              {/* Collapse button — sits on the divider */}
              <button
                onClick={() => setCollapsed((c) => !c)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-10 bg-white border border-gray-300 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 shadow-sm z-30"
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M6.5 2L3.5 5L6.5 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M3.5 2L6.5 5L3.5 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Right pane */}
            <div className="flex-1 bg-white overflow-y-auto">
              <div className="p-8 max-w-lg">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Main Content
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Welcome back
                </h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                  This is the main content area. Drag the divider to resize
                  the panes, or click the arrow button to collapse the
                  sidebar entirely.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {[
                    { label: "Total Users", value: "12,847" },
                    { label: "Active Now", value: "342" },
                    { label: "Revenue", value: "$48,290" },
                    { label: "Growth", value: "+14.2%" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-gray-200 bg-gray-50/60 p-4"
                    >
                      <div className="text-xs text-gray-400">{stat.label}</div>
                      <div className="mt-1 text-lg font-semibold text-gray-900">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Callout ① — Left pane */}
            <div className="absolute top-8 left-6 flex items-center gap-2 z-10">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-semibold shrink-0">
                1
              </span>
              <span className="text-xs text-indigo-600 font-medium whitespace-nowrap">
                Pane
              </span>
              {/* Leader line */}
              <span className="absolute top-1/2 -left-4 w-4 h-px bg-indigo-300" />
            </div>

            {/* Callout ② — Divider */}
            <div
              className="absolute top-8 flex items-center gap-2 z-10 pointer-events-none"
              style={{ left: collapsed ? 0 : leftWidth - 8 }}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-semibold shrink-0">
                2
              </span>
              <span className="text-xs text-indigo-600 font-medium whitespace-nowrap">
                Divider
              </span>
            </div>

            {/* Callout ③ — Collapse button */}
            <div
              className="absolute top-20 flex items-center gap-2 z-10 pointer-events-none"
              style={{ left: collapsed ? 0 : leftWidth + 10 }}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-semibold shrink-0">
                3
              </span>
              <span className="text-xs text-indigo-600 font-medium whitespace-nowrap">
                Sidebar Collapse
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Layered explanations */}
      <section className="max-w-4xl mx-auto px-8 pb-20">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-8">
          How each part works
        </h2>
        <div className="space-y-8">
          {ANATOMY_PARTS.map((part) => (
            <div
              key={part.id}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-500 text-white text-sm font-semibold">
                  {part.id}
                </span>
                <h3 className="text-base font-semibold text-gray-900">
                  {part.label}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    What you see
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {part.whatYouSee}
                  </p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    How it works
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {part.howItWorks}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
