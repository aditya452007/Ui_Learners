"use client";

import { useState } from "react";
import { Alert } from "@/app/components/Alert";
import Link from "next/link";

export default function CriticalErrorScenario() {
  const [diskUsage, setDiskUsage] = useState(94);
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    type: "disk" | "permission" | "network" | null;
  }>({ isOpen: false, type: null });
  const [toasts, setToasts] = useState<string[]>([]);

  const triggerAlert = (type: "disk" | "permission" | "network") => {
    setAlertState({ isOpen: true, type });
  };

  const handleAcknowledge = () => {
    setAlertState({ isOpen: false, type: null });
    setToasts(prev => [...prev, "Acknowledged"]);
    setTimeout(() => setToasts(prev => prev.slice(1)), 2000);
  };

  const handleRetry = () => {
    setAlertState({ isOpen: false, type: null });
    setToasts(prev => [...prev, "Retrying..."]);
    setTimeout(() => setToasts(prev => prev.slice(1)), 2000);
  };

  const alertButtons = (type: "disk" | "permission" | "network") => {
    if (type === "disk") {
      return [
        { title: "OK", isDefault: true, onClick: handleAcknowledge },
      ];
    }
    if (type === "permission") {
      return [
        { title: "Cancel", isCancel: true, onClick: handleAcknowledge },
        { title: "Open Settings", isDefault: true, onClick: handleRetry },
      ];
    }
    return [
      { title: "OK", isDefault: true, onClick: handleAcknowledge },
    ];
  };

  const alertConfig = {
    disk: {
      message: "Startup disk almost full",
      informative: "Only 500 MB available. Free up space to avoid data loss and performance issues.",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
        </svg>
      ),
    },
    permission: {
      message: "\"Photos\" wants access to your photos",
      informative: "Allow access to import and edit your photos. You can change this in System Settings > Privacy & Security.",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 16c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-14c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
        </svg>
      ),
    },
    network: {
      message: "Unable to connect to server",
      informative: "Check your internet connection and try again. If the problem persists, contact support.",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z" />
        </svg>
      ),
    },
  };

  const currentConfig = alertState.type ? alertConfig[alertState.type] : null;
  const currentButtons = alertState.type ? alertButtons(alertState.type) : [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700 transition"
              >
                ← Back to Alert Hub
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Scenario 3: Critical Error</h1>
                <p className="text-sm text-gray-500">System alerts — critical style with single/mandatory action</p>
              </div>
            </div>
            <nav className="flex gap-3 text-sm">
              <Link href="/scenarios/unsaved-changes" className="text-gray-600 hover:text-gray-700">
                ← Previous: Unsaved Changes
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Why it fits */}
        <section className="mb-8 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Why it fits here</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Critical errors demand <strong>immediate attention with no escape hatch</strong>. The
            <strong>critical style</strong> (red badge) signals urgency — this isn't a choice, it's a
            condition the user must acknowledge. For <strong>disk full</strong>, there's only "OK" — the
            user must go free space. For <strong>permissions</strong>, there's "Open Settings" (default,
            constructive) and "Cancel" (Escape). For <strong>network failure</strong>, only "OK" — the
            app can't proceed. No suppression checkbox here; these aren't repetitive workflows.
            The single-button variant forces acknowledgment; the two-button variant offers a path forward.
          </p>
        </section>

        {/* Dashboard */}
        <section className="mb-8 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">System Status</h2>

          {/* Disk usage card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Startup Disk</h3>
              <span className="text-sm font-mono text-red-600">{diskUsage}% used</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${diskUsage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>450 GB of 500 GB used</span>
              <button
                onClick={() => triggerAlert("disk")}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Simulate Critical Alert
              </button>
            </div>
          </div>

          {/* Permission card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Photos App</h3>
                <p className="text-sm text-gray-500">Requesting photo library access</p>
              </div>
              <button
                onClick={() => triggerAlert("permission")}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Simulate Permission Alert
              </button>
            </div>
          </div>

          {/* Network card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Cloud Sync</h3>
                <p className="text-sm text-gray-500">Last synced 2 hours ago</p>
              </div>
              <button
                onClick={() => triggerAlert("network")}
                className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Simulate Network Error
              </button>
            </div>
          </div>
        </section>

        {/* Toast notifications */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          {toasts.map((toast, i) => (
            <div
              key={i}
              className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right fade-in"
            >
              {toast}
            </div>
          ))}
        </div>

        {/* Live Alert */}
        {currentConfig && (
          <Alert
            isOpen={alertState.isOpen}
            onClose={handleAcknowledge}
            style="critical"
            messageText={currentConfig.message}
            informativeText={currentConfig.informative}
            buttons={currentButtons}
            icon={currentConfig.icon}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <p className="text-sm text-gray-500 text-center">
            <Link href="/scenarios/unsaved-changes" className="text-blue-600 hover:underline">
              ← Previous: Unsaved Changes
            </Link>
            {" | "}
            <Link href="/" className="text-blue-600 hover:underline">
              Back to Alert Hub
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}