"use client";

import { useState } from "react";
import WindowFrame from "../../components/WindowFrame";

const TOOLS = [
  { id: "move", label: "Move", shortcut: "V", icon: "M" },
  { id: "frame", label: "Frame", shortcut: "F", icon: "□" },
  { id: "shape", label: "Shape", shortcut: "R", icon: "○" },
  { id: "pen", label: "Pen", shortcut: "P", icon: "✎" },
  { id: "text", label: "Text", shortcut: "T", icon: "T" },
  { id: "comment", label: "Comment", shortcut: "C", icon: "◉" },
];

const LAYERS = [
  { name: "Home Page", expanded: true, children: [
    { name: "Navigation", type: "frame" },
    { name: "Hero Section", type: "frame" },
    { name: "  Headline", type: "text" },
    { name: "  Subheadline", type: "text" },
    { name: "  CTA Button", type: "component" },
    { name: "Features Grid", type: "frame" },
  ]},
  { name: "Components", expanded: false, children: [
    { name: "Button/Primary", type: "component" },
    { name: "Button/Secondary", type: "component" },
    { name: "Input/Default", type: "component" },
  ]},
];

export default function DesignToolScenario() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTool, setSelectedTool] = useState("move");

  const handleClose = () => {
    alert("Close clicked — in a real app this would prompt to save and close the file");
  };

  const handleMinimize = () => {
    alert("Minimize clicked — window sent to Dock");
  };

  const handleZoom = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[85vh] flex flex-col">
        <div className="mb-4 text-center">
          <a
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-700 underline"
          >
            ← Back to Traffic Lights Hub
          </a>
        </div>

        <WindowFrame
          title="Untitled — Figma"
          trafficLightsProps={{
            isDirty: false,
            isFullscreen,
            onClose: handleClose,
            onMinimize: handleMinimize,
            onZoom: handleZoom,
          }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 flex overflow-hidden bg-zinc-100">
            <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-zinc-200 flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Layers</span>
                <button className="text-zinc-400 hover:text-zinc-600 text-xs">☰</button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {LAYERS.map((layer, i) => (
                  <div key={i} className="text-sm">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-100">
                      <span className="w-4 h-4 flex items-center justify-center text-zinc-400">
                        ▭
                      </span>
                      <span className="flex-1 truncate font-medium">{layer.name}</span>
                      <span className="text-zinc-300">👁</span>
                    </div>
                    {layer.expanded && layer.children.map((child, ci) => (
                      <div key={ci} className="pl-6">
                        <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-zinc-100">
                          <span className="w-4 h-4 flex items-center justify-center text-zinc-400">
                            {child.type === "frame" ? "▭" : child.type === "component" ? "◆" : "●"}
                          </span>
                          <span className="flex-1 truncate text-zinc-700">{child.name}</span>
                          <span className="text-zinc-300">👁</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </aside>

            <div className="flex-1 flex flex-col relative overflow-hidden">
              <div className="absolute top-4 left-4 z-10 flex gap-1 bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-zinc-200 shadow-lg">
                {TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-all ${
                      selectedTool === tool.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-zinc-600 hover:bg-zinc-100"
                    }`}
                    title={`${tool.label} (${tool.shortcut})`}
                  >
                    {tool.icon}
                  </button>
                ))}
              </div>

              <div className="flex-1 flex items-center justify-center relative">
                <div className="w-[800px] h-[500px] bg-white rounded-lg shadow-xl border border-zinc-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[size:20px_20px] bg-[pos:0_0,0_10px,10px_-10px,-10px_0px]" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[350px] bg-white rounded-lg shadow-2xl border border-zinc-300 relative">
                      <div className="absolute top-3 left-3 right-3 flex gap-2">
                        <div className="w-8 h-8 bg-zinc-200 rounded" />
                        <div className="w-8 h-8 bg-zinc-200 rounded" />
                        <div className="flex-1 h-8 bg-zinc-200 rounded" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 h-24 bg-blue-500/10 rounded-lg border border-blue-500/30 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">Frame: "Home Page" (1440×900)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="w-64 bg-white border-l border-zinc-200 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-zinc-200 flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Properties</span>
                <button className="text-zinc-400 hover:text-zinc-600 text-xs">☰</button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Fill</label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded border border-zinc-300 bg-white relative">
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:8px_8px] rounded" />
                      <div className="absolute inset-0 bg-blue-500 rounded" />
                    </div>
                    <input type="color" value="#3B82F6" readOnly className="w-10 h-10 rounded border border-zinc-300 cursor-pointer" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Stroke</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value="#000000" readOnly className="w-10 h-10 rounded border border-zinc-300 cursor-pointer" />
                    <input type="number" value={1} readOnly className="w-16 px-2 py-1 text-sm border border-zinc-300 rounded" />
                    <select className="flex-1 px-2 py-1 text-sm border border-zinc-300 rounded">
                      <option>Solid</option>
                      <option>Dashed</option>
                      <option>Dotted</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Corner Radius</label>
                  <input type="range" min={0} max={50} value={8} readOnly className="w-full" />
                  <div className="flex justify-between text-xs text-zinc-500 mt-1">
                    <span>0</span>
                    <span>8px</span>
                    <span>50</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-200">
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Effects</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                      Drop Shadow
                    </label>
                    <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                      Inner Shadow
                    </label>
                    <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                      Layer Blur
                    </label>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </WindowFrame>

        <div className="mt-6 bg-white rounded-xl border border-zinc-200 p-6">
          <h3 className="font-semibold text-zinc-950 mb-4">Why This Fits: Design Tool</h3>
          <div className="space-y-3 text-sm text-zinc-700">
            <p>
              <strong>Full-screen focus</strong> — Design tools benefit immensely from full-screen mode
              (the green button's primary action). The traffic light's native full-screen glyph signals
              this capability. Users enter a distraction-free canvas; exiting restores panels instantly.
            </p>
            <p>
              <strong>Clean title bar</strong> — No dirty-document dot by default (design files auto-save).
              The traffic lights stay minimal, matching Figma's clean chrome. The window title shows
              the file name with "— Figma" suffix, standard for document-based apps.
            </p>
            <p>
              <strong>Option-click for Zoom</strong> — Hold Option and click the green button to get
              classic "Zoom to fit content" instead of full-screen. Power users rely on this for quick
              canvas framing without leaving the Space.
            </p>
          </div>
        </div>

        <nav className="mt-6 flex justify-center gap-4 text-sm text-zinc-600">
          <a href="/scenarios/code-editor" className="text-zinc-500 hover:underline">
            ← Previous: Code Editor
          </a>
          <a href="/scenarios/terminal-window" className="text-blue-600 hover:underline">
            Next: Terminal →
          </a>
        </nav>
      </div>
    </div>
  );
}