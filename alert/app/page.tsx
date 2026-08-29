"use client";

import { useState } from "react";
import { Alert } from "@/app/components/Alert";
import Link from "next/link";

export default function AlertHub() {
  const [demoAlert, setDemoAlert] = useState<{
    isOpen: boolean;
    style: "warning" | "informational" | "critical";
  }>({ isOpen: false, style: "warning" });

  const openDemo = (style: "warning" | "informational" | "critical") => {
    setDemoAlert({ isOpen: true, style });
  };

  const handleDemoClose = () => {
    setDemoAlert({ ...demoAlert, isOpen: false });
  };

  const handleDemoAction = (action: string) => {
    console.log(`Demo action: ${action}`);
    handleDemoClose();
  };

  const demoButtons = [
    { title: "Cancel", isCancel: true, onClick: () => handleDemoAction("cancel") },
    { title: "OK", isDefault: true, onClick: () => handleDemoAction("ok") },
  ];

  const anatomyParts = [
    {
      number: 1,
      name: "Badged app icon",
      api: "NSAlert.icon / alertStyle .warning",
      description: "Your app's icon with a yellow caution triangle badge. The badge appears when alertStyle is .warning or .critical. In SwiftUI, this is handled automatically by the system.",
      userView: "The yellow triangle over the app icon tells you instantly: \"This needs your attention.\" It's the visual shorthand for \"caution\" — you know before reading a word that something important is happening.",
      builderView: "The icon property (NSAlert.icon) holds your app's icon. When alertStyle is .warning or .critical, AppKit automatically composites a yellow caution triangle over it. In SwiftUI .alert, the system picks the icon based on the alert's role. No extra code needed — just set the style.",
    },
    {
      number: 2,
      name: "Message text",
      api: "NSAlert.messageText",
      description: "The bold headline — a one-sentence summary phrased as a question when asking for a decision. Keep it under 50 characters for clarity.",
      userView: "The bold line you read first. It answers \"What's happening?\" in a single glance. When it's a question like \"Delete this file?\" you know exactly what decision is yours to make.",
      builderView: "messageText is a string property. It renders as the primary label in the alert. In SwiftUI, it's the first string parameter in .alert(\"Message\", ...). Screen readers announce this first — make it descriptive. State: just a prop passed in, no internal state needed.",
    },
    {
      number: 3,
      name: "Informative text",
      api: "NSAlert.informativeText",
      description: "The smaller gray explanation text — spells out consequences or details in a full sentence. Optional but recommended for clarity.",
      userView: "The quieter text underneath. It tells you what actually happens if you click — \"This will permanently remove the file from your library.\" No surprises, no guesswork.",
      builderView: "informativeText is a second string property. Renders below messageText in a smaller, lighter font. In SwiftUI, it's the message: parameter. Also a prop — no state. Pro tip: use complete sentences. \"File will be deleted\" beats \"Deletes file.\"",
    },
    {
      number: 4,
      name: "Suppression checkbox",
      api: "NSAlert.showsSuppressionButton / suppressionButton.state",
      description: "The \"Don't ask me again\" checkbox. Enable with showsSuppressionButton = true. After the alert closes, read suppressionButton.state to know if the user checked it.",
      userView: "A small checkbox that lets you say \"I got it, stop asking.\" Check it once, and the app remembers — no more interruptions for the same action. Respects your time.",
      builderView: "showsSuppressionButton is a boolean prop (default false). When true, a checkbox renders. After runModal() returns, read suppressionButton.state (NSOnState/NSOffState). In SwiftUI, you'd manage this with @AppStorage or UserDefaults yourself. State lives in your app, not the alert.",
    },
    {
      number: 5,
      name: "Default button",
      api: "NSAlert.addButton(withTitle:)",
      description: "The first button added becomes the blue default button — it responds to the Return/Enter key. Add a button titled \"Cancel\" and it automatically gets Escape key handling.",
      userView: "The blue button that pulses with importance. Press Enter and it clicks itself — the fast path. \"Cancel\" is always Escape. Muscle memory just works.",
      builderView: "Buttons are added in order via addButton(withTitle:). First one = default (blue, Return key). A button titled \"Cancel\" (case-insensitive) gets Escape key automatically. In SwiftUI, .alert actions array order defines this. The default button is just the first non-cancel action. Event handling: onClick fires, then alert closes.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Alert</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Also called: alert dialog, warning dialog, confirmation dialog, message box, system prompt
              </p>
            </div>
            <nav className="flex gap-4 text-sm">
              <Link href="/scenarios/delete-confirmation" className="text-blue-600 hover:text-blue-700 font-medium">
                Scenario 1: Delete Confirmation
              </Link>
              <Link href="/scenarios/unsaved-changes" className="text-gray-600 hover:text-gray-700">
                Scenario 2: Unsaved Changes
              </Link>
              <Link href="/scenarios/critical-error" className="text-gray-600 hover:text-gray-700">
                Scenario 3: Critical Error
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Intro strip */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-2">1. Trigger</h3>
            <p className="text-sm text-gray-600">User attempts a destructive or important action</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-2">2. Alert Appears</h3>
            <p className="text-sm text-gray-600">Modal dialog with icon, message, details, buttons</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-2">3. User Decides</h3>
            <p className="text-sm text-gray-600">Clicks a button → app acts, alert dismisses</p>
          </div>
        </section>

        {/* Live Anatomy Diagram */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Anatomy Diagram</h2>
          <p className="text-gray-600 mb-6 max-w-3xl">
            Click a style button to see the alert live. The numbered callouts match the explanations below.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => openDemo("warning")}
              className="px-4 py-2 rounded-lg bg-amber-100 text-amber-800 text-sm font-medium hover:bg-amber-200 transition"
            >
              Warning Style
            </button>
            <button
              onClick={() => openDemo("informational")}
              className="px-4 py-2 rounded-lg bg-blue-100 text-blue-800 text-sm font-medium hover:bg-blue-200 transition"
            >
              Informational Style
            </button>
            <button
              onClick={() => openDemo("critical")}
              className="px-4 py-2 rounded-lg bg-red-100 text-red-800 text-sm font-medium hover:bg-red-200 transition"
            >
              Critical Style
            </button>
          </div>

          <div className="relative">
            <Alert
              isOpen={demoAlert.isOpen}
              onClose={handleDemoClose}
              style={demoAlert.style}
              messageText={demoAlert.style === "warning" ? "Delete \"Project Alpha\"?" : demoAlert.style === "critical" ? "Disk almost full" : "Changes saved"}
              informativeText={
                demoAlert.style === "warning"
                  ? "This will permanently remove the file from your library. You can't undo this action."
                  : demoAlert.style === "critical"
                  ? "Only 500 MB remaining. Free up space to avoid data loss."
                  : "Your document has been saved to iCloud."
              }
              buttons={demoButtons}
              showsSuppressionButton={demoAlert.style === "warning"}
              onSuppressionChange={(checked) => console.log("Suppression:", checked)}
            />
          </div>

          {/* Callout legend */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {anatomyParts.map((part) => (
              <div key={part.number} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                    {part.number}
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{part.name}</h4>
                    <code className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{part.api}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Layered Explanations */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Layered Explanations</h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Each part explained for two audiences. <strong>What you see</strong> = what a product user experiences.
            <strong>How it works</strong> = how a React beginner builds it (props, state, events — all defined inline).
          </p>

          <div className="space-y-8">
            {anatomyParts.map((part) => (
              <article key={part.number} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">
                    {part.number}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{part.name}</h3>
                    <code className="text-xs text-gray-500">{part.api}</code>
                  </div>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">What you see</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{part.userView}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">How it works</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{part.builderView}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Scenario navigation */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Three Real-World Scenarios</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/scenarios/delete-confirmation"
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">Delete Confirmation</h3>
              </div>
              <p className="text-sm text-gray-600">Warning style with suppression checkbox. File manager deleting a project — user confirms or cancels.</p>
            </Link>
            <Link
              href="/scenarios/unsaved-changes"
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">Unsaved Changes</h3>
              </div>
              <p className="text-sm text-gray-600">Informational style with three buttons. Text editor closing with draft — save, discard, or cancel.</p>
            </Link>
            <Link
              href="/scenarios/critical-error"
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">Critical Error</h3>
              </div>
              <p className="text-sm text-gray-600">Critical style with single action. Disk full warning — user must acknowledge, no cancellation.</p>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-sm text-gray-500 text-center">
            Built for <a href="https://namethatui.com" className="text-blue-600 hover:underline">NameThatUI</a> learning lab —
            <a href="https://namethatui.com/macos/alert" className="text-blue-600 hover:underline" target="_blank">View original component</a>
          </p>
        </div>
      </footer>
    </div>
  );
}