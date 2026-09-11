import AnatomyDemo from "./components/AnatomyDemo";

export const metadata = {
  title: "Traffic Lights (Window Controls) — NameThatUI",
  description: "Learn the macOS traffic lights: close, minimize, and zoom buttons with hover symbols and dirty document state.",
};

const SCENARIOS = [
  {
    name: "Code Editor",
    href: "/scenarios/code-editor",
    description: "VS Code–style window with dirty document indicator",
    icon: "code",
  },
  {
    name: "Design Tool",
    href: "/scenarios/design-tool",
    description: "Figma-style window with fullscreen toggle",
    icon: "design",
  },
  {
    name: "Terminal",
    href: "/scenarios/terminal-window",
    description: "Terminal window showing unsaved session state",
    icon: "terminal",
  },
];

export default function TrafficLightsHub() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans antialiased">
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-6 text-sm text-zinc-600">
            <a href="/" className="font-medium text-zinc-900">NameThatUI</a>
            <span className="text-zinc-300">/</span>
            <span className="font-medium text-zinc-900">Traffic Lights</span>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-zinc-950 mb-4">Traffic Lights (Window Controls)</h1>
          <p className="text-lg text-zinc-600 mb-6 max-w-3xl">
            The three colored controls at the top-left of every macOS window — red to close, yellow to minimize,
            green to zoom or enter full screen. Their symbols appear only on hover.
          </p>
          <p className="text-sm text-zinc-500 mb-8">
            <strong>Also called:</strong> window controls, title bar buttons, close/minimize/zoom buttons,
            the three colored dots, macOS window buttons
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-zinc-950 mb-6">Anatomy — Live Diagram</h2>
          <p className="text-zinc-600 mb-6 max-w-2xl">
            Hover over the traffic lights below to see the symbols appear. Click any button to see its action.
            The close button shows a <strong>dirty-document dot</strong> when the window has unsaved changes.
          </p>

          <AnatomyDemo />

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                number: 1,
                name: "Close Button",
                api: "NSWindow.ButtonType.closeButton",
                whatYouSee: "The red traffic light on the left. Hover the group to reveal an ✕ — click to close this window (not necessarily quit the app). With unsaved changes, a dark center dot sits in the red button until you hover, when the ✕ returns so you can still close.",
                howItWorks: "Props = settings you hand the component (like isDirty). State = values it remembers between renders (like whether the pointer is over the group). Hovering the group re-renders all three buttons with glyphs at once. The onClose callback tells the parent 'close was clicked' — the parent decides what happens next."
              },
              {
                number: 2,
                name: "Minimize Button",
                api: "NSWindow.ButtonType.miniaturizeButton",
                whatYouSee: "The yellow traffic light in the middle. Hover the group to reveal a − (minus) — click to send the window to the Dock. The window stays open but tucked away; click its Dock icon to restore it.",
                howItWorks: "Same pattern: one shared group-hover state re-renders all three glyphs together. The onMinimize callback lets the parent decide — in a real Mac app this calls window.miniaturize(). The yellow fill (#FEBC2E) with a darker hairline edge matches Apple's spec."
              },
              {
                number: 3,
                name: "Zoom / Full-Screen Button",
                api: "NSWindow.ButtonType.zoomButton",
                whatYouSee: "The green traffic light on the right. It is blank until you hover, then shows expanding arrows. Click to enter full-screen mode (a dedicated Space). Hold Option and click to invoke the classic Zoom behavior (resize to fit content) instead.",
                howItWorks: "The button is blank by default and only renders its glyph on group hover. An isFullscreen prop swaps expanding arrows for compressing arrows. Option-click is detected from the click event (event.altKey in React, modifierFlags in AppKit). Full screen itself is NSWindow.toggleFullScreen(_:) on macOS."
              },
            ].map((part) => (
              <div key={part.number} className="bg-white rounded-xl border border-zinc-200 p-6">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                    {part.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-zinc-950 mb-1 flex items-center gap-2">
                      {part.name}
                      <code className="text-xs bg-zinc-100 px-1.5 py-0.5 rounded font-mono text-zinc-600">
                        {part.api}
                      </code>
                    </h3>
                    <div className="grid gap-3 text-sm">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="font-medium text-green-900 mb-1">What you see (end user)</p>
                        <p className="text-green-800 leading-relaxed">{part.whatYouSee}</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="font-medium text-blue-900 mb-1">How it works (builder)</p>
                        <p className="text-blue-800 leading-relaxed">{part.howItWorks}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-zinc-950 mb-6">Quick Reference — Component Structure</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-zinc-200 p-5">
              <h3 className="font-semibold text-zinc-950 mb-2 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                Close Button
              </h3>
              <p className="text-sm text-zinc-600">Red (#FF5F57). Blank until group hover shows ✕. Dark center dot when isDirty and not hovered. Closes window.</p>
            </div>
            <div className="bg-white rounded-xl border border-zinc-200 p-5">
              <h3 className="font-semibold text-zinc-950 mb-2 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                Minimize Button
              </h3>
              <p className="text-sm text-zinc-600">Yellow (#FEBC2E). Blank until group hover shows −. Sends window to Dock. Window stays running.</p>
            </div>
            <div className="bg-white rounded-xl border border-zinc-200 p-5">
              <h3 className="font-semibold text-zinc-950 mb-2 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                Zoom Button
              </h3>
              <p className="text-sm text-zinc-600">Green (#28CA42). Blank until group hover shows expanding arrows (compressing when fullscreen). Option-click = classic Zoom.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-zinc-950 mb-6">Three Real-World Scenarios</h2>
          <p className="text-zinc-600 mb-6 max-w-2xl">
            Each scenario uses the same TrafficLights component but configured differently to show its extensibility.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {SCENARIOS.map((scenario) => (
              <a
                key={scenario.name}
                href={scenario.href}
                className="bg-white rounded-xl border border-zinc-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 group"
              >
                <h3 className="font-semibold text-zinc-950 mb-2 group-hover:text-blue-600 transition-colors">
                  {scenario.name}
                </h3>
                <p className="text-sm text-zinc-600 mb-4">{scenario.description}</p>
                <span className="text-sm font-medium text-blue-600 group-hover:underline">
                  View scenario →
                </span>
              </a>
            ))}
          </div>
        </section>

        <nav className="flex justify-center gap-4 text-sm text-zinc-600 border-t border-zinc-200 pt-8">
          <a href="/" className="hover:text-zinc-900">← Back to Index</a>
        </nav>
      </main>

      <footer className="border-t border-zinc-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-zinc-500">
          Built for <a href="https://namethatui.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
            NameThatUI
          </a> — Learning UI vocabulary by building it.
        </div>
      </footer>
    </div>
  );
}