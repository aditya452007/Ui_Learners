"use client";

import { useState, useRef, useEffect } from "react";
import WindowFrame from "../../components/WindowFrame";

const PROFILES = [
  { name: "Default", shell: "zsh", color: "#FF5F57" },
  { name: "Development", shell: "fish", color: "#28CA42" },
  { name: "Production", shell: "bash", color: "#FEBC2E" },
  { name: "SSH • aws-prod", shell: "bash", color: "#FF9500" },
];

const COMMANDS = [
  { prompt: "~/projects/namethatui", command: "git status", output: "On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges not staged for commit:\n  (use \"git add <file>...\" to update what will be committed)\n  (use \"git restore <file>...\" to discard changes in working directory)\n\n\tmodified:   app/page.tsx\n\tmodified:   app/components/TrafficLights.tsx\n\nno changes added to commit (use \"git add\" and/or \"git commit -a\")" },
  { prompt: "~/projects/namethatui", command: "npm run dev", output: "▲ Next.js 15.2.3\n- Local:        http://localhost:3000\n- Network:      http://192.168.1.47:3000\n\n✓ Starting...\n✓ Ready in 1.2s" },
];

export default function TerminalScenario() {
  const [isDirty, setIsDirty] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeProfile, setActiveProfile] = useState(0);
  const [showProfilePicker, setShowProfilePicker] = useState(false);
  const [commandHistory, setCommandHistory] = useState(COMMANDS);
  const [currentInput, setCurrentInput] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    if (isDirty) {
      const confirmClose = window.confirm(
        "This terminal has an active session. Close anyway?"
      );
      if (!confirmClose) return;
    }
    alert("Terminal window closed — session would be terminated");
  };

  const handleMinimize = () => {
    alert("Terminal minimized to Dock — session keeps running in background");
  };

  const handleZoom = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentInput.trim()) {
      const newCommand = {
        prompt: "~/projects/namethatui",
        command: currentInput,
        output: `$ ${currentInput}\nCommand executed successfully.`,
      };
      setCommandHistory((prev) => [...prev, newCommand]);
      setCurrentInput("");
      setIsDirty(true);
    }
  };

  useEffect(() => {
    terminalRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commandHistory]);

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="mb-4 text-center">
          <a
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-700 underline"
          >
            ← Back to Traffic Lights Hub
          </a>
        </div>

        <WindowFrame
          title={`${PROFILES[activeProfile].name} — ${PROFILES[activeProfile].shell} — 80×24`}
          trafficLightsProps={{
            isDirty,
            isFullscreen,
            onClose: handleClose,
            onMinimize: handleMinimize,
            onZoom: handleZoom,
          }}
          className="flex-1 flex flex-col overflow-hidden"
          titleBarContent={
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative flex items-center gap-2 ml-2">
                <button
                  onClick={() => setShowProfilePicker(!showProfilePicker)}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono text-zinc-700 bg-zinc-100 rounded hover:bg-zinc-200 transition-colors"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PROFILES[activeProfile].color }}
                  />
                  {PROFILES[activeProfile].name}
                </button>
                {showProfilePicker && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-10 min-w-[180px]">
                    {PROFILES.map((profile, i) => (
                      <button
                        key={profile.name}
                        onClick={() => {
                          setActiveProfile(i);
                          setShowProfilePicker(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 ${
                          i === activeProfile ? "bg-blue-50 text-blue-700" : ""
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: profile.color }}
                        />
                        <span className="font-mono">{profile.name}</span>
                        <span className="text-zinc-400 ml-auto text-xs">{profile.shell}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          }
        >
          <div className="flex-1 bg-zinc-950 flex flex-col overflow-hidden font-mono text-sm text-zinc-100">
            <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={terminalRef}>
              {commandHistory.map((cmd, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-baseline gap-2 text-green-400">
                    <span className="text-zinc-400">{cmd.prompt}</span>
                    <span className="text-white">$</span>
                    <span className="text-zinc-300">{cmd.command}</span>
                  </div>
                  <pre className="text-zinc-300 whitespace-pre-wrap text-[12px] leading-relaxed">
                    {cmd.output}
                  </pre>
                </div>
              ))}
              <div className="flex items-baseline gap-2">
                <span className="text-green-400">~/projects/namethatui</span>
                <span className="text-white">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-zinc-100 caret-white"
                  placeholder="Type a command..."
                  autoFocus
                />
                <span className="w-4 h-5 bg-white animate-pulse" />
              </div>
            </div>

            <div className="px-4 py-2 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span>🔋 {PROFILES[activeProfile].shell} • {PROFILES[activeProfile].name}</span>
              <span>80×24 • UTF-8 • ✓</span>
            </div>
          </div>
        </WindowFrame>

        <div className="mt-6 bg-white rounded-xl border border-zinc-200 p-6">
          <h3 className="font-semibold text-zinc-950 mb-4">Why This Fits: Terminal</h3>
          <div className="space-y-3 text-sm text-zinc-700">
            <p>
              <strong>Active session indicator</strong> — The dirty-document dot on the close button
              warns users: "There's a running process here." Closing would kill the shell, SSH
              connection, or build. The dot + confirm dialog prevents accidental termination.
            </p>
            <p>
              <strong>Profile switching in title bar</strong> — Terminals often run multiple profiles
              (local dev, SSH, production). The custom title bar content shows the active profile
              with its colored dot (matching the traffic light colors!) and a dropdown to switch.
            </p>
            <p>
              <strong>Minimize keeps it alive</strong> — Unlike a code editor where minimizing is
              just "hide me," a minimized terminal keeps processes running. The yellow button's
              meaning shifts from "put away" to "keep running in background" — critical for builds,
              deploys, and long-running tasks.
            </p>
          </div>
        </div>

        <nav className="mt-6 flex justify-center gap-4 text-sm text-zinc-600">
          <a href="/scenarios/design-tool" className="text-blue-600 hover:underline">
            ← Previous: Design Tool
          </a>
          <a href="/" className="text-zinc-500 hover:underline">
            Back to Hub
          </a>
        </nav>
      </div>
    </div>
  );
}