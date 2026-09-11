"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import WindowFrame from "./WindowFrame";

export default function AnatomyDemo() {
  const [isDirty, setIsDirty] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [log, setLog] = useState<string[]>([
    "Hover the three dots — symbols appear on all of them at once.",
  ]);

  const push = (line: string) =>
    setLog((prev) => [line, ...prev].slice(0, 5));

  const handleClose = () => {
    if (isDirty) {
      push("Close clicked with unsaved changes — a real app would confirm first.");
    } else {
      push("Close clicked — window would close (app keeps running).");
    }
  };

  const handleMinimize = () => {
    push("Minimize clicked — window would shrink into the Dock.");
  };

  const handleZoom = (e?: MouseEvent) => {
    if (e?.altKey) {
      push("Option-click on green — classic Zoom (fit to content), not full screen.");
      return;
    }
    setIsFullscreen((v) => {
      push(v ? "Green clicked — exited full screen." : "Green clicked — entered full screen.");
      return !v;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-8 mb-8">
      <WindowFrame
        title="Document.swift — NameThatUI"
        trafficLightsProps={{
          isDirty,
          isFullscreen,
          onClose: handleClose,
          onMinimize: handleMinimize,
          onZoom: handleZoom,
        }}
      >
        <div className="p-6 bg-zinc-50">
          <pre className="font-mono text-sm text-zinc-600 leading-relaxed">
{`// Traffic Lights Demo

func saveDocument() {
    document.write(to: url)
    isDirty = ${isDirty}}
`}
          </pre>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsDirty((v) => !v);
                push(isDirty ? "Saved — dirty dot cleared." : "Edited — dirty dot appeared in red.");
              }}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                isDirty
                  ? "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
                  : "bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {isDirty ? "● Unsaved changes: on" : "○ Unsaved changes: off"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsFullscreen((v) => !v);
                push(isFullscreen ? "Exited full screen (toggle)." : "Entered full screen (toggle).");
              }}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              {isFullscreen ? "Exit full screen" : "Enter full screen"}
            </button>
            <span className="text-xs text-zinc-500">
              Tip: hold <kbd className="px-1 py-0.5 bg-zinc-100 border border-zinc-300 rounded font-mono">Alt / Option</kbd> and click green for Zoom.
            </span>
          </div>
        </div>
      </WindowFrame>

      <div className="mt-4 rounded-lg bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-200 min-h-[96px]" aria-live="polite">
        {log.map((line, i) => (
          <p key={`${i}-${line}`} className={i === 0 ? "text-white" : "text-zinc-400"}>
            <span className="text-green-400">$ </span>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
