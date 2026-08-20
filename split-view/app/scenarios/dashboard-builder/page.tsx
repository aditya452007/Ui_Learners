"use client";

import { useState, useRef, useCallback } from "react";

type WidgetSettings = {
  title: string;
  color: string;
  size: "small" | "medium" | "large";
  showHeader: boolean;
  showBorders: boolean;
  roundedCorners: boolean;
};

const COLOR_OPTIONS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Slate", value: "#64748b" },
];

const DEFAULTS: WidgetSettings = {
  title: "Revenue Overview",
  color: "#3b82f6",
  size: "medium",
  showHeader: true,
  showBorders: true,
  roundedCorners: true,
};

const METRIC_DATA = [
  { label: "Total Revenue", value: "$48,290", change: "+12.5%" },
  { label: "Subscriptions", value: "2,481", change: "+8.3%" },
  { label: "Churn Rate", value: "2.1%", change: "-0.4%" },
];

const BAR_DATA = [65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 50, 88];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
        checked ? "bg-blue-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function RadioPill({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
        checked
          ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

function SettingsPanel({
  settings,
  onTitleChange,
  onColorChange,
  onSizeChange,
  onToggle,
  onReset,
}: {
  settings: WidgetSettings;
  onTitleChange: (v: string) => void;
  onColorChange: (v: string) => void;
  onSizeChange: (s: WidgetSettings["size"]) => void;
  onToggle: (key: keyof Pick<WidgetSettings, "showHeader" | "showBorders" | "roundedCorners">) => void;
  onReset: () => void;
}) {
  return (
    <div className="p-5 space-y-6 overflow-y-auto h-full">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Widget Title
        </label>
        <input
          type="text"
          value={settings.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
          placeholder="Enter widget title..."
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Accent Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.value}
              onClick={() => onColorChange(c.value)}
              title={c.name}
              className={`w-7 h-7 rounded-full transition-all duration-150 ${
                settings.color === c.value
                  ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                  : "hover:scale-110"
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Size
        </label>
        <div className="flex gap-2">
          {(["small", "medium", "large"] as const).map((s) => (
            <RadioPill
              key={s}
              label={s.charAt(0).toUpperCase() + s.slice(1)}
              checked={settings.size === s}
              onChange={() => onSizeChange(s)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Show header</span>
          <Toggle
            checked={settings.showHeader}
            onChange={() => onToggle("showHeader")}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Show borders</span>
          <Toggle
            checked={settings.showBorders}
            onChange={() => onToggle("showBorders")}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Rounded corners</span>
          <Toggle
            checked={settings.roundedCorners}
            onChange={() => onToggle("roundedCorners")}
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onReset}
          className="w-full py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}

function WidgetPreview({ settings }: { settings: WidgetSettings }) {
  const sizeMap = { small: "max-w-sm", medium: "max-w-md", large: "max-w-lg" };
  const barHeightMap = { small: "h-16", medium: "h-24", large: "h-32" };

  return (
    <div
      className={`w-full ${sizeMap[settings.size]} mx-auto bg-white transition-all duration-200 ${
        settings.showBorders ? "border border-gray-200" : ""
      } ${settings.roundedCorners ? "rounded-xl shadow-sm" : ""}`}
    >
      {settings.showHeader && (
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">{settings.title}</h3>
        </div>
      )}

      <div className="p-5 space-y-5">
        <div className="flex gap-4">
          {METRIC_DATA.map((m) => (
            <div key={m.label} className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 truncate">{m.label}</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{m.value}</p>
              <p
                className="text-xs font-medium mt-0.5"
                style={{ color: m.change.startsWith("+") ? settings.color : "#ef4444" }}
              >
                {m.change}
              </p>
            </div>
          ))}
        </div>

        <div className={`${barHeightMap[settings.size]} flex items-end gap-1.5`}>
          {BAR_DATA.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end h-full">
              <div
                className="w-full rounded-t-sm transition-colors duration-200"
                style={{
                  height: `${h}%`,
                  backgroundColor: i === BAR_DATA.length - 1 ? settings.color : `${settings.color}40`,
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 px-0.5">
          <span>Jan</span>
          <span>Mar</span>
          <span>Jun</span>
          <span>Sep</span>
          <span>Dec</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardBuilderScenario() {
  const [settings, setSettings] = useState<WidgetSettings>(DEFAULTS);
  const [paneWidth, setPaneWidth] = useState(340);
  const [collapsed, setCollapsed] = useState(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      dragging.current = true;
      startX.current = e.clientX;
      startWidth.current = paneWidth;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [paneWidth]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const delta = e.clientX - startX.current;
    const newWidth = Math.max(260, Math.min(500, startWidth.current + delta));
    setPaneWidth(newWidth);
  }, []);

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const updateSetting = <K extends keyof WidgetSettings>(
    key: K,
    value: WidgetSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="h-screen flex flex-col bg-gray-50 font-[family-name:var(--font-geist-sans)]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <header className="h-11 border-b border-gray-200 flex items-center px-4 gap-3 shrink-0 bg-white">
        <span className="font-mono text-xs text-gray-500 tracking-wide">SPLIT VIEW</span>
        <span className="text-gray-300">·</span>
        <h1 className="text-sm font-medium text-gray-800">Dashboard Builder</h1>
        <div className="ml-auto text-xs text-gray-400">Configure &rarr; Preview</div>
      </header>

      <div className="flex-1 flex min-h-0 relative">
        <div
          className={`shrink-0 border-r border-gray-200 flex flex-col bg-white transition-all duration-200 ${
            collapsed ? "w-11" : ""
          }`}
          style={collapsed ? {} : { width: paneWidth }}
        >
          {!collapsed && (
            <div className="h-9 flex items-center px-3 border-b border-gray-100 shrink-0">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Settings
              </span>
              <button
                onClick={() => setCollapsed(true)}
                className="ml-auto p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                title="Collapse panel"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M10 4L6 8L10 12" />
                </svg>
              </button>
            </div>
          )}
          {!collapsed && (
            <SettingsPanel
              settings={settings}
              onTitleChange={(v) => updateSetting("title", v)}
              onColorChange={(v) => updateSetting("color", v)}
              onSizeChange={(s) => updateSetting("size", s)}
              onToggle={(k) => updateSetting(k, !settings[k])}
              onReset={() => setSettings(DEFAULTS)}
            />
          )}
        </div>

        {!collapsed && (
          <div
            className="w-1 bg-transparent hover:bg-blue-400 active:bg-blue-500 cursor-col-resize shrink-0 transition-colors"
            onMouseDown={handleMouseDown}
          />
        )}

        <div className="flex-1 flex items-center justify-center p-8 overflow-auto min-w-0">
          <WidgetPreview settings={settings} />
        </div>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute top-3 left-1 w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors z-10"
            title="Open settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        )}
      </div>

      <footer className="h-8 border-t border-gray-200 flex items-center px-4 bg-white shrink-0">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <a href="/scenarios/email-client" className="hover:text-blue-600 transition-colors">
            ← Email Client
          </a>
          <span>·</span>
          <a href="/" className="hover:text-blue-600 transition-colors">
            Back to Hub
          </a>
        </div>
      </footer>
    </div>
  );
}
