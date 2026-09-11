"use client";

import { useState } from "react";
import WindowFrame from "../../components/WindowFrame";

const FILE_TABS = [
  { name: "App.tsx", active: true, dirty: true },
  { name: "components/Button.tsx", active: false, dirty: false },
  { name: "hooks/useTheme.ts", active: false, dirty: true },
  { name: "styles/globals.css", active: false, dirty: false },
];

const CODE_CONTENT = `import { useState } from "react";
import { Button } from "./components/Button";
import { useTheme } from "./hooks/useTheme";

export function App() {
  const [count, setCount] = useState(0);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={\`min-h-screen \${theme}\`}>
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">My App</h1>
      </header>
      <main className="p-8">
        <Button onClick={() => setCount(c => c + 1)}>
          Count: {count}
        </Button>
        <Button variant="ghost" onClick={toggleTheme}>
          Toggle Theme
        </Button>
      </main>
    </div>
  );
}`;

export default function CodeEditorScenario() {
  const [activeTab, setActiveTab] = useState(0);
  const [isDirty, setIsDirty] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentFile = FILE_TABS[activeTab];

  const handleClose = () => {
    if (isDirty) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Close anyway?"
      );
      if (!confirmClose) return;
    }
    alert("Window closed — in a real app this would close the window or tab");
  };

  const handleMinimize = () => {
    alert("Window minimized to Dock — in a real app this calls window.miniaturize()");
  };

  const handleZoom = () => {
    setIsFullscreen(!isFullscreen);
    alert(
      isFullscreen
        ? "Exited full screen"
        : "Entered full screen — in a real app this calls window.toggleFullScreen()"
    );
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        <div className="mb-6 text-center">
          <a
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-700 underline"
          >
            ← Back to Traffic Lights Hub
          </a>
        </div>

        <WindowFrame
          title={currentFile.name}
          trafficLightsProps={{
            isDirty: currentFile.dirty,
            isFullscreen,
            onClose: handleClose,
            onMinimize: handleMinimize,
            onZoom: handleZoom,
          }}
        >
          <div className="bg-zinc-900 rounded-none min-h-[400px]">
            <div className="flex border-b border-zinc-700 px-3 bg-zinc-800">
              {FILE_TABS.map((tab, index) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(index)}
                  className={`px-3 py-2 text-xs font-mono flex items-center gap-1.5 transition-colors ${
                    index === activeTab
                      ? "text-white bg-zinc-900 border-b-2 border-blue-500"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {tab.name}
                  {tab.dirty && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-amber-400"
                      title="Unsaved changes"
                    />
                  )}
                </button>
              ))}
            </div>

            <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
              <code className="text-zinc-100">{CODE_CONTENT}</code>
            </pre>
          </div>
        </WindowFrame>

        <div className="mt-8 bg-white rounded-xl border border-zinc-200 p-6">
          <h3 className="font-semibold text-zinc-950 mb-4">Why This Fits: Code Editor</h3>
          <div className="space-y-3 text-sm text-zinc-700">
            <p>
              <strong>Dirty document dot</strong> — The close button shows a dark center dot when the
              active file has unsaved changes (the amber dot on the tab matches the traffic light dot).
              This prevents accidental data loss: users see the state at a glance before closing.
            </p>
            <p>
              <strong>Standard window behavior</strong> — Developers expect native macOS window controls.
              Close closes the tab/window, Minimize sends to Dock, Zoom enters full-screen for
              distraction-free coding. The traffic lights provide this without custom implementation.
            </p>
            <p>
              <strong>Tabbed interface</strong> — Each tab tracks its own dirty state. Switching tabs
              updates the close button instantly (React state → re-render → new dot visibility).
            </p>
          </div>
        </div>

        <nav className="mt-6 flex justify-center gap-4 text-sm text-zinc-600">
          <a href="/scenarios/design-tool" className="text-blue-600 hover:underline">
            Next: Design Tool →
          </a>
        </nav>
      </div>
    </div>
  );
}